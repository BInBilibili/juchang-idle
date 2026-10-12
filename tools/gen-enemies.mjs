/**
 * 《菊厂放置》敌人数据生成器
 * 运行: node tools/gen-enemies.mjs  →  输出 js/data/enemies.js
 *
 * 核心思路：不手拍数值，而是先建模「玩家在该等级应有的战力」，
 * 再反推敌人的 HP / 命中 / 闪避 / 伤害，保证全程手感一致。
 *
 * 玩家模型（与 js/core/modifiers.js 的公式保持一致）：
 *   装备档位      t(L) = clamp(floor((L-1)/14), 0, 7)      共 8 档
 *   命中加成      accBonus(t)  = TIER_BASE.acc[t] * 2.05    （武器1.0 + 副手0.5 + 手0.25 + 戒指0.3）
 *   防御加成      defBonus(t)  = TIER_BASE.def[t] * 7.4     （9 件护具槽位系数和）
 *   伤害加成      dmgBonus(t)  = TIER_BASE.dmg[t] * 1.65
 *   精力加成      hpBonus(t)   = TIER_BASE.hp[t]  * 5.5
 *   减伤          dr(t)        = TIER_BASE.dr[t]  （SLOT_MUL.dr 之和已归一为 1.0）
 *
 *   命中等级 acc(L) = (L+9) * (accBonus+64)
 *   闪避等级 eva(L) = (L+9) * (defBonus+64)
 *   最大伤害  dmg(L) = 10 * (2.2 + L/10 + (L+17)*dmgBonus/640)
 *   精力上限  hp(L)  = L*10 + hpBonus
 *   有效血量  ehp(L) = hp(L) / (1 - (dr + 0.15L)/100)
 *
 * 目标手感：
 *   玩家命中敌人 ≈ 80%，敌人命中玩家 ≈ 45~65%
 *   普通怪 3~16 刀（随等级上升），精英 ×1.6，区域Boss ×2.6，世界Boss ×20
 *   每级约需 8~12 次击杀
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- 装备基准（必须与 js/data/items.js 一致）
const TIER_BASE = {
  def: [3, 9, 25, 70, 195, 545, 1525, 4270],
  hp: [10, 26, 68, 178, 465, 1210, 3150, 8200],
  dr: [0, 5, 10, 16, 24, 33, 43, 54],
  acc: [6, 15, 37, 93, 232, 580, 1450, 3625],
  dmg: [3, 9.6, 30.7, 98.3, 314.6, 1006.6, 3221, 10308],
};
const SLOT_ACC_SUM = 2.05;
const SLOT_DEF_SUM = 7.4;
const SLOT_DMG_SUM = 1.65;
const SLOT_HP_SUM = 5.5;

const tierOf = (L) => Math.min(7, Math.max(0, Math.floor((L - 1) / 14)));

/** 玩家在该等级的期望战力 */
function playerAt(L) {
  L = Math.max(1, L);
  const t = tierOf(L);
  const accBonus = TIER_BASE.acc[t] * SLOT_ACC_SUM;
  const defBonus = TIER_BASE.def[t] * SLOT_DEF_SUM;
  const dmgBonus = TIER_BASE.dmg[t] * SLOT_DMG_SUM;
  const hpBonus = TIER_BASE.hp[t] * SLOT_HP_SUM;
  const dr = Math.min(80, TIER_BASE.dr[t] + L * 0.15);

  const accuracy = (L + 9) * (accBonus + 64);
  const evasion = (L + 9) * (defBonus + 64);
  const maxHit = 10 * (2.2 + L / 10 + ((L + 17) * dmgBonus) / 640);
  const maxHp = L * 10 + hpBonus;
  const ehp = maxHp / (1 - dr / 100);
  return { accuracy, evasion, maxHit, maxHp, ehp, dr, tier: t };
}

/** 目标刀数：低等级快，中期最久，后期略微加速 */
function targetHits(L) {
  if (L <= 70) return 3 + ((L - 1) * 13) / 69;
  return Math.max(10, 16 - ((L - 70) * 8) / 50);
}

