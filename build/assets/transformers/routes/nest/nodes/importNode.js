import ts from 'typescript';
const importNode = (moduleProps) => ts.factory.createImportDeclaration(undefined, ts.factory.createImportClause(false, undefined, ts.factory.createNamedImports([ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(moduleProps.moduleName))])), ts.factory.createStringLiteral(moduleProps.modulePath, true));
export { importNode };
