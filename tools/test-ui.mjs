/**
 * UI 冒烟测试：用最小 DOM stub 把每个视图渲染一遍，抓运行时错误。
 * 运行: node tools/test-ui.mjs
 */
const fakeEl = () => ({
  innerHTML: '', textContent: '', value: '', style: {}, dataset: {}, scrollTop: 0,
  classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
  appendChild() {}, remove() {}, addEventListener() {}, closest() { return null; },
  querySelector() { return null; }, querySelectorAll() { return []; },
});

globalThis.localStorage = {
  _d: {},
  getItem(k) { return this._d[k] ?? null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
};
globalThis.performance = globalThis.performance || { now: () => Date.now() };
globalThis.document = {
  querySelector: () => fakeEl(),
  querySelectorAll: () => [],
  createElement: () => fakeEl(),
  addEventListener() {},
  getElementById: () => fakeEl(),
  body: fakeEl(),
  hidden: false,
  readyState: 'complete',
};
globalThis.window = { innerWidth: 1200, addEventListener() {}, location: { hash: '' } };
globalThis.location = { hash: '' };
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const { VIEWS } = await import('../js/ui/views.js');
const { state, replaceState, createState, addItem, addXp } = await import('../js/core/state.js');
const { xpForLevel } = await import('../js/core/xp.js');
const { ENEMIES } = await import('../js/data/enemies.js');
const { EQUIP_BY_TIER } = await import('../js/data/items.js');

// 造一个「玩了一段时间」的存档，覆盖各种已解锁状态
function makeSave() {
  const s = createState();
  for (const k of Object.keys(s.skills)) s.skills[k] = xpForLevel(60);
  s.currencies.gold = 5_000_000;
  s.currencies['slack-point'] = 5000;
  s.currencies['scapegoat-coin'] = 3000;
  s.permanent.fitness = 120;
  s.permanent.knowledge = 800;
  s.permanent.network = 600;
  s.upgrades['auto-eat-2'] = true;
  s.upgrades['auto-loot'] = true;
  s.inspiration['insp-xp'] = 3;
  s.slayer.task = { enemyId: 'perf-bottleneck', count: 20, progress: 7, done: false };
  return s;
}

const save = makeSave();
replaceState(save);
for (const e of ENEMIES.slice(0, 30)) addItem(e.drops.find((d) => d.item === 'slack-point') ? 'slack-point' : 'gold', 5);
for (let t = 1; t <= 5; t++) for (const it of (EQUIP_BY_TIER[t] || []).slice(0, 4)) addItem(it.id, 1);
addItem('fish-crucian', 500);
addItem('food-crucian-soup', 500);
addItem('milktea-common', 200);
addItem('inspiration', 5000);
addItem('dopamine', 500);
addItem('art-painting', 3);
addItem('knowledge', 100);
addItem('network', 100);
addItem('fitness-point', 100);

const CASES = [
  ['overview', null],
  ['combat', 'rd'],
  ['combat', 'sales'],
  ['combat', 'service'],
  ['combat', 'supply'],
  ['combat', 'finance'],
  ['combat', 'legal'],
  ['combat', 'hr'],
  ['combat', 'world'],
  ['skill', 'fishing'],
  ['skill', 'cooking'],
  ['skill', 'fitness'],
  ['skill', 'art'],
  ['skill', 'gaming'],
  ['skill', 'investment'],
  ['skill', 'reading'],
  ['skill', 'social'],
  ['bank', null],
  ['equip', null],
  ['shop', null],
  ['prayer', null],
  ['slayer', null],
  ['inspiration', null],
  ['settings', null],
];

let fails = 0;
const warn = [];

for (const [view, param] of CASES) {
  const v = VIEWS[view];
  if (!v) { console.log(`❌ 视图缺失: ${view}`); fails++; continue; }
  let out;
  try {
    out = v.render(param);
  } catch (e) {
    console.log(`❌ ${view}${param ? ':' + param : ''} render 抛错: ${e.message}`);
    console.log('   ', e.stack.split('\n')[1]?.trim());
    fails++;
    continue;
  }
  const html = out?.html ?? '';
  if (typeof html !== 'string' || html.length < 20) {
    console.log(`❌ ${view}${param ? ':' + param : ''} 渲染结果为空`);
    fails++;
    continue;
  }
  const label = `${view}${param ? ':' + param : ''}`;
  if (html.includes('undefined')) { warn.push(`${label} 含 "undefined"`); }
  if (html.includes('NaN')) { warn.push(`${label} 含 "NaN"`); }
  if (html.includes('[object Object]')) { warn.push(`${label} 含 "[object Object]"`); }
  console.log(`✅ ${label.padEnd(22)} ${String(html.length).padStart(6)} 字符  live:${Object.keys(out.live || {}).length}`);
}

// 测一遍所有 action 是否都指向存在的函数
console.log('\n--- actions 检查 ---');
for (const [view] of CASES) {
  const v = VIEWS[view];
  if (!v?.actions) continue;
  const html = v.render(CASES.find(([a]) => a === view)?.[1] ?? null)?.html ?? '';
  const used = new Set([...html.matchAll(/data-action="([^"]+)"/g)].map((m) => m[1]));
  for (const a of used) {
    if (typeof v.actions[a] !== 'function') {
      console.log(`❌ ${view} 模板用了 data-action="${a}"，但没有对应处理函数`);
      fails++;
    }
  }
}
console.log('actions 检查完成');

if (warn.length) {
  console.log('\n--- 可疑输出 ---');
  for (const w of warn) console.log('⚠️ ', w);
}

// ---------------------------------------------------------------- 启动流程
console.log('\n--- 启动流程（bootApp + 一帧主循环）---');
try {
  let frames = 0;
  globalThis.requestAnimationFrame = (fn) => { if (frames++ < 3) fn(Date.now() + frames * 16); return frames; };
  const { bootApp, go } = await import('../js/ui/app.js');
  bootApp();
  for (const r of [['overview'], ['combat', 'rd'], ['skill', 'fishing'], ['bank'], ['equip'], ['shop'], ['prayer'], ['slayer'], ['inspiration'], ['settings']]) {
    go(r[0], r[1] ?? null);
  }
  console.log(`✅ bootApp + 路由切换 10 个页面正常（主循环跑了 ${frames} 帧）`);
} catch (e) {
  console.log(`❌ 启动流程抛错: ${e.message}`);
  console.log('   ', e.stack.split('\n').slice(1, 4).join('\n    '));
  fails++;
}

console.log(`\n${fails === 0 ? '✅' : '❌'} UI 冒烟测试结束：${fails} 个错误，${warn.length} 个警告`);
process.exit(fails ? 1 : 0);
