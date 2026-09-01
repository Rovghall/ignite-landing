import type { Messages } from './en'
import { faqDe } from './faq-de'

export const de = {
  lang: {
    chooseLanguage: 'Sprache wählen',
    close: 'Schließen',
  },
  nav: {
    home: 'Start',
    press: 'Presse',
    blogs: 'Blog',
    creatorProgram: 'Creator Program',
    main: 'Hauptseite',
    homeAria: 'IGNITE AI Startseite',
    closeMenu: 'Menü schließen',
    openMenu: 'Menü öffnen',
  },
  hero: {
    headline: 'Gebaut, damit Fortschritt leicht aussieht.',
    description:
      'IGNITE AI ist eine KI-App zum Fotografieren von Mahlzeiten für sofortige Kalorien und Makros, zum Loggen von Workouts und zum Teilen von Fortschritt mit Freunden. Eine App zum Ernähren, Trainieren und Dranbleiben.',
    tagline: 'Schnappen. Loggen. Durchziehen.',
    introAria: 'IGNITE AI Einführung',
  },
  howItWorks: {
    title: 'So funktioniert’s',
    steps: [
      {
        title: 'Fotografieren, scannen oder beschreiben',
        description:
          'Über Quick log fotografierst du eine Mahlzeit, scannst Barcode oder Etikett, tippst sie ein oder nutzt Sprache. Wähle den Weg, der passt.',
      },
      {
        title: 'Kalorien & Makros erhalten',
        description:
          'KI schätzt die Nährwerte. Fotos und erfolgreiche Scans können sofort geloggt werden. Jederzeit bearbeiten.',
      },
      {
        title: 'Trainieren, tracken, dranbleiben',
        description:
          'Triff tägliche Kalorien- und Makroziele, logge Workouts und teile Mahlzeiten oder Erfolge mit Share Cards — mit Freunden in deiner Gruppe oder in sozialen Netzen.',
      },
    ],
  },
  features: {
    ariaLabel: 'Funktionen',
    closingNote: 'Plus Fasten, PDF-Berichte, Stats und mehr in der App.',
    items: [
      {
        id: 'meal',
        eyebrow: 'KI-Mahlzeiten-Logging',
        title: 'Foto rein. Makros raus.',
        description:
          'Richte die Kamera auf jeden Teller — IGNITE AI erkennt das Essen und schätzt Kalorien und Makros. Kein Barcode-Jagen, kein Datenbank-Scrollen.',
        bullets: [
          'Fotografiere oder beschreibe jede Mahlzeit',
          'Sofortige Kalorien- & Makro-Schätzungen',
          'Mit einem Tippen bearbeiten und bestätigen',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: 'Tägliche Ernährungsziele',
        title: 'Weißt genau, was heute noch fehlt.',
        description:
          'Dein Kalorienring und die restlichen Proteine, Kohlenhydrate und Fette aktualisieren sich mit jedem Log. Ein Blick zeigt, was als Nächstes dran ist.',
        bullets: [
          'Kalorienring auf einen Blick',
          'Restliche Proteine, Kohlenhydrate & Fette',
          'Ziele abgestimmt auf dein Target',
        ],
        screenshotLabel: 'Tagesziele',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: 'Schritte, Puls, Schlaf: alles im Sync.',
        description:
          'Verbinde Apple Health oder Health Connect, um die Daten zu holen, die Uhr und Handy schon tracken: Schritte, aktive Kalorien, Herzfrequenz (BPM), Schlaf und Workouts. IGNITE rechnet sie in dein Tagesbudget ein — jede Bewegung zählt.',
        bullets: [
          'Schritte, BPM, Schlaf & Training automatisch synchronisiert',
          'Aktive Kalorien von Apple Health & Health Connect',
          'Ein Ort für Aktivität und Ernährung',
        ],
        screenshotLabel: 'Workouts',
      },
      {
        id: 'workout',
        eyebrow: 'Workout-Logging',
        title: 'Jede Session loggen. Verbrauch, personalisiert.',
        description:
          'Wähle aus den Übungstypen in IGNITE: Kraft, Laufen, Radfahren, HIIT, Schwimmen und mehr. Der Kalorienverbrauch wird aus Größe, Gewicht und Profil geschätzt — die Zahl passt zu dir, nicht zu einem Durchschnitt.',
        bullets: [
          'Mehrere Übungstypen bereit zum Loggen',
          'Verbrauch aus Größe, Gewicht & Aktivitätslevel',
          'Session-Kalorien fließen ins Tagesbudget',
        ],
        screenshotLabel: 'Workout-Log',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: 'Logs zu Story-fertigen Cards machen.',
        description:
          'Meal- und Workout-Share Cards zeigen dein Foto mit Kalorien, Makros oder Trainingsstats. Wähle aus über 55 Themes, editiere die Headline selbst oder lass die KI vorschlagen — dann teilen auf Instagram, TikTok und mehr.',
        bullets: [
          'Über 55 Themes für Mahlzeiten und Workouts',
          'Kalorien, Makros und Session-Stats auf der Card',
          'Text bearbeiten oder KI-Vorschläge nutzen',
          'Teilen auf Instagram, TikTok und darüber hinaus',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: 'Freunde & Teilen',
        title: 'Fortschritt trifft anders mit Freunden.',
        description:
          'Erstelle eine Gruppe mit Freunden, teile Meal-Logs und Workouts und kämpft um die beste Streak in eurem Kreis.',
        bullets: [
          'Gruppen mit Freunden erstellen',
          'Mahlzeiten, Workouts & Logs teilen',
          'Um die #1-Streak rennen',
        ],
        screenshotLabel: 'Freundes-Feed',
      },
      {
        id: 'coach',
        eyebrow: 'IGNITE AI Coach',
        title: 'Ernährungsantworten, auf Abruf.',
        description:
          'Chatte mit dem integrierten KI-Coach für Tipps zu Mahlzeiten, Makros und was als Nächstes ansteht.',
        bullets: [
          'Alles zur Ernährung fragen',
          'Personalisierte Vorschläge',
          'Rund um die Uhr in der App',
        ],
        screenshotLabel: 'AI-Coach-Chat',
      },
      {
        id: 'streaks',
        eyebrow: 'Streaks & Badges',
        title: 'Konstanz, gamifiziert.',
        description:
          'Schalte Erfolge frei, während du loggst und trainierst. Streaks machen tägliches Erscheinen fast automatisch.',
        bullets: [
          'Tägliche Logging-Streaks',
          'Achievement-Badges',
          'Meilensteine zum Teilen',
        ],
        screenshotLabel: 'Streaks & Badges',
      },
    ],
  },
  themes: {
    title: 'Drei Looks. Dasselbe IGNITE.',
    subtitle: 'Wechsle jederzeit zwischen Light, Glow und Dark unter Erscheinungsbild.',
    alt: 'IGNITE AI {name}-Theme',
    items: {
      light: {
        name: 'Light',
        description: 'Klare Mesh-Fläche fürs tägliche Logging.',
      },
      dark: {
        name: 'Dark',
        description: 'Anthrazit-Nachtmodus bei wenig Licht.',
      },
      glow: {
        name: 'Glow',
        description: 'Weicher Sonnenuntergang mit warmer Tiefe.',
      },
    },
  },
  socialProof: {
    title: 'Für Leute, die Ergebnisse wollen — keine Tabellen.',
    stats: [
      'ID-Genauigkeit bei klaren Tellern',
      'Share-Card-Themes',
      'gesundheitliche Signale synchronisiert',
      'Übungstypen zum Loggen',
    ],
  },
  finalCta: {
    title: 'Mach Fortschritt zum leichten Bild.',
    tagline: 'Schnappen. Loggen. Durchziehen.',
    ratingAria: '5-Sterne-Bewertung',
  },
  footer: {
    legal: 'Rechtliches',
    privacy: 'Datenschutzrichtlinie',
    terms: 'Nutzungsbedingungen',
    referralTerms: "Bedingungen des Empfehlungsprogramms",
    creatorProgramTerms: "Creator-Program-Bedingungen",
    company: 'Unternehmen',
    contact: 'Kontakt',
    faq: 'FAQ',
    creatorProgram: 'Creator Program',
    copyright: '© Copyright {year}, Alle Rechte vorbehalten',
    disclaimer:
      'IGNITE AI stellt nur allgemeine Wellness- und Fitnessinformationen bereit. Das ist keine medizinische Beratung. Konsultiere eine Fachkraft, bevor du Ernährung oder Trainingsroutine änderst.',
  },
  contact: {
    backHome: '← Start',
    title: 'Kontakt',
    subtitle: 'Schreib uns eine Nachricht und wir melden uns bald.',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    message: 'Nachricht',
    required: 'erforderlich',
    submit: 'Senden →',
    sending: 'Wird gesendet…',
    success: 'Danke. Deine Nachricht wurde gesendet. Wir melden uns bald.',
    error: 'Etwas ist schiefgelaufen. Bitte erneut versuchen.',
  },
  press: {
    title: 'Presse',
    subtitle:
      'Kontaktiere unser Presse-Team für Medienanfragen, Interviews und Pressemitteilungen.',
    email: 'E-Mail-Adresse',
    subject: 'Betreff',
    message: 'Nachricht',
    emailPlaceholder: 'deine.email@beispiel.com',
    subjectPlaceholder: 'Betreff der Medienanfrage',
    messagePlaceholder:
      'Bitte gib Details zu deiner Medienanfrage an — inkl. Deadline, Medium und konkreter Fragen, die beantwortet werden sollen...',
    submit: 'Presseanfrage senden',
    sending: 'Wird gesendet…',
    success: 'Danke. Deine Presseanfrage wurde gesendet. Wir melden uns bald.',
    error: 'Etwas ist schiefgelaufen. Bitte erneut versuchen.',
  },
  creatorProgram: {
    title: 'Creator Program',
    subtitle:
      "Werde Partner von IGNITE AI. Teile deinen persönlichen Code für den exklusiven Jahrespreis und verdiene Geld, wenn dein Publikum Premium wird.",
    heroAlt: 'Creator rund um die IGNITE AI Flamme',
    howTitle: 'So funktioniert’s',
    steps: [
      {
        title: 'App herunterladen',
        description: 'Installiere IGNITE AI im App Store oder bei Google Play und erstelle dein Konto.',
      },
      {
        title: 'In der App bewerben',
        description: 'Öffne Profil → Creator program → Apply mit deinen Social-Profilen und Audience-Details.',
      },
      {
        title: 'Wir prüfen',
        description: 'Unser Team prüft dein Profil und meldet sich, sobald eine Entscheidung bereit ist.',
      },
      {
        title: 'Teilen und verdienen',
        description:
          "Bei Freigabe erhältst du einen persönlichen Creator-Code zum günstigsten Premium-Jahrespreis. Verdiene Geld für jedes jährliche Premium-Abo mit deinem Code. Mehr Infos in der App.",
      },
    ],
    ctaTitle: 'In der App bewerben',
    ctaSubtitle:
      "Bewerbungen laufen in IGNITE AI, damit Creator-Konto, Code und Complimentary Premium mit dir verknüpft bleiben. Lade die App herunter für alle Belohnungsdetails.",
    ctaSteps: [
      'IGNITE AI herunterladen',
      'Profil → Creator program öffnen',
      'Auf Apply tippen',
    ],
    termsLink: "Creator-Program-Bedingungen",
  },
  blog: {
    title: 'Unser Blog',
    subtitle: 'folge für Updates',
    back: '← Blog',
    asideTagline: 'Schnappen. Loggen. Durchziehen.',
    asideBody: 'Lade IGNITE AI: Makros, Workouts und Fortschritt zum Teilen.',
    previous: 'Zurück',
    next: 'Weiter',
    paginationLabel: 'Blog-Seiten',
  },
  legal: {
    backHome: '← Start',
    related: 'Verwandt:',
    privacy: 'Datenschutzrichtlinie',
    terms: 'Nutzungsbedingungen',
    referralTerms: "Bedingungen des Empfehlungsprogramms",
    creatorProgramTerms: "Creator-Program-Bedingungen",
  },
  faq: faqDe,
  store: {
    appStoreSoonTitle: "Bald im App Store",
    appStoreSoonBody:
      "IGNITE AI für iOS wird bald im App Store verfügbar sein. Die Android-App kannst du schon jetzt bei Google Play herunterladen.",
    gotIt: "Verstanden",
  },
  comingSoon: {
    title: "Demnächst",
    subtitle:
      "Wir geben IGNITE AI den letzten Schliff. Vorerst nur privater Zugang.",
    tagline: "Knipsen. Loggen. Crushen.",
    wrongPassword: 'Falsches Passwort. Erneut versuchen.',
    genericError: 'Etwas ist schiefgelaufen. Erneut versuchen.',
    password: 'Passwort',
    enter: 'Enter',
  },
} as const satisfies Messages
