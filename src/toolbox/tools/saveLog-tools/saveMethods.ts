import { Toolbox } from '../../toolbox.js';
import SaveHandler from './saveHandler.js';

import { GenerateOptions } from '@src/types/toolbox/template-tools';
import { CopyParams, RunParams, WriteParams } from '@src/types/toolbox/saveLog/funcParams';

/**
 * @Class Save
 * Used to save newly created and updated files in the toolbox to display at the end of each command
 */
class SaveMethods extends SaveHandler {
  constructor(toolbox: Toolbox) {
    super(toolbox);
  }
  async generate(options: GenerateOptions) {
    return await this.toolbox.template.generate(options);
  }
  async copy({ from, target, options }: CopyParams) {
    return await this.toolbox.fileSystem.copyAsync(from, target, options);
  }
  async write({ target, content, options }: WriteParams) {
    return await this.toolbox.fileSystem.writeAsync(target, content, options);
  }
  async run({ command, args, target, action, options }: RunParams): Promise<string> {
    return await this.toolbox.system.run(command, args, options);
  }
}

function buildSave(toolbox: Toolbox) {
  return new SaveMethods(toolbox);
}
export { buildSave, SaveMethods as Save };
