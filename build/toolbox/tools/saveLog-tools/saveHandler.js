import fileWatcher from './watchForFiles.js';
import updateFileSystem from './updateFileSystem.js';
import { FsAction } from './fsAction.js';
class SaveHandler {
    constructor(toolbox) {
        this.classAlias = false;
        this.proxyHandle = {
            main: this,
            apply: async function (target, scope, args) {
                if (!args.slice(-1).pop()?.target) {
                    const watcher = await fileWatcher();
                    watcher.on('all', (event, path, stats) => {
                        switch (event) {
                            case 'change':
                                {
                                    updateFileSystem(path, FsAction.Update, stats);
                                }
                                break;
                            case 'add':
                                {
                                    updateFileSystem(path, FsAction.Create, stats);
                                }
                                break;
                        }
                    });
                    const results = await target.bind(this.main)(...args);
                    await watcher.close();
                    return results;
                }
                const dir = this.main.toolbox.fileSystem.path(args
                    .slice(-1)
                    .pop()
                    .target.replace(/$(\/)*/g, ''));
                const overwrite = await this.main.toolbox.fileSystem.existsAsync(dir);
                let action = FsAction.Create;
                const providedAction = args.slice(-1).pop()?.action;
                if (providedAction) {
                    action = providedAction;
                }
                else if (overwrite != false) {
                    action = FsAction.Update;
                }
                // here we bind method with our class by accessing reference to instance
                const results = await target.bind(this.main)(...args);
                updateFileSystem(dir, action);
                return results;
            },
        };
        // Get all methods of choosen class
        let methods = Object.getOwnPropertyNames(this.constructor.prototype);
        // Find and remove constructor as we don't need Proxy on it
        let consIndex = methods.indexOf('constructor');
        if (consIndex > -1)
            methods.splice(consIndex, 1);
        this.toolbox = toolbox;
        this.filesSize = null;
        // Replace all methods with Proxy methods
        methods.forEach((methodName) => {
            this[methodName] = new Proxy(this[methodName], this.proxyHandle);
        });
    }
}
export default SaveHandler;
