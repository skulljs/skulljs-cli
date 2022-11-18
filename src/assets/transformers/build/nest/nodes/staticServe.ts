import ts from 'typescript';

const staticServe = ts.factory.createCallExpression(
  ts.factory.createPropertyAccessExpression(
    ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('serve_static_module_1'), ts.factory.createIdentifier('ServeStaticModule')),
    ts.factory.createIdentifier('forRoot')
  ),
  undefined,
  [
    ts.factory.createObjectLiteralExpression(
      [
        ts.factory.createPropertyAssignment(
          ts.factory.createIdentifier('rootPath'),
          ts.factory.createTemplateExpression(ts.factory.createTemplateHead('', ''), [
            ts.factory.createTemplateSpan(ts.factory.createIdentifier('__dirname'), ts.factory.createTemplateTail('/public', '/public')),
          ])
        ),
      ],
      false
    ),
  ]
);
const staticServeImport = ts.factory.createVariableStatement(
  undefined,
  ts.factory.createVariableDeclarationList(
    [
      ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier('serve_static_module_1'),
        undefined,
        undefined,
        ts.factory.createCallExpression(ts.factory.createIdentifier('require'), undefined, [ts.factory.createStringLiteral('@nestjs/serve-static')])
      ),
    ],
    ts.NodeFlags.Const
  )
);

export { staticServe, staticServeImport };
