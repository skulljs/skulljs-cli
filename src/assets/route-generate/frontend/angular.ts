import { FileToGenerate, FrontendVariables, GenerateProps } from '@src/types/commands/route-generate.js';
import { RouteGenerateUtils } from '../routeGenerateUtils.js';
import { RepositorySkJson } from '@src/types/project';
import toolbox from '@src/toolbox/toolbox.js';

const { template, path } = toolbox;

export class Angular extends RouteGenerateUtils<FrontendVariables> {
  getVariables(repository: RepositorySkJson, service_path: string): FrontendVariables {
    const frontend_folder_depth = service_path.split('/').length - 1;
    const frontend_service_name = service_path;
    const frontend_src_folder = path.join(repository?.path || '', 'src');
    const frontend_services_folder = path.join(frontend_src_folder, 'app/services');
    const frontend_service_folder = path.join(frontend_services_folder, frontend_service_name);

    return { frontend_folder_depth, frontend_service_name, frontend_src_folder, frontend_services_folder, frontend_service_folder };
  }

  async postGeneration(variables: FrontendVariables, props: GenerateProps): Promise<void> {}

  getFiles(props: GenerateProps): FileToGenerate[] {
    return [
      {
        template: 'route-generate/frontend/angular/service/route.service.ts.hbs',
        target: `${props.frontend_service_folder}/${'route.service.ts.hbs'.replace('route', props.route_name_pLf).replace('.hbs', '')}`,
      },
      {
        template: 'route-generate/frontend/angular/service/tests/route.service.spec.ts.hbs',
        target: `${props.frontend_service_folder}/${'route.service.spec.ts.hbs'.replace('route', props.route_name_pLf).replace('.hbs', '')}`,
      },
      {
        template: 'route-generate/frontend/angular/entities/model.entity.ts.hbs',
        target: `${props.frontend_service_folder}/${'/entities/model.entity.ts.hbs'.replace('model', props.model_name_sLc).replace('.hbs', '')}`,
      },
      {
        template: 'route-generate/frontend/angular/dto/create-model.dto.ts.hbs',
        target: `${props.frontend_service_folder}/${'/dto/create-model.dto.ts.hbs'.replace('model', props.model_name_sLc).replace('.hbs', '')}`,
      },
      {
        template: 'route-generate/frontend/angular/dto/update-model.dto.ts.hbs',
        target: `${props.frontend_service_folder}/${'/dto/update-model.dto.ts.hbs'.replace('model', props.model_name_sLc).replace('.hbs', '')}`,
      },
    ];
  }
}
