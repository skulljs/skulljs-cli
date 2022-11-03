import repositories from '@src/assets/repositories.js';
import { Repository } from '@src/types/repositories';

type Needs = 'frontend' | 'backend';

const isInRepositoriesList = (repoName: string, repoType: Needs): Boolean => {
  let isIn = false;
  if (repoType == 'frontend') {
    const frontend_repositories = repositories.frontend_repositories;
    frontend_repositories.forEach((repo: Repository) => {
      if (repo.name == repoName) {
        isIn = true;
      }
    });
  } else if (repoType == 'backend') {
    const backend_repositories = repositories.backend_repositories;
    backend_repositories.forEach((repo: Repository) => {
      if (repo.name == repoName) {
        isIn = true;
      }
    });
  }

  return isIn;
};

export default isInRepositoriesList;
