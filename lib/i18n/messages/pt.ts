import type { Messages } from './en'
import { faqPt } from './faq-content'

export const pt = {
  lang: {
    chooseLanguage: 'Escolher idioma',
    close: 'Fechar',
  },
  nav: {
    home: 'Início',
    press: 'Imprensa',
    blogs: 'Blog',
    creatorProgram: 'Creator Program',
    main: 'Principal',
    homeAria: 'Início IGNITE AI',
    closeMenu: 'Fechar menu',
    openMenu: 'Abrir menu',
  },
  hero: {
    headline: 'Feito para tornar o progresso fácil.',
    description:
      'IGNITE AI é uma app com IA para fotografar refeições e obter calorias e macros na hora, registar treinos e partilhar progresso com amigos. Uma app para alimentar, treinar e manter a consistência.',
    tagline: 'Fotografa. Regista. Domina.',
    introAria: 'Apresentação IGNITE AI',
  },
  howItWorks: {
    title: 'Como funciona',
    steps: [
      {
        title: 'Fotografa, digitaliza ou descreve',
        description:
          'No Quick log, fotografa uma refeição, digitaliza um código de barras ou rótulo, escreve ou usa a voz. Escolhe o caminho que te serve.',
      },
      {
        title: 'Obtém calorias e macros',
        description:
          'A IA estima a nutrição. Fotos e digitalizações bem-sucedidas podem registar de imediato. Edita quando quiseres.',
      },
      {
        title: 'Treina, acompanha, mantém-te consistente',
        description:
          'Atinge as metas diárias de calorias e macros, regista treinos e partilha refeições ou conquistas com Share Cards, com amigos do teu grupo ou nas redes sociais.',
      },
    ],
  },
  features: {
    ariaLabel: 'Funcionalidades',
    closingNote: 'Além de jejum, relatórios PDF, estatísticas e muito mais na app.',
    items: [
      {
        id: 'meal',
        eyebrow: 'Registo de refeições com IA',
        title: 'Foto entra. Macros saem.',
        description:
          'Aponta a câmara a qualquer prato e o IGNITE AI identifica a comida e estima calorias e macros. Sem caçar códigos de barras nem percorrer bases de dados.',
        bullets: [
          'Fotografa ou descreve qualquer refeição',
          'Estimativas instantâneas de calorias e macros',
          'Edita e confirma com um toque',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: 'Metas nutricionais diárias',
        title: 'Sabe exatamente o que falta hoje.',
        description:
          'O anel de calorias e a proteína, hidratos e gorduras restantes atualizam-se a cada registo. Um olhar chega para saber o que comer a seguir.',
        bullets: [
          'Anel de calorias num relance',
          'Proteína, hidratos e gorduras restantes',
          'Metas ajustadas ao teu objetivo',
        ],
        screenshotLabel: 'Metas diárias',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: 'Passos, ritmo cardíaco, sono: tudo sincronizado.',
        description:
          'Liga o Apple Health ou o Health Connect para importar os dados que o teu relógio e telemóvel já seguem: passos, calorias ativas, ritmo cardíaco (BPM), sono e treinos. O IGNITE integra-os no teu orçamento diário para que cada movimento conte.',
        bullets: [
          'Passos, BPM, sono e exercício sincronizados automaticamente',
          'Calorias ativas do Apple Health e Health Connect',
          'Um só sítio para atividade e nutrição',
        ],
        screenshotLabel: 'Treinos',
      },
      {
        id: 'workout',
        eyebrow: 'Registo de treinos',
        title: 'Regista qualquer sessão. Queima personalizada.',
        description:
          'Escolhe entre os tipos de exercício no IGNITE: força, corrida, ciclismo, HIIT, natação e mais. A queima calórica é estimada a partir da tua altura, peso e perfil, para o número ser teu — não uma média genérica.',
        bullets: [
          'Vários tipos de exercício prontos a registar',
          'Queima calculada com altura, peso e nível de atividade',
          'Calorias da sessão somadas ao orçamento diário',
        ],
        screenshotLabel: 'Registo de treino',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: 'Transforma registos em cartões prontos para Stories.',
        description:
          'Os Share Cards de refeições e treinos mostram a tua foto com calorias, macros ou estatísticas. Escolhe entre mais de 55 temas, edita o título ou deixa a IA sugerir, e partilha no Instagram, TikTok e mais.',
        bullets: [
          'Mais de 55 temas para refeições e treinos',
          'Calorias, macros e estatísticas da sessão no cartão',
          'Edita o texto ou usa sugestões da IA',
          'Partilha no Instagram, TikTok e além',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: 'Amigos e partilha',
        title: 'O progresso é outro com amigos.',
        description:
          'Cria um grupo com os teus amigos, partilha registos de refeições e treinos, e compete pela melhor sequência do vosso círculo.',
        bullets: [
          'Cria grupos com amigos',
          'Partilha refeições, treinos e registos',
          'Compete pela sequência n.º 1',
        ],
        screenshotLabel: 'Feed de amigos',
      },
      {
        id: 'coach',
        eyebrow: 'Coach IGNITE AI',
        title: 'Respostas de nutrição, a pedido.',
        description:
          'Fala com o coach de IA integrado para orientação sobre refeições, macros e o que comer a seguir.',
        bullets: [
          'Pergunta o que quiseres sobre nutrição',
          'Sugestões personalizadas',
          'Disponível 24/7 na app',
        ],
        screenshotLabel: 'Chat do AI Coach',
      },
      {
        id: 'streaks',
        eyebrow: 'Sequências e distintivos',
        title: 'Consistência, gamificada.',
        description:
          'Desbloqueia conquistas à medida que registas e treinas. As sequências tornam o hábito diário quase automático.',
        bullets: [
          'Sequências diárias de registo',
          'Distintivos de conquista',
          'Marcos que valem a pena partilhar',
        ],
        screenshotLabel: 'Sequências e distintivos',
      },
    ],
  },
  themes: {
    title: 'Três looks. O mesmo IGNITE.',
    subtitle: 'Alterna entre Light, Glow e Dark quando quiseres em Aparência.',
    alt: 'Tema {name} do IGNITE AI',
    items: {
      light: {
        name: 'Light',
        description: 'Tela limpa em mesh para o registo do dia a dia.',
      },
      dark: {
        name: 'Dark',
        description: 'Modo noturno em carvão para pouca luz.',
      },
      glow: {
        name: 'Glow',
        description: 'Lavagem suave de pôr do sol com profundidade quente.',
      },
    },
  },
  socialProof: {
    title: 'Feito para quem quer resultados, não folhas de cálculo.',
    stats: [
      'precisão de ID em pratos nítidos',
      'temas de Share Card',
      'sinais de saúde sincronizados',
      'tipos de exercício para registar',
    ],
  },
  finalCta: {
    title: 'Começa a tornar o progresso fácil.',
    tagline: 'Fotografa. Regista. Domina.',
    ratingAria: 'Classificação de 5 estrelas',
  },
  footer: {
    legal: 'Legal',
    privacy: 'Política de Privacidade',
    terms: 'Termos de utilização',
    company: 'Empresa',
    contact: 'Contacto',
    faq: 'FAQ',
    creatorProgram: 'Creator Program',
    copyright: '© Copyright {year}, Todos os direitos reservados',
    disclaimer:
      'O IGNITE AI fornece apenas informação geral de bem-estar e fitness. Não constitui aconselhamento médico. Consulta um profissional de saúde antes de alterar a tua dieta ou rotina de exercício.',
  },
  contact: {
    backHome: '← Início',
    title: 'Contacte-nos',
    subtitle: 'Envia-nos uma mensagem e respondemos em breve.',
    firstName: 'Nome',
    lastName: 'Apelido',
    email: 'Email',
    message: 'Mensagem',
    required: 'obrigatório',
    submit: 'Enviar →',
    sending: 'A enviar…',
    success: 'Obrigado. A tua mensagem foi enviada. Responderemos em breve.',
    error: 'Algo correu mal. Tenta novamente.',
  },
  press: {
    title: 'Imprensa',
    subtitle:
      'Contacta a nossa equipa de imprensa para pedidos de media, entrevistas e comunicados.',
    email: 'Endereço de email',
    subject: 'Assunto',
    message: 'Mensagem',
    emailPlaceholder: 'o.teu.email@exemplo.com',
    subjectPlaceholder: 'Assunto do pedido de media',
    messagePlaceholder:
      'Indica os detalhes do teu pedido de media, incluindo prazo, informação do meio e perguntas específicas a que gostarias de resposta...',
    submit: 'Enviar pedido de imprensa',
    sending: 'A enviar…',
    success: 'Obrigado. O teu pedido de imprensa foi enviado. Entraremos em contacto em breve.',
    error: 'Algo correu mal. Tenta novamente.',
  },
  creatorProgram: {
    title: 'Creator Program',
    subtitle:
      'Faz parceria com o IGNITE AI. Partilha o teu código personalizado para o preço anual exclusivo e ganha quando a tua audiência passa a Premium.',
    howTitle: 'Como funciona',
    steps: [
      {
        title: 'Candidata-te',
        description: 'Conta-nos sobre o teu conteúdo, plataformas e audiência.',
      },
      {
        title: 'Nós analisamos',
        description: 'A nossa equipa analisa o teu perfil e responde-te.',
      },
      {
        title: 'Recebe o teu código',
        description:
          'Se fores aprovado, recebes um código de criador personalizado com o preço anual Premium mais baixo.',
      },
      {
        title: 'Partilha e ganha',
        description:
          'Partilha o teu código com a tua audiência. Ganha uma recompensa por cada seguidor que subscreva o plano anual Premium.',
      },
    ],
    applyTitle: 'Candidatar',
    applyHint: 'Conta-nos um pouco sobre o teu conteúdo para analisarmos a candidatura.',
    fieldName: 'Nome a mostrar',
    fieldNamePlaceholder: 'O teu nome ou marca',
    fieldEmail: 'Email de contacto',
    fieldEmailPlaceholder: 'tu@email.com',
    fieldPlatforms: 'Plataformas',
    fieldHandle: 'Handle / link principal',
    fieldHandlePlaceholder: '@teuhandle ou URL do perfil',
    fieldAudience: 'Tamanho da audiência',
    fieldAudiencePlaceholder: 'ex. 25k',
    fieldNotes: 'Mais alguma coisa?',
    fieldNotesPlaceholder: 'Nicho, ideias de collab, etc.',
    submit: 'Enviar candidatura',
    sending: 'A enviar…',
    success: 'Obrigado. A tua candidatura foi enviada. Vamos analisar e responder em breve.',
    error: 'Algo correu mal. Tenta outra vez.',
    errorPlatforms: 'Seleciona pelo menos uma plataforma.',
    appNote: 'Também podes candidatar-te em Perfil → Creator program dentro da app IGNITE AI.',
    platform: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      other: 'Outro',
    },
  },
  blog: {
    title: 'O nosso blog',
    subtitle: 'segue para novidades',
    back: '← Blog',
    asideTagline: 'Fotografa. Regista. Domina.',
    asideBody: 'Descarrega o IGNITE AI: macros, treinos e progresso que vale a pena partilhar.',
  },
  legal: {
    backHome: '← Início',
    related: 'Relacionado:',
    privacy: 'Política de Privacidade',
    terms: 'Termos de utilização',
  },
  faq: faqPt,
  comingSoon: {
    title: "Em breve",
    subtitle:
      "Estamos a dar os últimos retoques ao IGNITE AI. Acesso privado apenas, por agora.",
    tagline: "Fotografa. Regista. Domina.",
    wrongPassword: 'Palavra-passe incorreta. Tenta novamente.',
    genericError: 'Algo correu mal. Tenta novamente.',
    password: 'Palavra-passe',
    enter: 'Entrar',
  },
} as const satisfies Messages
