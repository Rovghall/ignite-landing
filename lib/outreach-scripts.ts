import { getCreatorOutreachMoney, type CreatorOutreachCurrency } from '@/lib/creator-outreach-currency'

export type OutreachScriptToque = 1 | 2 | 3
export type OutreachScriptLang = 'PT' | 'EN' | 'ES'

export type OutreachScriptCopy = {
  channel: string
  title: string
  note?: string
  subject?: string
  body: string
}

export type OutreachScript = {
  id: string
  toque: OutreachScriptToque
  copies: Record<OutreachScriptLang, OutreachScriptCopy>
}

export const OUTREACH_SCRIPT_LANGS: { id: OutreachScriptLang; label: string }[] = [
  { id: 'PT', label: 'PT' },
  { id: 'EN', label: 'EN' },
  { id: 'ES', label: 'ES' },
]

export const OUTREACH_SCRIPT_CURRENCIES: { id: CreatorOutreachCurrency; label: string }[] = [
  { id: 'EUR', label: '€ EUR' },
  { id: 'USD', label: '$ USD' },
  { id: 'GBP', label: '£ GBP' },
]

export const OUTREACH_SCRIPT_DEFAULTS = {
  nome: '',
  teuNome: 'Filipe',
  playStore: 'https://play.google.com/store/apps/details?id=com.igniteai.app',
  email: 'hello@ignitehub.app',
}

const CREATORS_PAGE_LOCALE: Record<OutreachScriptLang, string> = {
  PT: 'pt',
  EN: 'en',
  ES: 'es',
}

export function creatorsPageUrl(lang: OutreachScriptLang): string {
  return `https://www.ignitehub.app/${CREATORS_PAGE_LOCALE[lang]}/creators`
}

export function fillOutreachScript(
  text: string,
  vars: {
    nome: string
    teuNome: string
    playStore: string
    pdfBriefing: string
    email: string
    reward: string
    annual: string
  },
): string {
  return text
    .replaceAll('[NOME]', vars.nome.trim() || '[NOME]')
    .replaceAll('[TEU_NOME]', vars.teuNome.trim() || '[TEU_NOME]')
    .replaceAll('[PLAY_STORE]', vars.playStore.trim() || '[PLAY_STORE]')
    .replaceAll('[PDF_BRIEFING]', vars.pdfBriefing.trim() || '[PDF_BRIEFING]')
    .replaceAll('[EMAIL]', vars.email.trim() || '[EMAIL]')
    .replaceAll('[REWARD]', vars.reward)
    .replaceAll('[ANNUAL]', vars.annual)
}

export function moneyForOutreachScripts(currency: CreatorOutreachCurrency) {
  const money = getCreatorOutreachMoney(currency)
  return { reward: money.reward, annual: money.annual }
}

