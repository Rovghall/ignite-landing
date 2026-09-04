export type OutreachScriptToque = 1 | 2 | 3

export type OutreachScript = {
  id: string
  toque: OutreachScriptToque
  lang: 'PT' | 'EN' | 'ES'
  channel: string
  title: string
  note?: string
  subject?: string
  body: string
}

export const OUTREACH_SCRIPT_DEFAULTS = {
  nome: '',
  teuNome: 'Filipe',
  playStore: 'https://play.google.com/store/apps/details?id=com.igniteai.app',
  pdfBriefing: 'https://www.ignitehub.app/creators',
  email: 'hello@ignitehub.app',
}

export function fillOutreachScript(
  text: string,
  vars: {
    nome: string
    teuNome: string
    playStore: string
    pdfBriefing: string
    email: string
  },
): string {
  return text
    .replaceAll('[NOME]', vars.nome.trim() || '[NOME]')
    .replaceAll('[TEU_NOME]', vars.teuNome.trim() || '[TEU_NOME]')
    .replaceAll('[PLAY_STORE]', vars.playStore.trim() || '[PLAY_STORE]')
    .replaceAll('[PDF_BRIEFING]', vars.pdfBriefing.trim() || '[PDF_BRIEFING]')
    .replaceAll('[EMAIL]', vars.email.trim() || '[EMAIL]')
}

