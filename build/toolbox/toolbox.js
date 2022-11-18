import { Command as Cli } from 'commander';
import path from 'path';
import { prompt } from '../toolbox/tools/prompts-tools.js';
import { print } from '../toolbox/tools/print-tools.js';
import { buildLoader } from '../toolbox/tools/loader-tools/worker.js';
import { fileSystem } from '../toolbox/tools/filesystem-tools.js';
import { strings } from '../toolbox/tools/strings-tools.js';
import { buildTemplate } from '../toolbox/tools/template-tools.js';
import { system } from '../toolbox/tools/system-tools.js';
import { buildSave } from '../toolbox/tools/saveLog-tools/saveMethods.js';
import { patching } from '../toolbox/tools/patching-tools.js';
import { meta } from '../toolbox/tools/meta-tools.js';
import { exitHelp } from '../toolbox/tools/exit-with-help-tools.js';
/**
 * @class Toolbox
 * class passed to all commands as parameter
 */
export class Toolbox {
    constructor() {
        this.project = {};
        this.fileSystemUpdates = [];
        this.commands = {};
        this.aliases = {};
        this.command = undefined;
        // Known Extensions
        this.cli = new Cli().version(meta.version);
        this.path = path;
        this.prompts = prompt;
        this.print = print;
        this.loader = buildLoader();
        this.fileSystem = fileSystem;
        this.strings = strings;
        this.template = buildTemplate(this);
        this.system = system;
        this.saveLog = buildSave(this);
        this.patching = patching;
        this.meta = meta;
        this.exit = exitHelp;
    }
}
export default new Toolbox();
