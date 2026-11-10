"use client";

// /generative-ui/your-components/display-only, inside the Quickstart's <Providers>.

import { CopilotChat, useComponent } from "@copilotkit/react-core/v2";
import { z } from "zod";

import { Providers } from "@/doc/quickstart/providers";

import { YourMainContent } from "./weather";

// HARNESS-AUTHORED: the scoping snippet renders ProfileCard but never defines it.
function ProfileCard({ userId }: { userId: string }) {
  return <div className="rounded border p-3">Profile {userId} (harness stand-in)</div>;
}

// HARNESS wrapper around the two fragment snippets ("Without parameters" and
// "Scoping to an agent"), both verbatim inside.
function MoreComponents() {
  useComponent({
    name: "showGreeting",
    render: ({ message }: { message: string }) => (
      <div className="rounded border p-3 bg-blue-50">
        <p>{message}</p>
      </div>
    ),
  });
  useComponent({
    name: "renderProfile",
    parameters: z.object({ userId: z.string() }),
    render: ProfileCard,
    agentId: "support-agent",
  });
  return null;
}

export default function DisplayOnlyDemo() {
  return (
    <Providers>
      <YourMainContent />
      <MoreComponents />
      <div className="h-dvh">
        <CopilotChat />
      </div>
    </Providers>
  );
}
