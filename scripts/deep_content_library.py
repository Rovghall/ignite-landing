# -*- coding: utf-8 -*-
"""Unique deep content for every more-post slug."""
from __future__ import annotations

CTA = (
    "When logging has to stay honest on busy days, IGNITE AI helps with photo meal snaps, macro edits, "
    "Saved repeats, and workouts in one loop. Snap it. Log it. Crush it."
)


def S(heading, *paras):
    return (heading, list(paras))


def guide(intro, parts, bottom=None):
    sections = [(None, intro)]
    sections.extend(parts)
    sections.append(S("Bottom line", *(bottom or [CTA])))
    if bottom:
        sections[-1] = S("Bottom line", *bottom, CTA)
    return sections


# ---------------------------------------------------------------------------
# Per-slug builders return (sections, description)
# ---------------------------------------------------------------------------

def build_post(slug: str, title: str, old_desc: str):
    fn = BUILDERS.get(slug)
    if not fn:
        raise KeyError(slug)
    sections, desc = fn(title)
    return sections, desc


def _rev(_t):
    return guide(
        [
            "Reverse dieting is a controlled climb out of a fat-loss phase. You raise calories in planned steps so training quality, hunger, and daily energy can recover without turning the exit into an accidental dirty bulk.",
            "It does not break energy balance. After you lose weight, maintenance usually falls because a smaller body costs less energy. Long cuts can also suppress NEAT and make hard training feel worse. Reverse dieting manages the return with weekly data.",
            "How long it takes depends on cut depth, duration, final leanness, sleep, and how suppressed your steps became. Mild cuts and aggressive peak weeks are not the same project.",
        ],
        [
            S("What you are repairing",
              "Body mass drop lowers maintenance. Appetite hormones like leptin can make hunger louder as fat mass falls. Steps and fidgeting often fall when people are tired, which reduces expenditure further.",
              "A staged calorie increase lets you watch weekly average weight while food rises, instead of guessing a giant jump."),
            S("Timelines by cut type",
              "Mild short cuts: often 2 to 4 weeks of small bumps toward maintenance.",
              "Moderate multi-month cuts: often 4 to 8 weeks.",
              "Aggressive or very lean finishes: often 8 to 12+ weeks. Some athletes reverse about as long as they cut. The real signal is stable weekly weight at an intake that supports training and life."),
            S("Weekly protocol",
              "End on a trainable floor. Add about 50 to 150 kcal every 5 to 7 days, often from carbs if lifting needs them. Keep protein high, commonly 1.6 to 2.2 g/kg if you lift. Hold steps steady. Judge with weekly averages, waist, and gym performance.",
              "If average weight rises too fast for two weeks, pause. If weight is flat and you still feel crushed, increase faster."),
            S("Maintenance is discovered, not declared",
              "Calculators are guesses. Maintenance is the intake where weekly average weight stays roughly stable for two or more weeks with consistent activity."),
            S("Who can skip a formal reverse",
              "If the cut was short, mild, and you feel fine, move to estimated maintenance and adjust for two weeks. Formal reverse dieting matters most after hard, long, or very lean phases."),
            S("Logging that keeps the climb honest",
              "Unlogged oils and drinks turn small bumps into stealth surpluses. Photograph meals, edit fats on glossy plates, and save calibrated staples."),
        ],
        ["Reverse dieting works when it is slow enough to collect data and fast enough to restore training. Expect weeks to a few months, not days."],
    ), "A deep reverse dieting guide: timelines after mild vs aggressive cuts, adaptive metabolism and NEAT, weekly calorie-bump protocols, and how to know you have reached workable maintenance."


def _steps15(_t):
    return guide(
        [
            "15,000 steps is a high daily movement target. It usually burns more than 10,000, but bodyweight, pace, terrain, and stop-and-go patterns decide the calorie total.",
            "Many adults land in a several-hundred-kcal band for large walking days, with heavier bodies and brisk paces higher. Easy flat shuffling lands lower.",
            "Treat converters and watches as directional. Fat loss still depends on weekly intake versus expenditure.",
        ],
        [
            S("MET logic without the textbook fog",
              "Walking intensity is often expressed in METs. Easy walking might sit near about 2.5 to 3.5 METs; brisk walking higher. Energy cost scales with mass and time at that intensity.",
              "15k easy steps can take much longer than 15k brisk commute steps. Same count, different burn and fatigue."),
            S("Order-of-magnitude ranges",
              "Lighter bodyweight + easy pace: toward the lower end of a few hundred kcal for that walking volume.",
              "Heavier bodyweight + hills or brisk pace: meaningfully higher. Identical step counts can differ widely between people."),
            S("Wearable overestimation",
              "Devices often overstate activity energy. Eating back 100% of claimed burn is a classic fat-loss stall.",
              "In a cut, treat steps as a NEAT floor and eat back little or none unless you are fueling performance on purpose."),
            S("Recovery and hunger",
              "High steps cost time, feet, and appetite. If sleep drops and evening eating explodes, the target is too aggressive for that week.",
              "Keep lifting. Steps do not replace progressive overload."),
            S("Weekly operating system",
              "Use a weekly average step target. Keep protein high if you lift. Log food as seriously as steps. Judge fat loss on multi-week average weight.",
              "Photograph dinners after long walking days so fatigue does not delete honesty."),
        ],
        ["15k steps can raise expenditure meaningfully. Use them to support the deficit, not to justify unlogged dinners."],
    ), "Realistic 15,000-step calorie ranges by bodyweight and pace, MET context, wearable error, and how to use high steps for fat loss without eating the burn back."


