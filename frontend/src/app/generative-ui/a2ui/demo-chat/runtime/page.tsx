"use client";

// Frontend for "Enable on the runtime without a catalog" (/generative-ui/a2ui):
// no catalog on the provider, with the runtime at /api/copilotkit-a2ui turning A2UI
// on (a2ui: { injectA2UITool: true }). The page shows no frontend for this path,
// so this minimal provider + chat is HARNESS-AUTHORED.

import { CopilotChat, CopilotKit } from "@copilotkit/react-core/v2";

export default function A2uiRuntimeDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-a2ui" useSingleEndpoint={false}>
      <div className="h-dvh">
        <CopilotChat />
      </div>
    </CopilotKit>
  );
}
