# -*- coding: utf-8 -*-
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
slugs = [l.strip() for l in (ROOT / "scripts/more_slugs.txt").read_text(encoding="utf-8").splitlines() if l.strip()]
found = []
for fname in ["batch-a.ts", "batch-b.ts", "batch-c.ts", "batch-d.ts"]:
    text = (ROOT / "lib/blog-more" / fname).read_text(encoding="utf-8")
    found.extend(re.findall(r"slug: '([^']+)'", text))
print("expected", len(slugs), "found", len(found))
if slugs == found:
    print("slug order OK")
else:
    for i, (a, b) in enumerate(zip(slugs, found)):
        if a != b:
            print("mismatch at", i + 1, a, b)
            break
    if len(slugs) != len(found):
        print("length mismatch")
