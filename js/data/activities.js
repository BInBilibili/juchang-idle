/**
 * 《菊厂放置》业余爱好活动表
 *
 * 设计思路（沿用 Melvor 的采集→加工→消耗链路）：
 *   钓鱼 → 鱼 → 烹饪 → 食物 → 战斗续航
 *   健身 → 体质点 → 永久精力上限
 *   艺术 → 灵感 + 收藏品（换钱）
 *   游戏 → 多巴胺 + 装备
 *   理财 → 工资
 *   阅读 → 知识 → 全技能经验加成
 *   社交 → 人脉 → 金钱/掉落加成
 *
 * XP 曲线：单个动作经验 = 4 * 2^(需求等级/7)，使每级约需 17~25 次动作。
 */

/** 单动作基础经验 */
export const xpBase = (level) => Math.floor(4 * Math.pow(2, level / 7));

const A = (o) => o;

// ================================================================ 钓鱼
const FISHING = [
  ['小区池塘', 1, 'fish-crucian', 3000, '楼下小区的人工湖，保安不管就能钓。'],
  ['公园湖边', 5, 'fish-whitebait', 3000, '周末带个小马扎，一坐一下午。'],
  ['城郊水库', 12, 'fish-carp', 3200, '开车一小时，就为找个没人打扰的岸边。'],
  ['野钓基地', 22, 'fish-grasscarp', 3400, '钓费一百八，鱼不一定有。'],
  ['江河渡口', 34, 'fish-silvercarp', 3600, '水流急，看漂全靠眼力。'],
  ['海边栈桥', 45, 'fish-seabass', 3800, '海钓的乐趣在于你永远不知道下一杆是什么。'],
  ['近海船钓', 56, 'fish-grouper', 4000, '晕船药记得提前半小时吃。'],
  ['深海船钓', 65, 'fish-tuna', 4200, '金枪鱼上钩那一下，手臂会告诉你什么叫运动。'],
  ['远洋拖钓', 75, 'fish-sailfish', 4400, '旗鱼跃出水面的瞬间，值回所有船票。'],
  ['极地冰钓', 85, 'fish-kingcrab', 4800, '零下二十度，钓上来的帝王蟹比脸还大。'],
  ['秘境鱼王', 95, 'fish-koi', 5000, '传说中只有钓到过所有鱼的人才能到达的地方。'],
  ['摸鱼之道', 99, 'slack-point', 6000, '最高境界的钓鱼，是在上班时间钓。'],
];

// ================================================================ 烹饪
// [名称, 等级, 产出食物 id, 原料鱼 id, 每次消耗鱼数]
const COOKING = [
  ['清汤鲫鱼', 1, 'food-crucian-soup', 'fish-crucian', 1],
  ['香煎白条', 5, 'food-pan-whitebait', 'fish-whitebait', 1],
  ['红烧鲤鱼', 12, 'food-braised-carp', 'fish-carp', 1],
  ['酸菜草鱼', 20, 'food-pickled-grasscarp', 'fish-grasscarp', 1],
  ['剁椒鲢鱼', 30, 'food-chili-silvercarp', 'fish-silvercarp', 1],
  ['清蒸鲈鱼', 40, 'food-steamed-bass', 'fish-seabass', 1],
  ['石斑鱼煲', 50, 'food-grouper-pot', 'fish-grouper', 1],
  ['金枪鱼刺身', 60, 'food-tuna-sashimi', 'fish-tuna', 1],
  ['香煎旗鱼', 70, 'food-grilled-sailfish', 'fish-sailfish', 1],
  ['帝王蟹大餐', 85, 'food-kingcrab-feast', 'fish-kingcrab', 1],
  ['锦鲤宴', 99, 'food-koi-banquet', 'fish-koi', 1],
];

