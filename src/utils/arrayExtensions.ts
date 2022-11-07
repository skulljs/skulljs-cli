import toolbox from '@src/toolbox/toolbox.js';
import { SkChoice } from '@src/types/toolbox/prompts-tools';

declare global {
  interface Array<T> {
    toPromptChoices(this: T[], titleKey?: string | number | undefined): SkChoice<T>[];
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
