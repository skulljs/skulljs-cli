import { Nestjs } from './backend/nestjs.js';
import { Angular } from './frontend/angular.js';
import toolbox from '@src/toolbox/toolbox.js';
import { RouteCreateUtils } from './routeCreateUtils.js';

const {
  exit,
  strings: { upperFirst },
} = toolbox;

type SubclassOfRouteCreateUtils = new () => RouteCreateUtils<any, any>;

type StoreObject = {
  [key: string]: SubclassOfRouteCreateUtils;
};
const Store: StoreObject = {
  Nestjs,
  Angular,
};

export class ProjectFactory {
  static getProject(repository: string) {
    repository = upperFirst(repository);
    if (Store[repository] === undefined || Store[repository] === null) {
      exit(toolbox.command, `Repository ${repository} not implemented yet !`);
    }
    return new Store[repository]();
  }
}
