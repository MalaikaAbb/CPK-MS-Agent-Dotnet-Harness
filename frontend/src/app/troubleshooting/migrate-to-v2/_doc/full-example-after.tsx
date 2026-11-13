// VERBATIM: "Full Example → After" from /troubleshooting/migrate-to-v2. Reference material in a
// private `_doc/` folder: type-checked (proves the v2 imports resolve on this repo's pins), never
// routed or mounted. `YourApp` is a placeholder the page never defines.
import { CopilotKit, CopilotPopup } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";

export function App() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      {/* @ts-expect-error YourApp is a placeholder the doc page never defines */}
      <YourApp />
      <CopilotPopup />
    </CopilotKit>
  );
}
