import { DatatypeModule } from '@faker-js/faker/faker';

export interface GenerateOptions {
  template: string;
  target?: string;
  options?: ejs.Options;
  props?: {
    [key: string]: any;
  };
}

export interface SkFakerDatatype extends DatatypeModule {
  object(): string;
}

export interface SkTemplate {
  /**
   * Render ejs templates
   * @param opts Options to generate
   * @return Rendered template content
   */
  generate(opts: GenerateOptions): Promise<string>;
}
