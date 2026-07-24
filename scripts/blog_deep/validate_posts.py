# -*- coding: utf-8 -*-
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BLOG = ROOT / "lib" / "blog-more"

issues = []
for fname in ["batch-a.ts", "batch-b.ts", "batch-c.ts", "batch-d.ts"]:
    text = (BLOG / fname).read_text(encoding="utf-8")
    chunks = re.split(r"\n  \{", text)[1:]
    for chunk in chunks:
        slug = re.search(r"slug: '([^']+)'", chunk).group(1)
        headings = len(re.findall(r"^\s+heading:", chunk, re.M))
        intro = chunk.split("heading:", 1)[0]
        intro_paras = len(re.findall(r"^\s+'[^']+',", intro, re.M))
        if intro_paras < 2 or intro_paras > 4:
            issues.append(f"{slug}: intro_paras={intro_paras}")
        if headings < 8 or headings > 12:
            issues.append(f"{slug}: headings={headings}")
        for m in re.finditer(
            r"heading: '([^']*)',\s*\n\s*body: \[(.*?)\]\,", chunk, re.S
        ):
            heading = m.group(1)
            if heading == "Bottom line":
                continue
            paras = len(re.findall(r"^\s+'[^']+',", m.group(2), re.M))
            if paras < 2:
                issues.append(f"{slug}/{heading}: paras={paras}")
        if "—" in chunk or "–" in chunk:
            issues.append(f"{slug}: contains dash")

print("issues", len(issues))
for i in issues[:40]:
    print(i)
if len(issues) > 40:
    print("...")
