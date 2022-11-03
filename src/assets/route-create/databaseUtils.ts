import toolbox from '@src/toolbox/toolbox.js';
import { DatabaseModel, PromptsModels } from '@src/types/commands/route-create';
import { parsePrismaSchema } from '@loancrate/prisma-schema-parser';

const {
  command,
  strings: { upperFirst, lowerCase, plural },
  fileSystem: { read },
  exit,
} = toolbox;

export function getAllModels(skulljs_repository: string, database_models_file: string): PromptsModels[] {
  let models: PromptsModels[] = [];
  switch (skulljs_repository) {
    case 'nestjs':
      models = getPrismaAllModels(database_models_file);
      break;

    default:
      exit(command, `backend repository ${skulljs_repository} not implemented yet !`);
      break;
  }
  return models;
}

function getPrismaAllModels(database_models_file: string): PromptsModels[] {
  let models: PromptsModels[] = [];
  const schema = parsePrismaSchema('' + read(database_models_file));
  schema.declarations.forEach((declaration: any) => {
    if ((declaration.kind = 'model' && declaration.name.value != 'client' && declaration.name.value != 'db')) {
      let keep = true;
      declaration.members.forEach((property: any) => {
        if (property.kind == 'enumValue') {
          keep = false;
        }
      });
      if (keep) {
        models.push({
          title: upperFirst(declaration.name.value),
          value: lowerCase(declaration.name.value),
        });
      }
    }
  });

  return models;
}

export function getModel(skulljs_repository: string, database_models_file: string, model_name: string): DatabaseModel {
  let model: DatabaseModel = { model_name: '', properties: [] };
  switch (skulljs_repository) {
    case 'nestjs':
      model = getPrismaModel(database_models_file, model_name);
      break;

    default:
      exit(command, `backend repository ${skulljs_repository} not implemented yet !`);
      break;
  }
  return model;
}

function getPrismaModel(database_models_file: string, model_name: string): DatabaseModel {
  const model: DatabaseModel = { model_name: '', properties: [] };
  const schema = parsePrismaSchema('' + read(database_models_file));
  schema.declarations.forEach((declaration: any) => {
    if (lowerCase(plural(declaration.name.value)) == lowerCase(plural(model_name))) {
      model.model_name = declaration.name.value;
      declaration.members.forEach((property: any) => {
        if (property.type.kind == 'typeId') {
          let is_id = false;
          let keep = true;
          property.attributes.forEach((attribute: any) => {
            if (attribute.path.value.includes('id')) {
              is_id = true;
            }
            if (attribute.path.value.includes('relation')) {
              keep = false;
            }
          });
          if (keep) {
            model.properties.push({ property_name: property.name.value, property_type: property.type.name.value, is_id });
          }
        } else if (property.type.kind == 'optional') {
          let keep = true;
          property.attributes.forEach((attribute: any) => {
            if (attribute.path.value.includes('relation')) {
              keep = false;
            }
          });
          if (keep) {
            model.properties.push({ property_name: property.name.value, property_type: property.type.type.name.value, is_id: false });
          }
        }
      });
    }
  });

  return model;
}

export default {
  getAllModels,
  getModel,
};
