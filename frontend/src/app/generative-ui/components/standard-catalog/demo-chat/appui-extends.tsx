// VERBATIM: "Add your own components" from /generative-ui/components/standard-catalog,
// plus HARNESS-AUTHORED ProductCard and productSchema, which the snippet uses but
// never defines.
import { z } from "zod";
import { createGenerativeUI, standardUI } from "@copilotkit/react-core/v2/generative-ui";

// ── HARNESS-AUTHORED ──
const productSchema = z.object({ name: z.string(), price: z.number() });
function ProductCard({ name, price }: z.infer<typeof productSchema>) {
  return <article className="rounded border p-3">{name} · ${price}</article>;
}

// ── doc snippet ──
export const appUI = createGenerativeUI({
  id: "acme/app@1",
  extends: [standardUI],
  components: {
    ProductCard: { component: ProductCard, props: productSchema },
  },
});