/** 敌人类型系数 */
const KIND = {
  normal: { hits: 1.0, hitOnPlayer: 0.85, dr: (L) => Math.min(12, Math.floor(L / 12)) },
  elite: { hits: 1.6, hitOnPlayer: 0.95, dr: (L) => Math.min(22, 5 + Math.floor(L / 12)) },
  boss: { hits: 2.6, hitOnPlayer: 1.10, dr: (L) => Math.min(35, 10 + Math.floor(L / 8)) },
  world: { hits: 20, hitOnPlayer: 1.30, dr: (L) => Math.min(55, 26 + Math.floor(L / 7)) },
};

/** 敌人被打死需要的刀数 → 玩家死亡需要的刀数 */
const PLAYER_HITS_TO_DIE = { normal: 14, elite: 10, boss: 6, world: 3.5 };

/**
 * 玩家实际伤害的平均系数。
 * combat.js 里伤害在 [0.5×maxHit, maxHit] 均匀取值，均值 = 0.75×maxHit，
 * 所以敌人精力要按 0.75 折算，targetHits 才是真实刀数。
 */
const DMG_AVG = 0.75;

const INTERVAL = { normal: 3000, elite: 2800, boss: 3200, world: 3600 };

/** 敌人掉落装备的档位 */
const tierFor = (L) => Math.min(8, Math.max(1, Math.floor((L - 1) / 14) + 1));

function makeEnemy(id, name, level, kind, desc, category, area, style) {
  // 基准玩家 = 刚好能解锁这只怪的最低岗位等级（解锁门槛是 enemyLevel - 8）。
  // 用这个基准反推 HP / 命中 / 闪避 / 伤害，玩家在门槛等级时刚好达到设计手感，
  // 等级练上去之后会明显更轻松。
  const REF_GAP = 8;
  const refLv = Math.max(1, level - REF_GAP);
  const p = playerAt(refLv);
  const k = KIND[kind];
  const dr = k.dr(level);

  // 期望刀数 = targetHits × 类型系数；扣掉敌人减伤后才是真实需要的刀数
  const hp = Math.round(p.maxHit * targetHits(level) * k.hits * DMG_AVG * (1 - dr / 100));
  const evasion = Math.round(p.accuracy * 0.4);        // 玩家命中率 ≈ 80%
  const accuracy = Math.round(p.evasion * k.hitOnPlayer); // 敌人命中率 45%~65%
  const maxHit = Math.max(1, Math.round(p.ehp / PLAYER_HITS_TO_DIE[kind]));

  // 金钱：与难度挂钩。系数 2.5 是配合 TIER_PRICE 标定的
  //（一个满编装备套 ≈ 15~20 次击杀的收入）。
  const gold = Math.round(hp * 2.5);

  return {
    id, name, level, kind, desc, category, area, style,
    hp, maxHit, accuracy, evasion,
    dr,
    interval: INTERVAL[kind],
    gold,
    tier: tierFor(level),
    drops: dropFor(level, kind, tierFor(level)),
  };
}

