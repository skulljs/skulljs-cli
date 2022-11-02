import { Command } from 'commander';
import { Toolbox } from '@src/toolbox/toolbox.js';

/**
 * Add the running commander command tot the toolbox
 * @param toolbox The cli toolbox
 * @param command The command that is being run
 */
function setCommand(toolbox: Toolbox, command: Command) {
  toolbox.command = command;
}
export default setCommand;
