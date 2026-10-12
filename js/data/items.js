/**
 * 《菊厂放置》物品与装备定义
 *
 * 物品类型：
 *   currency  货币（工资 / 背锅币 / 摸鱼点）
 *   material  材料（鱼 / 灵感 / 知识 / 人脉 / 多巴胺 / 体质点）
 *   food      食物（战斗中回精力）
 *   special   特殊消耗品（奶茶 / 咖啡 / 功能饮料，带临时增益）
 *   equip     装备（10 个部位 × 8 个档位）
 *   treasure  收藏品（可出售换钱）
 */

export const ITEM_TYPE = {
  currency: '货币',
  material: '材料',
  food: '食物',
  special: '消耗品',
  equip: '装备',
  treasure: '收藏品',
};

// ---------------------------------------------------------------- 货币
export const CURRENCIES = [
  { id: 'gold', name: '工资', icon: '💴', type: 'currency', desc: '主要货币。击杀敌人、理财、出售物品都能获得。' },
  { id: 'slack-point', name: '摸鱼点', icon: '🐟', type: 'currency', desc: '开启「摸鱼」增益消耗。击杀敌人获得。' },
  { id: 'scapegoat-coin', name: '背锅币', icon: '🍳', type: 'currency', desc: '完成「背锅」任务获得，可在背锅商店消费。' },
];

// ---------------------------------------------------------------- 材料
export const MATERIALS = [
  { id: 'fitness-point', name: '体质点', icon: '💪', type: 'material', price: 0, desc: '健身产出。每点永久 +1 精力上限。获得时自动使用。' },
  { id: 'inspiration', name: '灵感', icon: '✨', type: 'material', price: 0, desc: '艺术产出。可在灵感工坊兑换永久加成。' },
  { id: 'knowledge', name: '知识', icon: '📖', type: 'material', price: 0, desc: '阅读产出。每点 +0.02% 全技能经验获取。获得时自动使用。' },
  { id: 'network', name: '人脉', icon: '🤝', type: 'material', price: 0, desc: '社交产出。每点 +0.02% 金钱与掉落率。获得时自动使用。' },
  { id: 'dopamine', name: '多巴胺', icon: '🎮', type: 'material', price: 0, desc: '游戏产出。战斗开始时自动消耗，提供短时增益。' },
];

// ---------------------------------------------------------------- 鱼（钓鱼产出）
const FISH = [
  ['fish-crucian', '鲫鱼', '🐟', 1, 2],
  ['fish-whitebait', '白条鱼', '🐟', 5, 5],
  ['fish-carp', '鲤鱼', '🐠', 12, 10],
  ['fish-grasscarp', '草鱼', '🐠', 22, 20],
  ['fish-silvercarp', '鲢鱼', '🐟', 34, 40],
  ['fish-seabass', '鲈鱼', '🐟', 45, 80],
  ['fish-grouper', '石斑鱼', '🐡', 56, 160],
  ['fish-tuna', '金枪鱼', '🐟', 65, 320],
  ['fish-sailfish', '旗鱼', '🐟', 75, 640],
  ['fish-kingcrab', '帝王蟹', '🦀', 85, 1280],
  ['fish-koi', '锦鲤王', '🎏', 95, 3000],
];

// ---------------------------------------------------------------- 食物（烹饪产出）
// [id, 名称, 图标, 需求等级, 回精力, 售价, 原料鱼 id]
// 回精力值 ≈ 该等级玩家精力上限的 28%（见 tools/gen-enemies.mjs 的 playerAt）
const FOODS = [
  ['food-crucian-soup', '清汤鲫鱼', '🍲', 1, 15, 22, 'fish-crucian'],
  ['food-pan-whitebait', '香煎白条', '🍳', 5, 26, 39, 'fish-whitebait'],
  ['food-braised-carp', '红烧鲤鱼', '🍽️', 12, 46, 69, 'fish-carp'],
  ['food-pickled-grasscarp', '酸菜草鱼', '🥘', 20, 87, 130, 'fish-grasscarp'],
  ['food-chili-silvercarp', '剁椒鲢鱼', '🌶️', 30, 166, 249, 'fish-silvercarp'],
  ['food-steamed-bass', '清蒸鲈鱼', '🐟', 40, 194, 291, 'fish-seabass'],
  ['food-grouper-pot', '石斑鱼煲', '🍲', 50, 354, 531, 'fish-grouper'],
  ['food-tuna-sashimi', '金枪鱼刺身', '🍣', 60, 728, 1092, 'fish-tuna'],
  ['food-grilled-sailfish', '香煎旗鱼', '🍽️', 70, 756, 1134, 'fish-sailfish'],
  ['food-kingcrab-feast', '帝王蟹大餐', '🦀', 85, 4031, 6046, 'fish-kingcrab'],
  ['food-koi-banquet', '锦鲤宴', '🎏', 99, 10150, 15225, 'fish-koi'],
];

