import Link from "next/link";

import { BackendHealth } from "@/components/backend-health";
import { DocDriftPanel } from "@/components/doc-drift-panel";
import { DocSyncedAt } from "@/components/doc-synced-at";
import { StatusBadge } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";
import { ALL_ROUTES, DOCS_ROOT, NAV } from "@/lib/nav-config";

export const dynamic = "force-dynamic";

export default function Home() {
  const pages = ALL_ROUTES.filter((r) => r.path !== "/doc-sync");
  const counts = pages.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <header className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-semibold tracking-tight">
          CopilotKit + MS Agent Harness (.NET) Test Suite
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          One route per page of{" "}
          <a className="underline" href={DOCS_ROOT} target="_blank" rel="noreferrer">
            {DOCS_ROOT}
          </a>
          . Where a page&apos;s code can run, it runs as published. Where it
          cannot, the route says exactly why and shows the code instead.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Doc-sync date <DocSyncedAt /> · {pages.length} pages · {counts.working ?? 0} working ·{" "}
          {counts.partial ?? 0} partial · {counts.broken ?? 0} broken (reference-only)
        </p>
      </header>

      <Panel title="Connection check">
        <BackendHealth />
      </Panel>

      <DocDriftPanel />

      <Callout tone="warn" title="What runs, in one paragraph">
        The docs publish complete .NET code for two servers: the Quickstart
        (<code>MyAgent</code>, :8000) and Agent App Context (:8001). Every other
        page&apos;s Code tab points at a showcase <code>Program.cs</code> that
        references about 20 unpublished classes, and at per-feature agents built
        with <code>AsHarnessAgent</code> from a NuGet package no page installs.
        Those routes are reference-only. Demos whose agent id routes to backend{" "}
        <code>/</code>, and frontend-only snippets, run against{" "}
        <code>MyAgent</code>.
      </Callout>

      {NAV.map((g) => (
        <Panel key={g.title} title={g.title}>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {g.routes.map((r) => (
              <li key={r.path} className="flex items-center justify-between gap-3 py-2">
                <Link href={r.path} className="text-sm text-slate-800 hover:underline dark:text-slate-200">
                  {r.title}
                </Link>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </>
  );
}
