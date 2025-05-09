import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/**/*.ts'],
    sourcemap: true,
    clean: true,
    format: ['cjs', 'esm'],
    dts: true,
    bundle: false,
    target: 'es5',
})
