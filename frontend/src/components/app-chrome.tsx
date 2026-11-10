"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ALL_ROUTES } from "@/lib/nav-config";

import { NavSidebar } from "./nav-sidebar";

/**
 * `…/demo-chat` routes (and their `…/demo-chat/<variant>` siblings) render with no harness chrome, exactly as the doc page's
 * code lays them out. They only get a small pill linking back to the notes page.
 * Everything else gets the sidebar layout.
 *
 * There is deliberately no CopilotKit provider here. Nearly every doc demo mounts
 * its own <CopilotKit>/<CopilotKitProvider>, so each demo route mounts exactly
 * the provider its page shows. That also keeps one Inspector per page.
 */
export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";

  if (/\/demo-chat(\/|$)/.test(pathname)) {
    const notes = ALL_ROUTES.filter((r) =>
      r.demos?.some((d) => pathname === d.href),
    )[0];
    return (
      <>
        {children}
        {notes && (
          <Link
            href={notes.path}
            className="harness-notes-pill fixed bottom-3 left-3 z-[2147483000] rounded-full border border-slate-300 bg-white/90 px-3 py-1 text-xs text-slate-600 shadow-sm backdrop-blur hover:text-slate-900"
          >
            ← Notes: {notes.title}
          </Link>
        )}
      </>
    );
  }

  return (
    <>
      <NavSidebar />
      <main className="lg:pl-72">
        <div className="mx-auto max-w-5xl space-y-6 px-5 py-10 lg:px-8">
          {children}
        </div>
      </main>
    </>
  );
}
