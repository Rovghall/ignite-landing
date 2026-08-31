import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesKo } from './_fix-ko-6-20.mjs';
import { zh6_20_p1 } from './_native-zh-6-20-p1.mjs';
import { zhPosts1_5 } from './_native-zh-1-5.mjs';
import { fixesJa } from './_fix-ja-11-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const zhTitles = {
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
  'best-calorie-trackers-no-ads-2026': ['2026年无广告最佳卡路里追踪器', '2026年少广告/无广告追踪器——无广告真实成本、付费墙取舍，以及疲惫工作日晚间仍会打开的顺畅日记。'],
  'verified-vs-crowdsourced-calorie-data': ['最准确的卡路里应用：验证数据 vs 众包条目', '验证营养标签与众包数据库——各自优势、错误如何渗入日记，以及如何避免假精度与重复贝果。'],
};

const hZh = {
  '자주 보는 주요 요금 모델': '常见定价模型', '무료에도 포함돼야 할 것': '免费层仍应包含', 'Premium이 보통 자금 조달하는 것': 'Premium 通常资助什么',
  '표시 가격 너머 숨은 비용': '标价之外的隐藏成本', '반나절에 가치 추정하기': '用半天估算价值', '무료 유지, 지불, 떠날 때': '留免费、付费或离开',
  'IGNITE AI 요금 철학 (쉬운 말로)': 'IGNITE AI 的定价思路（直白版）', '체험판 실수 방지 요령': '试用不踩坑', '결론': '结论',
  '비교 축 1: 캡처 모드': '对比轴 1：捕获模式', '비교 축 2: 편집 품질': '对比轴 2：编辑质量', '비교 축 3: DB와 대체 수단': '对比轴 3：数据库与备用路径',
  '비교 축 4: 훈련, 계획, 소셜': '对比轴 4：训练、计划与社交', '비교 축 5: 요금의 정직함': '对比轴 5：定价透明度',
  '유형별: 어떤 형태가 누구에게': '原型：哪种形状适合谁', '비교에서 IGNITE AI 위치': 'IGNITE AI 在对比中的位置', '1주에 끝나는 병렬 테스트': '一周能做完的并排测试',
};

// Load hand-written zh bodies from JSON if present
const bodiesPath = path.join(__dirname, '_zh-bodies-7-20.json');
const bodies = fs.existsSync(bodiesPath) ? JSON.parse(fs.readFileSync(bodiesPath, 'utf8')) : {};

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatPost(post) {
  const lines = ['  {', `    slug: '${esc(post.slug)}',`, `    title: '${esc(post.title)}',`, `    date: '${post.date}',`, `    description:\n      '${esc(post.description)}',`, '    sections: ['];
  for (const sec of post.sections) {
    lines.push('      {');
    if (sec.heading) lines.push(`        heading: '${esc(sec.heading)}',`);
    lines.push('        body: [');
    for (const p of sec.body) lines.push(`          '${esc(p)}',`);
    lines.push('        ],');
    lines.push('      },');
  }
  lines.push('    ],');
  lines.push('  },');
  return lines.join('\n');
}

function buildZh(slug) {
  if (zh6_20_p1[slug]) return zh6_20_p1[slug];
  const ko = fixesKo[slug];
  const [title, description] = zhTitles[slug];
  const b = bodies[slug];
  if (!b) throw new Error('missing zh bodies for ' + slug);
  return { slug, title, date: ko.date, description, sections: b };
}

function buildJaFromKo(slug, title, desc, headingMap) {
  const ko = fixesKo[slug];
  if (!ko) return fixesJa[slug];
  return {
    slug, title, date: ko.date, description: desc,
    sections: ko.sections.map((s, i) => ({
      heading: s.heading ? (headingMap[s.heading] || s.heading.replace('결론', 'まとめ')) : undefined,
      body: bodies[`ja:${slug}`]?.[i]?.body || s.body,
    })),
  };
}

export async function main() {
  const en = JSON.parse(fs.readFileSync(path.join(__dirname, '_batch01-en-source.json'), 'utf8'));
  const slugs = en.map((p) => p.slug);
  const existing = fs.readFileSync(path.join(__dirname, 'batch01-cjk.mjs'), 'utf8');

  const zhPosts = slugs.map((s) => (zhPosts1_5[s] ? zhPosts1_5[s] : buildZh(s)));
  const zhBlock = `export const batch01Zh = [\n${zhPosts.map(formatPost).join('\n\n')}\n];`;

  let out = existing.replace(/export const batch01Zh = \[[\s\S]*?\n\];/, zhBlock);
  fs.writeFileSync(path.join(__dirname, 'batch01-cjk.mjs'), out);
  console.log('ZH patched', zhPosts.length);
}

main().catch((e) => { console.error(e); process.exit(1); });
