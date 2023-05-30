import { CliInfos } from './repositories';
/**
 * Structure of a skulljs-cli file
 */
export interface cliFile {
  cli_version: string;
  projects: {
    backend?: RepositorySkJson;
    frontend?: RepositorySkJson;
  };
  latest_build_options?: LatestBuildOptions;
}

export interface LatestBuildOptions {
  app_name: string;
  hostname: string;
  port: string;
  protocol: string;
  manager: string;
}

export interface RepositorySkJson {
  path: string;
  skulljs_repository: string;
  cli?: CliInfos;
  version: string;
}

/**
 * Contains all project related paths and data
 */
export default interface Project {
  /**
   * Path to the skulljs-cli file
   */
  project_def?: string;
  /**
   * Content of the kestre-cli file
   */
  def_content?: cliFile;
  /**
   * backend if it exist
   */
  backend?: RepositorySkJson;
  /**
   * frontend if it exist
   */
  frontend?: RepositorySkJson;
}

export interface ProjectUse {
  project_def: string;
  /**
   * Content of the skulljs-cli file
   */
  def_content: cliFile;
  /**
   * backend if it exist
   */
  backend: RepositorySkJson;
  /**
   * frontend if it exist
   */
  frontend: RepositorySkJson;
}
