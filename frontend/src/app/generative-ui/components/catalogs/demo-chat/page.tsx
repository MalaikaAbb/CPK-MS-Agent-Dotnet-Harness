"use client";

// Snippets from /generative-ui/components/catalogs. shopUI is the page's
// app/catalog.tsx, verbatim (../_shared/catalog.tsx).

import { useMemo } from "react";
import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { exportA2UICatalog } from "@copilotkit/react-core/v2/generative-ui";

import { shopUI } from "../../_shared/catalog";

export default function CatalogsDemo() {
  // "Export the catalog for other A2UI tools": the doc call is
  // exportA2UICatalog(appUI, { title: "Acme app" }) followed by fs.writeFileSync.
  // HARNESS: appUI is never defined, and fs is Node-only, so this demo exports the
  // page's shopUI and renders the JSON instead of writing a file.
  const catalog = useMemo(() => exportA2UICatalog(shopUI, { title: "Acme app" }), []);

  return (
    // ── "Then give it to the provider": verbatim ──
    <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: shopUI }}>
      <div className="grid h-dvh grid-cols-[1fr_420px]">
        <pre className="overflow-auto bg-slate-950 p-4 text-[11px] text-slate-100">
          {"// exportA2UICatalog(shopUI, { title: \"Acme app\" })\n"}
          {JSON.stringify(catalog, null, 2)}
        </pre>
        <div className="border-l border-slate-200">
          <CopilotChat />
        </div>
      </div>
    </CopilotKitProvider>
  );
}
