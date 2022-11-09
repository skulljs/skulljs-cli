import ts, { ImportDeclaration, NamedImports } from 'typescript';

function isNodeExported(node: ts.Node): boolean {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
}
function getFirstClassDeclarationNode(node: ts.Node): ts.ClassDeclaration | undefined {
  if (isNodeExported(node) && ts.isClassDeclaration(node)) {
    return node;
  }
  return;
}
function hasImport(statements: ts.Statement[], moduleName: string): boolean {
  return statements.some((statement) => {
    if (statement.kind == ts.SyntaxKind.ImportDeclaration) {
      const namedBindings = (statement as ImportDeclaration).importClause?.namedBindings;
      return (namedBindings as NamedImports).elements.some((elem) => {
        return elem.name.escapedText === moduleName;
      });
    }
    return false;
  });
}

export { isNodeExported, getFirstClassDeclarationNode, hasImport };
