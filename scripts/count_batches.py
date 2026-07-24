import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
total = 0
for name in ["batch-a", "batch-b", "batch-c", "batch-d"]:
    text = (ROOT / "lib" / "blog-more" / f"{name}.ts").read_text(encoding="utf-8")
    n = len(re.findall(r"slug: '", text))
    print(f"{name}: {n}")
    total += n
print("total:", total)
em = sum((ROOT / "lib" / "blog-more" / f"{name}.ts").read_text(encoding="utf-8").count("\u2014") for name in ["batch-a", "batch-b", "batch-c", "batch-d"])
print("em dashes in batches:", em)
