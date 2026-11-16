// "Run your code on a click" from /generative-ui/components/state-and-actions.
// The catalog, CartActions and ProductCard snippets are verbatim. Imports and the
// Cart class (with addItem) are HARNESS-AUTHORED.
import { useState } from "react";
import { z } from "zod";
import {
  createGenerativeUI,
  useGenerativeUIFunction,
  type GenerativeUIComponentProps,
} from "@copilotkit/react-core/v2/generative-ui";

// ── HARNESS-AUTHORED ──
export type Cart = { items: { productId: string; quantity: number }[]; addItem: (productId: string, quantity: number) => void };

// ── app/catalog.tsx snippet ──
export const shopUI = createGenerativeUI({
  id: "acme/shop@1",
  functions: {
    addToCart: {
      description: "Add a product to the cart",
      parameters: z.object({ productId: z.string(), quantity: z.number().default(1) }),
    },
  },
  components: {
    ProductCard: {
      component: ProductCard,
      props: z.object({ productId: z.string(), name: z.string() }),
      events: { onAddToCart: {} },
    },
  },
});

// ── CartActions snippet (HARNESS: exported so the page can mount it) ──
export function CartActions({ cart }: { cart: Cart }) {
  useGenerativeUIFunction(shopUI, "addToCart", ({ productId, quantity }) => {
    cart.addItem(productId, quantity);
    return { added: productId };
  });
  return null;
}

// ── ProductCard snippet ──
function ProductCard({ productId, name, onAddToCart }: GenerativeUIComponentProps<typeof shopUI, "ProductCard">) {
  const [error, setError] = useState<string>();
  return (
    <article>
      <h4>{name}</h4>
      <button
        onClick={async () => {
          const result = await onAddToCart?.({ productId });
          if (result) setError(result.ok ? undefined : result.error.message);
        }}
      >
        Add to cart
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </article>
  );
}
