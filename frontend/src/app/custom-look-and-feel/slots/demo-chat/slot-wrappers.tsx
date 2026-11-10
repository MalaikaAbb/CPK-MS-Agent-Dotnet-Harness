"use client";

// HARNESS-AUTHORED. The Slots Code-tab page imports these 13 components from
// "./slot-wrappers", which no doc page publishes. Each is the smallest thing that
// does what the page's comment describes ("every overrideable slot … wrapped in a
// dashed, color-coded marker … hover any region to reveal its slot path"): the
// default CopilotKit sub-component, unchanged, inside a labelled outline.

import React from "react";
import {
  CopilotChatAssistantMessage,
  CopilotChatInput,
  CopilotChatMessageView,
  CopilotChatReasoningMessage,
  CopilotChatSuggestionPill,
  CopilotChatUserMessage,
  CopilotChatView,
} from "@copilotkit/react-core/v2";

function Outline({ slot, color, children }: { slot: string; color: string; children: React.ReactNode }) {
  return (
    <div
      title={slot}
      data-slot-path={slot}
      style={{ outline: `1px dashed ${color}`, outlineOffset: 2, position: "relative" }}
    >
      <span
        style={{ position: "absolute", top: -9, right: 4, fontSize: 9, background: color, color: "white", padding: "0 4px", borderRadius: 3, zIndex: 1 }}
      >
        {slot}
      </span>
      {children}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const CustomAssistantMessage = (props: any) => (
  <Outline slot="messageView.assistantMessage" color="#7c3aed"><CopilotChatAssistantMessage {...props} /></Outline>
);
export const CustomUserMessage = (props: any) => (
  <Outline slot="messageView.userMessage" color="#2563eb"><CopilotChatUserMessage {...props} /></Outline>
);
export const CustomReasoningMessage = (props: any) => (
  <Outline slot="messageView.reasoningMessage" color="#d97706"><CopilotChatReasoningMessage {...props} /></Outline>
);
export const CustomCursor = (props: any) => (
  <Outline slot="messageView.cursor" color="#db2777"><CopilotChatMessageView.Cursor {...props} /></Outline>
);
export const CustomTextArea = React.forwardRef<HTMLTextAreaElement, any>((props, ref) => (
  <Outline slot="input.textArea" color="#059669"><CopilotChatInput.TextArea ref={ref} {...props} /></Outline>
));
CustomTextArea.displayName = "CustomTextArea";
export const CustomSendButton = (props: any) => (
  <Outline slot="input.sendButton" color="#059669"><CopilotChatInput.SendButton {...props} /></Outline>
);
export const CustomDisclaimer = (props: any) => (
  <Outline slot="input.disclaimer" color="#059669"><CopilotChatInput.Disclaimer {...props} /></Outline>
);
export const CustomAddMenuButton = (props: any) => (
  <Outline slot="input.addMenuButton" color="#059669"><CopilotChatInput.AddMenuButton {...props} /></Outline>
);
export const CustomSuggestionContainer = React.forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
  <Outline slot="suggestionView.container" color="#0891b2">
    <div ref={ref} className={`flex flex-wrap gap-2 ${className ?? ""}`} {...props} />
  </Outline>
));
CustomSuggestionContainer.displayName = "CustomSuggestionContainer";
export const CustomSuggestion = React.forwardRef<HTMLButtonElement, any>((props, ref) => (
  <Outline slot="suggestionView.suggestion" color="#0891b2"><CopilotChatSuggestionPill ref={ref} {...props} /></Outline>
));
CustomSuggestion.displayName = "CustomSuggestion";
export const CustomScrollToBottomButton = (props: any) => (
  <Outline slot="scrollView.scrollToBottomButton" color="#dc2626"><CopilotChatView.ScrollToBottomButton {...props} /></Outline>
);
export const CustomFeather = (props: any) => (
  <Outline slot="scrollView.feather" color="#dc2626"><CopilotChatView.Feather {...props} /></Outline>
);

// CustomWelcomeScreen is the one slot component the page does publish
// (custom-welcome-screen.tsx), so it is re-exported unchanged.
export { CustomWelcomeScreen } from "./custom-welcome-screen";
