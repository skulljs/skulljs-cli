import toolbox from '@src/toolbox/toolbox.js';
import { BackendVariables, FrontendVariables, GenerateProps } from '@src/types/commands/route-create';
import { nestAppModuleTransformer } from '../transformers/routes/nest/appModuleRouteImport.js';
import slash from 'slash';
import { getTsProgram, transformAndWrite } from '@src/utils/tsCompilerUtils.js';

const { exit, path } = toolbox;

export async function postGenerationBackendScript(skulljs_repository: string, backend_variables: BackendVariables, props: GenerateProps) {
  switch (skulljs_repository) {
    case 'nestjs':
      await postGenerationNestJsScript(backend_variables, props);
      break;

    default:
      exit(toolbox.command, `backend repository ${skulljs_repository} not implemented yet !`);
      break;
  }
}

async function postGenerationNestJsScript(backend_variables: BackendVariables, props: GenerateProps) {
  const app_module_path = path.join(backend_variables.backend_src_folder, 'app.module.ts');

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

  await transformAndWrite(
    {
      path: app_module_path,
      source: program.sourceFiles['AppModuleSource'],
    },
    [
      nestAppModuleTransformer(
        {
          moduleName: `${props.route_name_pUcfirst}Module`,
          modulePath: relativePath,
        },
        program.checker
      ),
    ],
    true
  );
}

export function postGenerationFrontendScript(skulljs_repository: string, frontend_variables: FrontendVariables, props: GenerateProps) {
  switch (skulljs_repository) {
    case 'angular':
      break;

    default:
      exit(toolbox.command, `backend repository ${skulljs_repository} not implemented yet !`);
      break;
  }
}

export default {
  postGenerationBackendScript,
  postGenerationFrontendScript,
};
