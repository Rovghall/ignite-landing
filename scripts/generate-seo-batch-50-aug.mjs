/**
 * 50 EN posts spread across 2026-08-22 … 2026-08-31 (5/day).
 * Usage: node scripts/generate-seo-batch-50-aug.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const BLOG_PATH = path.join(process.cwd(), 'content', 'en', 'blog.json')

function kcal(met, kg, minutes) {
  return Math.round(met * kg * (minutes / 60))
}

function tableLines(met, label) {
  const weights = [55, 70, 85]
  const durations = [15, 30, 45, 60]
  return [
    `Estimated calories for ${label} (MET ≈ ${met}):`,
    ...weights.map((kg) => {
      const cells = durations.map((m) => `${m} min: ~${kcal(met, kg, m)}`).join(' · ')
      return `${kg} kg: ${cells}`
    }),
  ]
}

function datesFor50() {
  // Aug 22–31 = 10 days × 5 posts
  const out = []
  for (let day = 22; day <= 31; day++) {
    for (let i = 0; i < 5; i++) out.push(`2026-08-${String(day).padStart(2, '0')}`)
  }
  return out
}

function activity(slug, title, date, name, met, note, hook, ignite) {
  const a30 = kcal(met, 70, 30)
  return {
    slug,
    title,
    date,
    description: `${name} burns about ${a30} kcal in 30 minutes at 70 kg (MET ≈ ${met}). Tables by weight/duration, intensity caveats, and how IGNITE AI keeps food honest after the session.`,
    sections: [
      {
        body: [
          hook,
          `Working MET ≈ ${met}${note}. At 70 kg that is ~${a30} kcal / 30 min. Scale for bodyweight; long rests lower the real total.`,
        ],
      },
      { heading: 'Calorie table', body: [...tableLines(met, name), 'Continuous effort only.'] },
      {
        heading: 'Where IGNITE AI fits',
        body: [ignite],
      },
      {
        heading: 'Bottom line',
        body: [
          `Use ~${a30} kcal / 30 min at 70 kg as a starting point for ${name.toLowerCase()}, then trust weekly food averages more than any single board.`,
        ],
      },
    ],
  }
}

function vs(slug, title, date, a, aMet, b, bMet, hook, ignite) {
  const a30 = kcal(aMet, 70, 30)
  const b30 = kcal(bMet, 70, 30)
  const diff = Math.abs(a30 - b30)
  const higher = a30 >= b30 ? a : b
  return {
    slug,
    title,
    date,
    description: `70 kg / 30 min: ~${a30} kcal ${a} (MET ≈ ${aMet}) vs ~${b30} ${b} (MET ≈ ${bMet}). ${diff} kcal gap plus how to choose — and log food in IGNITE AI.`,
    sections: [
      { body: [hook, `Gap ≈ ${diff} kcal / 30 min at 70 kg before rests change everything.`] },
      { heading: `${a} (MET ≈ ${aMet})`, body: tableLines(aMet, a) },
      { heading: `${b} (MET ≈ ${bMet})`, body: tableLines(bMet, b) },
      { heading: 'Where IGNITE AI fits', body: [ignite] },
      { heading: 'Bottom line', body: [`${higher} leads on these METs — adherence and dinner still decide the week.`] },
    ],
  }
}

function feat(slug, title, date, description, paras) {
  const sections = paras.map((p, i) =>
    typeof p === 'string'
      ? { body: [p] }
      : { heading: p.h, body: Array.isArray(p.b) ? p.b : [p.b] },
  )
  return { slug, title, date, description, sections }
}

const specs = [
  // 1-15 activity
  () =>
    activity(
      'how-many-calories-rock-climbing',
      'How Many Calories Does Rock Climbing Burn?',
      '',
      'Rock climbing',
      8.0,
      ' (vigorous route climbing / bouldering sessions with short rests)',
      'Climbing calories swing with grade, rest on holds, and how long you beta-spray between attempts.',
      'Project burns end at the fridge. IGNITE AI is for climbers who snap the post-sesh burrito before “I sent, I earned” becomes an unlogged 1,000 kcal.',
    ),
  () =>
    activity(
      'how-many-calories-surfing',
      'How Many Calories Does Surfing Burn?',
      '',
      'Surfing',
      3.0,
      ' (typical surf session average — paddling spikes, sitting on the board drops it)',
      'Surfing feels exhausting; averages include a lot of sitting. Paddle-heavy days earn more than mellow peak-season crowds.',
      'Dawn patrol hunger is dishonest. IGNITE AI logs the breakfast burrito with the same seriousness as the session — ocean credit, kitchen debit.',
    ),
  () =>
    activity(
      'how-many-calories-snowboarding',
      'How Many Calories Does Snowboarding Burn?',
      '',
      'Snowboarding',
      5.3,
      ' (recreational boarding; park laps and hike-to runs vary)',
      'Lift rides are seated rest. Continuous carving and bootpack hiking change the bill completely.',
      'Après-ski destroys cuts. IGNITE AI exists so the fondue night still hits the diary — Snap Track drinks and plates before the lodge Wi‑Fi dies.',
    ),
  () =>
    activity(
      'how-many-calories-ice-skating',
      'How Many Calories Does Ice Skating Burn?',
      '',
      'Ice skating',
      7.0,
      ' (continuous recreational skating)',
      'Rink laps with few rails grabs beat standing-at-the-wall “skating.” Continuous movement sets the MET.',
      'Hot chocolate afterward is the real boss fight. IGNITE AI drink + meal logging keeps rink days from becoming mystery calories.',
    ),
  () =>
    activity(
      'how-many-calories-volleyball',
      'How Many Calories Does Volleyball Burn?',
      '',
      'Volleyball',
      4.0,
      ' (recreational; competitive beach or elite indoor runs higher)',
      'Rec league standing between points is not beach nationals. Intensity and sand vs court matter.',
      'Team pizza is tradition; unlogged pizza is sabotage. IGNITE AI Friends + meal snaps keep league night honest without killing the vibe.',
    ),
  () =>
    activity(
      'how-many-calories-golf-walking',
      'How Many Calories Does Golf Burn Walking vs Riding a Cart?',
      '',
      'Golf (walking)',
      4.3,
      ' (walking the course; cart golf is far lower)',
      'Walking 18 with a bag is real NEAT. Riding a cart is mostly standing and swinging — do not confuse the two searches.',
      'Clubhouse beers erase fairway steps. IGNITE AI is how golfers log the walk and the nineteenth hole without pretending they are the same.',
    ),
  () =>
    activity(
      'how-many-calories-bjj',
      'How Many Calories Does BJJ / Martial Arts Rolling Burn?',
      '',
      'Brazilian jiu-jitsu',
      10.0,
      ' (vigorous grappling / rolling)',
      'Hard rolls are elite calorie density. Technique drilling with long instruction blocks averages much lower.',
      '“Bulk for BJJ” without a log is how heavyweights happen by accident. IGNITE AI keeps rolls and post-training plates on one timeline.',
    ),
  () =>
    activity(
      'how-many-calories-reformer-pilates',
      'How Many Calories Does Reformer Pilates Burn?',
      '',
      'Reformer Pilates',
      4.0,
      ' (moderate reformer class — springs and continuous work vary)',
      'Reformer is not mat Pilates and not HIIT. Springs and transitions change cost; lying still between cues does not.',
      'Boutique classes love vibe calories. IGNITE AI prefers edited meal photos after class — so the smoothie bowl matches reality.',
    ),
  () =>
    activity(
      'how-many-calories-stairmaster',
      'How Many Calories Does the StairMaster Burn?',
      '',
      'StairMaster',
      9.0,
      ' (vigorous stair-climber machine)',
      'StairMaster consoles lie cheerfully. Lean on the rails and your real MET collapses while the screen stays heroic.',
      'Machine pride vs dinner truth — IGNITE AI is the second display you actually need after the climber.',
    ),
  () =>
    activity(
      'how-many-calories-assault-bike',
      'How Many Calories Does an Assault Bike Burn?',
      '',
      'Assault bike',
      10.0,
      ' (vigorous air-bike intervals averaged with short rests)',
      'Assault bikes punish immediately. Interval rests dominate the session average — all-out every second is a fantasy.',
      'Fan-bike nausea plus drive-through is a classic own-goal. IGNITE AI catches the recovery meal before mythology writes it off.',
    ),
  () =>
    activity(
      'how-many-calories-swimming-freestyle',
      'How Many Calories Does Freestyle Swimming Burn?',
      '',
      'Freestyle swimming',
      8.0,
      ' (continuous freestyle laps, vigorous recreational)',
      'Stroke and pace change everything. Freestyle continuous laps beat leisurely breaststroke chatting at the wall.',
      'Poolside hunger is sneaky. IGNITE AI logs the session and the post-swim food so “I swam” is not a blank check.',
    ),
  () =>
    activity(
      'how-many-calories-hot-yoga',
      'How Many Calories Does Hot Yoga Burn?',
      '',
      'Hot yoga',
      4.0,
      ' (heated yoga class average — sweat ≠ calorie burn)',
      'Heat makes you feel destroyed. Water weight is not fat loss. Hot yoga burn is real but usually overstated by sweat drama.',
      'Weigh-ins after hot yoga gaslight people. IGNITE AI Progress photos and weekly averages beat the post-class scale freakout.',
    ),
  () =>
    activity(
      'how-many-calories-heavy-gardening',
      'How Many Calories Does Heavy Gardening / Digging Burn?',
      '',
      'Heavy gardening',
      5.0,
      ' (digging, hauling, vigorous yard work)',
      'Digging and hauling soil is not light weeding. Tool choice and continuous shoveling set the cost.',
      'Yard work plus unlogged snacks is peak weekend fiction. IGNITE AI keeps chores and grazing in the same honesty system.',
    ),
  () =>
    activity(
      'how-many-calories-carrying-groceries',
      'How Many Calories Does Walking with Heavy Grocery Bags Burn?',
      '',
      'Carrying groceries',
      5.0,
      ' (walking with load)',
      'Loaded carries are sneaky training. Distance, bag weight, and stairs multiply the cost beyond a normal walk.',
      'Errand NEAT only counts if dinner still gets logged. IGNITE AI is built for real-life movement plus real plates.',
    ),
  () =>
    activity(
      'how-many-calories-standing-desk',
      'How Many Calories Does a Standing Desk Burn vs Sitting?',
      '',
      'Standing desk work',
      1.8,
      ' (standing quietly — not pacing meetings)',
      'Standing beats sitting slightly. It will not outrun takeout. Pace meetings and walking meetings matter more than the desk height meme.',
      'Desk calories are tiny; lunch is not. IGNITE AI focuses you on the meal that moves the needle while Health steps cover the fidgeting.',
    ),

  // 16-23 vs
  () =>
    vs(
      'assault-bike-vs-treadmill-calories',
      'Assault Bike vs Treadmill: Calories Burned (2026)',
      '',
      'Assault bike',
      10.0,
      'Running',
      9.8,
      'Assault bike vs treadmill is a high-intensity photo finish — rest structure and true continuous minutes decide more than brand loyalty.',
      'Both create ravenous humans. IGNITE AI is the cool-down that matters: photograph food before the “I annihilated calories” story spends them twice.',
    ),
  () =>
    vs(
      'bjj-vs-boxing-calories',
      'BJJ vs Boxing: Calories Burned Compared (2026)',
      '',
      'Brazilian jiu-jitsu',
      10.0,
      'Boxing',
      7.8,
      'Hard BJJ rolls often edge boxing bag rounds on average MET — until your boxing class never stops moving and your BJJ night is 40% instruction.',
      'Combat athletes under-log food or over-bulk. IGNITE AI keeps rounds and plates on one identity so weight classes stay intentional.',
    ),
  () =>
    vs(
      'rock-climbing-vs-weight-lifting-calories',
      'Rock Climbing vs Weight Lifting: Calories Burned (2026)',
      '',
      'Rock climbing',
      8.0,
      'Weight lifting',
      5.0,
      'Climbing sessions usually burn more per minute than long-rest lifting. Lifting still wins for progressive muscle — different jobs.',
      'Send day + pizza is fine if it is logged. IGNITE AI makes “climbing diet” measurable instead of aesthetic.',
    ),
  () =>
    vs(
      'hot-yoga-vs-power-walking-calories',
      'Hot Yoga vs Power Walking: Calories Burned (2026)',
      '',
      'Power walking',
      5.0,
      'Hot yoga',
      4.0,
      'Power walking often beats hot yoga on calories without the heat theater — and you can do it daily.',
      'Sweat is not a receipt. IGNITE AI plus Health steps show which habit actually moved weekly averages.',
    ),
  () =>
    vs(
      'freestyle-vs-breaststroke-calories',
      'Freestyle vs Breaststroke Swimming: Calories (2026)',
      '',
      'Freestyle swimming',
      8.0,
      'Breaststroke swimming',
      5.3,
      'Continuous freestyle usually costs more than leisurely breaststroke. Match pace and rest at the wall before crowning a stroke.',
      'Pick a stroke, then snap the post-pool meal in IGNITE AI — aquatic virtue is not a food amnesty.',
    ),
  () =>
    vs(
      'golf-walking-vs-cart-calories',
      'Golf Walking vs Golf Cart: Calories Burned (2026)',
      '',
      'Golf (walking)',
      4.3,
      'Golf (cart)',
      2.5,
      'Walking golf is a steps engine. Cart golf is mostly social standing. Stop comparing them as one “golf calories” number.',
      'IGNITE AI + Health sync turns walking rounds into visible NEAT — and still logs the cart-path beers.',
    ),
  () =>
    vs(
      'snowboard-vs-ski-calories',
      'Snowboard vs Ski: Calories Burned Compared (2026)',
      '',
      'Snowboarding',
      5.3,
      'Skiing',
      6.0,
      'Skiing often edges recreational snowboarding at similar continuous effort — terrain and how much you sit on lifts dominate both.',
      'Mountain days need mountain honesty. IGNITE AI is the lodge-proof logger for skiers and riders alike.',
    ),
  () =>
    vs(
      'reformer-vs-mat-pilates-calories',
      'Reformer Pilates vs Mat Pilates: Calories Burned (2026)',
      '',
      'Reformer Pilates',
      4.0,
      'Pilates',
      3.0,
      'Reformer can edge mat when springs keep you working; both lose to power walking if pure expenditure is the only goal.',
      'Choose for strength and mobility, log food in IGNITE AI so boutique sweat does not rewrite your deficit.',
    ),

  // 24-33 food logging
  () =>
    feat(
      'how-to-log-buffet-all-you-can-eat',
      'How to Log a Buffet or All-You-Can-Eat Without Quitting Your Tracker',
      '',
      'A practical protocol for logging buffets and AYCE meals — photo passes, estimate stacks, and how IGNITE AI Snap Track keeps the night on your average.',
      [
        'Buffets break database apps because there is no barcode for “third plate.” The goal is a usable estimate in under two minutes, not lab precision.',
        { h: 'Protocol', b: ['Photograph each plate as you sit. Edit oils and desserts. Prefer over-estimate slightly. Stop when the night is logged — do not rebuild every dish from search.'] },
        { h: 'Where IGNITE AI fits', b: 'Snap Track photo mode was built for chaotic plates. Buffets are the final boss — and the reason camera-first logging exists.' },
        { h: 'Bottom line', b: 'Log the buffet ugly and fast in IGNITE AI. Silence is the only wrong answer.' },
      ],
    ),
  () =>
    feat(
      'track-delivery-apps-uber-eats-doordash',
      'How to Track Uber Eats / DoorDash Orders Without Abandoning Macros',
      '',
      'Track delivery meals when menus lie — screenshot-plus-photo tactics, drinks, and why IGNITE AI beats typing ghost database entries.',
      [
        'Delivery apps are where streaks go to die. Treat the bag like a restaurant plate: photo, edit oil, log the drink, move on.',
        { h: 'Where IGNITE AI fits', b: 'Restaurant-ready Snap Track plus drink mode means DoorDash night stays inside the same rings as your meal-prep Tuesday.' },
        { h: 'Bottom line', b: 'If delivery is reality, IGNITE AI is the tracker that survives it.' },
      ],
    ),
  () =>
    feat(
      'log-protein-coffee-cafe-drinks',
      'How to Log Protein Coffee and “Healthy” Café Drinks',
      '',
      'Protein lattes and healthy café drinks hide sugars and milks — how to log them in IGNITE AI drink and label flows.',
      [
        '“Healthy” café drinks are liquid meals. Use drink mode or label scans; edit milk type and syrups on purpose.',
        { h: 'Where IGNITE AI fits', b: 'Drink logging beside meal snaps stops coffee from silently eating your protein target.' },
        { h: 'Bottom line', b: 'If it has a straw and a story, log it in IGNITE AI.' },
      ],
    ),
  () =>
    feat(
      'track-oils-sauces-bites-accurately',
      'How to Track Oils, Sauces, and “Just a Taste” Accurately',
      '',
      'The hidden calories that stall fat loss — cooking oils, dressings, tastes — and how IGNITE AI photo edits make them visible.',
      [
        'Vision models miss butter in the pan. Your edit pass is the product. Add oil, dressing, and tastes before you confirm.',
        { h: 'Where IGNITE AI fits', b: 'Snap Track is designed around editable estimates — the anti-autopilot feature serious cutters need.' },
        { h: 'Bottom line', b: 'Edit oils in IGNITE AI or stop wondering why the scale stalled.' },
      ],
    ),
  () =>
    feat(
      'log-meal-prep-containers-week',
      'How to Log Meal Prep Containers for the Whole Week',
      '',
      'Save once, reuse all week — using IGNITE AI Saved meals / Food Hub bookmarks for meal-prep containers and macro consistency.',
      [
        'Prep Sunday. Snap and save one container. Reuse the saved meal all week with tiny edits. That is elite adherence UX.',
        { h: 'Where IGNITE AI fits', b: 'Photo once + Saved repeats is how busy humans stay consistent without re-AI-ing chicken rice daily.' },
        { h: 'Bottom line', b: 'Meal prep without saved staples is unpaid labor. Use IGNITE AI saves.' },
      ],
    ),
  () =>
    feat(
      'track-cheat-meals-without-blowing-average',
      'How to Track Cheat Meals Without Blowing Your Weekly Average',
      '',
      'Log free meals without shame spirals — weekly averages, rollover preferences, and IGNITE AI photo honesty on purpose.',
      [
        'Unlogged cheat meals become mythic monsters. Logged ones are data. Snap it, keep the week average, adjust next week once.',
        { h: 'Where IGNITE AI fits', b: 'Optional calorie rollover + ruthless photo logging turns “cheat” into a planned swing, not a blackout.' },
        { h: 'Bottom line', b: 'If you will eat it, log it in IGNITE AI — averages beat guilt.' },
      ],
    ),
  () =>
    feat(
      'grocery-scan-vs-photo-logging',
      'Grocery Barcode Scan vs Photo Logging: When to Use Each',
      '',
      'Barcodes win on packages; photos win on cooking — how IGNITE AI Snap Track combines both without forcing one religion.',
      [
        'Supermarket staples: barcode. Skillet dinners: photo. Label mode for weird packs. The best app is the one that does not make you choose a single weapon.',
        { h: 'Where IGNITE AI fits', b: 'Photo, label, barcode, and drink in one Quick Log culture — that is the stack.' },
        { h: 'Bottom line', b: 'Stop arguing scan vs camera. Use both inside IGNITE AI.' },
      ],
    ),
  () =>
    feat(
      'log-asian-takeout-rice-oils-sharing',
      'Best Way to Log Asian Takeout (Rice, Oils, Sharing Plates)',
      '',
      'Practical logging for Asian takeout — rice volume, cooking oils, shared dishes — using IGNITE AI photo estimates and edits.',
      [
        'Shared plates and glossy oils break databases. Photograph the table, split portions in the edit, bias oil upward, log the drink.',
        { h: 'Where IGNITE AI fits', b: 'Mixed-plate Snap Track is native territory — takeout lighting included.' },
        { h: 'Bottom line', b: 'Takeout is normal. Unlogged takeout is optional. IGNITE AI.' },
      ],
    ),
  () =>
    feat(
      'log-pizza-by-slice-vs-pie',
      'How to Log Pizza by Slice vs Whole Pie',
      '',
      'Pizza logging without fantasy database entries — slice estimates, toppings, oil, and IGNITE AI photo confirmation.',
      [
        'Whole-pie database rows rarely match your shop. Count slices, photo the plate, edit toppings and crust reality.',
        { h: 'Where IGNITE AI fits', b: 'Camera-first pizza nights beat arguing with “pizza, cheese, large” ghosts in a search box.' },
        { h: 'Bottom line', b: 'Slice it, snap it, stay in IGNITE AI.' },
      ],
    ),
  () =>
    feat(
      'alcohol-macros-night-out-protocol',
      'Tracking Alcohol Macros on a Night Out: A Practical Protocol',
      '',
      'A simple night-out protocol for alcohol macros — drink logging, protein anchors, and IGNITE AI damage control without quitting social life.',
      [
        'Log drinks as you go. Eat protein before the second round. Photograph late food. Judge the weekly average on Monday, not the bathroom scale at 3 a.m.',
        { h: 'Where IGNITE AI fits', b: 'Drink mode + meal snaps + optional Friends accountability is adult social tracking.' },
        { h: 'Bottom line', b: 'Go out. Stay honest. IGNITE AI is the designated logger.' },
      ],
    ),

  // 34-43 features
  () =>
    feat(
      'bmi-spo2-sleep-stages-ignite-health',
      'BMI, SpO₂, and Sleep Stages in the IGNITE AI Health Tab',
      '',
      'What IGNITE AI Health shows beyond calories — BMI, blood oxygen, sleep stages/time — and how to use them with nutrition trends.',
      [
        'Macros without recovery context miss half the story. Health tab surfaces BMI, SpO₂, sleep, heart, and steps beside nutrition.',
        { h: 'Where IGNITE AI fits', b: 'One cockpit: eat, train, sleep signals — not three apps and a spreadsheet.' },
        { h: 'Bottom line', b: 'Connect Health permissions and read the Health tab weekly inside IGNITE AI.' },
      ],
    ),
  () =>
    feat(
      'daily-goal-rings-explained-ignite',
      'IGNITE AI Daily Goal Rings Explained (Calories and Macros)',
      '',
      'How Home rings work in IGNITE AI — calories and macros at a glance, what “closing” means, and how logging feeds the rings.',
      [
        'Rings are not toys; they are compressed targets from onboarding and Profile goals. Close them with honest logs, not creative math.',
        { h: 'Where IGNITE AI fits', b: 'Every Snap Track confirm updates the same Home story — rings you actually feel in your thumb.' },
        { h: 'Bottom line', b: 'Understand the rings once, then chase consistency in IGNITE AI.' },
      ],
    ),
  () =>
    feat(
      'log-reminders-notifications-ignite',
      'Log Reminders and Notifications in IGNITE AI: Stay Consistent Without Spam',
      '',
      'Using IGNITE AI log reminders and notification preferences so dinner gets logged without notification fatigue.',
      [
        'Reminders work when they are sparse and timed to your meals. Turn off noise; keep the one ping that saves the streak.',
        { h: 'Where IGNITE AI fits', b: 'Preferences put you in charge — Premium AI capture plus human-scaled nudges.' },
        { h: 'Bottom line', b: 'Set one dinner reminder in IGNITE AI and protect it.' },
      ],
    ),
  () =>
    feat(
      'feature-request-bug-report-ignite',
      'How Feature Requests and Bug Reports Work in IGNITE AI',
      '',
      'Using in-app feature request and bug report flows so real logging pain reaches the IGNITE AI team.',
      [
        'The best product feedback comes from people who actually snap meals at 10 p.m. Use in-app request/report tools instead of vague store reviews.',
        { h: 'Where IGNITE AI fits', b: 'Feedback sits in Profile beside the tools you use — short loop from friction to roadmap.' },
        { h: 'Bottom line', b: 'If something breaks your log, report it in IGNITE AI the same day.' },
      ],
    ),
  () =>
    feat(
      'summary-report-for-online-coaches',
      'Send Your IGNITE AI Summary Report to an Online Coach',
      '',
      'How athletes use IGNITE AI summary reports as coach-ready progress artifacts instead of chaotic screenshot folders.',
      [
        'Coaches need trends, not forty cropped diaries. Summary reports package the story from the same logs you already keep.',
        { h: 'Where IGNITE AI fits', b: 'Photo meals + workouts + weight context make a richer coach packet than typed-only apps.' },
        { h: 'Bottom line', b: 'Train with a coach? Export the summary from IGNITE AI and stop sending camera rolls.' },
      ],
    ),
  () =>
    feat(
      'appearance-modes-adherence-ignite',
      'Why Appearance Modes in IGNITE AI Affect Whether You Open the App',
      '',
      'Light, dark, and appearance preferences in IGNITE AI — small UX choices that change nightly logging adherence.',
      [
        'If the UI hurts your eyes at 11 p.m., you will skip. Set appearance once. Adherence is aesthetic as well as moral.',
        { h: 'Where IGNITE AI fits', b: 'Serious logger, flexible chrome — Premium power without forcing one look.' },
        { h: 'Bottom line', b: 'Make IGNITE AI easy to look at, then the hard part is just dinner.' },
      ],
    ),
  () =>
    feat(
      'rollover-calories-week-examples',
      'How Calorie Rollover Works Week-to-Week (With Examples)',
      '',
      'Examples of calorie rollover in IGNITE AI preferences — when it helps uneven weeks and when it becomes an excuse.',
      [
        'Rollover can smooth a wedding Saturday if weekdays were honest. It cannot rescue seven blank nights. Examples: bank 200 kcal weekdays → spend on Saturday dinner — only if logs exist.',
        { h: 'Where IGNITE AI fits', b: 'The toggle lives in Preferences next to burn rules — adult controls for adult schedules.' },
        { h: 'Bottom line', b: 'Use rollover as a plan in IGNITE AI, not a loophole.' },
      ],
    ),
  () =>
    feat(
      'add-burned-calories-on-vs-off',
      'Should You Add Burned Calories Back in IGNITE AI?',
      '',
      'When to enable “add burned calories” in IGNITE AI — maintenance athletes vs fat-loss phases, and how wearables inflate the debate.',
      [
        'Fat-loss phases often do better with burned calories off or heavily discounted. High-output athletes may add some back. Wearables overestimate — trust scale trends.',
        { h: 'Where IGNITE AI fits', b: 'You choose the philosophy; the app does not preach a single dogma.' },
        { h: 'Bottom line', b: 'Pick a rule in IGNITE AI, run it two weeks, then judge averages — not vibes.' },
      ],
    ),
  () =>
    feat(
      'progress-energy-averages-read-a-stall',
      'How to Read Energy Averages in IGNITE AI When Weight Stalls',
      '',
      'Using Progress tab energy averages and nutrition trends in IGNITE AI to diagnose stalls without panic cuts.',
      [
        'Stalls are sodium, menstrual fluid, underreported oils, or true need for a change. Energy averages plus photo honesty beat random 500 kcal slashers.',
        { h: 'Where IGNITE AI fits', b: 'Progress + Snap Track edits give you the evidence folder panic never has.' },
        { h: 'Bottom line', b: 'Read the averages in IGNITE AI before you burn the plan.' },
      ],
    ),
  () =>
    feat(
      'snap-cook-with-diet-planner-swaps',
      'Pair Snap Cook Recipes with IGNITE AI Diet Planner Swaps',
      '',
      'How to use Snap Cook and Diet planner meal swaps together — cook what you have, swap what you cannot, log what you ate.',
      [
        'Planner says salmon; fridge says eggs. Snap Cook invents a legal dinner; Diet swap updates the plan; Snap Track logs the plate. That is the full loop.',
        { h: 'Where IGNITE AI fits', b: 'Cook, plan, and log are siblings — not three subscriptions.' },
        { h: 'Bottom line', b: 'When the plan breaks, Snap Cook + swaps inside IGNITE AI keep you in motion.' },
      ],
    ),

  // 44-50 audiences
  () =>
    feat(
      'calorie-tracker-for-shift-workers',
      'Best Calorie Tracker for Shift Workers and Night Shifts',
      '',
      'How shift workers can keep macros honest across nights — IGNITE AI Quick Log voice/photo, reminders, and rollover ideas.',
      [
        'Night shift destroys “normal meal” UI. You need capture at 3 a.m.: voice, photo, saved staples, flexible reminders.',
        { h: 'Where IGNITE AI fits', b: 'Quick Log does not care what the sun is doing — and Health sleep stages help explain the wreckage.' },
        { h: 'Bottom line', b: 'If your clock is broken, your logger cannot be. IGNITE AI.' },
      ],
    ),
  () =>
    feat(
      'macro-app-for-college-dining-hall',
      'Best Macro App for College Students on a Dining Hall Plan',
      '',
      'Dining-hall tracking without barcodes — photo plates, shared food, and IGNITE AI Friends for dorm accountability.',
      [
        'Dining halls are buffets with student IDs. Photograph trays, edit oils, save repeats when the station is predictable.',
        { h: 'Where IGNITE AI fits', b: 'Camera-first + Friends groups beat spreadsheet athletes in freshman year.' },
        { h: 'Bottom line', b: 'Campus food is chaotic. IGNITE AI is the dorm-proof diary.' },
      ],
    ),
  () =>
    feat(
      'track-macros-international-travel',
      'How to Track Macros While Traveling Internationally',
      '',
      'Travel logging when labels change language — photo meals, drink logging, and IGNITE AI language/units preferences on the road.',
      [
        'Foreign menus kill search boxes. Photo the plate. Edit what you know. Set language/units before you fly.',
        { h: 'Where IGNITE AI fits', b: 'Snap Track + i18n preferences travel better than barcode addiction.' },
        { h: 'Bottom line', b: 'Trips do not require a tracking vacation — take IGNITE AI.' },
      ],
    ),
  () =>
    feat(
      'calorie-tracking-after-injury',
      'Calorie Tracking After Injury or Low-Activity Weeks',
      '',
      'Adjusting targets and expectations in IGNITE AI when injury drops expenditure — without abandoning the food log.',
      [
        'Injury weeks need lower expenditure honesty, not food blackouts. Keep logging; adjust targets; use Progress photos when the scale is emotional.',
        { h: 'Where IGNITE AI fits', b: 'Turn burned-calorie add-ons down, keep Snap Track, protect protein — the app supports the philosophy switch.' },
        { h: 'Bottom line', b: 'Injured is not “off the plan.” It is a different plan inside IGNITE AI.' },
      ],
    ),
  () =>
    feat(
      'couples-tracking-friends-groups',
      'How Couples Can Track Together in IGNITE AI Without Sharing Logins',
      '',
      'Use private Friends groups for couple accountability — shared feeds without sharing passwords or merging diaries.',
      [
        'Shared logins destroy relationships and data. Each person owns a diary; a private group shares proof via feed or auto-share.',
        { h: 'Where IGNITE AI fits', b: 'Friends was built for circles — couples included — with chat and leaderboards if you want teeth.' },
        { h: 'Bottom line', b: 'Two accounts, one group. IGNITE AI for couples who want accountability without fusion.' },
      ],
    ),
  () =>
    feat(
      'ignite-ai-for-creators-share-to-code',
      'IGNITE AI for Creators: From Share Cards to Creator Codes',
      '',
      'A creator workflow in IGNITE AI — Share Cards for content, Creator Program application, personalized codes, and Creator Groups.',
      [
        'Show the plate with Share Cards. Apply to Creator Program. Share your code for audience annual pricing. Build a Creator Group when approved.',
        { h: 'Where IGNITE AI fits', b: 'Content, community, and monetization hooks live beside the real logger — not a separate creator portal with zero product.' },
        { h: 'Bottom line', b: 'Creators: stop screenshotting ugly diaries. Use IGNITE AI end to end.' },
      ],
    ),
  () =>
    feat(
      '30-day-ignite-ai-challenge-outline',
      'A 30-Day IGNITE AI Challenge Outline (What to Measure Weekly)',
      '',
      'A 30-day challenge framework using IGNITE AI — daily logging, weekly averages, workouts, optional Friends proof, and what to review each Sunday.',
      [
        'Days 1–7: log everything, learn Snap Track edits. Days 8–14: add two workouts/week. Days 15–21: Saved staples + optional group auto-share. Days 22–30: Progress review, adjust one lever.',
        { h: 'Weekly scoreboard', b: ['Average weight', 'Protein days hit', 'Workouts completed', 'Unlogged meals (aim: zero)'] },
        { h: 'Where IGNITE AI fits', b: 'The challenge is just the product used on purpose — rings, Progress, Friends, Share Cards.' },
        { h: 'Bottom line', b: 'Run thirty days inside IGNITE AI with weekly reviews — not vibes.' },
      ],
    ),
]

const dates = datesFor50()
if (dates.length !== 50) throw new Error('date count')

const posts = specs.map((build, i) => {
  const p = build()
  p.date = dates[i]
  return p
})

const blog = JSON.parse(fs.readFileSync(BLOG_PATH, 'utf8'))
const existing = new Set(blog.map((p) => p.slug))
const toAdd = posts.filter((p) => {
  if (existing.has(p.slug)) {
    console.warn('skip', p.slug)
    return false
  }
  return true
})

fs.writeFileSync(BLOG_PATH, JSON.stringify([...toAdd, ...blog], null, 2) + '\n')
console.log(`Added ${toAdd.length}. Total ${toAdd.length + blog.length}`)
const byDay = {}
for (const p of toAdd) byDay[p.date] = (byDay[p.date] || 0) + 1
console.log(byDay)
