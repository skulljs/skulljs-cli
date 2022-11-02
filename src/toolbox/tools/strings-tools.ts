import { is, trim } from './utils.js';
import lodash from 'lodash';
import pluralize from 'pluralize';
import { SkStrings } from '@src/types/toolbox/strings-tools.js';
const { kebabCase } = lodash;

/**
 * Is this not a string?
 * @param value The value to check
 * @return True if it is not a string, otherwise false
 */
function isNotString(value: any): boolean {
  return !is(String, value);
}

/**
 * Is this value a blank string?
 * @param value The value to check.
 * @returns True if it was, otherwise false.
 */
function isBlank(value: any): boolean {
  return isNotString(value) || trim(value) === '';
}

/**
 * Capitalize first letter of string
 * @param str
 * @returns string
 */
function upperFirst(str: string): string {
  return lodash.upperFirst(str);
}

/**
 * Singularize a string
 * @param str
 * @returns string
 */
function singular(str: string): string {
  return pluralize.singular(str);
}

/**
 * Pluralize a string
 * @param str
 * @returns string
 */
function plural(str: string): string {
  return pluralize.plural(str);
}

/**
 * Capitalize all string
 * @param str
 * @returns string
 */
function upperCase(str: string): string {
  return lodash.upperCase(str);
}

/**
 * LowerCase for all the string
 * @param str
 * @returns string
 */
function lowerCase(str: string): string {
  return lodash.lowerCase(str);
}

const strings: SkStrings = {
  isNotString,
  isBlank,
  kebabCase,
  upperFirst,
  singular,
  plural,
  upperCase,
  lowerCase,
};

export { strings, SkStrings };
