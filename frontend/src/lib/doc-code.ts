import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { REPO_ROOT } from "./source";

/**
 * Reads the verbatim code blocks cut from one doc page by tools/doc-sync.
 *
 * doc-snapshot/code/<slug>/codetab[N]/<file path>  the demo's Code tab files
 *                                                  (codetab2 etc. for a second demo)
 * doc-snapshot/code/<slug>/prose/NN_<title>        every other code block, in page order
 */

export interface DocCodeFile {
  group: "code-tab" | "page";
  /** File path for Code-tab files, block title (or "snippet") for page blocks. */
  label: string;
  code: string;
  language: string;
}

function languageOf(label: string, code: string): string {
  const l = label.toLowerCase();
  if (l.includes("csharp") || l.endsWith(".cs")) return "csharp";
  if (l.endsWith(".py") || l.includes("main.py")) return "python";
  if (l.endsWith(".css")) return "css";
  if (l.endsWith(".json")) return "json";
  if (l.endsWith(".tsx") || l.endsWith(".ts") || l.includes("typescript")) return "tsx";
  if (/^\s*(using |namespace |public |private const)/m.test(code)) return "csharp";
  if (/^\s*(from \S+ import|import \S+$|def |class \w+\(|async def )/m.test(code)) return "python";
  if (/^\s*(npm|npx|dotnet|cd|uv|pnpm|yarn|bun) /m.test(code)) return "bash";
  if (/^\s*[{[]/.test(code) && !/[;<]/.test(code.slice(0, 80))) return "json";
  if (/[.#[][\w-]+[^{]*\{[^}]*--?[\w-]+\s*:/.test(code)) return "css";
  return "tsx";
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

export async function readDocCode(slug: string): Promise<DocCodeFile[]> {
  const base = path.join(REPO_ROOT, "doc-snapshot", "code", slug);
  const files = (await walk(base)).sort();
  const result: DocCodeFile[] = [];

  for (const file of files) {
    const rel = path.relative(base, file);
    const [top, ...rest] = rel.split(path.sep);
    const code = (await readFile(file, "utf8")).replace(/\n+$/, "");
    if (top.startsWith("codetab")) {
      const label = rest.join("/") + (top === "codetab" ? "" : `  (demo ${top.slice(7)})`);
      result.push({ group: "code-tab", label, code, language: languageOf(label, code) });
    } else {
      const raw = rest.join("/");
      const title = raw
        .replace(/^\d+_/, "")
        .replace(/__/g, "/")
        .replace(/\s*\[CODE-TAB\]$/, "")
        .replace(/^(typescript|csharp|css)\s*$/, "region of the Code tab ($1)");
      result.push({ group: "page", label: `#${raw.slice(0, 2)} ${title}`, code, language: languageOf(raw, code) });
    }
  }
  return result;
}
