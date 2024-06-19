import { Nestjs } from './backend/nestjs.js';
import { Angular } from './frontend/angular.js';
import { RouteGenerateUtils } from './routeGenerateUtils.js';
import toolbox from '@src/toolbox/toolbox.js';

const {
  exit,
  strings: { upperFirst },
} = toolbox;

type SubclassOfRouteGenerateUtils = new () => RouteGenerateUtils<any>;

type StoreObject = {
  [key: string]: SubclassOfRouteGenerateUtils;
};
const Store: StoreObject = {
  Nestjs,
  Angular,
};

export class RouteFactory {
  static getProject(repository: string) {
    repository = upperFirst(repository);
    if (Store[repository] === undefined || Store[repository] === null) {
      exit(toolbox.command, `Repository ${repository} not implemented yet !`);
    }
    return new Store[repository]();
  }
}
