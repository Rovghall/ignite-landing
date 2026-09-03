import type { Locale } from '@/lib/i18n/locales'
import type { CreatorOutreachContent } from '@/lib/creator-outreach-content'

const ptBr: CreatorOutreachContent = {
  metaTitle: 'Creators — detalhes da parceria | IGNITE AI',
  metaDescription:
    'Monetize sua audiência com IGNITE AI: {reward} por adesão anual, plano exclusivo a {annual} para seguidores, grupo privado no app e acompanhamento de recompensas ao vivo.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Monetize sua audiência e construa sua comunidade fitness dentro do app',
  subtitle:
    'Ganhe {reward} por cada adesão anual elegível. Sua audiência acessa o plano anual mais barato a {annual} — só disponível com o seu código — e você acompanha tudo em tempo real.',
  primaryCta: 'Candidate-se como creator em 60 segundos',
  secondaryCta: 'Ver termos do creator',
  heroPoints: [
    '{reward} por cada nova assinatura anual Premium elegível',
    'Sua audiência acessa o plano anual a {annual} — só disponível com o seu código',
    '3 meses de acesso VIP gratuito para testar o app',
  ],
  economyCreatorTitle: 'O que você ganha',
  economyCreator: [
    '{reward} de comissão fixa por adesão anual',
    '3 meses de acesso VIP gratuito, renováveis',
    'Badge de Creator verificado ao lado do seu nome de perfil',
    'Possibilidade de criar um grupo "Creator" exclusivo dentro do app',
    'Painel no app para uso do código, recompensas e acompanhamento de payout',
  ],
  economyAudienceTitle: 'O que sua audiência ganha',
  economyAudience: [
    'Acesso ao plano anual mais barato do app: {annual} — exclusivo com o seu código',
    'Acesso ao seu grupo privado dentro do app',
    'Chat, feed de refeições/treinos e leaderboard de consistência',
  ],
  appTrackingTitle: 'Acompanhe tudo no app',
  appTrackingIntro:
    'Essas telas mostram exatamente como creators veem o código, seguidores atribuídos, status das recompensas e o fluxo de payout dentro da IGNITE AI.',
  appTrackingSteps: [
    {
      title: '1. Código + visão geral',
      body: 'Compartilhe seu código de creator e veja na hora quantas pessoas usaram, além de recompensas pendentes vs pagas.',
      src: '/creators/creator1.png',
      alt: 'Tela do Creator Program com código, recompensas pendentes e recompensas pagas',
    },
    {
      title: '2. Ganhos + payout',
      body: 'Filtre por período, acompanhe receita desbloqueada, salve o PayPal e peça payout quando estiver elegível.',
      src: '/creators/creator2.png',
      alt: 'Tela de ganhos e payout do creator com pedido de payout via PayPal',
    },
    {
      title: '3. Histórico da audiência',
      body: 'Veja o status de cada seguidor com clareza: signed up, premium trial, ready to request ou paid.',
      src: '/creators/creator3.png',
      alt: 'Tela de histórico da audiência com atribuição e status dos seguidores',
    },
  ],
  appOverview: {
    title: 'O app de perto',
    body: 'Dashboard principal: calorias restantes, macros (proteína, carboidratos, gordura), hidratação, sync com Apple Health, calorias queimadas e refeições registradas com foto — tudo em uma só tela.',
    src: '/dark.png',
    alt: 'Dashboard IGNITE AI com calorias, macros, refeições e Apple Health',
  },
  groupScreens: [
    {
      title: 'Chat do grupo',
      body: 'Uma comunidade privada dentro da IGNITE. Seus seguidores conversam entre si, compartilham receitas, tiram dúvidas e mantêm-se accountable. Reações e respostas como em uma rede social.',
      src: '/g1.png',
      alt: 'Aba Chat do Creator Group com mensagens, reações e respostas',
    },
    {
      title: 'Feed de refeições e treinos',
      body: 'Cada vez que um membro do grupo registra uma refeição ou treino, aparece automaticamente no feed — com foto, calorias, macros e duração. Sua audiência vê exatamente o que você come e treina.',
      src: '/g2.png',
      alt: 'Aba Feed do Creator Group com um post de treino de caiaque, calorias e reações',
    },
    {
      title: 'Leaderboard de consistência',
      body: 'Ranking automático de quem mais registra dentro do grupo. Gamifique sua comunidade e incentive consistência — os membros querem subir no leaderboard.',
      src: '/g3.png',
      alt: 'Aba Leaderboard do Creator Group com ranking de consistência por streak',
    },
  ],
  groupsTitle: 'Creator Groups',
  groupsIntro:
    'Creators aceitos recebem uma badge de verificado ao lado do nome do perfil. Quando aprovado, você configura seu grupo privado dentro da IGNITE. Convide sua audiência por código ou link e eles entram na sua comunidade com 3 abas:',
  processTitle: 'Como funciona',
  processSteps: [
    'Baixe o app, vá em Profile → Creator Program e candidate-se. Se for aprovado, você recebe 3 meses de VIP mais o seu código personalizado de creator.',
    'Lance seu grupo privado dentro do app — opcional, mas uma ótima ideia se fizer sentido para a sua marca e audiência.',
    'Crie conteúdo para as redes: meal scans, share cards das suas refeições e treinos, stories e posts — e compartilhe o código para novos usuários inserirem no onboarding.',
    'Acompanhe cadastros, status e payouts na tela Creator Program.',
  ],
  shareCardsTitle: 'Share Cards para suas redes',
  shareCardsBody:
    'Cada refeição ou treino que você registra pode virar um card pronto para postar: foto, calorias, macros ou duração, com temas editáveis. Perfeito para stories, Reels e posts — e um lugar natural para colocar o seu código de creator.',
  shareCards: [
    {
      title: 'Meal Share Card',
      body: 'Transforme um meal scan em um visual com macros e uma frase de impacto — escolha o tema e compartilhe em segundos.',
      src: '/share_meal.png',
      alt: 'Share cards de refeição IGNITE AI com macros e temas',
    },
    {
      title: 'Workout Share Card',
      body: 'Compartilhe seu treino com kcal, duração e um título forte — pronto para stories.',
      src: '/share_workout.png',
      alt: 'Share cards de treino IGNITE AI com kcal e duração',
    },
  ],
  calculatorTitle: 'Calculadora rápida de ganhos',
  calculatorBody: 'Mova o slider para estimar quanto adesões anuais elegíveis poderiam gerar por mês.',
  calculatorLabel: 'Adesões anuais / mês',
  calculatorSuffix: 'adesões',
  calculatorResultPrefix: 'Potencial mensal',
  calculatorResultSuffix: 'em comissões',
  codeRulesTitle: 'Regras do código',
  codeRules: [
    'Válido apenas para o Premium anual.',
    'Somente novos usuários: contas que nunca tiveram nenhuma assinatura Premium da IGNITE AI.',
    'Não conta: renovações, reativações, upgrades de ex-Premium ou outros planos.',
    'A comissão de {reward} aplica-se apenas à primeira assinatura anual elegível com o seu código.',
    'Creators acompanham tudo no app; o payout é solicitado após a janela de validação.',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'Para quem é o app IGNITE?',
      a: 'Para quem tem um objetivo de peso (emagrecer, manter ou ganhar) e quer uma estimativa aproximada do que está comendo em calorias e macros, com tracking de refeições e treinos.',
    },
    {
      q: 'Para que serve o app IGNITE?',
      a: 'É um app de fitness e nutrição: scans de refeições com IA (calorias e macros), registro de treinos, tracking de progresso, sync com Health e ferramentas para manter consistência no dia a dia.',
    },
    {
      q: 'O que minha audiência ganha?',
      a: 'Acesso ao plano anual mais barato do app ({annual}), só com o seu código, mais o seu grupo privado: chat, feed de refeições/treinos e leaderboard de consistência.',
    },
    {
      q: 'Quanto eu ganho por conversão?',
      a: 'Você ganha {reward} fixos por cada nova assinatura anual Premium elegível feita com o seu código.',
    },
    {
      q: 'O que eu faço depois de ser aprovado?',
      a: 'Você recebe VIP + código, lança seu grupo Creator, compartilha o código (stories, Share Cards, posts) e acompanha conversões e payouts na tela Creator Program.',
    },
    {
      q: 'Como o acesso VIP é renovado?',
      a: 'Os 3 primeiros meses existem para você testar o app direito. Podemos renovar enquanto a parceria estiver ativa e alinhada.',
    },
    {
      q: 'Onde os seguidores colocam o meu código?',
      a: 'No onboarding, no primeiro cadastro. O código é pensado para novos usuários e apenas para o plano anual.',
    },
    {
      q: 'Quando eu recebo?',
      a: 'Depois da janela de validação do pagamento. Quando a recompensa fica elegível, aparece como ready to request e você pode pedir o payout.',
    },
  ],
  ctaTitle: 'Próximo passo',
  ctaBody: 'Candidate-se no app e comece a compartilhar.',
  ctaSteps: [
    'Baixe o IGNITE AI',
    'Abra Profile → Creator program → Apply',
    'Receba seu código e comece a compartilhar',
  ],
  termsLink: 'Termos do Creator Program',
  publicProgramLink: 'Página pública do Creator Program',
  contactEmail: 'hello@ignitehub.app',
}

