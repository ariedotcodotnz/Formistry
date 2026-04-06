import type { FieldSchema, FormSchema, FormValidatorSpec, ValidatorSpec } from '../types/contracts'

export function defineFieldSchema(schema: FieldSchema): FieldSchema {
  return schema
}

export function defineSchema(schema: FormSchema): FormSchema {
  return schema
}

export function validator(spec: ValidatorSpec): ValidatorSpec {
  return spec
}

export function formValidator(spec: FormValidatorSpec): FormValidatorSpec {
  return spec
}
