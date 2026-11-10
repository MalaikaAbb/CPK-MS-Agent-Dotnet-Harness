"use client";

// /generative-ui/your-components/interactive. The snippet's `Page` is mounted
// inside the Quickstart's <Providers>, next to a chat (HARNESS shell).

import { CopilotChat } from "@copilotkit/react-core/v2";

import { Providers } from "@/doc/quickstart/providers";

import { Page as ApprovedCommand } from "./approved-command";

export default function InteractiveDemo() {
  return (
    <Providers>
      {/* @ts-expect-error HARNESS: kept as published. The snippet's Page elides its JSX ("// ...") and returns nothing, so TS rejects it as a component. React renders nothing for it, and the hook still registers. */}
      <ApprovedCommand />
      <div className="h-dvh">
        <CopilotChat />
      </div>
    </Providers>
  );
}
