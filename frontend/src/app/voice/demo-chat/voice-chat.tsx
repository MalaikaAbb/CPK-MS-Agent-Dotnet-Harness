"use client";

// HARNESS-AUTHORED. page.tsx imports VoiceChat from "./voice-chat", which the /voice page does not
// publish. The page's prose says <CopilotChat /> renders the mic button on its own whenever the
// runtime advertises audioFileTranscriptionEnabled, so the minimal version is just that.
//
// The page also publishes SampleAudioButton (./sample-audio-button.tsx), which hands a canned phrase
// to an onTranscribed callback. How that callback puts the text into the chat is not shown, so it
// is not mounted here:
// import { SampleAudioButton } from "./sample-audio-button";
import { CopilotChat } from "@copilotkit/react-core/v2";

export function VoiceChat() {
  return (
    <div className="h-dvh">
      <CopilotChat className="h-full" />
    </div>
  );
}
