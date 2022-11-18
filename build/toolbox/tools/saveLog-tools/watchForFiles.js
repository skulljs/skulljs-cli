import chokidar from 'chokidar';
import toolbox from '../../toolbox.js';
/**
 * Used to find new or updated files created by commands that we don't know before running it
 * @returns file watcher
 */
function watcher() {
    return new Promise((resolve, reject) => {
        const { commands, command, path, project } = toolbox;
        const commandFile = commands[command.name()];
        const toWatch = commandFile.foldersToWatch;
        let dirs = [];
        const watcher = chokidar.watch(dirs, {
            ignoreInitial: true,
            persistent: false,
            alwaysStat: true,
        });
        if (toWatch) {
            for (let folder in toWatch) {
                const newRoutes = toWatch[folder].map((file) => {
                    const projectPath = project[`${folder}_path`];
                    return path.join(projectPath, file);
                });
                dirs = [...dirs, ...newRoutes];
            }
        }
        watcher.add(dirs);
        resolve(watcher);
    });
}
export default watcher;
