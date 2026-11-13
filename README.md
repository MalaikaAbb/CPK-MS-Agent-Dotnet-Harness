# CopilotKit + MS Agent Harness (.NET) Test Suite

A navigable test harness for **every page of [docs.copilotkit.ai/ms-agent-harness-dotnet](https://docs.copilotkit.ai/ms-agent-harness-dotnet)** that this repo tracks. It runs each page's published code where that code can run, and shows exactly why where it can't.

| | |
| --- | --- |
| **Docs synced** | 2026-11-10: 46 pages (45 routes + the docs root), baseline taken by the in-app doc sync (`doc-snapshot/manifest.json`; open `/doc-sync` to re-check). Code-tab extracts in `doc-snapshot/code/` date from 2026-11-05 |
| **Backend** | .NET SDK 10.0.113 (target `net10.0`) · `Microsoft.Agents.AI.Hosting.AGUI.AspNetCore` `1.19.0-preview.260822.1` · `Microsoft.Agents.AI.OpenAI` `1.19.0` (both pinned by the Quickstart) · **backend/harness:** the same packages on the 1.9 line + `Microsoft.Agents.AI.Harness` `1.9.0-preview.260603.1` |
| **Frontend** | Next.js `16.3.2` · React `19.2.8` · `@copilotkit/react-core` / `runtime` / `react-ui` / `a2ui-renderer` / `core` `1.84.1` · `@ag-ui/client` `1.0.2` · `zod` `3.25.76` · `rxjs` `7.8.1` · `recharts` `3.10.1` · `maplibre-gl` `5.24.0` · `@hashbrownai/*` `0.5.0-beta.4` · `@json-render/*` `0.18.0` · `zod4` (alias of `zod` `4.6.7`) |
| **Verified** | `dotnet build` ✅ (all three servers) · `next build` ✅ (as of 2026-11-05, before the 2026-11-10 restructure; since then only `tsc --noEmit` ✅ has been run) · AG-UI curl probes ✅ (see §8) |
| **Status** | 33 ⚠️ partial (runnable; UI not yet checked in a browser) · 12 ❌ broken (run, but fail as published) · 0 reference-only: every page has a live demo |

---

## 2. Overview

"MS Agent Harness (.NET)" is CopilotKit's integration track for Microsoft Agent Framework agents built with **Microsoft Agent Harness** (`chatClient.AsHarnessAgent(...)`) and served over AG-UI by ASP.NET Core. The CopilotKit runtime connects to them with a plain `HttpAgent`.

This repo is a QA instrument for that doc track. Every tracked page has a route that shows its status, its documentation gaps, this repo's implementation, and every code block the page publishes, byte-for-byte. Where the code can run, a chrome-free demo route runs it.

**The rules this repo follows** (set by the repo owner):

- Doc code is copied **verbatim, bugs included**. Type errors are kept with a localized `@ts-expect-error` that names the reason. Runtime errors are left to happen.
- Anything a page uses but never publishes is **commented out** (suggestions hooks) or **written minimally and labelled `HARNESS-AUTHORED`** (leaf components, stubs like `searchOrders`). No CopilotKit API call in doc code is "fixed".
- **Backend: only what the docs publish.** Three servers run published C#:
  - The Quickstart's `Program.cs` in `backend/`.
  - Agent App Context's `Program.cs` in `backend/agent-app-context/`.
  - The 8 per-feature Harness agents in `backend/harness/`, byte-for-byte. Its `Program.cs` is assembled only from published showcase and Quickstart lines (§9.2).

  What can't be built (the showcase `Program.cs`, `DeclarativeGenUiAgent`, the `ChartAgent` fragments) stays in `backend/docs_verbatim/`, uncompiled.
- **`Microsoft.Agents.AI.Harness` is installed in `backend/harness/` only** (decided by the repo owner). No page names a version. 1.9.0-preview is the last one where the published call compiles, and that forces the whole 1.9 package line there (§9.2).

Doc root: <https://docs.copilotkit.ai/ms-agent-harness-dotnet>

---

## 3. Architecture

```
Browser ── Next.js app (:3000) ─────────────────────────────────────────────
             /                    home + live connection check
             /<doc path>                    notes page for each doc page (app/<doc path>/page.tsx)
             /<doc path>/demo-chat[/<variant>]  chrome-free demo that runs the doc's code
             /doc-sync                      re-fetch the docs and diff against doc-snapshot/
             │
             │ CopilotKit runtimes (Next route handlers)
             ├─ /api/copilotkit/[[...slug]]          Quickstart route, VERBATIM
             │     my_agent → HttpAgent :8000 · CopilotKitIntelligence + identifyUser
             ├─ /api/copilotkit-showcase             Code-tab route.ts, VERBATIM except basePath
             │     30 agent ids. Those mapped to "/" reach :8000; the rest hit paths that
             │     do not exist (/reasoning, /hitl-in-chat, …) → HTTP 404
             ├─ /api/copilotkit-genui/[[...slug]]    Transports page's runtime snippet (default → :8000)
             ├─ /api/copilotkit-a2ui/[[...slug]]     A2UI page's runtime snippet (injectA2UITool)
             ├─ /api/copilotkit-agent-app-context/…  Quickstart route → :8001
             │
             │ Harness agents (all → :8002)
             ├─ /api/copilotkit-showcase-harness     2nd copy of the Code-tab route.ts (reasoning-*, hitl-in-chat)
             ├─ /api/copilotkit-mcp-apps/[[...slug]] VERBATIM page route (AGENT_URL default edit)
             ├─ /api/copilotkit-ogui                 VERBATIM page route (AGENT_URL default edit)
             ├─ /api/copilotkit-declarative-hashbrown, -json-render   VERBATIM page routes (same edit)
             └─ /api/copilotkit-a2ui-fixed-schema    Fixed Schema page's runtime snippet
                  │
                  │ AG-UI over SSE (HttpAgent)
                  ▼
   backend/quickstart/         (:8000) Quickstart Program.cs, verbatim: MyAgent, gpt-5.4-mini
   backend/agent-app-context/  (:8001) Agent App Context Program.cs, verbatim: InjectContextMiddleware
   backend/harness/            (:8002) 8 Code-tab Harness agents, verbatim, on Agent Framework 1.9 + Harness 1.9-preview
                  │
                  ▼
               OpenAI
```

**The backend language for this integration is C# / ASP.NET Core.** The Quickstart's `.NET` tab has a Python tab beside it. This repo follows the `.NET` tab.

**There's no CopilotKit provider at the app root.** Almost every doc demo mounts its own `<CopilotKit>` / `<CopilotKitProvider>`, so each demo route mounts exactly the provider its page shows. Prose snippets that come without a provider run inside the Quickstart's `Providers` (`frontend/src/doc/quickstart/providers.tsx`, verbatim). This also keeps one Inspector per page.

**Why `/api/copilotkit` belongs to the Quickstart and the showcase runtime moved.** Almost every prose snippet (drawer, components, copilot-runtime, a2ui) means the user's Quickstart runtime at `/api/copilotkit`. The Code-tab `route.ts` claims the same path, and Next can't host both. The showcase file moved to `/api/copilotkit-showcase`, which takes one `basePath` edit. The six live Code-tab demos each get one `runtimeUrl` edit. Both edits are marked `HARNESS EDIT`.

---

## 4. Prerequisites

| Requirement | Version | Notes |
| --- | --- | --- |
| .NET SDK | 9.0+ (verified on 10.0.113) | The Quickstart asks for 9.0+. `dotnet new web` on this machine targets `net10.0`. |
| Node.js | 20+ (verified on v24) | |
| npm | bundled | With npm 12 you may need `--allow-remote=all` when adding packages. |
| OpenAI API key | | Required by both .NET servers. |
| CopilotKit Intelligence key (`CPK_INTELLIGENCE_API_KEY`) | | **Required.** The Quickstart runtime constructs `CopilotKitIntelligence` with it, unconditionally. Threads need it. Get one with `npx copilotkit@latest project select`. |

---

## 5. Setup

```bash
# 1. Clone
git clone <this-repo> ms-dot-net-harness && cd ms-dot-net-harness

# 2. Frontend dependencies
npm --prefix frontend install

# 3. Backend dependencies (three projects)
dotnet restore backend
dotnet restore backend/agent-app-context
dotnet restore backend/harness

# 4. Keys
cd backend/quickstart && dotnet user-secrets set OPENAI_API_KEY "sk-..." && cd ..
cd backend/agent-app-context && dotnet user-secrets set OPENAI_API_KEY "sk-..." && cd ..
cd backend/harness && dotnet user-secrets set OPENAI_API_KEY "sk-..." && cd ..
cp .env.example frontend/.env.local      # then keep only CPK_INTELLIGENCE_API_KEY, filled in
```

**Simpler: one root `.env`.** `cp .env.example .env` and fill in `OPENAI_API_KEY`,
`OPENAI_TRANSCRIPTION_API_KEY=${OPENAI_API_KEY}` and `CPK_INTELLIGENCE_API_KEY`. The root `npm run …` scripts
load it through `tools/with-env.sh`. Environment variables override `dotnet user-secrets`, so this one file
is all you need to change when a key rotates. Restart every process after editing it.

| Variable | Where | Required | What it does |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | user-secrets of `backend/` and `backend/agent-app-context/` (or env) | yes | Read by `builder.Configuration["OPENAI_API_KEY"]` in both doc `Program.cs` files. |
| `CPK_INTELLIGENCE_API_KEY` | `frontend/.env.local` | yes | Intelligence project key used by the Quickstart runtime and the Agent App Context runtime. |
| `AGENT_URL` | `frontend/.env.local` | no | Showcase runtime's agent base URL. Defaults to `http://localhost:8000`. |
| `OPENAI_TRANSCRIPTION_API_KEY` | `frontend/.env.local` | for `/voice` | Read by the Voice page's `transcription-service.ts`. Without it the runtime offers no transcription, so no mic button. Your OpenAI key works. |
| `COPILOTKIT_TELEMETRY_DISABLED` | `frontend/.env.local` | no | Set to `true` to opt out of runtime telemetry. |

**Default ports:** frontend **3000**, Quickstart agent **8000** (hardcoded by the doc's `app.Run("http://localhost:8000")`), Agent App Context agent **8001** and Harness agents **8002** (both set in `launchSettings.json`, because their `app.RunAsync()` names no URL).

---

## 6. Running the project

Three terminals:

```bash
dotnet run --project backend/quickstart                                              # :8000
dotnet run --project backend/agent-app-context --launch-profile http      # :8001
dotnet run --project backend/harness --launch-profile http                # :8002
npm --prefix frontend run dev                                             # :3000
```

(Or `npm run agent`, `npm run agent:context`, `npm run agent:harness` and `npm run dev` from the repo root. You only need :8002 for the 8 Harness-agent pages.)

A successful start looks like this:

```
# backend: the doc's app.Run(url) prints no "Now listening" line; this is the last line
info: Microsoft.Hosting.Lifetime[0]
      Content root path: …/ms-dot-net-harness/backend
# backend/agent-app-context
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:8001
# backend/harness
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:8002
# frontend
▲ Next.js 16.3.2 (Turbopack)
- Local:  http://localhost:3000
✓ Ready
```

Open **<http://localhost:3000>**. The connection check at the top probes :8000 and :8001 (any HTTP status means up; the AG-UI endpoints answer GET with 405) and checks the Intelligence key.

Quick check without a browser:

```bash
curl -s localhost:3000/api/copilotkit/info | grep -o '"agents":{[^}]*'   # → "my_agent"
```

---

## 7. What to expect: walkthrough per section

Every notes page shows the status badge, a link to the live doc, a red **Documentation gap** box, a Try-it block, this repo's implementation files, and every code block the page publishes. Demo routes open in a new tab and carry a "← Notes" pill.

### Getting Started

**`/quickstart`** runs the Quickstart's bring-your-own `.NET` server, its runtime route, `providers.tsx` and a `CopilotSidebar` page, all verbatim.
*Try:* open the demo and ask `Can you tell me a joke?`
*Pass:* the reply streams into the docked sidebar. *Fail:* "I'm having trouble connecting", or nothing streams. Check :8000 and `CPK_INTELLIGENCE_API_KEY`.

### Prebuilt Components

**`/prebuilt-components/chat`, `/sidebar`, `/popup`** run each page's Code-tab demo. Their agent ids route to backend `/`, which here is `MyAgent`.
*Try:* send any message. *Pass:* chat fills the screen, the sidebar starts open, or the popup starts open with the placeholder "Ask the popup anything...". *Fail:* an agent-discovery error, which means the showcase runtime isn't reachable.

**`/prebuilt-components/chat-controls`**: one surface. "Ask the assistant (Popup)" drives a controlled `CopilotPopup`, an "Open/Close Sidebar" toggle drives a left-docked `CopilotSidebar` through `setModalOpen`, and the sidebar's thumbs feed a "Feedback recorded" list.
*Pass:* both buttons open and close their chat, the toggle's label follows the sidebar, and each thumb click adds a 👍/👎 line with the message id. *Fail:* no buttons at all, meaning `useCopilotChatConfiguration()` found no modal state.

### Custom Look and Feel

**`/custom-look-and-feel/css`**: the Code-tab "Halcyon" theme, plus a snippets route with the `globals.css` blocks, icons and labels.
*Pass:* parchment palette, and user messages in mono with a copper `→`. On the snippets route the v1 `CopilotKitCSSProperties` tab shows a ReferenceError, as published.

**`/custom-look-and-feel/slots`**: the Code-tab "slot atlas" (13 minimal labelled wrappers), plus every page snippet in tabs.
*Pass:* each overridden slot has a dashed, named outline.

**`/custom-look-and-feel/markdown`**: `components` map, class string, and `PlainText` replacement.
*Try:* `Reply with a level-2 heading and a link`. *Pass:* an orange `.my-link` and a violet `.my-heading`, raw markdown in the PlainText tab.

**`/custom-look-and-feel/headless-ui`**: the Code-tab `headless-complete` page, with its published `MessageList` + `useRenderedMessages`, on `MyAgent`. `Chat` (the composer) is unpublished, so a minimal labelled one is built from the hooks the page names (`useAgent`, `useCopilotKit().runAgent`). The three optional hooks are commented out. The live doc page itself shows "Missing snippet" errors.
*Try:* `Tell me a short joke`. *Pass:* a dark user bubble, a pulsing dot, then a grey reply bubble, with no CopilotChat chrome.

**`/custom-look-and-feel/reasoning-messages`** (and `/generative-ui/reasoning`, which shares the demos): the Code-tab `reasoning-default` / `reasoning-custom` pages on `backend/harness`'s `/reasoning`.
*Try:* `Is 17 prime?`. *Pass:* a reasoning card streams the thinking, then the answer follows. (Before the `DisableWebSearch` remedy, this ended in `400 web_search_options`.)

### Chat

**`/multimodal-attachments`** has eight tabs, one per snippet.
*Try:* attach a PNG and ask what's in it. *Expected (broken):* the reply says it sees no image. The .NET hosting drops image parts silently.

**`/voice`**: the Code-tab voice page on its published runtime route. Transcription runs in Node (`@copilotkit/voice` + `openai` 5.x) and reads `OPENAI_TRANSCRIPTION_API_KEY`. The agent is `MyAgent`, via one labelled URL edit, because the doc's voice agent is unpublished. `VoiceChat` is a minimal `<CopilotChat />`.
*Try:* click the mic, say "What is the capital of France?", then stop. *Pass:* the transcript fills the composer and sends, and the agent replies. *Fail:* no mic button means `GET /api/copilotkit-voice/info` shows `audioFileTranscriptionEnabled: false` (the key is missing).

**`/generative-ui/reasoning`**: see Reasoning Messages above.

### Threads

**`/prebuilt-components/copilot-threads-drawer`** mounts the three `app/page.tsx` examples as real pages, plus a fragments route.
*As published* each example names no agent, so it resolves `"default"` and throws `Agent 'default' not found`. **HARNESS FIX** adds `agentId="my_agent"`, the page's own remedy. *Pass:* the drawer lists `my_agent`'s threads, and selecting one replays it. The new-button page returns 500 (`Attempted to call useCopilotChatConfiguration() from the server`).

**`/headless-threads`**: `ThreadSidebar` + `App`, pagination, and per-thread `useAgent`.
*As published* `"my-agent"` and `"default"` aren't registered. **HARNESS FIX** changes them to `my_agent`. *Pass:* the list shows `my_agent`'s threads, and Rename / Archive work. Clicking a row still doesn't switch the chat (no `onSelectThread` prop).

**`/frontend-tools`**: the Code-tab `change_background` demo.
*Try:* `Change the background to a sunset gradient`. *Pass:* the page background changes.

### Generative UI

**`/generative-ui/tool-based`**: the Code-tab demo, with `useComponent` registering `render_bar_chart` and `render_pie_chart`, on `MyAgent`. The doc's chart agent is unpublished, so the showcase runtime routes `gen-ui-tool-based` to `/` (one labelled edit). `bar-chart.tsx` and `pie-chart.tsx` are minimal Recharts stand-ins.
*Try:* `Use render_bar_chart to chart quarterly revenue: Q1 120, Q2 145, Q3 138, Q4 190`. *Pass:* a bar chart renders inline. *Fail:* a table or prose, meaning the model didn't call the tool. `MyAgent`'s prompt doesn't mention it, so name the tool.

**`/generative-ui/tool-rendering`**: four demos (the three Code-tab pages plus the page-body `app/page.tsx` + `tool-renderers.tsx`). Their agent is a **harness-authored** `backend/quickstart/ToolRenderingAgent.cs`, added at the owner's request: the Quickstart's agent plus one sample `get_weather` tool returning the showcase's published `WeatherInfo`, at `/tool-rendering`, the doc route's own path.
*Try:* `What's the weather in Tokyo?`. *Pass:* a weather card (sample data: 22°, partly cloudy), then a one-line summary. Flights, stocks and dice still have no tool behind them.

**`/generative-ui/components/*` (8 pages)**: each page's provider snippets, verbatim, around a chat.
*As published* the agent lookup for `"default"` fails, and **HARNESS FIX** adds `agentId="my_agent"`. *Expected (still broken):* in the Transports page's own runtime (which does register `default`) the agent runs but never sees the catalog, because the .NET hosting drops run context. Browser-only parts (fallbacks, the exported catalog JSON, the harness cart) still render.

**`/generative-ui/a2ui`**: the provider-catalog setup (as published, plus a labelled tab with the Quickstart's provider props), and the runtime `injectA2UITool` setup.
*Try:* `Show me a dashboard card with three metrics and a status badge`.
*Pass (labelled tabs):* a generate_a2ui call, then a surface. *As published* the provider named no agent; **HARNESS FIX** adds `agent="my_agent"`, but it still omits `useSingleEndpoint={false}`.

**`/generative-ui/a2ui/dynamic-schema`**: the Code-tab page and its verbatim catalog, on `MyAgent`. `DeclarativeGenUiAgent` can't be built (it needs unpublished helpers), so a labelled route sends `declarative-gen-ui` to `MyAgent`, and per the page, the catalog makes the runtime inject `generate_a2ui`.
*Try:* `Use generate_a2ui to show a status dashboard with three metrics`. *Pass:* a progress indicator, then a dashboard surface.

**`/generative-ui/a2ui/fixed-schema`, `/json-render`, `/hashbrown`, `/mcp-apps`, `/open-generative-ui`** (two demos): each runs the page's Code-tab frontend on its published runtime route, against its verbatim Harness agent on :8002.
*Try:* the page's own prompts (a flight; a revenue chart; an Excalidraw sketch; a visualisation).
*Expected:* the agents run, now that the `DisableWebSearch` remedy is in place. With the todo and agent-mode providers also off (see §9), the first turn goes straight to the demo's own tools. There's no plan and no "may I switch to execute mode?" step.

### Interactivity

**`/shared-state/rendering-in-app`**: `Canvas` + sidebar. *As published* `useAgent()` throws for `"default"`; **HARNESS FIX** adds `agent="my_agent"`. *Pass:* the canvas shows "Project launch" with two items. The agent never writes state.

**`/shared-state/agent-readonly`**: the Code-tab page on `MyAgent`. The showcase route's own `createReadonlyContextAgent` middleware injects the `useAgentContext` values as a system message in Node, so this works despite the .NET context drop (confirmed: a secret value came back as "Atai"). `DemoLayout` is a minimal labelled stand-in.
*Try:* `What is my name and timezone?`, then edit the name field and ask again. *Pass:* the answers follow the page's values.

**`/human-in-the-loop/index`**: the Code-tab `hitl-in-chat` demo on :8002. *Pass:* the agent calls the frontend `book_call` tool, and the time picker renders (confirmed by probe at the tool-call level).

**`/human-in-the-loop/governed-actions`**: the `useHumanInTheLoop` path runs live.
*Try:* the prompt on the notes page (verdict `require_approval`). *Pass:* an approval card, and the reply follows your choice. `allow` and `deny` auto-resolve.

**`/webmcp`**: `OrderSearch` (verbatim) with a labelled `searchOrders` stub.
*Try:* `Find my shipped orders`. *Pass:* order A-1002 is listed. The banner says whether `document.modelContext` exists.

### Agent capabilities

**`/generative-ui/your-components/display-only`**. *Try:* `Use showWeather for Seattle, 54°F, rainy`. *Pass:* a weather card in the chat.

**`/generative-ui/your-components/interactive`**. *Try:* `Use humanApprovedCommand to run rm -rf /tmp/cache`. *Pass:* Approve and Deny buttons, and the reply follows your choice.

**`/generative-ui/a2ui/styling`**: the page's theme.css, loaded with a `<link>`, because importing it breaks `next build`.

**`/generative-ui/a2ui/advanced`**: `page.tsx` as published (throws), the progress hook, and the two `onAction` interceptors.

**`/multi-agent/subagents`**: reference-only. Shows the Code tab's `page.tsx` and `delegation-log.tsx` (kept in `_doc/`, not mounted) and `SubagentsAgent.cs` (in `backend/docs_verbatim/`). Nothing to try: the agent cannot be built. *Pass:* the route opens and lists the three files.

**`/agent-app-context`**. *As published:* `ReferenceError: useState is not defined`. In the "+ imports supplied" tab, ask `Who are my colleagues?`. *Pass:* John Doe, Jane Smith and Bob Wilson, read through the page's .NET `InjectContextMiddleware` on :8001.

**`/copilot-runtime`**: `/info` viewer, REST vs single-endpoint transport, and direct connections.
*Pass:* `/info` lists `my_agent`. The direct connection to :8000 fails with a CORS error, because the .NET server sets no CORS.

**`/ag-ui`**. *Pass:* the labelled panel lists `RUN_STARTED → TEXT_MESSAGE_* → RUN_FINISHED`. The published `EventLog` (agent id fixed from `research-agent` to `my_agent`) logs `Streaming text:` to the console.

---

## 8. Testing checklist / current status

Generated from `frontend/src/lib/nav-config.ts` by `python3 tools/status-table.py` (the same data feeds the app's `/status` page). Regenerate it after changing a status.

| Doc page | Route | Status | Notes |
| --- | --- | --- | --- |
| [Quickstart (bring your own agent)](https://docs.copilotkit.ai/ms-agent-harness-dotnet/quickstart?agent=bring-your-own) | `/quickstart` | ⚠️ Partial | Backend verified (PONG over AG-UI). The Intelligence runtime accepted a run (joinToken issued). Events then flow over Intelligence's WebSocket, which only a browser follows, so the chat UI is unchecked. |
| [CopilotChat](https://docs.copilotkit.ai/ms-agent-harness-dotnet/prebuilt-components/chat) | `/prebuilt-components/chat` | ⚠️ Partial | Code-tab demo on MyAgent. Runtime→.NET chain curl-verified; UI not browser-checked. |
| [CopilotSidebar](https://docs.copilotkit.ai/ms-agent-harness-dotnet/prebuilt-components/sidebar) | `/prebuilt-components/sidebar` | ⚠️ Partial | Code-tab demo on MyAgent. Runtime→.NET chain curl-verified; UI not browser-checked. |
| [CopilotPopup](https://docs.copilotkit.ai/ms-agent-harness-dotnet/prebuilt-components/popup) | `/prebuilt-components/popup` | ⚠️ Partial | Code-tab demo on MyAgent. Runtime→.NET chain curl-verified; UI not browser-checked. |
| [Open, close, and feedback](https://docs.copilotkit.ai/ms-agent-harness-dotnet/prebuilt-components/chat-controls) | `/prebuilt-components/chat-controls` | ⚠️ Partial | Runs on the Quickstart provider (my_agent). The backend is verified, but the UI has not been checked in a browser. |
| [CSS Customization](https://docs.copilotkit.ai/ms-agent-harness-dotnet/custom-look-and-feel/css) | `/custom-look-and-feel/css` | ⚠️ Partial | Code-tab demo on MyAgent. Runtime→.NET chain curl-verified; UI not browser-checked. |
| [Slots (Subcomponents)](https://docs.copilotkit.ai/ms-agent-harness-dotnet/custom-look-and-feel/slots) | `/custom-look-and-feel/slots` | ⚠️ Partial | Code-tab demo on MyAgent. Runtime→.NET chain curl-verified; UI not browser-checked. |
| [Markdown Rendering](https://docs.copilotkit.ai/ms-agent-harness-dotnet/custom-look-and-feel/markdown) | `/custom-look-and-feel/markdown` | ⚠️ Partial | Runs on the Quickstart provider (my_agent). The backend is verified, but the UI has not been checked in a browser. |
| [Headless UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/custom-look-and-feel/headless-ui) | `/custom-look-and-feel/headless-ui` | ⚠️ Partial | The published message rendering (message-list.tsx + use-rendered-messages.tsx) runs on the Quickstart MyAgent. The composer is a minimal labelled stand-in. Not yet checked in a browser. |
| [Reasoning Messages](https://docs.copilotkit.ai/ms-agent-harness-dotnet/custom-look-and-feel/reasoning-messages) | `/custom-look-and-feel/reasoning-messages` | ⚠️ Partial | Runs on backend/harness (Harness 1.9-preview + DisableWebSearch remedy, curl-verified). Agents often plan first and ask to switch to execute mode (Harness default). |
| [Multimodal Attachments](https://docs.copilotkit.ai/ms-agent-harness-dotnet/multimodal-attachments) | `/multimodal-attachments` | ❌ Broken | Confirmed with curl: a user message with an image content part streams a normal reply, but the image never reaches the model ("I don't see an image attached"). There is no RUN_ERROR, so the failure is silent. |
| [Voice](https://docs.copilotkit.ai/ms-agent-harness-dotnet/voice) | `/voice` | ⚠️ Partial | Runs on the Quickstart MyAgent, via the published voice route with one labelled URL edit. Needs OPENAI_TRANSCRIPTION_API_KEY in frontend/.env.local. Not yet checked in a browser. |
| [Reasoning](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/reasoning) | `/generative-ui/reasoning` | ⚠️ Partial | Runs on backend/harness (Harness 1.9-preview + DisableWebSearch remedy, curl-verified). Agents often plan first and ask to switch to execute mode (Harness default). |
| [Threads Drawer](https://docs.copilotkit.ai/ms-agent-harness-dotnet/prebuilt-components/copilot-threads-drawer) | `/prebuilt-components/copilot-threads-drawer` | ⚠️ Partial | Agent name fixed (HARNESS FIX: agentId="my_agent"). As published it threw "Agent 'default' not found". The new-button page still returns 500 ("Attempted to call useCopilotChatConfiguration() from the server"). Not yet re-checked in a browser. |
| [Headless Threads](https://docs.copilotkit.ai/ms-agent-harness-dotnet/headless-threads) | `/headless-threads` | ⚠️ Partial | Agent ids fixed (HARNESS FIX: "my-agent" and runtimeAgentId "default" → my_agent). Selecting a row still does nothing, because the published ThreadSidebar has no onSelectThread prop. Not yet re-checked in a browser. |
| [Frontend Tools](https://docs.copilotkit.ai/ms-agent-harness-dotnet/frontend-tools) | `/frontend-tools` | ⚠️ Partial | Code-tab demo on MyAgent. Frontend tool reaches the model (curl-verified); UI not browser-checked. |
| [Components as Tools](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/tool-based) | `/generative-ui/tool-based` | ⚠️ Partial | Runs on the Quickstart MyAgent, via the showcase runtime with one labelled routing edit. useComponent tools are frontend tools, and the curl probe showed frontend tools reach MyAgent. Not yet checked in a browser. |
| [Tool Call Rendering](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/tool-rendering) | `/generative-ui/tool-rendering` | ⚠️ Partial | get_weather works end to end (curl-verified: TOOL_CALL get_weather, then a WeatherInfo result). The other renderers (search_flights, get_stock_price, roll_d20) still have no tool behind them. Not yet checked in a browser. |
| [Surfaces](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/surfaces) | `/generative-ui/components/surfaces` | ❌ Broken | Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below. |
| [Catalogs](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/catalogs) | `/generative-ui/components/catalogs` | ❌ Broken | Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below. |
| [Standard catalog](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/standard-catalog) | `/generative-ui/components/standard-catalog` | ❌ Broken | Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below. |
| [State and actions](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/state-and-actions) | `/generative-ui/components/state-and-actions` | ❌ Broken | Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below. |
| [Theming](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/theming) | `/generative-ui/components/theming` | ❌ Broken | "default" agent not registered + .NET drops run context. |
| [Transports](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/transports) | `/generative-ui/components/transports` | ❌ Broken | Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below. |
| [Markdown mode](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/markdown-mode) | `/generative-ui/components/markdown-mode` | ❌ Broken | "default" agent not registered + .NET drops run context. |
| [Adopt from A2UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/from-a2ui) | `/generative-ui/components/from-a2ui` | ❌ Broken | Agent name fixed (HARNESS FIX). Still broken: the .NET hosting drops run context, so the catalog never reaches the model. Details below. |
| [A2UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/a2ui) | `/generative-ui/a2ui` | ⚠️ Partial | Agent name fixed on the as-published tab (HARNESS FIX). That tab still omits useSingleEndpoint={false}, which the Copilot Runtime page says a multi-route runtime needs. The second tab has both. Not yet checked in a browser. |
| [Dynamic Schema A2UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/a2ui/dynamic-schema) | `/generative-ui/a2ui/dynamic-schema` | ⚠️ Partial | Frontend-only path on the Quickstart MyAgent. Per the page, the provider catalog makes the runtime inject generate_a2ui. Not yet checked in a browser, and a raw request cannot exercise it, because the catalog comes from the browser's provider. |
| [Fixed Schema A2UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/a2ui/fixed-schema) | `/generative-ui/a2ui/fixed-schema` | ⚠️ Partial | Runs on backend/harness (Harness 1.9-preview + DisableWebSearch remedy, curl-verified). Agents often plan first and ask to switch to execute mode (Harness default). |
| [JSON Render](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/json-render) | `/generative-ui/json-render` | ⚠️ Partial | Runs on backend/harness (Harness 1.9-preview + DisableWebSearch remedy, curl-verified). Agents often plan first and ask to switch to execute mode (Harness default). |
| [Hashbrown](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/hashbrown) | `/generative-ui/hashbrown` | ⚠️ Partial | Runs on backend/harness (Harness 1.9-preview + DisableWebSearch remedy, curl-verified). Agents often plan first and ask to switch to execute mode (Harness default). |
| [MCP Apps](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/mcp-apps) | `/generative-ui/mcp-apps` | ⚠️ Partial | Runs on backend/harness (Harness 1.9-preview + DisableWebSearch remedy, curl-verified). Agents often plan first and ask to switch to execute mode (Harness default). |
| [Open Generative UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/open-generative-ui) | `/generative-ui/open-generative-ui` | ⚠️ Partial | Runs on backend/harness (Harness 1.9-preview + DisableWebSearch remedy, curl-verified). Agents often plan first and ask to switch to execute mode (Harness default). |
| [Render agent state in your app](https://docs.copilotkit.ai/ms-agent-harness-dotnet/shared-state/rendering-in-app) | `/shared-state/rendering-in-app` | ⚠️ Partial | Agent name fixed (HARNESS FIX: agent="my_agent"). The UI-owned initial state and the setState write-back work locally. The Quickstart agent never writes state, because no page publishes a .NET shared-state agent. Not yet re-checked in a browser. |
| [Agent Read-Only Context](https://docs.copilotkit.ai/ms-agent-harness-dotnet/shared-state/agent-readonly) | `/shared-state/agent-readonly` | ⚠️ Partial | Confirmed by probe: a context value sent through the showcase route came back verbatim ("Atai"). The route's own published middleware injects useAgentContext values as a system message in Node, so this works even though the .NET hosting drops RunAgentInput.Context. The UI has not been checked in a browser. |
| [HITL Overview](https://docs.copilotkit.ai/ms-agent-harness-dotnet/human-in-the-loop/index) | `/human-in-the-loop/index` | ⚠️ Partial | Runs on backend/harness (Harness 1.9-preview + DisableWebSearch remedy, curl-verified). Agents often plan first and ask to switch to execute mode (Harness default). |
| [Governed Action Approval UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/human-in-the-loop/governed-actions) | `/human-in-the-loop/governed-actions` | ⚠️ Partial | Frontend tool reaches the model (curl-verified); UI not browser-checked. |
| [WebMCP](https://docs.copilotkit.ai/ms-agent-harness-dotnet/webmcp) | `/webmcp` | ⚠️ Partial | Frontend tool reaches the model (curl-verified); UI not browser-checked. Browser-agent discovery needs Chrome 149+ with WebMCP enabled. In other browsers registration is a silent no-op. |
| [Display-only components](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/your-components/display-only) | `/generative-ui/your-components/display-only` | ⚠️ Partial | Frontend tool reaches the model (curl-verified); UI not browser-checked. |
| [Interactive components](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/your-components/interactive) | `/generative-ui/your-components/interactive` | ⚠️ Partial | Frontend tool reaches the model (curl-verified); UI not browser-checked. |
| [A2UI Styling](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/a2ui/styling) | `/generative-ui/a2ui/styling` | ❌ Broken | Confirmed: importing the page's theme.css fails `next build` for the whole app ("Invalid empty selector" at the dark-mode block). Loaded with a &lt;link> here instead, so the rest of the app builds. |
| [A2UI Advanced](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/a2ui/advanced) | `/generative-ui/a2ui/advanced` | ❌ Broken | The page.tsx snippet throws (CopilotChat not imported). The progress hook listens for render_a2ui while the A2UI pages name the injected tool generate_a2ui. Labelled tabs isolate the interceptors, which have not been checked in a browser. |
| [Sub-agents](https://docs.copilotkit.ai/ms-agent-harness-dotnet/multi-agent/subagents) | `/multi-agent/subagents` | ❌ Broken | Reference-only: the page's SubagentsAgent.cs can't be built (AsLunaChatClient is defined nowhere), so there is no agent, runtime route or demo. |
| [Readables (useAgentContext)](https://docs.copilotkit.ai/ms-agent-harness-dotnet/agent-app-context) | `/agent-app-context` | ❌ Broken | As published, YourComponent throws ReferenceError: useState is not defined (confirmed). The page's .NET middleware itself works: a context secret word sent to :8001 came back verbatim (PAPAYA). Use the labelled "+ imports supplied" tab to see it end to end. |
| [Copilot Runtime](https://docs.copilotkit.ai/ms-agent-harness-dotnet/copilot-runtime) | `/copilot-runtime` | ⚠️ Partial | GET /api/copilotkit/info verified: agents = [my_agent], intelligence on. The direct-connection snippet's URL is a placeholder. |
| [AG-UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/ag-ui) | `/ag-ui` | ⚠️ Partial | Agent id fixed (HARNESS FIX: "research-agent" → my_agent), so the published EventLog now logs to the console. The my_agent panel shows the stream on screen. Not yet checked in a browser. |

**Evidence behind the statuses** (2026-11-05, raw AG-UI POSTs with curl, servers killed by PID afterwards):

| Probe | Result |
| --- | --- |
| Plain message → :8000 | ✅ `RUN_STARTED > TEXT_MESSAGE_* > RUN_FINISHED`, "PONG" |
| Frontend tool in `RunAgentInput.tools` → :8000 | ✅ `TOOL_CALL_START change_background` (no prompt needed) |
| Context secret word → :8000 (Quickstart) | ❌ "NO CONTEXT": `RunAgentInput.Context` never reaches the model |
| Context secret word → :8001 (Agent App Context middleware) | ✅ "PAPAYA" |
| Image content part → :8000 | ❌ No error, but the image is dropped ("I don't see an image attached") |
| `GET /api/copilotkit/info` | ✅ `agents: [my_agent]`, intelligence on |
| `POST /api/copilotkit/agent/my_agent/run` | ✅ 200 with an Intelligence `joinToken`; events go over WebSocket (browser-only) |
| `POST /api/copilotkit/agent/default/run` | ❌ 404 `Agent 'default' does not exist` |
| Showcase runtime → `agentic_chat` | ✅ "PONG" via `/` |
| Harness agents, verbatim, all 8 paths | ❌ `RUN_STARTED > RUN_ERROR`: OpenAI `400 unknown_parameter: web_search_options` |
| Harness agents + `DisableWebSearch` remedy | ✅ All 8 complete. Reasoning streams `REASONING_*`, HITL calls `book_call`, json-render returns its spec. The others open in plan mode (`mode_get`, `todos_add`, `FileMemory_SaveFile`) and ask before executing. *(Probed before the 2026-11-09 todo/agent-mode remedy; not yet re-probed.)* |
| `readonly-state-agent-context` via the showcase route | ✅ Context value returned verbatim ("Atai") |
| Same 8, through their Next runtime routes | ❌ same error, so the frontend→runtime→:8002 wiring itself works (`/reasoning` first streams `REASONING_START…END`) |
| Harness 1.9-preview on the Quickstart's 1.19 packages | ❌ startup crash `MissingMethodException: …UseToolApproval(AIAgentBuilder, JsonSerializerOptions)` |
| Harness 1.10 → 1.27.0 | ❌ the published `AsHarnessAgent(int, int, options)` doesn't compile (removed overload) |

To repeat them: start the .NET servers and run `python3 tools/probe-agents.py` and `python3 tools/probe-harness-agents.py`. With the frontend running, also run `python3 tools/probe-runtimes.py http://localhost:3000` and `python3 tools/probe-harness-runtimes.py http://localhost:3000`.

---

## 9. Known issues / doc-vs-implementation discrepancies

### 9.1 The showcase backend can't be built from the docs
The Code-tab `agent/Program.cs` (identical on 13 pages) references about 20 unpublished classes, and calls `AddAGUI()` / `MapAGUI(...)`, which don't exist in the pinned hosting package (it has `AddAGUIServer` / `MapAGUIServer`, as the Quickstart uses). Inventory: [`backend/docs_verbatim/README.md`](backend/docs_verbatim/README.md).

### 9.2 Harness agents: no page names the package, and no version runs the published code
Every per-feature agent calls `chatClient.AsHarnessAgent(maxContextWindowTokens, maxOutputTokens, new HarnessAgentOptions { … })` from NuGet `Microsoft.Agents.AI.Harness`. No page installs that package or names a version. What happens on each version line:

| Harness version | Result with the published agent files |
| --- | --- |
| 1.10.0 → 1.27.0 (incl. 1.19.0, matching the Quickstart pins) | Doesn't compile. The overload is now `AsHarnessAgent(options?, loggerFactory?, serviceProvider?)`. |
| 1.9.0-preview + Agent Framework 1.19 (the Quickstart's pins) | Compiles, then crashes at startup: `MissingMethodException: ToolApprovalAgentBuilderExtensions.UseToolApproval(AIAgentBuilder, JsonSerializerOptions)`. |
| 1.9.0-preview + Agent Framework 1.9 (the showcase's era) | Starts, using the showcase's own `AddAGUI` / `MapAGUI`, which only exist in this line. **Every turn fails** with OpenAI `400 unknown_parameter: 'web_search_options'`. |

Decision: `backend/harness/` uses the third line. The cause of the 400 is a Harness default. Per the package's own API docs, *"a `HostedWebSearchTool` is added to the chat options by default"*. The OpenAI adapter sends it as `web_search_options`, which `gpt-5-mini` Chat Completions rejects. At the owner's request, each of the 8 agent files carries a labelled **`HARNESS REMEDY`**: `DisableWebSearch = true`. The verbatim originals stay in `backend/docs_verbatim/`.

A second labelled **`HARNESS REMEDY`** (also at the owner's request, 2026-11-09) adds `DisableTodoProvider = true` and `DisableAgentModeProvider = true` to all 8 files. Left on, these Harness defaults inject `todos_*` and `mode_get`/`mode_set` tools and start the agent in *plan* mode. Every demo then opened with a plan and asked permission before calling its own tools. No page mentions these defaults. File memory (`FileMemory_*`) and file access are still on as published. Each has its own `HarnessAgentOptions.Disable…` switch.

Two more things are needed that no page mentions:
- **`NoWarn MAAI001`**: `HarnessAgentOptions` is experimental, and the build fails without the suppression.
- **A model for `/reasoning`**: the showcase mounts it with the unpublished `salesFactory.CreateReasoningAgent()`. The published `ReasoningAgentFactory.Create(chatClient, loggerFactory)` is used here with `gpt-5-mini` (labelled), the model every other Harness agent uses.

Can't be built at all, so their pages run on `MyAgent` instead (labelled routing edits):
- `DeclarativeGenUiAgent` (needs the unpublished `A2uiSecondaryToolCaller` and `BeautifulChatA2ui`).
- The `ChartAgent` fragments (no enclosing class).

### 9.3 Pages disagree about the agent name (fixed in this repo)
The Quickstart registers **`my_agent`**. The other pages use:
- **No agent at all** (resolves to **`"default"`**): Threads Drawer, Components and surfaces, A2UI, and Rendering in app provider snippets.
- **`"my-agent"`**: Headless Threads and Multimodal.
- **`"research-agent"`**: AG-UI.

As published, all of these fail on the Quickstart runtime: it returns 404 `Agent 'default' does not exist`, and v2 throws `useAgent: Agent 'default' not found after runtime sync … Known agents: [my_agent]`. Both errors were confirmed (curl and browser).

At the owner's request, every occurrence (17 demo files) carries a **`HARNESS FIX`**: `agentId="my_agent"` on `CopilotKitProvider`, `agent="my_agent"` on `CopilotKit`, or the corrected id string. The doc's original value is kept in the comment. The Threads Drawer page documents this remedy itself ("set `agentId` once on the shared `CopilotChatConfigurationProvider`").

Left as published, because they don't cause the error:
- Copilot Runtime's `"my-agent"`: that page registers the name itself via `agents__unsafe_dev_only`.
- Display-only's `agentId: "support-agent"`: it only scopes a component.
- The drawer's `agentId="research_agent"` example: it lists an empty thread list.

### 9.4 The .NET hosting drops run context and image parts
`RunAgentInput.Context` never reaches the model unless you add the middleware from [Agent App Context](https://docs.copilotkit.ai/ms-agent-harness-dotnet/agent-app-context). The Components and surfaces pages say "your agent must use the context entries of the run" but give no .NET code for it. Image content parts are dropped silently ([Multimodal](https://docs.copilotkit.ai/ms-agent-harness-dotnet/multimodal-attachments)). The showcase `Program.cs` itself admits "the AG-UI adapter rejects content arrays" and routes multimodal to an unpublished raw endpoint.

### 9.5 Doc code that breaks the build or throws
- [A2UI Styling](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/a2ui/styling): the dark-mode block (`.dark .a2ui-surface, @media … {}`) is invalid CSS, and importing it fails `next build` for the entire app. Loaded with `<link>` instead.
- [Standard catalog](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/standard-catalog) calls `maplibre-gl` optional ("without it, the map shows a list"). Under Next/Turbopack the catalog's `import("maplibre-gl")` fails the build, so it's effectively required. A plain `npm install maplibre-gl` gets 6.x, which conflicts (ERESOLVE) with react-core's `peerOptional maplibre-gl@^5`. Installed `5.24.0`.
- [Agent App Context](https://docs.copilotkit.ai/ms-agent-harness-dotnet/agent-app-context): `YourComponent.tsx` uses `useState` and `useAgentContext` without importing either, so it throws a ReferenceError.
- [A2UI Advanced](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/a2ui/advanced): `src/app/page.tsx` uses `CopilotChat` without importing it. Its progress hook listens for `render_a2ui`, while the A2UI and Dynamic Schema pages call the injected tool `generate_a2ui`. `./theme` is unpublished.
- [Threads Drawer](https://docs.copilotkit.ai/ms-agent-harness-dotnet/prebuilt-components/copilot-threads-drawer): the "own New conversation button" `app/page.tsx` calls a client hook in a Server Component, which returns 500.
- [Render agent state](https://docs.copilotkit.ai/ms-agent-harness-dotnet/shared-state/rendering-in-app): `Canvas.tsx` imports `useEffect` without `"use client"`. Next rejects that at build, so `"use client"` was added (labelled).
- [Sub-agents](https://docs.copilotkit.ai/ms-agent-harness-dotnet/multi-agent/subagents): `SubagentsAgent.cs` calls `GetChatClient("gpt-6-luna").AsLunaChatClient()`; no package or page defines `AsLunaChatClient`, so the agent cannot compile (on top of the Harness-only `AsHarnessAgent`, §9.2). The Code-tab `page.tsx` also imports four unpublished modules (`subagent-activity-card`, `demo-layout`, `active-subagent`, `suggestions`). Route is reference-only.
- [Headless UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/custom-look-and-feel/headless-ui) and [Reasoning Messages](https://docs.copilotkit.ai/ms-agent-harness-dotnet/custom-look-and-feel/reasoning-messages): the live pages render "Missing snippet: Region … not found".

### 9.6 Doc type errors kept with `@ts-expect-error`
Showcase `route.ts` (`unknown[]` passed as `Message[]`, twice) · CSS `icons` prop (not a v2 prop) · Slots: untyped custom `messageView`, `"data-testid"` in the slot object, a plain function as `userMessage` · Multimodal: `onUpload` returning a string, and `onError` typed as a union with the DOM `onError` · Threads Drawer: `children` on `CopilotThreadsDrawer` · Headless Threads: the `onSelectThread` prop · Governed Actions: `useInterrupt` render returning `null` · Interactive, AG-UI: components that return nothing.

### 9.7 Copy-paste and placeholder issues
- The [Frontend Tools](https://docs.copilotkit.ai/ms-agent-harness-dotnet/frontend-tools) "Nothing to wire on the agent" section is the Components-as-Tools page's `ChartAgent.cs` / `render_bar_chart` text, word for word.
- The CSS custom-fonts block quotes `"Arial, sans-serif"` as a single family name.
- The Quickstart install line pins `@ag-ui/client@1.0.2`, which matches CopilotKit 1.84.1's own pin (good), but it also installs the deprecated v1 `@copilotkit/react-ui`.

---

## 10. Troubleshooting

Adapted from the Quickstart's troubleshooting block, as it applies to this repo.

| Symptom | Cause / fix |
| --- | --- |
| "I'm having trouble connecting to my tools", or chat never answers | :8000 isn't running. Start `dotnet run --project backend/quickstart`. The home page's connection check shows red. |
| Agent exits with `Set OPENAI_API_KEY` | Run `cd backend/quickstart && dotnet user-secrets set OPENAI_API_KEY "…"` (and the same in `backend/agent-app-context`). |
| `dotnet --version` < 9 | Install .NET 9+. |
| Port 8000 busy | The doc hardcodes `app.Run("http://localhost:8000")` in `Program.cs`, and the Quickstart says to change it in `launchSettings.json` / the route URL. With this doc code only `Program.cs` matters. Change it there and in `frontend/src/app/api/copilotkit/[[...slug]]/route.ts`. |
| Every Quickstart-runtime route fails at startup | `CPK_INTELLIGENCE_API_KEY` is missing from `frontend/.env.local`. The doc route constructs `CopilotKitIntelligence` unconditionally. |
| `Agent 'default' not found after runtime sync` | This was the doc's agent-name mismatch (§9.3). It's fixed in every demo. If it reappears, a `HARNESS FIX` was reverted. |
| Dev server killed with no error | Turbopack's dev cache. `next.config.ts` sets `turbopackMemoryEviction: "full"`. If it recurs, delete `frontend/.next`. |
| Harness-agent pages answer `RUN_ERROR … web_search_options` | Your :8002 is running a build from before the `DisableWebSearch` remedy. Restart `npm run agent:harness`. `HTTP 404` or a connection error means :8002 isn't running. |
| A Harness agent answers with a plan and "may I switch to execute mode?" | The Harness's default agent-mode provider (§9.2). Reply `yes, execute`. |
| Showcase runtime GET shows `agent_status: error (404)` | Its health probe calls `/health`, which only the unpublished showcase `Program.cs` maps. Harmless. |

Raw backend probe (no browser):

```bash
curl -N -X POST localhost:8000/ -H 'Content-Type: application/json' -H 'Accept: text/event-stream' \
  -d '{"threadId":"t1","runId":"r1","state":{},"messages":[{"id":"m1","role":"user","content":"Reply with exactly: PONG"}],"tools":[],"context":[],"forwardedProps":{}}'
```

---

## 11. Project structure

```
ms-dot-net-harness/
├── backend/                         three .NET servers; separate projects because their package lines conflict
│   ├── quickstart/                  Quickstart server (:8000)
│   │   ├── Program.cs               VERBATIM (Quickstart .NET tab)
│   │   └── AGUIServer.csproj        from `dotnet new web` + the Quickstart's two `dotnet add package` pins
│   ├── agent-app-context/           Agent App Context server (:8001)
│   │   └── Program.cs               VERBATIM (InjectContextMiddleware)
│   ├── harness/                     Harness agents server (:8002), Agent Framework 1.9 line
│   │   ├── Agents/*.cs              the 8 Code-tab Harness agents, byte-for-byte
│   │   ├── Program.cs               assembled from published showcase + Quickstart lines (each tagged)
│   │   └── HarnessServer.csproj     1.9 pins + Harness 1.9.0-preview + NoWarn MAAI001
│   └── docs_verbatim/               all other published C#, not compiled, with an inventory README
├── frontend/src/
│   ├── lib/nav-config.ts            single source: nav, statuses, gaps, demo links, Try-it
│   ├── app/<doc path>/page.tsx      notes page per doc page (renders components/route-notes.tsx)
│   ├── app/<doc path>/demo-chat/    the live demo, doc code verbatim (HARNESS marks); variants in subfolders
│   ├── app/doc-sync/ + lib/doc-sync/  in-app doc sync: re-fetch every page's .md, diff, write doc-snapshot/
│   ├── app/api/copilotkit/…         Quickstart runtime (VERBATIM)
│   ├── app/api/copilotkit-showcase/ Code-tab runtime (VERBATIM, basePath edit)
│   ├── app/api/copilotkit-{genui,a2ui,agent-app-context}/  page runtime snippets / glue
│   ├── doc/                         shared verbatim doc files (Quickstart providers, A2UI catalog)
│   ├── components/, hooks/          harness UI, plus A2UI Advanced's files at their doc paths
│   └── components/demo-tabs.tsx     one snippet per tab, client-only, with an error boundary
├── doc-snapshot/
│   ├── pages/<docs path with __>.md every tracked page's markdown, as /doc-sync last fetched it
│   ├── manifest.json, reports/      sync date, hashes, latest diff report
│   └── code/<slug>/{codetab,prose}/ every code block from the Code tab (RSC payload), byte-for-byte, 2026-11-05
├── tools/
│   ├── with-env.sh                  loads the root .env for the npm scripts
│   ├── probe-*.py                   AG-UI curl probes (README §8)
│   └── status-table.py              README §8 table from nav-config
└── PR_GUIDELINES.md
```

Re-sync the docs from the app: open `/doc-sync` and press **Sync docs now**. It re-fetches each tracked page's
markdown, diffs it against `doc-snapshot/pages/`, and flags changes inside code blocks. The same module runs in the
doc-sync bot. It does not refresh `doc-snapshot/code/`. Those Code-tab extracts came from the RSC payload with the
Python tools this repo used before 2026-11-10, which can be recovered from that day's backup if a Code tab changes.

---

## 12. References

**Getting Started:** [Quickstart (bring your own)](https://docs.copilotkit.ai/ms-agent-harness-dotnet/quickstart?agent=bring-your-own)

**Prebuilt Components:** [CopilotChat](https://docs.copilotkit.ai/ms-agent-harness-dotnet/prebuilt-components/chat) · [CopilotSidebar](https://docs.copilotkit.ai/ms-agent-harness-dotnet/prebuilt-components/sidebar) · [CopilotPopup](https://docs.copilotkit.ai/ms-agent-harness-dotnet/prebuilt-components/popup) · [Open, close, and feedback](https://docs.copilotkit.ai/ms-agent-harness-dotnet/prebuilt-components/chat-controls)

**Custom Look and Feel:** [CSS](https://docs.copilotkit.ai/ms-agent-harness-dotnet/custom-look-and-feel/css) · [Slots](https://docs.copilotkit.ai/ms-agent-harness-dotnet/custom-look-and-feel/slots) · [Markdown](https://docs.copilotkit.ai/ms-agent-harness-dotnet/custom-look-and-feel/markdown) · [Headless UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/custom-look-and-feel/headless-ui) · [Reasoning Messages](https://docs.copilotkit.ai/ms-agent-harness-dotnet/custom-look-and-feel/reasoning-messages)

**Chat:** [Multimodal Attachments](https://docs.copilotkit.ai/ms-agent-harness-dotnet/multimodal-attachments) · [Voice](https://docs.copilotkit.ai/ms-agent-harness-dotnet/voice) · [Reasoning](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/reasoning)

**Threads:** [Threads Drawer](https://docs.copilotkit.ai/ms-agent-harness-dotnet/prebuilt-components/copilot-threads-drawer) · [Headless Threads](https://docs.copilotkit.ai/ms-agent-harness-dotnet/headless-threads) · [Frontend Tools](https://docs.copilotkit.ai/ms-agent-harness-dotnet/frontend-tools)

**Generative UI, Controlled:** [Components as Tools](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/tool-based) · [Tool Rendering](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/tool-rendering)

**Generative UI, Components and surfaces:** [Surfaces](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/surfaces) · [Catalogs](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/catalogs) · [Standard catalog](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/standard-catalog) · [State and actions](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/state-and-actions) · [Theming](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/theming) · [Transports](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/transports) · [Markdown mode](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/markdown-mode) · [Adopt from A2UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/components/from-a2ui)

**Generative UI, A2UI:** [A2UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/a2ui) · [Dynamic Schema](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/a2ui/dynamic-schema) · [Fixed Schema](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/a2ui/fixed-schema) · [JSON Render](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/json-render) · [Hashbrown](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/hashbrown)

**Generative UI, Open-ended:** [MCP Apps](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/mcp-apps) · [Open Generative UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/open-generative-ui)

**Interactivity:** [Render agent state](https://docs.copilotkit.ai/ms-agent-harness-dotnet/shared-state/rendering-in-app) · [Agent Read-Only Context](https://docs.copilotkit.ai/ms-agent-harness-dotnet/shared-state/agent-readonly) · [HITL Overview](https://docs.copilotkit.ai/ms-agent-harness-dotnet/human-in-the-loop/index) · [Governed Actions](https://docs.copilotkit.ai/ms-agent-harness-dotnet/human-in-the-loop/governed-actions) · [WebMCP](https://docs.copilotkit.ai/ms-agent-harness-dotnet/webmcp)

**Agent capabilities, MS Agent Harness (.NET):** [Display-only](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/your-components/display-only) · [Interactive](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/your-components/interactive) · [A2UI Styling](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/a2ui/styling) · [A2UI Advanced](https://docs.copilotkit.ai/ms-agent-harness-dotnet/generative-ui/a2ui/advanced) · [Sub-agents](https://docs.copilotkit.ai/ms-agent-harness-dotnet/multi-agent/subagents) · [Readables](https://docs.copilotkit.ai/ms-agent-harness-dotnet/agent-app-context) · [Copilot Runtime](https://docs.copilotkit.ai/ms-agent-harness-dotnet/copilot-runtime) · [AG-UI](https://docs.copilotkit.ai/ms-agent-harness-dotnet/ag-ui)
