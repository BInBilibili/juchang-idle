/**
 * 《菊厂放置》技能定义
 *
 * 全部技能上限 100 级（对应 Melvor 的 99 级 + 虚拟等级）。
 * 战斗属性沿用 Melvor 的 Attack/Strength/Defence/Hitpoints/Ranged/Magic/Prayer/Slayer 结构，
 * 但全部换成一眼看得懂的职场说法。
 */

/** 战斗属性（决定数值面板） */
export const COMBAT_ATTRS = [
  {
    id: 'execution', name: '执行力', icon: '⚔️', color: '#4f9cf9',
    role: '命中',
    desc: '当面沟通、直接推进的能力。决定你多容易打中对方。',
    detail: '对应「命中率」。等级越高，攻击越不容易落空。',
  },
  {
    id: 'pressure', name: '抗压力', icon: '💪', color: '#eb5757',
    role: '伤害',
    desc: '扛住压力的输出能力。决定你每次出手能造成多大伤害。',
    detail: '对应「力量」。等级越高，打人越疼。',
  },
  {
    id: 'numbness', name: '钝感力', icon: '🛡️', color: '#27ae60',
    role: '闪避',
    desc: '脸皮厚度与心理防线。决定你多容易躲开对方的攻击。',
    detail: '对应「防御」。等级越高，被 PUA 的概率越低。',
  },
  {
    id: 'energy', name: '精力值', icon: '❤️', color: '#f2c94c',
    role: '生命',
    desc: '你的血量上限。归零就得请病假（战斗失败）。',
    detail: '每级 +10 点精力上限。对应「生命值」。',
  },
];

/** 沟通方式（决定攻击风格） */
export const COMBAT_STYLES = [
  {
    id: 'execution', name: '执行力', icon: '⚔️', color: '#4f9cf9',
    role: '近战',
    styleName: '当面沟通',
    desc: '当面沟通、拍桌子、工位肉搏。武器是各种办公用品。',
    detail: '克制【沟通力】，被【汇报力】克制。',
  },
  {
    id: 'communication', name: '沟通力', icon: '📧', color: '#f2994a',
    role: '远程',
    styleName: '远程沟通',
    desc: '邮件、IM、电话、抄送。远程输出，不用面对面。',
    detail: '克制【汇报力】，被【执行力】克制。',
  },
  {
    id: 'presentation', name: '汇报力', icon: '📊', color: '#9b51e0',
    role: '魔法',
    styleName: '汇报输出',
    desc: 'PPT、周报、数据大屏。用信息量碾压对方。',
    detail: '克制【执行力】，被【沟通力】克制。',
  },
];

/** 辅助技能 */
export const SUPPORT_SKILLS = [
  {
    id: 'slacking', name: '摸鱼', icon: '🐟', color: '#2d9cdb',
    role: '临时增益',
    desc: '消耗「摸鱼点」开启临时增益。摸鱼点靠击杀敌人和带薪如厕获得。',
    detail: '对应「祈祷」。同时最多开 2 个增益。',
  },
  {
    id: 'scapegoat', name: '背锅', icon: '🍳', color: '#f2c94c',
    role: '任务系统',
    desc: '接下「锅」任务，击杀指定敌人换取背锅币。',
    detail: '对应「屠戮者」。背锅等级越高，对精英和 Boss 伤害越高。',
  },
];

/** 7 个岗位大类（战斗技能） */
export const JOB_SKILLS = [
  { id: 'rd', name: '研发', icon: '⌨️', color: '#4f9cf9', desc: '从需求到上线，一路都是坑。' },
  { id: 'sales', name: '销售', icon: '📈', color: '#f2994a', desc: '签单之前是朋友，签单之后是甲方。' },
  { id: 'service', name: '服务', icon: '🎧', color: '#27ae60', desc: '客户永远是对的，直到他开始骂人。' },
  { id: 'supply', name: '供应链', icon: '🚢', color: '#9b51e0', desc: '物料在路上，船在海上，你在火上。' },
  { id: 'finance', name: '财经', icon: '🧾', color: '#eb5757', desc: '每一分钱都要说清楚来路和去处。' },
  { id: 'legal', name: '法务', icon: '⚖️', color: '#2d9cdb', desc: '合同上的每个字都可能被念出来。' },
  { id: 'hr', name: '人力资源', icon: '👥', color: '#f2c94c', desc: '招人、留人、送人，每一件都不好办。' },
];

