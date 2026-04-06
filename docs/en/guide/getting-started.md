# Getting Started

## Install

::: code-group

```sh [npm]
npm install formistry
```

```sh [yarn]
yarn add formistry
```

```sh [pnpm]
pnpm add formistry
```
:::

## Browser Direct Import

```html
<script src="https://unpkg.com/formistry"></script>
```

Global name: `window.Formistry`.

## Quick setup

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

const result = await formistry.validateForm({ email: 'user@example.com' })
console.log(result.valid)
```

## Next steps

- API overview: [/functions](/functions)
