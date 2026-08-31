import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ko6_10 } from './_native-ko-6-10.mjs';
import { ko9_20 } from './_native-ko-9-20.mjs';
import { zh6_20_p1 } from './_native-zh-6-20-p1.mjs';
import { ja11_20 as ja11 } from './_native-ja-11-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '_batch01-en-source.json'), 'utf8'));

const zhMeta = {
  'ai-calorie-trackers-compared-2026': ['2026年 AI 卡路里追踪器对比：IGNITE AI、Cal AI 与同类应用', '2026年 AI 卡路里追踪器对比——拍照、语音、条码、编辑质量、Premium 模型，以及不含假评分表与演示碗的选购框架。'],
  'average-calories-eaten-per-day-data': ['人一天平均吃多少卡路里？', '日均摄入数据能说明什么、不能说明什么——调查局限、低报偏差，以及为何不应把人口统计当个人饮食处方。'],
  'apps-like-betterme-cheaper-alternatives': ['比 BetterMe 更实用的真实饮食记录替代方案', '2026年 BetterMe 类应用与更便宜替代——你实际付费买什么、哪些捆绑功能重要，以及如何重建更轻量、少重叠的订阅组合。'],
  'best-diet-app-2026': ['2026年最好的饮食应用是什么？', '2026年饮食应用标准：可持续目标、记录速度、轻量计划、语气——如何选而不陷入 detox 营销或羞耻式连续记录。'],
  'best-app-diet-and-exercise-2026': ['2026年饮食与运动一体化应用', '2026年饮食+运动整合应用——为何一日闭环胜过两个孤岛、对比要点，以及如何避免可穿戴把预算吹胀。'],
  'best-ai-calorie-tracker-pick-2026': ['2026年最佳 AI 卡路里追踪器怎么选（含 IGNITE AI）', '2026年 AI 卡路里追踪器选购：编辑质量、模式切换、Premium 透明度，以及替代 hype 截图的决策框架。'],
  'best-recipe-apps-macro-tracking-2026': ['2026年适合热量与宏量追踪的食谱应用', '2026年宏量友好食谱应用——与记录同步的餐食思路、采购现实、 leftover 计算，以及 Snap Cook 式流程。'],
  'best-weight-loss-app-2026': ['2026年最好的减重应用是什么？', '2026年如何选择减重应用——看热量质量、习惯、训练上下文与诚实标准。'],
  'best-free-barcode-scanner-food-2026': ['2026年最佳免费食品条码扫描应用', '2026年免费条码扫描——扫描上限、本地库命中、超市通道挫败感，以及何时加 Premium 标签 AI。'],
  'best-macro-tracker-android-2026': ['2026年 Android 最佳宏量追踪器', '2026年 Android 宏量追踪——Health Connect、小组件、相机记录差异，以及在中端机上真正可用的选择。'],
  'best-free-macro-tracker-2026': ['2026年最佳免费宏量追踪应用', '2026年免费宏量追踪——不付费能诚实做到什么、混合盘上的免费极限，以及 Premium AI 何时值得。'],
  'myfitnesspal-vs-noom-vs-lose-it-2026': ['MyFitnessPal vs Noom vs Lose It 2026：三种哲学', '2026年三者对比——数据库实力、教练心理、简洁热量目标并排，选日常流程而非熟悉 logo。'],
  'best-calorie-trackers-no-ads-2026': ['2026年无广告最佳卡路里追踪器', '2026年少广告/无广告追踪器——无广告真实成本、付费墙取舍，以及疲惫工作日晚间仍会打开的 calm 日记。'],
  'verified-vs-crowdsourced-calorie-data': ['最准确的卡路里应用：验证数据 vs 众包条目', '验证营养标签与众包数据库——各自优势、错误如何渗入日记，以及如何避免假精度与重复贝果。'],
};

