import { defineConfig } from 'vitepress'
import { GITHUB_URL, WEBSITE_URL } from './constants'

export const shared = defineConfig({
  title: 'Formistry.js',
  rewrites: {
    'en/:rest*': ':rest*',
  },
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  sitemap: {
    hostname: WEBSITE_URL,
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#42b883' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Formistry.js' }],
    ['meta', { property: 'og:site_name', content: 'Formistry.js' }],
    ['meta', { property: 'og:image', content: '/logo.png' }],
    ['meta', { property: 'og:url', content: WEBSITE_URL }],
  ],
  themeConfig: {
    logo: '/logo.png',
    socialLinks: [
      { icon: 'github', link: GITHUB_URL },
    ],
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
    },
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
})
