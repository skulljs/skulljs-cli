import { buildBackend } from '@src/assets/build/buildUtils.js';
import { copyBackend } from '@src/assets/build/copyUtils.js';
import { Command } from '@src/types/command';
import { ProjectUse } from '@src/types/project';
import url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const buildCommand: Command = {
  name: 'build',
  scope: 'in',
  needs: ['frontend', 'backend'],
  description: 'Build project for production',
  run: async (toolbox, options, args, command) => {
    const {
      print: { infoLoader },
      fileSystem: { writeAsync, copyAsync, exists, removeAsync, dirAsync, findAsync, readAsync },
      system: { run },
      prompts,
      patching: { patch },
      template: { generate },
      saveLog,
      path,
      exit,
    } = toolbox;

    const { backend, frontend } = toolbox.project as ProjectUse;
    const output_path = path.join(backend.path, '../dist');

    // Ask user

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

    // Build backend
    toolbox.loader.start(infoLoader('Building backend'));
    await buildBackend(backend);
    await toolbox.loader.succeed();

    // Copying backend to dist
    toolbox.loader.start(infoLoader('Copying backend to dist'));
    await copyBackend(backend, output_path);
    await toolbox.loader.succeed();
  },
};

export default buildCommand;
