import ts, { NoSubstitutionTemplateLiteral, StringLiteral, TemplateHead, TemplateSpan } from 'typescript';

function nestMainTransformerLogs(typeChecker: ts.TypeChecker): (context: ts.TransformationContext) => ts.Transformer<ts.SourceFile> {
  return (context: ts.TransformationContext) => {
    function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
      node = ts.visitEachChild(node, visitor, context);
      switch (node.kind) {
        case ts.SyntaxKind.TemplateHead: {
          const head = node as TemplateHead;
          if (!head.text.includes('http://')) return node;
          return ts.factory.createTemplateHead(head.text.replace('http://', 'https://'));
        }
        case ts.SyntaxKind.TemplateSpan: {
          const span = node as TemplateSpan;
          if (!span.literal.text.includes('http://')) return node;
          return ts.factory.updateTemplateSpan(span, span.expression, ts.factory.createTemplateTail(span.literal.text.replace('http://', 'https://')));
        }
        case ts.SyntaxKind.NoSubstitutionTemplateLiteral: {
          const emptyTemplate = node as NoSubstitutionTemplateLiteral;
          if (!emptyTemplate.text.includes('http://')) return node;
          return ts.factory.createNoSubstitutionTemplateLiteral(emptyTemplate.text.replace('http://', 'https://'));
        }
        default:
          return node;
      }
    }

    return (sf: ts.SourceFile) => ts.visitNode(sf, visitor);
  };
}

export { nestMainTransformerLogs };
