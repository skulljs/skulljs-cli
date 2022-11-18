import ts from 'typescript';
function isNodeExported(node) {
    return ((ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile));
}
function getFirstClassDeclarationNode(node) {
    if (isNodeExported(node) && ts.isClassDeclaration(node)) {
        return node;
    }
    return;
}
function hasImport(statements, moduleName) {
    return statements.some((statement) => {
        if (statement.kind == ts.SyntaxKind.ImportDeclaration) {
            const namedBindings = statement.importClause?.namedBindings;
            return namedBindings.elements.some((elem) => {
                return elem.name.escapedText === moduleName;
            });
        }
        return false;
    });
}
function hasRequire(statements, requireName) {
    return statements.some((statement) => {
        if (statement.kind == ts.SyntaxKind.VariableStatement) {
            const namedBindings = statement.declarationList.declarations;
            return namedBindings.some((declaration) => {
                return declaration.name.escapedText === requireName;
            });
        }
        return false;
    });
}
function isModuleDecorator(node) {
    const expr = node.expression;
    if (!ts.isCallExpression(expr))
        return false;
    if (!ts.isIdentifier(expr.expression))
        return false;
    return expr.expression.escapedText === 'Module';
}
export { isNodeExported, getFirstClassDeclarationNode, hasImport, isModuleDecorator, hasRequire };
