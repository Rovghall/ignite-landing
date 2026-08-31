#!/usr/bin/env node
/**
 * Generates _fix-zh-6-20.mjs, _fix-ja-1-10.mjs, _fix-ja-11-20.mjs from native translation maps.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesKo } from './_fix-ko-6-20.mjs';
import { zh6_20_p1 } from './_native-zh-6-20-p1.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatPostObj(post) {
  const lines = [`  '${post.slug}': {`, `    slug: '${esc(post.slug)}',`, `    title: '${esc(post.title)}',`, `    date: '${post.date}',`, `    description:\n      '${esc(post.description)}',`, '    sections: ['];
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

function formatExport(name, posts) {
  const parts = Object.values(posts).map(formatPostObj);
  return `export const ${name} = {\n${parts.join(',\n\n')}\n};\n`;
}

// --- ZH 6-20 meta + bodies translated from KO semantics ---
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
  'best-calorie-trackers-no-ads-2026': ['2026年无广告最佳卡路里追踪器', '2026年少广告/无广告追踪器——无广告真实成本、付费墙取舍，以及疲惫工作日晚间仍会打开的顺畅日记。'],
  'verified-vs-crowdsourced-calorie-data': ['最准确的卡路里应用：验证数据 vs 众包条目', '验证营养标签与众包数据库——各自优势、错误如何渗入日记，以及如何避免假精度与重复贝果。'],
};

function zhFromKo(slug) {
  const ko = fixesKo[slug];
  const [title, description] = zhMeta[slug];
  const headingMap = {
    '비교 축 1: 캡처 모드': '对比轴 1：捕获模式',
    '비교 축 2: 편집 품질': '对比轴 2：编辑质量',
    '비교 축 3: DB와 대체 수단': '对比轴 3：数据库与备用路径',
    '비교 축 4: 훈련, 계획, 소셜': '对比轴 4：训练、计划与社交',
    '비교 축 5: 요금 정직함': '对比轴 5：定价透明度',
    '결론': '结论',
    'まとめ': '结论',
  };
  // Use pre-written zh bodies keyed by slug — generated from KO/EN
  const zhBodies = ZH_BODIES[slug];
  if (!zhBodies) throw new Error('missing zh bodies ' + slug);
  return {
    slug,
    title,
    date: ko.date,
    description,
    sections: ko.sections.map((sec, i) => ({
      heading: sec.heading ? (zhBodies[i]?.heading || headingMap[sec.heading] || sec.heading) : undefined,
      body: zhBodies[i].body,
    })),
  };
}

// Native Simplified Chinese section bodies (index matches KO sections array)
const ZH_BODIES = {};

// Post 7: ai-calorie-trackers-compared-2026
ZH_BODIES['ai-calorie-trackers-compared-2026'] = [
  { body: ['2026年对比 AI 卡路里追踪器，不能只看同样的三个营销动词：拍、智能、即时。真正差异在工作流深度——草稿如何变成可信记录——以及当 AI 不适合这餐时产品是否仍可用。', '有的应用专精相机，有的在大数据库上加轻量 AI，有的叠加教练聊天。对比应跟着你的饮食，而非网红开箱。', '这是以标准为导向的对比框架。没有捏造的准确度奖牌。不是医疗建议。'] },
  { heading: '对比轴 1：捕获模式', body: ['列出存在哪些模式：拍照、语音、文字描述、条码、标签、饮料。每种都打磨好才越多越好；半坏的语音按钮只是 clutter。', '按你一周的重要性排序。以备餐+条码为主的生活，不应为很少用的拍照功能多付钱。'] },
  { heading: '对比轴 2：编辑质量', body: ['能否改分量、删项、换食物并保存？编辑质量才是真实的“准确度产品”。首猜相近的两款应用，在审核屏后会大幅分叉。', '还要注意编辑是否会随时间学会你的偏好，还是每周二的同款 burrito 都重置成混乱。'] },
  { heading: '对比轴 3：数据库与备用路径', body: ['没有备用的 AI 会在包装边缘与固定重复餐上失败；没有 AI 的数据库会在 messy 盘子上失败。混合生活里 hybrid 胜出。', '故意试一次失败。恢复路径比成功提示音更能说明问题。'] },
  { heading: '对比轴 4：训练、计划与社交', body: ['决定是否要在同一应用里要训练、计划、好友或可分享进展。额外模块用得上就帮助，把记录按钮埋住就干扰。', '教练聊天对新手可能是关键轴，对中级用户可能无关。别让 demo 聊天替你选日记。'] },
  { heading: '对比轴 5：定价透明度', body: ['映射免费上限、Premium 权益与续费。视觉功能需要资金模型；藏限制的应用比 upfront 说 Premium 的更惹怒用户。', '计入时间成本。每餐偷分钟的便宜应用，可能比条款清晰的订阅更贵。'] },
  { heading: '原型：哪种 AI 追踪器形状适合谁', body: ['外食多的人要 photo-first hybrid；包装极简者要 scan-first + 轻 AI；举铁者可能要 AI 捕获 + 强训练上下文；要课程的人可能要 lesson 多于 vision。', '若你同时是两种原型——欢迎来到真实生活——优先 hybrid 模式切换。'] },
  { heading: 'IGNITE AI 在对比中的位置', body: ['IGNITE AI 落在 hybrid 日常驱动原型：Snap Track 覆盖拍照、标签、条码、饮料；Quick Log 负责语音/描述速度；Exercise 与 Diet planner 负责一天其余部分；Friends 与 Share Cards 负责问责。', 'Premium 是核心 AI 车道。AI Lab 支持实验。Android 上 Health Connect 很重要。产品主张不是“永远不用想”——而是“更快草稿，更聪明确认”。'] },
  { heading: '一周能做完的并排测试', body: ['A 应用用三天、B 应用用三天，餐食尽量相似。只打分：时间、编辑痛苦、漏记、周合计清晰度。试炼叠成意外扣费前先删输家。', '别只靠 onboarding  delight 打分。第一天是营销，第六天才是真相。'] },
  { heading: '结论', body: ['诚实对比 AI 卡路里追踪器，归结于模式、编辑、备用、你会用的附加功能，以及 Premium 清晰度——不是 cinematic 食物识别。', '选匹配你一周的 hybrid，用 ugly 餐试，留下让你天数完整的那款。这才是唯一付得起的对比记分卡。'] },
];

// Continue with remaining posts - load from external file if present
const extPath = path.join(__dirname, '_zh-ja-bodies-chunk.mjs');
if (fs.existsSync(extPath)) {
  const ext = await import('./_zh-ja-bodies-chunk.mjs');
  Object.assign(ZH_BODIES, ext.ZH_BODIES || {});
  Object.assign(JA_BODIES, ext.JA_BODIES || {});
}

var JA_BODIES = {};

const fixesZh = { ...zh6_20_p1 };
for (const slug of Object.keys(zhMeta)) {
  fixesZh[slug] = zhFromKo(slug);
}

if (Object.keys(ZH_BODIES).length >= 15) {
  fs.writeFileSync(path.join(__dirname, '_fix-zh-6-20.mjs'), formatExport('fixesZh', fixesZh));
  console.log('Wrote zh', Object.keys(fixesZh).length);
} else {
  console.log('ZH bodies count', Object.keys(ZH_BODIES).length, '- need chunk file');
}
