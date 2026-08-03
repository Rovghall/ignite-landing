/**
 * Patch website privacyPolicy in content + public/i18n for all locales.
 * EN is fully replaced; other locales keep existing translations and patch key deltas.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const ADDRESS = '71-75 Shelton Street, London, Greater London, WC2H 9JQ, United Kingdom.'

/** @type {Record<string, any>} */
const patch = {
  en: {
    lastUpdated: 'Last updated: August 3, 2026',
    intro:
      'This Privacy Policy explains how 9NINE SOFTWARE LTD, trading as IGNITE AI ("IGNITE," "we," "us," or "our") collects, uses, stores, and shares personal information when you use the IGNITE AI mobile application and related services (the "Service"). We operate from the United Kingdom. This Policy works together with our Terms of use.',
    s1: [
      {
        type: 'p',
        text: 'The controller of personal information described in this Policy is 9NINE SOFTWARE LTD, trading as IGNITE AI, registered in the United Kingdom, except where we process data solely on behalf of another party.',
      },
      { type: 'p', text: `Registered address: ${ADDRESS}` },
      { type: 'p', text: 'Privacy questions and requests: privacy@ignitehub.app.' },
    ],
    s3ExtraBullet:
      'Improve reliability and product features using aggregated or technical usage signals where appropriate.',
    s3NoAds:
      'We do not sell your personal information. We do not use your health, nutrition, meal, or workout data for targeted advertising. We do not share personal information for cross-context behavioral advertising.',
    s7: {
      title: '7. How we share information',
      blocks: [
        {
          type: 'p',
          text: 'We may share personal information with the following categories of recipients (we do not list every individual vendor by name):',
        },
        {
          type: 'ul',
          items: [
            'Service providers that help us host and store data, authenticate users, process AI requests, deliver notifications, provide customer support, and operate or improve the Service (for example cloud hosting, authentication, storage, AI infrastructure, and product analytics needed to run the app).',
            'App platforms: Apple and Google when you sign in or purchase subscriptions through their stores. Payment card details are handled by those platforms; we do not receive your full payment card details.',
            'Health platforms: Apple Health and/or Health Connect, only when you choose to connect them and grant permission. Health data you sync is not used by us for marketing or advertising.',
            'Other users you choose to interact with: friends and private group members, for content and profile information you share through Friends features.',
            'Authorities, regulators, or others when required by law or to protect rights, safety, and security.',
          ],
        },
        {
          type: 'p',
          text: 'We may use public nutrition databases to look up food information. We do not sell your personal data to third-party data brokers.',
        },
        {
          type: 'p',
          text: 'If our business is reorganized, we may transfer information as part of that process with appropriate safeguards.',
        },
      ],
    },
  },
  pt: {
    lastUpdated: 'Última atualização: 3 de agosto de 2026',
    intro:
      'Esta Política de Privacidade explica como a 9NINE SOFTWARE LTD, a operar como IGNITE AI ("IGNITE", "nós", "nos" ou "nosso"), recolhe, utiliza, armazena e partilha informações pessoais quando utiliza a aplicação móvel IGNITE AI e os serviços relacionados (o "Serviço"). Operamos a partir do Reino Unido. Esta Política deve ser lida em conjunto com os nossos Termos de utilização.',
    s1: [
      {
        type: 'p',
        text: 'O responsável pelo tratamento das informações pessoais descritas nesta Política é a 9NINE SOFTWARE LTD, a operar como IGNITE AI, registada no Reino Unido, exceto quando processamos dados exclusivamente em nome de outra parte.',
      },
      { type: 'p', text: `Morada registada: ${ADDRESS}` },
      { type: 'p', text: 'Questões e pedidos relacionados com privacidade: privacy@ignitehub.app.' },
    ],
    s3ExtraBullet:
      'Melhorar a fiabilidade e as funcionalidades do produto com sinais de utilização agregados ou técnicos, quando adequado.',
    s3NoAds:
      'Não vendemos as suas informações pessoais. Não utilizamos os seus dados de saúde, nutrição, refeições ou treinos para publicidade segmentada. Não partilhamos informações pessoais para publicidade comportamental entre contextos.',
    s7: {
      title: '7. Como partilhamos informações',
      blocks: [
        {
          type: 'p',
          text: 'Podemos partilhar informações pessoais com as seguintes categorias de destinatários (não listamos cada fornecedor individualmente pelo nome):',
        },
        {
          type: 'ul',
          items: [
            'Prestadores de serviços que nos ajudam a alojar e armazenar dados, autenticar utilizadores, processar pedidos de IA, enviar notificações, prestar suporte e operar ou melhorar o Serviço (por exemplo alojamento cloud, autenticação, armazenamento, infraestrutura de IA e analítica de produto necessária para operar a app).',
            'Plataformas das apps: Apple e Google quando inicia sessão ou compra subscrições nas respetivas lojas. Os dados do cartão de pagamento são tratados por essas plataformas; não recebemos os dados completos do seu cartão.',
            'Plataformas de saúde: Apple Health e/ou Health Connect, apenas quando escolhe ligá-las e autoriza. Os dados de saúde que sincroniza não são usados por nós para marketing ou publicidade.',
            'Outros utilizadores com quem escolhe interagir: amigos e membros de grupos privados, relativamente a conteúdo e informação de perfil que partilha através das funcionalidades de Amigos.',
            'Autoridades, reguladores ou outros quando exigido por lei ou para proteger direitos, segurança e integridade.',
          ],
        },
        {
          type: 'p',
          text: 'Podemos usar bases de dados nutricionais públicas para procurar informação alimentar. Não vendemos os seus dados pessoais a corretoras de dados de terceiros.',
        },
        {
          type: 'p',
          text: 'Se o nosso negócio for reorganizado, podemos transferir informação nesse processo com salvaguardas adequadas.',
        },
      ],
    },
  },
  'pt-br': null, // filled from pt with BR date phrasing below
  es: {
    lastUpdated: 'Última actualización: 3 de agosto de 2026',
    intro:
      'La presente Política de privacidad explica cómo 9NINE SOFTWARE LTD, que opera como IGNITE AI («IGNITE», «nosotros» o «nuestro»), recopila, utiliza, almacena y comparte información personal cuando usted utiliza la aplicación móvil IGNITE AI y los servicios relacionados (el «Servicio»). Operamos desde el Reino Unido. Esta Política complementa nuestros Términos de uso.',
    s1: [
      {
        type: 'p',
        text: 'El responsable del tratamiento de la información personal descrita en esta Política es 9NINE SOFTWARE LTD, que opera como IGNITE AI, registrada en el Reino Unido, salvo cuando procesemos datos únicamente en nombre de otra entidad.',
      },
      { type: 'p', text: `Domicilio social: ${ADDRESS}` },
      { type: 'p', text: 'Consultas y solicitudes de privacidad: privacy@ignitehub.app.' },
    ],
    s3ExtraBullet:
      'Mejorar la fiabilidad y las funciones del producto mediante señales de uso agregadas o técnicas cuando proceda.',
    s3NoAds:
      'No vendemos su información personal. No utilizamos sus datos de salud, nutrición, comidas o entrenamientos para publicidad segmentada. No compartimos información personal para publicidad conductual entre contextos.',
    s7: {
      title: '7. Cómo compartimos la información',
      blocks: [
        {
          type: 'p',
          text: 'Podemos compartir información personal con las siguientes categorías de destinatarios (no enumeramos cada proveedor individualmente por nombre):',
        },
        {
          type: 'ul',
          items: [
            'Proveedores de servicios que nos ayudan a alojar y almacenar datos, autenticar usuarios, procesar solicitudes de IA, enviar notificaciones, prestar soporte al cliente y operar o mejorar el Servicio (por ejemplo, alojamiento en la nube, autenticación, almacenamiento, infraestructura de IA y analítica de producto necesaria para ejecutar la app).',
            'Plataformas de apps: Apple y Google cuando usted inicie sesión o adquiera suscripciones a través de sus tiendas. Los datos de la tarjeta de pago los gestionan esas plataformas; no recibimos los datos completos de su tarjeta de pago.',
            'Plataformas de salud: Salud de Apple y/o Health Connect, solo cuando usted elija conectarlas y conceda permiso. Los datos de salud que sincronice no los utilizamos para marketing ni publicidad.',
            'Otros usuarios con los que usted elija interactuar: amigos y miembros de grupos privados, respecto al contenido e información de perfil que comparta a través de las funciones de Amigos.',
            'Autoridades, reguladores u otros cuando la ley lo exija o para proteger derechos, seguridad e integridad.',
          ],
        },
        {
          type: 'p',
          text: 'Podemos utilizar bases de datos nutricionales públicas para consultar información alimentaria. No vendemos sus datos personales a intermediarios de datos de terceros.',
        },
        {
          type: 'p',
          text: 'Si nuestra empresa se reorganiza, podemos transferir información como parte de ese proceso con las garantías adecuadas.',
        },
      ],
    },
  },
  fr: {
    lastUpdated: 'Dernière mise à jour : 3 août 2026',
    intro:
      'La présente Politique de confidentialité explique comment 9NINE SOFTWARE LTD, opérant sous le nom IGNITE AI (« IGNITE », « nous », « notre » ou « nos »), collecte, utilise, stocke et partage des informations personnelles lorsque vous utilisez l\'application mobile IGNITE AI et les services associés (le « Service »). Nous opérons depuis le Royaume-Uni. Cette Politique complète nos Conditions d\'utilisation.',
    s1: [
      {
        type: 'p',
        text: 'Le responsable du traitement des informations personnelles décrites dans la présente Politique est 9NINE SOFTWARE LTD, opérant sous le nom IGNITE AI, enregistrée au Royaume-Uni, sauf lorsque nous traitons des données uniquement pour le compte d\'une autre partie.',
      },
      { type: 'p', text: `Adresse enregistrée : ${ADDRESS}` },
      {
        type: 'p',
        text: 'Questions et demandes relatives à la confidentialité : privacy@ignitehub.app.',
      },
    ],
    s3ExtraBullet:
      'améliorer la fiabilité et les fonctionnalités du produit à l\'aide de signaux d\'utilisation agrégés ou techniques, le cas échéant.',
    s3NoAds:
      'Nous ne vendons pas vos informations personnelles. Nous n\'utilisons pas vos données de santé, de nutrition, de repas ou d\'entraînement pour de la publicité ciblée. Nous ne partageons pas d\'informations personnelles à des fins de publicité comportementale intercontextuelle.',
    s7: {
      title: '7. Comment nous partageons les informations',
      blocks: [
        {
          type: 'p',
          text: 'Nous pouvons partager des informations personnelles avec les catégories de destinataires suivantes (nous ne listons pas chaque prestataire individuellement par nom) :',
        },
        {
          type: 'ul',
          items: [
            'Des prestataires de services qui nous aident à héberger et stocker des données, authentifier les utilisateurs, traiter les demandes d\'IA, envoyer des notifications, fournir un support client et exploiter ou améliorer le Service (par exemple hébergement cloud, authentification, stockage, infrastructure d\'IA et analytique produit nécessaire au fonctionnement de l\'application).',
            'Plateformes d\'applications : Apple et Google lorsque vous vous connectez ou achetez des abonnements via leurs boutiques. Les données de carte de paiement sont gérées par ces plateformes ; nous ne recevons pas les données complètes de votre carte de paiement.',
            'Plateformes de santé : Apple Health et/ou Health Connect, uniquement lorsque vous choisissez de les connecter et d\'accorder l\'autorisation. Les données de santé que vous synchronisez ne sont pas utilisées par nous à des fins de marketing ou de publicité.',
            'Autres utilisateurs avec lesquels vous choisissez d\'interagir : amis et membres de groupes privés, pour le contenu et les informations de profil que vous partagez via les fonctionnalités Friends.',
            'Autorités, régulateurs ou autres lorsque la loi l\'exige ou pour protéger les droits, la sécurité et l\'intégrité.',
          ],
        },
        {
          type: 'p',
          text: 'Nous pouvons utiliser des bases de données nutritionnelles publiques pour rechercher des informations alimentaires. Nous ne vendons pas vos données personnelles à des courtiers en données tiers.',
        },
        {
          type: 'p',
          text: 'Si notre entreprise est réorganisée, nous pouvons transférer des informations dans le cadre de ce processus avec des garanties appropriées.',
        },
      ],
    },
  },
  de: {
    lastUpdated: 'Zuletzt aktualisiert: 3. August 2026',
    intro:
      'Diese Datenschutzerklärung erläutert, wie 9NINE SOFTWARE LTD, handelnd als IGNITE AI („IGNITE“, „wir“, „uns“ oder „unser“), personenbezogene Daten erhebt, verwendet, speichert und weitergibt, wenn Sie die mobile Anwendung IGNITE AI und die zugehörigen Dienste (der „Dienst“) nutzen. Wir haben unseren Sitz im Vereinigten Königreich. Diese Erklärung ergänzt unsere Nutzungsbedingungen.',
    s1: [
      {
        type: 'p',
        text: 'Der Verantwortliche für die in dieser Erklärung beschriebenen personenbezogenen Daten ist 9NINE SOFTWARE LTD, handelnd als IGNITE AI, registriert im Vereinigten Königreich, sofern wir Daten nicht ausschließlich im Auftrag einer anderen Partei verarbeiten.',
      },
      { type: 'p', text: `Eingetragene Anschrift: ${ADDRESS}` },
      { type: 'p', text: 'Fragen und Anfragen zum Datenschutz: privacy@ignitehub.app.' },
    ],
    s3ExtraBullet:
      'Zuverlässigkeit und Produktfunktionen mithilfe aggregierter oder technischer Nutzungssignale zu verbessern, wo angemessen.',
    s3NoAds:
      'Wir verkaufen Ihre personenbezogenen Daten nicht. Wir verwenden Ihre Gesundheits-, Ernährungs-, Mahlzeiten- oder Trainingsdaten nicht für gezielte Werbung. Wir geben personenbezogene Daten nicht für kontextübergreifende Verhaltenswerbung weiter.',
    s7: {
      title: '7. Wie wir Informationen teilen',
      blocks: [
        {
          type: 'p',
          text: 'Wir können personenbezogene Daten mit folgenden Kategorien von Empfängern teilen (wir listen nicht jeden einzelnen Anbieter namentlich auf):',
        },
        {
          type: 'ul',
          items: [
            'Dienstleister, die uns beim Hosting und Speichern von Daten, bei der Authentifizierung von Nutzern, der Verarbeitung von KI-Anfragen, der Zustellung von Benachrichtigungen, dem Kundensupport sowie dem Betrieb oder der Verbesserung des Dienstes unterstützen (z. B. Cloud-Hosting, Authentifizierung, Speicher, KI-Infrastruktur und Produktanalytik, die zum Betrieb der App erforderlich ist).',
            'App-Plattformen: Apple und Google, wenn Sie sich anmelden oder Abonnements über deren Stores erwerben. Zahlungskartendaten werden von diesen Plattformen verarbeitet; wir erhalten Ihre vollständigen Zahlungskartendaten nicht.',
            'Gesundheitsplattformen: Apple Health und/oder Health Connect, nur wenn Sie diese verbinden und die Berechtigung erteilen. Von Ihnen synchronisierte Gesundheitsdaten werden von uns nicht für Marketing oder Werbung verwendet.',
            'Andere Nutzer, mit denen Sie interagieren: Freunde und Mitglieder privater Gruppen, für Inhalte und Profilinformationen, die Sie über Freunde-Funktionen teilen.',
            'Behörden, Aufsichtsstellen oder andere, wenn gesetzlich vorgeschrieben oder zum Schutz von Rechten, Sicherheit und Integrität.',
          ],
        },
        {
          type: 'p',
          text: 'Wir können öffentliche Ernährungsdatenbanken zur Lebensmittelinformationssuche nutzen. Wir verkaufen Ihre personenbezogenen Daten nicht an Drittanbieter-Datenbroker.',
        },
        {
          type: 'p',
          text: 'Bei einer Unternehmensumstrukturierung können wir Informationen im Rahmen dieses Prozesses mit angemessenen Schutzmaßnahmen übertragen.',
        },
      ],
    },
  },
  it: {
    lastUpdated: 'Ultimo aggiornamento: 3 agosto 2026',
    intro:
      'La presente Informativa sulla privacy spiega come 9NINE SOFTWARE LTD, operante come IGNITE AI ("IGNITE", "noi", "ci" o "nostro"), raccoglie, utilizza, conserva e condivide le informazioni personali quando usi l\'applicazione mobile IGNITE AI e i servizi correlati (il "Servizio"). Operiamo dal Regno Unito. La presente Informativa va letta insieme ai nostri Termini di utilizzo.',
    s1: [
      {
        type: 'p',
        text: 'Il titolare del trattamento delle informazioni personali descritte nella presente Informativa è 9NINE SOFTWARE LTD, operante come IGNITE AI, registrata nel Regno Unito, salvo quando trattiamo dati esclusivamente per conto di un\'altra parte.',
      },
      { type: 'p', text: `Sede legale: ${ADDRESS}` },
      { type: 'p', text: 'Domande e richieste relative alla privacy: privacy@ignitehub.app.' },
    ],
    s3ExtraBullet:
      'Migliorare l\'affidabilità e le funzionalità del prodotto mediante segnali di utilizzo aggregati o tecnici, ove appropriato.',
    s3NoAds:
      'Non vendiamo le tue informazioni personali. Non utilizziamo i tuoi dati di salute, nutrizione, pasti o allenamento per pubblicità mirata. Non condividiamo informazioni personali per pubblicità comportamentale intercontestuale.',
    s7: {
      title: '7. Come condividiamo le informazioni',
      blocks: [
        {
          type: 'p',
          text: 'Possiamo condividere informazioni personali con le seguenti categorie di destinatari (non elenchiamo ogni fornitore individualmente per nome):',
        },
        {
          type: 'ul',
          items: [
            'Fornitori di servizi che ci assistono nell\'hosting e nell\'archiviazione dei dati, nell\'autenticazione degli utenti, nell\'elaborazione delle richieste di IA, nell\'invio di notifiche, nel supporto clienti e nella gestione o nel miglioramento del Servizio (ad esempio hosting cloud, autenticazione, archiviazione, infrastruttura IA e analitica di prodotto necessaria per far funzionare l\'app).',
            'Piattaforme delle app: Apple e Google quando accedi o acquisti abbonamenti tramite i rispettivi store. I dati della carta di pagamento sono gestiti da tali piattaforme; non riceviamo i dati completi della tua carta di pagamento.',
            'Piattaforme di salute: Apple Health e/o Health Connect, solo quando scegli di collegarle e concedi l\'autorizzazione. I dati sanitari sincronizzati non sono utilizzati da noi per marketing o pubblicità.',
            'Altri utenti con cui scegli di interagire: amici e membri di gruppi privati, per contenuti e informazioni di profilo condivisi tramite le funzionalità Friends.',
            'Autorità, regolatori o altri quando richiesto dalla legge o per proteggere diritti, sicurezza e integrità.',
          ],
        },
        {
          type: 'p',
          text: 'Possiamo utilizzare database nutrizionali pubblici per cercare informazioni alimentari. Non vendiamo i tuoi dati personali a broker di dati di terze parti.',
        },
        {
          type: 'p',
          text: 'Se la nostra attività viene riorganizzata, possiamo trasferire informazioni nell\'ambito di tale processo con garanzie appropriate.',
        },
      ],
    },
  },
  nl: {
    lastUpdated: 'Laatst bijgewerkt: 3 augustus 2026',
    intro:
      'Deze privacyverklaring legt uit hoe 9NINE SOFTWARE LTD, handelend als IGNITE AI ("IGNITE", "wij", "ons" of "onze"), persoonsgegevens verzamelt, gebruikt, opslaat en deelt wanneer u de mobiele applicatie IGNITE AI en bijbehorende diensten (de "Dienst") gebruikt. Wij zijn gevestigd in het Verenigd Koninkrijk. Dit beleid werkt samen met onze Gebruiksvoorwaarden.',
    s1: [
      {
        type: 'p',
        text: 'De verwerkingsverantwoordelijke voor de persoonsgegevens die in dit beleid worden beschreven is 9NINE SOFTWARE LTD, handelend als IGNITE AI, geregistreerd in het Verenigd Koninkrijk, behalve wanneer wij gegevens uitsluitend verwerken namens een andere partij.',
      },
      { type: 'p', text: `Geregistreerd adres: ${ADDRESS}` },
      { type: 'p', text: 'Vragen en verzoeken over privacy: privacy@ignitehub.app.' },
    ],
    s3ExtraBullet:
      'De betrouwbaarheid en productfuncties te verbeteren met geaggregeerde of technische gebruikssignalen waar dat passend is.',
    s3NoAds:
      'Wij verkopen uw persoonsgegevens niet. Wij gebruiken uw gezondheids-, voedings-, maaltijd- of trainingsgegevens niet voor gerichte advertenties. Wij delen geen persoonsgegevens voor cross-context gedragsreclame.',
    s7: {
      title: '7. Hoe wij informatie delen',
      blocks: [
        {
          type: 'p',
          text: 'Wij kunnen persoonsgegevens delen met de volgende categorieën ontvangers (wij vermelden niet elke individuele leverancier bij naam):',
        },
        {
          type: 'ul',
          items: [
            'Dienstverleners die ons helpen bij het hosten en opslaan van gegevens, authenticatie van gebruikers, verwerking van AI-verzoeken, levering van meldingen, klantenondersteuning en het bedrijven of verbeteren van de Dienst (bijvoorbeeld cloudhosting, authenticatie, opslag, AI-infrastructuur en productanalyse die nodig is om de app te laten werken).',
            'App-platformen: Apple en Google wanneer u zich aanmeldt of abonnementen koopt via hun stores. Betaalkaartgegevens worden door die platformen verwerkt; wij ontvangen niet uw volledige betaalkaartgegevens.',
            'Gezondheidsplatformen: Apple Health en/of Health Connect, alleen wanneer u deze kiest te verbinden en toestemming geeft. Door u gesynchroniseerde gezondheidsgegevens gebruiken wij niet voor marketing of advertenties.',
            'Andere gebruikers met wie u kiest te interageren: vrienden en leden van privégroepen, voor inhoud en profielinformatie die u deelt via Vrienden-functies.',
            'Autoriteiten, toezichthouders of anderen wanneer wettelijk vereist of om rechten, veiligheid en beveiliging te beschermen.',
          ],
        },
        {
          type: 'p',
          text: 'Wij kunnen openbare voedingsdatabases gebruiken om voedingsinformatie op te zoeken. Wij verkopen uw persoonsgegevens niet aan externe datamakelaars.',
        },
        {
          type: 'p',
          text: 'Als ons bedrijf wordt gereorganiseerd, kunnen wij informatie als onderdeel van dat proces overdragen met passende waarborgen.',
        },
      ],
    },
  },
  no: {
    lastUpdated: 'Sist oppdatert: 3. august 2026',
    intro:
      'Denne personvernerklæringen forklarer hvordan 9NINE SOFTWARE LTD, som driver under navnet IGNITE AI («IGNITE», «vi», «oss» eller «vår»), samler inn, bruker, lagrer og deler personopplysninger når du bruker mobilapplikasjonen IGNITE AI og tilhørende tjenester («Tjenesten»). Vi er basert i Storbritannia. Denne erklæringen fungerer sammen med våre vilkår for bruk.',
    s1: [
      {
        type: 'p',
        text: 'Behandlingsansvarlig for personopplysningene som beskrives i denne erklæringen er 9NINE SOFTWARE LTD, som driver under navnet IGNITE AI, registrert i Storbritannia, unntatt når vi utelukkende behandler data på vegne av en annen part.',
      },
      { type: 'p', text: `Registrert adresse: ${ADDRESS}` },
      { type: 'p', text: 'Spørsmål og forespørsler om personvern: privacy@ignitehub.app.' },
    ],
    s3ExtraBullet:
      'forbedre pålitelighet og produktfunksjoner ved hjelp av aggregerte eller tekniske brukssignaler der det er hensiktsmessig.',
    s3NoAds:
      'Vi selger ikke personopplysningene dine. Vi bruker ikke helse-, ernærings-, måltids- eller treningsdataene dine til målrettet reklame. Vi deler ikke personopplysninger for atferdsbasert reklame på tvers av kontekster.',
    s7: {
      title: '7. Hvordan vi deler informasjon',
      blocks: [
        {
          type: 'p',
          text: 'Vi kan dele personopplysninger med følgende kategorier av mottakere (vi lister ikke opp hver enkelt leverandør med navn):',
        },
        {
          type: 'ul',
          items: [
            'Tjenesteleverandører som hjelper oss med hosting og lagring av data, brukerautentisering, behandling av AI-forespørsler, levering av varsler, kundestøtte og drift eller forbedring av Tjenesten (for eksempel skyhosting, autentisering, lagring, AI-infrastruktur og produktanalyse som trengs for å drifte appen).',
            'App-plattformer: Apple og Google når du logger inn eller kjøper abonnementer via butikkene deres. Betalingskortdetaljer håndteres av disse plattformene; vi mottar ikke dine fulle betalingskortdetaljer.',
            'Helseplattformer: Apple Health og/eller Health Connect, bare når du velger å koble dem til og gir tillatelse. Helsedata du synkroniserer brukes ikke av oss til markedsføring eller reklame.',
            'Andre brukere du velger å interagere med: venner og medlemmer av private grupper, for innhold og profilinformasjon du deler via Venner-funksjoner.',
            'Myndigheter, tilsynsorganer eller andre når loven krever det eller for å beskytte rettigheter, sikkerhet og trygghet.',
          ],
        },
        {
          type: 'p',
          text: 'Vi kan bruke offentlige ernæringsdatabaser for å slå opp ernæringsinformasjon. Vi selger ikke personopplysningene dine til eksterne datameglere.',
        },
        {
          type: 'p',
          text: 'Hvis virksomheten vår omorganiseres, kan vi overføre informasjon som en del av den prosessen med passende garantier.',
        },
      ],
    },
  },
  sv: {
    lastUpdated: 'Senast uppdaterad: 3 augusti 2026',
    intro:
      'Denna integritetspolicy förklarar hur 9NINE SOFTWARE LTD, som bedriver verksamhet under namnet IGNITE AI ("IGNITE", "vi", "oss" eller "vår"), samlar in, använder, lagrar och delar personuppgifter när du använder mobilapplikationen IGNITE AI och tillhörande tjänster ("Tjänsten"). Verksamheten bedrivs från Förenade kungariket. Denna policy gäller tillsammans med våra Användarvillkor.',
    s1: [
      {
        type: 'p',
        text: 'Personuppgiftsansvarig för de personuppgifter som beskrivs i denna policy är 9NINE SOFTWARE LTD, som bedriver verksamhet under namnet IGNITE AI, registrerat i Förenade kungariket, utom i de fall vi behandlar uppgifter uteslutande på uppdrag av en annan part.',
      },
      { type: 'p', text: `Registrerad adress: ${ADDRESS}` },
      { type: 'p', text: 'Frågor och begäranden rörande integritet: privacy@ignitehub.app.' },
    ],
    s3ExtraBullet:
      'förbättra tillförlitlighet och produktfunktioner med aggregerade eller tekniska användningssignaler där det är lämpligt.',
    s3NoAds:
      'Vi säljer inte dina personuppgifter. Vi använder inte dina hälso-, närings-, måltids- eller träningsdata för riktad reklam. Vi delar inte personuppgifter för beteendebaserad reklam över sammanhang.',
    s7: {
      title: '7. Hur information delas',
      blocks: [
        {
          type: 'p',
          text: 'Personuppgifter kan delas med följande kategorier av mottagare (vi listar inte varje enskild leverantör med namn):',
        },
        {
          type: 'ul',
          items: [
            'Tjänsteleverantörer som bistår med hosting och lagring av data, autentisering av användare, behandling av AI-förfrågningar, leverans av notiser, kundsupport samt drift eller förbättring av Tjänsten (till exempel molnhosting, autentisering, lagring, AI-infrastruktur och produktanalys som behövs för att driva appen).',
            'Appplattformar: Apple och Google vid inloggning eller köp av prenumerationer via deras butiker. Betalkortsuppgifter hanteras av dessa plattformar; vi tar inte emot dina fullständiga betalkortsuppgifter.',
            'Hälsoplattformar: Apple Health och/eller Health Connect, endast när du väljer att ansluta dem och ger tillstånd. Hälsodata du synkar används inte av oss för marknadsföring eller reklam.',
            'Andra användare som du väljer att interagera med: vänner och medlemmar i privata grupper, för innehåll och profilinformation som delas via Vänner-funktioner.',
            'Myndigheter, tillsynsorgan eller andra parter när det krävs enligt lag eller för att skydda rättigheter, säkerhet och trygghet.',
          ],
        },
        {
          type: 'p',
          text: 'Offentliga näringsdatabaser kan användas för att slå upp livsmedelsinformation. Personuppgifter säljs inte till tredjepartsdatamäklare.',
        },
        {
          type: 'p',
          text: 'Om vår verksamhet omorganiseras kan vi överföra information som en del av den processen med lämpliga skyddsåtgärder.',
        },
      ],
    },
  },
  ja: {
    lastUpdated: '最終更新日：2026年8月3日',
    intro:
      '本プライバシーポリシーは、9NINE SOFTWARE LTD（商号：IGNITE AI、「IGNITE」「当社」「私たち」）が、IGNITE AI モバイルアプリケーションおよび関連サービス（「本サービス」）のご利用に際して、個人情報をどのように収集、利用、保存、共有するかを説明するものです。当社は英国に拠点を置いて運営しています。本ポリシーは、当社の利用規約と併せてご確認ください。',
    s1: [
      {
        type: 'p',
        text: '本ポリシーに記載される個人情報の管理者は、英国で登録された 9NINE SOFTWARE LTD（商号：IGNITE AI）です。ただし、他の当事者に代わってのみデータを処理する場合を除きます。',
      },
      { type: 'p', text: `登録住所：${ADDRESS}` },
      { type: 'p', text: 'プライバシーに関するご質問・ご請求：privacy@ignitehub.app。' },
    ],
    s3ExtraBullet:
      '適切な場合、集計または技術的な利用シグナルを用いて信頼性および製品機能を改善すること。',
    s3NoAds:
      '当社はお客様の個人情報を販売しません。健康、栄養、食事、またはワークアウトのデータをターゲティング広告に使用しません。クロスコンテキストの行動広告のために個人情報を共有しません。',
    s7: {
      title: '7. 情報の共有',
      blocks: [
        {
          type: 'p',
          text: '当社は、以下のカテゴリーの受領者と個人情報を共有する場合があります（個々のベンダー名をすべて列挙するものではありません）。',
        },
        {
          type: 'ul',
          items: [
            'データのホスティングおよび保存、ユーザー認証、AI リクエストの処理、通知の配信、カスタマーサポート、ならびに本サービスの運営または改善を支援するサービスプロバイダー（クラウドホスティング、認証、ストレージ、AI インフラ、アプリ運用に必要なプロダクト分析など）。',
            'アプリプラットフォーム：Apple および Google（それぞれのストア経由でサインインまたはサブスクリプションを購入した場合）。支払いカード情報はこれらのプラットフォームが処理し、当社はお客様の完全な支払いカード情報を受け取りません。',
            'ヘルスププラットフォーム：Apple Health および／または Health Connect（お客様が接続を選択し権限を付与した場合のみ）。同期された健康データは、当社がマーケティングまたは広告に使用することはありません。',
            'お客様がやり取りを選択した他のユーザー：フレンドおよび非公開グループのメンバー（フレンド機能を通じて共有するコンテンツおよびプロフィール情報）。',
            '法令に基づく要求、または権利・安全・セキュリティの保護のために、当局、規制機関、その他の第三者。',
          ],
        },
        {
          type: 'p',
          text: '当社は、食品情報の検索に公開の栄養データベースを使用する場合があります。当社は、お客様の個人データを第三者データブローカーに販売することはありません。',
        },
        {
          type: 'p',
          text: '当社の事業が再編される場合、適切な保護措置のもとで、そのプロセスの一環として情報を移転することがあります。',
        },
      ],
    },
  },
  ko: {
    lastUpdated: '최종 업데이트 날짜: 2026년 8월 3일',
    intro:
      '본 개인정보 처리방침은 9NINE SOFTWARE LTD(상호: IGNITE AI, 이하 "IGNITE", "당사", "우리")가 IGNITE AI 모바일 애플리케이션 및 관련 서비스(이하 "서비스") 이용 시 개인정보를 어떻게 수집·이용·저장·공유하는지 설명합니다. 당사는 영국에서 운영됩니다. 본 방침은 이용약관과 함께 확인해 주시기 바랍니다.',
    s1: [
      {
        type: 'p',
        text: '본 정책에 설명된 개인정보의 관리자는 영국에 등록된 9NINE SOFTWARE LTD(상호: IGNITE AI)입니다. 다만 당사가 다른 당사자를 대신하여만 데이터를 처리하는 경우는 제외됩니다.',
      },
      { type: 'p', text: `등록 주소: ${ADDRESS}` },
      { type: 'p', text: '개인정보 관련 질문 및 요청: privacy@ignitehub.app.' },
    ],
    s3ExtraBullet:
      '적절한 경우 집계되거나 기술적인 사용 신호를 사용하여 안정성과 제품 기능을 개선합니다.',
    s3NoAds:
      '당사는 귀하의 개인정보를 판매하지 않습니다. 건강, 영양, 식사 또는 운동 데이터를 타겟 광고에 사용하지 않습니다. 교차 맥락 행동 광고를 위해 개인정보를 공유하지 않습니다.',
    s7: {
      title: '7. 정보 공유 방법',
      blocks: [
        {
          type: 'p',
          text: '당사는 다음 범주의 수신자와 개인정보를 공유할 수 있습니다(개별 공급업체 이름을 모두 나열하지는 않습니다).',
        },
        {
          type: 'ul',
          items: [
            '데이터 호스팅 및 저장, 사용자 인증, AI 요청 처리, 알림 전달, 고객 지원, 서비스 운영 또는 개선을 돕는 서비스 제공업체(예: 클라우드 호스팅, 인증, 스토리지, AI 인프라, 앱 운영에 필요한 제품 분석).',
            '앱 플랫폼: Apple 및 Google 스토어를 통해 로그인하거나 구독을 구매하는 경우. 결제 카드 정보는 해당 플랫폼이 처리하며, 당사는 귀하의 전체 결제 카드 정보를 받지 않습니다.',
            '건강 플랫폼: Apple Health 및/또는 Health Connect(연결을 선택하고 권한을 부여한 경우에만). 동기화한 건강 데이터는 당사가 마케팅이나 광고에 사용하지 않습니다.',
            '귀하가 상호작용하기로 선택한 다른 사용자: 친구 및 비공개 그룹 구성원(친구 기능을 통해 공유하는 콘텐츠 및 프로필 정보).',
            '법률에 의해 요구되거나 권리, 안전 및 보안을 보호하기 위해 당국, 규제 기관 또는 기타 기관.',
          ],
        },
        {
          type: 'p',
          text: '우리는 식품 정보를 검색하기 위해 공공 영양 데이터베이스를 사용할 수 있습니다. 당사는 귀하의 개인 데이터를 제3자 데이터 브로커에게 판매하지 않습니다.',
        },
        {
          type: 'p',
          text: '당사 사업이 재편되는 경우, 적절한 보호 조치와 함께 해당 과정의 일부로 정보를 이전할 수 있습니다.',
        },
      ],
    },
  },
  zh: {
    lastUpdated: '最后更新：2026年8月3日',
    intro:
      '本隐私政策说明 9NINE SOFTWARE LTD（以 IGNITE AI 名义经营，以下简称“IGNITE”“我们”或“本公司”）在您使用 IGNITE AI 移动应用程序及相关服务（以下简称“服务”）时，如何收集、使用、存储和共享个人信息。我们在英国运营。本政策应与我们的使用条款一并阅读。',
    s1: [
      {
        type: 'p',
        text: '本政策所述个人信息的控制者为在英国注册的 9NINE SOFTWARE LTD（以 IGNITE AI 名义经营），但我们仅代表其他方处理数据的情况除外。',
      },
      { type: 'p', text: `注册地址：${ADDRESS}` },
      { type: 'p', text: '隐私问题与请求：privacy@ignitehub.app。' },
    ],
    s3ExtraBullet: '在适当情况下，使用汇总或技术性使用信号改进可靠性和产品功能。',
    s3NoAds:
      '我们不会出售您的个人信息。我们不会将您的健康、营养、餐食或锻炼数据用于定向广告。我们不会为跨情境行为广告共享个人信息。',
    s7: {
      title: '7. 我们如何共享信息',
      blocks: [
        {
          type: 'p',
          text: '我们可能与以下类别的接收方共享个人信息（我们不会逐一列出每个供应商名称）：',
        },
        {
          type: 'ul',
          items: [
            '协助我们托管和存储数据、验证用户、处理 AI 请求、发送通知、提供客户支持以及运营或改进服务的服务提供商（例如云托管、身份验证、存储、AI 基础设施，以及运行应用所需的产品分析）。',
            '应用平台：当您通过 Apple 或 Google 商店登录或购买订阅时。支付卡信息由这些平台处理；我们不会收到您的完整支付卡信息。',
            '健康平台：Apple Health 和/或 Health Connect，仅当您选择连接并授予权限时。您同步的健康数据不会被我们用于营销或广告。',
            '您选择互动的其他用户：好友和私密群组成员，就其通过好友功能分享的内容和资料信息。',
            '法律要求或为保护权利、安全和保障时，与主管机关、监管机构或其他方共享。',
          ],
        },
        {
          type: 'p',
          text: '我们可能使用公开营养数据库查询食物信息。我们不会向第三方数据经纪商出售您的个人数据。',
        },
        {
          type: 'p',
          text: '如本公司进行重组，我们可能在采取适当保障措施的情况下，将信息作为该流程的一部分转移。',
        },
      ],
    },
  },
}

