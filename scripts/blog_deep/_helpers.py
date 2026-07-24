# -*- coding: utf-8 -*-
"""Shared helpers for deep blog content generation."""
from __future__ import annotations

Section = tuple[str | None, list[str]]
PostContent = tuple[str, list[Section]]


def validate_post(slug: str, desc: str, sections: list[Section]) -> None:
    intro = [s for s in sections if s[0] is None]
    h2 = [s for s in sections if s[0] is not None]
    if len(intro) != 1:
        raise ValueError(f"{slug}: expected 1 intro block, got {len(intro)}")
    if not (2 <= len(intro[0][1]) <= 4):
        raise ValueError(
            f"{slug}: expected 2-4 intro paragraphs, got {len(intro[0][1])}"
        )
    if not (8 <= len(h2) <= 12):
        raise ValueError(f"{slug}: expected 8-12 H2 sections, got {len(h2)}")
    for heading, paras in sections:
        min_paras = 1 if heading == "Bottom line" else 2
        if len(paras) < min_paras:
            raise ValueError(f"{slug}/{heading}: need {min_paras}+ paragraphs")
    if "—" in desc or "–" in desc:
        raise ValueError(f"{slug}: description contains dash")
    for heading, paras in sections:
        for p in paras:
            if "—" in p or "–" in p:
                raise ValueError(f"{slug}: paragraph contains dash")


def app_entry(name: str, does: str, best: str, watch: str) -> list[str]:
    return [
        f"{name} {does}",
        f"Best for: {best}",
        f"Watch-outs: {watch}",
    ]
