export type IgHighlightId =
  | 'whos-ignite'
  | 'food-scans'
  | 'share-cards'
  | 'reviews'
  | 'faq'
  | 'testimonials'

export type IgStoryLang = 'EN' | 'PT'

export type IgStorySlide = {
  id: string
  title: string
  blocks: string[]
  ready: boolean
}

export const IG_HIGHLIGHTS: {
  id: IgHighlightId
  label: string
}[] = [
  { id: 'whos-ignite', label: "Who's IGNITE?" },
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
          'Take a photo. In a couple of seconds you get calories, macros, and ingredients. Log workouts.',
          'Sync Apple Health / Health Connect: average heart rate, sleep, steps and blood oxygen. All in one.',
          'One place for the plan: lose, maintain, or gain.',
        ],
      },
      {
        id: 'accuracy',
        title: 'How accurate is it?',
        ready: true,
        blocks: [
          'IGNITE uses AI plus nutrition data to estimate what’s on the plate. Not a lab test.',
          'Lighting, angles, and hidden oils change the result. Center the food. Edit ingredients if something’s off.',
          'Your daily plan is an estimate from your profile. A starting point, not a medical prescription.',
          'The point isn’t perfection. It’s a number you can actually stick to.',
        ],
      },
      {
        id: 'cost',
        title: 'Why isn’t it free?',
        ready: true,
        blocks: [
          'Each scan runs on servers. That’s a real cost, every photo.',
          'Premium keeps the product fast and the estimates improving. Not ads in the middle of logging lunch.',
          'iOS and Android. Start free, upgrade if it fits.',
        ],
      },
      {
        id: 'founder',
        title: 'Who’s behind IGNITE?',
        ready: true,
        blocks: [
          'I’m Filipe, founder of IGNITE AI.',
          'I built this because I wanted a simple way to see what I eat and how I train, without turning it into a second job.',
          'If something’s broken or you want the Creator Program: DM me. I actually read them.',
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
          'Tiras uma foto. Em poucos segundos tens calorias, macros e ingredientes. Registas treinos.',
          'Ligas Apple Health / Health Connect: frequência cardíaca média, sono, passos e oxigénio no sangue. Tudo num só sítio.',
          'Um sítio para o plano: perder, manter ou ganhar peso.',
        ],
      },
      {
        id: 'accuracy',
        title: 'Quão preciso é?',
        ready: true,
        blocks: [
          'A IGNITE usa IA e dados de nutrição para estimar o que está no prato. Não é um teste de laboratório.',
          'Luz, ângulo e óleos escondidos mudam o resultado. Centra a comida. Edita ingredientes se faltar alguma coisa.',
          'O plano diário é uma estimativa a partir do teu perfil. Um ponto de partida, não uma prescrição médica.',
          'O ponto não é a perfeição. É um número a que consigas mesmo agarrar.',
        ],
      },
      {
        id: 'cost',
        title: 'Porque não é grátis?',
        ready: true,
        blocks: [
          'Cada scan corre em servidores. É um custo real, em cada foto.',
          'O Premium mantém o produto rápido e as estimativas a melhorar. Não anúncios a meio do almoço.',
          'iOS e Android. Começas grátis, upgrades se fizer sentido.',
        ],
      },
      {
        id: 'founder',
        title: 'Quem está por trás?',
        ready: true,
        blocks: [
          'Sou o Filipe, fundador da IGNITE AI.',
          'Construí isto porque queria ver o que como e como treino, sem transformar isso num segundo emprego.',
          'Se algo falhar ou quiseres o Creator Program: manda DM. Eu leio.',
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
  faq: {
    EN: [
      {
        id: 'who',
        title: 'Who is IGNITE for?',
        ready: true,
        blocks: [
          'Anyone with a weight goal (lose, maintain, or gain) who wants a calorie and macro estimate of what they eat.',
          'Plus workouts and Health sync, in one app.',
        ],
      },
      {
        id: 'medical',
        title: 'Is this medical advice?',
        ready: true,
        blocks: [
          'No. IGNITE is a wellness tool.',
          'Estimates, not a clinical measurement. Talk to a professional if you have a medical condition.',
        ],
      },
      {
        id: 'platforms',
        title: 'iOS and Android?',
        ready: true,
        blocks: ['Yes. Both.', 'ignitehub.app'],
      },
    ],
    PT: [
      {
        id: 'who',
        title: 'Para quem é a IGNITE?',
        ready: true,
        blocks: [
          'Quem tem um objetivo de peso (perder, manter ou ganhar) e quer uma estimativa de calorias e macros do que come.',
          'Mais treinos e Health sync, numa só app.',
        ],
      },
      {
        id: 'medical',
        title: 'Isto é conselho médico?',
        ready: true,
        blocks: [
          'Não. A IGNITE é uma ferramenta de wellness.',
          'Estimativas, não uma medição clínica. Fala com um profissional se tiveres uma condição médica.',
        ],
      },
      {
        id: 'platforms',
        title: 'iOS e Android?',
        ready: true,
        blocks: ['Sim. Os dois.', 'ignitehub.app'],
      },
    ],
  },
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
