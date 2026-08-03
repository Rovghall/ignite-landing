import type { Messages } from './en'
import { faqFr } from './faq-fr'

export const fr = {
  lang: {
    chooseLanguage: 'Choisir la langue',
    close: 'Fermer',
  },
  nav: {
    home: 'Accueil',
    press: 'Presse',
    blogs: 'Blog',
    main: 'Principal',
    homeAria: 'Accueil IGNITE AI',
    closeMenu: 'Fermer le menu',
    openMenu: 'Ouvrir le menu',
  },
  hero: {
    headline: 'Conçu pour rendre le progrès évident.',
    description:
      'IGNITE AI est une app propulsée par l’IA pour photographier vos repas et obtenir calories et macros à l’instant, enregistrer vos séances et partager vos progrès avec vos amis. Une app pour vous nourrir, vous entraîner et rester régulier.',
    tagline: 'Photo. Suivi. Objectif.',
    introAria: 'Présentation d’IGNITE AI',
  },
  howItWorks: {
    title: 'Comment ça marche',
    steps: [
      {
        title: 'Photographiez, scannez ou décrivez',
        description:
          'Depuis Quick log, photographiez un repas, scannez un code-barres ou une étiquette, saisissez-le ou utilisez la voix. Choisissez le chemin qui vous convient.',
      },
      {
        title: 'Obtenez calories et macros',
        description:
          'L’IA estime la nutrition. Les photos et scans réussis peuvent s’enregistrer tout de suite. Modifiez à tout moment.',
      },
      {
        title: 'Entraînez-vous, suivez, restez régulier',
        description:
          'Atteignez vos objectifs quotidiens de calories et macros, enregistrez vos séances et partagez repas ou réussites avec Share Cards, avec vos amis du groupe ou sur les réseaux.',
      },
    ],
  },
  features: {
    ariaLabel: 'Fonctionnalités',
    closingNote: 'Plus le jeûne, les rapports PDF, les stats et bien plus dans l’app.',
    items: [
      {
        id: 'meal',
        eyebrow: 'Suivi des repas par IA',
        title: 'Photo en entrée. Macros en sortie.',
        description:
          'Pointez votre caméra vers n’importe quelle assiette : IGNITE AI identifie les aliments et estime calories et macros. Plus besoin de chasser les codes-barres ni de parcourir des bases de données.',
        bullets: [
          'Photographiez ou décrivez n’importe quel repas',
          'Estimations instantanées de calories et macros',
          'Modifiez et confirmez en un tap',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: 'Objectifs nutritionnels quotidiens',
        title: 'Sachez exactement ce qu’il reste aujourd’hui.',
        description:
          'Votre anneau de calories et les protéines, glucides et lipides restants se mettent à jour à chaque enregistrement. Un coup d’œil suffit pour savoir quoi manger ensuite.',
        bullets: [
          'Anneau de calories en un coup d’œil',
          'Protéines, glucides et lipides restants',
          'Objectifs ajustés à votre cible',
        ],
        screenshotLabel: 'Objectifs du jour',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: 'Pas, rythme cardiaque, sommeil : tout synchronisé.',
        description:
          'Connectez Apple Health ou Health Connect pour récupérer les données que votre montre et votre téléphone suivent déjà : pas, calories actives, rythme cardiaque (BPM), sommeil et séances. IGNITE les intègre à votre budget quotidien pour que chaque mouvement compte.',
        bullets: [
          'Pas, BPM, sommeil et exercice synchronisés automatiquement',
          'Calories actives depuis Apple Health et Health Connect',
          'Un seul endroit pour activité et nutrition',
        ],
        screenshotLabel: 'Séances',
      },
      {
        id: 'workout',
        eyebrow: 'Suivi des séances',
        title: 'Enregistrez toute séance. Dépenses personnalisées.',
        description:
          'Choisissez parmi les types d’exercice intégrés à IGNITE : musculation, course, vélo, HIIT, natation et plus. La dépense calorique est estimée à partir de votre taille, poids et profil, pour un chiffre qui vous correspond, pas une moyenne générique.',
        bullets: [
          'Plusieurs types d’exercice prêts à enregistrer',
          'Dépenses calculées selon taille, poids et niveau d’activité',
          'Calories de séance ajoutées à votre budget quotidien',
        ],
        screenshotLabel: 'Journal d’entraînement',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: 'Transformez vos logs en cartes prêtes pour Stories.',
        description:
          'Les Share Cards repas et entraînement affichent votre photo avec calories, macros ou stats de séance. Choisissez parmi plus de 55 thèmes, modifiez le titre ou laissez l’IA en suggérer un, puis partagez sur Instagram, TikTok et plus encore.',
        bullets: [
          'Plus de 55 thèmes pour repas et entraînements',
          'Calories, macros et stats de séance sur la carte',
          'Modifiez le texte ou utilisez les suggestions IA',
          'Partagez sur Instagram, TikTok et au-delà',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: 'Amis et partage',
        title: 'Le progrès n’a pas le même goût entre amis.',
        description:
          'Créez un groupe avec vos amis, partagez repas et séances, et rivalisez pour la meilleure série de votre cercle.',
        bullets: [
          'Créez des groupes entre amis',
          'Partagez repas, séances et logs',
          'Visez la série n° 1',
        ],
        screenshotLabel: 'Fil d’amis',
      },
      {
        id: 'coach',
        eyebrow: 'Coach IGNITE AI',
        title: 'Des réponses nutrition, à la demande.',
        description:
          'Discutez avec le coach IA intégré pour des conseils sur les repas, les macros et quoi manger ensuite.',
        bullets: [
          'Posez toutes vos questions nutrition',
          'Suggestions personnalisées',
          'Disponible 24 h/24 dans l’app',
        ],
        screenshotLabel: 'Chat AI Coach',
      },
      {
        id: 'streaks',
        eyebrow: 'Séries et badges',
        title: 'La régularité, gamifiée.',
        description:
          'Débloquez des succès en enregistrant et en vous entraînant. Les séries rendent le rendez-vous quotidien presque automatique.',
        bullets: [
          'Séries de suivi quotidiennes',
          'Badges de réussite',
          'Des jalons à partager',
        ],
        screenshotLabel: 'Séries et badges',
      },
    ],
  },
  themes: {
    title: 'Trois looks. Le même IGNITE.',
    subtitle: 'Passez de Light à Glow ou Dark à tout moment dans Apparence.',
    alt: 'Thème {name} d’IGNITE AI',
    items: {
      light: {
        name: 'Light',
        description: 'Toile mesh claire pour le suivi du quotidien.',
      },
      dark: {
        name: 'Dark',
        description: 'Mode nuit charbon pour la faible lumière.',
      },
      glow: {
        name: 'Glow',
        description: 'Lavis doux de coucher de soleil, profondeur chaude.',
      },
    },
  },
  socialProof: {
    title: 'Conçu pour ceux qui veulent des résultats, pas des tableurs.',
    stats: [
      'précision d’ID sur assiettes nettes',
      'thèmes Share Card',
      'signaux santé synchronisés',
      'types d’exercice à enregistrer',
    ],
  },
  finalCta: {
    title: 'Commencez à rendre le progrès évident.',
    tagline: 'Photo. Suivi. Objectif.',
    ratingAria: 'Note de 5 étoiles',
  },
  footer: {
    legal: 'Mentions légales',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions d’utilisation',
    company: 'Entreprise',
    contact: 'Contact',
    faq: 'FAQ',
    copyright: '© Copyright {year}, Tous droits réservés',
    disclaimer:
      'IGNITE AI fournit uniquement des informations générales sur le bien-être et le fitness. Ce n’est pas un avis médical. Consultez un professionnel de santé avant de modifier votre alimentation ou votre routine d’exercice.',
  },
  contact: {
    backHome: '← Accueil',
    title: 'Contactez-nous',
    subtitle: 'Envoyez-nous un message et nous vous répondrons bientôt.',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    message: 'Message',
    required: 'obligatoire',
    submit: 'Envoyer →',
    sending: 'Envoi…',
    success: 'Merci. Votre message a été envoyé. Nous vous répondrons bientôt.',
    error: 'Une erreur est survenue. Réessayez.',
  },
  press: {
    title: 'Presse',
    subtitle:
      'Contactez notre équipe presse pour les demandes médias, interviews et communiqués.',
    email: 'Adresse e-mail',
    subject: 'Objet',
    message: 'Message',
    emailPlaceholder: 'votre.email@exemple.com',
    subjectPlaceholder: 'Objet de la demande média',
    messagePlaceholder:
      'Précisez les détails de votre demande média, notamment le délai, les informations sur le média et les questions auxquelles vous souhaitez une réponse...',
    submit: 'Envoyer la demande presse',
    sending: 'Envoi…',
    success: 'Merci. Votre demande presse a été envoyée. Nous vous répondrons bientôt.',
    error: 'Une erreur s’est produite. Veuillez réessayer.',
  },
  blog: {
    title: 'Notre blog',
    subtitle: 'suivez pour les actus',
    back: '← Blog',
    asideTagline: 'Photo. Suivi. Objectif.',
    asideBody: 'Téléchargez IGNITE AI : macros, entraînements et progrès qui méritent d’être partagés.',
  },
  legal: {
    backHome: '← Accueil',
    related: 'Lié :',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions d’utilisation',
  },
  faq: faqFr,
  comingSoon: {
    title: "Bientôt disponible",
    subtitle:
      "Nous mettons la dernière touche à IGNITE AI. Accès privé uniquement pour le moment.",
    tagline: "Photo. Suivi. Objectif.",
    wrongPassword: 'Mot de passe incorrect. Réessayez.',
    genericError: 'Une erreur s’est produite. Réessayez.',
    password: 'Mot de passe',
    enter: 'Entrer',
  },
} as const satisfies Messages
