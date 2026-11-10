import { probeAgents } from "@/lib/health";

import { RecheckButton } from "./recheck-button";

/** Server component: probes both agent servers during render. */
export async function BackendHealth() {
  const probes = await probeAgents();
  const intelligence = Boolean(process.env.CPK_INTELLIGENCE_API_KEY);

  const rows = [
    ...probes.map((p) => ({ ok: p.ok, label: p.name, detail: `${p.url}: ${p.detail}` })),
    {
      ok: intelligence,
      label: "CPK_INTELLIGENCE_API_KEY",
      detail: intelligence
        ? "Set. The Quickstart runtime at /api/copilotkit can reach Intelligence."
        : "Not set. The Quickstart runtime constructs CopilotKitIntelligence with an undefined key, so its routes will fail.",
    },
  ];

  return (
    <div>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.label} className="flex items-start gap-3">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${r.ok ? "bg-emerald-500" : "bg-rose-500"}`}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{r.label}</p>
              <p className="break-words text-xs text-slate-500 dark:text-slate-400">{r.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <RecheckButton />
    </div>
  );
}
