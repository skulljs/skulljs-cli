import { ParseOptions, Command as program, Option, Argument, Command as Cmd } from 'commander';
import { readdirSync } from 'node:fs';
import * as url from 'url';
import path from 'path';
import { Command } from '@src/types/command';
import toolbox from '@src/toolbox/toolbox.js';
import scopeExt from '@src/runtime/scope-check.js';
import errorsHandler from '@src/runtime/exit-handler.js';
import setCommand from '@src/runtime/set-command.js';
import '@src/utils/arrayExtensions.js';
import repositories from './assets/repositories.js';
import { generateCliCmd } from './assets/forwarding/commandGenerator.js';
import { EOL } from 'node:os';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function run(argv?: readonly string[] | undefined, options?: ParseOptions | undefined) {
  const commandsPath: string[] = readdirSync(path.join(__dirname, 'commands'));
  const commands = await Promise.all(
    commandsPath.map(async (path) => {
      return (await import(`./commands/${path}`)).default as Command;
    })
  );

  // Add all cli commands from repositories

  repositories.backend_repositories.forEach((repo) => {
    if (repo.cli) commands.push(generateCliCmd(repo.cli));
  });
  repositories.frontend_repositories.forEach((repo) => {
    if (repo.cli) commands.push(generateCliCmd(repo.cli));
  });

  for (const command of commands) {
    const newCmd = new Cmd(command.name)
      .description(command.description || '')
      .aliases(command.aliases || [])
      .action(function (this: program) {
        command.run(toolbox, this.opts(), this.processedArgs, this);
      });

    // Configure if command ignores args and options

    if (command.parseIgnore) {
      newCmd.helpOption(false);
      newCmd.allowUnknownOption();
    }

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
        if (arg.variadic) {
          argument.variadic = true;
        }
        newCmd.addArgument(argument);
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
        newCmd.addOption(option);
      }
    }

    // Custom commander error display for subCommands

    newCmd.showHelpAfterError();
    newCmd.configureOutput({
      writeErr(str) {
        if (!['\n', '\r\n'].includes(str)) {
          console.error(str.trim(), EOL);
        }
      },
      outputError: (str, write) => write(toolbox.print.chalk.red.bold(`Skulljs-cli - ${command.name} : ${str.trim()}`)),
    });

    // Add the command to the cli

    toolbox.cli.addCommand(newCmd);

    // Populate toolbox.commands and toolbox.aliases with commands read from the commands folder

    toolbox.commands[command.name] = command;
    command.aliases?.forEach((alias) => {
      toolbox.aliases[alias] = command.name;
    });
  }

  // Custom commander error display for the cli

  toolbox.cli.showHelpAfterError();
  toolbox.cli.configureOutput({
    writeErr(str) {
      if (!['\n', '\r\n'].includes(str)) {
        console.error(str.trim(), EOL);
      }
    },
    outputError: (str, write) => write(toolbox.print.chalk.red.bold(`Skulljs-cli : ${str.trim()}`)),
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
