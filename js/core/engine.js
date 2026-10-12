/**
 * 主循环与业务逻辑：活动执行、摸鱼扣点、离线结算、背锅任务、商店、灵感工坊
 */
import {
  state, addXp, addItem, removeItem, hasItem, countItem, addGold, addSlack, addCoins,
  pushLog, save, getLevel, bankUsed, bankSlots,
} from './state.js';
import { computeStats, collectModifiers, addBuff, maxPrayers, offlineRate } from './modifiers.js';
import { tickCombat, startCombat, stopCombat } from './combat.js';
import { ACTIVITY_MAP } from '../data/activities.js';
import { ENEMIES, ENEMY_MAP } from '../data/enemies.js';
import { ITEM_MAP, SHOP_ITEMS, SHOP_UPGRADES, EQUIP_BY_TIER } from '../data/items.js';
import { PRAYER_MAP } from '../data/prayers.js';
import { SLAYER_TIERS, tierFor, taskReward, CANCEL_PENALTY } from '../data/slayer.js';
import { INSPIRATION_MAP, inspCost } from '../data/inspiration.js';
import { levelFromXp } from './xp.js';

const randInt = (a, b) => Math.floor(a + Math.random() * (b - a + 1));

// ================================================================ 活动
export function startActivity(id) {
  const act = ACTIVITY_MAP[id];
  if (!act) return false;
  if (getLevel(act.skill) < act.level) return false;
  stopCombat();
  state.activity.active = true;
  state.activity.id = id;
  state.activity.progress = 0;
  return true;
}

export function stopActivity(reason) {
  if (!state.activity.active) return;
  state.activity.active = false;
  state.activity.id = null;
  state.activity.progress = 0;
  if (reason) pushLog(reason, 'warn');
}

/** 执行一次活动动作 */
function doActivity(act, mods) {
  // 检查并消耗材料
  if (act.inputs) {
    for (const inp of act.inputs) {
      if (!hasItem(inp.item, inp.qty)) {
        stopActivity(`⚠️ 材料不足：${ITEM_MAP[inp.item]?.name || inp.item}，已停止「${act.name}」`);
        return false;
      }
    }
    for (const inp of act.inputs) removeItem(inp.item, inp.qty);
  }

  const xpMul = 1 + mods.xpBonus / 100;
  addXp(act.skill, act.xp * xpMul);

  // 产出
  if (act.outputs) {
    for (const o of act.outputs) {
      if (Math.random() * 100 > o.chance) continue;
      let id = o.item;
      if (id === 'EQUIP') {
        const pool = EQUIP_BY_TIER[o.tier] || EQUIP_BY_TIER[1];
        id = pool[randInt(0, pool.length - 1)].id;
      }
      addItem(id, randInt(o.min, o.max));
    }
  }

  // 直接产金（理财 / 健身 / 社交）
  if (act.gold) {
    let g = randInt(act.gold[0], act.gold[1]);
    const goldMul = 1 + mods.goldBonus / 100;

    // 理财风险：有概率亏掉本次收益
    if (act.risk && Math.random() < act.risk) {
      addGold(-g);
      return true;
    }
    addGold(Math.floor(g * goldMul));
  }
  return true;
}

// ================================================================ 摸鱼
export function togglePrayer(id) {
  const p = PRAYER_MAP[id];
  if (!p) return false;
  const idx = state.prayers.indexOf(id);
  if (idx >= 0) {
    state.prayers.splice(idx, 1);
    return true;
  }
  if (getLevel('slacking') < p.level) return false;
  if (state.prayers.length >= maxPrayers()) return false;
  state.prayers.push(id);
  return true;
}

function drainPrayers(dt) {
  if (!state.prayers.length) return;
  let total = 0;
  for (const id of state.prayers) total += PRAYER_MAP[id]?.drain || 0;
  const cost = (total * dt) / 1000;
  if ((state.currencies['slack-point'] || 0) < cost) {
    const names = state.prayers.map((p) => PRAYER_MAP[p].name).join('、');
    state.prayers = [];
    pushLog(`🐟 摸鱼点耗尽，${names} 已自动关闭`, 'warn');
    return;
  }
  addSlack(-cost);
  // 摸鱼经验
  addXp('slacking', cost * 8);
}

