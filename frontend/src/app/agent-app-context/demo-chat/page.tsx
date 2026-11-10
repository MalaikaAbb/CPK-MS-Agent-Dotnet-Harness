"use client";

// /agent-app-context. The provider is the Quickstart's (agent="my_agent",
// useSingleEndpoint={false}), pointed at the HARNESS runtime that reaches the
// page's .NET server on :8001.

import { CopilotChat, CopilotKit } from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";

import { YourComponent } from "./YourComponent";
import { YourComponentWithImports } from "./YourComponentWithImports";

const provider = (node: React.ReactNode) => (
  <CopilotKit runtimeUrl="/api/copilotkit-agent-app-context" agent="my_agent" useSingleEndpoint={false}>
    {node}
    <div className="h-full">
      <CopilotChat />
    </div>
  </CopilotKit>
);

export default function AgentAppContextDemo() {
  return (
    <DemoTabs
      title="Readables · .NET InjectContextMiddleware on :8001"
      tabs={[
        {
          id: "verbatim",
          label: "YourComponent (as published)",
          note: "Verbatim. useState and useAgentContext are never imported, so expect a ReferenceError.",
          render: () => provider(<YourComponent />),
        },
        {
          id: "imports",
          label: "+ imports supplied",
          note: "HARNESS copy with only the two import lines added, to exercise the page's .NET middleware. Ask \"Who are my colleagues?\" and expect John Doe, Jane Smith and Bob Wilson.",
          render: () => provider(<YourComponentWithImports />),
        },
      ]}
    />
  );
}
