"use client";

// Fragment snippets from /prebuilt-components/copilot-threads-drawer, verbatim
// unless marked HARNESS. These fragments show no imports, so the imports and the
// surrounding <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */> (the same provider
// the page's full examples use) are HARNESS glue.

import { useState } from "react";
import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotKitProvider,
  CopilotThreadsDrawer,
} from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";

function ControlledChat() {
  const [threadId, setThreadId] = useState(() => crypto.randomUUID());
  const startNew = () => setThreadId(crypto.randomUUID());

  return (
    <CopilotChatConfigurationProvider threadId={threadId}>
      <CopilotThreadsDrawer
        onThreadSelect={(id) => setThreadId(id)}
        onNewThread={startNew}
      />
      <button type="button" onClick={startNew}>
        New conversation
      </button>
      <CopilotChat />
    </CopilotChatConfigurationProvider>
  );
}

const PARTS_CSS = `copilotkit-threads-drawer::part(new-thread-button),
copilotkit-threads-drawer::part(launcher-new-thread) {
  display: none;
}`;

const shell = (node: React.ReactNode) => (
  <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */>
    <CopilotChatConfigurationProvider>
      <div style={{ display: "flex", height: "100%" }}>
        {node}
        <CopilotChat />
      </div>
    </CopilotChatConfigurationProvider>
  </CopilotKitProvider>
);

export default function ThreadsDrawerSnippets() {
  return (
    <DemoTabs
      title="Threads Drawer · fragment snippets · /api/copilotkit (Quickstart runtime, Intelligence)"
      tabs={[
        {
          id: "controlled",
          label: "ControlledChat",
          note: "Verbatim function. HARNESS: wrapped in <CopilotKitProvider runtimeUrl=\"/api/copilotkit\">, and the useState import is supplied.",
          render: () => (
            <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */>
              <div style={{ display: "flex", height: "100%" }}>
                <ControlledChat />
              </div>
            </CopilotKitProvider>
          ),
        },
        {
          id: "parts",
          label: "Hide new-thread parts",
          note: "Verbatim CSS, injected with a <style> tag. Both new-thread controls should disappear.",
          render: () => (
            <>
              <style>{PARTS_CSS}</style>
              {shell(<CopilotThreadsDrawer />)}
            </>
          ),
        },
        {
          id: "agent",
          label: "agentId=\"research_agent\"",
          note: "Verbatim. The drawer lists threads for research_agent, which has none, so expect an empty list. The chat beside it is my_agent (HARNESS FIX on the shell provider).",
          render: () => shell(<CopilotThreadsDrawer agentId="research_agent" />),
        },
        {
          id: "slot",
          label: "header slot",
          note: "Verbatim. CopilotThreadsDrawer does not type children, so the projected slot may be ignored. Expect \"My conversations\" in the header only if it is forwarded.",
          render: () =>
            shell(
              // @ts-expect-error HARNESS: doc type error kept. CopilotThreadsDrawerProps has no `children`, so the slot="header" example does not type-check.
              <CopilotThreadsDrawer>
                <span slot="header">My conversations</span>
              </CopilotThreadsDrawer>,
            ),
        },
      ]}
    />
  );
}
