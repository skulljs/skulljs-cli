import fileWatcher from './watchForFiles.js';
import updateFileSystem from './updateFileSystem.js';
import { SkProxyHandler } from '@src/types/toolbox/saveLog/SkProxyHandler';
import { Toolbox } from '../../toolbox.js';
import { ArgsTypes } from '@src/types/toolbox/saveLog/funcParams';
import { FsAction } from './fsAction.js';

class SaveFiles {
  classAlias = false;

  proxyHandle: SkProxyHandler<any> = {
    main: this,
    apply: async function (target, scope, args: ArgsTypes[]) {
      if (!args.slice(-1).pop()?.target) {
        const isDbCommand = this.main.isDbCommand();
        const watcher = await fileWatcher();
        watcher.on('all', (event, path, stats) => {
          switch (event) {
            case 'change':
              {
                if (!isDbCommand) updateFileSystem(path, FsAction.Update, stats);
              }
              break;
            case 'add':
              {
                if (!isDbCommand) {
                  updateFileSystem(path, FsAction.Create, stats);
                  return;
                }
                const cjsPath = path.replace('.js', '.cjs');
                let action = FsAction.Create;
                if (this.main.toolbox.fileSystem.exists(cjsPath)) {
                  action = FsAction.Update;
                }
                updateFileSystem(cjsPath, action, stats);
              }
              break;
          }
        });
        const results = await target.bind(this.main)(...args);

        await watcher.close();

        return results;
      }
      const dir = args
        .slice(-1)
        .pop()!
        .target!.replace(/$(\/)*/g, '');
      const overwrite = await this.main.toolbox.fileSystem.existsAsync(dir);

      let action: FsAction = FsAction.Create;

      const providedAction: FsAction = args.slice(-1).pop()?.action;

      if (providedAction) {
        action = providedAction;
      } else if (overwrite != false) {
        action = FsAction.Update;
      }

      // here we bind method with our class by accessing reference to instance
      const results = await target.bind(this.main)(...args);

      updateFileSystem(dir, action);

      return results;
    },
  };
  toolbox: Toolbox;
  filesSize: number | null;
  databaseCommands: string[];

  constructor(toolbox: Toolbox) {
    // Get all methods of choosen class
    let methods = Object.getOwnPropertyNames(this.constructor.prototype);

    // Find and remove constructor as we don't need Proxy on it
    let consIndex = methods.indexOf('constructor');
    if (consIndex > -1) methods.splice(consIndex, 1);

    this.toolbox = toolbox;
    this.filesSize = null;
    this.databaseCommands = ['initdb', 'database'];

    // Replace all methods with Proxy methods
    methods.forEach((methodName) => {
      this[methodName as keyof typeof this] = new Proxy(this[methodName as keyof typeof this], this.proxyHandle);
    });
  }
  isDbCommand() {
    const command = this.toolbox.command;
    return this.databaseCommands.includes(command!.name());
  }
}

export default SaveFiles;
