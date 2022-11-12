import { RunOptions, SpawnOpts, SpawnResult } from '@src/types/toolbox/child-process-options';
import { execa } from 'execa';
import nodeSpawn from 'cross-spawn';
import { isNil } from './utils.js';
import { SkSystem } from '@src/types/toolbox/system-tools.js';

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

async function spawn(params: { commandLine: string; args?: string[]; options?: SpawnOpts }): Promise<SpawnResult> {
  return new Promise((resolve, _reject) => {
    const spawned = nodeSpawn(params.commandLine, params.args, params.options);
    const result: SpawnResult = {
      stdout: null,
      status: null,
      error: null,
      stderr: null,
    };
    if (spawned.stdout) {
      spawned.stdout.on('data', (data) => {
        if (isNil(result.stdout)) {
          result.stdout = data.toString();
        } else {
          result.stdout += data.toString();
        }
      });
    }
    if (spawned.stderr) {
      spawned.stderr.on('data', (data) => {
        if (isNil(result.stderr)) {
          result.stderr = data.toString();
        } else {
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

const system: SkSystem = {
  run,
  spawn,
};

export { system, SkSystem };
