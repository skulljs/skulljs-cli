import toolbox from '@src/toolbox/toolbox.js';
import { RepositorySkJson } from '@src/types/project';

const { command, exit, saveLog, path } = toolbox;

export async function copyBackend(backend: RepositorySkJson, output_path: string) {
  switch (backend.skulljs_repository) {
    case 'nestjs':
      await copyNestJs(backend.path, output_path);
      break;

    default:
      exit(command, `backend repository ${backend.skulljs_repository} not implemented yet !`);
      break;
  }
}

async function copyNestJs(backend_path: string, output_path: string) {
  const dist_path = path.join(backend_path, 'dist');
  console.log(dist_path);

  await saveLog.copy({
    from: dist_path,
    target: output_path,
    options: {
      overwrite: true,
      matching: ['./(.env|LICENSE|package-lock.json|package.json)'],
    },
  });
}

export default {
  copyBackend,
};
