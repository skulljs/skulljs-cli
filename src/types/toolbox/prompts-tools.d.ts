import prompts, { Answers, PromptObject } from 'prompts';

export type Validate = (input: string) => boolean | string;

interface SkChoice<T> extends prompts.Choice {
  value?: T;
}

export interface SkPrompts {
  /**
   * Prompt a yes/no question
   * @param message Message to prompt
   * @param initial Default response when prompting 'false' if not provided
   * @returns response as boolean
   */
  confirm(message: string, initial: boolean = false): Promise<boolean>;

  /**
   * Prompt a question with user input response
   * @param message Message to prompt
   * @param validate Function to validate the user input
   * @param initial Default response when prompting empty string if not provided
   * @returns response as string
   */
  ask(message: string, validate?: Validate, initial = ''): Promise<string>;

  /**
   * Prompt a single choice select
   * @param message Message to prompt
   * @param choices List of choices
   * @param initial Default response when prompting '0' if not provided
   * @returns response
   */
  select<T>(message: prompts.ValueOrFunc<string>, choices: SkChoice<T>[], initial = 0): Promise<T>;

  /**
   * Prompt a multiple choice select
   * @param message Message to prompt
   * @param choices List of choices
   * @param initial Default response when prompting '0' if not provided
   * @returns response
   */
  multiSelect<T>(message: prompts.ValueOrFunc<string>, choices: SkChoice<T>[], initial = 0): Promise<T[]>;

  /**
   * Prompt for a string separated by ,
   * @param message Message to prompt
   * @param initial Default response when prompting empty string if not provided
   * @returns response
   */
  askList(message: string, initial = ''): Promise<string[]>;

  /**
   * Create any prompts from the prompts package
   * @param questions List of prompts Question object
   * @returns response
   */
  any<T extends string>(questions: PromptObject[]): Promise<Answers<T>>;

  inject(arr: readonly any[]): void;
}
