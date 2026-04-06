export { createDOMAdapter } from './adapters/dom'
export { createEventBus } from './alerts'
export { createAsyncController, debounceAsync, latestRunGuard } from './async'
export { createFormistry } from './core/formistry'
export { createTranslator, DEFAULT_MESSAGES } from './i18n'
export { applyMask, masks, unmaskValue } from './masks'
export { reportByField, reportBySeverity, reportFirstError, reportRaw } from './reporting'
export { defineFieldSchema, defineSchema, formValidator, validator } from './schema'

export type {
  FieldSchema,
  FieldValidationResult,
  FormistryConfig,
  FormistryEvents,
  FormSchema,
  FormValidationContext,
  FormValidatorFn,
  FormValidatorSpec,
  FormValues,
  MaskDefinition,
  MaskResult,
  MessageCatalog,
  ReporterOutput,
  Severity,
  ValidationContext,
  ValidationIssue,
  ValidationMode,
  ValidationResult,
  ValidatorFn,
  ValidatorOutput,
  ValidatorSpec,
} from './types/contracts'

export {
  arrayMaxLength,
  arrayMinLength,
  between,
  boolean,
  custom,
  customForm,
  date,
  email,
  equalsField,
  maxLength,
  maxValue,
  minLength,
  minValue,
  normalizeValidatorResult,
  numeric,
  oneOf,
  pattern,
  phone,
  required,
  url,
} from './validators'
