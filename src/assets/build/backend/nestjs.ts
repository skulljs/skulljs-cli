import { RepositorySkJson } from '@src/types/project';
import { BuildUtils } from '../buildUtils.js';
import { getTsProgram, transformAndWrite } from '@src/utils/tsCompilerUtils.js';
import { getApiPrefix } from '@src/assets/transformers/build/nest/apiPrefix.js';
import { BuildProps, ManagerProps } from '@src/types/commands/build';
import { nestMainTransformer } from '@src/assets/transformers/build/nest/mainHttps.js';
import { nestMainTransformerLogs } from '@src/assets/transformers/build/nest/mainLogs.js';
import { nestAppModuleBuildTransformer } from '@src/assets/transformers/build/nest/appModuleStatic.js';
import { nestConfigurationTransformer } from '@src/assets/transformers/build/nest/configuration.js';
import ts from 'typescript';
import toolbox from '@src/toolbox/toolbox.js';

const { template, system, path, fileSystem, exit } = toolbox;

export class Nestjs extends BuildUtils {
  async postCopyScript(repository: RepositorySkJson, output_path: string, buildProps: BuildProps): Promise<void> {
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
  async copyFiles(repository: RepositorySkJson, output_path: string, protocol?: string): Promise<void> {
    await fileSystem.copyAsync(repository.path, output_path, {
      matching: ['./@(.env|LICENSE|package-lock.json|package.json)', 'prisma/**/*', 'templates/**/*', 'dist/**/*'],
    });
    await fileSystem.renameAsync(path.join(output_path, 'dist'), 'src');

    if (protocol == 'https') {
      const sslcert_path = path.join(repository.path, '../sslcert');
      await fileSystem.copyAsync(sslcert_path, path.join(output_path, 'sslcert'), { matching: ['./**/*.pem'] });
    }
  }
  async build(project: RepositorySkJson, buildProps?: BuildProps): Promise<void> {
    const localCli = system.getLocalCli(project, toolbox);
    await system.run('node', `${localCli.cli} build`, {
      cwd: localCli.cwd,
    });
  }
  getBackendAppPrefix(backend: RepositorySkJson): string {
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
  async generateManagerFiles(output_path: string, manager: string, app_name: string, port: number): Promise<void> {
    const props: ManagerProps = { app_name: app_name, script_path: './src/main.js', port: port, dockerfile_opt_runs: ['RUN npx prisma generate'] };
    switch (manager) {
      case 'pm2':
        {
          await template.generate({
            template: 'build/pm2/pm2.ecosystem.json.ejs',
            target: `${output_path}/pm2.ecosystem.json.ejs`.replace('.ejs', ''),
            props: props,
          });
        }
        break;
      case 'docker':
        {
          await template.generate({
            template: 'build/docker/.dockerignore.ejs',
            target: `${output_path}/.dockerignore.ejs`.replace('.ejs', ''),
            props: props,
          });
          await template.generate({
            template: 'build/docker/docker-compose.yml.ejs',
            target: `${output_path}/docker-compose.yml.ejs`.replace('.ejs', ''),
            props: props,
          });
          await template.generate({
            template: 'build/docker/Dockerfile.ejs',
            target: `${output_path}/Dockerfile.ejs`.replace('.ejs', ''),
            props: props,
          });
        }
        break;
    }
  }
}
