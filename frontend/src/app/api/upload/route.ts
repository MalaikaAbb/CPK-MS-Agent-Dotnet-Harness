// HARNESS-AUTHORED. The Multimodal Attachments page's "URL (hosted)" snippet POSTs
// the file to /api/upload and reads { url } back, but no page publishes that
// endpoint. Minimal stand-in with no storage: it returns the file as a data: URL.
// (A localhost URL would be useless to the model provider anyway.)
export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "expected a multipart field named \"file\"" }, { status: 400 });
  }
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  return Response.json({ url: `data:${file.type || "application/octet-stream"};base64,${base64}` });
}
