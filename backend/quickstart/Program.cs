using Microsoft.Agents.AI;
using Microsoft.Agents.AI.Hosting.AGUI.AspNetCore;
using OpenAI;
using OpenAI.Chat;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAGUIServer();
var app = builder.Build();

var openAiApiKey = builder.Configuration["OPENAI_API_KEY"]
    ?? throw new InvalidOperationException("Set OPENAI_API_KEY");
var openAI = new OpenAIClient(openAiApiKey);

var agent = openAI.GetChatClient("gpt-5.4-mini").AsAIAgent(
    name: "MyAgent",
    instructions: "You are a helpful assistant.");

app.MapAGUIServer("/", agent);
// HARNESS (not in the Quickstart): the Tool Rendering page's agent with a sample get_weather tool,
// at the path the doc's showcase route uses. See ToolRenderingAgent.cs.
app.MapAGUIServer("/tool-rendering", ToolRenderingAgent.Create(openAI));

app.Run("http://localhost:8000");
