import { defineConfig } from 'vitepress'
import pkg from '../../../package.json'
import { GITHUB_URL } from './constants'

export const zh = defineConfig({
  lang: 'zh-CN',
  description: 'Formistry.js 是现代、与框架无关的 TypeScript 表单验证库，支持异步校验、报告、事件告警和输入掩码。',
  themeConfig: {
    editLink: {
      pattern: `${GITHUB_URL}/edit/main/docs/:path`,
      text: '在 GitHub 上编辑此页面',
    },
    nav: [
      { text: '指南', link: '/zh/guide/what-is', activeMatch: '/zh/guide/' },
      { text: 'API', link: '/zh/functions', activeMatch: '/zh/functions/' },
      {
        text: `v${pkg.version}`,
        items: [
          {
            text: '更新日志',
            link: `${GITHUB_URL}/releases`,
          },
        ],
      },
    ],
    sidebar: [
      {
        text: '指南',
        collapsed: false,
        items: [
          { text: '什么是 Formistry.js？', link: '/zh/guide/what-is' },
          { text: '快速开始', link: '/zh/guide/getting-started' },
        ],
      },
      {
        text: 'API',
        collapsed: false,
        items: [
          { text: '概览', link: '/zh/functions' },
          { text: '核心 API', link: '/zh/functions/say-hello' },
        ],
      },
    ],
    footer: {
      message: '基于 MIT 许可证发布。',
      copyright: '版权 © 2026-present Formistry contributors',
    },
  },
})
