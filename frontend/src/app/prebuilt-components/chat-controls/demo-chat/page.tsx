"use client";

import {
  CopilotChatConfigurationProvider,
  CopilotPopup,
  CopilotSidebar,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import { Providers } from "@/doc/quickstart/providers";

/**
 * The chat-controls page's open, close and feedback snippets on one surface,
 * laid out like the aws-strands-ts harness's version of this route.
 *
 * HARNESS: runs inside the Quickstart's <Providers> (my_agent on /api/copilotkit),
 * because this app has no root CopilotKit provider. `agentId="my_agent"` on the
 * popup and sidebar names the one agent that runtime registers.
 *
 * Open: `OpenChatButton` drives a <CopilotPopup> through `open` /
 * `onOpenChange` (the page's controlled-state snippet), and is guarded by
 * `setModalOpen` as in the page's useCopilotChatConfiguration snippet.
 *
 * Close: `ToggleChatButton` is the page's toggle snippet. The doc publishes only
 * the <button>, using a `config` defined in another snippet; the wrapper here
 * supplies it the same way.
 *
 * Why the explicit <CopilotChatConfigurationProvider isModalDefaultOpen={false}>:
 * the prebuilt surfaces create that provider inside themselves, so buttons
 * rendered as siblings of <CopilotSidebar> would read null and render nothing.
 * The page's own callout says to wrap the subtree when you compose chat
 * yourself; controls beside the chat count. The provider is bidirectional, so
 * the sidebar's inner provider delegates to this one and the buttons and the
 * sidebar share one modal state. For the same reason the sidebar has no
 * `defaultOpen`: the initial closed state comes from `isModalDefaultOpen`.
 *
 * Feedback: `onThumbsUp` / `onThumbsDown` on `messageView.assistantMessage`, as
 * the page shows. The buttons only render when a handler is supplied. HARNESS:
 * the page sends them to `analytics.track(...)`, which it never defines; here
 * they are recorded into local state so the call is visible on the page.
 */

function OpenChatButton() {
  const config = useCopilotChatConfiguration();
  const [chatOpen, setChatOpen] = useState(false);

  // setModalOpen is only present when a provider in the tree owns modal state
  // (the prebuilt CopilotPopup / CopilotSidebar create it for you).
  if (!config?.setModalOpen) return null;

  return (
    <>
      <nav>
        <button onClick={() => setChatOpen(!chatOpen)}>Ask the assistant (Popup)</button>
      </nav>
      <CopilotPopup agentId="my_agent" open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
}

function ToggleChatButton() {
  const config = useCopilotChatConfiguration();
  if (!config?.setModalOpen) return null;

  return (
    <button onClick={() => config.setModalOpen(!config.isModalOpen)}>
      {config.isModalOpen ? "Close Sidebar" : "Open Sidebar"}
    </button>
  );
}

type Feedback = { id: string; value: "up" | "down" };

export default function Page() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  return (
    <DemoFrame parentPath="/prebuilt-components/chat-controls" subtitle="agent: my_agent">
      <Providers>
        {/* Owns the modal state both the buttons and the sidebar read. */}
        <CopilotChatConfigurationProvider isModalDefaultOpen={false}>
          <main className="h-full overflow-y-auto p-10">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Driving the chat from your own UI
            </h1>
            <p className="mt-2 max-w-prose text-sm text-slate-600 dark:text-slate-400">
              The sidebar starts closed. Both buttons below drive it, and the
              toggle&apos;s label tracks its state — that is{" "}
              <code>isModalOpen</code> and <code>setModalOpen</code> read straight
              off the chat configuration context.
              <br />
              <b>RATINGS/FEEDBACK CONFIGURATION IS IN SIDEBAR</b>
            </p>

            <div className="mt-6 flex flex-wrap gap-3 [&_button]:rounded-md [&_button]:border [&_button]:border-slate-300 [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-sm dark:[&_button]:border-slate-700">
              <OpenChatButton />
              <ToggleChatButton />
            </div>

            <section className="mt-8">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Feedback recorded
              </h2>
              {feedback.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  Send a message, then use the thumbs on the assistant reply.
                </p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm">
                  {feedback.map((f, i) => (
                    <li key={`${f.id}-${i}`} className="font-mono text-xs">
                      {f.value === "up" ? "👍" : "👎"} {f.id}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* No `defaultOpen` — see the note above. */}
            <CopilotSidebar
              agentId="my_agent"
              position="left"
              messageView={{
                assistantMessage: {
                  onThumbsUp: (message: { id: string }) => {
                    setFeedback((prev) => [...prev, { id: message.id, value: "up" }]);
                  },
                  onThumbsDown: (message: { id: string }) => {
                    setFeedback((prev) => [...prev, { id: message.id, value: "down" }]);
                  },
                },
              }}
            />
          </main>
        </CopilotChatConfigurationProvider>
      </Providers>
    </DemoFrame>
  );
}
