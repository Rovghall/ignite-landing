/**
 * Auto-fill missing t-{locale}-XX.json entries for highly patterned English strings.
 * Preserves any already-written locale chunks; only fills gaps / creates missing files
 * by translating known comparison + roundup templates.
 *
 * Usage: node scripts/fill-cjk-patterned-strings.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DATA = path.join(ROOT, 'scripts', 'cjk-data')
const LOCALES = ['ja', 'ko', 'zh']

function trCompareDesc(a, b, locale) {
  if (locale === 'ja')
    return `${a} と ${b} の実践比較：現実の記録、継続性、データベース対構造、どちらを選ぶべきか。`
  if (locale === 'ko')
    return `${a} vs ${b}에 대한 심층 비교: 실제 로깅, 순응, 데이터베이스 vs 구조, 누구에게 어떤 도구가 맞는지.`
  return `${a} 与 ${b} 的深入对比：真实记录、依从性、数据库 vs 结构，以及谁该选哪个工具。`
}

function trChoosing(a, b, locale) {
  if (locale === 'ja')
    return `${a} と ${b} の選択はブランド忠誠より摩擦の問題です。最良のトラッカーは、疲れた木曜日にもまだ記入するものです。`
  if (locale === 'ko')
    return `${a}와 ${b} 사이의 선택은 브랜드 충성보다 마찰의 문제입니다. 최고의 트래커는 피곤한 목요일에도 여전히 입력하는 것입니다.`
  return `在 ${a} 与 ${b} 之间选择，与其说是品牌忠诚，不如说是摩擦。最好的追踪器是你在疲惫的周四仍会填写的那一个。`
}

function trBelow(a, b, locale) {
  if (locale === 'ja')
    return `以下は ${a} 対 ${b} の実践的な内訳、そして IGNITE AI のような写真優先アプリがより良い第三の選択肢になる場合です。`
  if (locale === 'ko')
    return `아래는 ${a} 대 ${b}의 실용적 분석과, IGNITE AI 같은 사진 우선 앱이 더 나은 세 번째 옵션이 될 때입니다.`
  return `以下是 ${a} 与 ${b} 的实用拆解，以及何时像 IGNITE AI 这样的拍照优先应用是更好的第三选项。`
}

function trRoundupDesc(title, locale) {
  if (locale === 'ja')
    return `${title} の詳細ラウンドアップ：各オプションの強み、合う人、10個インストールせずに選ぶ方法。`
  if (locale === 'ko')
    return `${title}에 대한 상세 라운드업: 각 옵션의 강점, 누구에게 맞는지, 앱 열 개를 설치하지 않고 고르는 법.`
  return `${title} 的详细盘点：每个选项擅长什么、适合谁，以及如何不装十个应用就做出选择。`
}

function trRoundupIntro(title, locale) {
  if (locale === 'ja')
    return `${title} は、選び方が食べ方とトレーニングに合うときだけ役立ちます。このリストはロゴだけでなく、各オプションの仕事を説明します。`
  if (locale === 'ko')
    return `${title}는 선택이 먹는 방식과 훈련에 맞을 때만 도움이 됩니다. 이 목록은 로고만이 아니라 각 옵션의 역할을 설명합니다.`
  return `${title} 只有在选项匹配你的饮食与训练方式时才有用。这份列表解释每个选项的工作，而不只是标志。`
}

function tryPattern(en, locale) {
  let m

  // An in-depth A vs B comparison...
  m = en.match(/^An in-depth (.+?) vs (.+?) comparison for real-world logging, adherence, databases vs structure, and who should pick which tool\.$/)
  if (m) return trCompareDesc(m[1], m[2], locale)

  // Choosing between A and B...
  m = en.match(/^Choosing between (.+?) and (.+?) is less about brand loyalty and more about friction\. The best tracker is the one you still fill in on a tired Thursday\.$/)
  if (m) return trChoosing(m[1], m[2], locale)

  // Below is a practical breakdown of A versus B...
  m = en.match(/^Below is a practical breakdown of (.+?) versus (.+?), then when a photo-first app like IGNITE AI is the better third option\.$/)
  if (m) return trBelow(m[1], m[2], locale)

  // A detailed roundup for TITLE: ...
  m = en.match(/^A detailed roundup for (.+?): what each option does well, who it fits, and how to choose without installing ten apps\.$/)
  if (m) return trRoundupDesc(m[1], locale)

  // TITLE only helps if...
  m = en.match(/^(.+) only helps if the picks match how you eat and train\. This list explains the job of each option, not just the logo\.$/)
  if (m) return trRoundupIntro(m[1], locale)

  // Underreporting rises when logging is annoying...
  if (en === 'Underreporting rises when logging is annoying. Choose speed and honesty over feature hoarding.') {
    if (locale === 'ja') return '記録が面倒だと過少報告が増えます。機能の溜め込みより速さと誠実さを選びましょう。'
    if (locale === 'ko') return '기록이 귀찮으면 과소보고가 늘어납니다. 기능 수집보다 속도와 정직함을 선택하세요.'
    return '记录很烦时，漏报会上升。选择速度与诚实，而不是囤积功能。'
  }

  // Science-aware guide
  m = en.match(/^A detailed, science-aware guide to (.+): practical protocols, common mistakes, measurement methods, and a logging system you can keep on busy weeks\.$/)
  if (m) {
    const topic = m[1]
    if (locale === 'ja')
      return `${topic}について、実践プロトコル、よくある失敗、測定方法、忙しい週でも続けられる記録システムまで解説する、科学に基づいた詳細ガイド。`
    if (locale === 'ko')
      return `${topic}에 대한 과학 기반 상세 가이드: 실전 프로토콜, 흔한 실수, 측정 방법, 바쁜 주에도 유지할 수 있는 기록 시스템.`
    return `关于${topic}的科学循证详细指南：实用方案、常见错误、测量方法，以及忙碌几周也能坚持的记录系统。`
  }

  return null
}

function main() {
  const enFiles = fs
    .readdirSync(DATA)
    .filter((f) => /^t-en-\d+\.json$/.test(f))
    .sort()

  for (const locale of LOCALES) {
    let filled = 0
    let leftover = 0
    for (const enFile of enFiles) {
      const en = JSON.parse(fs.readFileSync(path.join(DATA, enFile), 'utf8'))
      const locFile = enFile.replace('t-en-', `t-${locale}-`)
      const locPath = path.join(DATA, locFile)
      let loc = fs.existsSync(locPath) ? JSON.parse(fs.readFileSync(locPath, 'utf8')) : []
      // normalize length
      while (loc.length < en.length) loc.push(null)
      if (loc.length > en.length) loc = loc.slice(0, en.length)

      for (let i = 0; i < en.length; i++) {
        if (loc[i] && loc[i] !== en[i]) continue
        const auto = tryPattern(en[i], locale)
        if (auto) {
          loc[i] = auto
          filled++
        } else if (!loc[i] || loc[i] === en[i]) {
          leftover++
          loc[i] = loc[i] || null
        }
      }
      fs.writeFileSync(locPath, JSON.stringify(loc, null, 2) + '\n')
    }
    console.log(`[${locale}] patternedFilled=${filled} stillNeedManual=${leftover}`)
  }
}

main()
