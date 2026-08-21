/**
 * Creator Program posts for food / gym / nutrition / fitness influencers.
 * Dates: 2026-09-01 … (1/day). Usage: node scripts/generate-seo-batch-creator.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const BLOG_PATH = path.join(process.cwd(), 'content', 'en', 'blog.json')

function post(slug, title, date, description, blocks) {
  return {
    slug,
    title,
    date,
    description,
    sections: blocks.map((b) =>
      typeof b === 'string' ? { body: [b] } : { heading: b.h, body: Array.isArray(b.b) ? b.b : [b.b] },
    ),
  }
}

const posts = [
  post(
    'creator-program-for-fitness-influencers',
    'IGNITE AI Creator Program for Fitness Influencers: Codes, Premium, and Proof Content',
    '2026-09-01',
    'How fitness influencers use the IGNITE AI Creator Program — personalized codes, complimentary Premium, Share Cards, and Creator Groups that match gym content.',
    [
      'Fitness creators sell transformation. Ugly diary screenshots kill the brand. IGNITE AI Creator Program gives you complimentary Premium to live the product, Share Cards that look like content, and a personalized code for audience annual pricing.',
      {
        h: 'What you unlock when approved',
        b: [
          'Personalized creator code, exclusive annual Premium pricing for attributed followers, rewards on qualified annual Premium signups, complimentary Premium for a window shown in-app, and the ability to create Creator Groups.',
        ],
      },
      {
        h: 'Content that does not feel like an ad',
        b: 'Film the workout in Activity logging, plate the meal with Snap Track, post the Share Card to Stories — the CTA is your code in bio, not a fake “link in bio PDF.”',
      },
      {
        h: 'Bottom line',
        b: 'If your niche is gym and macros, apply in Profile → Creator Program. IGNITE AI was built to be shown on camera.',
      },
    ],
  ),
  post(
    'creator-program-for-food-bloggers',
    'Creator Program for Food Bloggers and Recipe Creators on IGNITE AI',
    '2026-09-02',
    'Why food bloggers join IGNITE AI Creator Program — Snap Cook, meal Share Cards, audience codes, and logging that matches recipe content.',
    [
      'Food creators already shoot plates. IGNITE AI turns those plates into macros, Share Cards, and a creator code — without forcing a separate “fitness app persona.”',
      {
        h: 'Snap Cook + Snap Track = content engine',
        b: 'Cook from what you film, log what you taste, save staples. Your audience sees the same loop when they download with your code.',
      },
      {
        h: 'Audience offer you can say out loud',
        b: 'Approved creators share a code for the lowest annual Premium price for attributed followers — a clean CTA under a recipe Reel.',
      },
      {
        h: 'Bottom line',
        b: 'Recipe niche + calorie app usually clash. IGNITE AI Creator Program is where they finally share a kitchen.',
      },
    ],
  ),
  post(
    'creator-program-for-nutrition-coaches',
    'IGNITE AI Creator Program for Nutrition Coaches and Online Macros Mentors',
    '2026-09-03',
    'How nutrition coaches use IGNITE AI — client-ready photo logging, summary reports, creator codes for program upsells, and complimentary Premium while you demo.',
    [
      'Coaches need clients to log mixed meals without spreadsheet rebellion. IGNITE AI photo logging plus summary reports is the demo; Creator Program is how you package distribution.',
      {
        h: 'Demo on complimentary Premium',
        b: 'Approved creators can receive complimentary Premium for a program window — use it to teach, film tutorials, and show edits on oils and sauces live.',
      },
      {
        h: 'Code as onboarding asset',
        b: 'Send clients your creator code for exclusive annual pricing when they are ready for Premium — aligned with real subscriptions, not coupon spam.',
      },
      {
        h: 'Bottom line',
        b: 'If you coach macros online, apply to the Creator Program and stop recommending apps you would never film.',
      },
    ],
  ),
  post(
    'creator-program-for-gym-influencers',
    'Gym Influencers: Turn PR Videos into IGNITE AI Creator Revenue',
    '2026-09-04',
    'A gym-influencer playbook for IGNITE AI — log lifts, Share Cards, Creator Groups, and annual-plan rewards when followers go Premium with your code.',
    [
      'PR videos get views. Soft CTAs get downloads. IGNITE AI lets you log the session, publish a training Share Card, and point to a creator code that unlocks audience annual pricing.',
      {
        h: 'Creator Groups for your community',
        b: 'Approved creators can run Creator Groups — feed centered on your meals and workouts, audience joins via search or invite. Accountability content that lives in-product.',
      },
      {
        h: 'Rewards that match premium customers',
        b: 'Qualified annual Premium signups under your attribution can earn creator rewards (region amounts shown in-app) — separate from Refer a Friend.',
      },
      {
        h: 'Bottom line',
        b: 'Gym creators: stop linking random trackers. Apply in IGNITE AI and make the log part of the flex.',
      },
    ],
  ),
  post(
    'how-ignite-creator-codes-work',
    'How IGNITE AI Creator Codes Work (Audience Pricing + Attribution)',
    '2026-09-05',
    'Plain-English guide to IGNITE AI creator codes — exclusive annual Premium pricing for followers, attribution rules, and what creators should say on camera.',
    [
      'A creator code is personal. Followers apply it as instructed at signup or in-app. Where offered, it unlocks exclusive annual Premium pricing for attributed users.',
      {
        h: 'What to say in a Reel',
        b: '“Download IGNITE AI, use code NAME for the best annual Premium price.” Then show Snap Track for two seconds — proof over pitch.',
      },
      {
        h: 'What does not qualify for rewards',
        b: 'Weekly/monthly plans, unpaid accounts, refunds/chargebacks, and fake accounts do not drive creator rewards. Annual Premium success is the target.',
      },
      {
        h: 'Bottom line',
        b: 'Codes are simple on camera and strict in the ledger — by design. Read Creator Program Terms, then share cleanly.',
      },
    ],
  ),
  post(
    'creator-complimentary-premium-explained',
    'Complimentary Premium for IGNITE AI Creators (90 Days and Extensions)',
    '2026-09-06',
    'How complimentary Premium works for approved IGNITE AI creators — program windows, pause/extend rules, and why it exists for authentic content.',
    [
      'Approved creators may receive complimentary Premium for a program window shown in-app (commonly starting around 90 days, with extensions tied to dedication and results). It is a benefit, not an App Store subscription in disguise.',
      {
        h: 'Why it matters on camera',
        b: 'You can demo Snap Track, Snap Cook, AI Lab, Diet, and Exercise without paywalling your own tutorials mid-take.',
      },
      {
        h: 'Program management',
        b: 'Start, end, remaining days, and pause state appear in Creator Program screens. Abuse or inactivity can end benefits under the Terms.',
      },
      {
        h: 'Bottom line',
        b: 'Complimentary Premium is fuel for authentic creator content — apply, create, earn extensions with real performance.',
      },
    ],
  ),
  post(
    'creator-groups-for-fitness-communities',
    'Build a Fitness Community with IGNITE AI Creator Groups',
    '2026-09-07',
    'How Creator Groups work for fitness influencers — creator-led meal and workout feeds, audience join flows, chat and reactions, versus private friend groups.',
    [
      'Private groups are for your friends. Creator Groups are for your audience — feed focused on your meals and workouts, with community reactions and chat.',
      {
        h: 'Who can create one',
        b: 'Creating a Creator Group requires an approved Creator Program status. Audience members can join via search or invite code.',
      },
      {
        h: 'Content loop',
        b: 'Auto-share workouts and meals when you want the feed to update itself after training and dinner — fewer “remember to post in Discord” failures.',
      },
      {
        h: 'Bottom line',
        b: 'If your community lives in DMs, move proof into an IGNITE AI Creator Group.',
      },
    ],
  ),
  post(
    'share-cards-for-influencer-content',
    'Share Cards for Influencers: Story-Ready Meals and Workouts in IGNITE AI',
    '2026-09-08',
    'How fitness and food influencers use IGNITE AI Share Cards — themes, headlines, Stories output — instead of ugly calorie-app screenshots.',
    [
      'Your grid is a brand. Screenshotting a spreadsheet tracker is brand damage. Share Cards turn logs into Story-ready visuals with themes and editable headlines.',
      {
        h: 'Meal and training cards',
        b: 'Food creators lead with plate + macros. Gym creators lead with session cards. Both can end with “code in bio.”',
      },
      {
        h: 'Prompts after logging',
        b: 'Optional share prompts keep posting a habit after Snap Track or Activity — content without a separate design session.',
      },
      {
        h: 'Bottom line',
        b: 'Creators who care how they look on Stories should not log in ugly apps. Use IGNITE AI Share Cards.',
      },
    ],
  ),
  post(
    'creator-program-vs-refer-a-friend',
    'Creator Program vs Refer a Friend in IGNITE AI: Which Link Should Influencers Use?',
    '2026-09-09',
    'Clear differences between IGNITE AI Creator Program and Refer a Friend — codes, audience pricing, rewards, and when influencers should use which.',
    [
      'Refer a Friend is for everyday users sharing a personal promo code. Creator Program is for approved creators with audience pricing, creator rewards, complimentary Premium, and Creator Groups.',
      {
        h: 'Do not mix CTAs',
        b: 'If you are an approved creator, lead with your creator code and Creator Program story. Referral codes are a different bucket in Terms and attribution.',
      },
      {
        h: 'Bottom line',
        b: 'Influencers: apply to Creator Program. Friends: use Refer a Friend. Clarity converts.',
      },
    ],
  ),
  post(
    'micro-influencers-creator-program-ignite',
    'Micro-Influencers in Fitness and Food: Why IGNITE AI Creator Program Still Fits',
    '2026-09-10',
    'Why 5k–50k fitness and food creators are a strong fit for IGNITE AI Creator Program — trust, niche conversion, and authentic Premium demos.',
    [
      'Mega reach without trust sells nothing. Micro-influencers in gym, food, and nutrition convert because followers believe the plate and the program.',
      {
        h: 'What “small” creators get',
        b: 'Same code mechanics, same complimentary Premium path when approved, same Share Cards — without needing a million followers to start.',
      },
      {
        h: 'Proof over polish',
        b: 'Film imperfect dinners with Snap Track edits. That honesty is the niche advantage.',
      },
      {
        h: 'Bottom line',
        b: 'If your audience asks what app you use, answer with IGNITE AI — and a creator code after approval.',
      },
    ],
  ),
  post(
    'how-to-apply-creator-program-in-app',
    'How to Apply to the IGNITE AI Creator Program Inside the App',
    '2026-09-11',
    'Step-by-step: download IGNITE AI, open Profile → Creator Program, submit socials, wait for review, then unlock code and Premium benefits when approved.',
    [
      'Applications happen in-app so your creator identity stays tied to the same account that will hold your code and complimentary Premium.',
      {
        h: 'Steps',
        b: [
          '1) Download IGNITE AI on App Store or Google Play. 2) Create your account. 3) Open Profile → Creator Program. 4) Apply with Instagram / TikTok / YouTube / other details. 5) Wait for review. 6) When approved, grab your code and start creating.',
        ],
      },
      {
        h: 'What to prepare',
        b: 'Accurate handles, niche, and audience context. Misleading applications waste everyone’s time and can be refused under Program Terms.',
      },
      {
        h: 'Bottom line',
        b: 'No separate web form theater — apply where you will actually log: inside IGNITE AI.',
      },
    ],
  ),
  post(
    'pitch-creator-code-to-followers',
    'How to Pitch Your IGNITE AI Creator Code to Followers (Scripts That Do Not Cringe)',
    '2026-09-12',
    'On-camera scripts for fitness and food creators promoting an IGNITE AI creator code — soft CTA, annual pricing mention, and product demo tips.',
    [
      'Hard sells fail. Show the log, then the code. Keep annual Premium pricing as the benefit — not “download for free vibes only.”',
      {
        h: 'Script A — gym',
        b: '“Logged today’s session and dinner in IGNITE AI — photo macros, not spreadsheet hell. Code NAME gets you the best annual Premium price.”',
      },
      {
        h: 'Script B — food',
        b: '“Here’s the plate, here’s the Snap Track estimate, here’s the edit on oil. App is IGNITE AI — code NAME for annual Premium.”',
      },
      {
        h: 'Bottom line',
        b: 'Demo first, code second. That order is why Creator Program CTAs convert.',
      },
    ],
  ),
  post(
    'tiktok-instagram-youtube-creator-ignite',
    'TikTok, Instagram, and YouTube: Platform Tips for IGNITE AI Creators',
    '2026-09-13',
    'How to adapt IGNITE AI creator content by platform — short Snap Track demos on TikTok/Reels, longer workouts on YouTube, Stories with Share Cards.',
    [
      'Same code, different packaging. TikTok/Reels: 15-second snap → edit → confirm. Stories: Share Cards. YouTube: full day of eating + training with AI Lab or Diet planner chapters.',
      {
        h: 'Bio hygiene',
        b: 'One clean line: app + code. Do not stack five trackers and a discount zoo.',
      },
      {
        h: 'Bottom line',
        b: 'Meet the algorithm where it lives; keep IGNITE AI as the single product you endorse.',
      },
    ],
  ),
  post(
    'nutrition-influencers-oil-edit-content',
    'Nutrition Influencers: Teach Oil Edits on Camera with IGNITE AI Snap Track',
    '2026-09-14',
    'A content angle for nutrition influencers — filming Snap Track oil and sauce edits to teach accuracy while promoting an IGNITE AI creator code.',
    [
      'Anyone can film a magic first estimate. Trust comes from the edit. Nutrition creators should show adding oil, fixing portions, confirming — that is elite educational content.',
      {
        h: 'Why it sells Premium',
        b: 'Followers learn that photo AI is a workflow. Your code then offers annual Premium so they can run the same workflow.',
      },
      {
        h: 'Bottom line',
        b: 'Teach the edit. Earn the download. IGNITE AI Creator Program for nutrition voices who refuse autopilot lies.',
      },
    ],
  ),
  post(
    'wellness-creators-fasting-share-cards',
    'Wellness and Lifestyle Creators: Fasting + Share Cards in the Creator Program',
    '2026-09-15',
    'How wellness creators use IGNITE AI fasting schedules and Share Cards inside Creator Program storytelling — without turning wellness into calorie shame.',
    [
      'Wellness audiences care about windows, routines, and aesthetics. IGNITE AI fasting cards on Home plus Share Cards give you visual routine content that still sits on real logs.',
      {
        h: 'Stay responsible',
        b: 'Use in-app fasting education/safety framing. Creator content should not encourage disordered extremes — Program Terms expect non-misleading promotion.',
      },
      {
        h: 'Bottom line',
        b: 'Routine creators: pair fasting visuals with honest meals in IGNITE AI, then share your creator code.',
      },
    ],
  ),
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
toAdd.forEach((p) => console.log(`  ${p.date} ${p.slug}`))
