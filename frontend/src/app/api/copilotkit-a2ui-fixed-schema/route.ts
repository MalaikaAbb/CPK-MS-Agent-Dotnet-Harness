// The Fixed Schema page's "Registering the runtime" snippet (app/api/copilotkit/route.ts), mounted at
// /api/copilotkit-a2ui-fixed-schema — the runtimeUrl the page's Code-tab demo uses, whose route file
// is not published. The CopilotRuntime constructor is VERBATIM. HARNESS-AUTHORED: `agent` (never
// defined on the page) is an HttpAgent at backend/harness's /a2ui-fixed-schema, and the handler is
// the shape of the published sibling routes (copilotkit-declarative-hashbrown etc.).
import type { NextRequest } from "next/server";
import { CopilotRuntime, createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

const AGENT_URL = process.env.HARNESS_AGENT_URL || "http://localhost:8002"; // HARNESS
const agent = new HttpAgent({ url: `${AGENT_URL}/a2ui-fixed-schema` }); // HARNESS

// ── doc snippet ──
const runtime = new CopilotRuntime({
  agents: { "a2ui-fixed-schema": agent },
  a2ui: { injectA2UITool: false, agents: ["a2ui-fixed-schema"] },
});

// ── HARNESS: handler in the shape of the published sibling routes ──
export const POST = async (req: NextRequest) => {
  const handler = createCopilotRuntimeHandler({
    runtime,
    basePath: "/api/copilotkit-a2ui-fixed-schema",
    mode: "single-route",
  });
  return handler(req);
};
