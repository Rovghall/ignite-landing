# -*- coding: utf-8 -*-
"""Deep rewrite batch A: calorie, steps, measurement posts."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "lib" / "blog-more"


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


def write_batch(name: str, export: str, posts: list[str]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / f"{name}.ts"
    content = f"export const {export} = [\n" + "\n".join(posts) + "\n]\n"
    path.write_text(content, encoding="utf-8")
    print("wrote", path, "posts", len(posts), "bytes", path.stat().st_size)


# ---------------------------------------------------------------------------
# BATCH A
# ---------------------------------------------------------------------------

A: list[str] = []

A.append(
    emit_post(
        "how-long-does-reverse-dieting-take",
        "How Long Does Reverse Dieting Take to Work Well?",
        "2026-05-08",
        "A detailed reverse dieting guide: timelines after mild vs aggressive cuts, how adaptive thermogenesis and NEAT fit in, weekly calorie bump protocols, and how to know when you have truly reached a workable maintenance.",
        [
            (
                None,
                [
                    "Reverse dieting is the controlled climb out of a fat-loss phase. You raise calories in planned steps so training, hunger, and hormones can recover without turning the exit into an accidental bulk.",
                    "It is not a loophole around energy balance. A smaller body burns less. Long cuts can also reduce NEAT and make hard training feel worse. Reverse dieting manages the return to maintenance with data, not vibes.",
                    "How long it takes depends on how deep the cut was, how lean you got, how long you dieted, and how suppressed your steps and sleep became. Two people ending at the same calorie floor can need very different reverse timelines.",
                ],
            ),
            (
                "What reverse dieting is actually fixing",
                [
                    "During a cut, three things usually move: body mass drops (so maintenance drops), activity outside the gym often falls, and hunger signaling can get louder as fat mass falls and leptin declines.",
                    "If you jump from a deep deficit straight to a huge surplus, fat regain can be fast because intake suddenly exceeds the new, lower maintenance. A staged increase lets you watch weekly average weight while calories rise.",
                    "Sports nutrition practice treats reverse phases as exit ramps, especially after aggressive or lengthy diets. Beginners who only did a mild four-week cut may not need a dramatic reverse at all.",
                ],
            ),
            (
                "Timelines that match real cuts",
                [
                    "Mild, short cuts (small deficit, four to eight weeks): often two to four weeks of small bumps back toward estimated maintenance is enough.",
                    "Moderate cuts (months of dieting, noticeable fatigue): often four to eight weeks. You are restoring food, not chasing a magic metabolic unlock.",
                    "Aggressive or very lean finishes: often eight to twelve or more weeks. Some athletes reverse for roughly as long as they cut. The clock is secondary to the signal: stable weekly weight at an intake that supports training and life.",
                ],
            ),
            (
                "A practical weekly protocol",
                [
                    "1) End the cut on a floor you can still train on, not a crash. 2) Add about 50 to 150 kcal every five to seven days, often from carbohydrates if lifting performance needs them. 3) Keep protein high, commonly in the 1.6 to 2.2 g/kg range if you lift. 4) Hold steps roughly steady so NEAT does not collapse as food rises. 5) Judge with weekly average weight, waist, and gym performance.",
                    "If average weight rises faster than you want for two weeks, pause the increase. If weight is flat and you still feel crushed in the gym, increase a bit faster or add a larger single jump toward estimated maintenance.",
                ],
            ),
            (
                "Maintenance is a range, not a destiny number",
                [
                    "Online TDEE calculators are starting guesses. True maintenance is the intake where weekly average weight stays roughly stable for two or more weeks while activity is consistent.",
                    "During reverse dieting you are discovering that number again at your new bodyweight. Expect it to be lower than your old pre-cut maintenance if you lost a meaningful amount of mass.",
                ],
            ),
            (
                "Hormones, hunger, and expectations",
                [
                    "Leptin and related appetite signals can make reverse phases feel mentally loud even when the plan is correct. That does not mean reverse dieting failed. It means you should keep protein high, keep lifting, and avoid all-or-nothing weekends that erase the controlled climb.",
                    "If you have medical symptoms (severe fatigue, cold intolerance, menstrual disruption, persistent depression), talk to a clinician. Apps help with logging. They do not replace care.",
                ],
            ),
            (
                "Logging that keeps the reverse honest",
                [
                    "The reverse fails when unlogged oils and drinks quietly turn small bumps into large surpluses. Photograph meals, edit fats on glossy plates, and save staples once they are calibrated.",
                    "In IGNITE AI, snap → edit → confirm, then save repeats to Saved. Log workouts in the same timeline so you can see whether performance is actually recovering as calories rise.",
                ],
            ),
            (
                "Who should skip a formal reverse",
                [
                    "If your cut was short, mild, and you feel fine, you can often move straight to estimated maintenance and adjust for two weeks. Formal reverse dieting is most useful after hard, long, or very lean phases.",
                ],
            ),
            (
                "Bottom line",
                [
                    "Reverse dieting works when it is slow enough to collect data and fast enough to restore training quality. Timelines usually span weeks to a few months, not days. Keep protein high, raise calories on purpose, watch weekly averages, and log honestly. Snap it. Log it. Crush it.",
                ],
            ),
        ],
    )
)

A.append(
    emit_post(
        "how-many-calories-15000-steps",
        "How Many Calories Does Walking 15,000 Steps Burn?",
        "2026-05-06",
        "Realistic calorie ranges for 15,000 steps by bodyweight and pace, how MET estimates work, why watches overestimate, and how to use a high step target for fat loss without eating the burn back.",
        [
            (
                None,
                [
                    "15,000 steps is a serious daily movement target. It usually burns more than 10,000, but the exact calorie number depends on bodyweight, speed, terrain, and whether those steps replace sitting or replace harder training.",
                    "A useful mental model: many adults land in a several-hundred-calorie band for high step days, with heavier bodies and brisk paces toward the top. Easy shuffling on flat ground lands lower.",
                    "Treat any converter or watch as directional. Fat loss still depends on weekly energy intake versus expenditure, not on a single heroic step count.",
                ],
            ),
            (
                "How step calories get estimated",
                [
                    "Exercise physiology often uses METs (metabolic equivalents). Easy walking might sit near about 2.5 to 3.5 METs; brisk walking higher. Energy cost scales with body mass and time at that intensity.",
                    "15,000 steps at a casual pace can take much longer than 15,000 steps at a commute-brisk pace. Same step count, different total energy and different fatigue.",
                ],
            ),
            (
                "Example ranges (order of magnitude)",
                [
                    "Lighter bodyweight, easy pace: often toward the lower end of a few hundred kcal above sedentary baseline for that walking block.",
                    "Heavier bodyweight, brisk pace or hills: meaningfully higher. Two people with identical step counts can differ by a wide margin.",
                    "These are not courtroom numbers. They are planning ranges so you do not invent a 1,200 kcal pizza permission slip from a walk.",
                ],
            ),
            (
                "Wearables and overestimation",
                [
                    "Consumer devices frequently overestimate activity energy. If you eat back 100% of claimed burn, fat loss stalls even while steps look impressive.",
                    "In a fat-loss phase, many people do better treating steps as a NEAT floor and eating back little or none of the watch total, unless they are deliberately fueling performance.",
                ],
            ),
            (
                "15k steps and recovery",
                [
                    "High steps are usually easier on recovery than pounding high-intensity cardio every day, but they still cost time, feet, and appetite. If hunger explodes and sleep drops, the target is too aggressive for that week.",
                    "Keep resistance training. Steps do not replace progressive overload for muscle.",
                ],
            ),
            (
                "A practical way to use 15k",
                [
                    "1) Set a weekly average step target, not a fragile daily streak. 2) Keep protein high if you lift. 3) Log food with the same seriousness as steps. 4) Judge fat loss on multi-week average weight.",
                    "Photograph dinners so the food log does not become fiction after a long walking day. IGNITE AI is built for that snap → edit → confirm loop, with Saved meals for repeats.",
                ],
            ),
            (
                "Bottom line",
                [
                    "15,000 steps can burn a meaningful chunk of daily energy, scaled by weight and pace. Use it to raise NEAT, not to justify unlogged eating. Weekly averages beat watch worship.",
                ],
            ),
        ],
    )
)

A.append(
    emit_post(
        "how-many-calories-20000-steps",
        "How Many Calories Does Walking 20,000 Steps Burn?",
        "2026-05-05",
        "What 20,000 daily steps really means for calorie burn, hunger, recovery, and fat loss, including MET context, bodyweight scaling, and why extreme step targets can backfire.",
        [
            (
                None,
                [
                    "20,000 steps is an extreme-for-most daily target. It can create a large walking energy cost, especially for heavier walkers and hilly routes. It can also inflate hunger, wreck evenings, and steal time from lifting and sleep.",
                    "If you are chasing 20k for fat loss, make sure the food log stays honest. Large step days are classic setups for I earned it dinners that erase the expenditure.",
                ],
            ),
            (
                "Burn estimates in plain language",
                [
                    "Compared with 10k, 20k roughly doubles walking volume if pace and terrain stay similar, so walking energy often rises substantially. Exact kcal still scales with bodyweight and intensity.",
                    "MET-based estimates and wearables will disagree. Prefer conservative assumptions in a cut.",
                ],
            ),
            (
                "When 20k helps",
                [
                    "Short phases where you need a NEAT lever, active jobs that already push volume, or event-style days (travel walking, sightseeing) where steps come naturally.",
                    "It helps least when it destroys recovery or pushes you into chaotic late eating.",
                ],
            ),
            (
                "Hunger and compensation",
                [
                    "Big expenditure days can increase appetite. If protein is low and meals are delayed, compensation eating can exceed the walking burn, especially with liquid calories.",
                    "Front-load protein, plan dinner before you are ravenous, and log drinks.",
                ],
            ),
            (
                "Smarter alternative for many cuts",
                [
                    "A repeatable 8k to 12k average plus lifting often beats a brittle 20k streak. Raise steps only when weekly fat-loss averages stall despite honest logging.",
                ],
            ),
            (
                "Logging tip",
                [
                    "On huge walking days, photo-log meals before fatigue deletes honesty. Save staples in IGNITE AI so dinner is one tap, not a database fight.",
                ],
            ),
            (
                "Bottom line",
                [
                    "20,000 steps can burn a lot and also backfire. Use it sparingly, keep protein and sleep intact, and never trade an honest food log for step vanity.",
                ],
            ),
        ],
    )
)

A.append(
    emit_post(
        "walk-10000-steps-weight-loss-month",
        "If I Walk 10,000 Steps a Day, How Much Weight Will I Lose in a Month?",
        "2026-05-04",
        "A realistic monthly fat-loss estimate from a 10,000-step habit: calorie ranges, why diet decides the outcome, water-weight noise, and how to combine steps with protein and lifting.",
        [
            (
                None,
                [
                    "10,000 steps a day is popular because it is memorable. It is not a guaranteed monthly fat-loss contract. Steps raise expenditure. Food intake, bodyweight, and compensation decide whether fat actually drops.",
                    "Textbook fat tissue math is roughly 3,500 kcal per pound of fat as a crude teaching tool, but real weeks include water, glycogen, and measurement error. Monthly scale change is not pure fat.",
                ],
            ),
            (
                "What 10k might burn",
                [
                    "For many adults, 10,000 steps often lands around a few hundred kcal depending on weight and pace. That is helpful. It is rarely a 1,000 kcal free pass.",
                    "If your baseline was 3,000 steps, moving to 10k can create a meaningful weekly expenditure bump. If you already walk 9k, the upgrade is smaller.",
                ],
            ),
            (
                "Monthly math without diet change",
                [
                    "Suppose walking adds about 300 kcal/day versus your old routine and you do not eat more. That is roughly 9,000 kcal across 30 days, on the order of a couple pounds of fat-energy in crude math.",
                    "In practice, people often eat a bit more, sleep differently, or reduce other movement. Monthly results then shrink. Some people lose more because appetite stays stable and meals get more structured.",
                ],
            ),
            (
                "When 10k plus diet works better",
                [
                    "Pair steps with a moderate calorie deficit and protein around 1.6 to 2.2 g/kg if you lift. Keep resistance training so more of the loss comes from fat, not muscle.",
                    "Judge with weekly average weight over the month, not a single end-of-month weigh-in after a salty dinner.",
                ],
            ),
            (
                "Why the scale lies across 30 days",
                [
                    "Sodium, menstrual cycle fluid, hard training, and carbohydrate shifts can hide fat loss for days. Photos, waist, and averages tell a clearer story than one number.",
                ],
            ),
            (
                "Make the month measurable",
                [
                    "Log food daily. Photograph chaotic meals. Keep steps as a weekly average target. In IGNITE AI, keep meals and workouts on one timeline so you can see what actually changed.",
                ],
            ),
            (
                "Bottom line",
                [
                    "10,000 steps can support monthly fat loss, often modestly by itself and more strongly with a controlled diet. Steps are a lever, not a guarantee.",
                ],
            ),
        ],
    )
)

A.append(
    emit_post(
        "burn-1000-calories-a-day",
        "How to Burn 1,000 Calories a Day (Without Wrecking Recovery)",
        "2026-05-03",
        "How to approach a 1,000-calorie daily burn target with NEAT, lifting, and cardio without destroying recovery, plus why wearables mislead and how to keep the food log honest.",
        [
            (
                None,
                [
                    "Burning 1,000 calories a day usually means 1,000 kcal of activity above a sedentary baseline, not 1,000 total daily energy expenditure. That distinction matters. Most adults already burn far more than 1,000 kcal/day just staying alive.",
                    "Chasing a 1,000 kcal exercise burn every day is a recovery minefield if you do it with endless HIIT. A smarter mix uses steps, some cardio, and lifting, then validates with weekly trends.",
                ],
            ),
            (
                "Build the burn from NEAT first",
                [
                    "Walking is the scalable lever. Raising daily steps can add hundreds of kcal with less recovery cost than smashing intervals twice a day.",
                    "Stand more, take calls while walking, and set a weekly step average. Boring works.",
                ],
            ),
            (
                "Add lifting for the long game",
                [
                    "Weight training may not print huge session calorie numbers, but it protects muscle in a deficit and supports long-term energy needs. Session burn is not the only value.",
                    "Keep protein high. Progressive overload still matters even when fat loss is the headline goal.",
                ],
            ),
            (
                "Cardio as a precision tool",
                [
                    "Use steady cardio to close an expenditure gap after steps and lifting are set. Avoid stacking brutal sessions that wreck sleep and raise injury risk.",
                    "If wearable burn says 1,000 but you are exhausted and ravenous, the plan is failing even if the watch looks impressive.",
                ],
            ),
            (
                "The food side decides whether the burn matters",
                [
                    "Appetite often rises with huge expenditure. Unlogged snacks can erase the entire 1,000 kcal project. Photograph meals and edit oils.",
                    "In a cut, do not automatically eat back the full wearable number.",
                ],
            ),
            (
                "A sample sustainable template",
                [
                    "Lift 3 to 4 days per week. Hit a high but livable step average. Add 20 to 40 minutes of easy cardio on needed days. Sleep 7+ hours when you can. Review weekly average weight.",
                    "IGNITE AI helps keep food and training visible together so the 1,000 kcal chase does not become disconnected from intake.",
                ],
            ),
            (
                "Bottom line",
                [
                    "You can approach large daily activity burns, but recovery and intake honesty decide if fat loss follows. Prefer NEAT and sustainable training over heroic watch screenshots.",
                ],
            ),
        ],
    )
)

# Continue adding more posts to A in the same file via extending the list below in subsequent writes...
# For now write what we have and append remaining in part 2

write_batch("batch-a-part1", "batchAPart1", A)
print("part1 done", len(A))
