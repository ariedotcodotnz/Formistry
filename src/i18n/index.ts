import type { MessageCatalog, Translator } from '../types/contracts'

const DEFAULT_MESSAGES: MessageCatalog = {
  'validation.required': 'This field is required.',
  'validation.minLength': 'This field must be at least {min} characters long.',
  'validation.maxLength': 'This field must be at most {max} characters long.',
  'validation.regex': 'This field format is invalid.',
  'validation.email': 'Please enter a valid email address.',
  'validation.numeric': 'Please enter a numeric value.',
  'validation.date': 'Please enter a valid date.',
  'validation.compare.equals': 'This field does not match {field}.',
  'validation.form.invalid': 'The form contains validation errors.',
}

function interpolate(template: string, variables?: Record<string, string | number>): string {
  if (!variables)
    return template

  return template.replace(/\{([^{}]+)\}/g, (_match: string, key: string) => {
    return String(variables[key] ?? `{${key}}`)
  })
}

export function createTranslator(messages?: MessageCatalog): Translator {
  const merged = { ...DEFAULT_MESSAGES, ...messages }

  return (key, variables) => {
    const template = merged[key] ?? key
    return interpolate(template, variables)
  }
}

export { DEFAULT_MESSAGES }
