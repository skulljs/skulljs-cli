import jetpack from 'fs-jetpack';
import path from 'path';
function isFile(path) {
    return jetpack.exists(path) === 'file';
}
function isDirectory(path) {
    return jetpack.exists(path) === 'dir';
}
const separator = path.sep;
const fileSystem = {
    ...jetpack,
    isFile,
    isDirectory,
    separator,
};
export { fileSystem };
