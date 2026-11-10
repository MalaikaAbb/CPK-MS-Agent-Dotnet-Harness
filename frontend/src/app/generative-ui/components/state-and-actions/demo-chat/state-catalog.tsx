// "Show live app state" from /generative-ui/components/state-and-actions.
// The two snippets are verbatim. Imports, the Cart type, and ProductCard (which the
// page never shows for this catalog) are HARNESS-AUTHORED.
import { z } from "zod";
import {
  createGenerativeUI,
  useGenerativeUIState,
  type GenerativeUIComponentProps,
} from "@copilotkit/react-core/v2/generative-ui";

// ── HARNESS-AUTHORED ──
export type Cart = { items: { productId: string; quantity: number }[] };
function ProductCard({ productId, name, inCart }: GenerativeUIComponentProps<typeof shopUI, "ProductCard">) {
  return <article className="rounded border p-3">{name} ({productId}) · in cart: {inCart}</article>;
}

// ── app/catalog.tsx snippet ──
const cartSchema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number() })),
});

export const shopUI = createGenerativeUI({
  id: "acme/shop@1",
  state: { cart: cartSchema },
  components: {
    ProductCard: {
      component: ProductCard,
      props: z.object({ productId: z.string(), name: z.string(), inCart: z.number() }),
      bind: {
        inCart: (state, { productId }) =>
          state.cart.items.find((item) => item.productId === productId)?.quantity ?? 0,
      },
    },
  },
});

// ── CartState snippet (HARNESS: exported so the page can mount it) ──
export function CartState({ cart }: { cart: Cart }) {
  useGenerativeUIState(shopUI, "cart", { items: cart.items });
  return null;
}
