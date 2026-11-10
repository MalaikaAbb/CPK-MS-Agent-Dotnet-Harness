"use client";

// HARNESS-AUTHORED. page.tsx imports PieChart and pieChartPropsSchema from "./pie-chart", which the
// /generative-ui/tool-based page does not publish. Same {title, description, data: {label, value}[]}
// shape as the bar chart (the page publishes no pie-specific schema).
import { z } from "zod";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";

export const pieChartPropsSchema = z.object({
  title: z.string().describe("Chart title"),
  description: z.string().describe("One-line description of what the chart shows"),
  data: z.array(z.object({ label: z.string(), value: z.number() })).describe("The slices to plot"),
});

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#0ea5e9", "#a855f7"];

export function PieChart({ title, description, data }: Partial<z.infer<typeof pieChartPropsSchema>>) {
  const rows = data ?? [];
  return (
    <div className="my-2 rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold">{title ?? "…"}</p>
      {description && <p className="text-xs text-slate-500">{description}</p>}
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie data={rows} dataKey="value" nameKey="label" outerRadius={80} label>
              {rows.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
