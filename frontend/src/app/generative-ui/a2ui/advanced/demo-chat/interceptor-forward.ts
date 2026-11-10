// VERBATIM: "Forward a modified action" from /generative-ui/a2ui/advanced. The
// snippet has no imports. HARNESS supplies the same import lines as the previous snippet, plus `export`.
import { createA2UIMessageRenderer } from "@copilotkit/react-core/v2";
import { theme } from "./theme";

export const A2UIMessageRenderer = createA2UIMessageRenderer({
  theme,
  onAction: (action) => {
    if (action.name !== "book_flight") return;

    return {
      ...action,
      context: {
        ...(action.context ?? {}),
        source: "a2ui",
      },
    };
  },
});
