import "server-only";

/**
 * Reachability of the two .NET AG-UI servers. Neither doc Program.cs maps a
 * health route, so any HTTP response counts as "up". MapAGUIServer only
 * accepts POST, so a GET normally answers 404/405, which is fine here.
 */

export interface Probe {
  name: string;
  url: string;
  ok: boolean;
  detail: string;
}

export const AGENTS = [
  { name: "Quickstart MyAgent (backend/quickstart/)", url: "http://localhost:8000/" },
  { name: "Agent App Context server (backend/agent-app-context/)", url: "http://localhost:8001/" },
];

export async function probeAgents(): Promise<Probe[]> {
  return Promise.all(
    AGENTS.map(async ({ name, url }) => {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(3000), cache: "no-store" });
        return { name, url, ok: true, detail: `answered HTTP ${res.status}` };
      } catch (error) {
        return {
          name,
          url,
          ok: false,
          detail: `unreachable: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
    }),
  );
}
