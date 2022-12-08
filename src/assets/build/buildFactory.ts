import { Nestjs } from './backend/nestjs.js';
import { Angular } from './frontend/angular.js';
import toolbox from '@src/toolbox/toolbox.js';
import { BuildUtils } from './buildUtils.js';

const {
  exit,
  strings: { upperFirst },
} = toolbox;

type SubclassOfBuildUtils = new () => BuildUtils;

type StoreObject = {
  [key: string]: SubclassOfBuildUtils;
};
const Store: StoreObject = {
  Nestjs,
  Angular,
};

export class BuildFactory {
  static getProject(repository: string) {
    repository = upperFirst(repository);
    if (Store[repository] === undefined || Store[repository] === null) {
      exit(toolbox.command, `Repository ${repository} not implemented yet !`);
    }
    return new Store[repository]();
  }
}
