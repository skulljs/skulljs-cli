import toolbox from '@src/toolbox/toolbox.js';
import { RepositorySkJson } from '@src/types/project';

const { command, exit } = toolbox;

export async function postCopyBackendScript(backend: RepositorySkJson, output_path: string, hostname: string, port: number, protocol: string) {
  switch (backend.skulljs_repository) {
    case 'nestjs':
      await postCopyNestjsScript(backend.path, output_path, hostname, port, protocol);
      break;

    default:
      exit(command, `backend repository ${backend.skulljs_repository} not implemented yet !`);
      break;
  }
}

async function postCopyNestjsScript(backend_path: string, output_path: string, hostname: string, port: number, protocol: string) {
  // ! edit files
}

export async function postCopyFrontendScript(frontend: RepositorySkJson, output_path: string, hostname: string, port: number, protocol: string) {
  switch (frontend.skulljs_repository) {
    case 'angular':
      break;

    default:
      exit(command, `frontend repository ${frontend.skulljs_repository} not implemented yet !`);
      break;
  }
}

export default {
  postCopyBackendScript,
  postCopyFrontendScript,
};
