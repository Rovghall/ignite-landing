/**
 * Build content/{ja,ko,zh}/blog-part-XX.json + blog.json from English parts.
 * - Templated posts: shared section translations + per-slug title/description/intro
 * - Unique posts: full post JSON under scripts/cjk-unique/<locale>/<slug>.json
 *
 * Usage: node scripts/build-cjk-blog-parts.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const PARTS = ['01', '02', '03', '04', '05', '06', '07']
const LOCALES = ['ja', 'ko', 'zh']
const MARKER = 'Measurement and feedback loop'

const SHARED = {
  ja: {
    measurementHeading: '測定とフィードバックループ',
    measurementBody: [
      '役に立つスコアボードは通常、2〜4週間のトレンドです。平均体重、ウエストや写真、トレーニング成績、平均摂取量。',
      'ナトリウム、炭水化物、ハードな下半身トレ、または月経に伴う水分による1日の体重急変はノイズです。点ではなく傾きで判断しましょう。',
    ],
    proteinHeading: 'タンパク質、トレーニング、回復',
    proteinBody: [
      '体重を変えながら筋トレするなら、漸進的過負荷と忙しい日でも達成できるタンパク目標を維持しましょう。減量中の多くのトレーニー向けの実践的な根拠レンジは約1.6〜2.2 g/kgです。',
      '睡眠と歩数は静かだが強力なレバーです。完璧なマクロ計画も、NEATが崩れ夜間スナックが未記録なら失敗します。',
    ],
    checklistHeading: '7日間の実行チェックリスト',
    checklistBody: [
      '1) 毎回の食事を記録し、乱れた皿は写真で。2) 油とソースは意図的に修正。3) 定番を1つ Saved に保存。4) 少なくとも2回ワークアウトを記録。5) 朝体重を測って平均。6) 歩数をだいたい一定に。7) 翌週は必要ならレバーを1つだけ変える。',
      'このチェックリストがアドバイスをデータに変えます。なければ記事は娯楽のままです。',
    ],
    igniteHeading: 'IGNITE AI の位置づけ',
    igniteBody: [
      '誠実なロガーなら何でも使えます。IGNITE AI は計画が崩れやすい摩擦点向けです。ミックス食事、定番の繰り返し、トレーニング文脈を一か所に。',
      '新しい皿は snap → edit → confirm。繰り返しは Saved。食事の横にワークアウトがあるので、補給を意図的に決められます。',
    ],
    deeperHeading: 'より深い文脈とエッジケース',
    deeperBody: [
      'エッジケースには初心者と上級者、高ストレスの仕事週間、旅行、医学的制約が含まれます。初心者は維持カロリー付近でも伸びることが多く、上級者はより明確な余剰／不足フェーズが必要になることが多いです。',
      '臨床症状、薬の影響、摂食障害の既往がある場合は専門家の支援を受けてください。アプリは測定を改善できますが、ケアの代わりにはなりません。',
      '証拠が分かれるときは、12週間続けられる介入を優先しましょう。自由生活の人間では、継続そのものが生理の一部です。',
    ],
    bottomHeading: '結論',
    executeLine: '週平均と誠実な記録で実行しましょう。',
    igniteBottom:
      '忙しい日でも記録を誠実に保つ必要があるとき、IGNITE AI は写真食事スナップ、マクロ編集、Saved の繰り返し、ワークアウトを一つのループにまとめます。Snap it. Log it. Crush it.',
    testEdit: 'デモのスクリーンショットではなく、自分の食事で編集速度を試しましょう。',
  },
  ko: {
    measurementHeading: '측정과 피드백 루프',
    measurementBody: [
      '유용한 점수판은 보통 2~4주 추세입니다. 평균 체중, 허리 또는 사진, 훈련 성과, 평균 섭취량.',
      '나트륨, 탄수화물, 하드한 하체 훈련, 또는 월경 수분으로 인한 하루 체중 급등은 노이즈입니다. 점이 아니라 기울기로 판단하세요.',
    ],
    proteinHeading: '단백질, 훈련, 회복',
    proteinBody: [
      '체중을 바꾸며 리프팅한다면 점진적 과부하와 바쁜 날에도 맞출 수 있는 단백질 목표를 유지하세요. 감량 중 많은 리프터에게 실용적인 근거 범위는 약 1.6~2.2 g/kg입니다.',
      '수면과 걸음 수는 조용하지만 강력한 레버입니다. 완벽한 매크로 계획도 NEAT가 무너지고 야식 기록이 빠지면 실패합니다.',
    ],
    checklistHeading: '7일 실행 체크리스트',
    checklistBody: [
      '1) 모든 식사를 기록하고 복잡한 접시는 사진으로. 2) 오일과 소스는 의도적으로 수정. 3) 주식 하나를 Saved에 저장. 4) 최소 두 번 운동 기록. 5) 아침 체중을 재고 평균. 6) 걸음 수를 대략 일정하게. 7) 다음 주는 필요하면 레버를 하나만 변경.',
      '이 체크리스트가 조언을 데이터로 바꿉니다. 없으면 글은 오락으로 남습니다.',
    ],
    igniteHeading: 'IGNITE AI가 맞는 지점',
    igniteBody: [
      '정직한 로거라면 무엇이든 쓸 수 있습니다. IGNITE AI는 계획이 깨지기 쉬운 마찰 지점용입니다. 혼합 식사, 반복 주식, 훈련 맥락을 한곳에.',
      '새 접시는 snap → edit → confirm. 반복은 Saved. 음식 옆에 운동이 있어 연료 공급을 의도적으로 결정할 수 있습니다.',
    ],
    deeperHeading: '더 깊은 맥락과 엣지 케이스',
    deeperBody: [
      '엣지 케이스에는 초보 vs 고급 리프터, 고스트레스 업무 주간, 여행, 의학적 제약이 포함됩니다. 초보는 유지 칼로리 근처에서도 성장하는 경우가 많고, 고급 리프터는 더 명확한 잉여/적자 단계가 필요한 경우가 많습니다.',
      '임상 증상, 약물 영향, 섭식장애 병력이 있다면 전문가 지원을 받으세요. 앱은 측정을 개선할 수 있지만 치료를 대체하지 않습니다.',
      '근거가 엇갈리면 12주 반복할 수 있는 개입을 우선하세요. 자유 생활 인간에게 순응은 생리의 일부입니다.',
    ],
    bottomHeading: '핵심 정리',
    executeLine: '주간 평균과 정직한 기록으로 실행하세요.',
    igniteBottom:
      '바쁜 날에도 기록이 정직해야 할 때, IGNITE AI는 사진 식사 스냅, 매크로 수정, Saved 반복, 운동을 하나의 루프로 돕습니다. Snap it. Log it. Crush it.',
    testEdit: '데모 스크린샷이 아니라 실제 식사에서 편집 속도를 테스트하세요.',
  },
  zh: {
    measurementHeading: '测量与反馈循环',
    measurementBody: [
      '有用的记分板通常是两到四周的趋势：平均体重、腰围或照片、训练表现，以及平均摄入量。',
      '钠、碳水化合物、高强度下肢训练或月经体液引起的单日体重波动是噪音。根据斜率行动，而不是单点。',
    ],
    proteinHeading: '蛋白质、训练与恢复',
    proteinBody: [
      '如果在改变体重的同时举重，请保持渐进超负荷，以及忙碌日也能达成的蛋白质目标。对许多处于赤字中的训练者，实用的循证区间约为 1.6 到 2.2 g/kg。',
      '睡眠和步数是安静但有力的杠杆。当 NEAT 崩溃且深夜零食未记录时，完美的宏量营养素计划也会失败。',
    ],
    checklistHeading: '7 天执行清单',
    checklistBody: [
      '1）记录每一餐，混乱餐盘拍照。2）有意修正油脂和酱汁。3）把一道主食保存到 Saved。4）至少记录两次训练。5）多数早晨称重并取平均。6）步数大致稳定。7）如需调整，下周只改一个杠杆。',
      '这份清单把建议变成数据。没有它，文章只是娱乐。',
    ],
    igniteHeading: 'IGNITE AI 适合什么',
    igniteBody: [
      '你可以用任何诚实的记录工具。IGNITE AI 针对通常会让计划崩掉的摩擦点：混合餐、重复主食，以及同一处的训练上下文。',
      '新餐盘：snap → edit → confirm。重复餐用 Saved。训练记录在食物旁边，让你有意识地决定补给。',
    ],
    deeperHeading: '更深背景与边界情况',
    deeperBody: [
      '边界情况包括初学者与进阶训练者、高压工作周、旅行和医疗限制。初学者往往能在接近维持热量时进步；进阶者通常需要更清晰的盈余或赤字阶段。',
      '如有临床症状、药物影响或饮食失调史，请寻求专业支持。应用可以改善测量，但不能替代照护。',
      '当证据不一 tip 时，优先选择你能坚持 12 周的干预。对自由生活的人而言，依从性本身就是生理的一部分。',
    ],
    bottomHeading: '结论',
    executeLine: '用周平均值和诚实记录去执行。',
    igniteBottom:
      '当忙碌日也必须保持诚实记录时，IGNITE AI 用拍照记餐、宏量编辑、Saved 重复餐和训练记录把流程收成一个循环。Snap it. Log it. Crush it.',
    testEdit: '在自己的餐食上测试编辑速度，而不是演示截图。',
  },
}

// Fix typo in zh deeperBody
SHARED.zh.deeperBody[2] =
  '当证据不一致时，优先选择你能坚持 12 周的干预。对自由生活的人而言，依从性本身就是生理的一部分。'

function isTemplated(post) {
  return (post.sections || []).some((s) => s.heading === MARKER)
}

function loadFields(locale) {
  const p = path.join(ROOT, 'scripts', 'cjk-data', `${locale}-fields.json`)
  if (!fs.existsSync(p)) return {}
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function buildTemplated(enPost, locale, fields) {
  const S = SHARED[locale]
  const f = fields[enPost.slug]
  if (!f) return null

  const sections = [{ body: f.intro }]

  // Walk English sections and map known template headings; keep order
  for (const sec of enPost.sections.slice(1)) {
    if (sec.heading === MARKER) {
      sections.push({ heading: S.measurementHeading, body: S.measurementBody })
    } else if (sec.heading === 'Protein, training, and recovery') {
      sections.push({ heading: S.proteinHeading, body: S.proteinBody })
    } else if (sec.heading === 'A 7-day execution checklist') {
      sections.push({ heading: S.checklistHeading, body: S.checklistBody })
    } else if (sec.heading === 'Where IGNITE AI fits') {
      sections.push({ heading: S.igniteHeading, body: S.igniteBody })
    } else if (sec.heading === 'Deeper context and edge cases') {
      sections.push({ heading: S.deeperHeading, body: S.deeperBody })
    } else if (sec.heading === 'Bottom line') {
      const body = (sec.body || []).map((line) => {
        if (line === 'Execute with weekly averages and honest logging.') return S.executeLine
        if (line.startsWith('When logging has to stay honest')) return S.igniteBottom
        if (line === 'Test edit speed on your meals, not on demo screenshots.') return S.testEdit
        // fallback: keep if fields provide bottomLines
        return line
      })
      if (f.bottomBody) {
        sections.push({ heading: S.bottomHeading, body: f.bottomBody })
      } else {
        sections.push({ heading: S.bottomHeading, body })
      }
    } else {
      // unknown section — require field override
      if (f.extraSections && f.extraSections[sec.heading]) {
        sections.push(f.extraSections[sec.heading])
      } else {
        sections.push(sec) // leave English as last resort
      }
    }
  }

  return {
    slug: enPost.slug,
    title: f.title,
    date: enPost.date,
    description: f.description,
    sections,
  }
}

function loadUnique(locale, slug) {
  const p = path.join(ROOT, 'scripts', 'cjk-unique', locale, `${slug}.json`)
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function main() {
  const counts = {}
  for (const locale of LOCALES) {
    const fields = loadFields(locale)
    const dir = path.join(ROOT, 'content', locale)
    fs.mkdirSync(dir, { recursive: true })
    let all = []
    let missingUnique = []
    let missingFields = []

    for (const part of PARTS) {
      const en = JSON.parse(
        fs.readFileSync(path.join(ROOT, 'content', 'en', `blog-part-${part}.json`), 'utf8'),
      )
      const out = []
      for (const post of en) {
        if (isTemplated(post)) {
          const built = buildTemplated(post, locale, fields)
          if (!built) {
            missingFields.push(post.slug)
            out.push(post)
          } else {
            out.push(built)
          }
        } else {
          const uniq = loadUnique(locale, post.slug)
          if (!uniq) {
            missingUnique.push(post.slug)
            out.push(post) // English placeholder until unique file exists
          } else {
            out.push({ ...uniq, slug: post.slug, date: post.date })
          }
        }
      }
      fs.writeFileSync(path.join(dir, `blog-part-${part}.json`), JSON.stringify(out, null, 2) + '\n')
      all = all.concat(out)
      console.log(`[${locale}] part-${part}: ${out.length}`)
    }

    fs.writeFileSync(path.join(dir, 'blog.json'), JSON.stringify(all, null, 2) + '\n')
    const translated = all.filter((p, i) => {
      const enAll = PARTS.flatMap((part) =>
        JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'en', `blog-part-${part}.json`), 'utf8')),
      )
      return p.title !== enAll[i].title
    }).length

    counts[locale] = {
      posts: all.length,
      translatedTitles: translated,
      missingFields: missingFields.length,
      missingUnique: missingUnique.length,
    }
    if (missingFields.length) console.warn(`[${locale}] missing fields: ${missingFields.length}`)
    if (missingUnique.length) console.warn(`[${locale}] missing unique: ${missingUnique.length}`)
  }
  console.log('COUNTS', JSON.stringify(counts, null, 2))
}

main()
