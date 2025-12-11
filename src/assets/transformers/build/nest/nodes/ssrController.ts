import ts from 'typescript';

const ssrControllerImport = ts.factory.createVariableStatement(
  undefined,
  ts.factory.createVariableDeclarationList(
    [
      ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier('_ssrcontroller'),
        undefined,
        undefined,
        ts.factory.createCallExpression(ts.factory.createIdentifier('require'), undefined, [ts.factory.createStringLiteral('./ssr.controller')])
      ),
    ],
    ts.NodeFlags.Const
  )
);

const ssrController = ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('_ssrcontroller'), ts.factory.createIdentifier('SSRController'));

export { ssrControllerImport, ssrController };