def _steps20(_t):
    return guide(
        [
            "20,000 steps is an extreme target for most schedules. It can create a large walking energy cost and also inflate hunger, steal lifting time, and wreck evenings.",
            "If you chase 20k for fat loss, the food log must stay ruthless. Huge step days are classic I earned it setups.",
        ],
        [
            S("Burn context",
              "Versus 10k, 20k roughly doubles walking volume if pace and terrain stay similar, so walking energy often rises a lot. Exact kcal still scales with bodyweight and intensity.",
              "Prefer conservative assumptions in a cut. Watch totals and MET charts will disagree."),
            S("When 20k helps",
              "Short phases needing a NEAT lever, already-active jobs, or travel days where walking is natural.",
              "It helps least when recovery and late-night eating collapse."),
            S("Compensation risk",
              "Big expenditure can raise appetite. Low protein and delayed dinner make compensation eating exceed the walk.",
              "Front-load protein and plan dinner before you are ravenous."),
            S("Smarter default for many cuts",
              "A repeatable 8k to 12k average plus lifting often beats a brittle 20k streak. Raise steps when weekly averages stall despite honest logging."),
        ],
        ["20k can burn a lot and backfire. Use sparingly, protect protein and sleep, and never trade honesty for step vanity."],
    ), "What 20,000 steps means for calorie burn, hunger, recovery, and fat loss, and when a lower repeatable step target is the better cut strategy."


def _walk_month(_t):
    return guide(
        [
            "10,000 steps a day is memorable, not a guaranteed monthly fat-loss contract. Steps raise expenditure. Food intake and compensation decide whether fat drops.",
            "Crude fat math uses about 3,500 kcal per pound as a teaching tool, but monthly scale change also includes water and glycogen noise.",
        ],
        [
            S("What 10k might add",
              "For many adults, 10k steps often lands around a few hundred kcal depending on weight and pace.",
              "Moving from 3k to 10k can create a meaningful weekly bump. Moving from 9k to 10k is smaller."),
            S("Monthly math without diet change",
              "If walking adds about 300 kcal/day and you do not eat more, that is roughly 9,000 kcal across 30 days, on the order of a couple pounds of fat-energy in crude math.",
              "In practice people often eat more or reduce other movement, shrinking results."),
            S("10k plus diet works better",
              "Pair steps with a moderate deficit and protein around 1.6 to 2.2 g/kg if you lift. Keep resistance training so more loss comes from fat.",
              "Use weekly averages across the month, not one end-of-month weigh-in."),
            S("Why the monthly scale lies",
              "Sodium, menstrual fluid, hard training, and carb shifts can hide fat loss. Waist and photos help."),
        ],
        ["10k steps can support monthly fat loss modestly alone and more strongly with controlled intake. Steps are a lever, not a promise."],
    ), "Realistic monthly weight-loss expectations from a 10,000-step habit, including calorie ranges, diet interaction, and water-weight noise."


BUILDERS = {
    "how-long-does-reverse-dieting-take": _rev,
    "how-many-calories-15000-steps": _steps15,
    "how-many-calories-20000-steps": _steps20,
    "walk-10000-steps-weight-loss-month": _walk_month,
}


def _generic_deep(slug, title, kind: str):
    """Fallback used only while library is incomplete — should not remain."""
    raise KeyError(slug)


# Fill remaining builders by importing expanded module parts
def _load_rest():
    global BUILDERS
    try:
        from deep_content_rest1 import BUILDERS as B1
        BUILDERS.update(B1)
    except ImportError:
        pass
    try:
        from deep_content_rest2 import BUILDERS as B2
        BUILDERS.update(B2)
    except ImportError:
        pass
    try:
        from deep_content_rest3 import BUILDERS as B3
        BUILDERS.update(B3)
    except ImportError:
        pass


_load_rest()
