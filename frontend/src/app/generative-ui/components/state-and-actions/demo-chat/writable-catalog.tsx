// "Keep what the user types" from /generative-ui/components/state-and-actions.
// The catalog entry and the CheckoutForm component are verbatim. The page shows
// only the entry, so the createGenerativeUI wrapper around it is HARNESS-AUTHORED.
import { z } from "zod";
import {
  createGenerativeUI,
  type GenerativeUIComponentProps,
} from "@copilotkit/react-core/v2/generative-ui";

// ── doc snippet ──
function CheckoutForm({ email, setEmail }: GenerativeUIComponentProps<typeof shopUI, "CheckoutForm">) {
  return <input value={email ?? ""} onChange={(event) => setEmail(event.target.value)} />;
}

export const shopUI = createGenerativeUI({
  id: "acme/shop@1",
  components: {
    // ── doc snippet ──
    CheckoutForm: {
      component: CheckoutForm,
      props: z.object({ email: z.string().optional() }),
      writable: ["email"],
    },
  },
});
