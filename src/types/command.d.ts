import { Toolbox } from '@src/toolbox/toolbox.js'
import { Command as Cmd } from 'commander'

type Needs = 'frontend' | 'backend'
/**
 * @interface Command - Structure for new and existing command files
 */
export interface Command {
  /**
   * Name of the command
   */
  name: string
  /**
   * Aliases of the command
   */
  aliases?: readonly string[]
  /**
   * If the command handles sigint
   */
  sigint?: boolean
  /**
   * Description of the command
   */
  description?: string
  /**
   * Scope for the command to be executed in
   */
  scope?: 'in' | 'out'
  /**
   * Projects needed for the command to be executed
   */
  needs?: Needs[]
  /**
   * Folders to wathc to detect new files created or updated
   */
  foldersToWatch?: {
    frontend?: string[]
    backend?: string[]
  }
  /**
   * CommandLine options for the command
   */
  options?: Array<{
    flags: string
    description?: string
    choices?: string[]
    default?: string | boolean
    conflict?: string | string[]
  }>
  /**
   * CommandLine arguments for the commands
   */
  arguments?: Array<{
    name: string
    description?: string
    choices?: string[]
    default?: string | boolean
    required?: boolean
  }>
  /**
   * Execute the command
   * @param toolbox Toolbox object passed to each command
   * @param options Options passed to the command
   * @param args Arguments passed to the command
   */
  run(toolbox: Toolbox, options: any, args: any, command: Cmd): void
}
/**
 * @interface CommandsObject - Contains all existing commands object
 */
export interface CommandsObject {
  [key: string]: Command
}

export interface Aliases {
  [key: string]: string
}
