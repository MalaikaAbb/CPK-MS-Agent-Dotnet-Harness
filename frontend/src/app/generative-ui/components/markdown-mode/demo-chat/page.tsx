"use client";

// Snippets from /generative-ui/components/markdown-mode. Provider lines are verbatim.
// The Python "build your own prompt" snippet has no .NET form, so it is reference-only.

import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoTabs } from "@/components/demo-tabs";

export default function MarkdownModeDemo() {
  return (
    <DemoTabs
      title="Markdown mode · CopilotKitProvider runtimeUrl=/api/copilotkit"
      tabs={[
        {
          id: "on",
          label: "transport: markdown",
          note: "\"Turn it on\", verbatim.",
          render: () => (
            <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: standardUI, transport: "markdown" }}>
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
        {
          id: "no-context",
          label: "sendContext: false",
          note: "\"Build your own prompt\", verbatim. Nothing on the .NET side reads forwardedProps.copilotkit.ui.",
          render: () => (
            <CopilotKitProvider
              runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */
              generativeUI={{ ui: standardUI, transport: "markdown", sendContext: false }}
            >
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
      ]}
    />
  );
}
