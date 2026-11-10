// HARNESS-AUTHORED. The Dynamic Schema page's renderers.tsx imports Badge from
// "../_components/badge", which no doc page publishes. Minimal pill with the four
// variants the renderer passes (error / warning / success / info).
import type { HTMLAttributes } from "react";

const TONES = {
  error: "bg-rose-100 text-rose-800",
  warning: "bg-amber-100 text-amber-800",
  success: "bg-emerald-100 text-emerald-800",
  info: "bg-sky-100 text-sky-800",
} as const;

export function Badge({
  variant = "info",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof TONES }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TONES[variant]} ${className}`}
      {...props}
    />
  );
}
