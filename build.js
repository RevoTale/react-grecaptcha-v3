import { build } from 'esbuild';
import rimraf from 'rimraf';
const target = ['chrome64', 'edge79', 'firefox67', 'node16', 'safari11'];
import glob from 'resolve-glob';
const entryPoints = glob.sync([
  './src/**/*.ts',
  './src/**/*.tsx',
  './src/**/*.js',
  './src/**/*.jsx',
]);
const shared = {
  entryPoints,
  // Treat all dependencies in package.json as externals to keep bundle size to a minimum
  //bundle: true,
  packages: 'external',
  logLevel: 'info',
  bundle: false,
  minify: true,
  platform: 'neutral',

  treeShaking: true,
  sourcemap: true,
};
const handleBuild = async () => {
  await rimraf('./dist');

  void build({
    ...shared,
    format: 'esm',
    //splitting: true,
    outExtension: {
      '.js': '.mjs',
    },
    outdir: './dist/esm/',
    target,
  });

  void build({
    ...shared,
    format: 'cjs',
    outExtension: {
      '.js': '.cjs',
    },
    outdir: './dist/cjs/',
    target,
  });
};
void handleBuild();
