import SaveHandler from '@src/toolbox/tools/saveLog-tools/saveHandler.js';

export interface SkProxyHandler<T> extends ProxyHandler<T> {
  main: SaveHandler;
}
