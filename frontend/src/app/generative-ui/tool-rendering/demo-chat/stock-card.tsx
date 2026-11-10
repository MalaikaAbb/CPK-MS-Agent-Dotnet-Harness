// HARNESS-AUTHORED. page.tsx imports StockCard from "./stock-card", which the /generative-ui/tool-rendering
// page does not publish. Minimal card for the props page.tsx passes: loading, ticker, priceUsd, changePct.
export function StockCard({
  loading,
  ticker,
  priceUsd,
  changePct,
}: {
  loading: boolean;
  ticker: string;
  priceUsd?: number;
  changePct?: number;
}) {
  return (
    <div className="my-2 rounded-xl border border-slate-200 bg-white p-4 text-sm">
      <p className="font-semibold">{ticker || "…"}</p>
      {loading ? (
        <p className="text-slate-500">Fetching price…</p>
      ) : (
        <p>
          ${priceUsd ?? "?"}{" "}
          {typeof changePct === "number" && (
            <span className={changePct >= 0 ? "text-emerald-600" : "text-rose-600"}>
              ({changePct >= 0 ? "+" : ""}
              {changePct}%)
            </span>
          )}
        </p>
      )}
    </div>
  );
}
