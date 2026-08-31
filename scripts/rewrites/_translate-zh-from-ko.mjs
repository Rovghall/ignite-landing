#!/usr/bin/env node
/** Translate native KO posts to Simplified Chinese and patch batch01Zh */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixesKo1_5 } from './_fix-ko-1-5.mjs';
import { fixesKo } from './_fix-ko-6-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const koAll = { ...fixesKo1_5, ...fixesKo };
const slugs = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch01-slugs.json'), 'utf8'));

const hZh = {
  '가격 전에 할 일 정의': '先定义任务，再谈价格',
  '흔한 무료 이용의 대가': '常见的免费代价',
  '평생 구매 신화': '一次性购买的误区',
  '구독 없는 워크플로 만들기': '建立无订阅工作流',
  '구독이 합리적인 구매일 때': '订阅才是理性选择时',
  '사람들이 실제로 쓰는 하이브리드': '人们实际在用的混合方案',
  '프라이버시와 광고라는 숨은 비용': '隐私与广告这类隐藏成本',
  '결론': '结论',
  '무료에도 포함돼야 할 것': '免费层仍应包含',
  '무료 등급이 지방 감량을 깨는 지점': '免费层在哪破坏减脂',
  '무료 코칭 vs 무료 기록': '免费教练 vs 免费记录',
  '합리적 무료 후보 기준': '合理的免费筛选标准',
  '지불이 알뜰한 선택일 때': '付费才是省钱时',
  '여전히 통하는 무료 우선 워크플로': '仍可行的免费优先工作流',
  '두 번 내지 않는 소셜·책임': '不付两次的社交与问责',
  '지속력이 이론적 정밀함을 이김': '坚持胜过理论精度',
  '단백 가시성과 적자 정직함': '蛋白可见与赤字诚实',
  '주말·테이크아웃 실패 모드': '周末与外卖失败模式',
  '클래식 일지 vs AI 캡처': '经典日记 vs AI 捕获',
  'IGNITE AI가 감량 일에 맞는 지점': 'IGNITE AI 如何契合减脂工作',
  '가짜 점수 없이 후보 줄이기': '无假分数的候选筛选',
  '코칭 앱 vs 기록 앱': '教练应用 vs 记录应用',
  '선반에서 “정확”의 실제 의미': '货架上“准确”的实际含义',
  'DB 품질 vs 사용자 제출 노이즈': '数据库质量 vs 用户提交噪声',
  '적자를 깨는 분량 함정': '破坏赤字的份量陷阱',
  '바코드가 잘못된 도구일 때': '条码并非合适工具时',
  'IGNITE AI의 스캔+복구': 'IGNITE AI 的扫描与恢复',
  '실용 장보기 테스트 (가짜 점수 없음)': '实用购物测试（无假分数）',
  '사진 AI보다 스캐너 우선할 사람': '更适合优先用扫描器的人',
  '무료 단식 앱이 잘 해야 할 것': '免费断食应用应做好的事',
  '타이머 전용: 강점과 공백': '纯计时器：优势与空白',
  '단식 기능 있는 트래커': '带断食功能的追踪器',
  '교리 없는 schedule': '无教条的日程安排',
  '전해질, 커피, “단식 깨나?”': '电解质、咖啡与“算破断吗？”',
  '주의할 무료 한도': '需注意的免费限制',
  'IGNITE AI의 하루 속 단식': 'IGNITE AI 如何把断食当作一天的一部分',
  '건전한 무료 사용자 설정': '健康的免费用户设置',
  '자주 보는 주요 요금 모델': '常见的主要定价模式',
  'Premium이 보통 자금 조달하는 것': 'Premium 通常资助什么',
  '표시 가격 너머 숨은 비용': '标价之外的隐藏成本',
  '반나절에 가치 추정하기': '用半天估算价值',
  '무료 유지, 지불, 떠날 때': '留免费、付费或离开',
  'IGNITE AI 요금 철학 (쉬운 말로)': 'IGNITE AI 的定价思路（直白版）',
  '체험판 실수 방지 요령': '避免试用失误的窍门',
  '비교 축 1: 캡처 모드': '比较维度 1：捕获模式',
  '비교 축 2: 편집 품질': '比较维度 2：编辑质量',
  '비교 축 3: DB와 대체 수단': '比较维度 3：数据库与替代手段',
  '비교 축 4: 훈련, 계획, 소셜': '比较维度 4：训练、计划与社交',
  '비교 축 5: 요금의 정직함': '比较维度 5：定价诚实度',
  '유형별: 어떤 형태가 누구에게': '按类型：哪种形态适合谁',
  '비교에서 IGNITE AI 위치': '对比中 IGNITE AI 的位置',
  '1주에 끝나는 병렬 테스트': '一周内结束的并行测试',
  '평균 섭취 숫자의 출처': '平均摄入数字的来源',
  '과소 보고가 “평균”을 왜곡하는 이유': '少报如何扭曲“平均”',
  '평균은 목표가 아님': '平均不是目标',
  '본인 일지에서 평균 쓰기': '在自己的日记里用平均数',
  '성별·나이·활동 차이': '性别、年龄与活动差异',
  '액체 칼로리': '液体热量',
  '본인 평균을 IGNITE AI로': '用 IGNITE AI 看自己的平均',
  '헤드라인 읽기 체크리스트': '读标题的检查清单',
  '이 유형에서 사람들이 보통 좋아했던 점': '这类产品人们通常喜欢的点',
  '가격 구조: 콘텐츠 대 도구': '价格结构：内容 vs 工具',
  '저렴한 경로 A: 전문 트래커 + 단순한 운동': '低成本路径 A：专业追踪器 + 简单运动',
  '저렴한 경로 B: AI 기록 + 가벼운 계획': '低成本路径 B：AI 记录 + 轻量计划',
  '운동: 전문 앱 vs 올인원': '运动：专业应用 vs 一体化',
  '남길 가치 있는 동기 기능': '值得保留的动机功能',
  '가벼운 대안 조합으로 IGNITE AI': 'IGNITE AI 作为轻量替代组合',
  '해지·교체 체크리스트': '取消与更换检查清单',
  '실제로 겪는 다이어트 문제부터': '从实际遇到的饮食问题出发',
  '목표: 칼로리, 매크로, 더 단순한 방식': '目标：热量、宏量或更简单的方式',
  '기록 속도가 곧 지속력': '记录速度就是坚持力',
  '계획 vs 순수 일지': '计划 vs 纯日记',
  '톤, 커뮤니티, 정신적 부담': '语气、社区与精神负担',
  '특수 식단과 유연성': '特殊饮食与灵活性',
  '현대적 다이어트 일상용 IGNITE AI': '面向现代饮食日常的 IGNITE AI',
  '어떤 다이어트 앱이든 시험 계획': '任何饮食应用都该有的试用计划',
  '한 루프가 두 분리 기록보다 나은 이유': '一个闭环胜过两份分裂记录',
  '식사 쪽 요구사항': '饮食侧要求',
  '운동 쪽 요구사항': '运动侧要求',
  '소비 칼로리 함정': '消耗热量的陷阱',
  '통합 앱이 가장 필요한 사람': '最需要一体化应用的人',
  '트로피 없는 비교 기준': '无奖杯的比较标准',
  '식단·훈련 일상용 IGNITE AI': '面向饮食与训练日常的 IGNITE AI',
  '간단한 통합 주간 점검': '简单的整合周检',
  '브랜드 전에 할 일 정의': '先定义任务，再选品牌',
  'AI 트래커 필수 조건': 'AI 追踪器必备条件',
  '사진 vs 음성 vs 바코드: 기본값 선택': '照片 vs 语音 vs 条码：默认选择',
  '코칭 레이어: 유용한가 잡음인가': '教练层：有用还是噪声',
  '같은 선택에 훈련·체지표': '同一选择中的训练与体成分',
  '스스로에게 거짓 없이 시험': '对自己诚实地试用',
  '혼합 식사자에게 IGNITE AI가 강한 이유': 'IGNITE AI 为何适合混合进食者',
  '쉬운 결정 나무': '简易决策树',
  '매크로 친화 레시피 도구 필수 기능': '宏量友好型食谱工具必备',
  '영양 표시가 있는 요리책 앱': '带营养标注的食谱应用',
  '트래커 내장 레시피·저장 식사': '追踪器内置食谱与保存餐',
  'AI 레시피 도우미: 가드레일과 함께': 'AI 食谱助手：带护栏',
  '장보기 목록·대량 조리 현실': '购物清单与批量烹饪现实',
  '레스토랑 모방 vs 집 매크로': '模仿餐厅 vs 家庭宏量',
  'IGNITE AI: 재료에서 기록된 식사까지': 'IGNITE AI：从食材到已记录餐',
  '주간 레시피→매크로 워크플로': '每周食谱到宏量工作流',
  '앱 보조 감량을 실제로 예측하는 것': '真正预测应用辅助减重的是什么',
  '직선적 적자용 칼로리 일지': '面向直线赤字的卡路里日记',
  '행동·코칭형 앱': '行为与教练型应用',
  '타이핑을 그만두는 사람을 위한 AI 기록': '为不想打字的人准备的 AI 记录',
  '훈련, 걸음, 체중 외 피드백': '训练、步数与体重之外的反馈',
  '감량 마케팅 경고 신호': '减重营销的警告信号',
  'IGNITE AI가 더 건강한 감량을 돕는 법': 'IGNITE AI 如何支持更健康减重',
  '재사용 가능한 선정 체크리스트': '可复用的筛选清单',
  '무료 스캔이 제공해야 할 것': '免费扫描应提供什么',
  '전용 스캐너 vs 풀 트래커': '专用扫描器 vs 完整追踪器',
  'DB 커버리지가 UI보다 중요': '数据库覆盖比界面更重要',
  '완벽한 삑 소리 뒤 분량 함정': '完美提示音后的份量陷阱',
  '예상 무료 한도': '预期的免费限制',
  '바코드보다 라벨이 나을 때': '条码不如标签时',
  '통로 좌절 없이 IGNITE AI': '通道里不挫败的 IGNITE AI',
  '내일 할 장바구니 테스트': '明天的购物篮测试',
  'Android에서 중요한 기준': 'Android 重要标准',
  'Health Connect와 분리된 걸음의 종말': 'Health Connect 与孤立步数的终结',
  'Android의 DB 강자': 'Android 上的数据库强者',
  'Android 하드웨어에서 AI 사진 트래커': 'Android 硬件上的 AI 拍照追踪',
  '위젯, 빠른 설정, 한 손 사용': '小组件、快捷设置与单手使用',
  'OEM 특성: Samsung, Pixel, 보급형': 'OEM 差异：Samsung、Pixel 与入门机',
  'Android에서 IGNITE AI: 매크로 + Health Connect': 'Android 上的 IGNITE AI：宏量 + Health Connect',
  '깨끗한 Android 설치 체크리스트': '干净的 Android 安装清单',
  '쓸 만한 무료 매크로 트래커 필수': '可用免费宏量追踪器必备',
  '무료 클래식 일지: 여전히 유효': '免费经典日记：仍然有效',
  '무료 AI 약속: 세부 읽기': '免费 AI 承诺：读细则',
  '예산 워크플로 매크로 목표': '预算工作流的宏量目标',
  '무료가 부족해질 때': '免费不够用时',
  '사용자 유형별 합리적 선택': '按用户类型的合理选择',
  'IGNITE AI: 무료 습관 표면, Premium AI 핵심': 'IGNITE AI：免费习惯面，Premium AI 核心',
  '14일 무료 등급 스트레스 테스트': '14 天免费层压力测试',
  'MyFitnessPal: DB 중력과 생태계': 'MyFitnessPal：数据库引力与生态',
  'Noom: 행동 커리큘럼 우선': 'Noom：行为课程优先',
  'Lose It!: 더 차분한 클래식 칼로리': 'Lose It!：更安静的经典热量追踪',
  '실제 승부를 가르는 나란한 기준': '决定真实胜负的并排标准',
  '실무에서 누가 무엇을 고를지': '实务中谁选什么',
  'AI 네이티브가 대화를 바꾸는 지점': 'AI 原生如何改变对话',
  'IGNITE AI가 세 앱과 다른 점': 'IGNITE AI 与三者的不同',
  '공정한 일주일 대결': '公平的一周对决',
  '무광고가 포함해야 할 것': '无广告应包含什么',
  '광고 적은 무료 vs 진짜 유료의 차분함': '广告少的免费 vs 真正付费的安静',
  '업그레이드 시 더 조용한 클래식': '升级后更安静的经典体验',
  'AI 우선과 사진 기록의 진짜 비용': 'AI 优先与拍照记录的真实成本',
  '가짜 상 없는 비교 기준': '无假奖杯的比较标准',
  '언제 지불할 가치가 있는지': '何时值得付费',
  'IGNITE AI의 차분한 무광고 기록': 'IGNITE AI 的安静无广告记录',
  '빠른 결정 나무': '快速决策树',
  '검증이 보통 의미하는 것': '“验证”通常指什么',
  '사용자 제출이 돕고 해치는 법': '用户提交如何帮助与伤害',
  '레스토랑 데이터: 실험실이 아닌 관객석': '餐厅数据：观众席而非实验室',
  '집밥: 검증자는 당신': '家常菜：验证者是你',
  '더 깨끗한 일지 데이터 실무 규칙': '更干净日记数据的实务规则',
  'AI 초안과 검증 앵커': 'AI 草稿与验证锚点',
  'IGNITE AI로 더 깨끗한 기록': '用 IGNITE AI 获得更干净的记录',
  '중복·오타 정리 습관': '整理重复与错字的习惯',
};

