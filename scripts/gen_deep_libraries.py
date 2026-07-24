# -*- coding: utf-8 -*-
"""Generate deep_content_rest1/2/3.py with unique deep builders for all remaining slugs."""
from __future__ import annotations

from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parents[1]
SLUGS = (ROOT / "scripts" / "more_slugs.txt").read_text(encoding="utf-8").strip().splitlines()

HEADER = '''# -*- coding: utf-8 -*-
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
    if bottom:
        sections.append(S("Bottom line", *bottom, CTA))
    else:
        sections.append(S("Bottom line", CTA))
    return sections

'''

# Topic-specific deep fact packs keyed by slug
# Each value: description, intro[list], sections[(h,[p...])], bottom[list]

def pack(desc, intro, sections, bottom=None):
    return {"desc": desc, "intro": intro, "sections": sections, "bottom": bottom or []}


# Load titles from blog-posts-more for richer intros
import re
more = (ROOT / "lib" / "blog-posts-more.ts").read_text(encoding="utf-8")
title_map = {}
for ch in more.split("slug: '")[1:]:
    slug = ch.split("'", 1)[0]
    title = ch.split("title: '", 1)[1].split("'", 1)[0]
    title_map[slug] = title


def deep_for(slug: str) -> dict:
    title = title_map.get(slug, slug.replace("-", " ").title())
    # Category routing with unique injected content
    if slug.startswith("how-many-calories-") and slug.split("how-many-calories-")[-1] in {
        "sit-ups","skiing","squats","push-ups","swimming","pilates","jumping-jacks","weight-lifting","running-mile"
    }:
        move = slug.replace("how-many-calories-", "").replace("-", " ")
        return exercise_pack(move, title)
    if "vs" in slug:
        return comparison_pack(slug, title)
    if slug.startswith("best-") or slug.startswith("apps-") or slug.startswith("fitness-apps"):
        return listicle_pack(slug, title)
    if slug in SPECIAL:
        return SPECIAL[slug]
    return default_pack(slug, title)


def exercise_pack(move: str, title: str) -> dict:
    return pack(
        f"A detailed look at calorie burn from {move}: what drives the estimate, bodyweight and intensity effects, wearable error, muscle vs calorie theater, and how to log training without eating the whole burn back.",
        [
            f"People ask about {move} calories because they want the session to justify dinner. Session burn is real, but it is usually smaller and noisier than the afterburn myths suggest.",
            f"Bodyweight, intensity, rest periods, and total work time dominate the estimate for {move}. Two people doing the same named workout can land far apart.",
            "Fat loss still follows weekly energy balance. Use training for stimulus and health first, and treat calorie printouts conservatively in a cut.",
        ],
        [
            ("What actually drives the burn", [
                f"For {move}, intensity and continuous work matter more than the exercise nickname. Hard efforts with long rests are not the same energy cost as continuous conditioning.",
                "Heavier bodies generally expend more energy doing the same movement pattern at the same speed or load.",
            ]),
            ("Order-of-magnitude expectations", [
                f"Consumer devices often assign tidy numbers to {move}. Treat them as a range with wide error bars, especially for intermittent efforts.",
                "If a short easy set somehow prints a huge calorie total, assume optimism and plan food as if the burn were lower.",
            ]),
            ("Muscle stimulus vs calorie theater", [
                f"The training value of {move} may matter more than the session kcal badge. Preserving or building muscle supports long-term energy needs and how you look at a given weight.",
                "Keep protein around 1.6 to 2.2 g/kg if you are dieting and lifting.",
            ]),
            ("Wearables and machine consoles", [
                "Wrist estimates struggle with load, rest, and non-step movements. Gym machine screens are convenient and frequently inflated.",
                "In a fat-loss phase, do not auto-eat the full printed number.",
            ]),
            ("A practical logging approach", [
                f"Log {move} sessions for consistency and progressive overload. Separately log food with photos when meals are chaotic.",
                "IGNITE AI keeps workouts and meal snaps on one timeline so training does not become an excuse to stop logging dinner.",
            ]),
            ("Who should care less about the calorie number", [
                "If your goal is strength, skill, or physique quality, progressive training and protein beat chasing a session burn target.",
                "If your goal is pure expenditure, walking and other continuous modalities are often easier to dose than short intermittent sets.",
            ]),
        ],
        [f"Use {move} for training value, interpret burn conservatively, hit protein, and keep the food log honest."],
    )


