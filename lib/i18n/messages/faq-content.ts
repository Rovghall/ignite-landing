/** Shared FAQ copy wired into locale message files. */
export const faqEn = {
  title: 'FAQ',
  subtitle: 'The questions our support team hears most.',
  seeAll: 'See all FAQs',
  backHome: '← Home',
  pageTitle: 'Frequently asked questions',
  pageSubtitle: 'Billing, meal tracking, workouts, Health sync, and troubleshooting.',
  contactTitle: 'Still stuck?',
  contactBody:
    'Email us at support@ignitehub.app or send a message through the contact form. We usually reply within 1–2 business days.',
  contactLink: 'Contact us',
  teaser: [
    {
      q: 'Why am I still seeing a paywall after I paid?',
      a: 'Subscriptions are managed by Apple or Google, not by us directly. Open the app while signed into the same App Store or Google Play account you used to purchase, then try Restore Purchases in Settings. If it still fails, email support@ignitehub.app with your store receipt.',
    },
    {
      q: 'How do I cancel my subscription or free trial?',
      a: 'Cancel anytime in your device’s store settings. On iPhone: Settings → [Your Name] → Subscriptions → IGNITE AI → Cancel. On Android: Google Play → Payments & subscriptions → Subscriptions → IGNITE AI → Cancel. Cancel before the trial or renewal date to avoid the next charge.',
    },
    {
      q: 'I want a refund. How do I get one?',
      a: 'Refunds depend on where you bought your subscription:',
      bullets: [
        'Apple App Store: Apple handles this directly.',
        'Google Play: Same deal, request it through Google.',
        'Need help finding the right page? Email support@ignitehub.app.',
      ],
      links: [
        {
          label: 'Request a refund from Apple',
          href: 'https://support.apple.com/118223',
        },
        {
          label: 'Request your Google Play refund',
          href: 'https://support.google.com/googleplay/answer/2479637',
        },
      ],
    },
    {
      q: 'The AI scanned my meal wrong. What do I do?',
      a: 'After the meal analysis, open it from Recently uploaded, adjust it with the options there, then save your changes.',
    },
    {
      q: 'The app crashes or won’t open. What should I try?',
      a: 'Force-close the app, restart your phone, and make sure you’re on the latest App Store / Play Store version. If it still crashes, tell us your device model, OS version, and roughly when it happens at support@ignitehub.app so we can investigate.',
    },
    {
      q: 'My steps or Apple Health / Health Connect data isn’t showing.',
      a: 'Confirm Health permissions are on for IGNITE AI (Apple Health on iOS, Health Connect on Android), that the source apps are syncing, and that you’ve allowed steps/activity categories. Open IGNITE AI once after granting access so a sync can run. If numbers stay stuck, revoke and re-grant permissions, then reopen the app.',
    },
  ],
  categories: [
    {
      title: 'Subscriptions & billing',
      items: [
        {
          q: 'Why am I still seeing a paywall after I paid?',
          a: 'Subscriptions are managed by Apple or Google, not by us directly. Open the app while signed into the same App Store or Google Play account you used to purchase, then try Restore Purchases in Settings. If it still fails, email support@ignitehub.app with your store receipt.',
        },
        {
          q: 'How do I cancel my subscription or free trial?',
          a: 'Cancel anytime in your device’s store settings. On iPhone: Settings → [Your Name] → Subscriptions → IGNITE AI → Cancel. On Android: Google Play → Payments & subscriptions → Subscriptions → IGNITE AI → Cancel. Cancel before the trial or renewal date to avoid the next charge.',
        },
        {
          q: 'I want a refund. How do I get one?',
          a: 'Refunds depend on where you bought your subscription:',
          bullets: [
            'Apple App Store: Apple handles this directly.',
            'Google Play: Same deal, request it through Google.',
            'Need help finding the right page? Email support@ignitehub.app.',
          ],
          links: [
            {
              label: 'Request a refund from Apple',
              href: 'https://support.apple.com/118223',
            },
            {
              label: 'Request your Google Play refund',
              href: 'https://support.google.com/googleplay/answer/2479637',
            },
          ],
        },
        {
          q: 'Will I be charged again after my trial?',
          a: 'Yes, if you don’t cancel before the trial ends, the subscription renews automatically at the plan price shown at signup. You’ll get store reminders according to Apple/Google rules. Manage or cancel anytime in your store subscriptions.',
        },
        {
          q: 'I subscribed on iPhone but use Android (or the reverse).',
          a: 'Store subscriptions don’t transfer between Apple and Google. You’ll need an active subscription on the store for the device you’re using, or contact support if you’re mid-switch and need help.',
        },
      ],
    },
    {
      title: 'Meal tracking & AI',
      items: [
        {
          q: 'The AI scanned my meal wrong. What do I do?',
          a: 'After the meal analysis, open it from Recently uploaded, adjust it with the options there, then save your changes.',
        },
        {
          q: 'How accurate are calorie and macro estimates?',
          a: 'IGNITE AI is built to be the best in the market at identifying ingredients visually. Macros correspond to the weight of each ingredient, and that weight is an approximate estimate. Whenever you can, adjust the weight to the real amount if you weigh your food.',
        },
        {
          q: 'Can I log without taking a photo?',
          a: 'Yes. In Quick log you can type a description, use voice, or scan a barcode or nutrition label. Photo is optional.',
        },
        {
          q: 'Can I change a meal after I save it?',
          a: 'Yes. Open the logged meal and edit foods, portions, or totals. Changes update your daily calories and macros.',
        },
        {
          q: 'Can I save a meal to log it again later?',
          a: 'Yes. Open a logged meal and tap the save icon. It will appear under Diet → Saved. Whenever you want the same food again, go there and tap Log. No need to take a photo every time you eat the same meal.',
        },
      ],
    },
    {
      title: 'Workouts',
      items: [
        {
          q: 'How do I log a workout?',
          a: 'On the home page, tap the “+” button and choose Log workout. You’ll see several options. Pick the one that fits you best. Workouts are saved and estimate calorie burn based on your profile.',
        },
        {
          q: 'Do workouts adjust my calorie goal automatically?',
          a: 'Activity you log (and eligible Health sync data) can inform your progress picture. Treat calorie targets as guidance. Adjust goals in settings if your training load changes.',
        },
        {
          q: 'Can I edit or delete a workout?',
          a: 'Yes. Open the session from your history and edit or remove it so your stats stay accurate.',
        },
      ],
    },
    {
      title: 'Apple Health & Health Connect',
      items: [
        {
          q: 'My steps or Health data isn’t showing.',
          a: 'Confirm Health permissions are on for IGNITE AI (Apple Health on iOS, Health Connect on Android), that the source apps are syncing, and that you’ve allowed steps/activity categories. Open IGNITE AI once after granting access so a sync can run. If numbers stay stuck, revoke and re-grant permissions, then reopen the app.',
        },
        {
          q: 'Which data does IGNITE AI read?',
          a: 'With your permission, IGNITE AI can read the data below. You control categories in Apple Health or Health Connect and can revoke access anytime in system settings.',
          bullets: [
            'Steps',
            'Average heart rate',
            'Blood oxygen',
            'Sleep (including sleep stages)',
          ],
        },
        {
          q: 'Why don’t numbers match my watch or Health app?',
          a: 'Sources can differ (phone vs watch), and sync isn’t always instant. Check which app is the primary source of truth in Health / Health Connect, then pull to refresh or reopen IGNITE AI.',
        },
      ],
    },
    {
      title: 'Coach, friends & sharing',
      items: [
        {
          q: 'How do Friends or group sharing work?',
          a: 'Invite people from the Friends area with your invite flow. Once connected, you can share meals, workouts, or achievements according to what you choose to post. You’re in control of what’s visible.',
        },
        {
          q: 'What are Share Cards?',
          a: 'Share Cards are styled snapshots of meals, streaks, or wins you can send to friends or post on social. Pick a theme, generate the card, then share from your device sheet.',
        },
        {
          q: 'Can I stop sharing with someone?',
          a: 'Yes. Remove them from your friends/group list or leave the shared group in the Friends settings so future posts aren’t shared with them.',
        },
      ],
    },
    {
      title: 'App issues',
      items: [
        {
          q: 'The app crashes or won’t open. What should I try?',
          a: 'Force-close the app, restart your phone, and make sure you’re on the latest App Store / Play Store version. If it still crashes, tell us your device model, OS version, and roughly when it happens at support@ignitehub.app so we can investigate.',
        },
        {
          q: 'Login or account issues',
          a: 'Confirm you’re using the same sign-in method as before (Apple, Google, or email). If a code or magic link doesn’t arrive, check spam and wait a minute before requesting another. Still locked out? Email support@ignitehub.app from the address on the account.',
        },
        {
          q: 'Notifications aren’t arriving',
          a: 'Enable notifications for IGNITE AI in system Settings, and check in-app reminder toggles. Low Power Mode / battery savers can delay alerts on some phones.',
        },
      ],
    },
  ],
} as const

