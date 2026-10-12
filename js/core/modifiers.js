/**
 * 玩家属性计算 —— 公式沿用 Melvor Idle
 *
 * 命中等级(Accuracy Rating) = floor( (有效技能等级 + 9) × (装备命中加成 + 64) × (1 + 命中修正/100) )
 * 闪避等级(Evasion Rating)  = floor( (钝感力等级 + 9) × (装备防御加成 + 64) × (1 + 闪避修正/100) )
 * 命中率 = acc/(2×eva)  (acc < eva)   或   1 - eva/(2×acc)  (acc ≥ eva)
 * 最大伤害(执行力/沟通力) = floor( 10 × (2.2 + 有效等级/10 + (有效等级+17)×伤害加成/640) )
 * 最大伤害(汇报力)        = floor( 汇报基数 × (1 + 伤害加成/100) × (1 + (有效等级+1)/200) )
 */
import { state, getLevel } from './state.js';
import { ITEM_MAP } from '../data/items.js';
import { PRAYER_MAP, BASE_MAX_PRAYERS } from '../data/prayers.js';
import { INSPIRATION_UPGRADES } from '../data/inspiration.js';

/** 战斗三角：执行力 > 沟通力 > 汇报力 > 执行力 */
const BEATS = { execution: 'communication', communication: 'presentation', presentation: 'execution' };

/** 攻击方风格对防守方风格的加成 */
export function triangleMul(atk, def) {
  if (!atk || !def || atk === def) return { acc: 1, dmg: 1 };
  if (BEATS[atk] === def) return { acc: 1.15, dmg: 1.10 };
  if (BEATS[def] === atk) return { acc: 0.85, dmg: 0.90 };
  return { acc: 1, dmg: 1 };
}

export const STYLE_BASE_INTERVAL = { execution: 2800, communication: 3000, presentation: 3200 };

/** 装备属性合计 */
export function equipStats() {
  const sum = { accuracy: 0, damage: 0, defence: 0, hp: 0, dr: 0 };
  for (const slot of Object.keys(state.equipment)) {
    const item = ITEM_MAP[state.equipment[slot]];
    if (!item || !item.stats) continue;
    for (const k of Object.keys(sum)) sum[k] += item.stats[k] || 0;
  }
  return sum;
}

/** 当前武器决定的攻击风格 */
export function weaponStyle() {
  const w = ITEM_MAP[state.equipment.weapon];
  return w?.style || 'execution';
}

/** 临时增益（奶茶/咖啡/多巴胺）合计 */
export function buffSum(stat) {
  const now = Date.now();
  let v = 0;
  for (const b of state.buffs) if (b.stat === stat && b.expiresAt > now) v += b.value;
  return v;
}

export function activeBuffs() {
  const now = Date.now();
  return state.buffs.filter((b) => b.expiresAt > now);
}

export function addBuff(stat, value, duration, label) {
  const now = Date.now();
  const exist = state.buffs.find((b) => b.stat === stat && b.label === label);
  if (exist) {
    exist.value = value;
    exist.expiresAt = Math.max(exist.expiresAt, now + duration);
  } else {
    state.buffs.push({ stat, value, expiresAt: now + duration, label: label || stat });
  }
}

/** 摸鱼增益合计 */
export function prayerMods() {
  const out = {
    accuracyBonus: 0, evasionBonus: 0, drBonus: 0, xpBonus: 0,
    damageBonus: 0, attackSpeed: 0, hpBonus: 0, regen: 0, allCombat: 0,
    styleDamage: { execution: 0, communication: 0, presentation: 0 },
  };
  for (const id of state.prayers) {
    const p = PRAYER_MAP[id];
    if (!p) continue;
    for (const [k, v] of Object.entries(p.effect)) {
      if (k === 'styleDamage') {
        for (const [s, sv] of Object.entries(v)) out.styleDamage[s] += sv;
      } else {
        out[k] = (out[k] || 0) + v;
      }
    }
  }
  return out;
}

export function maxPrayers() {
  return state.upgrades['extra-prayer'] ? 3 : BASE_MAX_PRAYERS;
}

export function autoEatThreshold() {
  if (state.upgrades['auto-eat-3']) return 80;
  if (state.upgrades['auto-eat-2']) return 60;
  if (state.upgrades['auto-eat-1']) return 40;
  return 0;
}

export function offlineRate() {
  if (state.upgrades['offline-2']) return 80;
  if (state.upgrades['offline-1']) return 50;
  return 25;
}

/** 灵感工坊永久加成合计 */
export function inspirationMods() {
  const out = { xpBonus: 0, goldBonus: 0, dropBonus: 0, accuracyBonus: 0, damageBonus: 0, drBonus: 0, hpBonus: 0, attackSpeed: 0 };
  const owned = state.inspiration || {};
  for (const def of INSPIRATION_UPGRADES) {
    const lv = owned[def.id] || 0;
    if (!lv) continue;
    out[def.stat] = (out[def.stat] || 0) + lv * def.unit;
  }
  return out;
}

