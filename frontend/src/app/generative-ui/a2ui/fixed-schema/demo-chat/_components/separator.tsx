// HARNESS-AUTHORED. renderers.tsx imports Separator from "./separator" (not published).
import type { HTMLAttributes } from "react";

export function Separator({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" className={`h-px ${className}`} {...props} />;
}