const es: CreatorOutreachContent = {
  metaTitle: 'Creators — detalles de la colaboración | IGNITE AI',
  metaDescription:
    'Monetiza tu audiencia con IGNITE AI: {reward} por alta anual, plan exclusivo a {annual} para seguidores, grupo privado en la app y seguimiento de recompensas en vivo.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Monetiza tu audiencia y construye tu comunidad fitness dentro de la app',
  subtitle:
    'Gana {reward} por cada alta anual elegible. Tu audiencia obtiene el plan anual más bajo a {annual} — solo disponible con tu código — y tú lo sigues todo en tiempo real.',
  primaryCta: 'Solicita ser creator en 60 segundos',
  secondaryCta: 'Ver términos del creator',
  heroPoints: [
    '{reward} por cada nueva suscripción anual Premium elegible',
    'Tu audiencia obtiene el plan anual a {annual} — solo disponible con tu código',
    '3 meses de acceso VIP gratis para probar la app',
  ],
  economyCreatorTitle: 'Lo que tú obtienes',
  economyCreator: [
    '{reward} de comisión fija por alta anual',
    '3 meses de acceso VIP gratis, renovables',
    'Badge de Creator verificado junto a tu nombre de perfil',
    'Posibilidad de crear un grupo "Creator" exclusivo dentro de la app',
    'Panel en la app para uso del código, recompensas y seguimiento de payouts',
  ],
  economyAudienceTitle: 'Lo que obtiene tu audiencia',
  economyAudience: [
    'Acceso al plan anual más barato de la app: {annual} — exclusivo con tu código',
    'Acceso a tu grupo privado dentro de la app',
    'Chat, feed de comidas/entrenos y leaderboard de consistencia',
  ],
  appTrackingTitle: 'Controla todo en la app',
  appTrackingIntro:
    'Estas pantallas muestran exactamente cómo los creators ven su código, seguidores atribuidos, estado de recompensas y flujo de payout dentro de IGNITE AI.',
  appTrackingSteps: [
    {
      title: '1. Código + resumen',
      body: 'Comparte tu código de creator y ve al instante cuántas personas lo usaron, más recompensas pendientes frente a pagadas.',
      src: '/creators/creator1.png',
      alt: 'Pantalla del Creator Program con código, recompensas pendientes y recompensas pagadas',
    },
    {
      title: '2. Ganancias + payout',
      body: 'Filtra por periodo, sigue los ingresos desbloqueados, guarda tu PayPal y solicita el payout cuando seas elegible.',
      src: '/creators/creator2.png',
      alt: 'Pantalla de ganancias y payout del creator con solicitud de payout por PayPal',
    },
    {
      title: '3. Historial de audiencia',
      body: 'Ve el estado de cada seguidor con claridad: signed up, premium trial, ready to request o paid.',
      src: '/creators/creator3.png',
      alt: 'Pantalla de historial de audiencia con atribución y estado de seguidores',
    },
  ],
  appOverview: {
    title: 'La app de cerca',
    body: 'Dashboard principal: calorías restantes, macros (proteína, carbohidratos, grasa), hidratación, sync con Apple Health, calorías quemadas y comidas registradas con foto — todo en una sola pantalla.',
    src: '/dark.png',
    alt: 'Dashboard IGNITE AI con calorías, macros, comidas y Apple Health',
  },
  groupScreens: [
    {
      title: 'Chat del grupo',
      body: 'Una comunidad privada dentro de IGNITE. Tus seguidores hablan entre ellos, comparten recetas, preguntan y se mantienen accountable. Reacciones y respuestas como en una red social.',
      src: '/g1.png',
      alt: 'Pestaña Chat del Creator Group con mensajes, reacciones y respuestas',
    },
    {
      title: 'Feed de comidas y entrenos',
      body: 'Cada vez que un miembro del grupo registra una comida o entreno, aparece automáticamente en el feed — con foto, calorías, macros y duración. Tu audiencia ve exactamente lo que comes y entrenas.',
      src: '/g2.png',
      alt: 'Pestaña Feed del Creator Group con un post de kayak, calorías y reacciones',
    },
    {
      title: 'Leaderboard de consistencia',
      body: 'Ranking automático de quién más registra dentro del grupo. Gamifica tu comunidad e incentiva la consistencia — los miembros quieren subir en el leaderboard.',
      src: '/g3.png',
      alt: 'Pestaña Leaderboard del Creator Group con ranking de consistencia por racha',
    },
  ],
  groupsTitle: 'Creator Groups',
  groupsIntro:
    'Los creators aceptados reciben una badge verificada junto al nombre del perfil. Al ser aprobado, configuras tu grupo privado dentro de IGNITE. Invita a tu audiencia por código o enlace y se unen a tu comunidad con 3 pestañas:',
  processTitle: 'Cómo funciona',
  processSteps: [
    'Descarga la app, ve a Profile → Creator Program y solicita. Si te aprueban, recibes 3 meses de VIP más tu código personalizado de creator.',
    'Lanza tu grupo privado dentro de la app — opcional, pero una gran idea si encaja con tu marca y tu audiencia.',
    'Crea contenido para tus redes: meal scans, share cards de comidas y entrenos, stories y posts — y comparte tu código para que nuevos usuarios lo introduzcan en el onboarding.',
    'Sigue altas, estados y payouts en la pantalla Creator Program.',
  ],
  shareCardsTitle: 'Share Cards para tus redes',
  shareCardsBody:
    'Cada comida o entreno que registres puede convertirse en un card listo para publicar: foto, calorías, macros o duración, con temas editables. Ideal para stories, Reels y posts — y un lugar natural para soltar tu código de creator.',
  shareCards: [
    {
      title: 'Meal Share Card',
      body: 'Convierte un meal scan en un visual con macros y una frase potente — elige el tema y comparte en segundos.',
      src: '/share_meal.png',
      alt: 'Share cards de comida IGNITE AI con macros y temas',
    },
    {
      title: 'Workout Share Card',
      body: 'Comparte tu entreno con kcal, duración y un título impactante — listo para stories.',
      src: '/share_workout.png',
      alt: 'Share cards de entreno IGNITE AI con kcal y duración',
    },
  ],
  calculatorTitle: 'Calculadora rápida de ganancias',
  calculatorBody: 'Mueve el slider para estimar cuánto podrían generar las altas anuales elegibles al mes.',
  calculatorLabel: 'Altas anuales / mes',
  calculatorSuffix: 'altas',
  calculatorResultPrefix: 'Potencial mensual',
  calculatorResultSuffix: 'en comisiones',
  codeRulesTitle: 'Reglas del código',
  codeRules: [
    'Válido solo para Premium anual.',
    'Solo usuarios nuevos: cuentas que nunca tuvieron ninguna suscripción Premium de IGNITE AI.',
    'No cuenta: renovaciones, reactivaciones, upgrades de ex-Premium u otros planes.',
    'La comisión de {reward} solo se aplica a la primera suscripción anual elegible con tu código.',
    'Los creators lo siguen todo en la app; el payout se solicita tras la ventana de validación.',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: '¿Para quién es la app IGNITE?',
      a: 'Para personas con un objetivo de peso (perder, mantener o ganar) que quieren una estimación aproximada de lo que comen en calorías y macros, con seguimiento de comidas y entrenos.',
    },
    {
      q: '¿Para qué sirve la app IGNITE?',
      a: 'Es una app de fitness y nutrición: scans de comidas con IA (calorías y macros), registro de entrenos, seguimiento de progreso, sync con Health y herramientas para mantener la consistencia día a día.',
    },
    {
      q: '¿Qué obtiene mi audiencia?',
      a: 'Acceso al plan anual más barato de la app ({annual}), solo con tu código, más tu grupo privado: chat, feed de comidas/entrenos y leaderboard de consistencia.',
    },
    {
      q: '¿Cuánto gano por conversión?',
      a: 'Ganas {reward} fijos por cada nueva suscripción anual Premium elegible hecha con tu código.',
    },
    {
      q: '¿Qué hago después de ser aprobado?',
      a: 'Recibes VIP + código, lanzas tu grupo Creator, compartes el código (stories, Share Cards, posts) y sigues conversiones y payouts en la pantalla Creator Program.',
    },
    {
      q: '¿Cómo se renueva el acceso VIP?',
      a: 'Los 3 primeros meses están para que pruebes la app bien. Podemos renovar mientras la colaboración siga activa y alineada.',
    },
    {
      q: '¿Dónde introducen los seguidores mi código?',
      a: 'En el onboarding, en el primer registro. El código está pensado para usuarios nuevos y solo para el plan anual.',
    },
    {
      q: '¿Cuándo me pagan?',
      a: 'Tras la ventana de validación del pago. Cuando la recompensa sea elegible, aparece como ready to request y puedes solicitar el payout.',
    },
  ],
  ctaTitle: 'Siguiente paso',
  ctaBody: 'Solicita en la app y empieza a compartir.',
  ctaSteps: [
    'Descarga IGNITE AI',
    'Abre Profile → Creator program → Apply',
    'Recibe tu código y empieza a compartir',
  ],
  termsLink: 'Términos del Creator Program',
  publicProgramLink: 'Página pública del Creator Program',
  contactEmail: 'hello@ignitehub.app',
}

const fr: CreatorOutreachContent = {
  metaTitle: 'Creators — détails du partenariat | IGNITE AI',
  metaDescription:
    'Monétisez votre audience avec IGNITE AI : {reward} par inscription annuelle, plan exclusif à {annual} pour vos abonnés, groupe privé in-app et suivi des récompenses en direct.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Monétisez votre audience et créez votre communauté fitness dans l’app',
  subtitle:
    'Gagnez {reward} par inscription annuelle éligible. Votre audience obtient le plan annuel le plus bas à {annual} — uniquement avec votre code — et vous suivez tout en temps réel.',
  primaryCta: 'Postuler comme creator en 60 secondes',
  secondaryCta: 'Voir les conditions creator',
  heroPoints: [
    '{reward} pour chaque nouvelle inscription annuelle Premium éligible',
    'Votre audience obtient le plan annuel à {annual} — uniquement avec votre code',
    '3 mois d’accès VIP gratuit pour tester l’app',
  ],
  economyCreatorTitle: 'Ce que vous obtenez',
  economyCreator: [
    '{reward} de commission fixe par inscription annuelle',
    '3 mois d’accès VIP gratuit, renouvelables',
    'Badge Creator vérifié à côté de votre nom de profil',
    'Possibilité de créer un groupe « Creator » exclusif dans l’app',
    'Tableau de bord in-app pour le code, les récompenses et le suivi des payouts',
  ],
  economyAudienceTitle: 'Ce que votre audience obtient',
  economyAudience: [
    'Accès au plan annuel le moins cher de l’app : {annual} — exclusif avec votre code',
    'Accès à votre groupe privé dans l’app',
    'Chat, feed repas/entraînements et leaderboard de régularité',
  ],
  appTrackingTitle: 'Suivez tout dans l’app',
  appTrackingIntro:
    'Ces écrans montrent exactement comment les creators voient leur code, les abonnés attribués, le statut des récompenses et le flux de payout dans IGNITE AI.',
  appTrackingSteps: [
    {
      title: '1. Code + aperçu',
      body: 'Partagez votre code creator et voyez instantanément combien de personnes l’ont utilisé, plus les récompenses en attente vs payées.',
      src: '/creators/creator1.png',
      alt: 'Écran Creator Program avec code, récompenses en attente et récompenses payées',
    },
    {
      title: '2. Gains + payout',
      body: 'Filtrez par période, suivez le revenu débloqué, enregistrez votre PayPal et demandez le payout quand vous êtes éligible.',
      src: '/creators/creator2.png',
      alt: 'Écran des gains et payout creator avec demande de payout PayPal',
    },
    {
      title: '3. Historique de l’audience',
      body: 'Voyez clairement le statut de chaque abonné : signed up, premium trial, ready to request ou paid.',
      src: '/creators/creator3.png',
      alt: 'Écran d’historique d’audience avec attribution et statut des abonnés',
    },
  ],
  appOverview: {
    title: 'L’app de près',
    body: 'Dashboard principal : calories restantes, macros (protéines, glucides, lipides), hydratation, sync Apple Health, calories brûlées et repas enregistrés avec photo — le tout sur un seul écran.',
    src: '/dark.png',
    alt: 'Dashboard IGNITE AI avec calories, macros, repas et Apple Health',
  },
  groupScreens: [
    {
      title: 'Chat du groupe',
      body: 'Une communauté privée dans IGNITE. Vos abonnés échangent, partagent des recettes, posent des questions et restent accountable. Réactions et réponses comme sur un réseau social.',
      src: '/g1.png',
      alt: 'Onglet Chat du Creator Group avec messages, réactions et réponses',
    },
    {
      title: 'Feed repas & entraînements',
      body: 'Chaque fois qu’un membre du groupe enregistre un repas ou un entraînement, il apparaît automatiquement dans le feed — avec photo, calories, macros et durée. Votre audience voit exactement ce que vous mangez et entraînez.',
      src: '/g2.png',
      alt: 'Onglet Feed du Creator Group avec un post de kayak, calories et réactions',
    },
    {
      title: 'Leaderboard de régularité',
      body: 'Classement automatique de qui enregistre le plus dans le groupe. Gamifiez votre communauté et encouragez la régularité — les membres veulent monter dans le leaderboard.',
      src: '/g3.png',
      alt: 'Onglet Leaderboard du Creator Group avec classement de régularité par série',
    },
  ],
  groupsTitle: 'Creator Groups',
  groupsIntro:
    'Les creators acceptés reçoivent un badge vérifié à côté de leur nom de profil. Une fois approuvé, vous configurez votre groupe privé dans IGNITE. Invitez votre audience via code ou lien et ils rejoignent votre communauté avec 3 onglets :',
  processTitle: 'Comment ça marche',
  processSteps: [
    'Téléchargez l’app, allez dans Profile → Creator Program et postulez. Si vous êtes approuvé, vous obtenez 3 mois de VIP plus votre code creator personnalisé.',
    'Lancez votre groupe privé dans l’app — optionnel, mais une excellente idée si cela correspond à votre marque et à votre audience.',
    'Créez du contenu pour vos réseaux : meal scans, share cards de vos repas et entraînements, stories et posts — et partagez votre code pour que les nouveaux utilisateurs le saisissent à l’onboarding.',
    'Suivez les inscriptions, statuts et payouts dans l’écran Creator Program.',
  ],
  shareCardsTitle: 'Share Cards pour vos réseaux',
  shareCardsBody:
    'Chaque repas ou entraînement enregistré peut devenir une carte prête à publier : photo, calories, macros ou durée, avec des thèmes éditables. Parfait pour stories, Reels et posts — et un endroit naturel pour glisser votre code creator.',
  shareCards: [
    {
      title: 'Meal Share Card',
      body: 'Transformez un meal scan en visuel avec macros et une phrase percutante — choisissez le thème et partagez en quelques secondes.',
      src: '/share_meal.png',
      alt: 'Share cards repas IGNITE AI avec macros et thèmes',
    },
    {
      title: 'Workout Share Card',
      body: 'Partagez votre entraînement avec kcal, durée et un titre fort — prêt pour les stories.',
      src: '/share_workout.png',
      alt: 'Share cards entraînement IGNITE AI avec kcal et durée',
    },
  ],
  calculatorTitle: 'Calculateur de gains rapide',
  calculatorBody: 'Déplacez le curseur pour estimer ce que des inscriptions annuelles éligibles pourraient générer par mois.',
  calculatorLabel: 'Inscriptions annuelles / mois',
  calculatorSuffix: 'inscriptions',
  calculatorResultPrefix: 'Potentiel mensuel',
  calculatorResultSuffix: 'de commissions',
  codeRulesTitle: 'Règles du code',
  codeRules: [
    'Valable uniquement pour le Premium annuel.',
    'Nouveaux utilisateurs uniquement : comptes n’ayant jamais eu d’abonnement Premium IGNITE AI.',
    'Ne compte pas : renouvellements, réactivations, upgrades d’anciens Premium ou autres plans.',
    'La commission de {reward} s’applique uniquement à la première inscription annuelle éligible avec votre code.',
    'Les creators suivent tout in-app ; le payout se demande après la fenêtre de validation.',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'Pour qui est l’app IGNITE ?',
      a: 'Pour les personnes avec un objectif de poids (perdre, maintenir ou prendre) qui veulent une estimation approximative de ce qu’elles mangent en calories et macros, avec suivi des repas et entraînements.',
    },
    {
      q: 'À quoi sert l’app IGNITE ?',
      a: 'Une app de fitness et nutrition : scans de repas par IA (calories et macros), journal d’entraînements, suivi de progrès, sync Health et outils pour rester régulier au quotidien.',
    },
    {
      q: 'Que gagne mon audience ?',
      a: 'L’accès au plan annuel le moins cher de l’app ({annual}), uniquement avec votre code, plus votre groupe privé : chat, feed repas/entraînements et leaderboard de régularité.',
    },
    {
      q: 'Combien je gagne par conversion ?',
      a: 'Vous gagnez {reward} fixes pour chaque nouvelle inscription annuelle Premium éligible avec votre code.',
    },
    {
      q: 'Que faire après l’approbation ?',
      a: 'Vous recevez VIP + code, lancez votre groupe Creator, partagez le code (stories, Share Cards, posts) et suivez conversions et payouts dans l’écran Creator Program.',
    },
    {
      q: 'Comment l’accès VIP est-il renouvelé ?',
      a: 'Les 3 premiers mois servent à bien tester l’app. Nous pouvons renouveler tant que le partenariat reste actif et aligné.',
    },
    {
      q: 'Où les abonnés saisissent-ils mon code ?',
      a: 'Pendant l’onboarding, à la première inscription. Le code est conçu pour les nouveaux utilisateurs et le plan annuel uniquement.',
    },
    {
      q: 'Quand suis-je payé ?',
      a: 'Après la fenêtre de validation du paiement. Dès qu’une récompense devient éligible, elle apparaît en ready to request et vous pouvez demander le payout.',
    },
  ],
  ctaTitle: 'Prochaine étape',
  ctaBody: 'Postulez dans l’app et commencez à partager.',
  ctaSteps: [
    'Téléchargez IGNITE AI',
    'Ouvrez Profile → Creator program → Apply',
    'Recevez votre code et commencez à partager',
  ],
  termsLink: 'Conditions du Creator Program',
  publicProgramLink: 'Page publique du Creator Program',
  contactEmail: 'hello@ignitehub.app',
}

