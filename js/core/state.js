/**
 * 游戏状态：创建、读写、存档、背包与装备操作
 */
import { SKILLS, SKILL_MAP } from '../data/skills.js';
import { ITEM_MAP, isStackable, EQUIP_BY_TIER } from '../data/items.js';
import { xpForLevel, levelFromXp, MAX_LEVEL } from './xp.js';

export const SAVE_KEY = 'juchang-idle-save-v1';
export const SAVE_VERSION = 1;

/** 基础背包格数 */
export const BASE_BANK_SLOTS = 60;

/**
 * 入职大礼包：一套 T1 入门装备。
 * 没有它的话 1 级玩家只有 10 点精力，而敌人数值是按「穿满 T1」反推的，
 * 开局会被秒。所以新号直接送一套（武器固定给执行力风格）。
 */
function startingEquipment() {
  const eq = {};
  const t1 = EQUIP_BY_TIER[1] || [];
  for (const slot of ['head', 'cape', 'neck', 'weapon', 'offhand', 'body', 'legs', 'hands', 'feet', 'ring']) {
    const pool = t1.filter((i) => i.slot === slot);
    if (!pool.length) continue;
    const pick = slot === 'weapon'
      ? (pool.find((i) => i.style === 'execution') || pool[0])
      : pool[0];
    eq[slot] = pick.id;
  }
  return eq;
}

export function createState() {
  const skills = {};
  for (const s of SKILLS) skills[s.id] = 0;

  return {
    version: SAVE_VERSION,
    createdAt: Date.now(),
    lastTick: Date.now(),
    playTime: 0,

    skills,
    hp: 100,
    currencies: { gold: 50, 'slack-point': 20, 'scapegoat-coin': 0 },
    permanent: { fitness: 0, knowledge: 0, network: 0 },

    bank: {},
    equipment: startingEquipment(),

    combat: {
      active: false,
      areaId: null,
      enemyId: null,
      enemyHp: 0,
      enemyMaxHp: 0,
      playerTimer: 0,
      enemyTimer: 0,
      sessionKills: 0,
      lastHit: 0,
    },

    activity: { active: false, id: null, progress: 0 },

    prayers: [],
    buffs: [],
    slayer: { task: null, rerolls: 0 },
    upgrades: {},
    inspiration: {},

    stats: { totalKills: 0, totalDeaths: 0, goldEarned: 0, itemsGained: 0, tasksDone: 0 },

    settings: { autoEat: true, autoLoot: true, sound: false },

    log: [],
  };
}

/**
 * 全局唯一状态对象。**永远不要重新赋值**，只做原地修改，
 * 这样所有模块 import 到的引用始终有效（replaceState 也遵守这条）。
 */
export const state = createState();

// ---------------------------------------------------------------- 技能
export function getXp(id) { return state.skills[id] || 0; }
export function getLevel(id) { return levelFromXp(state.skills[id] || 0); }

/** 加经验，返回升级了几级 */
export function addXp(id, amount) {
  if (!SKILL_MAP[id] || amount <= 0) return 0;
  const before = getLevel(id);
  state.skills[id] = Math.min(xpForLevel(MAX_LEVEL), (state.skills[id] || 0) + amount);
  const after = getLevel(id);
  if (after > before) {
    for (let l = before + 1; l <= after; l++) {
      pushLog(`${SKILL_MAP[id].icon} ${SKILL_MAP[id].name} 升到 ${l} 级`, 'level');
    }
  }
  return after - before;
}

// ---------------------------------------------------------------- 货币
export function getGold() { return state.currencies.gold || 0; }
export function getSlack() { return state.currencies['slack-point'] || 0; }
export function getCoins() { return state.currencies['scapegoat-coin'] || 0; }

export function addGold(n) {
  state.currencies.gold = Math.max(0, (state.currencies.gold || 0) + n);
  if (n > 0) state.stats.goldEarned += n;
}

export function addSlack(n) {
  state.currencies['slack-point'] = Math.max(0, (state.currencies['slack-point'] || 0) + n);
}

export function addCoins(n) {
  state.currencies['scapegoat-coin'] = Math.max(0, (state.currencies['scapegoat-coin'] || 0) + n);
}

// ---------------------------------------------------------------- 背包
export function bankSlots() {
  let n = BASE_BANK_SLOTS;
  if (state.upgrades['bank-slot-1']) n += 20;
  if (state.upgrades['bank-slot-2']) n += 40;
  return n;
}

