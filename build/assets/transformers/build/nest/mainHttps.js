import ts from 'typescript';
import { hasRequire } from '../../utils.js';
import { httpOptions } from './nodes/httpOptions.js';
import { httpOptionsParam } from './nodes/httpParam.js';
import { requireFs } from './nodes/requireFs.js';
function nestMainTransformer(typeChecker) {
    return (context) => {
        function visitor(node) {
            node = ts.visitEachChild(node, visitor, context);
            switch (node.kind) {
                case ts.SyntaxKind.SourceFile: {
                    const statements = [...node.statements];
                    let newSource = node;
                    if (!hasRequire(statements, 'fs')) {
                        const lastRequireIndex = statements.reduce(function (lastIndex, obj, index) {
                            let statement = undefined;
                            if (ts.isVariableStatement(obj)) {
                                statement = obj.declarationList.declarations.find((value) => {
                                    const callExpression = value.initializer;
                                    if (!callExpression)
                                        return false;
                                    if (!ts.isCallExpression(callExpression))
                                        return false;
                                    const ceIdentifier = callExpression.expression;
                                    if (ceIdentifier.escapedText != 'require')
                                        return false;
                                    return true;
                                });
                            }
                            if (statement)
                                return index;
                            return lastIndex;
                        }, 1);
                        statements.splice(lastRequireIndex + 1, 0, requireFs);
                        newSource = ts.factory.updateSourceFile(node, statements);
                    }
                    return newSource;
                }
                case ts.SyntaxKind.VariableStatement: {
                    const appVariableStatement = node;
                    const appDeclarationList = [...appVariableStatement.declarationList.declarations];
                    const createDeclaration = {};
                    appDeclarationList.some(function (declaration, index) {
                        let callExpression = declaration.initializer;
                        if (!callExpression)
                            return false;
                        let isAwaitExpr = false;
                        if (ts.isAwaitExpression(callExpression)) {
                            isAwaitExpr = true;
                            callExpression = callExpression.expression;
                        }
                        if (!ts.isCallExpression(callExpression))
                            return false;
                        const createAccess = callExpression.expression;
                        if (!ts.isPropertyAccessExpression(createAccess))
                            return false;
                        if (createAccess.name.escapedText != 'create')
                            return false;
                        const nestFactoryAccess = createAccess.expression;
                        if (!ts.isPropertyAccessExpression(nestFactoryAccess))
                            return false;
                        if (nestFactoryAccess.name.escapedText != 'NestFactory')
                            return false;
                        const newArguments = [...callExpression.arguments, httpOptionsParam];
                        const newCallExpression = ts.factory.updateCallExpression(callExpression, callExpression.expression, callExpression.typeArguments, newArguments);
                        let newInitializer = newCallExpression;
                        if (isAwaitExpr) {
                            newInitializer = ts.factory.updateAwaitExpression(declaration.initializer, newCallExpression);
                        }
                        const newDeclaration = ts.factory.updateVariableDeclaration(declaration, declaration.name, declaration.exclamationToken, declaration.type, newInitializer);
                        this.index = index;
                        this.declaration = newDeclaration;
                        return true;
                    }, createDeclaration);
                    if (!createDeclaration.declaration)
                        return node;
                    appDeclarationList.splice(createDeclaration.index, 1, createDeclaration.declaration);
                    const newDeclarationList = ts.factory.updateVariableDeclarationList(appVariableStatement.declarationList, appDeclarationList);
                    const newVariableStatement = ts.factory.updateVariableStatement(appVariableStatement, ts.getModifiers(appVariableStatement), newDeclarationList);
                    return [httpOptions, newVariableStatement];
                }
                case ts.SyntaxKind.ExpressionStatement: {
                }
                default:
                    return node;
            }
        }
        return (sf) => ts.visitNode(sf, visitor);
    };
}
export { nestMainTransformer };
