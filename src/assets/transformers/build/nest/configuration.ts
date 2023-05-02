import { BuildProps } from '@src/types/commands/build';
import ts, { ObjectLiteralExpression } from 'typescript';

function nestConfigurationTransformer(
  configProps: BuildProps,
  typeChecker: ts.TypeChecker
): (context: ts.TransformationContext) => ts.Transformer<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
    function transformObjectLiteral(objectLiteral: ts.ObjectLiteralExpression) {
      const propertiesToModify = ['production', 'port', 'corsOrigins'];
      return ts.factory.updateObjectLiteralExpression(
        objectLiteral,
        objectLiteral.properties.map((prop) => {
          if (!ts.isPropertyAssignment(prop)) return prop;

          if (!prop.name || !ts.isIdentifier(prop.name)) return prop;

          if (!propertiesToModify.includes(prop.name.escapedText.toString())) return prop;

          let initializer = prop.initializer;

          if (prop.name.escapedText == 'production') {
            if (initializer.kind != ts.SyntaxKind.TrueKeyword && initializer.kind != ts.SyntaxKind.FalseKeyword) return prop;
            initializer = ts.factory.createTrue();
          }
          if (prop.name.escapedText == 'port') {
            if (!ts.isNumericLiteral(initializer)) return prop;
            initializer = ts.factory.createNumericLiteral(configProps.port);
          }
          if (prop.name.escapedText == 'corsOrigins') {
            if (!ts.isArrayLiteralExpression(initializer)) return prop;
            initializer = ts.factory.updateArrayLiteralExpression(initializer, [
              ts.factory.createStringLiteral(`${configProps.protocol}://${configProps.hostname}:${configProps.port}`, true),
            ]);
          }
          return ts.factory.updatePropertyAssignment(prop, prop.name, initializer);
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

export { nestConfigurationTransformer };
