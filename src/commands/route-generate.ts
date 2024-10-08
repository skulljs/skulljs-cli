import { Command } from '@src/types/command';
import { ProjectUse } from '@src/types/project';
import { FileToGenerate, GenerateProps, PromptsModels } from '@src/types/commands/route-generate';
import { RouteFactory } from '@src/assets/route-generate/routeFactory.js';

const routeGenerateCommand: Command = {
  name: 'route:generate',
  aliases: ['rg'],
  scope: 'in',
  needs: ['backend'],
  options: [
    {
      flags: '--no-service',
      description: 'skip frontend service generation',
    },
  ],
  arguments: [
    {
      name: 'route-path',
      description: 'Path of the route',
      required: false,
    },
  ],
  description: 'Generate a route based on a database table to the backend',
  run: async (toolbox, options, args, command) => {
    const {
      print: { infoLoader, warn },
      fileSystem: { exists },
      saveLog,
      prompts,
      strings: { upperFirst, lowerCase, singular, plural, lowerFirst },
      project: { frontend },
      exit,
    } = toolbox;

    const { service } = options;
    const { backend } = toolbox.project as ProjectUse;

    // Check route name
    const pattern = /^([A-Za-z]+\/)*[A-Za-z]{3,}$/m;

    function isFilePath(path: string, isArgs: boolean, example: string): { validate: boolean; errorMsg: string } {
      let is_file_path = pattern.test(path);
      const errorMsg = `${path} is not valid : Min length : 3, Characters : letters/slashes, Example: sk route:generate ${example}`;
      if (!is_file_path) {
        if (isArgs) {
          exit(command, errorMsg);
        }
      }
      return { validate: is_file_path, errorMsg };
    }

    let route_path: string = args[0];
    if (route_path) {
      isFilePath(route_path, true, 'example/myRoute');
    } else {
      route_path = await prompts.ask(
        'Path of the route ?',
        (value) => {
          const checker = isFilePath(value, false, 'example/myRoute');
          return checker.validate ? true : checker.errorMsg;
        },
        'example/myRoute'
      );
    }

    const backendUtils = RouteFactory.getProject(backend.skulljs_repository);
    const frontendUtils = frontend ? RouteFactory.getProject(frontend.skulljs_repository) : undefined;

    const backend_variables = backendUtils.getVariables(backend, route_path);

    // Check if route already exist
    if (exists(backend_variables.backend_route_folder)) {
      warn(`A router named ${backend_variables.backend_route_folder} already exists !`);
      const overwr = await prompts.confirm('Overwrite ?');
      if (!overwr) {
        return undefined;
      }
    }

    // Get database models
    if (!exists(backend_variables.database_models_file)) {
      exit(command, ['Unable to locate models file.', `Path: ${backend_variables.database_models_file}`]);
    }

    const models: PromptsModels[] = backendUtils.getAllModels(backend_variables.database_models_file);

    // Ask user

    const route_name = route_path.split('/').pop()!;
    const selected_model = await prompts.select('Select a model', models);
    const crud_choices = [
      {
        title: 'Create',
        value: 'create',
        selected: true,
      },
      {
        title: 'Read',
        value: 'read',
        selected: true,
      },
      {
        title: 'Update',
        value: 'update',
        selected: true,
      },
      {
        title: 'Delete',
        value: 'delete',
        selected: true,
      },
    ];
    const crud = await prompts.multiSelect('CRUD', crud_choices);
    const generateService = !service || !frontend ? false : await prompts.confirm('Generate the associated frontend service ?', true);
    const service_path = await prompts.ask(
      'Path of the frontend service ?',
      (value) => {
        const checker = isFilePath(value, false, 'example/myService');
        return checker.validate ? true : checker.errorMsg;
      },
      route_path
    );

    const frontend_variables = frontendUtils?.getVariables(frontend!, service_path);

    // Check if frontend service already exist
    let overwrite_frontend = true;
    if (exists(frontend_variables.frontend_service_folder)) {
      warn(`A frontend service named ${frontend_variables.frontend_service_folder} already exists !`);
      overwrite_frontend = await prompts.confirm('Overwrite ?');
    }

    // generate files
    toolbox.loader.start(infoLoader('Generating files'));

    const model = backendUtils.getModel(backend_variables.database_models_file, selected_model);
    let model_primary_key_name = '';
    let model_primary_key_type = '';
    let isPrimaryKeyNumber = false;
    model.properties.forEach((property) => {
      if (property.isPrimaryKey) {
        model_primary_key_name = property.name;
        model_primary_key_type = property.type;
        isPrimaryKeyNumber = property.isPrimaryKeyNumber;
      }
    });

    const props: GenerateProps = {
      backend_folder_depth: backend_variables.backend_folder_depth,
      backend_route_folder: backend_variables.backend_route_folder,
      frontend_folder_depth: frontend_variables ? frontend_variables.frontend_folder_depth : 0,
      frontend_service_folder: frontend_variables ? frontend_variables.frontend_service_folder : '',
      route_name_sLc: lowerCase(singular(route_name)),
      route_name_sUcfirst: upperFirst(singular(route_name)),
      route_name_pLf: lowerFirst(plural(route_name)),
      route_name_pUcfirst: upperFirst(plural(route_name)),
      model_name_sLc: lowerCase(singular(model.model_name)),
      model_name_sUcfirst: upperFirst(singular(model.model_name)),
      model_name_pLc: lowerCase(plural(model.model_name)),
      model_name_pUcfirst: upperFirst(plural(model.model_name)),
      model_name_Lcfirst: lowerFirst(model.model_name),
      model_name_Ucfirst: upperFirst(model.model_name),
      model_primary_key_name: model_primary_key_name,
      model_primary_key_type: model_primary_key_type,
      crud: crud,
      model: model,
      isPrimaryKeyNumber: isPrimaryKeyNumber,
    };

    // backend
    const backendFilesToGenerates: FileToGenerate[] = backendUtils.getFiles(props);
    await Promise.all(
      backendFilesToGenerates.map(async (file) => {
        await saveLog.generate({
          template: file.template,
          target: file.target,
          props: props,
        });
      })
    );

    // frontend
    if (generateService && overwrite_frontend) {
      const frontendFilesToGenerates: FileToGenerate[] = frontendUtils!.getFiles(props);
      await Promise.all(
        frontendFilesToGenerates.map(async (file) => {
          await saveLog.generate({
            template: file.template,
            target: file.target,
            props: props,
          });
        })
      );
    }

    await toolbox.loader.succeed();

    // post generation script
    toolbox.loader.start(infoLoader('Running post generation script'));
    await backendUtils.postGeneration(backend_variables, props);
    if (frontend) {
      await frontendUtils!.postGeneration(frontend_variables, props);
    }
    await toolbox.loader.succeed();
  },
};

export default routeGenerateCommand;
