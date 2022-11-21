import toolbox from '@src/toolbox/toolbox.js';
import { RepositorySkJson } from '@src/types/project';

const { exit, saveLog } = toolbox;

export async function generateBackendDoc(backend: RepositorySkJson) {
  switch (backend.skulljs_repository) {
    case 'nestjs':
      await generateNestJsDoc(backend);
      break;

    default:
      exit(toolbox.command, `backend repository ${backend.skulljs_repository} not implemented yet !`);
      break;
  }
}

async function generateNestJsDoc(backend: RepositorySkJson) {
  await saveLog.run({
    command: 'npm',
    args: 'run compodoc:build',
    options: {
      cwd: backend.path,
    },
  });
}

export async function generateFrontendDoc(frontend: RepositorySkJson) {
  switch (frontend.skulljs_repository) {
    case 'angular':
      await generateAngularDoc(frontend);
      break;

    default:
      exit(toolbox.command, `frontend repository ${frontend.skulljs_repository} not implemented yet !`);
      break;
  }
}

async function generateAngularDoc(frontend: RepositorySkJson) {
  await saveLog.run({
    command: 'npm',
    args: 'run compodoc:build',
    options: {
      cwd: frontend.path,
    },
  });
}

export default {
  generateBackendDoc,
  generateFrontendDoc,
};
