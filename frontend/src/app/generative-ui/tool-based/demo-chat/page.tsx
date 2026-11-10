// VERBATIM from the /generative-ui/tool-based page's Code tab. Harness edits are marked HARNESS.
"use client";

import React from "react";
import {
  CopilotChat,
  CopilotKit,
  useComponent,
} from "@copilotkit/react-core/v2";
import { BarChart, barChartPropsSchema } from "./bar-chart";
import { PieChart, pieChartPropsSchema } from "./pie-chart";
// HARNESS: commented out, module not published by the doc → import { useSuggestions } from "./suggestions";

function Chat() {
  useComponent({
    name: "render_bar_chart",
    description: "Display a bar chart with labeled numeric values.",
    parameters: barChartPropsSchema,
    render: BarChart,
  });

  useComponent({
    name: "render_pie_chart",
    description: "Display a pie chart with labeled numeric values.",
    parameters: pieChartPropsSchema,
    render: PieChart,
  });

  // HARNESS: commented out, module not published by the doc → useSuggestions();

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="h-full w-full max-w-4xl">
        <CopilotChat
          agentId="gen-ui-tool-based"
          className="h-full rounded-2xl"
        />
      </div>
    </div>
  );
}

export default function ControlledGenUiDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-showcase" /* HARNESS EDIT: doc says "/api/copilotkit"; see app/api/copilotkit-showcase/route.ts */ agent="gen-ui-tool-based">
      <Chat />
    </CopilotKit>
  );
}
