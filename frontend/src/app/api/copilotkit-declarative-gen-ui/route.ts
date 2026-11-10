// HARNESS-AUTHORED. The Dynamic Schema page's demo uses runtimeUrl "/api/copilotkit-declarative-gen-ui"
// with agent "declarative-gen-ui", but never publishes that route. Its .NET agent (DeclarativeGenUiAgent)
// cannot be built either: it needs the unpublished A2uiSecondaryToolCaller and BeautifulChatA2ui.
//
// Minimal route, in the shape of the published sibling routes (copilotkit-declarative-hashbrown etc.):
// - the agent is the Quickstart MyAgent at "/";
// - no `a2ui` block, because the page says "the catalog auto-enables A2UI and injects the generate_a2ui
//   tool, so the runtime needs no a2ui block";
// - single-route mode, because the page's <CopilotKit> omits useSingleEndpoint={false}.
import type { NextRequest } from "next/server";
import { CopilotRuntime, createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

const runtime = new CopilotRuntime({
  agents: { "declarative-gen-ui": new HttpAgent({ url: "http://localhost:8000/" }) },
});

export const POST = async (req: NextRequest) => {
  const handler = createCopilotRuntimeHandler({
    runtime,
    basePath: "/api/copilotkit-declarative-gen-ui",
    mode: "single-route",
  });
  return handler(req);
};
