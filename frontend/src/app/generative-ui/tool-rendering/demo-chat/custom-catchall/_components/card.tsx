// HARNESS-AUTHORED. custom-catchall-renderer.tsx imports these from "./_components/card", which the
// /generative-ui/tool-rendering page does not publish. Minimal shadcn-style containers.
import type { HTMLAttributes } from "react";

type Div = HTMLAttributes<HTMLDivElement>;
export const Card = ({ className = "", ...p }: Div) => (
  <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`} {...p} />
);
export const CardHeader = ({ className = "", ...p }: Div) => <div className={`p-4 pb-2 ${className}`} {...p} />;
export const CardTitle = ({ className = "", ...p }: Div) => <div className={`text-sm font-semibold ${className}`} {...p} />;
export const CardDescription = ({ className = "", ...p }: Div) => <div className={`text-xs text-slate-500 ${className}`} {...p} />;
export const CardContent = ({ className = "", ...p }: Div) => <div className={`p-4 pt-0 ${className}`} {...p} />;
