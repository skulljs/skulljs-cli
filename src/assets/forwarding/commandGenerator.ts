import { Command } from '@src/types/command';
import { CliInfos } from '@src/types/repositories';

const generateCliCmd = (cli: CliInfos): Command => {
  return {
    name: cli.alias,
    scope: 'in',
    description: `Forward command to the ${cli.alias} cli if available`,
    parseIgnore: true,
    arguments: [
      {
        name: 'command',
        required: false,
        description: `${cli.alias} Cli command`,
        variadic: true,
      },
    ],
    run: async (toolbox, options, args, command) => {
      const {
        project: { def_content, project_def, backend },
        exit,
        path,
        system: { spawn },
      } = toolbox;
      if (def_content) {
        const cliProject = Object.values(def_content?.projects).find((project) => {
          return project.cli?.alias == cli.alias;
        });
        if (!cliProject) exit(command, `No ${cli.alias} cli found for currently installed projects !`);
        const cmdCwd = path.join(path.dirname(project_def!), cliProject?.path!);
        const cliCmd = path.join(cmdCwd, 'node_modules', cliProject!.cli!.path);
        if (Array.isArray(args[0])) {
          args[0].unshift(cliCmd);
        }
        const results = await spawn({
          commandLine: 'node',
          args: args[0],
          options: {
            cwd: cmdCwd,
            stdio: ['inherit', 'inherit', 'pipe'],
            shell: true,
          },
        });
        if (results.error && results.stderr) {
          exit(command, results.stderr);
        }
      }
    },
  };
};

export { generateCliCmd };
