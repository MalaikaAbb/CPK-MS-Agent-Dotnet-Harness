"use client";

// /generative-ui/a2ui/styling. The page says to import its theme file in the layout
// (import "@/a2ui/theme.css"). HARNESS: that import was tried, and it FAILS
// `next build` for the whole app, because the page's dark-mode block is invalid
// CSS ("Invalid empty selector" at `.dark .a2ui-surface, @media …`). The same
// verbatim file (src/doc/a2ui/theme.css, copied to public/doc/a2ui-theme.css) is
// loaded with a <link> instead, so the browser drops the invalid rule and keeps
// the rest, which is how the published CSS behaves once it gets past a bundler.
// The surface uses the same provider-catalog setup as /demo/generative-ui/a2ui
// (Quickstart provider props variant).

import { CopilotChat, CopilotKit } from "@copilotkit/react-core/v2";

import { myCatalog } from "@/doc/a2ui/catalog";


export default function A2uiStylingDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent" useSingleEndpoint={false} a2ui={{ catalog: myCatalog }}>
      <link rel="stylesheet" href="/doc/a2ui-theme.css" />
      <div className="h-dvh">
        <CopilotChat />
      </div>
    </CopilotKit>
  );
}