// ================================================================ 临时增益
function expireBuffs() {
  const now = Date.now();
  const before = state.buffs.length;
  state.buffs = state.buffs.filter((b) => b.expiresAt > now);
  return before - state.buffs.length;
}

// ================================================================ 主循环
let rafId = null;
let lastFrame = 0;
let saveAcc = 0;
let lastSlowTick = 0;

export function startLoop(onTick) {
  lastFrame = performance.now();
  const frame = (now) => {
    const dt = Math.min(now - lastFrame, 5000);
    lastFrame = now;
    update(dt);
    if (onTick) { try { onTick(dt); } catch (e) { console.error(e); } }
    rafId = requestAnimationFrame(frame);
  };
  rafId = requestAnimationFrame(frame);
}

export function stopLoop() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

export function update(dt) {
  state.playTime += dt;
  const mods = collectModifiers();

  // 活动
  if (state.activity.active) {
    const act = ACTIVITY_MAP[state.activity.id];
    if (!act) stopActivity();
    else {
      state.activity.progress += dt;
      let guard = 0;
      while (state.activity.active && state.activity.progress >= act.interval && guard++ < 200) {
        state.activity.progress -= act.interval;
        doActivity(act, mods);
      }
    }
  }

  // 战斗
  tickCombat(dt);

  // 摸鱼扣点
  drainPrayers(dt);

  // 增益过期
  expireBuffs();

  // 精力自然回复（非战斗时）
  if (!state.combat.active) {
    const stats = computeStats();
    if (state.hp < stats.maxHp) {
      state.hp = Math.min(stats.maxHp, state.hp + (stats.maxHp * dt) / 60000);
    }
  }

  // 自动存档
  saveAcc += dt;
  if (saveAcc > 10000) { saveAcc = 0; save(); }
}

// ================================================================ 离线结算
export function applyOffline() {
  const now = Date.now();
  const elapsed = Math.min(now - (state.lastTick || now), 24 * 3600 * 1000);
  if (elapsed < 60000) { state.lastTick = now; return null; }

  const rate = offlineRate() / 100;
  const effective = elapsed * rate;
  const summary = { elapsed, effective, xp: 0, items: 0, gold: 0, kills: 0, deaths: 0 };

  const beforeGold = state.stats.goldEarned;
  const beforeKills = state.stats.totalKills;
  const beforeDeaths = state.stats.totalDeaths;
  const beforeItems = state.stats.itemsGained;

  if (state.activity.active) {
    const act = ACTIVITY_MAP[state.activity.id];
    if (act) {
      const count = Math.min(20000, Math.floor(effective / act.interval));
      const mods = collectModifiers();
      for (let i = 0; i < count && state.activity.active; i++) doActivity(act, mods);
    }
  } else if (state.combat.active) {
    // 简化模拟：按 1 秒步长推进战斗
    const steps = Math.min(28800, Math.floor(effective / 1000));
    for (let i = 0; i < steps && state.combat.active; i++) tickCombat(1000);
  }

  summary.gold = state.stats.goldEarned - beforeGold;
  summary.kills = state.stats.totalKills - beforeKills;
  summary.deaths = state.stats.totalDeaths - beforeDeaths;
  summary.items = state.stats.itemsGained - beforeItems;
  summary.xp = Object.values(state.skills).reduce((a, b) => a + b, 0);

  state.lastTick = now;
  pushLog(`🌙 离线 ${Math.round(elapsed / 60000)} 分钟，按 ${offlineRate()}% 效率结算`, 'info');
  return summary;
}

// ================================================================ 背锅任务
export function newTask() {
  const lv = getLevel('scapegoat');
  const tier = tierFor(lv);
  const pool = ENEMIES.filter(
    (e) => e.level <= tier.maxEnemyLevel && e.category !== 'world',
  );
  if (!pool.length) return null;
  const enemy = pool[randInt(0, pool.length - 1)];
  const count = randInt(tier.count[0], tier.count[1]);
  state.slayer.task = { enemyId: enemy.id, count, progress: 0, done: false, tierName: tier.name };
  return state.slayer.task;
}

