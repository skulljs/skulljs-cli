import { execa } from 'execa';
import nodeSpawn from 'cross-spawn';
import { isNil } from './utils.js';
function getLocalCli(project, toolbox) {
    const { exit, command, path } = toolbox;
    const cmdCwd = project.path;
    if (!project.cli)
        exit(command, `No cli found for ${project.path} project!`);
    const cliCmd = path.join(cmdCwd, 'node_modules', project.cli.path);
    return {
        cwd: cmdCwd,
        cli: cliCmd,
    };
}
async function run(commandLine, args, options = {}) {
    const trimString = options.trim ? (str) => str.trim() : (str) => str;
    const execArgs = args?.split(' ');
    return new Promise(async (resolve, reject) => {
        try {
            const result = await execa(commandLine, execArgs, options);
            resolve(trimString(result.stdout));
        }
        catch (err) {
            reject(err);
        }
    });
}
async function spawn(params) {
    return new Promise((resolve, _reject) => {
        const spawned = nodeSpawn(params.commandLine, params.args, params.options);
        const result = {
            stdout: null,
            status: null,
            error: null,
            stderr: null,
        };
        if (spawned.stdout) {
            spawned.stdout.on('data', (data) => {
                if (isNil(result.stdout)) {
                    result.stdout = data.toString();
                }
                else {
                    result.stdout += data.toString();
                }
            });
        }
        if (spawned.stderr) {
            spawned.stderr.on('data', (data) => {
                if (isNil(result.stderr)) {
                    result.stderr = data.toString();
                }
                else {
                    result.stderr += data.toString();
                }
            });
        }
        spawned.on('close', (code) => {
            result.status = code;
            resolve(result);
        });
        spawned.on('error', (err) => {
            result.error = err;
            resolve(result);
        });
    });
}
const system = {
    run,
    spawn,
    getLocalCli,
};
export { system };
