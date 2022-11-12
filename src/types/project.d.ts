import { CliInfos } from './repositories';
/**
 * Structure of a skulljs-cli file
 */
export interface cliFile {
  projects: {
    backend?: RepositorySkJson;
    frontend?: RepositorySkJson;
  };
  cli_version: string;
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
