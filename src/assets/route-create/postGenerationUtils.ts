import toolbox from '@src/toolbox/toolbox.js';
import { BackendVariables, FrontendVariables, GenerateProps } from '@src/types/commands/route-create';

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
    let app_module_file = fileSystem.read(app_module_path) as string;
    const import_marker_string = "import { configuration } from './configs/configuration';";
    const import_string = `import { ${props.route_name_pUcfirst}Module } from './routes/${props.route_name_pLf}/${props.route_name_pLf}.module';`;
    if (!app_module_file.includes(import_string)) {
      const import_replace_string = `${import_marker_string}\n${import_string}`;
      app_module_file = app_module_file.replace(import_marker_string, import_replace_string);
      const import_array_marker_string = '    ConfigModule.forRoot({ load: [configuration], ignoreEnvFile: true, isGlobal: true }),';
      const import_array_string = `    ${props.route_name_pUcfirst}Module,`;
      const import_array_replace_string = `${import_array_string}\n${import_array_marker_string}`;
      app_module_file = app_module_file.replace(import_array_marker_string, import_array_replace_string);
    }
    await saveLog.write({ target: app_module_path, content: app_module_file });
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
