"use client";

// HARNESS-AUTHORED. page.tsx imports Chat from "./chat/chat", which the /custom-look-and-feel/headless-ui page
// does not publish, and its "Minimal example" snippets render as "Missing snippet" errors on the live page.
// This is the smallest composer built from the hooks the page names: useAgent({ agentId }) for messages and
// isRunning, and useCopilotKit() to runAgent({ agent }). The message list is the published MessageList.
import React, { useState } from "react";
import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";

import { MessageList } from "../message-list";

export function Chat({ agentId }: { agentId: string }) {
  const { agent } = useAgent({ agentId });
  const { copilotkit } = useCopilotKit();
  const [text, setText] = useState("");

  const send = async () => {
    const content = text.trim();
    if (!content || agent.isRunning) return;
    setText("");
    agent.addMessage({ id: crypto.randomUUID(), role: "user", content });
    await copilotkit.runAgent({ agent });
  };

  return (
    <div className="flex h-dvh flex-col">
      <MessageList messages={agent.messages} isRunning={agent.isRunning} />
      <form
        className="flex gap-2 border-t border-slate-200 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <input
          className="flex-1 rounded-md border px-3 py-2 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
        />
        <button type="submit" disabled={agent.isRunning} className="rounded-md bg-slate-900 px-4 text-sm text-white disabled:opacity-40">
          Send
        </button>
      </form>
    </div>
  );
}
