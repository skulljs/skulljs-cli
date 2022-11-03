export interface BackendVariables {
  backend_src_folder: string;
  backend_routes_folder: string;
  backend_route_folder: string;
  database_models_file: string;
}

export interface FrontendVariables {
  frontend_service_name: string;
  frontend_src_folder: string;
  frontend_services_folder: string;
  frontend_service_path: string;
}

export interface PromptsModels {
  title: string;
  value: string | boolean;
}

export interface DatabaseModelProperty {
  property_name: string;
  property_type: string;
  is_id: boolean;
}

export interface DatabaseModel {
  model_name: string;
  properties: DatabaseModelProperty[];
}

export interface GenerateProps {
  backend_route_folder: string;
  route_name: string;
  model_name_sLc: string;
  model_name_sUcfirst: string;
  model_name_pLc: string;
  model_name_pUcfirst: string;
  model_id: string;
  model_id_type: string;
}

export interface FileToGenerate {
  template: string;
  target: string;
}
