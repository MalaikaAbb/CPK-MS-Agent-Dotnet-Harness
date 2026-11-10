"use client" // only necessary if you are using Next.js with the App Router.
// VERBATIM: YourComponent.tsx from /agent-app-context. Only the two @ts-expect-error lines are HARNESS.

export function YourComponent() {
    // Create colleagues state with some sample data
    // @ts-expect-error HARNESS: kept as published. useState is never imported, so this throws a ReferenceError.
    const [colleagues, setColleagues] = useState([
        { id: 1, name: "John Doe", role: "Developer" },
        { id: 2, name: "Jane Smith", role: "Designer" },
        { id: 3, name: "Bob Wilson", role: "Product Manager" }
    ]);

    // Define Copilot readable state
    // @ts-expect-error HARNESS: kept as published. useAgentContext is never imported.
    useAgentContext({
        description: "The current user's colleagues",
        value: colleagues,
    });
    return (
        // Your custom UI component
        <>...</>
    );
}