// ---------------------------------------------------------------- 特殊消耗品
// buff: { stat, value(%), duration(ms) }  stat 见 core/modifiers.js
export const SPECIALS = [
  {
    id: 'milktea-common', name: '珍珠奶茶', icon: '🧋', price: 100,
    heal: 40, buff: { stat: 'xpBonus', value: 5, duration: 120000 },
    desc: '回 40 精力。饮用后 2 分钟内全技能经验 +5%。',
  },
  {
    id: 'milktea-cheese', name: '芝士奶盖茶', icon: '🧋', price: 600,
    heal: 200, buff: { stat: 'damageBonus', value: 8, duration: 120000 },
    desc: '回 200 精力。饮用后 2 分钟内伤害 +8%。',
  },
  {
    id: 'milktea-fruit', name: '水果茶', icon: '🍹', price: 3000,
    heal: 900, buff: { stat: 'drBonus', value: 3, duration: 120000 },
    desc: '回 900 精力。饮用后 2 分钟内减伤 +3%。',
  },
  {
    id: 'coffee-americano', name: '美式咖啡', icon: '☕', price: 80,
    heal: 25, buff: { stat: 'attackSpeed', value: 8, duration: 90000 },
    desc: '回 25 精力。饮用后 90 秒内攻速 +8%。',
  },
  {
    id: 'coffee-latte', name: '拿铁', icon: '☕', price: 500,
    heal: 120, buff: { stat: 'accuracyBonus', value: 8, duration: 90000 },
    desc: '回 120 精力。饮用后 90 秒内命中 +8%。',
  },
  {
    id: 'coffee-espresso', name: '意式浓缩', icon: '☕', price: 2500,
    heal: 600, buff: { stat: 'damageBonus', value: 15, duration: 90000 },
    desc: '回 600 精力。饮用后 90 秒内伤害 +15%，但减伤 -5%。',
    penalty: { stat: 'drBonus', value: -5, duration: 90000 },
  },
  {
    id: 'energy-drink', name: '功能饮料', icon: '🥤', price: 15000,
    heal: 3000, buff: { stat: 'allCombat', value: 10, duration: 180000 },
    desc: '回 3000 精力。饮用后 3 分钟内命中/伤害/闪避 +10%。',
  },
  {
    id: 'vitamin-pack', name: '维生素片', icon: '💊', price: 80000,
    heal: 12000, buff: { stat: 'hpBonus', value: 15, duration: 300000 },
    desc: '回 12000 精力。服用后 5 分钟内精力上限 +15%。',
  },
];

// ---------------------------------------------------------------- 收藏品（艺术/游戏产出，可卖）
const TREASURES = [
  ['art-diary', '手写日记本', '📓', 8, 120],
  ['art-calligraphy', '书法作品', '🖌️', 16, 600],
  ['art-painting', '油画', '🖼️', 24, 2200],
  ['art-photo', '摄影作品集', '📷', 34, 7000],
  ['art-album', '个人专辑', '💿', 46, 24000],
  ['art-novel', '出版小说', '📕', 60, 90000],
  ['art-exhibition', '个人画展', '🏛️', 78, 400000],
  ['art-masterpiece', '传世之作', '👑', 95, 2000000],
];

