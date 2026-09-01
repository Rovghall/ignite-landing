import type { Messages } from './en'
import { faqZh } from './faq-zh'

export const zh = {
  lang: {
    chooseLanguage: '选择语言',
    close: '关闭',
  },
  nav: {
    home: '首页',
    press: '媒体',
    blogs: '博客',
    creatorProgram: 'Creator Program',
    main: '主页',
    homeAria: 'IGNITE AI 首页',
    closeMenu: '关闭菜单',
    openMenu: '打开菜单',
  },
  hero: {
    headline: '让进步看起来轻而易举。',
    description:
      'IGNITE AI 是一款 AI 应用：拍下餐食即可获得热量与宏量营养素，记录训练，并与朋友分享进度。一款应用，搞定补给、训练与坚持。',
    tagline: '拍下。记下。做到。',
    introAria: 'IGNITE AI 介绍',
  },
  howItWorks: {
    title: '使用方法',
    steps: [
      {
        title: '拍摄、扫描或描述',
        description:
          '在 Quick log 中拍摄餐食、扫描条码或标签、输入文字，或使用语音。选适合你的方式即可。',
      },
      {
        title: '获取热量与宏量营养素',
        description:
          'AI 估算营养。拍摄与成功扫描可立即记录。随时编辑。',
      },
      {
        title: '训练、追踪、保持一致',
        description:
          '达成每日热量与宏量目标，记录训练，并用 Share Cards 向小组好友或社交媒体分享餐食与成果。',
      },
    ],
  },
  features: {
    ariaLabel: '功能',
    closingNote: '应用内还有断食、PDF 报告、数据统计等更多功能。',
    items: [
      {
        id: 'meal',
        eyebrow: 'AI 餐食记录',
        title: '照片进去。宏量出来。',
        description:
          '对准任何一盘食物，IGNITE AI 即可识别并估算热量与宏量营养素。无需找条码，无需翻数据库。',
        bullets: [
          '拍摄或描述任意餐食',
          '即时热量与宏量估算',
          '一键编辑并确认',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: '每日营养目标',
        title: '清楚知道今天还剩多少。',
        description:
          '热量环与剩余蛋白质、碳水、脂肪随每次记录更新。一眼就知道接下来吃什么。',
        bullets: [
          '热量环一目了然',
          '剩余蛋白质、碳水与脂肪',
          '目标贴合你的靶向',
        ],
        screenshotLabel: '每日目标',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: '步数、心率、睡眠：全部同步。',
        description:
          '连接 Apple Health 或 Health Connect，导入手表与手机已在追踪的数据：步数、活动热量、心率（BPM）、睡眠与训练。IGNITE 将其纳入每日预算，每一步都算数。',
        bullets: [
          '步数、BPM、睡眠与运动自动同步',
          '来自 Apple Health 与 Health Connect 的活动热量',
          '活动与营养一处掌握',
        ],
        screenshotLabel: '训练',
      },
      {
        id: 'workout',
        eyebrow: '训练记录',
        title: '记录任意训练。消耗，因人而异。',
        description:
          '从 IGNITE 内置运动类型中选择：力量、跑步、骑行、HIIT、游泳等。热量消耗按身高、体重与个人资料估算，数字贴合你，而非泛泛平均值。',
        bullets: [
          '多种运动类型可随时记录',
          '按身高、体重与活动水平计算消耗',
          '训练热量计入每日预算',
        ],
        screenshotLabel: '训练日志',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: '把记录变成适合 Stories 的卡片。',
        description:
          '餐食与训练 Share Cards 展示你的照片，并附上热量、宏量或训练数据。从 55+ 主题中挑选，自行编辑标题或让 AI 建议，然后分享到 Instagram、TikTok 等。',
        bullets: [
          '餐食与训练 55+ 主题',
          '卡片上展示热量、宏量与训练数据',
          '编辑文案或使用 AI 建议',
          '分享到 Instagram、TikTok 及更多平台',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: '好友与分享',
        title: '有朋友一起，进步感觉完全不同。',
        description:
          '与朋友创建小组，分享餐食记录与训练，并争夺圈子里的最长连续记录。',
        bullets: [
          '与朋友创建小组',
          '分享餐食、训练与记录',
          '争夺第 1 名连续记录',
        ],
        screenshotLabel: '好友动态',
      },
      {
        id: 'coach',
        eyebrow: 'IGNITE AI 教练',
        title: '营养解答，随问随答。',
        description:
          '与内置 AI 教练聊天，获取餐食、宏量与下一步吃什么的指导。',
        bullets: [
          '营养相关问题随问',
          '个性化建议',
          '应用内全天候可用',
        ],
        screenshotLabel: 'AI 教练聊天',
      },
      {
        id: 'streaks',
        eyebrow: '连续记录与徽章',
        title: '坚持，游戏化。',
        description:
          '边记录边训练，解锁成就。连续记录让每天出现变得自然而然。',
        bullets: [
          '每日记录连续天数',
          '成就徽章',
          '值得分享的里程碑',
        ],
        screenshotLabel: '连续记录与徽章',
      },
    ],
  },
  themes: {
    title: '三种外观。同一个 IGNITE。',
    subtitle: '随时在外观中切换 Light、Glow 与 Dark。',
    alt: 'IGNITE AI {name} 主题',
    items: {
      light: {
        name: 'Light',
        description: '适合日常记录的干净网格画面。',
      },
      dark: {
        name: 'Dark',
        description: '低光环境的炭黑夜间模式。',
      },
      glow: {
        name: 'Glow',
        description: '带温暖纵深的柔和日落色调。',
      },
    },
  },
  socialProof: {
    title: '为想要结果、而非表格的人而建。',
    stats: [
      '清晰餐盘上的识别准确度',
      'Share Card 主题',
      '已同步的健康信号',
      '可记录的运动类型',
    ],
  },
  finalCta: {
    title: '开始让进步看起来轻而易举。',
    tagline: '拍下。记下。做到。',
    ratingAria: '五星评价',
  },
  footer: {
    legal: '法律信息',
    privacy: '隐私政策',
    terms: '使用条款',
    referralTerms: "推荐计划条款",
    creatorProgramTerms: "Creator Program 条款",
    company: '公司',
    contact: '联系',
    faq: 'FAQ',
    creatorProgram: 'Creator Program',
    copyright: '© Copyright {year}, 保留所有权利',
    disclaimer:
      'IGNITE AI 仅提供一般性的健康与健身信息，不构成医疗建议。更改饮食或运动习惯前，请咨询医疗专业人士。',
  },
  contact: {
    backHome: '← 首页',
    title: '联系我们',
    subtitle: '给我们留言，我们会尽快回复。',
    firstName: '名',
    lastName: '姓',
    email: '邮箱',
    message: '留言',
    required: '必填',
    submit: '提交 →',
    sending: '发送中…',
    success: '谢谢。您的消息已发送。我们会尽快回复。',
    error: '出了点问题。请重试。',
  },
  press: {
    title: '媒体',
    subtitle: '媒体垂询、采访与新闻稿，请联系我们的媒体团队。',
    email: '电子邮箱',
    subject: '主题',
    message: '留言',
    emailPlaceholder: 'your.email@example.com',
    subjectPlaceholder: '媒体垂询主题',
    messagePlaceholder:
      '请提供媒体垂询详情，包括截止日期、媒体信息以及希望解答的具体问题...',
    submit: '发送媒体垂询',
    sending: '发送中…',
    success: '谢谢。您的媒体垂询已发送。我们会尽快回复。',
    error: '出了点问题。请重试。',
  },
  creatorProgram: {
    title: 'Creator Program',
    subtitle:
      "与 IGNITE AI 合作。分享你的专属年度优惠码，当受众开通 Premium 时可获得收益。",
    heroAlt: '围绕 IGNITE AI 火焰的创作者',
    howTitle: '如何运作',
    steps: [
      {
        title: '下载应用',
        description: '在 App Store 或 Google Play 安装 IGNITE AI 并创建账户。',
      },
      {
        title: '在应用内申请',
        description: '打开 个人资料 → Creator program → Apply，提交社交资料与受众信息。',
      },
      {
        title: '我们审核',
        description: '我们的团队会审核你的资料，并在有结果时回复你。',
      },
      {
        title: '分享并赚取',
        description:
          "获批后，你将获得最低年度 Premium 价格的创作者码。用你的代码完成年度 Premium 订阅即可获得收益。了解详情请下载应用。",
      },
    ],
    ctaTitle: '在应用内申请',
    ctaSubtitle:
      "申请在 IGNITE AI 应用内完成，这样你的创作者账户、代码与赠送 Premium 会绑定到你。下载应用查看完整奖励详情。",
    ctaSteps: [
      '下载 IGNITE AI',
      '打开 个人资料 → Creator program',
      '点按 Apply',
    ],
    termsLink: "Creator Program 条款",
  },
  blog: {
    title: '我们的博客',
    subtitle: '关注最新动态',
    back: '← 博客',
    asideTagline: '拍下。记下。做到。',
    asideBody: '下载 IGNITE AI：宏量营养素、训练，以及值得分享的进步。',
    previous: '上一页',
    next: '下一页',
    paginationLabel: '博客分页',
  },
  legal: {
    backHome: '← 首页',
    related: '相关：',
    privacy: '隐私政策',
    terms: '使用条款',
    referralTerms: "推荐计划条款",
    creatorProgramTerms: "Creator Program 条款",
  },
  faq: faqZh,
  store: {
    appStoreSoonTitle: "即将登陆 App Store",
    appStoreSoonBody:
      "iOS 版 IGNITE AI 即将在 App Store 上线。你现在可以在 Google Play 下载 Android 版。",
    gotIt: "知道了",
  },
  comingSoon: {
    title: "即将推出",
    subtitle:
      "我们正在为 IGNITE AI 做最后打磨。目前仅限私密预览。",
    tagline: "拍下。记录。搞定。",
    wrongPassword: '密码错误。请重试。',
    genericError: '出了点问题。请重试。',
    password: '密码',
    enter: '进入',
  },
} as const satisfies Messages
