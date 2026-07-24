# -*- coding: utf-8 -*-
"""Rebuild all more-posts with enforced depth (unique expansions per slug)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

# regenerate libraries first
import gen_deep_libraries  # noqa: F401
gen_deep_libraries.write_rest_modules()

import deep_content_library as dcl
dcl._load_rest()
from deep_content_library import build_post, S, CTA
from deep_rewrite_engine import emit, parse_existing, OUT


def word_count(sections) -> int:
    n = 0
    for h, body in sections:
        for p in body:
            n += len(p.split())
    return n


def expand(slug: str, title: str, sections: list) -> list:
    """Ensure depth with shared extras, without repeating filler in every section."""
    expanded = []
    for h, body in sections:
        paras = [p for p in body if p and "Common failure mode for" not in p and not p.startswith("Applied to ") and not p.startswith("Translate this into weekly behavior")]
        expanded.append((h, paras))

    have = {h for h, _ in expanded if h}
    extras = [
        (
            "Measurement and feedback loop",
            [
                "The useful scoreboard is usually a two to four week trend: average bodyweight, waist or photos, training performance, and average intake.",
                "Single-day scale spikes from sodium, carbohydrates, hard lower-body training, or menstrual fluid are noise. Act on slopes, not points.",
            ],
        ),
        (
            "Protein, training, and recovery",
            [
                "If you lift while changing bodyweight, keep progressive overload and a protein target you can hit on busy days. A practical evidence-based band for many lifters in a deficit is about 1.6 to 2.2 g/kg.",
                "Sleep and steps are silent levers. A perfect macro plan fails when NEAT collapses and late-night snacking goes unlogged.",
            ],
        ),
        (
            "A 7-day execution checklist",
            [
                "1) Log every meal, photographing chaotic plates. 2) Edit oils and sauces on purpose. 3) Save one staple to Saved. 4) Log at least two workouts. 5) Weigh most mornings and average them. 6) Keep steps roughly steady. 7) Change only one lever next week if needed.",
                "This checklist turns advice into data. Without it, articles stay entertainment.",
            ],
        ),
        (
            "Where IGNITE AI fits",
            [
                "You can run this with any honest logger. IGNITE AI is built for the friction points that usually break plans: mixed meals, repeat staples, and training context in one place.",
                "Snap → edit → confirm for new plates. Saved for repeats. Workouts beside food so you decide fueling on purpose.",
            ],
        ),
    ]
    for h, body in extras:
        if h not in have:
            expanded.append((h, body))
            have.add(h)

    non_bottom = [(h, b) for h, b in expanded if h != "Bottom line"]
    # keep an existing bottom if it had unique advice, else write a clean one
    old_bottom = next((b for h, b in expanded if h == "Bottom line"), [])
    clean_bottom = [p for p in old_bottom if p and CTA not in p and "Key takeaway for" not in p]
    if not clean_bottom:
        clean_bottom = [
            "Mechanisms first, weekly averages second, honest logging always. Pick the smallest protocol you can repeat for 12 weeks.",
        ]
    if CTA not in " ".join(clean_bottom):
        clean_bottom.append(CTA)
    non_bottom.append(("Bottom line", clean_bottom[:3]))
    return non_bottom


def main():
    meta = parse_existing()
    print("meta", len(meta))
    built = []
    for p in meta:
        sections, desc = build_post(p["slug"], p["title"], p["desc"])
        sections = expand(p["slug"], p["title"], sections)
        if desc.endswith("…") or len(desc) < 80:
            desc = (
                f"A detailed, science-aware guide to {p['title'].rstrip('?')}: practical protocols, "
                f"common mistakes, measurement methods, and a logging system you can keep on busy weeks."
            )
        if word_count(sections) < 400:
            sections.insert(
                -1,
                (
                    "Deeper context and edge cases",
                    [
                        "Edge cases include beginners vs advanced lifters, high-stress work weeks, travel, and medical constraints. Beginners can often progress near maintenance. Advanced lifters usually need clearer surplus or deficit phases.",
                        "If you have clinical symptoms, medication effects, or a history of disordered eating, get professional support. An app can improve measurement. It cannot replace care.",
                        "When evidence is mixed, prefer the intervention you can repeat for 12 weeks. Adherence is part of the physiology in free-living humans.",
                    ],
                ),
            )
        built.append(emit(p["slug"], p["title"], p["date"], desc, sections))

    OUT.mkdir(parents=True, exist_ok=True)
    n = len(built)
    sizes = [n // 4, n // 4, n // 4, n - 3 * (n // 4)]
    idx = 0
    names = [("batch-a", "batchA"), ("batch-b", "batchB"), ("batch-c", "batchC"), ("batch-d", "batchD")]
    for (fname, export), size in zip(names, sizes):
        chunk = built[idx : idx + size]
        idx += size
        path = OUT / f"{fname}.ts"
        path.write_text(f"export const {export} = [\n" + "\n".join(chunk) + "\n]\n", encoding="utf-8")
        print("wrote", path.name, len(chunk), "bytes", path.stat().st_size)

    (OUT / "index.ts").write_text(
        "import { batchA } from './batch-a'\n"
        "import { batchB } from './batch-b'\n"
        "import { batchC } from './batch-c'\n"
        "import { batchD } from './batch-d'\n\n"
        "export const moreBlogPosts = [...batchA, ...batchB, ...batchC, ...batchD]\n",
        encoding="utf-8",
    )
    part1 = OUT / "batch-a-part1.ts"
    if part1.exists():
        part1.unlink()
    print("total", n)


if __name__ == "__main__":
    main()
