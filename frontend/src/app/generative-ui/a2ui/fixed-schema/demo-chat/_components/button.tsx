// HARNESS-AUTHORED. The Fixed Schema page's renderers.tsx imports Button (as UIButton) from
// "../_components/button", which no doc page publishes. Minimal styled <button>.
import type { ButtonHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 ${className}`}
      {...props}
    />
  );
}
