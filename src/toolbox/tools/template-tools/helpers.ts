import Handlebars from 'handlebars';
import { faker as fakers } from '@faker-js/faker';
import { SkFakerDatatype } from '@src/types/toolbox/template-tools';
import { Toolbox } from '@src/toolbox/toolbox';

// Convert faker to use ts types
(fakers.datatype as unknown as SkFakerDatatype).object = fakers.datatype.json;

export function registerHelpers(toolbox: Toolbox) {
  const {
    path,
    fileSystem: { read },
  } = toolbox;

  Handlebars.registerHelper('faker', function (fakerCommandPath: string, ...options: any[]) {
    const fakerOptions = options.pop().hash;
    const fakerArgs = options;
    if (fakerOptions && Object.entries(fakerOptions).length > 0) {
      fakerArgs.push(fakerOptions);
    }
    const fakerCmd = fakerCommandPath
      .replace(/\[([^\[\]]*)\]/g, '.$1.')
      .split('.')
      .filter((prop) => prop !== '')
      .reduce((prev: any, cur) => prev && prev[cur], fakers);
    if (!(fakerCmd instanceof Function)) throw new Error('Faker path must have been wrong !');

    return fakerCmd.apply(null, fakerArgs);
  });

  Handlebars.registerHelper('getPartial', function (options: Handlebars.HelperOptions) {
    if (arguments.length > 1 || !options.hash.path) {
      throw new Error('getPartial requires exactly one path argument !');
    }

    const partialPath = path.join(path.dirname(options.data.pathToTemplate), `./${options.hash.path}.hbs`);

    const templateContent = read(partialPath);

    if (templateContent === undefined) throw new Error(`getPartial template was not found ! PartialPath : ${partialPath}`);

    Handlebars.registerPartial(path.basename(options.hash.path), templateContent);

    return path.basename(options.hash.path);
  });

  Handlebars.registerHelper('concat', function (this: any, ...elements: any[]) {
    return elements.slice(0, -1).reduce((result, element) => {
      if (element instanceof Function) element = element.call(this);

      return result + element;
    }, '');
  });

  Handlebars.registerHelper('stringify', function (object: any) {
    return JSON.stringify(object);
  });

  Handlebars.registerHelper('eq', function (this: any, value: any, equals: any, options: Handlebars.HelperOptions) {
    if (arguments.length > 3) {
      throw new Error('eq requires exactly two arguments !');
    }

    if (value instanceof Function) {
      value = value.call(this);
    }
    if (equals instanceof Function) {
      equals = equals.call(this);
    }

    if (value !== equals) return options.inverse(this);

    return options.fn(this);
  });

  Handlebars.registerHelper('prop2template', function (this: any, value: any, options: Handlebars.HelperOptions) {
    if (this.type == 'string') return `"${value.replace(/['"\\]/g, '')}"`;
    return value;
  });

  Handlebars.registerHelper('calcPathDepth', function (folder_depth: number) {
    return '../'.repeat(folder_depth);
  });
}
