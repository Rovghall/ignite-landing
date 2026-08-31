#!/usr/bin/env node
/** Build _ja-from-zh-map.json: native JA sections mirroring ZH fix modules */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { zhPosts1_5 } from './_native-zh-1-5.mjs';
import { zh6_20_p1 } from './_native-zh-6-20-p1.mjs';
import { fixesZh7_14 } from './_fix-zh-7-14.mjs';
import { fixesZh15_20 } from './_fix-zh-15-20.mjs';
import { fixesJa } from './_fix-ja-11-20.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zh = { ...zhPosts1_5, ...zh6_20_p1, ...fixesZh7_14, ...fixesZh15_20 };

// Native JA overrides per slug (full sections). Post 11 uses fixesJa.
const jaOverride = {
  'best-app-diet-and-exercise-2026': fixesJa['best-app-diet-and-exercise-2026'].sections,
  'calorie-tracker-without-subscription-2026': [
    { body: ['はい、2026年もサブスクなしのカロリートラッカーはあります——ただし条件付きです。「サブスクなし」は、広告付き永久無料、買い切り、最新の記録ツールが必要になるまで使える無料プランを指すことがあります。無制限 AI 写真ログを保証しません。', 'この質問はサブスク疲れが本物だから来ます。食事中のペイウォール後にも来ます。有用な答えは、記録の必需品と「あれば便利」を分け、無料ツールが静かに失敗する所を認めることです。', '以下は実用マップ：無料でできること、失いがちなこと、IGNITE AI Premium が別の妥協無料日記より合うか。'] },
    { heading: '価格の前に仕事を定義', body: ['仕事が「包装食品を数え鶏むねを量る」なら無料 DB アプリで足りることが多い。「1分でテイクアウトボウルをログ」なら AI キャプチャ——その一式は永久無料は稀です。', '週に最も多い5食を書き、ランディングの機能リストではなくその食で評価してください。'] },
    { heading: 'よくある無料の代償', body: ['広告、スキャン上限、履歴エクスポート制限、遅いサポート、弱いレシピツールを想定してください。寛大なアプリも、無料を通常 Premium 日記より高いコーチングサブの入り口にするものもあります。', '1週間データ入力前にペイウォールを読んでください。食履歴移行は面倒で、おとり替えは1日目から正直な Premium より痛いです。'] },
    { heading: '買い切りの神話', body: ['買い切りは完璧に聞こえますが、DB が古くなり、OS 変更でスキャナが壊れ、「 lifetime 」がクラウド同期を含まない——あり得ます。実際の包含を確認してください。', '更新を出す公正なサブが、6ヶ月で使い古す dead lifetime より健全なこともあります。'] },
    { heading: 'サブスクなしワークフローの構築', body: ['リピートを標準化し、カスタム食品を保存し、油・ナッツバターはキッチン秤で。外食日は意図的な推定——同店同注文——グラム完璧より。', '推定の幅を受け入れてください。脂肪減は毎一口の法廷証拠より、週の方向への正直さが必要です。'] },
    { heading: 'サブスクが合理的な買い物のとき', body: ['無料ログが継続力を削るとき払いましょう。写真・ラベル AI が10分の家事を30秒の下書き+1回修正にすれば、サブは一貫性を買うことです。', 'IGNITE AI は事前に明確：Snap Track AI、AI Lab、Diet planner 等 Premium。存在しない秘密の永久無料 AI tier を探さないでください。'] },
    { heading: '人々が実際に使うハイブリッド', body: ['食料品は無料バーコード日記、夕食は Premium 写真——二重入力がまたやめる理由になるまで機能します。一つの記録の単一ソースを優先。', 'テスト中に一時ハイブリッドなら2週間期限で勝者を選び定番食品を移行。'] },
    { heading: 'プライバシーと広告という隠れコスト', body: ['無料トラッカーは何らかの形で収益化します。権限、広告ネットワーク、日記が学習データになるか確認。「無料」≠「代価なし」。', 'プライバシー政策が明確な有料製品が、紙の上の無料より落ち着いた選択のことも。'] },
    { heading: 'まとめ', body: ['食事が無料ツールに合い代償を受け入れなら2026もサブスクなし可能。全機能無料 AI 写真が広くあるとは pretend しない。', 'ワークフローが持つなら無料；混合食ログ完了が real deficit のボトルネックなら IGNITE AI Premium。'] },
  ],
};

const out = {};
for (const [slug, post] of Object.entries(zh)) {
  if (jaOverride[slug]) {
    out[slug] = jaOverride[slug];
    continue;
  }
  // Fallback: use ZH structure with heading from zh, mark for manual ja body - NOT acceptable
  out[slug] = post.sections.map((s) => ({
    heading: s.heading,
    body: s.body.map((p) => '[JA-TODO] ' + p.slice(0, 40)),
  }));
}

fs.writeFileSync(path.join(__dirname, '_ja-from-zh-map.json'), JSON.stringify(out, null, 2));
console.log('Wrote map', Object.keys(out).length, 'overrides', Object.keys(jaOverride).length);