const de: CreatorOutreachContent = {
  metaTitle: 'Creators — Partnerschaftsdetails | IGNITE AI',
  metaDescription:
    'Monetarisiere deine Audience mit IGNITE AI: {reward} pro Jahres-Anmeldung, exklusiver {annual}-Plan für Follower, private In-App-Gruppe und Live-Reward-Tracking.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Monetarisiere deine Audience und baue deine Fitness-Community in der App auf',
  subtitle:
    'Verdiene {reward} pro berechtigter Jahres-Anmeldung. Deine Audience bekommt den günstigsten Jahresplan für {annual} — nur mit deinem Code — und du trackst alles in Echtzeit.',
  primaryCta: 'In 60 Sekunden als Creator bewerben',
  secondaryCta: 'Creator-Bedingungen ansehen',
  heroPoints: [
    '{reward} für jede berechtigte neue jährliche Premium-Anmeldung',
    'Deine Audience bekommt den Jahresplan für {annual} — nur mit deinem Code verfügbar',
    '3 Monate kostenloser VIP-Zugang zum Testen der App',
  ],
  economyCreatorTitle: 'Was du bekommst',
  economyCreator: [
    '{reward} feste Provision pro Jahres-Anmeldung',
    '3 Monate kostenloser VIP-Zugang, verlängerbar',
    'Verifiziertes Creator-Badge neben deinem Profilnamen',
    'Möglichkeit, eine exklusive „Creator“-Gruppe in der App zu erstellen',
    'In-App-Dashboard für Code-Nutzung, Rewards und Payout-Tracking',
  ],
  economyAudienceTitle: 'Was deine Audience bekommt',
  economyAudience: [
    'Zugang zum günstigsten Jahresplan in der App: {annual} — exklusiv mit deinem Code',
    'Zugang zu deiner privaten Gruppe in der App',
    'Chat, Meal-/Workout-Feed und Consistency-Leaderboard',
  ],
  appTrackingTitle: 'Tracke alles in der App',
  appTrackingIntro:
    'Diese Screens zeigen genau, wie Creators ihren Code, zugewiesene Follower, Reward-Status und den Payout-Flow in IGNITE AI sehen.',
  appTrackingSteps: [
    {
      title: '1. Code + Übersicht',
      body: 'Teile deinen Creator-Code und sieh sofort, wie viele ihn genutzt haben — plus ausstehende vs. ausgezahlte Rewards.',
      src: '/creators/creator1.png',
      alt: 'Creator-Program-Screen mit Code, ausstehenden Rewards und ausgezahlten Rewards',
    },
    {
      title: '2. Einnahmen + Payout',
      body: 'Nach Zeitraum filtern, freigeschaltete Einnahmen tracken, PayPal speichern und Payout anfordern, wenn du berechtigt bist.',
      src: '/creators/creator2.png',
      alt: 'Creator-Einnahmen- und Payout-Screen mit PayPal-Payout-Anfrage',
    },
    {
      title: '3. Audience-Historie',
      body: 'Sieh den Status jedes Followers klar: signed up, premium trial, ready to request oder paid.',
      src: '/creators/creator3.png',
      alt: 'Audience-Historie-Screen mit Follower-Zuordnung und Status',
    },
  ],
  appOverview: {
    title: 'Die App aus der Nähe',
    body: 'Haupt-Dashboard: verbleibende Kalorien, Makros (Protein, Kohlenhydrate, Fett), Hydration, Apple-Health-Sync, verbrannte Kalorien und Mahlzeiten mit Foto — alles auf einem Screen.',
    src: '/dark.png',
    alt: 'IGNITE-AI-Dashboard mit Kalorien, Makros, Mahlzeiten und Apple Health',
  },
  groupScreens: [
    {
      title: 'Gruppen-Chat',
      body: 'Eine private Community in IGNITE. Deine Follower sprechen miteinander, teilen Rezepte, stellen Fragen und bleiben accountable. Reaktionen und Antworten wie in einem sozialen Netzwerk.',
      src: '/g1.png',
      alt: 'Creator-Group-Chat-Tab mit Nachrichten, Reaktionen und Antworten',
    },
    {
      title: 'Meal- & Workout-Feed',
      body: 'Jedes Mal, wenn ein Gruppenmitglied eine Mahlzeit oder ein Workout loggt, erscheint es automatisch im Feed — mit Foto, Kalorien, Makros und Dauer. Deine Audience sieht genau, was du isst und trainierst.',
      src: '/g2.png',
      alt: 'Creator-Group-Feed-Tab mit einem Kayak-Workout-Post, Kalorien und Reaktionen',
    },
    {
      title: 'Consistency-Leaderboard',
      body: 'Automatisches Ranking, wer in der Gruppe am meisten loggt. Gamifiziere deine Community und fördere Consistency — Mitglieder wollen im Leaderboard aufsteigen.',
      src: '/g3.png',
      alt: 'Creator-Group-Leaderboard-Tab mit Consistency-Ranking nach Streak',
    },
  ],
  groupsTitle: 'Creator Groups',
  groupsIntro:
    'Akzeptierte Creators erhalten ein verifiziertes Badge neben dem Profilnamen. Nach Freigabe richtest du deine private Gruppe in IGNITE ein. Lade deine Audience per Code oder Link ein — sie treten deiner Community mit 3 Tabs bei:',
  processTitle: 'So funktioniert’s',
  processSteps: [
    'App herunterladen, zu Profile → Creator Program gehen und bewerben. Bei Freigabe erhältst du 3 Monate VIP plus deinen personalisierten Creator-Code.',
    'Starte deine private Gruppe in der App — optional, aber eine starke Idee, wenn sie zu deiner Marke und Audience passt.',
    'Erstelle Content für deine Socials: Meal Scans, Share Cards deiner Mahlzeiten und Workouts, Stories und Posts — und teile deinen Code, damit neue User ihn im Onboarding eingeben.',
    'Tracke Anmeldungen, Status und Payouts im Creator-Program-Screen.',
  ],
  shareCardsTitle: 'Share Cards für deine Socials',
  shareCardsBody:
    'Jede geloggte Mahlzeit oder jedes Workout kann eine fertige Share Card werden: Foto, Kalorien, Makros oder Dauer, mit editierbaren Themes. Ideal für Stories, Reels und Posts — und ein natürlicher Ort für deinen Creator-Code.',
  shareCards: [
    {
      title: 'Meal Share Card',
      body: 'Verwandle einen Meal Scan in ein Visual mit Makros und einem starken Spruch — Theme wählen und in Sekunden teilen.',
      src: '/share_meal.png',
      alt: 'IGNITE-AI-Meal-Share-Cards mit Makros und Themes',
    },
    {
      title: 'Workout Share Card',
      body: 'Teile dein Workout mit kcal, Dauer und einem bolden Titel — ready für Stories.',
      src: '/share_workout.png',
      alt: 'IGNITE-AI-Workout-Share-Cards mit kcal und Dauer',
    },
  ],
  calculatorTitle: 'Schneller Verdienst-Rechner',
  calculatorBody: 'Bewege den Slider, um zu schätzen, wie viel berechtigte Jahres-Anmeldungen pro Monat bringen könnten.',
  calculatorLabel: 'Jahres-Anmeldungen / Monat',
  calculatorSuffix: 'Anmeldungen',
  calculatorResultPrefix: 'Monatliches Potenzial',
  calculatorResultSuffix: 'an Provisionen',
  codeRulesTitle: 'Code-Regeln',
  codeRules: [
    'Nur für jährliches Premium gültig.',
    'Nur neue User: Konten, die noch nie ein IGNITE-AI-Premium-Abo hatten.',
    'Zählt nicht: Verlängerungen, Reaktivierungen, Upgrades ehemaliger Premium-Nutzer oder andere Pläne.',
    'Die {reward}-Provision gilt nur für die erste berechtigte Jahres-Anmeldung mit deinem Code.',
    'Creators tracken alles in der App; der Payout wird nach dem Validierungsfenster angefordert.',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'Für wen ist die IGNITE-App?',
      a: 'Für Menschen mit einem Gewichtsziel (abnehmen, halten oder zunehmen), die eine ungefähre Einschätzung von Kalorien und Makros wollen — mit Meal- und Workout-Tracking.',
    },
    {
      q: 'Wofür ist die IGNITE-App?',
      a: 'Eine Fitness- und Ernährungs-App: KI-Meal-Scans (Kalorien und Makros), Workout-Logging, Progress-Tracking, Health-Sync und Tools für tägliche Consistency.',
    },
    {
      q: 'Was bekommt meine Audience?',
      a: 'Zugang zum günstigsten Jahresplan in der App ({annual}), nur mit deinem Code, plus deine private Gruppe: Chat, Meal-/Workout-Feed und Consistency-Leaderboard.',
    },
    {
      q: 'Wie viel verdiene ich pro Conversion?',
      a: 'Du verdienst feste {reward} für jede berechtigte neue jährliche Premium-Anmeldung mit deinem Code.',
    },
    {
      q: 'Was mache ich nach der Freigabe?',
      a: 'Du erhältst VIP + Code, startest deine Creator-Gruppe, teilst den Code (Stories, Share Cards, Posts) und trackst Conversions und Payouts im Creator-Program-Screen.',
    },
    {
      q: 'Wie wird der VIP-Zugang verlängert?',
      a: 'Die ersten 3 Monate sind zum gründlichen Testen der App da. Wir können verlängern, solange die Partnerschaft aktiv und aligned bleibt.',
    },
    {
      q: 'Wo geben Follower meinen Code ein?',
      a: 'Im Onboarding bei der ersten Registrierung. Der Code ist für neue User und nur für den Jahresplan gedacht.',
    },
    {
      q: 'Wann werde ich ausgezahlt?',
      a: 'Nach dem Zahlungs-Validierungsfenster. Sobald ein Reward berechtigt ist, erscheint er als ready to request und du kannst den Payout anfordern.',
    },
  ],
  ctaTitle: 'Nächster Schritt',
  ctaBody: 'Bewirb dich in der App und starte mit dem Teilen.',
  ctaSteps: [
    'IGNITE AI herunterladen',
    'Profile → Creator program → Apply öffnen',
    'Code erhalten und teilen starten',
  ],
  termsLink: 'Creator-Program-Bedingungen',
  publicProgramLink: 'Öffentliche Creator-Program-Seite',
  contactEmail: 'hello@ignitehub.app',
}

