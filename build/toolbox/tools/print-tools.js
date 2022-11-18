import chalk from 'chalk';
function info(message) {
    console.log(chalk.blue.bold(message));
}
function infoLoader(message, loaderOptions = {}) {
    loaderOptions = {
        prefixText: chalk.blue.bold(`${message} `),
        ...loaderOptions,
    };
    return loaderOptions;
}
function error(message) {
    console.log(chalk.red.bold(message));
}
function warn(message) {
    console.log(chalk.yellow.bold(message));
}
function log(message) {
    console.log(message);
}
const print = {
    info,
    infoLoader,
    error,
    warn,
    log,
    chalk,
};
export { print };
