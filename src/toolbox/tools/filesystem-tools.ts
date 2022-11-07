import { SkFileSystem } from '@src/types/toolbox/fileSystem-tools';
import jetpack from 'fs-jetpack';
import path from 'path';

function isFile(path: string): boolean {
  return jetpack.exists(path) === 'file';
}

function isDirectory(path: string): boolean {
  return jetpack.exists(path) === 'dir';
}

const separator = path.sep;

const fileSystem: SkFileSystem = {
  ...jetpack,
  isFile,
  isDirectory,
  separator,
};

export { fileSystem, SkFileSystem };
