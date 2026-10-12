/**
 * 战斗系统
 *
 * 玩家与敌人各自独立计时出手；命中率用 Melvor 的 acc/eva 对比公式；
 * 伤害在 [1, 最大伤害] 之间随机，再减去对方减伤。
 * 战斗三角：执行力 > 沟通力 > 汇报力 > 执行力，双向生效。
 */
import { state, getLevel, addXp, addItem, addGold, addSlack, pushLog, removeItem, countItem, unequip } from './state.js';
import { computeStats, hitChance, triangleMul } from './modifiers.js';
import { ENEMY_MAP, FOOD_BY_TIER } from '../data/enemies.js';
import { ITEM_MAP, EQUIP_BY_TIER } from '../data/items.js';
import { scapegoatDamageBonus } from '../data/slayer.js';

const RESPAWN_MS = 3000;

const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => Math.floor(rand(a, b + 1));

// ---------------------------------------------------------------- 解锁
/** 敌人是否已解锁 */
export function isUnlocked(enemy) {
  if (enemy.category === 'world') {
    return computeStats().combatLevel >= enemy.level - 15;
  }
  const jobLv = getLevel(enemy.category);
  return jobLv >= Math.max(1, enemy.level - 8);
}

export function unlockHint(enemy) {
  if (enemy.category === 'world') {
    const need = Math.max(1, enemy.level - 15);
    return `需要职场等级 ${need}（当前 ${computeStats().combatLevel}）`;
  }
  const need = Math.max(1, enemy.level - 8);
  return `需要${jobName(enemy.category)} Lv${need}（当前 ${getLevel(enemy.category)}）`;
}

function jobName(id) {
  return { rd: '研发', sales: '销售', service: '服务', supply: '供应链', finance: '财经', legal: '法务', hr: '人力资源' }[id] || id;
}

// ---------------------------------------------------------------- 开始/结束
export function startCombat(enemyId) {
  const enemy = ENEMY_MAP[enemyId];
  if (!enemy || !isUnlocked(enemy)) return false;
  state.activity.active = false;
  state.activity.id = null;
  state.combat.active = true;
  state.combat.enemyId = enemyId;
  state.combat.areaId = enemy.area;
  state.combat.enemyMaxHp = enemy.hp;
  state.combat.enemyHp = enemy.hp;
  state.combat.playerTimer = 0;
  state.combat.enemyTimer = 0;
  state.combat.respawnTimer = 0;
  state.combat.sessionKills = 0;
  pushLog(`⚔️ 开始迎战【${enemy.name} Lv${enemy.level}】`, 'combat');
  return true;
}

export function stopCombat(reason) {
  if (!state.combat.active) return;
  state.combat.active = false;
  state.combat.enemyId = null;
  state.combat.enemyHp = 0;
  if (reason) pushLog(reason, 'info');
}

// ---------------------------------------------------------------- 主循环
export function tickCombat(dt) {
  if (!state.combat.active) return;
  const enemy = ENEMY_MAP[state.combat.enemyId];
  if (!enemy) { stopCombat(); return; }

  const stats = computeStats();

  // 复活等待
  if (state.combat.respawnTimer > 0) {
    state.combat.respawnTimer -= dt;
    if (state.combat.respawnTimer <= 0) {
      state.combat.enemyHp = enemy.hp;
      state.combat.enemyMaxHp = enemy.hp;
      state.combat.playerTimer = 0;
      state.combat.enemyTimer = 0;
    }
    regen(dt, stats);
    return;
  }

  // 玩家出手
  state.combat.playerTimer += dt;
  while (state.combat.playerTimer >= stats.interval && state.combat.enemyHp > 0) {
    state.combat.playerTimer -= stats.interval;
    playerAttack(enemy, stats);
  }

  // 敌人出手
  state.combat.enemyTimer += dt;
  while (state.combat.enemyTimer >= enemy.interval && state.combat.enemyHp > 0 && state.combat.active) {
    state.combat.enemyTimer -= enemy.interval;
    enemyAttack(enemy, stats);
  }

  regen(dt, stats);
  autoEat(stats);
}

