import { Toolbox } from '@src/toolbox/toolbox';
import { RepositorySkJson } from '../project';
import { SpawnOpts, RunOptions, SpawnResult } from './child-process-options';
export interface LocalCli {
  cwd: string;
  cli: string;
}
export interface SkSystem {
  /**
   * Uses cross-spawn to run a process.
   * @param params object
   * @param params.commandLine - The command line to execute.
   * @param params.args - The arguments used by the command.
   * @param params.options - Additional child_process options for node.
   * @returns Promise with result.
   */
  spawn(params: { commandLine: string; args?: string[]; options?: SpawnOpts }): Promise<SpawnResult>;

  /**
   * Executes a commandline via execa.
   * @param commandLine The command line to execute.
   * @param args The arguments used by the command.
   * @param options Additional child_process options for node.
   * @returns Promise with result.
   */
  run(commandLine: string, args?: string, options: RunOptions = {}): Promise<string>;

  /**
   * Get the local cli of a given project.
   * @param project The project to get the cli from.
   * @param toolbox Application toolbox.
   * @returns LocalCli {cwd,cli}.
   */
  getLocalCli(project: RepositorySkJson, toolbox: Toolbox): LocalCli;
}
