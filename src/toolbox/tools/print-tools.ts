import { SkPrint } from '@src/types/toolbox/print-tools';
import chalk from 'chalk';
import { Options as OraOptions } from 'ora';

function info(message: string) {
  console.log(chalk.blue.bold(message));
}

function infoLoader(message: string, loaderOptions: OraOptions = {}): OraOptions {
  loaderOptions = {
    prefixText: chalk.blue.bold(`${message} `),
    ...loaderOptions,
  };
  return loaderOptions;
}

function error(message: string) {
  console.log(chalk.red.bold(message));
}

function warn(message: string) {
  console.log(chalk.yellow.bold(message));
}

function log(message: string | Error) {
  console.log(message);
}

const print: SkPrint = {
  info,
  infoLoader,
  error,
  warn,
  log,
  chalk,
};
export { print, SkPrint };
