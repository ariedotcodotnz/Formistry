import type {
  FieldSchema,
  FieldValidationResult,
  FormistryConfig,
  FormValues,
  ValidationIssue,
  ValidationMode,
  ValidationResult,
  ValidatorSpec,
} from '../types/contracts'
import { createEventBus } from '../alerts'
import { createAsyncController } from '../async'
import { createTranslator } from '../i18n'
import { applyMask, unmaskValue } from '../masks'
import { normalizeValidatorResult } from '../validators'

interface ValidateFieldOptions {
  mode?: ValidationMode
  values?: FormValues
}

interface ValidationEngine {
  validateField: (field: string, value: unknown, options?: ValidateFieldOptions) => Promise<FieldValidationResult>
  validateForm: (values: FormValues, mode?: ValidationMode) => Promise<ValidationResult>
  registerMask: (field: string, mask: string | FieldSchema['mask']) => void
  on: ReturnType<typeof createEventBus>['on']
}

function issueDefaults(field: string, spec: ValidatorSpec, fallbackMessage: string): {
  path: string
  code: string
  severity: ValidationIssue['severity']
  source: string
  message: string
} {
  return {
    path: field,
    code: spec.code ?? 'validation.invalid',
    severity: spec.severity ?? 'error',
    source: spec.name ?? 'anonymous-validator',
    message: spec.message ?? fallbackMessage,
  }
}

async function runValidators(
  field: string,
  schema: FieldSchema,
  values: FormValues,
  mode: ValidationMode,
  t: ReturnType<typeof createTranslator>,
  signal?: AbortSignal,
): Promise<ValidationIssue[]> {
  const raw = values[field]
  const preprocessed = schema.preprocess ? schema.preprocess(raw, values) : raw

  const nextValues = { ...values, [field]: preprocessed }

  const issues: ValidationIssue[] = []

  for (const spec of schema.validators ?? []) {
    const output = await spec.validate({
      field,
      value: preprocessed,
      values: nextValues,
      mode,
      signal,
      t,
    })

    issues.push(...normalizeValidatorResult(output, issueDefaults(field, spec, t('validation.form.invalid'))))
  }

  for (const spec of schema.asyncValidators ?? []) {
    const output = await spec.validate({
      field,
      value: preprocessed,
      values: nextValues,
      mode,
      signal,
      t,
    })

    issues.push(...normalizeValidatorResult(output, issueDefaults(field, spec, t('validation.form.invalid'))))
  }

  return issues.map((issue) => {
    if (issue.path)
      return issue

    return { ...issue, path: field }
  })
}

function buildFieldResult(
  field: string,
  rawValue: unknown,
  value: unknown,
  issues: ValidationIssue[],
  stale = false,
): FieldValidationResult {
  const errors = issues.filter(issue => issue.severity === 'error')
  const warnings = issues.filter(issue => issue.severity === 'warning')
  const infos = issues.filter(issue => issue.severity === 'info')

  return {
    field,
    rawValue,
    value,
    valid: errors.length === 0,
    issues: errors,
    warnings,
    infos,
    stale,
  }
}

export function createValidationEngine(config: FormistryConfig): ValidationEngine {
  const schema = config.schema
  const defaultMode = config.mode ?? 'manual'
  const t = createTranslator(config.messages)
  const bus = createEventBus()
  const asyncControl = createAsyncController()
  const registeredMasks = new Map<string, string | FieldSchema['mask']>()

  function resolveFieldSchema(field: string): FieldSchema | undefined {
    const base = schema.fields[field]
    if (!base)
      return undefined

    const overrideMask = registeredMasks.get(field)
    if (!overrideMask)
      return base

    if (typeof overrideMask === 'string') {
      return {
        ...base,
        mask: schema.fields[overrideMask]?.mask,
      }
    }

    return {
      ...base,
      mask: overrideMask,
    }
  }

  function normalizeMaskedValue(field: string, value: unknown): unknown {
    const fieldSchema = resolveFieldSchema(field)
    if (!fieldSchema?.mask)
      return value

    if (typeof fieldSchema.mask === 'string')
      return value

    const rawString = String(value ?? '')
    const masked = applyMask(rawString, fieldSchema.mask)
    return unmaskValue(masked.masked, fieldSchema.mask)
  }

  async function validateField(field: string, value: unknown, options: ValidateFieldOptions = {}): Promise<FieldValidationResult> {
    const mode = options.mode ?? defaultMode
    const values = { ...(options.values ?? {}), [field]: value }
    const fieldSchema = resolveFieldSchema(field)

    bus.emit('validation:start', { scope: 'field', field, values })

    if (!fieldSchema) {
      const result = buildFieldResult(field, value, value, [])
      bus.emit('field:valid', { field, result })
      return result
    }

    const normalizedValue = normalizeMaskedValue(field, value)
    const run = asyncControl.begin(field)

    try {
      const issues = await runValidators(field, fieldSchema, { ...values, [field]: normalizedValue }, mode, t, run.abortController.signal)

      const postprocessed = fieldSchema.postprocess
        ? fieldSchema.postprocess(normalizedValue, values)
        : normalizedValue

      if (!asyncControl.isLatest(field, run.request))
        return buildFieldResult(field, value, postprocessed, issues, true)

      const result = buildFieldResult(field, value, postprocessed, issues)
      bus.emit(result.valid ? 'field:valid' : 'field:invalid', { field, result })
      return result
    }
    catch (error) {
      bus.emit('validation:error', { error, scope: 'field', field })
      throw error
    }
  }

  async function validateForm(values: FormValues, mode: ValidationMode = defaultMode): Promise<ValidationResult> {
    bus.emit('validation:start', { scope: 'form', values })

    const fields: ValidationResult['fields'] = {}

    for (const [field, value] of Object.entries(values))
      fields[field] = await validateField(field, value, { values, mode })

    for (const field of Object.keys(schema.fields)) {
      if (!(field in fields))
        fields[field] = await validateField(field, values[field], { values, mode })
    }

    const formIssues: ValidationIssue[] = []

    for (const spec of schema.formValidators ?? []) {
      const output = await spec.validate({
        values,
        mode,
        t,
      })

      formIssues.push(...normalizeValidatorResult(output, {
        path: '$form',
        code: spec.code ?? 'validation.form.invalid',
        severity: spec.severity ?? 'error',
        source: spec.name ?? 'form-validator',
        message: spec.message ?? t('validation.form.invalid'),
      }))
    }

    const issues = [...Object.values(fields).flatMap(field => field.issues), ...formIssues].filter(issue => issue.severity === 'error')
    const warnings = [...Object.values(fields).flatMap(field => field.warnings), ...formIssues].filter(issue => issue.severity === 'warning')
    const infos = [...Object.values(fields).flatMap(field => field.infos), ...formIssues].filter(issue => issue.severity === 'info')

    const result: ValidationResult = {
      valid: issues.length === 0,
      values,
      issues,
      warnings,
      infos,
      fields,
    }

    bus.emit(result.valid ? 'form:valid' : 'form:invalid', { result })
    return result
  }

  function registerMask(field: string, mask: string | FieldSchema['mask']): void {
    registeredMasks.set(field, mask)
  }

  return {
    validateField,
    validateForm,
    registerMask,
    on: bus.on,
  }
}
