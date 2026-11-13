// HARNESS. The doc's app/layout.tsx is a root layout (<html><body><Providers>{children}</Providers>),
// which cannot nest under this app's own root layout, so only its <Providers> line is used here.
// Demo routes also render per request, never prerendered at build time.
import { Providers } from "./providers";

export const dynamic = "force-dynamic";

export default function DemoChatLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
