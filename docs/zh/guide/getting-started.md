# 快速开始

## 安装

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

## 浏览器直接引入

```html
<script src="https://unpkg.com/formistry"></script>
```

全局变量名：`window.Formistry`。

## 快速示例

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

## 下一步

- API 概览：[/zh/functions](/zh/functions)
