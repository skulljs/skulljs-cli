import * as url from 'url';
function convertPath(path) {
    return url.pathToFileURL(path);
}
function convertUrl(urls) {
    return url.fileURLToPath(urls);
}
export { convertPath, convertUrl };
