import { SkPrint } from '@src/types/toolbox/print-tools';
import chalk from 'chalk';
import { Options as OraOptions } from 'ora';

/**
 * Log blue and bold message to the console
 * @param message Message to print
 */

function info(message: string) {
  console.log(chalk.blue.bold(message));
}

/**
 * Generate ora Options from message
 * @param message Message to print
 * @param loaderOptions Ora options
 * @returns loaderOptions
 */
function infoLoader(message: string, loaderOptions: OraOptions = {}): OraOptions {
  loaderOptions = {
    prefixText: chalk.blue.bold(`${message} `),
    ...loaderOptions,
  };
  return loaderOptions;
}

/**
 * Log red and bold message to the console
 * @param message Message to print
 */
function error(message: string) {
  console.log(chalk.red.bold(message));
}

/**
 * Log yellow and bold message to the console
 * @param message Message to print
 */
function warn(message: string) {
  console.log(chalk.yellow.bold(message));
}

/**
 * Log message to the console
 * @param message Message to print
 */
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
