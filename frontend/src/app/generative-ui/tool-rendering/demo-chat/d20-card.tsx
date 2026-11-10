// HARNESS-AUTHORED. page.tsx imports D20Card from "./d20-card", which the /generative-ui/tool-rendering
// page does not publish. Minimal card for the props page.tsx passes: loading, value.
export function D20Card({ loading, value }: { loading: boolean; value?: number }) {
  return (
    <div className="my-2 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm">
      <span aria-hidden>🎲</span>
      {loading ? "Rolling…" : `Rolled ${value ?? "?"}`}
    </div>
  );
}
