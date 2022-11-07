import { FSJetpack } from 'fs-jetpack/types';
export interface SkFileSystem extends FSJetpack {
  /**
   * Is this a file?
   * @param path The filename to check.
   * @returns `true` if the file exists and is a file, otherwise `false`.
   */
  isFile(path: string): boolean;
  /**
   * Is this a directory?
   * @param path The filename to check.
   * @returns `true` if the directory exists and is a directory, otherwise `false`.
   */
  isDirectory(path: string): boolean;
  /**
   * Os file separator
   */
  separator: string;
}
