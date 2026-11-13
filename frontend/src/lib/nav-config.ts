/**
 * The single description of every tracked doc page. The nav, the route headers,
 * the status page and the README status table all read from here.
 *
 * Route paths mirror the doc URLs under docs.copilotkit.ai/ms-agent-harness-dotnet.
 * `slug` is the page's key in doc-snapshot/ (pages/<slug>.md, code/<slug>/).
 */

export const DOCS_ROOT = "https://docs.copilotkit.ai/ms-agent-harness-dotnet";

/**
 * working   — exercised end to end and behaves as the page describes.
 * partial   — built from published code and runnable; something limits it, or it
 *             has not been checked in a browser yet (the note says which).
 * broken    — cannot work as published. Reference-only routes are here: the
 *             verbatim code is shown, nothing runs.
 * reference — reading material, nothing to run.
 */
export type RouteStatus = "working" | "partial" | "broken" | "reference" | "not-started";

export const STATUS_LABEL: Record<RouteStatus, string> = {
  working: "✅ Working",
  partial: "⚠️ Partial",
  broken: "❌ Broken",
  reference: "📄 Reference",
  "not-started": "🚧 Not started",
};

export interface DemoLink {
  /** Absolute app path of a chrome-free demo route. */
  href: string;
  label: string;
}

export interface RouteMeta {
  path: string;
  title: string;
  /** Absolute path on docs.copilotkit.ai (starts with DOCS_ROOT's path), including any query string. */
  docPath: string;
  /** Key into doc-snapshot/. */
  slug: string;
  summary: string;
  status: RouteStatus;
  statusNote?: string;
  /** What the page fails to publish, or publishes broken. Shown in red. */
  docGap?: string;
  demos?: DemoLink[];
  tryIt?: { prompts: string[]; expect: string; fail?: string };
  /** Repo files that implement this route, shown verbatim on the notes page. */
  impl?: string[];
}

export interface NavGroup {
  title: string;
  routes: RouteMeta[];
}

// ── Shared texts ────────────────────────────────────────────────────────────

const UNVERIFIED = "Built from the published code. Not yet checked in a browser.";

/** Verified 2026-11-05 with raw AG-UI POSTs (see README §8). */
const CHAIN_OK =
  "Runtime → .NET chain verified with curl (PONG streamed back). The UI has not been checked in a browser yet.";
const TOOL_OK =
  "Verified with curl: a frontend tool sent in RunAgentInput.tools reaches the Quickstart model, which calls it. The UI has not been checked in a browser yet.";

/** Code-tab demos whose agent id the showcase runtime routes to backend "/". */
const SHOWCASE_ROOT_NOTE =
  "The demo is the page's Code tab. The showcase runtime routes this agent id to backend \"/\". In the docs, \"/\" is the unpublished SalesAgent. Here it is the Quickstart's MyAgent, the only .NET agent the docs publish in full.";

const UNPUBLISHED_IMPORTS = (files: string) =>
  `The Code-tab page imports ${files}, which no doc page publishes.`;

const REFERENCE_ONLY = (backendPath: string, agentFile: string) =>
  `The Code-tab demo needs the .NET agent mounted at ${backendPath}. The page publishes ${agentFile}, which cannot be built from the docs: it depends on code no page publishes (see backend/docs_verbatim/README.md). The 8 Harness agents that can be built run in backend/harness/; this one cannot, so the route is reference-only: the verbatim code is shown below and nothing runs.`;

/** Pages whose agent is one of the 8 published Harness agents, now run by backend/harness (:8002). */
const HARNESS_AGENTS_GAP =
  "The backend is the page's own Harness agent file in backend/harness/ (:8002), verbatim apart from labelled HARNESS REMEDY lines. No page installs Microsoft.Agents.AI.Harness or names a version. The published AsHarnessAgent(maxContextTokens, maxOutputTokens, options) call exists only up to 1.9.0-preview. Paired with the Quickstart's 1.19 packages, that version crashes at startup (MissingMethodException: UseToolApproval), so backend/harness uses the whole 1.9 line, the showcase's own AddAGUI/MapAGUI, and NoWarn MAAI001. As published, every turn failed with OpenAI 400 unknown_parameter 'web_search_options': the Harness adds a HostedWebSearchTool by default, which gpt-5-mini Chat Completions rejects. REMEDY: DisableWebSearch = true. Second REMEDY: DisableTodoProvider = true and DisableAgentModeProvider = true. Left on, these Harness defaults start the agent in plan mode with todos_* / mode_* tools, so every demo planned and asked permission before acting. File memory is still on as published. No page mentions these switches.";

const HARNESS_RUN_NOTE =
  "Runs end to end with the web-search remedy (confirmed by probe: no more 400). Many turns open with a plan and a question like \"may I switch to execute mode?\". Reply \"yes, execute\" to proceed. That is the Harness's default agent-mode provider. Not yet checked in a browser.";

const COMPONENTS_GAP =
  "The provider snippets name no agent (→ \"default\", not registered on the Quickstart runtime). HARNESS FIX: agentId=\"my_agent\". The remaining failure is confirmed and is the .NET side: the hosting drops RunAgentInput.Context (a context secret word sent to the Quickstart agent came back \"NO CONTEXT\"), so the agent never receives the catalog or render_ui guide. The page says the agent must put the run's context entries into its prompt, but publishes no .NET code for it. Names the page uses but never defines are written minimally and labelled harness-authored.";

const DEFAULT_AGENT_NOTE =
  "The doc names no agent (→ \"default\") or a different id, while the Quickstart runtime registers only \"my_agent\". As published, it throws \"useAgent: Agent 'default' not found after runtime sync … Known agents: [my_agent]\" (confirmed in the browser). HARNESS FIX: agent / agentId set to \"my_agent\" on each provider or hook, with the doc's value kept in the comment.";

// ── Nav ─────────────────────────────────────────────────────────────────────

