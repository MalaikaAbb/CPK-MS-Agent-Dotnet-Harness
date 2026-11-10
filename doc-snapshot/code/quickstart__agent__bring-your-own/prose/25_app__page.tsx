"use client";

// [!code highlight:1]
import { CopilotSidebar } from "@copilotkit/react-core/v2";

export default function Page() {
  return (
    <main>
      {/* [!code highlight:6] */}
      <CopilotSidebar
        labels={{
          modalHeaderTitle: "Your Assistant",
          welcomeMessageText: "Hi! How can I help you today?",
        }}
      />
      <h1>Your App</h1>
    </main>
  );
}
