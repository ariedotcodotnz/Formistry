# 什么是 Formistry.js？

Formistry.js 是一个现代、与框架无关的 JavaScript/TypeScript 表单验证库，用于在数据提交到后端前进行全面校验。

## 核心能力

- 字段级、跨字段、表单级验证
- 同步 + 异步校验，并具备过期运行保护
- 标准化 issue 结构（含严重级别与元数据）
- 输入掩码与原始值/展示值互操作
- 生命周期事件钩子（`validation:start`、`field:*`、`form:*`、`validation:error`）
- 可组合报告输出，便于 UI 展示与日志记录

## 设计目标

- 核心逻辑不依赖 DOM/框架细节
- API 类型安全、接口精简、可插件化扩展
- 行为确定、易测试、易维护
