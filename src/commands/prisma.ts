import { Command } from '@src/types/command';

const prismaCommand: Command = {
  name: 'prisma',
  scope: 'in',
  needs: ['backend'],
  parseIgnore: true,
  arguments: [
    {
      name: 'PrismaArgs',
      required: true,
      variadic: true,
      description: 'Prisma cli args and options',
    },
  ],
  description: 'Run prisma cli commands from anywhere in the project',
  run: async (toolbox, options, args, command) => {
    const {
      project: { backend },
      exit,
      system: { spawn },
    } = toolbox;

    args[0].unshift('prisma');

    const results = await spawn({
      commandLine: 'npx',
      args: args[0],
      options: {
        cwd: backend!.path,
        stdio: ['inherit', 'inherit', 'pipe'],
        shell: true,
      },
    });

    if (results.error && results.stderr) {
      exit(command, results.stderr);
    }
  },
};

export default prismaCommand;
