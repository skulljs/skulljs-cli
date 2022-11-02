import { ExecOptions, SpawnOptions } from 'node:child_process'

/**
 * Child process exec options with additional properties
 */
export interface RunOptions extends ExecOptions {
  /**
   * Remove trailing white space of the output
   */
  trim?: boolean
}

/**
 * Result for the run method
 */
export interface RunResult {
  /**
   * Output of the execa command
   */
  stdout: string | null
  /**
   * Error if any
   */
  error: Error | null
}

/**
 * Child process spawn options with additional properties
 */
export interface SpawnOpts extends SpawnOptions {
  /**
   * Remove trailing white space of the output
   */
  trim?: boolean
}

/**
 * Result for the spawn method
 */
export interface SpawnResult {
  /**
   * Output of the cross-spawn command
   */
  stdout: null
  /**
   * Return code of the command
   */
  status: number | null
  /**
   * Error if any
   */
  error: Error | null
}
