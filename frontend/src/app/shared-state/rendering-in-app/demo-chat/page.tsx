"use client"; // HARNESS: added so the Canvas import above compiles (see components/Canvas.tsx).
// VERBATIM otherwise: app/page.tsx from /shared-state/rendering-in-app. The doc imports
// Canvas from "../../components/Canvas"; this file sits where that path resolves.
import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2";
import { Canvas } from "../../components/Canvas";

export default function Page() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */>
      <div className="app-shell grid h-screen grid-cols-1 lg:grid-cols-[1fr_26rem]" /* HARNESS: layout classes, no .app-shell styles are published */>
        {/* Your app UI, driven by agent.state */}
        <Canvas />
        {/* Chat is just another consumer of the same agent */}
        <CopilotSidebar defaultOpen /* HARNESS: defaultOpen so the chat is visible next to the canvas */ />
      </div>
    </CopilotKit>
  );
}
