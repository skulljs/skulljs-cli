import { BuildProps } from '@src/types/commands/build';
import { RepositorySkJson } from '@src/types/project';

export abstract class BuildUtils {
  abstract build(repository: RepositorySkJson, buildProps?: BuildProps): Promise<void>;
  abstract postCopyScript(repository: RepositorySkJson, output_path: string, buildProps: BuildProps, isFrontendSSR: boolean): Promise<void>;
  abstract copyFiles(repository: RepositorySkJson, output_path: string, protocol?: string): Promise<void>;
  generateManagerFiles(output_path: string, manager: string, app_name: string, port: number, db_driver: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async isFrontendSSR(repository: RepositorySkJson): Promise<boolean> {
    return false;
  }
  getBackendAppPrefix(repository: RepositorySkJson): string {
    throw new Error('Method not implemented.');
  }
}
