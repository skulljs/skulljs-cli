import { fileSystem } from './filesystem-tools.js';
function insertNextToPattern(data, opts) {
    // Insert before/after a particular string
    const findPattern = opts.before || opts.after;
    // sanity check the findPattern
    const patternIsString = typeof findPattern === 'string';
    if (!(findPattern instanceof RegExp) && !patternIsString)
        return false;
    const isPatternFound = isPatternIncluded(data, findPattern);
    if (!isPatternFound)
        return false;
    const originalString = patternIsString ? findPattern : data.match(findPattern)[0] || '';
    const newContents = opts.after ? `${originalString}${opts.insert || ''}` : `${opts.insert || ''}${originalString}`;
    return data.replace(findPattern, newContents);
}
function isPatternIncluded(data, findPattern) {
    if (!findPattern)
        return false;
    return typeof findPattern === 'string' ? data.includes(findPattern) : findPattern.test(data);
}
async function readFile(filename) {
    // bomb if the file doesn't exist
    if (!fileSystem.isFile(filename))
        throw new Error(`file not found ${filename}`);
    // check type of file (JSON or not)
    if (filename.endsWith('.json')) {
        return fileSystem.readAsync(filename, 'json');
    }
    else {
        const read = fileSystem.readAsync(filename, 'utf8');
        if (!read)
            throw new Error('File could not be read !');
        return read;
    }
}
/**
 * Updates a text file or json config file. Async.
 *
 * @param filename File to be modified.
 * @param callback Callback function for modifying the contents of the file.
 */
async function update(filename, callback) {
    const contents = await readFile(filename);
    // let the caller mutate the contents in memory
    const mutatedContents = callback(contents);
    // only write if they actually sent back something to write
    if (mutatedContents !== false) {
        await fileSystem.writeAsync(filename, mutatedContents, { atomic: true });
    }
    return mutatedContents;
}
function patchString(data, opts = {}) {
    // Already includes string, and not forcing it
    if (isPatternIncluded(data, opts.insert) && !opts.force)
        return false;
    // delete <string> is the same as replace <string> + insert ''
    const replaceString = opts.delete || opts.replace;
    if (replaceString) {
        if (!isPatternIncluded(data, replaceString))
            return false;
        // Replace matching string with new string or nothing if nothing provided
        return data.replace(replaceString, `${opts.insert || ''}`);
    }
    else {
        return insertNextToPattern(data, opts);
    }
}
async function patch(filename, ...opts) {
    return update(filename, (data) => {
        const result = opts.reduce((updatedData, opt) => patchString(updatedData, opt) || updatedData, data);
        return result !== data && result;
    });
}
const patching = {
    patch,
};
export { patching };
