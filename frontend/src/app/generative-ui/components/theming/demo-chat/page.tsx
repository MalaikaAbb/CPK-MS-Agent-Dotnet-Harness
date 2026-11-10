"use client";

// Snippets from /generative-ui/components/theming. Provider lines are verbatim.
// The surrounding <CopilotChat /> and tab layout are HARNESS-AUTHORED.

import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI, type GenerativeUITheme } from "@copilotkit/react-core/v2/generative-ui";

import { DemoTabs } from "@/components/demo-tabs";

// ── "To type a theme in its own file" snippet, verbatim (HARNESS: not exported, page file) ──
const theme: GenerativeUITheme = { "--a2ui-color-accent": "#d97706" };

export default function ThemingDemo() {
  return (
    <DemoTabs
      title="Theming · CopilotKitProvider runtimeUrl=/api/copilotkit"
      tabs={[
        {
          id: "theme",
          label: "theme option",
          note: "First snippet, verbatim.",
          render: () => (
            <CopilotKitProvider
              runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */
              generativeUI={{
                ui: standardUI,
                theme: {
                  "--a2ui-color-accent": "#d97706",
                  "--a2ui-font-family": "Inter, sans-serif",
                  "--a2ui-radius-md": "10px",
                },
              }}
            >
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
        {
          id: "typed",
          label: "GenerativeUITheme",
          note: "The typed theme constant, passed as theme.",
          render: () => (
            <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: standardUI, theme }}>
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
        {
          id: "dark",
          label: "dark overrides",
          note: "\"Colors for each mode\" theme fragment, verbatim. The wrapper div adds class=\"dark\" (HARNESS) so the dark values apply.",
          render: () => (
            <div className="dark h-full bg-slate-900">
              <CopilotKitProvider
                runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */
                generativeUI={{
                  ui: standardUI,
                  theme: {
                    "--a2ui-color-accent": "#d97706",
                    dark: {
                      "--a2ui-color-panel": "#1f2937",
                      "--a2ui-color-surface": "#111827",
                    },
                  },
                }}
              >
                <CopilotChat />
              </CopilotKitProvider>
            </div>
          ),
        },
        {
          id: "map",
          label: "mapStyle",
          note: "\"The map\" theme fragment, verbatim. tiles.example.com does not exist, so a Map surface cannot load tiles (and maplibre-gl is not installed, so Map shows a list).",
          render: () => (
            <CopilotKitProvider
              runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */
              generativeUI={{
                ui: standardUI,
                theme: {
                  mapStyle: "https://tiles.example.com/light.json",
                  dark: { mapStyle: "https://tiles.example.com/dark.json" },
                },
              }}
            >
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
        {
          id: "css",
          label: "CSS variables",
          note: "\"Set variables in CSS\", verbatim, injected with a <style> tag.",
          render: () => (
            <>
              <style>{`.a2ui-surface {
  --a2ui-color-accent: #d97706;
}`}</style>
              <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: standardUI }}>
                <CopilotChat />
              </CopilotKitProvider>
            </>
          ),
        },
      ]}
    />
  );
}
