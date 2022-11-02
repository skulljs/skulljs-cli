import * as url from 'url';

function convertPath(path: string): url.URL {
  return url.pathToFileURL(path);
}
function convertUrl(urls: url.URL): string {
  return url.fileURLToPath(urls);
}
export { convertPath, convertUrl };
