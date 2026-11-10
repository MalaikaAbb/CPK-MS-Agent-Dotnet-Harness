// VERBATIM from the doc page's Code tab. Harness edits are marked HARNESS.
"use client";

import React from "react";
import { CopilotKit, CopilotChat } from "@copilotkit/react-core/v2";
// HARNESS: commented out, module not published by the doc → import { useAgenticChatSuggestions } from "./suggestions";

export default function AgenticChatDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-showcase" /* HARNESS EDIT: doc says "/api/copilotkit"; see app/api/copilotkit-showcase/route.ts */ agent="agentic_chat">
      <Chat />
    </CopilotKit>
  );
}

function Chat() {
  // HARNESS: commented out, module not published by the doc → useAgenticChatSuggestions();
  return <CopilotChat agentId="agentic_chat" />;
}
