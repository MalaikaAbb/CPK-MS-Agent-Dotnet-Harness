"""Print README §8's status table from frontend/src/lib/nav-config.ts, so the
README and the app's /status page cannot disagree. Usage: python3 tools/status-table.py"""
import re

s = open("frontend/src/lib/nav-config.ts").read()
ICON = {"working": "✅ Working", "partial": "⚠️ Partial", "broken": "❌ Broken", "reference": "📄 Reference", "not-started": "🚧 Not started"}
NOTE = {
    "REFERENCE_ONLY": "Reference-only: the page's .NET agent can't be built from published code.",
    "COMPONENTS_GAP": "\"default\" agent not registered + .NET drops run context.",
}
print("| Doc page | Route | Status | Notes |\n| --- | --- | --- | --- |")
for m in re.finditer(r'\{\s*path: "([^"]+)",\s*title: "([^"]+)",\s*docPath: "([^"]+)".*?status: "([a-z-]+)",(.*?)\n      \}', s, re.S):
    path, title, doc, status, rest = m.groups()
    note = ""
    sn = re.search(r'statusNote: ("(?:[^"\\]|\\.)*"|`[^`]*`|[A-Z_]+)', rest)
    gap = re.search(r'docGap:\s*(REFERENCE_ONLY|COMPONENTS_GAP|"(?:[^"\\]|\\.)*"|`[^`]*`)', rest)
    if status == "broken" and gap and gap.group(1) in NOTE:
        note = NOTE[gap.group(1)]
    elif status == "broken" and gap and gap.group(1).startswith("REFERENCE_ONLY"):
        note = NOTE["REFERENCE_ONLY"]
    elif sn:
        v = sn.group(1)
        v = {"CHAIN_OK": "Runtime→.NET chain curl-verified; UI not browser-checked.",
             "TOOL_OK": "Frontend tool reaches the model (curl-verified); UI not browser-checked.",
             "HARNESS_RUN_NOTE": "Runs on backend/harness (Harness 1.9-preview + DisableWebSearch remedy, curl-verified). Agents often plan first and ask to switch to execute mode (Harness default)."}.get(v, v)
        v = re.sub(r"\$\{SHOWCASE_ROOT_NOTE\} ?", "Code-tab demo on MyAgent. ", v.strip('"`'))
        v = v.replace("${CHAIN_OK}", "Runtime→.NET chain curl-verified; UI not browser-checked.").replace("${TOOL_OK}", "Frontend tool reaches the model (curl-verified); UI not browser-checked.")
        note = v.replace('\\"', '"')
    if "REFERENCE_ONLY" in rest and status == "broken" and not note:
        note = NOTE["REFERENCE_ONLY"]
    if not note and gap and gap.group(1).startswith('"'):
        note = gap.group(1).strip('"').replace('\\"', '"').split(". ")[0] + "."
    note = note.replace("|", "\\|").replace("<", "&lt;")
    print(f"| [{title}](https://docs.copilotkit.ai{doc}) | `{path}` | {ICON[status]} | {note} |")
