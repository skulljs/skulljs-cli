import { is, trim } from './utils.js';
import lodash from 'lodash';
import pluralize from 'pluralize';
import { SkStrings } from '@src/types/toolbox/strings-tools.js';
const { kebabCase } = lodash;

function isNotString(value: any): boolean {
  return !is(String, value);
}

function isBlank(value: any): boolean {
  return isNotString(value) || trim(value) === '';
}

function upperFirst(str: string): string {
  return lodash.upperFirst(str);
}

function singular(str: string): string {
  return pluralize.singular(str);
}

function plural(str: string): string {
  return pluralize.plural(str);
}

function upperCase(str: string): string {
  return lodash.toUpper(str);
}

function lowerCase(str: string): string {
  return lodash.toLower(str);
}

function lowerFirst(str: string): string {
  return lodash.lowerFirst(str);
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
  lowerFirst,
};

export { strings, SkStrings };
