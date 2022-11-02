import { SkExit } from '@src/types/toolbox/exit-with-help';
import { Command } from 'commander';

/**
 * Use commander to exit with error and help
 * @param command Commander command object
 * @param message Message to display when exiting
 */
function exit(command: Command, message: string | string[]) {
  if (Array.isArray(message)) {
    message = message.join('\n');
  }
  command.error(message);
}

const exitHelp: SkExit = exit;

export { exitHelp, SkExit };
