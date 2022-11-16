import toolbox from '@src/toolbox/toolbox.js';
import { ManagerProps } from '@src/types/commands/build';
import { RepositorySkJson } from '@src/types/project';

const { command, exit, template } = toolbox;

export async function generateManagerFiles(backend: RepositorySkJson, output_path: string, manager: string, app_name: string, port: number) {
  switch (backend.skulljs_repository) {
    case 'nestjs':
      await generateNestJsManagerFiles(output_path, manager, app_name, port);
      break;

    default:
      exit(command, `backend repository ${backend.skulljs_repository} not implemented yet !`);
      break;
  }
}

async function generateNestJsManagerFiles(output_path: string, manager: string, app_name: string, port: number) {
  const props: ManagerProps = { app_name: app_name, script_path: './src/main.js', port: port, dockerfile_opt_runs: ['RUN npx prisma generate'] };
  if (manager == 'pm2') {
    await template.generate({
      template: 'buildCommand/pm2/pm2.ecosystem.json.ejs',
      target: `${output_path}/pm2.ecosystem.json.ejs`.replace('.ejs', ''),
      props: props,
    });
  } else if (manager == 'docker') {
    await template.generate({
      template: 'buildCommand/docker/.dockerignore.ejs',
      target: `${output_path}/.dockerignore.ejs`.replace('.ejs', ''),
      props: props,
    });
    await template.generate({
      template: 'buildCommand/docker/docker-compose.yml.ejs',
      target: `${output_path}/docker-compose.yml.ejs`.replace('.ejs', ''),
      props: props,
    });
    await template.generate({
      template: 'buildCommand/docker/Dockerfile.ejs',
      target: `${output_path}/Dockerfile.ejs`.replace('.ejs', ''),
      props: props,
    });
  }
}

export default {
  generateManagerFiles,
};
