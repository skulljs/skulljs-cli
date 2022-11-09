import toolbox from '@src/toolbox/toolbox.js';
import { BackendVariables, FrontendVariables, GenerateProps } from '@src/types/commands/route-create';
import ts from 'typescript';
import { nestAppModuleTransformer } from '../fileUpdate/nestAppModuleTransformer.js';
import slash from 'slash';

const { command, saveLog, fileSystem, exit, path } = toolbox;

export async function postGenerationBackendScript(skulljs_repository: string, backend_variables: BackendVariables, props: GenerateProps) {
  switch (skulljs_repository) {
    case 'nestjs':
      await postGenerationNestJsScript(backend_variables, props);
      break;

    default:
      exit(command, `backend repository ${skulljs_repository} not implemented yet !`);
      break;
  }
}

async function postGenerationNestJsScript(backend_variables: BackendVariables, props: GenerateProps) {
  const app_module_path = path.join(backend_variables.backend_src_folder, 'app.module.ts');
  if (fileSystem.exists(app_module_path)) {
    const program = ts.createProgram({
      options: {
        target: ts.ScriptTarget.ES2015,
      },
      rootNames: [app_module_path],
    });

    const sourceFile = program.getSourceFile(app_module_path);

    if (!sourceFile) return;

    let relativePath = slash(path.relative(path.dirname(app_module_path), path.join(props.backend_route_folder, `${props.route_name_pLf}.module`)));
    if (!['.', '/'].includes(relativePath[0])) {
      relativePath = './' + relativePath;
    }

    const transformationResult = ts.transform(sourceFile, [
      nestAppModuleTransformer({
        moduleName: `${props.route_name_pUcfirst}Module`,
        modulePath: relativePath,
      }),
    ]);
    const transformedSourceFile = transformationResult.transformed[0];
    await saveLog.write({ target: app_module_path, content: ts.createPrinter().printFile(transformedSourceFile), options: { atomic: true } });
  }
}

export function postGenerationFrontendScript(skulljs_repository: string, frontend_variables: FrontendVariables, props: GenerateProps) {
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