const it: CreatorOutreachContent = {
  metaTitle: 'Creators — dettagli della partnership | IGNITE AI',
  metaDescription:
    'Monetizza il tuo audience con IGNITE AI: {reward} per ogni iscrizione annuale, piano esclusivo a {annual} per i follower, gruppo privato in-app e tracking live delle reward.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Monetizza il tuo audience e costruisci la tua community fitness in-app',
  subtitle:
    'Guadagna {reward} per ogni iscrizione annuale idonea. Il tuo audience ottiene il piano annuale più basso a {annual} — solo con il tuo codice — e tu monitori tutto in tempo reale.',
  primaryCta: 'Candidati come creator in 60 secondi',
  secondaryCta: 'Vedi i termini creator',
  heroPoints: [
    '{reward} per ogni nuova iscrizione annuale Premium idonea',
    'Il tuo audience ottiene il piano annuale a {annual} — solo disponibile con il tuo codice',
    '3 mesi di accesso VIP gratuito per testare l’app',
  ],
  economyCreatorTitle: 'Cosa ottieni tu',
  economyCreator: [
    '{reward} di commissione fissa per iscrizione annuale',
    '3 mesi di accesso VIP gratuito, rinnovabili',
    'Badge Creator verificato accanto al nome del profilo',
    'Possibilità di creare un gruppo "Creator" esclusivo dentro l’app',
    'Dashboard in-app per uso del codice, reward e tracking dei payout',
  ],
  economyAudienceTitle: 'Cosa ottiene il tuo audience',
  economyAudience: [
    'Accesso al piano annuale più economico dell’app: {annual} — esclusivo con il tuo codice',
    'Accesso al tuo gruppo privato dentro l’app',
    'Chat, feed pasti/allenamenti e leaderboard di costanza',
  ],
  appTrackingTitle: 'Monitora tutto nell’app',
  appTrackingIntro:
    'Queste schermate mostrano esattamente come i creator vedono il codice, i follower attribuiti, lo stato delle reward e il flusso di payout dentro IGNITE AI.',
  appTrackingSteps: [
    {
      title: '1. Codice + panoramica',
      body: 'Condividi il tuo codice creator e vedi subito quante persone lo hanno usato, più reward in sospeso vs pagate.',
      src: '/creators/creator1.png',
      alt: 'Schermata Creator Program con codice, reward in sospeso e reward pagate',
    },
    {
      title: '2. Guadagni + payout',
      body: 'Filtra per periodo, monitora il revenue sbloccato, salva il PayPal e richiedi il payout quando sei idoneo.',
      src: '/creators/creator2.png',
      alt: 'Schermata guadagni e payout creator con richiesta payout PayPal',
    },
    {
      title: '3. Cronologia audience',
      body: 'Vedi chiaramente lo stato di ogni follower: signed up, premium trial, ready to request o paid.',
      src: '/creators/creator3.png',
      alt: 'Schermata cronologia audience con attribuzione e stato dei follower',
    },
  ],
  appOverview: {
    title: 'L’app da vicino',
    body: 'Dashboard principale: calorie rimanenti, macro (proteine, carboidrati, grassi), idratazione, sync Apple Health, calorie bruciate e pasti registrati con foto — tutto in un’unica schermata.',
    src: '/dark.png',
    alt: 'Dashboard IGNITE AI con calorie, macro, pasti e Apple Health',
  },
  groupScreens: [
    {
      title: 'Chat del gruppo',
      body: 'Una community privata dentro IGNITE. I tuoi follower parlano tra loro, condividono ricette, fanno domande e restano accountable. Reazioni e risposte come su un social network.',
      src: '/g1.png',
      alt: 'Tab Chat del Creator Group con messaggi, reazioni e risposte',
    },
    {
      title: 'Feed pasti e allenamenti',
      body: 'Ogni volta che un membro del gruppo registra un pasto o un allenamento, appare automaticamente nel feed — con foto, calorie, macro e durata. Il tuo audience vede esattamente cosa mangi e come ti alleni.',
      src: '/g2.png',
      alt: 'Tab Feed del Creator Group con un post di kayak, calorie e reazioni',
    },
    {
      title: 'Leaderboard di costanza',
      body: 'Ranking automatico di chi registra di più nel gruppo. Gamifica la community e incentiva la costanza — i membri vogliono salire nella leaderboard.',
      src: '/g3.png',
      alt: 'Tab Leaderboard del Creator Group con ranking di costanza per streak',
    },
  ],
  groupsTitle: 'Creator Groups',
  groupsIntro:
    'I creator accettati ricevono un badge verificato accanto al nome del profilo. Dopo l’approvazione, configuri il tuo gruppo privato dentro IGNITE. Invita il tuo audience via codice o link e entrano nella tua community con 3 tab:',
  processTitle: 'Come funziona',
  processSteps: [
    'Scarica l’app, vai su Profile → Creator Program e candidati. Se sei approvato, ricevi 3 mesi di VIP più il tuo codice creator personalizzato.',
    'Lancia il tuo gruppo privato dentro l’app — opzionale, ma un’ottima idea se ha senso per il tuo brand e audience.',
    'Crea contenuti per i social: meal scan, share card di pasti e allenamenti, stories e post — e condividi il codice così i nuovi utenti lo inseriscono nell’onboarding.',
    'Monitora iscrizioni, stati e payout nella schermata Creator Program.',
  ],
  shareCardsTitle: 'Share Cards per i tuoi social',
  shareCardsBody:
    'Ogni pasto o allenamento che registri può diventare una card pronta da pubblicare: foto, calorie, macro o durata, con temi modificabili. Perfetta per stories, Reels e post — e un posto naturale per il tuo codice creator.',
  shareCards: [
    {
      title: 'Meal Share Card',
      body: 'Trasforma un meal scan in un visual con macro e una frase d’impatto — scegli il tema e condividi in pochi secondi.',
      src: '/share_meal.png',
      alt: 'Share card pasto IGNITE AI con macro e temi',
    },
    {
      title: 'Workout Share Card',
      body: 'Condividi il tuo allenamento con kcal, durata e un titolo forte — pronto per le stories.',
      src: '/share_workout.png',
      alt: 'Share card allenamento IGNITE AI con kcal e durata',
    },
  ],
  calculatorTitle: 'Calcolatore guadagni rapido',
  calculatorBody: 'Muovi lo slider per stimare quanto potrebbero generare le iscrizioni annuali idonee al mese.',
  calculatorLabel: 'Iscrizioni annuali / mese',
  calculatorSuffix: 'iscrizioni',
  calculatorResultPrefix: 'Potenziale mensile',
  calculatorResultSuffix: 'in commissioni',
  codeRulesTitle: 'Regole del codice',
  codeRules: [
    'Valido solo per il Premium annuale.',
    'Solo nuovi utenti: account che non hanno mai avuto un abbonamento Premium IGNITE AI.',
    'Non conta: rinnovi, riattivazioni, upgrade di ex-Premium o altri piani.',
    'La commissione di {reward} si applica solo alla prima iscrizione annuale idonea con il tuo codice.',
    'I creator monitorano tutto in-app; il payout si richiede dopo la finestra di validazione.',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'Per chi è l’app IGNITE?',
      a: 'Per chi ha un obiettivo di peso (perdere, mantenere o aumentare) e vuole una stima approssimativa di calorie e macro di ciò che mangia, con tracking di pasti e allenamenti.',
    },
    {
      q: 'A cosa serve l’app IGNITE?',
      a: 'Un’app di fitness e nutrizione: scan pasti con IA (calorie e macro), logging allenamenti, tracking progressi, sync Health e strumenti per restare costanti ogni giorno.',
    },
    {
      q: 'Cosa ottiene il mio audience?',
      a: 'Accesso al piano annuale più economico dell’app ({annual}), solo con il tuo codice, più il tuo gruppo privato: chat, feed pasti/allenamenti e leaderboard di costanza.',
    },
    {
      q: 'Quanto guadagno per conversione?',
      a: 'Guadagni {reward} fissi per ogni nuova iscrizione annuale Premium idonea con il tuo codice.',
    },
    {
      q: 'Cosa faccio dopo l’approvazione?',
      a: 'Ricevi VIP + codice, lanci il tuo gruppo Creator, condividi il codice (stories, Share Cards, post) e monitori conversioni e payout nella schermata Creator Program.',
    },
    {
      q: 'Come viene rinnovato l’accesso VIP?',
      a: 'I primi 3 mesi servono per testare bene l’app. Possiamo rinnovare finché la partnership resta attiva e allineata.',
    },
    {
      q: 'Dove i follower inseriscono il mio codice?',
      a: 'Nell’onboarding, al primo registrazione. Il codice è pensato per nuovi utenti e solo per il piano annuale.',
    },
    {
      q: 'Quando vengo pagato?',
      a: 'Dopo la finestra di validazione del pagamento. Quando una reward diventa idonea, appare come ready to request e puoi richiedere il payout.',
    },
  ],
  ctaTitle: 'Prossimo passo',
  ctaBody: 'Candidati nell’app e inizia a condividere.',
  ctaSteps: [
    'Scarica IGNITE AI',
    'Apri Profile → Creator program → Apply',
    'Ricevi il codice e inizia a condividere',
  ],
  termsLink: 'Termini del Creator Program',
  publicProgramLink: 'Pagina pubblica del Creator Program',
  contactEmail: 'hello@ignitehub.app',
}

