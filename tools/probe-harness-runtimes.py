"""Probe the Harness agents through the Next runtimes (frontend + backend/harness running).
Usage: python3 tools/probe-harness-runtimes.py [base-url]   (default http://localhost:3107)"""
import json,urllib.request,uuid
import sys
B = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3107"
def ri(text): return {"threadId":str(uuid.uuid4()),"runId":str(uuid.uuid4()),"state":{},"messages":[{"id":str(uuid.uuid4()),"role":"user","content":text}],"tools":[],"context":[],"forwardedProps":{}}
def go(path, agent, text="Say hi."):
    body={"method":"agent/run","params":{"agentId":agent},"body":ri(text)}
    req=urllib.request.Request(B+path,data=json.dumps(body).encode(),headers={"Content-Type":"application/json","Accept":"text/event-stream"})
    types=[];err=None
    try:
        with urllib.request.urlopen(req,timeout=150) as r:
            for line in r:
                line=line.decode().strip()
                if not line.startswith("data:"): continue
                ev=json.loads(line[5:]); t=ev.get("type")
                if not types or types[-1]!=t: types.append(t)
                if t=="RUN_ERROR": err=(ev.get("message") or "")[:110].replace("\n"," ")
    except Exception as e: err=f"{e} {e.read().decode()[:160] if hasattr(e,'read') else ''}"
    print(f"{path:44} {agent:28} {' > '.join(types) or '-'} | {err}")
go("/api/copilotkit-showcase-harness","reasoning-default","Is 17 prime?")
go("/api/copilotkit-showcase-harness","hitl-in-chat","Book a call about pricing, I'm Ana.")
go("/api/copilotkit-mcp-apps","mcp-apps")
go("/api/copilotkit-ogui","open-gen-ui")
go("/api/copilotkit-ogui","open-gen-ui-advanced")
go("/api/copilotkit-declarative-hashbrown","declarative-hashbrown-demo")
go("/api/copilotkit-declarative-json-render","byoc_json_render")
go("/api/copilotkit-a2ui-fixed-schema","a2ui-fixed-schema","Flight SFO to JFK on United for $289.")
