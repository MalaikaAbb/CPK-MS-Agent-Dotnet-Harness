// VERBATIM: "onAction interceptor" from /generative-ui/a2ui/advanced. HARNESS: `export` added so the page can mount it.
import {
  createA2UIMessageRenderer,
  type A2UIUserAction,
} from "@copilotkit/react-core/v2";
import { theme } from "./theme";

export const A2UIMessageRenderer = createA2UIMessageRenderer({
  theme,
  onAction: (action: A2UIUserAction) => {
    if (action.name === "book_flight") {
      console.info("Booking requested", action.context);
      return null;
    }
    return undefined;
  },
});
