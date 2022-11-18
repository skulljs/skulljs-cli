import { is, trim } from './utils.js';
import lodash from 'lodash';
import pluralize from 'pluralize';
const { kebabCase } = lodash;
function isNotString(value) {
    return !is(String, value);
}
function isBlank(value) {
    return isNotString(value) || trim(value) === '';
}
function upperFirst(str) {
    return lodash.upperFirst(str);
}
function singular(str) {
    return pluralize.singular(str);
}
function plural(str) {
    return pluralize.plural(str);
}
function upperCase(str) {
    return lodash.toUpper(str);
}
function lowerCase(str) {
    return lodash.toLower(str);
}
function lowerFirst(str) {
    return lodash.lowerFirst(str);
}
const strings = {
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
export { strings };
