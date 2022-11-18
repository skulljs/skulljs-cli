import ts from 'typescript';
function nestMainTransformerLogs(typeChecker) {
    return (context) => {
        function visitor(node) {
            node = ts.visitEachChild(node, visitor, context);
            switch (node.kind) {
                case ts.SyntaxKind.TemplateHead: {
                    const head = node;
                    if (!head.text.includes('http://'))
                        return node;
                    return ts.factory.createTemplateHead(head.text.replace('http://', 'https://'));
                }
                case ts.SyntaxKind.TemplateSpan: {
                    const span = node;
                    if (!span.literal.text.includes('http://'))
                        return node;
                    return ts.factory.updateTemplateSpan(span, span.expression, ts.factory.createTemplateTail(span.literal.text.replace('http://', 'https://')));
                }
                case ts.SyntaxKind.NoSubstitutionTemplateLiteral: {
                    const emptyTemplate = node;
                    if (!emptyTemplate.text.includes('http://'))
                        return node;
                    return ts.factory.createNoSubstitutionTemplateLiteral(emptyTemplate.text.replace('http://', 'https://'));
                }
                default:
                    return node;
            }
        }
        return (sf) => ts.visitNode(sf, visitor);
    };
}
export { nestMainTransformerLogs };
