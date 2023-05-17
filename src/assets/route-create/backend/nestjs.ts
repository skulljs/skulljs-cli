import { BackendVariables, DatabaseModel, DatabaseModelProperty, FileToGenerate, GenerateProps, PromptsModels } from '@src/types/commands/route-create.js';
import { RouteCreateUtils } from '../routeCreateUtils.js';
import { getTsProgram, transformAndWrite } from '@src/utils/tsCompilerUtils.js';
import { nestAppModuleTransformer } from '@src/assets/transformers/routes/nest/appModuleRouteImport.js';
import { parsePrismaSchema } from '@loancrate/prisma-schema-parser';
import { convertPrisma } from '../databaseConvert.js';
import { RepositorySkJson } from '@src/types/project';
import toolbox from '@src/toolbox/toolbox.js';
import slash from 'slash';

const {
  strings: { upperFirst, lowerCase, plural },
  fileSystem: { read },
  path,
} = toolbox;

export class Nestjs extends RouteCreateUtils<BackendVariables> {
  getVariables(repository: RepositorySkJson, route_path: string): BackendVariables {
    const backend_src_folder = path.join(repository.path, 'src/');
    const backend_routes_folder = path.join(backend_src_folder, 'routes');
    const backend_route_folder = path.join(backend_routes_folder, route_path);
    const database_models_file = path.join(repository.path, 'prisma/schema.prisma');

    return { backend_src_folder, backend_routes_folder, backend_route_folder, database_models_file };
  }
  getAllModels(database_models_file: string): PromptsModels[] {
    let models: PromptsModels[] = [];
    const database_file = read(database_models_file);
    const schema = parsePrismaSchema(database_file ? database_file.replace(/view (\w+) {/g, 'model $1 {') : '');
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
    const model: DatabaseModel = { model_name: '', properties: [], model_classValidator: '' };
    const classValidator: string[] = [];
    const database_file = read(database_models_file);
    const schema = parsePrismaSchema(database_file ? database_file.replace(/view (\w+) {/g, 'model $1 {') : '');

    schema.declarations.forEach((declaration) => {
      if (declaration.kind != 'model') return;

      if (lowerCase(plural(declaration.name.value)) != lowerCase(plural(model_name))) return;

      model.model_name = declaration.name.value;

      declaration.members.forEach((property) => {
        if (property.kind != 'field') return;

        if (!['typeId', 'optional', 'unsupported'].includes(property.type.kind)) return;

        const isRelation = property.attributes!.some((attr: any) => attr.path.value.includes('relation'));

        if (isRelation) return;

        const isPrimaryKey: boolean = property.attributes!.some((attr: any) => attr.path.value.includes('id'));

        const type = convertPrisma(property);

        const isPrimaryKeyNumber: boolean = isPrimaryKey && type == 'number';

        const isPrimaryKeyAI: boolean =
          isPrimaryKeyNumber && property.attributes!.some((attr: any) => attr.args.some((arg: any) => arg.path.value.includes('autoincrement')));

        const property_object: DatabaseModelProperty = {
          name: property.name.value,
          type: type,
          classValidator: type == 'object' ? '@IsJSON()' : `@Is${upperFirst(type)}()`,
          isPrimaryKey: isPrimaryKey,
          isPrimaryKeyNumber: isPrimaryKeyNumber,
          isPrimaryKeyAI: isPrimaryKeyAI,
        };
        model.properties.push(property_object);
        const classValidator_string = property_object.classValidator as string;
        classValidator.push(classValidator_string.slice(1, -2));
      });
    });

    // unique
    model.model_classValidator = [...new Set(classValidator)].join(', ');
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

  getFiles(props: GenerateProps): FileToGenerate[] {
    return [
      {
        template: 'route-create/backend/nestjs/route.module.ts.hbs',
        target: `${props.backend_route_folder}/${'route.module.ts.hbs'.replace('route', props.route_name_pLf).replace('.hbs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/service/route.service.ts.hbs',
        target: `${props.backend_route_folder}/${'route.service.ts.hbs'.replace('route', props.route_name_pLf).replace('.hbs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/service/tests/route.service.spec.ts.hbs',
        target: `${props.backend_route_folder}/${'route.service.spec.ts.hbs'.replace('route', props.route_name_pLf).replace('.hbs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/controller/route.controller.ts.hbs',
        target: `${props.backend_route_folder}/${'route.controller.ts.hbs'.replace('route', props.route_name_pLf).replace('.hbs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/controller/tests/route.controller.spec.ts.hbs',
        target: `${props.backend_route_folder}/${'route.controller.spec.ts.hbs'.replace('route', props.route_name_pLf).replace('.hbs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/entities/model.entity.ts.hbs',
        target: `${props.backend_route_folder}/${'/entities/model.entity.ts.hbs'.replace('model', props.model_name_sLc).replace('.hbs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/dto/create-model.dto.ts.hbs',
        target: `${props.backend_route_folder}/${'/dto/create-model.dto.ts.hbs'.replace('model', props.model_name_sLc).replace('.hbs', '')}`,
      },
      {
        template: 'route-create/backend/nestjs/dto/update-model.dto.ts.hbs',
        target: `${props.backend_route_folder}/${'/dto/update-model.dto.ts.hbs'.replace('model', props.model_name_sLc).replace('.hbs', '')}`,
      },
    ];
  }
}
