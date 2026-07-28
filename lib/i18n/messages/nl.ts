import type { Messages } from './en'

export const nl = {
  lang: {
    chooseLanguage: 'Taal kiezen',
    close: 'Sluiten',
  },
  nav: {
    home: 'Home',
    press: 'Pers',
    blogs: 'Blog',
    main: 'Hoofd',
    homeAria: 'IGNITE AI home',
    closeMenu: 'Menu sluiten',
    openMenu: 'Menu openen',
  },
  hero: {
    headline: 'Gebouwd om vooruitgang er makkelijk uit te laten zien.',
    description:
      'IGNITE AI is een AI-app om maaltijden te fotograferen voor directe calorieën en macro’s, workouts te loggen en voortgang met vrienden te delen. Eén app om te voeden, te trainen en consistent te blijven.',
    tagline: 'Snap. Log. Crush.',
    introAria: 'IGNITE AI intro',
  },
  howItWorks: {
    title: 'Zo werkt het',
    steps: [
      {
        title: 'Fotografeer, scan of beschrijf',
        description:
          'Via Quick log fotografeer je een maaltijd, scan je een barcode of etiket, typ je het in of gebruik je je stem. Kies het pad dat past.',
      },
      {
        title: 'Krijg calorieën & macro’s',
        description:
          'AI schat de voeding. Foto’s en geslaagde scans kunnen meteen loggen. Bewerk wanneer je wilt.',
      },
      {
        title: 'Train, volg, blijf consistent',
        description:
          'Haal dagelijkse calorie- en macrodoelen, log workouts en deel maaltijden of wins met Share Cards — met vrienden in je groep of op social.',
      },
    ],
  },
  features: {
    ariaLabel: 'Functies',
    closingNote: 'Plus vasten, PDF-rapporten, stats en meer in de app.',
    items: [
      {
        id: 'meal',
        eyebrow: 'AI-maaltijdlogging',
        title: 'Foto in. Macro’s uit.',
        description:
          'Richt je camera op elk bord en IGNITE AI herkent het eten en schat calorieën en macro’s. Geen barcodes zoeken, geen databases scrollen.',
        bullets: [
          'Fotografeer of beschrijf elke maaltijd',
          'Directe calorie- & macroschattingen',
          'Bewerk en bevestig met één tik',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: 'Dagelijkse voedingsdoelen',
        title: 'Weet precies wat er vandaag nog over is.',
        description:
          'Je caloriering en resterende eiwitten, koolhydraten en vetten updaten bij elke log. Eén blik vertelt wat je hierna eet.',
        bullets: [
          'Caloriering in één oogopslag',
          'Resterende eiwitten, koolhydraten & vetten',
          'Doelen afgestemd op jouw target',
        ],
        screenshotLabel: 'Dagelijkse doelen',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: 'Stappen, hartslag, slaap: alles in sync.',
        description:
          'Koppel Apple Health of Health Connect om data op te halen die je horloge en telefoon al tracken: stappen, actieve calorieën, hartslag (BPM), slaap en workouts. IGNITE verwerkt het in je dagbudget zodat elke beweging telt.',
        bullets: [
          'Stappen, BPM, slaap & beweging automatisch gesynchroniseerd',
          'Actieve calorieën van Apple Health & Health Connect',
          'Eén plek voor activiteit en voeding',
        ],
        screenshotLabel: 'Workouts',
      },
      {
        id: 'workout',
        eyebrow: 'Workout-logging',
        title: 'Log elke sessie. Verbruik, gepersonaliseerd.',
        description:
          'Kies uit de oefeningstypen in IGNITE: kracht, hardlopen, fietsen, HIIT, zwemmen en meer. Calorieverbruik wordt geschat op basis van lengte, gewicht en profiel, zodat het cijfer bij jou past — niet bij een gemiddelde.',
        bullets: [
          'Meerdere oefeningstypen klaar om te loggen',
          'Verbruik berekend uit lengte, gewicht & activiteitsniveau',
          'Sessiecalorieën toegevoegd aan je dagbudget',
        ],
        screenshotLabel: 'Workout-log',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: 'Maak van logs Story-klare kaarten.',
        description:
          'Meal- en workout-Share Cards tonen je foto met calorieën, macro’s of trainingsstats. Kies uit 55+ themes, bewerk de headline zelf of laat AI er een voorstellen, en deel naar Instagram, TikTok en meer.',
        bullets: [
          '55+ themes voor maaltijden en workouts',
          'Calorieën, macro’s en sessiestats op de card',
          'Bewerk tekst of gebruik AI-suggesties',
          'Deel naar Instagram, TikTok en verder',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: 'Vrienden & delen',
        title: 'Vooruitgang voelt anders met vrienden.',
        description:
          'Maak een groep met je vrienden, deel maaltijdlogs en workouts, en strijd om de beste streak in jullie kring.',
        bullets: [
          'Maak groepen met vrienden',
          'Deel maaltijden, workouts & logs',
          'Race om de #1-streak',
        ],
        screenshotLabel: 'Vriendenfeed',
      },
      {
        id: 'coach',
        eyebrow: 'IGNITE AI-coach',
        title: 'Voedingsantwoorden, on demand.',
        description:
          'Chat met de ingebouwde AI-coach voor advies over maaltijden, macro’s en wat je hierna eet.',
        bullets: [
          'Vraag alles over voeding',
          'Persoonlijke suggesties',
          '24/7 beschikbaar in de app',
        ],
        screenshotLabel: 'AI-coachchat',
      },
      {
        id: 'streaks',
        eyebrow: 'Streaks & badges',
        title: 'Consistentie, gamified.',
        description:
          'Ontgrendel achievements terwijl je logt en traint. Streaks maken dagelijks verschijnen bijna automatisch.',
        bullets: [
          'Dagelijkse logging-streaks',
          'Achievement-badges',
          'Mijlpalen om te delen',
        ],
        screenshotLabel: 'Streaks & badges',
      },
    ],
  },
  themes: {
    title: 'Drie looks. Dezelfde IGNITE.',
    subtitle: 'Wissel wanneer je wilt tussen Light, Glow en Dark in Weergave.',
    alt: 'IGNITE AI {name}-thema',
    items: {
      light: {
        name: 'Light',
        description: 'Strak mesh-canvas voor dagelijks loggen.',
      },
      dark: {
        name: 'Dark',
        description: 'Houtskool-nachtmodus voor weinig licht.',
      },
      glow: {
        name: 'Glow',
        description: 'Zachte zonsondergang met warme diepte.',
      },
    },
  },
  socialProof: {
    title: 'Voor mensen die resultaten willen, geen spreadsheets.',
    stats: [
      'ID-nauwkeurigheid bij duidelijke borden',
      'Share Card-themes',
      'gezondheidssignalen gesynchroniseerd',
      'oefeningstypen om te loggen',
    ],
  },
  finalCta: {
    title: 'Begin vooruitgang er makkelijk uit te laten zien.',
    tagline: 'Snap. Log. Crush.',
    ratingAria: '5-sterrenbeoordeling',
  },
  footer: {
    legal: 'Juridisch',
    privacy: 'Privacybeleid',
    terms: 'Gebruiksvoorwaarden',
    company: 'Bedrijf',
    contact: 'Contact',
    copyright: '© Copyright {year}, Alle rechten voorbehouden',
    disclaimer:
      'IGNITE AI biedt alleen algemene wellness- en fitnessinformatie. Het is geen medisch advies. Raadpleeg een zorgprofessional voordat je je dieet of trainingsroutine wijzigt.',
  },
  contact: {
    backHome: '← Home',
    title: 'Neem contact op',
    subtitle: 'Stuur ons een bericht en we nemen snel contact op.',
    firstName: 'Voornaam',
    lastName: 'Achternaam',
    email: 'E-mail',
    message: 'Bericht',
    required: 'verplicht',
    submit: 'Versturen →',
    sending: 'Versturen…',
    success: 'Bedankt. Je bericht is verzonden. We nemen snel contact op.',
    error: 'Er ging iets mis. Probeer het opnieuw.',
  },
  press: {
    title: 'Pers',
    subtitle:
      'Neem contact op met ons persteam voor mediavragen, interviews en persberichten.',
    email: 'E-mailadres',
    subject: 'Onderwerp',
    message: 'Bericht',
    emailPlaceholder: 'jouw.email@voorbeeld.com',
    subjectPlaceholder: 'Onderwerp mediavraag',
    messagePlaceholder:
      'Geef details over je mediavraag, inclusief deadline, mediuminformatie en specifieke vragen waarop je antwoord wilt...',
    submit: 'Persvraag versturen',
    sending: 'Versturen…',
    success: 'Bedankt. Je persvraag is verstuurd. We nemen snel contact op.',
    error: 'Er ging iets mis. Probeer het opnieuw.',
  },
  blog: {
    title: 'Onze blog',
    subtitle: 'volg voor updates',
    back: '← Blog',
    asideTagline: 'Snap. Log. Crush.',
    asideBody: 'Download IGNITE AI: macro’s, workouts en voortgang die de moeite waard is om te delen.',
  },
  legal: {
    backHome: '← Home',
    related: 'Gerelateerd:',
    privacy: 'Privacybeleid',
    terms: 'Gebruiksvoorwaarden',
  },
  comingSoon: {
    title: "Binnenkort",
    subtitle:
      "We geven IGNITE AI de laatste finishing touch. Voorlopig alleen private toegang.",
    tagline: "Snap. Log. Crush.",
    wrongPassword: 'Verkeerd wachtwoord. Probeer opnieuw.',
    genericError: 'Er ging iets mis. Probeer opnieuw.',
    password: 'Wachtwoord',
    enter: 'Enter',
  },
} as const satisfies Messages