/** 8 个业余爱好（非战斗技能） */
export const HOBBY_SKILLS = [
  {
    id: 'fishing', name: '钓鱼', icon: '🎣', color: '#2d9cdb',
    produces: '鱼（烹饪原料）',
    desc: '从小区池塘钓到极地冰钓。产出的鱼拿去烹饪做成回精力的食物。',
    bonus: '等级越高，可去的钓点越多，稀有鱼概率越高。',
  },
  {
    id: 'cooking', name: '烹饪', icon: '🍳', color: '#f2994a',
    produces: '食物（战斗中回精力）',
    desc: '把钓到的鱼做成菜。食物是战斗续航的核心。',
    bonus: '等级越高，能做的菜回精力越多。',
  },
  {
    id: 'fitness', name: '健身', icon: '🏃', color: '#eb5757',
    produces: '体质点（永久 +2 精力上限/点）',
    desc: '跑步、游泳、瑜伽、球类、爬山。练出来的体质永久提升你的精力上限。',
    bonus: '等级越高，单位时间产出的体质点越多。',
  },
  {
    id: 'art', name: '艺术', icon: '🎨', color: '#9b51e0',
    produces: '灵感 + 作品（可出售）',
    desc: '写作、书法、绘画、摄影、乐器、看展、听音乐会。',
    bonus: '灵感可在「灵感工坊」兑换永久加成。',
  },
  {
    id: 'gaming', name: '游戏', icon: '🎮', color: '#4f9cf9',
    produces: '多巴胺 + 装备',
    desc: '单机、网游、手游、桌游、电竞。游戏里掉的东西，能带到现实。',
    bonus: '等级越高，掉落装备的档位越高。',
  },
  {
    id: 'investment', name: '理财', icon: '💰', color: '#27ae60',
    produces: '工资',
    desc: '余额宝到量化交易。有风险，但期望收益为正。',
    bonus: '等级越高，可选标的越多，收益率越高。',
  },
  {
    id: 'reading', name: '阅读', icon: '📚', color: '#f2c94c',
    produces: '知识（全技能经验加成）',
    desc: '从漫画到行业白皮书。知识永久提升所有技能的经验获取速度。',
    bonus: '每点知识 +0.02% 全技能经验。',
  },
  {
    id: 'social', name: '社交', icon: '🍻', color: '#f2994a',
    produces: '人脉（金钱与掉落加成）',
    desc: '团建、饭局、行业会议、校友会。人脉即资源。',
    bonus: '每点人脉 +0.02% 金钱与掉落率。',
  },
];

/** 全部技能汇总 */
export const SKILLS = [
  ...COMBAT_ATTRS,
  ...COMBAT_STYLES.filter((s) => s.id === 'communication' || s.id === 'presentation'),
  ...SUPPORT_SKILLS,
  ...JOB_SKILLS.map((j) => ({ ...j, role: '岗位', type: 'job' })),
  ...HOBBY_SKILLS.map((h) => ({ ...h, role: '爱好', type: 'hobby' })),
].map((s) => ({
  ...s,
  maxLevel: 100,
}));

export const SKILL_MAP = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

/** 战斗技能 id 集合（击杀敌人可训练的技能） */
export const COMBAT_SKILL_IDS = [
  'execution', 'pressure', 'numbness', 'energy', 'communication', 'presentation',
  'slacking', 'scapegoat',
  'rd', 'sales', 'service', 'supply', 'finance', 'legal', 'hr',
];

/** 面板分组（用于 UI 侧边栏） */
export const SKILL_GROUPS = [
  { title: '战斗属性', ids: ['execution', 'pressure', 'numbness', 'energy'] },
  { title: '沟通方式', ids: ['communication', 'presentation'] },
  { title: '辅助', ids: ['slacking', 'scapegoat'] },
  { title: '岗位大类', ids: ['rd', 'sales', 'service', 'supply', 'finance', 'legal', 'hr'] },
  { title: '业余爱好', ids: ['fishing', 'cooking', 'fitness', 'art', 'gaming', 'investment', 'reading', 'social'] },
];

export const MAX_LEVEL = 100;
