import { CRUDDataAngular, FileToGenerate, FrontendVariables, GenerateProps } from '@src/types/commands/route-create';
import { RouteCreateUtils } from '../routeCreateUtils.js';
import { RepositorySkJson } from '@src/types/project';
import asyncForEach from '@src/utils/asyncForEach.js';
import toolbox from '@src/toolbox/toolbox.js';

const { template, path } = toolbox;

export class Angular extends RouteCreateUtils<CRUDDataAngular, FrontendVariables> {
  getVariables(repository: RepositorySkJson, route_path: string): FrontendVariables {
    const frontend_service_name = path.basename(route_path);
    const frontend_src_folder = path.join(repository?.path || '', 'src');
    const frontend_services_folder = path.join(frontend_src_folder, 'app/services');
    const frontend_service_folder = path.join(frontend_services_folder, frontend_service_name);

    return { frontend_service_name, frontend_src_folder, frontend_services_folder, frontend_service_folder };
  }

  async postGeneration(variables: FrontendVariables, props: GenerateProps): Promise<void> {}

  async getCRUD(props: GenerateProps): Promise<CRUDDataAngular> {
    let frontend_crud_data: CRUDDataAngular = { service: '' };
    if (props.crud) {
      const crud_array_service: string[] = [];
      await asyncForEach(props.crud, async (crud_element) => {
        const crud_file_service = await template.generate({
          template: `route-create/frontend/angular/service/crud/${crud_element}.ejs`,
          props: props,
        });
        crud_array_service.push(crud_file_service);
      });
      frontend_crud_data.service = crud_array_service.join('\n');
    }
    return frontend_crud_data;
  }

  getFiles(props: GenerateProps): FileToGenerate[] {
    return [
      {
        template: 'route-create/frontend/angular/service/route.service.ts.ejs',
        target: `${props.frontend_service_folder}/${'route.service.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
      },
      {
        template: 'route-create/frontend/angular/service/tests/route.service.spec.ts.ejs',
        target: `${props.frontend_service_folder}/${'route.service.spec.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
      },
      {
        template: 'route-create/frontend/angular/entities/model.entity.ts.ejs',
        target: `${props.frontend_service_folder}/${'/entities/model.entity.ts.ejs'.replace('model', props.model_name_sLc).replace('.ejs', '')}`,
      },
      {
        template: 'route-create/frontend/angular/dto/create-model.dto.ts.ejs',
        target: `${props.frontend_service_folder}/${'/dto/create-model.dto.ts.ejs'.replace('model', props.model_name_sLc).replace('.ejs', '')}`,
      },
      {
        template: 'route-create/frontend/angular/dto/update-model.dto.ts.ejs',
        target: `${props.frontend_service_folder}/${'/dto/update-model.dto.ts.ejs'.replace('model', props.model_name_sLc).replace('.ejs', '')}`,
      },
    ];
  }
}
