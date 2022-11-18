import ts from 'typescript';
function nestConfigurationTransformer(configProps, typeChecker) {
    return (context) => {
        function transformObjectLiteral(objectLiteral) {
            const propertiesToModify = ['port', 'corsOrigins'];
            return ts.factory.updateObjectLiteralExpression(objectLiteral, objectLiteral.properties.map((prop) => {
                if (!ts.isPropertyAssignment(prop))
                    return prop;
                if (!prop.name || !ts.isIdentifier(prop.name))
                    return prop;
                if (!propertiesToModify.includes(prop.name.escapedText.toString()))
                    return prop;
                let initializer = prop.initializer;
                if (prop.name.escapedText == 'port') {
                    if (!ts.isNumericLiteral(initializer))
                        return prop;
                    initializer = ts.factory.createNumericLiteral(configProps.port);
                }
                if (prop.name.escapedText == 'corsOrigins') {
                    if (!ts.isArrayLiteralExpression(initializer))
                        return prop;
                    initializer = ts.factory.updateArrayLiteralExpression(initializer, [
                        ts.factory.createStringLiteral(`${configProps.protocol}://${configProps.hostname}:${configProps.port}`, true),
                    ]);
                }
                return ts.factory.updatePropertyAssignment(prop, prop.name, initializer);
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
export { nestConfigurationTransformer };
