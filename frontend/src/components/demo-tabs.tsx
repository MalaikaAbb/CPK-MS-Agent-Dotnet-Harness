"use client";

// HARNESS-AUTHORED. Shows one doc snippet at a time. Only the active tab is
// mounted, so each snippet gets a fresh provider and chat and none of them share
// state or fight over a docked sidebar.

import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from "react";

/** Shows a snippet's render-time exception in place, so one broken snippet does
 * not take down the other tabs. The error is the test result. */
class SnippetBoundary extends Component<{ children: ReactNode }, { error?: Error }> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[harness] snippet threw", error, info.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="m-4 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900">
          <p className="font-semibold">This snippet threw while rendering (as published):</p>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export interface DemoTab {
  id: string;
  label: string;
  /** One line: which doc snippet this tab runs, and any harness glue around it. */
  note?: ReactNode;
  render: () => ReactNode;
}

export function DemoTabs({ tabs, title }: { tabs: DemoTab[]; title: string }) {
  const [active, setActive] = useState(tabs[0]?.id);
  // Tab content mounts on the client only. A snippet that throws while rendering
  // (as several do, as published) would otherwise throw during server rendering,
  // where error boundaries do not apply, and take the whole route down with a 500.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className="flex h-dvh flex-col bg-white text-slate-900">
      <div className="shrink-0 border-b border-slate-200 px-3 pt-2">
        <p className="text-xs font-semibold text-slate-500">{title}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`rounded-t-md border border-b-0 px-3 py-1 text-xs ${
                t.id === tab?.id ? "border-slate-300 bg-slate-100 font-medium" : "border-transparent text-slate-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {tab?.note && <div className="shrink-0 bg-amber-50 px-3 py-1.5 text-xs text-amber-900">{tab.note}</div>}
      <div key={tab?.id} className="relative min-h-0 flex-1 overflow-auto">
        {mounted && <SnippetBoundary>{tab?.render()}</SnippetBoundary>}
      </div>
    </div>
  );
}
