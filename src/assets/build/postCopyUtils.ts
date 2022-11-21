import toolbox from '@src/toolbox/toolbox.js';
import { RepositorySkJson } from '@src/types/project';
import { nestMainTransformer } from '../transformers/build/nest/mainHttps.js';
import { nestMainTransformerLogs } from '../transformers/build/nest/mainLogs.js';
import { nestAppModuleBuildTransformer } from '../transformers/build/nest/appModuleStatic.js';
import { BuildProps } from '@src/types/commands/build.js';
import { nestConfigurationTransformer } from '../transformers/build/nest/configuration.js';
import { getTsProgram, transformAndWrite } from '@src/utils/tsCompilerUtils.js';

const { exit, path, fileSystem } = toolbox;

export async function postCopyBackendScript(backend: RepositorySkJson, output_path: string, buildProps: BuildProps) {
  switch (backend.skulljs_repository) {
    case 'nestjs':
      await postCopyNestjsScript(backend.path, output_path, buildProps);
      break;

    default:
      exit(toolbox.command, `backend repository ${backend.skulljs_repository} not implemented yet !`);
      break;
  }
}

async function postCopyNestjsScript(backend_path: string, output_path: string, buildProps: BuildProps) {
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
    const sslcert_path = path.join(output_path, 'sslcert');
    const key_array = await fileSystem.findAsync(sslcert_path, {
      matching: '*.key.pem',
    });
    if (key_array.length != 1) {
      exit(toolbox.command, 'Found zero or multiple key.pem files, did you put it in the sslcert folder ?');
    }
    const key = path.basename(key_array[0]);
    const cert_array = await fileSystem.findAsync(sslcert_path, {
      matching: '*.cert.pem',
    });
    if (cert_array.length != 1) {
      exit(toolbox.command, 'Found zero or multiple cert.pem files, did you put it in the sslcert folder ?');
    }
    const cert = path.basename(cert_array[0]);
    await transformAndWrite(
      {
        path: mainFile,
        source: program.sourceFiles['MainSource'],
      },
      [nestMainTransformer({ key: key, cert: cert }, program.checker), nestMainTransformerLogs(program.checker)]
    );
  }

  // Transform src/app.module.js file

  await transformAndWrite(
    {
      path: appModuleFile,
      source: program.sourceFiles['AppModuleSource'],
    },
    [nestAppModuleBuildTransformer(program.checker)]
  );

  // Transform src/configs/configuration.js file

  await transformAndWrite(
    {
      path: configurationFile,
      source: program.sourceFiles['ConfigSource'],
    },
    [nestConfigurationTransformer(buildProps, program.checker)]
  );
}

export async function postCopyFrontendScript(frontend: RepositorySkJson, output_path: string, buildProps: BuildProps) {
  switch (frontend.skulljs_repository) {
    case 'angular':
      break;

    default:
      exit(toolbox.command, `frontend repository ${frontend.skulljs_repository} not implemented yet !`);
      break;
  }
}

export default {
  postCopyBackendScript,
  postCopyFrontendScript,
};
