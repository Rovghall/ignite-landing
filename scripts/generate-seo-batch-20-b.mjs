/**
 * Generate SEO batch #2 (20 EN posts) with unique Ignite CTAs per article.
 * Usage: node scripts/generate-seo-batch-20-b.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const BLOG_PATH = path.join(ROOT, 'content', 'en', 'blog.json')

function kcal(met, kg, minutes) {
  return Math.round(met * kg * (minutes / 60))
}

function tableLines(met, label) {
  const weights = [55, 70, 85]
  const durations = [15, 30, 45, 60]
  const header = `Estimated calories for ${label} (MET ≈ ${met}) — approximate, Compendium-style intensity:`
  const rows = weights.map((kg) => {
    const cells = durations.map((m) => `${m} min: ~${kcal(met, kg, m)}`).join(' · ')
    return `${kg} kg: ${cells}`
  })
  return [header, ...rows]
}

function singleActivityPost({
  slug,
  title,
  date,
  activity,
  met,
  metNote,
  hook,
  intensityNotes,
  trainingValue,
  igniteHook,
  igniteClose,
}) {
  const at70_30 = kcal(met, 70, 30)
  const at70_60 = kcal(met, 70, 60)
  return {
    slug,
    title,
    date,
    description: `A ${activity.toLowerCase()} session burns about ${at70_30} kcal in 30 minutes for a 70 kg person at MET ≈ ${met} (about ${at70_60}/hour). See calorie tables by bodyweight and duration, intensity caveats, and how to turn the session into progress you can see.`,
    sections: [
      {
        body: [
          hook,
          `Using a working MET of about ${met}${metNote}, a 70 kg person lands near ${at70_30} calories in 30 minutes — roughly ${at70_60} per hour. Scale up or down with bodyweight; long rests and easy intervals pull the real total lower.`,
          'Fat loss still follows weekly energy balance. Treat class boards and wearables as a range, not a free pass for unlogged meals.',
        ],
      },
      {
        heading: 'Calorie estimates by bodyweight and duration',
        body: [
          ...tableLines(met, activity),
          'These assume continuous effort at the stated intensity. Instruction breaks, water stops, and scrolling between rounds do not count as work.',
        ],
      },
      {
        heading: 'What actually drives the burn',
        body: [
          intensityNotes,
          'Heavier bodies expend more energy doing the same pattern. Intensity and continuous minutes beat the nickname on the timetable.',
        ],
      },
      {
        heading: 'Wearables and studio boards',
        body: [
          'Wrist estimates struggle with load, rest, and non-step movement. Studio boards and machine screens are convenient and often optimistic.',
          'In a cut, plan food as if the printed burn were 20–40% lower unless your scale trend says otherwise.',
        ],
      },
      {
        heading: 'Training value vs calorie theater',
        body: [
          trainingValue,
          'If physique change matters, keep protein around 1.6–2.2 g/kg and protect sleep. A calorie badge does not replace progressive work or an honest diary.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [igniteHook],
      },
      {
        heading: 'Bottom line',
        body: [
          `Expect roughly ${at70_30} kcal in 30 minutes at 70 kg for ${activity.toLowerCase()} at MET ≈ ${met}, then adjust for your weight and how hard you actually moved.`,
          igniteClose,
        ],
      },
    ],
  }
}

function vsPost({
  slug,
  title,
  date,
  aName,
  aMet,
  bName,
  bMet,
  hook,
  pickGuide,
  igniteHook,
  igniteClose,
}) {
  const a30 = kcal(aMet, 70, 30)
  const b30 = kcal(bMet, 70, 30)
  const diff = Math.abs(a30 - b30)
  const higher = a30 >= b30 ? aName : bName
  const lower = a30 >= b30 ? bName : aName
  return {
    slug,
    title,
    date,
    description: `At MET ≈ ${aMet} vs ≈ ${bMet}, a 70 kg person burns about ${a30} kcal in 30 minutes of ${aName.toLowerCase()} versus about ${b30} for ${bName.toLowerCase()} (${diff} kcal gap). Compare tables, pick for goals, and keep post-session meals honest.`,
    sections: [
      {
        body: [
          hook,
          `For a 70 kg person over 30 minutes: ~${a30} kcal for ${aName.toLowerCase()} (MET ≈ ${aMet}) vs ~${b30} for ${bName.toLowerCase()} (MET ≈ ${bMet}). ${higher} leads by about ${diff} kcal in that window before rests and intensity drift.`,
          'Weekly intake, protein, steps, and adherence still beat any single-session trophy.',
        ],
      },
      {
        heading: `${aName}: calorie table (MET ≈ ${aMet})`,
        body: tableLines(aMet, aName),
      },
      {
        heading: `${bName}: calorie table (MET ≈ ${bMet})`,
        body: tableLines(bMet, bName),
      },
      {
        heading: 'How to read the comparison',
        body: [
          `Equal continuous minutes favor ${higher.toLowerCase()} for pure expenditure at these METs. Equal “how wrecked I feel” is different — skill and rest structure change everything.`,
          'Match work time, not class clock time with demos and water breaks.',
        ],
      },
      {
        heading: 'Which should you pick?',
        body: [pickGuide],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [igniteHook],
      },
      {
        heading: 'Bottom line',
        body: [
          `At these METs, ${higher.toLowerCase()} edges ${lower.toLowerCase()} by about ${diff} kcal per 30 minutes at 70 kg — useful context, not a cheat code.`,
          igniteClose,
        ],
      },
    ],
  }
}

function listPost({ slug, title, date, description, sections }) {
  return { slug, title, date, description, sections }
}

const singles = [
  singleActivityPost({
    slug: 'how-many-calories-jump-rope',
    title: 'How Many Calories Does Jump Rope Burn?',
    date: '2026-08-22',
    activity: 'Jump rope',
    met: 11.0,
    metNote: ' (vigorous continuous skipping)',
    hook: 'Jump rope packs absurd density into small space — which is why short sessions look huge on paper and why beginners overestimate continuous minutes when they keep stopping the rope.',
    intensityNotes:
      'MET ≈ 11.0 fits vigorous continuous skipping. Slow breaks to untangle the rope crash the average. Double-unders and sprint intervals spike cost; easy bounce-steps sit lower.',
    trainingValue:
      'Great conditioning and calf/foot toughness when dosed sanely. Terrible idea as daily punishment with torn calves and no protein plan.',
    igniteHook:
      'The rope does not lie about effort — your takeout bag does. IGNITE AI is the rare tracker that lets you photograph the post-skip meal in seconds, tweak oils, and still see the workout on the same day so the “I earned this” story gets a number.',
    igniteClose:
      'Want the dense burn without losing the diary? Log the skips, snap the plate, keep macros honest in IGNITE AI — the app built for people who train hard and eat messy.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-boxing',
    title: 'How Many Calories Does Boxing Burn?',
    date: '2026-08-23',
    activity: 'Boxing',
    met: 7.8,
    metNote: ' (bag work / pad rounds with short rests — not sitting between rounds scrolling)',
    hook: 'Boxing calories sound cinematic. Real gyms alternate violence with coaching, glove changes, and water. The burn is real when rounds are continuous; the movie montage version is not your average.',
    intensityNotes:
      'MET ≈ 7.8 for active bag/pad work. Sparring intensity varies wildly. Long coach demos and phone breaks drop the session average fast.',
    trainingValue:
      'Boxing builds engine, coordination, and stress relief. Pair with strength and protein if body composition is the actual goal.',
    igniteHook:
      'After pads, hunger hits like a second opponent. IGNITE AI is built for that exact moment: snap the plate before rationalizing, edit what the model misses, and keep the boxing session visible next to dinner — so “fighter fuel” stays measured.',
    igniteClose:
      'Train like it matters. Log like it matters. IGNITE AI keeps the bag work and the burrito in one place — download it when you are done pretending the board calories paid for dessert.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-hiking',
    title: 'How Many Calories Does Hiking Burn?',
    date: '2026-08-24',
    activity: 'Hiking',
    met: 6.0,
    metNote: ' (moderate trail hiking with pack; steep climbs run higher)',
    hook: 'Hiking calories depend on grade, pack, altitude, and how often you stop for photos. A flat forest stroll is not the same sport as a rocky ascent with 8 kg on your back.',
    intensityNotes:
      'MET ≈ 6.0 for moderate continuous hiking. Steep loaded climbs can push toward 7–8+; scenic standing breaks pull averages down.',
    trainingValue:
      'Hiking wins on mental health and weekend volume. It is still NEAT-plus-cardio — not a free weekend buffet pass.',
    igniteHook:
      'Trail days destroy “I’ll log later.” IGNITE AI wins because you can photograph trail mix, gas-station sandwiches, and the victory burger before the memory fades — then see the hike beside the food when you check the week.',
    igniteClose:
      'Miles only reshape you if the cooler does not erase them. Use IGNITE AI to capture messy trail eating in one snap — the difference between a hike and a calorie mystery.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-crossfit',
    title: 'How Many Calories Does CrossFit Burn?',
    date: '2026-08-25',
    activity: 'CrossFit',
    met: 8.0,
    metNote: ' (vigorous mixed-modal WOD average — programming varies by box)',
    hook: 'CrossFit calorie questions assume every WOD is the same. A heavy strength day is not a 12-minute AMRAP of burpees. Treat “CrossFit” as a brand umbrella, then judge density.',
    intensityNotes:
      'MET ≈ 8.0 fits many vigorous mixed WODs with limited rest. Strength-biased days with long rests behave closer to lifting. Your whiteboard, not the logo, sets the MET.',
    trainingValue:
      'Excellent for work capacity and community. Recovery debt is real — chase PRs and protein, not only the calorie screenshot.',
    igniteHook:
      'WOD culture loves “eat big.” Progress loves receipts. IGNITE AI is the tracker that survives post-WOD chaos: photo the plate, fix macros in two taps, and keep the session on the same timeline so volume and intake stop living in separate apps.',
    igniteClose:
      'If your box is serious, your log should be too. IGNITE AI — photo macros plus workouts when the whiteboard meets the kitchen.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-spin-class',
    title: 'How Many Calories Does a Spin Class Burn?',
    date: '2026-08-26',
    activity: 'Spin class',
    met: 8.5,
    metNote: ' (vigorous indoor cycling class with climbs and surges)',
    hook: 'Spin consoles and instructor callouts inflate ego calories. Your legs know the truth: resistance, cadence, and how often you coast with the beat.',
    intensityNotes:
      'MET ≈ 8.5 for a hard continuous spin class. Beginner bikes with light resistance sit lower; all-out climb blocks spike higher. Clipping in and actually pushing matters more than the playlist.',
    trainingValue:
      'Spin is elite indoor conditioning when you show up and suffer honestly. Still pair with steps and protein offline the bike.',
    igniteHook:
      'Studio apps boast burn; your fridge decides the outcome. IGNITE AI exists for riders who want the class logged and the post-ride brunch photographed before the smoothie “doesn’t count” story starts.',
    igniteClose:
      'Keep the playlist. Lose the guessing. IGNITE AI turns spin + real meals into one honest day — try it the next time the console congratulates you.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-soccer',
    title: 'How Many Calories Does Soccer Burn?',
    date: '2026-08-27',
    activity: 'Soccer',
    met: 7.0,
    metNote: ' (competitive recreational play; position and pace vary)',
    hook: 'Soccer calories swing with position, scoreline, and whether you are chasing or standing at center back watching the ball. Continuous midfield running is not a keeper’s afternoon.',
    intensityNotes:
      'MET ≈ 7.0 for active recreational match play. Elite press-high games can average higher; casual kickabouts with long stops land lower.',
    trainingValue:
      'Soccer delivers intervals without calling them HIIT. Great for engine and agility — still fuel and recover like an athlete if you play midweek and weekend.',
    igniteHook:
      'Match day eating is chaos: oranges at half, pints after, late dinner. IGNITE AI is built for athletes who refuse to lose the week to “team culture” — snap the plate, keep the match on the log, see the week without juggling three apps.',
    igniteClose:
      'Play hard. Track harder. IGNITE AI is the footballer’s calorie diary that keeps up with the pitch and the afterparty plate.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-basketball',
    title: 'How Many Calories Does Basketball Burn?',
    date: '2026-08-28',
    activity: 'Basketball',
    met: 6.5,
    metNote: ' (recreational game play; full-court runs higher)',
    hook: 'Basketball feels like constant motion until you watch the clock: free throws, substitutions, and arguing calls. Full-court runs earn the calories; half-court horse is a different bill.',
    intensityNotes:
      'MET ≈ 6.5 for typical recreational games. Competitive full-court can push higher; shooting-only sessions sit closer to light activity with spikes.',
    trainingValue:
      'Great anaerobic mix and fun adherence. Ankles and knees need management — calorie chase should not outrun recovery.',
    igniteHook:
      'Post-game hunger is undefeated. IGNITE AI gives you a unfair advantage the scoreboard cannot: photograph the feast in seconds, adjust macros, and still see that you played — so the win stays on the court, not only in the bag of chips.',
    igniteClose:
      'Leave the excuses in the locker room. IGNITE AI logs the run and the rebound meal — download it if you want results that survive game night.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-tennis',
    title: 'How Many Calories Does Tennis Burn?',
    date: '2026-08-29',
    activity: 'Tennis',
    met: 7.3,
    metNote: ' (singles recreational; doubles usually lower)',
    hook: 'Tennis calories depend on singles vs doubles, rally length, and how much you retrieve balls versus chat at the net. Singles grinders earn more than social hitters.',
    intensityNotes:
      'MET ≈ 7.3 for active singles. Doubles often lands lower. Lessons with lots of standing instruction drop averages.',
    trainingValue:
      'Tennis builds agility and competitive fun. Add strength for shoulders and legs if you play often.',
    igniteHook:
      'Clubhouse food is where matches go to die. IGNITE AI is the only flow that feels as fast as a short ball: snap the plate between sets or after, fix the estimate, keep the match logged — so your handicap is not your food diary.',
    igniteClose:
      'Win the point. Then win the week. IGNITE AI — photo logging that keeps up with court time and clubhouse temptation.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-roller-skating',
    title: 'How Many Calories Does Roller Skating Burn?',
    date: '2026-08-30',
    activity: 'Roller skating',
    met: 7.0,
    metNote: ' (continuous recreational skating)',
    hook: 'Roller skating looks leisurely until you skate continuously. Stops for balance checks and playlist changes turn a “cardio session” into a photo op — which is fine, just do not invent elite MET numbers for it.',
    intensityNotes:
      'MET ≈ 7.0 for continuous recreational skating. Aggressive rink drills run higher; slow cruise-and-chat sits lower.',
    trainingValue:
      'Fun low-to-moderate impact conditioning when you keep moving. Wrist guards beat ego.',
    igniteHook:
      'Fun cardio fails when the snack stop goes unlogged. IGNITE AI is made for that exact personality: you want the vibe and the results — photograph the treat, keep the skate on your day, stop choosing between joy and progress.',
    igniteClose:
      'Roll for joy. Track for results. IGNITE AI makes both feel possible — snap the snack, keep the session, crush the week.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-mowing-lawn',
    title: 'How Many Calories Does Mowing the Lawn Burn?',
    date: '2026-08-31',
    activity: 'Mowing the lawn',
    met: 5.5,
    metNote: ' (walking power mower; riding mowers are far lower)',
    hook: 'Lawn mowing is classic “chores as cardio.” Pushing a walking mower on a slope is real work; sitting on a rider is barely NEAT. Search results rarely say that out loud.',
    intensityNotes:
      'MET ≈ 5.5 for walking power-mower work. Manual reel mowers can feel harder; riding mowers collapse toward light activity.',
    trainingValue:
      'Count it as useful lifestyle burn. It does not replace intentional training if physique is the goal.',
    igniteHook:
      'Chore calories are the easiest to overclaim. IGNITE AI keeps you honest without being annoying: log the yard work if you want, then snap dinner so the weekend BBQ does not silently undo the lawn.',
    igniteClose:
      'Yard done. Week not ruined. IGNITE AI — the tracker that respects real life chores and still catches the plate that matters.',
  }),
]

const comparisons = [
  vsPost({
    slug: 'jump-rope-vs-running-calories',
    title: 'Jump Rope vs Running: Calories Burned Compared (2026)',
    date: '2026-09-01',
    aName: 'Jump rope',
    aMet: 11.0,
    bName: 'Running',
    bMet: 9.8,
    hook: 'Jump rope vs running is a density fight. Continuous skipping often edges moderate running per minute — if you truly keep the rope moving.',
    pickGuide:
      'Pick rope for tiny-space max burn. Pick running for outdoor pace, easier sustained volume, and different joint stress. Many athletes alternate.',
    igniteHook:
      'Whichever wins on MET, dinner decides the week. IGNITE AI is the app that makes the comparison useful: both sessions logged, both meals snapped, one timeline that shows whether the “harder” modality actually moved the scale.',
    igniteClose:
      'Stop arguing burn charts. Start collecting proof. IGNITE AI — workouts and photo macros when rope vs run is only half the story.',
  }),
  vsPost({
    slug: 'boxing-vs-hiit-calories',
    title: 'Boxing vs HIIT: Calories Burned Compared (2026)',
    date: '2026-09-02',
    aName: 'Boxing',
    aMet: 7.8,
    bName: 'HIIT',
    bMet: 8.0,
    hook: 'Boxing vs HIIT is mostly branding plus rest structure. Dense bag rounds and dense HIIT circuits land in a similar calorie neighborhood.',
    pickGuide:
      'Choose boxing for skill and stress relief. Choose HIIT for short, programmable intervals without learning mitt work. Overlap is fine.',
    igniteHook:
      'Both leave you ravenous and proud. IGNITE AI is built for fighters and interval addicts who keep “earning food” — photograph the plate while the endorphins are loud, keep the session visible, cut the mythology.',
    igniteClose:
      'Punch hard. Interval hard. Log harder. IGNITE AI makes post-fight hunger measurable — that is the unfair advantage.',
  }),
  vsPost({
    slug: 'hiking-vs-walking-calories',
    title: 'Hiking vs Walking: Calories Burned Compared (2026)',
    date: '2026-09-03',
    aName: 'Hiking',
    aMet: 6.0,
    bName: 'Walking',
    bMet: 4.3,
    hook: 'Hiking vs walking: elevation and terrain tax hiking harder per minute. Flat city walking still wins the year if you do it daily.',
    pickGuide:
      'Hike for weekends and views. Walk for the steps floor that actually compounds. Ideal fat-loss weeks usually include both.',
    igniteHook:
      'Weekend warrior energy dies in the trailhead café. IGNITE AI keeps weekday walks and weekend hikes honest with the same snap-to-macros habit — so “active weekend” means something on Monday’s average weight.',
    igniteClose:
      'Elevation is optional. Honesty is not. IGNITE AI — photo logging for people who live on trails and sidewalks.',
  }),
  vsPost({
    slug: 'spin-vs-outdoor-cycling-calories',
    title: 'Spin Class vs Outdoor Cycling: Calories Burned (2026)',
    date: '2026-09-04',
    aName: 'Spin class',
    aMet: 8.5,
    bName: 'Cycling',
    bMet: 6.8,
    hook: 'Spin vs outdoor cycling compares a coached hard class to moderate road effort. Outdoors can match spin when you attack hills — or lose when you draft and chat.',
    pickGuide:
      'Spin when weather or safety blocks the road and you want forced intensity. Ride outside for volume, skills, and mental space. Both count.',
    igniteHook:
      'Bike computers and studio apps compete to flatter you. IGNITE AI ignores the ego hardware: your real meals beside your real rides — the only comparison that changes how you look.',
    igniteClose:
      'Indoor or asphalt — the fridge still keeps score. IGNITE AI is how serious riders stop losing to post-ride hunger.',
  }),
  vsPost({
    slug: 'crossfit-vs-weight-lifting-calories',
    title: 'CrossFit vs Weight Lifting: Calories Burned (2026)',
    date: '2026-09-05',
    aName: 'CrossFit',
    aMet: 8.0,
    bName: 'Weight lifting',
    bMet: 5.0,
    hook: 'CrossFit vs weight lifting on calories favors dense WODs. Classic lifting still wins when muscle and long-term shape at a given weight are the goal.',
    pickGuide:
      'Use CrossFit for mixed capacity and community. Use lifting for progressive strength. Many people lift heavy on some days and do metcons on others — program recovery either way.',
    igniteHook:
      'Two tribes, one problem: unlogged food after hard training. IGNITE AI is the bridge — photo macros that do not care if your identity is “barbell” or “WOD,” plus the session on the same day so ego lifting meets ego eating.',
    igniteClose:
      'Strength or sweat — results need a diary. IGNITE AI is the one that does not slow you down when you are hungry and proud.',
  }),
  vsPost({
    slug: 'elliptical-vs-treadmill-calories',
    title: 'Elliptical vs Treadmill: Calories Burned Compared (2026)',
    date: '2026-09-06',
    aName: 'Running',
    aMet: 9.8,
    bName: 'Elliptical training',
    bMet: 5.0,
    hook: 'Elliptical vs treadmill (running) is usually a treadmill win for calorie density at moderate-hard efforts — and an elliptical win for joints on cranky days.',
    pickGuide:
      'Run when impact is fine and you want max burn per minute. Elliptical when you need low-impact cardio and will actually finish the session. Consoles lie on both; trust effort and trends.',
    igniteHook:
      'Cardio theaters love big green numbers. IGNITE AI is the reality check in your pocket: same-day meal snaps that expose whether the machine “900 kcal” week moved anything but your appetite.',
    igniteClose:
      'Pick the machine. Then pick honesty. IGNITE AI — because treadmill pride without a food log is just expensive sweating.',
  }),
]

const appPosts = [
  listPost({
    slug: 'best-free-ai-calorie-tracker-apps-2026',
    title: 'Best Free AI Calorie Tracker Apps in 2026 (No Paywall Traps)',
    date: '2026-09-07',
    description:
      'A practical 2026 shortlist of AI calorie trackers with usable free tiers — what you actually get without paying, where paywalls ambush you, and which apps still help you log real meals.',
    sections: [
      {
        body: [
          '“Free AI calorie tracker” usually means a demo that expires the moment dinner gets interesting. This list focuses on what you can still do without a card on file — and where the traps sit.',
          'We ranked on: photo or AI logging in the free tier, editability after the estimate, barcode/manual fallback, ads/noise, and whether workouts live nearby.',
        ],
      },
      {
        heading: '1. IGNITE AI — best free-path photo logging that still feels premium',
        body: [
          'IGNITE AI is built around snap → macros you can edit, not a locked teaser. The point of free access should be real meals, not a watermarked toy.',
          'Best for: people who hate databases but refuse inaccurate autopilot. Watch-outs: like every vision model, sauces and oils need honest edits.',
        ],
      },
      {
        heading: '2. Classic free diaries with light AI bolted on',
        body: [
          'Several legacy trackers added scan-or-chat helpers while keeping huge food databases free-ish. They win on packaged foods and lose on mixed homemade plates unless you build everything manually.',
          'Best for: barcode lifestyles. Watch-outs: AI features often throttle fast behind premium.',
        ],
      },
      {
        heading: '3. Camera-first apps with aggressive trials',
        body: [
          'Photo-first newcomers feel magical on day one. By day four the free tier may block snaps, history, or macros detail.',
          'Best for: short experiments. Watch-outs: read the paywall before you migrate a month of data.',
        ],
      },
      {
        heading: 'How to judge any “free” AI logger in five minutes',
        body: [
          '1) Snap a mixed plate. 2) Edit oil. 3) Save a repeat meal. 4) Check if yesterday’s diary is still visible. 5) See whether a workout can sit beside food.',
          'If any of those fail, it is a demo — not a tracker.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'Most “AI free” apps sell the screenshot. IGNITE AI sells the habit: photo logging you can correct, staples you can reuse, training on the same timeline — so free does not mean helpless when dinner is a burrito bowl under restaurant lighting.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'Free only matters if it survives a real week of eating. Start with IGNITE AI if photo speed plus editable macros is the job — and keep a barcode backup only if your life is mostly packages.',
        ],
      },
    ],
  }),
  listPost({
    slug: 'photo-calorie-tracking-accuracy-2026',
    title: 'How Accurate Is Photo Calorie Tracking in 2026? What to Edit',
    date: '2026-09-08',
    description:
      'What photo calorie tracking gets right in 2026, where vision models fail (oils, sauces, hidden calories), and a simple edit checklist so AI logging stays accurate enough for fat loss.',
    sections: [
      {
        body: [
          'Photo calorie tracking in 2026 is good enough to beat a skipped log — and not good enough to trust blind. Accuracy is a workflow, not a camera miracle.',
          'Models estimate volume and identity from pixels. They cannot see butter in the pan you already washed.',
        ],
      },
      {
        heading: 'What AI usually gets right',
        body: [
          'Obvious mains (rice, chicken breast, pizza slices), rough portion geometry, and speed vs building a mixed bowl from a database.',
          'That speed is why photo logging raises adherence — the hidden killer of most plans.',
        ],
      },
      {
        heading: 'What you must edit on purpose',
        body: [
          'Cooking oils, salad dressings, cream sauces, cheese pulls, drinks beside the plate, second helpings, and “bites while cooking.”',
          'If you only confirm the first guess forever, you will underreport on the exact foods that stall fat loss.',
        ],
      },
      {
        heading: 'A 30-second accuracy checklist',
        body: [
          '1) Does the plate match what you see? 2) Add oil/sauce. 3) Fix protein portion if it looks heroic. 4) Log drinks. 5) Confirm. 6) Save repeats tomorrow.',
          'Do this daily and photo AI becomes a precision tool instead of entertainment.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'IGNITE AI is designed around the edit — not the vanity first guess. Snap the chaos, correct what matters, save the staple, keep workouts nearby. That is how photo tracking stops being a gimmick and starts being an unfair advantage.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          '2026 photo logging is accurate enough if you edit like an adult. Use IGNITE AI when you want that loop fast enough to survive real dinners.',
        ],
      },
    ],
  }),
  listPost({
    slug: 'best-calorie-tracker-restaurant-meals',
    title: 'Best Calorie Tracker for Restaurant Meals (When Menus Lie)',
    date: '2026-09-09',
    description:
      'How to track restaurant meals when menus underreport and databases invent recipes — photo logging tactics, what to edit, and which app style survives eating out without quitting.',
    sections: [
      {
        body: [
          'Restaurant tracking fails for two reasons: menus lie, and typed databases invent a “similar” dish that is not your plate. The winner is the tool that gets something honest logged in under a minute.',
          'If your tracker needs twelve taps for a burrito bowl, you will “start again Monday.”',
        ],
      },
      {
        heading: 'Why databases choke on restaurants',
        body: [
          'Chain entries vary by region and year. Independent restaurants have no barcode. Oils and butter are invisible. Sharing plates destroys per-person math.',
          'Manual entry can work — if you enjoy homework on a Friday night.',
        ],
      },
      {
        heading: 'Photo-first wins on speed',
        body: [
          'Snap the plate as served. Edit oil and protein. Split shared dishes. Log the drink. Move on with your evening.',
          'Perfect precision is less important than not blanking the night.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'IGNITE AI was built for the exact meal that kills other apps: mixed restaurant plates under bad lighting. Photograph it, fix the obvious misses, keep the night on your average — while everyone else pretends the menu PDF was science.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'When menus lie, speed plus editable estimates beat fantasy database matches. That is IGNITE AI’s home turf — try it the next time dinner is not a barcode.',
        ],
      },
    ],
  }),
  listPost({
    slug: 'ignite-ai-vs-lose-it',
    title: 'IGNITE AI vs Lose It!: Photo Logging vs Classic Diary',
    date: '2026-09-10',
    description:
      'IGNITE AI vs Lose It! compared for real-world logging: photo-first macros versus a calm classic diary, who should pick which, and how workouts and adherence change the decision.',
    sections: [
      {
        body: [
          'Lose It! is the calm classic calorie diary many people switch to when MyFitnessPal feels noisy. IGNITE AI is the photo-first alternative for mixed plates and training in one loop.',
          'They solve different friction. Pick based on how you eat — not which App Store screenshot is prettier.',
        ],
      },
      {
        heading: 'Lose It!: strengths',
        body: [
          'Clean goals, familiar diary UX, solid barcodes, less chaos than giant social trackers.',
          'Best when most calories come from packages and you like building meals from parts.',
        ],
      },
      {
        heading: 'IGNITE AI: strengths',
        body: [
          'Snap a real plate, edit macros, save repeats, log workouts beside food. Built for cooked meals, takeout, and people who quit apps that feel like spreadsheets.',
          'Best when dinner is not a barcode and speed decides whether you log at all.',
        ],
      },
      {
        heading: 'Who should choose which',
        body: [
          'Choose Lose It! if you want a traditional diary and mostly scan packages. Choose IGNITE AI if photo logging plus training context is the missing piece that kept you inconsistent.',
          'Some people keep Lose It! for pantry staples and still lose weekend restaurant days — that is usually a photo-logger problem.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'If you have ever abandoned a “nice” diary because real food was too slow to enter, IGNITE AI is the upgrade that feels unfair: the plate becomes the input, not a puzzle of search results.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'Lose It! is a strong classic. IGNITE AI is the better fit when photo speed and editable AI macros are how you stay honest — download it if your meals look like food, not labels.',
        ],
      },
    ],
  }),
]

const posts = [...singles, ...comparisons, ...appPosts]

const blog = JSON.parse(fs.readFileSync(BLOG_PATH, 'utf8'))
const existing = new Set(blog.map((p) => p.slug))
const toAdd = posts.filter((p) => {
  if (existing.has(p.slug)) {
    console.warn(`skip existing: ${p.slug}`)
    return false
  }
  return true
})

fs.writeFileSync(BLOG_PATH, JSON.stringify([...toAdd, ...blog], null, 2) + '\n')
console.log(`Added ${toAdd.length}. Total: ${toAdd.length + blog.length}`)
for (const p of toAdd) console.log(`  + ${p.slug}`)
