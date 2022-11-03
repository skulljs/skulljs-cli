import { Command } from '@src/types/command';
import { ProjectUse } from '@src/types/project';
import { FileToGenerate, GenerateProps, PromptsModels } from '@src/types/commands/route-create';
import { getAllModels, getModel } from '@src/assets/route-create/databaseUtils.js';
import { getBackendFilesToGenerates } from '@src/assets/route-create/generateUtils.js';
import { getBackendVariables, getFrontendVariables } from '@src/assets/route-create/variablesUtils.js';
import { property } from 'lodash';

const routeCommand: Command = {
  name: 'route:create',
  aliases: ['rc'],
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
  description: 'Add a route',
  run: async (toolbox, options, args, command) => {
    const {
      print: { infoLoader, warn, error },
      fileSystem: { exists, removeAsync },
      saveLog,
      prompts,
      strings: { upperFirst, lowerCase, singular, plural },
      path,
      project: { frontend },
      exit,
    } = toolbox;

    const { service } = options;
    const { backend } = toolbox.project as ProjectUse;

    // Check route name

    const pattern = /^([-_A-z]+\/)*[-_A-z]{3,}$/g;

    function isFilePath(path: string, isArgs: boolean): boolean {
      let is_file_path = pattern.test(path);
      if (!is_file_path) {
        const errorMsg = [
          `${route_path} is not a valid name. Use letters case, slashes, dashes and underscore only.`,
          'The name should also be more than 3 caracters long.',
          `Example: sk route:create example/my-route`,
        ];
        if (isArgs) {
          exit(command, errorMsg);
        } else {
          errorMsg.forEach((msg) => error(msg));
        }
      }
      return is_file_path;
    }

    let route_path: string = args[0];
    if (route_path) {
      isFilePath(route_path, true);
    } else {
      do {
        route_path = await prompts.ask('Path of the route ?', undefined, 'example/my-route');
      } while (!isFilePath(route_path, false));
    }

    // variables declarations
    const backend_variables = getBackendVariables(backend, route_path);
    const frontend_variables = frontend ? getFrontendVariables(frontend, backend_variables.backend_route_folder) : null;

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

    let models: PromptsModels[] = [
      {
        title: 'None',
        value: false,
      },
    ];

    models = models.concat(getAllModels(backend.skulljs_repository, backend_variables.database_models_file));

    // ask user

    const route_name = lowerCase('' + route_path.split('/').pop());
    const selected_model = await prompts.select('Select a model', models, undefined, false);
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
    const createService = !service || !frontend ? false : await prompts.confirm('Create the associate service ?', true);

    // add backend files
    toolbox.loader.start(infoLoader('Generating backend files'));
    if (exists(backend_variables.backend_route_folder)) {
      await removeAsync(backend_variables.backend_route_folder);
    }

    const model = getModel(backend.skulljs_repository, backend_variables.database_models_file, selected_model);
    let model_id = '';
    let model_id_type = '';
    model.properties.forEach((property) => {
      if (property.is_id) {
        model_id = property.property_name;
        model_id_type = property.property_type;
      }
    });

    const props: GenerateProps = {
      backend_route_folder: backend_variables.backend_route_folder,
      route_name: route_name,
      model_name_sLc: lowerCase(singular(route_name)),
      model_name_sUcfirst: upperFirst(singular(route_name)),
      model_name_pLc: lowerCase(plural(route_name)),
      model_name_pUcfirst: upperFirst(plural(route_name)),
      model_id: model_id,
      model_id_type: model_id_type,
    };

    let filesToGenerates: FileToGenerate[] = getBackendFilesToGenerates(backend.skulljs_repository, props);
    filesToGenerates.forEach((file) => {
      saveLog.generate({
        template: file.template,
        target: file.target,
        props: props,
      });
    });
    await toolbox.loader.succeed();
  },
};

export default routeCommand;
