import { SkChoice, SkPrompts, Validate } from '@src/types/toolbox/prompts-tools';
import prompts, { PromptObject, Answers } from 'prompts';

/**
 * Execute code when prompts are interupted
 */
function cancelProcess() {
  process.exit(0);
}

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

async function select<T>(message: prompts.ValueOrFunc<string>, choices: SkChoice<T>[], initial = 0): Promise<T> {
  const response = (
    await prompts(
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
    )
  ).response as T;
  return response;
}

async function multiSelect<T>(message: prompts.ValueOrFunc<string>, choices: SkChoice<T>[], initial = 0): Promise<T[]> {
  const response = (
    await prompts(
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
    )
  ).response as T[];
  return response;
}

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
