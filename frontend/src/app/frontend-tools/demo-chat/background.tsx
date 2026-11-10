// HARNESS-AUTHORED. The Frontend Tools Code-tab page imports Background and
// DEFAULT_BACKGROUND from "./background", which no doc page publishes. Minimal
// version: a full-screen container whose CSS background is the value the
// change_background tool sets.
import type { ReactNode } from "react";

export const DEFAULT_BACKGROUND = "#f8fafc";

export function Background({ background, children }: { background: string; children: ReactNode }) {
  return (
    <div className="min-h-screen w-full transition-[background] duration-500" style={{ background }}>
      <div className="p-8 font-mono text-xs text-slate-700">background: {background}</div>
      {children}
    </div>
  );
}
