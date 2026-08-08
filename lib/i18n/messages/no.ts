import type { Messages } from './en'
import { faqNo } from './faq-no'

export const no = {
  lang: {
    chooseLanguage: 'Velg språk',
    close: 'Lukk',
  },
  nav: {
    home: 'Hjem',
    press: 'Presse',
    blogs: 'Blogg',
    creatorProgram: 'Creator Program',
    main: 'Hoved',
    homeAria: 'IGNITE AI hjem',
    closeMenu: 'Lukk meny',
    openMenu: 'Åpne meny',
  },
  hero: {
    headline: 'Bygget for å få fremgang til å se enkelt ut.',
    description:
      'IGNITE AI er en AI-app for å fotografere måltider og få kalorier og makroer med en gang, logge trening og dele fremgang med venner. Én app for å fylle på, trene og holde deg konsekvent.',
    tagline: 'Snap. Logg. Knus det.',
    introAria: 'IGNITE AI-intro',
  },
  howItWorks: {
    title: 'Slik fungerer det',
    steps: [
      {
        title: 'Ta bilde, skann eller beskriv',
        description:
          'Fra Quick log fotograferer du et måltid, skanner strekkode eller etikett, skriver det eller bruker stemme. Velg veien som passer.',
      },
      {
        title: 'Få kalorier og makroer',
        description:
          'AI anslår næringen. Bilder og vellykkede skanninger kan logges med en gang. Rediger når som helst.',
      },
      {
        title: 'Tren, følg med, hold deg konsekvent',
        description:
          'Treff daglige kalori- og makromål, logg trening og del måltider eller seiere med Share Cards — til venner i gruppen eller ut på sosiale medier.',
      },
    ],
  },
  features: {
    ariaLabel: 'Funksjoner',
    closingNote: 'Pluss fasting, PDF-rapporter, statistikk og mer i appen.',
    items: [
      {
        id: 'meal',
        eyebrow: 'AI-måltidslogging',
        title: 'Bilde inn. Makroer ut.',
        description:
          'Rett kameraet mot hvilken som helst tallerken, så identifiserer IGNITE AI maten og anslår kalorier og makroer. Ingen strekkodejakt, ingen databasescrolling.',
        bullets: [
          'Ta bilde eller beskriv ethvert måltid',
          'Umiddelbare kalori- og makroanslag',
          'Rediger og bekreft med ett trykk',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: 'Daglige ernæringsmål',
        title: 'Vit nøyaktig hva som er igjen i dag.',
        description:
          'Kaloriringen og gjenværende protein, karbohydrater og fett oppdateres med hver logg. Ett blikk forteller deg hva du skal spise neste.',
        bullets: [
          'Kaloriring på et øyeblikk',
          'Protein, karbohydrater og fett som er igjen',
          'Mål tilpasset ditt target',
        ],
        screenshotLabel: 'Daglige mål',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: 'Steg, puls, søvn: alt synkronisert.',
        description:
          'Koble Apple Health eller Health Connect for å hente dataen klokken og telefonen allerede sporer: steg, aktive kalorier, puls (BPM), søvn og trening. IGNITE legger det inn i dagsbudsjettet ditt, så hvert trekk teller.',
        bullets: [
          'Steg, BPM, søvn og trening synkroniseres automatisk',
          'Aktive kalorier fra Apple Health og Health Connect',
          'Ett sted for aktivitet og ernæring',
        ],
        screenshotLabel: 'Trening',
      },
      {
        id: 'workout',
        eyebrow: 'Treningslogging',
        title: 'Logg hvilken som helst økt. Forbrenning, personlig.',
        description:
          'Velg blant øvelsestypene i IGNITE: styrke, løping, sykling, HIIT, svømming og mer. Kaloriforbrenning anslås ut fra høyde, vekt og profil, så tallet matcher deg — ikke et generisk snitt.',
        bullets: [
          'Flere øvelsestyper klare til logging',
          'Forbrenning beregnet fra høyde, vekt og aktivitetsnivå',
          'Øktkalorier lagt til dagsbudsjettet',
        ],
        screenshotLabel: 'Treningslogg',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: 'Gjør logger om til Story-klare kort.',
        description:
          'Måltids- og trenings-Share Cards viser bildet ditt med kalorier, makroer eller treningsstatistikk. Velg blant 55+ temaer, rediger overskriften selv eller la AI foreslå, og del til Instagram, TikTok og mer.',
        bullets: [
          '55+ temaer for måltider og trening',
          'Kalorier, makroer og øktstatistikk på kortet',
          'Rediger tekst eller bruk AI-forslag',
          'Del til Instagram, TikTok og videre',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: 'Venner og deling',
        title: 'Fremgang treffer annerledes med venner.',
        description:
          'Lag en gruppe med vennene dine, del måltidslogger og trening, og konkurrer om den beste streaken i sirkelen deres.',
        bullets: [
          'Lag grupper med venner',
          'Del måltider, trening og logger',
          'Race om #1-streaken',
        ],
        screenshotLabel: 'Vennefeed',
      },
      {
        id: 'coach',
        eyebrow: 'IGNITE AI-coach',
        title: 'Ernæringssvar, på forespørsel.',
        description:
          'Chat med den innebygde AI-coachen for veiledning om måltider, makroer og hva du bør spise neste.',
        bullets: [
          'Spør hva som helst om ernæring',
          'Personlige forslag',
          'Tilgjengelig 24/7 i appen',
        ],
        screenshotLabel: 'AI-coach-chat',
      },
      {
        id: 'streaks',
        eyebrow: 'Streaks og merker',
        title: 'Konsistens, gamifisert.',
        description:
          'Lås opp achievements mens du logger og trener. Streaks gjør det å møte opp daglig nesten automatisk.',
        bullets: [
          'Daglige logging-streaks',
          'Achievement-merker',
          'Milepæler verdt å dele',
        ],
        screenshotLabel: 'Streaks og merker',
      },
    ],
  },
  themes: {
    title: 'Tre looks. Samme IGNITE.',
    subtitle: 'Bytt mellom Light, Glow og Dark når som helst under Utseende.',
    alt: 'IGNITE AI {name}-tema',
    items: {
      light: {
        name: 'Light',
        description: 'Rent mesh-lerret for daglig logging.',
      },
      dark: {
        name: 'Dark',
        description: 'Kullsvart nattmodus for lite lys.',
      },
      glow: {
        name: 'Glow',
        description: 'Myk solnedgangsvask med varm dybde.',
      },
    },
  },
  socialProof: {
    title: 'Bygget for folk som vil ha resultater, ikke regneark.',
    stats: [
      'ID-nøyaktighet på tydelige tallerkener',
      'Share Card-temaer',
      'helsesignaler synkronisert',
      'øvelsestyper å logge',
    ],
  },
  finalCta: {
    title: 'Begynn å få fremgang til å se enkelt ut.',
    tagline: 'Snap. Logg. Knus det.',
    ratingAria: '5-stjerners vurdering',
  },
  footer: {
    legal: 'Juridisk',
    privacy: 'Personvernerklæring',
    terms: 'Vilkår for bruk',
    company: 'Selskap',
    contact: 'Kontakt',
    faq: 'FAQ',
    creatorProgram: 'Creator Program',
    copyright: '© Copyright {year}, Alle rettigheter forbeholdt',
    disclaimer:
      'IGNITE AI gir kun generell informasjon om velvære og trening. Det er ikke medisinsk råd. Rådfør deg med helsepersonell før du endrer kosthold eller treningsrutine.',
  },
  contact: {
    backHome: '← Hjem',
    title: 'Kontakt oss',
    subtitle: 'Send oss en melding, så tar vi kontakt snart.',
    firstName: 'Fornavn',
    lastName: 'Etternavn',
    email: 'E-post',
    message: 'Melding',
    required: 'påkrevd',
    submit: 'Send →',
    sending: 'Sender…',
    success: 'Takk. Meldingen din er sendt. Vi tar kontakt snart.',
    error: 'Noe gikk galt. Prøv igjen.',
  },
  press: {
    title: 'Presse',
    subtitle:
      'Ta kontakt med presseteamet vårt for mediehenvendelser, intervjuer og pressemeldinger.',
    email: 'E-postadresse',
    subject: 'Emne',
    message: 'Melding',
    emailPlaceholder: 'din.epost@eksempel.com',
    subjectPlaceholder: 'Emne for mediehenvendelse',
    messagePlaceholder:
      'Oppgi detaljer om mediehenvendelsen, inkludert frist, informasjon om mediet og konkrete spørsmål du ønsker svar på...',
    submit: 'Send pressehenvendelse',
    sending: 'Sender…',
    success: 'Takk. Pressehenvendelsen din er sendt. Vi tar kontakt snart.',
    error: 'Noe gikk galt. Prøv igjen.',
  },
  creatorProgram: {
    title: 'Creator Program',
    subtitle:
      'Samarbeid med IGNITE AI. Del din personlige kode for eksklusiv årspris og tjen når publikumet ditt tar Premium.',
    howTitle: 'Slik fungerer det',
    steps: [
      {
        title: 'Søk',
        description: 'Fortell oss om innholdet, plattformene og publikumet ditt.',
      },
      {
        title: 'Vi vurderer',
        description: 'Teamet vårt ser på profilen din og svarer deg.',
      },
      {
        title: 'Få koden din',
        description:
          'Hvis du blir godkjent, får du en personlig creator-kode med den laveste årlige Premium-prisen.',
      },
      {
        title: 'Del og tjen',
        description:
          'Del koden med publikumet ditt. Tjen en belønning for hver følger som abonnerer på årlig Premium.',
      },
    ],
    applyTitle: 'Søk',
    applyHint: 'Fortell litt om innholdet ditt så vi kan vurdere søknaden.',
    fieldName: 'Visningsnavn',
    fieldNamePlaceholder: 'Navnet eller merket ditt',
    fieldEmail: 'Kontakt-e-post',
    fieldEmailPlaceholder: 'deg@email.com',
    fieldPlatforms: 'Plattformer',
    fieldHandle: 'Hoved-handle / lenke',
    fieldHandlePlaceholder: '@dinthandle eller profil-URL',
    fieldAudience: 'Publikumsstørrelse',
    fieldAudiencePlaceholder: 'f.eks. 25k',
    fieldNotes: 'Noe mer?',
    fieldNotesPlaceholder: 'Nisje, collab-ideer, osv.',
    submit: 'Send søknad',
    sending: 'Sender…',
    success: 'Takk. Søknaden din er sendt. Vi vurderer den og svarer snart.',
    error: 'Noe gikk galt. Prøv igjen.',
    errorPlatforms: 'Velg minst én plattform.',
    appNote: 'Du kan også søke via Profil → Creator program i IGNITE AI-appen.',
    platform: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      other: 'Annet',
    },
  },
  blog: {
    title: 'Bloggen vår',
    subtitle: 'følg for oppdateringer',
    back: '← Blogg',
    asideTagline: 'Snap. Logg. Knus det.',
    asideBody: 'Last ned IGNITE AI: makroer, trening og fremgang verdt å dele.',
  },
  legal: {
    backHome: '← Hjem',
    related: 'Relatert:',
    privacy: 'Personvernerklæring',
    terms: 'Vilkår for bruk',
  },
  faq: faqNo,
  comingSoon: {
    title: "Kommer snart",
    subtitle:
      "Vi legger siste hånd på IGNITE AI. Kun privat forhåndstilgang foreløpig.",
    tagline: "Snap. Logg. Crush.",
    wrongPassword: 'Feil passord. Prøv igjen.',
    genericError: 'Noe gikk galt. Prøv igjen.',
    password: 'Passord',
    enter: 'Enter',
  },
} as const satisfies Messages
