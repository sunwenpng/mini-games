// 上线前检查：列出每个传统包离“正式发布”还差什么。用法：node tools/release-check.mjs
// 只读，不改任何文件。有阻塞项时退出码为 1，可接到发布流程里。
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'threshold');
const FILES = [
  'locales/zh-CN.js', 'locales/zh-TW.js', 'locales/en.js', 'data/registry.js',
  'traditions/buddhism.han/pack.js', 'traditions/buddhism.han/content.js',
  'traditions/buddhism.theravada.th/pack.js', 'traditions/buddhism.theravada.th/content.js',
  'traditions/sikhism.gurdwara/pack.js', 'traditions/sikhism.gurdwara/content.js',
  'traditions/buddhism.tibetan/pack.js', 'traditions/buddhism.tibetan/content.js',
  'traditions/buddhism.japan/pack.js', 'traditions/buddhism.japan/content.js',
  'traditions/buddhism.india.navayana/pack.js', 'traditions/buddhism.india.navayana/content.js',
  'traditions/hinduism.ghat/pack.js', 'traditions/hinduism.ghat/content.js',
  'traditions/daoism.mountain/pack.js', 'traditions/daoism.mountain/content.js',
  'traditions/shinto.shrine/pack.js', 'traditions/shinto.shrine/content.js',
  'traditions/christianity.catholic/pack.js', 'traditions/christianity.catholic/content.js',
  'traditions/christianity.orthodox/pack.js', 'traditions/christianity.orthodox/content.js',
  'traditions/christianity.protestant/pack.js', 'traditions/christianity.protestant/content.js',
  'traditions/islam.mosque/pack.js', 'traditions/islam.mosque/content.js',
  'traditions/judaism.shabbat/pack.js', 'traditions/judaism.shabbat/content.js',
  'core/i18n.js', 'core/rights.js',
];
const ctx = { console, Intl, JSON, Math, Object, Array, String };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
const T = ctx.Threshold;

let blockers = 0;
const out = [];
const line = (ok, msg) => {
  if (!ok) blockers++;
  out.push((ok ? '  ✓ ' : '  ✗ ') + msg);
};

for (const pack of Object.values(T.PACKS)) {
  if (pack.status !== 'live' && pack.status !== 'preview') {
    out.push(`\n${pack.id}（${pack.status}）：不开放，跳过`);
    continue;
  }
  out.push(`\n${pack.id}（${pack.status}）`);
  line(pack.status === 'live', '状态是 live（preview 不能正式发布）');
  line(!!pack.review.advisor, '传统顾问：' + (pack.review.advisor || '无'));
  const recs = (T.CONTENT && T.CONTENT[pack.id]) || [];
  const problems = T.Rights.checkContent(recs);
  line(problems.length === 0, `内容字段齐全（${recs.length} 条）` + (problems.length ? '：' + JSON.stringify(problems) : ''));
  const released = T.Rights.releaseFilter(recs);
  line(released.length === recs.length, `内容审校达到 native-reviewed：${released.length}/${recs.length}`);
  for (const r of recs) if (T.Rights.reviewRank(r.reviewStatus) < T.Rights.reviewRank('native-reviewed')) out.push(`      · ${r.id}：${r.reviewStatus}`);
  const bad = T.Rights.checkPackVoices(pack);
  line(bad.length === 0, '可选声音的权利链齐全' + (bad.length ? '：' + bad.join(', ') : ''));
  const owned = pack.options.voice.filter(o => (T.VOICES[o.id] || {}).kind === 'owned');
  line(owned.some(o => o.state !== 'off'), '至少有一段可用的自有录音（' + owned.map(o => o.id).join(', ') + '）');
  for (const o of pack.options.ui) {
    if (o.state === 'off') continue;
    const loc = T.LOCALES.find(l => l.id === o.id);
    line(o.state === 'ok' && loc && loc.status === 'ok', `界面语言 ${o.id}：${o.state} / ${loc ? loc.status : '?'}`);
  }
  for (const o of pack.options.translation) if (o.state === 'draft') line(false, `对照译文 ${o.id} 仍是草稿`);
  line(pack.rules.adsInSacredSpace === false && pack.rules.practicesYieldCurrency === false, '神圣空间无广告、修行不产出货币');
}

for (const id of T.UI_LOCALES) {
  const loc = T.LOCALES.find(l => l.id === id);
  if (loc.status === 'pseudo') continue;
  if (loc.status !== 'ok') out.push(`\n平台语言 ${id}：${loc.status}（发布前需母语审校）`);
}

console.log('启扉上线检查' + out.join('\n'));
console.log(`\n阻塞项：${blockers}`);
process.exitCode = blockers ? 1 : 0;