function regen(dt, stats) {
  if (stats.mods.regen > 0 && state.hp > 0) {
    state.hp = Math.min(stats.maxHp, state.hp + (stats.mods.regen * dt) / 1000);
  }
  if (state.hp > stats.maxHp) state.hp = stats.maxHp;
}

// ---------------------------------------------------------------- 玩家攻击
function playerAttack(enemy, stats) {
  const style = stats.style;
  const tri = triangleMul(style, enemy.style);
  const acc = stats.accuracy[style] * tri.acc;
  const chance = hitChance(acc, enemy.evasion);

  if (Math.random() > chance) {
    state.combat.lastHit = 0;
    return;
  }

  const maxHit = Math.max(1, Math.floor(stats.maxHit[style] * tri.dmg));
  // 伤害在 [50%, 100%] 之间浮动，平均值 0.75×maxHit。
  // 敌人精力按这个平均值反推（见 tools/gen-enemies.mjs），改动此处必须重跑生成器。
  let dmg = randInt(Math.ceil(maxHit * 0.5), maxHit);

  // 背锅等级对精英/Boss 加成
  const scape = scapegoatDamageBonus(getLevel('scapegoat'), enemy.kind);
  if (scape > 0) dmg = Math.floor(dmg * (1 + scape / 100));

  // 敌人减伤
  dmg = Math.max(1, Math.floor(dmg * (1 - enemy.dr / 100)));

  state.combat.enemyHp -= dmg;
  state.combat.lastHit = dmg;

  // 经验
  gainCombatXp(enemy, dmg, style, stats);

  if (state.combat.enemyHp <= 0) onEnemyKilled(enemy, stats);
}

function gainCombatXp(enemy, dmg, style, stats) {
  const xpMul = 1 + stats.mods.xpBonus / 100;
  // 系数经过整体标定：按「每级约 4 分钟」的节奏推进，
  // 岗位技能与对应战斗属性同步成长（见 tools/test-sim.mjs 的模拟结论）。
  addXp('energy', dmg * 0.266 * xpMul);

  if (style === 'execution') {
    addXp('execution', dmg * 0.4 * xpMul);
    addXp('pressure', dmg * 0.4 * xpMul);
  } else if (style === 'communication') {
    addXp('communication', dmg * 0.8 * xpMul);
  } else {
    addXp('presentation', dmg * 0.8 * xpMul);
  }

  // 岗位技能
  if (enemy.category !== 'world') {
    addXp(enemy.category, dmg * 0.8 * xpMul);
  } else {
    // 世界 Boss 给所有岗位技能少量经验
    for (const j of ['rd', 'sales', 'service', 'supply', 'finance', 'legal', 'hr']) {
      addXp(j, dmg * 0.2 * xpMul);
    }
  }
}

// ---------------------------------------------------------------- 敌人攻击
function enemyAttack(enemy, stats) {
  const tri = triangleMul(enemy.style, stats.style);
  const acc = enemy.accuracy * tri.acc;
  const chance = hitChance(acc, stats.evasion);

  if (Math.random() > chance) return;

  const maxHit = Math.max(1, Math.floor(enemy.maxHit * tri.dmg));
  let dmg = randInt(Math.ceil(maxHit * 0.5), maxHit);
  dmg = Math.max(1, Math.floor(dmg * (1 - stats.dr / 100)));

  state.hp -= dmg;
  addXp('numbness', dmg * 0.2 * (1 + stats.mods.xpBonus / 100));

  if (state.hp <= 0) onPlayerDeath(enemy);
}

// ---------------------------------------------------------------- 自动加餐
function autoEat(stats) {
  if (stats.autoEat <= 0 || !state.settings.autoEat) return;
  const threshold = (stats.maxHp * stats.autoEat) / 100;
  let guard = 0;
  while (state.hp < threshold && guard++ < 50) {
    const food = bestFood();
    if (!food) break;
    removeItem(food.id, 1);
    state.hp = Math.min(stats.maxHp, state.hp + (food.heal || 0));
  }
}