// ================================================================ 健身
const FITNESS = [
  ['快走', 1, 3000, '通勤路上多走两站，也算运动。'],
  ['慢跑', 5, 3000, '配速不重要，坚持才重要。'],
  ['骑行', 12, 3200, '共享单车也能骑出环法的感觉。'],
  ['游泳', 20, 3400, '唯一一个不会出汗的运动。'],
  ['健身房', 28, 3600, '办卡的第一天是最有热情的一天。'],
  ['瑜伽', 36, 3600, '练的是柔韧，修的是心态。'],
  ['羽毛球', 44, 3800, '一场下来，膝盖和手腕都在抗议。'],
  ['乒乓球', 52, 3800, '国球，门槛低，上限高。'],
  ['篮球', 60, 4000, '半场三对三，跑不动了就投篮。'],
  ['足球', 68, 4000, '九十分钟，跑动八公里。'],
  ['爬山', 76, 4500, '上山两小时，下山膝盖疼三天。'],
  ['徒步穿越', 85, 5000, '负重二十公斤，走三天。'],
  ['马拉松', 92, 5500, '42.195 公里，跑到 35 公里才是开始。'],
  ['铁人三项', 99, 6000, '游泳 1.5km + 骑行 40km + 跑步 10km。'],
];

// ================================================================ 艺术
const ART = [
  ['写日记', 1, 3000, 'art-diary', 0.02, '把今天的不爽写下来，明天就不记得了。'],
  ['书法', 6, 3200, 'art-calligraphy', 0.03, '一笔一划，练的是心静。'],
  ['绘画', 12, 3400, 'art-painting', 0.035, '从素描开始，到能画出一张像样的脸。'],
  ['摄影', 20, 3400, 'art-photo', 0.04, '构图、光线、时机，缺一不可。'],
  ['乐器', 28, 3600, 'art-photo', 0.045, '练琴一小时，扰民五十九分钟。'],
  ['唱歌', 36, 3600, 'art-photo', 0.05, '跑调不重要，敢唱才重要。'],
  ['跳舞', 44, 3800, 'art-photo', 0.055, '身体协调性是可以练出来的。'],
  ['看展', 52, 3800, 'art-photo', 0.06, '看不懂也要装作看懂了。'],
  ['看电影', 60, 4000, 'art-album', 0.07, '两个小时，进入另一个人生。'],
  ['听播客', 68, 4000, 'art-album', 0.075, '通勤时间的高效利用方式。'],
  ['听音乐会', 76, 4200, 'art-album', 0.08, '现场的低音是耳机永远给不了的。'],
  ['写小说', 86, 4800, 'art-novel', 0.09, '写到第十章才发现第一章的坑填不上。'],
  ['办个展', 95, 5500, 'art-exhibition', 0.10, '把作品挂上墙的那一刻，一切都值了。'],
  ['传世之作', 99, 6000, 'art-masterpiece', 0.12, '一生只做一件，做到极致。'],
];

// ================================================================ 游戏
// [名称, 等级, 时长, 掉落档位, 描述]
const GAMING = [
  ['扫雷', 1, 3000, 1, '最纯粹的推理游戏，也是最容易上瘾的。'],
  ['俄罗斯方块', 5, 3000, 1, '看似简单，实则极难。'],
  ['单机 RPG', 12, 3400, 2, '一个周末，一个世界。'],
  ['MOBA', 20, 3600, 2, '一局四十分钟，输了更想再来一局。'],
  ['FPS', 28, 3600, 3, '枪法可以练，意识练不出来。'],
  ['桌游', 36, 3800, 3, '面对面玩，比线上快乐十倍。'],
  ['手游', 44, 3800, 4, '碎片时间的最佳消遣。'],
  ['MMO', 52, 4200, 4, '公会、副本、拍卖行，第二个社会。'],
  ['模拟经营', 60, 4200, 5, '把一家公司从零做到上市。'],
  ['魂类游戏', 70, 4600, 5, '死亡一千次，只为了那一次通关。'],
  ['电竞排位', 80, 4800, 6, '段位是一种社交货币。'],
  ['VR 游戏', 90, 5200, 7, '身体动了，脑子也动了。'],
  ['游戏设计', 99, 6000, 8, '从玩家变成创造者。'],
];

