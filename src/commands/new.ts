import { Command } from '@src/types/command';
import { NewProps } from '@src/types/commands/new';
import back_files from '@src/assets/back_files.js';
import front_files from '@src/assets/front_files.js';
import main_files from '@src/assets/main_files.js';
import simpleGit from 'simple-git';
import url from 'url';
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
      fileSystem: { exists, removeAsync, cwd },
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
      frontend_path: 'frontend',
      kc_version: version,
    };

    let toCreate = '';
    let templateFiles = [back_files, front_files, main_files];
    if (single) {
      if (front) {
        toCreate = 'frontend';
        templateFiles = [front_files, main_files];
        props.frontend_path = '';
        props.backend_path = null;
      }
      if (back) {
        toCreate = 'backend';
        templateFiles = [back_files, main_files];
        props.frontend_path = null;
        props.backend_path = '';
      }
    }

    if (!props.name || props.name.length === 0) {
      const errorMsg = ['You must provide a valid project name.', 'Example: kc new my-project'];
      exit(command, errorMsg);
    } else if (!/^[a-z0-9-_]+$/.test(props.name)) {
      const validName = kebabCase(props.name);
      const errorMsg = [`${props.name} is not a valid name. Use lower case, dashes and underscore only.`, `Suggested: kc new ${validName}`];
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

    // get NGX-TEMPLATE from github repository
    const downloadTemplate = () => {
      return new Promise(async (resolve, reject) => {
        try {
          if (exists(path.join(__dirname, '../templates/angular-node'))) {
            await removeAsync(path.join(__dirname, '../templates/angular-node'));
          }
          await simpleGit().clone('https://github.com/kestrel-org/kestrel.git', `${__dirname}/../templates/angular-node`, {});
          await run('node', `${__dirname}/../utils/convertToTemplate.js`);
          resolve(true);
        } catch (err) {
          await toolbox.loader.fail();
          error(`The download of the github repository has failed. : ${err}`);
          resolve(false);
        }
      });
    };

    toolbox.loader.start(infoLoader('Downloading template'));

    const isDownloaded = await downloadTemplate();
    if (!isDownloaded) process.exit(0);
    await toolbox.loader.succeed();

    toolbox.loader.start(infoLoader('Copying directory'));
    await copy({
      from: `${__dirname}/../templates/angular-node/${toCreate}`,
      target: props.name,
      options: {
        overwrite: true,
        matching: ['./!(.github|.git|ROADMAP.md|CHANGELOG.md|.mergify.yml|README.md|*.ejs)', './!(.github|.git)/**/!(*.ejs)'],
      },
    });
    await toolbox.loader.succeed();

    let generators: Promise<string>[] = [];
    toolbox.loader.start(infoLoader('Generating templates'));
    for (let files of templateFiles) {
      generators = files.toTransform.reduce((res, file) => {
        const generator = generate({
          template: `${file.path + file.filename}.ejs`,
          target: `${props.name}/${(single ? file.createPath : file.part) + file.filename.replace('.ejs', '')}`,
          props: props,
        });
        return res.concat(generator);
      }, generators);
    }
    await Promise.all(generators);
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
