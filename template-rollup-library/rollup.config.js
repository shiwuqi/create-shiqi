import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';
import cleanup from 'rollup-plugin-cleanup';
import dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';
import size from 'rollup-plugin-sizes';
import { visualizer } from 'rollup-plugin-visualizer';
import fs from 'fs';
import path from 'path';
import pkg from './package.json';

const DEV = !!process.env.DEV;
const PROD = !DEV;

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified');
}
const { version } = pkg;
const packagesDir = path.resolve(__dirname, 'packages');
const packageDir = path.resolve(packagesDir, process.env.TARGET);
const packageDirDist = `${packageDir}/dist`;
const name = path.basename(packageDir);

const project_name = '@shiqi/lib';
const packageDirs = fs.readdirSync(packagesDir);
const paths = {};
packageDirs.forEach((dir) => {
  if (dir.startsWith('.')) return;
  paths[`${project_name}/${dir}`] = [`${packagesDir}/${dir}/src`];
});

const common = {
  input: `${packageDir}/src/index.ts`,
  output: {
    banner: `/* ${project_name}-${name} version ' + ${version} */`,
  },
  external: [...Object.keys(paths)],
  plugins: [
    resolve(),
    size(),
    visualizer({
      title: `${project_name} analyzer`,
      filename: 'analyzer.html',
    }),
    commonjs({
      exclude: 'node_modules',
    }),
    json(),
    terser(),
    cleanup({
      comments: 'none',
    }),
  ],
};
const esmBuild = {
  ...common,
  output: {
    file: `${packageDirDist}/index.esm.js`,
    format: 'es',
    sourcemap: true,
    ...common.output,
  },
  plugins: [
    ...common.plugins,
    clear({
      targets: [packageDirDist],
    }),
  ],
};
const cjsBuild = {
  ...common,
  external: [],
  output: {
    file: `${packageDirDist}/index.cjs.js`,
    format: 'cjs',
    sourcemap: true,
    minifyInternalExports: true,
    ...common.output,
  },
  plugins: common.plugins,
};

const iifeBuild = {
  ...common,
  external: [],
  output: {
    file: `${packageDirDist}/index.min.js`,
    format: 'iife',
    ...common.output,
  },
  plugins: common.plugins,
};

const clientTypes = {
  input: `${packageDir}/src/index.ts`,
  output: {
    file: `${packageDirDist}/index.d.ts`,
    format: 'es',
  },
  plugins: [dts()],
};

const config = defineConfig([]);

config.push(esmBuild);

if (PROD) {
  config.push(cjsBuild);
  config.push(iifeBuild);
}

config.push(clientTypes);

export default config;