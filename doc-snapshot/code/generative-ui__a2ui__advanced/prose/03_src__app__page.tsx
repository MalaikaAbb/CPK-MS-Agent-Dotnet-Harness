"use client";

import { useA2UIProgress } from "@/hooks/use-a2ui-progress";

function Chat() {
  useA2UIProgress();

  return <CopilotChat className="flex-1" />;
}
