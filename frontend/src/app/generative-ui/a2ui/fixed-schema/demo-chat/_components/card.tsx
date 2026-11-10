// HARNESS-AUTHORED. renderers.tsx imports Card from "./card" (not published). Minimal div.
import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-xl border border-neutral-200 bg-white shadow-sm ${className}`} {...props} />;
}
