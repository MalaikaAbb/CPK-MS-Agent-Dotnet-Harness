// VERBATIM from the /shared-state/agent-readonly page's Code tab. Harness edits are marked HARNESS.
"use client";

import React, { useState } from "react";
import {
  CopilotKit,
  CopilotPopup,
  useAgentContext,
} from "@copilotkit/react-core/v2";

import { ACTIVITIES, DemoLayout } from "./demo-layout";
// HARNESS: commented out, module not published by the doc → import { useReadonlyStateAgentContextSuggestions } from "./suggestions";

export default function ReadonlyStateAgentContextDemo() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit-showcase" /* HARNESS EDIT: doc says "/api/copilotkit"; see app/api/copilotkit-showcase/route.ts */
      agent="readonly-state-agent-context"
    >
      <DemoContent />
      <CopilotPopup
        agentId="readonly-state-agent-context"
        defaultOpen={true}
        labels={{ chatInputPlaceholder: "Ask about your context..." }}
      />
    </CopilotKit>
  );
}

function DemoContent() {
  const [userName, setUserName] = useState("Atai");
  const [userTimezone, setUserTimezone] = useState("America/Los_Angeles");
  const [recentActivity, setRecentActivity] = useState<string[]>([
    ACTIVITIES[0],
    ACTIVITIES[2],
  ]);

  useAgentContext({
    description: "The currently logged-in user's display name",
    value: userName,
  });
  useAgentContext({
    description: "The user's IANA timezone (used when mentioning times)",
    value: userTimezone,
  });
  useAgentContext({
    description: "The user's recent activity in the app, newest first",
    value: recentActivity,
  });

  // HARNESS: commented out, module not published by the doc → useReadonlyStateAgentContextSuggestions();

  const toggleActivity = (activity: string) => {
    setRecentActivity((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity],
    );
  };

  return (
    <DemoLayout
      userName={userName}
      userTimezone={userTimezone}
      recentActivity={recentActivity}
      onUserNameChange={setUserName}
      onUserTimezoneChange={setUserTimezone}
      onToggleActivity={toggleActivity}
    />
  );
}
