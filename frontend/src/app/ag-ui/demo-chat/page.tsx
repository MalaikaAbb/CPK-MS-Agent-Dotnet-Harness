"use client";

// /ag-ui. Both snippets are verbatim. They render nothing and log to the console.
// The my_agent event panel is HARNESS-AUTHORED, so the AG-UI stream can be seen
// on screen.

import { useEffect, useState } from "react";
import { CopilotChat, useAgent } from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";
import { Providers } from "@/doc/quickstart/providers";

// ── "Accessing your agent with useAgent", verbatim ──
function AgentStatus() {
  const { agent } = useAgent({ agentId: "my_agent" /* HARNESS FIX: doc says "research-agent", not registered (README §9.3) */ });
  // agent.messages  — conversation history
  // agent.state     — current shared state
  // agent.isRunning — whether the agent is running
}

// ── "Subscribing to AG-UI events", verbatim ──
function EventLog() {
  const { agent } = useAgent({ agentId: "my_agent" /* HARNESS FIX: doc says "research-agent", not registered (README §9.3) */ });

  useEffect(() => {
    const subscription = agent.subscribe({
      onTextMessageContentEvent({ textMessageBuffer }) {
        console.log("Streaming text:", textMessageBuffer);
      },
      onToolCallEndEvent({ toolCallName, toolCallArgs }) {
        console.log("Tool called:", toolCallName, toolCallArgs);
      },
      onStateChanged({ agent }) {
        console.log("State changed:", agent.state);
      },
    });

    return () => subscription.unsubscribe();
  }, [agent]);
}

// ── HARNESS-AUTHORED: the same subscription, on my_agent, rendered on screen ──
function HarnessEventPanel() {
  const { agent } = useAgent({ agentId: "my_agent" });
  const [events, setEvents] = useState<string[]>([]);
  useEffect(() => {
    const subscription = agent.subscribe({
      onEvent({ event }) {
        setEvents((prev) => [...prev.slice(-199), `${new Date().toISOString().slice(11, 23)}  ${event.type}`]);
      },
    });
    return () => subscription.unsubscribe();
  }, [agent]);
  return (
    <pre className="h-full overflow-auto bg-slate-950 p-3 text-[11px] text-emerald-300">
      {events.length ? events.join("\n") : "Send a message. AG-UI events for my_agent appear here."}
    </pre>
  );
}

export default function AgUiDemo() {
  return (
    <DemoTabs
      title="AG-UI · Quickstart <Providers> (my_agent)"
      tabs={[
        {
          id: "panel",
          label: "Event stream (my_agent)",
          note: "HARNESS panel. Expect RUN_STARTED, TEXT_MESSAGE_START/CONTENT/END and RUN_FINISHED per turn.",
          render: () => (
            <Providers>
              <div className="grid h-full grid-cols-[1fr_1fr]">
                <HarnessEventPanel />
                <CopilotChat />
              </div>
            </Providers>
          ),
        },
        {
          id: "published",
          label: "AgentStatus + EventLog (research-agent)",
          note: "Verbatim except the agent id: the doc looks up \"research-agent\", and HARNESS FIX uses my_agent. Send a message and watch the console for \"Streaming text:\" lines.",
          render: () => (
            <Providers>
              {/* @ts-expect-error HARNESS: kept as published. AgentStatus returns nothing, so TS rejects it as a JSX component. */}
              <AgentStatus />
              {/* @ts-expect-error HARNESS: kept as published. EventLog returns nothing, so TS rejects it as a JSX component. */}
              <EventLog />
              <div className="h-full">
                <CopilotChat />
              </div>
            </Providers>
          ),
        },
      ]}
    />
  );
}