// ---------------------------------------------------------------- 敌人表
const AREAS = [
  // ============================ 研发类 ============================
  {
    id: 'rd', name: '研发类', icon: '⌨️', color: '#4f9cf9',
    desc: '写代码的人遇到的麻烦，从需求到上线，从架构到 Deadline。',
    areas: [
      { id: 'req-swamp', name: '需求沼泽', desc: '需求在这里腐烂，每走一步都更深。', enemies: [
        ['vague-req', '模糊需求', 3, 'normal', '它说的话你每个字都认识，连起来完全不懂。'],
        ['scope-creep', '频繁改需', 7, 'elite', '昨天说要 A，今天说要 B，明天说要 A+B。'],
        ['schedule-crunch', '排期压缩', 12, 'boss', '「这个很简单吧？三天够了吧？」'],
      ]},
      { id: 'code-forge', name: '代码熔炉', desc: '高温高压，Bug 在熔炉里繁殖。', enemies: [
        ['bug-slime', 'Bug 史莱姆', 22, 'normal', '你修好一个，它分裂成两个。'],
        ['tech-debt-drake', '技术债幼龙', 28, 'elite', '它现在很小，但它在利滚利。'],
        ['integration-hell', '联调地狱', 35, 'boss', '你的接口没问题，他的也没问题，合起来就是不通。'],
      ]},
      { id: 'prod-fireline', name: '线上火线', desc: '凌晨三点的告警，永远不会挑时间。', enemies: [
        ['prod-incident', '线上事故', 48, 'normal', '它总在你刚躺下的时候出现。'],
        ['perf-bottleneck', '性能瓶颈', 56, 'elite', '压测环境一切正常，生产环境原地升天。'],
        ['security-hole', '安全漏洞', 64, 'boss', '它藏在你最自信的那段代码里。'],
      ]},
      { id: 'arch-abyss', name: '架构深渊', desc: '重构一次，少活三年。', enemies: [
        ['refactor-dragon', '架构重构巨龙', 78, 'normal', '「顺手重构一下」是它的开场白。'],
        ['deadline-reaper', 'Deadline死神', 87, 'elite', '它不杀人，它只是让你自己加班到死。'],
        ['blackswan-outage', '黑天鹅故障', 96, 'boss', '从未发生过的故障，今天第一次发生。'],
      ]},
    ],
  },
  // ============================ 销售类 ============================
  {
    id: 'sales', name: '销售类', icon: '📈', color: '#f2994a',
    desc: '签单之前是朋友，签单之后是甲方。',
    areas: [
      { id: 'lead-wasteland', name: '线索荒原', desc: '名单很长，能打的没几个。', enemies: [
        ['dry-leads', '线索干涸', 2, 'normal', 'CRM 里躺着三千条，拨过去全是空号。'],
        ['rejection-beast', '客户拒绝兽', 6, 'elite', '「我们暂时没有需求」——它说了两年。'],
        ['rival-assassin', '竞品刺客', 11, 'boss', '它比你先到五分钟，价格比你低一成。'],
      ]},
      { id: 'negotiation-table', name: '谈判桌', desc: '一张桌子，两个立场，三小时拉锯。', enemies: [
        ['price-tug', '价格拉锯', 21, 'normal', '「再便宜点，我们就签。」'],
        ['budget-freeze-array', '预算冻结法阵', 27, 'elite', '年底了，钱在财务那里冻成冰。'],
        ['decision-maze', '决策链迷宫', 34, 'boss', '七个人点头，第八个人说再议。'],
      ]},
      { id: 'rival-battlefield', name: '竞品战场', desc: '你降一毛，他降两毛。', enemies: [
        ['lowball-snipe', '低价截胡', 47, 'normal', '你谈了三个月，他报了个骨折价。'],
        ['churn-beast', '客户流失', 55, 'elite', '续约前一周，它悄悄换了供应商。'],
        ['channel-betrayal', '渠道反水', 63, 'boss', '你的代理商，成了对手的代理商。'],
      ]},
      { id: 'collection-abyss', name: '回款深渊', desc: '合同签了，钱还在路上。', enemies: [
        ['payment-ghost', '回款幽灵', 77, 'normal', '流程走到第八个节点，卡住了。'],
        ['baddebt-behemoth', '坏账巨兽', 86, 'elite', '它欠你三百万，还理直气壮。'],
        ['dispute-king', '合同纠纷王', 95, 'boss', '「这条我们没约定过。」——白纸黑字写着。'],
      ]},
    ],
  },
  // ============================ 服务类 ============================
  {
    id: 'service', name: '服务类', icon: '🎧', color: '#27ae60',
    desc: '客户永远是对的，直到他开始骂人。',
    areas: [
      { id: 'ticket-ocean', name: '工单海洋', desc: '你关掉十张，它涨回来二十张。', enemies: [
        ['dup-ticket', '重复工单', 1, 'normal', '同一件事，他提了六遍，还抄送了老板。'],
        ['ticket-backlog', '工单积压', 5, 'elite', '队列里排着 400 张，最早那张是三年前的。'],
        ['customer-nag', '客户催促', 10, 'boss', '「在吗？」「在吗？」「在吗？」'],
      ]},
      { id: 'sla-clocktower', name: 'SLA 时钟塔', desc: '秒针每走一格，你的心跳快一拍。', enemies: [
        ['sla-countdown', 'SLA 倒计时', 20, 'normal', '还剩 47 分钟，你还有三个会要开。'],
        ['escalated-ticket', '升级工单', 26, 'elite', '它升到了 VP 那里，现在全公司都看着你。'],
        ['remote-diag-fail', '远程诊断失败', 33, 'boss', '「您先重启一下试试？」「试过了。」'],
      ]},
      { id: 'outage-storm', name: '故障风暴', desc: '一个问题引出三个问题，三个引出九个。', enemies: [
        ['cascade-failure', '连环故障', 46, 'normal', '你修好了 A，B 挂了；修好 B，C 挂了。'],
        ['spare-part-ghost', '备件短缺幽灵', 54, 'elite', '仓库说有一块，现场翻了三小时没找到。'],
        ['info-barrage', '信息轰炸', 62, 'boss', '八个群里同时在 @ 你。'],
      ]},
      { id: 'customer-wrath', name: '客户怒火', desc: '满意度调查，他给了零分，还写了小作文。', enemies: [
        ['complaint-troll', '客户投诉巨魔', 76, 'normal', '他投诉的不是问题，是你的态度。'],
        ['pr-storm', '舆情风暴', 85, 'elite', '一条微博，三万转发，热搜第八。'],
        ['service-collapse', '服务崩溃', 94, 'boss', '全线宕机，电话被打爆，官网挂了。'],
      ]},
    ],
  },
  // ============================ 供应链类 ============================
  {
    id: 'supply', name: '供应链类', icon: '🚢', color: '#9b51e0',
    desc: '物料在路上，船在海上，你在火上。',
    areas: [
      { id: 'material-desert', name: '缺料沙漠', desc: '生产线停了，物料还在供应商的仓库里。', enemies: [
        ['material-delay', '物料延迟', 4, 'normal', '承诺周三到，周三说下周三。'],
        ['inventory-drift', '库存偏差', 8, 'elite', '系统显示 500，实物 47。'],
        ['delivery-break', '交期跳票', 13, 'boss', '客户在等，产线在停，供应商在度假。'],
      ]},
      { id: 'logistics-strait', name: '物流海峡', desc: '一船货，卡在海峡中间。', enemies: [
        ['port-congestion', '港口拥堵', 23, 'normal', '前面排着 60 条船，你的排第 61。'],
        ['capacity-crunch', '舱位紧张', 29, 'elite', '运费翻了三倍，还没有舱位。'],
        ['tariff-wall', '关税壁垒', 36, 'boss', '一夜之间，税率涨了 25%。'],
      ]},
      { id: 'supplier-maze', name: '供应商迷宫', desc: '独家供应商是蜜糖，也是绳索。', enemies: [
        ['supplier-no-show', '供应商跳票', 49, 'normal', '签了合同，收了定金，然后人间蒸发。'],
        ['capacity-shortfall', '产能不足', 57, 'elite', '「我们产能满了，下个季度吧。」'],
        ['price-hike-ultimatum', '涨价通牒', 65, 'boss', '一封邮件：成本上涨，即日起涨价 30%。'],
      ]},
      { id: 'blackswan-port', name: '黑天鹅港口', desc: '所有备用方案同时失效。', enemies: [
        ['chain-break-behemoth', '断链巨兽', 79, 'normal', '一个二级供应商停产，全球产线停摆。'],
        ['geo-blockade', '地缘封锁', 88, 'elite', '航线关闭，货物滞留，合同无法履行。'],
        ['demand-shock', '需求突变', 97, 'boss', '昨天缺货，今天爆仓。'],
      ]},
    ],
  },
  // ============================ 财经类 ============================
  {
    id: 'finance', name: '财经类', icon: '🧾', color: '#eb5757',
    desc: '每一分钱都要说清楚来路和去处。',
    areas: [
      { id: 'budget-canyon', name: '预算峡谷', desc: '年初画的饼，年中变成了坑。', enemies: [
        ['expense-reject', '报销驳回', 2, 'normal', '「发票抬头错了，重开。」'],
        ['budget-overrun', '预算超支', 7, 'elite', '还剩三个月，钱花完了。'],
        ['invoice-violation', '发票不合规', 12, 'boss', '审计说这张票不能入账，金额 80 万。'],
      ]},
      { id: 'audit-temple', name: '审计神殿', desc: '审计进场，全员戒备。', enemies: [
        ['audit-eye', '审计之眼', 22, 'normal', '它盯着你的每一笔凭证。'],
        ['compliance-query', '合规质询', 28, 'elite', '「这笔支出的业务实质是什么？」'],
        ['workpaper-check', '底稿检查', 35, 'boss', '你的底稿少了一个签字，全部重做。'],
      ]},
      { id: 'baddebt-graveyard', name: '坏账墓地', desc: '计提减值的每一笔，都埋着一个故事。', enemies: [
        ['baddebt-ghost', '坏账幽灵', 48, 'normal', '它挂在账上三年，没人敢动。'],
        ['deadbeat-client', '客户赖账', 56, 'elite', '「我们资金紧张，再宽限两个月。」'],
        ['cashflow-rupture', '现金流断裂', 64, 'boss', '账上有利润，卡里没有钱。'],
      ]},
      { id: 'fx-storm', name: '汇率风暴', desc: '小数点后第四位，决定你今年的奖金。', enemies: [
        ['fx-volatility', '汇率波动怪', 78, 'normal', '一夜之间，波动 3%。'],
        ['fx-loss', '汇兑损失', 87, 'elite', '报表上多了一行，金额是负七位数。'],
        ['budget-freezer', '预算冻结者', 96, 'boss', '「所有非必要支出，即刻停止。」'],
      ]},
    ],
  },
  // ============================ 法务类 ============================
  {
    id: 'legal', name: '法务类', icon: '⚖️', color: '#2d9cdb',
    desc: '合同上的每个字，都可能在法庭上被念出来。',
    areas: [
      { id: 'contract-maze', name: '合同迷宫', desc: '签之前是护身符，签之后是紧箍咒。', enemies: [
        ['contract-trap', '合同陷阱', 3, 'normal', '藏在附件三第 2.4 条里的那句话。'],
        ['vague-clause', '条款模糊', 8, 'elite', '「合理期限内」——多合理？谁说了算？'],
        ['unlimited-liability', '责任无限', 13, 'boss', '你签了一份没有责任上限的合同。'],
      ]},
      { id: 'compliance-court', name: '合规法庭', desc: '红线画在哪里，没人提前告诉你。', enemies: [
        ['compliance-auditor', '合规审查者', 21, 'normal', '它带着一本 400 页的手册来查你。'],
        ['risk-warning', '风险提示', 27, 'elite', '「此项目存在重大合规风险，建议终止。」'],
        ['nda-binder', '保密协议', 34, 'boss', '你签了 NDA，现在你什么都不能说。'],
      ]},
      { id: 'litigation-volcano', name: '诉讼火山', desc: '一旦喷发，烧的是时间和钱。', enemies: [
        ['lawsuit-behemoth', '诉讼巨兽', 47, 'normal', '一张传票，标的额八千万。'],
        ['discovery-beast', '证据开示', 55, 'elite', '对方要你交出过去五年的所有邮件。'],
        ['jurisdiction-dispute', '管辖权争议', 63, 'boss', '官司该在哪打，先打一年。'],
      ]},
      { id: 'ip-battlefield', name: '知识产权战场', desc: '你申请的专利，可能正在被别人用。', enemies: [
        ['ip-thief', '知识产权窃贼', 77, 'normal', '你的方案，出现在对手的发布会上。'],
        ['patent-lawsuit', '专利诉讼', 86, 'elite', '一个 1998 年的专利，卡住了你的整条产品线。'],
        ['trademark-squatter', '商标抢注', 95, 'boss', '有人在你之前，把名字注册了。'],
      ]},
    ],
  },
  // ============================ 人力资源类 ============================
  {
    id: 'hr', name: '人力资源类', icon: '👥', color: '#f2c94c',
    desc: '招人、留人、送人，每一件都不好办。',
    areas: [
      { id: 'hiring-wasteland', name: '招聘荒原', desc: '简历很多，合适的一个没有。', enemies: [
        ['hc-freeze', 'HC 冻结', 1, 'normal', '岗位挂了半年，编制批不下来。'],
        ['candidate-ghost', '候选人放鸽子', 6, 'elite', 'offer 发了，入职当天人没来。'],
        ['channel-drought', '招聘渠道枯竭', 11, 'boss', '所有渠道都试过了，还是没有简历。'],
      ]},
      { id: 'perf-arena', name: '绩效竞技场', desc: '强制分布，总有人要背 C。', enemies: [
        ['perf-dispute', '绩效争议', 20, 'normal', '「我不认可这个结果，我要申诉。」'],
        ['okr-envy', '目标攀比', 26, 'elite', '隔壁组的目标定得比你高，奖金也比你多。'],
        ['feedback-void', '反馈缺失', 33, 'boss', '你从没跟下属谈过，现在要打分。'],
      ]},
      { id: 'attrition-wave', name: '离职潮', desc: '一个人走是个人选择，一群人走是管理问题。', enemies: [
        ['attrition-wave', '离职潮', 46, 'normal', '这个月第九个提离职的。'],
        ['morale-collapse', '士气崩溃', 54, 'elite', '团队群里没人说话，持续了两周。'],
        ['poaching-rival', '竞争对手挖角', 62, 'boss', '对手开双倍薪资，挖走了你的核心。'],
      ]},
      { id: 'arbitration-court', name: '仲裁法庭', desc: '离职见人品，也见法律。', enemies: [
        ['labor-arbitration', '劳动仲裁', 76, 'normal', '前员工提了仲裁，诉求 12 项。'],
        ['severance-behemoth', '赔偿金巨兽', 85, 'elite', '2N 还是 N+1，差着几十万。'],
        ['pr-risk', '舆论风险', 94, 'boss', '一条爆料帖，把公司送上热搜。'],
      ]},
    ],
  },
];

