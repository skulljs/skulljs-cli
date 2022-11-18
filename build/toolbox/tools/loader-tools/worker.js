import { spawn } from 'node:child_process';
import path from 'path';
import url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
/**
 * @class Loader
 * Creates a new ora loader to be used in the toolbox
 */
class Loader {
    /**
     * Start the loader
     * @param loaderOptions Ora loader Options
     */
    start(loaderOptions = {}) {
        const options = {
            stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
        };
        const loaderPath = path.join(__dirname, 'loader.js');
        this.worker = spawn('node', [loaderPath, JSON.stringify(loaderOptions)], options);
    }
    /**
     * Stop the loader, change it to a green `✔`
     * @returns Promise<void>
     */
    succeed() {
        return new Promise((resolve, reject) => {
            if (!this.worker)
                reject();
            this.worker?.on('message', (m) => {
                this.worker = undefined;
                resolve();
            });
            this.worker?.send('succeed');
        });
    }
    /**
     * Stop the loader, change it to a green `✖`
     * @returns Promise<void>
     */
    fail() {
        return new Promise((resolve, reject) => {
            if (!this.worker)
                reject();
            this.worker?.on('message', (m) => {
                this.worker = undefined;
                resolve();
            });
            this.worker?.send('fail');
        });
    }
    /**
     * Check if the loader is spinning
     * @returns loader process if exist
     */
    isSpinning() {
        return this.worker;
    }
}
function buildLoader() {
    return new Loader();
}
export { buildLoader, Loader };
