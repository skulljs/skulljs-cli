import { ChalkInstance } from 'chalk';
import { Options as OraOptions } from 'ora';

export interface SkPrint {
  /**
   * Log blue and bold message to the console
   * @param message Message to print
   */
  info(message: string);

  /**
   * Generate ora Options from message
   * @param message Message to print
   * @param loaderOptions Ora options
   * @returns loaderOptions
   */
  infoLoader(message: string, loaderOptions: OraOptions = {}): OraOptions;

  /**
   * Log red and bold message to the console
   * @param message Message to print
   */
  error(message: string);

  /**
   * Log yellow and bold message to the console
   * @param message Message to print
   */
  warn(message: string);

  /**
   * Log message to the console
   * @param message Message to print
   */
  log(message: string | Error);

  chalk: ChalkInstance;
}
