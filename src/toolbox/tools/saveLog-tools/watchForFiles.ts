import Project from '@src/types/project';
import chokidar, { FSWatcher } from 'chokidar';
import toolbox from '../../toolbox.js';
/**
 * Used to find new or updated files created by commands that we don't know before running it
 * @returns file watcher
 */
function watcher(): Promise<FSWatcher> {
  return new Promise((resolve, reject) => {
    const { commands, command, path, project } = toolbox;

    const commandFile = commands[command!.name()];
    const toWatch = commandFile.foldersToWatch;
    let dirs: string[] = [];
    const watcher = chokidar.watch(dirs, {
      ignoreInitial: true,
      persistent: false,
      alwaysStat: true,
    });
    if (toWatch) {
      for (let folder in toWatch) {
        const newRoutes = toWatch[folder as keyof typeof toWatch]!.map((file) => {
          const projectPath: string = project[`${folder}_path` as keyof Project] as string;
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
