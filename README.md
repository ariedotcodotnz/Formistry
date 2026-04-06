# Formistry.js

Formistry.js is a modern framework-agnostic TypeScript library for comprehensive form validation before sending payloads to backend services.

It includes:

- Schema-driven field and form validation
- Sync + async validation pipeline
- Cross-field and form-level checks
- Input masks (phone, date, credit card, token)
- Reporting strategies (raw, by field, by severity, first error)
- Lifecycle alert/event hooks
- Framework-agnostic DOM adapter utilities

## Install

```bash
pnpm add formistry
```

## Quick Usage

```ts
import { createFormistry, defineSchema, email, required } from 'formistry'

const formistry = createFormistry({
  schema: defineSchema({
    fields: {
      email: {
        validators: [required(), email()],
      },
    },
  }),
})

const result = await formistry.validateForm({ email: 'hello@example.com' })
console.log(result.valid)
```

## Development

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## License

[MIT License](./LICENSE)
