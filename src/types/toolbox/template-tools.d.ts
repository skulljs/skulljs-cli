export interface GenerateOptions {
  template: string;
  target?: string;
  props?: {
    [key: string]: any;
  };
}
export interface SkTemplate {
  /**
   * Render ejs templates
   * @param opts Options to generate
   * @return Rendered template content
   */
  generate(opts: GenerateOptions): Promise<string>;
}