// ================================================================ 理财
// [名称, 等级, 时长, 每动作基础收益, 亏损概率]
// 理财是专职赚钱技能：间隔长（10~20 秒），收益指数增长，
// 高风险项期望收益更低（EV = v*(1-2p)），是「用波动换上限」的赌注。
const INVESTMENT = [
  ['余额宝', 1, 10000, 30, 0, '收益不高，但胜在稳。'],
  ['货币基金', 8, 10000, 80, 0, '比活期强，风险极低。'],
  ['国债', 16, 12000, 200, 0, '国家信用背书，睡得着觉。'],
  ['债券基金', 25, 12000, 450, 0.02, '波动小，适合打底仓。'],
  ['指数基金', 35, 14000, 1000, 0.05, '买的是整个市场，不是某家公司。'],
  ['蓝筹股', 45, 14000, 2200, 0.08, '大盘股，涨得慢，跌得也慢。'],
  ['成长股', 55, 15000, 4800, 0.12, '高增长伴随高波动。'],
  ['黄金', 65, 15000, 10500, 0.06, '乱世买金，亘古不变。'],
  ['房产', 72, 18000, 23000, 0.03, '租售比不高，但抗通胀。'],
  ['私募基金', 80, 18000, 50000, 0.10, '门槛一百万起，管理费照收。'],
  ['数字货币', 88, 20000, 110000, 0.25, '一天涨跌 20% 是常态。'],
  ['期权', 95, 20000, 240000, 0.35, '杠杆是把双刃剑，通常是砍自己的那把。'],
  ['量化交易', 99, 20000, 520000, 0.15, '让程序替你承担情绪。'],
];

// ================================================================ 阅读
const READING = [
  ['漫画', 1, 3000, '图文并茂，入门最快。'],
  ['网络小说', 6, 3000, '一晚上三百章，第二天顶着黑眼圈上班。'],
  ['畅销书', 12, 3200, '机场书店摆在最显眼位置的那些。'],
  ['专业书籍', 20, 3400, '看的时候痛苦，用的时候真香。'],
  ['历史', 28, 3600, '太阳底下没有新鲜事。'],
  ['哲学', 36, 3800, '读完更困惑了，但这本身就是收获。'],
  ['心理学', 44, 3800, '终于明白同事为什么那样做。'],
  ['管理学', 52, 4000, '理论都懂，落地全废。'],
  ['技术文档', 60, 4200, '英文原版，一个词一个词查。'],
  ['英文原版', 70, 4400, '第一本最痛苦，第十本最轻松。'],
  ['学术论文', 80, 4800, '一篇论文三十页，有效信息三页。'],
  ['行业白皮书', 90, 5200, '看懂趋势，比努力更重要。'],
  ['自己写书', 99, 6000, '输出才是最好的输入。'],
];

// ================================================================ 社交
const SOCIAL = [
  ['同事闲聊', 1, 3000, '茶水间五分钟，信息量超过一个周会。'],
  ['团建', 6, 3200, '被迫营业，但确实能认识人。'],
  ['部门饭局', 14, 3400, '酒桌上的话，七分假三分真。'],
  ['兴趣社群', 22, 3400, '因为同一件事聚在一起的人，关系更纯粹。'],
  ['行业沙龙', 30, 3600, '换名片，加微信，然后互相不说话。'],
  ['羽毛球群', 40, 3800, '每周固定约球，关系比同事还铁。'],
  ['校友会', 50, 4000, '同一个学校出来的人，天然多一分信任。'],
  ['行业会议', 60, 4200, '听三场演讲，认识五个人，值了。'],
  ['客户答谢会', 70, 4600, '维护老客户的成本，远低于开发新客户。'],
  ['跨界交流', 80, 5000, '不同行业的人，往往能给你最意外的启发。'],
  ['高端论坛', 90, 5400, '门票五位数，但坐在你旁边的人可能值更多。'],
  ['CEO 午餐', 99, 6000, '一顿饭的时间，可能改变一个决定。'],
];

// ================================================================ 构建
const MUL = {
  fishing: 1.0, cooking: 1.2, fitness: 0.9, art: 1.0,
  gaming: 1.0, investment: 0.8, reading: 1.0, social: 1.0,
};

const out = [];

