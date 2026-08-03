export const faqFr = {
  title: 'FAQ',
  subtitle: 'Les questions que notre équipe support reçoit le plus souvent.',
  seeAll: 'Voir toutes les FAQ',
  backHome: '← Accueil',
  pageTitle: 'Questions fréquentes',
  pageSubtitle:
    'Facturation, suivi des repas, entraînements, sync Health et dépannage.',
  contactTitle: 'Toujours bloqué ?',
  contactBody:
    'Écrivez-nous à support@ignitehub.app ou via le formulaire de contact. Nous répondons généralement sous 1 à 2 jours ouvrés.',
  contactLink: 'Nous contacter',
  teaser: [
    {
      q: 'Pourquoi vois-je encore un paywall après avoir payé ?',
      a: 'Les abonnements sont gérés par Apple ou Google, pas directement par nous. Ouvrez l’app connecté au même compte App Store ou Google Play utilisé à l’achat, puis essayez Restore Purchases dans Réglages. Si ça échoue encore, écrivez à support@ignitehub.app avec votre reçu de la boutique.',
    },
    {
      q: 'Comment annuler mon abonnement ou ma période d’essai ?',
      a: 'Annulez à tout moment dans les réglages de la boutique de votre appareil. Sur iPhone : Réglages → [Votre nom] → Abonnements → IGNITE AI → Annuler. Sur Android : Google Play → Paiements et abonnements → Abonnements → IGNITE AI → Annuler. Annulez avant la fin de l’essai ou du renouvellement pour éviter le prochain prélèvement.',
    },
    {
      q: 'Je veux un remboursement. Comment faire ?',
      a: 'Les remboursements dépendent de l’endroit où vous avez acheté l’abonnement :',
      bullets: [
        'Apple App Store : Apple gère cela directement.',
        'Google Play : Idem, demandez-le via Google.',
        'Besoin d’aide pour trouver la bonne page ? Écrivez à support@ignitehub.app.',
      ],
      links: [
        {
          label: 'Demander un remboursement à Apple',
          href: 'https://support.apple.com/118223',
        },
        {
          label: 'Demander un remboursement Google Play',
          href: 'https://support.google.com/googleplay/answer/2479637',
        },
      ],
    },
    {
      q: 'L’IA a mal scanné mon repas. Que faire ?',
      a: 'Après l’analyse du repas, ouvrez-le depuis Recently uploaded, ajustez-le avec les options disponibles, puis enregistrez vos modifications.',
    },
    {
      q: 'L’app plante ou ne s’ouvre pas. Que tenter ?',
      a: 'Forcez la fermeture de l’app, redémarrez votre téléphone et vérifiez que vous avez la dernière version sur l’App Store / Play Store. Si ça plante encore, indiquez-nous le modèle, la version du système et à peu près quand cela arrive à support@ignitehub.app pour que nous puissions enquêter.',
    },
    {
      q: 'Mes pas ou les données Apple Health / Health Connect ne s’affichent pas.',
      a: 'Vérifiez que les autorisations Santé sont activées pour IGNITE AI (Apple Health sur iOS, Health Connect sur Android), que les apps sources synchronisent et que vous avez autorisé les pas/l’activité. Ouvrez IGNITE AI une fois après avoir accordé l’accès pour lancer une sync. Si les chiffres restent bloqués, révoquez puis réaccordez les autorisations, puis rouvrez l’app.',
    },
  ],
  categories: [
    {
      title: 'Abonnements et facturation',
      items: [
        {
          q: 'Pourquoi vois-je encore un paywall après avoir payé ?',
          a: 'Les abonnements sont gérés par Apple ou Google, pas directement par nous. Ouvrez l’app connecté au même compte App Store ou Google Play utilisé à l’achat, puis essayez Restore Purchases dans Réglages. Si ça échoue encore, écrivez à support@ignitehub.app avec votre reçu de la boutique.',
        },
        {
          q: 'Comment annuler mon abonnement ou ma période d’essai ?',
          a: 'Annulez à tout moment dans les réglages de la boutique de votre appareil. Sur iPhone : Réglages → [Votre nom] → Abonnements → IGNITE AI → Annuler. Sur Android : Google Play → Paiements et abonnements → Abonnements → IGNITE AI → Annuler. Annulez avant la fin de l’essai ou du renouvellement pour éviter le prochain prélèvement.',
        },
        {
          q: 'Je veux un remboursement. Comment faire ?',
          a: 'Les remboursements dépendent de l’endroit où vous avez acheté l’abonnement :',
          bullets: [
            'Apple App Store : Apple gère cela directement.',
            'Google Play : Idem, demandez-le via Google.',
            'Besoin d’aide pour trouver la bonne page ? Écrivez à support@ignitehub.app.',
          ],
          links: [
            {
              label: 'Demander un remboursement à Apple',
              href: 'https://support.apple.com/118223',
            },
            {
              label: 'Demander un remboursement Google Play',
              href: 'https://support.google.com/googleplay/answer/2479637',
            },
          ],
        },
        {
          q: 'Serai-je facturé à nouveau après mon essai ?',
          a: 'Oui, si vous n’annulez pas avant la fin de l’essai, l’abonnement se renouvelle automatiquement au tarif affiché à l’inscription. Vous recevrez des rappels de la boutique selon les règles Apple/Google. Gérez ou annulez à tout moment dans vos abonnements de la boutique.',
        },
        {
          q: 'Je me suis abonné sur iPhone mais j’utilise Android (ou l’inverse).',
          a: 'Les abonnements de boutique ne se transfèrent pas entre Apple et Google. Il vous faudra un abonnement actif sur la boutique de l’appareil que vous utilisez, ou contactez le support si vous changez de plateforme et avez besoin d’aide.',
        },
      ],
    },
    {
      title: 'Suivi des repas et IA',
      items: [
        {
          q: 'L’IA a mal scanné mon repas. Que faire ?',
          a: 'Après l’analyse du repas, ouvrez-le depuis Recently uploaded, ajustez-le avec les options disponibles, puis enregistrez vos modifications.',
        },
        {
          q: 'Quelle est la précision des estimations de calories et macros ?',
          a: 'IGNITE AI est conçu pour être le meilleur du marché à identifier visuellement les ingrédients. Les macros correspondent au poids de chaque ingrédient, et ce poids est une estimation approximative. Dès que possible, ajustez le poids au montant réel si vous pesez vos aliments.',
        },
        {
          q: 'Puis-je enregistrer sans prendre de photo ?',
          a: 'Oui. Dans Quick log, vous pouvez saisir une description, utiliser la voix ou scanner un code-barres ou une étiquette nutritionnelle. La photo est optionnelle.',
        },
        {
          q: 'Puis-je modifier un repas après l’avoir enregistré ?',
          a: 'Oui. Ouvrez le repas enregistré et modifiez les aliments, portions ou totaux. Les changements mettent à jour vos calories et macros du jour.',
        },
        {
          q: 'Puis-je sauvegarder un repas pour le réenregistrer plus tard ?',
          a: 'Oui. Ouvrez un repas enregistré et touchez l’icône de sauvegarde. Il apparaîtra sous Diet → Saved. Quand vous voulez le même repas, allez-y et touchez Log. Pas besoin de photographier à chaque fois que vous mangez la même chose.',
        },
      ],
    },
    {
      title: 'Entraînements',
      items: [
        {
          q: 'Comment enregistrer une séance ?',
          a: 'Sur l’écran d’accueil, touchez le bouton « + » et choisissez Log workout. Vous verrez plusieurs options. Prenez celle qui vous convient le mieux. Les séances sont enregistrées et estiment les calories brûlées selon votre profil.',
        },
        {
          q: 'Les séances ajustent-elles mon objectif calorique automatiquement ?',
          a: 'L’activité que vous enregistrez (et les données Health éligibles synchronisées) alimentent votre tableau de progression. Considérez les objectifs caloriques comme des repères. Ajustez-les dans les réglages si votre charge d’entraînement change.',
        },
        {
          q: 'Puis-je modifier ou supprimer une séance ?',
          a: 'Oui. Ouvrez la séance depuis votre historique et modifiez-la ou supprimez-la pour garder vos stats exactes.',
        },
      ],
    },
    {
      title: 'Apple Health et Health Connect',
      items: [
        {
          q: 'Mes pas ou données Santé ne s’affichent pas.',
          a: 'Vérifiez que les autorisations Santé sont activées pour IGNITE AI (Apple Health sur iOS, Health Connect sur Android), que les apps sources synchronisent et que vous avez autorisé les pas/l’activité. Ouvrez IGNITE AI une fois après avoir accordé l’accès pour lancer une sync. Si les chiffres restent bloqués, révoquez puis réaccordez les autorisations, puis rouvrez l’app.',
        },
        {
          q: 'Quelles données IGNITE AI lit-il ?',
          a: 'Avec votre permission, IGNITE AI peut lire les données ci-dessous. Vous contrôlez les catégories dans Apple Health ou Health Connect et pouvez révoquer l’accès à tout moment dans les réglages système.',
          bullets: [
            'Pas',
            'Fréquence cardiaque moyenne',
            'Oxygène sanguin',
            'Sommeil (y compris les phases de sommeil)',
          ],
        },
        {
          q: 'Pourquoi les chiffres ne correspondent pas à ma montre ou l’app Santé ?',
          a: 'Les sources peuvent différer (téléphone vs montre) et la sync n’est pas toujours instantanée. Vérifiez quelle app est la source principale dans Health / Health Connect, puis tirez pour actualiser ou rouvrez IGNITE AI.',
        },
      ],
    },
    {
      title: 'Coach, amis et partage',
      items: [
        {
          q: 'Comment fonctionnent Amis ou le partage en groupe ?',
          a: 'Invitez des personnes depuis la zone Amis avec votre flux d’invitation. Une fois connectés, vous pouvez partager repas, séances ou réussites selon ce que vous choisissez de publier. Vous contrôlez ce qui est visible.',
        },
        {
          q: 'Que sont les Share Cards ?',
          a: 'Share Cards sont des instantanés stylisés de repas, séries ou victoires que vous pouvez envoyer à des amis ou publier sur les réseaux. Choisissez un thème, générez la carte, puis partagez depuis le menu de partage de votre appareil.',
        },
        {
          q: 'Puis-je arrêter de partager avec quelqu’un ?',
          a: 'Oui. Retirez la personne de votre liste d’amis/groupe ou quittez le groupe partagé dans les réglages Amis pour que les prochaines publications ne lui soient plus partagées.',
        },
      ],
    },
    {
      title: 'Problèmes avec l’app',
      items: [
        {
          q: 'L’app plante ou ne s’ouvre pas. Que tenter ?',
          a: 'Forcez la fermeture de l’app, redémarrez votre téléphone et vérifiez que vous avez la dernière version sur l’App Store / Play Store. Si ça plante encore, indiquez-nous le modèle, la version du système et à peu près quand cela arrive à support@ignitehub.app pour que nous puissions enquêter.',
        },
        {
          q: 'Problèmes de connexion ou de compte',
          a: 'Vérifiez que vous utilisez la même méthode de connexion qu’avant (Apple, Google ou e-mail). Si un code ou un lien magique n’arrive pas, consultez les spams et attendez une minute avant d’en demander un autre. Toujours bloqué ? Écrivez à support@ignitehub.app depuis l’adresse du compte.',
        },
        {
          q: 'Les notifications n’arrivent pas',
          a: 'Activez les notifications pour IGNITE AI dans les Réglages système et vérifiez les rappels dans l’app. Le mode Économie d’énergie / les économiseurs de batterie peuvent retarder les alertes sur certains téléphones.',
        },
      ],
    },
  ],
} as const
