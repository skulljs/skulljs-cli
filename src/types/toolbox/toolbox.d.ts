import { Save } from '@src/extensions/toolbox/saveLog-tools/save';
import { PlatformPath } from 'path';
import { SkFileSystem } from './fileSystem-tools';
import { SkPatching } from './patching-tools';
import { SkPrint } from './print-tools';
import { SkPrompts } from './prompts-tools';
import { FileSystemUpdate } from './saveLog/FsAction';
import { SkStrings } from './strings-tools';
import { SkSystem } from './system-tools';
import { SkTemplate } from './template-tools';
import { Command as Cli } from 'commander';
import { Loader } from '@src/extensions/toolbox/loader-tools/worker';
import { SkMeta } from './meta-tools';
import { SkExit } from './exit-with-help';

// Final toolbox
export interface SkToolBox {
  cli?: Cli;
  project?: Project;
  template?: SkTemplate;
  saveLog?: Save;
  aliases?: Aliases;
  fileSystemUpdates?: FileSystemUpdate[];
  commands?: CommandsObject;
  command?: Cli;
  // known extensions
  exit: SkExit;
  meta: SkMeta;
  loader: Loader;
  path: PlatformPath;
  fileSystem: SkFileSystem;
  patching: SkPatching;
  print: SkPrint;
  prompts: SkPrompts;
  strings: SkStrings;
  system: SkSystem;
}
