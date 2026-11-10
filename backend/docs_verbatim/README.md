# Published C# that this repo does not compile

Every C# file below is copied byte-for-byte from a Code tab or code block on
`docs.copilotkit.ai/ms-agent-harness-dotnet`. The `.txt` suffix keeps them out of
the `AGUIServer` build. Nothing here is imported or run.

These files are not compiled because they cannot be built from published code. The 8
per-feature Harness agents that *can* be built (Reasoning, HITL in chat, MCP Apps, OGUI ×2,
Hashbrown, json-render, A2UI fixed schema) moved to `backend/harness/Agents/`, byte-for-byte, and
run there on the Agent Framework 1.9 line (see the main README §9.2).

The C# that runs in this repo:

- `backend/quickstart/Program.cs`: the Quickstart's `.NET` tab.
- `backend/agent-app-context/Program.cs`: the Agent App Context page's `.NET` tab.
- `backend/harness/Agents/*.cs`: the 8 Harness agents, mounted by a `Program.cs` assembled from published lines.

## Inventory

| File | Source page(s) | Blocked by |
| --- | --- | --- |
| `ShowcaseProgram.cs.txt` | Code tab `agent/Program.cs` on 13 pages (chat, sidebar, popup, css, slots, headless-ui, frontend-tools, tool-based, tool-rendering ×3, agent-readonly, voice) | Unpublished: `SalesAgentFactory`, `SalesAgentSerializerContext`, `D5ParityAgentFactory`, `InterruptAgentFactory`, `BeautifulChatAgentFactory`, `BeautifulChatTodo`, `BeautifulChatFlight`, `HitlInAppAgentFactory`, `SharedStateReadWriteAgentFactory`, `SubagentsAgentFactory`, `MultimodalEndpoint`, `ApiKeyResolver`, `AimockHeaderPolicy`, `AimockHeaderMiddleware`, `CvdiagBackend`, `CvdiagInstrumentationMiddleware`, `CvDiag`, `AgentConfigAgent` (via `CreateAgentConfigAgent`). It also news up the per-feature factories below. |
| *(moved)* `ReasoningAgent`, `HitlInChatAgent`, `McpAppsAgent`, `OpenGenUiAgent`, `OpenGenUiAdvancedAgent`, `ByocHashbrownAgent`, `ByocJsonRenderAgent`, `A2uiFixedSchemaAgent` | various | Now compiled in `backend/harness/Agents/` (Harness 1.9.0-preview), each with one labelled `DisableWebSearch = true` remedy. As published (the `.txt` here), every turn fails with OpenAI 400 `web_search_options`. |
| `DeclarativeGenUiAgent.cs.txt` | a2ui/dynamic-schema | `AsHarnessAgent`, plus unpublished `A2uiSecondaryToolCaller` and `BeautifulChatA2ui` (`DesignSystemPrompt`, `DeclarativeGenUiCatalogId`) |
| `ChartAgent.04.cs.txt`, `ChartAgent.05.cs.txt` | tool-based (and duplicated on frontend-tools) | Fragments only: a method and a `const` with no enclosing class or `_openAiClient` field. The first also needs `AsHarnessAgent`. |

Even with every missing class supplied, `ShowcaseProgram.cs.txt` would not compile against
the hosting package the Quickstart pins. It calls `builder.Services.AddAGUI()` and
`app.MapAGUI(...)`, but `Microsoft.Agents.AI.Hosting.AGUI.AspNetCore` only exposes
`AddAGUIServer()` / `MapAGUIServer(...)`, which are the names the Quickstart itself uses.

The Code tabs also name agent ids that the showcase runtime routes to backend paths
(`/reasoning`, `/hitl-in-chat`, `/headless-complete`, `/gen-ui-tool-based`,
`/tool-rendering`, `/readonly-state-agent-context`, `/mcp-apps/`, `/voice/`,
`/byoc-hashbrown`, `/byoc-json-render`, `/open-gen-ui`, `/open-gen-ui-advanced`,
`/declarative-gen-ui`, `/a2ui-fixed-schema`). None of these paths exist on the
Quickstart server. `backend/harness` serves `/reasoning`, `/hitl-in-chat`, `/mcp-apps`, `/open-gen-ui`,
`/open-gen-ui-advanced`, `/byoc-hashbrown`, `/byoc-json-render` and `/a2ui-fixed-schema`. The rest
(D5Parity agents and `/declarative-gen-ui`) stay reference-only.
