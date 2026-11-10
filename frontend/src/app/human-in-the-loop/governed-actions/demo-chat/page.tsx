"use client";

// /human-in-the-loop/governed-actions. The snippets are verbatim, in page order.
// HARNESS: their import lines are merged at the top. The page shell at the bottom
// is HARNESS-AUTHORED. handleApproval (the server-side resume check) calls an
// undefined executeSideEffect and is reference-only.

import { useEffect } from "react";
import {
  CopilotChat,
  ToolCallStatus,
  useHumanInTheLoop,
  useInterrupt,
} from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoTabs } from "@/components/demo-tabs";
import { Providers } from "@/doc/quickstart/providers";

// ── "Action envelope" ──
type GovernedAction = {
  id: string;
  summary: string;
  tool: string;
  reference: string;
  verdict: "allow" | "deny" | "require_approval";
  arguments: Record<string, unknown>;
};

// ── "Inline approval with useInterrupt" (imports merged above) ──

function GovernedActionApproval() {
  useInterrupt({
    // @ts-expect-error HARNESS: doc type error kept. useInterrupt render must return a ReactElement, and this one returns null when there is no action.
    render: ({ interrupt, resolve, cancel }) => {
      const action = interrupt?.metadata?.action as GovernedAction | undefined;

      if (!action) {
        return null;
      }

      return (
        <GovernedActionCard
          action={action}
          onApprove={() =>
            resolve({
              approved: true,
              actionId: action.id,
              reference: action.reference,
            })
          }
          onReject={() =>
            resolve({
              approved: false,
              actionId: action.id,
              reference: action.reference,
            })
          }
          onBlock={() => cancel()}
        />
      );
    },
  });

  return null;
}

function GovernedActionCard({
  action,
  onApprove,
  onReject,
  onBlock,
}: {
  action: GovernedAction;
  onApprove: () => void;
  onReject: () => void;
  onBlock: () => void;
}) {
  useEffect(() => {
    if (action.verdict === "allow") onApprove();
    if (action.verdict === "deny") onBlock();
  }, [action.id, action.verdict]);

  const status =
    action.verdict === "allow"
      ? "Allowed by policy"
      : action.verdict === "deny"
        ? "Blocked by policy"
        : "User approval required";

  return (
    <section className="rounded-lg border p-4 shadow-sm">
      <div className="space-y-1">
        <p className="text-sm font-medium">{status}</p>
        <h3 className="text-base font-semibold">{action.summary}</h3>
        <p className="text-sm text-muted-foreground">Tool: {action.tool}</p>
        <p className="text-sm text-muted-foreground">
          Reference: {action.reference}
        </p>
      </div>

      <pre className="mt-3 overflow-auto rounded bg-muted p-3 text-xs">
        {JSON.stringify(action.arguments, null, 2)}
      </pre>

      {action.verdict === "require_approval" && (
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onApprove}>
            Approve and run
          </button>
          <button type="button" onClick={onReject}>
            Reject
          </button>
        </div>
      )}
    </section>
  );
}

// ── "Tool-call approval with useHumanInTheLoop" (imports merged above) ──

const governedActionSchema = z.object({
  id: z.string(),
  summary: z.string(),
  tool: z.string(),
  reference: z.string(),
  verdict: z.enum(["allow", "deny", "require_approval"]),
  arguments: z.record(z.unknown()),
});

function GovernedActionTool() {
  useHumanInTheLoop(
    {
      name: "approve_governed_action",
      description:
        "Ask the user to approve a governed side-effect action before it runs.",
      parameters: governedActionSchema,
      render: ({ args, status, respond }) => {
        if (status !== ToolCallStatus.Executing || !respond) {
          return null;
        }

        return (
          <GovernedActionCard
            action={args}
            onApprove={() =>
              respond({
                approved: true,
                actionId: args.id,
                reference: args.reference,
              })
            }
            onReject={() =>
              respond({
                approved: false,
                actionId: args.id,
                reference: args.reference,
              })
            }
            onBlock={() =>
              respond({
                approved: false,
                actionId: args.id,
                reference: args.reference,
              })
            }
          />
        );
      },
    },
    [],
  );

  return null;
}

// ── HARNESS-AUTHORED page shell ──
export default function GovernedActionsDemo() {
  return (
    <DemoTabs
      title="Governed Action Approval UI · Quickstart <Providers> (my_agent)"
      tabs={[
        {
          id: "hitl",
          label: "useHumanInTheLoop",
          note: "GovernedActionTool mounted next to a <CopilotChat />. Ask the agent to call approve_governed_action (see Try it on the notes page).",
          render: () => (
            <Providers>
              <GovernedActionTool />
              <div className="h-full">
                <CopilotChat />
              </div>
            </Providers>
          ),
        },
        {
          id: "interrupt",
          label: "useInterrupt",
          note: "GovernedActionApproval mounted. It only renders when the backend emits an interrupt with metadata.action. The Quickstart agent never does, and the page publishes no .NET agent that does, so nothing renders here.",
          render: () => (
            <Providers>
              <GovernedActionApproval />
              <div className="h-full">
                <CopilotChat />
              </div>
            </Providers>
          ),
        },
      ]}
    />
  );
}
