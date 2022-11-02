import { SkPrompts, Validate } from '@src/types/toolbox/prompts-tools';
import prompts, { PromptObject, Answers } from 'prompts';

/**
 * Execute code when prompts are interupted
 */
function cancelProcess() {
  process.exit(0);
}

/**
 * Prompt a yes/no question
 * @param message Message to prompt
 * @param initial Default response when prompting 'false' if not provided
 * @returns response as boolean
 */
async function confirm(message: string, initial: boolean = false): Promise<boolean> {
  const { yesno } = await prompts(
    {
      type: 'toggle',
      name: 'yesno',
      message: message,
      initial: initial,
      active: 'yes',
      inactive: 'no',
    },
    {
      onCancel: cancelProcess,
    }
  );
  return yesno;
}

/**
 * Prompt a question with user input response
 * @param message Message to prompt
 * @param validate Function to validate the user input
 * @param initial Default response when prompting empty string if not provided
 * @returns response as string
 */
async function ask(
  message: string,
  validate: Validate = (input: string) => {
    return true;
  },
  initial = ''
): Promise<string> {
  const { response } = await prompts(
    {
      type: 'text',
      name: 'response',
      initial: initial,
      message: message,
      validate: validate,
    },
    {
      onCancel: cancelProcess,
    }
  );
  return response;
}

/**
 * Prompt a single choice select
 * @param message Message to prompt
 * @param choices List of choices
 * @param initial Default response when prompting '0' if not provided
 * @param convert
 * @returns response
 */
async function select(message: any, choices: any, initial = 0, convert = false) {
  if (convert) {
    choices = choices.map((choice: any) => {
      return { title: choice, value: choice };
    });
  }
  const { response } = await prompts(
    {
      type: 'select',
      name: 'response',
      message: message,
      choices: choices,
      initial: initial,
    },
    {
      onCancel: cancelProcess,
    }
  );
  return response;
}

/**
 * Prompt a multiple choice select
 * @param message Message to prompt
 * @param choices List of choices
 * @param initial Default response when prompting '0' if not provided
 * @param convert
 * @returns response
 */
async function multiSelect(message: any, choices: any, initial = 0, convert = false) {
  if (convert) {
    choices = choices.map((choice: any) => {
      return { title: choice, value: choice };
    });
  }
  const { response } = await prompts(
    {
      type: 'autocompleteMultiselect',
      name: 'response',
      instructions: false,
      hint: 'A - Toggle All, Space - Toggle Select',
      message: message,
      choices: choices,
      initial: initial,
    },
    {
      onCancel: cancelProcess,
    }
  );
  return response;
}

/**
 * Prompt for a string separated by ,
 * @param message Message to prompt
 * @param initial Default response when prompting empty string if not provided
 * @returns response
 */
async function askList(message: string, initial = '') {
  const { response } = await prompts(
    {
      type: 'list',
      name: 'response',
      message: message,
      initial: initial,
      separator: ',',
    },
    {
      onCancel: cancelProcess,
    }
  );
  return response;
}

/**
 * Create any prompts from the prompts package
 * @param questions List of prompts Question object
 * @returns response
 */
async function any<T extends string>(questions: PromptObject[]): Promise<Answers<T>> {
  const responses = await prompts(questions, {
    onCancel: cancelProcess,
  });
  return responses;
}

const inject = prompts.inject;

const prompt: SkPrompts = {
  confirm,
  ask,
  select,
  multiSelect,
  askList,
  any,
  inject,
};

export { prompt, SkPrompts };
