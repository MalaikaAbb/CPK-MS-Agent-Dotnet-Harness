"use client";

// HARNESS-AUTHORED. page.tsx imports BarChart and barChartPropsSchema from "./bar-chart", which the
// /generative-ui/tool-based page does not publish. The props follow what the page's own ChartAgent.cs
// prompt asks the model to send: "a concise title, description, and data array of {label, value}
// items". The page says its example bar chart uses Recharts.
import { z } from "zod";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const barChartPropsSchema = z.object({
  title: z.string().describe("Chart title"),
  description: z.string().describe("One-line description of what the chart shows"),
  data: z.array(z.object({ label: z.string(), value: z.number() })).describe("The values to plot"),
});

export function BarChart({ title, description, data }: Partial<z.infer<typeof barChartPropsSchema>>) {
  return (
    <div className="my-2 rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold">{title ?? "…"}</p>
      {description && <p className="text-xs text-slate-500">{description}</p>}
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
