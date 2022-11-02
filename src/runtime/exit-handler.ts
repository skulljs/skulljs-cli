import { Command } from 'commander';
import { Toolbox } from '@src/toolbox/toolbox.js';

/**
 * Handle exit operations
 * @param toolbox The cli toolbox
 * @param command The command file that is being run
 */
async function exitHandler(toolbox: Toolbox, command: Command) {
  const {
    print: { chalk, log },
  } = toolbox;
  const skCommand = toolbox.commands[command.name()];
  if (!skCommand.sigint) {
    process.on('SIGINT', (signal) => {
      process.exit(0);
    });
  }
  process.on('exit', (code) => {
    if (toolbox.fileSystemUpdates.length > 0) {
      log('');
      for (let elem of toolbox.fileSystemUpdates) {
        switch (elem.action) {
          case 'CREATE':
            {
              log(`${chalk.green(elem.action)} ${elem.path} (${elem.size} bytes)`);
            }
            break;
          case 'UPDATE':
            {
              log(`${chalk.blue(elem.action)} ${elem.path} (${elem.size} bytes)`);
            }
            break;
        }
      }
      log('');
    }
  });
  process.on('uncaughtException', async (err) => {
    if (toolbox.loader.isSpinning()) {
      await toolbox.loader.fail();
    }
    toolbox.exit(command, `${err.stack}`);
  });
}
export default exitHandler;