// ---------------------------------------------------------------- 装备
export const EQUIP_SLOTS = [
  { id: 'head', name: '头部', icon: '🎧' },
  { id: 'cape', name: '披风', icon: '🧣' },
  { id: 'neck', name: '项链', icon: '📛' },
  { id: 'weapon', name: '武器', icon: '🗡️' },
  { id: 'offhand', name: '副手', icon: '🖱️' },
  { id: 'body', name: '身体', icon: '👔' },
  { id: 'legs', name: '腿部', icon: '👖' },
  { id: 'hands', name: '手部', icon: '🧤' },
  { id: 'feet', name: '脚部', icon: '👟' },
  { id: 'ring', name: '戒指', icon: '💍' },
];

/**
 * 每个部位对各属性的贡献系数。
 * 重要：def 之和 = 7.4、hp 之和 = 5.5、acc 之和 = 2.05、dmg 之和 = 1.65、dr 之和 = 1.0，
 * 这几个和值写死在 tools/gen-enemies.mjs 里用于反推敌人数值，改动必须同步重跑生成器。
 */
const SLOT_MUL = {
  head: { def: 0.8, hp: 0.6, dr: 0.2 },
  cape: { def: 0.7, hp: 0.5 },
  neck: { def: 0.5, hp: 0.5, dr: 0.2 },
  weapon: { def: 0.2, hp: 0.1, acc: 1.0, dmg: 1.0 },
  offhand: { def: 0.9, hp: 0.4, acc: 0.5, dmg: 0.3 },
  body: { def: 1.4, hp: 1.2, dr: 0.4 },
  legs: { def: 1.1, hp: 0.9, dr: 0.2 },
  hands: { def: 0.6, hp: 0.4, acc: 0.25, dmg: 0.15 },
  feet: { def: 0.7, hp: 0.5 },
  ring: { def: 0.5, hp: 0.4, acc: 0.3, dmg: 0.2 },
};

/**
 * 8 个档位的基础数值 —— 指数增长。
 * 因为技能经验需求按 2^(L/7) 指数上涨，敌人精力必须同步指数化，
 * 玩家伤害也只有在装备上指数化才能跟上。改动这些值必须同步
 * 重跑 tools/gen-enemies.mjs，否则敌我数值会脱节。
 */
const TIER_BASE = {
  def: [3, 9, 25, 70, 195, 545, 1525, 4270],
  hp: [10, 26, 68, 178, 465, 1210, 3150, 8200],
  dr: [0, 5, 10, 16, 24, 33, 43, 54],
  acc: [6, 15, 37, 93, 232, 580, 1450, 3625],
  dmg: [3, 9.6, 30.7, 98.3, 314.6, 1006.6, 3221, 10308],
};
/** 档位解锁等级：与 floor((L-1)/14) 的分档完全一致 */
export const TIER_LEVEL = [1, 15, 29, 43, 57, 71, 85, 99];
export const TIER_PRICE = [120, 800, 3000, 8000, 30000, 120000, 400000, 2000000];
const TIER_NAME = ['入门', '基础', '进阶', '专业', '资深', '专家', '大师', '传奇'];

/** 武器：每个档位 3 种风格各一把 */
const WEAPON_NAMES = {
  execution: ['塑料签字笔', '机械键盘', '订书机', '马克笔', '螺丝刀', '法务合同', '核心专利书', '期权协议'],
  communication: ['公司邮箱', '企业微信', '电话会议', '邮件抄送链', '视频会议系统', '客户群公告', '全球发布会', '全员信'],
  presentation: ['手写周报', '白板笔', 'PPT 遥控笔', '数据大屏', '年度述职报告', '董事会汇报', '战略规划书', '五年战略'],
};
const WEAPON_ICON = { execution: '🖊️', communication: '📧', presentation: '📊' };
const WEAPON_STYLE_NAME = { execution: '执行力', communication: '沟通力', presentation: '汇报力' };

