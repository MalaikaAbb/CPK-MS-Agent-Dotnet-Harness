"use client";

// Page-body snippets from /custom-look-and-feel/slots, verbatim unless marked HARNESS.
// Every tab runs inside the Quickstart's <Providers> (my_agent on /api/copilotkit).

import {
  CopilotChat,
  CopilotChatToolCallsView,
  type CopilotChatToolCallsViewProps,
} from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";
import { Providers } from "@/doc/quickstart/providers";

// ── Tailwind Classes ───────────────────────────────────────────────────────
function TailwindChat() {
  return (
    <CopilotChat
      messageView="bg-gray-50 dark:bg-gray-900 p-4"
      input="border-2 border-blue-400 rounded-xl"
    />
  );
}

// ── Custom Components ──────────────────────────────────────────────────────
// @ts-expect-error HARNESS: kept as published. The snippet's parameters are untyped (implicit any).
const CustomMessageView = ({ messages, isRunning }) => (
  <div className="space-y-4 p-6">
    {/* @ts-expect-error HARNESS: kept as published (implicit any on msg). */}
    {messages?.map((msg) => (
      <div key={msg.id} className={msg.role === "user" ? "text-right" : "text-left"}>
        {msg.content}
      </div>
    ))}
    {isRunning && <div className="animate-pulse">Thinking...</div>}
  </div>
);

function CustomComponentChat() {
  // @ts-expect-error HARNESS: doc type error kept. A plain function is not assignable to SlotValue<typeof CopilotChatMessageView>.
  return <CopilotChat messageView={CustomMessageView} />;
}

// ── Nested Slots, two levels ───────────────────────────────────────────────
// HARNESS-AUTHORED: the snippet uses these three components but never defines
// them. Minimal stand-ins that make the override visible.
/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomToolbar = ({ children }: any) => (
  <div className="mt-1 flex gap-2 rounded bg-violet-50 p-1 text-xs">[CustomToolbar] {children}</div>
);
const CustomCopyButton = ({ onClick }: any) => (
  <button className="text-xs underline" onClick={onClick}>[CustomCopyButton]</button>
);
const CustomUserMessage = ({ message }: any) => (
  <div className="text-right text-sm text-blue-700">[CustomUserMessage] {String(message?.content ?? "")}</div>
);

// ── Tool calls ─────────────────────────────────────────────────────────────
const CustomToolCallsView = (props: CopilotChatToolCallsViewProps) => (
  <div className="rounded-lg border border-dashed p-2">
    <CopilotChatToolCallsView {...props} />
  </div>
);

const fill = (node: React.ReactNode) => (
  <Providers>
    <div className="h-full">{node}</div>
  </Providers>
);

export default function SlotsSnippetsDemo() {
  return (
    <DemoTabs
      title="Slots · page snippets · Quickstart <Providers> (my_agent)"
      tabs={[
        { id: "tailwind", label: "Tailwind classes", note: "Verbatim.", render: () => fill(<TailwindChat />) },
        {
          id: "props",
          label: "Props override",
          note: "Verbatim. Inspect the DOM for data-testid=\"message-view\" and class my-custom-messages.",
          render: () =>
            fill(
              <CopilotChat
                messageView={{
                  className: "my-custom-messages",
                  // @ts-expect-error HARNESS: doc type error kept. "data-testid" is not a known prop of the messageView slot object.
                  "data-testid": "message-view",
                }}
                input={{ autoFocus: true }}
              />,
            ),
        },
        {
          id: "custom",
          label: "Custom component",
          note: "Verbatim, untyped, as published. msg.content is rendered as is, so multimodal content arrays would print [object Object].",
          render: () => fill(<CustomComponentChat />),
        },
        {
          id: "nested2",
          label: "Nested · 2 levels",
          note: "Verbatim. CustomToolbar, CustomCopyButton and CustomUserMessage are HARNESS stand-ins, because the page never defines them.",
          render: () =>
            fill(
              <CopilotChat
                messageView={{
                  assistantMessage: {
                    toolbar: CustomToolbar,
                    copyButton: CustomCopyButton,
                  },
                  // @ts-expect-error HARNESS: doc type error kept. A plain function component is not assignable to the userMessage slot type.
                  userMessage: CustomUserMessage,
                }}
              />,
            ),
        },
        {
          id: "nested3",
          label: "Nested · 3 levels",
          note: "Verbatim. The copy button is replaced by a plain <button>Copy</button>.",
          render: () =>
            fill(
              <CopilotChat
                messageView={{
                  assistantMessage: {
                    copyButton: ({ onClick }) => (
                      <button onClick={onClick}>Copy</button>
                    ),
                  },
                }}
              />,
            ),
        },
        {
          id: "toolcalls",
          label: "Tool calls view",
          note: "Verbatim. MyAgent has no tools, so this only shows when a frontend tool is called.",
          render: () =>
            fill(
              <CopilotChat
                messageView={{
                  assistantMessage: { toolCallsView: CustomToolCallsView },
                }}
              />,
            ),
        },
        {
          id: "labels",
          label: "Labels",
          note: "Verbatim.",
          render: () =>
            fill(
              <CopilotChat
                labels={{
                  chatInputPlaceholder: "Ask your agent anything...",
                  welcomeMessageText: "How can I help you today?",
                  chatDisclaimerText: "AI responses may be inaccurate.",
                }}
              />,
            ),
        },
      ]}
    />
  );
}
