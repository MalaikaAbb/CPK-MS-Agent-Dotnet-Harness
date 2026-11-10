"use client";

// "Pass a catalog on the provider" from /generative-ui/a2ui. myCatalog is the one
// the Dynamic Schema page publishes (src/doc/a2ui/catalog.ts).

import { CopilotChat, CopilotKit } from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";
import { myCatalog } from "@/doc/a2ui/catalog";

export default function A2uiProviderDemo() {
  return (
    <DemoTabs
      title="A2UI · provider catalog on /api/copilotkit (Quickstart runtime)"
      tabs={[
        {
          id: "verbatim",
          label: "As published",
          note: "The provider line is verbatim. It names no agent (→ \"default\", which the Quickstart runtime does not register) and omits useSingleEndpoint={false}, which the Copilot Runtime page says a multi-route runtime needs. The <CopilotChat /> child is HARNESS.",
          render: () => (
            <CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ a2ui={{ catalog: myCatalog }}>
              <CopilotChat />
            </CopilotKit>
          ),
        },
        {
          id: "quickstart-props",
          label: "+ Quickstart provider props",
          note: "HARNESS combination of two doc snippets: the same a2ui prop, plus the Quickstart provider's agent=\"my_agent\" and useSingleEndpoint={false}. This separates the A2UI behaviour from the agent-naming mismatch.",
          render: () => (
            <CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent" useSingleEndpoint={false} a2ui={{ catalog: myCatalog }}>
              <CopilotChat />
            </CopilotKit>
          ),
        },
      ]}
    />
  );
}
