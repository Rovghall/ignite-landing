/**
 * Apply remaining manual translations for patterned-fill leftovers.
 * Usage: node scripts/apply-cjk-still-map.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const DATA = path.join(process.cwd(), 'scripts', 'cjk-data')

/** @type {Record<string, {ja:string, ko:string, zh:string}>} */
const MAP = {
  'Systems to hit macros: protein first, defaults, shakes, Saved meals, pre-dinner checks.': {
    ja: 'マクロ達成のシステム：タンパク優先、デフォルト、シェイク、Saved 食事、夕食前チェック。',
    ko: '매크로를 맞추는 시스템: 단백질 우선, 기본값, 쉐이크, Saved 식사, 저녁 전 점검.',
    zh: '打中宏量的系统：蛋白质优先、默认餐、奶昔、Saved 餐、晚饭前核对。',
  },
  'Consistency beats exact gram chasing at every lunch.': {
    ja: '毎回のランチでグラムを追うより、一貫性が勝ります。',
    ko: '매번 점심에서 그램을 쫓는 것보다 일관성이 이깁니다.',
    zh: '一致性胜过每顿午餐都精确追克数。',
  },
  'Build defaults and decide dinner with remaining macros in view.': {
    ja: 'デフォルトを作り、残マクロを見ながら夕食を決めましょう。',
    ko: '기본값을 만들고 남은 매크로를 보며 저녁을 결정하세요.',
    zh: '建立默认方案，看着剩余宏量决定晚餐。',
  },
  'Weight Watchers vs Keto for Fat Loss': {
    ja: '減量のための Weight Watchers vs ケト',
    ko: '감량을 위한 Weight Watchers vs 케토',
    zh: '减脂：Weight Watchers vs 生酮',
  },
  'WeightWatchers vs keto: mechanisms, adherence, lifting needs, and who each fits.': {
    ja: 'WeightWatchers vs ケト：仕組み、継続、リフティングの必要性、誰に合うか。',
    ko: 'WeightWatchers vs 케토: 메커니즘, 순응, 리프팅 필요, 누구에게 맞는지.',
    zh: 'WeightWatchers vs 生酮：机制、依从性、举重需求，以及各自适合谁。',
  },
  'WW uses points and community. Keto uses carb restriction.': {
    ja: 'WW はポイントとコミュニティを使います。ケトは炭水制限を使います。',
    ko: 'WW는 포인트와 커뮤니티를 씁니다. 케토는 탄수 제한을 씁니다.',
    zh: 'WW 用积分和社群。生酮用碳水限制。',
  },
  'Both can reduce calories through different rules.': {
    ja: 'どちらも異なるルールでカロリーを減らせます。',
    ko: '둘 다 다른 규칙으로 칼로리를 줄일 수 있습니다.',
    zh: '两者都可通过不同规则降低热量。',
  },
  'Weight Watchers vs Macros Tracking': {
    ja: 'Weight Watchers vs マクロ追跡',
    ko: 'Weight Watchers vs 매크로 트래킹',
    zh: 'Weight Watchers vs 宏量追踪',
  },
  'Points simplify decisions. Macros give training precision.': {
    ja: 'ポイントは判断を簡略化します。マクロはトレーニング精度を与えます。',
    ko: '포인트는 결정을 단순화합니다. 매크로는 훈련 정밀도를 줍니다.',
    zh: '积分简化决策。宏量提供训练精度。',
  },
  'If protein and performance matter, macros usually fit better.': {
    ja: 'タンパクとパフォーマンスが重要なら、マクロのほうが通常合います。',
    ko: '단백질과 수행이 중요하면 매크로가 보통 더 맞습니다.',
    zh: '若蛋白质与表现重要，宏量通常更合适。',
  },
  'Weight Watchers vs Calorie Counting': {
    ja: 'Weight Watchers vs カロリー計算',
    ko: 'Weight Watchers vs 칼로리 계산',
    zh: 'Weight Watchers vs 热量计算',
  },
  'Both create intake structure.': {
    ja: 'どちらも摂取の構造を作ります。',
    ko: '둘 다 섭취 구조를 만듭니다.',
    zh: '两者都创造摄入结构。',
  },
  'Calories are transparent; points add preference rules.': {
    ja: 'カロリーは透明です。ポイントは嗜好ルールを加えます。',
    ko: '칼로리는 투명합니다. 포인트는 선호 규칙을 더합니다.',
    zh: '热量透明；积分加入偏好规则。',
  },
  'MyPlate vs MyFitnessPal: Which Tracker Fits You?': {
    ja: 'MyPlate vs MyFitnessPal：どちらが合う？',
    ko: 'MyPlate vs MyFitnessPal: 어떤 트래커가 맞나요?',
    zh: 'MyPlate vs MyFitnessPal：哪个追踪器适合你？',
  },
  'Self-reported diaries underreport when logging is annoying. That research-shaped reality should sit above feature checklists.': {
    ja: '記録が面倒だと自己申告日記は過少報告になります。その研究に基づく現実は、機能チェックリストより上に置くべきです。',
    ko: '기록이 귀찮으면 자기보고 일지는 과소보고됩니다. 그 연구형 현실은 기능 체크리스트 위에 있어야 합니다.',
    zh: '记录很烦时，自我报告日记会漏报。这一研究现实应压过功能清单。',
  },
  'Nutrisystem vs WeightWatchers: Which Is Better for Fat Loss?': {
    ja: 'Nutrisystem vs WeightWatchers：減量にどちらが良い？',
    ko: 'Nutrisystem vs WeightWatchers: 감량에 뭐가 더 좋나요?',
    zh: 'Nutrisystem vs WeightWatchers：哪个更利于减脂？',
  },
  'MacroFactor vs RP Diet App: Practical Comparison': {
    ja: 'MacroFactor vs RP Diet App：実践比較',
    ko: 'MacroFactor vs RP Diet App: 실용 비교',
    zh: 'MacroFactor vs RP Diet App：实用对比',
  },
  'Cronometer vs Carb Manager: Which Should You Use?': {
    ja: 'Cronometer vs Carb Manager：どちらを使うべき？',
    ko: 'Cronometer vs Carb Manager: 무엇을 써야 하나요?',
    zh: 'Cronometer vs Carb Manager：该用哪个？',
  },
  'Cronometer vs Lose It: Detailed Comparison': {
    ja: 'Cronometer vs Lose It：詳細比較',
    ko: 'Cronometer vs Lose It: 상세 비교',
    zh: 'Cronometer vs Lose It：详细对比',
  },
  'Carb Manager vs MyFitnessPal for Keto Tracking': {
    ja: 'ケト追跡のための Carb Manager vs MyFitnessPal',
    ko: '케토 트래킹을 위한 Carb Manager vs MyFitnessPal',
    zh: '生酮追踪：Carb Manager vs MyFitnessPal',
  },
  'Noom vs WeightWatchers Review': {
    ja: 'Noom vs WeightWatchers レビュー',
    ko: 'Noom vs WeightWatchers 리뷰',
    zh: 'Noom vs WeightWatchers 评测',
  },
  'Noom vs MyFitnessPal Comparison': {
    ja: 'Noom vs MyFitnessPal 比較',
    ko: 'Noom vs MyFitnessPal 비교',
    zh: 'Noom vs MyFitnessPal 对比',
  },
  'MyNetDiary vs MyFitnessPal Comparison': {
    ja: 'MyNetDiary vs MyFitnessPal 比較',
    ko: 'MyNetDiary vs MyFitnessPal 비교',
    zh: 'MyNetDiary vs MyFitnessPal 对比',
  },
  'Lose It vs MyFitnessPal Review': {
    ja: 'Lose It vs MyFitnessPal レビュー',
    ko: 'Lose It vs MyFitnessPal 리뷰',
    zh: 'Lose It vs MyFitnessPal 评测',
  },
  'MacroFactor vs MyFitnessPal for TDEE Tracking': {
    ja: 'TDEE 追跡のための MacroFactor vs MyFitnessPal',
    ko: 'TDEE 트래킹을 위한 MacroFactor vs MyFitnessPal',
    zh: 'TDEE 追踪：MacroFactor vs MyFitnessPal',
  },
  'FatSecret vs MyFitnessPal Review': {
    ja: 'FatSecret vs MyFitnessPal レビュー',
    ko: 'FatSecret vs MyFitnessPal 리뷰',
    zh: 'FatSecret vs MyFitnessPal 评测',
  },
  'Lifesum vs MyFitnessPal Guide': {
    ja: 'Lifesum vs MyFitnessPal ガイド',
    ko: 'Lifesum vs MyFitnessPal 가이드',
    zh: 'Lifesum vs MyFitnessPal 指南',
  },
  'MacroFactor vs Cronometer Review': {
    ja: 'MacroFactor vs Cronometer レビュー',
    ko: 'MacroFactor vs Cronometer 리뷰',
    zh: 'MacroFactor vs Cronometer 评测',
  },
  'MyFitnessPal vs Cronometer Guide': {
    ja: 'MyFitnessPal vs Cronometer ガイド',
    ko: 'MyFitnessPal vs Cronometer 가이드',
    zh: 'MyFitnessPal vs Cronometer 指南',
  },
  'Is the Cronometer App Worth It?': {
    ja: 'Cronometer アプリは買う価値がある？',
    ko: 'Cronometer 앱은 가치가 있나요?',
    zh: 'Cronometer 应用值得吗？',
  },
  'Cronometer shines for vitamins, minerals, and careful food data.': {
    ja: 'Cronometer はビタミン、ミネラル、丁寧な食品データで輝きます。',
    ko: 'Cronometer는 비타민, 미네랄, 꼼꼼한 식품 데이터에서 빛납니다.',
    zh: 'Cronometer 在维生素、矿物质与细致食物数据上表现出色。',
  },
  'Worth it for precision-focused users.': {
    ja: '精度重視のユーザーには価値があります。',
    ko: '정밀도 중심 사용자에게 가치가 있습니다.',
    zh: '对注重精度的用户值得。',
  },
  '25 Best Apps to Help Gain Weight Effectively': {
    ja: '効果的に増量を助けるベストアプリ25',
    ko: '효과적으로 체중 증가를 돕는 베스트 앱 25',
    zh: '有效增重的 25 款最佳应用',
  },
  '25 Best Apps for Diabetes and Weight Loss Support': {
    ja: '糖尿病と減量サポートのベストアプリ25',
    ko: '당뇨와 감량 지원 베스트 앱 25',
    zh: '糖尿病与减重支持的 25 款最佳应用',
  },
  '20 Best Fitness and Nutrition Apps for Results': {
    ja: '結果のためのフィットネス＆栄養ベストアプリ20',
    ko: '결과를 위한 피트니스·영양 베스트 앱 20',
    zh: '出结果的 20 款最佳健身与营养应用',
  },
  '15 Best Free Macro Tracking Apps': {
    ja: '無料マクロ追跡ベストアプリ15',
    ko: '무료 매크로 트래킹 베스트 앱 15',
    zh: '15 款最佳免费宏量追踪应用',
  },
  '21 Best Weight Watchers Alternatives': {
    ja: 'Weight Watchers の代替ベスト21',
    ko: 'Weight Watchers 대안 베스트 21',
    zh: '21 个最佳 Weight Watchers 替代',
  },
  '19 Best Noom Alternatives': {
    ja: 'Noom の代替ベスト19',
    ko: 'Noom 대안 베스트 19',
    zh: '19 个最佳 Noom 替代',
  },
  '14 Best Free Calorie and Macro Trackers': {
    ja: '無料カロリー＆マクロトラッカーベスト14',
    ko: '무료 칼로리·매크로 트래커 베스트 14',
    zh: '14 款最佳免费热量与宏量追踪器',
  },
  '19 Apps Like Weight Watchers': {
    ja: 'Weight Watchers のようなアプリ19',
    ko: 'Weight Watchers 같은 앱 19',
    zh: '19 款类似 Weight Watchers 的应用',
  },
  '28 Fitness Apps Like MyFitnessPal': {
    ja: 'MyFitnessPal のようなフィットネスアプリ28',
    ko: 'MyFitnessPal 같은 피트니스 앱 28',
    zh: '28 款类似 MyFitnessPal 的健身应用',
  },
  '21 Best Food Journal Apps': {
    ja: 'フードジャーナルベストアプリ21',
    ko: '푸드 저널 베스트 앱 21',
    zh: '21 款最佳食物日记应用',
  },
  '23 Best Carb Counting Apps': {
    ja: '炭水計算ベストアプリ23',
    ko: '탄수 계산 베스트 앱 23',
    zh: '23 款最佳碳水计算应用',
  },
  '13 Weight Gain Apps for Custom Plans': {
    ja: 'カスタム計画向け増量アプリ13',
    ko: '맞춤 계획을 위한 체중 증가 앱 13',
    zh: '13 款定制计划增重应用',
  },
  '14 Best Protein Tracker Apps': {
    ja: 'プロテイン追跡ベストアプリ14',
    ko: '단백질 트래커 베스트 앱 14',
    zh: '14 款最佳蛋白质追踪应用',
  },
  '16 Best Apps to Track Macros': {
    ja: 'マクロ追跡ベストアプリ16',
    ko: '매크로 트래킹 베스트 앱 16',
    zh: '16 款最佳宏量追踪应用',
  },
  'How to Use Saved Meals in IGNITE AI for Faster Logging': {
    ja: 'IGNITE AI の Saved 食事で記録を速くする方法',
    ko: 'IGNITE AI의 Saved 식사로 더 빠르게 기록하는 법',
    zh: '如何用 IGNITE AI 的 Saved 餐更快记录',
  },
  'How to use Saved meals in IGNITE AI: calibrate once, re-log forever, when to re-snap.': {
    ja: 'IGNITE AI の Saved 食事の使い方：一度校正、ずっと再記録、いつ再スナップするか。',
    ko: 'IGNITE AI Saved 식사 사용법: 한 번 보정, 계속 재기록, 언제 다시 스냅할지.',
    zh: '如何在 IGNITE AI 使用 Saved 餐：校准一次、永久复记、何时重新拍照。',
  },
  'Saved meals turn calibrated plates into one-tap logs.': {
    ja: 'Saved 食事は校正済みの皿をワンタップ記録に変えます。',
    ko: 'Saved 식사는 보정된 접시를 원탭 기록으로 바꿉니다.',
    zh: 'Saved 餐把已校准的餐盘变成一键记录。',
  },
  'Snap, edit oils and protein, save, then reuse on repeat days.': {
    ja: 'スナップし、油とタンパクを編集し、保存し、繰り返しの日に再利用。',
    ko: '스냅하고, 오일과 단백질을 수정하고, 저장한 뒤 반복되는 날에 재사용.',
    zh: '拍照、编辑油脂与蛋白质、保存，然后在重复日复用。',
  },
  'How to Build a Logging Streak Without Burning Out': {
    ja: '燃え尽きずに記録ストリークを作る方法',
    ko: '번아웃 없이 기록 스트릭을 만드는 법',
    zh: '如何在不燃尽的情况下建立记录连续天数',
  },
  'Streaks help until missing one day destroys identity.': {
    ja: 'ストリークは、1日欠かしただけでアイデンティティが壊れるまで役立ちます。',
    ko: '스트릭은 하루를 놓쳐 정체성이 무너지기 전까지 도움이 됩니다.',
    zh: '连续天数有帮助，直到漏一天就摧毁身份认同。',
  },
  'Use minimum viable logs on hard days.': {
    ja: 'きつい日は最小限の実行可能なログを使いましょう。',
    ko: '힘든 날에는 최소 실행 가능 로그를 쓰세요.',
    zh: '困难日使用最小可行记录。',
  },
  'Protein-First Plate Method for Busy Lifters': {
    ja: '忙しいリフターのためのタンパク優先プレート法',
    ko: '바쁜 리프터를 위한 단백질 우선 접시법',
    zh: '忙碌举重者的蛋白质优先餐盘法',
  },
  'Protein first, then carbs for training, fats for calories.': {
    ja: 'まずタンパク、次にトレーニング用炭水、カロリー用脂質。',
    ko: '먼저 단백질, 그다음 훈련용 탄수, 칼로리용 지방.',
    zh: '先蛋白质，再训练用碳水，脂肪补热量。',
  },
  'Photo-log and adjust.': {
    ja: '写真で記録して調整。',
    ko: '사진으로 기록하고 조정하세요.',
    zh: '拍照记录并调整。',
  },
  'Weekend Calorie Damage Control Without Quitting Tracking': {
    ja: '追跡をやめずに週末カロリーのダメージコントロール',
    ko: '추적을 포기하지 않고 주말 칼로리 피해 통제',
    zh: '不放弃追踪的周末热量损伤控制',
  },
  'Weekends break averages when two drinks and restaurants go unlogged.': {
    ja: '飲みと外食が未記録だと週末は平均を壊します。',
    ko: '술과 외식이 미기록이면 주말이 평균을 깨뜨립니다.',
    zh: '酒水和餐厅未记录时，周末会毁掉平均值。',
  },
  'Weekends break averages when drinks and restaurants go unlogged.': {
    ja: '飲みと外食が未記録だと週末は平均を壊します。',
    ko: '술과 외식이 미기록이면 주말이 평균을 깨뜨립니다.',
    zh: '酒水和餐厅未记录时，周末会毁掉平均值。',
  },
  'Budget social meals, snap dinners, bias fats up, return Monday without revenge under-eating.': {
    ja: '社交食事を予算化し、夕食をスナップし、脂質を多めに、月曜は復讐の過小摂取なしで戻る。',
    ko: '사교 식사를 예산하고, 저녁을 스냅하고, 지방을 넉넉히, 월요일은 복수성 소식 없이 복귀.',
    zh: '为社交餐做预算，晚餐拍照，油脂偏高估计，周一回来不要报复性少吃。',
  },
  'Meal Prep Macros: Batch Cook Without Guessing': {
    ja: 'ミールプレップマクロ：推測なしでバッチ調理',
    ko: '밀프랩 매크로: 추측 없이 배치 요리',
    zh: '备餐宏量：不靠猜的批量烹饪',
  },
  'Weigh oils and starches for the whole batch.': {
    ja: 'バッチ全体の油とデンプンを量りましょう。',
    ko: '배치 전체의 오일과 전분을 재세요.',
    zh: '称整批的油脂和淀粉。',
  },
  'Divide by real containers, save, reheat without re-math.': {
    ja: '実容器で割り、保存し、再計算なしで再加熱。',
    ko: '실제 용기로 나누고, 저장하고, 재계산 없이 데우세요.',
    zh: '按真实容器分割、保存，复热无需重算。',
  },
  'High-Protein Snacks That Actually Fit Your Macros': {
    ja: '本当にマクロに収まる高タンパクスナック',
    ko: '정말 매크로에 맞는 고단백 스낵',
    zh: '真正装进宏量的高蛋白零食',
  },
  'Yogurt, jerky, cottage cheese, shakes, edamame, and similar options.': {
    ja: 'ヨーグルト、ジャーキー、カッテージチーズ、シェイク、枝豆など。',
    ko: '요거트, 육포, 코티지 치즈, 쉐이크, 에다마메 등.',
    zh: '酸奶、肉干、茅屋芝士、奶昔、毛豆等。',
  },
  'Log extras; saves beat vending surprises.': {
    ja: '余分は記録。Saved は自販機のサプライズに勝ちます。',
    ko: '추가는 기록하세요. Saved가 자판기 깜짝을 이깁니다.',
    zh: '额外的要记录；Saved 胜过自动贩卖机惊喜。',
  },
  'How Sleep Loss Raises Hunger and Scale Weight': {
    ja: '睡眠不足が空腹と体重計をどう上げるか',
    ko: '수면 부족이 배고픔과 체중계를 어떻게 올리는지',
    zh: '睡眠不足如何抬高饥饿与体重秤读数',
  },
  'Sleep loss can alter appetite signaling and raise stress-related water weight.': {
    ja: '睡眠不足は食欲シグナルを変え、ストレス関連の水分体重を上げることがあります。',
    ko: '수면 부족은 식욕 신호를 바꾸고 스트레스 관련 수분 체중을 올릴 수 있습니다.',
    zh: '睡眠不足可改变食欲信号，并提高压力相关水分体重。',
  },
  'Fix sleep before crash-cutting calories.': {
    ja: 'カロリーを急削減する前に睡眠を直しましょう。',
    ko: '칼로리를 급격히 줄이기 전에 수면을 고치세요.',
    zh: '在极端砍热量之前先修好睡眠。',
  },
  'Fiber, Macros, and Satiety: How to Get Fuller in a Deficit': {
    ja: '食物繊維、マクロ、満腹：赤字でより満腹になる方法',
    ko: '식이섬유, 매크로, 포만감: 적자에서 더 배부르게',
    zh: '纤维、宏量与饱腹：赤字中如何更饱',
  },
  'Fiber-rich carbs and vegetables improve fullness for many people.': {
    ja: '食物繊維の多い炭水と野菜は、多くの人の満腹感を改善します。',
    ko: '섬유가 많은 탄수와 채소는 많은 사람의 포만감을 개선합니다.',
    zh: '富含纤维的碳水与蔬菜能改善许多人的饱腹感。',
  },
  'Raise fiber gradually and still track total intake.': {
    ja: '食物繊維は徐々に増やし、総摂取は引き続き追跡。',
    ko: '섬유는 점진적으로 올리고 총 섭취는 계속 추적하세요.',
    zh: '逐渐增加纤维，并继续追踪总摄入。',
  },
  'Sugar Cravings in a Calorie Deficit: What Helps': {
    ja: 'カロリー赤字での糖質欲求：何が助けになるか',
    ko: '칼로리 적자에서 당 갈망: 무엇이 도움이 되나',
    zh: '热量赤字中的糖瘾：什么有帮助',
  },
  'Cravings rise with sleep debt, low protein, and extreme restriction.': {
    ja: '欲求は睡眠負債、低タンパク、極端な制限で上がります。',
    ko: '갈망은 수면 부채, 낮은 단백질, 극단적 제한과 함께 올라갑니다.',
    zh: '睡眠债、低蛋白和极端限制会抬高渴望。',
  },
  'Log desserts on purpose instead of accidentally.': {
    ja: 'デザートは偶発ではなく意図的に記録しましょう。',
    ko: '디저트는 우연히가 아니라 의도적으로 기록하세요.',
    zh: '有意记录甜点，而不是偶然漏掉。',
  },
  'How to Find Your Maintenance Calories in Two Weeks': {
    ja: '2週間で維持カロリーを見つける方法',
    ko: '2주 만에 유지 칼로리를 찾는 법',
    zh: '如何在两周内找到维持热量',
  },
  'Eat consistently, log, average intake, watch weekly weight.': {
    ja: '一貫して食べ、記録し、摂取を平均し、週次体重を見る。',
    ko: '일관되게 먹고, 기록하고, 섭취를 평균하고, 주간 체중을 보세요.',
    zh: '稳定进食、记录、平均摄入、观察周体重。',
  },
  'Flat weight means practical maintenance.': {
    ja: '体重が平坦なら実践的な維持です。',
    ko: '체중이 평평하면 실용적 유지입니다.',
    zh: '体重走平意味着实用维持。',
  },
  'Diet Breaks: When to Take One and How to Run It': {
    ja: 'ダイエットブレイク：いつ取り、どう回すか',
    ko: '다이어트 브레이크: 언제 하고 어떻게 운영하나',
    zh: '饮食休息：何时进行以及如何执行',
  },
  'Diet breaks can restore training and adherence after long cuts.': {
    ja: 'ダイエットブレイクは長いカット後のトレーニングと継続を回復できます。',
    ko: '다이어트 브레이크는 긴 컷 후 훈련과 순응을 회복시킬 수 있습니다.',
    zh: '饮食休息可在长期减脂后恢复训练与依从性。',
  },
  'Keep protein high, raise carbs, keep lifting, then resume.': {
    ja: 'タンパクを高く保ち、炭水を上げ、リフティングを続け、その後再開。',
    ko: '단백질을 높게, 탄수를 올리고, 리프팅을 유지한 뒤 재개.',
    zh: '保持高蛋白、提高碳水、继续举重，然后恢复减脂。',
  },
  'Refeed Day vs Diet Break: What Is the Difference?': {
    ja: 'リフィード日 vs ダイエットブレイク：違いは？',
    ko: '리피드 데이 vs 다이어트 브레이크: 차이는?',
    zh: '回喂日 vs 饮食休息：有何区别？',
  },
  'Refeeds are short higher-carb days. Diet breaks last longer at maintenance.': {
    ja: 'リフィードは短く炭水高めの日。ダイエットブレイクは維持でより長く続きます。',
    ko: '리피드는 짧은 고탄수 날입니다. 다이어트 브레이크는 유지에서 더 오래 갑니다.',
    zh: '回喂是较短的高碳水日。饮食休息在维持热量上持续更久。',
  },
  'Plan them; do not turn them into untracked chaos.': {
    ja: '計画し、未記録のカオスにしないでください。',
    ko: '계획하세요. 미기록 혼돈으로 만들지 마세요.',
    zh: '把它们计划好；不要变成未记录的混乱。',
  },
  'How to Hit Macros While Traveling': {
    ja: '旅行中にマクロを達成する方法',
    ko: '여행 중 매크로를 맞추는 법',
    zh: '旅行时如何打中宏量',
  },
  'Travel wrecks databases.': {
    ja: '旅行はデータベースを壊します。',
    ko: '여행은 데이터베이스를 망가뜨립니다.',
    zh: '旅行会毁掉数据库。',
  },
  'Snap airport food, bias fats up, protect protein, keep a step floor.': {
    ja: '空港食をスナップし、脂質を多めに、タンパクを守り、歩数の下限を保つ。',
    ko: '공항 음식을 스냅하고, 지방을 넉넉히, 단백질을 지키고, 걸음 하한을 유지.',
    zh: '给机场食物拍照，油脂偏高估计，守住蛋白质，保持步数下限。',
  },
  'Late-Night Snacking Without Blowing Your Macros': {
    ja: 'マクロを壊さず夜食する方法',
    ko: '매크로를 망가뜨리지 않고 야식하는 법',
    zh: '不炸掉宏量的深夜零食',
  },
  'Budget evening calories earlier if nights are dangerous.': {
    ja: '夜が危険なら、早めに夜のカロリーを予算化。',
    ko: '밤이 위험하면 저녁 칼로리를 더 일찍 예산하세요.',
    zh: '若夜晚危险，更早为晚间热量做预算。',
  },
  'High-protein snacks help; sleep fixes more than speeches.': {
    ja: '高タンパクおやつは助けになります。スピーチより睡眠のほうが直します。',
    ko: '고단백 스낵이 도움이 됩니다. 연설보다 수면이 더 고칩니다.',
    zh: '高蛋白零食有帮助；睡眠比说教更能修好问题。',
  },
  'How Accurate Are Restaurant Menu Calories?': {
    ja: 'レストランメニューのカロリーはどのくらい正確？',
    ko: '레스토랑 메뉴 칼로리는 얼마나 정확한가요?',
    zh: '餐厅菜单热量有多准确？',
  },
  'Published calories can be off because kitchens vary.': {
    ja: '厨房が違うため、公開カロリーは外れることがあります。',
    ko: '주방이 달라 공개 칼로리는 빗나갈 수 있습니다.',
    zh: '因厨房差异，公布热量可能不准。',
  },
  'Use as drafts, adjust for oils and portion size, photo-log.': {
    ja: '下書きとして使い、油と分量で調整し、写真ログ。',
    ko: '초안으로 쓰고, 오일과 분량으로 조정하고, 사진 로그하세요.',
    zh: '当作草稿，按油脂与份量调整，并拍照记录。',
  },
  'Protein Timing Myths vs What Matters': {
    ja: 'プロテインタイミングの迷信と本当に重要なこと',
    ko: '단백질 타이밍 미신 vs 정말 중요한 것',
    zh: '蛋白质时机的迷思与真正重要的事',
  },
  'Total daily protein and stimulus matter more than anabolic window panic.': {
    ja: '1日の総タンパク質量とトレーニング刺激のほうが、アナボリックウィンドウを恐れることより重要です。',
    ko: '하루 총 단백질과 훈련 자극이 아나볼릭 윈도우 공포보다 더 중요합니다.',
    zh: '每日总蛋白与训练刺激比恐慌“合成窗口”更重要。',
  },
  'Spread doses when you can; shakes are convenient, not magic.': {
    ja: '可能なときは摂取を分散しましょう。シェイクは便利ですが魔法ではありません。',
    ko: '가능하면 섭취를 분산하세요. 쉐이크는 편리하지만 마법이 아닙니다.',
    zh: '可以时分散摄入；奶昔方便，但不是魔法。',
  },
  'Cardio vs Steps for Fat Loss: Which Should You Prioritize?': {
    ja: '脂肪減少のための有酸素 vs 歩数：どちらを優先すべきか？',
    ko: '지방 감량을 위한 유산소 vs 걸음 수: 무엇을 우선할까?',
    zh: '减脂该优先有氧还是步数？',
  },
  'Steps are low-stress NEAT. Cardio raises expenditure faster with more recovery cost.': {
    ja: '歩数は低ストレスの NEAT です。有酸素は消費を速く上げますが回復コストも高いです。',
    ko: '걸음 수는 저스트레스 NEAT입니다. 유산소는 소비를 더 빨리 올리지만 회복 비용이 큽니다.',
    zh: '步数是低压力 NEAT。有氧提升消耗更快，但恢复成本更高。',
  },
  'Many cuts prefer a step floor plus lifting, adding cardio as needed.': {
    ja: '減量では歩数の下限＋筋トレを基本にし、必要に応じて有酸素を足す人が多いです。',
    ko: '많은 컷은 걸음 하한선 + 리프팅을 선호하고, 필요하면 유산소를 추가합니다.',
    zh: '许多减脂期偏好步数下限加举重，需要时再加有氧。',
  },
  'How to Read Nutrition Labels for Macros': {
    ja: 'マクロのための栄養表示の読み方',
    ko: '매크로를 위한 영양 라벨 읽는 법',
    zh: '如何为宏量营养素阅读营养标签',
  },
  'Serving size first.': {
    ja: 'まずサービングサイズ。',
    ko: '먼저 1회 제공량.',
    zh: '先看份量。',
  },
  'Then macros. Watch multi-serving packages and net-carb marketing.': {
    ja: '次にマクロ。複数サービングのパッケージとネットカーボのマーケティングに注意。',
    ko: '그다음 매크로. 다중 제공 패키지와 네트 카브 마케팅을 주의하세요.',
    zh: '再看宏量。留意多份包装与净碳水营销。',
  },
  'Best Time to Weigh Yourself for Accurate Trends': {
    ja: '正確なトレンドのための体重測定のベストタイミング',
    ko: '정확한 추세를 위한 체중 측정 최적 시간',
    zh: '获得准确趋势的最佳称重时间',
  },
  'Weigh most mornings after bathroom before food.': {
    ja: 'ほとんどの朝、トイレのあと・食事の前に体重を測りましょう。',
    ko: '대부분의 아침, 화장실 후·식사 전에 체중을 재세요.',
    zh: '多数早晨如厕后、进食前称重。',
  },
  'Average the week; ignore single spikes.': {
    ja: '週で平均し、単発の急変は無視します。',
    ko: '주간 평균을 쓰고 단일 급등은 무시하세요.',
    zh: '取周平均；忽略单次尖峰。',
  },
  'Water Weight vs Fat Loss: How to Tell the Difference': {
    ja: '水分体重 vs 脂肪減少：見分け方',
    ko: '수분 체중 vs 지방 감량: 구별하는 법',
    zh: '水分体重 vs 脂肪减少：如何区分',
  },
}

function main() {
  for (const locale of ['ja', 'ko', 'zh']) {
    let applied = 0
    let missing = []
    for (const f of fs.readdirSync(DATA).filter((x) => x.startsWith('t-en-')).sort()) {
      const en = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'))
      const locPath = path.join(DATA, f.replace('t-en-', `t-${locale}-`))
      const loc = JSON.parse(fs.readFileSync(locPath, 'utf8'))
      for (let i = 0; i < en.length; i++) {
        if (loc[i] && loc[i] !== en[i] && loc[i] !== null) continue
        const hit = MAP[en[i]]
        if (hit) {
          loc[i] = hit[locale]
          applied++
        } else {
          missing.push(en[i])
        }
      }
      fs.writeFileSync(locPath, JSON.stringify(loc, null, 2) + '\n')
    }
    console.log(`[${locale}] applied=${applied} missing=${missing.length}`)
    if (missing.length) {
      fs.writeFileSync(path.join(DATA, `missing-after-map-${locale}.json`), JSON.stringify([...new Set(missing)], null, 2))
    }
  }
}

main()
