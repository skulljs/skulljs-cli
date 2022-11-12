import { Repositories } from '@src/types/repositories';

const repositories: Repositories = {
  frontend_repositories: [
    {
      name: 'angular',
      url: 'https://github.com/skulljs/angular',
      matching_string_copy: ['./!(.git|.mergify.yml|.editorconfig|.prettierrc|CHANGELOG.md|README.md)', './!(.github|.git)/**/*'],
      cli: {
        alias: 'ng',
        path: '@angular/cli/bin/ng.js',
      },
    },
  ],
  backend_repositories: [
    {
      name: 'nestjs',
      url: 'https://github.com/skulljs/nestjs',
      matching_string_copy: ['./!(.git|.mergify.yml|.editorconfig|.prettierrc|CHANGELOG.md|README.md)', './!(.github|.git)/**/*'],
      cli: {
        alias: 'nest',
        path: '@nestjs/cli/bin/nest.js',
      },
    },
  ],
};

export default repositories;
