import { GenerateOptions, SkTemplate } from '@src/types/toolbox/template-tools';
import { Toolbox } from '@src/toolbox/toolbox.js';
import { replace } from '../utils.js';
import Handlebars from 'handlebars';
import { registerHelpers } from './helpers.js';

function buildTemplate(toolbox: Toolbox): SkTemplate {
  async function generate(opts: GenerateOptions): Promise<string> {
    const {
      meta: { directory },
      fileSystem: { isFile, read, path, write },
      strings: { isBlank },
    } = toolbox;

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

    // Register Helpers

    registerHelpers(toolbox);

    // read the template

    const templateContent = read(pathToTemplate);

    const render = Handlebars.compile(templateContent);

    const content = render(data, { data: { pathToTemplate } });

    // save it to the file system
    if (!isBlank(target)) {
      // prep the destination directory
      const dir = replace(/$(\/)*/g, '', target!);
      const dest = path(dir);
      write(dest, content);
    }

    // send back the rendered string
    return content;
  }
  return { generate } as SkTemplate;
}

export { buildTemplate, SkTemplate };
