import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import { execa } from 'execa';
import minimist from 'minimist';

const targets = fs.readdirSync('packages').filter((f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false;
  }
  if (f === 'company') return false;
  import(`../packages/${f}/package.json`, {
    assert: { type: 'json' },
  }).then(({ default: pkg }) => {
    if (pkg.private && !pkg.buildOptions) {
      return false;
    } else {
      return true;
    }
  });
  return true;
});

const fuzzyMatchTarget = (partialTargets, includeAllMatching) => {
  const matched = [];
  partialTargets.forEach((partialTarget) => {
    for (const target of targets) {
      if (target.match(partialTarget)) {
        matched.push(target);
        if (!includeAllMatching) {
          break;
        }
      }
    }
  });
  if (matched.length) {
    return matched;
  } else {
    console.log();
    console.error(
      `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
        `Target ${chalk.underline(partialTargets)} not found!`
      )}`
    );
    console.log();

    process.exit(1);
  }
};

const getArgv = () => {
  const argv = minimist(process.argv.slice(2));
  return argv;
};

const binRun = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });

const getPkgRoot = (pkg) => path.resolve(__dirname, '../packages/' + pkg);

const step = (msg) => console.log(chalk.cyan(msg));

const errLog = (msg) => console.log(chalk.red(msg));

export { targets, fuzzyMatchTarget, getArgv, binRun, getPkgRoot, step, errLog };