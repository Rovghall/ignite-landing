/** Simplified Chinese FAQ copy for locale message files. */
export const faqZh = {
  title: 'FAQ',
  subtitle: '我们的支持团队最常收到的问题。',
  seeAll: '查看全部常见问题',
  backHome: '← 首页',
  pageTitle: '常见问题',
  pageSubtitle: '订阅与账单、饮食记录、锻炼、Health 同步及故障排除。',
  contactTitle: '还没解决？',
  contactBody:
    '请发送邮件至 support@ignitehub.app，或通过联系表单留言。我们通常会在 1～2 个工作日内回复。',
  contactLink: '联系我们',
  teaser: [
    {
      q: '为什么付款后仍然看到付费墙？',
      a: '订阅由 Apple 或 Google 管理，而非我们直接处理。请使用购买时相同的 App Store 或 Google Play 账号登录并打开应用，然后在设置中尝试 Restore Purchases。若仍无效，请将商店收据发送至 support@ignitehub.app。',
    },
    {
      q: '如何取消订阅或免费试用？',
      a: '可随时在设备的商店设置中取消。iPhone：设置 → [您的姓名] → 订阅 → IGNITE AI → 取消。Android：Google Play → 付款和订阅 → 订阅 → IGNITE AI → 取消。请在试用或续订日期前取消，以避免下一笔扣款。',
    },
    {
      q: '我想申请退款，该怎么做？',
      a: '退款取决于您购买订阅的平台：',
      bullets: [
        'Apple App Store：由 Apple 直接处理。',
        'Google Play：同样通过 Google 申请。',
        '找不到正确页面？请发送邮件至 support@ignitehub.app。',
      ],
      links: [
        {
          label: '向 Apple 申请退款',
          href: 'https://support.apple.com/118223',
        },
        {
          label: '向 Google Play 申请退款',
          href: 'https://support.google.com/googleplay/answer/2479637',
        },
      ],
    },
    {
      q: 'AI 扫描餐食有误，该怎么办？',
      a: '餐食分析完成后，从 Recently uploaded 打开，使用其中的选项进行调整，然后保存更改。',
    },
    {
      q: '应用崩溃或无法打开，该尝试什么？',
      a: '强制关闭应用，重启手机，并确认 App Store / Play Store 中已安装最新版本。若仍崩溃，请将设备型号、系统版本及大致发生时间发送至 support@ignitehub.app，以便我们调查。',
    },
    {
      q: '步数或 Apple Health / Health Connect 数据未显示。',
      a: '请确认 IGNITE AI 的 Health 权限已开启（iOS 为 Apple Health，Android 为 Health Connect），来源应用正在同步，且已允许步数/活动类别。授予访问权限后打开一次 IGNITE AI 以运行同步。若数字仍不更新，请撤销并重新授予权限，然后重新打开应用。',
    },
  ],
  categories: [
    {
      title: '订阅与账单',
      items: [
        {
          q: '为什么付款后仍然看到付费墙？',
          a: '订阅由 Apple 或 Google 管理，而非我们直接处理。请使用购买时相同的 App Store 或 Google Play 账号登录并打开应用，然后在设置中尝试 Restore Purchases。若仍无效，请将商店收据发送至 support@ignitehub.app。',
        },
        {
          q: '如何取消订阅或免费试用？',
          a: '可随时在设备的商店设置中取消。iPhone：设置 → [您的姓名] → 订阅 → IGNITE AI → 取消。Android：Google Play → 付款和订阅 → 订阅 → IGNITE AI → 取消。请在试用或续订日期前取消，以避免下一笔扣款。',
        },
        {
          q: '我想申请退款，该怎么做？',
          a: '退款取决于您购买订阅的平台：',
          bullets: [
            'Apple App Store：由 Apple 直接处理。',
            'Google Play：同样通过 Google 申请。',
            '找不到正确页面？请发送邮件至 support@ignitehub.app。',
          ],
          links: [
            {
              label: '向 Apple 申请退款',
              href: 'https://support.apple.com/118223',
            },
            {
              label: '向 Google Play 申请退款',
              href: 'https://support.google.com/googleplay/answer/2479637',
            },
          ],
        },
        {
          q: '试用结束后会再次扣费吗？',
          a: '会的。若未在试用结束前取消，订阅将按注册时显示的计划价格自动续订。您将根据 Apple/Google 规则收到商店提醒。可随时在商店订阅管理中取消或更改。',
        },
        {
          q: '我在 iPhone 上订阅，但使用 Android（或相反）。',
          a: '商店订阅无法在 Apple 与 Google 之间转移。您需要在使用设备的商店中拥有有效订阅；若正在切换平台并需要帮助，请联系支持。',
        },
      ],
    },
    {
      title: '饮食记录与 AI',
      items: [
        {
          q: 'AI 扫描餐食有误，该怎么办？',
          a: '餐食分析完成后，从 Recently uploaded 打开，使用其中的选项进行调整，然后保存更改。',
        },
        {
          q: '卡路里和宏量营养素估算有多准确？',
          a: 'IGNITE AI 旨在成为市场上视觉识别食材的最佳应用。宏量营养素对应每种食材的重量，而该重量为近似估算。若您有称重习惯，请尽可能将重量调整为实际数值。',
        },
        {
          q: '可以不拍照就记录吗？',
          a: '可以。在 Quick log 中，您可以输入描述、使用语音，或扫描条形码或营养标签。拍照为可选项。',
        },
        {
          q: '保存后可以修改餐食吗？',
          a: '可以。打开已记录的餐食，编辑食物、份量或总计。更改会更新您当日的卡路里和宏量营养素。',
        },
        {
          q: '可以保存餐食以便稍后再次记录吗？',
          a: '可以。打开已记录的餐食并点击保存图标，它将出现在 Diet → Saved 中。当您再次想吃同样的食物时，前往该处并点击 Log 即可，无需每次拍照。',
        },
      ],
    },
    {
      title: '锻炼',
      items: [
        {
          q: '如何记录锻炼？',
          a: '在首页点击"+"按钮，选择 Log workout。您会看到多个选项，请选择最适合您的方式。锻炼会被保存，并根据您的个人资料估算消耗卡路里。',
        },
        {
          q: '锻炼会自动调整卡路里目标吗？',
          a: '您记录的活动（以及符合条件的 Health 同步数据）有助于了解整体进展。请将卡路里目标视为参考。若训练量发生变化，请在设置中调整目标。',
        },
        {
          q: '可以编辑或删除锻炼吗？',
          a: '可以。从历史记录中打开该次训练，进行编辑或删除，以保持统计数据准确。',
        },
      ],
    },
    {
      title: 'Apple Health 与 Health Connect',
      items: [
        {
          q: '步数或 Health 数据未显示。',
          a: '请确认 IGNITE AI 的 Health 权限已开启（iOS 为 Apple Health，Android 为 Health Connect），来源应用正在同步，且已允许步数/活动类别。授予访问权限后打开一次 IGNITE AI 以运行同步。若数字仍不更新，请撤销并重新授予权限，然后重新打开应用。',
        },
        {
          q: 'IGNITE AI 会读取哪些数据？',
          a: '经您许可，IGNITE AI 可读取以下数据。您可在 Apple Health 或 Health Connect 中控制类别，并随时在系统设置中撤销访问权限。',
          bullets: [
            '步数',
            '平均心率',
            '血氧',
            '睡眠（含睡眠阶段）',
          ],
        },
        {
          q: '数字与手表或 Health 应用不一致？',
          a: '数据来源可能不同（手机与手表），且同步并非总是即时完成。请在 Health / Health Connect 中确认主要数据来源，然后下拉刷新或重新打开 IGNITE AI。',
        },
      ],
    },
    {
      title: 'Coach、好友与分享',
      items: [
        {
          q: '好友或群组分享如何运作？',
          a: '在好友区域通过邀请流程邀请他人。连接后，您可根据发布内容分享餐食、锻炼或成就。显示内容由您自行控制。',
        },
        {
          q: '什么是 Share Cards？',
          a: 'Share Cards 是餐食、连续记录或成就的精美快照，可发送给好友或发布到社交媒体。选择主题、生成卡片，然后通过设备分享面板发送。',
        },
        {
          q: '可以停止与某人分享吗？',
          a: '可以。从好友/群组列表中移除对方，或在好友设置中退出共享群组，之后的发布内容将不再与对方共享。',
        },
      ],
    },
    {
      title: '应用问题',
      items: [
        {
          q: '应用崩溃或无法打开，该尝试什么？',
          a: '强制关闭应用，重启手机，并确认 App Store / Play Store 中已安装最新版本。若仍崩溃，请将设备型号、系统版本及大致发生时间发送至 support@ignitehub.app，以便我们调查。',
        },
        {
          q: '登录或账户问题',
          a: '请确认您使用的是与之前相同的登录方式（Apple、Google 或电子邮件）。若验证码或魔法链接未收到，请检查垃圾邮件并等待一分钟后再重新请求。仍无法登录？请使用账户邮箱联系 support@ignitehub.app。',
        },
        {
          q: '收不到通知',
          a: '请在系统设置中启用 IGNITE AI 的通知，并检查应用内提醒开关。部分手机上，低电量模式或省电功能可能会延迟通知。',
        },
      ],
    },
  ],
} as const
