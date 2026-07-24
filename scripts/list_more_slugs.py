import re
from pathlib import Path
text = Path("lib/blog-posts-more.ts").read_text(encoding="utf-8")
slugs = re.findall(r"slug: '([^']+)'", text)
Path("scripts/more_slugs.txt").write_text("\n".join(slugs), encoding="utf-8")
print(len(slugs))
for i, s in enumerate(slugs, 1):
    print(f"{i:3} {s}")
