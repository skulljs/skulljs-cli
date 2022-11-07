export interface SkStrings {
  /**
   * Is this not a string?
   * @param value The value to check
   * @return True if it is not a string, otherwise false
   */
  isNotString(value: any): boolean;

  /**
   * Is this value a blank string?
   * @param value The value to check.
   * @returns True if it was, otherwise false.
   */
  isBlank(value: any): boolean;

  /**
   * Capitalize first letter of string
   * @param str
   * @returns string
   */
  upperFirst(str: string): string;

  /**
   * Singularize a string
   * @param str
   * @returns string
   */
  singular(str: string): string;

  /**
   * Pluralize a string
   * @param str
   * @returns string
   */
  plural(str: string): string;

  /**
   * Capitalize all string
   * @param str
   * @returns string
   */
  upperCase(str: string): string;

  /**
   * LowerCase for all the string
   * @param str
   * @returns string
   */
  lowerCase(str: string): string;
  /**
   * LowerCase first letter of string
   * @param str
   * @returns string
   */
  lowerFirst(str: string): string;
  kebabCase(string?: string | undefined): string;
}
