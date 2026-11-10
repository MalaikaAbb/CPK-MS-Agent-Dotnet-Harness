"use client";

// Snippets from /custom-look-and-feel/markdown, verbatim unless marked HARNESS.
// Every tab runs inside the Quickstart's <Providers> (my_agent on /api/copilotkit).

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";
import { Providers } from "@/doc/quickstart/providers";

// ── Restyle individual HTML tags ───────────────────────────────────────────
function TagsChat() {
  return (
    <CopilotChat
      messageView={{
        assistantMessage: {
          markdownRenderer: {
            components: {
              a: ({ node, children, ...props }) => (
                <a {...props} className="my-link">
                  {children}
                </a>
              ),
              h2: ({ node, children, ...props }) => (
                <h2 {...props} className="my-heading">
                  {children}
                </h2>
              ),
            },
          },
        },
      }}
    />
  );
}

// ── Replace the renderer ───────────────────────────────────────────────────
const PlainText = ({ content }: { content: string }) => (
  <pre className="whitespace-pre-wrap">{content}</pre>
);

const fill = (node: React.ReactNode) => (
  <Providers>
    {/* HARNESS: visible styles for the doc's class names, so the swap can be seen. */}
    <style>{`.my-link{color:#c2410c;font-weight:600} .my-heading{color:#7c3aed;border-bottom:2px solid #7c3aed}`}</style>
    <div className="h-full">{node}</div>
  </Providers>
);

export default function MarkdownDemo() {
  return (
    <DemoTabs
      title="Markdown Rendering · Quickstart <Providers> (my_agent)"
      tabs={[
        {
          id: "tags",
          label: "components map (a, h2)",
          note: "Verbatim. Links get class my-link (orange) and h2 gets my-heading (violet). Neither keeps data-streamdown.",
          render: () => fill(<TagsChat />),
        },
        {
          id: "class",
          label: "class string",
          note: "Verbatim: markdownRenderer: \"text-sm leading-7\".",
          render: () =>
            fill(
              <CopilotChat
                messageView={{
                  assistantMessage: { markdownRenderer: "text-sm leading-7" },
                }}
              />,
            ),
        },
        {
          id: "plain",
          label: "PlainText replacement",
          note: "Verbatim. The raw markdown appears in a <pre>, unparsed.",
          render: () =>
            fill(
              <CopilotChat
                messageView={{ assistantMessage: { markdownRenderer: PlainText } }}
              />,
            ),
        },
      ]}
    />
  );
}
