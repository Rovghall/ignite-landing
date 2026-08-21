/**
 * Generate 20 EN SEO calorie posts (MET tables + structured sections)
 * and prepend them into content/en/blog.json.
 *
 * Usage: node scripts/generate-seo-batch-20.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const BLOG_PATH = path.join(ROOT, 'content', 'en', 'blog.json')

/** kcal ≈ MET × bodyweight_kg × hours */
function kcal(met, kg, minutes) {
  return Math.round(met * kg * (minutes / 60))
}

function tableLines(met, label) {
  const weights = [55, 70, 85]
  const durations = [15, 30, 45, 60]
  const header = `Estimated calories for ${label} (MET ≈ ${met}) — approximate, from Compendium-style intensity:`
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
  compareHint,
}) {
  const at70_30 = kcal(met, 70, 30)
  const at70_60 = kcal(met, 70, 60)
  return {
    slug,
    title,
    date,
    description: `A ${activity.toLowerCase()} session burns about ${at70_30} kcal in 30 minutes for a 70 kg person at MET ≈ ${met} (about ${at70_60}/hour). See calorie tables by bodyweight and duration, what changes the estimate, and how to log training without eating the whole burn back.`,
    sections: [
      {
        body: [
          hook,
          `Using a working MET of about ${met}${metNote}, a 70 kg person lands near ${at70_30} calories in 30 minutes — roughly ${at70_60} per hour. Heavier bodies burn more for the same effort; lighter bodies burn less.`,
          'Fat loss still follows weekly energy balance. Treat wearable and class “calories burned” as a range, not a dinner coupon.',
        ],
      },
      {
        heading: 'Calorie estimates by bodyweight and duration',
        body: [
          ...tableLines(met, activity),
          'These are order-of-magnitude estimates for continuous effort at the stated intensity. Long rests, chatting, or easy recovery intervals pull the real total down.',
        ],
      },
      {
        heading: 'What actually drives the burn',
        body: [
          intensityNotes,
          'Bodyweight scales energy cost almost linearly for the same movement pattern. Intensity and continuous work time matter more than the exercise nickname on the class schedule.',
        ],
      },
      {
        heading: 'Wearables, class boards, and machine screens',
        body: [
          'Wrist estimates can miss load, rest, and non-step movements. Group-fitness boards and cardio consoles are convenient and often optimistic.',
          'In a fat-loss phase, plan food as if the printed burn were 20–40% lower unless you have a reason to trust the device.',
        ],
      },
      {
        heading: 'Training value vs calorie theater',
        body: [
          trainingValue,
          'If you lift or train hard in a deficit, keep protein around 1.6–2.2 g/kg and protect sleep. Session kcal badges do not replace progressive overload or an honest food log.',
        ],
      },
      {
        heading: 'A practical logging approach',
        body: [
          `Log ${activity.toLowerCase()} for consistency and recovery context. Separately log meals — especially the chaotic ones after training.`,
          'IGNITE AI keeps workouts and photo meal snaps on one timeline so a hard session does not become an excuse to stop logging dinner.',
          compareHint,
        ],
      },
      {
        heading: 'Measurement feedback loop',
        body: [
          'The useful scoreboard is a two-to-four-week trend: average morning weight, waist or photos, training performance, and average intake.',
          'Single-day scale spikes from sodium, carbs, hard lower-body work, or menstrual fluid are noise. Act on slopes, not points.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'You can run this with any honest logger. IGNITE AI is built for the friction that usually breaks plans: mixed meals, oils and sauces, repeat staples, and training next to food.',
          'Snap → edit → confirm for new plates. Saved meals for repeats. Workouts beside food so fueling is a decision, not a guess.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          `Expect roughly ${at70_30} kcal in 30 minutes at 70 kg for ${activity.toLowerCase()} at MET ≈ ${met}, scale for your weight and intensity, and keep the food log honest.`,
          'When logging has to stay honest on busy days, IGNITE AI helps with photo meal snaps, macro edits, Saved repeats, and workouts in one loop. Snap it. Log it. Crush it.',
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
    description: `At MET ≈ ${aMet} vs ≈ ${bMet}, a 70 kg person burns about ${a30} kcal in 30 minutes of ${aName.toLowerCase()} versus about ${b30} for ${bName.toLowerCase()} (${diff} kcal difference). Compare tables, intensity caveats, and how to choose for fat loss vs training goals.`,
    sections: [
      {
        body: [
          hook,
          `For a 70 kg person over 30 minutes, ballpark numbers are ~${a30} kcal for ${aName.toLowerCase()} (MET ≈ ${aMet}) and ~${b30} for ${bName.toLowerCase()} (MET ≈ ${bMet}). ${higher} sits higher by roughly ${diff} kcal in that window — before rests and intensity drift.`,
          'Neither modality “wins” fat loss by itself. Weekly average intake, protein, steps, and adherence beat a single session comparison.',
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
          `${higher} burns more per minute at these working METs, so equal time favors ${higher.toLowerCase()} for pure expenditure. Equal effort feelings are different: ${lower.toLowerCase()} may feel harder or easier depending on skill and conditioning.`,
          'If one session includes long rests, demos, or water breaks, the real gap shrinks. Match apples to apples: continuous work time, not clock time on the class schedule.',
        ],
      },
      {
        heading: 'Which should you pick?',
        body: [
          pickGuide,
          'For physique goals, the better choice is often the one you will repeat, recover from, and still log food after — not the one with the flashier board number.',
        ],
      },
      {
        heading: 'Logging without eating the burn back',
        body: [
          'Log the workout for context. Log the meal with a photo when plates are messy. Do not auto-add the full console total to your budget unless you have validated it against trends.',
          'IGNITE AI puts training and meal snaps on one timeline so post-workout hunger gets measured, not guessed.',
        ],
      },
      {
        heading: 'Where IGNITE AI fits',
        body: [
          'Snap → edit → confirm for mixed plates. Saved for staples. Workouts beside food so you can see whether a bigger burn week actually moved the scale.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          `At these METs, ${higher.toLowerCase()} edges ${lower.toLowerCase()} by about ${diff} kcal per 30 minutes at 70 kg — useful context, not a free pass.`,
          'Keep protein solid, log honestly, and use IGNITE AI when photo logging plus workouts in one place keeps you consistent. Snap it. Log it. Crush it.',
        ],
      },
    ],
  }
}

const singles = [
  singleActivityPost({
    slug: 'how-many-calories-cycling',
    title: 'How Many Calories Does Cycling Burn?',
    date: '2026-08-21',
    activity: 'Cycling',
    met: 6.8,
    metNote: ' (moderate road/indoor effort, roughly 12–14 mph pace equivalent)',
    hook: 'Cycling is one of the most searched calorie questions in fitness — and one of the most misread. Seat time is not the same as continuous hard pedaling, and outdoor hills change everything.',
    intensityNotes:
      'For moderate steady cycling we use MET ≈ 6.8. Easy recovery spins sit closer to 4–5; hard intervals or steep climbs can push toward 8–12. Cadence, gearing, and wind matter as much as the clock.',
    trainingValue:
      'Cycling builds aerobic engine and is joint-friendlier than pounding pavement for many people. Use it for conditioning and recovery capacity; do not expect a casual spin to erase a weekend of unlogged meals.',
    compareHint:
      'Curious how it stacks up against running? See our running vs cycling comparison once you have a baseline week of logged rides and meals.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-hiit',
    title: 'How Many Calories Does HIIT Burn?',
    date: '2026-08-20',
    activity: 'HIIT',
    met: 8.0,
    metNote: ' (vigorous intermittent conditioning — average across work and short rests)',
    hook: 'HIIT marketing loves afterburn myths. The real story is simpler: hard intervals raise average intensity, but rest periods and how “HIIT” is coached change the total a lot.',
    intensityNotes:
      'We use MET ≈ 8.0 as a working average for vigorous circuit-style HIIT. True all-out intervals with long rests may average lower across the whole hour; continuous hard efforts can average higher. Name recognition is not a MET.',
    trainingValue:
      'HIIT is useful when time is short and you can recover. It is a poor excuse to skip protein or to “earn” takeout without logging. Strength work still needs its own place in the week.',
    compareHint:
      'Compare HIIT to circuit training if your studio uses those labels interchangeably — the calorie tables are close, the programming is not always.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-yoga',
    title: 'How Many Calories Does Yoga Burn?',
    date: '2026-08-19',
    activity: 'Yoga',
    met: 3.0,
    metNote: ' (general hatha / mixed class; power yoga can sit closer to 4)',
    hook: 'People under- and over-estimate yoga calories. Restorative classes barely move the needle; sweaty power flows look more like light cardio. Most “yoga calories” searches need that intensity split.',
    intensityNotes:
      'MET ≈ 3.0 fits many standard mixed yoga classes. Yin/restorative is lower; vigorous vinyasa or hot power classes trend higher. Stillness, breathwork, and long holds pull averages down.',
    trainingValue:
      'Yoga’s best ROI is often mobility, stress, and training longevity — not max kcal. If fat loss is the goal, pair yoga with steps, protein, and an honest food log rather than chasing a studio board number.',
    compareHint:
      'Walking often burns more per minute than gentle yoga. That does not make yoga useless — it makes the comparison honest.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-zumba',
    title: 'How Many Calories Does Zumba Burn?',
    date: '2026-08-18',
    activity: 'Zumba',
    met: 6.5,
    metNote: ' (typical energetic group dance-fitness class)',
    hook: 'Zumba feels like a party, which is why adherence is high — and why calorie boards in studios get optimistic. Continuous dancing drives the burn; water breaks and demos cut it.',
    intensityNotes:
      'MET ≈ 6.5 is a solid mid estimate for continuous Zumba-style dance fitness. Beginner classes with lots of instruction trend lower; advanced nonstop tracks trend higher.',
    trainingValue:
      'Zumba shines for consistency and cardio without feeling like punishment. Treat it as conditioning. Keep strength work and protein if physique change matters.',
    compareHint:
      'If you are choosing between Zumba and a run for calorie density, compare equal continuous minutes — not “I went to class” vs “I ran for 20.”',
  }),
  singleActivityPost({
    slug: 'how-many-calories-elliptical',
    title: 'How Many Calories Does an Elliptical Burn?',
    date: '2026-08-17',
    activity: 'Elliptical training',
    met: 5.0,
    metNote: ' (moderate machine effort)',
    hook: 'Elliptical consoles are notorious for generous calorie readouts. The movement is real; the screen is often salesmanship. Use MET-based ranges as a sanity check.',
    intensityNotes:
      'MET ≈ 5.0 fits moderate continuous elliptical work. Higher resistance and faster cadence raise cost; holding the rails and coasting lowers it. Hands-free vs holding rails changes both effort and the estimate.',
    trainingValue:
      'Ellipticals are useful low-impact cardio. Great for steps-of-sorts when joints complain. Still not a license to ignore dinner logging.',
    compareHint:
      'Cross-check against walking or cycling weeks in your log. If the elliptical “burns” twice as much as those at similar RPE, distrust the machine first.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-rowing',
    title: 'How Many Calories Does Rowing Burn?',
    date: '2026-08-16',
    activity: 'Rowing',
    met: 7.0,
    metNote: ' (moderate continuous erg / boat effort)',
    hook: 'Rowing recruits a lot of muscle mass, so calorie cost per minute is legitimately high when technique is solid and splits are honest. Soft paddling is a different sport.',
    intensityNotes:
      'MET ≈ 7.0 for moderate continuous rowing. Hard pieces and race-pace work climb; long rests between intervals drop the session average. Damper setting is not a magic calorie dial by itself.',
    trainingValue:
      'Rowing builds engine and posterior-chain endurance. Technique protects ribs and low back — chasing calories with ugly pulls is a bad trade.',
    compareHint:
      'Against running, rowing can match or beat expenditure at similar hard efforts with less impact. Skill ceiling is higher; be patient.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-stair-climbing',
    title: 'How Many Calories Does Stair Climbing Burn?',
    date: '2026-08-15',
    activity: 'Stair climbing',
    met: 8.8,
    metNote: ' (vigorous stair / stair-climber effort)',
    hook: 'Stairs are a dense calorie modality: vertical work is expensive. That is why short stair sessions punch above their clock time — and why machine calorie screens still deserve skepticism.',
    intensityNotes:
      'MET ≈ 8.8 reflects vigorous stair climbing or a hard stair-climber pace. Leisurely steps between floors are closer to brisk walking with a vertical tax, not this MET.',
    trainingValue:
      'Stairs hammer legs and lungs. Dose carefully if knees or calves are cranky. Pair with protein if you are also lifting.',
    compareHint:
      'Per minute, stairs often beat easy jogging. Per recovery cost, they can also leave you wrecked — plan the week, not just the screenshot.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-kettlebell',
    title: 'How Many Calories Does Kettlebell Training Burn?',
    date: '2026-08-14',
    activity: 'Kettlebell training',
    met: 8.0,
    metNote: ' (continuous swings / conditioning-style kettlebell work)',
    hook: 'Kettlebell calories depend entirely on whether you mean continuous swings and complexes or slow strength practice with long rests. Those are different energy sports wearing the same bell.',
    intensityNotes:
      'MET ≈ 8.0 fits conditioning-style kettlebell work with limited rest. Heavy strength sets with long rests behave more like other resistance training (often closer to MET 3.5–6).',
    trainingValue:
      'Kettlebells excel at dense conditioning and hip-power patterns. Log them for training quality. Do not invent EPOC fairy tales to unlock dessert.',
    compareHint:
      'Versus classic weight lifting, continuous kettlebell conditioning usually burns more per minute; heavy strength work is a different goal.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-dance',
    title: 'How Many Calories Does Dance Burn?',
    date: '2026-08-13',
    activity: 'Dance',
    met: 5.5,
    metNote: ' (general social / recreational dance; aerobic dance classes can run higher)',
    hook: '“Dance calories” is a wide bucket: slow social dancing is not a cardio dance class. Search intent usually wants the sweaty middle — continuous movement with music.',
    intensityNotes:
      'MET ≈ 5.5 for general continuous dance. Ballroom with lots of standing may sit lower; vigorous aerobic or street styles can climb toward 7+.',
    trainingValue:
      'Dance wins on adherence and coordination. Use it as enjoyable cardio. Add strength and protein if body composition is the real target.',
    compareHint:
      'Studio dance-fitness brands (including Zumba-style classes) often sit a bit higher than casual social dance — match the intensity you actually did.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-walking-dog',
    title: 'How Many Calories Does Walking the Dog Burn?',
    date: '2026-08-12',
    activity: 'Walking the dog',
    met: 3.0,
    metNote: ' (leisure dog walking with typical stops)',
    hook: 'Dog walking is underrated NEAT — and overrated as a “workout calorie” flex. Sniff breaks, leash tangles, and neighbor chats turn a walk into interval standing.',
    intensityNotes:
      'MET ≈ 3.0 fits typical dog walking. Brisk continuous walking without stops lands higher (closer to 3.5–4.3). If your dog trains you to sprint, that is a different session.',
    trainingValue:
      'Consistency beats intensity here. Daily dog walks raise weekly expenditure quietly. Still log food; puppies do not burn burritos for you.',
    compareHint:
      'Track weekly steps and bodyweight trends. Dog walking shines as a steps floor, not as HIIT.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-house-cleaning',
    title: 'How Many Calories Does House Cleaning Burn?',
    date: '2026-08-11',
    activity: 'House cleaning',
    met: 3.3,
    metNote: ' (moderate cleaning — mopping, vacuuming, scrubbing)',
    hook: 'Cleaning calories are real NEAT, not a fat-loss hack. Moderate housework moves the needle slowly; sitting between tasks does not count as a circuit.',
    intensityNotes:
      'MET ≈ 3.3 for moderate cleaning. Light dusting is lower; vigorous scrubbing or moving furniture spikes briefly. Most people overestimate continuous hard effort.',
    trainingValue:
      'Count cleaning as lifestyle activity. Keep intentional training and protein for physique goals. Do not “earn” takeout with a bathroom scrub.',
    compareHint:
      'Steps and weekly weight trends tell the truth better than a single chore’s calorie guess.',
  }),
  singleActivityPost({
    slug: 'how-many-calories-calisthenics',
    title: 'How Many Calories Does Calisthenics Burn?',
    date: '2026-08-10',
    activity: 'Calisthenics',
    met: 8.0,
    metNote: ' (vigorous continuous calisthenics — push-ups, burpees, dense circuits)',
    hook: 'Calisthenics calorie answers split into two worlds: slow strength skills with long rests, versus dense circuits of push-ups, squats, and burpees. Search traffic usually wants the sweaty circuit.',
    intensityNotes:
      'MET ≈ 8.0 for vigorous continuous calisthenics. Skill work with long rests behaves more like resistance training at lower average METs. Density is the variable.',
    trainingValue:
      'Calisthenics builds relative strength and work capacity with minimal gear. Progressive overload still matters — reps, tempo, range, and harder variations.',
    compareHint:
      'Similar calorie density to many HIIT/circuit sessions when rest is short. Log the style you actually did.',
  }),
]

const comparisons = [
  vsPost({
    slug: 'running-vs-cycling-calories',
    title: 'Running vs Cycling: Calories Burned Compared (2026)',
    date: '2026-08-09',
    aName: 'Running',
    aMet: 9.8,
    bName: 'Cycling',
    bMet: 6.8,
    hook: 'Running vs cycling is the classic “which burns more?” search. At moderate continuous efforts, running usually costs more per minute — but joints, weather, and adherence decide the winner for your week.',
    pickGuide:
      'Pick running when you want denser burn and can tolerate impact. Pick cycling when you need lower impact, longer easy volume, or commute cardio you will actually do. Many athletes use both.',
  }),
  vsPost({
    slug: 'running-vs-weight-lifting-calories',
    title: 'Running vs Weight Lifting: Calories Burned Compared (2026)',
    date: '2026-08-08',
    aName: 'Running',
    aMet: 9.8,
    bName: 'Weight lifting',
    bMet: 5.0,
    hook: 'Comparing running to weight lifting on calories alone misses the point of lifting. Per continuous minute, running usually burns more; lifting wins on muscle stimulus and long-term shape at a given weight.',
    pickGuide:
      'If the only goal is session expenditure, running (or other continuous cardio) wins. If the goal is body composition, keep lifting and protein, and add steps or cardio as needed. Do both when recovery allows.',
  }),
  vsPost({
    slug: 'hiit-vs-circuit-calories',
    title: 'HIIT vs Circuit Training: Calories Burned Compared (2026)',
    date: '2026-08-07',
    aName: 'HIIT',
    aMet: 8.0,
    bName: 'Circuit training',
    bMet: 8.0,
    hook: 'HIIT vs circuit training is often a branding fight. At similar vigorous densities, calorie tables look almost identical — the programming and rest structure matter more than the label.',
    pickGuide:
      'Choose based on coaching quality, recovery, and whether you need strength emphasis (circuits with loads) or interval engine work. Ignore the name on the timetable; watch work-to-rest ratio.',
  }),
  vsPost({
    slug: 'swimming-vs-walking-calories',
    title: 'Swimming vs Walking: Calories Burned Compared (2026)',
    date: '2026-08-06',
    aName: 'Swimming',
    aMet: 6.0,
    bName: 'Walking',
    bMet: 4.3,
    hook: 'Swimming vs walking depends on stroke intensity and walking pace. Continuous freestyle usually beats an easy stroll per minute; a hard hike can close the gap. Access and skill decide adherence.',
    pickGuide:
      'Swim when you want low-impact full-body work and have lap access. Walk when you need daily NEAT that fits any street. Many fat-loss weeks are won with walking volume plus two skill sessions in the pool.',
  }),
  vsPost({
    slug: 'yoga-vs-walking-calories',
    title: 'Yoga vs Walking: Calories Burned Compared (2026)',
    date: '2026-08-05',
    aName: 'Walking',
    aMet: 4.3,
    bName: 'Yoga',
    bMet: 3.0,
    hook: 'Yoga vs walking for calories is usually a walking win at typical intensities. Yoga still earns its place for mobility and stress — just do not market a gentle flow as a calorie furnace.',
    pickGuide:
      'Walk for expenditure and steps. Practice yoga for recovery, range of motion, and nervous system. Ideal weeks often include both instead of forcing one to do the other’s job.',
  }),
  vsPost({
    slug: 'weight-lifting-vs-kettlebell-calories',
    title: 'Weight Lifting vs Kettlebell: Calories Burned Compared (2026)',
    date: '2026-08-04',
    aName: 'Kettlebell training',
    aMet: 8.0,
    bName: 'Weight lifting',
    bMet: 5.0,
    hook: 'Weight lifting vs kettlebell calories hinges on continuous swings versus long-rest strength sets. Conditioning kettlebell work usually burns more per minute; heavy barbell strength is not trying to win that race.',
    pickGuide:
      'Use kettlebell complexes when you want dense conditioning. Use classic lifting when progressive strength is the priority. Mixing both is normal — just log the style you trained.',
  }),
  vsPost({
    slug: 'running-vs-rowing-calories',
    title: 'Running vs Rowing: Calories Burned Compared (2026)',
    date: '2026-08-03',
    aName: 'Running',
    aMet: 9.8,
    bName: 'Rowing',
    bMet: 7.0,
    hook: 'Running vs rowing is a high-engine comparison. Moderate running often edges moderate rowing per minute, but hard rowing pieces can feel equally brutal with less impact.',
    pickGuide:
      'Run if you enjoy outdoor pace and impact is fine. Row if joints need a break or you want seated full-body pulls. Alternate when one modality beats up recovery.',
  }),
  vsPost({
    slug: 'zumba-vs-running-calories',
    title: 'Zumba vs Running: Calories Burned Compared (2026)',
    date: '2026-08-02',
    aName: 'Running',
    aMet: 9.8,
    bName: 'Zumba',
    bMet: 6.5,
    hook: 'Zumba vs running: per continuous minute, running typically burns more at moderate-hard efforts. Zumba often wins on fun and class adherence — which can matter more for weekly totals.',
    pickGuide:
      'Choose running for denser solo cardio. Choose Zumba when community and music keep you showing up. A hybrid week (two runs, one dance class) is a practical compromise.',
  }),
]

const posts = [...singles, ...comparisons]

const blog = JSON.parse(fs.readFileSync(BLOG_PATH, 'utf8'))
const existing = new Set(blog.map((p) => p.slug))
const toAdd = posts.filter((p) => {
  if (existing.has(p.slug)) {
    console.warn(`skip existing slug: ${p.slug}`)
    return false
  }
  return true
})

const next = [...toAdd, ...blog]
fs.writeFileSync(BLOG_PATH, JSON.stringify(next, null, 2) + '\n')
console.log(`Added ${toAdd.length} posts. blog.json now has ${next.length} posts.`)
for (const p of toAdd) console.log(`  + ${p.slug}`)
