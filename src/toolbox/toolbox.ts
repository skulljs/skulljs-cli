import { Aliases, CommandsObject } from '@src/types/command';
import Project from '@src/types/project';
import { Command as Cli } from 'commander';
import path from 'path';

import { SkToolBox } from '@src/types/toolbox/toolbox.js';
import { FileSystemUpdate } from '@src/types/toolbox/saveLog/fileSystem';

import { prompt } from '@src/toolbox/tools/prompts-tools.js';
import { print } from '@src/toolbox/tools/print-tools.js';
import { buildLoader } from '@src/toolbox/tools/loader-tools/worker.js';
import { fileSystem } from '@src/toolbox/tools/filesystem-tools.js';
import { strings } from '@src/toolbox/tools/strings-tools.js';
import { buildTemplate } from '@src/toolbox/tools/template-tools/template-tools.js';
import { system } from '@src/toolbox/tools/system-tools.js';
import { buildSave } from '@src/toolbox/tools/saveLog-tools/saveMethods.js';
import { patching } from '@src/toolbox/tools/patching-tools.js';
import { meta } from '@src/toolbox/tools/meta-tools.js';
import { exitHelp } from '@src/toolbox/tools/exit-with-help-tools.js';

/**
 * @class Toolbox
 * class passed to all commands as parameter
 */
export class Toolbox implements SkToolBox {
  project: Project = {};
  fileSystemUpdates: FileSystemUpdate[] = [];
  commands: CommandsObject = {};
  aliases: Aliases = {};
  command?: Cli = undefined;
  // Known Extensions
  cli = new Cli().version(meta.version);
  path = path;
  prompts = prompt;
  print = print;
  loader = buildLoader();
  fileSystem = fileSystem;
  strings = strings;
  template = buildTemplate(this);
  system = system;
  saveLog = buildSave(this);
  patching = patching;
  meta = meta;
  exit = exitHelp;
}

export default new Toolbox();
