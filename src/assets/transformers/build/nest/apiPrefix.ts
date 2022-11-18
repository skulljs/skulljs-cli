import ts, { ObjectLiteralExpression } from 'typescript';

export type ExportApiPrefix = (apiPrefix: string) => void;

function getApiPrefix(callback: ExportApiPrefix, typeChecker: ts.TypeChecker): (context: ts.TransformationContext) => ts.Transformer<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
    function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
      node = ts.visitEachChild(node, visitor, context);
      switch (node.kind) {
        case ts.SyntaxKind.ObjectLiteralExpression: {
          const confObj = node as ObjectLiteralExpression;
          confObj.properties.some((prop) => {
            if (!ts.isPropertyAssignment(prop)) return false;
            if (!prop.name || !ts.isIdentifier(prop.name)) return false;
            if (prop.name.escapedText != 'apiPrefix') return false;
            if (!ts.isStringLiteral(prop.initializer)) return false;
            callback(prop.initializer.text);
            return true;
          });
        }
        default:
          return node;
      }
    }

    return (sf: ts.SourceFile) => ts.visitNode(sf, visitor);
  };
}

export { getApiPrefix };
