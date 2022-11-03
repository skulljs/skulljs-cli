import toolbox from '@src/toolbox/toolbox.js';
import { FileToGenerate, GenerateProps } from '@src/types/commands/route-create';

const { command, exit } = toolbox;

export function getBackendFilesToGenerates(skulljs_repository: string, props: GenerateProps): FileToGenerate[] {
  let filesToGenerates: FileToGenerate[] = [];
  switch (skulljs_repository) {
    case 'nestjs':
      filesToGenerates = getBackendNestJsFilesToGenerates(props);
      break;

    default:
      exit(command, `backend repository ${skulljs_repository} not implemented yet !`);
      break;
  }
  return filesToGenerates;
}

function getBackendNestJsFilesToGenerates(props: GenerateProps): FileToGenerate[] {
  return [
    {
      template: 'route-create/backend/nestjs/route.module.ts.ejs',
      target: `${props.backend_route_folder}/${'route.module.ts.ejs'.replace('route', props.route_name).replace('.ejs', '')}`,
    },
    {
      template: 'route-create/backend/nestjs/route.service.ts.ejs',
      target: `${props.backend_route_folder}/${'route.service.ts.ejs'.replace('route', props.route_name).replace('.ejs', '')}`,
    },
  ];
}

export default {
  getBackendFilesToGenerates,
};
