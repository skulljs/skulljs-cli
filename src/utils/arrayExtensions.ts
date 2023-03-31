import toolbox from '@src/toolbox/toolbox.js';
import { SkChoice } from '@src/types/toolbox/prompts-tools';

declare global {
  interface Array<T> {
    toPromptChoices(this: T[], titleKey?: string | number | undefined): SkChoice<T>[];
    asyncForEach(this: T[], callback: (element: T, index: number, array: T[]) => Promise<void>): Promise<void>;
  }
}

Array.prototype.toPromptChoices = function <T>(this: T[], titleKey = undefined) {
  return this.reduce((result: SkChoice<T>[], value: T) => {
    let title: any = value;
    if (titleKey) {
      title = value[titleKey as keyof T];
    }
    if (typeof title !== 'undefined') {
      const choice: SkChoice<T> = { title: title.toString(), value: value };
      result.push(choice);
    } else {
      toolbox.print.error(`[Error] Key ${titleKey} was not found in ${JSON.stringify(this)}.toPromptChoices()`);
    }
    return result;
  }, []);
};

/**
 * async Array.Foreach
 * @param callback Callback to call on each Element
 */
Array.prototype.asyncForEach = async function <T>(this: T[], callback: (element: T, index: number, array: T[]) => Promise<void>) {
  for (let index = 0; index < this.length; index++) {
    await callback(this[index], index, this);
  }
};
