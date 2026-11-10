"""README §8 runtime probes against a running frontend. Usage: python3 tools/probe-runtimes.py [base-url]
Default base URL http://localhost:3107 (next start -p 3107); pass http://localhost:3000 for dev."""
import json,urllib.request,uuid,sys
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3107"
def post(url, body, label):
    req=urllib.request.Request(url,data=json.dumps(body).encode(),headers={"Content-Type":"application/json","Accept":"text/event-stream"})
    types=[];text=""
    try:
        with urllib.request.urlopen(req,timeout=120) as r:
            for line in r:
                line=line.decode().strip()
                if not line.startswith("data:"): continue
                ev=json.loads(line[5:]); t=ev.get("type")
                if not types or types[-1]!=t: types.append(t)
                if t=="TEXT_MESSAGE_CONTENT": text+=ev.get("delta","")
                if t=="RUN_ERROR": text+=" [RUN_ERROR "+str(ev.get("message"))+"]"
        print(f"--- {label}\n events: {' > '.join(types)}\n text: {text[:160]!r}")
    except Exception as e:
        b=e.read().decode()[:300] if hasattr(e,'read') else ''
        print(f"--- {label}\n FAILED: {e} {b}")
ri=lambda: {"threadId":str(uuid.uuid4()),"runId":str(uuid.uuid4()),"state":{},"messages":[{"id":str(uuid.uuid4()),"role":"user","content":"Reply with exactly: PONG"}],"tools":[],"context":[],"forwardedProps":{}}
post(BASE+"/api/copilotkit/agent/my_agent/run", ri(), "Quickstart runtime (REST, Intelligence) -> my_agent")
post(BASE+"/api/copilotkit/agent/default/run", ri(), "Quickstart runtime -> default (not registered)")
post(BASE+"/api/copilotkit-showcase", {"method":"agent/run","params":{"agentId":"agentic_chat"},"body":ri()}, "Showcase runtime (single-route) -> agentic_chat")
post(BASE+"/api/copilotkit-showcase", {"method":"agent/run","params":{"agentId":"reasoning-default"},"body":ri()}, "Showcase runtime -> reasoning-default (/reasoning)")
