import toolbox from '@src/toolbox/toolbox.js';
import { RepositorySkJson } from '@src/types/project';

const { command, exit, system } = toolbox;

export async function buildBackend(backend: RepositorySkJson) {
  switch (backend.skulljs_repository) {
    case 'nestjs':
      await buildNestJs(backend.path);
      break;

    default:
      exit(command, `backend repository ${backend.skulljs_repository} not implemented yet !`);
      break;
  }
}

async function buildNestJs(path: string) {
  await system.run('nest', 'build', { cwd: path });
}

export default {
  buildBackend,
};
