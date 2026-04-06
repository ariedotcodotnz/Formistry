export type FormValues = Record<string, unknown>

export type ValidationMode = 'onChange' | 'onBlur' | 'onSubmit' | 'manual'

export type Severity = 'error' | 'warning' | 'info'

export interface ValidationIssue {
  code: string
  path: string
  message: string
  severity: Severity
  source?: string
  meta?: Record<string, unknown>
}

export interface MaskResult {
  masked: string
  raw: string
  caret?: number
}

export interface MaskDefinition {
  name?: string
  mask: (raw: string) => MaskResult
  unmask?: (masked: string) => string
  normalize?: (raw: string) => string
}

export type MessageCatalog = Record<string, string>

export interface Translator {
  (key: string, variables?: Record<string, string | number>): string
}

export interface ValidationContext {
  field: string
  value: unknown
  values: FormValues
  mode: ValidationMode
  signal?: AbortSignal
  t: Translator
}

export type ValidatorOutput =
  | boolean
  | string
  | ValidationIssue
  | ValidationIssue[]
  | null
  | undefined

export type MaybePromise<T> = T | Promise<T>

export type ValidatorFn = (context: ValidationContext) => MaybePromise<ValidatorOutput>

export interface ValidatorSpec {
  name?: string
  code?: string
  message?: string
  severity?: Severity
  validate: ValidatorFn
}

export interface FieldSchema {
  preprocess?: (value: unknown, values: FormValues) => unknown
  postprocess?: (value: unknown, values: FormValues) => unknown
  validators?: ValidatorSpec[]
  asyncValidators?: ValidatorSpec[]
  mask?: MaskDefinition | string
}

export interface FormValidationContext {
  values: FormValues
  mode: ValidationMode
  signal?: AbortSignal
  t: Translator
}

export type FormValidatorFn = (context: FormValidationContext) => MaybePromise<ValidatorOutput>

export interface FormValidatorSpec {
  name?: string
  code?: string
  message?: string
  severity?: Severity
  validate: FormValidatorFn
}

export interface FormSchema {
  fields: Record<string, FieldSchema>
  formValidators?: FormValidatorSpec[]
}

export interface FieldValidationResult {
  field: string
  rawValue: unknown
  value: unknown
  valid: boolean
  issues: ValidationIssue[]
  warnings: ValidationIssue[]
  infos: ValidationIssue[]
  stale?: boolean
}

export interface ValidationResult {
  valid: boolean
  values: FormValues
  issues: ValidationIssue[]
  warnings: ValidationIssue[]
  infos: ValidationIssue[]
  fields: Record<string, FieldValidationResult>
}

export interface FormistryEvents {
  'validation:start': { scope: 'field' | 'form', field?: string, values: FormValues }
  'field:valid': { field: string, result: FieldValidationResult }
  'field:invalid': { field: string, result: FieldValidationResult }
  'form:valid': { result: ValidationResult }
  'form:invalid': { result: ValidationResult }
  'validation:error': { error: unknown, scope: 'field' | 'form', field?: string }
}

export type ReporterOutput =
  | ValidationResult
  | Record<string, ValidationIssue[]>
  | Record<Severity, ValidationIssue[]>
  | string

export interface FormistryConfig {
  schema: FormSchema
  mode?: ValidationMode
  locale?: string
  messages?: MessageCatalog
}
