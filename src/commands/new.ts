import { Command } from '@src/types/command';
import repositories from '@src/assets/repositories.js';
import { NewProps } from '@src/types/commands/new';
import simpleGit from 'simple-git';
import url from 'url';
import { Repository } from '@src/types/repositories';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const newCommand: Command = {
  name: 'new',
  aliases: ['n'],
  scope: 'out',
  options: [
    {
      flags: '-b, --back',
      description: 'Generate the backend',
    },
    {
      flags: '-f, --front',
      description: 'Generate the frontend',
    },
  ],
  arguments: [
    {
      name: 'project-name',
      description: 'Name of the new project',
      required: true,
    },
  ],
  description: 'Create new project',
  run: async (toolbox, options, args, command) => {
    const {
      system: { run },
      fileSystem: { exists, removeAsync, cwd, readAsync },
      print: { infoLoader, error, warn },
      saveLog: { generate, copy },
      exit,
      prompts,
      strings: { kebabCase },
      meta: { version },
      path,
    } = toolbox;

    const projectName: string = args[0];

    //  set up initial props (to pass into templates)

    const { back, front } = options;

    let single = Boolean(options.back ? !options.front : options.front);

    const props: NewProps = {
      name: projectName,
      backend_path: 'backend',
      backend_repository: '',
      backend_version: '',
      frontend_path: 'frontend',
      frontend_repository: '',
      frontend_version: '',
      sk_version: version,
    };

    if (!props.name || props.name.length === 0) {
      const errorMsg = ['You must provide a valid project name.', 'Example: sk new my-project'];
      exit(command, errorMsg);
    } else if (!/^[a-z0-9-_]+$/.test(props.name)) {
      const validName = kebabCase(props.name);
      const errorMsg = [`${props.name} is not a valid name. Use lower case, dashes and underscore only.`, `Suggested: sk new ${validName}`];
      exit(command, errorMsg);
    }

    if (exists(props.name)) {
      warn(`A directory named ${props.name} already exists !`);
      const overwrite = await prompts.confirm('Overwrite ?');
      if (!overwrite) {
        return undefined;
      }
      toolbox.loader.start(infoLoader('Removing directory'));
      await removeAsync(props.name);
      await toolbox.loader.succeed();
    }

    if (single) {
      if (front) {
        props.frontend_path = '';
        props.backend_path = null;
      }
      if (back) {
        props.frontend_path = null;
        props.backend_path = '';
      }
    }
    // choose repository
    let frontend_repo_selected: Repository | undefined;
    let backend_repo_selected: Repository | undefined;

    if (single) {
      if (front) {
        frontend_repo_selected = await prompts.select('Select the frontend repository', repositories.frontend_repositories.toPromptChoices('name'));
      }
      if (back) {
        backend_repo_selected = await prompts.select('Select the backend repository', repositories.backend_repositories.toPromptChoices('name'));
      }
    } else {
      frontend_repo_selected = await prompts.select('Select the frontend repository', repositories.frontend_repositories.toPromptChoices('name'));
      backend_repo_selected = await prompts.select('Select the backend repository', repositories.backend_repositories.toPromptChoices('name'));
    }

    // get repositories

    const frontend_repo_dir = path.join(__dirname, '../templates/frontend_repo');
    const backend_repo_dir = path.join(__dirname, '../templates/backend_repo');

    if (frontend_repo_selected) {
      props.frontend_repository = frontend_repo_selected.name;
      props.frontend_cli = frontend_repo_selected.cli;
      const downloadFrontendRepository = () => {
        return new Promise(async (resolve, reject) => {
          try {
            if (exists(frontend_repo_dir)) {
              await removeAsync(frontend_repo_dir);
            }
            await simpleGit().clone(frontend_repo_selected!.url, frontend_repo_dir, {});
            resolve(true);
          } catch (err) {
            await toolbox.loader.fail();
            error(`The download of the frontend repository has failed. : ${err}`);
            resolve(false);
          }
        });
      };

      toolbox.loader.start(infoLoader(`Retrieve frontend repository from Git: ${frontend_repo_selected.name}`));
      const isFrontendRepoDownloaded = await downloadFrontendRepository();
      if (!isFrontendRepoDownloaded) exit(command, ['Unable to get the frontend repository.', `Url: ${frontend_repo_selected.url}`]);
      const frontend_package: any = await readAsync(path.join(frontend_repo_dir, 'package.json'));
      props.frontend_version = JSON.parse(frontend_package).version;
      await toolbox.loader.succeed();
    }

    if (backend_repo_selected) {
      props.backend_repository = backend_repo_selected.name;
      props.backend_cli = backend_repo_selected.cli;
      const downloadBackendRepository = () => {
        return new Promise(async (resolve, reject) => {
          try {
            if (exists(backend_repo_dir)) {
              await removeAsync(backend_repo_dir);
            }
            await simpleGit().clone(backend_repo_selected!.url, backend_repo_dir, {});
            resolve(true);
          } catch (err) {
            await toolbox.loader.fail();
            error(`The download of the backend repository has failed. : ${err}`);
            resolve(false);
          }
        });
      };

      toolbox.loader.start(infoLoader(`Retrieve backend repository from Git: ${backend_repo_selected.name}`));
      const isBackendRepoDownloaded = await downloadBackendRepository();
      if (!isBackendRepoDownloaded) exit(command, ['Unable to get the backend repository.', `Url: ${backend_repo_selected.url}`]);
      const backend_package: any = await readAsync(path.join(backend_repo_dir, 'package.json'));
      props.backend_version = JSON.parse(backend_package).version;
      await toolbox.loader.succeed();
    }

    // copy repositories into project folder

    toolbox.loader.start(infoLoader('Copying selected repositories into project folder'));

    if (frontend_repo_selected) {
      await copy({
        from: frontend_repo_dir,
        target: `${props.name}/${props.frontend_path}`,
        options: {
          overwrite: true,
          matching: frontend_repo_selected.matching_string_copy,
        },
      });
    }

    if (backend_repo_selected) {
      await copy({
        from: backend_repo_dir,
        target: `${props.name}/${props.backend_path}`,
        options: {
          overwrite: true,
          matching: backend_repo_selected.matching_string_copy,
        },
      });
    }

    // Copy root files
    await copy({
      from: path.join(__dirname, '../templates/new/files'),
      target: props.name,
      options: {
        overwrite: true,
      },
    });

    await toolbox.loader.succeed();

    // Create skulljs-cli.json

    toolbox.loader.start(infoLoader('Generating skulljs-cli.json'));
    await generate({
      template: 'new/skulljs-cli.json.ejs',
      target: `${props.name}/${'skulljs-cli.json.ejs'.replace('.ejs', '')}`,
      props: props,
    });
    await toolbox.loader.succeed();

    // Install dependecies

    const cwf = path.join(cwd(), props.name);

    if (props.backend_path != null) {
      toolbox.loader.start(infoLoader(`Installing ${path.basename(path.join(cwf, props.backend_path))} dependencies`));

      await run(`npm`, 'install', {
        cwd: path.join(cwf, props.backend_path),
      });
      await toolbox.loader.succeed();
    }
    if (props.frontend_path != null) {
      toolbox.loader.start(infoLoader(`Installing ${path.basename(path.join(cwf, props.frontend_path))} dependencies`));

      await run(`npm`, 'install', {
        cwd: path.join(cwf, props.frontend_path),
      });
      await toolbox.loader.succeed();
    }
  },
};

export default newCommand;
