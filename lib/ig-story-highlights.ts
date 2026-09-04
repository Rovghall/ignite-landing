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
  faq: {
    EN: [
      {
        id: 'cancel',
        title: 'How do I cancel?',
        ready: true,
        blocks: [
          'Cancel in your store, not inside IGNITE.',
          'iPhone: Settings → your name → Subscriptions → IGNITE AI → Cancel.',
          'Android: Google Play → Payments & subscriptions → Subscriptions → IGNITE AI → Cancel.',
          'Do it before the trial or renewal date so you are not charged again.',
        ],
      },
      {
        id: 'refund',
        title: 'I want a refund',
        ready: true,
        blocks: [
          'Apple or Google handle refunds, not us.',
          'App Store: request it from Apple. Play Store: request it from Google.',
          'Need the right page? Email support@ignitehub.app.',
        ],
      },
      {
        id: 'trial-charge',
        title: 'Charged after the trial?',
        ready: true,
        blocks: [
          'Yes, if you do not cancel before the trial ends, it renews at the price shown at signup.',
          'Apple and Google send their own reminders. Manage it in store subscriptions.',
        ],
      },
      {
        id: 'cross-store',
        title: 'iPhone vs Android',
        ready: true,
        blocks: [
          'A subscription on Apple does not move to Google, and the reverse.',
          'You need an active plan on the store of the phone you are using.',
          'Switching devices? Email support@ignitehub.app.',
        ],
      },
      {
        id: 'scan-wrong',
        title: 'The AI got my meal wrong',
        ready: true,
        blocks: [
          'Open it from Recently uploaded.',
          'Edit ingredients, portions, or the total. Then save.',
          'That is how IGNITE stays accurate. You can fix the plate.',
        ],
      },
      {
        id: 'accuracy',
        title: 'How accurate are calories?',
        ready: true,
        blocks: [
          'IGNITE is built to identify what is on the plate visually.',
          'Macros follow the weight of each ingredient. That weight is an estimate.',
          'If you weigh food, adjust the grams. The edit is the point.',
        ],
      },
      {
        id: 'no-photo',
        title: 'Can I log without a photo?',
        ready: true,
        blocks: [
          'Yes. Quick log: type it, use voice, or scan a barcode or nutrition label.',
          'Photo is optional.',
        ],
      },
      {
        id: 'edit-meal',
        title: 'Can I change a meal after save?',
        ready: true,
        blocks: [
          'Yes. Open the logged meal and edit foods, portions, or totals.',
          'Your day updates with the new calories and macros.',
        ],
      },
      {
        id: 'save-meal',
        title: 'Save a meal to log again?',
        ready: true,
        blocks: [
          'Open a logged meal and tap save. It goes to Diet → Saved.',
          'Same food later: open Saved and tap Log. No new photo needed.',
        ],
      },
      {
        id: 'log-workout',
        title: 'How do I log a workout?',
        ready: true,
        blocks: [
          'On home, tap + and choose Log workout.',
          'Pick the option that fits. Burn is estimated from your profile.',
        ],
      },
      {
        id: 'workout-goal',
        title: 'Do workouts change my calorie goal?',
        ready: true,
        blocks: [
          'Logged activity and Health sync help you see the week. Treat the target as guidance.',
          'If training load changes, adjust the goal in settings.',
        ],
      },
      {
        id: 'edit-workout',
        title: 'Edit or delete a workout?',
        ready: true,
        blocks: [
          'Yes. Open it from history and edit or remove it so your stats stay right.',
        ],
      },
      {
        id: 'health-missing',
        title: 'Steps or Health data missing?',
        ready: true,
        blocks: [
          'Turn on Health permissions for IGNITE AI. Apple Health on iPhone, Health Connect on Android.',
          'Allow steps and activity. Open IGNITE once so it can sync.',
          'Still stuck? Revoke permissions, grant them again, reopen the app.',
        ],
      },
      {
        id: 'health-data',
        title: 'What Health data does IGNITE read?',
        ready: true,
        blocks: [
          'With your permission: steps, average heart rate, blood oxygen, and sleep including stages.',
          'You control categories in Apple Health or Health Connect. Revoke anytime in system settings.',
        ],
      },
      {
        id: 'health-mismatch',
        title: 'Numbers don’t match my watch',
        ready: true,
        blocks: [
          'Phone and watch can be different sources. Sync is not always instant.',
          'Set the primary source in Health / Health Connect, then refresh or reopen IGNITE.',
        ],
      },
      {
        id: 'friends',
        title: 'How do Friends and groups work?',
        ready: true,
        blocks: [
          'Invite people from Friends. Once connected, share meals, workouts, or wins you choose to post.',
          'You control what is visible.',
        ],
      },
      {
        id: 'share-cards',
        title: 'What are Share Cards?',
        ready: true,
        blocks: [
          'Styled snapshots of meals, streaks, or wins. Ready for friends or Instagram.',
          'Pick a theme, generate the card, share from your phone.',
        ],
      },
      {
        id: 'stop-share',
        title: 'Stop sharing with someone?',
        ready: true,
        blocks: [
          'Yes. Remove them from friends or leave the group in Friends settings.',
          'Future posts will not go to them.',
        ],
      },
      {
        id: 'more',
        title: 'Still stuck?',
        ready: true,
        blocks: [
          'support@ignitehub.app',
          'Or DM @rovghall. Messages get read.',
        ],
      },
    ],
    PT: [
      {
        id: 'cancel',
        title: 'Como cancelo a subscrição?',
        ready: true,
        blocks: [
          'Cancela na loja do telemóvel, não dentro da IGNITE.',
          'iPhone: Definições → o teu nome → Subscrições → IGNITE AI → Cancelar.',
          'Android: Google Play → Pagamentos e subscrições → Subscrições → IGNITE AI → Cancelar.',
          'Faz isto antes do fim do teste ou da renovação para não seres cobrado outra vez.',
        ],
      },
      {
        id: 'refund',
        title: 'Quero um reembolso. Como peço?',
        ready: true,
        blocks: [
          'Quem trata do reembolso é a Apple ou a Google, não nós.',
          'App Store: pede à Apple. Play Store: pede à Google.',
          'Não encontras a página? Escreve para support@ignitehub.app.',
        ],
      },
      {
        id: 'trial-charge',
        title: 'Vou ser cobrado depois do teste?',
        ready: true,
        blocks: [
          'Sim, se não cancelares antes do fim do teste, renova ao preço que viste no registo.',
          'A Apple e a Google enviam os avisos deles. Gere nas subscrições da loja.',
        ],
      },
      {
        id: 'cross-store',
        title: 'Subscrevi no iPhone, uso Android',
        ready: true,
        blocks: [
          'A subscrição da Apple não passa para a Google, nem o contrário.',
          'Precisas de um plano ativo na loja do telemóvel que estás a usar.',
          'A mudar de telemóvel? Escreve para support@ignitehub.app.',
        ],
      },
      {
        id: 'scan-wrong',
        title: 'A IA leu mal a minha refeição',
        ready: true,
        blocks: [
          'Abre a refeição em Recently uploaded.',
          'Edita ingredientes, porções ou o total. Depois grava.',
          'Assim a IGNITE fica certa. Tu corriges o prato.',
        ],
      },
      {
        id: 'accuracy',
        title: 'Quão precisas são as calorias?',
        ready: true,
        blocks: [
          'A IGNITE é feita para identificar o que está no prato.',
          'As macros seguem o peso de cada ingrediente. Esse peso é uma estimativa.',
          'Se pesas a comida, ajusta os gramas. Editar é o ponto.',
        ],
      },
      {
        id: 'no-photo',
        title: 'Posso registar sem fotografia?',
        ready: true,
        blocks: [
          'Sim. No Quick log: escreves, usas a voz, ou lês código de barras / rótulo.',
          'A foto é opcional.',
        ],
      },
      {
        id: 'edit-meal',
        title: 'Posso alterar depois de guardar?',
        ready: true,
        blocks: [
          'Sim. Abre a refeição e edita alimentos, porções ou totais.',
          'O dia atualiza com as novas calorias e macros.',
        ],
      },
      {
        id: 'save-meal',
        title: 'Guardar para logar outra vez?',
        ready: true,
        blocks: [
          'Abre a refeição e toca em guardar. Fica em Diet → Saved.',
          'A mesma comida mais tarde: Saved → Log. Sem foto nova.',
        ],
      },
      {
        id: 'log-workout',
        title: 'Como registo um treino?',
        ready: true,
        blocks: [
          'Na home, toca em + e escolhe Log workout.',
          'Escolhe a opção que te serve. O gasto é estimado a partir do teu perfil.',
        ],
      },
      {
        id: 'workout-goal',
        title: 'Os treinos mudam a meta de calorias?',
        ready: true,
        blocks: [
          'O que registas e o Health ajudam a ver a semana. A meta é orientação.',
          'Se a carga de treino mudar, ajusta nas definições.',
        ],
      },
      {
        id: 'edit-workout',
        title: 'Posso editar ou apagar um treino?',
        ready: true,
        blocks: [
          'Sim. Abre no histórico e edita ou remove para as estatísticas ficarem certas.',
        ],
      },
      {
        id: 'health-missing',
        title: 'Passos ou Saúde não aparecem',
        ready: true,
        blocks: [
          'Liga as permissões de Saúde para o IGNITE AI. Apple Health no iPhone, Health Connect no Android.',
          'Autoriza passos e atividade. Abre a IGNITE uma vez para sincronizar.',
          'Ainda falha? Revoga, volta a autorizar, reabre a app.',
        ],
      },
      {
        id: 'health-data',
        title: 'Que dados o IGNITE AI lê?',
        ready: true,
        blocks: [
          'Com a tua permissão: passos, frequência cardíaca média, oxigénio no sangue, e sono com fases.',
          'Controlas as categorias no Apple Health ou Health Connect. Podes revogar nas definições do sistema.',
        ],
      },
      {
        id: 'health-mismatch',
        title: 'Os números não batem com o relógio',
        ready: true,
        blocks: [
          'Telemóvel e relógio podem ser fontes diferentes. A sync nem sempre é imediata.',
          'Define a fonte principal no Health / Health Connect, atualiza ou reabre a IGNITE.',
        ],
      },
      {
        id: 'friends',
        title: 'Como funcionam Amigos e grupos?',
        ready: true,
        blocks: [
          'Convida em Amigos. Depois de ligados, partilhas refeições, treinos ou wins que escolheres.',
          'Tu decides o que fica visível.',
        ],
      },
      {
        id: 'share-cards',
        title: 'O que são Share Cards?',
        ready: true,
        blocks: [
          'Imagens de refeições, streaks ou conquistas, prontas para amigos ou Instagram.',
          'Escolhe o tema, gera o card, partilha pelo telemóvel.',
        ],
      },
      {
        id: 'stop-share',
        title: 'Deixar de partilhar com alguém?',
        ready: true,
        blocks: [
          'Sim. Remove a pessoa dos amigos ou sai do grupo nas definições de Amigos.',
          'As publicações seguintes não lhes chegam.',
        ],
      },
      {
        id: 'more',
        title: 'Ainda precisas de ajuda?',
        ready: true,
        blocks: [
          'support@ignitehub.app',
          'Ou DM a @rovghall. As mensagens são lidas.',
        ],
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
