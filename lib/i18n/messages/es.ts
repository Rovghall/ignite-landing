import type { Messages } from './en'
import { faqEs } from './faq-es'

export const es = {
  lang: {
    chooseLanguage: 'Elegir idioma',
    close: 'Cerrar',
  },
  nav: {
    home: 'Inicio',
    press: 'Prensa',
    blogs: 'Blog',
    creatorProgram: 'Creator Program',
    main: 'Principal',
    homeAria: 'Inicio de IGNITE AI',
    closeMenu: 'Cerrar menú',
    openMenu: 'Abrir menú',
  },
  hero: {
    headline: 'Hecho para que el progreso se vea fácil.',
    description:
      'IGNITE AI es una app con IA para fotografiar comidas y obtener calorías y macros al instante, registrar entrenamientos y compartir el progreso con amigos. Una app para alimentar, entrenar y mantener la constancia.',
    tagline: 'Foto. Registro. A por ello.',
    introAria: 'Presentación de IGNITE AI',
  },
  howItWorks: {
    title: 'Cómo funciona',
    steps: [
      {
        title: 'Fotografía, escanea o describe',
        description:
          'Desde Quick log, fotografía una comida, escanea un código de barras o etiqueta, escríbela o usa la voz. Elige el camino que te encaje.',
      },
      {
        title: 'Obtén calorías y macros',
        description:
          'La IA estima la nutrición. Las fotos y los escaneos correctos pueden registrarse al momento. Edita cuando quieras.',
      },
      {
        title: 'Entrena, sigue y mantén la constancia',
        description:
          'Cumple tus objetivos diarios de calorías y macros, registra entrenamientos y comparte comidas o logros con Share Cards, con amigos de tu grupo o en redes.',
      },
    ],
  },
  features: {
    ariaLabel: 'Funciones',
    closingNote: 'Además de ayuno, informes PDF, estadísticas y mucho más en la app.',
    items: [
      {
        id: 'meal',
        eyebrow: 'Registro de comidas con IA',
        title: 'Foto dentro. Macros fuera.',
        description:
          'Apunta la cámara a cualquier plato y IGNITE AI identifica la comida y estima calorías y macros. Sin buscar códigos de barras ni recorrer bases de datos.',
        bullets: [
          'Fotografía o describe cualquier comida',
          'Estimaciones instantáneas de calorías y macros',
          'Edita y confirma con un toque',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: 'Objetivos nutricionales diarios',
        title: 'Sabe exactamente qué te queda hoy.',
        description:
          'Tu anillo de calorías y la proteína, carbohidratos y grasas restantes se actualizan con cada registro. De un vistazo sabes qué comer a continuación.',
        bullets: [
          'Anillo de calorías de un vistazo',
          'Proteína, carbohidratos y grasas restantes',
          'Objetivos ajustados a tu meta',
        ],
        screenshotLabel: 'Objetivos diarios',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: 'Pasos, ritmo cardíaco, sueño: todo sincronizado.',
        description:
          'Conecta Apple Health o Health Connect para importar los datos que tu reloj y teléfono ya registran: pasos, calorías activas, ritmo cardíaco (BPM), sueño y entrenamientos. IGNITE los integra en tu presupuesto diario para que cada movimiento cuente.',
        bullets: [
          'Pasos, BPM, sueño y ejercicio sincronizados automáticamente',
          'Calorías activas de Apple Health y Health Connect',
          'Un solo lugar para actividad y nutrición',
        ],
        screenshotLabel: 'Entrenamientos',
      },
      {
        id: 'workout',
        eyebrow: 'Registro de entrenamientos',
        title: 'Registra cualquier sesión. Quema personalizada.',
        description:
          'Elige entre los tipos de ejercicio de IGNITE: fuerza, carrera, ciclismo, HIIT, natación y más. La quema calórica se estima según tu altura, peso y perfil, para que el número sea tuyo, no un promedio genérico.',
        bullets: [
          'Varios tipos de ejercicio listos para registrar',
          'Quema calculada con altura, peso y nivel de actividad',
          'Calorías de la sesión sumadas a tu presupuesto diario',
        ],
        screenshotLabel: 'Registro de entrenamiento',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: 'Convierte registros en tarjetas listas para Stories.',
        description:
          'Las Share Cards de comidas y entrenamientos muestran tu foto con calorías, macros o estadísticas. Elige entre más de 55 temas, edita el titular o deja que la IA sugiera uno, y comparte en Instagram, TikTok y más.',
        bullets: [
          'Más de 55 temas para comidas y entrenamientos',
          'Calorías, macros y estadísticas de sesión en la tarjeta',
          'Edita el texto o usa sugerencias de IA',
          'Comparte en Instagram, TikTok y más',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: 'Amigos y compartir',
        title: 'El progreso se siente distinto con amigos.',
        description:
          'Crea un grupo con tus amigos, comparte registros de comidas y entrenamientos, y compite por la mejor racha de tu círculo.',
        bullets: [
          'Crea grupos con amigos',
          'Comparte comidas, entrenamientos y registros',
          'Compite por la racha n.º 1',
        ],
        screenshotLabel: 'Feed de amigos',
      },
      {
        id: 'coach',
        eyebrow: 'Coach IGNITE AI',
        title: 'Respuestas de nutrición, a demanda.',
        description:
          'Chatea con el coach de IA integrado para orientación sobre comidas, macros y qué comer a continuación.',
        bullets: [
          'Pregunta lo que quieras sobre nutrición',
          'Sugerencias personalizadas',
          'Disponible 24/7 en la app',
        ],
        screenshotLabel: 'Chat del AI Coach',
      },
      {
        id: 'streaks',
        eyebrow: 'Rachas y medallas',
        title: 'Constancia, gamificada.',
        description:
          'Desbloquea logros a medida que registras y entrenas. Las rachas hacen que presentarte cada día se sienta automático.',
        bullets: [
          'Rachas diarias de registro',
          'Medallas de logro',
          'Hitos que merecen compartirse',
        ],
        screenshotLabel: 'Rachas y medallas',
      },
    ],
  },
  themes: {
    title: 'Tres estilos. El mismo IGNITE.',
    subtitle: 'Cambia entre Light, Glow y Dark cuando quieras en Apariencia.',
    alt: 'Tema {name} de IGNITE AI',
    items: {
      light: {
        name: 'Light',
        description: 'Lienzo limpio en malla para el registro diario.',
      },
      dark: {
        name: 'Dark',
        description: 'Modo nocturno en carbón para poca luz.',
      },
      glow: {
        name: 'Glow',
        description: 'Lavado suave de atardecer con profundidad cálida.',
      },
    },
  },
  socialProof: {
    title: 'Hecho para quien quiere resultados, no hojas de cálculo.',
    stats: [
      'precisión de ID en platos nítidos',
      'temas de Share Card',
      'señales de salud sincronizadas',
      'tipos de ejercicio para registrar',
    ],
  },
  finalCta: {
    title: 'Empieza a hacer que el progreso se vea fácil.',
    tagline: 'Foto. Registro. A por ello.',
    ratingAria: 'Valoración de 5 estrellas',
  },
  footer: {
    legal: 'Legal',
    privacy: 'Política de privacidad',
    terms: 'Términos de uso',
    referralTerms: "Términos del programa de referidos",
    creatorProgramTerms: "Términos del Creator Program",
    company: 'Empresa',
    contact: 'Contacto',
    faq: 'FAQ',
    creatorProgram: 'Creator Program',
    copyright: '© Copyright {year}, Todos los derechos reservados',
    disclaimer:
      'IGNITE AI ofrece únicamente información general de bienestar y fitness. No es consejo médico. Consulta a un profesional sanitario antes de cambiar tu dieta o rutina de ejercicio.',
  },
  contact: {
    backHome: '← Inicio',
    title: 'Contáctanos',
    subtitle: 'Envíanos un mensaje y te responderemos pronto.',
    firstName: 'Nombre',
    lastName: 'Apellidos',
    email: 'Email',
    message: 'Mensaje',
    required: 'obligatorio',
    submit: 'Enviar →',
    sending: 'Enviando…',
    success: 'Gracias. Tu mensaje se ha enviado. Te responderemos pronto.',
    error: 'Algo salió mal. Inténtalo de nuevo.',
  },
  press: {
    title: 'Prensa',
    subtitle:
      'Contacta con nuestro equipo de prensa para consultas de medios, entrevistas y comunicados.',
    email: 'Correo electrónico',
    subject: 'Asunto',
    message: 'Mensaje',
    emailPlaceholder: 'tu.email@ejemplo.com',
    subjectPlaceholder: 'Asunto de la consulta de medios',
    messagePlaceholder:
      'Indica los detalles de tu consulta de medios, incluyendo plazo, información del medio y preguntas concretas que quieras resolver...',
    submit: 'Enviar consulta de prensa',
    sending: 'Enviando…',
    success: 'Gracias. Tu consulta de prensa se ha enviado. Te responderemos pronto.',
    error: 'Algo ha fallado. Inténtalo de nuevo.',
  },
  creatorProgram: {
    title: 'Creator Program',
    subtitle:
      "Colabora con IGNITE AI. Comparte tu código personalizado para el precio anual exclusivo y gana dinero cuando tu audiencia pase a Premium.",
    heroAlt: 'Creadores conectados alrededor de la llama IGNITE AI',
    howTitle: 'Cómo funciona',
    steps: [
      {
        title: 'Descarga la app',
        description: 'Instala IGNITE AI en App Store o Google Play y crea tu cuenta.',
      },
      {
        title: 'Solicita en la app',
        description: 'Abre Perfil → Creator program → Apply con tus perfiles sociales y detalles de audiencia.',
      },
      {
        title: 'Lo revisamos',
        description: 'Nuestro equipo revisa tu perfil y te responde cuando haya una decisión.',
      },
      {
        title: 'Comparte y gana',
        description:
          "Si te aprueban, recibes un código de creador personalizado con el precio anual Premium más bajo. Gana dinero por cada suscripción anual Premium con tu código. Para más información, descarga la app.",
      },
    ],
    ctaTitle: 'Solicita en la app',
    ctaSubtitle:
      "Las solicitudes se hacen dentro de IGNITE AI para que tu cuenta de creador, código y Premium complementario queden vinculados a ti. Descarga la app para los detalles de las recompensas.",
    ctaSteps: [
      'Descarga IGNITE AI',
      'Abre Perfil → Creator program',
      'Toca Apply',
    ],
    termsLink: "Términos del Creator Program",
  },
  blog: {
    title: 'Nuestro blog',
    subtitle: 'síguenos para novedades',
    back: '← Blog',
    asideTagline: 'Foto. Registro. A por ello.',
    asideBody: 'Descarga IGNITE AI: macros, entrenamientos y progreso que merece compartirse.',
    previous: 'Anterior',
    next: 'Siguiente',
    paginationLabel: 'Páginas del blog',
  },
  legal: {
    backHome: '← Inicio',
    related: 'Relacionado:',
    privacy: 'Política de privacidad',
    terms: 'Términos de uso',
    referralTerms: "Términos del programa de referidos",
    creatorProgramTerms: "Términos del Creator Program",
  },
  faq: faqEs,
  comingSoon: {
    title: "Próximamente",
    subtitle:
      "Estamos dando los últimos retoques a IGNITE AI. Solo acceso privado por ahora.",
    tagline: "Foto. Registro. A por ello.",
    wrongPassword: 'Contraseña incorrecta. Inténtalo de nuevo.',
    genericError: 'Algo ha fallado. Inténtalo de nuevo.',
    password: 'Contraseña',
    enter: 'Entrar',
  },
} as const satisfies Messages
