import type { Locale } from '@/lib/i18n/locales'

export type CreatorOutreachFaq = {
  q: string
  a: string
}

export type CreatorOutreachCard = {
  title: string
  body: string
}

export type CreatorOutreachImageStep = {
  title: string
  body: string
  src: string
  alt: string
}

export type CreatorOutreachContent = {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  title: string
  subtitle: string
  primaryCta: string
  secondaryCta: string
  heroPoints: string[]
  economyCreatorTitle: string
  economyCreator: string[]
  economyAudienceTitle: string
  economyAudience: string[]
  appTrackingTitle: string
  appTrackingIntro: string
  appTrackingSteps: CreatorOutreachImageStep[]
  appOverview: CreatorOutreachImageStep
  groupScreens: CreatorOutreachImageStep[]
  processTitle: string
  processSteps: string[]
  calculatorTitle: string
  calculatorBody: string
  calculatorLabel: string
  calculatorSuffix: string
  calculatorResultPrefix: string
  calculatorResultSuffix: string
  codeRulesTitle: string
  codeRules: string[]
  faqTitle: string
  faq: CreatorOutreachFaq[]
  ctaTitle: string
  ctaBody: string
  ctaSteps: string[]
  termsLink: string
  publicProgramLink: string
  contactEmail: string
}

