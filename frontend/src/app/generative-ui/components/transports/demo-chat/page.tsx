"use client";

// Snippets from /generative-ui/components/transports. Provider lines are verbatim.

import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoTabs } from "@/components/demo-tabs";

export default function TransportsDemo() {
  return (
    <DemoTabs
      title="Transports"
      tabs={[
        {
          id: "tool",
          label: "Tool (default)",
          note: "Verbatim, on /api/copilotkit (the Quickstart runtime: my_agent only, no generativeUI option).",
          render: () => (
            <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: standardUI }}>
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
        {
          id: "tool-runtime",
          label: "Tool + runtime snippet",
          note: "The same provider, with runtimeUrl edited (HARNESS) to /api/copilotkit-genui, which runs the page's runtime snippet (default agent, generativeUI: true).",
          render: () => (
            <CopilotKitProvider runtimeUrl="/api/copilotkit-genui" generativeUI={{ ui: standardUI }}>
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
        {
          id: "markdown",
          label: "Markdown",
          note: "Verbatim, on /api/copilotkit.",
          render: () => (
            <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: standardUI, transport: "markdown" }}>
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
        {
          id: "agents",
          label: "agentIds: [\"shop\"]",
          note: "Verbatim. No agent named shop exists, so no agent gets a catalog.",
          render: () => (
            <CopilotKitProvider
              runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */
              generativeUI={{ ui: standardUI, agentIds: ["shop"] }}
            >
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
      ]}
    />
  );
}
