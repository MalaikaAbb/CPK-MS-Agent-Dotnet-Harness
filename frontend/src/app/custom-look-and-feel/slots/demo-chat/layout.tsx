// HARNESS. Demo routes render per request, never prerendered at build time.
// Several demos run doc code that throws by design (missing imports, a hook in a
// Server Component). That failure belongs on this route, in the browser, not in
// `next build`, where it would take every other route down with it.
export const dynamic = "force-dynamic";

export default function DemoChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
