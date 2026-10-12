/**
 * 无头模拟测试：验证经验曲线、战斗数值、掉落、活动产出是否合理
 * 运行: node tools/test-sim.mjs
 */
globalThis.localStorage = {
  _d: {},
  getItem(k) { return this._d[k] ?? null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
};
globalThis.performance = globalThis.performance || { now: () => Date.now() };

const { state, addXp, getLevel, addItem, countItem, replaceState, createState, addGold } = await import('../js/core/state.js');
const { XP_TABLE, xpForLevel, levelFromXp, fmt, fmtTime } = await import('../js/core/xp.js');
const { computeStats, hitChance } = await import('../js/core/modifiers.js');
const { startCombat, tickCombat } = await import('../js/core/combat.js');
const engine = await import('../js/core/engine.js');
const { ENEMIES, ENEMY_MAP } = await import('../js/data/enemies.js');
const { ITEM_MAP, EQUIP_BY_TIER, EQUIPMENT } = await import('../js/data/items.js');
const { ACTIVITIES_BY_SKILL } = await import('../js/data/activities.js');

const line = (s) => console.log('\n' + '='.repeat(60) + '\n' + s + '\n' + '='.repeat(60));

// ---------------------------------------------------------------- 1. 经验表
line('1. 经验曲线');
const checks = [[2, 83], [50, 101333], [92, 6517253], [99, 13034431], [100, 14391160]];
for (const [lv, expect] of checks) {
  const got = xpForLevel(lv);
  console.log(`Lv${String(lv).padStart(3)}  期望 ${String(expect).padStart(9)}  实际 ${String(got).padStart(9)}  ${got === expect ? '✅' : '❌'}`);
}
console.log(`levelFromXp(14391160) = ${levelFromXp(14391160)} (应为 100)`);

// ---------------------------------------------------------------- 2. 面板
line('2. 玩家面板（各阶段）');
function setup(levels, gearTier, extra = {}) {
  const s = createState();
  for (const [k, v] of Object.entries(levels)) s.skills[k] = xpForLevel(v);
  Object.assign(s.permanent, extra.permanent || {});
  s.inspiration = extra.inspiration || {};
  replaceState(s);
  if (gearTier) {
    for (const slot of ['head', 'cape', 'neck', 'weapon', 'offhand', 'body', 'legs', 'hands', 'feet', 'ring']) {
      const pool = EQUIP_BY_TIER[gearTier].filter((e) => e.slot === slot);
      if (pool.length) s.equipment[slot] = pool[0].id;
    }
  }
  s.hp = 999999;
  return computeStats();
}

const stages = [
  ['新手 全1级 无装备', 1, 0],
  ['前期 全20级', 20, 0],
  ['中期 全50级', 50, 0],
  ['后期 全80级', 80, 0],
  ['满级 全99级', 99, 0],
];

for (const [name, lv, _x] of stages) {
  const lvls = { execution: lv, pressure: lv, numbness: lv, energy: lv, communication: lv, presentation: lv, slacking: lv, scapegoat: lv, rd: lv, sales: lv, service: lv, supply: lv, finance: lv, legal: lv, hr: lv };
  const tier = lv === 1 ? 0 : Math.min(8, Math.floor((lv - 1) / 14) + 1);
  const st = setup(lvls, tier);
  console.log(`${name.padEnd(18)} 档位T${tier} 精力=${String(st.maxHp).padStart(6)} 减伤=${st.dr.toFixed(1)}% 命中等级=${String(st.accuracy.execution).padStart(8)} 闪避=${String(st.evasion).padStart(9)} 最大伤害=${String(st.maxHit.execution).padStart(7)} 攻速=${st.interval}ms 职场Lv=${st.combatLevel}`);
}

// ---------------------------------------------------------------- 3. 对位战斗
line('3. 典型对位：命中率与击杀耗时');
function simulate(enemyId, seconds = 300) {
  const enemy = ENEMY_MAP[enemyId];
  const lv = Math.max(1, enemy.level - 5);
  const tier = Math.min(8, Math.max(1, Math.floor((enemy.level - 1) / 14) + 1));
  const levels = {};
  for (const k of ['execution', 'pressure', 'numbness', 'energy', 'communication', 'presentation', 'slacking', 'scapegoat', 'rd', 'sales', 'service', 'supply', 'finance', 'legal', 'hr']) levels[k] = lv;
  levels[enemy.category] = Math.max(lv, enemy.level);
  const st = setup(levels, tier);
  state.upgrades['auto-eat-3'] = true;
  state.upgrades['auto-loot'] = true;
  // 备足该等级段最高档的食物
  const food = ITEM_MAP[`food-${['crucian-soup', 'pan-whitebait', 'braised-carp', 'pickled-grasscarp', 'chili-silvercarp', 'steamed-bass', 'grouper-pot', 'tuna-sashimi', 'grilled-sailfish', 'kingcrab-feast', 'koi-banquet'][Math.min(10, Math.max(0, Math.ceil(enemy.level / 10) - 1))]}`];
  if (food) addItem(food.id, 20000);
  state.hp = st.maxHp;
  startCombat(enemyId);
  let kills = 0, deaths = 0;
  const stats = computeStats();
  const hitOnEnemy = hitChance(stats.accuracy[stats.style], enemy.evasion);
  const hitOnPlayer = hitChance(enemy.accuracy, stats.evasion);
  for (let t = 0; t < seconds * 1000; t += 200) {
    const before = state.stats.totalKills;
    const dBefore = state.stats.totalDeaths;
    tickCombat(200);
    if (state.stats.totalKills > before) kills++;
    if (state.stats.totalDeaths > dBefore) { deaths++; state.hp = computeStats().maxHp; startCombat(enemyId); }
  }
  const dps = (kills * enemy.hp) / seconds;
  const hitsToKill = enemy.hp / Math.max(1, stats.maxHit[stats.style]);
  return { enemy, hitOnEnemy, hitOnPlayer, kills, deaths, dps, hitsToKill, stats };
}

const pairs = ['vague-req', 'tech-debt-drake', 'perf-bottleneck', 'refactor-dragon', 'blackswan-outage', 'geopolitics'];
for (const id of pairs) {
  const r = simulate(id, 300);
  const e = r.enemy;
  const killTime = r.kills ? 300 / r.kills : Infinity;
  console.log(
    `${(e.name + ' Lv' + e.level).padEnd(20)} HP=${String(e.hp).padStart(9)} 理论刀数=${r.hitsToKill.toFixed(1).padStart(5)} 我命中=${(r.hitOnEnemy * 100).toFixed(0)}% 敌命中=${(r.hitOnPlayer * 100).toFixed(0)}%  5分钟击杀=${String(r.kills).padStart(3)} 死亡=${r.deaths}  实测耗时=${killTime === Infinity ? '打不死' : fmtTime(killTime * 1000)}`,
  );
}

// ---------------------------------------------------------------- 4. 装备掉落分布
line('4. 掉落：1 小时挂机收益（Lv50 性能瓶颈）');
{
  const enemy = ENEMY_MAP['perf-bottleneck'];
  const lv = 56;
  const levels = { execution: lv, pressure: lv, numbness: lv, energy: lv, communication: lv, presentation: lv, slacking: lv, scapegoat: lv, rd: lv, sales: lv, service: lv, supply: lv, finance: lv, legal: lv, hr: lv };
  const st = setup(levels, 4);
  state.upgrades['auto-eat-3'] = true;
  state.upgrades['auto-loot'] = true;
  addItem('food-grouper-pot', 20000);
  state.hp = st.maxHp;
  state.skills['rd'] = xpForLevel(70);
  const xp0 = state.skills['rd'];
  startCombat('perf-bottleneck');
  const g0 = state.stats.goldEarned, i0 = state.stats.itemsGained;
  for (let t = 0; t < 3600 * 1000; t += 200) {
    tickCombat(200);
    if (state.stats.totalDeaths > 0) break;
  }
  const lvBefore = 56, lvAfter = levelFromXp(state.skills['rd']);
  console.log(`击杀 ${state.stats.totalKills} 次，死亡 ${state.stats.totalDeaths} 次，金钱 +${fmt(state.stats.goldEarned - g0)}，物品 +${state.stats.itemsGained - i0}`);
  console.log(`研发等级：56 → ${lvAfter}（1 小时提升 ${lvAfter - lvBefore} 级，即约 ${(60 / Math.max(1, lvAfter - lvBefore)).toFixed(1)} 分钟/级）`);
  const inv = Object.entries(state.bank).filter(([k]) => !['fitness-point', 'knowledge', 'network'].includes(k)).map(([k, v]) => `${ITEM_MAP[k]?.name}×${v}`).slice(0, 12);
  console.log('背包:', inv.join(', '));
}

// ---------------------------------------------------------------- 5. 活动产出
line('5. 爱好活动产出（1 小时，各技能 50 级）');
for (const skill of ['fishing', 'cooking', 'fitness', 'art', 'gaming', 'investment', 'reading', 'social']) {
  const list = ACTIVITIES_BY_SKILL[skill];
  const act = list.filter((a) => a.level <= 50).pop();
  if (!act) continue;
  const s = createState();
  for (const k of Object.keys(s.skills)) s.skills[k] = xpForLevel(50);
  replaceState(s);
  // 给足材料（烹饪需要鱼）
  for (const f of ['fish-crucian', 'fish-whitebait', 'fish-carp', 'fish-grasscarp', 'fish-silvercarp', 'fish-seabass', 'fish-grouper']) addItem(f, 99999);
  const g0 = state.stats.goldEarned, i0 = state.stats.itemsGained;
  const xp0 = state.skills[skill];
  engine.startActivity(act.id);
  for (let t = 0; t < 3600 * 1000; t += 200) engine.update(200);
  const gained = Object.entries(state.bank)
    .map(([k, v]) => [ITEM_MAP[k]?.name || k, v])
    .filter(([n]) => n !== '工资');
  const invStr = gained.slice(0, 5).map(([n, v]) => `${n}×${v}`).join(' ');
  console.log(
    `${skill.padEnd(11)} ${act.name.padEnd(8)} 工资+${String(fmt(state.stats.goldEarned - g0)).padStart(8)}  经验+${String(fmt(state.skills[skill] - xp0)).padStart(8)}  ${invStr}`,
  );
}

// ---------------------------------------------------------------- 6. 全敌人一览
line('6. 敌人数据抽查');
console.log(`敌人总数 ${ENEMIES.length}`);
for (const e of [ENEMIES[0], ENEMIES[10], ENEMIES[40], ENEMIES[88]]) {
  console.log(`${e.name.padEnd(16)} Lv${String(e.level).padStart(3)} ${e.kind.padEnd(7)} HP=${String(e.hp).padStart(9)} 命中=${String(e.accuracy).padStart(7)} 闪避=${String(e.evasion).padStart(7)} 伤害=${String(e.maxHit).padStart(6)} 减伤=${e.dr}% 金钱=${e.gold} 风格=${e.style}`);
}
console.log('\n✅ 模拟完成');
