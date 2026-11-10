// HARNESS-AUTHORED. renderers.tsx imports Badge from "./badge" (not published) and uses
// variant "outline" | "secondary". Minimal pill.
import type { HTMLAttributes } from "react";

const VARIANTS = {
  default: "bg-neutral-900 text-white",
  secondary: "bg-neutral-100 text-neutral-800",
  outline: "border border-neutral-300 text-neutral-800",
} as const;

export function Badge({
  variant = "default",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof VARIANTS }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${VARIANTS[variant]} ${className}`} {...props} />
  );
}
