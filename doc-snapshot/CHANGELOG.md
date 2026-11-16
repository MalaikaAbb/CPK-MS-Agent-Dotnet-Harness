# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-13

### 11:11 UTC — 12 pages, highest severity high

**High — Headless UI**

`/ms-agent-harness-dotnet/custom-look-and-feel/headless-ui` · route `/custom-look-and-feel/headless-ui` · under “Bubble chrome” · in a `typescript` block

4 code lines changed.

````diff
- <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-[#010507] text-white px-4 py-2 text-sm whitespace-pre-wrap break-words">
+ <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-[#010507] text-white px-4 py-2 text-sm whitespace-pre-wrap break-words dark:bg-primary dark:text-primary-foreground">
- <div className="rounded-2xl rounded-bl-sm bg-[#F0F0F4] text-[#010507] px-4 py-2 text-sm">
+ <div className="rounded-2xl rounded-bl-sm bg-[#F0F0F4] text-[#010507] px-4 py-2 text-sm dark:bg-muted dark:text-foreground">
````

**High — Dynamic Schema A2UI**

`/ms-agent-harness-dotnet/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema` · under “Implement the React renderers” · in a `typescript` block

9 code lines changed.

````diff
- up: "#059669",
- down: "#dc2626",
+ up: "light-dark(#059669, #34d399)",
+ down: "light-dark(#dc2626, #f87171)",
+ stroke="var(--card)"
- <Tooltip />
+ <Tooltip contentStyle={tooltipStyle} />
- <Tooltip />
````

**High — Fixed Schema A2UI**

`/ms-agent-harness-dotnet/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Implement the React renderers” · in a `typescript` block

16 code lines changed.

````diff
- <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
+ <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-muted-foreground">
- <h3 className="text-base font-semibold leading-none tracking-tight text-neutral-900">
+ <h3 className="text-base font-semibold leading-none tracking-tight text-neutral-900 dark:text-foreground">
- <span className="font-mono text-2xl font-semibold tracking-wider text-neutral-900">
+ <span className="font-mono text-2xl font-semibold tracking-wider text-neutral-900 dark:text-foreground">
- <Separator className="flex-1 bg-neutral-200" />
+ <Separator className="flex-1 bg-neutral-200 dark:bg-border" />
````

**High — Catalogs**

`/ms-agent-harness-dotnet/generative-ui/components/catalogs` · route `/generative-ui/components/catalogs` · under “Create a catalog”

128 code lines, 43 prose lines changed. The number of fenced code blocks changed.

````diff
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
+ <Tab value="React Native">
+ A component of the catalog is a React Native component. It renders native views, and a slot arrives as React nodes:
+ 
+ ```tsx title="src/shopUI.tsx"
+ import { Image, StyleSheet, Text, View } from "react-native";
+ import { z } from "zod";
````

**High — Adopt from A2UI**

`/ms-agent-harness-dotnet/generative-ui/components/from-a2ui` · route `/generative-ui/components/from-a2ui` · under “Adopt from A2UI”

49 code lines, 1 heading, 35 prose lines changed. The number of fenced code blocks changed.

````diff
- > Move an app from the a2ui renderer (A2UI v0.9) to components and surfaces (A2UI 1.0): the provider, the catalog, the operations, and what the agent receives.
+ > Move an app from the a2ui renderer to components and surfaces: the provider, the catalog, the operations, and what the agent receives.
- The `a2ui` provider option and `@copilotkit/a2ui-renderer` render A2UI v0.9: you build a catalog with `createCatalog`, and the agent streams a fixed or a generated schema into it. Components and surfaces is the A2UI 1.0 engine. The idea is the same: the agent writes operations, and the browser renders your components. The engine adds typed catalogs, the [standard catalog](/generative-ui/components/standard-catalog), areas of the page as targets, two transports, dynamic values that compute in the browser, and functions the agent can call. This page maps one to the other.
+ The `a2ui` provider option and `@copilotkit/a2ui-renderer` render A2UI v0.9 by default, with explicit A2UI 1.0 support in React: you build a catalog with `createCatalog`, and the agent streams a fixed or a generated schema into it. Components and surfaces is a separate A2UI 1.0 engine. The idea is the same: the agent writes operations, and the browser renders your components. The engine adds typed catalogs, the [standard catalog](/generative-ui/components/standard-catalog), areas of the page as targets, two transports, dynamic values that compute in the browser, and functions the agent can call. This page maps one to the other.
+ ## Use 1.0 with the React a2ui renderer
+ 
+ You can keep the `a2ui` provider option and opt into the native 1.0 basic catalog:
+ 
````

**High — Markdown mode**

`/ms-agent-harness-dotnet/generative-ui/components/markdown-mode` · route `/generative-ui/components/markdown-mode` · under “What is this?”

18 code lines, 14 prose lines changed. The number of fenced code blocks changed.

````diff
+ <Callout type="info" title="React Native">
+ Markdown mode is not available on React Native yet. `GenerativeUIProvider` from `@copilotkit/react-native/generative-ui` uses the [tool transport](/ms-agent-harness-dotnet/generative-ui/components/transports#tool-transport) only: `transport: "markdown"` is a type error, and passed from JavaScript it is dropped, with a warning in development.
+ </Callout>
+ 
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "Vue"]} persist>
+ <Tab value="Vue">
+ ```vue title="src/App.vue"
````

**High — Standard catalog**

`/ms-agent-harness-dotnet/generative-ui/components/standard-catalog` · route `/generative-ui/components/standard-catalog` · under “What is this?”

42 code lines, 25 prose lines changed. The number of fenced code blocks changed.

````diff
+ <Callout type="info" title="React Native">
+ The standard components render DOM, so React Native has no `standardUI` yet. Build a catalog of your own native components with `createGenerativeUI`; see [Catalogs](/ms-agent-harness-dotnet/generative-ui/components/catalogs) and [Generative UI with your own components](/ms-agent-harness-dotnet/react-native#generative-ui-with-your-own-components).
+ </Callout>
+ 
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "Vue"]} persist>
+ <Tab value="Vue">
+ ```vue
````

**High — State and actions**

`/ms-agent-harness-dotnet/generative-ui/components/state-and-actions` · route `/generative-ui/components/state-and-actions` · under “Show live app state”

175 code lines, 52 prose lines changed. The number of fenced code blocks changed.

````diff
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
+ <Tab value="React Native">
+ ```tsx title="src/shopUI.tsx"
+ const cartSchema = z.object({
+ items: z.array(z.object({ productId: z.string(), quantity: z.number() })),
+ });
+ 
````

**High — Surfaces**

`/ms-agent-harness-dotnet/generative-ui/components/surfaces` · route `/generative-ui/components/surfaces` · under “What is this?”

149 code lines, 59 prose lines changed. The number of fenced code blocks changed.

````diff
- - **The chat.** Always there. The agent can use every component of the catalog.
- - **A page target.** An area of your page that you mark with `GenerativeUISurface`, or `<copilot-generative-ui-surface>` in Angular. The agent sees it only while it is on screen.
+ - **The chat.** Always there. The agent can use every component of the catalog. On React Native, you draw chat surfaces yourself, with `GenerativeUIActivity`; see [Chat surfaces on React Native](#chat-surfaces-on-react-native). The agent is offered the chat target even when the app shows no chat, so a React Native app that renders only `GenerativeUISurface` targets, or only the prebuilt `CopilotChat` (which does not draw surfaces yet), never shows a surface aimed at the chat.
+ - **A page target.** An area of your page that you mark with `GenerativeUISurface`, or `<copilot-generative-ui-surface>` in Angular. The agent sees it only while it is mounted.
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
+ <Tab value="React Native">
+ ```tsx title="src/FeaturedProducts.tsx"
````

**High — Theming**

`/ms-agent-harness-dotnet/generative-ui/components/theming` · route `/generative-ui/components/theming` · under “What is this?”

35 code lines, 18 prose lines changed. The number of fenced code blocks changed.

````diff
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "Vue"]} persist>
+ <Tab value="Vue">
+ ```vue
+ <script setup lang="ts">
+ import { CopilotKitProvider } from "@copilotkit/vue/v2";
+ import { standardUI, type GenerativeUITheme } from "@copilotkit/vue/v2/generative-ui";
+ 
````

**High — Transports**

`/ms-agent-harness-dotnet/generative-ui/components/transports` · route `/generative-ui/components/transports` · under “What is this?”

18 code lines, 29 prose lines changed. The number of fenced code blocks changed.

````diff
- The agent must send the UI to the browser somehow. Some agents are good at tool calls. Others only stream text, or you build their prompt yourself. A **transport** is the way the UI travels:
+ The agent must send the UI to the app somehow: the browser, or a React Native app. Some agents are good at tool calls. Others only stream text, or you build their prompt yourself. A **transport** is the way the UI travels:
- Both transports use the same catalogs, surfaces, and components. Only the path between the agent and the browser changes.
+ Both transports use the same catalogs, surfaces, and components. Only the path between the agent and the app changes.
- | Checked before the browser gets it | yes, by the runtime, and again in the browser | in the browser |
+ | Checked before the app gets it | yes, by the runtime, and again in the app | in the app |
- <Tabs groupId="frontend_framework" items={["React", "Angular"]} persist>
+ <Tabs groupId="frontend_framework" items={["React", "Angular", "React Native", "Vue"]} persist>
````

**High — Reasoning**

`/ms-agent-harness-dotnet/generative-ui/reasoning` · route `/generative-ui/reasoning` · under “Custom reasoning rendering” · in a `typescript` block

10 code lines changed.

````diff
- className="my-2 rounded-xl border border-[#DBDBE5] bg-[#BEC2FF1A] px-3.5 py-2.5 text-sm"
+ className="my-2 rounded-xl border border-[#DBDBE5] bg-[#BEC2FF1A] px-3.5 py-2.5 text-sm dark:border-border"
- <div className="flex items-center gap-2 font-medium text-[#010507]">
- <span className="inline-block rounded-full border border-[#BEC2FF] bg-white px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#57575B]">
+ <div className="flex items-center gap-2 font-medium text-[#010507] dark:text-foreground">
+ <span className="inline-block rounded-full border border-[#BEC2FF] bg-white px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#57575B] dark:bg-card dark:text-muted-foreground">
- <span className="text-[#57575B]">
+ <span className="text-[#57575B] dark:text-muted-foreground">
````
