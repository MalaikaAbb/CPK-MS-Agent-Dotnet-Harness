// HARNESS-AUTHORED. custom-catchall-renderer.tsx imports Badge from "./_components/badge", which the
// /generative-ui/tool-rendering page does not publish. Minimal pill with the variants the renderer uses.
import type { HTMLAttributes } from "react";

const VARIANTS: Record<string, string> = {
  default: "bg-slate-900 text-white",
  secondary: "bg-slate-100 text-slate-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  destructive: "bg-rose-100 text-rose-800",
};

export function Badge({
  variant = "default",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${VARIANTS[variant] ?? VARIANTS.default} ${className}`}
      {...props}
    />
  );
}
