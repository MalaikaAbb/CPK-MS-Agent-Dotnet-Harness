const runtime = new CopilotRuntime({
  agents: {
    // `my_agent` is the key — the one string the frontend may ask for.
    my_agent: new HttpAgent({ url: "http://localhost:8000/" }),
  },
});
