# Core API

## createFormistry

```ts
import { createFormistry, defineSchema, required } from 'formistry'

const formistry = createFormistry({
  schema: defineSchema({
    fields: {
      name: { validators: [required()] },
    },
  }),
})
```

## validateField

```ts
const fieldResult = await formistry.validateField('name', '')
console.log(fieldResult.valid)
```

## validateForm

```ts
const formResult = await formistry.validateForm({ name: '' })
console.log(formResult.issues)
```

## registerMask

```ts
import { masks } from 'formistry'

formistry.registerMask('phone', masks.phoneUS)
```

## on(event, handler)

```ts
formistry.on('field:invalid', ({ field, result }) => {
  console.log(field, result.issues)
})
```
