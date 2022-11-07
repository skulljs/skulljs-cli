import toolbox from '@src/toolbox/toolbox.js';
import { BackendVariables, FrontendVariables } from '@src/types/commands/route-create';
import { RepositorySkJson } from '@src/types/project';

const { command, path, exit } = toolbox;

export function getBackendVariables(backend: RepositorySkJson, route_path: string): BackendVariables {
  let backend_variables: BackendVariables = { backend_src_folder: '', backend_routes_folder: '', backend_route_folder: '', database_models_file: '' };
  switch (backend.skulljs_repository) {
    case 'nestjs':
      backend_variables = getNestJsBackendVariables(backend, route_path);
      break;

    default:
      exit(command, `backend repository ${backend.skulljs_repository} not implemented yet !`);
      break;
  }

  return backend_variables;
}

function getNestJsBackendVariables(backend: RepositorySkJson, route_path: string): BackendVariables {
  const backend_src_folder = path.join(backend.path, 'src/');
  const backend_routes_folder = path.join(backend_src_folder, 'routes');
  const backend_route_folder = path.join(backend_routes_folder, route_path);
  const database_models_file = path.join(backend.path, 'prisma/schema.prisma');

  return { backend_src_folder, backend_routes_folder, backend_route_folder, database_models_file };
}

export function getFrontendVariables(frontend: RepositorySkJson, backend_route_folder: string): FrontendVariables {
  let frontend_variables: FrontendVariables = { frontend_service_name: '', frontend_src_folder: '', frontend_services_folder: '', frontend_service_folder: '' };
  switch (frontend.skulljs_repository) {
    case 'angular':
      frontend_variables = getAngularFrontendVariables(frontend, backend_route_folder);
      break;

    default:
      exit(command, `frontend repository ${frontend.skulljs_repository} not implemented yet !`);
      break;
  }

  return frontend_variables;
}

function getAngularFrontendVariables(frontend: RepositorySkJson, backend_route_folder: string): FrontendVariables {
  const frontend_service_name = path.basename(backend_route_folder);
  const frontend_src_folder = path.join(frontend?.path || '', 'src');
  const frontend_services_folder = path.join(frontend_src_folder, 'app/services');
  const frontend_service_folder = path.join(frontend_services_folder, frontend_service_name);

  return { frontend_service_name, frontend_src_folder, frontend_services_folder, frontend_service_folder };
}

export default {
  getBackendVariables,
  getFrontendVariables,
};
