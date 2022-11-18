import { BuildProps } from '@src/types/commands/build';
import ts, { ObjectLiteralExpression } from 'typescript';

function ngProdEnvTransformer(configProps: BuildProps, typeChecker: ts.TypeChecker): (context: ts.TransformationContext) => ts.Transformer<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
    function transformObjectLiteral(objectLiteral: ts.ObjectLiteralExpression) {
      return ts.factory.updateObjectLiteralExpression(
        objectLiteral,
        objectLiteral.properties.map((prop) => {
          if (!ts.isPropertyAssignment(prop)) return prop;

          if (!prop.name || !ts.isIdentifier(prop.name)) return prop;

          if (prop.name.escapedText != 'backend_url') return prop;

          if (!ts.isStringLiteral(prop.initializer)) return prop;

          const newUrl = ts.factory.createStringLiteral(`${configProps.protocol}://${configProps.hostname}:${configProps.port}/${configProps.apiPrefix}`, true);

          return ts.factory.updatePropertyAssignment(prop, prop.name, newUrl);
        })
      );
    }
    function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
      node = ts.visitEachChild(node, visitor, context);
      switch (node.kind) {
        case ts.SyntaxKind.ObjectLiteralExpression: {
          const object = node as ObjectLiteralExpression;
          return transformObjectLiteral(object);
        }
        default:
          return node;
      }
    }

    return (sf: ts.SourceFile) => ts.visitNode(sf, visitor);
  };
}

export { ngProdEnvTransformer };
