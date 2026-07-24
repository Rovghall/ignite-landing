# -*- coding: utf-8 -*-
"""
Deep-rewrite engine for all 109 more-posts.
Each post gets unique multi-section content (not thin templates).
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "lib" / "blog-posts-more.ts"
OUT = ROOT / "lib" / "blog-more"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def emit(slug, title, date, desc, sections) -> str:
    lines = [
        "  {",
        f"    slug: '{slug}',",
        f"    title: '{esc(title)}',",
        f"    date: '{date}',",
        f"    description:",
        f"      '{esc(desc)}',",
        "    sections: [",
    ]
    for heading, body in sections:
        lines.append("      {")
        if heading:
            lines.append(f"        heading: '{esc(heading)}',")
        lines.append("        body: [")
        for p in body:
            lines.append(f"          '{esc(p)}',")
        lines.append("        ],")
        lines.append("      },")
    lines.append("    ],")
    lines.append("  },")
    return "\n".join(lines)


def parse_existing():
    text = SRC.read_text(encoding="utf-8")
    posts = []
    for m in re.finditer(
        r"slug: '([^']+)',\s*title: '([^']*)',\s*date: '([^']+)',\s*description: '([^']*)'",
        text,
        re.S,
    ):
        posts.append({"slug": m.group(1), "title": m.group(2), "date": m.group(3), "desc": m.group(4)})
    # titles may be multi-line in some; fallback simpler parse
    if len(posts) < 100:
        posts = []
        chunks = text.split("slug: '")[1:]
        for ch in chunks:
            slug = ch.split("'", 1)[0]
            title = ch.split("title: '", 1)[1].split("'", 1)[0]
            date = ch.split("date: '", 1)[1].split("'", 1)[0]
            # description may span
            if "description: '" in ch:
                desc = ch.split("description: '", 1)[1].split("'", 1)[0]
            else:
                desc = title
            posts.append({"slug": slug, "title": title, "date": date, "desc": desc})
    return posts


# Import deep content builders
import sys
sys.path.insert(0, str(ROOT / "scripts"))
from deep_content_library import build_post  # type: ignore
# Ensure rest modules loaded
import deep_content_library as dcl
dcl._load_rest()
from deep_content_library import build_post  # reload builders


def main():
    meta = parse_existing()
    print("parsed", len(meta))
    built = []
    missing = []
    for p in meta:
        try:
            sections, desc = build_post(p["slug"], p["title"], p["desc"])
            built.append(emit(p["slug"], p["title"], p["date"], desc, sections))
        except KeyError:
            missing.append(p["slug"])
    if missing:
        print("MISSING", len(missing))
        for s in missing[:20]:
            print(" ", s)
        raise SystemExit(1)

    OUT.mkdir(parents=True, exist_ok=True)
    # split into 4 batches
    n = len(built)
    sizes = [n // 4, n // 4, n // 4, n - 3 * (n // 4)]
    idx = 0
    names = [("batch-a", "batchA"), ("batch-b", "batchB"), ("batch-c", "batchC"), ("batch-d", "batchD")]
    for (fname, export), size in zip(names, sizes):
        chunk = built[idx : idx + size]
        idx += size
        path = OUT / f"{fname}.ts"
        path.write_text(f"export const {export} = [\n" + "\n".join(chunk) + "\n]\n", encoding="utf-8")
        print("wrote", path.name, len(chunk), path.stat().st_size)

    index = OUT / "index.ts"
    index.write_text(
        "import { batchA } from './batch-a'\n"
        "import { batchB } from './batch-b'\n"
        "import { batchC } from './batch-c'\n"
        "import { batchD } from './batch-d'\n\n"
        "export const moreBlogPosts = [...batchA, ...batchB, ...batchC, ...batchD]\n",
        encoding="utf-8",
    )
    print("total", n)


if __name__ == "__main__":
    main()