const WORLD_BOSSES = [
  ['uncertainty', '不确定性', 100, 'world', '你不知道它是什么，也不知道它什么时候来。'],
  ['blackswan', '黑天鹅', 105, 'world', '概率为零的事件，今天发生了。'],
  ['deadline', 'Deadline', 110, 'world', '它不是一个时间点，它是一种存在。'],
  ['economic-cycle', '经济周期', 115, 'world', '繁荣之后是衰退，衰退之后是繁荣，但你等不到。'],
  ['geopolitics', '地缘政治', 120, 'world', '一张地图上的线条，决定了你今年的产能。'],
];

// ---------------------------------------------------------------- 掉落
/** 按档位分层的战斗食物池 */
export const FOOD_BY_TIER = {
  1: ['milktea-common', 'coffee-americano'],
  2: ['milktea-common', 'coffee-americano'],
  3: ['milktea-cheese', 'coffee-latte'],
  4: ['milktea-cheese', 'coffee-latte'],
  5: ['milktea-fruit', 'coffee-espresso'],
  6: ['milktea-fruit', 'coffee-espresso'],
  7: ['energy-drink', 'vitamin-pack'],
  8: ['energy-drink', 'vitamin-pack'],
};

function dropFor(L, kind, tier) {
  const drops = [];
  const isBoss = kind === 'boss' || kind === 'world';
  const isElite = kind === 'elite';

  // 摸鱼点
  drops.push({ item: 'slack-point', chance: 100, min: isBoss ? 6 : isElite ? 3 : 1, max: isBoss ? 18 : isElite ? 8 : 4 });

  // 奶茶 / 咖啡
  drops.push({ item: 'FOOD', chance: isBoss ? 55 : isElite ? 32 : 18, min: 1, max: isBoss ? 4 : 1, tier });

  // 装备
  if (L >= 5) {
    drops.push({ item: 'EQUIP', chance: isBoss ? 25 : isElite ? 12 : 5, min: 1, max: 1, tier });
  }

  // 高级怪额外掉灵感 / 人脉
  if (L >= 40) drops.push({ item: 'inspiration', chance: 12, min: 1, max: 3 });
  if (L >= 60) drops.push({ item: 'network', chance: 10, min: 1, max: 2 });

  return drops;
}

