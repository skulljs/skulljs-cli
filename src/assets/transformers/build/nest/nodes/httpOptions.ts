import ts from 'typescript';

export interface Certificates {
  key: string;
  cert: string;
}

const httpOptions = (certificates: Certificates) =>
  ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier('httpsOptions'),
          undefined,
          undefined,
          ts.factory.createObjectLiteralExpression(
            [
              ts.factory.createPropertyAssignment(
                ts.factory.createStringLiteral('key'),
                ts.factory.createCallExpression(
                  ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('fs'), ts.factory.createIdentifier('readFileSync')),
                  undefined,
                  [
                    ts.factory.createCallExpression(
                      ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('path'), ts.factory.createIdentifier('join')),
                      undefined,
                      [ts.factory.createIdentifier('__dirname'), ts.factory.createStringLiteral(`../sslcert/${certificates.key}`)]
                    ),
                  ]
                )
              ),
              ts.factory.createPropertyAssignment(
                ts.factory.createStringLiteral('cert'),
                ts.factory.createCallExpression(
                  ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('fs'), ts.factory.createIdentifier('readFileSync')),
                  undefined,
                  [
                    ts.factory.createCallExpression(
                      ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('path'), ts.factory.createIdentifier('join')),
                      undefined,
                      [ts.factory.createIdentifier('__dirname'), ts.factory.createStringLiteral(`../sslcert/${certificates.cert}`)]
                    ),
                  ]
                )
              ),
            ],
            true
          )
        ),
      ],
      ts.NodeFlags.Const | ts.NodeFlags.AwaitContext | ts.NodeFlags.JavaScriptFile | ts.NodeFlags.ContextFlags | ts.NodeFlags.TypeExcludesFlags
    )
  );

export { httpOptions };
