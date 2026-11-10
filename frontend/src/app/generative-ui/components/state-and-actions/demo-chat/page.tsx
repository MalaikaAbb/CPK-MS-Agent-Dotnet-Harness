"use client";

// /generative-ui/components/state-and-actions. Each tab mounts one of the page's
// three catalogs. The surrounding cart state and layout are HARNESS-AUTHORED.

import { useMemo, useState } from "react";
import { CopilotChat, CopilotKitProvider } from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";

import { CartActions, shopUI as functionsUI } from "./functions-catalog";
import { CartState, shopUI as stateUI } from "./state-catalog";
import { shopUI as writableUI } from "./writable-catalog";

// HARNESS-AUTHORED: an in-memory cart, so bind / addToCart have something real.
function useHarnessCart() {
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: "p1", quantity: 2 },
  ]);
  return useMemo(
    () => ({
      items,
      addItem: (productId: string, quantity: number) =>
        setItems((prev) => {
          const hit = prev.find((i) => i.productId === productId);
          return hit
            ? prev.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i))
            : [...prev, { productId, quantity }];
        }),
    }),
    [items],
  );
}

function Layout({ cart, children }: { cart: { items: unknown[] }; children: React.ReactNode }) {
  return (
    <div className="grid h-full grid-cols-[1fr_420px]">
      <pre className="overflow-auto p-4 text-xs">cart (harness) = {JSON.stringify(cart.items, null, 2)}</pre>
      <div className="border-l border-slate-200">
        {children}
        <CopilotChat />
      </div>
    </div>
  );
}

function StateTab() {
  const cart = useHarnessCart();
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: stateUI }}>
      <Layout cart={cart}>
        <CartState cart={cart} />
      </Layout>
    </CopilotKitProvider>
  );
}

function FunctionsTab() {
  const cart = useHarnessCart();
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: functionsUI }}>
      <Layout cart={cart}>
        <CartActions cart={cart} />
      </Layout>
    </CopilotKitProvider>
  );
}

export default function StateAndActionsDemo() {
  return (
    <DemoTabs
      title="State and actions · CopilotKitProvider runtimeUrl=/api/copilotkit"
      tabs={[
        { id: "state", label: "App state (bind)", note: "state-catalog.tsx + CartState. The agent-rendered ProductCard's inCart comes from the cart.", render: () => <StateTab /> },
        { id: "functions", label: "Functions (addToCart)", note: "functions-catalog.tsx + CartActions. Clicking Add to cart in an agent-rendered card updates the cart on the left.", render: () => <FunctionsTab /> },
        {
          id: "writable",
          label: "Writable (CheckoutForm)",
          note: "writable-catalog.tsx. What the user types is kept across agent updates.",
          render: () => (
            <CopilotKitProvider runtimeUrl="/api/copilotkit" agentId="my_agent" /* HARNESS FIX: doc names no agent → "default", which the Quickstart runtime does not register (README §9.3) */ generativeUI={{ ui: writableUI }}>
              <CopilotChat />
            </CopilotKitProvider>
          ),
        },
      ]}
    />
  );
}
