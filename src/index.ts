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
  custom,
  customForm,
  date,
  email,
  equalsField,
  maxLength,
  minLength,
  normalizeValidatorResult,
  numeric,
  pattern,
  required,
} from './validators'
