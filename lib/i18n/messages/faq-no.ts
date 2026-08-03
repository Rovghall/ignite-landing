export const faqNo = {
  title: 'FAQ',
  subtitle: 'Spørsmålene supportteamet vårt hører oftest.',
  seeAll: 'Se alle FAQ',
  backHome: '← Hjem',
  pageTitle: 'Ofte stilte spørsmål',
  pageSubtitle: 'Abonnement, måltider, trening, Health-synk og feilsøking.',
  contactTitle: 'Sitter du fortsatt fast?',
  contactBody:
    'Send e-post til support@ignitehub.app eller bruk kontaktskjemaet. Vi svarer vanligvis innen 1-2 virkedager.',
  contactLink: 'Kontakt oss',
  teaser: [
    {
      q: 'Hvorfor ser jeg fortsatt en paywall etter at jeg har betalt?',
      a: 'Abonnementer håndteres av Apple eller Google, ikke direkte av oss. Åpne appen mens du er logget inn på samme App Store- eller Google Play-konto som du kjøpte med, og prøv Restore Purchases i Innstillinger. Hvis det fortsatt feiler, send kvitteringen fra butikken til support@ignitehub.app.',
    },
    {
      q: 'Hvordan avslutter jeg abonnementet eller gratisperioden?',
      a: 'Du kan avslutte når som helst i enhetens butikkinnstillinger. På iPhone: Innstillinger → [Ditt navn] → Abonnementer → IGNITE AI → Avbryt. På Android: Google Play → Betalinger og abonnementer → Abonnementer → IGNITE AI → Avbryt. Avslutt før prøve- eller fornyelsesdatoen for å unngå neste trekk.',
    },
    {
      q: 'Jeg vil ha refusjon. Hvordan får jeg det?',
      a: 'Refusjon avhenger av hvor du kjøpte abonnementet:',
      bullets: [
        'Apple App Store: Apple håndterer dette direkte.',
        'Google Play: Samme sak, be om det via Google.',
        'Trenger du hjelp til å finne riktig side? Send e-post til support@ignitehub.app.',
      ],
      links: [
        {
          label: 'Be om refusjon fra Apple',
          href: 'https://support.apple.com/118223',
        },
        {
          label: 'Be om Google Play-refusjon',
          href: 'https://support.google.com/googleplay/answer/2479637',
        },
      ],
    },
    {
      q: 'AI-en skannet måltidet mitt feil. Hva gjør jeg?',
      a: 'Etter måltidsanalysen, åpne det fra Recently uploaded, juster det med alternativene der, og lagre endringene.',
    },
    {
      q: 'Appen krasjer eller vil ikke åpne. Hva bør jeg prøve?',
      a: 'Tving appen til å lukke, start telefonen på nytt, og sørg for at du har siste versjon fra App Store / Play Store. Krasjer den fortsatt, fortell oss enhetsmodell, OS-versjon og omtrent når det skjer på support@ignitehub.app så vi kan undersøke.',
    },
    {
      q: 'Skrittene mine eller Apple Health / Health Connect-data vises ikke.',
      a: 'Bekreft at Health-tillatelser er på for IGNITE AI (Apple Health på iOS, Health Connect på Android), at kildeappene synkroniserer, og at du har tillatt skritt/aktivitet. Åpne IGNITE AI én gang etter at du har gitt tilgang, så synk kan kjøre. Hvis tallene henger, trekk tilbake og gi tillatelser på nytt, og åpne appen igjen.',
    },
  ],
  categories: [
    {
      title: 'Abonnement og fakturering',
      items: [
        {
          q: 'Hvorfor ser jeg fortsatt en paywall etter at jeg har betalt?',
          a: 'Abonnementer håndteres av Apple eller Google, ikke direkte av oss. Åpne appen mens du er logget inn på samme App Store- eller Google Play-konto som du kjøpte med, og prøv Restore Purchases i Innstillinger. Hvis det fortsatt feiler, send kvitteringen fra butikken til support@ignitehub.app.',
        },
        {
          q: 'Hvordan avslutter jeg abonnementet eller gratisperioden?',
          a: 'Du kan avslutte når som helst i enhetens butikkinnstillinger. På iPhone: Innstillinger → [Ditt navn] → Abonnementer → IGNITE AI → Avbryt. På Android: Google Play → Betalinger og abonnementer → Abonnementer → IGNITE AI → Avbryt. Avslutt før prøve- eller fornyelsesdatoen for å unngå neste trekk.',
        },
        {
          q: 'Jeg vil ha refusjon. Hvordan får jeg det?',
          a: 'Refusjon avhenger av hvor du kjøpte abonnementet:',
          bullets: [
            'Apple App Store: Apple håndterer dette direkte.',
            'Google Play: Samme sak, be om det via Google.',
            'Trenger du hjelp til å finne riktig side? Send e-post til support@ignitehub.app.',
          ],
          links: [
            {
              label: 'Be om refusjon fra Apple',
              href: 'https://support.apple.com/118223',
            },
            {
              label: 'Be om Google Play-refusjon',
              href: 'https://support.google.com/googleplay/answer/2479637',
            },
          ],
        },
        {
          q: 'Blir jeg belastet igjen etter prøveperioden?',
          a: 'Ja, hvis du ikke avslutter før prøveperioden er over, fornyes abonnementet automatisk til prisen som ble vist ved registrering. Du får påminnelser fra butikken i henhold til Apple/Google-regler. Administrer eller avslutt når som helst i butikkabonnementene.',
        },
        {
          q: 'Jeg abonnerte på iPhone, men bruker Android (eller omvendt).',
          a: 'Butikkabonnementer overføres ikke mellom Apple og Google. Du trenger et aktivt abonnement i butikken for enheten du bruker, eller kontakt support hvis du er midt i et bytte og trenger hjelp.',
        },
      ],
    },
    {
      title: 'Måltider og AI',
      items: [
        {
          q: 'AI-en skannet måltidet mitt feil. Hva gjør jeg?',
          a: 'Etter måltidsanalysen, åpne det fra Recently uploaded, juster det med alternativene der, og lagre endringene.',
        },
        {
          q: 'Hvor nøyaktige er kalori- og makroestimatene?',
          a: 'IGNITE AI er bygget for å være best i markedet til å identifisere ingredienser visuelt. Makroer tilsvarer vekten av hver ingrediens, og den vekten er et omtrentlig estimat. Juster vekten til det faktiske beløpet når du kan, hvis du veier maten.',
        },
        {
          q: 'Kan jeg logge uten å ta bilde?',
          a: 'Ja. I Quick log kan du skrive en beskrivelse, bruke stemme, eller skanne strekkode eller næringsmerke. Bilde er valgfritt.',
        },
        {
          q: 'Kan jeg endre et måltid etter at jeg har lagret det?',
          a: 'Ja. Åpne det loggede måltidet og rediger matvarer, porsjoner eller totaler. Endringer oppdaterer daglige kalorier og makroer.',
        },
        {
          q: 'Kan jeg lagre et måltid for å logge det igjen senere?',
          a: 'Ja. Åpne et logget måltid og trykk på lagre-ikonet. Det vises under Diet → Saved. Når du vil ha samme mat igjen, gå dit og trykk Log. Du trenger ikke ta bilde hver gang du spiser samme måltid.',
        },
      ],
    },
    {
      title: 'Trening',
      items: [
        {
          q: 'Hvordan logger jeg en treningsøkt?',
          a: 'På hjemskjermen, trykk på "+"-knappen og velg Log workout. Du får flere alternativer. Velg det som passer deg best. Treningsøkter lagres og estimerer kaloriforbrenning basert på profilen din.',
        },
        {
          q: 'Justerer treningsøkter kalorimålet mitt automatisk?',
          a: 'Aktivitet du logger (og kvalifiserte Health-synkdata) kan informere fremgangsbildet ditt. Behandle kalorimål som veiledning. Juster mål i innstillinger hvis treningsbelastningen endrer seg.',
        },
        {
          q: 'Kan jeg redigere eller slette en treningsøkt?',
          a: 'Ja. Åpne økten fra historikken og rediger eller fjern den slik at statistikken din holder seg nøyaktig.',
        },
      ],
    },
    {
      title: 'Apple Health og Health Connect',
      items: [
        {
          q: 'Skrittene mine eller Health-data vises ikke.',
          a: 'Bekreft at Health-tillatelser er på for IGNITE AI (Apple Health på iOS, Health Connect på Android), at kildeappene synkroniserer, og at du har tillatt skritt/aktivitet. Åpne IGNITE AI én gang etter at du har gitt tilgang, så synk kan kjøre. Hvis tallene henger, trekk tilbake og gi tillatelser på nytt, og åpne appen igjen.',
        },
        {
          q: 'Hvilke data leser IGNITE AI?',
          a: 'Med din tillatelse kan IGNITE AI lese dataene nedenfor. Du styrer kategorier i Apple Health eller Health Connect og kan trekke tilbake tilgang når som helst i systeminnstillinger.',
          bullets: [
            'Skritt',
            'Gjennomsnittlig puls',
            'Blodoksygen',
            'Søvn (inkludert søvnfaser)',
          ],
        },
        {
          q: 'Hvorfor stemmer ikke tallene med klokken eller Health-appen min?',
          a: 'Kilder kan variere (telefon vs klokke), og synk er ikke alltid umiddelbar. Sjekk hvilken app som er primærkilden i Health / Health Connect, og dra for å oppdatere eller åpne IGNITE AI på nytt.',
        },
      ],
    },
    {
      title: 'Coach, venner og deling',
      items: [
        {
          q: 'Hvordan fungerer Venner eller gruppedeling?',
          a: 'Inviter folk fra Venner-området med invitasjonsflyten din. Når dere er koblet til, kan du dele måltider, treningsøkter eller prestasjoner basert på hva du velger å legge ut. Du bestemmer hva som er synlig.',
        },
        {
          q: 'Hva er Share Cards?',
          a: 'Share Cards er stiliserte bilder av måltider, streaks eller seire du kan sende til venner eller legge ut på sosiale medier. Velg et tema, generer kortet, og del fra enhetens delingsmeny.',
        },
        {
          q: 'Kan jeg slutte å dele med noen?',
          a: 'Ja. Fjern dem fra venn-/gruppelisten eller forlat den delte gruppen i Venner-innstillinger, så fremtidige innlegg ikke deles med dem.',
        },
      ],
    },
    {
      title: 'App-problemer',
      items: [
        {
          q: 'Appen krasjer eller vil ikke åpne. Hva bør jeg prøve?',
          a: 'Tving appen til å lukke, start telefonen på nytt, og sørg for at du har siste versjon fra App Store / Play Store. Krasjer den fortsatt, fortell oss enhetsmodell, OS-versjon og omtrent når det skjer på support@ignitehub.app så vi kan undersøke.',
        },
        {
          q: 'Innlogging eller kontoproblemer',
          a: 'Bekreft at du bruker samme innloggingsmetode som før (Apple, Google eller e-post). Hvis en kode eller magic link ikke kommer, sjekk søppelpost og vent et minutt før du ber om en ny. Fortsatt låst ute? Send e-post til support@ignitehub.app fra adressen på kontoen.',
        },
        {
          q: 'Varsler kommer ikke',
          a: 'Slå på varsler for IGNITE AI i systeminnstillinger, og sjekk påminnelser i appen. Strømsparemodus / batterisparere kan forsinke varsler på noen telefoner.',
        },
      ],
    },
  ],
} as const