export const faqPt = {
  title: 'FAQ',
  subtitle: 'As perguntas que a nossa equipa de suporte mais ouve.',
  seeAll: 'Ver todas as FAQs',
  backHome: '← Início',
  pageTitle: 'Perguntas frequentes',
  pageSubtitle: 'Faturação, refeições, treinos, Health e resolução de problemas.',
  contactTitle: 'Ainda precisas de ajuda?',
  contactBody:
    'Envia email para support@ignitehub.app ou usa o formulário de contacto. Normalmente respondemos em 1–2 dias úteis.',
  contactLink: 'Contactar-nos',
  teaser: [
    {
      q: 'Porque continuo a ver o paywall depois de pagar?',
      a: 'As subscrições são geridas pela Apple ou Google, não diretamente por nós. Abre a app com a mesma conta da App Store ou Google Play usada na compra e tenta Restaurar compras nas Definições. Se continuar, envia o recibo da loja para support@ignitehub.app.',
    },
    {
      q: 'Como cancelo a subscrição ou o período de teste?',
      a: 'Cancela nas definições da loja do dispositivo. iPhone: Definições → [O teu nome] → Subscrições → IGNITE AI → Cancelar. Android: Google Play → Pagamentos e subscrições → Subscrições → IGNITE AI → Cancelar. Cancela antes do fim do teste ou da renovação para evitar a próxima cobrança.',
    },
    {
      q: 'Quero um reembolso. Como peço?',
      a: 'O reembolso depende de onde compraste a subscrição:',
      bullets: [
        'Apple App Store: a Apple trata disto diretamente.',
        'Google Play: o mesmo, pede através da Google.',
        'Precisas de ajuda a encontrar a página certa? Escreve para support@ignitehub.app.',
      ],
      links: [
        {
          label: 'Pedir reembolso na Apple',
          href: 'https://support.apple.com/118223',
        },
        {
          label: 'Pedir reembolso no Google Play',
          href: 'https://support.google.com/googleplay/answer/2479637',
        },
      ],
    },
    {
      q: 'A IA leu mal a minha refeição. O que faço?',
      a: 'Depois da análise da refeição, abre-a diretamente na secção Recently uploaded, ajusta com as opções disponíveis e, no fim, grava as alterações.',
    },
    {
      q: 'A app falha ou não abre. O que tentar?',
      a: 'Força o fecho da app, reinicia o telemóvel e confirma que tens a versão mais recente na App Store / Play Store. Se continuar, indica o modelo, versão do sistema e quando acontece para support@ignitehub.app.',
    },
    {
      q: 'Os meus passos ou dados do Apple Health / Health Connect não aparecem.',
      a: 'Confirma as permissões de Saúde para o IGNITE AI (Apple Health no iOS, Health Connect no Android), que as apps de origem sincronizam e que autorizaste passos/atividade. Abre o IGNITE AI depois de conceder o acesso. Se ficar bloqueado, revoga e volta a conceder as permissões e reabre a app.',
    },
  ],
  categories: [
    {
      title: 'Subscrições e faturação',
      items: [
        {
          q: 'Porque continuo a ver o paywall depois de pagar?',
          a: 'As subscrições são geridas pela Apple ou Google, não diretamente por nós. Abre a app com a mesma conta da App Store ou Google Play usada na compra e tenta Restaurar compras nas Definições. Se continuar, envia o recibo da loja para support@ignitehub.app.',
        },
        {
          q: 'Como cancelo a subscrição ou o período de teste?',
          a: 'Cancela nas definições da loja do dispositivo. iPhone: Definições → [O teu nome] → Subscrições → IGNITE AI → Cancelar. Android: Google Play → Pagamentos e subscrições → Subscrições → IGNITE AI → Cancelar. Cancela antes do fim do teste ou da renovação para evitar a próxima cobrança.',
        },
        {
          q: 'Quero um reembolso. Como peço?',
          a: 'O reembolso depende de onde compraste a subscrição:',
          bullets: [
            'Apple App Store: a Apple trata disto diretamente.',
            'Google Play: o mesmo, pede através da Google.',
            'Precisas de ajuda a encontrar a página certa? Escreve para support@ignitehub.app.',
          ],
          links: [
            {
              label: 'Pedir reembolso na Apple',
              href: 'https://support.apple.com/118223',
            },
            {
              label: 'Pedir reembolso no Google Play',
              href: 'https://support.google.com/googleplay/answer/2479637',
            },
          ],
        },
        {
          q: 'Vou ser cobrado outra vez depois do teste?',
          a: 'Sim, se não cancelares antes do fim do teste, a subscrição renova automaticamente ao preço mostrado no registo. Recebes avisos conforme as regras da Apple/Google. Gere ou cancela nas subscrições da loja.',
        },
        {
          q: 'Subscrevi no iPhone mas uso Android (ou o contrário).',
          a: 'As subscrições da loja não passam entre Apple e Google. Precisas de uma subscrição ativa na loja do dispositivo que estás a usar, ou contacta o suporte se estiveres a mudar de plataforma.',
        },
      ],
    },
    {
      title: 'Refeições e IA',
      items: [
        {
          q: 'A IA leu mal a minha refeição. O que faço?',
          a: 'Depois da análise da refeição, abre-a diretamente na secção Recently uploaded, ajusta com as opções disponíveis e, no fim, grava as alterações.',
        },
        {
          q: 'Quão precisas são as estimativas de calorias e macros?',
          a: 'O IGNITE AI é construído para ser o melhor do mercado a identificar ingredientes visualmente. As macros correspondem ao peso de cada ingrediente, e esse peso é uma estimativa aproximada. Sempre que puderes, ajusta o peso para o valor real se tiveres o hábito de pesar a comida.',
        },
        {
          q: 'Posso registar sem fotografia?',
          a: 'Sim. No Quick log podes escrever, usar a voz ou digitalizar código de barras/rótulo. A foto é opcional.',
        },
        {
          q: 'Posso alterar uma refeição depois de guardar?',
          a: 'Sim. Abre a refeição registada e edita alimentos, porções ou totais. As alterações atualizam as calorias e macros do dia.',
        },
        {
          q: 'Posso guardar uma refeição para logar novamente?',
          a: 'Sim. Abre a refeição registada e toca no ícone de guardar. Fica em Diet → Saved. Sempre que quiseres a mesma comida, vai lá e toca em Log. Não precisas de tirar foto todas as vezes que comes a mesma refeição.',
        },
      ],
    },
    {
      title: 'Treinos',
      items: [
        {
          q: 'Como registo um treino?',
          a: 'Na home, toca no botão “+” e escolhe Log workout. Vais encontrar várias opções. Escolhe a que melhor se ajusta a ti. Os exercícios são registados e estimam o gasto calórico com base no teu perfil.',
        },
        {
          q: 'Os treinos ajustam automaticamente a meta de calorias?',
          a: 'A atividade que registas (e dados elegíveis sincronizados da Saúde) ajuda a contextualizar o progresso. Trata as metas como orientação. Ajusta nas definições se a carga de treino mudar.',
        },
        {
          q: 'Posso editar ou apagar um treino?',
          a: 'Sim. Abre a sessão no histórico e edita ou remove para manter as estatísticas corretas.',
        },
      ],
    },
    {
      title: 'Apple Health e Health Connect',
      items: [
        {
          q: 'Os meus passos ou dados de Saúde não aparecem.',
          a: 'Confirma as permissões de Saúde para o IGNITE AI (Apple Health no iOS, Health Connect no Android), que as apps de origem sincronizam e que autorizaste passos/atividade. Abre o IGNITE AI depois de conceder o acesso. Se ficar bloqueado, revoga e volta a conceder as permissões e reabre a app.',
        },
        {
          q: 'Que dados o IGNITE AI lê?',
          a: 'Com a tua permissão, o IGNITE AI pode ler os dados abaixo. Controlas as categorias no Apple Health ou Health Connect e podes revogar o acesso a qualquer momento nas definições do sistema.',
          bullets: [
            'Passos',
            'Frequência cardíaca média',
            'Oxigénio no sangue',
            'Sono (incluindo fases do sono)',
          ],
        },
        {
          q: 'Porque os números não batem certo com o relógio ou a app Saúde?',
          a: 'As fontes podem diferir (telemóvel vs relógio) e a sincronização não é sempre instantânea. Confirma a fonte principal no Health / Health Connect e depois atualiza ou reabre o IGNITE AI.',
        },
      ],
    },
    {
      title: 'Coach, amigos e partilha',
      items: [
        {
          q: 'Como funcionam Amigos ou partilha em grupo?',
          a: 'Convida pessoas na área de Amigos com o fluxo de convite. Depois de ligados, podes partilhar refeições, treinos ou conquistas conforme escolheres. Tu decides o que fica visível.',
        },
        {
          q: 'O que são Share Cards?',
          a: 'Share Cards são imagens estilizadas de refeições, streaks ou conquistas para enviar a amigos ou publicar nas redes. Escolhe um tema, gera o cartão e partilha pelo menu do dispositivo.',
        },
        {
          q: 'Posso deixar de partilhar com alguém?',
          a: 'Sim. Remove a pessoa da lista de amigos/grupo ou sai do grupo partilhado nas definições de Amigos para que publicações futuras não lhes sejam partilhadas.',
        },
      ],
    },
    {
      title: 'Problemas na app',
      items: [
        {
          q: 'A app falha ou não abre. O que tentar?',
          a: 'Força o fecho da app, reinicia o telemóvel e confirma que tens a versão mais recente na App Store / Play Store. Se continuar, indica o modelo, versão do sistema e quando acontece para support@ignitehub.app.',
        },
        {
          q: 'Problemas de login ou conta',
          a: 'Confirma que usas o mesmo método de início de sessão (Apple, Google ou email). Se um código ou link não chegar, verifica o spam e espera um minuto antes de pedir outro. Continua bloqueado? Escreve para support@ignitehub.app a partir do email da conta.',
        },
        {
          q: 'As notificações não chegam',
          a: 'Ativa as notificações do IGNITE AI nas Definições do sistema e verifica os lembretes na app. Modo de poupança de bateria pode atrasar alertas em alguns telemóveis.',
        },
      ],
    },
  ],
} as const
