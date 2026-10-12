/**
 * 进度模拟：从 1 级开始挂机打一个岗位大类，测「每级要多久」。
 * 运行: node tools/test-progression.mjs
 *
 * 假设：玩家已经买了自动加餐 III、食物管够、会自动买当前能买的最高档装备、
 * 并始终挑战「当前解锁的最高等级敌人」。这是一个偏乐观但接近真实的上限估计。
 */
globalThis.localStorage = {
  _d: {},
  getItem(k) { return this._d[k] ?? null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
};
globalThis.performance = globalThis.performance || { now: () => Date.now() };

const { state, createState, replaceState, addItem, getLevel, addGold, getGold, countItem } = await import('../js/core/state.js');
const { computeStats } = await import('../js/core/modifiers.js');
const { startCombat, tickCombat, isUnlocked } = await import('../js/core/combat.js');
const { ENEMIES } = await import('../js/data/enemies.js');
const { EQUIP_BY_TIER, ITEM_MAP, TIER_PRICE } = await import('../js/data/items.js');
const { xpForLevel, levelFromXp, fmt, fmtTime } = await import('../js/core/xp.js');

const CATEGORY = process.argv[2] || 'rd';
const HOURS = Number(process.argv[3] || 24);

const POOL = ENEMIES.filter((e) => e.category === CATEGORY).sort((a, b) => a.level - b.level);
if (!POOL.length) { console.error('没有这个岗位的敌人:', CATEGORY); process.exit(1); }

const s = createState();
s.upgrades['auto-eat-3'] = true;
s.upgrades['auto-loot'] = true;
replaceState(s);
state.hp = computeStats().maxHp;

const TIER_SLOTS = ['head', 'cape', 'neck', 'weapon', 'offhand', 'body', 'legs', 'hands', 'feet', 'ring'];

/** 自动升级装备：能买得起的最高档，每件只买一次 */
function autoGear() {
  const lv = getLevel(CATEGORY);
  const maxTier = Math.min(8, Math.floor((lv - 1) / 14) + 1);
  for (let t = maxTier; t >= 1; t--) {
    for (const slot of TIER_SLOTS) {
      const pool = (EQUIP_BY_TIER[t] || []).filter((i) => i.slot === slot);
      if (!pool.length) continue;
      const pick = slot === 'weapon'
        ? (pool.find((i) => i.style === 'execution') || pool[0])
        : pool[0];
      const cur = state.equipment[slot];
      const curTier = cur ? (ITEM_MAP[cur]?.tier ?? 0) : 0;
      if (cur && curTier >= t) continue;
      const price = pick.price ?? TIER_PRICE[t - 1];
      if (getGold() < price) continue;
      state.currencies.gold -= price;
      state.equipment[slot] = pick.id;
      return true;
    }
  }
  return false;
}

/** 选当前能打的最高等级敌人 */
function bestEnemy() {
  let pick = POOL[0];
  for (const e of POOL) if (isUnlocked(e)) pick = e;
  return pick;
}

const DT = 200;
const totalSteps = Math.floor((HOURS * 3600 * 1000) / DT);
const timeline = [];
let curId = null;
let lastLevel = 1;
const levelTimes = { 1: 0 };

// 食物补给：按当前等级给对应档位的食物
const FOOD_IDS = ['food-crucian-soup', 'food-pan-whitebait', 'food-braised-carp', 'food-pickled-grasscarp',
  'food-chili-silvercarp', 'food-steamed-bass', 'food-grouper-pot', 'food-tuna-sashimi',
  'food-grilled-sailfish', 'food-kingcrab-feast', 'food-koi-banquet'];

function bestFoodId() {
  const lv = getLevel(CATEGORY);
  return FOOD_IDS[Math.min(10, Math.max(0, Math.floor(lv / 10)))];
}
function refillFood() {
  // 一次性把从入门到当前档位的食物都补满（低档食物便宜，纯属省事）
  const idx = FOOD_IDS.indexOf(bestFoodId());
  for (let i = 0; i <= idx; i++) addItem(FOOD_IDS[i], 20000);
}

refillFood();
addItem('slack-point', 100000);

let elapsed = 0;
let lastDeaths = 0;
let stuckSteps = 0;
for (let step = 0; step < totalSteps; step++) {
  elapsed += DT;
  const target = bestEnemy();
  if (curId !== target.id) {
    if (!state.combat.active || state.combat.enemyId !== target.id) startCombat(target.id);
    curId = target.id;
  }
  const killsBefore = state.stats.totalKills;
  tickCombat(DT);
  if (state.stats.totalKills === killsBefore) stuckSteps++; else stuckSteps = 0;

  // 死亡：只处理一次（旧版本写成 > 0，导致每帧重置战斗，永远打不出伤害）
  if (state.stats.totalDeaths > lastDeaths) {
    lastDeaths = state.stats.totalDeaths;
    state.hp = computeStats().maxHp;
    startCombat(target.id);
  }

  if (step % 50 === 0) {
    autoGear();
    if (countItem(bestFoodId()) < 500) refillFood();
  }

  const lv = getLevel(CATEGORY);
  if (lv > lastLevel) {
    for (let l = lastLevel + 1; l <= lv; l++) levelTimes[l] = elapsed;
    lastLevel = lv;
    if (lv % 5 === 0 || lv >= 95) {
      timeline.push({ lv, t: elapsed, kills: state.stats.totalKills, deaths: state.stats.totalDeaths, gold: state.stats.goldEarned });
    }
  }
}

console.log(`\n=== 岗位「${CATEGORY}」单人挂机进度模拟（${HOURS} 小时，假设已购自动加餐 III）===`);
console.log('等级   累计耗时      累计击杀   死亡   累计工资     当时对手');
for (const row of timeline) {
  const e = ENEMIES.filter((x) => x.category === CATEGORY && x.level <= row.lv + 8).pop();
  console.log(
    `${String(row.lv).padStart(4)}  ${fmtTime(row.t).padStart(12)}  ${String(row.kills).padStart(9)}  ${String(row.deaths).padStart(5)}  ${fmt(row.gold).padStart(11)}   ${e ? e.name + ' Lv' + e.level : ''}`,
  );
}

const finalLv = getLevel(CATEGORY);
console.log(`\n最终等级 ${finalLv} / 100（${HOURS} 小时）`);
console.log(`累计击杀 ${state.stats.totalKills}，死亡 ${state.stats.totalDeaths}，累计工资 ${fmt(state.stats.goldEarned)}`);
if (finalLv >= 2) {
  const segs = [];
  for (let l = 2; l <= Math.min(finalLv, 100); l++) {
    const prev = levelTimes[l - 1] ?? 0;
    const cur = levelTimes[l] ?? levelTimes[finalLv];
    segs.push(cur - prev);
  }
  const avg = segs.reduce((a, b) => a + b, 0) / segs.length;
  console.log(`平均每级耗时 ${fmtTime(avg)}（最快 ${fmtTime(Math.min(...segs))}，最慢 ${fmtTime(Math.max(...segs))}）`);
  const remain = [];
  for (let l = finalLv + 1; l <= 100; l++) {
    const need = xpForLevel(l) - xpForLevel(l - 1);
    remain.push(need);
  }
  const xpPerSec = (state.skills[CATEGORY]) / (elapsed / 1000);
  console.log(`平均经验速度 ${fmt(xpPerSec)}/秒；按此速度剩余 ${remain.length} 级还需约 ${fmtTime((remain.reduce((a, b) => a + b, 0)) / Math.max(1, xpPerSec) * 1000)}`);
}
