"""README §8 backend probes: raw AG-UI POSTs to :8000 and :8001. Start both servers first.
Usage: python3 tools/probe-agents.py"""
import json,sys,urllib.request,uuid
def run(port, messages, tools=None, context=None, label=""):
    body={"threadId":str(uuid.uuid4()),"runId":str(uuid.uuid4()),"state":{},"messages":messages,"tools":tools or [],"context":context or [],"forwardedProps":{}}
    req=urllib.request.Request(f"http://localhost:{port}/",data=json.dumps(body).encode(),headers={"Content-Type":"application/json","Accept":"text/event-stream"})
    types=[];text="";calls=[];err=None
    try:
        with urllib.request.urlopen(req,timeout=90) as r:
            for line in r:
                line=line.decode().strip()
                if not line.startswith("data:"): continue
                ev=json.loads(line[5:])
                t=ev.get("type"); 
                if not types or types[-1]!=t: types.append(t)
                if t=="TEXT_MESSAGE_CONTENT": text+=ev.get("delta","")
                if t=="TOOL_CALL_START": calls.append(ev.get("toolCallName"))
                if t=="RUN_ERROR": err=ev.get("message")
    except Exception as e:
        err=f"HTTP/transport: {e}"
        if hasattr(e,'read'): err+=" body="+e.read().decode()[:300]
    print(f"--- {label}\n events: {' > '.join(types)}\n text: {text[:200]!r}\n toolcalls: {calls}\n error: {err}")
u=lambda c: [{"id":str(uuid.uuid4()),"role":"user","content":c}]
run(8000,u("Reply with exactly: PONG"),label="P1 plain :8000")
run(8000,u("Change the background to red."),tools=[{"name":"change_background","description":"Change the page background. Accepts any valid CSS background value.","parameters":{"type":"object","properties":{"background":{"type":"string"}},"required":["background"]}}],label="P2 frontend tool :8000")
ctx=[{"description":"The secret word","value":"PAPAYA"}]
q="What is the secret word from the application context? If you have none, reply exactly NO CONTEXT."
run(8000,u(q),context=ctx,label="P3 context :8000 (Quickstart)")
run(8001,u(q),context=ctx,label="P4 context :8001 (Agent App Context middleware)")
png="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="
run(8000,[{"id":str(uuid.uuid4()),"role":"user","content":[{"type":"text","text":"What color is this image?"},{"type":"image","source":{"type":"data","value":png,"mimeType":"image/png"}}]}],label="P5 multimodal :8000")
