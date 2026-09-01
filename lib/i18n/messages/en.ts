import { faqEn } from './faq-content'

export const en = {
  lang: {
    chooseLanguage: 'Choose Language',
    close: 'Close',
  },
  nav: {
    home: 'Home',
    press: 'Press',
    blogs: 'Blogs',
    creatorProgram: 'Creator Program',
    main: 'Main',
    homeAria: 'IGNITE AI home',
    closeMenu: 'Close menu',
    openMenu: 'Open menu',
  },
  hero: {
    headline: 'Built to make progress look easy.',
    description:
      'IGNITE AI is an AI-powered app built to snap meals for instant calories and macros, log workouts, and share progress with friends. One app to fuel, train, and stay consistent.',
    tagline: 'Snap it. Log it. Crush it.',
    introAria: 'IGNITE AI intro',
  },
  howItWorks: {
    title: 'How it works',
    steps: [
      {
        title: 'Snap, scan, or describe',
        description:
          'From Quick log, photograph a meal, scan a barcode or label, type it, or use voice. Pick the path that fits.',
      },
      {
        title: 'Get calories & macros',
        description:
          'AI estimates nutrition. Snaps and successful scans can log right away. Edit anytime.',
      },
      {
        title: 'Train, track, stay consistent',
        description:
          'Hit daily calorie and macro targets, log workouts, and share meals or wins with Share Cards, to friends in your group or out to social.',
      },
    ],
  },
  features: {
    ariaLabel: 'Features',
    closingNote: 'Plus fasting, PDF reports, stats, and more in the app.',
    items: [
      {
        id: 'meal',
        eyebrow: 'AI meal logging',
        title: 'Photo in. Macros out.',
        description:
          'Point your camera at any plate and IGNITE AI identifies the food and estimates calories and macros. No barcode hunting, no database scrolling.',
        bullets: [
          'Snap or describe any meal',
          'Instant calorie & macro estimates',
          'Edit and confirm in one tap',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: 'Daily nutrition goals',
        title: 'Know exactly what is left today.',
        description:
          'Your calorie ring and remaining protein, carbs, and fats update with every log. One glance tells you what to eat next.',
        bullets: [
          'Calorie ring at a glance',
          'Protein, carbs & fats remaining',
          'Goals tuned to your target',
        ],
        screenshotLabel: 'Daily Goals',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: 'Steps, heart rate, sleep: all in sync.',
        description:
          'Connect Apple Health or Health Connect to pull in the data your watch and phone already track: steps, active calories, heart rate (BPM), sleep, and workouts. IGNITE folds it into your daily budget so every move counts.',
        bullets: [
          'Steps, BPM, sleep & exercise synced automatically',
          'Active calories from Apple Health & Health Connect',
          'One place for activity and nutrition',
        ],
        screenshotLabel: 'Workouts',
      },
      {
        id: 'workout',
        eyebrow: 'Workout logging',
        title: 'Log any session. Burn, personalized.',
        description:
          'Choose from the exercise types built into IGNITE: strength, running, cycling, HIIT, swim, and more. Calorie burn is estimated from your height, weight, and profile, so the number matches you, not a generic average.',
        bullets: [
          'Multiple exercise types ready to log',
          'Burn calculated from height, weight & activity level',
          'Session calories added to your daily budget',
        ],
        screenshotLabel: 'Workout Log',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: 'Turn logs into Story-ready cards.',
        description:
          'Meal and workout Share Cards show your photo with calories, macros, or training stats. Pick from 55+ themes, edit the headline yourself or let AI suggest one, then share to Instagram, TikTok, and more.',
        bullets: [
          '55+ themes for meals and workouts',
          'Calories, macros, and session stats on card',
          'Edit text or use AI suggestions',
          'Share to Instagram, TikTok, and beyond',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: 'Friends & sharing',
        title: 'Progress hits different with friends.',
        description:
          'Create a group with your friends, share meal logs and workouts, and compete for the top streak in your circle.',
        bullets: [
          'Create groups with friends',
          'Share meals, workouts & logs',
          'Race for the #1 streak',
        ],
        screenshotLabel: 'Friends Feed',
      },
      {
        id: 'coach',
        eyebrow: 'IGNITE AI coach',
        title: 'Nutrition answers, on demand.',
        description:
          'Chat with the built-in AI coach for guidance on meals, macros, and what to eat next.',
        bullets: [
          'Ask anything about nutrition',
          'Personalized suggestions',
          'Available 24/7 in the app',
        ],
        screenshotLabel: 'AI Coach Chat',
      },
      {
        id: 'streaks',
        eyebrow: 'Streaks & badges',
        title: 'Consistency, gamified.',
        description:
          'Unlock achievements as you log and train. Streaks make showing up daily feel automatic.',
        bullets: [
          'Daily logging streaks',
          'Achievement badges',
          'Milestones worth sharing',
        ],
        screenshotLabel: 'Streaks & Badges',
      },
    ],
  },
  themes: {
    title: 'Three looks. Same IGNITE.',
    subtitle: 'Switch between Light, Glow, and Dark anytime in Appearance.',
    alt: 'IGNITE AI {name} theme',
    items: {
      light: {
        name: 'Light',
        description: 'Clean mesh canvas for everyday logging.',
      },
      dark: {
        name: 'Dark',
        description: 'Charcoal night mode for low light.',
      },
      glow: {
        name: 'Glow',
        description: 'Soft sunset wash with warm depth.',
      },
    },
  },
  socialProof: {
    title: 'Built for people who want results, not spreadsheets.',
    stats: [
      'ID accuracy on clear plates',
      'Share Card themes',
      'health signals synced',
      'exercise types to log',
    ],
  },
  finalCta: {
    title: 'Start making progress look easy.',
    tagline: 'Snap it. Log it. Crush it.',
    ratingAria: '5 star rating',
  },
  footer: {
    legal: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms of use',
    referralTerms: 'Referral Program Terms',
    creatorProgramTerms: 'Creator Program Terms',
    company: 'Company',
    contact: 'Contact',
    faq: 'FAQ',
    creatorProgram: 'Creator Program',
    copyright: '© Copyright {year}, All rights reserved',
    disclaimer:
      'IGNITE AI provides general wellness and fitness information only. It is not medical advice. Consult a healthcare professional before making changes to your diet or exercise routine.',
  },
  contact: {
    backHome: '← Home',
    title: 'Contact Us',
    subtitle: 'Send us a message and we will get back to you soon.',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    message: 'Message',
    required: 'required',
    submit: 'Submit →',
    sending: 'Sending…',
    success: 'Thanks. Your message was sent. We will get back to you soon.',
    error: 'Something went wrong. Please try again.',
  },
  press: {
    title: 'Press',
    subtitle:
      'Get in touch with our press team for media inquiries, interviews, and press releases.',
    email: 'Email Address',
    subject: 'Subject',
    message: 'Message',
    emailPlaceholder: 'your.email@example.com',
    subjectPlaceholder: 'Media inquiry subject',
    messagePlaceholder:
      "Please provide details about your media inquiry, including deadline, outlet information, and specific questions you'd like answered...",
    submit: 'Send Press Inquiry',
    sending: 'Sending…',
    success: 'Thanks. Your press inquiry was sent. We will get back to you soon.',
    error: 'Something went wrong. Please try again.',
  },
  creatorProgram: {
    title: 'Creator Program',
    subtitle:
      "Partner with IGNITE AI. Share your personalized code for exclusive annual pricing and earn money when your audience goes Premium.",
    heroAlt: 'Creators connected around the IGNITE AI flame',
    howTitle: 'How it works',
    steps: [
      {
        title: 'Download the app',
        description: 'Get IGNITE AI on the App Store or Google Play and create your account.',
      },
      {
        title: 'Apply in the app',
        description: 'Open Profile → Creator program → Apply with your social profiles and audience details.',
      },
      {
        title: 'We review',
        description: 'Our team looks at your profile and gets back to you when a decision is ready.',
      },
      {
        title: 'Share and earn',
        description:
          "If approved, you get a personalized creator code for the lowest annual Premium price. Earn money for each annual Premium signup with your code. For more info, download the app.",
      },
    ],
    ctaTitle: 'Apply in the app',
    ctaSubtitle:
      "Applications happen inside IGNITE AI so your Creator account, code, and complimentary Premium stay linked to you. Download the app for full reward details.",
    ctaSteps: [
      'Download IGNITE AI',
      'Open Profile → Creator program',
      'Tap Apply',
    ],
    termsLink: 'Creator Program Terms',
  },
  blog: {
    title: 'Our Blog',
    subtitle: 'follow for updates',
    back: '← Blog',
    asideTagline: 'Snap it. Log it. Crush it.',
    asideBody: 'Download IGNITE AI: macros, workouts, and progress worth sharing.',
    previous: 'Previous',
    next: 'Next',
    paginationLabel: 'Blog pages',
  },
  legal: {
    backHome: '← Home',
    related: 'Related:',
    privacy: 'Privacy Policy',
    terms: 'Terms of use',
    referralTerms: 'Referral Program Terms',
    creatorProgramTerms: 'Creator Program Terms',
  },
  faq: faqEn,
  store: {
    appStoreSoonTitle: 'Coming soon on the App Store',
    appStoreSoonBody:
      'IGNITE AI for iOS will be available on the App Store soon. You can download the Android app on Google Play today.',
    gotIt: 'Got it',
  },
  comingSoon: {
    title: 'Coming soon',
    subtitle:
      "We're putting the finishing touches on IGNITE AI. Private preview access only for now.",
    tagline: 'Snap it. Log it. Crush it.',
    wrongPassword: 'Wrong password. Try again.',
    genericError: 'Something went wrong. Try again.',
    password: 'Password',
    enter: 'Enter',
  },
} as const

/** Structural message shape (string leaves) so locale files can satisfy Messages. */
type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? { [K in keyof T]: DeepStringify<T[K]> }
    : T extends object
      ? { [K in keyof T]: DeepStringify<T[K]> }
      : T

export type Messages = DeepStringify<typeof en>
