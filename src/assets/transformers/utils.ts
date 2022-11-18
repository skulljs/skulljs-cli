import ts, { Identifier, ImportDeclaration, NamedImports, VariableDeclaration, VariableStatement } from 'typescript';

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
function hasRequire(statements: ts.Statement[], requireName: string): boolean {
  return statements.some((statement) => {
    if (statement.kind == ts.SyntaxKind.VariableStatement) {
      const namedBindings = (statement as VariableStatement).declarationList.declarations;
      return namedBindings.some((declaration) => {
        return (declaration.name as Identifier).escapedText === requireName;
      });
    }
    return false;
  });
}

function isModuleDecorator(node: ts.Decorator) {
  const expr = node.expression;
  if (!ts.isCallExpression(expr)) return false;

  if (!ts.isIdentifier(expr.expression)) return false;

  return expr.expression.escapedText === 'Module';
}

export { isNodeExported, getFirstClassDeclarationNode, hasImport, isModuleDecorator, hasRequire };
