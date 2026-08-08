import type { Messages } from './en'
import { faqPtBr } from './faq-pt-br'

export const ptBr = {
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
      'IGNITE AI é um app com IA para fotografar refeições e obter calorias e macros na hora, registrar treinos e compartilhar progresso com amigos. Um app para alimentar, treinar e manter a consistência.',
    tagline: 'Fotografe. Registre. Domine.',
    introAria: 'Apresentação IGNITE AI',
  },
  howItWorks: {
    title: 'Como funciona',
    steps: [
      {
        title: 'Fotografe, escaneie ou descreva',
        description:
          'No Quick log, fotografe uma refeição, escaneie um código de barras ou rótulo, escreva ou use a voz. Escolha o caminho que funciona para você.',
      },
      {
        title: 'Obtenha calorias e macros',
        description:
          'A IA estima a nutrição. Fotos e escaneamentos bem-sucedidos podem registrar de imediato. Edite quando quiser.',
      },
      {
        title: 'Treine, acompanhe, mantenha a consistência',
        description:
          'Atinga as metas diárias de calorias e macros, registre treinos e compartilhe refeições ou conquistas com Share Cards, com amigos do seu grupo ou nas redes sociais.',
      },
    ],
  },
  features: {
    ariaLabel: 'Funcionalidades',
    closingNote: 'Além de jejum, relatórios PDF, estatísticas e muito mais no app.',
    items: [
      {
        id: 'meal',
        eyebrow: 'Registro de refeições com IA',
        title: 'Foto entra. Macros saem.',
        description:
          'Aponte a câmera para qualquer prato e o IGNITE AI identifica a comida e estima calorias e macros. Sem caçar códigos de barras nem percorrer bancos de dados.',
        bullets: [
          'Fotografe ou descreva qualquer refeição',
          'Estimativas instantâneas de calorias e macros',
          'Edite e confirme com um toque',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: 'Metas nutricionais diárias',
        title: 'Saiba exatamente o que falta hoje.',
        description:
          'O anel de calorias e a proteína, carboidratos e gorduras restantes se atualizam a cada registro. Basta um olhar para saber o que comer a seguir.',
        bullets: [
          'Anel de calorias num relance',
          'Proteína, carboidratos e gorduras restantes',
          'Metas ajustadas ao seu objetivo',
        ],
        screenshotLabel: 'Metas diárias',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: 'Passos, ritmo cardíaco, sono: tudo sincronizado.',
        description:
          'Conecte o Apple Health ou o Health Connect para importar os dados que seu relógio e celular já acompanham: passos, calorias ativas, ritmo cardíaco (BPM), sono e treinos. O IGNITE integra tudo ao seu orçamento diário para que cada movimento conte.',
        bullets: [
          'Passos, BPM, sono e exercício sincronizados automaticamente',
          'Calorias ativas do Apple Health e Health Connect',
          'Um só lugar para atividade e nutrição',
        ],
        screenshotLabel: 'Treinos',
      },
      {
        id: 'workout',
        eyebrow: 'Registro de treinos',
        title: 'Registre qualquer sessão. Queima personalizada.',
        description:
          'Escolha entre os tipos de exercício no IGNITE: força, corrida, ciclismo, HIIT, natação e mais. A queima calórica é estimada a partir da sua altura, peso e perfil, para que o número seja seu, não uma média genérica.',
        bullets: [
          'Vários tipos de exercício prontos para registrar',
          'Queima calculada com altura, peso e nível de atividade',
          'Calorias da sessão somadas ao orçamento diário',
        ],
        screenshotLabel: 'Registro de treino',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: 'Transforme registros em cartões prontos para Stories.',
        description:
          'Os Share Cards de refeições e treinos mostram sua foto com calorias, macros ou estatísticas. Escolha entre mais de 55 temas, edite o título ou deixe a IA sugerir, e compartilhe no Instagram, TikTok e mais.',
        bullets: [
          'Mais de 55 temas para refeições e treinos',
          'Calorias, macros e estatísticas da sessão no cartão',
          'Edite o texto ou use sugestões da IA',
          'Compartilhe no Instagram, TikTok e além',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: 'Amigos e compartilhamento',
        title: 'O progresso é outro com amigos.',
        description:
          'Crie um grupo com seus amigos, compartilhe registros de refeições e treinos, e dispute a melhor sequência do seu círculo.',
        bullets: [
          'Crie grupos com amigos',
          'Compartilhe refeições, treinos e registros',
          'Dispute a sequência n.º 1',
        ],
        screenshotLabel: 'Feed de amigos',
      },
      {
        id: 'coach',
        eyebrow: 'Coach IGNITE AI',
        title: 'Respostas de nutrição, a pedido.',
        description:
          'Converse com o coach de IA integrado para orientação sobre refeições, macros e o que comer a seguir.',
        bullets: [
          'Pergunte o que quiser sobre nutrição',
          'Sugestões personalizadas',
          'Disponível 24/7 no app',
        ],
        screenshotLabel: 'Chat do AI Coach',
      },
      {
        id: 'streaks',
        eyebrow: 'Sequências e distintivos',
        title: 'Consistência, gamificada.',
        description:
          'Desbloqueie conquistas à medida que registra e treina. As sequências tornam o hábito diário quase automático.',
        bullets: [
          'Sequências diárias de registro',
          'Distintivos de conquista',
          'Marcos que valem a pena compartilhar',
        ],
        screenshotLabel: 'Sequências e distintivos',
      },
    ],
  },
  themes: {
    title: 'Três looks. O mesmo IGNITE.',
    subtitle: 'Alterne entre Light, Glow e Dark quando quiser em Aparência.',
    alt: 'Tema {name} do IGNITE AI',
    items: {
      light: {
        name: 'Light',
        description: 'Tela limpa em mesh para o registro do dia a dia.',
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
    title: 'Feito para quem quer resultados, não planilhas.',
    stats: [
      'precisão de ID em pratos nítidos',
      'temas de Share Card',
      'sinais de saúde sincronizados',
      'tipos de exercício para registrar',
    ],
  },
  finalCta: {
    title: 'Comece a tornar o progresso fácil.',
    tagline: 'Fotografe. Registre. Domine.',
    ratingAria: 'Classificação de 5 estrelas',
  },
  footer: {
    legal: 'Legal',
    privacy: 'Política de Privacidade',
    terms: 'Termos de uso',
    company: 'Empresa',
    contact: 'Contato',
    faq: 'FAQ',
    creatorProgram: 'Creator Program',
    copyright: '© Copyright {year}, Todos os direitos reservados',
    disclaimer:
      'O IGNITE AI fornece apenas informação geral de bem-estar e fitness. Não constitui aconselhamento médico. Consulte um profissional de saúde antes de alterar sua dieta ou rotina de exercício.',
  },
  contact: {
    backHome: '← Início',
    title: 'Fale conosco',
    subtitle: 'Envie uma mensagem e responderemos em breve.',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    email: 'Email',
    message: 'Mensagem',
    required: 'obrigatório',
    submit: 'Enviar →',
    sending: 'Enviando…',
    success: 'Obrigado. Sua mensagem foi enviada. Responderemos em breve.',
    error: 'Algo deu errado. Tente novamente.',
  },
  press: {
    title: 'Imprensa',
    subtitle:
      'Entre em contato com nossa equipe de imprensa para pedidos de mídia, entrevistas e comunicados.',
    email: 'Endereço de email',
    subject: 'Assunto',
    message: 'Mensagem',
    emailPlaceholder: 'seu.email@exemplo.com',
    subjectPlaceholder: 'Assunto do pedido de mídia',
    messagePlaceholder:
      'Informe os detalhes do seu pedido de mídia, incluindo prazo, informações do veículo e perguntas específicas às quais gostaria de resposta...',
    submit: 'Enviar pedido de imprensa',
    sending: 'Enviando…',
    success: 'Obrigado. Seu pedido de imprensa foi enviado. Entraremos em contato em breve.',
    error: 'Algo deu errado. Tente novamente.',
  },
  creatorProgram: {
    title: 'Creator Program',
    subtitle:
      'Faça parceria com o IGNITE AI. Compartilhe seu código personalizado para o preço anual exclusivo e ganhe quando sua audiência assinar o Premium.',
    howTitle: 'Como funciona',
    steps: [
      {
        title: 'Candidate-se',
        description: 'Conte-nos sobre seu conteúdo, plataformas e audiência.',
      },
      {
        title: 'Nós analisamos',
        description: 'Nossa equipe analisa seu perfil e responde.',
      },
      {
        title: 'Receba seu código',
        description:
          'Se aprovado, você recebe um código de criador personalizado com o menor preço anual Premium.',
      },
      {
        title: 'Compartilhe e ganhe',
        description:
          'Compartilhe seu código com sua audiência. Ganhe uma recompensa por cada seguidor que assinar o plano anual Premium.',
      },
    ],
    applyTitle: 'Candidatar-se',
    applyHint: 'Conte um pouco sobre seu conteúdo para analisarmos a candidatura.',
    fieldName: 'Nome de exibição',
    fieldNamePlaceholder: 'Seu nome ou marca',
    fieldEmail: 'Email de contato',
    fieldEmailPlaceholder: 'voce@email.com',
    fieldPlatforms: 'Plataformas',
    fieldHandle: 'Handle / link principal',
    fieldHandlePlaceholder: '@seuhandle ou URL do perfil',
    fieldAudience: 'Tamanho da audiência',
    fieldAudiencePlaceholder: 'ex. 25k',
    fieldNotes: 'Mais alguma coisa?',
    fieldNotesPlaceholder: 'Nicho, ideias de collab, etc.',
    submit: 'Enviar candidatura',
    sending: 'Enviando…',
    success: 'Obrigado. Sua candidatura foi enviada. Vamos analisar e responder em breve.',
    error: 'Algo deu errado. Tente novamente.',
    errorPlatforms: 'Selecione pelo menos uma plataforma.',
    appNote: 'Você também pode se candidatar em Perfil → Creator program no app IGNITE AI.',
    platform: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      other: 'Outro',
    },
  },
  blog: {
    title: 'Nosso blog',
    subtitle: 'siga para novidades',
    back: '← Blog',
    asideTagline: 'Fotografe. Registre. Domine.',
    asideBody: 'Baixe o IGNITE AI: macros, treinos e progresso que vale a pena compartilhar.',
  },
  legal: {
    backHome: '← Início',
    related: 'Relacionado:',
    privacy: 'Política de Privacidade',
    terms: 'Termos de uso',
  },
  faq: faqPtBr,
  comingSoon: {
    title: 'Em breve',
    subtitle:
      'Estamos dando os últimos retoques no IGNITE AI. Acesso privado apenas, por enquanto.',
    tagline: 'Fotografe. Registre. Domine.',
    wrongPassword: 'Senha incorreta. Tente novamente.',
    genericError: 'Algo deu errado. Tente novamente.',
    password: 'Senha',
    enter: 'Entrar',
  },
} as const satisfies Messages
