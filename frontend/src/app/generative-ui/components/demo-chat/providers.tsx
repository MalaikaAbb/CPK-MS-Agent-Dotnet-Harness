"use client";
// VERBATIM: app/providers.tsx from /generative-ui/components ("Try it", step 3, React tab).
// One HARNESS FIX: agentId (the doc names no agent → "default", which the Quickstart runtime does
// not register, README §9.3).
import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
import "@copilotkit/react-core/v2/styles.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: standardUI }}>
      {children}
    </CopilotKitProvider>
  );
}
