# 迁移与版本策略

Formistry.js 遵循语义化版本：

- MAJOR：破坏性 API 变更
- MINOR：向后兼容的新功能
- PATCH：向后兼容的问题修复

## 向后兼容

从包根导出的公共 API 视为稳定。

除非明确导出，内部模块不承诺稳定。

## 发布流程

1. 完成代码与测试更新
2. 执行 `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
3. 使用 `pnpm release` 升级版本
4. 在 GitHub Releases 发布变更说明
