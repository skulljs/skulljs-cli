export interface SkPatchingOptions {
  /* String to be inserted */
  insert?: string;
  /* Insert before this string */
  before?: string | RegExp;
  /* Insert after this string */
  after?: string | RegExp;
  /* Replace this string */
  replace?: string | RegExp;
  /* Delete this string */
  delete?: string | RegExp;
  /* Write even if it already exists  */
  force?: boolean;
}

export interface SkPatching {
  /**
   * Conditionally places a string into a file before or after another string,
   * or replacing another string, or deletes a string. Async.
   *
   * @param filename        File to be patched
   * @param opts            Options
   * @param opts.insert     String to be inserted
   * @param opts.before     Insert before this string
   * @param opts.after      Insert after this string
   * @param opts.replace    Replace this string
   * @param opts.delete     Delete this string
   * @param opts.force      Write even if it already exists
   *
   * @example
   *   await toolbox.patching.patch('thing.js', { before: 'bar', insert: 'foo' })
   *
   */
  patch(filename: string, ...opts: SkPatchingOptions[]): Promise<string | false>;
}
