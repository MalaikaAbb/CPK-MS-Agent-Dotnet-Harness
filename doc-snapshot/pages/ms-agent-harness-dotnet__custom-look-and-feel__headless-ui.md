# Headless UI

> Build any UI — chat or not — on top of the CopilotKit primitives with zero UI opinions.


<!-- interactive demo: headless-complete -->


## What is this?

A headless UI gives you **full control** over the chat experience. You bring your own components, layout, and styling while CopilotKit handles agent communication, message management, tool-call rendering, and streaming. No `<CopilotChat>`, no slot overrides, just your components composed on top of the low-level hooks.

## When should I use this?

Use headless UI when:

- The [slot system](/ms-agent-harness-dotnet/custom-look-and-feel/slots) isn't enough: you need a completely different layout.
- You're embedding chat into an existing UI with its own patterns.
- You're building a **non-chat surface** that still talks to an agent (a dashboard, a canvas, an inspector) and want `useRenderToolCall` / `useRenderActivityMessage` on their own.
- You want to render generative UI primitives outside of a chat entirely.

## The core hooks

Three hooks power it, and they're the same ones `<CopilotChat>` uses internally.

- `useAgent({ agentId })` — exposes the current conversation (`messages`, `isRunning`) and the run-state object.
- `useCopilotKit()` — returns the runtime handle you call `runAgent({ agent })` on.
- `useRenderToolCall()` — returns a function that paints any registered tool call inline.

## Minimal example

Start with a hand-rolled message list and composer built from `useAgent` + `useCopilotKit`:

<!-- snippet skipped: region 'use-agent-simple' missing in ms-agent-harness-dotnet::headless-simple -->

The message list is a plain `.map()` over `agent.messages`: user messages render as right-aligned bubbles, assistant messages render streamed text plus inline tool calls via `renderToolCall({ toolCall })`:

<!-- snippet skipped: region 'message-list-simple' missing in ms-agent-harness-dotnet::headless-simple -->

No `<CopilotChat />`, no slots. The trade-off: you only get text and tool calls. Reasoning messages, activity messages, and custom before/after slots won't show up unless you wire them in yourself, which is exactly what the complete example covers.

## Complete example

The `headless-complete` cell rebuilds the **full** generative-UI composition from the low-level hooks directly, without importing `<CopilotChatMessageView>`: text, tool calls, reasoning cards, A2UI + MCP Apps activity messages, and custom before/after message slots.

### The `useRenderedMessages` hook

The cell's central piece is a hand-rolled `useRenderedMessages(messages, isRunning)` that returns the same flat list of messages, each augmented with a `renderedContent: ReactNode` field. This hook is a **manual recreation of what `<CopilotChatMessageView>` does**:

```typescript
// src/app/demos/headless-complete/use-rendered-messages.tsx
import React, { useMemo } from "react";
import type {
  Message,
  AssistantMessage,
  UserMessage,
  ReasoningMessage,
  ActivityMessage,
  ToolMessage,
} from "@ag-ui/core";
import {
  CopilotChatReasoningMessage,
  useRenderToolCall,
  useRenderActivityMessage,
  useRenderCustomMessages,
} from "@copilotkit/react-core/v2";

/**
 * Manual per-message composition for the TRULY headless chat cell.
 *
 * This hook mirrors — line-for-line in spirit — the role-dispatch that happens
 * inside `renderMessageBlock` in the canonical primitive:
 *
 *   packages/react-core/src/v2/components/chat/CopilotChatMessageView.tsx:542-612
 *
 * The point of this cell is to demonstrate that the FULL generative-UI weave
 * (assistant text + tool-call renders + reasoning + activity + custom before /
 * after slots) can be re-composed from the low-level hooks directly, without
 * importing `<CopilotChatMessageView>` or `<CopilotChatAssistantMessage>`.
 * Only the reasoning-message LEAF component is imported — it's a pure
 * presentational primitive, not a dispatcher.
 *
 * Return shape: the original messages, each augmented with a `renderedContent`
 * field that the parent list drops directly into a `<UserBubble>` or
 * `<AssistantBubble>` chrome wrapper.
 *
 * Text rendering: we intentionally use plain text (a `<div>` with
 * `whitespace-pre-wrap`) rather than a markdown pipeline. Rationale: the cell's
 * goal is to show what "truly headless" looks like — every piece of composition
 * lives in user code — so pulling in a markdown library here would re-hide
 * a chunk of formatting decisions behind an opaque black box. Apps that want
 * markdown can drop Streamdown / react-markdown in at this exact line.
 */
export type RenderedMessage = Message & { renderedContent: React.ReactNode };

export function useRenderedMessages(
  messages: Message[],
  isRunning: boolean,
): RenderedMessage[] {
  const renderToolCall = useRenderToolCall();
  const { renderActivityMessage } = useRenderActivityMessage();
  const renderCustomMessage = useRenderCustomMessages();

  return useMemo(() => {
    return messages.map((message): RenderedMessage => {
      const renderedContent = renderMessageContent({
        message,
        messages,
        isRunning,
        renderToolCall,
        renderActivityMessage,
        renderCustomMessage,
      });
      return { ...message, renderedContent } as RenderedMessage;
    });
    // `renderToolCall`, `renderActivityMessage`, and `renderCustomMessage` are
    // callbacks produced by their respective hooks; their identity turns over
    // whenever the underlying registries / agent / config change, which is
    // exactly when we want to recompute.
  }, [
    messages,
    isRunning,
    renderToolCall,
    renderActivityMessage,
    renderCustomMessage,
  ]);
}
```

