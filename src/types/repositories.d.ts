interface Repository {
  name: string;
  url: string;
  matching_string_copy: string[] | string | undefined;
}

export interface Repositories {
  frontend_repositories: repository[];
  backend_repositories: repository[];
}
