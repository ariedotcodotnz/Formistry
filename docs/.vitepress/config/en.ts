import { defineConfig } from 'vitepress'
import pkg from '../../../package.json'
import { GITHUB_URL } from './constants'

export const en = defineConfig({
  lang: 'en-US',
  description: 'Formistry.js is a modern framework-agnostic TypeScript form validation library with async checks, reporting, alerts, and input masks.',
  themeConfig: {
    editLink: {
      pattern: `${GITHUB_URL}/edit/main/docs/:path`,
      text: 'Edit this page on GitHub',
    },
    nav: [
      { text: 'Guide', link: '/guide/what-is', activeMatch: '/guide/' },
      { text: 'API', link: '/functions', activeMatch: '/functions/' },
      {
        text: `v${pkg.version}`,
        items: [
          {
            text: 'Changelog',
            link: `${GITHUB_URL}/releases`,
          },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Guide',
        collapsed: false,
        items: [
          { text: 'What is Formistry.js?', link: '/guide/what-is' },
          { text: 'Getting Started', link: '/guide/getting-started' },
        ],
      },
      {
        text: 'API',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/functions' },
          { text: 'Core API', link: '/functions/say-hello' },
        ],
      },
    ],
    lastUpdated: {
      text: 'Last Updated',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present Formistry contributors',
    },
  },
})
