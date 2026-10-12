/**
 * 《菊厂放置》背锅系统（对应 Melvor 的 Slayer）
 *
 * 玩法：
 *   1. 接一个「锅」—— 随机指定某个敌人，要求击杀 N 个
 *   2. 击杀进度自动累积（不需要正在打那个怪也会记）
 *   3. 完成后获得「背锅币」+ 背锅经验
 *   4. 背锅币在背锅商店买专属装备
 *
 * 背锅等级被动效果：对精英怪 +0.4%/级 伤害，对 Boss +0.8%/级 伤害。
 */

/** 任务档位：按背锅等级解锁，决定目标敌人等级范围与击杀数量 */
export const SLAYER_TIERS = [
  { minLevel: 1, maxEnemyLevel: 15, count: [8, 20], coinMul: 1.0, name: '小锅' },
  { minLevel: 15, maxEnemyLevel: 35, count: [10, 25], coinMul: 1.3, name: '中锅' },
  { minLevel: 30, maxEnemyLevel: 60, count: [12, 30], coinMul: 1.7, name: '大锅' },
  { minLevel: 50, maxEnemyLevel: 85, count: [15, 35], coinMul: 2.2, name: '重锅' },
  { minLevel: 70, maxEnemyLevel: 100, count: [18, 40], coinMul: 3.0, name: '天锅' },
  { minLevel: 90, maxEnemyLevel: 120, count: [20, 50], coinMul: 4.0, name: '陨石锅' },
];

/** 当前等级可接的最高档 */
export function tierFor(level) {
  let t = SLAYER_TIERS[0];
  for (const tier of SLAYER_TIERS) if (level >= tier.minLevel) t = tier;
  return t;
}

/** 背锅等级带来的伤害加成（%） */
export function scapegoatDamageBonus(level, enemyKind) {
  if (enemyKind === 'boss' || enemyKind === 'world') return level * 0.8;
  if (enemyKind === 'elite') return level * 0.4;
  return 0;
}

/** 完成任务的奖励 */
export function taskReward(enemy, count, tier) {
  const coins = Math.max(1, Math.floor(enemy.level * count * 0.35 * tier.coinMul));
  const xp = Math.floor(enemy.level * count * 4 * tier.coinMul);
  const gold = Math.floor(enemy.level * count * 6 * tier.coinMul);
  return { coins, xp, gold };
}

/** 取消任务的惩罚：损失 10% 背锅币（在 core 里执行） */
export const CANCEL_PENALTY = 0.1;
