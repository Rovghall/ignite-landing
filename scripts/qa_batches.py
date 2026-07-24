from pathlib import Path
import re
t = "".join(p.read_text(encoding="utf-8") for p in Path("lib/blog-more").glob("batch-*.ts"))
print("slugs", len(re.findall(r"slug: '", t)))
print("common failure filler", t.count("Common failure mode for"))
print("Applied to filler", t.count("Applied to "))
print("emdash", t.count("\u2014"))
