from pathlib import Path
import re

def analyze(path: str) -> None:
    t = Path(path).read_text(encoding="utf-8")
    chunks = t.split("\n  {\n    slug:")
    rows = []
    for chunk in chunks[1:]:
        slug = chunk.split("'", 2)[1]
        heads = chunk.count("heading:")
        # approximate word count from body strings longer than 40 chars
        bodies = re.findall(r"'([^']{40,})'", chunk)
        words = sum(len(b.split()) for b in bodies)
        rows.append((words, heads, slug))
    rows.sort(reverse=True)
    words_sorted = sorted(r[0] for r in rows)
    heads_sorted = sorted(r[1] for r in rows)
    mid = len(rows) // 2
    print(path)
    print("  posts", len(rows))
    print("  median words~", words_sorted[mid], "median sections~", heads_sorted[mid])
    print("  top", rows[0])
    print("  bottom", rows[-1])

analyze("lib/blog-posts.ts")
analyze("lib/blog-posts-more.ts")
