import { describe, expect, it, vi } from 'vitest'

import {
  arrayMaxLength,
  arrayMinLength,
  between,
  boolean,
  createEventBus,
  createFormistry,
  date,
  debounceAsync,
  defineSchema,
  email,
  equalsField,
  masks,
  maxLength,
  maxValue,
  minLength,
  minValue,
  numeric,
  oneOf,
  phone,
  reportByField,
  reportBySeverity,
  reportFirstError,
  required,
  url,
} from '../src'

describe('validators', () => {
  it('validates required and length constraints', async () => {
    const formistry = createFormistry({
      schema: defineSchema({
        fields: {
          username: {
            validators: [required(), minLength(3), maxLength(10)],
          },
        },
      }),
    })

    const result = await formistry.validateField('username', 'ab')
    expect(result.valid).toBe(false)
    expect(result.issues.length).toBe(1)
  })

  it('validates email numeric date and equality', async () => {
    const formistry = createFormistry({
      schema: defineSchema({
        fields: {
          email: { validators: [email()] },
          age: { validators: [numeric()] },
          birthday: { validators: [date()] },
          password: { validators: [required()] },
          confirmPassword: { validators: [equalsField('password')] },
        },
      }),
    })

    const result = await formistry.validateForm({
      email: 'bad',
      age: 'not-a-number',
      birthday: 'not-a-date',
      password: '123',
      confirmPassword: '456',
    })

    expect(result.valid).toBe(false)
    expect(result.issues.length).toBe(4)
  })

  it('validates phone numbers using libphonenumber', async () => {
    const formistry = createFormistry({
      schema: defineSchema({
        fields: {
          phone: { validators: [phone('US')] },
        },
      }),
    })

    const valid = await formistry.validateField('phone', '+1 650-253-0000')
    const invalid = await formistry.validateField('phone', '12345')

    expect(valid.valid).toBe(true)
    expect(invalid.valid).toBe(false)
  })

  it('validates expanded field types', async () => {
    const formistry = createFormistry({
      schema: defineSchema({
        fields: {
          age: { validators: [numeric(), minValue(18), maxValue(60), between(18, 60)] },
          role: { validators: [oneOf(['admin', 'editor', 'viewer'] as const)] },
          website: { validators: [url()] },
          consent: { validators: [boolean()] },
          tags: { validators: [arrayMinLength(1), arrayMaxLength(3)] },
        },
      }),
    })

    const bad = await formistry.validateForm({
      age: 12,
      role: 'owner',
      website: 'not-a-url',
      consent: 'yes',
      tags: [],
    })

    const good = await formistry.validateForm({
      age: 30,
      role: 'editor',
      website: 'https://example.com',
      consent: true,
      tags: ['a', 'b'],
    })

    expect(bad.valid).toBe(false)
    expect(good.valid).toBe(true)
  })
})

describe('engine and events', () => {
  it('runs form and field lifecycle events', async () => {
    const formistry = createFormistry({
      schema: defineSchema({
        fields: {
          email: { validators: [required(), email()] },
        },
      }),
    })

    const onStart = vi.fn()
    const onInvalid = vi.fn()
    formistry.on('validation:start', onStart)
    formistry.on('field:invalid', onInvalid)

    const result = await formistry.validateField('email', '')

    expect(result.valid).toBe(false)
    expect(onStart).toHaveBeenCalled()
    expect(onInvalid).toHaveBeenCalled()
  })

  it('supports form-level validators', async () => {
    const formistry = createFormistry({
      schema: defineSchema({
        fields: {
          age: { validators: [required()] },
        },
        formValidators: [
          {
            name: 'must-be-adult',
            code: 'form.adult',
            validate: ({ values }) => Number(values.age) >= 18 || 'Must be 18+',
          },
        ],
      }),
    })

    const result = await formistry.validateForm({ age: 16 })
    expect(result.valid).toBe(false)
    expect(result.issues.some(issue => issue.path === '$form')).toBe(true)
  })
})

describe('async controls', () => {
  it('debounces async function calls', async () => {
    const fn = vi.fn(async (value: string) => value)
    const debounced = debounceAsync(fn, 20)

    const p1 = debounced('a')
    const p2 = debounced('b')

    await expect(p1).rejects.toThrow('Debounced call superseded')
    await expect(p2).resolves.toBe('b')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('drops stale async field runs', async () => {
    const formistry = createFormistry({
      schema: defineSchema({
        fields: {
          username: {
            asyncValidators: [
              {
                name: 'slow',
                validate: async ({ value }) => {
                  await new Promise(resolve => setTimeout(resolve, value === 'first' ? 50 : 10))
                  return value === 'taken' ? 'Taken' : true
                },
              },
            ],
          },
        },
      }),
    })

    const first = formistry.validateField('username', 'first')
    const second = formistry.validateField('username', 'second')

    const [firstResult, secondResult] = await Promise.all([first, second])
    expect(firstResult.stale).toBe(true)
    expect(secondResult.stale).toBeFalsy()
  })
})

describe('masks and reporting', () => {
  it('supports built-in masks and field registration', async () => {
    const formistry = createFormistry({
      schema: defineSchema({
        fields: {
          phone: {
            mask: masks.phoneUS,
            validators: [minLength(10)],
          },
        },
      }),
    })

    formistry.registerMask('phone', masks.phoneUS)
    const result = await formistry.validateField('phone', '123-456-7890')
    expect(result.valid).toBe(true)
  })

  it('supports reporter outputs', async () => {
    const formistry = createFormistry({
      schema: defineSchema({
        fields: {
          email: { validators: [required(), email()] },
        },
      }),
    })

    const result = await formistry.validateForm({ email: '' })
    const byField = reportByField(result)
    const bySeverity = reportBySeverity(result)
    const firstError = reportFirstError(result)

    expect(byField.email.length).toBeGreaterThan(0)
    expect(bySeverity.error.length).toBeGreaterThan(0)
    expect(firstError.length).toBeGreaterThan(0)
  })
})

describe('event bus utility', () => {
  it('subscribes and unsubscribes handlers', () => {
    const bus = createEventBus()
    const handler = vi.fn()

    const off = bus.on('validation:start', handler)
    bus.emit('validation:start', { scope: 'form', values: {} })
    off()
    bus.emit('validation:start', { scope: 'form', values: {} })

    expect(handler).toHaveBeenCalledTimes(1)
  })
})
