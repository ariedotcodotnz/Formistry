# API 概览

## 核心

- `createFormistry(config)`
- `validateField(name, value, context?)`
- `validateForm(values, context?)`
- `registerMask(field, mask)`
- `on(event, handler)`

## Schema 辅助

- `defineSchema`
- `defineFieldSchema`
- `validator`
- `formValidator`

## 验证器

- `required`
- `minLength`
- `maxLength`
- `pattern`
- `email`
- `numeric`
- `date`
- `equalsField`
- `custom`
- `customForm`

## 工具

- Async：`createAsyncController`、`debounceAsync`、`latestRunGuard`
- Mask：`masks`、`applyMask`、`unmaskValue`
- Reporting：`reportRaw`、`reportByField`、`reportBySeverity`、`reportFirstError`
- i18n：`createTranslator`、`DEFAULT_MESSAGES`

查看 [核心 API](/zh/functions/say-hello) 获取示例。