def comparison_pack(slug: str, title: str) -> dict:
    parts = slug.replace("-vs-", "|").split("|")
    if len(parts) != 2:
        a, b = "Option A", "Option B"
    else:
        a = parts[0].replace("-", " ").title()
        b = parts[1].replace("-", " ").title()
    # nicer names
    nice = {
        "Myplate": "MyPlate", "Myfitnesspal": "MyFitnessPal", "Nutrisystem": "Nutrisystem",
        "Weightwatchers": "WeightWatchers", "Macrofactor": "MacroFactor", "Rp Diet": "RP Diet",
        "Cronometer": "Cronometer", "Carb Manager": "Carb Manager", "Lose It": "Lose It!",
        "Noom": "Noom", "Mynetdiary": "MyNetDiary", "Fatsecret": "FatSecret", "Lifesum": "Lifesum",
        "Ww": "WeightWatchers", "Keto": "Keto", "Macros Tracking": "Macros tracking",
        "Calorie Counting": "Calorie counting",
    }
    a = nice.get(a, a)
    b = nice.get(b, b)
    return pack(
        f"An in-depth {a} vs {b} comparison for real-world logging, adherence, databases vs structure, and who should pick which tool.",
        [
            f"Choosing between {a} and {b} is less about brand loyalty and more about friction. The best tracker is the one you still fill in on a tired Thursday.",
            "Self-reported diaries underreport when logging is annoying. That research-shaped reality should sit above feature checklists.",
            f"Below is a practical breakdown of {a} versus {b}, then when a photo-first app like IGNITE AI is the better third option.",
        ],
        [
            (f"What {a} tends to optimize", [
                f"{a} usually wins for people whose workflow matches its core metaphor, whether that is databases, points, coaching lessons, or algorithm-guided targets.",
                "Ask whether its happy path matches your actual meals: packaged foods, keto math, psychology curriculum, or weigh-everything discipline.",
            ]),
            (f"What {b} tends to optimize", [
                f"{b} wins when its metaphor matches your habits better. A calmer UI, a bigger database, stricter micros, or a different coaching frame can matter more than a marketing adjective.",
                "Test both on barcode breakfast, homemade lunch, and restaurant dinner before you pay annually.",
            ]),
            ("Logging speed on mixed plates", [
                "Database-first tools are excellent for labels and weak for unlabeled bowls unless you invest in custom foods.",
                "If most calories come from cooking and restaurants, camera speed plus editable macros often beats search bars.",
            ]),
            ("Adherence and underreporting", [
                "The scientific-sounding feature set fails if weekend oils never enter the log. Speed and editability are accuracy features.",
                "Keep protein targets realistic if you lift, often around 1.6 to 2.2 g/kg in a cut, regardless of which brand you pick.",
            ]),
            ("Workouts and progress context", [
                "Some apps are food-only. Others include activity. Few combine photo macros, training logs, and social progress cleanly.",
                "If accountability matters, sharing progress with friends can beat another private streak counter.",
            ]),
            ("Verdict framework", [
                f"Pick {a} if its core metaphor matches your daily friction. Pick {b} if the opposite is true.",
                "Pick IGNITE AI if you need snap → edit → Saved plus workouts in one loop more than you need either brand's legacy workflow.",
            ]),
        ],
        [f"Run a three-day bakeoff with real meals. Keep the less annoying honest logger. Brand pride does not burn fat."],
    )


def listicle_pack(slug: str, title: str) -> dict:
    # Build a long listicle with unique blurbs
    catalogs = {
        "best-apps-gain-weight-2026": [
            ("IGNITE AI", "Photo macros plus workouts so large surplus meals actually get logged. Best for mixed plates and Saved staples. Watch-outs: edit oils on dense bowls."),
            ("MyFitnessPal", "Huge database for packaged surplus foods and shakes. Best for barcode-heavy gains. Watch-outs: slow on unlabeled homemade mass meals."),
            ("MacroFactor", "Updates targets from your weigh-ins and intake. Best for disciplined lifters. Watch-outs: assumes careful logging."),
            ("Cronometer", "Micronutrient quality while calories rise. Best if food quality matters during a bulk. Watch-outs: heavier UX."),
            ("Lose It!", "Simple calorie surplus tracking with a calmer UI. Best for straightforward goals. Watch-outs: not camera-first."),
            ("Strong or Hevy-style lift logs", "Progressive overload tracking. Best paired with any food logger. Watch-outs: not a nutrition diary alone."),
            ("Cal AI", "Camera-first logging for people who hate databases. Best for quick estimates. Watch-outs: compare full feature needs."),
            ("Lifesum", "Meal ideas with tracking. Best for beginners needing structure. Watch-outs: less athlete-depth for some users."),
            ("Yazio", "Simple diary and goals. Best for light tracking. Watch-outs: not a hardcore bulk coach."),
            ("FatSecret", "Budget tracking with community foods. Best when price matters. Watch-outs: uneven polish."),
            ("MyNetDiary", "Dense classic diary. Best for power users. Watch-outs: cognitive load."),
            ("Carbon", "Coaching-oriented macros. Best if you want programmed targets. Watch-outs: not photo-first chaos logging."),
            ("RP-style diet apps", "Template macros popular with lifters. Best for structured plans. Watch-outs: weighing culture assumed."),
            ("Noom", "Behavior layer if appetite psychology blocks eating enough. Best for mindset. Watch-outs: weak as pure macro engine."),
            ("WeightWatchers", "Points structure some people use to eat more consistently on purpose. Best for community. Watch-outs: not gram-precision macros."),
            ("Fooducate", "Packaged food quality checks while calories rise. Best for grocery decisions. Watch-outs: weak for unlabeled plates."),
            ("Samsung Health", "Activity satellite for steps. Best as a companion. Watch-outs: not primary macro logger."),
            ("Apple Fitness / Health stack", "Activity hub. Best as satellite. Watch-outs: food logging depth varies."),
            ("Recipe nutrition tools", "Batch high-calorie meal prep math. Best for Sunday cooks. Watch-outs: still need daily logging."),
            ("Grocery list apps", "Surplus fails when the fridge is empty. Best for consistency. Watch-outs: not calorie math."),
            ("Habit trackers", "Check off feedings and lifts. Best for adherence. Watch-outs: empty without a food log."),
            ("Scale apps with weekly averages", "Trend weight while gaining. Best to stop dirty-bulk denial. Watch-outs: water noise."),
            ("Spreadsheet DIY", "Full control. Best for nerds. Watch-outs: abandonment risk."),
            ("Shake-focused label workflows", "Easy calories when appetite lags. Best for hard gainers. Watch-outs: liquid calories still count."),
            ("IGNITE AI Saved meals", "One-tap re-logs for repeat high-calorie bowls. Best for busy bulks. Watch-outs: calibrate once carefully."),
        ],
    }
    items = catalogs.get(slug)
    if not items:
        # generic but still paragraph-per-item from title keywords
        items = default_list_items(slug)

    sections = [
        ("How to use this list", [
            "Install two options max. Log barcode breakfast, homemade lunch, and restaurant dinner in both. Keep the one you still open on Friday.",
            "Healthy weight change needs energy balance, protein, and training. Apps only make the math visible.",
        ])
    ]
    for i, (name, blurb) in enumerate(items, 1):
        sections.append((f"{i}. {name}", [blurb, "Test edit speed on your meals, not on demo screenshots."]))
    sections.append(("Choosing without going crazy", [
        "If mixed plates are your bottleneck, prioritize photo logging with editable macros and Saved repeats.",
        "If packaged foods dominate, database and barcode quality matter more.",
    ]))
    return pack(
        f"A detailed roundup for {title}: what each option does well, who it fits, and how to choose without installing ten apps.",
        [
            f"{title} only helps if the picks match how you eat and train. This list explains the job of each option, not just the logo.",
            "Underreporting rises when logging is annoying. Choose speed and honesty over feature hoarding.",
        ],
        sections,
        ["Pick two, test three days, keep one. Then execute protein, calories, and training for weeks."],
    )


