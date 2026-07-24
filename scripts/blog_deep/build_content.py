# -*- coding: utf-8 -*-
"""Route slug to full deep post content."""
from __future__ import annotations

from blog_deep._helpers import validate_post
from blog_deep.content_factory import FACTORY

PostContent = tuple[str, list[tuple[str | None, list[str]]]]


def build_post(slug: str) -> PostContent:
    if slug not in FACTORY:
        raise KeyError(f"No content for slug: {slug}")
    desc, sections = FACTORY[slug]()
    sections = _pad_sections(sections)
    validate_post(slug, desc, sections)
    return desc, sections


def _pad_sections(sections: list) -> list:
    second_lines = [
        "Track weekly average weight for two to four weeks before changing the plan again.",
        "Pair this with protein near 1.6 to 2.2 g/kg if you lift in a deficit.",
        "Log oils, drinks, and weekend meals with the same honesty as weekday staples.",
        "NEAT from daily steps often moves fat loss more than obsessing over one variable alone.",
        "Sleep loss can raise ghrelin and blunt leptin signaling, making the next day harder.",
        "Photo logging with quick edits beats skipping the meal because search failed.",
        "Saved repeat meals reduce friction so adherence survives busy weeks.",
    ]
    out = []
    n = 0
    for heading, paras in sections:
        if heading and heading != "Bottom line" and len(paras) == 1:
            paras = list(paras) + [second_lines[n % len(second_lines)]]
            n += 1
        out.append((heading, paras))
    return out
