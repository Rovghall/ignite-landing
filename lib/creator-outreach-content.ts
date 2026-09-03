import type { Locale } from '@/lib/i18n/locales'

export type CreatorOutreachSection = {
  title: string
  body?: string
  bullets?: string[]
}

export type CreatorOutreachContent = {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  title: string
  subtitle: string
  intro: string
  sections: CreatorOutreachSection[]
  codeRulesTitle: string
  codeRules: string[]
  faqTitle: string
  faq: { q: string; a: string }[]
  ctaTitle: string
  ctaBody: string
  ctaSteps: string[]
  termsLink: string
  publicProgramLink: string
  contactEmail: string
}

const pt: CreatorOutreachContent = {
  metaTitle: 'Creator Program — detalhes | IGNITE AI',
  metaDescription:
    'Oferta do Creator Program IGNITE AI: Premium grátis, código anual exclusivo, €10 por conversão e Creator Groups.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Detalhes da parceria',
  subtitle: 'Documento para creators contactados pela equipa IGNITE.',
  intro:
    'Esta página resume a oferta, regras do código e próximos passos. A candidatura oficial continua a ser feita na app.',
  sections: [
    {
      title: 'O que é a IGNITE AI',
      bullets: [
        'App de nutrição e fitness (iOS e Android)',
        'Plano calórico personalizado — perder peso, ganhar massa ou manter',
        'Foto da refeição → calorias, macros e ingredientes em ~5 segundos',
        'Registo de treinos e partilha com a comunidade',
      ],
    },
    {
      title: 'O que recebes',
      bullets: [
        'Premium grátis para testares (período definido, renovável enquanto a parceria durar)',
        'Código exclusivo com o teu nome/handle para a tua audiência',
        '€10 por cada nova conversão ao Premium anual com o teu código (ex.: 50 anuais = €500)',
        'Acesso a Creator Groups na app: chat, feed em tempo real e leaderboard com a tua comunidade',
      ],
    },
    {
      title: 'O que pedimos',
      bullets: [
        'Experimentar a app antes de recomendar',
        'Se fizer sentido: conteúdo honesto (Reels, Story ou post) — sem script rígido',
        'Mencionar o código e que há preço anual exclusivo',
        'Disclosure de parceria/código promocional (regras da plataforma)',
        'Sem claims médicos — wellness, não aconselhamento clínico',
      ],
    },
    {
      title: 'Como funciona',
      bullets: [
        'Confirmas interesse (resposta ao DM/email)',
        'Activamos Premium + código após revisão',
        'Partilhas quando quiseres',
        'Conversões elegíveis contam para comissão; payout no calendário acordado',
      ],
    },
  ],
  codeRulesTitle: 'Regras do código (importante)',
  codeRules: [
    'Válido apenas para o plano Premium anual — não mensal, não 3 ou 6 meses',
    'Apenas para novos utilizadores que nunca tiveram qualquer subscrição Premium na IGNITE AI',
    'Não conta: renovações, upgrades de quem já foi Premium, outros planos',
    'Comissão de €10 só na 1.ª subscrição anual elegível com o teu código',
    'O código é para a tua audiência — não para uso próprio',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'Quando recebo a comissão?',
      a: 'Após período de validação (ex.: confirmação de pagamento / janela de chargeback acordada).',
    },
    {
      q: 'Há mínimo de followers?',
      a: 'Valorizamos fit e engagement, não só tamanho da audiência.',
    },
    {
      q: 'Posso sair do programa?',
      a: 'Sim, a qualquer momento. O código deixa de estar activo.',
    },
  ],
  ctaTitle: 'Próximo passo',
  ctaBody: 'Responde ao contacto da equipa com o teu handle, país e email. Ou candidata-te directamente na app:',
  ctaSteps: [
    'Descarrega IGNITE AI (App Store / Google Play)',
    'Perfil → Creator program → Apply',
  ],
  termsLink: 'Termos do Programa de Criadores',
  publicProgramLink: 'Página pública do Creator Program',
  contactEmail: 'support@ignitehub.app',
}

const en: CreatorOutreachContent = {
  metaTitle: 'Creator Program — details | IGNITE AI',
  metaDescription:
    'IGNITE AI Creator Program offer: free Premium, exclusive annual code, €10 per conversion, and Creator Groups.',
  eyebrow: 'IGNITE AI · Creator Program',
  title: 'Partnership details',
  subtitle: 'Brief for creators contacted by the IGNITE team.',
  intro:
    'This page summarizes the offer, code rules, and next steps. Official applications still happen in the app.',
  sections: [
    {
      title: 'What IGNITE AI is',
      bullets: [
        'Nutrition and fitness app (iOS and Android)',
        'Personalized calorie plan — lose weight, gain muscle, or maintain',
        'Meal photo → calories, macros, and ingredients in ~5 seconds',
        'Workout logging and community sharing',
      ],
    },
    {
      title: 'What you get',
      bullets: [
        'Free Premium to test the app (defined period, renewable while the partnership lasts)',
        'Exclusive code with your name/handle for your audience',
        '€10 for each new annual Premium conversion with your code (e.g. 50 annual = €500)',
        'Creator Groups in the app: chat, real-time feed, and leaderboard with your community',
      ],
    },
    {
      title: 'What we ask',
      bullets: [
        'Try the app before recommending it',
        'If it fits: honest content (Reels, Story, or post) — no rigid script',
        'Mention the code and exclusive annual pricing',
        'Partnership / promo code disclosure (platform rules)',
        'No medical claims — wellness, not clinical advice',
      ],
    },
    {
      title: 'How it works',
      bullets: [
        'Confirm interest (reply to DM/email)',
        'We activate Premium + code after review',
        'Share when you want',
        'Eligible conversions count toward commission; payout on agreed schedule',
      ],
    },
  ],
  codeRulesTitle: 'Code rules (important)',
  codeRules: [
    'Valid for annual Premium only — not monthly, 3-month, or 6-month plans',
    'New users only — accounts that never had any IGNITE AI Premium subscription',
    'Does not count: renewals, upgrades from former Premium users, other plans',
    '€10 commission only on the first eligible annual subscription with your code',
    'The code is for your audience — not for personal use',
  ],
  faqTitle: 'FAQ',
  faq: [
    {
      q: 'When do I get paid?',
      a: 'After a validation period (e.g. payment confirmation / agreed chargeback window).',
    },
    {
      q: 'Is there a minimum follower count?',
      a: 'We care about fit and engagement, not audience size alone.',
    },
    {
      q: 'Can I leave the program?',
      a: 'Yes, anytime. Your code will be deactivated.',
    },
  ],
  ctaTitle: 'Next step',
  ctaBody: 'Reply to the team with your handle, country, and email. Or apply directly in the app:',
  ctaSteps: [
    'Download IGNITE AI (App Store / Google Play)',
    'Profile → Creator program → Apply',
  ],
  termsLink: 'Creator Program Terms',
  publicProgramLink: 'Public Creator Program page',
  contactEmail: 'support@ignitehub.app',
}

export function getCreatorOutreachContent(locale: Locale): CreatorOutreachContent {
  if (locale === 'pt' || locale === 'pt-br') return pt
  return en
}