FISHING.forEach(([name, level, fish, interval, desc], i) => {
  const extra = level >= 20 ? 0.15 : 0;
  out.push(A({
    id: `fish-${i + 1}`, skill: 'fishing', name, level, interval,
    xp: Math.floor(xpBase(level) * MUL.fishing),
    outputs: [{ item: fish, min: 1, max: 1, chance: 100 },
              ...(extra ? [{ item: fish, min: 1, max: 1, chance: extra * 100 }] : [])],
    desc,
  }));
});

COOKING.forEach(([name, level, food, fish, qty], i) => {
  out.push(A({
    id: `cook-${i + 1}`, skill: 'cooking', name, level, interval: 3000 + i * 80,
    xp: Math.floor(xpBase(level) * MUL.cooking),
    inputs: [{ item: fish, qty }],
    outputs: [{ item: food, min: 1, max: 1, chance: 100 }],
    desc: '把钓到的鱼做成菜。食物是战斗续航的核心。',
    material: fish,
  }));
});

FITNESS.forEach(([name, level, interval, desc], i) => {
  out.push(A({
    id: `fit-${i + 1}`, skill: 'fitness', name, level, interval,
    xp: Math.floor(xpBase(level) * MUL.fitness),
    outputs: [
      { item: 'fitness-point', min: 1, max: 1, chance: 18 + Math.min(12, level * 0.12) },
    ],
    gold: [Math.floor(level * 0.8) + 1, Math.floor(level * 2.5) + 3],
    desc,
  }));
});

ART.forEach(([name, level, interval, treasure, treasureChance, desc], i) => {
  out.push(A({
    id: `art-${i + 1}`, skill: 'art', name, level, interval,
    xp: Math.floor(xpBase(level) * MUL.art),
    outputs: [
      { item: 'inspiration', min: 1, max: 1, chance: 55 },
      { item: treasure, min: 1, max: 1, chance: treasureChance * 100 },
    ],
    desc,
  }));
});

GAMING.forEach(([name, level, interval, tier, desc], i) => {
  out.push(A({
    id: `game-${i + 1}`, skill: 'gaming', name, level, interval,
    xp: Math.floor(xpBase(level) * MUL.gaming),
    outputs: [
      { item: 'dopamine', min: 1, max: 1, chance: 45 },
      { item: 'EQUIP', min: 1, max: 1, chance: 0.6 + i * 0.08, tier },
    ],
    desc,
  }));
});

INVESTMENT.forEach(([name, level, interval, value, risk, desc], i) => {
  out.push(A({
    id: `inv-${i + 1}`, skill: 'investment', name, level, interval,
    xp: Math.floor(xpBase(level) * MUL.investment),
    gold: [value, value],
    risk,
    desc,
  }));
});

READING.forEach(([name, level, interval, desc], i) => {
  out.push(A({
    id: `read-${i + 1}`, skill: 'reading', name, level, interval,
    xp: Math.floor(xpBase(level) * MUL.reading),
    outputs: [{ item: 'knowledge', min: 1, max: 1, chance: 40 + Math.min(20, level * 0.2) }],
    desc,
  }));
});

SOCIAL.forEach(([name, level, interval, desc], i) => {
  out.push(A({
    id: `soc-${i + 1}`, skill: 'social', name, level, interval,
    xp: Math.floor(xpBase(level) * MUL.social),
    outputs: [{ item: 'network', min: 1, max: 1, chance: 40 + Math.min(20, level * 0.2) }],
    gold: [Math.floor(level * 1.5) + 2, Math.floor(level * 4) + 6],
    desc,
  }));
});

export const ACTIVITIES = out;
export const ACTIVITY_MAP = Object.fromEntries(out.map((a) => [a.id, a]));

/** 按技能分组的活动 */
export const ACTIVITIES_BY_SKILL = out.reduce((acc, a) => {
  (acc[a.skill] ||= []).push(a);
  return acc;
}, {});

/** 钓鱼产出表（供烹饪原料提示用） */
export const FISH_LIST = FISHING.map(([name, level, fish]) => ({ name, level, fish }));
