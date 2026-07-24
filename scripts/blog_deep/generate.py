# -*- coding: utf-8 -*-
"""Generate deep blog batch TypeScript files from build_content."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from blog_deep.build_content import build_post
from blog_deep.emit import emit_post, load_slugs, write_batch
from blog_deep.meta import date_for, title_for

BATCHES = [
    ("batch-a", "batchA", 0, 27),
    ("batch-b", "batchB", 27, 54),
    ("batch-c", "batchC", 54, 83),
    ("batch-d", "batchD", 83, 109),
]


def main() -> None:
    slugs = load_slugs()
    if len(slugs) != 109:
        raise SystemExit(f"Expected 109 slugs, got {len(slugs)}")

    counts: dict[str, int] = {}
    for name, export, start, end in BATCHES:
        batch_slugs = slugs[start:end]
        posts: list[str] = []
        for slug in batch_slugs:
            desc, sections = build_post(slug)
            posts.append(
                emit_post(slug, title_for(slug), date_for(slug), desc, sections)
            )
        counts[name] = write_batch(name, export, posts)
        path = ROOT / "lib" / "blog-more" / f"{name}.ts"
        print(f"wrote {path} posts={counts[name]} bytes={path.stat().st_size}")

    index_path = ROOT / "lib" / "blog-more" / "index.ts"
    index_path.write_text(
        "import { batchA } from './batch-a'\n"
        "import { batchB } from './batch-b'\n"
        "import { batchC } from './batch-c'\n"
        "import { batchD } from './batch-d'\n\n"
        "export const moreBlogPosts = [...batchA, ...batchB, ...batchC, ...batchD]\n",
        encoding="utf-8",
    )
    print(f"wrote {index_path} bytes={index_path.stat().st_size}")
    print("counts:", counts, "total:", sum(counts.values()))


if __name__ == "__main__":
    main()
