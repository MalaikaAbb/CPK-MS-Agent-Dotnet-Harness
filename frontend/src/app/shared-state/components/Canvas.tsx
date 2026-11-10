"use client"; // HARNESS: added. The doc file has no "use client", but it imports useEffect, which Next only allows in Client Components (the build fails without it).
// VERBATIM otherwise: components/Canvas.tsx from /shared-state/rendering-in-app, plus the page's
// separate toggleItem snippet (the "write back from a click handler" example), which the doc prints
// on its own and never wires into Canvas. HARNESS: placed inside Canvas and bound to each <li>.
import { useEffect } from "react";
import { useAgent } from "@copilotkit/react-core/v2";

type CanvasState = {
  title: string;
  items: { id: string; label: string; done: boolean }[];
};

const INITIAL_CANVAS_STATE: CanvasState = {
  title: "Project launch",
  items: [
    { id: "research", label: "Research user needs", done: true },
    { id: "prototype", label: "Build a prototype", done: false },
  ],
};

export function Canvas() {
  // No agentId means the "default" agent. Pass { agentId } to target another.
  const { agent, isReady } = useAgent();
  const state = (agent.state ?? {}) as Partial<CanvasState>;

  useEffect(() => {
    if (!isReady) return;

    const current = (agent.state ?? {}) as Partial<CanvasState>;
    const updates: Partial<CanvasState> = {};

    if (current.title === undefined) {
      updates.title = INITIAL_CANVAS_STATE.title;
    }
    if (current.items === undefined) {
      updates.items = INITIAL_CANVAS_STATE.items;
    }

    if (Object.keys(updates).length > 0) {
      agent.setState({ ...(agent.state ?? {}), ...updates });
    }
  }, [agent, isReady, state.title, state.items]);

  // VERBATIM: the page's toggleItem snippet, except one HARNESS FIX: `agent.state` is untyped, so the
  // printed `(it) =>` is an implicit any and fails `strict` (TS7006, which breaks `next build`). Doc:
  // `(agent.state?.items ?? []).map((it) =>`. The cast leaves the body otherwise identical.
  function toggleItem(id: string) {
    const current = (agent.state ?? {}) as Partial<CanvasState>; // HARNESS FIX
    agent.setState({
      ...agent.state,
      items: (current.items ?? []).map((it) =>
        it.id === id ? { ...it, done: !it.done } : it,
      ),
    });
  }

  return (
    <main className="canvas p-6" /* HARNESS: p-6, no .canvas styles are published */>
      <h1 className="mb-3 text-lg font-semibold" /* HARNESS: styling */>{state.title ?? "Untitled"}</h1>
      <ul>
        {(state.items ?? []).map((item) => (
          <li
            key={item.id}
            data-done={item.done}
            onClick={() => toggleItem(item.id)} /* HARNESS: wires the doc's toggleItem */
            className={`cursor-pointer ${item.done ? "line-through" : ""}`} /* HARNESS: makes done visible */
          >
            {item.label}
          </li>
        ))}
      </ul>
    </main>
  );
}