const nl: CreatorOutreachContent = {
  metaTitle: 'Creators — partnerschapsdetails | IGNITE AI',
  metaDescription:
    'Monetiseer je audience met IGNITE AI: {reward} per jaarlijkse signup, exclusief {annual}-plan voor volgers, privé in-app groep en live reward-tracking.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Monetiseer je audience en bouw je fitnesscommunity in de app',
  subtitle:
    'Verdien {reward} per in aanmerking komende jaarlijkse signup. Je audience krijgt het laagste jaarplan voor {annual} — alleen beschikbaar met jouw code — en jij volgt alles realtime.',
  primaryCta: 'Solliciteer als creator in 60 seconden',
  secondaryCta: 'Bekijk creator-voorwaarden',
  heroPoints: [
    '{reward} voor elke in aanmerking komende nieuwe jaarlijkse Premium-signup',
    'Je audience krijgt het jaarplan voor {annual} — alleen beschikbaar met jouw code',
    '3 maanden gratis VIP-toegang om de app te testen',
  ],
  economyCreatorTitle: 'Wat jij krijgt',
  economyCreator: [
    '{reward} vaste commissie per jaarlijkse signup',
    '3 maanden gratis VIP-toegang, verlengbaar',
    'Geverifieerde Creator-badge naast je profielnaam',
    'Mogelijkheid om een exclusieve "Creator"-groep in de app te maken',
    'In-app dashboard voor codegebruik, rewards en payout-tracking',
  ],
  economyAudienceTitle: 'Wat je audience krijgt',
  economyAudience: [
    'Toegang tot het goedkoopste jaarplan in de app: {annual} — exclusief met jouw code',
    'Toegang tot jouw privé-groep in de app',
    'Chat, meal-/workout-feed en consistency-leaderboard',
  ],
  appTrackingTitle: 'Volg alles in de app',
  appTrackingIntro:
    'Deze schermen laten precies zien hoe creators hun code, toegeschreven volgers, reward-status en payout-flow in IGNITE AI bekijken.',
  appTrackingSteps: [
    {
      title: '1. Code + overzicht',
      body: 'Deel je creator-code en zie meteen hoeveel mensen hem gebruikten, plus openstaande vs. uitbetaalde rewards.',
      src: '/creators/creator1.png',
      alt: 'Creator Program-scherm met code, openstaande rewards en uitbetaalde rewards',
    },
    {
      title: '2. Verdiensten + payout',
      body: 'Filter op periode, volg vrijgegeven omzet, sla PayPal op en vraag een payout aan wanneer je in aanmerking komt.',
      src: '/creators/creator2.png',
      alt: 'Creator verdiensten- en payout-scherm met PayPal-payoutaanvraag',
    },
    {
      title: '3. Audiencegeschiedenis',
      body: 'Zie de status van elke volger duidelijk: signed up, premium trial, ready to request of paid.',
      src: '/creators/creator3.png',
      alt: 'Audiencegeschiedenis-scherm met volgerattributie en status',
    },
  ],
  appOverview: {
    title: 'De app van dichtbij',
    body: 'Hoofddashboard: resterende calorieën, macro’s (eiwit, koolhydraten, vet), hydratatie, Apple Health-sync, verbrande calorieën en maaltijden met foto — alles op één scherm.',
    src: '/dark.png',
    alt: 'IGNITE AI-dashboard met calorieën, macro’s, maaltijden en Apple Health',
  },
  groupScreens: [
    {
      title: 'Groepschat',
      body: 'Een privécommunity in IGNITE. Je volgers praten met elkaar, delen recepten, stellen vragen en blijven accountable. Reacties en antwoorden zoals op een sociaal netwerk.',
      src: '/g1.png',
      alt: 'Creator Group Chat-tab met berichten, reacties en antwoorden',
    },
    {
      title: 'Meal- & workout-feed',
      body: 'Elke keer dat een groeps­lid een maaltijd of workout logt, verschijnt het automatisch in de feed — met foto, calorieën, macro’s en duur. Je audience ziet precies wat je eet en traint.',
      src: '/g2.png',
      alt: 'Creator Group Feed-tab met een kayak-workoutpost, calorieën en reacties',
    },
    {
      title: 'Consistency-leaderboard',
      body: 'Automatische ranking van wie het meest logt in de groep. Gamify je community en stimuleer consistency — leden willen omhoog op het leaderboard.',
      src: '/g3.png',
      alt: 'Creator Group Leaderboard-tab met consistency-ranking op streak',
    },
  ],
  groupsTitle: 'Creator Groups',
  groupsIntro:
    'Geaccepteerde creators krijgen een geverifieerde badge naast hun profielnaam. Na goedkeuring zet je je privé-groep op in IGNITE. Nodig je audience uit via code of link en ze joinen je community met 3 tabs:',
  processTitle: 'Hoe het werkt',
  processSteps: [
    'Download de app, ga naar Profile → Creator Program en solliciteer. Bij goedkeuring krijg je 3 maanden VIP plus je persoonlijke creator-code.',
    'Lanceer je privé-groep in de app — optioneel, maar een sterk idee als het past bij je merk en audience.',
    'Maak content voor je socials: meal scans, share cards van maaltijden en workouts, stories en posts — en deel je code zodat nieuwe users hem tijdens onboarding invoeren.',
    'Volg signups, statussen en payouts in het Creator Program-scherm.',
  ],
  shareCardsTitle: 'Share Cards voor je socials',
  shareCardsBody:
    'Elke maaltijd of workout die je logt kan een klaar-om-te-posten card worden: foto, calorieën, macro’s of duur, met bewerkbare thema’s. Perfect voor stories, Reels en posts — en een natuurlijke plek voor je creator-code.',
  shareCards: [
    {
      title: 'Meal Share Card',
      body: 'Maak van een meal scan een visual met macro’s en een punchy zin — kies een thema en deel in seconden.',
      src: '/share_meal.png',
      alt: 'IGNITE AI meal share cards met macro’s en thema’s',
    },
    {
      title: 'Workout Share Card',
      body: 'Deel je workout met kcal, duur en een bolde titel — klaar voor stories.',
      src: '/share_workout.png',
      alt: 'IGNITE AI workout share cards met kcal en duur',
    },
  ],
  calculatorTitle: 'Snelle verdiensten-calculator',
  calculatorBody: 'Beweeg de slider om te schatten hoeveel in aanmerking komende jaarlijkse signups per maand kunnen opleveren.',
  calculatorLabel: 'Jaarlijkse signups / maand',
  calculatorSuffix: 'signups',
  calculatorResultPrefix: 'Maandelijks potentieel',
  calculatorResultSuffix: 'aan commissies',
  codeRulesTitle: 'Coderegels',
  codeRules: [
    'Alleen geldig voor jaarlijks Premium.',
    'Alleen nieuwe users: accounts die nooit een IGNITE AI Premium-abonnement hadden.',
    'Telt niet: verlengingen, heractiveringen, upgrades van ex-Premium of andere plannen.',
    'De {reward}-commissie geldt alleen voor de eerste in aanmerking komende jaarlijkse subscription met jouw code.',
    'Creators volgen alles in-app; payout wordt aangevraagd na het validatievenster.',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'Voor wie is de IGNITE-app?',
      a: 'Voor mensen met een gewichtsdoel (afvallen, behouden of aankomen) die een geschatte inschatting willen van calorieën en macro’s, met meal- en workout-tracking.',
    },
    {
      q: 'Waarvoor is de IGNITE-app?',
      a: 'Een fitness- en voedingsapp: AI meal scans (calorieën en macro’s), workout-logging, progress-tracking, Health-sync en tools om dagelijks consistent te blijven.',
    },
    {
      q: 'Wat krijgt mijn audience?',
      a: 'Toegang tot het goedkoopste jaarplan in de app ({annual}), alleen met jouw code, plus je privé-groep: chat, meal-/workout-feed en consistency-leaderboard.',
    },
    {
      q: 'Hoeveel verdien ik per conversie?',
      a: 'Je verdient vaste {reward} voor elke in aanmerking komende nieuwe jaarlijkse Premium-signup met jouw code.',
    },
    {
      q: 'Wat doe ik na goedkeuring?',
      a: 'Je krijgt VIP + code, lanceert je Creator-groep, deelt de code (stories, Share Cards, posts) en volgt conversies en payouts in het Creator Program-scherm.',
    },
    {
      q: 'Hoe wordt VIP-toegang verlengd?',
      a: 'De eerste 3 maanden zijn er zodat je de app goed kunt testen. We kunnen verlengen zolang het partnerschap actief en aligned blijft.',
    },
    {
      q: 'Waar vullen volgers mijn code in?',
      a: 'Tijdens onboarding bij de eerste registratie. De code is bedoeld voor nieuwe users en alleen voor het jaarplan.',
    },
    {
      q: 'Wanneer word ik uitbetaald?',
      a: 'Na het betalingsvalidatievenster. Zodra een reward in aanmerking komt, verschijnt die als ready to request en kun je payout aanvragen.',
    },
  ],
  ctaTitle: 'Volgende stap',
  ctaBody: 'Solliciteer in de app en begin met delen.',
  ctaSteps: [
    'Download IGNITE AI',
    'Open Profile → Creator program → Apply',
    'Ontvang je code en begin met delen',
  ],
  termsLink: 'Creator Program-voorwaarden',
  publicProgramLink: 'Openbare Creator Program-pagina',
  contactEmail: 'hello@ignitehub.app',
}

const no: CreatorOutreachContent = {
  metaTitle: 'Creators — partnerskapsdetaljer | IGNITE AI',
  metaDescription:
    'Tjen penger på publikummet ditt med IGNITE AI: {reward} per årlig registrering, eksklusiv {annual}-plan for følgere, privat gruppe i appen og live belønningssporing.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Tjen penger på publikummet ditt og bygg fitness-communityen din i appen',
  subtitle:
    'Tjen {reward} per kvalifisert årlig registrering. Publikummet ditt får den laveste årsplanen til {annual} — bare tilgjengelig med koden din — og du følger alt i sanntid.',
  primaryCta: 'Søk som creator på 60 sekunder',
  secondaryCta: 'Se creator-vilkår',
  heroPoints: [
    '{reward} for hver kvalifisert ny årlig Premium-registrering',
    'Publikummet ditt får årsplanen til {annual} — bare tilgjengelig med koden din',
    '3 måneder gratis VIP-tilgang for å teste appen',
  ],
  economyCreatorTitle: 'Det du får',
  economyCreator: [
    '{reward} fast provisjon per årlig registrering',
    '3 måneder gratis VIP-tilgang, fornybar',
    'Verifisert Creator-badge ved siden av profilnavnet ditt',
    'Mulighet til å lage en eksklusiv «Creator»-gruppe i appen',
    'Dashboard i appen for kodebruk, belønninger og utbetalingssporing',
  ],
  economyAudienceTitle: 'Det publikummet ditt får',
  economyAudience: [
    'Tilgang til den billigste årsplanen i appen: {annual} — eksklusivt med koden din',
    'Tilgang til din private gruppe i appen',
    'Chat, måltids-/treningsfeed og consistency-leaderboard',
  ],
  appTrackingTitle: 'Følg alt i appen',
  appTrackingIntro:
    'Disse skjermene viser nøyaktig hvordan creators ser koden sin, tilskrevne følgere, belønningsstatus og utbetalingsflyten i IGNITE AI.',
  appTrackingSteps: [
    {
      title: '1. Kode + oversikt',
      body: 'Del creator-koden din og se umiddelbart hvor mange som brukte den, pluss ventende vs. utbetalte belønninger.',
      src: '/creators/creator1.png',
      alt: 'Creator Program-skjerm med kode, ventende belønninger og utbetalte belønninger',
    },
    {
      title: '2. Inntekter + utbetaling',
      body: 'Filtrer etter periode, følg opplåst omsetning, lagre PayPal og be om utbetaling når du er kvalifisert.',
      src: '/creators/creator2.png',
      alt: 'Creator inntekts- og utbetalingsskjerm med PayPal-utbetalingsforespørsel',
    },
    {
      title: '3. Publikumshistorikk',
      body: 'Se statusen til hver følger tydelig: signed up, premium trial, ready to request eller paid.',
      src: '/creators/creator3.png',
      alt: 'Publikumshistorikk-skjerm med følgerattribusjon og status',
    },
  ],
  appOverview: {
    title: 'Appen på nært hold',
    body: 'Hoveddashboard: gjenværende kalorier, makroer (protein, karbohydrater, fett), hydrering, Apple Health-synk, forbrente kalorier og måltider med bilde — alt på én skjerm.',
    src: '/dark.png',
    alt: 'IGNITE AI-dashboard med kalorier, makroer, måltider og Apple Health',
  },
  groupScreens: [
    {
      title: 'Gruppechat',
      body: 'Et privat community i IGNITE. Følgerne dine snakker sammen, deler oppskrifter, stiller spørsmål og holder hverandre accountable. Reaksjoner og svar som på et sosialt nettverk.',
      src: '/g1.png',
      alt: 'Creator Group Chat-fane med meldinger, reaksjoner og svar',
    },
    {
      title: 'Måltids- og treningsfeed',
      body: 'Hver gang et gruppemedlem logger et måltid eller en trening, vises det automatisk i feeden — med bilde, kalorier, makroer og varighet. Publikummet ditt ser nøyaktig hva du spiser og trener.',
      src: '/g2.png',
      alt: 'Creator Group Feed-fane med et kajakk-treningsinnlegg, kalorier og reaksjoner',
    },
    {
      title: 'Consistency-leaderboard',
      body: 'Automatisk rangering av hvem som logger mest i gruppen. Gamifiser communityen og oppmuntre til consistency — medlemmene vil opp på leaderboardet.',
      src: '/g3.png',
      alt: 'Creator Group Leaderboard-fane med consistency-ranking etter streak',
    },
  ],
  groupsTitle: 'Creator Groups',
  groupsIntro:
    'Godkjente creators får en verifisert badge ved siden av profilnavnet. Når du er godkjent, setter du opp din private gruppe i IGNITE. Inviter publikummet via kode eller lenke, så blir de med i communityen din med 3 faner:',
  processTitle: 'Slik fungerer det',
  processSteps: [
    'Last ned appen, gå til Profile → Creator Program og søk. Hvis du blir godkjent, får du 3 måneder VIP pluss din personlige creator-kode.',
    'Start din private gruppe i appen — valgfritt, men en god idé hvis det passer merkevaren og publikummet ditt.',
    'Lag innhold til sosiale medier: meal scans, share cards av måltider og treninger, stories og innlegg — og del koden din så nye brukere kan taste den inn under onboarding.',
    'Følg registreringer, statuser og utbetalinger i Creator Program-skjermen.',
  ],
  shareCardsTitle: 'Share Cards til sosiale medier',
  shareCardsBody:
    'Hvert måltid eller hver trening du logger kan bli et ferdig kort: bilde, kalorier, makroer eller varighet, med redigerbare temaer. Perfekt for stories, Reels og innlegg — og et naturlig sted å droppe creator-koden din.',
  shareCards: [
    {
      title: 'Meal Share Card',
      body: 'Gjør en meal scan om til et visual med makroer og en punchy setning — velg tema og del på sekunder.',
      src: '/share_meal.png',
      alt: 'IGNITE AI meal share cards med makroer og temaer',
    },
    {
      title: 'Workout Share Card',
      body: 'Del treningen din med kcal, varighet og en bold tittel — klar for stories.',
      src: '/share_workout.png',
      alt: 'IGNITE AI workout share cards med kcal og varighet',
    },
  ],
  calculatorTitle: 'Rask inntektskalkulator',
  calculatorBody: 'Flytt slideren for å anslå hvor mye kvalifiserte årlige registreringer kan gi per måned.',
  calculatorLabel: 'Årlige registreringer / måned',
  calculatorSuffix: 'registreringer',
  calculatorResultPrefix: 'Månedlig potensial',
  calculatorResultSuffix: 'i provisjoner',
  codeRulesTitle: 'Koderegler',
  codeRules: [
    'Gyldig kun for årlig Premium.',
    'Kun nye brukere: kontoer som aldri har hatt et IGNITE AI Premium-abonnement.',
    'Teller ikke: fornyelser, reaktiveringer, oppgraderinger fra tidligere Premium eller andre planer.',
    '{reward}-provisjonen gjelder kun den første kvalifiserte årlige abonnementet med koden din.',
    'Creators følger alt i appen; utbetaling forespørres etter valideringsvinduet.',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'Hvem er IGNITE-appen for?',
      a: 'For personer med et vektmål (gå ned, holde eller gå opp) som vil ha et omtrentlig estimat av det de spiser i kalorier og makroer, med måltids- og treningssporing.',
    },
    {
      q: 'Hva er IGNITE-appen til?',
      a: 'En fitness- og ernæringsapp: AI-måltidsscanninger (kalorier og makroer), treningslogging, fremdriftssporing, Health-synk og verktøy for å holde consistency i hverdagen.',
    },
    {
      q: 'Hva får publikummet mitt?',
      a: 'Tilgang til den billigste årsplanen i appen ({annual}), bare med koden din, pluss din private gruppe: chat, måltids-/treningsfeed og consistency-leaderboard.',
    },
    {
      q: 'Hvor mye tjener jeg per konvertering?',
      a: 'Du tjener faste {reward} for hver kvalifisert ny årlig Premium-registrering med koden din.',
    },
    {
      q: 'Hva gjør jeg etter godkjenning?',
      a: 'Du får VIP + kode, starter Creator-gruppen din, deler koden (stories, Share Cards, innlegg) og følger konverteringer og utbetalinger i Creator Program-skjermen.',
    },
    {
      q: 'Hvordan fornyes VIP-tilgangen?',
      a: 'De første 3 månedene er til for at du skal teste appen skikkelig. Vi kan fornye så lenge partnerskapet er aktivt og i tråd.',
    },
    {
      q: 'Hvor skriver følgere inn koden min?',
      a: 'Under onboarding ved første registrering. Koden er laget for nye brukere og kun for årsplanen.',
    },
    {
      q: 'Når får jeg betalt?',
      a: 'Etter betalingsvalideringsvinduet. Når en belønning blir kvalifisert, vises den som ready to request, og du kan be om utbetaling.',
    },
  ],
  ctaTitle: 'Neste steg',
  ctaBody: 'Søk i appen og begynn å dele.',
  ctaSteps: [
    'Last ned IGNITE AI',
    'Åpne Profile → Creator program → Apply',
    'Få koden din og begynn å dele',
  ],
  termsLink: 'Creator Program-vilkår',
  publicProgramLink: 'Offentlig Creator Program-side',
  contactEmail: 'hello@ignitehub.app',
}

