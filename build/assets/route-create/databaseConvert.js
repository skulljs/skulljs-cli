import toolbox from '../../toolbox/toolbox.js';
const { command, exit } = toolbox;
export function convertDatabaseTypeToTsType(skulljs_repository, type) {
    let converted_type = '';
    switch (skulljs_repository) {
        case 'nestjs':
            converted_type = convertPrisma(type);
            break;
        default:
            exit(command, `backend repository ${skulljs_repository} not implemented yet !`);
            break;
    }
    return converted_type;
}
function convertPrisma(type) {
    let converted_type = '';
    const prisma_convert_matrix = {
        number: ['Int', 'BigInt', 'Float', 'Decimal'],
        string: ['String', 'DateTime', 'Bytes'],
        boolean: ['Boolean'],
        object: ['Json'],
    };
    let found = false;
    for (let prisma_type in prisma_convert_matrix) {
        if (prisma_convert_matrix[prisma_type].includes(type)) {
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
