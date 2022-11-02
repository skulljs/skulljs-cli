import { RunOptions, SpawnOpts, SpawnResult } from '@src/types/toolbox/child-process-options';
import { execa } from 'execa';
import nodeSpawn from 'cross-spawn';
import { isNil } from './utils.js';
import { SkSystem } from '@src/types/toolbox/system-tools.js';

/**
 * Executes a commandline via execa.
 * @param commandLine The command line to execute.
 * @param args The arguments used by the command.
 * @param options Additional child_process options for node.
 * @returns Promise with result.
 */
async function run(commandLine: string, args?: string, options: RunOptions = {}): Promise<string> {
  const trimString = options.trim ? (str: any) => str.trim() : (str: any) => str;
  const execArgs = args?.split(' ');
  return new Promise(async (resolve, reject) => {
    try {
      const result = await execa(commandLine, execArgs, options);
      resolve(trimString(result.stdout));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Uses cross-spawn to run a process.
 * @param params object
 * @param params.commandLine - The command line to execute.
 * @param params.args - The arguments used by the command.
 * @param params.options - Additional child_process options for node.
 * @returns The response object.
 */
async function spawn(params: { commandLine: string; args?: string; options?: SpawnOpts }): Promise<SpawnResult> {
  const execArgs = params.args?.split(' ');
  return new Promise((resolve, _reject) => {
    const spawned = nodeSpawn(params.commandLine, execArgs, params.options);
    const result: SpawnResult = {
      stdout: null,
      status: null,
      error: null,
    };
    if (spawned.stdout) {
      spawned.stdout.on('data', (data) => {
        if (isNil(result.stdout)) {
          result.stdout = data;
        } else {
          result.stdout += data;
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

const system: SkSystem = {
  run,
  spawn,
};

export { system, SkSystem };