export const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    routes: [
      {
        path: "/quickstart",
        title: "Quickstart (bring your own agent)",
        docPath: "/ms-agent-harness-dotnet/quickstart?agent=bring-your-own",
        slug: "quickstart__agent__bring-your-own",
        summary:
          "The .NET tab's ASP.NET Core AG-UI server, the Intelligence-backed runtime route, the providers file and a CopilotSidebar, all as published.",
        status: "partial",
        statusNote: "Backend verified (PONG over AG-UI). The Intelligence runtime accepted a run (joinToken issued). Events then flow over Intelligence's WebSocket, which only a browser follows, so the chat UI is unchecked.",
        demos: [{ href: "/quickstart/demo-chat", label: "Quickstart app" }],
        tryIt: {
          prompts: ["Can you tell me a joke?", "Can you help me understand AI?", "What do you think about .NET?"],
          expect: "The sidebar is docked on the right. The reply streams in token by token.",
          fail: "\"I'm having trouble connecting to my tools\", or nothing streams. Check that the agent is on :8000 and CPK_INTELLIGENCE_API_KEY is set.",
        },
        impl: [
          "backend/quickstart/Program.cs",
          "frontend/src/app/api/copilotkit/[[...slug]]/route.ts",
          "frontend/src/doc/quickstart/providers.tsx",
          "frontend/src/app/quickstart/demo-chat/layout.tsx",
          "frontend/src/app/quickstart/demo-chat/page.tsx",
        ],
      },
    ],
  },
  {
    title: "Prebuilt Components",
    routes: [
      {
        path: "/prebuilt-components/chat",
        title: "CopilotChat",
        docPath: "/ms-agent-harness-dotnet/prebuilt-components/chat",
        slug: "prebuilt-components__chat",
        summary: "The base inline chat surface, filling its container.",
        status: "partial",
        statusNote: `${SHOWCASE_ROOT_NOTE} ${CHAIN_OK}`,
        docGap: UNPUBLISHED_IMPORTS("./suggestions (useAgenticChatSuggestions)") + " The import and its call are commented out, not rewritten.",
        demos: [{ href: "/prebuilt-components/chat/demo-chat", label: "agentic-chat (Code tab)" }],
        tryIt: {
          prompts: ["Write a short sonnet about AI.", "Explain the difference between TCP and UDP as a short markdown table.", "What can you help me with?"],
          expect: "A full-height chat. The reply streams and renders as markdown.",
          fail: "CopilotKitAgentDiscoveryError for agentic_chat: the showcase runtime is not being reached.",
        },
        impl: ["frontend/src/app/prebuilt-components/chat/demo-chat/page.tsx"],
      },
      {
        path: "/prebuilt-components/sidebar",
        title: "CopilotSidebar",
        docPath: "/ms-agent-harness-dotnet/prebuilt-components/sidebar",
        slug: "prebuilt-components__sidebar",
        summary: "A docked, collapsible chat beside your main content, open on first render.",
        status: "partial",
        statusNote: `${SHOWCASE_ROOT_NOTE} ${CHAIN_OK}`,
        docGap: UNPUBLISHED_IMPORTS("./main-content (MainContent) and ./suggestions-mount (Suggestions)") + " MainContent is written minimally and labelled. Suggestions is commented out.",
        demos: [{ href: "/prebuilt-components/sidebar/demo-chat", label: "prebuilt-sidebar (Code tab)" }],
        tryIt: {
          prompts: ["What can you help me with?", "Give me three tips for writing clear emails.", "Close the sidebar with its toggle, reopen it, and ask: what did I ask you before?"],
          expect: "The sidebar starts open (defaultOpen). The toggle closes it and reopens it.",
        },
        impl: [
          "frontend/src/app/prebuilt-components/sidebar/demo-chat/page.tsx",
          "frontend/src/app/prebuilt-components/sidebar/demo-chat/main-content.tsx",
        ],
      },
      {
        path: "/prebuilt-components/popup",
        title: "CopilotPopup",
        docPath: "/ms-agent-harness-dotnet/prebuilt-components/popup",
        slug: "prebuilt-components__popup",
        summary: "A floating launcher that opens an overlay chat window.",
        status: "partial",
        statusNote: `${SHOWCASE_ROOT_NOTE} ${CHAIN_OK}`,
        docGap: UNPUBLISHED_IMPORTS("./main-content (MainContent) and ./suggestions-mount (Suggestions)") + " MainContent is written minimally and labelled. Suggestions is commented out.",
        demos: [{ href: "/prebuilt-components/popup/demo-chat", label: "prebuilt-popup (Code tab)" }],
        tryIt: {
          prompts: ["Hi there", "Suggest three names for a coffee shop.", "Write a two-line poem about the sea."],
          expect: "The popup starts open, and its input placeholder reads \"Ask the popup anything...\".",
        },
        impl: [
          "frontend/src/app/prebuilt-components/popup/demo-chat/page.tsx",
          "frontend/src/app/prebuilt-components/popup/demo-chat/main-content.tsx",
        ],
      },
      {
        path: "/prebuilt-components/chat-controls",
        title: "Open, close, and feedback",
        docPath: "/ms-agent-harness-dotnet/prebuilt-components/chat-controls",
        slug: "prebuilt-components__chat-controls",
        summary:
          "Controlled open/onOpenChange, opening through useCopilotChatConfiguration, defaultOpen, and thumbs-up/down handlers.",
        status: "partial",
        statusNote: "Runs on the Quickstart provider (my_agent). The backend is verified, but the UI has not been checked in a browser.",
        docGap:
          "The feedback snippet calls analytics.track(...) but never defines analytics; the demo records each thumb into on-page state instead (labelled HARNESS). The toggle snippet uses a `config` variable defined in a different snippet, so a labelled wrapper supplies it. Buttons beside a prebuilt chat only work under an explicit CopilotChatConfigurationProvider, which the page mentions only for composing chat yourself.",
        demos: [{ href: "/prebuilt-components/chat-controls/demo-chat", label: "Open, close, feedback" }],
        tryIt: {
          prompts: ["Click \"Ask the assistant (Popup)\", then click it again", "Click \"Open Sidebar\", then \"Close Sidebar\"", "In the sidebar: Write a haiku about autumn. (Then click thumbs up or down under the reply.)"],
          expect: "The popup button opens and closes a CopilotPopup. The toggle opens the left-docked sidebar and its label flips to \"Close Sidebar\". Each thumb click adds a 👍/👎 line with the message id under \"Feedback recorded\".",
          fail: "No buttons render: useCopilotChatConfiguration() found no modal state, so the CopilotChatConfigurationProvider wrapper is missing.",
        },
        impl: ["frontend/src/app/prebuilt-components/chat-controls/demo-chat/page.tsx"],
      },
    ],
  },
  {
    title: "Custom Look and Feel",
    routes: [
      {
        path: "/custom-look-and-feel/css",
        title: "CSS Customization",
        docPath: "/ms-agent-harness-dotnet/custom-look-and-feel/css",
        slug: "custom-look-and-feel__css",
        summary: "Re-skinning the chat with CSS variables, class overrides, fonts, icons and labels.",
        status: "partial",
        statusNote: `${SHOWCASE_ROOT_NOTE} ${CHAIN_OK}`,
        docGap:
          "The CopilotKitCSSProperties example imports from the deprecated v1 @copilotkit/react-ui, and renders <CopilotSidebar /> without importing it. The icons example uses YourOpenIconComponent / YourCloseIconComponent, which are never defined (minimal labelled stand-ins). `icons` is not a prop of the v2 CopilotChat (a type error, kept). The custom-fonts CSS quotes \"Arial, sans-serif\" as one family name, so it names a font that does not exist.",
        demos: [
          { href: "/custom-look-and-feel/css/demo-chat", label: "chat-customization-css (Code tab)" },
          { href: "/custom-look-and-feel/css/demo-chat/snippets", label: "Page snippets" },
        ],
        tryIt: {
          prompts: ["Tell me about the Halcyon theme", "Write a short paragraph about a library at golden hour.", "Give me a markdown list of three famous libraries."],
          expect: "Code tab: parchment background, serif type, and user messages in a mono font with a copper → marker.",
        },
        impl: [
          "frontend/src/app/custom-look-and-feel/css/demo-chat/page.tsx",
          "frontend/src/app/custom-look-and-feel/css/demo-chat/snippets/page.tsx",
          "frontend/src/app/custom-look-and-feel/css/demo-chat/snippets/globals.css",
        ],
      },
      {
        path: "/custom-look-and-feel/slots",
        title: "Slots (Subcomponents)",
        docPath: "/ms-agent-harness-dotnet/custom-look-and-feel/slots",
        slug: "custom-look-and-feel__slots",
        summary: "Overriding chat sub-components with class strings, prop objects and replacement components, at any depth.",
        status: "partial",
        statusNote: `${SHOWCASE_ROOT_NOTE} ${CHAIN_OK}`,
        docGap:
          "The Code-tab page imports 13 components from ./slot-wrappers and makeSlotOverride from ../_shared/slot-override, none of them published. They are written minimally and labelled: each wraps the default slot in a dashed, named outline. ./suggestions is commented out. Type errors kept with @ts-expect-error: the Custom Components snippet is untyped and a plain function does not satisfy the messageView slot type; \"data-testid\" is not allowed in the messageView object; a plain function does not satisfy the userMessage slot type. The nested-slot snippet uses CustomToolbar / CustomCopyButton / CustomUserMessage, which are never defined (minimal stand-ins).",
        demos: [
          { href: "/custom-look-and-feel/slots/demo-chat", label: "chat-slots (Code tab)" },
          { href: "/custom-look-and-feel/slots/demo-chat/snippets", label: "Page snippets" },
        ],
        tryIt: {
          prompts: ["Say hello", "Explain what a UI slot is in one sentence.", "Write a numbered list of three steps to make tea."],
          expect: "Every overridden slot shows a dashed, named outline. The welcome screen is the gradient card from custom-welcome-screen.tsx.",
        },
        impl: [
          "frontend/src/app/custom-look-and-feel/slots/demo-chat/page.tsx",
          "frontend/src/app/custom-look-and-feel/slots/demo-chat/custom-welcome-screen.tsx",
          "frontend/src/app/custom-look-and-feel/slots/demo-chat/slot-wrappers.tsx",
          "frontend/src/app/custom-look-and-feel/_shared/slot-override.ts",
          "frontend/src/app/custom-look-and-feel/slots/demo-chat/snippets/page.tsx",
        ],
      },
      {
        path: "/custom-look-and-feel/markdown",
        title: "Markdown Rendering",
        docPath: "/ms-agent-harness-dotnet/custom-look-and-feel/markdown",
        slug: "custom-look-and-feel__markdown",
        summary: "The assistant message's markdownRenderer slot: per-tag components, a class string, or a whole replacement.",
        status: "partial",
        statusNote: "Runs on the Quickstart provider (my_agent). The backend is verified, but the UI has not been checked in a browser.",
        demos: [{ href: "/custom-look-and-feel/markdown/demo-chat", label: "All variants" }],
        tryIt: {
          prompts: ["Reply with a level-2 heading and a link to https://copilotkit.ai", "Reply with a markdown table of three planets and their number of moons.", "Show a code block with a JavaScript hello world."],
          expect: "Tags tab: the link carries class my-link and the h2 carries my-heading. Class tab: text-sm leading-7 on the block. PlainText tab: the raw markdown in a <pre>.",
        },
        impl: ["frontend/src/app/custom-look-and-feel/markdown/demo-chat/page.tsx"],
      },
      {
        path: "/custom-look-and-feel/headless-ui",
        title: "Headless UI",
        docPath: "/ms-agent-harness-dotnet/custom-look-and-feel/headless-ui",
        slug: "custom-look-and-feel__headless-ui",
        summary: "A chat built from useAgent / useCopilotKit / useRenderToolCall with no CopilotKit chrome.",
        status: "partial",
        statusNote: "The published message rendering (message-list.tsx + use-rendered-messages.tsx) runs on the Quickstart MyAgent. The composer is a minimal labelled stand-in. Not yet checked in a browser.",
        docGap: "The live page renders two \"Missing snippet\" errors (regions use-agent-simple and message-list-simple). The complete example's ./chat/chat (Chat: the composer and run wiring) is not published, so a minimal HARNESS Chat is built from the hooks the page names (useAgent({ agentId }) and useCopilotKit().runAgent({ agent })) around the published MessageList. ./hooks/use-tool-renderers, use-frontend-components and use-headless-suggestions are not published and are commented out, so no tool or activity renderers are registered. Its agent headless-complete is in the unpublished D5ParityAgentFactory, so the published mcp-apps route sends it to the Quickstart MyAgent (HARNESS EDIT).",
        demos: [{ href: "/custom-look-and-feel/headless-ui/demo-chat", label: "headless-complete (Code tab)" }],
        tryIt: { prompts: ["Tell me a short joke", "What is 12 × 13?", "Give me two fun facts about octopuses."], expect: "Your message shows as a dark right-aligned bubble, the typing dot pulses, then the reply appears as a grey bubble. No CopilotChat chrome.", fail: "Nothing happens on Send means the run did not start. Check :8000 and the browser console." },
        impl: ["frontend/src/app/custom-look-and-feel/headless-ui/demo-chat/page.tsx", "frontend/src/app/custom-look-and-feel/headless-ui/demo-chat/chat/chat.tsx", "frontend/src/app/custom-look-and-feel/headless-ui/demo-chat/message-list.tsx", "frontend/src/app/custom-look-and-feel/headless-ui/demo-chat/use-rendered-messages.tsx", "frontend/src/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts"],
      },
      {
        path: "/custom-look-and-feel/reasoning-messages",
        title: "Reasoning Messages",
        docPath: "/ms-agent-harness-dotnet/custom-look-and-feel/reasoning-messages",
        slug: "custom-look-and-feel__reasoning-messages",
        summary: "The collapsible card for reasoning tokens, and its header, content and toggle slots.",
        status: "partial",
        statusNote: HARNESS_RUN_NOTE,
        docGap: `${HARNESS_AGENTS_GAP} /reasoning has no published construction: the showcase calls the unpublished salesFactory.CreateReasoningAgent(), so the published ReasoningAgentFactory.Create(chatClient, loggerFactory) is used with gpt-5-mini (labelled). ./suggestions is commented out. The page also renders a \"Missing snippet\" error for region default-reasoning-zero-config.`,
        demos: [
          { href: "/generative-ui/reasoning/demo-chat/default", label: "reasoning-default (Code tab)" },
          { href: "/generative-ui/reasoning/demo-chat/custom", label: "reasoning-custom (Code tab)" },
        ],
        tryIt: {
          prompts: ["Is 17 a prime number?", "A train leaves at 3:40 pm and the trip takes 2 h 35 min. When does it arrive?", "Which is larger, 9.11 or 9.9?"],
          expect: "Default tab: a \"Thinking…\" card streams the reasoning, then collapses to \"Thought for X seconds\" above the answer. Custom tab: the amber ReasoningBlock instead.",
          fail: "No reasoning card means the agent skipped the <reasoning> tags. A plan or \"switch to execute mode?\" reply is the Harness default: answer \"yes, execute\".",
        },
        impl: [
          "backend/harness/Program.cs",
          "backend/harness/Agents/ReasoningAgent.cs",
          "frontend/src/app/generative-ui/reasoning/demo-chat/default/page.tsx",
          "frontend/src/app/generative-ui/reasoning/demo-chat/custom/page.tsx",
          "frontend/src/app/generative-ui/reasoning/demo-chat/custom/reasoning-block.tsx",
          "frontend/src/app/api/copilotkit-showcase-harness/route.ts",
        ],
      },
    ],
  },
  {
    title: "Chat",
    routes: [
      {
        path: "/multimodal-attachments",
        title: "Multimodal Attachments",
        docPath: "/ms-agent-harness-dotnet/multimodal-attachments",
        slug: "multimodal-attachments",
        summary: "File attachments in CopilotChat: config, custom upload handlers, concurrency and errors.",
        status: "broken",
        statusNote: "Confirmed with curl: a user message with an image content part streams a normal reply, but the image never reaches the model (\"I don't see an image attached\"). There is no RUN_ERROR, so the failure is silent.",
        docGap:
          "Snippets call uploadToStorage, currentUser.id, toast.error and POST /api/upload, none defined. They are written minimally and labelled. The quick start targets agentId \"my-agent\", which no runtime registers. The page publishes no .NET handling. The showcase Program.cs says \"the AG-UI adapter rejects content arrays\" and serves multimodal from a raw unpublished MultimodalEndpoint. Expect the Quickstart agent to fail on an attachment. Type errors kept: the concurrency example's onUpload returns a string, not an AttachmentUploadResult. CopilotChat's onError is typed as a union with the DOM onError, so event.code does not type-check.",
        demos: [{ href: "/multimodal-attachments/demo-chat", label: "All snippets" }],
        tryIt: {
          prompts: ["Attach a small PNG and ask \"what is in this image?\"", "Attach a PDF and ask \"summarize this document\"", "In the onUploadFailed tab, attach a non-image file"],
          expect: "The attachment chip shows a preview, and the message sends with the image part.",
          fail: "A RUN_ERROR, or a 4xx/5xx from the agent on the content array. This is the expected outcome on the Quickstart server.",
        },
        impl: ["frontend/src/app/multimodal-attachments/demo-chat/page.tsx", "frontend/src/app/api/upload/route.ts"],
      },
      {
        path: "/voice",
        title: "Voice",
        docPath: "/ms-agent-harness-dotnet/voice",
        slug: "voice",
        summary: "Speech input transcribed through the runtime.",
        status: "partial",
        statusNote: "Runs on the Quickstart MyAgent, via the published voice route with one labelled URL edit. Needs OPENAI_TRANSCRIPTION_API_KEY in frontend/.env.local. Not yet checked in a browser.",
        docGap:
          "The Code-tab backend is the voice agent from the unpublished D5ParityAgentFactory (showcase Program.cs: d5ParityFactory.CreateVoiceAgent()), so the published route points at the Quickstart MyAgent at \"/\" instead. Its own comment says it needs only a tool-free text agent. ./voice-chat (VoiceChat) is not published: a minimal labelled <CopilotChat />, which the page says shows the mic button on its own. The published SampleAudioButton is not mounted, because how its onTranscribed reaches the chat is not shown. Transcription runs in the Node runtime (@copilotkit/voice + openai 5.x) and reads OPENAI_TRANSCRIPTION_API_KEY; without it there is no mic button.",
        demos: [{ href: "/voice/demo-chat", label: "voice (Code tab)" }],
        tryIt: {
          prompts: ["Click the mic, say \"What is the capital of France?\", then stop recording", "Click the mic and say \"Write a haiku about rain\"", "Click the mic and say \"What time zone is Tokyo in?\""],
          expect: "A mic button appears in the composer. The recording is transcribed into the input and sent, and MyAgent replies.",
          fail: "No mic button: GET /api/copilotkit-voice/info should show audioFileTranscriptionEnabled: true. If it is false, OPENAI_TRANSCRIPTION_API_KEY is missing.",
        },
        impl: [
          "frontend/src/app/voice/demo-chat/page.tsx",
          "frontend/src/app/voice/demo-chat/voice-chat.tsx",
          "frontend/src/app/voice/demo-chat/sample-audio-button.tsx",
          "frontend/src/lib/transcription-service.ts",
          "frontend/src/app/api/copilotkit-voice/[[...slug]]/route.ts",
        ],
      },
      {
        path: "/generative-ui/reasoning",
        title: "Reasoning",
        docPath: "/ms-agent-harness-dotnet/generative-ui/reasoning",
        slug: "generative-ui__reasoning",
        summary: "Reasoning chain shown in the chat, default or custom ReasoningBlock.",
        status: "partial",
        statusNote: HARNESS_RUN_NOTE,
        docGap: `${HARNESS_AGENTS_GAP} /reasoning has no published construction: the showcase calls the unpublished salesFactory.CreateReasoningAgent(), so the published ReasoningAgentFactory.Create(chatClient, loggerFactory) is used with gpt-5-mini (labelled). ./suggestions is commented out.`,
        demos: [
          { href: "/generative-ui/reasoning/demo-chat/default", label: "reasoning-default (Code tab)" },
          { href: "/generative-ui/reasoning/demo-chat/custom", label: "reasoning-custom (Code tab)" },
        ],
        tryIt: {
          prompts: ["Is 17 a prime number?", "A train leaves at 3:40 pm and the trip takes 2 h 35 min. When does it arrive?", "Which is larger, 9.11 or 9.9?"],
          expect: "A reasoning card (default) or the amber ReasoningBlock (custom) shows the thinking, then the answer.",
          fail: "No reasoning card means the agent skipped the <reasoning> tags. A plan or \"switch to execute mode?\" reply is the Harness default: answer \"yes, execute\".",
        },
        impl: [
          "backend/harness/Program.cs",
          "backend/harness/Agents/ReasoningAgent.cs",
          "frontend/src/app/generative-ui/reasoning/demo-chat/default/page.tsx",
          "frontend/src/app/generative-ui/reasoning/demo-chat/custom/page.tsx",
          "frontend/src/app/generative-ui/reasoning/demo-chat/custom/reasoning-block.tsx",
          "frontend/src/app/api/copilotkit-showcase-harness/route.ts",
        ],
      },
    ],
  },
  {
    title: "Threads",
    routes: [
      {
        path: "/prebuilt-components/copilot-threads-drawer",
        title: "Threads Drawer",
        docPath: "/ms-agent-harness-dotnet/prebuilt-components/copilot-threads-drawer",
        slug: "prebuilt-components__copilot-threads-drawer",
        summary: "The drop-in thread switcher sharing a CopilotChatConfigurationProvider with the chat.",
        status: "partial",
        statusNote: "Agent name fixed (HARNESS FIX: agentId=\"my_agent\"). As published it threw \"Agent 'default' not found\". The new-button page still returns 500 (\"Attempted to call useCopilotChatConfiguration() from the server\"). Not yet re-checked in a browser.",
        docGap:
          `${DEFAULT_AGENT_NOTE} The three app/page.tsx examples have no "use client". They are mounted as real Next pages, verbatim. The third calls useCopilotChatConfiguration() inside what is then a Server Component. The sidebar example renders <YourMainContent />, which is never defined (minimal labelled stand-in). The header-slot example passes children, which CopilotThreadsDrawerProps does not accept (a type error, kept).`,
        demos: [
          { href: "/prebuilt-components/copilot-threads-drawer/demo-chat", label: "With CopilotChat" },
          { href: "/prebuilt-components/copilot-threads-drawer/demo-chat/sidebar", label: "With CopilotSidebar" },
          { href: "/prebuilt-components/copilot-threads-drawer/demo-chat/new-button", label: "Own New-conversation button" },
          { href: "/prebuilt-components/copilot-threads-drawer/demo-chat/snippets", label: "Fragments" },
        ],
        tryIt: {
          prompts: ["Hello, this is my first thread.", "Click New Conversation, then ask: what is the capital of Japan?", "Select the first thread in the drawer (its history should replay)"],
          expect: "The drawer lists both threads, and selecting one replays its history.",
          fail: "A locked drawer with Upgrade, which means Intelligence is off. With the agent-name fix the \"Agent 'default' not found\" crash should be gone; if it is back, the fix was reverted.",
        },
        impl: [
          "frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/page.tsx",
          "frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/sidebar/page.tsx",
          "frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/new-button/page.tsx",
          "frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/snippets/page.tsx",
        ],
      },
      {
        path: "/headless-threads",
        title: "Headless Threads",
        docPath: "/ms-agent-harness-dotnet/headless-threads",
        slug: "headless-threads",
        summary: "A custom thread list on useThreads: rename, archive, switch, paginate.",
        status: "partial",
        statusNote: "Agent ids fixed (HARNESS FIX: \"my-agent\" and runtimeAgentId \"default\" → my_agent). Selecting a row still does nothing, because the published ThreadSidebar has no onSelectThread prop. Not yet re-checked in a browser.",
        docGap:
          "server.ts uses `agent` and `verifyAppSession`, which are never defined, so it is reference-only. ThreadSidebar takes no props, but App passes onSelectThread, a type error kept with @ts-expect-error, so selecting a row does nothing. useThreads uses agentId \"my-agent\" (hyphen), while the Quickstart registers \"my_agent\". The useAgent snippet uses runtimeAgentId \"default\".",
        demos: [{ href: "/headless-threads/demo-chat", label: "ThreadSidebar + App" }],
        tryIt: {
          prompts: ["Send: Plan a weekend in Lisbon. (This creates a thread.)", "Click Rename on that thread", "Click Archive on a thread"],
          expect: "With the agent-id fix, the sidebar lists my_agent's threads, and Rename / Archive update them. Clicking a row does not switch the chat, because the published ThreadSidebar has no onSelectThread.",
        },
        impl: ["frontend/src/app/headless-threads/demo-chat/page.tsx"],
      },
      {
        path: "/frontend-tools",
        title: "Frontend Tools",
        docPath: "/ms-agent-harness-dotnet/frontend-tools",
        slug: "frontend-tools",
        summary: "A browser-side tool (change_background) the agent calls to restyle the page.",
        status: "partial",
        statusNote: `${SHOWCASE_ROOT_NOTE} ${TOOL_OK}`,
        docGap:
          "The Code-tab page imports ./background (Background, DEFAULT_BACKGROUND) and ./suggestions, neither published. Background is written minimally and labelled, and suggestions is commented out. The page's \"Nothing to wire on the agent\" section repeats the Components-as-Tools page's ChartAgent.cs and render_bar_chart text word for word. The useFrontendTools snippet uses reports and navigate, which are never defined, so it is reference-only.",
        demos: [{ href: "/frontend-tools/demo-chat", label: "frontend-tools (Code tab)" }],
        tryIt: {
          prompts: ["Change the background to a sunset gradient", "Make the background a dark blue radial gradient", "Reset the background to plain white"],
          expect: "The page background changes. The agent receives {status: \"success\"} and confirms.",
          fail: "A prose answer and no change, meaning the model did not call the tool. The doc's own warning applies: MyAgent's prompt does not mention the tool.",
        },
        impl: [
          "frontend/src/app/frontend-tools/demo-chat/page.tsx",
          "frontend/src/app/frontend-tools/demo-chat/background.tsx",
        ],
      },
    ],
  },
  {
    title: "Generative UI · Controlled",
    routes: [
      {
        path: "/generative-ui/tool-based",
        title: "Components as Tools",
        docPath: "/ms-agent-harness-dotnet/generative-ui/tool-based",
        slug: "generative-ui__tool-based",
        summary: "useComponent registering render_bar_chart / render_pie_chart as frontend tools.",
        status: "partial",
        statusNote: "Runs on the Quickstart MyAgent, via the showcase runtime with one labelled routing edit. useComponent tools are frontend tools, and the curl probe showed frontend tools reach MyAgent. Not yet checked in a browser.",
        docGap:
          "The Code-tab agent at /gen-ui-tool-based is in the unpublished D5ParityAgentFactory; the page shows only two ChartAgent.cs fragments (a method and a const with no class). So the showcase runtime routes gen-ui-tool-based to the Quickstart MyAgent at \"/\" (HARNESS EDIT). That agent has no prompt naming render_bar_chart, which the page itself says is easy to miss. ./bar-chart and ./pie-chart are not published: minimal labelled Recharts components, with props taken from ChartAgent.cs's prompt ({title, description, data: {label, value}[]}). ./suggestions is commented out.",
        demos: [{ href: "/generative-ui/tool-based/demo-chat", label: "gen-ui-tool-based (Code tab)" }],
        tryIt: {
          prompts: ["Use render_bar_chart to chart quarterly revenue: Q1 120, Q2 145, Q3 138, Q4 190", "Use render_pie_chart to show a budget split: rent 40, food 25, travel 15, savings 20", "Show a pie chart of browser share: Chrome 65, Safari 19, Edge 5, Firefox 3"],
          expect: "A bar chart (or pie chart) renders inline in the chat with one bar or slice per value.",
          fail: "A markdown table or prose instead of a chart means the model answered without calling the tool. Name the tool in the prompt, as the first example does.",
        },
        impl: [
          "frontend/src/app/generative-ui/tool-based/demo-chat/page.tsx",
          "frontend/src/app/generative-ui/tool-based/demo-chat/bar-chart.tsx",
          "frontend/src/app/generative-ui/tool-based/demo-chat/pie-chart.tsx",
          "frontend/src/app/api/copilotkit-showcase/route.ts",
        ],
      },
      {
        path: "/generative-ui/tool-rendering",
        title: "Tool Call Rendering",
        docPath: "/ms-agent-harness-dotnet/generative-ui/tool-rendering",
        slug: "generative-ui__tool-rendering",
        summary: "Custom renderers for backend tool calls, plus default and custom catch-alls.",
        status: "partial",
        statusNote: "get_weather works end to end (curl-verified: TOOL_CALL get_weather, then a WeatherInfo result). The other renderers (search_flights, get_stock_price, roll_d20) still have no tool behind them. Not yet checked in a browser.",
        docGap:
          "The renderers render BACKEND tool calls. The doc's tool agent is in the unpublished D5ParityAgentFactory, and no page publishes any C# tool. At the owner's request, a HARNESS-AUTHORED backend/quickstart/ToolRenderingAgent.cs (the Quickstart's agent construction plus one sample get_weather tool returning the showcase's published WeatherInfo type) is mounted at /tool-rendering, the doc route's own path. The showcase route's three tool-rendering lines are back to the doc's value. search_flights, get_stock_price and roll_d20 have no tools, so only the catch-alls could ever show for other calls. Frontend: weather-card, flight-list-card and parse-json-result come from this page's body snippets. StockCard, D20Card and ./_components/{card,badge} are minimal labelled stand-ins. ./suggestions is commented out.",
        demos: [
          { href: "/generative-ui/tool-rendering/demo-chat", label: "tool-rendering (Code tab)" },
          { href: "/generative-ui/tool-rendering/demo-chat/default-catchall", label: "default catch-all (Code tab)" },
          { href: "/generative-ui/tool-rendering/demo-chat/custom-catchall", label: "custom catch-all (Code tab)" },
          { href: "/generative-ui/tool-rendering/demo-chat/prose", label: "page.tsx + tool-renderers.tsx (page body)" },
        ],
        tryIt: {
          prompts: ["What's the weather in Tokyo?", "Find flights from SFO to JFK", "What's the stock price of AAPL?", "Roll a d20"],
          expect: "A WeatherCard for Tokyo (sample data: 22°, partly cloudy, humidity 60, wind 12) renders in the chat, then a one-line summary. On the default catch-all page the built-in tool card shows instead, and on the custom catch-all page the custom card.",
          fail: "An agent-not-found or 404 error means the showcase runtime is not reaching :8000.",
        },
        impl: [
          "frontend/src/app/generative-ui/tool-rendering/demo-chat/page.tsx",
          "frontend/src/app/generative-ui/tool-rendering/demo-chat/weather-card.tsx",
          "frontend/src/app/generative-ui/tool-rendering/demo-chat/stock-card.tsx",
          "frontend/src/app/generative-ui/tool-rendering/demo-chat/d20-card.tsx",
          "frontend/src/app/generative-ui/tool-rendering/demo-chat/custom-catchall-renderer.tsx",
          "frontend/src/app/generative-ui/tool-rendering/demo-chat/_components/card.tsx",
          "frontend/src/app/generative-ui/tool-rendering/demo-chat/default-catchall/page.tsx",
          "frontend/src/app/generative-ui/tool-rendering/demo-chat/custom-catchall/page.tsx",
          "frontend/src/app/generative-ui/tool-rendering/demo-chat/prose/page.tsx",
          "frontend/src/app/generative-ui/tool-rendering/demo-chat/prose/tool-renderers.tsx",
          "frontend/src/app/api/copilotkit-showcase/route.ts",
        ],
      },
    ],
  },
  {
    title: "Generative UI · Components and surfaces",
    routes: [
      {
        path: "/generative-ui/components/surfaces",
        title: "Surfaces",
        docPath: "/ms-agent-harness-dotnet/generative-ui/components/surfaces",
        slug: "generative-ui__components__surfaces",
        summary: "GenerativeUISurface page targets with descriptions, component limits, fallbacks and error boundaries.",
        status: "broken",
        statusNote: "Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below.",
        docGap: `${COMPONENTS_GAP} Here that is Product and ProductRow, plus the products data.`,
        demos: [{ href: "/generative-ui/components/surfaces/demo-chat", label: "Featured products target" }],
        tryIt: {
          prompts: ["Show me cheap running shoes in the featured row", "Show the featured products again", "Put a short note in the sidebar notes area"],
          expect: "The fallback ProductRow is visible on load. Agent-rendered cards need the context gap closed.",
        },
        impl: ["frontend/src/app/generative-ui/components/surfaces/demo-chat/page.tsx", "frontend/src/app/generative-ui/components/_shared/catalog.tsx"],
      },
      {
        path: "/generative-ui/components/catalogs",
        title: "Catalogs",
        docPath: "/ms-agent-harness-dotnet/generative-ui/components/catalogs",
        slug: "generative-ui__components__catalogs",
        summary: "createGenerativeUI catalogs: components, descriptions, prop schemas, slots, extends, export.",
        status: "broken",
        statusNote: "Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below.",
        docGap: `${COMPONENTS_GAP} exportA2UICatalog's example writes the file with fs.writeFileSync, a Node API that cannot run in this browser demo. The demo shows the exported JSON instead. The Combine example's Hero and cartUI are never defined.`,
        demos: [{ href: "/generative-ui/components/catalogs/demo-chat", label: "shopUI catalog" }],
        tryIt: { prompts: ["Show me two products", "Show a product grid titled \"New arrivals\" with three products"], expect: "The exported A2UI catalog JSON renders on the page." },
        impl: ["frontend/src/app/generative-ui/components/catalogs/demo-chat/page.tsx", "frontend/src/app/generative-ui/components/_shared/catalog.tsx"],
      },
      {
        path: "/generative-ui/components/standard-catalog",
        title: "Standard catalog",
        docPath: "/ms-agent-harness-dotnet/generative-ui/components/standard-catalog",
        slug: "generative-ui__components__standard-catalog",
        summary: "standardUI as is, with extends, omit and overrides.",
        status: "broken",
        statusNote: "Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below.",
        docGap: `${COMPONENTS_GAP} ProductCard and productSchema in the extends example are never defined.`,
        demos: [{ href: "/generative-ui/components/standard-catalog/demo-chat", label: "standardUI" }],
        tryIt: { prompts: ["Show a card with a title and a button", "Show a data table of three cities and their populations", "Show a bar chart of monthly sales"], expect: "Needs the context gap closed to render agent UI." },
        impl: [
          "frontend/src/app/generative-ui/components/standard-catalog/demo-chat/page.tsx",
          "frontend/src/app/generative-ui/components/standard-catalog/demo-chat/appui-extends.tsx",
          "frontend/src/app/generative-ui/components/standard-catalog/demo-chat/appui-omit.ts",
          "frontend/src/app/generative-ui/components/standard-catalog/demo-chat/appui-overrides.tsx",
        ],
      },
      {
        path: "/generative-ui/components/state-and-actions",
        title: "State and actions",
        docPath: "/ms-agent-harness-dotnet/generative-ui/components/state-and-actions",
        slug: "generative-ui__components__state-and-actions",
        summary: "App state bound into props, functions run on events, and writable props.",
        status: "broken",
        statusNote: "Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below.",
        docGap: `${COMPONENTS_GAP} The Cart type and cart.addItem are never defined. The state example's ProductCard component is never shown.`,
        demos: [{ href: "/generative-ui/components/state-and-actions/demo-chat", label: "Cart state + addToCart" }],
        tryIt: { prompts: ["Show product p1 so I can add it to my cart", "How many of p1 are in my cart?", "Show a checkout form asking for my email"], expect: "Needs the context gap closed to render agent UI." },
        impl: [
          "frontend/src/app/generative-ui/components/state-and-actions/demo-chat/page.tsx",
          "frontend/src/app/generative-ui/components/state-and-actions/demo-chat/state-catalog.tsx",
          "frontend/src/app/generative-ui/components/state-and-actions/demo-chat/functions-catalog.tsx",
          "frontend/src/app/generative-ui/components/state-and-actions/demo-chat/writable-catalog.tsx",
        ],
      },
      {
        path: "/generative-ui/components/theming",
        title: "Theming",
        docPath: "/ms-agent-harness-dotnet/generative-ui/components/theming",
        slug: "generative-ui__components__theming",
        summary: "The theme option: --a2ui-* variables, dark overrides and map styles.",
        status: "broken",
        statusNote: "Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below.",
        docGap: COMPONENTS_GAP,
        demos: [{ href: "/generative-ui/components/theming/demo-chat", label: "Amber theme" }],
        tryIt: { prompts: ["Show a primary button", "Show a card with a slider and a badge"], expect: "Needs the context gap closed to render agent UI." },
        impl: ["frontend/src/app/generative-ui/components/theming/demo-chat/page.tsx"],
      },
      {
        path: "/generative-ui/components/transports",
        title: "Transports",
        docPath: "/ms-agent-harness-dotnet/generative-ui/components/transports",
        slug: "generative-ui__components__transports",
        summary: "Tool transport (render_ui) and markdown transport (a2ui fences), per agent.",
        status: "broken",
        statusNote: "Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below.",
        docGap: `${COMPONENTS_GAP} The runtime snippet uses an undefined \`agent\`. The harness runtime at /api/copilotkit-genui supplies the Quickstart HttpAgent, labelled.`,
        demos: [{ href: "/generative-ui/components/transports/demo-chat", label: "Tool vs markdown" }],
        tryIt: { prompts: ["Show a card with a slider", "Show a form with a name field and a submit button"], expect: "Tool transport: a render_ui call. Markdown transport: an ```a2ui fence. Both need the context gap closed." },
        impl: ["frontend/src/app/generative-ui/components/transports/demo-chat/page.tsx", "frontend/src/app/api/copilotkit-genui/[[...slug]]/route.ts"],
      },
      {
        path: "/generative-ui/components/markdown-mode",
        title: "Markdown mode",
        docPath: "/ms-agent-harness-dotnet/generative-ui/components/markdown-mode",
        slug: "generative-ui__components__markdown-mode",
        summary: "UI written inside the reply as ```a2ui code blocks.",
        status: "broken",
        statusNote: "Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below.",
        docGap: COMPONENTS_GAP,
        demos: [{ href: "/generative-ui/components/markdown-mode/demo-chat", label: "Markdown transport" }],
        tryIt: {
          prompts: ["Reply with exactly the plan-estimator a2ui block from the docs", "Show a plan estimator with a seats slider"],
          expect: "If the model echoes a well-formed ```a2ui fence, the browser renders it as a live surface. That checks the browser half without the context.",
        },
        impl: ["frontend/src/app/generative-ui/components/markdown-mode/demo-chat/page.tsx"],
      },
      {
        path: "/generative-ui/components/from-a2ui",
        title: "Adopt from A2UI",
        docPath: "/ms-agent-harness-dotnet/generative-ui/components/from-a2ui",
        slug: "generative-ui__components__from-a2ui",
        summary: "Moving an a2ui/createCatalog setup to generativeUI/createGenerativeUI.",
        status: "broken",
        statusNote: "Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below.",
        docGap: `${COMPONENTS_GAP} Airport, Arrow and myCatalog are never defined.`,
        demos: [{ href: "/generative-ui/components/from-a2ui/demo-chat", label: "After: appUI" }],
        tryIt: { prompts: ["Show a flight from SFO to JFK", "Show an airport card for LHR, London"], expect: "Needs the context gap closed to render agent UI." },
        impl: ["frontend/src/app/generative-ui/components/from-a2ui/demo-chat/page.tsx", "frontend/src/app/generative-ui/components/from-a2ui/demo-chat/appui.tsx"],
      },
    ],
  },
  {
    title: "Generative UI · A2UI",
    routes: [
      {
        path: "/generative-ui/a2ui",
        title: "A2UI",
        docPath: "/ms-agent-harness-dotnet/generative-ui/a2ui",
        slug: "generative-ui__a2ui",
        summary: "Turning A2UI on with a provider catalog, or on the runtime with injectA2UITool.",
        status: "partial",
        statusNote: "Agent name fixed on the as-published tab (HARNESS FIX). That tab still omits useSingleEndpoint={false}, which the Copilot Runtime page says a multi-route runtime needs. The second tab has both. Not yet checked in a browser.",
        docGap:
          "The page's myCatalog and myAgent are never defined. The catalog is the one the Dynamic Schema page publishes (definitions/renderers/catalog, verbatim), plus its unpublished ../_components/{badge,button}, written minimally. myAgent is the Quickstart HttpAgent, labelled. The page's Python a2ui helper has no .NET form.",
        demos: [
          { href: "/generative-ui/a2ui/demo-chat", label: "Provider catalog" },
          { href: "/generative-ui/a2ui/demo-chat/runtime", label: "Runtime injectA2UITool" },
        ],
        tryIt: {
          prompts: ["Show me a dashboard card with three metrics and a status badge", "Show a status badge that says \"All systems operational\"", "Show a card with two metrics: users 1,204 and revenue $8,300"],
          expect: "The agent calls generate_a2ui, a progress indicator shows, then the surface renders.",
          fail: "Prose only, meaning MyAgent did not choose the tool.",
        },
        impl: [
          "frontend/src/app/generative-ui/a2ui/demo-chat/page.tsx",
          "frontend/src/app/generative-ui/a2ui/demo-chat/runtime/page.tsx",
          "frontend/src/app/api/copilotkit-a2ui/[[...slug]]/route.ts",
          "frontend/src/doc/a2ui/catalog.ts",
          "frontend/src/doc/a2ui/definitions.ts",
          "frontend/src/doc/a2ui/renderers.tsx",
          "frontend/src/doc/_components/badge.tsx",
          "frontend/src/doc/_components/button.tsx",
        ],
      },
      {
        path: "/generative-ui/a2ui/dynamic-schema",
        title: "Dynamic Schema A2UI",
        docPath: "/ms-agent-harness-dotnet/generative-ui/a2ui/dynamic-schema",
        slug: "generative-ui__a2ui__dynamic-schema",
        summary: "A secondary LLM designs the surface from your catalog.",
        status: "partial",
        statusNote: "Frontend-only path on the Quickstart MyAgent. Per the page, the provider catalog makes the runtime inject generate_a2ui. Not yet checked in a browser, and a raw request cannot exercise it, because the catalog comes from the browser's provider.",
        docGap: "The page's .NET agent (DeclarativeGenUiAgent.cs) cannot be built: it needs the unpublished A2uiSecondaryToolCaller and BeautifulChatA2ui. Its runtime route /api/copilotkit-declarative-gen-ui and ./chat are not published either. The route is HARNESS-AUTHORED in the shape of the published sibling routes: agent = Quickstart MyAgent, no a2ui block (\"the catalog auto-enables A2UI and injects the generate_a2ui tool, so the runtime needs no a2ui block\"), and single-route mode. ./chat is a minimal CopilotChat. The catalog (definitions / renderers / catalog) is verbatim; ../_components/{badge,button} are minimal stand-ins.",
        demos: [{ href: "/generative-ui/a2ui/dynamic-schema/demo-chat", label: "declarative-gen-ui (Code tab)" }],
        tryIt: { prompts: ["Use generate_a2ui to show a status dashboard with three metrics and a status badge", "Use generate_a2ui to show a project status card with a progress metric", "Use generate_a2ui to show a pie chart of traffic sources"], expect: "A progress indicator, then an A2UI surface built from the dashboard catalog (Card, StatusBadge, Metric, …).", fail: "Prose only means MyAgent did not call generate_a2ui, because its prompt does not mention it. Name the tool." },
        impl: ["frontend/src/app/generative-ui/a2ui/dynamic-schema/demo-chat/page.tsx", "frontend/src/app/generative-ui/a2ui/dynamic-schema/demo-chat/chat.tsx", "frontend/src/app/generative-ui/a2ui/dynamic-schema/demo-chat/a2ui/catalog.ts", "frontend/src/app/api/copilotkit-declarative-gen-ui/route.ts"],
      },
      {
        path: "/generative-ui/a2ui/fixed-schema",
        title: "Fixed Schema A2UI",
        docPath: "/ms-agent-harness-dotnet/generative-ui/a2ui/fixed-schema",
        slug: "generative-ui__a2ui__fixed-schema",
        summary: "A pre-authored flight-card schema that the agent fills with data.",
        status: "partial",
        statusNote: HARNESS_RUN_NOTE,
        docGap: `${HARNESS_AGENTS_GAP} The demo runtime route /api/copilotkit-a2ui-fixed-schema is not published; it is assembled from the runtime snippet on this page (labelled). ./chat and ../_components/{card,badge,button,separator} are minimal labelled stand-ins.`,
        demos: [
          { href: "/generative-ui/a2ui/fixed-schema/demo-chat", label: "a2ui-fixed-schema (Code tab)" },
        ],
        tryIt: {
          prompts: ["Show me a flight from SFO to JFK on United for $289", "Find a flight from LAX to SEA on Alaska for $149", "Click Book on the flight card"],
          expect: "A flight card renders: Title, Airport → Arrow → Airport, AirlineBadge · PriceTag, and a Book button.",
          fail: "A plan or \"switch to execute mode?\" reply: answer \"yes, execute\". Raw JSON instead of a card means the A2UI operations were not rendered.",
        },
        impl: [
          "backend/harness/Agents/A2uiFixedSchemaAgent.cs",
          "frontend/src/app/generative-ui/a2ui/fixed-schema/demo-chat/page.tsx",
          "frontend/src/app/generative-ui/a2ui/fixed-schema/demo-chat/chat.tsx",
          "frontend/src/app/generative-ui/a2ui/fixed-schema/demo-chat/a2ui/renderers.tsx",
          "frontend/src/app/api/copilotkit-a2ui-fixed-schema/route.ts",
        ],
      },
      {
        path: "/generative-ui/json-render",
        title: "JSON Render",
        docPath: "/ms-agent-harness-dotnet/generative-ui/json-render",
        slug: "generative-ui__json-render",
        summary: "Bring-your-own-catalog rendering with @json-render.",
        status: "partial",
        statusNote: HARNESS_RUN_NOTE,
        docGap: `${HARNESS_AGENTS_GAP} The frontend is fully published. @json-render/core and @json-render/react are pinned to 0.18.0, with Zod 4 through the zod4 alias, as the page says.`,
        demos: [
          { href: "/generative-ui/json-render/demo-chat", label: "declarative-json-render (Code tab)" },
        ],
        tryIt: {
          prompts: ["Show me the sales dashboard with metrics and a revenue chart", "Break down revenue by category as a pie chart", "Show me monthly expenses as a bar chart"],
          expect: "A json-render UI (metric cards and charts) renders inside the assistant message.",
          fail: "Raw JSON text means the renderer did not parse it. HTTP 404 means :8002 is down.",
        },
        impl: [
          "backend/harness/Agents/ByocJsonRenderAgent.cs",
          "frontend/src/app/generative-ui/json-render/demo-chat/page.tsx",
          "frontend/src/app/generative-ui/json-render/demo-chat/chat.tsx",
          "frontend/src/app/generative-ui/json-render/demo-chat/catalog.ts",
          "frontend/src/app/api/copilotkit-declarative-json-render/route.ts",
        ],
      },
      {
        path: "/generative-ui/hashbrown",
        title: "Hashbrown",
        docPath: "/ms-agent-harness-dotnet/generative-ui/hashbrown",
        slug: "generative-ui__hashbrown",
        summary: "Bring-your-own-catalog rendering with Hashbrown.",
        status: "partial",
        statusNote: HARNESS_RUN_NOTE,
        docGap: `${HARNESS_AGENTS_GAP} The frontend is fully published. @hashbrownai/core and @hashbrownai/react are pinned to 0.5.0-beta.4, as the page says the demos pin.`,
        demos: [
          { href: "/generative-ui/hashbrown/demo-chat", label: "declarative-hashbrown (Code tab)" },
        ],
        tryIt: {
          prompts: ["Show me a Q4 sales dashboard. Include a total-revenue metric card, a pie chart of revenue by segment, and a bar chart of monthly revenue.", "Break down Q4 revenue by product category as a pie chart. Include at least four segments with realistic sample values.", "Show me monthly operating expenses for the last six months as a bar chart with one bar per month."],
          expect: "A Hashbrown-rendered dashboard (metric card, pie and bar charts) streams into the assistant message.",
          fail: "A plan or \"switch to execute mode?\" reply: answer \"yes, execute\". HTTP 404 means :8002 is down.",
        },
        impl: [
          "backend/harness/Agents/ByocHashbrownAgent.cs",
          "frontend/src/app/generative-ui/hashbrown/demo-chat/page.tsx",
          "frontend/src/app/generative-ui/hashbrown/demo-chat/chat.tsx",
          "frontend/src/app/generative-ui/hashbrown/demo-chat/hashbrown-renderer.tsx",
          "frontend/src/app/api/copilotkit-declarative-hashbrown/route.ts",
        ],
      },
    ],
  },
  {
    title: "Generative UI · Open-ended",
    routes: [
      {
        path: "/generative-ui/mcp-apps",
        title: "MCP Apps",
        docPath: "/ms-agent-harness-dotnet/generative-ui/mcp-apps",
        slug: "generative-ui__mcp-apps",
        summary: "MCP tools with UI resources rendered in sandboxed iframes.",
        status: "partial",
        statusNote: HARNESS_RUN_NOTE,
        docGap: `${HARNESS_AGENTS_GAP} ./chat is not published (minimal labelled CopilotChat). The route also registers headless-complete (backend /headless-complete, unpublished). The Intelligence variant uses a TypeScript BuiltInAgent, not a .NET agent.`,
        demos: [
          { href: "/generative-ui/mcp-apps/demo-chat", label: "mcp-apps (Code tab)" },
        ],
        tryIt: {
          prompts: ["Draw a simple flowchart: Start → Process → End", "Sketch a client, a server and a database connected by arrows", "Draw a box labelled \"Idea\" pointing to a box labelled \"Launch\""],
          expect: "The agent calls the Excalidraw MCP tool, and a sandboxed Excalidraw iframe renders the diagram inline.",
          fail: "A plan or \"switch to execute mode?\" reply: answer \"yes, execute\". No iframe means the MCP server (mcp.excalidraw.com) was not reached.",
        },
        impl: [
          "backend/harness/Agents/McpAppsAgent.cs",
          "frontend/src/app/generative-ui/mcp-apps/demo-chat/page.tsx",
          "frontend/src/app/generative-ui/mcp-apps/demo-chat/chat.tsx",
          "frontend/src/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts",
        ],
      },
      {
        path: "/generative-ui/open-generative-ui",
        title: "Open Generative UI",
        docPath: "/ms-agent-harness-dotnet/generative-ui/open-generative-ui",
        slug: "generative-ui__open-generative-ui",
        summary: "Agent-authored sandboxed HTML/JS UI.",
        status: "partial",
        statusNote: HARNESS_RUN_NOTE,
        docGap: `${HARNESS_AGENTS_GAP} ./chat (minimal labelled CopilotChat) and ./design-skill (VISUALIZATION_DESIGN_SKILL, commented out, so the openGenerativeUI prop is empty) are not published.`,
        demos: [
          { href: "/generative-ui/open-generative-ui/demo-chat", label: "open-gen-ui (Code tab)" },
          { href: "/generative-ui/open-generative-ui/demo-chat/advanced", label: "open-gen-ui-advanced (Code tab)" },
        ],
        tryIt: {
          prompts: ["Build me a simple greeting card", "(advanced demo) Calculator (calls evaluateExpression)", "(advanced demo) Ping the host (calls notifyHost)", "(advanced demo) Inline expression evaluator"],
          expect: "A sandboxed iframe renders agent-authored HTML/CSS. In the advanced demo, the sandbox can call evaluateExpression / notifyHost.",
          fail: "A plan or \"switch to execute mode?\" reply: answer \"yes, execute\".",
        },
        impl: [
          "backend/harness/Agents/OpenGenUiAgent.cs",
          "backend/harness/Agents/OpenGenUiAdvancedAgent.cs",
          "frontend/src/app/generative-ui/open-generative-ui/demo-chat/page.tsx",
          "frontend/src/app/generative-ui/open-generative-ui/demo-chat/chat.tsx",
          "frontend/src/app/generative-ui/open-generative-ui/demo-chat/advanced/page.tsx",
          "frontend/src/app/api/copilotkit-ogui/route.ts",
        ],
      },
    ],
  },
  {
    title: "Interactivity",
    routes: [
      {
        path: "/shared-state/rendering-in-app",
        title: "Render agent state in your app",
        docPath: "/ms-agent-harness-dotnet/shared-state/rendering-in-app",
        slug: "shared-state__rendering-in-app",
        summary: "A Canvas outside the chat reading and writing agent.state via useAgent.",
        status: "partial",
        statusNote: "Agent name fixed (HARNESS FIX: agent=\"my_agent\"). The UI-owned initial state and the setState write-back work locally. The Quickstart agent never writes state, because no page publishes a .NET shared-state agent. Not yet re-checked in a browser.",
        docGap: `${DEFAULT_AGENT_NOTE} Neither components/Canvas.tsx nor app/page.tsx has "use client", but Canvas imports useEffect, which Next rejects in a Server Component at build time. "use client" is added to both (labelled). The page publishes no .NET shared-state agent, so the Quickstart agent never writes state. Only the UI-owned initial state and the setState write-back can be observed. The page prints toggleItem as a separate snippet and never wires it into Canvas: the harness puts it inside Canvas and binds it to each <li> (labelled). As printed, toggleItem fails strict (TS7006: implicit any on \`it\`, since agent.state is untyped), so a one-line cast is added (HARNESS FIX).`,
        demos: [{ href: "/shared-state/rendering-in-app/demo-chat", label: "Canvas + sidebar" }],
        tryIt: { prompts: ["(no prompt) Load the page", "Click an item on the canvas to toggle it", "What items are on my canvas?"], expect: "The canvas shows \"Project launch\" with two items, set by the effect through agent.setState. Clicking an item toggles its strike-through, and the agent's answer reflects the toggled state if the .NET hosting forwards state to the model." },
        impl: ["frontend/src/app/shared-state/rendering-in-app/demo-chat/page.tsx", "frontend/src/app/shared-state/components/Canvas.tsx"],
      },
      {
        path: "/shared-state/agent-readonly",
        title: "Agent Read-Only Context",
        docPath: "/ms-agent-harness-dotnet/shared-state/agent-readonly",
        slug: "shared-state__agent-readonly",
        summary: "useAgentContext values the agent reads but cannot write.",
        status: "partial",
        statusNote: "Confirmed by probe: a context value sent through the showcase route came back verbatim (\"Atai\"). The route's own published middleware injects useAgentContext values as a system message in Node, so this works even though the .NET hosting drops RunAgentInput.Context. The UI has not been checked in a browser.",
        docGap: "The Code-tab agent /readonly-state-agent-context is in the unpublished D5ParityAgentFactory, so the showcase runtime routes it to the Quickstart MyAgent at \"/\" (HARNESS EDIT). The route's createReadonlyContextAgent middleware (published) does the context injection. ./demo-layout (ACTIVITIES, DemoLayout) is not published: minimal labelled editable fields. ./suggestions is commented out.",
        demos: [{ href: "/shared-state/agent-readonly/demo-chat", label: "readonly-state-agent-context (Code tab)" }],
        tryIt: { prompts: ["What is my name and timezone?", "What have I been doing recently?", "Change the name field, then ask again"], expect: "The agent answers from the values on the page (Atai, America/Los_Angeles) and follows your edits. It cannot change them.", fail: "\"I don't know your name\" means the context did not reach the agent." },
        impl: ["frontend/src/app/shared-state/agent-readonly/demo-chat/page.tsx", "frontend/src/app/shared-state/agent-readonly/demo-chat/demo-layout.tsx", "frontend/src/app/api/copilotkit-showcase/route.ts"],
      },
      {
        path: "/human-in-the-loop/index",
        title: "HITL Overview",
        docPath: "/ms-agent-harness-dotnet/human-in-the-loop/index",
        slug: "human-in-the-loop__index",
        summary: "useHumanInTheLoop rendering a book_call time picker in the chat.",
        status: "partial",
        statusNote: HARNESS_RUN_NOTE,
        docGap: HARNESS_AGENTS_GAP,
        demos: [
          { href: "/human-in-the-loop/index/demo-chat", label: "hitl-in-chat (Code tab)" },
        ],
        tryIt: {
          prompts: ["Please book an intro call with the sales team to discuss pricing.", "Schedule a 1:1 with Alice next week to review Q2 goals."],
          expect: "A time-picker card renders in the chat via book_call. Picking a slot resolves the tool, and the agent confirms in one sentence.",
          fail: "Prose only means the model did not call book_call. HTTP 404 means :8002 is down.",
        },
        impl: [
          "backend/harness/Agents/HitlInChatAgent.cs",
          "frontend/src/app/human-in-the-loop/index/demo-chat/page.tsx",
          "frontend/src/app/human-in-the-loop/index/demo-chat/time-picker-card.tsx",
          "frontend/src/app/api/copilotkit-showcase-harness/route.ts",
        ],
      },
      {
        path: "/human-in-the-loop/useInterrupt",
        title: "Pausing the Agent for Input",
        docPath: "/ms-agent-harness-dotnet/human-in-the-loop/useInterrupt",
        slug: "human-in-the-loop__useInterrupt",
        summary: "useInterrupt: render an agent interrupt, resolve or cancel it (standard and legacy flows, multi-interrupt), plus the frontend-tool Promise shim.",
        status: "broken",
        statusNote: "Reference-only: the rendered page says \"Not supported on MS Agent Harness (.NET)\" (Human in the Loop: Interrupts). Its frontend handler is a missing snippet and the C# is a method fragment of an unpublished factory.",
        docGap: "The page shows a \"Not supported on MS Agent Harness (.NET)\" callout and no Code tab. The frontend-promise-handler region is missing for .NET (\"snippet skipped\"), so the page prints no schedule_meeting frontend tool. agent/InterruptAgent.cs is only the CreateInterruptAgent() method: its class (InterruptAgentFactory), fields, SystemPrompt and SharedStateAgent are unpublished, and it calls AsLunaChatClient() (defined nowhere) and the Harness-only AsHarnessAgent. The Approve/Cancel and multi-interrupt useInterrupt snippets are fragments with no imports or provider. All kept as text in _doc/; no agent, runtime route or demo.",
        impl: [
          "frontend/src/app/human-in-the-loop/useInterrupt/_doc/InterruptAgent.fragment.cs.txt",
          "frontend/src/app/human-in-the-loop/useInterrupt/_doc/approval-interrupt.fragment.txt",
          "frontend/src/app/human-in-the-loop/useInterrupt/_doc/multi-interrupt.fragment.txt",
        ],
      },
      {
        path: "/human-in-the-loop/governed-actions",
        title: "Governed Action Approval UI",
        docPath: "/ms-agent-harness-dotnet/human-in-the-loop/governed-actions",
        slug: "human-in-the-loop__governed-actions",
        summary: "An approval card for side-effecting actions with allow / deny / require_approval verdicts.",
        status: "partial",
        statusNote: TOOL_OK,
        docGap:
          "The useInterrupt path needs a backend that pauses a run, and the page publishes none, so it is reference-only. handleApproval calls executeSideEffect, which is never defined (reference-only). The useHumanInTheLoop path runs live, since frontend tools are forwarded to the Quickstart agent. Type error kept: the useInterrupt render returns null, but its type requires a ReactElement.",
        demos: [{ href: "/human-in-the-loop/governed-actions/demo-chat", label: "useHumanInTheLoop" }],
        tryIt: {
          prompts: ["Call approve_governed_action with id a1, summary \"Refund $40 to alex@example.com\", tool send_refund, reference POLICY-114, verdict require_approval, arguments {\"amount\":40}", "Same request with id a2 and verdict allow (it should auto-approve)", "Same request with id a3 and verdict deny (it should auto-reject)"],
          expect: "A card renders with Approve and run / Reject. The reply reflects your choice. With verdict allow, it auto-approves. With deny, it auto-rejects.",
        },
        impl: ["frontend/src/app/human-in-the-loop/governed-actions/demo-chat/page.tsx"],
      },
      {
        path: "/webmcp",
        title: "WebMCP",
        docPath: "/ms-agent-harness-dotnet/webmcp",
        slug: "webmcp",
        summary: "Mirroring a frontend tool onto document.modelContext for browser agents.",
        status: "partial",
        statusNote: `${TOOL_OK} Browser-agent discovery needs Chrome 149+ with WebMCP enabled. In other browsers registration is a silent no-op.`,
        docGap: "Both snippets call searchOrders(status), which is never defined. A labelled stub returns fixed orders.",
        demos: [{ href: "/webmcp/demo-chat", label: "OrderSearch + core-only" }],
        tryIt: {
          prompts: ["Find my shipped orders", "Show my open orders", "Do I have any delivered orders?"],
          expect: "The CopilotKit agent calls searchOrders and lists the stub orders. The page reports whether document.modelContext exists.",
        },
        impl: ["frontend/src/app/webmcp/demo-chat/page.tsx", "frontend/src/app/webmcp/demo-chat/OrderSearch.tsx", "frontend/src/app/webmcp/demo-chat/webmcp.ts"],
      },
    ],
  },
  {
    title: "Agent capabilities · MS Agent Harness (.NET)",
    routes: [
      {
        path: "/generative-ui/your-components/display-only",
        title: "Display-only components",
        docPath: "/ms-agent-harness-dotnet/generative-ui/your-components/display-only",
        slug: "generative-ui__your-components__display-only",
        summary: "useComponent: showWeather, showGreeting, and an agent-scoped renderProfile.",
        status: "partial",
        statusNote: TOOL_OK,
        docGap: "ProfileCard in the scoping example is never defined (minimal labelled stand-in). Its agentId \"support-agent\" is not registered, so it is never offered.",
        demos: [{ href: "/generative-ui/your-components/display-only/demo-chat", label: "useComponent" }],
        tryIt: { prompts: ["Use showWeather for Seattle, 54°F, rainy", "Show the weather for Paris: 68°F, sunny", "Use showGreeting to say \"Welcome back, Sam\""], expect: "A weather card renders in the chat." },
        impl: ["frontend/src/app/generative-ui/your-components/display-only/demo-chat/page.tsx", "frontend/src/app/generative-ui/your-components/display-only/demo-chat/weather.tsx"],
      },
      {
        path: "/generative-ui/your-components/interactive",
        title: "Interactive components",
        docPath: "/ms-agent-harness-dotnet/generative-ui/your-components/interactive",
        slug: "generative-ui__your-components__interactive",
        summary: "useHumanInTheLoop gating a command behind Approve / Deny.",
        status: "partial",
        statusNote: TOOL_OK,
        demos: [{ href: "/generative-ui/your-components/interactive/demo-chat", label: "humanApprovedCommand" }],
        tryIt: {
          prompts: ["Use humanApprovedCommand to run `rm -rf /tmp/cache`", "Use humanApprovedCommand to run `npm run build`"],
          expect: "The command shows with Approve / Deny, and the reply follows the button you press.",
        },
        docGap: "The snippet's Page elides its body (\"// ...\") and returns nothing, so TypeScript rejects <Page /> as a component (kept with @ts-expect-error). The hook still registers.",
        impl: ["frontend/src/app/generative-ui/your-components/interactive/demo-chat/page.tsx", "frontend/src/app/generative-ui/your-components/interactive/demo-chat/approved-command.tsx"],
      },
      {
        path: "/generative-ui/a2ui/styling",
        title: "A2UI Styling",
        docPath: "/ms-agent-harness-dotnet/generative-ui/a2ui/styling",
        slug: "generative-ui__a2ui__styling",
        summary: "Theming A2UI surfaces with CSS custom properties on .a2ui-surface.",
        status: "broken",
        statusNote: "Confirmed: importing the page's theme.css fails `next build` for the whole app (\"Invalid empty selector\" at the dark-mode block). Loaded with a <link> here instead, so the rest of the app builds.",
        docGap:
          "The dark-mode example is invalid CSS: `.dark .a2ui-surface, @media (prefers-color-scheme: dark) { … }` puts an at-rule in a selector list. Kept as published in the theme file, so browsers drop that rule.",
        demos: [{ href: "/generative-ui/a2ui/styling/demo-chat", label: "Full theme.css" }],
        tryIt: { prompts: ["Show me a dashboard card with three metrics", "Show a card with a primary button and a status badge"], expect: "Surfaces use Plus Jakarta Sans, 12px radius and black primary buttons." },
        impl: ["frontend/src/app/generative-ui/a2ui/styling/demo-chat/page.tsx", "frontend/src/doc/a2ui/theme.css"],
      },
      {
        path: "/generative-ui/a2ui/advanced",
        title: "A2UI Advanced",
        docPath: "/ms-agent-harness-dotnet/generative-ui/a2ui/advanced",
        slug: "generative-ui__a2ui__advanced",
        summary: "A custom render_a2ui progress renderer and an onAction interceptor.",
        status: "broken",
        statusNote: "The page.tsx snippet throws (CopilotChat not imported). The progress hook listens for render_a2ui while the A2UI pages name the injected tool generate_a2ui. Labelled tabs isolate the interceptors, which have not been checked in a browser.",
        docGap:
          "The page says the dynamic flow's tool is render_a2ui, while the A2UI and Dynamic Schema pages call the injected tool generate_a2ui. The progress hook is kept as published (render_a2ui). The interceptor imports `theme` from \"./theme\", which is not published; a labelled one-line file re-exports defaultTheme from @copilotkit/a2ui-renderer. The src/app/page.tsx snippet uses CopilotChat without importing it.",
        demos: [{ href: "/generative-ui/a2ui/advanced/demo-chat", label: "Progress + onAction" }],
        tryIt: { prompts: ["Show me a dashboard card with three metrics", "Show a flight card with a Book button, then click Book"], expect: "\"Building interface...\" shows while the tool streams, if the tool name matches." },
        impl: [
          "frontend/src/app/generative-ui/a2ui/advanced/demo-chat/page.tsx",
          "frontend/src/components/a2ui-progress.tsx",
          "frontend/src/hooks/use-a2ui-progress.tsx",
          "frontend/src/app/generative-ui/a2ui/advanced/demo-chat/interceptor-local.ts",
          "frontend/src/app/generative-ui/a2ui/advanced/demo-chat/interceptor-forward.ts",
          "frontend/src/app/generative-ui/a2ui/advanced/demo-chat/theme.ts",
        ],
      },
      {
        path: "/agent-app-context",
        title: "Readables (useAgentContext)",
        docPath: "/ms-agent-harness-dotnet/agent-app-context",
        slug: "agent-app-context",
        summary: "Frontend context forwarded in RunAgentInput.Context and injected by a .NET middleware.",
        status: "broken",
        statusNote: "As published, YourComponent throws ReferenceError: useState is not defined (confirmed). The page's .NET middleware itself works: a context secret word sent to :8001 came back verbatim (PAPAYA). Use the labelled \"+ imports supplied\" tab to see it end to end.",
        docGap:
          "YourComponent calls useState and useAgentContext without importing either. As published it throws a ReferenceError on render. The two calls carry @ts-expect-error and nothing else is changed. The doc's Program.cs omits a URL; launchSettings.json sets :8001 so it can run beside the Quickstart agent.",
        demos: [{ href: "/agent-app-context/demo-chat", label: "YourComponent" }],
        tryIt: {
          prompts: ["Who are my colleagues?", "Which of my colleagues is a designer?", "How many colleagues do I have?"],
          expect: "As published, the page throws \"useState is not defined\". The backend half can be checked with the curl call in the README.",
        },
        impl: [
          "backend/agent-app-context/Program.cs",
          "frontend/src/app/agent-app-context/demo-chat/page.tsx",
          "frontend/src/app/agent-app-context/demo-chat/YourComponent.tsx",
          "frontend/src/app/agent-app-context/demo-chat/YourComponentWithImports.tsx",
          "frontend/src/app/api/copilotkit-agent-app-context/[[...slug]]/route.ts",
        ],
      },
      {
        path: "/copilot-runtime",
        title: "Copilot Runtime",
        docPath: "/ms-agent-harness-dotnet/copilot-runtime",
        slug: "copilot-runtime",
        summary: "The runtime route, routing keys, the default agent, built-in middleware, and direct connections.",
        status: "partial",
        statusNote: "GET /api/copilotkit/info verified: agents = [my_agent], intelligence on. The direct-connection snippet's URL is a placeholder.",
        docGap:
          "The direct-connection snippet points an HttpAgent at https://my-agent.example.com, and <YourApp /> is never defined. The demo keeps the snippet and adds a second instance at the Quickstart agent, labelled. The .NET server sets no CORS, so a browser-direct call is expected to fail.",
        demos: [{ href: "/copilot-runtime/demo-chat", label: "/info + direct connection" }],
        tryIt: {
          prompts: ["(Provider + REST transport tab) Say hello", "(Without useSingleEndpoint tab) Say hello", "(Direct · localhost:8000 tab) Say hello"],
          expect: "GET /api/copilotkit/info lists \"my_agent\". The direct-connection panel shows a browser fetch or CORS error.",
        },
        impl: ["frontend/src/app/copilot-runtime/demo-chat/page.tsx"],
      },
      {
        path: "/ag-ui",
        title: "AG-UI",
        docPath: "/ms-agent-harness-dotnet/ag-ui",
        slug: "ag-ui",
        summary: "useAgent's AbstractAgent, and subscribing to its AG-UI event stream.",
        status: "partial",
        statusNote: "Agent id fixed (HARNESS FIX: \"research-agent\" → my_agent), so the published EventLog now logs to the console. The my_agent panel shows the stream on screen. Not yet checked in a browser.",
        docGap:
          "Both snippets use agentId \"research-agent\", which no runtime registers, and both components return nothing, so TS rejects them as JSX components (kept with @ts-expect-error). A labelled panel subscribes to my_agent so the event stream can be seen.",
        demos: [{ href: "/ag-ui/demo-chat", label: "Event log" }],
        tryIt: {
          prompts: ["Tell me a joke", "Count from one to five", "Explain AG-UI in one sentence"],
          expect: "The my_agent panel lists RUN_STARTED, TEXT_MESSAGE_* and RUN_FINISHED. With the agent-id fix, the published EventLog logs \"Streaming text:\" lines to the console.",
        },
        impl: ["frontend/src/app/ag-ui/demo-chat/page.tsx"],
      },
    ],
  },
  {
    title: "Doc Sync",
    routes: [
      {
        path: "/doc-sync",
        title: "Doc drift",
        docPath: "/ms-agent-harness-dotnet",
        slug: "index",
        summary:
          "Re-fetches the markdown behind every tracked doc page and diffs it against the stored snapshot, flagging changes inside code blocks.",
        status: "reference",
      },
    ],
  },
];

export const ALL_ROUTES: RouteMeta[] = NAV.flatMap((g) => g.routes);

export function findRoute(path: string): RouteMeta | undefined {
  return ALL_ROUTES.find((r) => r.path === path);
}

export function docUrl(route: RouteMeta): string {
  return `https://docs.copilotkit.ai${route.docPath}`;
}
