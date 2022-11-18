import ts from 'typescript';
function getApiPrefix(callback, typeChecker) {
    return (context) => {
        function visitor(node) {
            node = ts.visitEachChild(node, visitor, context);
            switch (node.kind) {
                case ts.SyntaxKind.ObjectLiteralExpression: {
                    const confObj = node;
                    confObj.properties.some((prop) => {
                        if (!ts.isPropertyAssignment(prop))
                            return false;
                        if (!prop.name || !ts.isIdentifier(prop.name))
                            return false;
                        if (prop.name.escapedText != 'apiPrefix')
                            return false;
                        if (!ts.isStringLiteral(prop.initializer))
                            return false;
                        callback(prop.initializer.text);
                        return true;
                    });
                }
                default:
                    return node;
            }
        }
        return (sf) => ts.visitNode(sf, visitor);
    };
}
export { getApiPrefix };
