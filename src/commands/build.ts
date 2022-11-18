import { buildBackend, buildFrontend } from '@src/assets/buildCommand/buildUtils.js';
import { copyBackend, copyFrontend } from '@src/assets/buildCommand/copyUtils.js';
import { generateManagerFiles } from '@src/assets/buildCommand/generateManagerFilesUtils.js';
import { updateNpmPackage } from '@src/assets/buildCommand/npmPackageUtils.js';
import { postCopyBackendScript, postCopyFrontendScript } from '@src/assets/buildCommand/postCopyUtils.js';
import { Command } from '@src/types/command';
import { ProjectUse } from '@src/types/project';
import caca from '@src/toolbox/toolbox.js';
import { BuildProps } from '@src/types/commands/build';

const buildCommand: Command = {
  name: 'build',
  scope: 'in',
  needs: ['frontend', 'backend'],
  description: 'Build project for production',
  run: async (toolbox, options, args, command) => {
    const {
      print: { infoLoader, warn },
      fileSystem: { exists, removeAsync },
      prompts,
      strings: { kebabCase },
      path,
    } = toolbox;

    const { backend, frontend } = toolbox.project as ProjectUse;
    const output_path = path.join(backend.path, '../dist');

    // Ask user

    function validateAppname(app_name: string) {
      const pattern = /^[a-z0-9-_]+$/;
      const test = pattern.test(app_name);
      if (!test || app_name.length <= 0) {
        const validName = kebabCase(app_name);
        return `Enter valid appname - ex : ${validName}`;
      }
      return true;
    }

    function validateHostname(hostname: string) {
      const pattern =
        /(\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b)|localhost|(^((?:([a-z0-9]\.|[a-z0-9][a-z0-9\-]{0,61}[a-z0-9])\.)+)([a-z0-9]{2,63}|(?:[a-z0-9][a-z0-9\-]{0,61}[a-z0-9]))\.?$)/gi;
      const test = pattern.test(hostname);
      if (!test || hostname.length <= 0) {
        return 'Enter valid hostname - ex : 192.168.0.1, localhost or example.com';
      }
      return true;
    }

    function validatePort(port: string) {
      return !isNaN(+port) ? true : 'Enter a valid port - ex : 443';
    }

    const app_name = await prompts.ask('Name of the app', validateAppname);
    const hostname = await prompts.ask('Hostname or IP of the server', validateHostname);
    const port = await prompts.ask('Port of the server', validatePort, '443');
    const protocol = await prompts.select('Which hypertext transfer protocol do you want to use ?', [
      { title: 'HTTPS', value: 'https' },
      { title: 'HTTP', value: 'http' },
    ]);
    const manager = await prompts.select('Which manager do you want to use ?', [
      { title: 'PM2', value: 'pm2' },
      { title: 'Docker', value: 'docker' },
    ]);

    const buildProps: BuildProps = {
      port: Number.parseInt(port),
      hostname,
      protocol,
    };

    // Delete dist directory if exist
    if (exists(output_path)) {
      toolbox.loader.start(infoLoader('Deleting previous build directory'));
      await removeAsync(output_path);
      await toolbox.loader.succeed();
    }

    // Build backend
    toolbox.loader.start(infoLoader('Building backend'));
    await buildBackend(backend);
    await toolbox.loader.succeed();

    // Copying backend to dist
    toolbox.loader.start(infoLoader('Copying backend to dist'));
    await copyBackend(backend, output_path, protocol);
    await toolbox.loader.succeed();

    // Post copy backend script
    toolbox.loader.start(infoLoader('Running post backend copy script'));
    await postCopyBackendScript(backend, output_path, buildProps);
    await toolbox.loader.succeed();

    // Build frontend
    toolbox.loader.start(infoLoader('Building frontend'));
    await buildFrontend(frontend, buildProps);
    await toolbox.loader.succeed();

    // Copying frontend to dist
    toolbox.loader.start(infoLoader('Copying frontend to dist'));
    await copyFrontend(frontend, output_path);
    await toolbox.loader.succeed();

    // Post copy frontend script
    toolbox.loader.start(infoLoader('Running post frontend copy script'));
    await postCopyFrontendScript(frontend, output_path, buildProps);
    await toolbox.loader.succeed();

    // Generate files for manager
    toolbox.loader.start(infoLoader(`Generating files for manager: ${manager}`));
    await generateManagerFiles(backend, output_path, manager, app_name, +port);
    await toolbox.loader.succeed();

    // Update npm scripts
    toolbox.loader.start(infoLoader(`Update package.json for manager: ${manager}`));
    await updateNpmPackage(output_path, manager, app_name);
    await toolbox.loader.succeed();

    // Print user
    await warn('Your dist folder is ready.');
    switch (manager) {
      case 'pm2':
        {
          await warn("Don't forget to config your .env and init the database.");
        }
        break;
      case 'docker':
        {
          await warn("Don't forget to config your .env and docker-compose.yml and init the database.");
        }
        break;
    }
  },
};

export default buildCommand;
