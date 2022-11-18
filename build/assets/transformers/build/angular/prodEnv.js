import ts from 'typescript';
function ngProdEnvTransformer(configProps, typeChecker) {
    return (context) => {
        function transformObjectLiteral(objectLiteral) {
            return ts.factory.updateObjectLiteralExpression(objectLiteral, objectLiteral.properties.map((prop) => {
                if (!ts.isPropertyAssignment(prop))
                    return prop;
                if (!prop.name || !ts.isIdentifier(prop.name))
                    return prop;
                if (prop.name.escapedText != 'backend_url')
                    return prop;
                if (!ts.isStringLiteral(prop.initializer))
                    return prop;
                const newUrl = ts.factory.createStringLiteral(`${configProps.protocol}://${configProps.hostname}:${configProps.port}/${configProps.apiPrefix}`, true);
                return ts.factory.updatePropertyAssignment(prop, prop.name, newUrl);
            }));
        }
        function visitor(node) {
            node = ts.visitEachChild(node, visitor, context);
            switch (node.kind) {
                case ts.SyntaxKind.ObjectLiteralExpression: {
                    const object = node;
                    return transformObjectLiteral(object);
                }
                default:
                    return node;
            }
        }
        return (sf) => ts.visitNode(sf, visitor);
    };
}
export { ngProdEnvTransformer };
