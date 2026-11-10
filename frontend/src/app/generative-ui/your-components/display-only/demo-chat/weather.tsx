"use client"; // HARNESS: added. The snippet uses hooks and is mounted from a client page.
// VERBATIM otherwise: the app/page.tsx snippet from /generative-ui/your-components/display-only.
// HARNESS: `export` added on YourMainContent so the demo page can mount it.
import { useComponent } from "@copilotkit/react-core/v2";
import { z } from "zod";

const weatherSchema = z.object({
  city: z.string().describe("City name"),
  temperature: z.number().describe("Temperature in Fahrenheit"),
  condition: z.string().describe("Weather condition"),
});

function WeatherCard({
  city,
  temperature,
  condition,
}: z.infer<typeof weatherSchema>) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{city}</h3>
      <p className="text-2xl">{temperature}°F</p>
      <p className="text-sm text-gray-500">{condition}</p>
    </div>
  );
}

export function YourMainContent() {
  useComponent({
    name: "showWeather",
    description: "Display a weather card for a city.",
    parameters: weatherSchema,
    render: WeatherCard,
  });

  return <div>{/* ... */}</div>;
}
