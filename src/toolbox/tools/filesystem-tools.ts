import { SkFileSystem } from '@src/types/toolbox/fileSystem-tools';
import jetpack from 'fs-jetpack';
import path from 'path';

/**
 * Is this a file?
 * @param path The filename to check.
 * @returns `true` if the file exists and is a file, otherwise `false`.
 */
function isFile(path: string): boolean {
  return jetpack.exists(path) === 'file';
}

/**
 * Is this a directory?
 * @param path The filename to check.
 * @returns `true` if the directory exists and is a directory, otherwise `false`.
 */
function isDirectory(path: string): boolean {
  return jetpack.exists(path) === 'dir';
}

/**
 * Os file separator
 */
const separator = path.sep;

const fileSystem: SkFileSystem = {
  ...jetpack,
  isFile,
  isDirectory,
  separator,
};

export { fileSystem, SkFileSystem };
