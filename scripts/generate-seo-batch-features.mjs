/**
 * Feature-led EN blog batch — uses real Ignite AI product surface.
 * Usage: node scripts/generate-seo-batch-features.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const BLOG_PATH = path.join(ROOT, 'content', 'en', 'blog.json')

function post({ slug, title, date, description, sections }) {
  return { slug, title, date, description, sections }
}

const posts = [
  post({
    slug: 'snap-track-photo-label-barcode-drink-guide',
    title: 'Snap Track Explained: Photo, Label, Barcode, and Drink Logging in One Flow',
    date: '2026-09-11',
    description:
      'How IGNITE AI Snap Track handles meal photos, packaging labels, barcodes, and drinks — when to use each mode, what to edit, and why one camera flow beats four half-apps.',
    sections: [
      {
        body: [
          'Most calorie apps make you pick a lane: camera toy, barcode scanner, or manual search. Real eating mixes all three before noon. Snap Track in IGNITE AI is built for that mess — photo, label, barcode, and drink modes in one logging loop.',
          'The win is not “AI magic.” It is finishing the log before the meal goes cold.',
        ],
      },
      {
        heading: 'Photo mode — mixed plates and takeout',
        body: [
          'Use photo when the plate has no barcode: home cooking, bowls, restaurant food. You get calories plus macros, then edit ingredients and oils before you confirm.',
          'This is where databases usually die and adherence dies with them.',
        ],
      },
      {
        heading: 'Label mode — packaging that lies in fine print',
        body: [
          'Packaging photos catch serving sizes and macros when the brand is awkward to search. Useful for imported snacks, protein bars, and “per 100g vs per pack” traps.',
        ],
      },
      {
        heading: 'Barcode — packaged speed',
        body: [
          'Barcode remains king for supermarket staples. Snap Track keeps it beside photo logging so you are not bouncing between apps when breakfast is yogurt and dinner is a skillet.',
        ],
      },
      {
        heading: 'Drink mode — the silent deficit killer',
        body: [
          'Lattes, smoothies, and “just a soda” wreck weekly averages. A dedicated drink path stops treating beverages like an afterthought.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'One Quick Log entry point. Four input modes. Editable AI results. Food Hub saves. Share cards if you want proof on Stories. That stack is why Snap Track feels like a system, not a gimmick camera.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If your diet is half packages and half real plates, you need both scanners and vision — in one place. That is Snap Track inside IGNITE AI.',
        ],
      },
    ],
  }),

  post({
    slug: 'voice-and-text-meal-logging-ignite-ai',
    title: 'Log Meals by Voice or Text in IGNITE AI (When You Cannot Take a Photo)',
    date: '2026-09-12',
    description:
      'How IGNITE AI Quick Log describe and voice modes work when a photo is impossible — driving, dark restaurants, shared plates — and how they sit next to Snap Track photo logging.',
    sections: [
      {
        body: [
          'Not every meal is photogenic. You are driving through a coffee, eating with clients, or the lighting is a crime. IGNITE AI still lets you Describe or Voice-log macros without abandoning the day.',
          'Photo-first apps that cannot fall back to language quietly train you to skip.',
        ],
      },
      {
        heading: 'Describe — type what you ate',
        body: [
          'Text logging is for speed and privacy. Name the meal, get an estimate, edit, confirm. Ideal for repeats you already understand (“usual chicken bowl, extra rice”).',
        ],
      },
      {
        heading: 'Voice — hands busy, brain done',
        body: [
          'Voice captures the same intent when typing is worse. Speak the meal, review the estimate, fix oils and portions, save.',
        ],
      },
      {
        heading: 'Still edit like an adult',
        body: [
          'Language models guess. You own sauces, cooking fat, and second helpings. The point is a completable log, not a perfect transcript.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Voice, text, photo, label, barcode, and workouts live under one Quick Log culture — Premium tools that do not exile you to a separate “AI chat only” toy when dinner gets weird.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'Consistency beats the perfect selfie. Use IGNITE AI describe and voice when the camera cannot — then snap when it can.',
        ],
      },
    ],
  }),

  post({
    slug: 'snap-cook-ai-recipes-from-fridge-photos',
    title: 'Snap Cook: Turn Fridge Photos into AI Recipes Inside IGNITE AI',
    date: '2026-09-13',
    description:
      'What Snap Cook does in IGNITE AI — photograph ingredients, get AI recipes with diet and allergy preferences, save results, and keep cooking inside the same macro-tracking app.',
    sections: [
      {
        body: [
          'Recipe apps do not know your calorie target. Calorie apps do not help you cook what is already in the fridge. Snap Cook closes that gap: photo your ingredients, get an AI recipe path, keep macros in the same product.',
          'It is Premium for a reason — it is not a Pinterest clone bolted on.',
        ],
      },
      {
        heading: 'How the flow works',
        body: [
          'Open Snap Cook, capture what you have, set diet and allergy preferences, generate, review the recipe result, save what you like.',
          'Then log the plated meal with Snap Track when you eat it — planning and logging stay siblings.',
        ],
      },
      {
        heading: 'Smart Pantry context',
        body: [
          'Smart Pantry supports the same “use what you own” mindset so cooking advice is not fantasy shopping lists.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Most stacks force three apps: recipes, macros, shopping. IGNITE AI keeps Snap Cook, pantry thinking, and meal logging in one Ignition loop — so “what should I cook?” does not nuke your deficit.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If your fridge is full and your plan is empty, Snap Cook is the feature that makes IGNITE AI feel unfair compared to diary-only trackers.',
        ],
      },
    ],
  }),

  post({
    slug: 'ignite-ai-diet-planner-meal-swaps',
    title: 'IGNITE AI Diet Planner: AI Weekly Plans and One-Tap Meal Swaps',
    date: '2026-09-14',
    description:
      'How the IGNITE AI Diet tab builds AI meal plans, lets you swap meals, and sits next to Snap Cook and Saved recipes — without becoming a rigid meal-delivery cult.',
    sections: [
      {
        body: [
          'Static PDF meal plans die on Tuesday. The Diet tab in IGNITE AI generates an AI planner you can actually live with — daily and weekly views, plus AI meal substitutions when life happens.',
          'It is Premium because plan generation is not a free novelty button.',
        ],
      },
      {
        heading: 'Plan the week, survive the day',
        body: [
          'See the grid, open today, cook or log what matches reality. When a meal is impossible, swap it instead of abandoning the entire plan.',
        ],
      },
      {
        heading: 'Saved recipes and Snap Cook',
        body: [
          'Saved recipes and Snap Cook live in the same nutrition culture as the planner — so “plan,” “cook,” and “log” stop feeling like three religions.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'You are not locked into a coach PDF. You get an adaptive planner beside photo logging and workouts — the missing middle between MyFitnessPal chaos and Noom lectures.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If meal plans always fail at the first restaurant night, try a planner that expects swaps — IGNITE AI Diet.',
        ],
      },
    ],
  }),

  post({
    slug: 'ignite-ai-lab-coaching-chat',
    title: 'IGNITE AI Lab: Coaching Chat That Can Also Log Your Meals and Workouts',
    date: '2026-09-15',
    description:
      'What the IGNITE AI Lab tab is for — nutrition and fitness coaching chat, guided meal and exercise logging, voice, and history — and how it differs from a generic ChatGPT tab.',
    sections: [
      {
        body: [
          'A chatbot that cannot touch your diary is entertainment. AI Lab is wired into IGNITE AI: coaching conversation plus guided logging for meals and workouts, with voice and history when you need context.',
          'Premium, because token burn without product integration is just a costume.',
        ],
      },
      {
        heading: 'Ask, then act',
        body: [
          'Clarify macros, plate ideas, or training questions — then log without leaving the product. That loop is the difference between “cool answer” and changed behavior.',
        ],
      },
      {
        heading: 'Not a replacement for Snap Track',
        body: [
          'Photo logging still wins for messy plates. Lab wins for decisions, troubleshooting, and language-first capture. Use both.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Your coach chat sits beside rings, fasting, friends, and share cards — one identity, one Premium gate, not five subscriptions pretending to be an ecosystem.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If you want AI that can talk and write to the same log, AI Lab is the reason IGNITE AI is not “just another calorie camera.”',
        ],
      },
    ],
  }),

  post({
    slug: 'log-workouts-in-ignite-ai-run-strength-describe',
    title: 'How to Log Workouts in IGNITE AI: Run, Strength, AI Describe, Manual Calories',
    date: '2026-09-16',
    description:
      'IGNITE AI exercise logging options — run, strength, AI activity describe, and manual calorie entry — plus how burned calories can affect your daily target and share cards.',
    sections: [
      {
        body: [
          'Food-only trackers pretend training is a footnote. IGNITE AI treats workouts as first-class logs: run flows, strength flows, AI describe for weird sessions, and manual calories when you already trust a watch.',
          'Premium exercise logging exists so training and dinner stop living in separate graveyards.',
        ],
      },
      {
        heading: 'Pick the right capture',
        body: [
          'Run when the session is cardio structured. Strength when lifts matter. Describe when the workout is a hybrid mess. Manual when the wearable number is the one you want on record.',
        ],
      },
      {
        heading: 'Burned calories and daily targets',
        body: [
          'You can prefer whether burned calories adjust your daily goal. That preference is a philosophy choice — IGNITE AI lets you set it instead of forcing one religion.',
        ],
      },
      {
        heading: 'Share cards for training',
        body: [
          'Exercise share cards turn sessions into Stories-ready proof — useful for accountability and creator-style posting without screenshot shame.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Meal snaps and workouts share a timeline on Home. That single picture — “I trained and I ate” — is what most stacks make you rebuild manually every Sunday.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If your training app and food app never speak, switch to one that logs both. That is IGNITE AI.',
        ],
      },
    ],
  }),

  post({
    slug: 'intermittent-fasting-schedules-ignite-ai',
    title: 'Intermittent Fasting in IGNITE AI: 12:12, 14:10, 16:8, and Custom Windows',
    date: '2026-09-17',
    description:
      'How fasting works inside IGNITE AI — schedule presets, custom windows, home countdown card, history, and how fasting sits next to calorie and macro tracking.',
    sections: [
      {
        body: [
          'Fasting apps that ignore macros create skinny-fat confusion. Macro apps that ignore fasting windows create accidental grazing. IGNITE AI runs intermittent fasting beside the same Home rings you already use.',
          'Presets include 12:12, 14:10, 16:8, plus custom — with safety/intro education before you play hero.',
        ],
      },
      {
        heading: 'Home card you can show or hide',
        body: [
          'The fasting countdown can live on Home — or leave if it stresses you. Customize Home is part of the product, not an afterthought.',
        ],
      },
      {
        heading: 'Fasting without losing the food log',
        body: [
          'When the window opens, Snap Track still matters. Fasting is a schedule; results still need honest eating inside the window.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Timer + macros + workouts + social proof in one app beats a pure fasting timer that knows nothing about your protein.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If you fast and track, stop splitting your brain across two icons. Use IGNITE AI fasting on the same Home as your calories.',
        ],
      },
    ],
  }),

  post({
    slug: 'apple-health-health-connect-ignite-ai',
    title: 'Sync Apple Health or Health Connect with IGNITE AI (Steps, Heart, Sleep)',
    date: '2026-09-18',
    description:
      'How IGNITE AI connects to Apple Health and Android Health Connect for steps, heart rate, sleep, and related metrics — and how those signals show up in Health and Home.',
    sections: [
      {
        body: [
          'Manual step entry is how trackers become fiction. IGNITE AI hooks into Apple Health and Health Connect so steps, heart data, sleep, and related signals can feed Health views and Home metric carousels.',
          'Wearables still lie sometimes — but blank data lies more.',
        ],
      },
      {
        heading: 'What you will notice in-app',
        body: [
          'Health tab details for activity, heart rate, blood oxygen, sleep stages/time. Home can surface metric cards so daily context is not buried in settings.',
        ],
      },
      {
        heading: 'Setup without drama',
        body: [
          'Use in-app Health settings and setup guidance. Grant only what you need. Re-check permissions after OS updates — they love to reset trust.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Health metrics sit beside nutrition rings, fasting, and training — a cockpit, not a disconnected “vitals” mini-app.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'Connect Health once, then judge weeks with steps and sleep next to macros. That integration is a quiet reason IGNITE AI feels complete.',
        ],
      },
    ],
  }),

  post({
    slug: 'progress-photos-weight-tracking-ignite-ai',
    title: 'Progress Photos and Weight Tracking in IGNITE AI (Beyond the Scale)',
    date: '2026-09-19',
    description:
      'How IGNITE AI handles weight history, progress photos, compare views, and Progress tab charts — so body change is not only a noisy morning number.',
    sections: [
      {
        body: [
          'Scale weight oscillates. Progress photos and trend charts tell the truth slower and kinder. IGNITE AI supports weight logs, progress photo capture/confirm/compare, and Progress visualizations next to nutrition.',
          'Quick Log even exposes Weight without treating it like a shame button.',
        ],
      },
      {
        heading: 'Photos you will actually take',
        body: [
          'Capture, confirm, review, compare. Same lighting habits beat fancy filters. The feature exists to make consistency easy, not to become a social network.',
        ],
      },
      {
        heading: 'Progress tab context',
        body: [
          'Weight ranges, goal percentage, energy averages, and badge/streaks rows keep motivation visual when the scale stalls for water.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Weight, photos, meals, and workouts share one product identity — so “I look different but the scale did not move” has evidence, not vibes.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If the scale gaslights you, add photos and trends. IGNITE AI already has the rails — use them.',
        ],
      },
    ],
  }),

  post({
    slug: 'share-cards-stories-ignite-ai',
    title: 'IGNITE AI Share Cards: Turn Meals and Workouts into Story-Ready Proof',
    date: '2026-09-20',
    description:
      'How meal and workout Share Cards work in IGNITE AI — themes, prompts after logging, Stories-ready output, and why shareable proof beats abandoned screenshots.',
    sections: [
      {
        body: [
          'Screenshots of ugly diary UIs do not inspire anyone — including you. IGNITE AI Share Cards turn meal and workout logs into themed, Story-ready visuals with editable headlines and dozens of styles.',
          'Optional prompts after logging keep sharing a habit, not a design project.',
        ],
      },
      {
        heading: 'Meals and training both get cards',
        body: [
          'Nutrition cards can show the photo with calories and macros. Exercise cards showcase the session. Theme curators exist because aesthetics change whether you hit post.',
        ],
      },
      {
        heading: 'Accountability without a toxic feed',
        body: [
          'Share to Stories or into friend groups when you want social pressure that still feels like your brand — not a public body-check arena.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Most trackers stop at data. IGNITE AI ships the creative layer that makes consistency visible — the same reason creators actually open the app after dinner.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If proof keeps you consistent, stop cropping sad screenshots. Use Share Cards in IGNITE AI.',
        ],
      },
    ],
  }),

  post({
    slug: 'badges-streaks-milestones-ignite-ai',
    title: 'Badges, Streaks, and Milestones in IGNITE AI (Motivation Without Gimmicks)',
    date: '2026-09-21',
    description:
      'How IGNITE AI gamifies consistency with badges, streaks, milestones, and celebrations — covering meals, snaps, exercise, shares, wellness, and friends — without turning health into a casino.',
    sections: [
      {
        body: [
          'Gamification fails when it rewards nonsense. IGNITE AI badges and streaks map to real behaviors: logging meals, snapping, training, sharing, wellness, friends — with milestone screens and optional celebration toggles.',
          'You can mute celebrations if dopamine theater annoys you.',
        ],
      },
      {
        heading: 'Why streaks still work',
        body: [
          'A streak is a contract with yesterday’s self. Pair it with honest macros or it becomes a vanity counter. IGNITE AI keeps the badge next to the diary on purpose.',
        ],
      },
      {
        heading: 'Share a badge when it matters',
        body: [
          'Badge share cards exist for the moments worth posting — first week locked, training consistency, social wins — without forcing a public leaderboard on every tap.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Badges sit inside a serious logger with Premium AI tools — not a candy shell around empty content. Motivation features serve the diary, not the other way around.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'Want streaks that mean something? Earn them in IGNITE AI where the underlying logs are real.',
        ],
      },
    ],
  }),

  post({
    slug: 'friends-groups-leaderboards-ignite-ai',
    title: 'Friends and Groups in IGNITE AI: Private Circles, Feeds, Chat, Leaderboards',
    date: '2026-09-22',
    description:
      'How IGNITE AI Friends works — handles, invites, private groups, creator groups, meal/workout feeds, chat, leaderboards, and auto-share preferences for accountability.',
    sections: [
      {
        body: [
          'Solo tracking is easy to ghost. IGNITE AI Friends adds handles, friend requests, invite links/QR, private groups, and creator groups with feeds, chat, and leaderboards.',
          'You can auto-share meals or workouts into group feeds when you want accountability on rails.',
        ],
      },
      {
        heading: 'Private groups vs creator groups',
        body: [
          'Private groups are for your circle. Creator groups are for verified creators building an audience community — feed focused on the creator’s meals and workouts, with audience reactions.',
          'Creating a creator group requires Creator Program approval; joining as audience is open via search or invite code.',
        ],
      },
      {
        heading: 'Social without a public town square',
        body: [
          'The broader public Community surface can stay off while Friends stays useful — intentional circles beat infinite scroll body comparisons.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Your social graph is attached to the same logs and Share Cards you already create. Accountability is not a second app with zero nutrition context.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If willpower fails alone, put the diary in a group. Friends in IGNITE AI is built for that.',
        ],
      },
    ],
  }),

  post({
    slug: 'creator-program-ignite-ai-code-premium',
    title: 'IGNITE AI Creator Program: Personalized Codes, Audience Pricing, Complimentary Premium',
    date: '2026-09-23',
    description:
      'How the IGNITE AI Creator Program works — apply in-app with socials, get a creator code for exclusive annual pricing, earn on qualified annual Premium signups, and complimentary Premium for approved creators.',
    sections: [
      {
        body: [
          'Creators should not duct-tape referral links onto a calorie app that was never built for them. IGNITE AI ships a Creator Program inside Profile: apply with Instagram/TikTok/YouTube (or other), get reviewed, unlock a personalized code.',
          'Audience can unlock exclusive annual Premium pricing with that code. Creators can earn rewards on qualified annual Premium purchases — separate from Refer a Friend.',
        ],
      },
      {
        heading: 'Complimentary Premium for creators',
        body: [
          'Approved creators may receive complimentary Premium for a window shown in-app (extendable based on program performance). It is a program benefit, not a silent App Store sub.',
        ],
      },
      {
        heading: 'Creator groups',
        body: [
          'Approved creators can create Creator Groups — community feeds around their meals and workouts — while audience joins via search or invite.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Share Cards, Friends, Creator codes, and Premium complimentary access are one narrative: creators can show the product, monetize honestly, and live inside the same tools their audience downloads.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If you create fitness or food content, apply in IGNITE AI Profile → Creator Program — then share a code that actually means something.',
        ],
      },
    ],
  }),

  post({
    slug: 'refer-a-friend-ignite-ai-rewards',
    title: 'Refer a Friend in IGNITE AI: Promo Codes, Annual Plan Rewards, PayPal Payouts',
    date: '2026-09-24',
    description:
      'How IGNITE AI Refer a Friend works — personal promo codes, rewards when friends buy annual Premium, payout flow, and how it differs from the Creator Program.',
    sections: [
      {
        body: [
          'Refer a Friend is the everyday growth loop: share your personal promo code, friends sign up with it, you earn when they purchase the annual Premium plan (subject to program rules and refund windows).',
          'It is separate from Creator Program codes — do not mix the stories.',
        ],
      },
      {
        heading: 'What qualifies',
        body: [
          'Rewards target annual Premium success, not every free install. That keeps the program aligned with real customers, not fake accounts.',
        ],
      },
      {
        heading: 'Payouts',
        body: [
          'In-app rewards dashboards track usage and status. Payouts go through the designated method (such as PayPal) after review — details live in the referral screens and terms.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Referral is built into Profile beside the product people actually love enough to recommend — photo logging, workouts, friends — not a desperate coupon site.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'Like the app? Send your code. Refer a Friend in IGNITE AI turns recommendations into structured rewards.',
        ],
      },
    ],
  }),

  post({
    slug: 'customize-home-ignite-ai-dashboard',
    title: 'Customize Your IGNITE AI Home: Fasting, Snap Modules, Hub, and Meal Sections',
    date: '2026-09-25',
    description:
      'How to customize the IGNITE AI Home dashboard — toggle Ignite Hub, fasting card, Snap Track, Snap Cook, meal logs, and related preferences so the first screen matches how you actually live.',
    sections: [
      {
        body: [
          'Default dashboards become noise. IGNITE AI lets you customize Home: show or hide Ignite Hub, fasting, Snap Track, Snap Cook, meal log sections, and related prompts so the first open feels like your cockpit.',
          'People quit apps that shout features they never use.',
        ],
      },
      {
        heading: 'Keep the rings, trim the rest',
        body: [
          'Daily nutrition rings stay central. Everything around them should earn space — fasting if you fast, Snap Cook if you cook, Hub if you are social.',
        ],
      },
      {
        heading: 'Share prompts on your terms',
        body: [
          'Share card prompts can be part of the Home culture or dialed back in preferences — motivation without harassment.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Customization is not a buried “pro layout” upsell. It is how a feature-rich Premium app stays calm on day thirty.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'Make Home yours in a minute. That small IGNITE AI preference often decides whether you open the app at dinner.',
        ],
      },
    ],
  }),

  post({
    slug: 'water-macros-rollover-calories-ignite-preferences',
    title: 'IGNITE AI Preferences Power Users Love: Water, Rollover Calories, Burned Kcal',
    date: '2026-09-26',
    description:
      'Power-user preferences in IGNITE AI — water tracking, calorie rollover, whether workout burn adjusts targets, units, language, and appearance — the quiet settings that change adherence.',
    sections: [
      {
        body: [
          'Flashy AI demos get downloads. Preferences keep them. IGNITE AI includes water logging on Home, options to rollover calories, whether burned exercise kcal adjusts daily targets, units, languages, and appearance modes.',
          'These are adult controls for people who have broken up with rigid apps before.',
        ],
      },
      {
        heading: 'Rollover and burned calories',
        body: [
          'Rollover helps when life is uneven across the week. Adding burned calories to the budget is controversial — IGNITE AI lets you choose instead of preaching.',
        ],
      },
      {
        heading: 'Water is not a gimmick',
        body: [
          'Quick water adjustments on the calorie card remove friction. Hydration tracking that takes twelve taps will never happen.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Premium AI features sit on top of these boring, decisive toggles. That combination — flexible rules plus fast capture — is the real product moat.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'Open Preferences once, set rollover, burn rules, water, and units — then let Snap Track do the loud work. IGNITE AI for people who customize before they quit.',
        ],
      },
    ],
  }),

  post({
    slug: 'nutrition-score-weekly-health-ignite-ai',
    title: 'Nutrition Score, Weekly Macros, and Health Views in IGNITE AI Progress',
    date: '2026-09-27',
    description:
      'How IGNITE AI Progress/Health tabs show nutrition scores, weekly calories and macros, BMI, steps, heart rate, SpO₂, and sleep — turning daily logs into trends you can act on.',
    sections: [
      {
        body: [
          'Daily rings are dopamine. Trends are strategy. IGNITE AI Progress splits Health, Nutrition, and Progress: weekly calories, nutrition score, macro charts, BMI, steps, heart rate, SpO₂, sleep, weight charts, and photo context.',
          'Logging without review is collecting stamps.',
        ],
      },
      {
        heading: 'Nutrition tab — the honesty mirror',
        body: [
          'Weekly calories and macro mini-charts expose the pattern you miss day to day — quiet weekend surplus, weekday heroics, protein gaps.',
        ],
      },
      {
        heading: 'Health tab — context from the body',
        body: [
          'Steps, heart, oxygen, sleep stages/time sit beside the diet story when permissions are connected — useful when “fatigue” is actually recovery debt.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Capture (Snap Track), plan (Diet), coach (AI Lab), and review (Progress) share one identity. Most competitors force you to screenshot across ecosystems.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If you only watch today\'s ring, you will misunderstand the month. Use IGNITE AI Progress like a weekly board meeting with yourself.',
        ],
      },
    ],
  }),

  post({
    slug: 'ignite-ai-premium-what-you-unlock',
    title: 'What IGNITE AI Premium Unlocks: Snap Track, Snap Cook, AI Lab, Diet, Exercise',
    date: '2026-09-28',
    description:
      'A clear breakdown of IGNITE AI Premium — Snap Track, Snap Cook, AI Lab, Diet planner, and exercise logging gates — plus how referral trials and creator complimentary Premium fit in.',
    sections: [
      {
        body: [
          'Premium should mean capability, not cosmetic themes. In IGNITE AI, Premium unlocks the heavy tools: Snap Track (photo/describe/voice), Snap Cook, AI Lab, Diet plan generation, and exercise logging flows.',
          'RevenueCat powers subscriptions. Referral trials and Creator complimentary Premium can also grant access under program rules.',
        ],
      },
      {
        heading: 'What stays meaningful either way',
        body: [
          'Account, onboarding goals, Health sync, Friends structure, badges, and many preference tools still shape the product — Premium accelerates the AI-heavy capture and planning layer.',
        ],
      },
      {
        heading: 'Who Premium is for',
        body: [
          'Anyone whose meals are not barcodes, anyone who wants workouts beside food, anyone who wants AI planning without five other subscriptions.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'The paywall protects a coherent lab — camera, recipes, coach, planner, training — not a single locked chart color. That is why creators can demo a lifestyle, not a feature fragment.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'If you want the full Ignition loop, go Premium (or Creator/referral paths when eligible). Everything viral about IGNITE AI lives there.',
        ],
      },
    ],
  }),

  post({
    slug: 'food-hub-saved-meals-ignite-ai',
    title: 'Save Meals and Recipes in IGNITE AI: Food Hub, Bookmarks, and Repeat Speed',
    date: '2026-09-29',
    description:
      'How saving works in IGNITE AI — bookmark meals into Food Hub, reuse staples, keep Saved recipes in Diet, and why repeat speed is the hidden half of photo logging.',
    sections: [
      {
        body: [
          'Photo logging wins day one. Saved staples win day thirty. IGNITE AI lets you bookmark meals into Food Hub-style saves and keep recipes in Saved — so Tuesday’s usual lunch is not a new AI negotiation.',
          'Repeats are how busy adults stay consistent.',
        ],
      },
      {
        heading: 'After Snap Track — save what recurs',
        body: [
          'Confirm the meal, bookmark it, recall it when the plate repeats. Edit only what changed. That is elite adherence UX.',
        ],
      },
      {
        heading: 'Recipes deserve a home too',
        body: [
          'Snap Cook results and Saved recipes keep cooking knowledge inside the same app that owns your macros.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'Vision capture plus saved repeats plus planner is a full kitchen OS. Diary apps usually nail only one of the three.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'Snap once. Save forever. That rhythm is why IGNITE AI still feels fast after the novelty camera wears off.',
        ],
      },
    ],
  }),

  post({
    slug: 'summary-report-ignite-ai-share-progress',
    title: 'IGNITE AI Summary Report: Exportable Progress You Can Actually Share',
    date: '2026-09-30',
    description:
      'What the IGNITE AI summary report is for — turning your logs into a shareable progress narrative for coaches, friends, or your future self.',
    sections: [
      {
        body: [
          'Raw diaries are hard to send to a coach or a skeptical friend. IGNITE AI includes a summary report path so progress can be exported/shared as a coherent story — not a folder of screenshots.',
          'Reporting is how logging becomes social capital and professional feedback.',
        ],
      },
      {
        heading: 'Who it helps',
        body: [
          'Lifters with online coaches, creators documenting a cut, anyone who wants a weekly review artifact beyond rings.',
        ],
      },
      {
        heading: 'Where IGNITE AI is different',
        body: [
          'The report sits on top of photo meals, workouts, weight, and health context — a richer substrate than typed-only diaries.',
        ],
      },
      {
        heading: 'Bottom line',
        body: [
          'When you need proof that travels, use the summary report in IGNITE AI — built from the same logs that already run your day.',
        ],
      },
    ],
  }),
]

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
toAdd.forEach((p) => console.log(' +', p.slug))
