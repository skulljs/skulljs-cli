import { DatabaseModel, FileToGenerate, GenerateProps, PromptsModels } from '@src/types/commands/route-create';
import { RepositorySkJson } from '@src/types/project';

export abstract class RouteCreateUtils<V> {
  abstract getFiles(props: GenerateProps): FileToGenerate[];
  abstract postGeneration(variables: V, props: GenerateProps): Promise<void>;
  abstract getVariables(repository: RepositorySkJson, route_path: string): V;
  getModel(database_models_file: string, model_name: string): DatabaseModel {
    throw new Error('Method not implemented.');
  }
  getAllModels(database_models_file: string): PromptsModels[] {
    throw new Error('Method not implemented.');
  }
}
