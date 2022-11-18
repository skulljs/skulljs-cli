import repositories from '../assets/repositories.js';
const isInRepositoriesList = (repoName, repoType) => {
    let isIn = false;
    if (repoType == 'frontend') {
        const frontend_repositories = repositories.frontend_repositories;
        frontend_repositories.forEach((repo) => {
            if (repo.name == repoName) {
                isIn = true;
            }
        });
    }
    else if (repoType == 'backend') {
        const backend_repositories = repositories.backend_repositories;
        backend_repositories.forEach((repo) => {
            if (repo.name == repoName) {
                isIn = true;
            }
        });
    }
    return isIn;
};
export default isInRepositoriesList;