/** 护甲：每个部位 8 个档位 */
const ARMOR_NAMES = {
  head: ['工位耳机', '防蓝光眼镜', '棒球帽', '降噪耳机', '防脱发头盔', '定制礼帽', '高管气场', '董事长铭牌'],
  cape: ['工牌挂绳', '加班毯', '团建文化衫', '部门旗帜', '项目战袍', '总监披风', '事业部大旗', '创始人斗篷'],
  neck: ['员工工牌', '门禁卡', '优秀员工奖章', '项目纪念币', '司龄纪念章', '股权证书', '终身成就奖', '创始人勋章'],
  offhand: ['笔记本', '鼠标垫', '计算器', '机械鼠标', '印章', '加密 U 盾', '公章', '董事会席位'],
  body: ['白衬衫', 'Polo 衫', '西装外套', '防弹工牌背心', '定制西服', '商务马甲', '高定西装', '董事长同款'],
  legs: ['牛仔裤', '休闲裤', '西裤', '工装裤', '定制西裤', '战术裤', '高定西裤', '无痕西装裤'],
  hands: ['一次性手套', '护腕', '打字手托', '减震手套', '防腱鞘炎护具', '定制手套', '高尔夫手套', '签字金笔手套'],
  feet: ['拖鞋', '帆布鞋', '跑鞋', '皮鞋', '减震跑鞋', '定制皮鞋', '商务休闲鞋', '限量联名球鞋'],
  ring: ['橡皮筋', '门禁指环', '婚戒', '转运戒指', '幸运硬币戒', '项目成功戒', '期权指环', '家族印章戒'],
};
const ARMOR_ICON = {
  head: '🎧', cape: '🧣', neck: '📛', offhand: '🖱️', body: '👔',
  legs: '👖', hands: '🧤', feet: '👟', ring: '💍',
};

const r0 = (v) => Math.max(0, Math.round(v));

/** 构建全部装备 */
function buildEquipment() {
  const list = [];

  // 武器
  for (const [style, names] of Object.entries(WEAPON_NAMES)) {
    names.forEach((name, i) => {
      const t = i + 1;
      const m = SLOT_MUL.weapon;
      list.push({
        id: `w-${style}-${t}`,
        name,
        icon: WEAPON_ICON[style],
        type: 'equip',
        slot: 'weapon',
        tier: t,
        tierName: TIER_NAME[i],
        level: TIER_LEVEL[i],
        price: TIER_PRICE[i],
        style,                       // 决定攻击风格
        stats: {
          accuracy: r0(TIER_BASE.acc[i] * m.acc),
          damage: r0(TIER_BASE.dmg[i] * m.dmg),
          defence: r0(TIER_BASE.def[i] * m.def),
          hp: r0(TIER_BASE.hp[i] * m.hp),
          dr: r0(TIER_BASE.dr[i] * m.dr),
        },
        desc: `${TIER_NAME[i]}档${WEAPON_STYLE_NAME[style]}武器。攻击风格：【${WEAPON_STYLE_NAME[style]}】。`,
      });
    });
  }

  // 护甲 / 饰品
  for (const [slot, names] of Object.entries(ARMOR_NAMES)) {
    const m = SLOT_MUL[slot];
    names.forEach((name, i) => {
      const t = i + 1;
      list.push({
        id: `a-${slot}-${t}`,
        name,
        icon: ARMOR_ICON[slot],
        type: 'equip',
        slot,
        tier: t,
        tierName: TIER_NAME[i],
        level: TIER_LEVEL[i],
        price: TIER_PRICE[i],
        stats: {
          accuracy: r0(TIER_BASE.acc[i] * (m.acc || 0)),
          damage: r0(TIER_BASE.dmg[i] * (m.dmg || 0)),
          defence: r0(TIER_BASE.def[i] * m.def),
          hp: r0(TIER_BASE.hp[i] * m.hp),
          dr: r0(TIER_BASE.dr[i] * m.dr),
        },
        desc: `${TIER_NAME[i]}档${EQUIP_SLOTS.find((s) => s.id === slot).name}装备。`,
      });
    });
  }

  return list;
}

export const EQUIPMENT = buildEquipment();

