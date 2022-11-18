import ts from 'typescript';
const requireFs = ts.factory.createVariableStatement(undefined, ts.factory.createVariableDeclarationList([
    ts.factory.createVariableDeclaration(ts.factory.createIdentifier('fs'), undefined, undefined, ts.factory.createCallExpression(ts.factory.createIdentifier('require'), undefined, [ts.factory.createStringLiteral('fs')])),
], ts.NodeFlags.Const));
export { requireFs };