def default_list_items(slug: str):
    base = [
        ("IGNITE AI", "Photo meal logging with macro edits, Saved repeats, workouts, and progress sharing. Best when mixed plates kill adherence. Watch-outs: still edit oils."),
        ("MyFitnessPal", "Large food database and barcodes. Best for packaged diets. Watch-outs: slow on messy bowls."),
        ("MacroFactor", "Expenditure-style updates from your data. Best for disciplined lifters. Watch-outs: weighing culture."),
        ("Cronometer", "Micronutrient depth. Best for precision. Watch-outs: heavier UX."),
        ("Lose It!", "Calmer classic calorie diary. Best for simplicity. Watch-outs: not camera-first."),
        ("Cal AI", "Camera-first estimates. Best for quick snaps. Watch-outs: compare full needs."),
        ("Carb Manager", "Net-carb and keto workflows. Best for low-carb protocols. Watch-outs: not ideal for high-carb athletes."),
        ("MyNetDiary", "Dense diary features. Best for power users. Watch-outs: overwhelm for beginners."),
        ("Lifesum", "Lifestyle framing and meal ideas. Best for beginners. Watch-outs: less hardcore macro culture."),
        ("Yazio", "Simple European-friendly tracking. Best for light diaries. Watch-outs: limited photo depth."),
        ("FatSecret", "Budget community database. Best for free-friendly tracking. Watch-outs: polish varies."),
        ("Noom", "Psychology curriculum. Best for behavior change. Watch-outs: not a lifting macro OS."),
        ("WeightWatchers", "Points and community. Best for accountability. Watch-outs: different from gram macros."),
        ("Fooducate", "Packaged food grades. Best for grocery quality. Watch-outs: weak mixed-plate logger."),
        ("Carbon", "Coaching-oriented macros. Best for programmed targets. Watch-outs: not photo-first."),
        ("Nutracheck", "UK barcode strength. Best for British packaged foods. Watch-outs: less useful elsewhere."),
        ("HealthifyMe", "Coaching plus tracking mix. Best in strong local markets. Watch-outs: test daily speed."),
        ("SnapCalorie-style tools", "Pure photo estimators. Best for camera experiments. Watch-outs: edit quality is everything."),
        ("Samsung Health", "Activity satellite. Best beside a real food log. Watch-outs: not primary macros."),
        ("Apple Health ecosystem", "Activity hub with partners. Best as satellite. Watch-outs: food depth varies."),
        ("Strong/Hevy lift logs", "Progressive overload. Best paired with nutrition apps. Watch-outs: not calorie math."),
        ("Spreadsheet DIY", "Custom control. Best for nerds. Watch-outs: easy to abandon."),
        ("Habit trackers", "Consistency checkboxes. Best as a layer. Watch-outs: empty without logging."),
    ]
    # vary length by slug hash
    n = 12 + (sum(map(ord, slug)) % 10)
    return base[:n]


SPECIAL = {}


def default_pack(slug: str, title: str) -> dict:
    topic = title.rstrip("?")
    return pack(
        f"A practical, science-aware guide to {topic.lower()}: mechanisms, numbers you can use, common mistakes, and a logging system that survives busy weeks.",
        [
            f"{topic} gets confusing when internet advice skips mechanisms. Energy balance, protein needs, and adherence still decide most outcomes.",
            "This guide gives you a usable framework: what matters physiologically, what to measure, what to ignore, and how to execute without perfectionism.",
            "You will see ranges rather than miracles. Individual medical issues need clinicians, not blog comments.",
        ],
        [
            ("The mechanism in plain language", [
                f"For {topic.lower()}, start with energy balance across weeks, not single days. Fat mass changes slowly; water and glycogen change fast.",
                "If you lift, protein often works well around 1.6 to 2.2 g/kg during deficits or recomp phases, with carbs set to support training.",
            ]),
            ("Numbers and ranges that help", [
                "Moderate fat-loss deficits often start around 300 to 500 kcal below true maintenance for many lifters. Aggressive cuts need a reason and an exit.",
                "Validate maintenance with two weeks of honest logging and stable average weight before you invent precision.",
            ]),
            ("What usually goes wrong", [
                "Underreporting oils, drinks, and weekend meals. Eating back optimistic wearable burns. Changing ten variables at once.",
                "Judging progress on one salty morning weigh-in instead of weekly averages.",
            ]),
            ("A protocol you can run for 14 days", [
                "1) Log every meal, photographing chaotic ones. 2) Keep steps roughly constant. 3) Lift on schedule. 4) Average daily weight. 5) Adjust only one lever after two weeks.",
                "Save repeat meals once calibrated so speed does not destroy accuracy.",
            ]),
            ("Special cases and caveats", [
                "Pregnancy, eating-disorder history, and medical conditions change the rules. Get professional help when that is you.",
                "Beginners can sometimes recomp near maintenance. Advanced lifters usually need clearer surplus or deficit phases.",
            ]),
            ("Make logging sustainable", [
                "The best plan is the one you can measure. Photo snap, edit fats and protein, save staples, and keep workouts visible beside food.",
            ]),
        ],
        [f"Execute {topic.lower()} with weekly averages, honest logs, and patience. Systems beat streaks of perfection."],
    )


