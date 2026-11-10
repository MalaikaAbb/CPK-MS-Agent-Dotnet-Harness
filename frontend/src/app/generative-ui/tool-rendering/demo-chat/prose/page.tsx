// VERBATIM from the /generative-ui/tool-rendering page. (page body: app/page.tsx)
"use client";

import { CopilotChat, CopilotKit } from "@copilotkit/react-core/v2";
import { ToolRenderers } from "./tool-renderers";

export default function Page() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-showcase" /* HARNESS EDIT: doc says "/api/copilotkit"; see app/api/copilotkit-showcase/route.ts */ agent="tool-rendering">
      <ToolRenderers />
      <CopilotChat agentId="tool-rendering" />
    </CopilotKit>
  );
}