// ---------------------------------------------------------------- 生成
const STYLES = ['execution', 'communication', 'presentation'];
const out = [];

for (const cat of AREAS) {
  for (const area of cat.areas) {
    area.enemies.forEach(([id, name, level, kind, desc], idx) => {
      out.push(makeEnemy(id, name, level, kind, desc, cat.id, area.id, STYLES[idx % 3]));
    });
  }
}
WORLD_BOSSES.forEach(([id, name, level, kind, desc], idx) => {
  out.push(makeEnemy(id, name, level, kind, desc, 'world', 'world-bosses', STYLES[idx % 3]));
});

const areaMeta = [];
for (const cat of AREAS) {
  for (const area of cat.areas) {
    const lvls = area.enemies.map((e) => e[2]);
    areaMeta.push({
      id: area.id, name: area.name, desc: area.desc, category: cat.id,
      minLevel: Math.min(...lvls), maxLevel: Math.max(...lvls),
    });
  }
}
areaMeta.push({
  id: 'world-bosses', name: '世界 Boss', category: 'world',
  desc: '职场终极难题，建议职场等级 85 以上再来。', minLevel: 100, maxLevel: 120,
});

const categories = AREAS.map((c) => ({ id: c.id, name: c.name, icon: c.icon, color: c.color, desc: c.desc }));
categories.push({ id: 'world', name: '世界 Boss', icon: '🌍', color: '#ffd166', desc: '独立区域，职场终极难题。' });

