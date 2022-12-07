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
        project: { backend, frontend },
        exit,
        system: { spawn, getLocalCli },
      } = toolbox;

      if (!backend && !frontend) exit(command, 'No projects found ! ');

      const cliProject = Object.values([backend, frontend]).find((project) => {
        return project?.cli?.alias == cli.alias;
      });

      if (!cliProject) exit(command, `No ${cli.alias} cli found for currently installed projects !`);

      const localCli = getLocalCli(cliProject!, toolbox);

      if (Array.isArray(args[0])) {
        args[0].unshift(localCli.cli);
      }

      const results = await spawn({
        commandLine: 'node',
        args: args[0],
        options: {
          cwd: localCli.cwd,
          stdio: ['inherit', 'inherit', 'pipe'],
          shell: true,
        },
      });
      if (results.error) {
        if (results.stderr) {
          exit(command, results.stderr);
        }
        exit(command, results.error.stack ?? 'Unknown spawn error');
      }
    },
  };
};

export { generateCliCmd };
