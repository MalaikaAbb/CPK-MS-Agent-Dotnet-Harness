"use client";

// /copilot-runtime. Each tab exercises one snippet against this repo's runtime.

import { useEffect, useState } from "react";
import { HttpAgent } from "@ag-ui/client";
import { CopilotChat, CopilotKit } from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";

// HARNESS: reads GET {runtimeUrl}/info, which the page names as the way to confirm
// the runtime and see its registered agent keys.
function InfoProbe({ url }: { url: string }) {
  const [body, setBody] = useState("loading…");
  useEffect(() => {
    fetch(url)
      .then(async (r) => `HTTP ${r.status}\n${JSON.stringify(await r.json().catch(() => "(non-JSON)"), null, 2)}`)
      .then(setBody, (e) => setBody(String(e)));
  }, [url]);
  return (
    <div className="p-4">
      <p className="text-sm font-semibold">GET {url}</p>
      <pre className="mt-2 max-h-[80vh] overflow-auto bg-slate-950 p-3 text-xs text-slate-100">{body}</pre>
    </div>
  );
}

// ── "What If I Want to Connect to My AG-UI Agent Directly?", verbatim ──
const myAgent = new HttpAgent({
  url: "https://my-agent.example.com",
});

// HARNESS: the same snippet pointed at the Quickstart's .NET agent. The browser
// calls :8000 directly, and the .NET Program.cs configures no CORS.
const localAgent = new HttpAgent({ url: "http://localhost:8000/" });

export default function CopilotRuntimeDemo() {
  return (
    <DemoTabs
      title="Copilot Runtime"
      tabs={[
        {
          id: "info",
          label: "GET /api/copilotkit/info",
          note: "The Quickstart runtime. Expect agents to list only \"my_agent\". That is the only name the frontend may ask for.",
          render: () => <InfoProbe url="/api/copilotkit/info" />,
        },
        {
          id: "provider",
          label: "Provider + REST transport",
          note: "The page's provider snippets: <CopilotKit runtimeUrl=\"/api/copilotkit\" agent=\"my_agent\" useSingleEndpoint={false}>. The <YourApp /> child is never defined, so a <CopilotChat /> stands in (HARNESS).",
          render: () => (
            <CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent" useSingleEndpoint={false}>
              <CopilotChat />
            </CopilotKit>
          ),
        },
        {
          id: "single",
          label: "Without useSingleEndpoint",
          note: "The page warns that leaving useSingleEndpoint={false} off makes <CopilotKit> post to the bare runtimeUrl and get 404s while /info still answers 200. This tab omits it (HARNESS) to check that claim on 1.84.1.",
          render: () => (
            <CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent">
              <CopilotChat />
            </CopilotKit>
          ),
        },
        {
          id: "direct",
          label: "Direct · my-agent.example.com",
          note: "Verbatim. The URL is a placeholder, so expect a network error on send. The <YourApp /> child is a HARNESS CopilotChat on agent my-agent.",
          render: () => (
            <CopilotKit agents__unsafe_dev_only={{ "my-agent": myAgent }}>
              <CopilotChat agentId="my-agent" />
            </CopilotKit>
          ),
        },
        {
          id: "direct-local",
          label: "Direct · localhost:8000",
          note: "HARNESS: the same direct connection, pointed at the Quickstart agent. Expect a CORS error, because the .NET Program.cs adds no CORS policy.",
          render: () => (
            <CopilotKit agents__unsafe_dev_only={{ "my-agent": localAgent }}>
              <CopilotChat agentId="my-agent" />
            </CopilotKit>
          ),
        },
      ]}
    />
  );
}
