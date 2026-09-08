import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/infra/http/server.ts'],
  splitting: false,
  clean: true,
  minify: true,
  format: ['esm'],
})
