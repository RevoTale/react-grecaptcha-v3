import { defineConfig } from 'tsdown'

export default defineConfig({
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    fixedExtension: false,
    format: ['cjs', 'esm'],
    outputOptions: {
        exports: 'named',
    },
    platform: 'browser',
    sourcemap: true,
    target: 'es2015',
    unbundle: true,
})
