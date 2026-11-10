// VERBATIM from the /generative-ui/tool-rendering page. (page body: lib/parse-json-result.ts)
export function parseJsonResult<T>(result: unknown): T {
  if (!result) return {} as T;

  try {
    return (typeof result === "string" ? JSON.parse(result) : result) as T;
  } catch {
    return {} as T;
  }
}
