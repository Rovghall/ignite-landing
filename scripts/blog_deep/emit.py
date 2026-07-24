# -*- coding: utf-8 -*-
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "lib" / "blog-more"
SLUGS_FILE = ROOT / "scripts" / "more_slugs.txt"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def emit_post(slug, title, date, desc, sections) -> str:
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


def write_batch(name: str, export: str, posts: list[str]) -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / f"{name}.ts"
    content = f"export const {export} = [\n" + "\n".join(posts) + "\n]\n"
    path.write_text(content, encoding="utf-8")
    return len(posts)


def load_slugs() -> list[str]:
    return [
        line.strip()
        for line in SLUGS_FILE.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
