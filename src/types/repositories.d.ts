export interface Repository {
  name: string;
  url: string;
  matching_string_copy: string[] | string | undefined;
  cli?: CliInfos;
}

export interface CliInfos {
  alias: string;
  path: string;
}

export interface Repositories {
  frontend_repositories: Repository[];
  backend_repositories: Repository[];
}
