import { RepositorySkJson } from '@src/types/project';
import { DocUtils } from '../docUtils.js';
import toolbox from '@src/toolbox/toolbox.js';

const { saveLog } = toolbox;

export class Angular extends DocUtils {
  async generateDoc(repository: RepositorySkJson): Promise<void> {
    await saveLog.run({
      command: 'npm',
      args: 'run compodoc:build',
      options: {
        cwd: repository.path,
      },
    });
  }
}
