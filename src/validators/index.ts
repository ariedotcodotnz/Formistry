import type {
  FormValidatorSpec,
  ValidationIssue,
  ValidatorOutput,
  ValidatorSpec,
} from '../types/contracts'
import { PhoneNumberUtil } from 'google-libphonenumber'

type Severity = ValidationIssue['severity']

const phoneUtil = PhoneNumberUtil.getInstance()

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

export function minValue(min: number, message?: string): ValidatorSpec {
  return {
    name: 'minValue',
    code: 'validation.minValue',
    message,
    validate: ({ value, t }) => {
      const numeric = Number(value)
      if (Number.isNaN(numeric))
        return message || t('validation.numeric')

      return numeric >= min || message || t('validation.minValue', { min })
    },
  }
}

export function maxValue(max: number, message?: string): ValidatorSpec {
  return {
    name: 'maxValue',
    code: 'validation.maxValue',
    message,
    validate: ({ value, t }) => {
      const numeric = Number(value)
      if (Number.isNaN(numeric))
        return message || t('validation.numeric')

      return numeric <= max || message || t('validation.maxValue', { max })
    },
  }
}

export function between(min: number, max: number, message?: string): ValidatorSpec {
  return {
    name: 'between',
    code: 'validation.between',
    message,
    validate: ({ value, t }) => {
      const numeric = Number(value)
      if (Number.isNaN(numeric))
        return message || t('validation.numeric')

      return (numeric >= min && numeric <= max) || message || t('validation.between', { min, max })
    },
  }
}

export function oneOf<T extends readonly unknown[]>(allowed: T, message?: string): ValidatorSpec {
  return {
    name: 'oneOf',
    code: 'validation.oneOf',
    message,
    validate: ({ value, t }) => {
      return allowed.includes(value) || message || t('validation.oneOf')
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

export function phone(region = 'US', message?: string): ValidatorSpec {
  return {
    name: 'phone',
    code: 'validation.phone',
    message,
    validate: ({ value, t }) => {
      const candidate = asString(value).trim()
      if (!candidate)
        return true

      try {
        const parsed = phoneUtil.parseAndKeepRawInput(candidate, region)
        return phoneUtil.isValidNumber(parsed) || message || t('validation.phone')
      }
      catch {
        return message || t('validation.phone')
      }
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

export function url(message?: string): ValidatorSpec {
  return {
    name: 'url',
    code: 'validation.url',
    message,
    validate: ({ value, t }) => {
      const candidate = asString(value).trim()
      if (!candidate)
        return true

      try {
        // eslint-disable-next-line no-new
        new URL(candidate)
        return true
      }
      catch {
        return message || t('validation.url')
      }
    },
  }
}

export function boolean(message?: string): ValidatorSpec {
  return {
    name: 'boolean',
    code: 'validation.boolean',
    message,
    validate: ({ value, t }) => {
      return typeof value === 'boolean' || message || t('validation.boolean')
    },
  }
}

export function arrayMinLength(min: number, message?: string): ValidatorSpec {
  return {
    name: 'arrayMinLength',
    code: 'validation.array.minLength',
    message,
    validate: ({ value, t }) => {
      if (!Array.isArray(value))
        return message || t('validation.array')

      return value.length >= min || message || t('validation.array.minLength', { min })
    },
  }
}

export function arrayMaxLength(max: number, message?: string): ValidatorSpec {
  return {
    name: 'arrayMaxLength',
    code: 'validation.array.maxLength',
    message,
    validate: ({ value, t }) => {
      if (!Array.isArray(value))
        return message || t('validation.array')

      return value.length <= max || message || t('validation.array.maxLength', { max })
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
