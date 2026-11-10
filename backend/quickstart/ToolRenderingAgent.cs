// HARNESS-AUTHORED (requested by the repo owner). The Tool Rendering page renders BACKEND tool calls
// (get_weather, …), but the agent that owns those tools is in the unpublished D5ParityAgentFactory and
// no page publishes any C# tool. This is the smallest stand-in: the Quickstart's agent construction
// plus one sample get_weather tool, mounted at "/tool-rendering", the path the doc's showcase route uses.
// The tool returns canned sample data, not live weather.
using System.ComponentModel;
using System.Text.Json.Serialization;
using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using OpenAI;

public static class ToolRenderingAgent
{
    public static AIAgent Create(OpenAIClient openAI) =>
        openAI.GetChatClient("gpt-5.4-mini").AsIChatClient().AsAIAgent(
            name: "ToolRenderingAgent",
            instructions: "You are a helpful assistant. When the user asks about the weather, call get_weather.",
            tools: [AIFunctionFactory.Create(GetWeather, name: "get_weather")]);

    [Description("Get the current weather for a location.")]
    private static WeatherInfo GetWeather([Description("City name, e.g. Tokyo")] string location) =>
        new()
        {
            City = location,
            Temperature = 22,
            Conditions = "Partly cloudy",
            Humidity = 60,
            WindSpeed = 12,
            FeelsLike = 23,
        };
}

// VERBATIM from the showcase Code-tab agent/Program.cs: the type the page's WeatherCard renderer reads.
public class WeatherInfo
{
    [JsonPropertyName("temperature")]
    public int Temperature { get; init; }

    [JsonPropertyName("conditions")]
    public string Conditions { get; init; } = string.Empty;

    [JsonPropertyName("humidity")]
    public int Humidity { get; init; }

    [JsonPropertyName("wind_speed")]
    public int WindSpeed { get; init; }

    [JsonPropertyName("feels_like")]
    public int FeelsLike { get; init; }

    [JsonPropertyName("city")]
    public string City { get; init; } = string.Empty;
}
