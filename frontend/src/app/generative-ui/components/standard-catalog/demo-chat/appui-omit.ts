// VERBATIM: "Drop components" from /generative-ui/components/standard-catalog.
// The snippet has no imports; HARNESS supplies the same import line as the page's
// other snippets.
import { createGenerativeUI, standardUI } from "@copilotkit/react-core/v2/generative-ui";

export const appUI = createGenerativeUI({
  id: "acme/app@1",
  extends: [standardUI.omit(["Map", "Video", "HtmlView"])],
  components: {},
});