# Fill SPECIAL with handcrafted deep posts for high-value non-exercise/non-vs/non-list slugs
def sp(desc, intro, sections, bottom=None):
    return pack(desc, intro, sections, bottom)

SPECIAL.update({
"burn-1000-calories-a-day": sp(
    "How to approach burning about 1,000 activity calories a day without wrecking recovery: NEAT first, lifting, cardio dosing, wearable skepticism, and food-log honesty.",
    [
        "Burning 1,000 calories a day usually means roughly 1,000 kcal of activity above a sedentary baseline, not 1,000 total daily energy expenditure. Most adults already burn far more than 1,000 kcal/day just staying alive.",
        "Chasing that activity burn with endless HIIT is how people get injured, ravenous, and inconsistent. A smarter stack uses steps, lifting, and only as much cardio as recovery allows.",
    ],
    [
        ("Build from NEAT first", [
            "Walking is the scalable lever. Raising daily steps can add hundreds of kcal with less recovery cost than stacking brutal intervals.",
            "Set a weekly step average, not a fragile perfect streak.",
        ]),
        ("Lift for the long game", [
            "Session burn from lifting is often moderate, but muscle retention in a deficit matters more than the watch badge.",
            "Keep protein high and progress reps or load over time.",
        ]),
        ("Cardio as a precision tool", [
            "Add steady cardio to close gaps after steps and lifting are set. Stop when sleep and joints complain.",
            "If the wearable says 1,000 but you are wrecked, the plan is failing.",
        ]),
        ("Food decides if the burn matters", [
            "Appetite rises with huge expenditure. Unlogged snacks can erase the project. Photograph meals and edit oils.",
            "In a cut, do not automatically eat back the full wearable number.",
        ]),
    ],
    ["Prefer sustainable NEAT and training over heroic burn screenshots. Recovery and intake honesty decide fat loss."],
),
"convert-steps-to-calories": sp(
    "How step-to-calorie conversions work, why bodyweight and pace dominate, why converters disagree, and how to use them without sabotaging a deficit.",
    [
        "Every steps-to-calories calculator makes assumptions about gait, intensity, and body mass. It does not know your hills, pack, or stop-and-go pattern.",
        "Conversions help planning if you treat them like weather: directional, not courtroom evidence.",
    ],
    [
        ("Variables that matter", [
            "Bodyweight, pace, grade, and continuity dominate energy cost.",
            "10,000 continuous brisk steps are not 10,000 fragmented indoor paces.",
        ]),
        ("Why converters disagree", [
            "Different MET tables, stride models, and wearable algorithms create wide spreads.",
            "If two apps disagree, use the lower number for fat-loss planning.",
        ]),
        ("Workflow", [
            "Pick one method for four weeks. Log food honestly. Watch weekly average weight. If weight stalls while converter calories look huge, the converter is optimistic or the log is incomplete.",
            "Never eat back 100% of converted step calories by default in a cut.",
        ]),
    ],
    ["Convert cautiously, validate with weekly weight trends, and keep dinner logging as serious as step math."],
),
"if-i-burn-1000-calories-weight-loss": sp(
    "Weekly fat-loss expectations from a claimed 1,000 kcal daily burn: crude energy math, water weight, wearable optimism, and verification steps.",
    [
        "If you truly expended 1,000 extra kcal per day and did not eat them back, crude teaching math points near about 7,000 kcal per week, often framed around two pounds of fat-energy. Real weeks are messier.",
        "Wearable 1,000 kcal claims are often optimistic, and compensation eating can erase the deficit.",
    ],
    [
        ("Crude weekly math", [
            "About 3,500 kcal per pound of fat is a classroom tool, not a personal guarantee.",
            "Fluid and glycogen shifts can make the scale move differently than fat mass.",
        ]),
        ("Verify the burn", [
            "Compare watch totals to conservative estimates. Easy sessions printing 1,000 kcal deserve skepticism.",
            "Check whether your food target already included exercise before eating burns back.",
        ]),
        ("Protect muscle", [
            "Keep protein elevated if lifting, often 1.6 to 2.2 g/kg in a deficit, and keep resistance training.",
        ]),
    ],
    ["A real extra 1,000 kcal/day can drive weekly fat loss only if the burn is real and the food log is honest."],
),
"cut-1000-calories-weight-loss-speed": sp(
    "What a 1,000 kcal daily deficit implies for speed, lean-mass risk, adherence, and why moderate deficits usually win the year.",
    [
        "A 1,000 kcal daily deficit is aggressive for many adults. On paper it predicts fast loss. In practice it often predicts hunger, training collapse, and rebound.",
        "Crude math again points near about two pounds of fat-energy per week if the deficit is real, with water making week one look flashier than fat alone.",
    ],
    [
        ("Why steep cuts fail", [
            "NEAT drops, sleep worsens, weekends explode, and lean mass risk rises without protein and lifting.",
            "Adaptive thermogenesis can make harsh diets harder over time.",
        ]),
        ("Safer default", [
            "Find maintenance, subtract about 300 to 500 kcal, keep protein high, lift, and walk. Individualize from weekly averages.",
        ]),
        ("Confirm the deficit size", [
            "Without measured maintenance, your supposed 1,000 cut may be much smaller or recklessly large.",
        ]),
    ],
    ["Fast cuts can move the scale and break the process. Moderate deficits usually produce better yearly outcomes."],
),
})

