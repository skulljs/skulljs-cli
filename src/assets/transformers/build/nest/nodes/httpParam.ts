import ts from 'typescript';

const httpOptionsParam = ts.factory.createObjectLiteralExpression(
  [ts.factory.createShorthandPropertyAssignment(ts.factory.createIdentifier('httpsOptions'), undefined)],
  true
);

export { httpOptionsParam };
