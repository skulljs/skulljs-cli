/**
 * Structure of a skulljs-cli file
 */
export interface cliFile {
  projects: {
    backend?: {
      path: string;
      skulljs_repository: string;
      version: string;
    };
    frontend?: {
      path: string;
      skulljs_repository: string;
      version: string;
    };
  };
  cli_version: string;
}

export interface Repository {
  path: string;
  skulljs_repository: string;
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
  backend?: Repository;
  /**
   * frontend if it exist
   */
  frontend?: Repository;
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
  backend: Repository;
  /**
   * frontend if it exist
   */
  frontend: Repository;
}
