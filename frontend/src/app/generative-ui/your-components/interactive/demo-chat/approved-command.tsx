"use client"; // HARNESS: added (the snippet uses a hook).
// VERBATIM otherwise: page.tsx from /generative-ui/your-components/interactive.
import { useHumanInTheLoop } from "@copilotkit/react-core/v2";
import { z } from "zod";

export function Page() {
  // ...

  useHumanInTheLoop({
    name: "humanApprovedCommand",
    description: "Ask human for approval to run a command.",
    parameters: z.object({
      command: z.string().describe("The command to run"),
    }),
    render: ({ args, respond, status }) => {
      if (status !== "executing") return <></>;
      return (
        <div>
          <pre>{args.command}</pre>
          <button onClick={() => respond?.(`Tell the user the command ran`)}>
            Approve
          </button>
          <button
            onClick={() => respond?.(`Tell the user the command wasn't run`)}
          >
            Deny
          </button>
        </div>
      );
    },
  });

  // ...
}
