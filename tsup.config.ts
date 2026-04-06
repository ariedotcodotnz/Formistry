import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  format: ['cjs', 'esm', 'iife'],
  globalName: 'Formistry',
  dts: true,
  minify: true,
})