const pt: CreatorOutreachContent = {
  metaTitle: 'Creators — detalhes da parceria | IGNITE AI',
  metaDescription:
    'Monetiza a tua audiência com IGNITE AI: €10 por anual, plano exclusivo a €44.90 para a comunidade, grupo privado na app e tracking de payouts.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Monetiza a tua audiência e cria a tua comunidade fitness dentro da app',
  subtitle:
    'Ganha €10 por cada adesão anual elegível, a tua audiência acede ao plano mais barato da app (€44.90/ano) — só possível com o teu código — e acompanhas tudo em tempo real.',
  primaryCta: 'Candidatar-me em 60 segundos',
  secondaryCta: 'Ver termos do programa',
  heroPoints: [
    '€10 por cada nova subscrição anual elegível',
    'A tua audiência acede ao plano anual a €44.90 — só possível com o teu código',
    '3 meses de VIP gratuitos para testares a app',
  ],
  economyCreatorTitle: 'O que tu ganhas',
  economyCreator: [
    '€10 de comissão fixa por cada adesão anual',
    '3 meses de acesso VIP gratuitos, renováveis',
    'Badge de Creator verificado ao lado do teu nome de perfil',
    'Possibilidade de criar um grupo "Creator" exclusivo dentro da app',
    'Painel na app para acompanhar código, ganhos e payout',
  ],
  economyAudienceTitle: 'O que a tua comunidade ganha',
  economyAudience: [
    'Acesso ao plano anual mais barato da app: €44.90 — exclusivo com o teu código',
    'Acesso ao teu grupo privado dentro da app',
    'Chat, feed de refeições/treinos e leaderboard de consistência',
  ],
  appTrackingTitle: 'Controla tudo dentro da app',
  appTrackingIntro:
    'As imagens abaixo mostram exactamente como vês o teu código, quem entrou, o estado de cada follower e os rewards pendentes/pagos.',
  appTrackingSteps: [
    {
      title: '1. Código + visão geral',
      body: 'Partilhas o teu código, vês quantas pessoas o usaram e quanto tens pendente vs pago.',
      src: '/creators/creator1.png',
      alt: 'Ecrã do Creator Program com código, reward pendente e reward pago',
    },
    {
      title: '2. Ganhos + payout',
      body: 'Filtras por período, vês total desbloqueado, guardas o PayPal e pedes payout quando estiver pronto.',
      src: '/creators/creator2.png',
      alt: 'Ecrã com ganhos, payout pendente, payout pago e pedido de PayPal payout',
    },
    {
      title: '3. Histórico da audiência',
      body: 'Vês o estado de cada pessoa: signed up, premium trial, ready to request ou paid.',
      src: '/creators/creator3.png',
      alt: 'Histórico da audiência com estados de cada utilizador atribuído ao creator',
    },
  ],
  appOverview: {
    title: 'A app por dentro',
    body: 'Dashboard principal: calorias restantes, macros (proteína, hidratos, gordura), hidratação, Apple Health, calorias queimadas e refeições registadas com foto — tudo num só ecrã.',
    src: '/dark.png',
    alt: 'Dashboard IGNITE AI com calorias, macros, refeições e Apple Health',
  },
  groupScreens: [
    {
      title: 'Chat do grupo',
      body: 'Comunidade privada dentro da IGNITE. Os teus followers falam entre si, partilham receitas, tiram dúvidas e mantêm-se accountable. Reacções e respostas como numa rede social.',
      src: '/g1.png',
      alt: 'Aba Chat do Creator Group com mensagens, reacções e respostas',
    },
    {
      title: 'Feed de refeições e treinos',
      body: 'Cada vez que um membro do grupo regista uma refeição ou treino, aparece automaticamente no feed — com foto, calorias, macros e duração. A audiência vê exactamente o que comes e treinas.',
      src: '/g2.png',
      alt: 'Aba Feed do Creator Group com um post de treino de kayaking, calorias e reacções',
    },
    {
      title: 'Leaderboard de consistência',
      body: 'Ranking automático de quem está a registar mais dentro do grupo. Gamifica a tua comunidade e incentiva consistência — os membros querem subir no leaderboard.',
      src: '/g3.png',
      alt: 'Aba Leaderboard do Creator Group com ranking de consistência por streak',
    },
  ],
  processTitle: 'Como funciona',
  processSteps: [
    'Candidatas-te e, se fores aprovado, recebes 3 meses de VIP e o teu código personalizado.',
    'Lanças o teu grupo privado dentro da app.',
    'Partilhas o teu código com a audiência; novos users inserem-no no onboarding.',
    'Acompanhas registos, estados e pagamentos no ecrã Creator Program.',
  ],
  calculatorTitle: 'Calculadora rápida',
  calculatorBody: 'Move o slider e vê quanto renderiam conversões anuais elegíveis num mês.',
  calculatorLabel: 'Conversões anuais / mês',
  calculatorSuffix: 'conversões',
  calculatorResultPrefix: 'Potencial mensal',
  calculatorResultSuffix: 'em comissões',
  codeRulesTitle: 'Regras do código',
  codeRules: [
    'Válido apenas para o plano Premium anual.',
    'Só para novos users que nunca tiveram qualquer subscrição Premium na IGNITE AI.',
    'Não conta: renovação, reactivação, upgrade de ex-Premium ou outros planos.',
    'A comissão de €10 aplica-se apenas à 1.ª subscrição anual elegível com o teu código.',
    'O creator acompanha tudo na app; payout é pedido após a janela de validação.',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'Como é renovado o acesso VIP?',
      a: 'Os 3 meses iniciais servem para testares a app. Podemos renovar enquanto a parceria estiver activa e fizer sentido para ambos.',
    },
    {
      q: 'Onde é que os followers metem o meu código?',
      a: 'No onboarding, durante o primeiro registo. O código é pensado para novos users e para o plano anual.',
    },
    {
      q: 'Quando recebo?',
      a: 'Depois da janela de validação do pagamento. Quando o reward ficar elegível, aparece como ready to request e podes pedir payout.',
    },
  ],
  ctaTitle: 'Próximo passo',
  ctaBody:
    'Responde ao contacto da equipa com o teu handle, país e email, ou candidata-te directamente na app.',
  ctaSteps: [
    'Descarrega IGNITE AI',
    'Abre Perfil → Creator program → Apply',
    'Recebe o teu código e começa a partilhar',
  ],
  termsLink: 'Termos do Programa de Criadores',
  publicProgramLink: 'Página pública do Creator Program',
  contactEmail: 'hello@ignitehub.app',
}