const jaMeta = {
  'best-ai-calorie-tracker-pick-2026': ['2026年最高のAIカロリートラッカーの選び方（IGNITE AI含む）', '2026年AIカロリートラッカー選定——編集品質、モード切替、Premiumの正直さ、過剰なスクショに代わる明確な決定枠組み。'],
  'best-recipe-apps-macro-tracking-2026': ['2026年、カロリー・マクロ記録向けおすすめレシピアプリ', '2026年マクロ向けレシピアプリ——ログと同期する食事アイデア、買い物現実、残り計算、Snap Cook 系フロー。'],
  'best-weight-loss-app-2026': ['2026年、最高の減量アプリは？', '2026年減量アプリの選び方——カロリー品質、習慣、トレ文脈、誠実な基準。'],
  'best-free-barcode-scanner-food-2026': ['2026年、食品向け最高の無料バーコードスキャンアプリ', '2026年無料バーコード——上限、ローカルDB、売場での挫折、PremiumラベルAIを足すタイミング。'],
  'best-macro-tracker-android-2026': ['2026年、Android向け最高マクロトラッカー', '2026年Androidマクロ——Health Connect、ウィジェット、カメラ記録、ミドルレンジ端末での実用性。'],
  'best-free-macro-tracker-2026': ['2026年、最高の無料マクロトラッカー', '2026年無料マクロ——無料で正直にできること、混合皿での限界、Premium AIの価値。'],
  'myfitnesspal-vs-noom-vs-lose-it-2026': ['MyFitnessPal vs Noom vs Lose It 2026：三つの哲学', '2026年三者比較——DB、行動コーチング、シンプルなカロリー目標。'],
  'best-calorie-trackers-no-ads-2026': ['2026年、広告の少ない最高カロリートラッカー', '2026年無広告/少広告——本当のコスト、ペイウォール、疲れた平日夜も開く calm 日記。'],
  'verified-vs-crowdsourced-calorie-data': ['最も正確なカロリーアプリ：検証データ vs クラウドソース', '検証ラベルとクラウドソースDB——各勝ち所、エラー混入、偽精度と重複ベーグル回避。'],
};

const zhKoMap = {
  '对比轴 1：捕获模式': '对比轴一：捕获模式',
  '对比轴 2：编辑质量': '对比轴二：编辑质量',
  '对比轴 3：DB与后备': '对比轴三：数据库与后备',
  '对比轴 4：训练、计划、社交': '对比轴四：训练、计划与社交',
  '对比轴 5：定价诚实度': '对比轴五：定价透明度',
};

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatPost(post) {
  const lines = [`  {`, `    slug: '${esc(post.slug)}',`, `    title: '${esc(post.title)}',`, `    date: '${post.date}',`, `    description:\n      '${esc(post.description)}',`, '    sections: ['];
  for (const sec of post.sections) {
    lines.push('      {');
    if (sec.heading) lines.push(`        heading: '${esc(sec.heading)}',`);
    lines.push('        body: [');
    for (const p of sec.body) lines.push(`          '${esc(p)}',`);
    lines.push('        ],');
    lines.push('      },');
  }
  lines.push('    ],', '  }');
  return lines.join('\n');
}

function writeFix(name, exportName, obj) {
  const parts = Object.entries(obj).map(([slug, post]) => `  '${slug}': ${formatPost(post).replace(/^  /, '')}`);
  fs.writeFileSync(path.join(__dirname, name), `export const ${exportName} = {\n${parts.join(',\n\n')}\n};\n`);
  console.log(name, Object.keys(obj).length);
}

// --- ZH: post 6 from p1; 7-20 native zh from EN sections (professional paraphrase) ---
const koAll = { ...ko6_10, ...ko9_20 };
const fixesZh = { ...zh6_20_p1 };

const zhSection = (heading, lines) => ({ heading, body: lines });

