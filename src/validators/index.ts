import type {
  FormValidatorSpec,
  ValidationIssue,
  ValidatorOutput,
  ValidatorSpec,
} from '../types/contracts'

type Severity = ValidationIssue['severity']

function asString(value: unknown): string {
  if (value == null)
    return ''
  return String(value)
}

function toIssue(
  output: Exclude<ValidatorOutput, boolean | null | undefined>,
  defaults: { path: string, code: string, severity: Severity, source: string, message: string },
): ValidationIssue[] {
  if (typeof output === 'string') {
    return [{
      path: defaults.path,
      code: defaults.code,
      severity: defaults.severity,
      source: defaults.source,
      message: output,
    }]
  }

  if (Array.isArray(output))
    return output

  return [output]
}

export function normalizeValidatorResult(
  output: ValidatorOutput,
  defaults: { path: string, code: string, severity: Severity, source: string, message: string },
): ValidationIssue[] {
  if (output == null || output === true)
    return []

  if (output === false) {
    return [{
      path: defaults.path,
      code: defaults.code,
      severity: defaults.severity,
      source: defaults.source,
      message: defaults.message,
    }]
  }

  return toIssue(output, defaults)
}

export function required(message?: string): ValidatorSpec {
  return {
    name: 'required',
    code: 'validation.required',
    message,
    validate: ({ value }) => {
      const candidate = asString(value).trim()
      return candidate.length > 0
    },
  }
}

export function minLength(min: number, message?: string): ValidatorSpec {
  return {
    name: 'minLength',
    code: 'validation.minLength',
    message,
    validate: ({ value, t }) => {
      return asString(value).length >= min || message || t('validation.minLength', { min })
    },
  }
}

export function maxLength(max: number, message?: string): ValidatorSpec {
  return {
    name: 'maxLength',
    code: 'validation.maxLength',
    message,
    validate: ({ value, t }) => {
      return asString(value).length <= max || message || t('validation.maxLength', { max })
    },
  }
}

export function pattern(regex: RegExp, message?: string): ValidatorSpec {
  return {
    name: 'pattern',
    code: 'validation.regex',
    message,
    validate: ({ value, t }) => {
      const candidate = asString(value)
      return candidate.length === 0 || regex.test(candidate) || message || t('validation.regex')
    },
  }
}

function isEmailLike(input: string): boolean {
  if (!input || input.includes(' '))
    return false

  const at = input.indexOf('@')
  if (at <= 0 || at !== input.lastIndexOf('@') || at === input.length - 1)
    return false

  const local = input.slice(0, at)
  const domain = input.slice(at + 1)
  if (!local || !domain || domain.startsWith('.') || domain.endsWith('.'))
    return false

  const segments = domain.split('.')
  if (segments.length < 2)
    return false

  return segments.every(segment => segment.length > 0)
}

export function email(message?: string): ValidatorSpec {
  return {
    name: 'email',
    code: 'validation.email',
    message,
    validate: ({ value, t }) => {
      const candidate = asString(value).trim()
      if (!candidate)
        return true

      return isEmailLike(candidate) || message || t('validation.email')
    },
  }
}

export function numeric(message?: string): ValidatorSpec {
  return {
    name: 'numeric',
    code: 'validation.numeric',
    message,
    validate: ({ value, t }) => {
      const candidate = asString(value).trim()
      if (!candidate)
        return true

      return !Number.isNaN(Number(candidate)) || message || t('validation.numeric')
    },
  }
}

export function date(message?: string): ValidatorSpec {
  return {
    name: 'date',
    code: 'validation.date',
    message,
    validate: ({ value, t }) => {
      const candidate = asString(value).trim()
      if (!candidate)
        return true

      return !Number.isNaN(Date.parse(candidate)) || message || t('validation.date')
    },
  }
}

export function equalsField(field: string, message?: string): ValidatorSpec {
  return {
    name: 'equalsField',
    code: 'validation.compare.equals',
    message,
    validate: ({ value, values, t }) => {
      return value === values[field] || message || t('validation.compare.equals', { field })
    },
  }
}

export function custom(spec: ValidatorSpec): ValidatorSpec {
  return spec
}

export function customForm(spec: FormValidatorSpec): FormValidatorSpec {
  return spec
}
