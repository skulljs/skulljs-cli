const generateCliCmd = (cli) => {
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
            const { project: { def_content }, exit, system: { spawn, getLocalCli }, } = toolbox;
            if (def_content) {
                const cliProject = Object.values(def_content?.projects).find((project) => {
                    return project.cli?.alias == cli.alias;
                });
                if (!cliProject)
                    exit(command, `No ${cli.alias} cli found for currently installed projects !`);
                const localCli = getLocalCli(cliProject, toolbox);
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
                if (results.error && results.stderr) {
                    exit(command, results.stderr);
                }
            }
        },
    };
};
export { generateCliCmd };