const sv: CreatorOutreachContent = {
  metaTitle: 'Creators — partnerskapsdetaljer | IGNITE AI',
  metaDescription:
    'Tjäna pengar på din publik med IGNITE AI: {reward} per årlig registrering, exklusiv {annual}-plan för följare, privat grupp i appen och live belöningsspårning.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Tjäna pengar på din publik och bygg ditt fitnesscommunity i appen',
  subtitle:
    'Tjäna {reward} per berättigad årlig registrering. Din publik får den lägsta årsplanen för {annual} — endast tillgänglig med din kod — och du följer allt i realtid.',
  primaryCta: 'Ansök som creator på 60 sekunder',
  secondaryCta: 'Se creator-villkor',
  heroPoints: [
    '{reward} för varje berättigad ny årlig Premium-registrering',
    'Din publik får årsplanen för {annual} — endast tillgänglig med din kod',
    '3 månader gratis VIP-åtkomst för att testa appen',
  ],
  economyCreatorTitle: 'Det du får',
  economyCreator: [
    '{reward} fast provision per årlig registrering',
    '3 månader gratis VIP-åtkomst, förnybar',
    'Verifierad Creator-badge bredvid ditt profilnamn',
    'Möjlighet att skapa en exklusiv "Creator"-grupp i appen',
    'Dashboard i appen för kodanvändning, belöningar och utbetalningsspårning',
  ],
  economyAudienceTitle: 'Det din publik får',
  economyAudience: [
    'Tillgång till den billigaste årsplanen i appen: {annual} — exklusivt med din kod',
    'Tillgång till din privata grupp i appen',
    'Chat, måltids-/träningsfeed och consistency-leaderboard',
  ],
  appTrackingTitle: 'Följ allt i appen',
  appTrackingIntro:
    'De här skärmarna visar exakt hur creators ser sin kod, tillskrivna följare, belöningsstatus och utbetalningsflödet i IGNITE AI.',
  appTrackingSteps: [
    {
      title: '1. Kod + översikt',
      body: 'Dela din creator-kod och se direkt hur många som använt den, plus väntande vs. utbetalda belöningar.',
      src: '/creators/creator1.png',
      alt: 'Creator Program-skärm med kod, väntande belöningar och utbetalda belöningar',
    },
    {
      title: '2. Intäkter + utbetalning',
      body: 'Filtrera per period, följ upplåst intäkt, spara PayPal och begär utbetalning när du är berättigad.',
      src: '/creators/creator2.png',
      alt: 'Creator intäkts- och utbetalningsskärm med PayPal-utbetalningsbegäran',
    },
    {
      title: '3. Publikhistorik',
      body: 'Se varje följares status tydligt: signed up, premium trial, ready to request eller paid.',
      src: '/creators/creator3.png',
      alt: 'Publikhistorik-skärm med följarattribution och status',
    },
  ],
  appOverview: {
    title: 'Appen på nära håll',
    body: 'Huvuddashboard: återstående kalorier, makron (protein, kolhydrater, fett), hydrering, Apple Health-synk, förbrända kalorier och måltider med foto — allt på en skärm.',
    src: '/dark.png',
    alt: 'IGNITE AI-dashboard med kalorier, makron, måltider och Apple Health',
  },
  groupScreens: [
    {
      title: 'Gruppchatt',
      body: 'Ett privat community i IGNITE. Dina följare pratar med varandra, delar recept, ställer frågor och håller varandra accountable. Reaktioner och svar som på ett socialt nätverk.',
      src: '/g1.png',
      alt: 'Creator Group Chat-flik med meddelanden, reaktioner och svar',
    },
    {
      title: 'Måltids- och träningsfeed',
      body: 'Varje gång en gruppmedlem loggar en måltid eller träning dyker den upp automatiskt i feeden — med foto, kalorier, makron och längd. Din publik ser exakt vad du äter och tränar.',
      src: '/g2.png',
      alt: 'Creator Group Feed-flik med ett kajak-träningsinlägg, kalorier och reaktioner',
    },
    {
      title: 'Consistency-leaderboard',
      body: 'Automatisk ranking av vem som loggar mest i gruppen. Gamifiera ditt community och uppmuntra consistency — medlemmarna vill klättra på leaderboarden.',
      src: '/g3.png',
      alt: 'Creator Group Leaderboard-flik med consistency-ranking efter streak',
    },
  ],
  groupsTitle: 'Creator Groups',
  groupsIntro:
    'Godkända creators får en verifierad badge bredvid profilnamnet. När du är godkänd sätter du upp din privata grupp i IGNITE. Bjud in din publik via kod eller länk så går de med i ditt community med 3 flikar:',
  processTitle: 'Så fungerar det',
  processSteps: [
    'Ladda ner appen, gå till Profile → Creator Program och ansök. Om du godkänns får du 3 månader VIP plus din personliga creator-kod.',
    'Starta din privata grupp i appen — valfritt, men en stark idé om det passar ditt varumärke och din publik.',
    'Skapa innehåll till dina sociala kanaler: meal scans, share cards av måltider och träningar, stories och inlägg — och dela din kod så nya användare kan ange den under onboarding.',
    'Följ registreringar, statusar och utbetalningar i Creator Program-skärmen.',
  ],
  shareCardsTitle: 'Share Cards för dina sociala kanaler',
  shareCardsBody:
    'Varje måltid eller träning du loggar kan bli ett färdigt kort: foto, kalorier, makron eller längd, med redigerbara teman. Perfekt för stories, Reels och inlägg — och en naturlig plats för din creator-kod.',
  shareCards: [
    {
      title: 'Meal Share Card',
      body: 'Förvandla en meal scan till ett visual med makron och en punchig rad — välj tema och dela på sekunder.',
      src: '/share_meal.png',
      alt: 'IGNITE AI meal share cards med makron och teman',
    },
    {
      title: 'Workout Share Card',
      body: 'Dela din träning med kcal, längd och en bold titel — redo för stories.',
      src: '/share_workout.png',
      alt: 'IGNITE AI workout share cards med kcal och längd',
    },
  ],
  calculatorTitle: 'Snabb intäktskalkylator',
  calculatorBody: 'Flytta slidern för att uppskatta hur mycket berättigade årliga registreringar kan generera per månad.',
  calculatorLabel: 'Årliga registreringar / månad',
  calculatorSuffix: 'registreringar',
  calculatorResultPrefix: 'Månatlig potential',
  calculatorResultSuffix: 'i provisioner',
  codeRulesTitle: 'Kodregler',
  codeRules: [
    'Gäller endast för årlig Premium.',
    'Endast nya användare: konton som aldrig haft en IGNITE AI Premium-prenumeration.',
    'Räknas inte: förnyelser, återaktiveringar, uppgraderingar från tidigare Premium eller andra planer.',
    '{reward}-provisionen gäller endast den första berättigade årliga prenumerationen med din kod.',
    'Creators följer allt i appen; utbetalning begärs efter valideringsfönstret.',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'Vem är IGNITE-appen för?',
      a: 'För personer med ett viktmål (gå ner, behålla eller gå upp) som vill ha en ungefärlig uppskattning av kalorier och makron i det de äter, med måltids- och träningsspårning.',
    },
    {
      q: 'Vad är IGNITE-appen till för?',
      a: 'En fitness- och näringsapp: AI-måltidsskanningar (kalorier och makron), träningsloggning, framstegsspårning, Health-synk och verktyg för daglig consistency.',
    },
    {
      q: 'Vad får min publik?',
      a: 'Tillgång till den billigaste årsplanen i appen ({annual}), endast med din kod, plus din privata grupp: chat, måltids-/träningsfeed och consistency-leaderboard.',
    },
    {
      q: 'Hur mycket tjänar jag per konvertering?',
      a: 'Du tjänar fasta {reward} för varje berättigad ny årlig Premium-registrering med din kod.',
    },
    {
      q: 'Vad gör jag efter godkännande?',
      a: 'Du får VIP + kod, startar din Creator-grupp, delar koden (stories, Share Cards, inlägg) och följer konverteringar och utbetalningar i Creator Program-skärmen.',
    },
    {
      q: 'Hur förnyas VIP-åtkomsten?',
      a: 'De första 3 månaderna finns så att du kan testa appen ordentligt. Vi kan förnya så länge partnerskapet är aktivt och i linje.',
    },
    {
      q: 'Var skriver följare in min kod?',
      a: 'Under onboarding vid första registreringen. Koden är till för nya användare och endast årsplanen.',
    },
    {
      q: 'När får jag betalt?',
      a: 'Efter betalningsvalideringsfönstret. När en belöning blir berättigad visas den som ready to request och du kan begära utbetalning.',
    },
  ],
  ctaTitle: 'Nästa steg',
  ctaBody: 'Ansök i appen och börja dela.',
  ctaSteps: [
    'Ladda ner IGNITE AI',
    'Öppna Profile → Creator program → Apply',
    'Få din kod och börja dela',
  ],
  termsLink: 'Creator Program-villkor',
  publicProgramLink: 'Offentlig Creator Program-sida',
  contactEmail: 'hello@ignitehub.app',
}