// ---------------------------------------------------------------- 背锅商店专属装备
/** 用背锅币购买，数值介于同档普通装备与高一档之间 */
export const SLAYER_EQUIPMENT = [
  {
    id: 's-pot-lid', name: '锅盖', icon: '🍳', type: 'equip', slot: 'offhand',
    tier: 3, tierName: '背锅', level: 1, slayerPrice: 250,
    stats: { accuracy: 0, damage: 0, defence: 45, hp: 90, dr: 6 },
    desc: '挡得住锅，也挡得住伤害。减伤 +6%。',
  },
  {
    id: 's-blame-cape', name: '背锅侠披风', icon: '🧣', type: 'equip', slot: 'cape',
    tier: 5, tierName: '背锅', level: 40, slayerPrice: 1200,
    stats: { accuracy: 20, damage: 12, defence: 60, hp: 180, dr: 5 },
    desc: '背上写满了别人的锅。命中 +20，伤害 +12。',
  },
  {
    id: 's-shift-gloves', name: '甩锅手套', icon: '🧤', type: 'equip', slot: 'hands',
    tier: 6, tierName: '背锅', level: 60, slayerPrice: 4500,
    stats: { accuracy: 55, damage: 35, defence: 50, hp: 140, dr: 4 },
    desc: '手一抖，责任就飞出去了。命中 +55。',
  },
  {
    id: 's-veteran-badge', name: '老油条工牌', icon: '📛', type: 'equip', slot: 'neck',
    tier: 7, tierName: '背锅', level: 80, slayerPrice: 18000,
    stats: { accuracy: 90, damage: 60, defence: 70, hp: 260, dr: 12 },
    desc: '司龄十五年，见过所有场面。减伤 +12%。',
  },
  {
    id: 's-worker-helmet', name: '打工人头盔', icon: '⛑️', type: 'equip', slot: 'head',
    tier: 7, tierName: '背锅', level: 85, slayerPrice: 26000,
    stats: { accuracy: 40, damage: 30, defence: 130, hp: 320, dr: 9 },
    desc: '抗压能力 +100%。物理意义上的。',
  },
  {
    id: 's-death-waiver', name: '免死金牌', icon: '🥇', type: 'equip', slot: 'ring',
    tier: 8, tierName: '背锅', level: 95, slayerPrice: 120000,
    stats: { accuracy: 120, damage: 90, defence: 90, hp: 300, dr: 10 },
    desc: '死亡时不会掉落任何装备。保命神器。',
    effect: { keepOnDeath: true },
  },
];


// ---------------------------------------------------------------- 汇总
function fishItems() {
  return FISH.map(([id, name, icon, level, price]) => ({
    id, name, icon, type: 'material', price, level,
    desc: `钓鱼 Lv${level} 可钓到。烹饪原料，也可直接出售。`,
  }));
}

function foodItems() {
  return FOODS.map(([id, name, icon, level, heal, price, material]) => ({
    id, name, icon, type: 'food', price, level, heal, material,
    desc: `烹饪 Lv${level} 可制作。战斗中回复 ${heal} 点精力。`,
  }));
}

function treasureItems() {
  return TREASURES.map(([id, name, icon, level, price]) => ({
    id, name, icon, type: 'treasure', price, level,
    desc: `艺术 Lv${level} 产出的收藏品，可高价出售。`,
  }));
}

export const ITEMS = [
  ...CURRENCIES,
  ...MATERIALS,
  ...fishItems(),
  ...foodItems(),
  ...SPECIALS.map((s) => ({ ...s, type: 'special' })),
  ...treasureItems(),
  ...EQUIPMENT,
  ...SLAYER_EQUIPMENT,
];

export const ITEM_MAP = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

/** 可堆叠物品（非装备） */
export const isStackable = (id) => ITEM_MAP[id]?.type !== 'equip';

/** 装备池按档位索引 */
export const EQUIP_BY_TIER = EQUIPMENT.reduce((acc, e) => {
  (acc[e.tier] ||= []).push(e);
  return acc;
}, {});

/** 背锅商店商品（用背锅币结算） */
export const SLAYER_SHOP = [
  ...SLAYER_EQUIPMENT.map((e) => ({ item: e.id, slayerPrice: e.slayerPrice })),
  { item: 'slack-point-pack', slayerPrice: 30 },
  { item: 'milktea-fruit', slayerPrice: 45 },
  { item: 'energy-drink', slayerPrice: 200 },
  { item: 'vitamin-pack', slayerPrice: 420 },
];