// pt-br: same as pt (site previously mirrored PT); keep BR-friendly wording already in pt formal style
patch['pt-br'] = {
  ...patch.pt,
  lastUpdated: 'Última atualização: 3 de agosto de 2026',
}

function applyLocalePatch(privacy, p) {
  privacy.lastUpdated = p.lastUpdated
  privacy.intro = p.intro
  privacy.sections[0].blocks = p.s1

  const s3 = privacy.sections[2]
  const ul = s3.blocks.find((b) => b.type === 'ul')
  if (ul && Array.isArray(ul.items)) {
    const already = ul.items.some(
      (i) =>
        i.includes(p.s3ExtraBullet.slice(0, 24)) ||
        /fiabilidade|fiabilidad|fiabilité|Zuverlässigkeit|affidabilità|betrouwbaarheid|pålitelighet|tillförlitlighet|信頼性|안정성|可靠性|reliability/i.test(
          i,
        ),
    )
    if (!already) ul.items.push(p.s3ExtraBullet)
  }
  // Replace the short "we do not sell health/meal for ads" paragraph
  for (const b of s3.blocks) {
    if (b.type !== 'p') continue
    const t = b.text || ''
    if (
      /sell|vend|verkauf|vendiamo|verkopen|selger|säljs|販売|판매|出售/i.test(t) &&
      /advert|publicid|werb|pubblicit|reklame|reklam|広告|광고|广告/i.test(t)
    ) {
      b.text = p.s3NoAds
      break
    }
  }

  // Replace section 7 (index 6)
  privacy.sections[6] = p.s7
  return privacy
}

function writeLegal(locale, privacy) {
  for (const dir of ['content', 'public/i18n']) {
    const file = path.join(root, dir, locale, 'legal.json')
    if (!fs.existsSync(file)) {
      console.warn('missing', file)
      continue
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    data.privacyPolicy = privacy
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
  }
  console.log('ok', locale)
}

for (const locale of Object.keys(patch)) {
  const p = patch[locale]
  if (!p) continue
  const file = path.join(root, 'content', locale, 'legal.json')
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  const privacy = applyLocalePatch(structuredClone(data.privacyPolicy), p)
  writeLegal(locale, privacy)
}

console.log('privacy update complete')
