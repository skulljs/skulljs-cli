import ts, { AwaitExpression, CallExpression, Identifier, PropertyAccessExpression, SourceFile, VariableDeclaration, VariableStatement } from 'typescript';
import { hasRequire } from '../../utils.js';
import { Certificates, httpOptions } from './nodes/httpOptions.js';
import { httpOptionsParam } from './nodes/httpParam.js';
import { requireFs } from './nodes/requireFs.js';

interface CreateDeclaration {
  index?: number;
  declaration?: VariableDeclaration;
}

function nestMainTransformer(certficates: Certificates, typeChecker: ts.TypeChecker): (context: ts.TransformationContext) => ts.Transformer<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
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
            statements.splice(lastRequireIndex + 1, 0, requireFs);
            newSource = ts.factory.updateSourceFile(node as SourceFile, statements);
          }
          return newSource;
        }
        case ts.SyntaxKind.VariableStatement: {
          const appVariableStatement = node as VariableStatement;

          const appDeclarationList = [...appVariableStatement.declarationList.declarations];

          const createDeclaration: CreateDeclaration = {};

          appDeclarationList.some(function (this: CreateDeclaration, declaration, index) {
            let callExpression = declaration.initializer;

            if (!callExpression) return false;

            let isAwaitExpr = false;

            if (ts.isAwaitExpression(callExpression)) {
              isAwaitExpr = true;
              callExpression = (callExpression as AwaitExpression).expression;
            }

            if (!ts.isCallExpression(callExpression)) return false;

            const createAccess = callExpression.expression as PropertyAccessExpression;

            if (!ts.isPropertyAccessExpression(createAccess)) return false;

            if (createAccess.name.escapedText != 'create') return false;

            const nestFactoryAccess = createAccess.expression as PropertyAccessExpression;

            if (!ts.isPropertyAccessExpression(nestFactoryAccess)) return false;

            if (nestFactoryAccess.name.escapedText != 'NestFactory') return false;

            const newArguments = [...callExpression.arguments, httpOptionsParam];

            const newCallExpression = ts.factory.updateCallExpression(callExpression, callExpression.expression, callExpression.typeArguments, newArguments);

            let newInitializer: CallExpression | AwaitExpression = newCallExpression;

            if (isAwaitExpr) {
              newInitializer = ts.factory.updateAwaitExpression(declaration.initializer as AwaitExpression, newCallExpression);
            }

            const newDeclaration = ts.factory.updateVariableDeclaration(
              declaration,
              declaration.name,
              declaration.exclamationToken,
              declaration.type,
              newInitializer
            );

            this.index = index;
            this.declaration = newDeclaration;

            return true;
          }, createDeclaration);

          if (!createDeclaration.declaration) return node;

          appDeclarationList.splice(createDeclaration.index!, 1, createDeclaration.declaration);

          const newDeclarationList = ts.factory.updateVariableDeclarationList(appVariableStatement.declarationList, appDeclarationList);

          const newVariableStatement = ts.factory.updateVariableStatement(appVariableStatement, ts.getModifiers(appVariableStatement), newDeclarationList);

          return [httpOptions(certficates), newVariableStatement];
        }
        case ts.SyntaxKind.ExpressionStatement: {
        }
        default:
          return node;
      }
    }

    return (sf: ts.SourceFile) => ts.visitNode(sf, visitor);
  };
}

export { nestMainTransformer };
