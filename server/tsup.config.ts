import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/infra/http/server.ts'],
  format: ['esm'],
  target: 'node24',
  platform: 'node',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
})