export const OUTREACH_SCRIPTS: OutreachScript[] = [
  {
    id: 't1-main',
    toque: 1,
    copies: {
      PT: {
        channel: 'DM / email / WhatsApp',
        title: 'Toque 1 — mensagem principal',
        note: 'Não envies o link. Objectivo: resposta. A página vai no Toque 2.',
        body: `Olá [NOME], tudo bem?

Sou o Filipe, fundador da app IGNITE AI.

Acabámos de a lançar para iOS e Android e estou a contactar criadores cujo conteúdo encaixa no que estamos a construir. Queria saber se esta proposta te interessa.

App de nutrição e fitness: foto da refeição → calorias, macros e ingredientes em 4–8s, mais treinos e Apple Health / Health Connect.

No Creator Program oferecemos:
• Premium grátis, renovável, para testares a app enquanto fazes conteúdo
• Código teu com o plano anual mais barato para a tua audiência
• [REWARD] por cada seguidor que assine o Premium anual com o teu código
• Creator Group na app (chat, feed dos teus logs e leaderboard) para a comunidade ficar contigo dentro da app

Se te fizer sentido mostrar a ferramenta no dia a dia, dar um preço especial à audiência e monetizar de forma transparente, responde e mando a página com todos os detalhes.

Abraço,
Filipe`,
      },
      EN: {
        channel: 'DM / email / WhatsApp',
        title: 'Touch 1 — main message',
        note: 'Don’t send the link. Goal: a reply. The page goes in Touch 2.',
        body: `Hi [NOME], how are you?

I’m Filipe, founder of the IGNITE AI app.

We just launched on iOS and Android and I’m reaching out to creators whose content fits what we’re building. Wanted to see if this proposal interests you.

Nutrition and fitness app: snap a meal photo → calories, macros and ingredients in 4–8s, plus workouts and Apple Health / Health Connect.

In the Creator Program we offer:
• Free Premium, renewable, so you can test the app while making content
• Your own code with the lowest annual price for your audience
• [REWARD] for every follower who subscribes to annual Premium with your code
• Creator Group in the app (chat, feed of your logs and leaderboard) so your community stays with you inside the app

If it makes sense to show a real tool in your day to day, give your audience a special price and monetize transparently, reply and I’ll send the page with all the details.

Best,
Filipe`,
      },
      ES: {
        channel: 'DM / email / WhatsApp',
        title: 'Toque 1 — mensaje principal',
        note: 'No envíes el link. Objetivo: respuesta. La página va en el Toque 2.',
        body: `Hola [NOME], ¿qué tal?

Soy Filipe, fundador de la app IGNITE AI.

Acabamos de lanzarla en iOS y Android y estoy contactando a creadores cuyo contenido encaja con lo que estamos construyendo. Quería saber si esta propuesta te interesa.

App de nutrición y fitness: foto de la comida → calorías, macros e ingredientes en 4–8s, más entrenos y Apple Health / Health Connect.

En el Creator Program ofrecemos:
• Premium gratis, renovable, para probar la app mientras haces contenido
• Código tuyo con el precio anual más bajo para tu audiencia
• [REWARD] por cada seguidor que se suscriba al Premium anual con tu código
• Creator Group en la app (chat, feed de tus logs y leaderboard) para que tu comunidad esté contigo dentro de la app

Si te encaja mostrar una herramienta real en el día a día, dar un precio especial a la audiencia y monetizar de forma transparente, responde y te envío la página con todos los detalles.

Un abrazo,
Filipe`,
      },
    },
  },
  {
    id: 't1-email',
    toque: 1,
    copies: {
      PT: {
        channel: 'Email',
        title: 'Toque 1 — assunto de email',
        subject: 'Filipe (IGNITE AI) — Programa de Criadores',
        note: 'No email, podes acrescentar no fim: Fundador, IGNITE AI + o teu email.',
        body: `Olá [NOME], tudo bem?

Sou o Filipe, fundador da app IGNITE AI.

Acabámos de a lançar para iOS e Android e estou a contactar criadores cujo conteúdo encaixa no que estamos a construir. Queria saber se esta proposta te interessa.

App de nutrição e fitness: foto da refeição → calorias, macros e ingredientes em 4–8s, mais treinos e Apple Health / Health Connect.

No Creator Program oferecemos:
• Premium grátis, renovável, para testares a app enquanto fazes conteúdo
• Código teu com o plano anual mais barato para a tua audiência
• [REWARD] por cada seguidor que assine o Premium anual com o teu código
• Creator Group na app (chat, feed dos teus logs e leaderboard) para a comunidade ficar contigo dentro da app

Se te fizer sentido mostrar a ferramenta no dia a dia, dar um preço especial à audiência e monetizar de forma transparente, responde e mando a página com todos os detalhes.

Abraço,
Filipe
Fundador, IGNITE AI
[EMAIL]`,
      },
      EN: {
        channel: 'Email',
        title: 'Touch 1 — email subject',
        subject: 'Filipe (IGNITE AI) — Creator Program',
        note: 'You can add at the end: Founder, IGNITE AI + your email.',
        body: `Hi [NOME], how are you?

I’m Filipe, founder of the IGNITE AI app.

We just launched on iOS and Android and I’m reaching out to creators whose content fits what we’re building. Wanted to see if this proposal interests you.

Nutrition and fitness app: snap a meal photo → calories, macros and ingredients in 4–8s, plus workouts and Apple Health / Health Connect.

In the Creator Program we offer:
• Free Premium, renewable, so you can test the app while making content
• Your own code with the lowest annual price for your audience
• [REWARD] for every follower who subscribes to annual Premium with your code
• Creator Group in the app (chat, feed of your logs and leaderboard) so your community stays with you inside the app

If it makes sense to show a real tool in your day to day, give your audience a special price and monetize transparently, reply and I’ll send the page with all the details.

Best,
Filipe
Founder, IGNITE AI
[EMAIL]`,
      },
      ES: {
        channel: 'Email',
        title: 'Toque 1 — asunto de email',
        subject: 'Filipe (IGNITE AI) — Programa de Creadores',
        note: 'Al final puedes añadir: Fundador, IGNITE AI + tu email.',
        body: `Hola [NOME], ¿qué tal?

Soy Filipe, fundador de la app IGNITE AI.

Acabamos de lanzarla en iOS y Android y estoy contactando a creadores cuyo contenido encaja con lo que estamos construyendo. Quería saber si esta propuesta te interesa.

App de nutrición y fitness: foto de la comida → calorías, macros e ingredientes en 4–8s, más entrenos y Apple Health / Health Connect.

En el Creator Program ofrecemos:
• Premium gratis, renovable, para probar la app mientras haces contenido
• Código tuyo con el precio anual más bajo para tu audiencia
• [REWARD] por cada seguidor que se suscriba al Premium anual con tu código
• Creator Group en la app (chat, feed de tus logs y leaderboard) para que tu comunidad esté contigo dentro de la app

Si te encaja mostrar una herramienta real en el día a día, dar un precio especial a la audiencia y monetizar de forma transparente, responde y te envío la página con todos los detalles.

Un abrazo,
Filipe
Fundador, IGNITE AI
[EMAIL]`,
      },
    },
  },
  {
    id: 't1-short',
    toque: 1,
    copies: {
      PT: {
        channel: 'DM curto',
        title: 'Toque 1 — versão curta',
        note: 'Só se o DM tiver limite de caracteres.',
        body: `Olá [NOME], tudo bem?

Sou o Filipe, fundador da app IGNITE AI. Acabámos de a lançar para iOS e Android — queria saber se esta proposta te interessa.

App de nutrição e fitness: foto da refeição → calorias, macros e ingredientes em 4–8s, mais treinos e Apple Health / Health Connect.

Creator Program: Premium renovável · código teu com o plano anual mais barato · [REWARD]/assinatura anual · Creator Group na app.

Se fizer sentido, responde e mando a página com os detalhes.

Abraço,
Filipe`,
      },
      EN: {
        channel: 'Short DM',
        title: 'Touch 1 — short version',
        note: 'Only if the DM has a character limit.',
        body: `Hi [NOME], how are you?

I’m Filipe, founder of the IGNITE AI app. We just launched on iOS and Android — wanted to see if this proposal interests you.

Nutrition and fitness app: snap a meal photo → calories, macros and ingredients in 4–8s, plus workouts and Apple Health / Health Connect.

Creator Program: renewable Premium · your code with the lowest annual price · [REWARD]/annual signup · Creator Group in the app.

If it makes sense, reply and I’ll send the page with the details.

Best,
Filipe`,
      },
      ES: {
        channel: 'DM corto',
        title: 'Toque 1 — versión corta',
        note: 'Solo si el DM tiene límite de caracteres.',
        body: `Hola [NOME], ¿qué tal?

Soy Filipe, fundador de la app IGNITE AI. Acabamos de lanzarla en iOS y Android — quería saber si esta propuesta te interesa.

App de nutrición y fitness: foto de la comida → calorías, macros e ingredientes en 4–8s, más entrenos y Apple Health / Health Connect.

Creator Program: Premium renovable · código tuyo con el precio anual más bajo · [REWARD]/suscripción anual · Creator Group en la app.

Si te encaja, responde y te envío la página con los detalles.

Un abrazo,
Filipe`,
      },
    },
  },
  {
    id: 't2-dm',
    toque: 2,
    copies: {
      PT: {
        channel: 'DM / WhatsApp',
        title: 'Toque 2 — explicação + página',
        note: 'Só depois de responderem. Envia o link da página + Play Store + passos na app.',
        body: `Obrigado pelo interesse, [NOME]! 🙌

Resumo do Programa de Criadores IGNITE AI:

PARA TI
• Premium de cortesia (~90 dias) para testares a app
• Código personalizado (ex.: TEUNOME) só teu
• [REWARD] por cada seguidor que assine o Premium ANUAL com o teu código
• Dashboard na app: quem usou o código, recompensas, PayPal

PARA A TUA AUDIÊNCIA
• Preço anual exclusivo ([ANNUAL]) ao usar o teu código no registo

COMO ENTRAR
1. Instala: [PLAY_STORE]
2. Cria conta → Perfil → Programa de Criadores → Candidatar
3. Preenche plataformas, handle e tamanho da audiência
4. Avisas-me quando submeteres — revemos em 24–48h

Página com todos os detalhes: [PDF_BRIEFING]

Regras importantes (para evitar surpresas):
• Recompensa só em plano anual (mensal/semanal não conta)
• Pagamento via PayPal após janela de reembolso (~30 dias)
• Programa separado do "Indique um amigo"
• Promoção honesta — sem promessas médicas ou contas falsas

Qualquer dúvida, estou aqui. Quando te candidatares, diz-me o email da conta IGNITE.`,
      },
      EN: {
        channel: 'DM / WhatsApp',
        title: 'Touch 2 — details + page',
        note: 'Only after they reply. Send the page link + store link + in-app steps.',
        body: `Thanks for getting back, [NOME]! 🙌

IGNITE AI Creator Program — quick overview:

FOR YOU
• Complimentary Premium (~90 days) to test the app
• Your personal creator code
• [REWARD] for every follower who subscribes to ANNUAL Premium with your code
• In-app dashboard: who used the code, rewards, PayPal

FOR YOUR AUDIENCE
• Exclusive annual price ([ANNUAL]) when they use your code at signup

HOW TO JOIN
1. Install: [PLAY_STORE]
2. Create an account → Profile → Creator program → Apply
3. Fill in platforms, handle and audience size
4. Tell me when you’ve submitted — we review within 24–48h

Page with all the details: [PDF_BRIEFING]

Key rules:
• Rewards on annual plans only (monthly/weekly don’t count)
• PayPal payout after the refund window (~30 days)
• Separate from Refer a friend
• Honest promotion — no medical claims or fake accounts

Any questions, I’m here. When you apply, send me the email of your IGNITE account.`,
      },
      ES: {
        channel: 'DM / WhatsApp',
        title: 'Toque 2 — explicación + página',
        note: 'Solo después de que respondan. Envía el link de la página + Play Store + pasos en la app.',
        body: `¡Gracias por tu interés, [NOME]! 🙌

Programa de Creadores IGNITE AI:

PARA TI
• Premium de cortesía (~90 días) para probar la app
• Código personalizado (ej.: TUNOMBRE) solo tuyo
• [REWARD] por cada seguidor que se suscriba al Premium ANUAL con tu código
• Panel en la app: quién usó el código, recompensas, PayPal

PARA TU AUDIENCIA
• Precio anual exclusivo ([ANNUAL]) con tu código al registrarse

CÓMO UNIRTE
1. Instala: [PLAY_STORE]
2. Crea cuenta → Perfil → Programa de creadores → Solicitar
3. Completa plataformas, handle y tamaño de audiencia
4. Avísame cuando envíes la solicitud — revisamos en 24–48h

Página con todos los detalles: [PDF_BRIEFING]

Reglas importantes:
• Recompensa solo en plan anual (mensual/semanal no cuenta)
• Pago vía PayPal tras la ventana de reembolso (~30 días)
• Programa separado de “Referir a un amigo”
• Promoción honesta — sin promesas médicas ni cuentas falsas

¿Alguna duda? Escríbeme. Cuando te postules, dime el email de tu cuenta IGNITE.`,
      },
    },
  },
  {
    id: 't2-email',
    toque: 2,
    copies: {
      PT: {
        channel: 'Email',
        title: 'Toque 2 — email completo',
        subject: 'IGNITE AI Creator Program — detalhes',
        body: `Olá [NOME],

Obrigado pelo interesse no Programa de Criadores da IGNITE AI. Segue o resumo.

O QUE É A IGNITE AI
App de nutrição e fitness: registo de refeições (foto, voz, texto), macros, objetivos diários e tracking de progresso.

O QUE RECEBES COMO CREATOR
• Premium de cortesia para testares (~90 dias após aprovação)
• Código de criador personalizado para partilhares com a audiência
• [REWARD] por cada seguidor que subscreva o plano Premium ANUAL com o teu código
• Painel na app: utilização do código, recompensas pendentes/pagas, email PayPal

O QUE A TUA AUDIÊNCIA RECEBE
• Acesso ao preço anual exclusivo ([ANNUAL]) ao usar o teu código no registo

COMO PARTICIPAR
1. Instala a app: [PLAY_STORE]
2. Perfil → Programa de Criadores → Candidatar
3. Indica plataformas, handle principal e tamanho da audiência
4. Responde a este email quando submeteres — analisamos em 24–48h

Página com todos os detalhes: [PDF_BRIEFING]

NOTAS IMPORTANTES
• Recompensas apenas em subscrições Premium anuais pagas
• Pagamentos via PayPal, após período de reembolso e revisão
• Separado do programa "Indique um amigo"
• Aprovação sujeita a revisão; termos completos na app (Perfil → Termos do Programa de Criadores)

Se quiseres, podemos marcar uma call de 15 min. Caso contrário, candidata-te na app e avisa-me.

Abraço,
[TEU_NOME]
[EMAIL]
IGNITE AI`,
      },
      EN: {
        channel: 'Email',
        title: 'Touch 2 — full email',
        subject: 'IGNITE AI Creator Program — details',
        body: `Hi [NOME],

Thanks for your interest in the IGNITE AI Creator Program. Here’s the summary.

WHAT IGNITE AI IS
Nutrition and fitness app: meal logging (photo, voice, text), macros, daily goals and progress tracking.

WHAT YOU GET AS A CREATOR
• Complimentary Premium to test (~90 days after approval)
• Your personal creator code to share with your audience
• [REWARD] for every follower who subscribes to ANNUAL Premium with your code
• In-app dashboard: code usage, pending/paid rewards, PayPal email

WHAT YOUR AUDIENCE GETS
• Exclusive annual price ([ANNUAL]) when they use your code at signup

HOW TO JOIN
1. Install the app: [PLAY_STORE]
2. Profile → Creator program → Apply
3. Add platforms, main handle and audience size
4. Reply to this email when you’ve submitted — we review within 24–48h

Page with all the details: [PDF_BRIEFING]

IMPORTANT NOTES
• Rewards only on paid annual Premium subscriptions
• PayPal payouts after the refund window and review
• Separate from Refer a friend
• Approval is subject to review; full terms in the app (Profile → Creator Program Terms)

Happy to jump on a 15-min call if useful. Otherwise apply in the app and let me know.

Best,
[TEU_NOME]
[EMAIL]
IGNITE AI`,
      },
      ES: {
        channel: 'Email',
        title: 'Toque 2 — email completo',
        subject: 'IGNITE AI Creator Program — detalles',
        body: `Hola [NOME],

Gracias por tu interés en el Programa de Creadores de IGNITE AI. Aquí va el resumen.

QUÉ ES IGNITE AI
App de nutrición y fitness: registro de comidas (foto, voz, texto), macros, objetivos diarios y seguimiento de progreso.

LO QUE RECIBES COMO CREATOR
• Premium de cortesía para probar (~90 días tras la aprobación)
• Código de creador personalizado para compartir con tu audiencia
• [REWARD] por cada seguidor que se suscriba al plan Premium ANUAL con tu código
• Panel en la app: uso del código, recompensas pendientes/pagadas, email de PayPal

LO QUE RECIBE TU AUDIENCIA
• Precio anual exclusivo ([ANNUAL]) al usar tu código en el registro

CÓMO PARTICIPAR
1. Instala la app: [PLAY_STORE]
2. Perfil → Programa de creadores → Solicitar
3. Indica plataformas, handle principal y tamaño de audiencia
4. Responde a este email cuando envíes la solicitud — revisamos en 24–48h

Página con todos los detalles: [PDF_BRIEFING]

NOTAS IMPORTANTES
• Recompensas solo en suscripciones Premium anuales pagadas
• Pagos vía PayPal, tras el periodo de reembolso y revisión
• Separado del programa “Referir a un amigo”
• Aprobación sujeta a revisión; términos completos en la app (Perfil → Términos del Programa de Creadores)

Si quieres, podemos agendar una call de 15 min. Si no, postúlate en la app y avísame.

Un abrazo,
[TEU_NOME]
[EMAIL]
IGNITE AI`,
      },
    },
  },
  {
    id: 't3-followup',
    toque: 3,
    copies: {
      PT: {
        channel: 'DM / email',
        title: 'Follow-up — sem resposta (5–7 dias)',
        note: 'Um único follow-up. Sem pressão.',
        body: `Olá [NOME], só a confirmar se ainda faz sentido. Sem pressão — posso fechar a thread.

Abraço,
Filipe`,
      },
      EN: {
        channel: 'DM / email',
        title: 'Follow-up — no reply (5–7 days)',
        note: 'One follow-up only. No pressure.',
        body: `Hi [NOME], just checking if this still makes sense. No pressure — I can close the thread.

Best,
Filipe`,
      },
      ES: {
        channel: 'DM / email',
        title: 'Follow-up — sin respuesta (5–7 días)',
        note: 'Un solo follow-up. Sin presión.',
        body: `Hola [NOME], solo confirmo si todavía tiene sentido. Sin presión — puedo cerrar el hilo.

Un abrazo,
Filipe`,
      },
    },
  },
]
