"use client";

// Snippets from /generative-ui/components/standard-catalog. Each tab mounts the
// page's provider line, verbatim, around a HARNESS <CopilotChat /> to talk through.

import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoTabs } from "@/components/demo-tabs";

import { appUI as extendsUI } from "./appui-extends";
import { appUI as omitUI } from "./appui-omit";
import { appUI as overridesUI } from "./appui-overrides";

export default function StandardCatalogDemo() {
  return (
    <DemoTabs
      title={`Standard catalog · CopilotKitProvider runtimeUrl=/api/copilotkit (no agentId → "default")`}
      tabs={[
        {
          id: "as-is",
          label: "standardUI",
          note: "Verbatim: <CopilotKitProvider runtimeUrl=\"/api/copilotkit\" generativeUI={{ ui: standardUI }}>.",
          render: () => (
            <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: standardUI }}>
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
        {
          id: "extends",
          label: "extends + ProductCard",
          note: "appui-extends.tsx. ProductCard and productSchema are HARNESS-authored.",
          render: () => (
            <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: extendsUI }}>
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
        {
          id: "omit",
          label: "omit Map/Video/HtmlView",
          note: "appui-omit.ts, verbatim.",
          render: () => (
            <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: omitUI }}>
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
        {
          id: "overrides",
          label: "overrides Card → MyCard",
          note: "appui-overrides.tsx, verbatim.",
          render: () => (
            <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: overridesUI }}>
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
      ]}
    />
  );
}