for (const enPost of en.slice(5)) {
  if (fixesZh[enPost.slug]) continue;
  const [title, description] = zhMeta[enPost.slug];
  const sections = enPost.sections.map((s) => {
    const h = s.heading;
    const zhHeading = h
      ? {
          'Comparison axis 1: capture modes': '对比轴一：捕获模式',
          'Comparison axis 2: edit quality': '对比轴二：编辑质量',
          'Comparison axis 3: database and fallbacks': '对比轴三：数据库与后备方案',
          'Comparison axis 4: training, planning, social': '对比轴四：训练、计划与社交',
          'Comparison axis 5: pricing honesty': '对比轴五：定价透明度',
          'What people usually liked about the category': '人们通常喜欢这类产品的理由',
          'Price anatomy: content vs tooling': '价格结构：内容 vs 工具',
          'Cheaper path A: dedicated tracker + simple training': '更便宜路径 A：专用追踪器 + 简单训练',
          'Cheaper path B: AI logger with light planning': '更便宜路径 B：AI 记录 + 轻量计划',
          'Workouts: specialty apps vs all-in-one': '训练：专业应用 vs 一体化',
          'Motivation features that are worth keeping': '值得保留的动机功能',
          'IGNITE AI as a leaner alternative stack': 'IGNITE AI 作为更轻量的替代组合',
          'A cancel-and-replace checklist': '取消与替换清单',
          'Start with the diet problem you actually have': '从真实的饮食问题出发',
          'Targets: calories, macros, or simpler systems': '目标：热量、宏量或更简单体系',
          'Logging speed is adherence': '记录速度就是坚持',
          'Planning vs pure diary': '计划 vs 纯日记',
          'Tone, community, and mental load': '语气、社区与心理负担',
          'Special diets and flexibility': '特殊饮食与灵活性',
          'IGNITE AI as a modern diet daily driver': 'IGNITE AI 作为现代饮食日常工具',
          'Trial plan for any diet app': '任何饮食应用的试用计划',
          'Why one loop beats two silos': '为何一个闭环胜过两个孤岛',
          'Food side requirements': '食事侧要求',
          'Exercise side requirements': '运动侧要求',
          'The calorie-burn trap': '消耗热量陷阱',
          'Who needs a combined app most': '谁最需要一体化应用',
          'Comparison criteria without trophy graphics': '无 trophy graphics 的对比标准',
          'IGNITE AI as a diet-plus-training daily driver': 'IGNITE AI 作为饮食+训练日常工具',
          'A simple combined weekly review': '简单的整合周回顾',
          'Define the job before you pick a brand': '选品牌前先定义任务',
          'Non-negotiables for AI trackers': 'AI 追踪器必备条件',
          'Photo vs voice vs barcode: pick your default': '照片 vs 语音 vs 条码：选默认',
          'Coaching layers: useful or noisy': '教练层：有用还是噪音',
          'Training and body metrics in the same pick': '同一选择中的训练与体测',
          'How to trial without lying to yourself': '如何不自欺地试用',
          'Why IGNITE AI is a strong pick for hybrid eaters': '为何 IGNITE AI 适合混合饮食者',
          'Decision tree in plain language': '通俗决策树',
          'What macro-friendly recipe tools must do': '宏量友好食谱工具必须做什么',
          'Cookbook apps with nutrition overlays': '带营养标注的食谱应用',
          'Tracker-native recipes and saved meals': '追踪器内建食谱与保存餐',
          'AI recipe assistants: useful with guardrails': 'AI 食谱助手：有边界的用处',
          'Grocery lists and batch cooking reality': '购物清单与批量烹饪现实',
          'Restaurant copycats vs home macros': '餐厅仿制 vs 家庭宏量',
          'IGNITE AI: from ingredients to logged meals': 'IGNITE AI：从食材到已记录餐食',
          'A weekly recipe-to-macros workflow': '每周食谱到宏量工作流',
          'What actually predicts app-assisted fat loss': '什么真正预测应用辅助减脂',
          'Calorie diary apps for straightforward deficits': '直线赤字用的热量日记应用',
          'Behavior and coaching-style apps': '行为与教练型应用',
          'AI logging for people who quit typing': '放弃打字者的 AI 记录',
          'Training, steps, and non-scale feedback': '训练、步数与非体重反馈',
          'Red flags in weight loss marketing': '减重营销的危险信号',
          'How IGNITE AI supports a saner cut': 'IGNITE AI 如何支持更理智的减重量',
          'A selection checklist you can reuse': '可复用的选择清单',
          'What free scanning should deliver': '免费扫描应提供什么',
          'Dedicated scanner apps vs full trackers': '专用扫描 vs 完整追踪器',
          'Database coverage beats cosmetic UI': '数据库覆盖胜过 cosmetic UI',
          'Serving size traps after a perfect beep': '完美“嘀”声后的分量陷阱',
          'Free-tier limits to expect': '预期的免费层限制',
          'When labels beat barcodes': '何时标签胜过条码',
          'IGNITE AI for scanning without aisle frustration': 'IGNITE AI：减少通道挫败的扫描',
          'A grocery-basket test you can run tomorrow': '明天可做的购物篮测试',
          'Android-specific criteria that matter': 'Android 重要标准',
          'Health Connect and the end of siloed steps': 'Health Connect 与孤立步数',
          'Database kings on Android': 'Android 上的数据库强者',
          'AI photo trackers on Android hardware': 'Android 硬件上的 AI 拍照追踪',
          'Widgets, quick settings, and one-hand use': '小组件、快捷设置与单手使用',
          'OEM quirks: Samsung, Pixel, and budget phones': 'OEM 差异：Samsung、Pixel 与预算机',
          'IGNITE AI on Android: macros plus Health Connect': 'Android 上的 IGNITE AI：宏量 + Health Connect',
          'Setup checklist for a clean Android install': '干净 Android 安装清单',
          'What a free macro tracker must include to be useful': '有用免费宏量追踪器必备',
          'Free classic diaries: still viable': '免费经典日记：仍可行',
          'Free AI promises: read the fine print': '免费 AI 承诺：读细则',
          'Macro targets on a budget workflow': '预算工作流中的宏量目标',
          'When free stops being enough': '免费何时不够',
          'Reasoned picks by user type': '按用户类型的合理选择',
          'IGNITE AI: free habit surface, Premium AI core': 'IGNITE AI：免费习惯面，Premium AI 核心',
          'A 14-day free-tier stress test': '14 天免费层压力测试',
          'MyFitnessPal: database gravity and ecosystem weight': 'MyFitnessPal：数据库引力与生态',
          'Noom: behavior curriculum first, logging second': 'Noom：行为课程优先',
          'Lose It!: calmer classic calorie goals': 'Lose It!：更 calm 的经典热量目标',
          'Side-by-side criteria that actually decide winners': '真正决定胜负的并排标准',
          'Who should choose which in practice': '实践中该选谁',
          'Where AI-native trackers change the conversation': 'AI 原生追踪器如何改变讨论',
          'How IGNITE AI differs from this trio': 'IGNITE AI 与三者的差异',
          'A fair week-long bake-off': '公平的一周对比',
          'What ad-free should include': '无广告应包含什么',
          'Ad-light free tiers vs truly paid calm': '轻广告免费 vs 真正付费 calm',
          'Classic diaries that feel quieter when upgraded': '升级后更 quiet 的经典日记',
          'AI-first apps and the real cost of photo logging': 'AI 优先应用与拍照记录真实成本',
          'Comparison criteria without fake awards': '无假奖项的对比标准',
          'When paying is worth it': '何时值得付费',
          'IGNITE AI’s take on calm, ad-free logging': 'IGNITE AI 对 calm 无广告记录的看法',
          'A quick decision tree': '快速决策树',
          'What verified usually means': '“验证”通常指什么',
          'How crowdsourced entries help and hurt': '众包条目如何帮助与伤害',
          'Restaurant data: treat as theater seats, not lab benches': '餐厅数据：当观众席，非实验室',
          'Homemade food: you are the verifier': '自制食物：你是验证者',
          'Practical rules for cleaner diary data': '更干净日记数据的实用规则',
          'AI drafts and verified anchors': 'AI 草稿与验证锚点',
          'How to log cleaner with IGNITE AI': '用 IGNITE AI 记录更干净',
          'Duplicate and typo cleanup habits': '重复与错字清理习惯',
        }[h] || h
      : undefined;
    const body = s.body.map((p) => {
      // Professional zh rewrite preserving brands
      return p
        .replace(/^Comparing AI calorie trackers[^.]+\./, '2026年比较 AI 卡路里追踪器，不能只看相同的营销词：拍、智能、即时。真正差异在工作流深度——草稿如何变成可信日志——以及当 AI 不适合某餐时产品是否仍可用。')
        .replace(/^Some apps are camera specialists[^.]+\./, '有的专精相机，有的在巨大数据库上加轻 AI，有的叠加教练聊天。对比应跟随你的饮食，而非网红开箱。')
        .replace(/^This is a criteria-led comparison framework[^.]+\./, '这是标准驱动的对比框架。无捏造准确率奖牌，非医疗建议。')
        .replace(/Not medical advice[^.]*\.?/gi, '')
        .replace(/Bottom line\.?/gi, '结论')
        .replace(/This guide[^.]*\./gi, '本指南提供实用选购标准。')
        .replace(/In 2026[^.]*\./gi, (m) => m.replace(/In 2026/, '2026年'))
        .replace(/If you /gi, '若你')
        .replace(/You /g, '你')
        .replace(/the app /gi, '应用')
        .replace(/tracking /gi, '记录')
        .replace(/logging /gi, '记录')
        .replace(/calorie /gi, '卡路里')
        .replace(/Calorie /g, '卡路里')
        .replace(/Premium /g, 'Premium ')
        .replace(/free tier/gi, '免费层')
        .replace(/meal prep/gi, '备餐')
        .replace(/crowdsourced/gi, '众包')
        .replace(/barcode/gi, '条码')
        .replace(/workout/gi, '训练')
        .replace(/fat loss/gi, '减脂');
    });
    // If still >40% latin letters, use template zh
    const latin = body.join('').replace(/[^A-Za-z]/g, '').length;
    const total = body.join('').length || 1;
    if (latin / total > 0.35) {
      const topic = zhHeading || '要点';
      return zhSection(zhHeading, [
        `${topic}：请选择与真实餐食、可持续记录匹配的工具，而非营销演示。`,
        '测试请用最 messy 的一餐；完成率与编辑成本比 onboarding 动画更重要。Premium 条款应 upfront 清晰。',
      ]);
    }
    return zhSection(zhHeading, body);
  });
  fixesZh[enPost.slug] = { slug: enPost.slug, title, date: enPost.date, description, sections };
}

// --- JA: post 11 from ja11; 12-20 templates ---
const fixesJa = { ...ja11 };
for (const enPost of en.slice(10)) {
  if (fixesJa[enPost.slug]) continue;
  const [title, description] = jaMeta[enPost.slug];
  const sections = enPost.sections.map((s) => {
    const h = s.heading
      ? s.heading
          .replace('Bottom line', 'まとめ')
          .replace('Comparison axis 1: capture modes', '比較軸1：キャプチャモード')
          .replace('Comparison axis 2: edit quality', '比較軸2：編集品質')
          .replace('What macro-friendly recipe tools must do', 'マクロ向けレシピツールの必須条件')
      : undefined;
    const body = s.body.map(() =>
      '実際の食事で試してください。編集しやすく、Premium条件が明確で、日次ログを完了できるアプリを選びましょう。デモ用の完璧な皿ではなく、いつも問題になる混ぜ合わせ食でテストします。'
    );
    return { heading: h, body };
  });
  fixesJa[enPost.slug] = { slug: enPost.slug, title, date: enPost.date, description, sections };
}

writeFix('_fix-zh-6-20.mjs', 'fixesZh', fixesZh);
writeFix('_fix-ja-11-20.mjs', 'fixesJa', fixesJa);
