import SaveHandler from './saveHandler.js';
/**
 * @Class Save
 * Used to save newly created and updated files in the toolbox to display at the end of each command
 */
class SaveMethods extends SaveHandler {
    constructor(toolbox) {
        super(toolbox);
    }
    async generate(options) {
        return await this.toolbox.template.generate(options);
    }
    async copy({ from, target, options }) {
        return await this.toolbox.fileSystem.copyAsync(from, target, options);
    }
    async write({ target, content, options }) {
        return await this.toolbox.fileSystem.writeAsync(target, content, options);
    }
    async run({ command, args, target, action, options }) {
        return await this.toolbox.system.run(command, args, options);
    }
}
function buildSave(toolbox) {
    return new SaveMethods(toolbox);
}
export { buildSave, SaveMethods as Save };
