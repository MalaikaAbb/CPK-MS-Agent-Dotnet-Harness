"use client";

// Snippets from /multimodal-attachments, verbatim unless marked HARNESS.
// Every tab runs inside the Quickstart's <Providers> (my_agent on /api/copilotkit).

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoTabs } from "@/components/demo-tabs";
import { Providers } from "@/doc/quickstart/providers";

// ── HARNESS-AUTHORED stand-ins for names the snippets use but never define ──
async function uploadToStorage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const { url } = await res.json();
  return url;
}
const currentUser = { id: "harness-demo-user" };
const toast = { error: (message: string) => window.alert(`toast.error: ${message}`) };

const fill = (node: React.ReactNode) => (
  <Providers>
    <div className="h-full">{node}</div>
  </Providers>
);

export default function MultimodalDemo() {
  return (
    <DemoTabs
      title="Multimodal Attachments · Quickstart <Providers> (my_agent)"
      tabs={[
        {
          id: "quick",
          label: "Quick start",
          note: "Verbatim except the agent id: the doc says agentId=\"my-agent\", and HARNESS FIX uses my_agent. The image still does not reach the model (the .NET hosting drops it).",
          render: () =>
            fill(
              <CopilotChat
                agentId="my_agent" /* HARNESS FIX: doc says "my-agent"; the Quickstart registers my_agent (README §9.3) */
                attachments={{ enabled: true }}
              />,
            ),
        },
        {
          id: "config",
          label: "Configuration",
          note: "Verbatim. No agentId, so this uses the provider's my_agent.",
          render: () =>
            fill(
              <CopilotChat
                attachments={{
                  enabled: true,
                  // Omit `accept` to allow all file types (default: "*/*").
                  // Restrict with a MIME filter if needed:
                  accept: "image/*,audio/*,video/*,application/pdf",
                  maxSize: 10 * 1024 * 1024,      // 10MB limit (default: 20MB)
                }}
              />,
            ),
        },
        {
          id: "base64",
          label: "onUpload · base64",
          note: "Verbatim.",
          render: () =>
            fill(
              <CopilotChat
                attachments={{
                  enabled: true,
                  onUpload: async (file) => {
                    const buffer = await file.arrayBuffer();
                    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
                    return {
                      type: "data",
                      value: base64,
                      mimeType: file.type,
                    };
                  },
                }}
              />,
            ),
        },
        {
          id: "url",
          label: "onUpload · URL",
          note: "Verbatim. /api/upload is a HARNESS route that returns a data: URL.",
          render: () =>
            fill(
              <CopilotChat
                attachments={{
                  enabled: true,
                  onUpload: async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                    const { url } = await res.json();
                    return {
                      type: "url",
                      value: url,
                      mimeType: file.type,
                    };
                  },
                }}
              />,
            ),
        },
        {
          id: "metadata",
          label: "metadata",
          note: "The onUpload fragment verbatim, inside a HARNESS <CopilotChat attachments={{enabled: true, …}}>. uploadToStorage and currentUser are HARNESS stand-ins.",
          render: () =>
            fill(
              <CopilotChat
                attachments={{
                  enabled: true,
                  onUpload: async (file) => {
                    const url = await uploadToStorage(file);
                    return {
                      type: "url",
                      value: url,
                      mimeType: file.type,
                      metadata: {
                        uploadedBy: currentUser.id,
                        category: "support-ticket",
                      },
                    };
                  },
                }}
              />,
            ),
        },
        {
          id: "concurrency",
          label: "maxConcurrentUploads",
          note: "Verbatim. onUpload returns uploadToStorage(file), a URL string, not an AttachmentUploadResult. That type mismatch is kept as published.",
          render: () =>
            fill(
              <CopilotChat
                attachments={{
                  enabled: true,
                  maxConcurrentUploads: 3, // three files at a time
                  // @ts-expect-error HARNESS: kept as published. uploadToStorage resolves to a string, not an AttachmentUploadResult.
                  onUpload: async (file) => uploadToStorage(file),
                }}
              />,
            ),
        },
        {
          id: "errors",
          label: "onUploadFailed",
          note: "Verbatim. toast is a HARNESS window.alert stand-in. Try a non-image or a file over 5 MB.",
          render: () =>
            fill(
              <CopilotChat
                attachments={{
                  enabled: true,
                  accept: "image/*",
                  maxSize: 5 * 1024 * 1024, // 5MB
                  onUploadFailed: (error) => {
                    // error.reason: "file-too-large" | "invalid-type" | "upload-failed"
                    // error.file: the original File object
                    // error.message: human-readable description
                    toast.error(error.message);
                  },
                }}
              />,
            ),
        },
        {
          id: "onerror",
          label: "onError",
          note: "Verbatim. Attach an image and send it. Run errors from the agent are logged to the console as [code] message.",
          render: () =>
            fill(
              <CopilotChat
                attachments={{ enabled: true }}
                onError={(event) => {
                  // @ts-expect-error HARNESS: doc type error kept. CopilotChat's onError type is a union with the DOM onError (SyntheticEvent), so .code/.error do not type-check.
                  console.error(`[${event.code}]`, event.error.message);
                }}
              />,
            ),
        },
      ]}
    />
  );
}
