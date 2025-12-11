import { ProjectUse, RepositorySkJson } from '@src/types/project';
import { BuildUtils } from '../buildUtils.js';
import { getTsProgram, transformAndWrite } from '@src/utils/tsCompilerUtils.js';
import { BuildProps } from '@src/types/commands/build';
import { BuildFactory } from '../buildFactory.js';
import { ngProdEnvTransformer } from '@src/assets/transformers/build/angular/prodEnv.js';
import toolbox from '@src/toolbox/toolbox.js';

const { system, path, fileSystem } = toolbox;

export class Angular extends BuildUtils {
  async postCopyScript(repository: RepositorySkJson, output_path: string, buildProps: BuildProps, isFrontendSSR: boolean): Promise<void> {}
  async copyFiles(repository: RepositorySkJson, output_path: string, protocol?: string): Promise<void> {
    if (await fileSystem.existsAsync(path.join(repository.path, 'dist', 'browser'))) {
      // NEW ANGULAR VERSION

      // WITH SSR
      if (await this.isFrontendSSR(repository)) {
        await fileSystem.copyAsync(path.join(repository.path, 'dist', 'browser'), path.join(output_path, 'src/front-ssr', 'browser'));
        await fileSystem.copyAsync(path.join(repository.path, 'dist', 'server'), path.join(output_path, 'src/front-ssr',  'server'));
        await fileSystem.copyAsync(path.join(repository.path, 'dist', '3rdpartylicenses.txt'), path.join(output_path, 'src/front-ssr', '3rdpartylicenses.txt'));
        await fileSystem.copyAsync(path.join(repository.path, 'dist', 'prerendered-routes.json'), path.join(output_path, 'src/front-ssr', 'prerendered-routes.json'));
      } else {
        // WITHOUT SSR
        await fileSystem.copyAsync(path.join(repository.path, 'dist', 'browser'), path.join(output_path, 'src/public'));
        await fileSystem.copyAsync(path.join(repository.path, 'dist', '3rdpartylicenses.txt'), path.join(output_path, 'src/public', '3rdpartylicenses.txt'));
      }
    } else {
      // OLD ANGULAR VERSION
      await fileSystem.copyAsync(path.join(repository.path, 'dist'), path.join(output_path, 'src/public'));
    }
  }
  async build(repository: RepositorySkJson, buildProps?: BuildProps): Promise<void> {
    const backend = (toolbox.project as ProjectUse).backend;

    const prefix = BuildFactory.getProject(backend.skulljs_repository).getBackendAppPrefix(toolbox.project.backend!);

    // Set all files path to be modified

    const envFile = path.join(repository.path, 'src/environments/environment.prod.ts');

    // Get the Ts Compiler api program

    const program = getTsProgram([
      {
        path: envFile,
        sourceName: 'EnvSource',
      },
    ]);

    if (!buildProps) return;

    // Transform src/environments/environment.prod.ts file

    await transformAndWrite(
      {
        path: envFile,
        source: program.sourceFiles['EnvSource'],
      },
      [
        ngProdEnvTransformer(
          {
            ...buildProps,
            apiPrefix: prefix,
          },
          program.checker
        ),
      ]
    );

    const localCli = system.getLocalCli(repository, toolbox);
    await system.run('node', `${localCli.cli} build --configuration=production --delete-output-path`, {
      cwd: localCli.cwd,
    });
  }

  async isFrontendSSR(repository: RepositorySkJson) {
    return !!(await fileSystem.existsAsync(path.join(repository.path, 'dist', 'server')));
  }
}