const header = `/**
 * 《菊厂放置》敌人数据 —— 由 tools/gen-enemies.mjs 自动生成，请勿手改。
 * 共 ${out.length} 个敌人 / ${areaMeta.length} 个区域 / ${categories.length} 个岗位大类
 *
 * 数值由「玩家期望战力模型」反推，公式见生成器注释。
 */
`;

const js = `${header}
export const ENEMY_CATEGORIES = ${JSON.stringify(categories, null, 2)};

export const COMBAT_AREAS = ${JSON.stringify(areaMeta, null, 2)};

export const ENEMIES = ${JSON.stringify(out, null, 2)};

export const ENEMY_MAP = Object.fromEntries(ENEMIES.map((e) => [e.id, e]));

/** 战斗食物掉落池（按敌人档位分层） */
export const FOOD_BY_TIER = ${JSON.stringify(FOOD_BY_TIER, null, 2)};
`;

writeFileSync(join(__dirname, '..', 'js', 'data', 'enemies.js'), js, 'utf8');

console.log(`✅ 生成 ${out.length} 个敌人 / ${areaMeta.length} 个区域`);
console.log('\n等级   名称              类型      HP        伤害     命中      闪避      减伤  金钱');
for (const lv of [1, 10, 20, 35, 50, 64, 78, 87, 96, 100, 110, 120]) {
  const e = out.find((x) => x.level === lv);
  if (!e) continue;
  console.log(
    `${String(e.level).padStart(3)}  ${e.name.padEnd(16)} ${e.kind.padEnd(8)} ${String(e.hp).padStart(10)} ${String(e.maxHit).padStart(7)} ${String(e.accuracy).padStart(9)} ${String(e.evasion).padStart(9)} ${String(e.dr).padStart(4)}% ${String(e.gold).padStart(10)}`,
  );
}
