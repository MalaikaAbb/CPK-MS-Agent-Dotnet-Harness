// VERBATIM Code-tab agent from docs.copilotkit.ai/ms-agent-harness-dotnet, plus one labelled
// HARNESS REMEDY line (DisableWebSearch). The untouched original is backend/docs_verbatim/HitlInChatAgent.cs.txt.
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using OpenAI;

// In-Chat HITL (useHumanInTheLoop — ergonomic API) agent.
//
// The `book_call` tool is defined entirely on the frontend via the
// `useHumanInTheLoop` hook (see src/app/demos/hitl-in-chat/page.tsx).
// The .NET agent owns no tools — it just has a system prompt that nudges
// the model to call the frontend-provided tool when the user asks to book
// a call. The picker UI is rendered inline in the chat by the hook's
// `render` callback, and the user's choice is returned to the agent as the
// tool result.
//
// Harness column: the inner ChatClientAgent is built through the
// `chatClient.AsHarnessAgent(...)` wrapper (Microsoft Agent Harness over
// Microsoft Agent Framework) and the credential comes from the single shared
// `OpenAIClient` threaded in from Program.cs (built via the harness
// ApiKeyResolver). See the W0 contract §1.
//
// Reference parity with:
// showcase/integrations/langgraph-python/src/agents/hitl_in_chat_agent.py
public sealed class HitlInChatAgentFactory
{
    private const int HarnessMaxContextWindowTokens = 128_000;
    private const int HarnessMaxOutputTokens = 8_192;

    private const string SystemPrompt =
        "You help users book an onboarding call with the sales team. " +
        "When they ask to book a call, call the frontend-provided " +
        "`book_call` tool with a short topic and the user's name. " +
        "Keep any chat reply to one short sentence.";

    private readonly OpenAIClient _openAiClient;
    private readonly ILogger _logger;

    public HitlInChatAgentFactory(OpenAIClient openAiClient, ILoggerFactory loggerFactory)
    {
        ArgumentNullException.ThrowIfNull(openAiClient);
        ArgumentNullException.ThrowIfNull(loggerFactory);

        _openAiClient = openAiClient;
        _logger = loggerFactory.CreateLogger<HitlInChatAgentFactory>();
    }

    public AIAgent CreateHitlInChatAgent()
    {
        var chatClient = _openAiClient.GetChatClient("gpt-5-mini").AsIChatClient();

        return chatClient.AsHarnessAgent(
            HarnessMaxContextWindowTokens,
            HarnessMaxOutputTokens,
            new HarnessAgentOptions
            {
                // HARNESS REMEDY (not in the doc): the Harness adds a HostedWebSearchTool by default, which the
                // OpenAI chat adapter sends as `web_search_options`; gpt-5-mini Chat Completions rejects it (HTTP 400).
                DisableWebSearch = true,
                // HARNESS REMEDY (not in the doc): the Harness also adds a TodoProvider (todos_* tools) and an
                // AgentModeProvider (mode_get/mode_set) by default, so the agent opens in plan mode, writes todos and
                // asks before acting. Off so each demo runs its own tools on the first turn.
                DisableTodoProvider = true,
                DisableAgentModeProvider = true,
                Name = "HitlInChatAgent",
                Description = "In-Chat HITL onboarding-call booking assistant powered by Microsoft Agent Harness over Microsoft Agent Framework.",
                ChatOptions = new ChatOptions
                {
                    Instructions = SystemPrompt,
                    MaxOutputTokens = HarnessMaxOutputTokens,
                    Tools = [],
                },
            });
    }
}
