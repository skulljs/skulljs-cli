import { Command } from '@src/types/command';
import lookUpDef from '@utils/findProjectDef.js';
import { Toolbox } from '@src/toolbox/toolbox.js';
import isInRepositoriesList from '@src/utils/isInRepositoriesList.js';
import { cliFile } from '@src/types/project';

/**
 * Check if command is run in the correct scope
 * @param toolbox The cli toolbox
 * @param command The command file that is being run
 */
function scopeCheck(toolbox: Toolbox, command: Command) {
  const {
    fileSystem: { read, isDirectory },
    print: { error },
    path,
  } = toolbox;

  // Check if current directory is in a skulljs-cli project

  const project_def = lookUpDef(process.cwd());
  toolbox.project.project_def = project_def as string;

  if (command.scope == 'in') {
    if (project_def === null) {
      error('No project definition found !');
      error(`The '${command.name}' command must be run inside a skulljs-cli project`);
      return process.exit(0);
    }

    // Get the project defintion as json
    const def_content: cliFile = read(project_def, 'json');
    const root_dir = path.dirname(project_def);
    toolbox.project.def_content = def_content;

    if (command.needs && command.needs.length <= 2) {
      for (let need of command.needs) {
        if (!def_content.projects.hasOwnProperty(`${need}`)) {
          error(`Missing a ${need} project !`);
          return process.exit(0);
        }
      }
    }

    if (def_content.projects.hasOwnProperty('backend')) {
      if (def_content.projects.backend!.hasOwnProperty('path')) {
        if (!isDirectory(path.join(root_dir, def_content.projects.backend!.path))) {
          error(`Cannot find directory '${def_content.projects.backend!.path}', did you change its name, if so update it in the skulljs-cli.json file`);
          return process.exit(0);
        }
      }
      if (def_content.projects.backend!.hasOwnProperty('skulljs_repository')) {
        if (!isInRepositoriesList(def_content.projects.backend!.skulljs_repository, 'backend')) {
          error(`Cannot find repository '${def_content.projects.backend!.skulljs_repository}' in repositories list, check the skulljs-cli.json file`);
          return process.exit(0);
        }
      }
      const backend_path = path.join(root_dir, def_content.projects.backend!.path);
      toolbox.project.backend = {
        path: backend_path,
        skulljs_repository: def_content.projects.backend!.skulljs_repository,
        cli: def_content.projects.backend?.cli,
        version: def_content.projects.backend!.version,
      };
    }

    if (def_content.projects.hasOwnProperty('frontend')) {
      if (def_content.projects.frontend!.hasOwnProperty('path')) {
        if (!isDirectory(path.join(root_dir, def_content.projects.frontend!.path))) {
          error(`Cannot find directory '${def_content.projects.frontend!.path}', did you change its name, if so update it in the skulljs-cli.json file`);
          return process.exit(0);
        }
      }
      if (def_content.projects.frontend!.hasOwnProperty('skulljs_repository')) {
        if (!isInRepositoriesList(def_content.projects.frontend!.skulljs_repository, 'frontend')) {
          error(`Cannot find repository '${def_content.projects.frontend!.skulljs_repository}' in repositories list, check the skulljs-cli.json file`);
          return process.exit(0);
        }
      }
      const frontend_path = path.join(root_dir, def_content.projects.frontend!.path);
      toolbox.project.frontend = {
        path: frontend_path,
        skulljs_repository: def_content.projects.frontend!.skulljs_repository,
        cli: def_content.projects.frontend!.cli,
        version: def_content.projects.frontend!.version,
      };
    }
  }
  if (command.scope == 'out') {
    if (project_def != null) {
      error('Project definition found !');
      error(`The '${command.name}' command must be run outside a skulljs project`);
      return process.exit(0);
    }
  }
}
export default scopeCheck;