# Add more SPECIAL entries for remaining important slugs via compact definitions
MORE_SPECIAL_RAW = r'''
most-accurate-measure-calories-burned|Lab vs consumer calorie-burn measurement: calorimetry, doubly labeled water, MET charts, wearables, and why intake plus weekly weight often beats perfect burn chasing.|The most accurate expenditure methods live in labs. Wrists estimate. Match the tool to the decision.|For fat loss, honest intake plus weekly average weight usually beats a perfect burn dashboard.|Lab methods|Indirect calorimetry estimates resting metabolism from gases. Doubly labeled water estimates free-living expenditure over days in research.|Field tools|Wearables, MET charts, and machines vary by activity and algorithm. Lifting is easy to misread.|Wrong obsession|Intake underreporting often dwarfs burn error. Fix dinner logging before buying another gadget.|Framework|Use wearables for trends. Assume less burn than claimed in a cut. Validate with weight averages.|
how-many-calories-burn-per-day|How to set daily burn thinking using TDEE parts (BMR, TEF, NEAT, exercise) and validate with real-world logging.|Daily burn is TDEE, not a motivational poster number.|Ask what expenditure pattern supports your goal while you recover and log food.|TDEE parts|BMR, TEF, NEAT, and exercise. NEAT differences often dwarf small workout length changes.|By goal|Fat loss needs intake below expenditure. Muscle gain needs fuel and usually a small surplus.|Find your number|Estimate, log two weeks, keep activity steady, read average weight, then adjust.|
calories-from-fat-calculate|Convert fat grams to calories with the 9 kcal/g rule, label pitfalls, oils, and photo-log edits.|Fat has about 9 kcal per gram. Multiply fat grams by 9.|A 20 g fat meal contributes roughly 180 kcal from fat.|Labels|Check serving size first, then fat grams times nine.|Oils|A tablespoon of oil is often around 14 g fat, roughly 120 kcal, easy to miss visually.|Photo edits|Bias fats up on glossy or fried meals when snapping plates.|
bodybuilder-calories-how-many|Why bodybuilder calories vary by phase and size, with surplus and deficit methods you can copy without copying someone else's numbers.|There is no universal bodybuilder calorie intake.|Method transfers: find maintenance, set small surplus or controlled deficit, keep protein high, train hard.|Off-season|Many intermediates use about +200 to +300 kcal over maintenance for leaner gains.|Prep|Deficits scale to deadlines; late prep can be aggressive and should be time-limited.|Your number|Log honestly two weeks, stabilize activity, adjust 100 to 200 kcal at a time.|
calories-per-meal-guide|How to split daily calories across meals without dogma, including protein distribution and IF windows.|Meal calories are daily calories packaged by schedule.|There is no sacred lunch number.|Start from the day|Set daily calories and protein, then split across meals you will actually eat.|Protein distribution|Spread protein when possible instead of one giant dump.|Social meals|Budget larger dinners on purpose and log them.|
calories-to-gain-muscle|Set calories for muscle gain with small surplus, rate-of-gain targets, and anti-dirty-bulk logging.|Muscle gain needs training, protein, time, and usually a surplus after beginner phases.|Many intermediates do well at about +200 to +300 kcal over true maintenance.|Maintenance first|Two weeks of logging and stable average weight beat guessing.|Rate of gain|Often roughly 0.25% to 0.5% bodyweight per week for many intermediates.|Protein|About 1.6 to 2.2 g/kg with carbs high enough to perform.|
calories-dinner-weight-loss|Set dinner calories inside a fat-loss day: budgeting, protein anchors, and restaurant tactics.|Dinner has no magic fat-loss calorie.|The day and week decide.|Budget|If earlier meals used most calories, dinner must shrink, or earlier meals must leave room.|Protein first|Anchor dinner protein so the meal is not only carbs and alcohol.|Restaurants|Snap, bias fats up, keep protein honest, move on.|
calories-lunch-fitness-goals|Build lunch calories for performance and adherence with defaults and Saved meals.|Lunch should prevent chaotic dinners.|Exact calories depend on daily targets.|Split|Often near a third on three-meal days, adjusted for training time.|Defaults|Build two repeat lunches, calibrate, save, reuse.|Training|Put more carbs at lunch if you train after.|
how-long-burn-500-calories|How long ~500 kcal takes across modalities and why bodyweight changes the clock.|Time to burn 500 kcal shrinks as intensity and bodyweight rise.|No single answer without those variables.|Walking|Brisk walking may take a large fraction of an hour or more depending on mass and speed.|Hard modalities|Running or vigorous cardio can be faster with higher recovery cost.|Lifting caveat|Screens overstate intermittent lifting burns; value muscle stimulus too.|
500-calorie-meals-weight-loss|When 500-calorie meals work in a fat-loss day and how to keep them high-protein and satisfying.|500-calorie meals can work inside a planned day.|They fail when they are so small you binge later.|Build them|Prioritize protein and volume; measure oils.|Fit|Useful on four-meal days or to budget social dinners.|Fail|Athletes may underfuel if every meal is tiny.|
eating-1000-calories-a-day|Why 1,000 kcal days can drop the scale and damage long-term results.|1,000 kcal days usually create a large deficit for many adults.|Fast drops include water and raise rebound risk.|Risks|Lean mass loss, nutrient gaps, social fragility, medical issues for some.|Better path|Moderate deficit from true maintenance with high protein and lifting.|If you crashed|Raise carefully toward sustainability rather than living in fear at 1,000.|
how-calories-are-measured|Nine practical ways calories are measured from lab factors to labels, scales, photos, and menus.|Food label calories use established energy factors, not your personal bomb calorimeter.|Your job is accuracy enough for weekly decisions.|Methods|Labels, scale plus database, recipe math, barcodes, photo estimates, menus, hand portions, wearable burns, and lab contexts.|Hybrid|Labels and scale for staples; photos for chaos; weekly averages for truth.|
food-scale-for-calories-macros|Food-scale workflow: what to weigh, tare, raw vs cooked, and calibrate then relax.|A scale is high leverage if you weigh dense foods, not every lettuce leaf.|Oils, rice, meat, cheese, and nut butters matter most.|Tare|Zero the bowl, then add food.|Raw vs cooked|Match database states or create fake swings.|Calibrate|Weigh staples, save them, then use speed logging.|
measure-calories-food-at-home|Home calorie measurement toolkit and a weekly calibration routine.|Home methods will not match a metabolic ward.|They can still guide fat loss if bias stays small.|Toolkit|Labels, scale, recipe math, photos, leftover notes.|Calibration|Weigh five repeats weekly at first, compare to photo edits, save winners.|Errors|Oil guesses, serving sizes, raw/cooked mismatches, cooking bites.|
count-calories-when-cooking|Count homemade meals by logging the whole pot, dividing real servings, and saving the batch.|Cooking breaks trackers when oil is forgotten or servings are mythical.|Count the batch, then divide what you scoop.|Batch method|Log ingredients, weigh dense items, sum, portion, save.|Leftovers|Reuse Saved fractions instead of rebuilding memory math.|Tastes|They count; buffer or stop grazing.|
track-calorie-deficit-healthy|Track a healthy deficit with moderate cuts, protein, lifting, averages, and sustainable logging.|A healthy deficit supports training and life while fat trends down for weeks.|Tracking should not become a shame job.|Set|About 300 to 500 kcal below true maintenance for many lifters as a starting band.|Protect|Protein 1.6 to 2.2 g/kg and lifting.|Scoreboard|Weekly averages, waist, performance.|Breaks|Diet-break at maintenance if everything collapses.|
active-vs-total-calories|Active vs total calories on wearables and how to avoid double counting.|Active usually means movement burn; total usually includes resting metabolism.|Brands define these differently.|Fat loss use|Do not worship either. Avoid eating active calories back if totals already shaped intake.|Confusion|Cross-brand screenshots are unreliable.|Rule|One metric for trends, conservative cut interpretation, honest food log.|
active-vs-resting-calories|Resting vs active calories: BMR/RMR versus movement, and smart ways to raise expenditure.|Resting calories keep you alive at rest; active cover movement.|Together with TEF they shape TDEE.|Resting|Scales with size and lean mass patterns.|Active|NEAT often matters more than people think.|Raise burn|Lift, walk, add cardio as needed, sleep.|
track-calories-burned-tools|Twelve tools for tracking burn from wearables to the referee of weekly weight plus intake.|You need one or two tools you will use, plus a reality check.|More gadgets do not fix underreported dinners.|Tool map|Wearable, HR strap, phone steps, MET charts, consoles, training log, step averages, optional RMR, conservative rules, weight averages, waist/photos, honest food log.|Use|Interpret burn low in cuts; let averages referee.|
protein-for-body-recomp|Protein targets for body recomposition with training and calorie context.|Recomp is most realistic for beginners, returners, and higher body-fat lifters.|Protein often works best toward 1.6 to 2.2 g/kg near maintenance or a mild deficit.|Who can recomp|New lifters and returning lifters see it most.|Advanced|Usually need clearer surplus or deficit phases.|Execute|Progressive lifting, sleep, honest logging, weekly averages.|
gain-muscle-lose-fat-same-time|How simultaneous fat loss and muscle gain really works and who should expect it.|Simultaneous recomp happens most when you are new or returning.|Advanced lifters usually alternate phases.|Requirements|High protein, hard progressive training, patience, calories near maintenance or mild deficit if fat is high.|Tracking|Strength up, waist down, weekly averages beat daily scale drama.|
track-alcohol-macros|Track alcohol energy using ~7 kcal/g, mixers, sleep effects, and weekly budgeting.|Alcohol is about 7 kcal per gram and is not a classic macro like protein.|Mixers count. Sleep and next-day adherence often take the bigger hit.|Log it|Enter drink calories like food. Budget into weekly averages.|Training days|Hard sessions and heavy drinking pair poorly.|
protein-carnivore-diet|Protein on carnivore-style diets for lifters, energy density of fatty cuts, and tracking honesty.|Carnivore patterns are high protein and fat by design.|Lifters still benefit from intentional protein targets in elevated ranges.|Energy traps|Fatty cuts hide calories. Track honestly.|Sustainability|Medical and dietary variety concerns need individual judgment and professional input when relevant.|
track-macros-on-keto|Track keto macros with net vs total carbs, protein for muscle, and oil vigilance.|Keto prioritizes very low carbs, moderate protein, higher fat.|Pick net or total carbs and stay consistent.|Protein|Still matters for muscle; do not collapse it.|Oils|Log obsessively; photo edits help on mixed plates that break ketosis quietly.|
counting-macros-vs-calories|When to track calories only vs full macros for fat loss and performance.|Calories drive fat change. Macros shape hunger, muscle, and performance.|Beginners can start with calories plus protein.|Add full macros|When training demands tighter carb and fat control.|Tools|Fast logging beats abandoned perfect spreadsheets.|
does-collagen-count-as-protein|Collagen counts as protein grams but is incomplete for MPS compared with complete proteins.|Collagen is protein, yet low in key amino acids for muscle protein synthesis versus whey, meat, eggs, or soy.|Log grams if you want, but do not rely on collagen alone for lifting protein targets.|Use|Supplement role, not primary MPS fuel.|
can-eat-carbs-lose-weight|Why carbs can fit in fat loss and when low-carb is optional preference.|Fat loss needs a calorie deficit, not zero carbs.|Carbs can support training and adherence.|Insulin fear|Not a loophole around energy balance in a deficit.|Food quality|Fiber-rich carbs help satiety for many people.|
do-resting-calories-count-in-deficit|How resting burn fits into deficit math without double counting.|Resting burn is most of many people's TDEE.|Your deficit is intake versus total expenditure including resting calories.|No separate budget|You do not eat resting calories as a second wallet.|Set intake|Below total estimated burn, validated by weekly weight.|
do-carbs-make-you-fat|Carbs and fat gain: energy surplus vs carb unique-blame myths.|Carbs do not uniquely create fat independent of energy surplus.|Ultra-processed patterns can increase intake for some people.|Mechanism|Surplus is the fat-gain mechanism.|Practice|Set calories, hit protein, choose carbs you can adhere to.|
does-protein-turn-into-carbs|Gluconeogenesis explained without fearing protein.|The body can make glucose from amino acids when needed.|That is not a reason to treat protein like pasta.|Practice|Hit protein for satiety and muscle; set carbs by training needs.|
why-not-gaining-muscle|Fourteen high-impact fixes when muscle is not growing.|Most stalled gains come from weak progressive overload, low protein, no surplus when needed, poor sleep, and impatience.|Fixes span training, nutrition, recovery, and logging honesty.|Checklist|Progressive load, protein 1.6 to 2.2 g/kg, surplus if advanced, sleep, stop program hopping, log food, give phases months.|
does-counting-macros-work|When macro counting works long-term and when rigidity fails.|Macro counting works when it improves awareness and adherence.|It fails as perfectionism theater.|Periodize|Stricter in cuts, looser at maintenance for many people.|Speed tools|Photo logging lowers the cost of staying consistent.|
how-to-hit-your-macros|Systems to hit macros: protein first, defaults, shakes, Saved meals, pre-dinner checks.|Consistency beats exact gram chasing at every lunch.|Build defaults and decide dinner with remaining macros in view.|Tactics|Protein first, shake backups, save repeats, review before dinner, photograph chaos.|
ww-vs-keto|WeightWatchers vs keto: mechanisms, adherence, lifting needs, and who each fits.|WW uses points and community. Keto uses carb restriction.|Both can reduce calories through different rules.|Lifters|Often need more carb flexibility than strict keto allows.|Choose|Adherence and medical context beat tribal identity.|
ww-vs-macros-tracking|Points vs gram macros for training nutrition and accountability.|Points simplify decisions. Macros give training precision.|If protein and performance matter, macros usually fit better.|If community is the glue, WW can win.|Hybrid|Some people use WW socially and macros privately for lifts.|
ww-vs-calorie-counting|Points versus plain calorie counting for fat loss structure.|Both create intake structure.|Calories are transparent; points add preference rules.|Either works if average intake drops and logging stays honest.|
is-cronometer-worth-it|When Cronometer is worth it for micronutrients vs when simpler trackers win.|Cronometer shines for vitamins, minerals, and careful food data.|Worth it for precision-focused users.|If you only need calories and hate dense screens, simpler apps may win on adherence.|Photo needs|Chaotic plates may still need camera-first logging beside micros.|
how-to-use-saved-meals-ignite-ai|How to use Saved meals in IGNITE AI: calibrate once, re-log forever, when to re-snap.|Saved meals turn calibrated plates into one-tap logs.|Snap, edit oils and protein, save, then reuse on repeat days.|What to save|Oats, gym bowls, shakes, frequent sandwiches.|When to resnap|Recipe changes, new restaurant portions, sauce differences.|
build-streak-without-burning-out|Build logging streaks without perfectionism burnout.|Streaks help until missing one day destroys identity.|Use minimum viable logs on hard days.|Tactics|Photo snaps, Saved meals, weekly reviews, friend accountability instead of shame.|
protein-first-plate-method|Build plates around protein anchors for busy lifters.|Protein first, then carbs for training, fats for calories.|Photo-log and adjust.|Defaults beat fancy macros you miss.|Targets|Daily protein in evidence-based lifting ranges.|
weekend-calorie-damage-control|Control weekend damage without quitting tracking.|Weekends break averages when drinks and restaurants go unlogged.|Budget social meals, snap dinners, bias fats up, return Monday without revenge under-eating.|
meal-prep-macros-guide|Batch-cook macros: weigh dense inputs, divide servings, save meals.|Weigh oils and starches for the whole batch.|Divide by real containers, save, reheat without re-math.|
high-protein-snacks-macros|High-protein snacks that help hit 1.6 to 2.2 g/kg.|Yogurt, jerky, cottage cheese, shakes, edamame, and similar options.|Log extras; saves beat vending surprises.|
sleep-deficit-hunger-weight|How short sleep raises hunger and confuses scale weight.|Sleep loss can alter appetite signaling and raise stress-related water weight.|Fix sleep before crash-cutting calories.|
fiber-macros-satiety|Use fiber for satiety inside a calorie budget without GI chaos.|Fiber-rich carbs and vegetables improve fullness for many people.|Raise fiber gradually and still track total intake.|
sugar-cravings-calorie-deficit|Manage sugar cravings in a deficit with protein, sleep, and planned treats.|Cravings rise with sleep debt, low protein, and extreme restriction.|Log desserts on purpose instead of accidentally.|
maintenance-calories-find-yours|Find maintenance in two weeks with honest logs and average weight.|Eat consistently, log, average intake, watch weekly weight.|Flat weight means practical maintenance.|
diet-break-when-and-how|When to take a diet break and how to run maintenance weeks.|Diet breaks can restore training and adherence after long cuts.|Keep protein high, raise carbs, keep lifting, then resume.|
refeed-day-vs-diet-break|Refeeds vs diet breaks: duration, purpose, and logging.|Refeeds are short higher-carb days. Diet breaks last longer at maintenance.|Plan them; do not turn them into untracked chaos.|
travel-macros-airport-food|Hit macros while traveling with photo logs, shakes, and step floors.|Travel wrecks databases.|Snap airport food, bias fats up, protect protein, keep a step floor.|
late-night-snacking-macros|Late-night snacking strategies that fit macros.|Budget evening calories earlier if nights are dangerous.|High-protein snacks help; sleep fixes more than speeches.|
how-accurate-are-restaurant-menus|Restaurant menu calorie accuracy and how to adjust.|Published calories can be off because kitchens vary.|Use as drafts, adjust for oils and portion size, photo-log.|
protein-timing-myths|Protein timing myths vs total daily protein and training.|Total daily protein and stimulus matter more than anabolic window panic.|Spread doses when you can; shakes are convenient, not magic.|
cardio-vs-steps-fat-loss|Cardio vs steps for fat loss priorities.|Steps are low-stress NEAT. Cardio raises expenditure faster with more recovery cost.|Many cuts prefer a step floor plus lifting, adding cardio as needed.|
how-to-read-nutrition-labels-macros|Read labels for macros: servings, calories, protein, carbs, fat, fiber.|Serving size first.|Then macros. Watch multi-serving packages and net-carb marketing.|
best-time-to-weigh-yourself|Best weigh-in timing for trends.|Weigh most mornings after bathroom before food.|Average the week; ignore single spikes.|
water-weight-vs-fat-loss|Tell water weight from fat loss.|Fast drops are often water and glycogen. Fat is slower.|Use multi-week averages, waist, photos.|
how-to-log-shared-meals|Log shared plates and family-style meals.|Photograph before the table destroys evidence.|Estimate your portion, bias fats up, save regular family meals.|
ignite-ai-for-beginners|First-week IGNITE AI setup.|Set protein and calorie targets, snap every meal, edit misses, log a workout, save a staple, review day seven.|
macros-for-women-lifting|Macros for women who lift, including cycle water-weight context.|Enough protein and carbs to perform.|Use weekly averages; avoid crash deficits that crush training.|
macros-for-busy-parents|Macro tracking for busy parents.|Bites from kids plates count.|Photo-log fast, use Saved staples, protein anchors, logged days over perfect days.|
is-fitness-app-accurate|Improve fitness app reliability.|Apps estimate.|Better photos, oil edits, weekly weigh-ins, conservative activity burns create accuracy enough.|
how-to-track-macros-fast|Track macros fast on busy days.|Photo snap, Saved meals, shakes, protein-first dinner decisions.|A 20-second honest log beats a skipped day.|
'''

