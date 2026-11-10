"use client";

// HARNESS-AUTHORED. The page imports Chat from "./chat", which this doc page does not publish.
// Minimal version in the shape of the chat.tsx the Hashbrown / json-render pages do publish: a
// full-height CopilotChat on the provider's agent, with no extra slots (the page's own comment
// says the built-in renderers need none).
import { CopilotChat } from "@copilotkit/react-core/v2";

export function Chat() {
  return <CopilotChat className="h-full" />;
}
