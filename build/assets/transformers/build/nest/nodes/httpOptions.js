import ts from 'typescript';
const httpOptions = ts.factory.createVariableStatement(undefined, ts.factory.createVariableDeclarationList([
    ts.factory.createVariableDeclaration(ts.factory.createIdentifier('httpsOptions'), undefined, undefined, ts.factory.createObjectLiteralExpression([
        ts.factory.createPropertyAssignment(ts.factory.createStringLiteral('key'), ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('fs'), ts.factory.createIdentifier('readFileSync')), undefined, [
            ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('path'), ts.factory.createIdentifier('join')), undefined, [ts.factory.createIdentifier('__dirname'), ts.factory.createStringLiteral('../sslcert/xxx-key.pem')]),
        ])),
        ts.factory.createPropertyAssignment(ts.factory.createStringLiteral('cert'), ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('fs'), ts.factory.createIdentifier('readFileSync')), undefined, [
            ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('path'), ts.factory.createIdentifier('join')), undefined, [ts.factory.createIdentifier('__dirname'), ts.factory.createStringLiteral('../sslcert/xxx-cert.pem')]),
        ])),
    ], true)),
], ts.NodeFlags.Const | ts.NodeFlags.AwaitContext | ts.NodeFlags.JavaScriptFile | ts.NodeFlags.ContextFlags | ts.NodeFlags.TypeExcludesFlags));
export { httpOptions };
