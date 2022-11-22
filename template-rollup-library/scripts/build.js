import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import { targets as allTargets, getArgv, binRun } from './utils.js';

let buildTypes = true;
let LOCALDIR = '';
let rollupWatch = false;
run();
async function run() {
  const argv = getArgv();
  const paramTarget = argv._;
  LOCALDIR = argv.local;
  buildTypes = argv.types !== 'false';
  rollupWatch = argv.watch === 'true';
  if (paramTarget.length === 0) {
    buildAll(allTargets);
  } else {
    buildAll(paramTarget);
  }
}

function buildAll(targets) {
  runParallel(targets, rollupBuild);
}

async function runParallel(sources, iteratorFn) {
  const ret = [];
  for (const item of sources) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);
  }
  return Promise.all(ret);
}

async function rollupBuild(target) {
  const pkgDir = path.resolve(`packages/${target}`);
  const { default: pkg } = await import(`${pkgDir}/package.json`, {
    assert: { type: 'json' },
  });
  if (pkg.private) {
    return;
  }
  const args = [
    '-c',
    '--environment',
    [`TARGET:${target}`, `TYPES:${buildTypes}`, `LOCALDIR:${LOCALDIR}`]
      .filter(Boolean)
      .join(','),
  ];
  rollupWatch && args.push('--watch');
  await binRun('rollup', args);

  if (buildTypes && pkg.types) {
    console.log(
      chalk.bold(chalk.yellow(`Rolling up type definitions for ${target}...`))
    );
    await fs.remove(`${pkgDir}/dist/packages`);
  }
}