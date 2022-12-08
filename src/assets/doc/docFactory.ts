import { Nestjs } from './backend/nestjs.js';
import { Angular } from './frontend/angular.js';
import toolbox from '@src/toolbox/toolbox.js';
import { DocUtils } from './docUtils.js';

const {
  exit,
  strings: { upperFirst },
} = toolbox;

type SubclassOfDocUtils = new () => DocUtils;

type StoreObject = {
  [key: string]: SubclassOfDocUtils;
};
const Store: StoreObject = {
  Nestjs,
  Angular,
};

export class DocFactory {
  static getProject(repository: string) {
    repository = upperFirst(repository);
    if (Store[repository] === undefined || Store[repository] === null) {
      exit(toolbox.command, `Repository ${repository} not implemented yet !`);
    }
    return new Store[repository]();
  }
}