const ja: CreatorOutreachContent = {
  metaTitle: 'Creators — パートナーシップ詳細 | IGNITE AI',
  metaDescription:
    'IGNITE AIでオーディエンスを収益化：年間登録ごとに{reward}、フォロワー向け限定{annual}プラン、アプリ内プライベートグループ、リアルタイム報酬トラッキング。',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'オーディエンスを収益化し、アプリ内フィットネスコミュニティを構築',
  subtitle:
    '対象となる年間登録ごとに{reward}を獲得。オーディエンスは最安の年間プランを{annual}で利用可能 — あなたのコード限定 — すべてをリアルタイムで追跡できます。',
  primaryCta: '60秒でcreatorに応募',
  secondaryCta: 'creator規約を見る',
  heroPoints: [
    '対象となる新規年間Premium登録ごとに{reward}',
    'オーディエンスは年間プランを{annual}で利用可能 — あなたのコード限定',
    'アプリを試せる3か月無料VIPアクセス',
  ],
  economyCreatorTitle: 'あなたが得られるもの',
  economyCreator: [
    '年間登録ごとの固定コミッション{reward}',
    '3か月の無料VIPアクセス（更新可能）',
    'プロフィール名の横にVerified Creatorバッジ',
    'アプリ内で限定「Creator」グループを作成可能',
    'コード利用・報酬・支払いを追跡するアプリ内ダッシュボード',
  ],
  economyAudienceTitle: 'オーディエンスが得られるもの',
  economyAudience: [
    'アプリ内最安の年間プラン：{annual} — あなたのコード限定',
    'アプリ内のあなたのプライベートグループへのアクセス',
    'チャット、食事/ワークアウトフィード、継続リーダーボード',
  ],
  appTrackingTitle: 'アプリ内ですべてを追跡',
  appTrackingIntro:
    'これらの画面は、creatorがIGNITE AI内でコード、帰属フォロワー、報酬ステータス、支払いフローをどのように見るかを正確に示しています。',
  appTrackingSteps: [
    {
      title: '1. コード + 概要',
      body: 'creatorコードを共有し、何人が使ったか、保留中と支払い済みの報酬をすぐに確認できます。',
      src: '/creators/creator1.png',
      alt: 'コード、保留中の報酬、支払い済み報酬が表示されたCreator Program画面',
    },
    {
      title: '2. 収益 + 支払い',
      body: '期間で絞り込み、解除された収益を追跡し、PayPalを保存し、対象になったら支払いをリクエストできます。',
      src: '/creators/creator2.png',
      alt: 'PayPal支払いリクエスト付きのcreator収益・支払い画面',
    },
    {
      title: '3. オーディエンス履歴',
      body: '各フォロワーのステータスを明確に確認：signed up、premium trial、ready to request、またはpaid。',
      src: '/creators/creator3.png',
      alt: 'フォロワー帰属とステータスを示すオーディエンス履歴画面',
    },
  ],
  appOverview: {
    title: 'アプリを間近で',
    body: 'メインダッシュボード：残りカロリー、マクロ（タンパク質・炭水化物・脂質）、水分、Apple Health同期、消費カロリー、写真付き食事ログ — すべて1画面に。',
    src: '/dark.png',
    alt: 'カロリー、マクロ、食事、Apple Healthが表示されたIGNITE AIダッシュボード',
  },
  groupScreens: [
    {
      title: 'グループチャット',
      body: 'IGNITE内のプライベートコミュニティ。フォロワー同士が話し、レシピを共有し、質問し、互いに責任を持ち合います。リアクションや返信はSNSのように機能します。',
      src: '/g1.png',
      alt: 'メッセージ、リアクション、返信があるCreator Groupチャットタブ',
    },
    {
      title: '食事 & ワークアウトフィード',
      body: 'グループメンバーが食事やワークアウトを記録するたび、写真・カロリー・マクロ・時間とともにフィードに自動表示。オーディエンスはあなたの食事とトレーニングを正確に見られます。',
      src: '/g2.png',
      alt: 'カヤックワークアウト投稿、カロリー、リアクションがあるCreator Groupフィードタブ',
    },
    {
      title: '継続リーダーボード',
      body: 'グループ内で最も多く記録している人の自動ランキング。コミュニティをゲーミファイし、継続を促します — メンバーはリーダーボードを上がりたいと考えます。',
      src: '/g3.png',
      alt: 'ストリーク別の継続ランキングがあるCreator Groupリーダーボードタブ',
    },
  ],
  groupsTitle: 'Creator Groups',
  groupsIntro:
    '承認されたcreatorはプロフィール名の横にVerifiedバッジを得ます。承認後、IGNITE内でプライベートグループを設定します。コードまたはリンクでオーディエンスを招待すると、3つのタブがあるコミュニティに参加します：',
  processTitle: '仕組み',
  processSteps: [
    'アプリをダウンロードし、Profile → Creator Program から応募。承認されれば、3か月のVIPとパーソナライズされたcreatorコードを受け取ります。',
    'アプリ内でプライベートグループを開始 — 任意ですが、ブランドとオーディエンスに合うならおすすめです。',
    'SNS向けコンテンツを作成：食事スキャン、食事・ワークアウトのシェアカード、ストーリーや投稿 — 新規ユーザーがオンボーディングで入力できるようコードを共有。',
    'Creator Program画面で登録、ステータス、支払いを追跡。',
  ],
  shareCardsTitle: 'SNS向けShare Cards',
  shareCardsBody:
    '記録した食事やワークアウトは、投稿準備完了のカードに：写真、カロリー、マクロまたは時間、編集可能なテーマ。ストーリー、Reels、投稿に最適 — creatorコードを自然に載せる場所にもなります。',
  shareCards: [
    {
      title: 'Meal Share Card',
      body: '食事スキャンをマクロとパンチのある一文のビジュアルに — テーマを選んで数秒で共有。',
      src: '/share_meal.png',
      alt: 'マクロとテーマ付きのIGNITE AI食事シェアカード',
    },
    {
      title: 'Workout Share Card',
      body: 'kcal、時間、印象的なタイトルでワークアウトを共有 — ストーリー向けに準備完了。',
      src: '/share_workout.png',
      alt: 'kcalと時間付きのIGNITE AIワークアウトシェアカード',
    },
  ],
  calculatorTitle: 'クイック収益計算機',
  calculatorBody: 'スライダーを動かして、対象となる年間登録が月にどれだけ生むか見積もります。',
  calculatorLabel: '年間登録 / 月',
  calculatorSuffix: '登録',
  calculatorResultPrefix: '月間ポテンシャル',
  calculatorResultSuffix: 'のコミッション',
  codeRulesTitle: 'コードのルール',
  codeRules: [
    '年間Premiumのみ有効。',
    '新規ユーザーのみ：これまでIGNITE AI Premiumサブスクリプションを持ったことがないアカウント。',
    '対象外：更新、再有効化、元Premiumからのアップグレード、その他のプラン。',
    '{reward}のコミッションは、あなたのコードでの最初の対象年間サブスクリプションにのみ適用。',
    'creatorはすべてアプリ内で追跡；支払いは検証ウィンドウ後にリクエスト。',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'IGNITEアプリは誰向け？',
      a: '体重目標（減量・維持・増量）があり、カロリーとマクロのおよその推定と、食事・ワークアウトのトラッキングを求める人向けです。',
    },
    {
      q: 'IGNITEアプリは何のため？',
      a: 'フィットネス＆栄養アプリ：AI食事スキャン（カロリーとマクロ）、ワークアウト記録、進捗トラッキング、Health同期、日々の継続を支えるツール。',
    },
    {
      q: 'オーディエンスは何を得ますか？',
      a: 'アプリ内最安の年間プラン（{annual}）へのアクセス — あなたのコード限定 — に加え、プライベートグループ：チャット、食事/ワークアウトフィード、継続リーダーボード。',
    },
    {
      q: 'コンバージョンごとにいくら稼げますか？',
      a: 'あなたのコードを使った対象となる新規年間Premium登録ごとに、固定の{reward}を獲得します。',
    },
    {
      q: '承認後は何をしますか？',
      a: 'VIP + コードを受け取り、Creatorグループを開始し、コードを共有（ストーリー、Share Cards、投稿）し、Creator Program画面でコンバージョンと支払いを追跡します。',
    },
    {
      q: 'VIPアクセスはどう更新されますか？',
      a: '最初の3か月はアプリをしっかり試すための期間です。パートナーシップが継続し、双方の方向性が合う限り更新できます。',
    },
    {
      q: 'フォロワーはどこでコードを入力しますか？',
      a: '初回登録時のオンボーディング中です。コードは新規ユーザー向けで、年間プランのみ対象です。',
    },
    {
      q: 'いつ支払われますか？',
      a: '支払い検証ウィンドウの後です。報酬が対象になるとready to requestと表示され、支払いをリクエストできます。',
    },
  ],
  ctaTitle: '次のステップ',
  ctaBody: 'アプリで応募して共有を始めましょう。',
  ctaSteps: [
    'IGNITE AIをダウンロード',
    'Profile → Creator program → Apply を開く',
    'コードを受け取り共有を開始',
  ],
  termsLink: 'Creator Program規約',
  publicProgramLink: 'Creator Program公開ページ',
  contactEmail: 'hello@ignitehub.app',
}

const ko: CreatorOutreachContent = {
  metaTitle: 'Creators — 파트너십 세부 정보 | IGNITE AI',
  metaDescription:
    'IGNITE AI로 오디언스를 수익화하세요: 연간 가입당 {reward}, 팔로워를 위한 독점 {annual} 플랜, 앱 내 프라이빗 그룹, 실시간 리워드 트래킹.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: '오디언스를 수익화하고 앱 안에서 피트니스 커뮤니티를 만드세요',
  subtitle:
    '적격 연간 가입당 {reward}를 받으세요. 오디언스는 최저 연간 플랜을 {annual}에 이용할 수 있습니다 — 당신의 코드로만 가능 — 그리고 모든 것을 실시간으로 추적합니다.',
  primaryCta: '60초 만에 creator로 신청',
  secondaryCta: 'creator 약관 보기',
  heroPoints: [
    '적격한 신규 연간 Premium 가입마다 {reward}',
    '오디언스는 연간 플랜을 {annual}에 이용 — 당신의 코드로만 가능',
    '앱을 테스트할 수 있는 3개월 무료 VIP 이용권',
  ],
  economyCreatorTitle: '당신이 얻는 것',
  economyCreator: [
    '연간 가입당 고정 커미션 {reward}',
    '3개월 무료 VIP 이용권, 갱신 가능',
    '프로필 이름 옆 Verified Creator 배지',
    '앱 안에서 독점 "Creator" 그룹 생성 가능',
    '코드 사용, 리워드, 지급 추적용 앱 내 대시보드',
  ],
  economyAudienceTitle: '오디언스가 얻는 것',
  economyAudience: [
    '앱 내 가장 저렴한 연간 플랜: {annual} — 당신의 코드 전용',
    '앱 안 당신의 프라이빗 그룹 이용',
    '채팅, 식사/운동 피드, 꾸준함 리더보드',
  ],
  appTrackingTitle: '앱에서 모든 것을 추적',
  appTrackingIntro:
    '이 화면들은 creator가 IGNITE AI 안에서 코드, 귀속 팔로워, 리워드 상태, 지급 흐름을 어떻게 보는지 정확히 보여줍니다.',
  appTrackingSteps: [
    {
      title: '1. 코드 + 개요',
      body: 'creator 코드를 공유하고 몇 명이 사용했는지, 대기 중 vs 지급된 리워드를 즉시 확인하세요.',
      src: '/creators/creator1.png',
      alt: '코드, 대기 리워드, 지급된 리워드가 표시된 Creator Program 화면',
    },
    {
      title: '2. 수익 + 지급',
      body: '기간으로 필터링하고, 잠금 해제된 수익을 추적하고, PayPal을 저장한 뒤 자격이 되면 지급을 요청하세요.',
      src: '/creators/creator2.png',
      alt: 'PayPal 지급 요청이 있는 creator 수익 및 지급 화면',
    },
    {
      title: '3. 오디언스 기록',
      body: '각 팔로워 상태를 명확히 확인: signed up, premium trial, ready to request 또는 paid.',
      src: '/creators/creator3.png',
      alt: '팔로워 귀속과 상태를 보여주는 오디언스 기록 화면',
    },
  ],
  appOverview: {
    title: '앱을 가까이에서',
    body: '메인 대시보드: 남은 칼로리, 매크로(단백질, 탄수화물, 지방), 수분, Apple Health 동기화, 소모 칼로리, 사진이 있는 식사 기록 — 모두 한 화면에.',
    src: '/dark.png',
    alt: '칼로리, 매크로, 식사, Apple Health가 표시된 IGNITE AI 대시보드',
  },
  groupScreens: [
    {
      title: '그룹 채팅',
      body: 'IGNITE 안의 프라이빗 커뮤니티. 팔로워들이 서로 이야기하고, 레시피를 공유하고, 질문하고, 서로 책임감을 유지합니다. 반응과 답글은 SNS처럼 작동합니다.',
      src: '/g1.png',
      alt: '메시지, 반응, 답글이 있는 Creator Group 채팅 탭',
    },
    {
      title: '식사 & 운동 피드',
      body: '그룹 멤버가 식사나 운동을 기록할 때마다 사진, 칼로리, 매크로, 시간과 함께 피드에 자동으로 표시됩니다. 오디언스는 당신이 무엇을 먹고 어떻게 운동하는지 정확히 봅니다.',
      src: '/g2.png',
      alt: '카약 운동 포스트, 칼로리, 반응이 있는 Creator Group 피드 탭',
    },
    {
      title: '꾸준함 리더보드',
      body: '그룹 안에서 가장 많이 기록하는 사람의 자동 순위. 커뮤니티를 게이미파이하고 꾸준함을 장려하세요 — 멤버들은 리더보드를 오르고 싶어 합니다.',
      src: '/g3.png',
      alt: '스트릭별 꾸준함 순위가 있는 Creator Group 리더보드 탭',
    },
  ],
  groupsTitle: 'Creator Groups',
  groupsIntro:
    '승인된 creator는 프로필 이름 옆에 인증 배지를 받습니다. 승인되면 IGNITE 안에서 프라이빗 그룹을 설정합니다. 코드나 링크로 오디언스를 초대하면 3개 탭이 있는 커뮤니티에 참여합니다:',
  processTitle: '작동 방식',
  processSteps: [
    '앱을 다운로드하고 Profile → Creator Program으로 가 신청하세요. 승인되면 3개월 VIP와 맞춤 creator 코드를 받습니다.',
    '앱 안에서 프라이빗 그룹을 시작하세요 — 선택 사항이지만 브랜드와 오디언스에 맞다면 좋은 아이디어입니다.',
    'SNS용 콘텐츠 제작: 식사 스캔, 식사·운동 공유 카드, 스토리와 포스트 — 신규 사용자가 온보딩에서 입력할 수 있도록 코드를 공유하세요.',
    'Creator Program 화면에서 가입, 상태, 지급을 추적하세요.',
  ],
  shareCardsTitle: 'SNS용 Share Cards',
  shareCardsBody:
    '기록한 식사나 운동은 바로 올릴 수 있는 카드가 됩니다: 사진, 칼로리, 매크로 또는 시간, 편집 가능한 테마. 스토리, Reels, 포스트에 완벽 — creator 코드를 자연스럽게 넣을 자리이기도 합니다.',
  shareCards: [
    {
      title: 'Meal Share Card',
      body: '식사 스캔을 매크로와 임팩트 있는 문구가 있는 비주얼로 — 테마를 고르고 몇 초 만에 공유하세요.',
      src: '/share_meal.png',
      alt: '매크로와 테마가 있는 IGNITE AI 식사 공유 카드',
    },
    {
      title: 'Workout Share Card',
      body: 'kcal, 시간, 강렬한 제목으로 운동을 공유 — 스토리용으로 준비 완료.',
      src: '/share_workout.png',
      alt: 'kcal와 시간이 있는 IGNITE AI 운동 공유 카드',
    },
  ],
  calculatorTitle: '빠른 수익 계산기',
  calculatorBody: '슬라이더를 움직여 적격 연간 가입이 한 달에 얼마나 창출할 수 있는지 추정하세요.',
  calculatorLabel: '연간 가입 / 월',
  calculatorSuffix: '가입',
  calculatorResultPrefix: '월간 잠재 수익',
  calculatorResultSuffix: '커미션',
  codeRulesTitle: '코드 규칙',
  codeRules: [
    '연간 Premium에만 유효합니다.',
    '신규 사용자만: IGNITE AI Premium 구독을 한 번도 가진 적 없는 계정.',
    '포함되지 않음: 갱신, 재활성화, 이전 Premium 업그레이드, 기타 플랜.',
    '{reward} 커미션은 당신의 코드로 한 첫 적격 연간 구독에만 적용됩니다.',
    'creator는 앱에서 모든 것을 추적합니다; 지급은 검증 기간 후에 요청합니다.',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'IGNITE 앱은 누구를 위한 건가요?',
      a: '체중 목표(감량, 유지 또는 증량)가 있고, 칼로리와 매크로의 대략적인 추정치와 식사·운동 트래킹을 원하는 사람들을 위한 앱입니다.',
    },
    {
      q: 'IGNITE 앱은 무엇을 위한 건가요?',
      a: '피트니스 및 영양 앱입니다: AI 식사 스캔(칼로리와 매크로), 운동 기록, 진행 트래킹, Health 동기화, 매일 꾸준함을 유지하는 도구.',
    },
    {
      q: '내 오디언스는 무엇을 얻나요?',
      a: '앱 내 가장 저렴한 연간 플랜({annual}) 이용 — 당신의 코드로만 — 그리고 프라이빗 그룹: 채팅, 식사/운동 피드, 꾸준함 리더보드.',
    },
    {
      q: '전환당 얼마나 벌나요?',
      a: '당신의 코드를 사용한 적격 신규 연간 Premium 가입마다 고정 {reward}를 받습니다.',
    },
    {
      q: '승인 후에는 무엇을 하나요?',
      a: 'VIP + 코드를 받고, Creator 그룹을 시작하고, 코드를 공유(스토리, Share Cards, 포스트)하며, Creator Program 화면에서 전환과 지급을 추적합니다.',
    },
    {
      q: 'VIP 이용권은 어떻게 갱신되나요?',
      a: '처음 3개월은 앱을 제대로 테스트하기 위한 기간입니다. 파트너십이 활성 상태이고 방향이 맞으면 갱신할 수 있습니다.',
    },
    {
      q: '팔로워는 어디에 내 코드를 입력하나요?',
      a: '첫 등록 시 온보딩 중입니다. 코드는 신규 사용자와 연간 플랜 전용입니다.',
    },
    {
      q: '언제 지급받나요?',
      a: '결제 검증 기간 이후입니다. 리워드가 적격이 되면 ready to request로 표시되며 지급을 요청할 수 있습니다.',
    },
  ],
  ctaTitle: '다음 단계',
  ctaBody: '앱에서 신청하고 공유를 시작하세요.',
  ctaSteps: [
    'IGNITE AI 다운로드',
    'Profile → Creator program → Apply 열기',
    '코드를 받고 공유 시작',
  ],
  termsLink: 'Creator Program 약관',
  publicProgramLink: 'Creator Program 공개 페이지',
  contactEmail: 'hello@ignitehub.app',
}

