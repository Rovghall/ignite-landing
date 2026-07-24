import re
from pathlib import Path

core = Path("lib/blog-posts.ts").read_text(encoding="utf-8")
more = Path("lib/blog-posts-more.ts").read_text(encoding="utf-8")
# Only count slug literals in each file; exclude the type field by requiring quotes
cs = set(re.findall(r"slug: '([^']+)'", core))
ms = set(re.findall(r"slug: '([^']+)'", more))
print("core", len(cs))
print("more", len(ms))
print("overlap", len(cs & ms))
print("total unique", len(cs | ms))
# check em dashes
print("emdash core", core.count("\u2014"))
print("emdash more", more.count("\u2014"))
