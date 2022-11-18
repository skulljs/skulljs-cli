import ts, {
  BinaryExpression,
  CallExpression,
  Identifier,
  ObjectLiteralExpression,
  ParenthesizedExpression,
  PropertyAccessExpression,
  SourceFile,
  VariableStatement,
} from 'typescript';
import { hasRequire } from '../../utils.js';
import { staticServe, staticServeImport } from './nodes/staticServe.js';

function nestAppModuleBuildTransformer(typeChecker: ts.TypeChecker): (context: ts.TransformationContext) => ts.Transformer<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
    function transformObjectLiteral(objectLiteral: ts.ObjectLiteralExpression) {
      return ts.factory.updateObjectLiteralExpression(
        objectLiteral,
        objectLiteral.properties.map((prop) => {
          if (!ts.isPropertyAssignment(prop)) return prop;

          if (!prop.name || !ts.isIdentifier(prop.name)) return prop;

          if (prop.name.escapedText !== 'imports') return prop;

          if (!ts.isArrayLiteralExpression(prop.initializer)) return prop;

          const elements = [staticServe, ...prop.initializer.elements];

          return ts.factory.updatePropertyAssignment(prop, prop.name, ts.factory.createArrayLiteralExpression(elements, true));
        })
      );
    }
    function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
      node = ts.visitEachChild(node, visitor, context);
      switch (node.kind) {
        case ts.SyntaxKind.SourceFile: {
          const statements = [...(node as SourceFile).statements];
          let newSource = node;
          if (!hasRequire(statements, 'fs')) {
            const lastRequireIndex = statements.reduce(function (lastIndex, obj, index) {
              let statement: ts.VariableDeclaration | undefined = undefined;
              if (ts.isVariableStatement(obj)) {
                statement = (obj as VariableStatement).declarationList.declarations.find((value) => {
                  const callExpression = value.initializer as CallExpression;

                  if (!callExpression) return false;

                  if (!ts.isCallExpression(callExpression)) return false;

                  const ceIdentifier = callExpression.expression as Identifier;

                  if (ceIdentifier.escapedText != 'require') return false;

                  return true;
                });
              }
              if (statement) return index;

              return lastIndex;
            }, 1);
            statements.splice(lastRequireIndex + 1, 0, staticServeImport);
            newSource = ts.factory.updateSourceFile(node as SourceFile, statements);
          }
          return newSource;
        }
        case ts.SyntaxKind.CallExpression: {
          const callExpr = node as CallExpression;
          if (callExpr.arguments.length != 1) return node;
          const objectLiteral = callExpr.arguments[0] as ObjectLiteralExpression;
          if (!ts.isObjectLiteralExpression(objectLiteral)) return node;
          const parentheseExpr = callExpr.expression as ParenthesizedExpression;
          if (!ts.isParenthesizedExpression(parentheseExpr)) return node;
          const binaryParams = parentheseExpr.expression as BinaryExpression;
          if (!ts.isBinaryExpression(binaryParams)) return node;
          const rightParam = binaryParams.right as PropertyAccessExpression;
          if (!ts.isPropertyAccessExpression(rightParam) || rightParam.name.escapedText != 'Module') return node;

          return ts.factory.updateCallExpression(callExpr, callExpr.expression, callExpr.typeArguments, [transformObjectLiteral(objectLiteral)]);
        }

        default:
          return node;
      }
    }

    return (sf: ts.SourceFile) => ts.visitNode(sf, visitor);
  };
}

export { nestAppModuleBuildTransformer };
