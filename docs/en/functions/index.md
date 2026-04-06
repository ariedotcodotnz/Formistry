# API Overview

## Core

- `createFormistry(config)`
- `validateField(name, value, context?)`
- `validateForm(values, context?)`
- `registerMask(field, mask)`
- `on(event, handler)`

## Schema helpers

- `defineSchema`
- `defineFieldSchema`
- `validator`
- `formValidator`

## Validators

- `required`
- `minLength`
- `maxLength`
- `minValue`
- `maxValue`
- `between`
- `oneOf`
- `pattern`
- `email`
- `phone` (powered by Google libphonenumber)
- `numeric`
- `date`
- `url`
- `boolean`
- `arrayMinLength`
- `arrayMaxLength`
- `equalsField`
- `custom`
- `customForm`

## Utilities

- Async: `createAsyncController`, `debounceAsync`, `latestRunGuard`
- Masks: `masks`, `applyMask`, `unmaskValue`
- Reporting: `reportRaw`, `reportByField`, `reportBySeverity`, `reportFirstError`
- i18n: `createTranslator`, `DEFAULT_MESSAGES`

See [Core API](/functions/say-hello) for usage examples.
