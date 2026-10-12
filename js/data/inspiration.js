/**
 * 灵感工坊 —— 用「灵感」兑换永久加成（对应 Melvor 的 Astrology / Agility 永久增益）
 * 每项可升级多次，成本按 1.6 倍递增。
 */
export const INSPIRATION_UPGRADES = [
  { id: 'insp-xp', name: '灵感迸发', icon: '✨', max: 25, base: 40, effect: '全技能经验', unit: 1, suffix: '%', stat: 'xpBonus' },
  { id: 'insp-gold', name: '副业收入', icon: '💴', max: 25, base: 40, effect: '金钱获取', unit: 1, suffix: '%', stat: 'goldBonus' },
  { id: 'insp-drop', name: '人缘爆棚', icon: '🍀', max: 25, base: 60, effect: '掉落率', unit: 1, suffix: '%', stat: 'dropBonus' },
  { id: 'insp-acc', name: '表达精进', icon: '🎯', max: 20, base: 80, effect: '命中', unit: 1, suffix: '%', stat: 'accuracyBonus' },
  { id: 'insp-dmg', name: '气场全开', icon: '🔥', max: 20, base: 80, effect: '伤害', unit: 1, suffix: '%', stat: 'damageBonus' },
  { id: 'insp-dr', name: '心理建设', icon: '🧱', max: 15, base: 150, effect: '减伤', unit: 0.5, suffix: '%', stat: 'drBonus' },
  { id: 'insp-hp', name: '体能储备', icon: '❤️', max: 20, base: 100, effect: '精力上限', unit: 1, suffix: '%', stat: 'hpBonus' },
  { id: 'insp-speed', name: '手速惊人', icon: '⚡', max: 10, base: 300, effect: '攻速', unit: 1, suffix: '%', stat: 'attackSpeed' },
];

export const INSPIRATION_MAP = Object.fromEntries(INSPIRATION_UPGRADES.map((u) => [u.id, u]));

export function inspCost(def, level) {
  return Math.floor(def.base * Math.pow(1.6, level));
}
