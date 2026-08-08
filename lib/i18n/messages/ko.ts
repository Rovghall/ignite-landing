import type { Messages } from './en'
import { faqKo } from './faq-ko'

export const ko = {
  lang: {
    chooseLanguage: '언어 선택',
    close: '닫기',
  },
  nav: {
    home: '홈',
    press: '프레스',
    blogs: '블로그',
    creatorProgram: 'Creator Program',
    main: '메인',
    homeAria: 'IGNITE AI 홈',
    closeMenu: '메뉴 닫기',
    openMenu: '메뉴 열기',
  },
  hero: {
    headline: '진전이 쉬워 보이게 만들었습니다.',
    description:
      'IGNITE AI는 식사를 찍으면 칼로리와 매크로를 바로 확인하고, 운동을 기록하며, 친구와 진전을 공유하는 AI 앱입니다. 영양, 훈련, 꾸준함을 하나의 앱으로.',
    tagline: '찍고. 기록하고. 해내세요.',
    introAria: 'IGNITE AI 소개',
  },
  howItWorks: {
    title: '이용 방법',
    steps: [
      {
        title: '촬영, 스캔 또는 설명',
        description:
          'Quick log에서 식사를 촬영하고, 바코드나 라벨을 스캔하고, 입력하거나 음성으로. 맞는 방식을 고르세요.',
      },
      {
        title: '칼로리와 매크로 확인',
        description:
          'AI가 영양을 추정합니다. 촬영과 성공한 스캔은 바로 기록할 수 있습니다. 언제든 수정하세요.',
      },
      {
        title: '운동하고, 추적하고, 꾸준히',
        description:
          '일일 칼로리·매크로 목표를 맞추고, 운동을 기록하고, Share Cards로 식사나 성과를 그룹 친구나 SNS에 공유하세요.',
      },
    ],
  },
  features: {
    ariaLabel: '기능',
    closingNote: '단식, PDF 리포트, 통계 등 더 많은 기능이 앱에 있습니다.',
    items: [
      {
        id: 'meal',
        eyebrow: 'AI 식사 기록',
        title: '사진 넣으면. 매크로가 나옵니다.',
        description:
          '어떤 접시든 카메라를 향하면 IGNITE AI가 음식을 인식하고 칼로리와 매크로를 추정합니다. 바코드 찾기나 데이터베이스 스크롤은 필요 없습니다.',
        bullets: [
          '어떤 식사든 촬영하거나 설명',
          '칼로리·매크로 즉시 추정',
          '한 번 탭으로 수정하고 확인',
        ],
        screenshotLabel: 'Snap Track',
      },
      {
        id: 'goals',
        eyebrow: '일일 영양 목표',
        title: '오늘 남은 양을 정확히 알 수 있습니다.',
        description:
          '칼로리 링과 남은 단백질·탄수화물·지방이 기록할 때마다 업데이트됩니다. 한눈에 다음에 뭘 먹을지 알 수 있습니다.',
        bullets: [
          '한눈에 보는 칼로리 링',
          '남은 단백질·탄수화물·지방',
          '목표에 맞춘 골 설정',
        ],
        screenshotLabel: '일일 목표',
      },
      {
        id: 'health',
        eyebrow: 'Apple Health & Health Connect',
        title: '걸음, 심박, 수면: 모두 동기화.',
        description:
          'Apple Health 또는 Health Connect를 연결해 워치와 폰이 이미 추적하는 데이터를 가져옵니다: 걸음, 활동 칼로리, 심박수(BPM), 수면, 운동. IGNITE가 일일 예산에 반영해 모든 움직임이 카운트됩니다.',
        bullets: [
          '걸음·BPM·수면·운동 자동 동기화',
          'Apple Health와 Health Connect의 활동 칼로리',
          '활동과 영양을 한곳에서',
        ],
        screenshotLabel: '운동',
      },
      {
        id: 'workout',
        eyebrow: '운동 기록',
        title: '어떤 세션이든 기록. 소모는 개인화.',
        description:
          'IGNITE에 내장된 운동 유형에서 선택하세요: 근력, 러닝, 사이클링, HIIT, 수영 등. 칼로리 소모는 키·체중·프로필로 추정되어 일반적인 평균이 아닌 당신에 맞는 수치가 됩니다.',
        bullets: [
          '기록할 수 있는 다양한 운동 유형',
          '키·체중·활동 수준으로 소모 계산',
          '세션 칼로리가 일일 예산에 추가',
        ],
        screenshotLabel: '운동 로그',
      },
      {
        id: 'share',
        eyebrow: 'Share Cards',
        title: '기록을 스토리용 카드로.',
        description:
          '식사·운동 Share Cards는 사진과 함께 칼로리, 매크로 또는 훈련 통계를 보여줍니다. 55개 이상 테마에서 고르고, 헤드라인을 직접 수정하거나 AI 제안을 받은 뒤 Instagram, TikTok 등으로 공유하세요.',
        bullets: [
          '식사·운동용 55개 이상 테마',
          '카드에 칼로리·매크로·세션 통계',
          '텍스트 수정 또는 AI 제안 사용',
          'Instagram, TikTok 등으로 공유',
        ],
        screenshotLabel: 'Share Cards',
      },
      {
        id: 'friends',
        eyebrow: '친구와 공유',
        title: '친구와 함께라면 진전의 느낌이 다릅니다.',
        description:
          '친구와 그룹을 만들고, 식사 기록과 운동을 공유하며, 서클에서 최고 스트릭을 겨뤄보세요.',
        bullets: [
          '친구와 그룹 만들기',
          '식사·운동·기록 공유',
          '#1 스트릭을 향해 경쟁',
        ],
        screenshotLabel: '친구 피드',
      },
      {
        id: 'coach',
        eyebrow: 'IGNITE AI 코치',
        title: '영양 답변, 필요할 때.',
        description:
          '내장 AI 코치와 채팅하며 식사, 매크로, 다음에 뭘 먹을지 안내받으세요.',
        bullets: [
          '영양에 대해 무엇이든 질문',
          '맞춤 제안',
          '앱에서 24시간 이용',
        ],
        screenshotLabel: 'AI 코치 채팅',
      },
      {
        id: 'streaks',
        eyebrow: '스트릭과 배지',
        title: '꾸준함을 게임처럼.',
        description:
          '기록하고 운동할수록 업적을 잠금 해제하세요. 스트릭이 매일 나오는 습관을 자연스럽게 만듭니다.',
        bullets: [
          '일일 기록 스트릭',
          '업적 배지',
          '공유할 만한 마일스톤',
        ],
        screenshotLabel: '스트릭과 배지',
      },
    ],
  },
  themes: {
    title: '세 가지 룩. 같은 IGNITE.',
    subtitle: '모양새에서 Light, Glow, Dark를 언제든 전환하세요.',
    alt: 'IGNITE AI {name} 테마',
    items: {
      light: {
        name: 'Light',
        description: '매일 기록에 맞는 깔끔한 메시 캔버스.',
      },
      dark: {
        name: 'Dark',
        description: '어두운 환경을 위한 차콜 나이트 모드.',
      },
      glow: {
        name: 'Glow',
        description: '따뜻한 깊이의 부드러운 일몰 톤.',
      },
    },
  },
  socialProof: {
    title: '스프레드시트가 아니라 결과를 원하는 사람을 위해.',
    stats: [
      '선명한 접시에서 ID 정확도',
      'Share Card 테마',
      '동기화된 헬스 시그널',
      '기록할 수 있는 운동 유형',
    ],
  },
  finalCta: {
    title: '진전이 쉬워 보이게 시작하세요.',
    tagline: '찍고. 기록하고. 해내세요.',
    ratingAria: '별 5개 평가',
  },
  footer: {
    legal: '법적 고지',
    privacy: '개인정보 처리방침',
    terms: '이용약관',
    company: '회사',
    contact: '문의',
    faq: 'FAQ',
    creatorProgram: 'Creator Program',
    copyright: '© Copyright {year}, All rights reserved',
    disclaimer:
      'IGNITE AI는 일반적인 웰니스·피트니스 정보만 제공합니다. 의학적 조언이 아닙니다. 식단이나 운동 루틴을 바꾸기 전에 의료 전문가와 상담하세요.',
  },
  contact: {
    backHome: '← 홈',
    title: '문의하기',
    subtitle: '메시지를 보내주시면 곧 답변드리겠습니다.',
    firstName: '이름',
    lastName: '성',
    email: '이메일',
    message: '메시지',
    required: '필수',
    submit: '보내기 →',
    sending: '보내는 중…',
    success: '감사합니다. 메시지가 전송되었습니다. 곧 답변드리겠습니다.',
    error: '문제가 발생했습니다. 다시 시도해 주세요.',
  },
  press: {
    title: '프레스',
    subtitle:
      '미디어 문의, 인터뷰, 보도자료는 프레스 팀에 연락해 주세요.',
    email: '이메일 주소',
    subject: '제목',
    message: '메시지',
    emailPlaceholder: 'your.email@example.com',
    subjectPlaceholder: '미디어 문의 제목',
    messagePlaceholder:
      '마감일, 매체 정보, 답변이 필요한 구체적 질문 등 미디어 문의 세부 사항을 적어 주세요...',
    submit: '프레스 문의 보내기',
    sending: '보내는 중…',
    success: '감사합니다. 프레스 문의가 전송되었습니다. 곧 연락드리겠습니다.',
    error: '문제가 발생했습니다. 다시 시도해 주세요.',
  },
  creatorProgram: {
    title: 'Creator Program',
    subtitle:
      'IGNITE AI와 함께하세요. 전용 연간 요금 코드를 공유하고, 오디언스가 Premium에 가입하면 보상을 받으세요.',
    howTitle: '이용 방법',
    steps: [
      {
        title: '지원하기',
        description: '콘텐츠, 플랫폼, 오디언스에 대해 알려 주세요.',
      },
      {
        title: '검토하기',
        description: '팀이 프로필을 검토한 뒤 연락드립니다.',
      },
      {
        title: '코드 받기',
        description:
          '승인되면 최저 연간 Premium 가격을 위한 개인 크리에이터 코드를 받습니다.',
      },
      {
        title: '공유하고 보상받기',
        description:
          '코드를 오디언스와 공유하세요. 연간 Premium에 가입한 팔로워마다 보상을 받습니다.',
      },
    ],
    applyTitle: '지원',
    applyHint: '지원서 검토를 위해 콘텐츠에 대해 간단히 알려 주세요.',
    fieldName: '표시 이름',
    fieldNamePlaceholder: '이름 또는 브랜드',
    fieldEmail: '연락 이메일',
    fieldEmailPlaceholder: 'you@email.com',
    fieldPlatforms: '플랫폼',
    fieldHandle: '메인 핸들 / 링크',
    fieldHandlePlaceholder: '@yourhandle 또는 프로필 URL',
    fieldAudience: '오디언스 규모',
    fieldAudiencePlaceholder: '예: 25k',
    fieldNotes: '추가로 하실 말씀',
    fieldNotesPlaceholder: '니치, 콜라보 아이디어 등',
    submit: '지원서 제출',
    sending: '전송 중…',
    success: '감사합니다. 지원서가 전송되었습니다. 검토 후 곧 연락드리겠습니다.',
    error: '문제가 발생했습니다. 다시 시도해 주세요.',
    errorPlatforms: '플랫폼을 하나 이상 선택하세요.',
    appNote: 'IGNITE AI 앱의 프로필 → Creator program에서도 지원할 수 있습니다.',
    platform: {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      other: '기타',
    },
  },
  blog: {
    title: '블로그',
    subtitle: '업데이트를 팔로우하세요',
    back: '← 블로그',
    asideTagline: '찍고. 기록하고. 해내세요.',
    asideBody: 'IGNITE AI를 다운로드하세요: 매크로, 운동, 공유할 만한 진전.',
  },
  legal: {
    backHome: '← 홈',
    related: '관련:',
    privacy: '개인정보 처리방침',
    terms: '이용약관',
  },
  faq: faqKo,
  comingSoon: {
    title: "곧 공개",
    subtitle:
      "IGNITE AI의 마무리를 진행 중입니다. 지금은 비공개 프리뷰만 가능합니다.",
    tagline: "찍고. 기록하고. 해내자.",
    wrongPassword: '비밀번호가 틀렸습니다. 다시 시도하세요.',
    genericError: '문제가 발생했습니다. 다시 시도하세요.',
    password: '비밀번호',
    enter: '입장',
  },
} as const satisfies Messages
