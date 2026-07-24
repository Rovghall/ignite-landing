from pathlib import Path
import re

def analyze(path):
    t = Path(path).read_text(encoding="utf-8")
    chunks = t.split("\n  {\n    slug:")
    rows = []
    for chunk in chunks[1:]:
        slug = chunk.split("'", 2)[1]
        heads = chunk.count("heading:")
        bodies = re.findall(r"'([^']{40,})'", chunk)
        words = sum(len(b.split()) for b in bodies)
        rows.append((words, heads, slug))
    rows.sort()
    mid = len(rows)//2
    print(path, "n=", len(rows), "median_words=", rows[mid][0], "min=", rows[0], "max=", rows[-1])

for p in sorted(Path("lib/blog-more").glob("batch-*.ts")):
    analyze(p)
print("emdash", sum(p.read_text(encoding='utf-8').count('\u2014') for p in Path('lib/blog-more').glob('*.ts')))