/** 背锅商店出售的摸鱼点礼包 */
export const SLAYER_CONSUMABLES = [
  {
    id: 'slack-point-pack', name: '摸鱼点礼包', icon: '🎁', type: 'special', price: 0,
    give: { 'slack-point': 200 },
    desc: '打开获得 200 点摸鱼点。',
  },
];

// 把背锅商店的消耗品并入物品总表
ITEMS.push(...SLAYER_CONSUMABLES);
Object.assign(ITEM_MAP, Object.fromEntries(SLAYER_CONSUMABLES.map((i) => [i.id, i])));

/** 战斗掉落的食物池 */
export const COMBAT_FOOD_POOL = [
  'milktea-common', 'milktea-cheese', 'milktea-fruit',
  'coffee-americano', 'coffee-latte', 'coffee-espresso',
  'energy-drink', 'vitamin-pack',
];

/**
 * 商店出售的固定商品。
 * 只放 { item, price }，名称/图标/描述一律从 ITEM_MAP 取，避免两处维护。
 */
export const SHOP_ITEMS = [
  { item: 'milktea-common', price: 100 },
  { item: 'milktea-cheese', price: 600 },
  { item: 'milktea-fruit', price: 3000 },
  { item: 'coffee-americano', price: 80 },
  { item: 'coffee-latte', price: 500 },
  { item: 'coffee-espresso', price: 2500 },
  { item: 'energy-drink', price: 15000 },
  { item: 'vitamin-pack', price: 80000 },
];

/**
 * 商店升级项。
 * 价格与「敌人掉落金钱」同步标定：金钱 ≈ 敌人精力 × 2.5，
 * 升级价格大致对应「玩家在相应等级需要攒多久」。
 */
export const SHOP_UPGRADES = [
  {
    id: 'auto-eat-1', name: '自动加餐 I', icon: '🍽️', price: 8000,
    desc: '精力低于 40% 时自动吃食物。放置战斗的核心，越早买越好。',
    effect: { autoEat: 40 },
  },
  {
    id: 'auto-eat-2', name: '自动加餐 II', icon: '🍽️', price: 2000000,
    desc: '自动加餐阈值提升到 60%。',
    effect: { autoEat: 60 },
    requires: 'auto-eat-1',
  },
  {
    id: 'auto-eat-3', name: '自动加餐 III', icon: '🍽️', price: 25000000,
    desc: '自动加餐阈值提升到 80%。',
    effect: { autoEat: 80 },
    requires: 'auto-eat-2',
  },
  {
    id: 'auto-loot', name: '自动拾取', icon: '🧲', price: 20000,
    desc: '掉落物自动进背包，不用手动捡。',
    effect: { autoLoot: true },
  },
  {
    id: 'extra-prayer', name: '摸鱼双开', icon: '🐟', price: 300000,
    desc: '同时可开启 3 个摸鱼增益（原本 2 个）。',
    effect: { maxPrayers: 3 },
  },
  {
    id: 'bank-slot-1', name: '储物柜扩容 I', icon: '🗄️', price: 2000,
    desc: '背包上限 +20 格（基础 60）。',
    effect: { bankSlots: 20 },
  },
  {
    id: 'bank-slot-2', name: '储物柜扩容 II', icon: '🗄️', price: 900000,
    desc: '背包上限再 +40 格。',
    effect: { bankSlots: 40 },
    requires: 'bank-slot-1',
  },
  {
    id: 'offline-1', name: '离线挂机 I', icon: '🌙', price: 12000,
    desc: '离线时间按 50% 效率结算（基础 25%）。',
    effect: { offlineRate: 50 },
  },
  {
    id: 'offline-2', name: '离线挂机 II', icon: '🌙', price: 6000000,
    desc: '离线时间按 80% 效率结算。',
    effect: { offlineRate: 80 },
    requires: 'offline-1',
  },
  {
    id: 'inspiration-lab', name: '灵感工坊', icon: '✨', price: 60000,
    desc: '解锁灵感工坊，可用灵感兑换永久加成。',
    effect: { inspirationLab: true },
  },
];
