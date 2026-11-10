// VERBATIM from the doc page's Code tab. Harness edits are marked HARNESS.
"use client";

// Reasoning — Default
//
// Pairs with `reasoning-custom` (the Custom variant) so users can
// compare default vs custom reasoning rendering side by side. This cell
// renders <CopilotChat> with NO slot override — reasoning messages are
// rendered by the built-in `CopilotChatReasoningMessage` component
// (Thinking… / Thought for X header with an expandable content region).
//
// Both demos share the same backend (`reasoning_agent` graph) and the
// same runtime URL (/api/copilotkit). The only difference is whether the
// `messageView.reasoningMessage` slot is overridden.

import { CopilotKit, CopilotChat } from "@copilotkit/react-core/v2";
// HARNESS: commented out, module not published by the doc → import { useReasoningDefaultSuggestions } from "./suggestions";

const AGENT_ID = "reasoning-default";

export default function ReasoningDefaultDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-showcase-harness" /* HARNESS EDIT: doc says "/api/copilotkit"; this runtime reaches backend/harness */ agent={AGENT_ID}>
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl">
          <Chat />
        </div>
      </div>
    </CopilotKit>
  );
}

function Chat() {
  // HARNESS: commented out, module not published by the doc → useReasoningDefaultSuggestions();
  return <CopilotChat agentId={AGENT_ID} className="h-full rounded-2xl" />;
}
