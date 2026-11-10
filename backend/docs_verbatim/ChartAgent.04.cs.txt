using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;

private const int HarnessMaxContextWindowTokens = 128_000;
private const int HarnessMaxOutputTokens = 8_192;

public AIAgent CreateChartAgent()
{
    var chatClient = _openAiClient.GetChatClient("gpt-4o-mini").AsIChatClient();

    return chatClient.AsHarnessAgent(
        HarnessMaxContextWindowTokens,
        HarnessMaxOutputTokens,
        new HarnessAgentOptions
        {
            Name = "ChartAgent",
            Description = "Renders charts from data.",
            ChatOptions = new ChatOptions
            {
                Instructions = SystemPrompt,
                MaxOutputTokens = HarnessMaxOutputTokens,
                Tools = [],
            },
        });
}
