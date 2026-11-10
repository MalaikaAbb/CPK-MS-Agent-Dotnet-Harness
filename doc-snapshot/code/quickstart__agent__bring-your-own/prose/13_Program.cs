using Microsoft.Agents.AI;
// [!code highlight:1]
using Microsoft.Agents.AI.Hosting.AGUI.AspNetCore;
using OpenAI;
using OpenAI.Chat;

var builder = WebApplication.CreateBuilder(args);
// [!code highlight:1]
builder.Services.AddAGUIServer();
var app = builder.Build();

var openAiApiKey = builder.Configuration["OPENAI_API_KEY"]
    ?? throw new InvalidOperationException("Set OPENAI_API_KEY");
var openAI = new OpenAIClient(openAiApiKey);

var agent = openAI.GetChatClient("gpt-5.4-mini").AsAIAgent(
    name: "MyAgent",
    instructions: "You are a helpful assistant.");

// [!code highlight:1]
app.MapAGUIServer("/", agent);
app.Run("http://localhost:8000");
