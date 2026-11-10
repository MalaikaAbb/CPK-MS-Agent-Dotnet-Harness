// The runtime snippet from /generative-ui/components/transports ("Tool transport"):
//
//   const runtime = new CopilotRuntime({
//     agents: { default: agent },
//     generativeUI: true,
//   });
//
// The snippet never defines `agent` and shows no handler. HARNESS-AUTHORED: `agent`
// is the Quickstart's HttpAgent (the published .NET MyAgent), and the handler is
// the Quickstart's createCopilotRuntimeHandler pattern, mounted at its own path.
// No `intelligence` option here: the snippet has none.
import { CopilotRuntime, createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

const agent = new HttpAgent({ url: "http://localhost:8000/" }); // HARNESS

// ── doc snippet ──
const runtime = new CopilotRuntime({
  agents: { default: agent },
  generativeUI: true,
});

// ── HARNESS: Quickstart handler pattern ──
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-genui",
});

export const GET = handler;
export const POST = handler;
