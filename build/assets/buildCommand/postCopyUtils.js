import toolbox from '../../toolbox/toolbox.js';
import { nestMainTransformer } from '../transformers/build/nest/mainHttps.js';
import { nestMainTransformerLogs } from '../transformers/build/nest/mainLogs.js';
import { nestAppModuleBuildTransformer } from '../transformers/build/nest/appModuleStatic.js';
import { nestConfigurationTransformer } from '../transformers/build/nest/configuration.js';
import { getTsProgram, transformAndWrite } from '../../utils/tsCompilerUtils.js';
const { command, exit, path, fileSystem, saveLog } = toolbox;
export async function postCopyBackendScript(backend, output_path, buildProps) {
    switch (backend.skulljs_repository) {
        case 'nestjs':
            await postCopyNestjsScript(backend.path, output_path, buildProps);
            break;
        default:
            exit(command, `backend repository ${backend.skulljs_repository} not implemented yet !`);
            break;
    }
}
async function postCopyNestjsScript(backend_path, output_path, buildProps) {
    // Set all files path to be modified
    const mainFile = path.join(output_path, 'src/main.js');
    const appModuleFile = path.join(output_path, 'src/app.module.js');
    const configurationFile = path.join(output_path, 'src/configs/configuration.js');
    // Get the Ts Compiler api program
    const program = getTsProgram([
        {
            path: mainFile,
            sourceName: 'MainSource',
        },
        {
            path: appModuleFile,
            sourceName: 'AppModuleSource',
        },
        {
            path: configurationFile,
            sourceName: 'ConfigSource',
        },
    ]);
    // If protocol is https transform src/main.js file
    if (buildProps.protocol === 'https') {
        await transformAndWrite({
            path: mainFile,
            source: program.sourceFiles['MainSource'],
        }, [nestMainTransformer(program.checker), nestMainTransformerLogs(program.checker)]);
    }
    // Transform src/app.module.js file
    await transformAndWrite({
        path: appModuleFile,
        source: program.sourceFiles['AppModuleSource'],
    }, [nestAppModuleBuildTransformer(program.checker)]);
    // Transform src/configs/configuration.js file
    await transformAndWrite({
        path: configurationFile,
        source: program.sourceFiles['ConfigSource'],
    }, [nestConfigurationTransformer(buildProps, program.checker)]);
}
export async function postCopyFrontendScript(frontend, output_path, buildProps) {
    switch (frontend.skulljs_repository) {
        case 'angular':
            break;
        default:
            exit(command, `frontend repository ${frontend.skulljs_repository} not implemented yet !`);
            break;
    }
}
export default {
    postCopyBackendScript,
    postCopyFrontendScript,
};
