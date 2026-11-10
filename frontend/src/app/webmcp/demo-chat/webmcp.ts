// VERBATIM: webmcp.ts ("WebMCP only, with no agent") from /webmcp, plus a HARNESS stub at the bottom.
import { CopilotKitCore } from "@copilotkit/core";
import { z } from "zod";

export const copilotkit = new CopilotKitCore({
  tools: [
    {
      name: "searchOrders",
      description: "Search the signed-in user's orders by status",
      parameters: z.object({
        status: z.enum(["open", "shipped", "delivered"]),
      }),
      handler: async ({ status }) => {
        const orders = await searchOrders(status);
        return JSON.stringify(orders);
      },
      webmcp: {
        annotations: {
          readOnlyHint: true,
        },
      },
    },
  ],
});

// ── HARNESS-AUTHORED: the snippet calls searchOrders(status) but never defines it ──
async function searchOrders(status: "open" | "shipped" | "delivered") {
  const all = [
    { id: "A-1001", status: "open", total: 42 },
    { id: "A-1002", status: "shipped", total: 18.5 },
    { id: "A-1003", status: "delivered", total: 99 },
  ];
  return all.filter((o) => o.status === status);
}
