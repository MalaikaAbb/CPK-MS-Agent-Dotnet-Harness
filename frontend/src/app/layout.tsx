import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppChrome } from "@/components/app-chrome";

import "./globals.css";
import "@copilotkit/react-core/v2/styles.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CopilotKit + MS Agent Harness (.NET) Test Suite",
  description:
    "One route per docs.copilotkit.ai/ms-agent-harness-dotnet page, running the published code where it can run.",
};

/**
 * No CopilotKit provider at the root. Each demo route mounts the provider its doc
 * page shows (see components/app-chrome.tsx).
 */
export default function RootLayout(props: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <AppChrome>{props.children}</AppChrome>
      </body>
    </html>
  );
}
