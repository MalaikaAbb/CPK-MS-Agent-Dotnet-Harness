// HARNESS-ASSEMBLED from published lines only. No single doc page publishes a Program.cs that mounts
// the Harness agents and can be built:
//   [showcase]   = a line of the Code-tab agent/Program.cs (13 pages), verbatim.
//   [quickstart] = a line of the Quickstart's .NET Program.cs, verbatim.
//   [harness]    = written here, because the published equivalent depends on unpublished code.
// The 8 agents in Agents/ are the pages' Code-tab files, byte-for-byte.

using Microsoft.Agents.AI.Hosting.AGUI.AspNetCore;                         // [showcase]
using Microsoft.AspNetCore.Http.Json;                                      // [showcase]
using Microsoft.Extensions.AI;                                             // [harness] AsIChatClient for /reasoning
using Microsoft.Extensions.Options;                                        // [showcase]
using OpenAI;                                                              // [showcase]

var builder = WebApplication.CreateBuilder(args);                          // [showcase]
builder.Services.AddAGUI();                                                // [showcase]

var app = builder.Build();                                                 // [showcase]

var loggerFactory = app.Services.GetRequiredService<ILoggerFactory>();     // [showcase]
var jsonOptions = app.Services.GetRequiredService<IOptions<JsonOptions>>().Value.SerializerOptions; // [showcase]

// The showcase builds its client with the unpublished ApiKeyResolver / AimockHeaderPolicy.
var openAiApiKey = builder.Configuration["OPENAI_API_KEY"]
    ?? throw new InvalidOperationException("Set OPENAI_API_KEY");          // [quickstart]
var openAI = new OpenAIClient(openAiApiKey);                               // [quickstart]
var openAiClient = openAI;                                                 // [harness] name the showcase lines use

// ── Reasoning ──
// [showcase] mounts salesFactory.CreateReasoningAgent() — SalesAgentFactory is unpublished.
// [harness]  the published entry point ReasoningAgentFactory.Create(chatClient, loggerFactory); no page
//            names its model, so gpt-5-mini — the model every other published Harness agent uses.
app.MapAGUI("/reasoning", ReasoningAgentFactory.Create(openAiClient.GetChatClient("gpt-5-mini").AsIChatClient(), loggerFactory));

// ── A2UI fixed-schema demo ──
var a2uiFixedSchemaAgent = new A2uiFixedSchemaAgent(builder.Configuration, openAiClient, loggerFactory, jsonOptions); // [showcase]
app.MapAGUI("/a2ui-fixed-schema", a2uiFixedSchemaAgent.Create());           // [showcase]

// ── Open Generative UI — basic + advanced ──
var openGenUiFactory = new OpenGenUiAgentFactory(openAiClient);            // [showcase]
app.MapAGUI("/open-gen-ui", openGenUiFactory.CreateAgent());               // [showcase]
var openGenUiAdvancedFactory = new OpenGenUiAdvancedAgentFactory(openAiClient); // [showcase]
app.MapAGUI("/open-gen-ui-advanced", openGenUiAdvancedFactory.CreateAgent()); // [showcase]

// ── BYOC demos (hashbrown + json-render) ──
var byocHashbrownFactory = new ByocHashbrownAgentFactory(openAiClient, loggerFactory); // [showcase]
app.MapAGUI("/byoc-hashbrown", byocHashbrownFactory.CreateAgent());        // [showcase]
var byocJsonRenderFactory = new ByocJsonRenderAgentFactory(openAiClient, loggerFactory); // [showcase]
app.MapAGUI("/byoc-json-render", byocJsonRenderFactory.CreateAgent());     // [showcase]

// ── MCP Apps demo ──
var mcpAppsFactory = new McpAppsAgentFactory(openAiClient, loggerFactory); // [showcase]
app.MapAGUI("/mcp-apps", mcpAppsFactory.CreateMcpAppsAgent());             // [showcase]

// ── In-chat HITL demo (useHumanInTheLoop) ──
var hitlInChatFactory = new HitlInChatAgentFactory(openAiClient, loggerFactory); // [showcase]
app.MapAGUI("/hitl-in-chat", hitlInChatFactory.CreateHitlInChatAgent());   // [showcase]

await app.RunAsync();                                                      // [showcase] (URL from launchSettings: :8002)
