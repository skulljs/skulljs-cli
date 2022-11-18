import toolbox from '../../toolbox/toolbox.js';
import { nestAppModuleTransformer } from '../transformers/routes/nest/appModuleRouteImport.js';
import slash from 'slash';
import { getTsProgram, transformAndWrite } from '../../utils/tsCompilerUtils.js';
const { command, saveLog, fileSystem, exit, path } = toolbox;
export async function postGenerationBackendScript(skulljs_repository, backend_variables, props) {
    switch (skulljs_repository) {
        case 'nestjs':
            await postGenerationNestJsScript(backend_variables, props);
            break;
        default:
            exit(command, `backend repository ${skulljs_repository} not implemented yet !`);
            break;
    }
}
async function postGenerationNestJsScript(backend_variables, props) {
    const app_module_path = path.join(backend_variables.backend_src_folder, 'app.crotte.ts');
    const program = getTsProgram([
        {
            path: app_module_path,
            sourceName: 'AppModuleSource',
        },
    ]);
    let relativePath = slash(path.relative(path.dirname(app_module_path), path.join(props.backend_route_folder, `${props.route_name_pLf}.module`)));
    if (!['.', '/'].includes(relativePath[0])) {
        relativePath = './' + relativePath;
    }
    await transformAndWrite({
        path: app_module_path,
        source: program.sourceFiles['AppModuleSource'],
    }, [
        nestAppModuleTransformer({
            moduleName: `${props.route_name_pUcfirst}Module`,
            modulePath: relativePath,
        }, program.checker),
    ], true);
}
export function postGenerationFrontendScript(skulljs_repository, frontend_variables, props) {
    switch (skulljs_repository) {
        case 'angular':
            break;
        default:
            exit(command, `backend repository ${skulljs_repository} not implemented yet !`);
            break;
    }
}
export default {
    postGenerationBackendScript,
    postGenerationFrontendScript,
};
