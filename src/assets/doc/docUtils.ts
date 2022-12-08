import { RepositorySkJson } from '@src/types/project';

export abstract class DocUtils {
  abstract generateDoc(repository: RepositorySkJson): Promise<void>;
}
