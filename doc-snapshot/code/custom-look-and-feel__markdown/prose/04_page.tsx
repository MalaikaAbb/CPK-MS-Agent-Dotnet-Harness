const PlainText = ({ content }: { content: string }) => (
  <pre className="whitespace-pre-wrap">{content}</pre>
);

<CopilotChat
  messageView={{ assistantMessage: { markdownRenderer: PlainText } }}
/>;
