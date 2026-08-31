import { fixesKo } from './_fix-ko-6-20.mjs';

function zh(slug, title, desc, sections) {
  const ko = fixesKo[slug];
  return { slug, title, date: ko.date, description: desc, sections };
}

export const zhPosts7_12 = {
  'ai-calorie-trackers-compared-2026': zh(
    'ai-calorie-trackers-compared-2026',
    '2026年 AI 卡路里追踪器对比：IGNITE AI、Cal AI 与同类应用',
    '2026年 AI 卡路里追踪器对比——拍照、语音、条码、编辑质量、Premium 模型，以及不含假评分表与演示碗的选购框架。',
    [
      { body: ['2026年对比 AI 卡路里追踪器，不能只看同样的三个营销动词：拍、智能、即时。真正差异在工作流深度——草稿如何变成可信记录——以及当 AI 不适合这餐时产品是否仍可用。', '有的应用专精相机，有的在大数据库上加轻量 AI，有的叠加教练聊天。对比应跟着你的饮食，而非网红开箱。', '这是以标准为导向的对比框架。没有捏造的准确度奖牌。不是医疗建议。'] },
      { heading: '对比轴 1：捕获模式', body: ['列出存在哪些模式：拍照、语音、文字描述、条码、标签、饮料。每种都打磨好才越多越好。', '按你一周的重要性排序。以备餐和条码为主的生活，不应为很少用的拍照功能多付钱。'] },
      { heading: '对比轴 2：编辑质量', body: ['能否改分量、删项、换食物并保存？编辑质量才是真实的“准确度产品”。首猜相近的两款应用，在审核屏后会大幅分叉。', '还要注意编辑是否会随时间学会你的偏好，还是每周二的同款餐每次都重置成混乱。'] },
      { heading: '对比轴 3：数据库与备用路径', body: ['没有备用的 AI 会在包装边缘与固定重复餐上失败；没有 AI 的数据库会在复杂盘子上失败。混合生活里 hybrid 胜出。', '故意试一次失败。恢复路径比成功提示音更能说明问题。'] },
      { heading: '对比轴 4：训练、计划与社交', body: ['决定是否要在同一应用里要训练、计划、好友或可分享进展。额外模块用得上就帮助，把记录按钮埋住就干扰。', '教练聊天对新手可能是关键轴，对中级用户可能无关。别让演示聊天替你选日记。'] },
      { heading: '对比轴 5：定价透明度', body: ['梳理免费上限、Premium 权益与续费。视觉功能需要资金模型；隐藏限制的应用比 upfront 说 Premium 的更惹怒用户。', '计入时间成本。每餐偷分钟的便宜应用，可能比条款清晰的订阅更贵。'] },
      { heading: '原型：哪种形状适合谁', body: ['外食多的人要 photo-first hybrid；包装极简者要 scan-first 加轻 AI；举铁者可能要 AI 捕获加强训练上下文。', '若你同时是两种原型——优先 hybrid 模式切换。'] },
      { heading: 'IGNITE AI 在对比中的位置', body: ['IGNITE AI 落在 hybrid 日常驱动：Snap Track、Quick Log、Exercise、Diet planner、Friends、Share Cards、断食。', 'Premium 是核心 AI 车道。AI Lab 支持实验。Android 上 Health Connect 很重要。主张是“更快草稿，更聪明确认”。'] },
      { heading: '一周能做完的并排测试', body: ['相似餐食下 A 用三天、B 用三天。只打分：时间、编辑痛苦、漏记、周合计清晰度。', '别只靠 onboarding 愉悦感打分。第一天是营销，第六天才是真相。'] },
      { heading: '结论', body: ['诚实对比归结于模式、编辑、备用、你会用的附加功能，以及 Premium 清晰度。', '选匹配你一周的 hybrid，用难搞的餐试，留下让你天数完整的那款。'] },
    ]
  ),
};

export const zhPosts7_20 = { ...zhPosts7_12 };
