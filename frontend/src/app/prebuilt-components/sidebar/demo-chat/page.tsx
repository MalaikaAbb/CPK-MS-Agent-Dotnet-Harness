// VERBATIM from the doc page's Code tab. Harness edits are marked HARNESS.
"use client";

import React from "react";
import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2";
import { MainContent } from "./main-content";
// HARNESS: commented out, module not published by the doc → import { Suggestions } from "./suggestions-mount";

export default function PrebuiltSidebarDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-showcase" /* HARNESS EDIT: doc says "/api/copilotkit"; see app/api/copilotkit-showcase/route.ts */ agent="prebuilt-sidebar">
      <MainContent />
      <CopilotSidebar agentId="prebuilt-sidebar" defaultOpen={true} />
      {/* HARNESS: commented out, module not published by the doc → <Suggestions /> */}
    </CopilotKit>
  );
}