export function bankUsed() { return Object.keys(state.bank).length; }

export function countItem(id) { return state.bank[id] || 0; }

export function hasItem(id, qty = 1) { return countItem(id) >= qty; }

/**
 * 加物品。返回实际加入数量。
 * fitness-point / knowledge / network 为自动使用材料，直接计入永久加成。
 */
export function addItem(id, qty = 1) {
  if (qty <= 0) return 0;
  const item = ITEM_MAP[id];
  if (!item) return 0;

  if (id === 'fitness-point' || id === 'knowledge' || id === 'network') {
    const key = id === 'fitness-point' ? 'fitness' : id;
    state.permanent[key] = (state.permanent[key] || 0) + qty;
    state.stats.itemsGained += qty;
    return qty;
  }

  if (isStackable(id)) {
    state.bank[id] = (state.bank[id] || 0) + qty;
    state.stats.itemsGained += qty;
    return qty;
  }

  // 装备：每个占一格
  if (!state.bank[id] && bankUsed() >= bankSlots()) {
    pushLog(`🗄️ 背包已满（${bankSlots()} 格），${item.name} 掉在地上没捡到`, 'warn');
    return 0;
  }
  state.bank[id] = (state.bank[id] || 0) + qty;
  state.stats.itemsGained += qty;
  return qty;
}

export function removeItem(id, qty = 1) {
  if (!state.bank[id]) return false;
  state.bank[id] -= qty;
  if (state.bank[id] <= 0) delete state.bank[id];
  return true;
}

// ---------------------------------------------------------------- 装备
export function equip(id) {
  const item = ITEM_MAP[id];
  if (!item || item.type !== 'equip') return false;
  if (!hasItem(id, 1)) return false;
  const lv = getLevel(equipSkillFor(item));
  if (item.level && lv < item.level) return false;

  const slot = item.slot;
  const prev = state.equipment[slot];
  if (prev) addItem(prev, 1);
  removeItem(id, 1);
  state.equipment[slot] = id;
  return true;
}

export function unequip(slot) {
  const id = state.equipment[slot];
  if (!id) return false;
  if (!state.bank[id] && bankUsed() >= bankSlots()) return false;
  addItem(id, 1);
  delete state.equipment[slot];
  return true;
}

/** 装备等级门槛用哪个技能判断 */
function equipSkillFor(item) {
  if (item.slot === 'weapon') return item.style || 'execution';
  return 'numbness';
}

export { equipSkillFor };

// ---------------------------------------------------------------- 日志
export function pushLog(text, kind = 'info') {
  state.log.unshift({ t: Date.now(), text, kind });
  if (state.log.length > 120) state.log.length = 120;
}

// ---------------------------------------------------------------- 存档
export function save() {
  try {
    state.lastTick = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error('存档失败', e);
    return false;
  }
}

export function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    state = migrate(data);
    return true;
  } catch (e) {
    console.error('读档失败', e);
    return false;
  }
}

function migrate(data) {
  const base = createState();
  const merged = { ...base, ...data };
  merged.skills = { ...base.skills, ...(data.skills || {}) };
  merged.currencies = { ...base.currencies, ...(data.currencies || {}) };
  merged.permanent = { ...base.permanent, ...(data.permanent || {}) };
  merged.stats = { ...base.stats, ...(data.stats || {}) };
  merged.settings = { ...base.settings, ...(data.settings || {}) };
  merged.combat = { ...base.combat, ...(data.combat || {}) };
  merged.activity = { ...base.activity, ...(data.activity || {}) };
  merged.slayer = { ...base.slayer, ...(data.slayer || {}) };
  merged.bank = data.bank || {};
  merged.equipment = data.equipment || {};
  merged.upgrades = data.upgrades || {};
  merged.inspiration = data.inspiration || {};
  merged.prayers = (data.prayers || []).filter((p) => p);
  merged.buffs = data.buffs || [];
  merged.log = data.log || [];
  merged.version = SAVE_VERSION;
  return merged;
}

export function wipe() {
  localStorage.removeItem(SAVE_KEY);
  state = createState();
}

export function exportSave() {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

export function importSave(str) {
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(str.trim()))));
    state = migrate(data);
    save();
    return true;
  } catch {
    return false;
  }
}

/** 供外部替换 state（导入存档后） */
/** 原地替换全部状态内容（保持对象引用不变） */
export function replaceState(next) {
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, createState(), next);
  return state;
}