Three low-level hooks feed it:

- `useRenderToolCall()` — returns the renderer for any registered tool call (per-tool via `useRenderTool` / `useComponent`, plus the wildcard from `useDefaultRenderTool`).
- `useRenderActivityMessage()` — renders A2UI + MCP Apps activity messages for the current agent scope.
- `useRenderCustomMessages()` — invokes `renderCustomMessage` hooks registered against the active `CopilotChatConfigurationProvider`, emitting `"before"` and `"after"` slots around every message.

### Per-role dispatch

The role-switch mirrors `CopilotChatMessageView`'s `renderMessageBlock` exactly: assistant bodies get text and tool calls, user bodies get their text content, reasoning messages go through the `<CopilotChatReasoningMessage>` leaf, and activity messages route through `renderActivityMessage`:

```typescript
// src/app/demos/headless-complete/use-rendered-messages.tsx
  if (message.role === "assistant") {
    body = renderAssistantBody({
      message: message as AssistantMessage,
      messages,
      renderToolCall,
    });
  } else if (message.role === "user") {
    body = renderUserBody(message as UserMessage);
  } else if (message.role === "reasoning") {
    body = (
      <CopilotChatReasoningMessage
        message={message as ReasoningMessage}
        messages={messages}
        isRunning={isRunning}
      />
    );
  } else if (message.role === "activity") {
    body = renderActivityMessage(message as ActivityMessage);
  }
```

### Tool-call composition

For each `toolCall` on an assistant message, we look up the sibling `tool`-role message (keyed by `toolCallId`) and hand both to `renderToolCall`:

```typescript
// src/app/demos/headless-complete/use-rendered-messages.tsx
function renderAssistantBody(args: {
  message: AssistantMessage;
  messages: Message[];
  renderToolCall: ReturnType<typeof useRenderToolCall>;
}): React.ReactNode {
  const { message, messages, renderToolCall } = args;
  const text = message.content ?? "";
  const hasText = text.trim().length > 0;
  const toolCalls = message.toolCalls ?? [];

  return (
    <>
      {hasText && <div className="whitespace-pre-wrap break-words">{text}</div>}
      {toolCalls.map((toolCall) => {
        // Tool result lives on a sibling `tool`-role message keyed by toolCallId.
        // Mirrors CopilotChatToolCallsView (react-core/v2/components/chat/CopilotChatToolCallsView.tsx).
        const toolMessage = messages.find(
          (m) => m.role === "tool" && m.toolCallId === toolCall.id,
        ) as ToolMessage | undefined;
        return (
          <React.Fragment key={toolCall.id}>
            {renderToolCall({ toolCall, toolMessage })}
          </React.Fragment>
        );
      })}
    </>
  );
}
```

### Bubble chrome

The `UserBubble` and `AssistantBubble` components are **pure chrome**: they receive the pre-rendered node from `useRenderedMessages` and drop it into a styled container. No chat primitives are imported here:

```typescript
// src/app/demos/headless-complete/message-list.tsx
function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-[#010507] text-white px-4 py-2 text-sm whitespace-pre-wrap break-words">
        {children}
      </div>
    </div>
  );
}

function AssistantBubble({ children }: { children: React.ReactNode }) {
  if (isEmpty(children)) return null;
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] flex flex-col gap-2">
        <div className="rounded-2xl rounded-bl-sm bg-[#F0F0F4] text-[#010507] px-4 py-2 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
```

## Next steps

- [Slots](/ms-agent-harness-dotnet/custom-look-and-feel/slots) — less work than going fully headless, often enough.
- [CSS customization](/ms-agent-harness-dotnet/custom-look-and-feel/css) — when you just need to re-skin the defaults.
