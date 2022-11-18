import fs from 'node:fs';
import path from 'path';
/**
 * Get all files stats from a path (file or directory)
 * @param Path path to the directory or file
 * @param arrayOfFiles initial files stats
 * @returns Array of files with stats
 */
const getAllFiles = function (Path, arrayOfFiles = []) {
    if (!fs.statSync(Path).isDirectory())
        return [Path];
    const files = fs.readdirSync(Path);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(Path, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(Path, file), arrayOfFiles);
        }
        else {
            arrayOfFiles.push(path.join(Path, file));
        }
    });
    return arrayOfFiles;
};
/**
 * Determine total size of path
 * @param directoryPath path to check
 * @returns Total size
 */
const getTotalSize = function (directoryPath, stats) {
    if (stats) {
        return stats.size;
    }
    const arrayOfFiles = getAllFiles(directoryPath);
    let totalSize = 0;
    arrayOfFiles.forEach(function (filePath) {
        totalSize += fs.statSync(filePath).size;
    });
    return totalSize;
};
export default getTotalSize;
