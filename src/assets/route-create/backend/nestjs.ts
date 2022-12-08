import {
  BackendVariables,
  CRUDDataNestjs,
  DatabaseModel,
  DatabaseModelProperty,
  FileToGenerate,
  GenerateProps,
  PromptsModels,
} from '@src/types/commands/route-create.js';
import { RouteCreateUtils } from '../routeCreateUtils.js';
import { getTsProgram, transformAndWrite } from '@src/utils/tsCompilerUtils.js';
import { nestAppModuleTransformer } from '@src/assets/transformers/routes/nest/appModuleRouteImport.js';
import { parsePrismaSchema } from '@loancrate/prisma-schema-parser';
import { convertPrisma } from '../databaseConvert.js';
import { RepositorySkJson } from '@src/types/project';
import asyncForEach from '@src/utils/asyncForEach.js';
import toolbox from '@src/toolbox/toolbox.js';
import slash from 'slash';

const {
  strings: { upperFirst, lowerCase, plural },
  fileSystem: { read },
  path,
  template,
} = toolbox;

export class Nestjs extends RouteCreateUtils<CRUDDataNestjs, BackendVariables> {
  getVariables(repository: RepositorySkJson, route_path: string): BackendVariables {
    const backend_src_folder = path.join(repository.path, 'src/');
    const backend_routes_folder = path.join(backend_src_folder, 'routes');
    const backend_route_folder = path.join(backend_routes_folder, route_path);
    const database_models_file = path.join(repository.path, 'prisma/schema.prisma');

    return { backend_src_folder, backend_routes_folder, backend_route_folder, database_models_file };
  }
  getAllModels(database_models_file: string): PromptsModels[] {
    let models: PromptsModels[] = [];
    const schema = parsePrismaSchema(read(database_models_file) ?? '');
    schema.declarations.forEach((declaration) => {
      if (declaration.kind != 'model') return;
      models.push({
        title: upperFirst(declaration.name.value),
        value: lowerCase(declaration.name.value),
      });
    });

    return models;
  }

  getModel(database_models_file: string, model_name: string): DatabaseModel {
    const model: DatabaseModel = { model_name: '', properties: [], model_class_validator: '' };
    const class_validator: string[] = [];
    const schema = parsePrismaSchema(read(database_models_file) ?? '');
    schema.declarations.forEach((declaration) => {
      if (declaration.kind != 'model') return;

      if (lowerCase(plural(declaration.name.value)) != lowerCase(plural(model_name))) return;

      model.model_name = declaration.name.value;

      declaration.members.forEach((property) => {
        if (property.kind != 'field') return;

        if (!['typeId', 'optional', 'unsupported'].includes(property.type.kind)) return;

        const isRelation = property.attributes!.some((attr: any) => attr.path.value.includes('relation'));

        if (isRelation) return;

        const isId: boolean = property.attributes!.some((attr: any) => attr.path.value.includes('id'));

        const type = convertPrisma(property);

        const property_object: DatabaseModelProperty = {
          property_name: property.name.value,
          property_type: type,
          property_class_validator: type == 'object' ? '@IsJSON()' : `@Is${upperFirst(type)}()`,
          is_id: isId,
        };
        model.properties.push(property_object);
        const property_class_validator_string = property_object.property_class_validator as string;
        class_validator.push(property_class_validator_string.slice(1, -2));
      });
    });

    // unique
    model.model_class_validator = [...new Set(class_validator)].join(', ');
    return model;
  }

  async postGeneration(variables: BackendVariables, props: GenerateProps): Promise<void> {
    const app_module_path = path.join(variables.backend_src_folder, 'app.module.ts');

    const program = getTsProgram([
      {
        path: app_module_path,
        sourceName: 'AppModuleSource',
      },
    ]);

    let relativePath = slash(path.relative(path.dirname(app_module_path), path.join(props.backend_route_folder, `${props.route_name_pLf}.module`)));
    if (!['.', '/'].includes(relativePath[0])) {
      relativePath = './' + relativePath;
    }

    await transformAndWrite(
      {
        path: app_module_path,
        source: program.sourceFiles['AppModuleSource'],
      },
      [
        nestAppModuleTransformer(
          {
            moduleName: `${props.route_name_pUcfirst}Module`,
            modulePath: relativePath,
          },
          program.checker
        ),
      ],
      true
    );
  }

  async getCRUD(props: GenerateProps): Promise<CRUDDataNestjs> {
    let backend_crud_data: CRUDDataNestjs = { service: '', controller: '' };
    if (props.crud) {
      const crud_array_service: string[] = [];
      const crud_array_controller: string[] = [];
      await asyncForEach(props.crud, async (crud_element) => {
        const crud_file_service = await template.generate({
          template: `route-create/backend/nestjs/service/crud/${crud_element}.ejs`,
          props: props,
        });
        crud_array_service.push(crud_file_service);

        const crud_file_controller = await template.generate({
          template: `route-create/backend/nestjs/controller/crud/${crud_element}.ejs`,
          props: props,
        });
        crud_array_controller.push(crud_file_controller);
      });
      backend_crud_data.service = crud_array_service.join('\n');
      backend_crud_data.controller = crud_array_controller.join('\n');
    }
    return backend_crud_data;
  }

  getFiles(props: GenerateProps): FileToGenerate[] {
    return [
      {
        template: 'route-create/backend/nestjs/route.module.ts.ejs',
        target: `${props.backend_route_folder}/${'route.module.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/service/route.service.ts.ejs',
        target: `${props.backend_route_folder}/${'route.service.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/service/tests/route.service.spec.ts.ejs',
        target: `${props.backend_route_folder}/${'route.service.spec.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/controller/route.controller.ts.ejs',
        target: `${props.backend_route_folder}/${'route.controller.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/controller/tests/route.controller.spec.ts.ejs',
        target: `${props.backend_route_folder}/${'route.controller.spec.ts.ejs'.replace('route', props.route_name_pLf).replace('.ejs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/entities/model.entity.ts.ejs',
        target: `${props.backend_route_folder}/${'/entities/model.entity.ts.ejs'.replace('model', props.model_name_sLc).replace('.ejs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/dto/create-model.dto.ts.ejs',
        target: `${props.backend_route_folder}/${'/dto/create-model.dto.ts.ejs'.replace('model', props.model_name_sLc).replace('.ejs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/dto/update-model.dto.ts.ejs',
        target: `${props.backend_route_folder}/${'/dto/update-model.dto.ts.ejs'.replace('model', props.model_name_sLc).replace('.ejs', '')}`,
      },
    ];
  }
}
