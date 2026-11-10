"use client";

// Page-body snippets from /custom-look-and-feel/css, verbatim unless marked HARNESS.
// Every tab runs inside the Quickstart's <Providers> (my_agent on /api/copilotkit).

import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";
import { Providers } from "@/doc/quickstart/providers";

import "./globals.css";

// HARNESS-AUTHORED: the icons snippet uses these two components but never
// defines them. Minimal visible stand-ins.
const YourOpenIconComponent = () => <span aria-label="open">🟢</span>;
const YourCloseIconComponent = () => <span aria-label="close">🔴</span>;

function CssPropertiesSnippet() {
  return (
    <div
      style={
        {
          "--copilot-kit-primary-color": "#222222",
        } as CopilotKitCSSProperties
      }
    >
      {/* @ts-expect-error HARNESS: kept as published. The snippet renders CopilotSidebar but never imports it, so this throws a ReferenceError. */}
      <CopilotSidebar />
    </div>
  );
}

export default function CssSnippetsDemo() {
  return (
    <DemoTabs
      title="CSS Customization · page snippets · Quickstart <Providers> (my_agent)"
      tabs={[
        {
          id: "globals",
          label: "globals.css (tokens + classes + fonts)",
          note: "The three globals.css blocks are loaded on this route. Expect the v2 tokens to apply. The .copilotKit* class selectors only match where the v2 components still emit those classes.",
          render: () => (
            <Providers>
              <div className="h-full">
                <CopilotChat />
              </div>
            </Providers>
          ),
        },
        {
          id: "css-properties",
          label: "CopilotKitCSSProperties (v1)",
          note: "Verbatim. It imports the type from the deprecated v1 @copilotkit/react-ui and renders an unimported <CopilotSidebar />, so expect a ReferenceError.",
          render: () => (
            <Providers>
              <CssPropertiesSnippet />
            </Providers>
          ),
        },
        {
          id: "icons",
          label: "icons",
          note: "Verbatim, with HARNESS stand-ins for the two undefined icon components.",
          render: () => (
            <Providers>
              <div className="h-full">
                <CopilotChat
                  // @ts-expect-error HARNESS: doc type error kept. `icons` is not a prop of the v2 CopilotChat.
                  icons={{
                    openIcon: <YourOpenIconComponent />,
                    closeIcon: <YourCloseIconComponent />,
                  }}
                />
              </div>
            </Providers>
          ),
        },
        {
          id: "labels",
          label: "labels",
          note: "Verbatim.",
          render: () => (
            <Providers>
              <div className="h-full">
                <CopilotChat
                  labels={{
                    welcomeMessageText: "Hello! How can I help you today?",
                    modalHeaderTitle: "My Copilot",
                    chatInputPlaceholder: "Ask me anything!",
                  }}
                />
              </div>
            </Providers>
          ),
        },
      ]}
    />
  );
}
