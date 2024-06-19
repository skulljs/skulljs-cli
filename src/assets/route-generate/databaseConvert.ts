import { FieldDeclaration } from '@loancrate/prisma-schema-parser';
import { ConvertMatrix } from '@src/types/commands/route-generate';

function convertPrisma(modelField: FieldDeclaration) {
  let converted_type = 'string';

  const prisma_convert_matrix: ConvertMatrix = {
    number: ['Int', 'BigInt', 'Float', 'Decimal'],
    string: ['String', 'DateTime', 'Bytes'],
    boolean: ['Boolean'],
    object: ['Json'],
  };

  function getPrismaModelPropertyType(property: FieldDeclaration) {
    const propertyType = property.type;
    switch (propertyType.kind) {
      case 'typeId':
        return propertyType.name.value;
      case 'unsupported':
        return propertyType.type.value;
      default:
        const baseType = propertyType.type;
        switch (baseType.kind) {
          case 'typeId':
            return baseType.name.value;
          case 'unsupported':
            return baseType.type.value;
        }
    }
  }

  const type = getPrismaModelPropertyType(modelField);

  Object.keys(prisma_convert_matrix).some((prismaType) => {
    if (!prisma_convert_matrix[prismaType as keyof ConvertMatrix].includes(type)) return false;
    converted_type = prismaType;
    return true;
  });

  return converted_type;
}

export { convertPrisma };
