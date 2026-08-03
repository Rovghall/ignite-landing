import type { Messages } from './en'
import { faqSv } from './faq-sv'

export const sv = {
  lang: {
    chooseLanguage: 'Välj språk',
    close: 'Stäng',
  },
  nav: {
    home: 'Hem',
    press: 'Press',
    blogs: 'Blogg',
    main: 'Huvud',
    homeAria: 'IGNITE AI hem',
    closeMenu: 'Stäng meny',
    openMenu: 'Öppna meny',
  },
  hero: {
    headline: 'Byggd för att få framsteg att se enkla ut.',
    description:
      'IGNITE AI är en AI-app för att fotografera måltider och få kalorier och makro direkt, logga träning och dela framsteg med vänner. En app för att tanka, träna och hålla dig konsekvent.',
    tagline: 'Snap. Logga. Kör.',
    introAria: 'IGNITE AI-intro',
  },
  howItWorks: {
    title: 'Så fungerar det',
    steps: [
      {
        title: 'Fotografera, skanna eller beskriv',
        description:
          'Från Quick log fotograferar du en måltid, skannar streckkod eller etikett, skriver in den eller använder röst. Välj vägen som passar.',
      },
      {
        title: 'Få kalorier och makro',
        description:
          'AI uppskattar näringen. Bilder och lyckade skanningar kan loggas direkt. Redigera när som helst.',
      },
      {
        title: 'Träna, följ, håll dig konsekvent',
        description:
          'Nå dagliga kalori- och makromål, logga träning och dela måltider eller vinster med Share Cards — till vänner i din grupp eller ut på sociala medier.',
      },
    ],
  },
  features: {
    ariaLabel: 'Funktioner',
    closingNote: 'Plus fasta, PDF-rapporter, statistik och mer i appen.',
    items: [
      {
        id: 'meal',
        eyebrow: 'AI-måltidslogning',
        title: 'Foto in. Makro ut.',
        description:
          'Rikta kameran mot vilken tallrik som helst så identifierar IGNITE AI maten och uppskattar kalorier och makro. Ingen streckkodsjakt, ingen databasscrollning.',
        bullets: [
          'Fotografera eller beskriv vilken måltid som helst',
          'Omedelbara kalori- och makroestimat',
          'Redigera och bekräfta med ett tryck',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: 'Dagliga nutritionsmål',
        title: 'Vet exakt vad som är kvar idag.',
        description:
          'Din kaloriring och kvarvarande protein, kolhydrater och fett uppdateras med varje logg. En blick visar vad du ska äta härnäst.',
        bullets: [
          'Kaloriring i ett ögonkast',
          'Protein, kolhydrater och fett kvar',
          'Mål anpassade efter ditt target',
        ],
        screenshotLabel: 'Dagliga mål',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: 'Steg, puls, sömn: allt synkat.',
        description:
          'Koppla Apple Health eller Health Connect för att hämta data som klockan och telefonen redan spårar: steg, aktiva kalorier, puls (BPM), sömn och träning. IGNITE lägger in det i din dagsbudget så att varje rörelse räknas.',
        bullets: [
          'Steg, BPM, sömn och träning synkas automatiskt',
          'Aktiva kalorier från Apple Health och Health Connect',
          'En plats för aktivitet och nutrition',
        ],
        screenshotLabel: 'Träning',
      },
      {
        id: 'workout',
        eyebrow: 'Träningsloggning',
        title: 'Logga vilken session som helst. Förbränning, personlig.',
        description:
          'Välj bland övningstyperna i IGNITE: styrka, löpning, cykling, HIIT, simning och mer. Kaloriförbränning uppskattas från längd, vikt och profil, så siffran matchar dig — inte ett generiskt snitt.',
        bullets: [
          'Flera övningstyper redo att loggas',
          'Förbränning beräknad från längd, vikt och aktivitetsnivå',
          'Sessionskalorier tillagda i dagsbudgeten',
        ],
        screenshotLabel: 'Träningslogg',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: 'Gör loggar till Story-klara kort.',
        description:
          'Måltids- och tränings-Share Cards visar ditt foto med kalorier, makro eller träningsstatistik. Välj bland 55+ teman, redigera rubriken själv eller låt AI föreslå, och dela till Instagram, TikTok och mer.',
        bullets: [
          '55+ teman för måltider och träning',
          'Kalorier, makro och sessionsstatistik på kortet',
          'Redigera text eller använd AI-förslag',
          'Dela till Instagram, TikTok och vidare',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: 'Vänner och delning',
        title: 'Framsteg känns annorlunda med vänner.',
        description:
          'Skapa en grupp med dina vänner, dela måltidsloggar och träning, och tävla om den bästa streaken i er cirkel.',
        bullets: [
          'Skapa grupper med vänner',
          'Dela måltider, träning och loggar',
          'Tävla om #1-streaken',
        ],
        screenshotLabel: 'Vänfeed',
      },
      {
        id: 'coach',
        eyebrow: 'IGNITE AI-coach',
        title: 'Nutritionssvar, on demand.',
        description:
          'Chatta med den inbyggda AI-coachen för vägledning om måltider, makro och vad du ska äta härnäst.',
        bullets: [
          'Fråga vad som helst om nutrition',
          'Personliga förslag',
          'Tillgänglig dygnet runt i appen',
        ],
        screenshotLabel: 'AI-coachchatt',
      },
      {
        id: 'streaks',
        eyebrow: 'Streaks och badges',
        title: 'Konsekvens, gamifierad.',
        description:
          'Lås upp achievements medan du loggar och tränar. Streaks gör det att dyka upp varje dag nästan automatiskt.',
        bullets: [
          'Dagliga logging-streaks',
          'Achievement-badges',
          'Milstolpar värda att dela',
        ],
        screenshotLabel: 'Streaks och badges',
      },
    ],
  },
  themes: {
    title: 'Tre looks. Samma IGNITE.',
    subtitle: 'Byt mellan Light, Glow och Dark när som helst under Utseende.',
    alt: 'IGNITE AI {name}-tema',
    items: {
      light: {
        name: 'Light',
        description: 'Ren mesh-yta för daglig loggning.',
      },
      dark: {
        name: 'Dark',
        description: 'Kolsvart nattläge för svagt ljus.',
      },
      glow: {
        name: 'Glow',
        description: 'Mjuk solnedgångstvätt med varmt djup.',
      },
    },
  },
  socialProof: {
    title: 'Byggd för dig som vill ha resultat, inte kalkylblad.',
    stats: [
      'ID-noggrannhet på tydliga tallrikar',
      'Share Card-teman',
      'hälssignaler synkade',
      'övningstyper att logga',
    ],
  },
  finalCta: {
    title: 'Börja få framsteg att se enkla ut.',
    tagline: 'Snap. Logga. Kör.',
    ratingAria: '5-stjärnig bedömning',
  },
  footer: {
    legal: 'Juridiskt',
    privacy: 'Integritetspolicy',
    terms: 'Användarvillkor',
    company: 'Företag',
    contact: 'Kontakt',
    faq: 'FAQ',
    copyright: '© Copyright {year}, Alla rättigheter förbehållna',
    disclaimer:
      'IGNITE AI ger endast allmän information om välmående och träning. Det är inte medicinsk rådgivning. Rådfråga vårdpersonal innan du ändrar kost eller träningsrutin.',
  },
  contact: {
    backHome: '← Hem',
    title: 'Kontakta oss',
    subtitle: 'Skicka ett meddelande så återkommer vi snart.',
    firstName: 'Förnamn',
    lastName: 'Efternamn',
    email: 'E-post',
    message: 'Meddelande',
    required: 'obligatoriskt',
    submit: 'Skicka →',
    sending: 'Skickar…',
    success: 'Tack. Ditt meddelande har skickats. Vi återkommer snart.',
    error: 'Något gick fel. Försök igen.',
  },
  press: {
    title: 'Press',
    subtitle:
      'Kontakta vårt pressteam för mediefrågor, intervjuer och pressmeddelanden.',
    email: 'E-postadress',
    subject: 'Ämne',
    message: 'Meddelande',
    emailPlaceholder: 'din.epost@exempel.com',
    subjectPlaceholder: 'Ämne för mediefråga',
    messagePlaceholder:
      'Ange detaljer om din mediefråga, inklusive deadline, information om mediet och specifika frågor du vill ha svar på...',
    submit: 'Skicka pressförfrågan',
    sending: 'Skickar…',
    success: 'Tack. Din pressförfrågan har skickats. Vi återkommer snart.',
    error: 'Något gick fel. Försök igen.',
  },
  blog: {
    title: 'Vår blogg',
    subtitle: 'följ för uppdateringar',
    back: '← Blogg',
    asideTagline: 'Snap. Logga. Kör.',
    asideBody: 'Ladda ner IGNITE AI: makro, träning och framsteg värda att dela.',
  },
  legal: {
    backHome: '← Hem',
    related: 'Relaterat:',
    privacy: 'Integritetspolicy',
    terms: 'Användarvillkor',
  },
  faq: faqSv,
  comingSoon: {
    title: "Kommer snart",
    subtitle:
      "Vi lägger sista handen på IGNITE AI. Endast privat förhandsåtkomst just nu.",
    tagline: "Snap. Logga. Crush.",
    wrongPassword: 'Fel lösenord. Försök igen.',
    genericError: 'Något gick fel. Försök igen.',
    password: 'Lösenord',
    enter: 'Enter',
  },
} as const satisfies Messages
