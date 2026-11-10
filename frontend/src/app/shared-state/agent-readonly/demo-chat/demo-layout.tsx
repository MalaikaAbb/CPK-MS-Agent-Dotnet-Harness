// HARNESS-AUTHORED. page.tsx imports ACTIVITIES and DemoLayout from "./demo-layout", which the
// /shared-state/agent-readonly page does not publish. Minimal version: editable fields for the three
// values page.tsx shares with useAgentContext, so you can change them and ask the agent about them.
export const ACTIVITIES = [
  "Viewed the Q3 revenue dashboard",
  "Edited the onboarding checklist",
  "Commented on ticket #4182",
  "Exported the customer list",
];

export function DemoLayout({
  userName,
  userTimezone,
  recentActivity,
  onUserNameChange,
  onUserTimezoneChange,
  onToggleActivity,
}: {
  userName: string;
  userTimezone: string;
  recentActivity: string[];
  onUserNameChange: (v: string) => void;
  onUserTimezoneChange: (v: string) => void;
  onToggleActivity: (activity: string) => void;
}) {
  return (
    <main className="mx-auto max-w-xl space-y-5 p-8 text-sm">
      <h1 className="text-lg font-semibold">Context the agent can read (but not change)</h1>
      <label className="block">
        Name
        <input className="mt-1 block w-full rounded border px-2 py-1" value={userName} onChange={(e) => onUserNameChange(e.target.value)} />
      </label>
      <label className="block">
        Timezone
        <input className="mt-1 block w-full rounded border px-2 py-1" value={userTimezone} onChange={(e) => onUserTimezoneChange(e.target.value)} />
      </label>
      <fieldset>
        <legend>Recent activity</legend>
        {ACTIVITIES.map((a) => (
          <label key={a} className="mt-1 flex items-center gap-2">
            <input type="checkbox" checked={recentActivity.includes(a)} onChange={() => onToggleActivity(a)} />
            {a}
          </label>
        ))}
      </fieldset>
    </main>
  );
}
