import ts from 'typescript';
import { hasImport, isModuleDecorator } from '../../utils.js';
import { importNode } from './nodes/importNode.js';
function nestAppModuleTransformer(moduleProps, typeChecker) {
    return (context) => {
        function handleModuleDecorator(node) {
            const expr = node.expression;
            if (!ts.isCallExpression(expr))
                return node;
            const args = expr.arguments;
            if (args.length !== 1)
                return node;
            const arg = args[0];
            if (!ts.isObjectLiteralExpression(arg))
                return node;
            const updatedCallExpr = ts.factory.updateCallExpression(expr, expr.expression, expr.typeArguments, [transformObjectLiteral(arg)]);
            return ts.factory.updateDecorator(node, updatedCallExpr);
            function transformObjectLiteral(objectLiteral) {
                return ts.factory.updateObjectLiteralExpression(objectLiteral, objectLiteral.properties.map((prop) => {
                    if (!ts.isPropertyAssignment(prop))
                        return prop;
                    if (!prop.name || !ts.isIdentifier(prop.name))
                        return prop;
                    if (prop.name.escapedText !== 'imports')
                        return prop;
                    if (!ts.isArrayLiteralExpression(prop.initializer))
                        return prop;
                    const expression = ts.factory.createIdentifier(moduleProps.moduleName);
                    if (prop.initializer.elements.some((element) => element.kind == ts.SyntaxKind.Identifier && element.escapedText == moduleProps.moduleName))
                        return prop;
                    const elements = [expression, ...prop.initializer.elements];
                    return ts.factory.updatePropertyAssignment(prop, prop.name, ts.factory.createArrayLiteralExpression(elements, true));
                }));
            }
        }
        function visitor(node) {
            node = ts.visitEachChild(node, visitor, context);
            switch (node.kind) {
                case ts.SyntaxKind.SourceFile: {
                    const statements = [...node.statements];
                    let newSource = node;
                    if (!hasImport(statements, moduleProps.moduleName)) {
                        const lastImport = statements
                            .map((s) => {
                            return s.kind;
                        })
                            .lastIndexOf(ts.SyntaxKind.ImportDeclaration);
                        statements.splice(lastImport + 1, 0, importNode(moduleProps));
                        newSource = ts.factory.updateSourceFile(node, statements);
                    }
                    return newSource;
                }
                case ts.SyntaxKind.Decorator: {
                    if (isModuleDecorator(node))
                        return handleModuleDecorator(node);
                }
                default:
                    return node;
            }
        }
        return (sf) => ts.visitNode(sf, visitor);
    };
}
export { nestAppModuleTransformer };
