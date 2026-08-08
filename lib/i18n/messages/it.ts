import type { Messages } from './en'
import { faqIt } from './faq-it'

export const it = {
  lang: {
    chooseLanguage: 'Scegli lingua',
    close: 'Chiudi',
  },
  nav: {
    home: 'Home',
    press: 'Stampa',
    blogs: 'Blog',
    creatorProgram: 'Creator Program',
    main: 'Principale',
    homeAria: 'Home IGNITE AI',
    closeMenu: 'Chiudi menu',
    openMenu: 'Apri menu',
  },
  hero: {
    headline: 'Pensata per rendere il progresso naturale.',
    description:
      'IGNITE AI è un’app con IA per fotografare i pasti e ottenere calorie e macro all’istante, registrare allenamenti e condividere i progressi con gli amici. Un’unica app per nutrizione, allenamento e costanza.',
    tagline: 'Scatta. Registra. Domina.',
    introAria: 'Introduzione a IGNITE AI',
  },
  howItWorks: {
    title: 'Come funziona',
    steps: [
      {
        title: 'Scatta, scansiona o descrivi',
        description:
          'Da Quick log fotografa un pasto, scansiona un codice a barre o un’etichetta, scrivilo o usa la voce. Scegli il percorso che preferisci.',
      },
      {
        title: 'Ottieni calorie e macro',
        description:
          'L’IA stima la nutrizione. Foto e scansioni riuscite possono registrarsi subito. Modifica quando vuoi.',
      },
      {
        title: 'Allenati, monitora, resta costante',
        description:
          'Raggiungi gli obiettivi giornalieri di calorie e macro, registra gli allenamenti e condividi pasti o vittorie con Share Cards, con gli amici del gruppo o sui social.',
      },
    ],
  },
  features: {
    ariaLabel: 'Funzionalità',
    closingNote: 'Più digiuno, report PDF, statistiche e altro nell’app.',
    items: [
      {
        id: 'meal',
        eyebrow: 'Registro pasti con IA',
        title: 'Foto dentro. Macro fuori.',
        description:
          'Punta la fotocamera su qualsiasi piatto e IGNITE AI identifica il cibo e stima calorie e macro. Niente caccia ai codici a barre né scorrimento di database.',
        bullets: [
          'Scatta o descrivi qualsiasi pasto',
          'Stime istantanee di calorie e macro',
          'Modifica e conferma con un tap',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: 'Obiettivi nutrizionali giornalieri',
        title: 'Sai esattamente cosa resta oggi.',
        description:
          'L’anello delle calorie e proteine, carboidrati e grassi rimanenti si aggiornano a ogni registro. Uno sguardo basta per capire cosa mangiare dopo.',
        bullets: [
          'Anello calorie a colpo d’occhio',
          'Proteine, carboidrati e grassi rimanenti',
          'Obiettivi calibrati sul tuo target',
        ],
        screenshotLabel: 'Obiettivi giornalieri',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: 'Passi, frequenza cardiaca, sonno: tutto in sync.',
        description:
          'Collega Apple Health o Health Connect per importare i dati che orologio e telefono già tracciano: passi, calorie attive, frequenza cardiaca (BPM), sonno e allenamenti. IGNITE li integra nel budget giornaliero così ogni movimento conta.',
        bullets: [
          'Passi, BPM, sonno ed esercizio sincronizzati automaticamente',
          'Calorie attive da Apple Health e Health Connect',
          'Un solo posto per attività e nutrizione',
        ],
        screenshotLabel: 'Allenamenti',
      },
      {
        id: 'workout',
        eyebrow: 'Registro allenamenti',
        title: 'Registra ogni sessione. Consumo personalizzato.',
        description:
          'Scegli tra i tipi di esercizio in IGNITE: forza, corsa, ciclismo, HIIT, nuoto e altro. Il consumo calorico è stimato da altezza, peso e profilo, così il numero è tuo — non una media generica.',
        bullets: [
          'Più tipi di esercizio pronti da registrare',
          'Consumo calcolato da altezza, peso e livello di attività',
          'Calorie della sessione aggiunte al budget giornaliero',
        ],
        screenshotLabel: 'Registro allenamento',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: 'Trasforma i log in card pronte per le Stories.',
        description:
          'Le Share Cards di pasti e allenamenti mostrano la tua foto con calorie, macro o statistiche. Scegli tra oltre 55 temi, modifica il titolo o lascia suggerire all’IA, poi condividi su Instagram, TikTok e altro.',
        bullets: [
          'Oltre 55 temi per pasti e allenamenti',
          'Calorie, macro e stats di sessione sulla card',
          'Modifica il testo o usa i suggerimenti IA',
          'Condividi su Instagram, TikTok e oltre',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: 'Amici e condivisione',
        title: 'Il progresso è diverso con gli amici.',
        description:
          'Crea un gruppo con gli amici, condividi pasti e allenamenti e compete per la streak migliore del vostro cerchio.',
        bullets: [
          'Crea gruppi con gli amici',
          'Condividi pasti, allenamenti e log',
          'Corri per la streak n. 1',
        ],
        screenshotLabel: 'Feed amici',
      },
      {
        id: 'coach',
        eyebrow: 'Coach IGNITE AI',
        title: 'Risposte sulla nutrizione, on demand.',
        description:
          'Chatta con il coach IA integrato per indicazioni su pasti, macro e cosa mangiare dopo.',
        bullets: [
          'Chiedi qualsiasi cosa sulla nutrizione',
          'Suggerimenti personalizzati',
          'Disponibile 24/7 nell’app',
        ],
        screenshotLabel: 'Chat AI Coach',
      },
      {
        id: 'streaks',
        eyebrow: 'Streak e badge',
        title: 'Costanza, gamificata.',
        description:
          'Sblocca achievement mentre registri e ti alleni. Le streak rendono il presentarsi ogni giorno quasi automatico.',
        bullets: [
          'Streak giornaliere di registrazione',
          'Badge di achievement',
          'Traguardi da condividere',
        ],
        screenshotLabel: 'Streak e badge',
      },
    ],
  },
  themes: {
    title: 'Tre look. Lo stesso IGNITE.',
    subtitle: 'Passa tra Light, Glow e Dark quando vuoi in Aspetto.',
    alt: 'Tema {name} di IGNITE AI',
    items: {
      light: {
        name: 'Light',
        description: 'Tela mesh pulita per il logging di tutti i giorni.',
      },
      dark: {
        name: 'Dark',
        description: 'Modalità notte antracite per poca luce.',
      },
      glow: {
        name: 'Glow',
        description: 'Lavaggio soft al tramonto con profondità calda.',
      },
    },
  },
  socialProof: {
    title: 'Per chi vuole risultati, non fogli di calcolo.',
    stats: [
      'accuratezza ID su piatti nitidi',
      'temi Share Card',
      'segnali salute sincronizzati',
      'tipi di esercizio da registrare',
    ],
  },
  finalCta: {
    title: 'Inizia a rendere il progresso naturale.',
    tagline: 'Scatta. Registra. Domina.',
    ratingAria: 'Valutazione a 5 stelle',
  },
  footer: {
    legal: 'Note legali',
    privacy: 'Informativa sulla privacy',
    terms: 'Termini di utilizzo',
    company: 'Azienda',
    contact: 'Contatti',
    faq: 'FAQ',
    creatorProgram: 'Creator Program',
    copyright: '© Copyright {year}, Tutti i diritti riservati',
    disclaimer:
      'IGNITE AI fornisce solo informazioni generali su benessere e fitness. Non è un consiglio medico. Consulta un professionista sanitario prima di modificare dieta o routine di esercizio.',
  },
  contact: {
    backHome: '← Home',
    title: 'Contattaci',
    subtitle: 'Inviaci un messaggio e ti risponderemo presto.',
    firstName: 'Nome',
    lastName: 'Cognome',
    email: 'Email',
    message: 'Messaggio',
    required: 'obbligatorio',
    submit: 'Invia →',
    sending: 'Invio…',
    success: 'Grazie. Il tuo messaggio è stato inviato. Ti risponderemo presto.',
    error: 'Qualcosa è andato storto. Riprova.',
  },
  press: {
    title: 'Stampa',
    subtitle:
      'Contatta il nostro team stampa per richieste media, interviste e comunicati.',
    email: 'Indirizzo email',
    subject: 'Oggetto',
    message: 'Messaggio',
    emailPlaceholder: 'tua.email@esempio.com',
    subjectPlaceholder: 'Oggetto della richiesta media',
    messagePlaceholder:
      'Fornisci i dettagli della tua richiesta media, inclusi scadenza, informazioni sull’outlet e domande specifiche a cui vorresti risposta...',
    submit: 'Invia richiesta stampa',
    sending: 'Invio…',
    success: 'Grazie. La tua richiesta stampa è stata inviata. Ti risponderemo presto.',
    error: 'Qualcosa è andato storto. Riprova.',
  },
  creatorProgram: {
    title: 'Creator Program',
    subtitle:
      'Collabora con IGNITE AI. Condividi il tuo codice personalizzato per il prezzo annuale esclusivo e guadagna quando il tuo pubblico passa a Premium.',
    howTitle: 'Come funziona',
    steps: [
      {
        title: 'Candidati',
        description: 'Raccontaci dei tuoi contenuti, piattaforme e audience.',
      },
      {
        title: 'Esaminiamo',
        description: 'Il nostro team guarda il tuo profilo e ti risponde.',
      },
      {
        title: 'Ricevi il codice',
        description:
          'Se sei approvato, ricevi un codice creator personalizzato con il prezzo annuale Premium più basso.',
      },
      {
        title: 'Condividi e guadagna',
        description:
          'Condividi il codice con il tuo pubblico. Guadagna una ricompensa per ogni follower che sottoscrive il piano Premium annuale.',
      },
    ],
    applyTitle: 'Candidati',
    applyHint: "Raccontaci un po' dei tuoi contenuti così possiamo esaminare la candidatura.",
    fieldName: 'Nome visualizzato',
    fieldNamePlaceholder: 'Il tuo nome o brand',
    fieldEmail: 'Email di contatto',
    fieldEmailPlaceholder: 'tu@email.com',
    fieldPlatforms: 'Piattaforme',
    fieldHandle: 'Handle / link principale',
    fieldHandlePlaceholder: '@tuohandle o URL del profilo',
    fieldAudience: 'Dimensione audience',
    fieldAudiencePlaceholder: 'es. 25k',
    fieldNotes: 'Altro?',
    fieldNotesPlaceholder: 'Nichia, idee di collab, ecc.',
    submit: 'Invia candidatura',
    sending: 'Invio…',
    success: 'Grazie. La tua candidatura è stata inviata. La esamineremo e ti risponderemo presto.',
    error: 'Qualcosa è andato storto. Riprova.',
    errorPlatforms: 'Seleziona almeno una piattaforma.',
    appNote: "Puoi candidarti anche da Profilo → Creator program nell'app IGNITE AI.",
    platform: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      other: 'Altro',
    },
  },
  blog: {
    title: 'Il nostro blog',
    subtitle: 'seguici per gli aggiornamenti',
    back: '← Blog',
    asideTagline: 'Scatta. Registra. Domina.',
    asideBody: 'Scarica IGNITE AI: macro, allenamenti e progressi da condividere.',
  },
  legal: {
    backHome: '← Home',
    related: 'Correlati:',
    privacy: 'Informativa sulla privacy',
    terms: 'Termini di utilizzo',
  },
  faq: faqIt,
  comingSoon: {
    title: "Prossimamente",
    subtitle:
      "Stiamo dando gli ultimi ritocchi a IGNITE AI. Per ora solo accesso privato.",
    tagline: "Scatta. Registra. Domina.",
    wrongPassword: 'Password errata. Riprova.',
    genericError: 'Qualcosa è andato storto. Riprova.',
    password: 'Password',
    enter: 'Entra',
  },
} as const satisfies Messages
