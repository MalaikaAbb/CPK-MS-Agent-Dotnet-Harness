import { notFound } from "next/navigation";

import { DocCode } from "@/components/doc-code";
import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";
import { findRoute } from "@/lib/nav-config";

/**
 * The notes page body for one tracked doc page. Each `app/<route>/page.tsx`
 * renders this with its own path, and everything shown comes from nav-config, so
 * a route cannot drift from the nav, the status page or the README. The live
 * demo is the chrome-free `app/<route>/demo-chat/` next to it.
 */
export function RouteNotes({ path }: { path: string }) {
  const route = findRoute(path);
  if (!route) notFound();

  return (
    <>
      <RouteHeader path={path} />

      {route.tryIt && (
        <TryIt prompts={route.tryIt.prompts} expect={route.tryIt.expect} fail={route.tryIt.fail} />
      )}

      {route.impl && route.impl.length > 0 && (
        <Panel
          title="This repo's implementation"
          description="Read from disk. Doc code is verbatim; harness edits and minimal stand-ins are marked HARNESS in the file."
        >
          <SourceCodeGroup files={route.impl.map((file) => ({ file }))} />
        </Panel>
      )}

      <Panel
        title="Code the doc page publishes"
        description={
          <>
            Byte-for-byte from <code>doc-snapshot/code/{route.slug}/</code>, cut
            from the page&apos;s Code tab (RSC payload). The page markdown itself is
            tracked by <code>/doc-sync</code>.
          </>
        }
      >
        <DocCode slug={route.slug} />
      </Panel>
    </>
  );
}
