"""Probe the 8 Harness agents on backend/harness (:8002) with raw AG-UI POSTs. Start it first:
   dotnet run --project backend/harness --launch-profile http
Usage: python3 tools/probe-harness-agents.py"""
import json,urllib.request,uuid
def run(path, text, tools=None, label=""):
    body={"threadId":str(uuid.uuid4()),"runId":str(uuid.uuid4()),"state":{},"messages":[{"id":str(uuid.uuid4()),"role":"user","content":text}],"tools":tools or [],"context":[],"forwardedProps":{}}
    req=urllib.request.Request(f"http://localhost:8002{path}",data=json.dumps(body).encode(),headers={"Content-Type":"application/json","Accept":"text/event-stream"})
    types=[];text_out="";reasoning="";calls=[];results=[];err=None
    try:
        with urllib.request.urlopen(req,timeout=150) as r:
            for line in r:
                line=line.decode().strip()
                if not line.startswith("data:"): continue
                ev=json.loads(line[5:]); t=ev.get("type")
                if not types or types[-1]!=t: types.append(t)
                if t=="TEXT_MESSAGE_CONTENT": text_out+=ev.get("delta","")
                if t and t.startswith("REASONING") and "delta" in ev: reasoning+=ev["delta"]
                if t=="TOOL_CALL_START": calls.append(ev.get("toolCallName"))
                if t=="TOOL_CALL_RESULT": results.append(str(ev.get("content"))[:160])
                if t=="RUN_ERROR": err=ev.get("message")
    except Exception as e:
        err=f"{e} {e.read().decode()[:300] if hasattr(e,'read') else ''}"
    print(f"--- {label} {path}\n events: {' > '.join(types)}\n text: {text_out[:140]!r}\n reasoning: {reasoning[:100]!r}\n tool calls: {calls}  results: {results}\n error: {err}")
run("/reasoning","Is 17 a prime number?",label="Reasoning")
run("/hitl-in-chat","Book a call with sales about pricing. My name is Ana.",tools=[{"name":"book_call","description":"Book an onboarding call","parameters":{"type":"object","properties":{"topic":{"type":"string"},"name":{"type":"string"}},"required":["topic","name"]}}],label="HITL")
run("/mcp-apps","Say hi in one word.",label="MCP Apps (no MCP server in a raw probe)")
run("/open-gen-ui","Say hi in one word.",label="OGUI")
run("/open-gen-ui-advanced","Say hi in one word.",label="OGUI advanced")
run("/byoc-hashbrown","Show revenue by quarter: Q1 10, Q2 20.",label="Hashbrown")
run("/byoc-json-render","Show revenue by quarter: Q1 10, Q2 20.",label="json-render")
run("/a2ui-fixed-schema","Show me a flight from SFO to JFK on United for $289.",label="A2UI fixed")
