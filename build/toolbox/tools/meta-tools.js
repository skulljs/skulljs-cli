import { fileSystem } from './filesystem-tools.js';
import path from 'path';
import url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// Get cli version
function findVersion() {
    const packageJson = fileSystem.read(`${__dirname}/../../../package.json`, 'json');
    return packageJson.version;
}
const version = findVersion();
const directory = path.join(__dirname, '../..');
const meta = {
    version,
    directory,
};
export { meta };
