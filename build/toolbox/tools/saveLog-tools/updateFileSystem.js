import toolbox from '../../toolbox.js';
import getTotalSize from './findPathSize.js';
const filesCreated = {};
/**
 * Update toolbox.fileSystemUpdates with new or updated files
 * @param filePath path to file
 * @param action string - created or updated
 */
function updateFileSystem(filePath, action, stats) {
    const { project: { project_def }, fileSystem, path, } = toolbox;
    let readablePath = filePath;
    if (project_def) {
        let foundRoot = false;
        const projectRoot = path.basename(path.dirname(project_def));
        const reducePath = filePath.split(fileSystem.separator).reduce((readableArray, currentValue) => {
            if (currentValue == projectRoot)
                foundRoot = true;
            if (foundRoot)
                readableArray.push(currentValue);
            return readableArray;
        }, []);
        readablePath = path.join(...reducePath);
    }
    const size = getTotalSize(filePath, stats);
    const systemUpdate = { action: action, path: readablePath, size: size };
    !Array.isArray(toolbox.fileSystemUpdates) ? (toolbox.fileSystemUpdates = [systemUpdate]) : toolbox.fileSystemUpdates.push(systemUpdate);
}
export default updateFileSystem;
