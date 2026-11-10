// "Enable on the runtime without a catalog" from /generative-ui/a2ui, mounted at
// its own path. The runtime constructor is verbatim. `myAgent` (never defined on
// the page) is the Quickstart's HttpAgent, and the handler is the Quickstart's
// createCopilotRuntimeHandler pattern. Both are HARNESS-AUTHORED.
import {
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

const myAgent = new HttpAgent({ url: "http://localhost:8000/" }); // HARNESS

// ── doc snippet ──
const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: { injectA2UITool: true },
  runner: new InMemoryAgentRunner(),
});

// ── HARNESS: Quickstart handler pattern ──
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-a2ui",
});

export const GET = handler;
export const POST = handler;
