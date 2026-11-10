"use client";

// "After" provider line from /generative-ui/components/from-a2ui, verbatim, with
// appUI from ./appui.tsx. The "Before" (createCatalog) form is reference-only.

import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";

import { appUI } from "./appui";

export default function FromA2uiDemo() {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: appUI }}>
      <div className="h-dvh">
        <CopilotChat />
      </div>
    </CopilotKitProvider>
  );
}
