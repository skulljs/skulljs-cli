import { Command } from '@src/types/command';
import { ProjectUse, RepositorySkJson } from '@src/types/project';
import { FileToGenerate, GenerateProps, PromptsModels } from '@src/types/commands/route-create';
import { ProjectFactory } from '@src/assets/route-create/projectFactory.js';

const routeCreateCommand: Command = {
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

    function isFilePath(path: string, isArgs: boolean): { validate: boolean; errorMsg: string } {
      let is_file_path = pattern.test(path);
      const errorMsg = `${path} is not valid : Min length : 3, Characters : letters/slashes, Example: sk route:create example/myroute`;
      if (!is_file_path) {
        if (isArgs) {
          exit(command, errorMsg);
        }
      }
      return { validate: is_file_path, errorMsg };
    }

    let route_path: string = args[0];
    if (route_path) {
      isFilePath(route_path, true);
    } else {
      route_path = await prompts.ask(
        'Path of the route ?',
        (value) => {
          const checker = isFilePath(value, false);
          return checker.validate ? true : checker.errorMsg;
        },
        'example/myRoute'
      );
    }

    // variables declarations
    const backend_variables = ProjectFactory.getProject(backend.skulljs_repository).getVariables(backend, route_path);
    const frontend_variables = frontend
      ? ProjectFactory.getProject(frontend.skulljs_repository).getVariables(frontend, backend_variables.backend_route_folder)
      : null;

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

    const models: PromptsModels[] = ProjectFactory.getProject(backend.skulljs_repository).getAllModels(backend_variables.database_models_file);

    // ask user

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
    const createService = !service || !frontend ? false : await prompts.confirm('Create the associate service ?', true);

    // add files
    toolbox.loader.start(infoLoader('Generating files'));

    const model = ProjectFactory.getProject(backend.skulljs_repository).getModel(backend_variables.database_models_file, selected_model);
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
      frontend_service_folder: frontend_variables ? frontend_variables.frontend_service_folder : '',
      route_name_sLc: lowerCase(singular(route_name)),
      route_name_sUcfirst: upperFirst(singular(route_name)),
      route_name_pLf: lowerFirst(plural(route_name)),
      route_name_pUcfirst: upperFirst(plural(route_name)),
      model_name_sLc: lowerCase(singular(model.model_name)),
      model_name_sUcfirst: upperFirst(singular(model.model_name)),
      model_name_pLc: lowerCase(plural(model.model_name)),
      model_name_pUcfirst: upperFirst(plural(model.model_name)),
      model_name_Lc: lowerCase(model.model_name),
      model_name_Ucfirst: upperFirst(model.model_name),
      model_id: model_id,
      model_id_type: model_id_type,
      crud: crud,
      backend_crud_data: null,
      frontend_crud_data: null,
      model: model,
    };
    props.backend_crud_data = await ProjectFactory.getProject(backend.skulljs_repository).getCRUD(props);

    // backend
    const backendFilesToGenerates: FileToGenerate[] = ProjectFactory.getProject(backend.skulljs_repository).getFiles(props);
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
    if (createService) {
      props.frontend_crud_data = await ProjectFactory.getProject((frontend as RepositorySkJson).skulljs_repository).getCRUD(props);
      const frontendFilesToGenerates: FileToGenerate[] = ProjectFactory.getProject((frontend as RepositorySkJson).skulljs_repository).getFiles(props);
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
    await ProjectFactory.getProject(backend.skulljs_repository).postGeneration(backend_variables, props);
    if (frontend) {
      await ProjectFactory.getProject(frontend.skulljs_repository).postGeneration(frontend_variables, props);
    }
    await toolbox.loader.succeed();
  },
};

export default routeCreateCommand;
