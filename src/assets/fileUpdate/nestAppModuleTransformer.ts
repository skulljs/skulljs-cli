import ts, { Identifier, SourceFile } from 'typescript';
import { hasImport } from './utils.js';

interface ModuleProps {
  moduleName: string;
  modulePath: string;
}

function nestAppModuleTransformer(
  moduleProps: ModuleProps,
  typeChecker: ts.TypeChecker | undefined = undefined
): (context: ts.TransformationContext) => ts.Transformer<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
    function isModuleDecorator(node: ts.Decorator) {
      const expr = node.expression;
      if (!ts.isCallExpression(expr)) return false;

      if (!ts.isIdentifier(expr.expression)) return false;

      return expr.expression.escapedText === 'Module';
    }
    function handleModuleDecorator(node: ts.Decorator) {
      const expr = node.expression;
      if (!ts.isCallExpression(expr)) return node;

      const args = expr.arguments;
      if (args.length !== 1) return node;

      const arg = args[0];
      if (!ts.isObjectLiteralExpression(arg)) return node;

      const updatedCallExpr = ts.factory.updateCallExpression(expr, expr.expression, expr.typeArguments, [transformObjectLiteral(arg)]);

      return ts.factory.updateDecorator(node, updatedCallExpr);

      function transformObjectLiteral(objectLiteral: ts.ObjectLiteralExpression) {
        return ts.factory.updateObjectLiteralExpression(
          objectLiteral,
          objectLiteral.properties.map((prop) => {
            if (!ts.isPropertyAssignment(prop)) return prop;

            if (!prop.name || !ts.isIdentifier(prop.name)) return prop;

            if (prop.name.escapedText !== 'imports') return prop;

            if (!ts.isArrayLiteralExpression(prop.initializer)) return prop;

            const expression = ts.factory.createIdentifier(moduleProps.moduleName);

            if (
              prop.initializer.elements.some(
                (element) => element.kind == ts.SyntaxKind.Identifier && (element as Identifier).escapedText == moduleProps.moduleName
              )
            )
              return prop;

            const elements = [expression, ...prop.initializer.elements];

            return ts.factory.updatePropertyAssignment(prop, prop.name, ts.factory.createArrayLiteralExpression(elements, true));
          })
        );
      }
    }

    function visitor(node: ts.Node): ts.Node {
      switch (node.kind) {
        case ts.SyntaxKind.SourceFile: {
          const importNode = ts.factory.createImportDeclaration(
            undefined,
            ts.factory.createImportClause(
              false,
              undefined,
              ts.factory.createNamedImports([ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(moduleProps.moduleName))])
            ),
            ts.factory.createStringLiteral(moduleProps.modulePath, true)
          );
          const statements = [...(node as SourceFile).statements];
          let newSource = node;
          if (!hasImport(statements, moduleProps.moduleName)) {
            const lastImport = statements
              .map((s) => {
                return s.kind;
              })
              .lastIndexOf(ts.SyntaxKind.ImportDeclaration);
            statements.splice(lastImport + 1, 0, importNode);
            newSource = ts.factory.updateSourceFile(node as SourceFile, statements);
          }
          return ts.visitEachChild(newSource, visitor, context);
        }
        case ts.SyntaxKind.Decorator: {
          if (isModuleDecorator(node as ts.Decorator)) return handleModuleDecorator(node as ts.Decorator);
        }
        default:
          return ts.visitEachChild(node, visitor, context);
      }
    }

    return (sf: ts.SourceFile) => visitor(sf) as ts.SourceFile;
  };
}

export { nestAppModuleTransformer };
