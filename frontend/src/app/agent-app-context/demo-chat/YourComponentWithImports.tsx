"use client" // only necessary if you are using Next.js with the App Router.
// HARNESS COPY of YourComponent.tsx (/agent-app-context) with the two missing imports supplied. Nothing else differs.
import { useState } from "react";
import { useAgentContext } from "@copilotkit/react-core/v2";

export function YourComponentWithImports() {
    // Create colleagues state with some sample data
    const [colleagues, setColleagues] = useState([
        { id: 1, name: "John Doe", role: "Developer" },
        { id: 2, name: "Jane Smith", role: "Designer" },
        { id: 3, name: "Bob Wilson", role: "Product Manager" }
    ]);

    // Define Copilot readable state
    useAgentContext({
        description: "The current user's colleagues",
        value: colleagues,
    });
    return (
        // Your custom UI component
        <>...</>
    );
}
