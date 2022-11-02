import SaveFiles from '@src/extensions/toolbox/saveLog-tools/saveFiles.js';

export interface SkProxyHandler<T> extends ProxyHandler<T> {
  main: SaveFiles;
}
