import type { Messages } from './en'
import { faqJa } from './faq-ja'

export const ja = {
  lang: {
    chooseLanguage: '言語を選択',
    close: '閉じる',
  },
  nav: {
    home: 'ホーム',
    press: 'プレス',
    blogs: 'ブログ',
    creatorProgram: 'Creator Program',
    main: 'メイン',
    homeAria: 'IGNITE AI ホーム',
    closeMenu: 'メニューを閉じる',
    openMenu: 'メニューを開く',
  },
  hero: {
    headline: '進捗を、かんたんに見せるために。',
    description:
      'IGNITE AI は、食事を撮るだけでカロリーとマクロをすぐ把握し、ワークアウトを記録し、進捗を友だちと共有できる AI アプリ。食事・トレーニング・継続をひとつに。',
    tagline: '撮る。記録する。やり切る。',
    introAria: 'IGNITE AI のご紹介',
  },
  howItWorks: {
    title: '使い方',
    steps: [
      {
        title: '撮る、スキャンする、または説明する',
        description:
          'Quick log から食事を撮影、バーコードやラベルをスキャン、入力、または音声で。合う方法を選ぶだけ。',
      },
      {
        title: 'カロリーとマクロを取得',
        description:
          'AI が栄養を推定。撮影やスキャンが成功すればすぐ記録できます。いつでも編集可能。',
      },
      {
        title: 'トレーニング、追跡、継続',
        description:
          '毎日のカロリーとマクロ目標を達成し、ワークアウトを記録。Share Cards で食事や成果をグループの友だちや SNS に共有。',
      },
    ],
  },
  features: {
    ariaLabel: '機能',
    closingNote: '断食、PDF レポート、統計など、さらに多くの機能がアプリ内に。',
    items: [
      {
        id: 'meal',
        eyebrow: 'AI 食事記録',
        title: '写真を入れる。マクロが出る。',
        description:
          'どんな皿にもカメラを向けるだけで、IGNITE AI が食品を識別し、カロリーとマクロを推定。バーコード探しやデータベースのスクロールは不要。',
        bullets: [
          'どんな食事も撮影または説明',
          'カロリーとマクロを即推定',
          'ワンタップで編集・確定',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: '毎日の栄養目標',
        title: '今日あとどれだけか、一目でわかる。',
        description:
          'カロリーリングと残りタンパク質・炭水化物・脂質が、記録のたびに更新。次に何を食べるかが一目でわかります。',
        bullets: [
          'カロリーリングを一目で',
          '残りタンパク質・炭水化物・脂質',
          '目標に合わせたゴール設定',
        ],
        screenshotLabel: 'デイリーゴール',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: '歩数、心拍、睡眠。すべて同期。',
        description:
          'Apple Health または Health Connect を連携し、ウォッチとスマホがすでに追っているデータを取り込み：歩数、アクティブカロリー、心拍数（BPM）、睡眠、ワークアウト。IGNITE が毎日の予算に組み込み、すべての動きがカウントされます。',
        bullets: [
          '歩数・BPM・睡眠・運動を自動同期',
          'Apple Health と Health Connect のアクティブカロリー',
          '活動と栄養をひとつの場所で',
        ],
        screenshotLabel: 'ワークアウト',
      },
      {
        id: 'workout',
        eyebrow: 'ワークアウト記録',
        title: 'どんなセッションも記録。消費はあなた向け。',
        description:
          'IGNITE 内蔵の運動タイプから選択：筋力、ランニング、サイクリング、HIIT、水泳など。消費カロリーは身長・体重・プロフィールから推定され、一般平均ではなくあなたに合った数値になります。',
        bullets: [
          '記録できる運動タイプが複数',
          '身長・体重・活動レベルから消費を算出',
          'セッションカロリーが毎日の予算に加算',
        ],
        screenshotLabel: 'ワークアウトログ',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: '記録を Stories 向けカードに。',
        description:
          '食事とワークアウトの Share Cards は、写真にカロリー・マクロ・トレーニング統計を表示。55以上のテーマから選び、見出しを自分で編集するか AI に提案させて、Instagram、TikTok などへ共有。',
        bullets: [
          '食事とワークアウト向け 55以上のテーマ',
          'カードにカロリー・マクロ・セッション統計',
          'テキスト編集または AI 提案を利用',
          'Instagram、TikTok などへ共有',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: '友だちと共有',
        title: '友だちとなら、進捗の手応えが違う。',
        description:
          '友だちとグループを作り、食事ログとワークアウトを共有。サークル内でトップストリークを競おう。',
        bullets: [
          '友だちとグループを作成',
          '食事・ワークアウト・ログを共有',
          '#1 ストリークを目指す',
        ],
        screenshotLabel: 'フレンズフィード',
      },
      {
        id: 'coach',
        eyebrow: 'IGNITE AI コーチ',
        title: '栄養の答えを、その場で。',
        description:
          '内蔵 AI コーチにチャットで相談。食事、マクロ、次に何を食べるかをガイドします。',
        bullets: [
          '栄養について何でも質問',
          'パーソナライズされた提案',
          'アプリ内で 24時間対応',
        ],
        screenshotLabel: 'AI コーチチャット',
      },
      {
        id: 'streaks',
        eyebrow: 'ストリークとバッジ',
        title: '継続を、ゲームのように。',
        description:
          '記録とトレーニングで実績をアンロック。ストリークが毎日の習慣を自然にします。',
        bullets: [
          '毎日の記録ストリーク',
          'アチーブメントバッジ',
          '共有したくなるマイルストーン',
        ],
        screenshotLabel: 'ストリークとバッジ',
      },
    ],
  },
  themes: {
    title: '3つのルック。同じ IGNITE。',
    subtitle: '外観で Light、Glow、Dark をいつでも切り替え。',
    alt: 'IGNITE AI {name} テーマ',
    items: {
      light: {
        name: 'Light',
        description: '毎日の記録に合うクリーンなメッシュ画面。',
      },
      dark: {
        name: 'Dark',
        description: '暗い場所向けのチャコールナイトモード。',
      },
      glow: {
        name: 'Glow',
        description: '暖かみのある夕焼けのようなソフトな色合い。',
      },
    },
  },
  socialProof: {
    title: 'スプレッドシートではなく、結果が欲しい人のために。',
    stats: [
      'はっきりした皿での ID 精度',
      'Share Card テーマ',
      '同期されるヘルスシグナル',
      '記録できる運動タイプ',
    ],
  },
  finalCta: {
    title: '進捗を、かんたんに見せはじめよう。',
    tagline: '撮る。記録する。やり切る。',
    ratingAria: '星5つ評価',
  },
  footer: {
    legal: '法務',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
    company: '会社情報',
    contact: 'お問い合わせ',
    faq: 'FAQ',
    creatorProgram: 'Creator Program',
    copyright: '© Copyright {year}, All rights reserved',
    disclaimer:
      'IGNITE AI は一般的なウェルネスとフィットネス情報のみを提供します。医療アドバイスではありません。食事や運動習慣を変える前に、医療従事者にご相談ください。',
  },
  contact: {
    backHome: '← ホーム',
    title: 'お問い合わせ',
    subtitle: 'メッセージを送信してください。折り返しご連絡します。',
    firstName: '名',
    lastName: '姓',
    email: 'メール',
    message: 'メッセージ',
    required: '必須',
    submit: '送信 →',
    sending: '送信中…',
    success: 'ありがとうございます。メッセージを送信しました。折り返しご連絡します。',
    error: '問題が発生しました。もう一度お試しください。',
  },
  press: {
    title: 'プレス',
    subtitle:
      'メディアのお問い合わせ、インタビュー、プレスリリースについては広報チームまでご連絡ください。',
    email: 'メールアドレス',
    subject: '件名',
    message: 'メッセージ',
    emailPlaceholder: 'your.email@example.com',
    subjectPlaceholder: 'メディアお問い合わせの件名',
    messagePlaceholder:
      '締め切り、媒体情報、回答が必要な具体的な質問など、お問い合わせの詳細をご記入ください...',
    submit: 'プレスお問い合わせを送信',
    sending: '送信中…',
    success: 'ありがとうございます。プレスお問い合わせを送信しました。近日中にご連絡します。',
    error: '問題が発生しました。もう一度お試しください。',
  },
  creatorProgram: {
    title: 'Creator Program',
    subtitle:
      'IGNITE AIと提携しましょう。専用の年間料金コードを共有し、オーディエンスがPremiumに加入すると報酬を得られます。',
    howTitle: '仕組み',
    steps: [
      {
        title: '応募する',
        description: 'コンテンツ、プラットフォーム、オーディエンスについて教えてください。',
      },
      {
        title: '審査する',
        description: 'チームがプロフィールを確認し、ご連絡します。',
      },
      {
        title: 'コードを受け取る',
        description:
          '承認されると、最安の年間Premium価格向けのパーソナルクリエイターコードが届きます。',
      },
      {
        title: '共有して稼ぐ',
        description:
          'コードをオーディエンスと共有。年間Premiumプランに加入したフォロワーごとに報酬を獲得。',
      },
    ],
    applyTitle: '応募',
    applyHint: '審査のため、コンテンツについて少し教えてください。',
    fieldName: '表示名',
    fieldNamePlaceholder: '名前またはブランド',
    fieldEmail: '連絡用メール',
    fieldEmailPlaceholder: 'you@email.com',
    fieldPlatforms: 'プラットフォーム',
    fieldHandle: 'メインのハンドル / リンク',
    fieldHandlePlaceholder: '@yourhandle またはプロフィールURL',
    fieldAudience: 'オーディエンス規模',
    fieldAudiencePlaceholder: '例: 25k',
    fieldNotes: 'その他',
    fieldNotesPlaceholder: 'ニッチ、コラボ案など',
    submit: '応募を送信',
    sending: '送信中…',
    success: 'ありがとうございます。応募を受け付けました。審査後、ご連絡します。',
    error: '問題が発生しました。もう一度お試しください。',
    errorPlatforms: 'プラットフォームを1つ以上選択してください。',
    appNote: 'IGNITE AIアプリの「プロフィール → Creator program」からも応募できます。',
    platform: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      other: 'その他',
    },
  },
  blog: {
    title: 'ブログ',
    subtitle: '最新情報をフォロー',
    back: '← ブログ',
    asideTagline: '撮る。記録する。やり切る。',
    asideBody: 'IGNITE AI をダウンロード：マクロ、ワークアウト、共有したくなる進捗。',
  },
  legal: {
    backHome: '← ホーム',
    related: '関連：',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
  },
  faq: faqJa,
  comingSoon: {
    title: "近日公開",
    subtitle:
      "IGNITE AIの仕上げ作業中です。現在はプライベートプレビューのみ。",
    tagline: "撮る。記録。達成。",
    wrongPassword: 'パスワードが違います。もう一度お試しください。',
    genericError: '問題が発生しました。もう一度お試しください。',
    password: 'パスワード',
    enter: '入る',
  },
} as const satisfies Messages