export function claimTask() {
  const task = state.slayer.task;
  if (!task || !task.done) return null;
  const enemy = ENEMY_MAP[task.enemyId];
  const tier = tierFor(getLevel('scapegoat'));
  const r = taskReward(enemy, task.count, tier);
  addCoins(r.coins);
  addGold(r.gold);
  addXp('scapegoat', r.xp);
  state.stats.tasksDone++;
  state.slayer.task = null;
  pushLog(`🍳 领取「${tier.name}」奖励：${r.coins} 背锅币 + 💴${r.gold}`, 'level');
  return r;
}

export function cancelTask() {
  const task = state.slayer.task;
  if (!task) return false;
  const penalty = Math.floor((state.currencies['scapegoat-coin'] || 0) * CANCEL_PENALTY);
  if (penalty > 0) addCoins(-penalty);
  state.slayer.task = null;
  pushLog(`🍳 放弃了锅，损失 ${penalty} 背锅币`, 'warn');
  return true;
}

// ================================================================ 商店
export function buyShopItem(itemId, qty = 1) {
  const entry = SHOP_ITEMS.find((s) => s.item === itemId);
  if (!entry) return false;
  const cost = entry.price * qty;
  if ((state.currencies.gold || 0) < cost) return false;
  addGold(-cost);
  addItem(itemId, qty);
  return true;
}

export function sellItem(itemId, qty = 1) {
  const item = ITEM_MAP[itemId];
  if (!item || !countItem(itemId)) return false;
  const n = Math.min(qty, countItem(itemId));
  removeItem(itemId, n);
  addGold(Math.floor(item.price * n * 0.6));
  return true;
}

export function buySlayerItem(itemId, slayerPrice) {
  if ((state.currencies['scapegoat-coin'] || 0) < slayerPrice) return false;
  if (ITEM_MAP[itemId]?.type === 'equip' && !state.bank[itemId] && bankUsed() >= bankSlots()) return false;
  addCoins(-slayerPrice);
  addItem(itemId, 1);
  return true;
}

export function buyUpgrade(id) {
  const up = SHOP_UPGRADES.find((u) => u.id === id);
  if (!up || state.upgrades[id]) return false;
  if (up.requires && !state.upgrades[up.requires]) return false;
  if ((state.currencies.gold || 0) < up.price) return false;
  addGold(-up.price);
  state.upgrades[id] = true;
  pushLog(`🛠️ 已购买升级：${up.name}`, 'level');
  return true;
}

// ================================================================ 灵感工坊
export function buyInspiration(id) {
  const def = INSPIRATION_MAP[id];
  if (!def) return false;
  state.inspiration ||= {};
  const lv = state.inspiration[id] || 0;
  if (lv >= def.max) return false;
  const cost = inspCost(def, lv);
  if (countItem('inspiration') < cost) return false;
  removeItem('inspiration', cost);
  state.inspiration[id] = lv + 1;
  return true;
}

// ================================================================ 消耗品
export function useConsumable(itemId) {
  const item = ITEM_MAP[itemId];
  if (!item || !countItem(itemId)) return false;

  if (item.give) {
    removeItem(itemId, 1);
    for (const [k, v] of Object.entries(item.give)) {
      if (k === 'slack-point') addSlack(v);
      else addItem(k, v);
    }
    return true;
  }

  if (item.type !== 'special' && item.type !== 'food') return false;
  removeItem(itemId, 1);

  const stats = computeStats();
  if (item.heal) state.hp = Math.min(stats.maxHp, state.hp + item.heal);
  if (item.buff) addBuff(item.buff.stat, item.buff.value, item.buff.duration, item.name);
  if (item.penalty) addBuff(item.penalty.stat, item.penalty.value, item.penalty.duration, item.name + '(副作用)');
  return true;
}

/** 背包一键出售某类型 */
export function sellAllOfType(type) {
  let total = 0;
  for (const id of Object.keys(state.bank)) {
    const it = ITEM_MAP[id];
    if (!it || it.type !== type) continue;
    const n = state.bank[id];
    total += Math.floor(it.price * n * 0.6);
    delete state.bank[id];
  }
  if (total > 0) addGold(total);
  return total;
}
