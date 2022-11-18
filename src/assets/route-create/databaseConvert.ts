import toolbox from '@src/toolbox/toolbox.js';
import { ConvertMatrix } from '@src/types/commands/route-create';

const { exit } = toolbox;

export function convertDatabaseTypeToTsType(skulljs_repository: string, type: string): string {
  let converted_type = '';
  switch (skulljs_repository) {
    case 'nestjs':
      converted_type = convertPrisma(type);
      break;

    default:
      exit(toolbox.command, `backend repository ${skulljs_repository} not implemented yet !`);
      break;
  }
  return converted_type;
}

function convertPrisma(type: string) {
  let converted_type = '';

  const prisma_convert_matrix: ConvertMatrix = {
    number: ['Int', 'BigInt', 'Float', 'Decimal'],
    string: ['String', 'DateTime', 'Bytes'],
    boolean: ['Boolean'],
    object: ['Json'],
  };

  let found = false;
  for (let prisma_type in prisma_convert_matrix) {
    if (prisma_convert_matrix[prisma_type as keyof ConvertMatrix].includes(type)) {
      converted_type = prisma_type;
      found = true;
      break;
    }
  }

  if (!found) {
    converted_type = 'string';
  }

  return converted_type;
}

export default { convertDatabaseTypeToTsType };
