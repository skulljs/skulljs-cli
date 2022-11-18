import toolbox from '@src/toolbox/toolbox.js';
import { RepositorySkJson } from '@src/types/project';

const { exit, fileSystem, path } = toolbox;

export async function copyBackend(backend: RepositorySkJson, output_path: string, protocol: string) {
  switch (backend.skulljs_repository) {
    case 'nestjs':
      await copyNestJs(backend.path, output_path);
      break;

    default:
      exit(toolbox.command, `backend repository ${backend.skulljs_repository} not implemented yet !`);
      break;
  }

  if (protocol == 'https') {
    const sslcert_path = path.join(backend.path, '../sslcert');
    await fileSystem.copyAsync(sslcert_path, path.join(output_path, 'sslcert'), { matching: ['./**/*.pem'] });
  }
}

async function copyNestJs(backend_path: string, output_path: string) {
  await fileSystem.copyAsync(backend_path, output_path, {
    matching: ['./@(.env|LICENSE|package-lock.json|package.json)', 'prisma/**/*', 'templates/**/*', 'dist/**/*'],
  });
  await fileSystem.renameAsync(path.join(output_path, 'dist'), 'src');
}

export async function copyFrontend(frontend: RepositorySkJson, output_path: string) {
  switch (frontend.skulljs_repository) {
    case 'angular':
      await copyAngular(frontend.path, output_path);
      break;

    default:
      exit(toolbox.command, `frontend repository ${frontend.skulljs_repository} not implemented yet !`);
      break;
  }
}

async function copyAngular(frontend_path: string, output_path: string) {
  await fileSystem.copyAsync(path.join(frontend_path, 'dist'), path.join(output_path, 'src/public'));
}

export default {
  copyBackend,
  copyFrontend,
};