import toolbox from '../../toolbox/toolbox.js';
import { parsePrismaSchema } from '@loancrate/prisma-schema-parser';
import { convertDatabaseTypeToTsType } from './databaseConvert.js';
const { command, strings: { upperFirst, lowerCase, plural }, fileSystem: { read }, exit, } = toolbox;
export function getAllModels(skulljs_repository, database_models_file) {
    let models = [];
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
function getPrismaAllModels(database_models_file) {
    let models = [];
    const schema = parsePrismaSchema('' + read(database_models_file));
    schema.declarations.forEach((declaration) => {
        if ((declaration.kind = 'model' && declaration.name.value != 'client' && declaration.name.value != 'db')) {
            let keep = true;
            declaration.members.forEach((property) => {
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
export function getModel(skulljs_repository, database_models_file, model_name) {
    let model = { model_name: '', properties: [] };
    switch (skulljs_repository) {
        case 'nestjs':
            model = getPrismaModel(skulljs_repository, database_models_file, model_name);
            break;
        default:
            exit(command, `backend repository ${skulljs_repository} not implemented yet !`);
            break;
    }
    return model;
}
function getPrismaModel(skulljs_repository, database_models_file, model_name) {
    const model = { model_name: '', properties: [], model_class_validator: '' };
    const class_validator = [];
    const schema = parsePrismaSchema('' + read(database_models_file));
    schema.declarations.forEach((declaration) => {
        if (lowerCase(plural(declaration.name.value)) == lowerCase(plural(model_name))) {
            model.model_name = declaration.name.value;
            declaration.members.forEach((property) => {
                if (property.type.kind == 'typeId') {
                    let is_id = false;
                    let keep = true;
                    property.attributes.forEach((attribute) => {
                        if (attribute.path.value.includes('id')) {
                            is_id = true;
                        }
                        if (attribute.path.value.includes('relation')) {
                            keep = false;
                        }
                    });
                    if (keep) {
                        const type = convertDatabaseTypeToTsType(skulljs_repository, property.type.name.value);
                        const property_object = {
                            property_name: property.name.value,
                            property_type: type,
                            property_class_validator: type == 'object' ? '@IsJSON()' : `@Is${upperFirst(type)}()`,
                            is_id,
                        };
                        model.properties.push(property_object);
                        const property_class_validator_string = property_object.property_class_validator;
                        class_validator.push(property_class_validator_string.substring(1, property_class_validator_string.length - 2));
                    }
                }
                else if (property.type.kind == 'optional') {
                    let keep = true;
                    property.attributes.forEach((attribute) => {
                        if (attribute.path.value.includes('relation')) {
                            keep = false;
                        }
                    });
                    if (keep) {
                        const type = convertDatabaseTypeToTsType(skulljs_repository, property.type.type.name.value);
                        const property_object = {
                            property_name: property.name.value,
                            property_type: type,
                            property_class_validator: type == 'object' ? '@IsJSON()' : `@Is${upperFirst(type)}()`,
                            is_id: false,
                        };
                        model.properties.push(property_object);
                        const property_class_validator_string = property_object.property_class_validator;
                        class_validator.push(property_class_validator_string.substring(1, property_class_validator_string.length - 2));
                    }
                }
            });
        }
    });
    // unique
    model.model_class_validator = [...new Set(class_validator)].join(', ');
    return model;
}
export default {
    getAllModels,
    getModel,
};
