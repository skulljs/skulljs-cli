import ejs from 'ejs';
import { replace } from './utils.js';
function buildTemplate(toolbox) {
    async function generate(opts) {
        const { meta: { directory }, fileSystem: { isFile, read, path, write }, strings: { isBlank }, } = toolbox;
        // required
        const template = opts.template;
        // optional
        const target = opts.target;
        const props = opts.props || {};
        // add some goodies to the environment so templates can read them
        const data = {
            props,
            filename: '',
        };
        // check the base directory for templates
        let templateDirectory = `${directory}/templates`;
        let pathToTemplate = `${templateDirectory}/${template}`;
        // check ./build/templates too, if that doesn't exist
        if (!isFile(pathToTemplate)) {
            templateDirectory = `${directory}/build/templates`;
            pathToTemplate = `${templateDirectory}/${template}`;
        }
        // bomb if the template doesn't exist
        if (!isFile(pathToTemplate)) {
            throw new Error(`template not found ${pathToTemplate}`);
        }
        // add template path to support includes
        data.filename = pathToTemplate;
        // read the template
        const templateContent = read(pathToTemplate);
        // render the template
        const content = ejs.render(templateContent, data);
        // save it to the file system
        if (!isBlank(target)) {
            // prep the destination directory
            const dir = replace(/$(\/)*/g, '', target);
            const dest = path(dir);
            write(dest, content);
        }
        // send back the rendered string
        return content;
    }
    return { generate };
}
export { buildTemplate };