def parse_more_special(raw: str):
    out = {}
    for block in raw.strip().split("\n"):
        if not block.strip():
            continue
        parts = block.split("|")
        slug = parts[0]
        desc = parts[1]
        intro = [parts[2], parts[3]] if len(parts) > 3 else [parts[2]]
        sections = []
        i = 4
        while i + 1 < len(parts):
            h = parts[i]
            p = parts[i + 1]
            sections.append((h, [p]))
            i += 2
        bottom = [parts[-1]] if len(parts) > 5 else []
        # If last was consumed as section para, bottom may duplicate; keep simple
        out[slug] = sp(desc, intro, sections, bottom if bottom and bottom[0] not in (sections[-1][1][0] if sections else []) else ["Execute with weekly averages and honest logging."])
    return out

SPECIAL.update(parse_more_special(MORE_SPECIAL_RAW))

DONE = {"how-long-does-reverse-dieting-take", "how-many-calories-15000-steps", "how-many-calories-20000-steps", "walk-10000-steps-weight-loss-month"}


def emit_builder_fn(slug: str, data: dict) -> str:
    # serialize to python function
    def py_list(xs):
        return "[" + ", ".join(repr(x) for x in xs) + "]"

    sec_lines = []
    for h, paras in data["sections"]:
        sec_lines.append(f"        S({repr(h)}, {', '.join(repr(p) for p in paras)}),")
    bottom = data.get("bottom") or []
    fn = f'''
def _b_{slug.replace("-", "_")}(_title):
    return guide(
        {py_list(data["intro"])},
        [
{chr(10).join(sec_lines)}
        ],
        {py_list(bottom)},
    ), {repr(data["desc"])}
'''
    return fn


def write_rest_modules():
    remaining = [s for s in SLUGS if s not in DONE]
    # ensure every remaining has data
    all_data = {}
    for s in remaining:
        all_data[s] = SPECIAL.get(s) or deep_for(s)

    chunks = [remaining[0:35], remaining[35:70], remaining[70:]]
    names = ["deep_content_rest1.py", "deep_content_rest2.py", "deep_content_rest3.py"]
    for name, slugs in zip(names, chunks):
        body = [HEADER, "BUILDERS = {}\n"]
        for s in slugs:
            body.append(emit_builder_fn(s, all_data[s]))
            body.append(f"BUILDERS[{repr(s)}] = _b_{s.replace('-', '_')}\n")
        path = ROOT / "scripts" / name
        path.write_text("\n".join(body), encoding="utf-8")
        print("wrote", name, "builders", len(slugs))


if __name__ == "__main__":
    write_rest_modules()
    print("remaining covered", len(SLUGS) - len(DONE))
