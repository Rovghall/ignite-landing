export const faqSv = {
  title: 'FAQ',
  subtitle: 'Frågorna vårt supportteam hör oftast.',
  seeAll: 'Se alla FAQ',
  backHome: '← Hem',
  pageTitle: 'Vanliga frågor',
  pageSubtitle: 'Prenumerationer, måltider, träning, Health-synk och felsökning.',
  contactTitle: 'Fastnar du fortfarande?',
  contactBody:
    'Mejla oss på support@ignitehub.app eller skicka ett meddelande via kontaktformuläret. Vi svarar oftast inom 1-2 arbetsdagar.',
  contactLink: 'Kontakta oss',
  teaser: [
    {
      q: 'Varför ser jag fortfarande en paywall efter att jag betalat?',
      a: 'Prenumerationer hanteras av Apple eller Google, inte direkt av oss. Öppna appen med samma App Store- eller Google Play-konto som du köpte med och prova Restore Purchases i Inställningar. Om det fortfarande misslyckas, mejla support@ignitehub.app med ditt kvitto från butiken.',
    },
    {
      q: 'Hur avslutar jag min prenumeration eller gratisperiod?',
      a: 'Du kan avsluta när som helst i enhetens butiksinställningar. På iPhone: Inställningar → [Ditt namn] → Prenumerationer → IGNITE AI → Avbryt. På Android: Google Play → Betalningar och prenumerationer → Prenumerationer → IGNITE AI → Avbryt. Avsluta före prov- eller förnyelsedatum för att undvika nästa debitering.',
    },
    {
      q: 'Jag vill ha en återbetalning. Hur får jag det?',
      a: 'Återbetalningar beror på var du köpte din prenumeration:',
      bullets: [
        'Apple App Store: Apple hanterar detta direkt.',
        'Google Play: Samma sak, begär det via Google.',
        'Behöver du hjälp att hitta rätt sida? Mejla support@ignitehub.app.',
      ],
      links: [
        {
          label: 'Begär återbetalning från Apple',
          href: 'https://support.apple.com/118223',
        },
        {
          label: 'Begär Google Play-återbetalning',
          href: 'https://support.google.com/googleplay/answer/2479637',
        },
      ],
    },
    {
      q: 'AI:n skannade min måltid fel. Vad gör jag?',
      a: 'Efter måltidsanalysen, öppna den från Recently uploaded, justera med alternativen där och spara dina ändringar.',
    },
    {
      q: 'Appen kraschar eller öppnas inte. Vad ska jag prova?',
      a: 'Stäng appen tvångsvis, starta om telefonen och se till att du har senaste versionen från App Store / Play Store. Om den fortfarande kraschar, berätta enhetsmodell, OS-version och ungefär när det händer på support@ignitehub.app så vi kan undersöka.',
    },
    {
      q: 'Mina steg eller Apple Health / Health Connect-data visas inte.',
      a: 'Bekräfta att Health-behörigheter är på för IGNITE AI (Apple Health på iOS, Health Connect på Android), att källapparna synkar och att du tillåtit steg/aktivitet. Öppna IGNITE AI en gång efter att du gett åtkomst så att synk kan köras. Om siffrorna fastnar, återkalla och ge behörigheter igen och öppna appen på nytt.',
    },
  ],
  categories: [
    {
      title: 'Prenumerationer och fakturering',
      items: [
        {
          q: 'Varför ser jag fortfarande en paywall efter att jag betalat?',
          a: 'Prenumerationer hanteras av Apple eller Google, inte direkt av oss. Öppna appen med samma App Store- eller Google Play-konto som du köpte med och prova Restore Purchases i Inställningar. Om det fortfarande misslyckas, mejla support@ignitehub.app med ditt kvitto från butiken.',
        },
        {
          q: 'Hur avslutar jag min prenumeration eller gratisperiod?',
          a: 'Du kan avsluta när som helst i enhetens butiksinställningar. På iPhone: Inställningar → [Ditt namn] → Prenumerationer → IGNITE AI → Avbryt. På Android: Google Play → Betalningar och prenumerationer → Prenumerationer → IGNITE AI → Avbryt. Avsluta före prov- eller förnyelsedatum för att undvika nästa debitering.',
        },
        {
          q: 'Jag vill ha en återbetalning. Hur får jag det?',
          a: 'Återbetalningar beror på var du köpte din prenumeration:',
          bullets: [
            'Apple App Store: Apple hanterar detta direkt.',
            'Google Play: Samma sak, begär det via Google.',
            'Behöver du hjälp att hitta rätt sida? Mejla support@ignitehub.app.',
          ],
          links: [
            {
              label: 'Begär återbetalning från Apple',
              href: 'https://support.apple.com/118223',
            },
            {
              label: 'Begär Google Play-återbetalning',
              href: 'https://support.google.com/googleplay/answer/2479637',
            },
          ],
        },
        {
          q: 'Debiteras jag igen efter min provperiod?',
          a: 'Ja, om du inte avslutar före provperioden slutar förnyas prenumerationen automatiskt till priset som visades vid registrering. Du får påminnelser från butiken enligt Apple/Google-regler. Hantera eller avsluta när som helst i dina butiksprenumerationer.',
        },
        {
          q: 'Jag prenumererade på iPhone men använder Android (eller tvärtom).',
          a: 'Butiksprenumerationer överförs inte mellan Apple och Google. Du behöver en aktiv prenumeration i butiken för enheten du använder, eller kontakta support om du byter plattform och behöver hjälp.',
        },
      ],
    },
    {
      title: 'Måltider och AI',
      items: [
        {
          q: 'AI:n skannade min måltid fel. Vad gör jag?',
          a: 'Efter måltidsanalysen, öppna den från Recently uploaded, justera med alternativen där och spara dina ändringar.',
        },
        {
          q: 'Hur exakta är kalori- och makroestimat?',
          a: 'IGNITE AI är byggt för att vara bäst på marknaden på att identifiera ingredienser visuellt. Makron motsvarar vikten av varje ingrediens, och den vikten är en ungefärlig uppskattning. Justera vikten till den faktiska mängden när du kan om du väger maten.',
        },
        {
          q: 'Kan jag logga utan att ta ett foto?',
          a: 'Ja. I Quick log kan du skriva en beskrivning, använda röst eller skanna en streckkod eller näringsdeklaration. Foto är valfritt.',
        },
        {
          q: 'Kan jag ändra en måltid efter att jag sparat den?',
          a: 'Ja. Öppna den loggade måltiden och redigera livsmedel, portioner eller totaler. Ändringar uppdaterar dina dagliga kalorier och makron.',
        },
        {
          q: 'Kan jag spara en måltid för att logga den igen senare?',
          a: 'Ja. Öppna en loggad måltid och tryck på spara-ikonen. Den visas under Diet → Saved. När du vill ha samma mat igen, gå dit och tryck Log. Du behöver inte ta foto varje gång du äter samma måltid.',
        },
      ],
    },
    {
      title: 'Träning',
      items: [
        {
          q: 'Hur loggar jag ett träningspass?',
          a: 'På startsidan, tryck på "+"-knappen och välj Log workout. Du får flera alternativ. Välj det som passar dig bäst. Träningspass sparas och uppskattar kaloriförbrukning baserat på din profil.',
        },
        {
          q: 'Justerar träningspass mitt kalorimål automatiskt?',
          a: 'Aktivitet du loggar (och behörig Health-synkdata) kan informera din framstegsbild. Behandla kalorimål som vägledning. Justera mål i inställningar om din träningsbelastning ändras.',
        },
        {
          q: 'Kan jag redigera eller ta bort ett träningspass?',
          a: 'Ja. Öppna passet från historiken och redigera eller ta bort det så att din statistik förblir korrekt.',
        },
      ],
    },
    {
      title: 'Apple Health och Health Connect',
      items: [
        {
          q: 'Mina steg eller Health-data visas inte.',
          a: 'Bekräfta att Health-behörigheter är på för IGNITE AI (Apple Health på iOS, Health Connect på Android), att källapparna synkar och att du tillåtit steg/aktivitet. Öppna IGNITE AI en gång efter att du gett åtkomst så att synk kan köras. Om siffrorna fastnar, återkalla och ge behörigheter igen och öppna appen på nytt.',
        },
        {
          q: 'Vilken data läser IGNITE AI?',
          a: 'Med ditt tillstånd kan IGNITE AI läsa datan nedan. Du styr kategorier i Apple Health eller Health Connect och kan återkalla åtkomst när som helst i systeminställningar.',
          bullets: [
            'Steg',
            'Genomsnittlig puls',
            'Syremättnad i blodet',
            'Sömn (inklusive sömnfaser)',
          ],
        },
        {
          q: 'Varför stämmer inte siffrorna med min klocka eller Health-appen?',
          a: 'Källor kan skilja sig (telefon vs klocka) och synk är inte alltid omedelbar. Kontrollera vilken app som är primär källa i Health / Health Connect, dra för att uppdatera eller öppna IGNITE AI igen.',
        },
      ],
    },
    {
      title: 'Coach, vänner och delning',
      items: [
        {
          q: 'Hur fungerar Vänner eller gruppdelning?',
          a: 'Bjud in personer från Vänner-området med din inbjudningsflöde. När ni är anslutna kan du dela måltider, träningspass eller prestationer baserat på vad du väljer att publicera. Du bestämmer vad som syns.',
        },
        {
          q: 'Vad är Share Cards?',
          a: 'Share Cards är stiliserade bilder av måltider, streaks eller vinster som du kan skicka till vänner eller lägga upp på sociala medier. Välj ett tema, generera kortet och dela från enhetens delningsmeny.',
        },
        {
          q: 'Kan jag sluta dela med någon?',
          a: 'Ja. Ta bort personen från din vän-/grupplista eller lämna den delade gruppen i Vänner-inställningar så att framtida inlägg inte delas med dem.',
        },
      ],
    },
    {
      title: 'App-problem',
      items: [
        {
          q: 'Appen kraschar eller öppnas inte. Vad ska jag prova?',
          a: 'Stäng appen tvångsvis, starta om telefonen och se till att du har senaste versionen från App Store / Play Store. Om den fortfarande kraschar, berätta enhetsmodell, OS-version och ungefär när det händer på support@ignitehub.app så vi kan undersöka.',
        },
        {
          q: 'Inloggnings- eller kontoproblem',
          a: 'Bekräfta att du använder samma inloggningsmetod som tidigare (Apple, Google eller e-post). Om en kod eller magic link inte kommer, kolla skräppost och vänta en minut innan du begär en ny. Fortfarande utelåst? Mejla support@ignitehub.app från adressen på kontot.',
        },
        {
          q: 'Notiser kommer inte fram',
          a: 'Aktivera notiser för IGNITE AI i systeminställningar och kontrollera påminnelser i appen. Strömsparläge / batterisparare kan fördröja aviseringar på vissa telefoner.',
        },
      ],
    },
  ],
} as const
