# Core API

## createFormistry

```ts
import { createFormistry, defineSchema, phone, required } from 'formistry'

const formistry = createFormistry({
  schema: defineSchema({
    fields: {
      fullName: { validators: [required()] },
      phoneNumber: { validators: [phone('US')] },
    },
  }),
})
```

## validateField

```ts
const fieldResult = await formistry.validateField('phoneNumber', '+1 650-253-0000')
console.log(fieldResult.valid)
```

## validateForm

```ts
const formResult = await formistry.validateForm({
  fullName: 'Jane',
  phoneNumber: '+1 650-253-0000',
})
console.log(formResult.issues)
```

## registerMask

```ts
import { masks } from 'formistry'

formistry.registerMask('phoneNumber', masks.phoneUS)
```

## on(event, handler)

```ts
formistry.on('field:invalid', ({ field, result }) => {
  console.log(field, result.issues)
})
```
