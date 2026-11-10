// HARNESS-AUTHORED. The Code-tab page imports MainContent from "./main-content",
// which no doc page publishes. This is placeholder app content for the chat to sit
// beside or over.
export function MainContent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-2xl font-semibold">Your App</h1>
      <p className="max-w-md text-sm text-slate-500">
        Placeholder main content (harness-authored). The prebuilt chat surface is the
        thing under test.
      </p>
    </main>
  );
}