async function translateKoZh(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('translate fail ' + res.status);
  const data = await res.json();
  return data[0].map((x) => x[0]).join('');
}

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

async function main() {
  const zhPosts = [];
  for (const slug of slugs) {
    const ko = koAll[slug];
    const title = await translateKoZh(ko.title);
    await new Promise((r) => setTimeout(r, 120));
    const description = await translateKoZh(ko.description);
    await new Promise((r) => setTimeout(r, 120));
    const sections = [];
    for (const s of ko.sections) {
      const sec = { body: [] };
      if (s.heading) sec.heading = hZh[s.heading] || (await translateKoZh(s.heading));
      for (const p of s.body) {
        sec.body.push(await translateKoZh(p));
        await new Promise((r) => setTimeout(r, 120));
      }
      sections.push(sec);
    }
    zhPosts.push({ slug, title, date: ko.date, description, sections });
    console.log('translated', slug);
  }

  const existing = fs.readFileSync(path.join(__dirname, 'batch01-cjk.mjs'), 'utf8');
  const zhBlock = `export const batch01Zh = [\n${zhPosts.map(formatPost).join('\n\n')}\n];`;
  fs.writeFileSync(path.join(__dirname, 'batch01-cjk.mjs'), existing.replace(/export const batch01Zh = \[[\s\S]*?\n\];/, zhBlock));
  console.log('patched ZH', zhPosts.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
