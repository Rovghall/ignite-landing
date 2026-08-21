/**
 * Next 20 EN posts dated 2026-08-22 → 2026-08-31 (end of August).
 * Usage: node scripts/generate-seo-batch-aug-end.mjs
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
  const header = `Estimated calories for ${label} (MET ≈ ${met}) — approximate:`
  const rows = weights.map((kg) => {
    const cells = durations.map((m) => `${m} min: ~${kcal(met, kg, m)}`).join(' · ')
    return `${kg} kg: ${cells}`
  })
  return [header, ...rows]
}

function post(p) {
  return p
}

function activity({ slug, title, date, activity, met, metNote, hook, intensity, value, ignite, close }) {
  const a30 = kcal(met, 70, 30)
  const a60 = kcal(met, 70, 60)
  return post({
    slug,
    title,
    date,
    description: `${activity} burns about ${a30} kcal in 30 minutes for a 70 kg person at MET ≈ ${met} (~${a60}/hour). Tables by weight and duration, intensity notes, and how IGNITE AI keeps the session honest next to food.`,
    sections: [
      {
        body: [
          hook,
          `At MET ≈ ${met}${metNote}, expect roughly ${a30} kcal in 30 minutes at 70 kg (about ${a60}/hour). Heavier bodies burn more; rests and easy intervals burn less.`,
          'Weekly energy balance still decides fat loss. Board numbers are estimates — not vouchers.',
        ],
      },
      { heading: 'Calorie estimates by bodyweight and duration', body: [...tableLines(met, activity), 'Continuous work only. Phone breaks do not count.'] },
      { heading: 'What drives the burn', body: [intensity, 'Bodyweight and continuous intensity beat the class nickname.'] },
      { heading: 'Training value', body: [value, 'Keep protein around 1.6–2.2 g/kg if you are cutting and training hard.'] },
      { heading: 'Where IGNITE AI fits', body: [ignite] },
      { heading: 'Bottom line', body: [`Ballpark ${a30} kcal / 30 min at 70 kg for ${activity.toLowerCase()} at MET ≈ ${met}.`, close] },
    ],
  })
}

function vs({ slug, title, date, aName, aMet, bName, bMet, hook, pick, ignite, close }) {
  const a30 = kcal(aMet, 70, 30)
  const b30 = kcal(bMet, 70, 30)
  const diff = Math.abs(a30 - b30)
  const higher = a30 >= b30 ? aName : bName
  const lower = a30 >= b30 ? bName : aName
  return post({
    slug,
    title,
    date,
    description: `70 kg / 30 min: ~${a30} kcal ${aName.toLowerCase()} (MET ≈ ${aMet}) vs ~${b30} ${bName.toLowerCase()} (MET ≈ ${bMet}). ${diff} kcal gap, tables, and how to choose — then log food in IGNITE AI.`,
    sections: [
      {
        body: [
          hook,
          `At 70 kg for 30 minutes: ~${a30} vs ~${b30}. ${higher} leads by about ${diff} kcal before rests change the story.`,
        ],
      },
      { heading: `${aName} (MET ≈ ${aMet})`, body: tableLines(aMet, aName) },
      { heading: `${bName} (MET ≈ ${bMet})`, body: tableLines(bMet, bName) },
      { heading: 'Which to pick', body: [pick] },
      { heading: 'Where IGNITE AI fits', body: [ignite] },
      { heading: 'Bottom line', body: [`${higher} edges ${lower} by ~${diff} kcal / 30 min at these METs.`, close] },
    ],
  })
}

function feature({ slug, title, date, description, sections }) {
  return post({ slug, title, date, description, sections })
}

const posts = [
  activity({
    slug: 'how-many-calories-burpees',
    title: 'How Many Calories Do Burpees Burn?',
    date: '2026-08-22',
    activity: 'Burpees',
    met: 8.0,
    metNote: ' (vigorous continuous burpee work)',
    hook: 'Burpees are the internet’s favorite punishment — and a terrible place to trust a round counter that ignores rest on the floor.',
    intensity: 'MET ≈ 8.0 for dense continuous burpees. Slow step-back versions and long breathers crash the average.',
    value: 'Brutal conditioning in tiny space. Dose carefully if wrists and shoulders complain.',
    ignite: 'After burpees, “I earned pizza” writes itself. IGNITE AI is the kill-switch: photograph the plate before the story hardens, keep the session on the same day, see whether the suffering moved anything but appetite.',
    close: 'Suffer on purpose. Log on purpose. IGNITE AI for people who burpee and still want a waistline.',
  }),
  activity({
    slug: 'how-many-calories-battle-ropes',
    title: 'How Many Calories Do Battle Ropes Burn?',
    date: '2026-08-22',
    activity: 'Battle ropes',
    met: 8.0,
    metNote: ' (vigorous continuous waves)',
    hook: 'Battle ropes look like calorie fireworks. Reality is work-to-rest ratio: continuous waves earn the MET; thirty-second flexing for Instagram does not.',
    intensity: 'MET ≈ 8.0 for hard continuous rope waves. Long rest between intervals drops the session fast.',
    value: 'Upper-body engine and grip. Pair with legs and protein if physique is the goal.',
    ignite: 'Ropes crush you; the smoothie afterward quietly un-crushes the deficit. IGNITE AI catches that second round — Snap Track the drink, log the ropes, stop letting “shredded” be a feeling.',
    close: 'Wave hard. Track harder. IGNITE AI keeps battle ropes from becoming a smoothie alibi.',
  }),
  activity({
    slug: 'how-many-calories-rowing-machine',
    title: 'How Many Calories Does a Rowing Machine Burn? (Erg Guide)',
    date: '2026-08-23',
    activity: 'Rowing machine',
    met: 7.0,
    metNote: ' (moderate continuous erg)',
    hook: 'Erg calories on the monitor are sales tools. Use MET ranges as a sanity check, then row for splits and consistency — not console glory.',
    intensity: 'MET ≈ 7.0 moderate continuous. Hard pieces climb; long rests between intervals average down.',
    value: 'Full-body engine with low impact when technique is clean. Ugly pulls tax the back for fake calories.',
    ignite: 'Concept2 will flatter you. IGNITE AI will not — meal snaps beside the erg session so “I rowed” and “I ate” finally share one truth.',
    close: 'Trust the split, verify the plate. IGNITE AI is the erg rider’s food honesty layer.',
  }),
  activity({
    slug: 'how-many-calories-power-walking',
    title: 'How Many Calories Does Power Walking Burn?',
    date: '2026-08-23',
    activity: 'Power walking',
    met: 5.0,
    metNote: ' (brisk continuous walking ~4 mph effort)',
    hook: 'Power walking is the underrated fat-loss volume tool — higher than a stroll, kinder than a jog, easy to repeat daily.',
    intensity: 'MET ≈ 5.0 for continuous brisk power walking. Phone-ambling is closer to 2.5–3.5.',
    value: 'Steps you can recover from. Perfect NEAT-plus when running hates your knees.',
    ignite: 'Walking only works when the other 23 hours are logged. IGNITE AI makes the boring wins visible: steps from Health beside photo dinners that used to vanish.',
    close: 'Walk with intent. Track without drama. IGNITE AI for power walkers who want the scale to notice.',
  }),
  vs({
    slug: 'burpees-vs-jump-rope-calories',
    title: 'Burpees vs Jump Rope: Calories Burned Compared (2026)',
    date: '2026-08-24',
    aName: 'Jump rope',
    aMet: 11.0,
    bName: 'Burpees',
    bMet: 8.0,
    hook: 'Burpees vs jump rope is a density duel in a living room. Continuous rope usually wins per minute if you truly keep skipping.',
    pick: 'Rope for max burn per minute. Burpees when you want full-body strength-endurance without a rope. Both punish poor recovery.',
    ignite: 'Home HIIT without a food log is just loud cardio. IGNITE AI is how living-room athletes keep the after-session sandwich from erasing the MET chart.',
    close: 'Pick your poison. Then open IGNITE AI before the fridge does.',
  }),
  vs({
    slug: 'power-walking-vs-jogging-calories',
    title: 'Power Walking vs Jogging: Calories Burned Compared (2026)',
    date: '2026-08-24',
    aName: 'Running',
    aMet: 9.8,
    bName: 'Power walking',
    bMet: 5.0,
    hook: 'Power walking vs jogging: jogging usually burns more per minute; power walking often wins the month because you actually show up.',
    pick: 'Jog when joints allow and you want density. Power walk when consistency and knees matter more than ego pace.',
    ignite: 'The modality that wins is the one next to an honest diary. IGNITE AI syncs Health steps and still demands the meal photo — so “active” means something on average weight.',
    close: 'Pace is optional. Proof is not. IGNITE AI for walkers and joggers who want weeks, not workouts.',
  }),
  feature({
    slug: 'best-macro-tracker-for-beginners-2026',
    title: 'Best Macro Tracker for Beginners in 2026 (Without Spreadsheet Pain)',
    date: '2026-08-25',
    description:
      'What beginners actually need in a macro tracker in 2026 — fast capture, editable estimates, simple targets, and why IGNITE AI photo logging beats spreadsheet culture.',
    sections: [
      {
        body: [
          'Beginners do not fail macros because they cannot do math. They fail because logging feels like homework. The best beginner tracker in 2026 is the one you finish after dinner.',
          'Look for: photo or quick describe, editable results, clear protein/calorie targets, and workouts optional — not forced.',
        ],
      },
      {
        heading: 'Why databases scare new users',
        body: [
          'Searching “chicken” returns forty ghosts. Photo-first logging skips the aisle of despair, then lets you edit oils.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'IGNITE AI was built for the beginner who cooks real food: Snap Track photo modes, voice/text fallbacks, Home rings, optional fasting, and Premium tools that do not require a nutrition degree.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If you are new, optimize for speed and honesty — not micronutrient theater. Start with IGNITE AI.',
        ],
      },
    ],
  }),
  feature({
    slug: 'how-to-set-macro-targets-ignite-ai',
    title: 'How to Set Macro Targets in IGNITE AI After Onboarding',
    date: '2026-08-25',
    description:
      'How IGNITE AI onboarding and profile goals set calorie and macro targets — and how to adjust protein, fat-loss pace, and daily rings without restarting your whole plan.',
    sections: [
      {
        body: [
          'Onboarding in IGNITE AI already asks the adult questions: goal, pace, body metrics, training. Those answers become daily rings and macro targets you can refine later in Profile.',
          'You do not need a new app every time you change protein by 20 g.',
        ],
      },
      {
        heading: 'Start with protein, then energy',
        body: [
          'Most lifters do better locking protein (~1.6–2.2 g/kg in a deficit) before obsessing over carb/fat splits. Hit calories as the main lever for weight change.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'Targets on Home, capture via Snap Track, review in Progress — one loop. Adjust goals when trends stall, not when one salty dinner scares you.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'Set targets once in IGNITE AI, log honestly for two weeks, then edit — that is how beginners become dangerous.',
        ],
      },
    ],
  }),
  feature({
    slug: 'ignite-ai-vs-cronometer',
    title: 'IGNITE AI vs Cronometer: Photo Speed vs Micronutrient Detail',
    date: '2026-08-26',
    description:
      'IGNITE AI vs Cronometer compared — camera-first macros and training versus micronutrient depth. Who should pick which in 2026.',
    sections: [
      {
        body: [
          'Cronometer wins when vitamins and minerals are the job. IGNITE AI wins when mixed plates, workouts, and social proof decide whether you log at all.',
          'Different religions. Same grocery store.',
        ],
      },
      {
        heading: 'Cronometer strengths',
        body: ['Micronutrient detail, careful database culture, precision-minded users.', 'Weaker when dinner is a messy bowl and you have sixty seconds.'],
      },
      {
        heading: 'IGNITE AI strengths',
        body: ['Snap Track photo/label/barcode/drink, AI Lab, Diet planner, Snap Cook, Friends, Share Cards, exercise logging.', 'Built for adherence under chaos.'],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'If you quit trackers because real food was too slow, IGNITE AI is the opposite of Cronometer’s homework vibe — and that is the point.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'Choose Cronometer for micronutrient nerdery. Choose IGNITE AI for photo macros plus training life — download accordingly.',
        ],
      },
    ],
  }),
  feature({
    slug: 'ignite-ai-vs-macrofactor',
    title: 'IGNITE AI vs MacroFactor: Photo Logging vs Expenditure Algorithms',
    date: '2026-08-26',
    description:
      'IGNITE AI vs MacroFactor — camera-first meals and social/training features versus expenditure-focused coaching. Which fits your logging personality.',
    sections: [
      {
        body: [
          'MacroFactor thrives when you weigh food and trust expenditure algorithms. IGNITE AI thrives when plates are messy and speed keeps the streak alive.',
        ],
      },
      {
        heading: 'Pick MacroFactor if…',
        body: ['You will weigh and log with discipline, and you want algorithm-driven calorie updates.'],
      },
      {
        heading: 'Pick IGNITE AI if…',
        body: ['You need photo capture, workouts beside food, Share Cards, Friends, Snap Cook, and AI Lab in one Premium product.'],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'MacroFactor optimizes the spreadsheet athlete. IGNITE AI optimizes the human who eats takeout under bad lighting and still wants results.',
        ],
      },
      {
        heading: 'Bottom line',
        body: ['Different tools. If photo speed is your bottleneck, IGNITE AI is the upgrade.'],
      },
    ],
  }),
  feature({
    slug: 'quick-log-fab-ignite-ai-guide',
    title: 'IGNITE AI Quick Log FAB: Scan, Describe, Voice, Activity, Weight',
    date: '2026-08-27',
    description:
      'A guide to the IGNITE AI Quick Log button — Scan (Snap Track), Describe, Voice, Activity, and Weight — and when to use each capture path.',
    sections: [
      {
        body: [
          'The center FAB is the product’s nervous system. Scan for camera modes, Describe/Voice when photos fail, Activity for training, Weight for scale/progress photos.',
          'Learning the FAB once removes half the “where do I tap?” friction forever.',
        ],
      },
      {
        heading: 'Premium vs always-there',
        body: [
          'Scan, describe, voice, and activity are Premium-powered capture. Weight remains available as a progress tool from the same launcher culture.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'One thumb reach for the entire Ignition loop — that is why Quick Log feels like a console, not a buried menu tree.',
        ],
      },
      {
        heading: 'Bottom line',
        body: ['Master the FAB. Everything viral about IGNITE AI starts there.'],
      },
    ],
  }),
  feature({
    slug: 'smart-pantry-ignite-ai',
    title: 'Smart Pantry in IGNITE AI: Cook From What You Already Own',
    date: '2026-08-27',
    description:
      'What Smart Pantry does in IGNITE AI — keep ingredient context close to Snap Cook and meal logging so plans match the fridge, not a fantasy shopping list.',
    sections: [
      {
        body: [
          'Meal plans fail when they assume a supermarket you did not visit. Smart Pantry keeps “what I own” in the same universe as Snap Cook and logging.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'Pantry thinking plus Snap Cook plus Snap Track is a kitchen OS. Diary-only apps never touch this problem.',
        ],
      },
      {
        heading: 'Bottom line',
        body: ['Use Smart Pantry so AI recipes respect reality — then log the plated result in IGNITE AI.'],
      },
    ],
  }),
  feature({
    slug: 'nutrition-label-scanning-ignite-ai',
    title: 'How to Scan Nutrition Labels with IGNITE AI Snap Track',
    date: '2026-08-28',
    description:
      'Using Snap Track label mode in IGNITE AI — when packaging photos beat barcodes, how to avoid per-100g traps, and how edits keep macros honest.',
    sections: [
      {
        body: [
          'Barcodes miss imported snacks and weird serving sizes. Label mode lets you photograph the panel, catch macros, and still edit before confirm.',
        ],
      },
      {
        heading: 'Watch the serving size',
        body: ['Per 100g vs per pack is where deficits go to die. Confirm what you actually ate.'],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'Label sits beside photo, barcode, and drink in one Snap Track system — supermarket mornings and skillet nights without switching apps.',
        ],
      },
      {
        heading: 'Bottom line',
        body: ['If the package is the source of truth, scan the label in IGNITE AI — then eat like an adult.'],
      },
    ],
  }),
  feature({
    slug: 'drink-calorie-tracking-ignite-ai',
    title: 'Track Drink Calories in IGNITE AI (Lattes, Smoothies, Alcohol)',
    date: '2026-08-28',
    description:
      'Why drink mode in Snap Track matters — liquid calories from coffee, smoothies, and alcohol — and how IGNITE AI keeps beverages from erasing a clean food day.',
    sections: [
      {
        body: [
          'Solid food diaries with invisible drinks are fan fiction. IGNITE AI Snap Track includes drink logging so lattes and cocktails hit the same rings as lunch.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'Voice/text also catch “oat milk latte” when you are walking. Photo still wins for ridiculous dessert drinks. One culture, fewer lies.',
        ],
      },
      {
        heading: 'Bottom line',
        body: ['If it has calories and a straw, log it in IGNITE AI — drinks are not free.'],
      },
    ],
  }),
  feature({
    slug: 'auto-share-meals-workouts-friends-ignite',
    title: 'Auto-Share Meals and Workouts to IGNITE AI Friend Groups',
    date: '2026-08-29',
    description:
      'How auto-share preferences work in IGNITE AI Friends — push meals and workouts into group feeds for accountability without manual posting every time.',
    sections: [
      {
        body: [
          'Accountability dies when sharing takes six extra taps. IGNITE AI can auto-share meals and workouts into friend group feeds when you enable it — social pressure on autopilot.',
        ],
      },
      {
        heading: 'Stay in control',
        body: ['Prefs exist so you can share training but not every snack — or reverse. Your circle, your rules.'],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'Share Cards for Stories; auto-share for private groups. Two layers of proof, one logger.',
        ],
      },
      {
        heading: 'Bottom line',
        body: ['Turn on auto-share if willpower fails alone — Friends in IGNITE AI was built for that.'],
      },
    ],
  }),
  feature({
    slug: 'creator-groups-vs-private-groups-ignite',
    title: 'Creator Groups vs Private Groups in IGNITE AI: Which Should You Use?',
    date: '2026-08-29',
    description:
      'Private accountability circles versus Creator Groups in IGNITE AI — who can create what, how feeds differ, and how the Creator Program unlocks creator communities.',
    sections: [
      {
        body: [
          'Private groups are for your friends. Creator Groups are for approved creators whose audience joins a feed centered on the creator’s meals and workouts.',
          'Creating a Creator Group requires Creator Program approval; joining as audience can use search or invite codes.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'Social features attach to real logs and Share Cards — community with nutrition context, not empty chat.',
        ],
      },
      {
        heading: 'Bottom line',
        body: ['Friends for your circle. Creator Groups when you are building an audience inside IGNITE AI.'],
      },
    ],
  }),
  feature({
    slug: 'onboarding-generate-plan-ignite-ai',
    title: 'IGNITE AI Onboarding: From Goals to Generated Plan Without Guesswork',
    date: '2026-08-30',
    description:
      'What IGNITE AI onboarding covers — metrics, goals, pace, diet, workouts, AI plan generation — and how that becomes daily rings you can live with.',
    sections: [
      {
        body: [
          'Good onboarding is not a quiz for marketing. IGNITE AI walks name, metrics, goals, pace, training, diet focus, then can generate a plan so day one is not a blank dashboard.',
        ],
      },
      {
        heading: 'Paywall with context',
        body: [
          'After onboarding you understand what Premium unlocks — Snap Track, Cook, Lab, Diet, Exercise — because you already set the destination.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'The same answers that build your plan feed Home rings, fasting options, and later Progress reviews. Continuity beats five disconnected setup wizards.',
        ],
      },
      {
        heading: 'Bottom line',
        body: ['Finish onboarding once. Then let Snap Track do the daily work inside IGNITE AI.'],
      },
    ],
  }),
  feature({
    slug: 'dark-mode-units-language-ignite-ai',
    title: 'Language, Units, and Appearance in IGNITE AI (Make the App Yours)',
    date: '2026-08-30',
    description:
      'How to set language, metric/imperial units, and appearance (including dark mode) in IGNITE AI preferences so daily logging feels native.',
    sections: [
      {
        body: [
          'Friction hides in units and language. IGNITE AI preferences let you switch locales, measurement systems, and appearance so numbers feel automatic.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'A global product that still feels local — then the Premium AI tools sit on top without fighting your brain’s defaults.',
        ],
      },
      {
        heading: 'Bottom line',
        body: ['Spend two minutes in Preferences. Future-you logs faster in IGNITE AI.'],
      },
    ],
  }),
  feature({
    slug: ' Ignite-ai-for-busy-professionals'.trim().replace(/^\s+/, ''),
    title: 'IGNITE AI for Busy Professionals: Log Lunch in Under a Minute',
    date: '2026-08-31',
    description:
      'How busy professionals use IGNITE AI — Quick Log photo/voice between meetings, Saved staples, Health sync, and Friends accountability without living in a spreadsheet.',
    sections: [
      {
        body: [
          'Busy people do not abandon tracking because they hate health. They abandon it because logging loses to Slack. IGNITE AI is built for sixty-second capture: photo, voice, saved staples.',
        ],
      },
      {
        heading: 'A realistic workday loop',
        body: [
          'Morning weight optional. Snap or voice lunch. Health steps sync quietly. Training after work in Activity. Share to a private group if you need teeth.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'Premium AI that respects calendars — not a second job. That is the pitch to every professional who has “started Monday” twelve times.',
        ],
      },
      {
        heading: 'Bottom line',
        body: ['If your constraint is time, not knowledge, download IGNITE AI and live inside Quick Log.'],
      },
    ],
  }),
  feature({
    slug: 'ignite-ai-for-busy-professionals',
    title: 'IGNITE AI for Busy Professionals: Log Lunch in Under a Minute',
    date: '2026-08-31',
    description:
      'How busy professionals use IGNITE AI — Quick Log photo/voice between meetings, Saved staples, Health sync, and Friends accountability without living in a spreadsheet.',
    sections: [
      {
        body: [
          'Busy people do not abandon tracking because they hate health. They abandon it because logging loses to Slack. IGNITE AI is built for sixty-second capture: photo, voice, saved staples.',
        ],
      },
      {
        heading: 'A realistic workday loop',
        body: [
          'Morning weight optional. Snap or voice lunch. Health steps sync quietly. Training after work in Activity. Share to a private group if you need teeth.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'Premium AI that respects calendars — not a second job. That is the pitch to every professional who has “started Monday” twelve times.',
        ],
      },
      {
        heading: 'Bottom line',
        body: ['If your constraint is time, not knowledge, download IGNITE AI and live inside Quick Log.'],
      },
    ],
  }),
  feature({
    slug: 'weekend-logging-strategy-ignite-ai',
    title: 'Weekend Calorie Logging Strategy with IGNITE AI (Stop Losing Friday–Sunday)',
    date: '2026-08-31',
    description:
      'A practical weekend logging strategy using IGNITE AI — restaurant photo logging, drinks, rollover preferences, and Friends pressure so Friday–Sunday stop erasing the week.',
    sections: [
      {
        body: [
          'Most cuts die between Friday dinner and Sunday brunch. IGNITE AI’s weekend edge is photo restaurant logging, drink mode, optional calorie rollover, and social auto-share — tools for the days databases fail.',
        ],
      },
      {
        heading: 'Tactics that survive brunches',
        body: [
          'Snap as served. Edit oil. Log the drink. Use Saved for repeats. If you use rollover, earn it with honest weekdays — do not invent it mid-sangria.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'Weekends are why Snap Track exists. If your tracker only works on meal-prepped Tuesdays, it is not a tracker — it is a costume.',
        ],
      },
      {
        heading: 'Bottom line',
        body: ['Win the weekend in IGNITE AI and the week almost wins itself.'],
      },
    ],
  }),
]

// Fix accidental duplicate from draft - keep only unique slugs
const seen = new Set()
const unique = []
for (const p of posts) {
  if (!p.slug || seen.has(p.slug)) continue
  // skip the broken slug if any
  if (p.slug.includes(' ')) continue
  seen.add(p.slug)
  unique.push(p)
}

const blog = JSON.parse(fs.readFileSync(BLOG_PATH, 'utf8'))
const existing = new Set(blog.map((p) => p.slug))
const toAdd = unique.filter((p) => {
  if (existing.has(p.slug)) {
    console.warn('skip', p.slug)
    return false
  }
  return true
})

if (toAdd.length !== 20) {
  console.warn('WARNING expected 20, got', toAdd.length)
}

fs.writeFileSync(BLOG_PATH, JSON.stringify([...toAdd, ...blog], null, 2) + '\n')
console.log(`Added ${toAdd.length}. Total ${toAdd.length + blog.length}`)
toAdd.forEach((p) => console.log(`  ${p.date}  ${p.slug}`))