const en: CreatorOutreachContent = {
  metaTitle: 'Creators — partnership details | IGNITE AI',
  metaDescription:
    'Monetize your audience with IGNITE AI: €10 per annual signup, exclusive €44.90 plan for followers, a private in-app group, and live reward tracking.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Monetize your audience and build your in-app fitness community',
  subtitle:
    'Earn €10 per eligible annual signup. Your audience gets the lowest annual plan at €44.90 — only available with your code — and you track everything in real time.',
  primaryCta: 'Apply as a creator in 60 seconds',
  secondaryCta: 'View creator terms',
  heroPoints: [
    '€10 for each eligible new annual Premium signup',
    'Your audience gets the annual plan at €44.90 — only available with your code',
    '3 months of free VIP access to test the app',
  ],
  economyCreatorTitle: 'What you get',
  economyCreator: [
    '€10 fixed commission per annual signup',
    '3 months of free VIP access, renewable',
    'Verified Creator badge next to your profile name',
    'Ability to create an exclusive "Creator" group inside the app',
    'In-app dashboard for code usage, rewards, and payout tracking',
  ],
  economyAudienceTitle: 'What your audience gets',
  economyAudience: [
    'Access to the cheapest annual plan in the app: €44.90 — exclusive with your code',
    'Access to your private group inside the app',
    'Chat, meal/workout feed, and consistency leaderboard',
  ],
  appTrackingTitle: 'Track everything in the app',
  appTrackingIntro:
    'These screens show exactly how creators view their code, attributed followers, reward status, and payout flow inside IGNITE AI.',
  appTrackingSteps: [
    {
      title: '1. Code + overview',
      body: 'Share your creator code and instantly see how many people used it, plus pending versus paid rewards.',
      src: '/creators/creator1.png',
      alt: 'Creator Program screen with code, pending rewards, and paid rewards',
    },
    {
      title: '2. Earnings + payout',
      body: 'Filter by period, track unlocked revenue, save your PayPal email, and request payout when eligible.',
      src: '/creators/creator2.png',
      alt: 'Creator earnings and payout screen with PayPal payout request',
    },
    {
      title: '3. Audience history',
      body: 'See each follower status clearly: signed up, premium trial, ready to request, or paid.',
      src: '/creators/creator3.png',
      alt: 'Audience history screen showing follower attribution and status',
    },
  ],
  appOverview: {
    title: 'The app up close',
    body: 'Main dashboard: remaining calories, macros (protein, carbs, fat), hydration, Apple Health sync, calories burned, and meals logged with photos — all on one screen.',
    src: '/dark.png',
    alt: 'IGNITE AI dashboard with calories, macros, meals, and Apple Health',
  },
  groupScreens: [
    {
      title: 'Group chat',
      body: 'A private community inside IGNITE. Your followers talk to each other, share recipes, ask questions, and stay accountable. Reactions and replies work just like a social network.',
      src: '/g1.png',
      alt: 'Creator Group Chat tab with messages, reactions, and replies',
    },
    {
      title: 'Meal & workout feed',
      body: 'Every time a group member logs a meal or workout, it shows up automatically in the feed — with photo, calories, macros, and duration. Your audience sees exactly what you eat and train.',
      src: '/g2.png',
      alt: 'Creator Group Feed tab with a kayaking workout post, calories, and reactions',
    },
    {
      title: 'Consistency leaderboard',
      body: "Automatic ranking of who's logging the most inside the group. Gamify your community and encourage consistency — members want to climb the leaderboard.",
      src: '/g3.png',
      alt: 'Creator Group Leaderboard tab with consistency ranking by streak',
    },
  ],
  processTitle: 'How it works',
  processSteps: [
    'Apply and, if approved, receive 3 months of VIP access plus your personalized creator code.',
    'Launch your private group inside the app.',
    'Share your code; new users enter it during onboarding.',
    'Track signups, statuses, and payouts inside the Creator Program screen.',
  ],
  calculatorTitle: 'Quick earnings calculator',
  calculatorBody: 'Move the slider to estimate how much eligible annual signups could generate per month.',
  calculatorLabel: 'Annual signups / month',
  calculatorSuffix: 'signups',
  calculatorResultPrefix: 'Monthly potential',
  calculatorResultSuffix: 'in commissions',
  codeRulesTitle: 'Code rules',
  codeRules: [
    'Valid for annual Premium only.',
    'New users only: accounts that never had any IGNITE AI Premium subscription before.',
    'Does not count: renewals, reactivations, former Premium upgrades, or other plans.',
    'The €10 commission only applies to the first eligible annual subscription with your code.',
    'Creators track everything in-app; payout is requested after the validation window.',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'How is VIP access renewed?',
      a: 'The first 3 months are there so you can test the app properly. We can renew access while the partnership remains active and aligned.',
    },
    {
      q: 'Where do followers enter my code?',
      a: 'During onboarding on first registration. The code is designed for new users and the annual plan only.',
    },
    {
      q: 'When do I get paid?',
      a: 'After the payment validation window. Once a reward becomes eligible, it appears as ready to request and you can request payout.',
    },
  ],
  ctaTitle: 'Next step',
  ctaBody:
    'Reply to the team with your handle, country, and email, or apply directly inside the app.',
  ctaSteps: [
    'Download IGNITE AI',
    'Open Profile → Creator program → Apply',
    'Get your code and start sharing',
  ],
  termsLink: 'Creator Program Terms',
  publicProgramLink: 'Public Creator Program page',
  contactEmail: 'hello@ignitehub.app',
}

export function getCreatorOutreachContent(locale: Locale): CreatorOutreachContent {
  if (locale === 'pt' || locale === 'pt-br') return pt
  return en
}
