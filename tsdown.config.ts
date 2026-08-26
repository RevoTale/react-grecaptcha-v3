import { defineConfig } from 'tsdown'

export default defineConfig({
    clean: true,
    dts: true,
    entry: ['src/**/*'],
    fixedExtension: false,
    format: ['cjs', 'esm'],
    outputOptions: {
        exports: 'named',
    },
    sourcemap: true,
    target: 'es2015',
    unbundle: true,
})
