"use client";

// Snippets from /headless-threads, verbatim unless marked HARNESS. They run inside
// the Quickstart's <Providers> (my_agent on /api/copilotkit). That runtime already
// has the `intelligence` and `identifyUser` options this page's server.ts asks
// for. server.ts itself is reference-only, because `agent` and `verifyAppSession`
// are never defined.

import { useState } from "react";
import { CopilotChat, useAgent, useThreads } from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";
import { Providers } from "@/doc/quickstart/providers";

// ── ThreadSidebar.tsx ──────────────────────────────────────────────────────
function ThreadSidebar() {
  const {
    threads,
    isLoading,
    renameThread,
    archiveThread,
    deleteThread,
  } = useThreads({ agentId: "my_agent" /* HARNESS FIX: doc says "my-agent"; the Quickstart registers my_agent (README §9.3) */ });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {threads.map((thread) => (
        <div key={thread.id}>
          <span>{thread.name ?? "New conversation"}</span>
          <button onClick={() => renameThread(thread.id, "Renamed")}>
            Rename
          </button>
          <button onClick={() => archiveThread(thread.id)}>
            Archive
          </button>
        </div>
      ))}
    </div>
  );
}

// ── App.tsx ────────────────────────────────────────────────────────────────
function App() {
const [activeThreadId, setActiveThreadId] = useState<string | undefined>();

  return (
    <div className="flex">
      {/* @ts-expect-error HARNESS: doc type error kept. ThreadSidebar takes no props, so onSelectThread is never used. */}
      <ThreadSidebar onSelectThread={setActiveThreadId} />
      <CopilotChat threadId={activeThreadId} />
    </div>
  );
}

// ── Pagination fragment ────────────────────────────────────────────────────
// HARNESS: the doc publishes only the hook call and a JSX fragment ("In your
// JSX:"). This wrapper renders them, plus a plain list so the page is visible.
function PaginatedThreads() {
  const {
    threads,
    hasMoreThreads,
    isFetchingMoreThreads,
    fetchMoreThreads,
  } = useThreads({
    agentId: "my_agent" /* HARNESS FIX: doc says "my-agent"; the Quickstart registers my_agent (README §9.3) */,
    limit: 20,
  });

  return (
    <div>
      <p>{threads.length} threads loaded (HARNESS readout)</p>
      {hasMoreThreads && (
        <button
          onClick={fetchMoreThreads}
          disabled={isFetchingMoreThreads}
        >
          {isFetchingMoreThreads ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}

// ── Driving one agent per thread ───────────────────────────────────────────
// HARNESS: the doc publishes only the useAgent call. This wrapper supplies a
// threadId and shows what the hook returns.
function ThreadPinnedAgent({ threadId }: { threadId: string }) {
  const { agent } = useAgent({
    agentId: `chat-${threadId}`, // local id, unique per mounted thread
    runtimeAgentId: "my_agent" /* HARNESS FIX: doc says "default", not registered (README §9.3) */,   // the one runtime agent they all route to
    threadId,                    // the thread this instance is pinned to
  });
  return (
    <pre className="m-4 text-xs">
      {JSON.stringify({ agentId: agent.agentId, threadId: agent.threadId, messages: agent.messages.length }, null, 2)}
    </pre>
  );
}

const wrap = "[&_button]:mx-1 [&_button]:rounded [&_button]:border [&_button]:px-2 [&_button]:text-xs p-3";

export default function HeadlessThreadsDemo() {
  return (
    <DemoTabs
      title="Headless Threads · Quickstart <Providers> (my_agent, Intelligence)"
      tabs={[
        {
          id: "app",
          label: "ThreadSidebar + App",
          note: "Verbatim except the agent id: the doc's useThreads asks for \"my-agent\" (hyphen), and HARNESS FIX uses my_agent. The sidebar's onSelectThread prop still does not exist, so clicking a row does not switch the chat.",
          render: () => (
            <Providers>
              <div className={`h-full ${wrap}`}>
                <App />
              </div>
            </Providers>
          ),
        },
        {
          id: "pagination",
          label: "Pagination",
          note: "The hook call and JSX fragment are verbatim. HARNESS wrapper and readout.",
          render: () => (
            <Providers>
              <div className={wrap}>
                <PaginatedThreads />
              </div>
            </Providers>
          ),
        },
        {
          id: "pinned",
          label: "useAgent per thread",
          note: "The useAgent call is verbatim. runtimeAgentId \"default\" is not registered on the Quickstart runtime.",
          render: () => (
            <Providers>
              <ThreadPinnedAgent threadId="harness-thread-1" />
            </Providers>
          ),
        },
      ]}
    />
  );
}
