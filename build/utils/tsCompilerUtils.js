import ts from 'typescript';
import toolbox from '../toolbox/toolbox.js';
/**
 *	Transform a file then write the modification to the disk
 * @param sourceFile File to be transformed
 * @param transformers Array od ts transformers used to process the transformation
 * @param saveLog Default to false, display transformed files int the console after the command
 * @returns Promise<void>
 */
async function transformAndWrite(sourceFile, transformers, saveLog = false) {
    const transformation = ts.transform(sourceFile.source, transformers);
    const transformedResult = transformation.transformed[0];
    if (saveLog) {
        return await toolbox.saveLog.write({ target: sourceFile.path, content: ts.createPrinter().printFile(transformedResult), options: { atomic: true } });
    }
    return await toolbox.fileSystem.writeAsync(sourceFile.path, ts.createPrinter().printFile(transformedResult), { atomic: true });
}
/**
 * Create a ts compiler program object
 * @param files Files to be included in the program
 * @returns A ProgramResult Object to be used to transform files with ts compiler api
 */
function getTsProgram(files) {
    const filesPath = files.map((file) => file.path);
    const fileNotExists = filesPath.some((path) => {
        if (!toolbox.fileSystem.exists(path))
            return true;
        return false;
    });
    if (fileNotExists)
        toolbox.exit(toolbox.command, `Files do not exist in ${filesPath}`);
    const program = ts.createProgram(filesPath, {
        allowJs: true,
        target: ts.ScriptTarget.ES2017,
    });
    const sourceFiles = files.reduce((sources, file) => {
        return { ...sources, [file.sourceName]: program.getSourceFile(file.path) };
    }, {});
    const sourcesNotExists = Object.values(sourceFiles).some((source) => {
        if (!source)
            return true;
        return false;
    });
    if (sourcesNotExists)
        toolbox.exit(toolbox.command, `Sources do not exist in ${Object.values(sourceFiles)}`);
    const checker = program.getTypeChecker();
    return {
        program,
        sourceFiles: sourceFiles,
        checker,
    };
}
export { transformAndWrite, getTsProgram };
