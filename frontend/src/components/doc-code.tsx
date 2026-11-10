import { readDocCode } from "@/lib/doc-code";

import { CodeFigure } from "./code-figure";

/**
 * Every code block the doc page publishes, verbatim from doc-snapshot/. The demo
 * Code tab comes first, then the page's own snippets in page order. Each is
 * collapsed by default, because the showcase Program.cs and route.ts are long.
 */
export async function DocCode({ slug }: { slug: string }) {
  const files = await readDocCode(slug);
  if (files.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No code blocks were extracted for this page. See{" "}
        <code>doc-snapshot/pages/{slug}*.md</code>.
      </p>
    );
  }

  const groups = [
    { key: "code-tab", title: "Demo Code tab", items: files.filter((f) => f.group === "code-tab") },
    { key: "page", title: "Snippets in the page body", items: files.filter((f) => f.group === "page") },
  ] as const;

  return (
    <div className="space-y-6">
      {groups.map(
        (g) =>
          g.items.length > 0 && (
            <div key={g.key}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {g.title} · {g.items.length}
              </h3>
              <div className="space-y-2">
                {g.items.map((f) => (
                  <details
                    key={f.label}
                    className="rounded-lg border border-slate-200 dark:border-slate-800"
                  >
                    <summary className="cursor-pointer px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                      <code>{f.label}</code>{" "}
                      <span className="text-xs text-slate-400">
                        {f.code.split("\n").length} lines
                      </span>
                    </summary>
                    <div className="p-2">
                      <CodeFigure code={f.code} caption={f.label} language={f.language} />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  );
}