/** 汇总所有修正 */
export function collectModifiers() {
  const p = prayerMods();
  const ins = inspirationMods();
  const m = {
    accuracyBonus: p.accuracyBonus + p.allCombat + ins.accuracyBonus + buffSum('accuracyBonus') + buffSum('allCombat'),
    damageBonus: p.damageBonus + p.allCombat + ins.damageBonus + buffSum('damageBonus') + buffSum('allCombat'),
    evasionBonus: p.evasionBonus + p.allCombat + buffSum('evasionBonus') + buffSum('allCombat'),
    drBonus: p.drBonus + ins.drBonus + buffSum('drBonus'),
    hpBonus: p.hpBonus + ins.hpBonus + buffSum('hpBonus'),
    attackSpeed: p.attackSpeed + ins.attackSpeed + buffSum('attackSpeed'),
    xpBonus: p.xpBonus + ins.xpBonus + buffSum('xpBonus') + Math.min(50, (state.permanent.knowledge || 0) * 0.02),
    goldBonus: ins.goldBonus + Math.min(50, (state.permanent.network || 0) * 0.02),
    dropBonus: ins.dropBonus + Math.min(50, (state.permanent.network || 0) * 0.02),
    regen: p.regen + buffSum('regen'),
    styleDamage: { ...p.styleDamage },
  };
  m.styleDamage.execution += buffSum('styleDamageExecution');
  m.styleDamage.communication += buffSum('styleDamageCommunication');
  m.styleDamage.presentation += buffSum('styleDamagePresentation');
  return m;
}

/** 玩家完整面板 */
export function computeStats() {
  const eq = equipStats();
  const mods = collectModifiers();
  const style = weaponStyle();

  const lv = {
    execution: getLevel('execution'),
    pressure: getLevel('pressure'),
    numbness: getLevel('numbness'),
    energy: getLevel('energy'),
    communication: getLevel('communication'),
    presentation: getLevel('presentation'),
    scapegoat: getLevel('scapegoat'),
  };

  // 精力上限
  const baseHp = lv.energy * 10 + eq.hp + (state.permanent.fitness || 0) * 1;
  const maxHp = Math.floor(baseHp * (1 + mods.hpBonus / 100));

  // 减伤（百分点，上限 80）
  const dr = Math.min(80, eq.dr + lv.numbness * 0.15 + mods.drBonus);

  // 命中等级（三种风格分别计算，装备加成共用）
  const accMod = 1 + mods.accuracyBonus / 100;
  const accuracy = {
    execution: Math.floor((lv.execution + 9) * (eq.accuracy + 64) * accMod),
    communication: Math.floor((lv.communication + 9) * (eq.accuracy + 64) * accMod),
    presentation: Math.floor((lv.presentation + 9) * (eq.accuracy + 64) * accMod),
  };

  // 闪避等级（对三种攻击风格分别计算，本作共用同一套装备防御）
  const evaMod = 1 + mods.evasionBonus / 100;
  const evasion = Math.floor((lv.numbness + 9) * (eq.defence + 64) * evaMod);

  // 最大伤害
  const dmgBonus = eq.damage;
  const mkMelee = (eff) => Math.floor(10 * (2.2 + eff / 10 + ((eff + 17) * dmgBonus) / 640));
  const weaponTier = ITEM_MAP[state.equipment.weapon]?.tier || 0;
  const spellBase = 15 + weaponTier * 12;
  const mkMagic = (eff) => Math.floor(spellBase * (1 + dmgBonus / 100) * (1 + (eff + 1) / 200));

  const styleDmgMul = (s) => 1 + (mods.styleDamage[s] || 0) / 100 + mods.damageBonus / 100;

  const maxHit = {
    execution: Math.floor(mkMelee(lv.pressure) * styleDmgMul('execution')),
    communication: Math.floor(mkMelee(lv.communication) * styleDmgMul('communication')),
    presentation: Math.floor(mkMagic(lv.presentation) * styleDmgMul('presentation')),
  };

  // 攻击间隔
  const interval = Math.floor(STYLE_BASE_INTERVAL[style] / (1 + mods.attackSpeed / 100));

  // 职场等级（对应 Melvor 战斗等级）
  const base = 0.25 * (lv.numbness + lv.energy + Math.floor(0.5 * getLevel('slacking')));
  const offensive = Math.max(
    lv.execution + lv.pressure,
    Math.floor(1.5 * lv.communication),
    Math.floor(1.5 * lv.presentation),
  );
  const combatLevel = Math.floor(base + 0.325 * offensive);

  return {
    lv, eq, mods, style,
    maxHp,
    dr,
    accuracy,
    evasion,
    maxHit,
    interval,
    combatLevel,
    autoEat: autoEatThreshold(),
    maxPrayers: maxPrayers(),
    offlineRate: offlineRate(),
    styleDmgMul,
  };
}

/** 命中率（0~1） */
export function hitChance(accuracyRating, evasionRating) {
  if (evasionRating <= 0) return 1;
  if (accuracyRating < evasionRating) return accuracyRating / (2 * evasionRating);
  return 1 - evasionRating / (2 * accuracyRating);
}
