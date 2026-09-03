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
  communityTitle: string
  communityCards: CreatorOutreachCard[]
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
    'Monetiza a tua audiência com IGNITE AI: €10 por anual, €15 off para a comunidade, grupo privado na app e tracking de payouts.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Monetiza a tua audiência e cria a tua comunidade fitness dentro da app',
  subtitle:
    'Ganha €10 por cada adesão anual elegível, oferece €15 de desconto à tua audiência e acompanha tudo em tempo real no ecrã Creator Program.',
  primaryCta: 'Candidatar-me em 60 segundos',
  secondaryCta: 'Ver termos do programa',
  heroPoints: [
    '€10 por cada nova subscrição anual elegível',
    '€15 off para a tua audiência: de €59.90 para €44.90',
    '3 meses de VIP gratuitos para testares a app',
  ],
  economyCreatorTitle: 'O que tu ganhas',
  economyCreator: [
    '€10 de comissão fixa por cada adesão anual',
    '3 meses de acesso VIP gratuitos, renováveis',
    'Painel na app para acompanhar código, ganhos e payout',
  ],
  economyAudienceTitle: 'O que a tua comunidade ganha',
  economyAudience: [
    '€15 de desconto no anual Premium (€59.90 → €44.90)',
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
  communityTitle: 'A tua comunidade privada na IGNITE',
  communityCards: [
    {
      title: 'Private chat',
      body: 'Canal directo com os teus followers mais envolvidos para responder perguntas e puxar consistência.',
    },
    {
      title: 'Meal & workout feed',
      body: 'A tua comunidade vê refeições e treinos registados em tempo real dentro do grupo.',
    },
    {
      title: 'Consistency leaderboard',
      body: 'Gamifica o grupo com ranking de quem está a registar mais e melhor.',
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
    'Monetize your audience with IGNITE AI: €10 per annual signup, €15 off for followers, a private in-app group, and live reward tracking.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Monetize your audience and build your in-app fitness community',
  subtitle:
    'Earn €10 per eligible annual signup, give your audience €15 off, and track code usage, rewards, and payout status inside the app.',
  primaryCta: 'Apply as a creator in 60 seconds',
  secondaryCta: 'View creator terms',
  heroPoints: [
    '€10 for each eligible new annual Premium signup',
    '€15 off for your audience: from €59.90 to €44.90',
    '3 months of free VIP access to test the app',
  ],
  economyCreatorTitle: 'What you get',
  economyCreator: [
    '€10 fixed commission per annual signup',
    '3 months of free VIP access, renewable',
    'In-app dashboard for code usage, rewards, and payout tracking',
  ],
  economyAudienceTitle: 'What your audience gets',
  economyAudience: [
    '€15 off annual Premium (€59.90 → €44.90)',
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
  communityTitle: 'Your dedicated in-app hub',
  communityCards: [
    {
      title: 'Private chat',
      body: 'Keep a direct line with your most engaged followers to answer questions and keep momentum high.',
    },
    {
      title: 'Meal & workout feed',
      body: 'Let your audience see daily meals and workouts logged inside the group in real time.',
    },
    {
      title: 'Consistency leaderboard',
      body: 'Gamify your community with a leaderboard that rewards the followers who stay most consistent.',
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
