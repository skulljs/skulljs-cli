import { Command } from '@src/types/command';

const generateCliCmd = (cliName: string): Command => {
  return {
    name: cliName,
    scope: 'in',
    description: `Forward command to the ${cliName} cli if available`,
    parseIgnore: true,
    arguments: [
      {
        name: 'command',
        required: false,
        description: `${cliName} Cli command`,
        variadic: true,
      },
    ],
    run: async (toolbox, options, args, command) => {
      const {
        project: { def_content, project_def },
        exit,
        path,
        system: { spawn },
      } = toolbox;
      if (def_content) {
        const cliProject = Object.values(def_content?.projects).find((project) => {
          return project.cli === cliName;
        });
        if (!cliProject) exit(command, `No ${cliName} cli found for currently installed projects !`);
        await spawn({
          commandLine: cliProject?.cli!,
          args: args[0],
          options: {
            cwd: path.join(path.dirname(project_def!), cliProject?.path!),
            stdio: ['inherit', 'inherit', 'inherit'],
            shell: true,
          },
        });
      }
    },
  };
};

export { generateCliCmd };
