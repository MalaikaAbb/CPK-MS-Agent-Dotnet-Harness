"use client";

// Snippets from /generative-ui/components/surfaces, verbatim unless marked HARNESS.
// The catalog is the Catalogs page's shopUI (../_shared/catalog.tsx).

import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";
import { GenerativeUISurface } from "@copilotkit/react-core/v2/generative-ui";

import { shopUI } from "../../_shared/catalog";

// ── HARNESS-AUTHORED: names the page uses but never defines ────────────────
type Product = { id: string; name: string; price: number; imageUrl: string };
const PRODUCTS: Product[] = [
  { id: "p1", name: "Trail Runner", price: 89, imageUrl: "https://placehold.co/120x80?text=Trail" },
  { id: "p2", name: "Road Racer", price: 129, imageUrl: "https://placehold.co/120x80?text=Road" },
];
function ProductRow({ products }: { products: Product[] }) {
  return (
    <div className="flex gap-3 rounded border border-dashed border-slate-300 p-3 text-sm">
      <span className="text-xs text-slate-500">fallback ProductRow (harness):</span>
      {products.map((p) => (
        <span key={p.id}>{p.name} · ${p.price}</span>
      ))}
    </div>
  );
}

// ── app/page.tsx: "Add a page target" ── (HARNESS: `export` dropped, because a Next page file may only export the page)
function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <GenerativeUISurface
      id="featured"
      ui={shopUI}
      description="The Featured Products row of the home page. When the customer asks to see products here, show them as a ProductGrid with one ProductCard for each product. When they ask for the featured products again, delete this surface."
      components={["ProductGrid", "ProductCard"]}
      fallback={<ProductRow products={products} />}
    />
  );
}

export default function SurfacesDemo() {
  const product = PRODUCTS[0]; // HARNESS: one product for the per-item target snippet
  return (
    // ── "When a component fails": provider snippet, verbatim ──
    <CopilotKitProvider
      runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */
      generativeUI={{
        ui: shopUI,
        errorBoundary: {
          onError: (info) => console.warn(info.kind, info.surfaceId, info.error.message),
          fallback: ({ retry }) => <button onClick={retry}>Try again</button>,
        },
      }}
    >
      {/* HARNESS layout: page targets on the left, chat on the right. */}
      <div className="grid h-dvh grid-cols-[1fr_420px]">
        <div className="space-y-6 overflow-auto p-6">
          <section>
            <h2 className="mb-2 text-sm font-semibold">Featured products (target &quot;featured&quot;)</h2>
            <FeaturedProducts products={PRODUCTS} />
          </section>
          <section>
            <h2 className="mb-2 text-sm font-semibold">Sidebar notes (autoScroll off)</h2>
            <GenerativeUISurface id="sidebar-notes" autoScroll={false} />
          </section>
          <section>
            <h2 className="mb-2 text-sm font-semibold">Per-item target</h2>
            <GenerativeUISurface
              key={product.id}
              id={`recommendations-${product.id}`}
              description={`The "You might also like" row under ${product.name}. Show related products here. Never include ${product.name} itself.`}
            />
          </section>
          <style>{`[data-generative-ui-surface] {
  scroll-margin-top: 6rem;
}`}</style>
        </div>
        <div className="border-l border-slate-200">
          <CopilotChat />
        </div>
      </div>
    </CopilotKitProvider>
  );
}
