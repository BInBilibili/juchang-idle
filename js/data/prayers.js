/**
 * 《菊厂放置》摸鱼系统（对应 Melvor 的 Prayer）
 *
 * 摸鱼点来源：击杀敌人掉落、钓鱼「摸鱼之道」、带薪如厕。
 * 同时最多开启 2 个（商店升级「摸鱼双开」后 3 个）。
 * 效果按秒扣点。
 */

export const PRAYERS = [
  {
    id: 'phone-scroll', name: '刷手机', icon: '📱', level: 1, drain: 0.3,
    effect: { accuracyBonus: 8 },
    desc: '命中 +8%。看似在回消息，其实在摸鱼。',
  },
  {
    id: 'fake-busy', name: '假装忙碌', icon: '⌨️', level: 5, drain: 0.3,
    effect: { evasionBonus: 8 },
    desc: '闪避 +8%。键盘敲得响，代码没在跑。',
  },
  {
    id: 'paid-toilet', name: '带薪如厕', icon: '🚽', level: 10, drain: 0.5,
    effect: { regen: 1.5 },
    desc: '每秒回复 1.5 点精力。一天八次，一次二十分钟。',
  },
  {
    id: 'watercooler', name: '茶水间八卦', icon: '🫖', level: 16, drain: 0.6,
    effect: { xpBonus: 6 },
    desc: '全技能经验 +6%。信息就是生产力。',
  },
  {
    id: 'headphones', name: '戴上耳机', icon: '🎧', level: 22, drain: 0.8,
    effect: { drBonus: 4 },
    desc: '减伤 +4%。戴上了就没人来打扰你。',
  },
  {
    id: 'alt-tab', name: '窗口切屏', icon: '🪟', level: 30, drain: 1.0,
    effect: { accuracyBonus: 12 },
    desc: '命中 +12%。Alt+Tab 的速度决定了你的安全。',
  },
  {
    id: 'wfh', name: '远程办公', icon: '🏠', level: 38, drain: 1.2,
    effect: { styleDamage: { communication: 15 } },
    desc: '沟通力伤害 +15%。在家办公，邮件火力全开。',
  },
  {
    id: 'data-cosmetics', name: '数据美化', icon: '📈', level: 46, drain: 1.2,
    effect: { styleDamage: { presentation: 15 } },
    desc: '汇报力伤害 +15%。坐标轴起点调一下，增长十倍。',
  },
  {
    id: 'blame-shift', name: '甩锅', icon: '🍳', level: 54, drain: 1.4,
    effect: { evasionBonus: 15 },
    desc: '闪避 +15%。不是我的部分，是上游的问题。',
  },
  {
    id: 'slack-off', name: '摸鱼划水', icon: '🐟', level: 62, drain: 1.6,
    effect: { xpBonus: 15 },
    desc: '全技能经验 +15%。认真工作是做不完的。',
  },
  {
    id: 'play-dead', name: '装死', icon: '💀', level: 70, drain: 2.0,
    effect: { drBonus: 12 },
    desc: '减伤 +12%。不回复就是最好的回复。',
  },
  {
    id: 'mute-mode', name: '静音模式', icon: '🔇', level: 78, drain: 2.4,
    effect: { damageBonus: 20 },
    desc: '伤害 +20%。群里 @ 全体，与我无关。',
  },
  {
    id: 'leave-on-time', name: '准点下班', icon: '🕕', level: 86, drain: 3.0,
    effect: { attackSpeed: 15 },
    desc: '攻速 +15%。六点零一分，人已经在电梯里。',
  },
  {
    id: 'paid-leave', name: '带薪年假', icon: '🏖️', level: 93, drain: 3.5,
    effect: { hpBonus: 25 },
    desc: '精力上限 +25%。十五天，一天都不能少。',
  },
  {
    id: 'lying-flat', name: '躺平', icon: '🛌', level: 99, drain: 5.0,
    effect: { allCombat: 20, xpBonus: 10 },
    desc: '命中/伤害/闪避 +20%，经验 +10%。终极答案。',
  },
];

export const PRAYER_MAP = Object.fromEntries(PRAYERS.map((p) => [p.id, p]));

export const BASE_MAX_PRAYERS = 2;