const zh: CreatorOutreachContent = {
  metaTitle: 'Creators — 合作详情 | IGNITE AI',
  metaDescription:
    '用 IGNITE AI 变现你的受众：每笔年订注册可得 {reward}，粉丝专享 {annual} 年订方案、应用内私密群组，以及实时奖励追踪。',
  eyebrow: 'IGNITE AI · Creator Program',
  title: '变现你的受众，并在应用内打造健身社区',
  subtitle:
    '每笔符合条件的年订注册可赚 {reward}。你的受众可享受最低年订方案 {annual} — 仅限你的邀请码 — 你可实时追踪一切。',
  primaryCta: '60 秒申请成为 creator',
  secondaryCta: '查看 creator 条款',
  heroPoints: [
    '每笔符合条件的新增年订 Premium 注册可得 {reward}',
    '你的受众可以 {annual} 获得年订方案 — 仅限你的邀请码',
    '3 个月免费 VIP，用于体验应用',
  ],
  economyCreatorTitle: '你将获得',
  economyCreator: [
    '每笔年订注册固定佣金 {reward}',
    '3 个月免费 VIP，可续期',
    '个人资料名称旁的 Verified Creator 徽章',
    '可在应用内创建专属「Creator」群组',
    '应用内仪表盘，追踪邀请码使用、奖励与提现',
  ],
  economyAudienceTitle: '你的受众将获得',
  economyAudience: [
    '应用内最便宜的年订方案：{annual} — 仅限你的邀请码',
    '进入你在应用内的私密群组',
    '聊天、饮食/训练动态，以及坚持度排行榜',
  ],
  appTrackingTitle: '在应用内追踪一切',
  appTrackingIntro:
    '这些界面准确展示 creator 如何在 IGNITE AI 中查看邀请码、归属粉丝、奖励状态与提现流程。',
  appTrackingSteps: [
    {
      title: '1. 邀请码 + 总览',
      body: '分享你的 creator 邀请码，即时查看使用人数，以及待结算与已支付奖励。',
      src: '/creators/creator1.png',
      alt: '显示邀请码、待结算奖励与已支付奖励的 Creator Program 界面',
    },
    {
      title: '2. 收益 + 提现',
      body: '按周期筛选，追踪已解锁收入，保存 PayPal，符合条件后申请提现。',
      src: '/creators/creator2.png',
      alt: '带 PayPal 提现申请的 creator 收益与提现界面',
    },
    {
      title: '3. 受众历史',
      body: '清晰查看每位粉丝状态：signed up、premium trial、ready to request 或 paid。',
      src: '/creators/creator3.png',
      alt: '显示粉丝归属与状态的受众历史界面',
    },
  ],
  appOverview: {
    title: '近距离看应用',
    body: '主仪表盘：剩余卡路里、宏量营养素（蛋白质、碳水、脂肪）、水分、Apple Health 同步、消耗卡路里，以及带照片的饮食记录 — 全部集中在一个界面。',
    src: '/dark.png',
    alt: '显示卡路里、宏量营养素、饮食与 Apple Health 的 IGNITE AI 仪表盘',
  },
  groupScreens: [
    {
      title: '群组聊天',
      body: 'IGNITE 内的私密社区。粉丝可互相交流、分享食谱、提问并互相督促。反应与回复像社交网络一样运作。',
      src: '/g1.png',
      alt: '带消息、反应与回复的 Creator Group 聊天标签',
    },
    {
      title: '饮食与训练动态',
      body: '群组成员每次记录饮食或训练，都会自动出现在动态中 — 含照片、卡路里、宏量营养素与时长。受众能准确看到你吃什么、练什么。',
      src: '/g2.png',
      alt: '带皮划艇训练帖、卡路里与反应的 Creator Group 动态标签',
    },
    {
      title: '坚持度排行榜',
      body: '自动排名群组内记录最多的人。让社区游戏化并激励坚持 — 成员都想登上排行榜。',
      src: '/g3.png',
      alt: '按连续记录天数排名坚持度的 Creator Group 排行榜标签',
    },
  ],
  groupsTitle: 'Creator Groups',
  groupsIntro:
    '获批的 creator 会在个人资料名称旁获得认证徽章。获批后，你可在 IGNITE 内设置私密群组。通过邀请码或链接邀请受众加入，他们将进入你带有 3 个标签页的社区：',
  processTitle: '如何运作',
  processSteps: [
    '下载应用，前往 Profile → Creator Program 并申请。获批后，你将获得 3 个月 VIP 以及个性化 creator 邀请码。',
    '在应用内启动私密群组 — 可选，但若适合你的品牌与受众，会是很棒的想法。',
    '为社交平台创作内容：饮食扫描、饮食与训练分享卡片、快拍与帖子 — 并分享邀请码，让新用户在引导流程中输入。',
    '在 Creator Program 界面追踪注册、状态与提现。',
  ],
  shareCardsTitle: '面向社交平台的 Share Cards',
  shareCardsBody:
    '你记录的每餐饮食或每次训练都可变成可直接发布的卡片：照片、卡路里、宏量营养素或时长，主题可编辑。非常适合快拍、Reels 与帖子 — 也是自然放置 creator 邀请码的地方。',
  shareCards: [
    {
      title: 'Meal Share Card',
      body: '把饮食扫描变成带宏量营养素与有力文案的视觉卡片 — 选择主题，几秒即可分享。',
      src: '/share_meal.png',
      alt: '带宏量营养素与主题的 IGNITE AI 饮食分享卡片',
    },
    {
      title: 'Workout Share Card',
      body: '用 kcal、时长与醒目标题分享训练 — 可直接发快拍。',
      src: '/share_workout.png',
      alt: '带 kcal 与时长的 IGNITE AI 训练分享卡片',
    },
  ],
  calculatorTitle: '快速收益计算器',
  calculatorBody: '移动滑块，估算符合条件的年订注册每月可能产生的收益。',
  calculatorLabel: '年订注册 / 月',
  calculatorSuffix: '次注册',
  calculatorResultPrefix: '每月潜力',
  calculatorResultSuffix: '佣金',
  codeRulesTitle: '邀请码规则',
  codeRules: [
    '仅对年订 Premium 有效。',
    '仅限新用户：从未拥有过任何 IGNITE AI Premium 订阅的账户。',
    '不计：续订、重新激活、前 Premium 升级或其他方案。',
    '{reward} 佣金仅适用于使用你邀请码的首笔符合条件的年订订阅。',
    'creator 在应用内追踪一切；提现需在验证窗口之后申请。',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'IGNITE 应用适合谁？',
      a: '适合有体重目标（减重、维持或增重），希望大致估算饮食卡路里与宏量营养素，并跟踪饮食与训练的人。',
    },
    {
      q: 'IGNITE 应用是做什么的？',
      a: '一款健身与营养应用：AI 饮食扫描（卡路里与宏量营养素）、训练记录、进度追踪、Health 同步，以及帮助日常坚持的工具。',
    },
    {
      q: '我的受众能得到什么？',
      a: '可获得应用内最便宜的年订方案（{annual}），仅限你的邀请码，外加你的私密群组：聊天、饮食/训练动态与坚持度排行榜。',
    },
    {
      q: '每次转化我能赚多少？',
      a: '使用你邀请码完成的每笔符合条件的新增年订 Premium 注册，你可获得固定 {reward}。',
    },
    {
      q: '获批后我要做什么？',
      a: '你将获得 VIP + 邀请码，启动 Creator 群组，分享邀请码（快拍、Share Cards、帖子），并在 Creator Program 界面追踪转化与提现。',
    },
    {
      q: 'VIP 如何续期？',
      a: '前 3 个月用于充分体验应用。只要合作关系持续且双方方向一致，我们就可以续期。',
    },
    {
      q: '粉丝在哪里输入我的邀请码？',
      a: '在首次注册的引导流程中。邀请码面向新用户，且仅适用于年订方案。',
    },
    {
      q: '我何时能拿到钱？',
      a: '在付款验证窗口之后。奖励变为符合条件后会显示为 ready to request，你即可申请提现。',
    },
  ],
  ctaTitle: '下一步',
  ctaBody: '在应用中申请并开始分享。',
  ctaSteps: [
    '下载 IGNITE AI',
    '打开 Profile → Creator program → Apply',
    '获取邀请码并开始分享',
  ],
  termsLink: 'Creator Program 条款',
  publicProgramLink: 'Creator Program 公开页面',
  contactEmail: 'hello@ignitehub.app',
}

export const creatorOutreachByLocale: Partial<Record<Locale, CreatorOutreachContent>> = {
  'pt-br': ptBr,
  es,
  fr,
  de,
  it,
  nl,
  no,
  sv,
  ja,
  ko,
  zh,
}
