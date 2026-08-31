/**
 * Generate scripts/cjk-data/{ja,ko,zh}-fields.json from:
 * - titles in scripts/cjk-data/titles-{locale}.json (slug → title)
 * - optional overrides in scripts/cjk-data/overrides-{locale}.json (slug → {description?, intro?})
 * - patterned auto-translations for common templates
 *
 * Then run: node scripts/build-cjk-blog-parts.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DATA = path.join(ROOT, 'scripts', 'cjk-data')
const LOCALES = ['ja', 'ko', 'zh']

const SCIENCE_SUFFIX = {
  ja: 'について、実践プロトコル、よくある失敗、測定方法、忙しい週でも続けられる記録システムまで解説する、科学に基づいた詳細ガイド。',
  ko: '에 대한 과학 기반 상세 가이드: 실전 프로토콜, 흔한 실수, 측정 방법, 바쁜 주에도 유지할 수 있는 기록 시스템.',
  zh: '的科学循证详细指南：实用方案、常见错误、测量方法，以及忙碌几周也能坚持的记录系统。',
}

const SCIENCE_PREFIX = {
  ja: '',
  ko: '',
  zh: '',
}

const BURN_INTRO = {
  ja: (activity) => [
    `人が${activity}の消費カロリーを聞くのは、そのセッションで夕食を正当化したいからです。セッション消費は本物ですが、アフターバーン神話が示唆するより小さく、ノイズも多いことが多いです。`,
    `体重、強度、休憩、総作業時間が${activity}の推定を支配します。同じ名前のワークアウトでも二人の結果は大きく分かれます。`,
    '脂肪減少は依然として週のエネルギーバランスに従います。トレーニングはまず刺激と健康のために使い、カット中のカロリー表示は保守的に扱いましょう。',
  ],
  ko: (activity) => [
    `사람들이 ${activity} 칼로리를 묻는 이유는 그 세션으로 저녁을 정당화하고 싶어서입니다. 세션 소모는 진짜지만, 애프터번 신화가 암시하는 것보다 보통 더 작고 노이즈가 많습니다.`,
    `체중, 강도, 휴식, 총 작업 시간이 ${activity} 추정을 지배합니다. 같은 이름 운동을 해도 두 사람은 크게 다를 수 있습니다.`,
    '지방 감량은 여전히 주간 에너지 균형을 따릅니다. 훈련은 자극과 건강을 우선하고, 컷 중 칼로리 출력은 보수적으로 다루세요.',
  ],
  zh: (activity) => [
    `人们问${activity}消耗多少卡，往往是想用那次训练为晚餐辩护。单次消耗是真实的，但通常比“后燃”神话暗示的更小、更噪。`,
    `体重、强度、休息和总做功时间主导${activity}的估算。两个人做同名训练也可能差很远。`,
    '减脂仍遵循每周能量平衡。训练优先服务刺激与健康；减脂期对卡路里读数要保守。',
  ],
}

const BURN_DESC = {
  ja: (activity) =>
    `${activity}の消費カロリーを詳しく見る：推定を動かす要因、体重と強度の影響、ウェアラブル誤差、筋肉対カロリー劇場、消費分を全部食べ戻さずにトレーニングを記録する方法。`,
  ko: (activity) =>
    `${activity} 칼로리 소모에 대한 상세 분석: 추정을 좌우하는 요인, 체중·강도 효과, 웨어러블 오차, 근육 vs 칼로리 연극, 소모분을 다 먹어치우지 않고 훈련을 기록하는 법.`,
  zh: (activity) =>
    `详解${activity}的卡路里消耗：驱动估算的因素、体重与强度影响、可穿戴误差、肌肉 vs 卡路里表演，以及如何记录训练而不把全部消耗吃回去。`,
}

const ACTIVITY_FROM_SLUG = {
  'how-many-calories-running-mile': { ja: '1マイルランニング', ko: '1마일 러닝', zh: '跑一英里' },
  'how-many-calories-weight-lifting': { ja: 'ウェイトリフティング', ko: '웨이트 리프팅', zh: '举重' },
  'how-many-calories-jumping-jacks': { ja: 'ジャンピングジャック', ko: '점핑 잭', zh: '开合跳' },
  'how-many-calories-pilates': { ja: 'ピラティス', ko: '필라테스', zh: '普拉提' },
  'how-many-calories-swimming': { ja: '水泳', ko: '수영', zh: '游泳' },
  'how-many-calories-push-ups': { ja: 'プッシュアップ', ko: '푸시업', zh: '俯卧撑' },
  'how-many-calories-squats': { ja: 'スクワット', ko: '스쿼트', zh: '深蹲' },
  'how-many-calories-skiing': { ja: 'スキー', ko: '스키', zh: '滑雪' },
  'how-many-calories-sit-ups': { ja: 'シットアップ', ko: '싯업', zh: '仰卧起坐' },
}

function scienceDesc(locale, title) {
  if (locale === 'ja') return `${title}${SCIENCE_SUFFIX.ja}`
  if (locale === 'ko') return `${title}${SCIENCE_SUFFIX.ko}`
  return `${title}${SCIENCE_SUFFIX.zh}`
}

function main() {
  const enPosts = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'en', 'templated-unique.json'), 'utf8'))

  for (const locale of LOCALES) {
    const titlesPath = path.join(DATA, `titles-${locale}.json`)
    const overridesPath = path.join(DATA, `overrides-${locale}.json`)
    if (!fs.existsSync(titlesPath)) {
      console.error(`Missing ${titlesPath}`)
      process.exit(1)
    }
    const titles = JSON.parse(fs.readFileSync(titlesPath, 'utf8'))
    const overrides = fs.existsSync(overridesPath)
      ? JSON.parse(fs.readFileSync(overridesPath, 'utf8'))
      : {}

    const fields = {}
    const missingTitles = []
    const missingIntro = []

    for (const p of enPosts) {
      const title = titles[p.slug]
      if (!title) {
        missingTitles.push(p.slug)
        continue
      }

      let description
      let intro

      const ov = overrides[p.slug] || {}
      if (ov.description) description = ov.description
      else if (/^A detailed, science-aware guide to /.test(p.description)) {
        description = scienceDesc(locale, title)
      } else if (ACTIVITY_FROM_SLUG[p.slug]) {
        description = BURN_DESC[locale](ACTIVITY_FROM_SLUG[p.slug][locale])
      } else {
        // need override
        description = ov.description
      }

      if (ov.intro) intro = ov.intro
      else if (ACTIVITY_FROM_SLUG[p.slug] && p.intro[0]?.startsWith('People ask about')) {
        intro = BURN_INTRO[locale](ACTIVITY_FROM_SLUG[p.slug][locale])
      } else {
        intro = ov.intro
      }

      if (!description || !intro) {
        missingIntro.push(p.slug)
        // still write partial for debugging
      }

      fields[p.slug] = {
        title,
        description: description || p.description,
        intro: intro || p.intro,
      }
    }

    fs.writeFileSync(path.join(DATA, `${locale}-fields.json`), JSON.stringify(fields, null, 2) + '\n')
    console.log(
      `[${locale}] fields=${Object.keys(fields).length} missingTitles=${missingTitles.length} needOverrides=${missingIntro.length}`,
    )
    if (missingTitles.length) console.log('  titles:', missingTitles.slice(0, 10).join(', '))
    if (missingIntro.length) {
      fs.writeFileSync(
        path.join(DATA, `need-overrides-${locale}.json`),
        JSON.stringify(missingIntro, null, 2) + '\n',
      )
      console.log(`  wrote need-overrides-${locale}.json (${missingIntro.length})`)
    }
  }
}

main()
