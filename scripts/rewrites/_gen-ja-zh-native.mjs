/**
 * Generates native JA posts 1-10, 12-20 from KO structure + embedded translations.
 * Post 11 uses existing good content from _fix-ja-11-20.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesKo1_5 } from './_fix-ko-1-5.mjs';
import { fixesKo } from './_fix-ko-6-20.mjs';
import { fixesJa as ja11src } from './_fix-ja-11-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const koAll = { ...fixesKo1_5, ...fixesKo };

// Heading maps KO -> JA
const hJa = {
  '가격 전에 할 일 정의': '価格の前に仕事を定義',
  '흔한 무료 이용의 대가': 'よくある無料の代償',
  '평생 구매 신화': '買い切りの神話',
  '구독 없는 워크플로 만들기': 'サブスクなしワークフローの構築',
  '구독이 합리적인 구매일 때': 'サブスクが合理的な買い物のとき',
  '사람들이 실제로 쓰는 하이브리드': '人々が実際に使うハイブリッド',
  '프라이버시와 광고라는 숨은 비용': 'プライバシーと広告という隠れコスト',
  '결론': 'まとめ',
  '무료에도 포함돼야 할 것': '無料に含まれるべきもの',
  '무료 등급이 지방 감량을 깨는 지점': '無料 tier が脂肪減を壊す所',
  '무료 코칭 vs 무료 기록': '無料コーチング vs 無料記録',
  '합리적 무료 후보 기준': '合理的な無料ショートリスト基準',
  '지불이 알뜰한 선택일 때': '支払いが得な選択のとき',
  '여전히 통하는 무료 우선 워크플로': 'まだ通じる無料優先ワークフロー',
  '두 번 내지 않는 소셜·책임': '二重払いなしのソーシャルと責任',
  '지속력이 이론적 정밀함을 이김': '継続が理論的精度に勝る',
  '단백 가시성과 적자 정직함': 'タンパク可視性と赤字の正直さ',
  '주말·테이크아웃 실패 모드': '週末・テイクアウトの失敗パターン',
  '클래식 일지 vs AI 캡처': 'クラシック日記 vs AI キャプチャ',
  'IGNITE AI가 감량 일에 맞는 지점': 'IGNITE AI が減量ワークに合う点',
  '가짜 점수 없이 후보 줄이기': '偽スコアなしで候補を絞る',
  '코칭 앱 vs 기록 앱': 'コーチングアプリ vs 記録アプリ',
  '선반에서 “정확”의 실제 의미': '棚で「正確」の実際の意味',
  'DB 품질 vs 사용자 제출 노이즈': 'DB 品質 vs ユーザー投稿ノイズ',
  '적자를 깨는 분량 함정': '赤字を壊す分量の罠',
  '바코드가 잘못된 도구일 때': 'バーコードが不適なとき',
  'IGNITE AI의 스캔+복구': 'IGNITE AI のスキャン＋復旧',
  '실용 장보기 테스트 (가짜 점수 없음)': '実用買い物テスト（偽スコアなし）',
  '사진 AI보다 스캐너 우선할 사람': '写真 AI よりスキャナ優先の人',
  '무료 단식 앱이 잘 해야 할 것': '無料断食アプリが担うべきこと',
  '타이머 전용: 강점과 공백': 'タイマー専用：強みと空白',
  '단식 기능 있는 트래커': '断食機能付きトラッカー',
  '교리 없는 schedule': '教義なきスケジュール',
  '전해질, 커피, “단식 깨나?”': '電解質、コーヒー、「断食は破る？」',
  '주의할 무료 한도': '注意すべき無料制限',
  'IGNITE AI의 하루 속 단식': 'IGNITE AI における一日の断食',
  '건전한 무료 사용자 설정': '健全な無料ユーザー設定',
  '자주 보는 주요 요금 모델': 'よく見る主要料金モデル',
  'Premium이 보통 자금 조달하는 것': 'Premium が通常資金調達するもの',
  '표시 가격 너머 숨은 비용': '表示価格を超える隠れコスト',
  '반나절에 가치 추정하기': '半日で価値を見積もる',
  '무료 유지, 지불, 떠날 때': '無料維持、有料、離れるとき',
  'IGNITE AI 요금 철학 (쉬운 말로)': 'IGNITE AI の料金哲学（平易に）',
  '체험판 실수 방지 요령': 'トライアル失敗を防ぐコツ',
  '비교 축 1: 캡처 모드': '比較軸1：キャプチャモード',
  '비교 축 2: 편집 품질': '比較軸2：編集品質',
  '비교 축 3: DB와 대체 수단': '比較軸3：DB と代替手段',
  '비교 축 4: 훈련, 계획, 소셜': '比較軸4：トレ、計画、ソーシャル',
  '비교 축 5: 요금의 정직함': '比較軸5：料金の正直さ',
  '유형별: 어떤 형태가 누구에게': 'タイプ別：どの形が誰に',
  '비교에서 IGNITE AI 위치': '比較における IGNITE AI の位置',
  '1주에 끝나는 병렬 테스트': '1週間で終わる並列テスト',
  '평균 섭취 숫자의 출처': '平均摂取数字の出所',
  '과소 보고가 “평균”을 왜곡하는 이유': '過小報告が「平均」を歪める理由',
  '평균은 목표가 아님': '平均は目標ではない',
  '본인 일지에서 평균 쓰기': '自分の日記で平均を使う',
  '성별·나이·활동 차이': '性別・年齢・活動の差',
  '액체 칼로리': '液体カロリー',
  '본인 평균을 IGNITE AI로': 'IGNITE AI で自分の平均を',
  '헤드라인 읽기 체크리스트': '見出しを読むチェックリスト',
  '이 유형에서 사람들이 보통 좋아했던 점': 'このタイプで人々が好きだった点',
  '가격 구조: 콘텐츠 대 도구': '価格構造：コンテンツ vs ツール',
  '저렴한 경로 A: 전문 트래커 + 단순한 운동': '低コスト経路A：専門トラッカー＋シンプル運動',
  '저렴한 경로 B: AI 기록 + 가벼운 계획': '低コスト経路B：AI 記録＋軽い計画',
  '운동: 전문 앱 vs 올인원': '運動：専門アプリ vs オールインワン',
  '남길 가치 있는 동기 기능': '残す価値のある動機機能',
  '가벼운 대안 조합으로 IGNITE AI': '軽量代替としての IGNITE AI',
  '해지·교체 체크리스트': '解約・切替チェックリスト',
  '실제로 겪는 다이어트 문제부터': '実際のダイエット課題から',
  '목표: 칼로리, 매크로, 더 단순한 방식': '目標：カロリー、マクロ、より単純な方式',
  '기록 속도가 곧 지속력': '記録速度が継続力',
  '계획 vs 순수 일지': '計画 vs 純日記',
  '톤, 커뮤니티, 정신적 부담': 'トーン、コミュニティ、精神的負担',
  '특수 식단과 유연성': '特殊食と柔軟性',
  '현대적 다이어트 일상용 IGNITE AI': '現代ダイエット日常の IGNITE AI',
  '어떤 다이어트 앱이든 시험 계획': 'どのダイエットアプリでも試す計画',
  '한 루프가 두 분리 기록보다 나은 이유': '一つのループが二つの分断記録に勝つ理由',
  '식사 쪽 요구사항': '食事側の要件',
  '운동 쪽 요구사항': '運動側の要件',
  '소비 칼로리 함정': '消費カロリーの罠',
  '통합 앱이 가장 필요한 사람': '統合アプリが最も必要な人',
  '트로피 없는 비교 기준': 'トロフィーなしの比較基準',
  '식단·훈련 일상용 IGNITE AI': '食事・トレ日常の IGNITE AI',
  '간단한 통합 주간 점검': 'シンプルな統合週次レビュー',
  '브랜드 전에 할 일 정의': 'ブランドの前に仕事を定義',
  'AI 트래커 필수 조건': 'AI トラッカーの必須条件',
  '사진 vs 음성 vs 바코드: 기본값 선택': '写真 vs 音声 vs バーコード：デフォルト選択',
  '코칭 레이어: 유용한가 잡음인가': 'コーチング層：有用かノイズか',
  '같은 선택에 훈련·체지표': '同じ選択にトレ・体組成',
  '스스로에게 거짓 없이 시험': '自分に嘘をつかず試す',
  '혼합 식사자에게 IGNITE AI가 강한 이유': '混合食者に IGNITE AI が強い理由',
  '쉬운 결정 나무': '平易な決定ツリー',
  '매크로 친화 레시피 도구 필수 기능': 'マクロ向けレシピツールの必須機能',
  '영양 표시가 있는 요리책 앱': '栄養表示付き料理本アプリ',
  '트래커 내장 레시피·저장 식사': 'トラッカー内蔵レシピ・保存食',
  'AI 레시피 도우미: 가드레일과 함께': 'AI レシピ助手：ガードレール付き',
  '장보기 목록·대량 조리 현실': '買い物リスト・まとめ調理の現実',
  '레스토랑 모방 vs 집 매크로': 'レストラン模倣 vs 家マクロ',
  'IGNITE AI: 재료에서 기록된 식사까지': 'IGNITE AI：材料から記録された食事へ',
  '주간 레시피→매크로 워크플로': '週次レシピ→マクロワークフロー',
  '앱 보조 감량을 실제로 예측하는 것': 'アプリ支援減量を実際に予測するもの',
  '직선적 적자용 칼로리 일지': '直線的赤字向けカロリー日記',
  '행동·코칭형 앱': '行動・コーチング型アプリ',
  '타이핑을 그만두는 사람을 위한 AI 기록': 'タイピングをやめた人向け AI 記録',
  '훈련, 걸음, 체중 외 피드백': 'トレ、歩数、体重以外のフィードバック',
  '감량 마케팅 경고 신호': '減量マーケの警告信号',
  'IGNITE AI가 더 건강한 감량을 돕는 법': 'IGNITE AI がより健全な減量を助ける方法',
  '재사용 가능한 선정 체크리스트': '再利用可能な選定チェックリスト',
  '무료 스캔이 제공해야 할 것': '無料スキャンが提供すべきこと',
  '전용 스캐너 vs 풀 트래커': '専用スキャナ vs フルトラッカー',
  'DB 커버리지가 UI보다 중요': 'DB カバレッジが UI より重要',
  '완벽한 삑 소리 뒤 분량 함정': '完璧なビープ音の後の分量罠',
  '예상 무료 한도': '想定される無料上限',
  '바코드보다 라벨이 나을 때': 'バーコードよりラベルが良いとき',
  '통로 좌절 없이 IGNITE AI': '通路で挫折しない IGNITE AI',
  '내일 할 장바구니 테스트': '明日の買い物かごテスト',
  'Android에서 중요한 기준': 'Android で重要な基準',
  'Health Connect와 분리된 걸음의 종말': 'Health Connect と分断歩数の終焉',
  'Android의 DB 강자': 'Android の DB 強者',
  'Android 하드웨어에서 AI 사진 트래커': 'Android ハードウェアでの AI 写真トラッカー',
  '위젯, 빠른 설정, 한 손 사용': 'ウィジェット、クイック設定、片手操作',
  'OEM 특성: Samsung, Pixel, 보급형': 'OEM 特性：Samsung、Pixel、エントリー',
  'Android에서 IGNITE AI: 매크로 + Health Connect': 'Android の IGNITE AI：マクロ＋Health Connect',
  '깨끗한 Android 설치 체크리스트': 'クリーンな Android セットアップ',
  '쓸 만한 무료 매크로 트래커 필수': '使える無料マクロトラッカーの必須',
  '무료 클래식 일지: 여전히 유효': '無料クラシック日記：依然有効',
  '무료 AI 약속: 세부 읽기': '無料 AI 約束：細部を読む',
  '예산 워크플로 매크로 목표': '予算ワークフローのマクロ目標',
  '무료가 부족해질 때': '無料が足りなくなるとき',
  '사용자 유형별 합리적 선택': 'ユーザータイプ別の合理的選択',
  'IGNITE AI: 무료 습관 표면, Premium AI 핵심': 'IGNITE AI：無料習慣面、Premium AI 核心',
  '14일 무료 등급 스트레스 테스트': '14日無料 tier ストレステスト',
  'MyFitnessPal: DB 중력과 생태계': 'MyFitnessPal：DB 引力とエコシステム',
  'Noom: 행동 커리큘럼 우선': 'Noom：行動カリキュラム優先',
  'Lose It!: 더 차분한 클래식 칼로리': 'Lose It!：より落ち着いたクラシックカロリー',
  '실제 승부를 가르는 나란한 기준': '実際の勝敗を分ける並列基準',
  '실무에서 누가 무엇을 고를지': '実務で誰が何を選ぶか',
  'AI 네이티브가 대화를 바꾸는 지점': 'AI ネイティブが会話を変える点',
  'IGNITE AI가 세 앱과 다른 점': 'IGNITE AI が三アプリと異なる点',
  '공정한 일주일 대결': '公平な一週間対決',
  '무광고가 포함해야 할 것': '無広告が含むべきこと',
  '광고 적은 무료 vs 진짜 유료의 차분함': '広告少ない無料 vs 真の有料の落ち着き',
  '업그레이드 시 더 조용한 클래식': 'アップグレードでより静かなクラシック',
  'AI 우선과 사진 기록의 진짜 비용': 'AI 優先と写真記録の真のコスト',
  '가짜 상 없는 비교 기준': '偽トロフィーなしの比較基準',
  '언제 지불할 가치가 있는지': 'いつ支払う価値があるか',
  'IGNITE AI의 차분한 무광고 기록': 'IGNITE AI の落ち着いた無広告記録',
  '빠른 결정 나무': 'クイック決定ツリー',
  '검증이 보통 의미하는 것': '検証が通常意味すること',
  '사용자 제출이 돕고 해치는 법': 'ユーザー投稿が助け害する方法',
  '레스토랑 데이터: 실험실이 아닌 관객석': 'レストランデータ：実験室ではなく客席',
  '집밥: 검증자는 당신': '家食：検証者はあなた',
  '더 깨끗한 일지 데이터 실무 규칙': 'よりクリーンな日記データの実務ルール',
  'AI 초안과 검증 앵커': 'AI 草稿と検証アンカー',
  'IGNITE AI로 더 깨끗한 기록': 'IGNITE AI でよりクリーンな記録',
  '중복·오타 정리 습관': '重複・誤字整理の習慣',
};

// Load body translations from JSON (slug -> sections array)
const bodiesPath = path.join(__dirname, '_ja-ko-bodies.json');
if (!fs.existsSync(bodiesPath)) {
  console.error('Missing', bodiesPath);
  process.exit(1);
}
const bodies = JSON.parse(fs.readFileSync(bodiesPath, 'utf8'));

function buildJa(slug, title, desc) {
  if (slug === 'best-app-diet-and-exercise-2026') return ja11src[slug];
  const ko = koAll[slug];
  const b = bodies[slug];
  if (!b) throw new Error('missing ja bodies ' + slug);
  return {
    slug,
    title,
    date: ko.date,
    description: desc,
    sections: b.map((sec, i) => ({
      heading: sec.heading ?? (ko.sections[i].heading ? hJa[ko.sections[i].heading] || ko.sections[i].heading.replace('결론', 'まとめ') : undefined),
      body: sec.body,
    })),
  };
}

const jaTitles = JSON.parse(fs.readFileSync(path.join(__dirname, '_ja-titles.json'), 'utf8'));

const slugs1_10 = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch01-slugs.json'), 'utf8')).slice(0, 10);
const slugs11_20 = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch01-slugs.json'), 'utf8')).slice(10);

const jaPosts1_10 = Object.fromEntries(slugs1_10.map((s) => [s, buildJa(s, jaTitles[s][0], jaTitles[s][1])]));
const jaPosts11_20 = Object.fromEntries(slugs11_20.map((s) => [s, buildJa(s, jaTitles[s][0], jaTitles[s][1])]));

function emit(obj, name) {
  const entries = Object.values(obj);
  const lines = [`export const ${name} = {`];
  for (const post of entries) {
    lines.push(`  '${post.slug}': {`);
    lines.push(`    slug: '${post.slug}',`);
    lines.push(`    title: '${post.title.replace(/'/g, "\\'")}',`);
    lines.push(`    date: '${post.date}',`);
    lines.push(`    description:\n      '${post.description.replace(/'/g, "\\'")}',`);
    lines.push('    sections: [');
    for (const sec of post.sections) {
      lines.push('      {');
      if (sec.heading) lines.push(`        heading: '${sec.heading.replace(/'/g, "\\'")}',`);
      lines.push('        body: [');
      for (const p of sec.body) lines.push(`          '${p.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',`);
      lines.push('        ],');
      lines.push('      },');
    }
    lines.push('    ],');
    lines.push('  },');
  }
  lines.push('};');
  return lines.join('\n');
}

fs.writeFileSync(path.join(__dirname, '_fix-ja-1-10-native.mjs'), '/** Native JA 1-10 */\n' + emit(jaPosts1_10, 'jaPosts1_10') + '\n');
fs.writeFileSync(path.join(__dirname, '_fix-ja-11-20-native.mjs'), '/** Native JA 11-20 */\n' + emit(jaPosts11_20, 'jaPosts11_20') + '\n');
console.log('Generated JA modules', Object.keys(jaPosts1_10).length, Object.keys(jaPosts11_20).length);
