export const faqIt = {
  title: 'FAQ',
  subtitle: 'Le domande che il nostro team di supporto sente più spesso.',
  seeAll: 'Vedi tutte le FAQ',
  backHome: '← Home',
  pageTitle: 'Domande frequenti',
  pageSubtitle: 'Abbonamenti, pasti, allenamenti, sincronizzazione Health e risoluzione problemi.',
  contactTitle: 'Hai ancora bisogno di aiuto?',
  contactBody:
    'Scrivici a support@ignitehub.app o invia un messaggio dal modulo di contatto. Di solito rispondiamo entro 1-2 giorni lavorativi.',
  contactLink: 'Contattaci',
  teaser: [
    {
      q: 'Perché vedo ancora il paywall dopo aver pagato?',
      a: 'Gli abbonamenti sono gestiti da Apple o Google, non direttamente da noi. Apri l\'app con lo stesso account App Store o Google Play usato per l\'acquisto, poi prova Restore Purchases nelle Impostazioni. Se non funziona, scrivi a support@ignitehub.app con la ricevuta dello store.',
    },
    {
      q: 'Come cancello l\'abbonamento o la prova gratuita?',
      a: 'Puoi cancellare in qualsiasi momento dalle impostazioni dello store del dispositivo. Su iPhone: Impostazioni → [Il tuo nome] → Abbonamenti → IGNITE AI → Annulla. Su Android: Google Play → Pagamenti e abbonamenti → Abbonamenti → IGNITE AI → Annulla. Cancella prima della fine della prova o del rinnovo per evitare l\'addebito successivo.',
    },
    {
      q: 'Voglio un rimborso. Come posso ottenerlo?',
      a: 'Il rimborso dipende da dove hai acquistato l\'abbonamento:',
      bullets: [
        'Apple App Store: Apple gestisce tutto direttamente.',
        'Google Play: Stessa cosa, richiedilo tramite Google.',
        'Hai bisogno di aiuto per trovare la pagina giusta? Scrivi a support@ignitehub.app.',
      ],
      links: [
        {
          label: 'Richiedi un rimborso da Apple',
          href: 'https://support.apple.com/118223',
        },
        {
          label: 'Richiedi il rimborso su Google Play',
          href: 'https://support.google.com/googleplay/answer/2479637',
        },
      ],
    },
    {
      q: 'L\'IA ha scansionato male il mio pasto. Cosa faccio?',
      a: 'Dopo l\'analisi del pasto, aprilo da Recently uploaded, modificalo con le opzioni disponibili e salva le modifiche.',
    },
    {
      q: 'L\'app si blocca o non si apre. Cosa posso provare?',
      a: 'Chiudi forzatamente l\'app, riavvia il telefono e assicurati di avere l\'ultima versione dall\'App Store / Play Store. Se continua a bloccarsi, scrivici modello del dispositivo, versione del sistema e quando succede a support@ignitehub.app così possiamo indagare.',
    },
    {
      q: 'I miei passi o i dati di Apple Health / Health Connect non compaiono.',
      a: 'Verifica che i permessi Health siano attivi per IGNITE AI (Apple Health su iOS, Health Connect su Android), che le app di origine stiano sincronizzando e che tu abbia autorizzato passi/attività. Apri IGNITE AI una volta dopo aver concesso l\'accesso così può partire una sincronizzazione. Se i numeri restano bloccati, revoca e concedi di nuovo i permessi, poi riapri l\'app.',
    },
  ],
  categories: [
    {
      title: 'Abbonamenti e fatturazione',
      items: [
        {
          q: 'Perché vedo ancora il paywall dopo aver pagato?',
          a: 'Gli abbonamenti sono gestiti da Apple o Google, non direttamente da noi. Apri l\'app con lo stesso account App Store o Google Play usato per l\'acquisto, poi prova Restore Purchases nelle Impostazioni. Se non funziona, scrivi a support@ignitehub.app con la ricevuta dello store.',
        },
        {
          q: 'Come cancello l\'abbonamento o la prova gratuita?',
          a: 'Puoi cancellare in qualsiasi momento dalle impostazioni dello store del dispositivo. Su iPhone: Impostazioni → [Il tuo nome] → Abbonamenti → IGNITE AI → Annulla. Su Android: Google Play → Pagamenti e abbonamenti → Abbonamenti → IGNITE AI → Annulla. Cancella prima della fine della prova o del rinnovo per evitare l\'addebito successivo.',
        },
        {
          q: 'Voglio un rimborso. Come posso ottenerlo?',
          a: 'Il rimborso dipende da dove hai acquistato l\'abbonamento:',
          bullets: [
            'Apple App Store: Apple gestisce tutto direttamente.',
            'Google Play: Stessa cosa, richiedilo tramite Google.',
            'Hai bisogno di aiuto per trovare la pagina giusta? Scrivi a support@ignitehub.app.',
          ],
          links: [
            {
              label: 'Richiedi un rimborso da Apple',
              href: 'https://support.apple.com/118223',
            },
            {
              label: 'Richiedi il rimborso su Google Play',
              href: 'https://support.google.com/googleplay/answer/2479637',
            },
          ],
        },
        {
          q: 'Mi verrà addebitato di nuovo dopo la prova?',
          a: 'Sì, se non cancelli prima della fine della prova, l\'abbonamento si rinnova automaticamente al prezzo del piano mostrato al momento dell\'iscrizione. Riceverai promemoria dallo store secondo le regole Apple/Google. Gestisci o cancella in qualsiasi momento negli abbonamenti dello store.',
        },
        {
          q: 'Mi sono abbonato su iPhone ma uso Android (o viceversa).',
          a: 'Gli abbonamenti dello store non passano da Apple a Google. Ti serve un abbonamento attivo nello store del dispositivo che stai usando, oppure contatta il supporto se stai cambiando piattaforma e hai bisogno di aiuto.',
        },
      ],
    },
    {
      title: 'Pasti e IA',
      items: [
        {
          q: 'L\'IA ha scansionato male il mio pasto. Cosa faccio?',
          a: 'Dopo l\'analisi del pasto, aprilo da Recently uploaded, modificalo con le opzioni disponibili e salva le modifiche.',
        },
        {
          q: 'Quanto sono accurate le stime di calorie e macro?',
          a: 'IGNITE AI è pensato per essere il migliore sul mercato nell\'identificare gli ingredienti a livello visivo. I macro corrispondono al peso di ogni ingrediente, e quel peso è una stima approssimativa. Quando puoi, regola il peso in base alla quantità reale se pesi il cibo.',
        },
        {
          q: 'Posso registrare un pasto senza scattare una foto?',
          a: 'Sì. In Quick log puoi scrivere una descrizione, usare la voce o scansionare un codice a barre o un\'etichetta nutrizionale. La foto è facoltativa.',
        },
        {
          q: 'Posso modificare un pasto dopo averlo salvato?',
          a: 'Sì. Apri il pasto registrato e modifica alimenti, porzioni o totali. Le modifiche aggiornano calorie e macro giornaliere.',
        },
        {
          q: 'Posso salvare un pasto per registrarlo di nuovo in seguito?',
          a: 'Sì. Apri un pasto registrato e tocca l\'icona di salvataggio. Comparirà in Diet → Saved. Quando vuoi lo stesso cibo, vai lì e tocca Log. Non serve scattare una foto ogni volta che mangi lo stesso pasto.',
        },
      ],
    },
    {
      title: 'Allenamenti',
      items: [
        {
          q: 'Come registro un allenamento?',
          a: 'Nella home, tocca il pulsante "+" e scegli Log workout. Vedrai diverse opzioni. Scegli quella che fa per te. Gli allenamenti vengono salvati e stimano il consumo calorico in base al tuo profilo.',
        },
        {
          q: 'Gli allenamenti aggiornano automaticamente l\'obiettivo calorico?',
          a: 'L\'attività che registri (e i dati Health idonei sincronizzati) possono informare il quadro dei tuoi progressi. Considera gli obiettivi calorici come una guida. Regolali nelle impostazioni se il carico di allenamento cambia.',
        },
        {
          q: 'Posso modificare o eliminare un allenamento?',
          a: 'Sì. Apri la sessione dalla cronologia e modificala o rimuovila così le statistiche restano accurate.',
        },
      ],
    },
    {
      title: 'Apple Health e Health Connect',
      items: [
        {
          q: 'I miei passi o i dati Health non compaiono.',
          a: 'Verifica che i permessi Health siano attivi per IGNITE AI (Apple Health su iOS, Health Connect su Android), che le app di origine stiano sincronizzando e che tu abbia autorizzato passi/attività. Apri IGNITE AI una volta dopo aver concesso l\'accesso così può partire una sincronizzazione. Se i numeri restano bloccati, revoca e concedi di nuovo i permessi, poi riapri l\'app.',
        },
        {
          q: 'Quali dati legge IGNITE AI?',
          a: 'Con il tuo permesso, IGNITE AI può leggere i dati qui sotto. Controlli le categorie in Apple Health o Health Connect e puoi revocare l\'accesso in qualsiasi momento dalle impostazioni di sistema.',
          bullets: [
            'Passi',
            'Frequenza cardiaca media',
            'Ossigeno nel sangue',
            'Sonno (incluse le fasi del sonno)',
          ],
        },
        {
          q: 'Perché i numeri non coincidono con il mio orologio o l\'app Salute?',
          a: 'Le fonti possono differire (telefono vs orologio) e la sincronizzazione non è sempre immediata. Controlla quale app è la fonte principale in Health / Health Connect, poi aggiorna tirando verso il basso o riapri IGNITE AI.',
        },
      ],
    },
    {
      title: 'Coach, amici e condivisione',
      items: [
        {
          q: 'Come funzionano Amici o la condivisione di gruppo?',
          a: 'Invita persone dall\'area Amici con il flusso di invito. Una volta connessi, puoi condividere pasti, allenamenti o traguardi in base a ciò che scegli di pubblicare. Decidi tu cosa è visibile.',
        },
        {
          q: 'Cosa sono le Share Cards?',
          a: 'Le Share Cards sono immagini stilizzate di pasti, streak o traguardi che puoi inviare agli amici o pubblicare sui social. Scegli un tema, genera la card e condividi dal menu del dispositivo.',
        },
        {
          q: 'Posso smettere di condividere con qualcuno?',
          a: 'Sì. Rimuovilo dalla lista amici/gruppo o lascia il gruppo condiviso nelle impostazioni Amici così i post futuri non verranno condivisi con quella persona.',
        },
      ],
    },
    {
      title: 'Problemi con l\'app',
      items: [
        {
          q: 'L\'app si blocca o non si apre. Cosa posso provare?',
          a: 'Chiudi forzatamente l\'app, riavvia il telefono e assicurati di avere l\'ultima versione dall\'App Store / Play Store. Se continua a bloccarsi, scrivici modello del dispositivo, versione del sistema e quando succede a support@ignitehub.app così possiamo indagare.',
        },
        {
          q: 'Problemi di accesso o account',
          a: 'Verifica di usare lo stesso metodo di accesso di prima (Apple, Google o email). Se un codice o un link non arriva, controlla lo spam e aspetta un minuto prima di richiederne un altro. Sei ancora bloccato? Scrivi a support@ignitehub.app dall\'indirizzo associato all\'account.',
        },
        {
          q: 'Le notifiche non arrivano',
          a: 'Attiva le notifiche per IGNITE AI nelle Impostazioni di sistema e controlla i promemoria nell\'app. La modalità risparmio energetico o i risparmiatori batteria possono ritardare gli avvisi su alcuni telefoni.',
        },
      ],
    },
  ],
} as const