/** 选背包里回精力最高的食物 */
export function bestFood() {
  let best = null;
  for (const id of Object.keys(state.bank)) {
    const it = ITEM_MAP[id];
    if (!it || it.type !== 'food' || !it.heal) continue;
    if (!best || it.heal > best.heal) best = it;
  }
  return best;
}

export function eatManual() {
  const stats = computeStats();
  const food = bestFood();
  if (!food) return false;
  removeItem(food.id, 1);
  state.hp = Math.min(stats.maxHp, state.hp + (food.heal || 0));
  return true;
}

// ---------------------------------------------------------------- 击杀
function onEnemyKilled(enemy, stats) {
  state.combat.sessionKills++;
  state.stats.totalKills++;

  // 金钱
  const goldMul = 1 + stats.mods.goldBonus / 100;
  const gold = Math.max(1, Math.floor(enemy.gold * rand(0.8, 1.2) * goldMul));
  addGold(gold);

  // 掉落
  const loot = rollLoot(enemy, stats);

  // 背锅任务进度
  trackTask(enemy);

  pushLog(`✅ 击败【${enemy.name}】 获得 💴${gold}${loot.length ? ' + ' + loot.map((l) => `${l.name}×${l.qty}`).join(', ') : ''}`, 'kill');

  // 进入复活等待
  state.combat.respawnTimer = RESPAWN_MS;
  state.combat.enemyHp = 0;
}

function rollLoot(enemy, stats) {
  const got = [];
  const bonus = 1 + stats.mods.dropBonus / 100;

  for (const drop of enemy.drops) {
    if (Math.random() * 100 > drop.chance * bonus) continue;

    let id = drop.item;
    if (id === 'FOOD') {
      // 按敌人档位分层抽食物，避免后期还在掉入门奶茶
      const pool = FOOD_BY_TIER[drop.tier] || FOOD_BY_TIER[1];
      id = pool[randInt(0, pool.length - 1)];
    } else if (id === 'EQUIP') {
      const pool = EQUIP_BY_TIER[drop.tier] || EQUIP_BY_TIER[1];
      id = pool[randInt(0, pool.length - 1)].id;
    }

    const qty = randInt(drop.min, drop.max);
    const added = addItem(id, qty);
    if (added > 0) got.push({ id, name: ITEM_MAP[id].name, qty: added });
  }

  if (got.length && state.settings.autoLoot) {
    // 已在 addItem 里直接进背包
  }
  return got;
}

// ---------------------------------------------------------------- 背锅任务
function trackTask(enemy) {
  const task = state.slayer.task;
  if (!task || task.done) return;
  if (task.enemyId !== enemy.id) return;
  task.progress = Math.min(task.count, task.progress + 1);
  if (task.progress >= task.count) {
    task.done = true;
    pushLog(`🍳 锅背完了！回「背锅」页面领取奖励`, 'level');
  }
}

// ---------------------------------------------------------------- 死亡
function onPlayerDeath(enemy) {
  state.stats.totalDeaths++;
  state.hp = 0;
  stopCombat();

  // 随机掉一件装备（除非戴了免死金牌）
  const keep = Object.values(state.equipment).some((id) => ITEM_MAP[id]?.effect?.keepOnDeath);
  const slots = Object.keys(state.equipment);
  if (!keep && slots.length) {
    const slot = slots[randInt(0, slots.length - 1)];
    const lost = state.equipment[slot];
    delete state.equipment[slot];
    pushLog(`💀 你被【${enemy.name}】击垮了，丢失了 ${ITEM_MAP[lost].name}`, 'death');
  } else {
    pushLog(`💀 你被【${enemy.name}】击垮了${keep ? '（免死金牌保住了装备）' : ''}`, 'death');
  }

  const stats = computeStats();
  state.hp = Math.floor(stats.maxHp * 0.5);
}

// ---------------------------------------------------------------- 多巴胺
export function useDopamine() {
  if (countItem('dopamine') < 10) return false;
  removeItem('dopamine', 10);
  state.buffs.push({
    stat: 'allCombat', value: 10, expiresAt: Date.now() + 180000, label: '多巴胺',
  });
  pushLog('🎮 消耗 10 点多巴胺，全战斗属性 +10%（3 分钟）', 'info');
  return true;
}