export const OUTREACH_SCRIPTS: OutreachScript[] = [
  {
    id: 't1-main',
    toque: 1,
    lang: 'PT',
    channel: 'DM / email / WhatsApp',
    title: 'Toque 1 — mensagem principal',
    note: 'Não attaches PDF. Objectivo: resposta. Só troca o nome se quiseres.',
    body: `Olá [NOME], tudo bem?

Sou o Filipe, fundador da app IGNITE AI.

Acabámos de a lançar para iOS e Android e estou a contactar criadores cujo conteúdo encaixa no que estamos a construir. Queria saber se esta proposta te interessa.

App de nutrição e fitness: foto da refeição → calorias, macros e ingredientes em 4–8s, mais treinos e Apple Health / Health Connect.

No Creator Program oferecemos:
• Premium grátis, renovável, para testares a app enquanto fazes conteúdo
• Código teu com o plano anual mais barato para a tua audiência
• €10 por cada seguidor que assine o Premium anual com o teu código
• Creator Group na app (chat, feed dos teus logs e leaderboard) para a comunidade ficar contigo dentro da app

Se te fizer sentido mostrar a ferramenta no dia a dia, dar um preço especial à audiência e monetizar de forma transparente, responde e mando a página com todos os detalhes.

Abraço,
Filipe`,
  },
  {
    id: 't1-email-subject',
    toque: 1,
    lang: 'PT',
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
• €10 por cada seguidor que assine o Premium anual com o teu código
• Creator Group na app (chat, feed dos teus logs e leaderboard) para a comunidade ficar contigo dentro da app

Se te fizer sentido mostrar a ferramenta no dia a dia, dar um preço especial à audiência e monetizar de forma transparente, responde e mando a página com todos os detalhes.

Abraço,
Filipe
Fundador, IGNITE AI
[EMAIL]`,
  },
  {
    id: 't1-short',
    toque: 1,
    lang: 'PT',
    channel: 'DM curto',
    title: 'Toque 1 — versão curta',
    note: 'Só se o DM tiver limite de caracteres.',
    body: `Olá [NOME], tudo bem?

Sou o Filipe, fundador da app IGNITE AI. Acabámos de a lançar para iOS e Android — queria saber se esta proposta te interessa.

App de nutrição e fitness: foto da refeição → calorias, macros e ingredientes em 4–8s, mais treinos e Apple Health / Health Connect.

Creator Program: Premium renovável · código teu com o plano anual mais barato · €10/assinatura anual · Creator Group na app.

Se fizer sentido, responde e mando a página com os detalhes.

Abraço,
Filipe`,
  },
  {
    id: 't2-dm',
    toque: 2,
    lang: 'PT',
    channel: 'DM / WhatsApp',
    title: 'Toque 2 — explicação + PDF',
    note: 'Só depois de responderem. Envia PDF + Play Store + passos na app.',
    body: `Obrigado pelo interesse, [NOME]! 🙌

Resumo do Programa de Criadores IGNITE AI:

PARA TI
• Premium de cortesia (~90 dias) para testares a app
• Código personalizado (ex.: TEUNOME) só teu
• €10 / $10 / £10 por cada seguidor que assine o Premium ANUAL com o teu código
• Dashboard na app: quem usou o código, recompensas, PayPal

PARA A TUA AUDIÊNCIA
• Preço anual exclusivo ao usar o teu código no registo

COMO ENTRAR
1. Instala: [PLAY_STORE]
2. Cria conta → Perfil → Programa de Criadores → Candidatar
3. Preenche plataformas, handle e tamanho da audiência
4. Avisas-me quando submeteres — revemos em 24–48h

PDF com todos os detalhes: [PDF_BRIEFING]

Regras importantes (para evitar surpresas):
• Recompensa só em plano anual (mensal/semanal não conta)
• Pagamento via PayPal após janela de reembolso (~30 dias)
• Programa separado do "Indique um amigo"
• Promoção honesta — sem promessas médicas ou contas falsas

Qualquer dúvida, estou aqui. Quando te candidatares, diz-me o email da conta IGNITE.`,
  },
  {
    id: 't2-email',
    toque: 2,
    lang: 'PT',
    channel: 'Email',
    title: 'Toque 2 — email completo',
    subject: 'IGNITE AI Creator Program — detalhes + PDF',
    body: `Olá [NOME],

Obrigado pelo interesse no Programa de Criadores da IGNITE AI. Segue o resumo.

O QUE É A IGNITE AI
App de nutrição e fitness: registo de refeições (foto, voz, texto), macros, objetivos diários e tracking de progresso.

O QUE RECEBES COMO CREATOR
• Premium de cortesia para testares (~90 dias após aprovação)
• Código de criador personalizado para partilhares com a audiência
• €10 / $10 / £10 (consoante a tua região) por cada seguidor que subscreva o plano Premium ANUAL com o teu código
• Painel na app: utilização do código, recompensas pendentes/pagas, email PayPal

O QUE A TUA AUDIÊNCIA RECEBE
• Acesso a preço anual exclusivo ao usar o teu código no registo

COMO PARTICIPAR
1. Instala a app: [PLAY_STORE]
2. Perfil → Programa de Criadores → Candidatar
3. Indica plataformas, handle principal e tamanho da audiência
4. Responde a este email quando submeteres — analisamos em 24–48h

Documento completo (PDF): [PDF_BRIEFING]

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
  {
    id: 't2-en',
    toque: 2,
    lang: 'EN',
    channel: 'Email / DM',
    title: 'Toque 2 — English follow-up',
    body: `Thanks for getting back, [NOME]!

IGNITE AI Creator Program — quick overview:

FOR YOU
• Complimentary Premium (~90 days) to test the app
• Your personal creator code
• €10 / $10 / £10 per qualified annual Premium signup
• In-app dashboard + PayPal payouts

FOR YOUR AUDIENCE
• Exclusive annual pricing when they use your code at signup

HOW TO JOIN
1. Install: [PLAY_STORE]
2. Profile → Creator program → Apply
3. Tell me when you've submitted — we review within 24–48h

Full PDF: [PDF_BRIEFING]

Key rules: rewards on annual plans only · PayPal after refund window · separate from Refer a friend · no misleading health claims

Reply with your IGNITE account email once you've applied.`,
  },
  {
    id: 't2-es',
    toque: 2,
    lang: 'ES',
    channel: 'Email / DM',
    title: 'Toque 2 — Español',
    body: `¡Gracias por tu interés, [NOME]!

Programa de Creadores IGNITE AI:

PARA TI
• Premium de cortesía (~90 días) para probar la app
• Código personalizado para tu audiencia
• €10 / $10 / £10 por cada suscripción anual Premium cualificada
• Panel en la app + pagos PayPal

PARA TU AUDIENCIA
• Precio anual exclusivo con tu código al registrarse

CÓMO UNIRTE
1. Instala: [PLAY_STORE]
2. Perfil → Programa de creadores → Solicitar
3. Avísame cuando envíes la solicitud — revisamos en 24–48h

PDF completo: [PDF_BRIEFING]

Reglas: recompensa solo en plan anual · pago vía PayPal tras ventana de reembolso · programa separado de "Referir a un amigo"

¿Alguna duda? Escríbeme.`,
  },
  {
    id: 't3-followup',
    toque: 3,
    lang: 'PT',
    channel: 'DM / email',
    title: 'Follow-up — sem resposta (5–7 dias)',
    note: 'Um único follow-up. Sem pressão.',
    body: `Olá [NOME], só a confirmar se ainda faz sentido. Sem pressão — posso fechar a thread.

Abraço,
Filipe`,
  },
]
