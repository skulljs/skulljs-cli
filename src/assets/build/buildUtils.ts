import { BuildProps } from '@src/types/commands/build';
import { RepositorySkJson } from '@src/types/project';

export abstract class BuildUtils {
  abstract build(repository: RepositorySkJson, buildProps?: BuildProps): Promise<void>;
  abstract postCopyScript(repository: RepositorySkJson, output_path: string, buildProps: BuildProps): Promise<void>;
  abstract copyFiles(repository: RepositorySkJson, output_path: string, protocol?: string): Promise<void>;
  generateManagerFiles(output_path: string, manager: string, app_name: string, port: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getBackendAppPrefix(repository: RepositorySkJson): string {
    throw new Error('Method not implemented.');
  }
}
