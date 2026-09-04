import { FAQ_STORY_SLIDES } from '@/lib/ig-story-faq'

export type IgHighlightId =
  | 'whos-ignite'
  | 'research'
  | 'food-scans'
  | 'share-cards'
  | 'reviews'
  | 'faq'
  | 'testimonials'

export type IgStoryLang = 'EN' | 'PT'

export type IgStoryLayout = 'text' | 'accuracy' | 'news' | 'how' | 'impact'

export type IgStorySlide = {
  id: string
  title: string
  titleAccent?: string
  subtitle?: string
  blocks: string[]
  ready: boolean
  layout?: IgStoryLayout
  bars?: { label: string; pct: number; highlight?: boolean }[]
  callout?: string
  footer?: string
  steps?: { kicker: string; text: string }[]
  leftCard?: { kicker: string; value: string; sub: string }
  rightCard?: { kicker: string; value: string; sub: string }
  bullets?: string[]
  cta?: string
  macros?: { protein: string; carbs: string; fat: string }
}

export const IG_HIGHLIGHTS: {
  id: IgHighlightId
  label: string
}[] = [
  { id: 'whos-ignite', label: "Who's IGNITE?" },
  { id: 'research', label: 'Research' },
  { id: 'food-scans', label: 'Food scans' },
  { id: 'share-cards', label: 'Share cards' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faq', label: 'FAQ' },
  { id: 'testimonials', label: 'Testimonials' },
]

export const IG_STORY_SLIDES: Record<IgHighlightId, Record<IgStoryLang, IgStorySlide[]>> = {
  'whos-ignite': {
    EN: [
      {
        id: 'why',
        title: 'Why IGNITE?',
        ready: true,
        blocks: [
          'We built IGNITE AI so tracking food and training doesn’t eat your day.',
          'Most people guess calories, skip logging, or give up after a week of weighing every meal.',
          'Take a photo. In a couple of seconds you get calories, macros, and ingredients. You can also estimate how much your workouts burn.',
          'Sync Apple Health / Health Connect: average heart rate, sleep, steps and blood oxygen. All in one.',
          'One place for your goal: lose, maintain, or gain.',
        ],
      },
      {
        id: 'accuracy',
        title: 'How accurate is it?',
        ready: true,
        blocks: [
          'Most calorie apps throw a number at you and hope. IGNITE reads the plate: calories, macros, and ingredients you can actually edit.',
          'AI plus real nutrition data. Center the food. In a couple of seconds you get a breakdown you can trust enough to log every day.',
          'If lighting or oil throws it off, you fix the ingredient. Other apps lock you into a black box. That is why people quit.',
          'Your plan comes from your profile. Built to hit lose, maintain, or gain. Not a spreadsheet you abandon in a week.',
        ],
      },
      {
        id: 'cost',
        title: 'Why isn’t it free?',
        ready: true,
        blocks: [
          'Each scan runs on servers. That’s a real cost, every photo.',
          'Premium keeps the product fast and the estimates improving. Not ads in the middle of logging lunch.',
          'iOS and Android. Free to download, plus a 1-week free trial.',
        ],
      },
      {
        id: 'founder',
        title: 'Who’s behind IGNITE?',
        ready: true,
        blocks: [
          'I’m Filipe (@rovghall), founder of IGNITE AI.',
          'I built this for people who want to track food and training without it eating the whole day. Real plates, real workouts, a goal you can actually follow.',
          'If something’s broken or you want the Creator Program: DM @rovghall. I actually read them.',
        ],
      },
      {
        id: 'what',
        title: 'What you get',
        ready: true,
        blocks: [
          'Photo → calories, macros, ingredients.',
          'Workouts + Health: heart rate, sleep, steps, blood oxygen.',
          'A calorie plan for your goal.',
          'Share cards if you post. Creator Group if you have an audience.',
          'ignitehub.app',
        ],
      },
    ],
    PT: [
      {
        id: 'why',
        title: 'Porquê a IGNITE?',
        ready: true,
        blocks: [
          'Criámos a IGNITE AI para o tracking de comida e treino não te comer o dia.',
          'A maior parte das pessoas adivinha calorias, desiste de registar, ou cansa-se de pesar tudo.',
          'Tiras uma foto. Em poucos segundos tens calorias, macros e ingredientes. Também podes estimar o que os treinos queimam.',
          'Ligas Apple Health / Health Connect: frequência cardíaca média, sono, passos e oxigénio no sangue. Tudo num só sítio.',
          'Um sítio para o teu objetivo: perder, manter ou ganhar peso.',
        ],
      },
      {
        id: 'accuracy',
        title: 'Quão preciso é?',
        ready: true,
        blocks: [
          'A maior parte das apps atira um número e reza. A IGNITE lê o prato: calorias, macros e ingredientes que podes editar.',
          'IA mais dados de nutrição a sério. Centra a comida. Em poucos segundos tens um resultado que dá para usar todos os dias.',
          'Se a luz ou o azeite desviarem, corriges o ingrediente. As outras apps fecham-te numa caixa preta. Por isso desistem.',
          'O plano sai do teu perfil. Feito para perder, manter ou ganhar. Não uma folha Excel que abandonas numa semana.',
        ],
      },
      {
        id: 'cost',
        title: 'Porque não é grátis?',
        ready: true,
        blocks: [
          'Cada scan corre em servidores. É um custo real, em cada foto.',
          'O Premium mantém o produto rápido e as estimativas a melhorar. Não anúncios a meio do almoço.',
          'iOS e Android. O download é grátis, e tens 1 semana de trial.',
        ],
      },
      {
        id: 'founder',
        title: 'Quem está por trás?',
        ready: true,
        blocks: [
          'Sou o Filipe (@rovghall), fundador da IGNITE AI.',
          'Construí isto para quem quer fazer tracking de comida e treino sem isso comer o dia inteiro. Pratos a sério, treinos a sério, um objetivo a que dá para agarrar.',
          'Se algo falhar ou quiseres o Creator Program: manda DM a @rovghall. Eu leio.',
        ],
      },
      {
        id: 'what',
        title: 'O que tens',
        ready: true,
        blocks: [
          'Foto → calorias, macros, ingredientes.',
          'Treinos + Health: frequência cardíaca, sono, passos, oxigénio no sangue.',
          'Plano calórico para o teu objetivo.',
          'Share cards se publicas. Creator Group se tens audiência.',
          'ignitehub.app',
        ],
      },
    ],
  },
  research: {
    EN: [
      {
        id: 'accuracy',
        layout: 'accuracy',
        title: 'How accurate is IGNITE',
        subtitle: 'Guessing is the default. IGNITE lets you see the plate and fix it.',
        ready: true,
        blocks: [],
        bars: [
          { label: 'Guessing', pct: 48 },
          { label: 'Other photo apps', pct: 64 },
          { label: 'IGNITE', pct: 92, highlight: true },
        ],
        callout: 'You see ingredients. You can edit them. That is the difference.',
        footer: 'Not a locked number. Built so you can correct the meal in a couple of seconds.',
      },
      {
        id: 'news',
        layout: 'news',
        title: 'Breaking',
        titleAccent: 'News',
        subtitle: 'High-accuracy estimates. Yours to edit.',
        ready: true,
        blocks: [
          'IGNITE uses AI plus nutrition data to estimate calories and macros from a photo.',
          'Adjust ingredients if something looks off. That is how you stay in control.',
        ],
        macros: { protein: '32g', carbs: '48g', fat: '18g' },
      },
      {
        id: 'how',
        layout: 'how',
        title: 'How it',
        titleAccent: 'works',
        ready: true,
        blocks: [],
        steps: [
          { kicker: 'Visual analysis', text: 'IGNITE reads the plate from the photo. Not a food diary you type for 10 minutes.' },
          { kicker: 'AI + nutrition data', text: 'Estimates calories and macros even on meals it has not seen before.' },
          { kicker: 'Gets sharper', text: 'More real plates logged means better estimates over time.' },
          { kicker: 'You can edit', text: 'Fix ingredients and portions. Other apps lock you into a black box.' },
          { kicker: 'Just a photo', text: 'Calories, macros, and ingredients in a couple of seconds.' },
        ],
      },
      {
        id: 'impact',
        layout: 'impact',
        title: 'Measures of',
        titleAccent: 'impact',
        ready: true,
        blocks: [],
        leftCard: {
          kicker: 'Other apps',
          value: 'Locked',
          sub: 'A number you cannot fix',
        },
        rightCard: {
          kicker: 'IGNITE',
          value: 'Editable',
          sub: 'The actual foods on the plate',
        },
        bullets: [
          'Cheaper than hiring a nutritionist',
          'Food, workouts, and Health in one app',
        ],
        cta: 'Free download. 1-week trial.',
      },
    ],
    PT: [
      {
        id: 'accuracy',
        layout: 'accuracy',
        title: 'Quão precisa é a IGNITE',
        subtitle: 'Adivinhar é o default. A IGNITE deixa-te ver o prato e corrigir.',
        ready: true,
        blocks: [],
        bars: [
          { label: 'Adivinhar', pct: 48 },
          { label: 'Outras apps de foto', pct: 64 },
          { label: 'IGNITE', pct: 92, highlight: true },
        ],
        callout: 'Vês os ingredientes. Podes editar. Essa é a diferença.',
        footer: 'Não um número trancado. Feita para corrigires a refeição em poucos segundos.',
      },
      {
        id: 'news',
        layout: 'news',
        title: 'Breaking',
        titleAccent: 'News',
        subtitle: 'Estimativas com alta precisão. Tu editas.',
        ready: true,
        blocks: [
          'A IGNITE usa IA e dados de nutrição para estimar calorias e macros a partir de uma foto.',
          'Ajustas ingredientes se algo estiver errado. Assim ficas no controlo.',
        ],
        macros: { protein: '32g', carbs: '48g', fat: '18g' },
      },
      {
        id: 'how',
        layout: 'how',
        title: 'Como',
        titleAccent: 'funciona',
        ready: true,
        blocks: [],
        steps: [
          { kicker: 'Análise visual', text: 'A IGNITE lê o prato na foto. Não um diário que escreves 10 minutos.' },
          { kicker: 'IA + nutrição', text: 'Estima calorias e macros mesmo em refeições que nunca viu.' },
          { kicker: 'Fica mais afiada', text: 'Quanto mais pratos reais, melhores as estimativas.' },
          { kicker: 'Tu editas', text: 'Corriges ingredientes e porções. As outras apps fecham-te numa caixa preta.' },
          { kicker: 'Só uma foto', text: 'Calorias, macros e ingredientes em poucos segundos.' },
        ],
      },
      {
        id: 'impact',
        layout: 'impact',
        title: 'Medidas de',
        titleAccent: 'impacto',
        ready: true,
        blocks: [],
        leftCard: {
          kicker: 'Outras apps',
          value: 'Trancado',
          sub: 'Um número que não podes corrigir',
        },
        rightCard: {
          kicker: 'IGNITE',
          value: 'Editável',
          sub: 'Os alimentos que estão no prato',
        },
        bullets: [
          'Mais barata do que um nutricionista',
          'Comida, treinos e Health numa só app',
        ],
        cta: 'Download grátis. 1 semana de trial.',
      },
    ],
  },
  'food-scans': {
    EN: [
      {
        id: 'scan',
        title: 'Food scans',
        ready: true,
        blocks: [
          'Snap the meal.',
          'In a couple of seconds: calories, macros, and a list of ingredients.',
          'Edit anything that’s off. Then log it.',
        ],
      },
    ],
    PT: [
      {
        id: 'scan',
        title: 'Food scans',
        ready: true,
        blocks: [
          'Tira foto à refeição.',
          'Em poucos segundos: calorias, macros e lista de ingredientes.',
          'Edita o que estiver errado. Depois regista.',
        ],
      },
    ],
  },
  'share-cards': {
    EN: [
      {
        id: 'cards',
        title: 'Share cards',
        ready: true,
        blocks: [
          'Every meal or workout can become a card.',
          'Photo, calories, macros or duration. Ready for stories.',
          'Post the habit, not a screenshot of a spreadsheet.',
        ],
      },
    ],
    PT: [
      {
        id: 'cards',
        title: 'Share cards',
        ready: true,
        blocks: [
          'Cada refeição ou treino pode virar um card.',
          'Foto, calorias, macros ou duração. Pronto para stories.',
          'Publicas o hábito, não um print de uma folha Excel.',
        ],
      },
    ],
  },
  faq: FAQ_STORY_SLIDES,
  reviews: {
    EN: [
      {
        id: 'soon',
        title: 'Reviews',
        ready: false,
        blocks: [
          'Add App Store / Play screenshots here when you have them.',
          'Don’t publish this highlight empty.',
        ],
      },
    ],
    PT: [
      {
        id: 'soon',
        title: 'Reviews',
        ready: false,
        blocks: [
          'Quando tiveres prints da App Store / Play, metemos aqui.',
          'Não publiques este highlight vazio.',
        ],
      },
    ],
  },
  testimonials: {
    EN: [
      {
        id: 'soon',
        title: 'Testimonials',
        ready: false,
        blocks: [
          'When creators start talking about IGNITE, their clips and quotes live here.',
        ],
      },
    ],
    PT: [
      {
        id: 'soon',
        title: 'Testimonials',
        ready: false,
        blocks: [
          'Quando creators falarem da IGNITE, os clips e quotes ficam aqui.',
        ],
      },
    ],
  },
}
