import { ParseOptions, Command as program, Option, Argument } from 'commander';
import { readdirSync } from 'node:fs';
import * as url from 'url';
import path from 'path';
import { Command } from '@src/types/command';
import toolbox from '@src/toolbox/toolbox.js';
import scopeExt from '@src/runtime/scope-check.js';
import errorsHandler from '@src/runtime/exit-handler.js';
import setCommand from '@src/runtime/set-command.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function run(argv?: readonly string[] | undefined, options?: ParseOptions | undefined) {
  const commands: string[] = readdirSync(path.join(__dirname, 'commands'));
  for (const commandFile of commands) {
    const command: Command = (await import(`./commands/${commandFile.replace('.ts', '.js')}`)).default;
    const action = toolbox.cli
      .command(command.name)
      .aliases(command.aliases || [])
      .description(command.description || '')
      .action(function (this: program) {
        command.run(toolbox, this.opts(), this.processedArgs, this);
      });

    // Add command arguments to commander.js

    if (command.arguments) {
      for (const arg of command.arguments) {
        const argument = new Argument(arg.name, arg.description);
        arg.required ? argument.argRequired() : argument.argOptional();
        if (arg.default) {
          argument.default(arg.default);
        }
        if (arg.choices) {
          argument.choices(arg.choices);
        }
        action.addArgument(argument);
      }
    }

    // Add command options to commander.js

    if (command.options) {
      for (const opt of command.options) {
        const option = new Option(opt.flags, opt.description);
        if (opt.choices) {
          option.choices(opt.choices);
        }
        if (opt.default) {
          option.default(opt.default);
        }
        if (opt.conflict) {
          option.conflicts(opt.conflict);
        }
        action.addOption(option);
      }
    }

    // Populate toolbox.commands and toolbox.aliases with commands read from the commands folder

    action.showHelpAfterError();
    toolbox.commands[command.name] = command;
    command.aliases?.forEach((alias) => {
      toolbox.aliases[alias] = command.name;
    });
  }
  toolbox.cli.showHelpAfterError();

  // Custom commander error display

  toolbox.cli.configureOutput({
    outputError: (str, write) => write(toolbox.print.chalk.red.bold(`Skulljs-cli : ${str}`)),
  });

  // Load all extensions before running commands

  toolbox.cli.hook('preAction', (thisCommand, actionCommand) => {
    errorsHandler(toolbox, actionCommand);
    setCommand(toolbox, actionCommand);
    scopeExt(toolbox, toolbox.commands[actionCommand.name()]);
  });

  // Run command

  toolbox.cli.parseAsync(argv, options);
}

export default run;
