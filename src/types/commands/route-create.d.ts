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
  frontend_service_folder: string;
}

export interface PromptsModels {
  title: string;
  value: string | boolean;
}

export interface DatabaseModelProperty {
  property_name: string;
  property_type: string;
  property_class_validator?: string;
  is_id: boolean;
}

export interface DatabaseModel {
  model_name: string;
  model_class_validator?: string;
  properties: DatabaseModelProperty[];
}

export interface GenerateProps {
  backend_route_folder: string;
  frontend_service_folder: string;
  route_name_sLc: string;
  route_name_sUcfirst: string;
  route_name_pLc: string;
  route_name_pUcfirst: string;
  model_name_sLc: string;
  model_name_sUcfirst: string;
  model_name_pLc: string;
  model_name_pUcfirst: string;
  model_name_Lc: string;
  model_name_Ucfirst: string;
  model_id: string;
  model_id_type: string;
  crud: string[];
  backend_crud_data: any;
  frontend_crud_data: any;
  model: DatabaseModel;
}

export interface CRUDDataNestjs {
  service: string;
  controller: string;
}

export interface CRUDDataAngular {
  service: string;
}

export interface FileToGenerate {
  template: string;
  target: string;
}

export interface ConvertMatrix {
  number: string[];
  string: string[];
  boolean: string[];
  object: string[];
}
