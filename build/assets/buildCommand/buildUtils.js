import toolbox from '../../toolbox/toolbox.js';
import { getTsProgram, transformAndWrite } from '../../utils/tsCompilerUtils.js';
import ts from 'typescript';
import { ngProdEnvTransformer } from '../transformers/build/angular/prodEnv.js';
import { getApiPrefix } from '../transformers/build/nest/apiPrefix.js';
const { exit, system, path, fileSystem } = toolbox;
export async function buildBackend(backend) {
    switch (backend.skulljs_repository) {
        case 'nestjs':
            await buildNestJs(backend);
            break;
        default:
            exit(toolbox.command, `backend repository ${backend.skulljs_repository} not implemented yet !`);
            break;
    }
}
async function buildNestJs(backend) {
    const localCli = system.getLocalCli(backend, toolbox);
    await system.run('node', `${localCli.cli} build`, {
        cwd: localCli.cwd,
    });
}
function getBackendAppPrefix(backend) {
    switch (backend.skulljs_repository) {
        case 'nestjs':
            return getNestApiPrefix(backend);
        default:
            exit(toolbox.command, `backend repository ${backend.skulljs_repository} not implemented yet !`);
            break;
    }
    return '';
}
function getNestApiPrefix(backend) {
    // Set all files path to be modified
    const configFile = path.join(backend.path, 'src/configs/configuration.ts');
    // Get the Ts Compiler api program
    const program = getTsProgram([
        {
            path: configFile,
            sourceName: 'ConfigSource',
        },
    ]);
    let prefix = '';
    ts.transform(program.sourceFiles['ConfigSource'], [
        getApiPrefix((apiPrefix) => {
            prefix = apiPrefix;
        }, program.checker),
    ]);
    return prefix;
}
export async function buildFrontend(frontend, buildProps) {
    switch (frontend.skulljs_repository) {
        case 'angular':
            await buildAngular(frontend, buildProps);
            break;
        default:
            exit(toolbox.command, `frontend repository ${frontend.skulljs_repository} not implemented yet !`);
            break;
    }
}
async function buildAngular(frontend, buildProps) {
    const prefix = getBackendAppPrefix(toolbox.project.backend);
    // Set all files path to be modified
    const envFile = path.join(frontend.path, 'src/environments/environment.prod.ts');
    // Get the Ts Compiler api program
    const program = getTsProgram([
        {
            path: envFile,
            sourceName: 'EnvSource',
        },
    ]);
    // Transform src/environments/environment.prod.ts file
    await transformAndWrite({
        path: envFile,
        source: program.sourceFiles['EnvSource'],
    }, [
        ngProdEnvTransformer({
            ...buildProps,
            apiPrefix: prefix,
        }, program.checker),
    ]);
    const localCli = system.getLocalCli(frontend, toolbox);
    await system.run('node', `${localCli.cli} build --configuration=production --delete-output-path`, {
        cwd: localCli.cwd,
    });
}
export default {
    buildBackend,
    buildFrontend,
};
