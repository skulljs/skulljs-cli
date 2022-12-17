import { FileToGenerate, FrontendVariables, GenerateProps } from '@src/types/commands/route-create';
import { RouteCreateUtils } from '../routeCreateUtils.js';
import { RepositorySkJson } from '@src/types/project';
import toolbox from '@src/toolbox/toolbox.js';

const { template, path } = toolbox;

export class Angular extends RouteCreateUtils<FrontendVariables> {
  getVariables(repository: RepositorySkJson, route_path: string): FrontendVariables {
    const frontend_service_name = path.basename(route_path);
    const frontend_src_folder = path.join(repository?.path || '', 'src');
    const frontend_services_folder = path.join(frontend_src_folder, 'app/services');
    const frontend_service_folder = path.join(frontend_services_folder, frontend_service_name);

    return { frontend_service_name, frontend_src_folder, frontend_services_folder, frontend_service_folder };
  }

  async postGeneration(variables: FrontendVariables, props: GenerateProps): Promise<void> {}

  getFiles(props: GenerateProps): FileToGenerate[] {
    return [
      {
        template: 'route-create/frontend/angular/service/route.service.ts.hbs',
        target: `${props.frontend_service_folder}/${'route.service.ts.hbs'.replace('route', props.route_name_pLf).replace('.hbs', '')}`,
      },
      {
        template: 'route-create/frontend/angular/service/tests/route.service.spec.ts.hbs',
        target: `${props.frontend_service_folder}/${'route.service.spec.ts.hbs'.replace('route', props.route_name_pLf).replace('.hbs', '')}`,
      },
      {
        template: 'route-create/frontend/angular/entities/model.entity.ts.hbs',
        target: `${props.frontend_service_folder}/${'/entities/model.entity.ts.hbs'.replace('model', props.model_name_sLc).replace('.hbs', '')}`,
      },
      {
        template: 'route-create/frontend/angular/dto/create-model.dto.ts.hbs',
        target: `${props.frontend_service_folder}/${'/dto/create-model.dto.ts.hbs'.replace('model', props.model_name_sLc).replace('.hbs', '')}`,
      },
      {
        template: 'route-create/frontend/angular/dto/update-model.dto.ts.hbs',
        target: `${props.frontend_service_folder}/${'/dto/update-model.dto.ts.hbs'.replace('model', props.model_name_sLc).replace('.hbs', '')}`,
      },
    ];
  }
}
