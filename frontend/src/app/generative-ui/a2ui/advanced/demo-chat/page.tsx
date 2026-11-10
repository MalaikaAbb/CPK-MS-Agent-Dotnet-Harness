"use client";

// /generative-ui/a2ui/advanced. Every tab runs the provider-catalog A2UI setup on
// the Quickstart runtime (agent="my_agent", useSingleEndpoint={false}, with
// myCatalog from the Dynamic Schema page). That wrapper is HARNESS.

import { CopilotChat as HarnessCopilotChat, CopilotKit } from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";
import { myCatalog } from "@/doc/a2ui/catalog";
import { useA2UIProgress } from "@/hooks/use-a2ui-progress";

import { A2UIMessageRenderer as ForwardRenderer } from "./interceptor-forward";
import { A2UIMessageRenderer as LocalRenderer } from "./interceptor-local";

// ── src/app/page.tsx snippet, verbatim ──
function Chat() {
  useA2UIProgress();

  // @ts-expect-error HARNESS: kept as published. CopilotChat is used but never imported in the snippet, so this throws a ReferenceError.
  return <CopilotChat className="flex-1" />;
}

// HARNESS: the same hook, with CopilotChat imported, so the progress renderer can
// be observed independently of the missing import.
function ChatWithImport() {
  useA2UIProgress();
  return <HarnessCopilotChat className="flex-1" />;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const provider = (node: React.ReactNode, renderer?: any) => (
  <CopilotKit
    runtimeUrl="/api/copilotkit"
    agent="my_agent"
    useSingleEndpoint={false}
    a2ui={{ catalog: myCatalog }}
    {...(renderer ? { renderActivityMessages: [renderer] } : {})}
  >
    <div className="flex h-full flex-col">{node}</div>
  </CopilotKit>
);

export default function A2uiAdvancedDemo() {
  return (
    <DemoTabs
      title="A2UI Advanced · Quickstart runtime"
      tabs={[
        {
          id: "page",
          label: "page.tsx (as published)",
          note: "Verbatim Chat. CopilotChat is not imported, so expect a ReferenceError.",
          render: () => provider(<Chat />),
        },
        {
          id: "progress",
          label: "Progress renderer",
          note: "useA2UIProgress verbatim (it listens for tool \"render_a2ui\"), with CopilotChat imported. If the injected tool is generate_a2ui, the custom progress never shows.",
          render: () => provider(<ChatWithImport />),
        },
        {
          id: "local",
          label: "onAction · handle locally",
          note: "interceptor-local.ts, passed through renderActivityMessages as the page says. A book_flight action logs \"Booking requested\" and is not sent to the agent.",
          render: () => provider(<ChatWithImport />, LocalRenderer),
        },
        {
          id: "forward",
          label: "onAction · forward modified",
          note: "interceptor-forward.ts. book_flight actions are forwarded with context.source = \"a2ui\".",
          render: () => provider(<ChatWithImport />, ForwardRenderer),
        },
      ]}
    />
  );
}
