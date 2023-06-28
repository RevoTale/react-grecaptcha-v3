import { build } from 'esbuild';
import config from './package.json' assert { type: 'json' };
import rimraf from 'rimraf';
const { dependencies } = config;
const entryFile = 'src/index.ts';
const handleBuild = async () => {
  await rimraf('./dist');
  const shared = {
    bundle: true,
    entryPoints: [entryFile],
    // Treat all dependencies in package.json as externals to keep bundle size to a minimum
    external: Object.keys(dependencies),
    logLevel: 'info',
    minify: true,
    sourcemap: true,
  };

  void build({
    ...shared,
    format: 'esm',
    outfile: './dist/index.esm.js',
    target: ['esnext', 'node12.22.0'],
  });

  void build({
    ...shared,
    format: 'cjs',
    outfile: './dist/index.cjs.js',
    target: ['esnext', 'node12.22.0'],
  });
};
void handleBuild();
