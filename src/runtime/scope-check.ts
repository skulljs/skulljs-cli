import { Command } from '@src/types/command';
import lookUpDef from '@utils/findProjectDef.js';
import { Toolbox } from '@src/toolbox/toolbox.js';

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

  // Check if current directory is in a kestrel-cli project

  const project_def = lookUpDef(process.cwd());
  toolbox.project.project_def = project_def as string;

  if (command.scope == 'in') {
    if (project_def === null) {
      error('No project definition found !');
      error(`The '${command.name}' command must be run inside a skulljs-cli project`);
      return process.exit(0);
    }

    // Get the project defintion as json
    const def_content = read(project_def, 'json');
    const root_dir = path.dirname(project_def);
    toolbox.project.def_content = def_content;

    if (command.needs && command.needs.length <= 2) {
      for (let need of command.needs) {
        if (!def_content.projects.hasOwnProperty(`${need}_path`)) {
          error(`Missing a ${need} project !`);
          return process.exit(0);
        }
      }
    }

    if (def_content.projects.hasOwnProperty('backend_path')) {
      if (!isDirectory(path.join(root_dir, def_content.projects.backend_path))) {
        error(`Cannot find directory '${def_content.projects.backend_path}', did you change its name, if so update it in the skulljs-cli.json file`);
        return process.exit(0);
      }
      const backend_path = path.join(root_dir, def_content.projects.backend_path);
      toolbox.project.backend_path = backend_path;
    }

    if (def_content.projects.hasOwnProperty('frontend_path')) {
      if (!isDirectory(path.join(root_dir, def_content.projects.frontend_path))) {
        error(`Cannot find directory '${def_content.projects.frontend_path}', did you change its name, if so update it in the skulljs-cli.json file`);
        return process.exit(0);
      }
      const frontend_path = path.join(root_dir, def_content.projects.frontend_path);
      toolbox.project.frontend_path = frontend_path;
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
