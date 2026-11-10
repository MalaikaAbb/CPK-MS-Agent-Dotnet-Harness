"use client";

// /webmcp. Both tabs are HARNESS shells around the verbatim files:
//   OrderSearch.tsx: useFrontendTool with webmcp annotations, inside the
//                    Quickstart's <Providers> (the page says "inside your existing provider").
//   webmcp.ts:       a CopilotKitCore with the same tool and no runtime.

import { useEffect, useState } from "react";
import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";
import { Providers } from "@/doc/quickstart/providers";

import { OrderSearch } from "./OrderSearch";

function ModelContextProbe() {
  const [state, setState] = useState("checking…");
  useEffect(() => {
    const mc = (document as unknown as { modelContext?: unknown }).modelContext;
    setState(
      mc
        ? "document.modelContext exists: tools registered here are visible to WebMCP browser agents."
        : "document.modelContext is undefined: this browser has no WebMCP (needs Chrome 149+ with the flag), so CopilotKit's WebMCP registration is a no-op.",
    );
  }, []);
  return <p className="bg-slate-100 px-3 py-2 text-xs">{state}</p>;
}

function CoreOnly() {
  const [msg, setMsg] = useState("webmcp.ts not loaded");
  useEffect(() => {
    // Loading the module constructs its CopilotKitCore, which registers the tool.
    import("./webmcp").then(({ copilotkit }) =>
      setMsg(`webmcp.ts loaded: CopilotKitCore created (${copilotkit ? "ok" : "missing"}).`),
    );
  }, []);
  return <p className="p-3 text-sm">{msg}</p>;
}

export default function WebMcpDemo() {
  return (
    <DemoTabs
      title="WebMCP"
      tabs={[
        {
          id: "react",
          label: "React frontend tool",
          note: "OrderSearch.tsx is verbatim. Ask the CopilotKit agent \"Find my shipped orders\". It uses the same handler a WebMCP browser agent would.",
          render: () => (
            <Providers>
              <ModelContextProbe />
              <OrderSearch />
              <div className="h-[calc(100%-2rem)]">
                <CopilotChat />
              </div>
            </Providers>
          ),
        },
        {
          id: "core",
          label: "Core only (no agent)",
          note: "webmcp.ts is verbatim. There is no provider and no runtime. Check the result in a WebMCP-capable browser's Model Context Tool Inspector.",
          render: () => (
            <>
              <ModelContextProbe />
              <CoreOnly />
            </>
          ),
        },
      ]}
    />
  );
}
