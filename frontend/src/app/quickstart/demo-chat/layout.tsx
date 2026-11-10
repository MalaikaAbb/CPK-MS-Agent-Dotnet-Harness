// HARNESS ADAPTATION of the Quickstart's app/layout.tsx. The doc's layout is the
// root layout: it renders <html>/<body>, imports
// "@copilotkit/react-core/v2/styles.css" and './globals.css', and wraps children
// in <Providers>. This app's root layout already owns <html>/<body> and imports
// the CopilotKit stylesheet, so this nested layout keeps only the part that
// matters: <Providers> around the page.
// HARNESS. Rendered per request, like every demo-chat route (see the other
// demo-chat/layout.tsx files): doc code that throws stays on this route.
export const dynamic = "force-dynamic";

import { Providers } from "@/doc/quickstart/providers";

export default function QuickstartLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
