/**
 * 《菊厂放置》敌人数据 —— 由 tools/gen-enemies.mjs 自动生成，请勿手改。
 * 共 89 个敌人 / 29 个区域 / 8 个岗位大类
 *
 * 数值由「玩家期望战力模型」反推，公式见生成器注释。
 */

export const ENEMY_CATEGORIES = [
  {
    "id": "rd",
    "name": "研发类",
    "icon": "⌨️",
    "color": "#4f9cf9",
    "desc": "写代码的人遇到的麻烦，从需求到上线，从架构到 Deadline。"
  },
  {
    "id": "sales",
    "name": "销售类",
    "icon": "📈",
    "color": "#f2994a",
    "desc": "签单之前是朋友，签单之后是甲方。"
  },
  {
    "id": "service",
    "name": "服务类",
    "icon": "🎧",
    "color": "#27ae60",
    "desc": "客户永远是对的，直到他开始骂人。"
  },
  {
    "id": "supply",
    "name": "供应链类",
    "icon": "🚢",
    "color": "#9b51e0",
    "desc": "物料在路上，船在海上，你在火上。"
  },
  {
    "id": "finance",
    "name": "财经类",
    "icon": "🧾",
    "color": "#eb5757",
    "desc": "每一分钱都要说清楚来路和去处。"
  },
  {
    "id": "legal",
    "name": "法务类",
    "icon": "⚖️",
    "color": "#2d9cdb",
    "desc": "合同上的每个字，都可能在法庭上被念出来。"
  },
  {
    "id": "hr",
    "name": "人力资源类",
    "icon": "👥",
    "color": "#f2c94c",
    "desc": "招人、留人、送人，每一件都不好办。"
  },
  {
    "id": "world",
    "name": "世界 Boss",
    "icon": "🌍",
    "color": "#ffd166",
    "desc": "独立区域，职场终极难题。"
  }
];

export const COMBAT_AREAS = [
  {
    "id": "req-swamp",
    "name": "需求沼泽",
    "desc": "需求在这里腐烂，每走一步都更深。",
    "category": "rd",
    "minLevel": 3,
    "maxLevel": 12
  },
  {
    "id": "code-forge",
    "name": "代码熔炉",
    "desc": "高温高压，Bug 在熔炉里繁殖。",
    "category": "rd",
    "minLevel": 22,
    "maxLevel": 35
  },
  {
    "id": "prod-fireline",
    "name": "线上火线",
    "desc": "凌晨三点的告警，永远不会挑时间。",
    "category": "rd",
    "minLevel": 48,
    "maxLevel": 64
  },
  {
    "id": "arch-abyss",
    "name": "架构深渊",
    "desc": "重构一次，少活三年。",
    "category": "rd",
    "minLevel": 78,
    "maxLevel": 96
  },
  {
    "id": "lead-wasteland",
    "name": "线索荒原",
    "desc": "名单很长，能打的没几个。",
    "category": "sales",
    "minLevel": 2,
    "maxLevel": 11
  },
  {
    "id": "negotiation-table",
    "name": "谈判桌",
    "desc": "一张桌子，两个立场，三小时拉锯。",
    "category": "sales",
    "minLevel": 21,
    "maxLevel": 34
  },
  {
    "id": "rival-battlefield",
    "name": "竞品战场",
    "desc": "你降一毛，他降两毛。",
    "category": "sales",
    "minLevel": 47,
    "maxLevel": 63
  },
  {
    "id": "collection-abyss",
    "name": "回款深渊",
    "desc": "合同签了，钱还在路上。",
    "category": "sales",
    "minLevel": 77,
    "maxLevel": 95
  },
  {
    "id": "ticket-ocean",
    "name": "工单海洋",
    "desc": "你关掉十张，它涨回来二十张。",
    "category": "service",
    "minLevel": 1,
    "maxLevel": 10
  },
  {
    "id": "sla-clocktower",
    "name": "SLA 时钟塔",
    "desc": "秒针每走一格，你的心跳快一拍。",
    "category": "service",
    "minLevel": 20,
    "maxLevel": 33
  },
  {
    "id": "outage-storm",
    "name": "故障风暴",
    "desc": "一个问题引出三个问题，三个引出九个。",
    "category": "service",
    "minLevel": 46,
    "maxLevel": 62
  },
  {
    "id": "customer-wrath",
    "name": "客户怒火",
    "desc": "满意度调查，他给了零分，还写了小作文。",
    "category": "service",
    "minLevel": 76,
    "maxLevel": 94
  },
  {
    "id": "material-desert",
    "name": "缺料沙漠",
    "desc": "生产线停了，物料还在供应商的仓库里。",
    "category": "supply",
    "minLevel": 4,
    "maxLevel": 13
  },
  {
    "id": "logistics-strait",
    "name": "物流海峡",
    "desc": "一船货，卡在海峡中间。",
    "category": "supply",
    "minLevel": 23,
    "maxLevel": 36
  },
  {
    "id": "supplier-maze",
    "name": "供应商迷宫",
    "desc": "独家供应商是蜜糖，也是绳索。",
    "category": "supply",
    "minLevel": 49,
    "maxLevel": 65
  },
  {
    "id": "blackswan-port",
    "name": "黑天鹅港口",
    "desc": "所有备用方案同时失效。",
    "category": "supply",
    "minLevel": 79,
    "maxLevel": 97
  },
  {
    "id": "budget-canyon",
    "name": "预算峡谷",
    "desc": "年初画的饼，年中变成了坑。",
    "category": "finance",
    "minLevel": 2,
    "maxLevel": 12
  },
  {
    "id": "audit-temple",
    "name": "审计神殿",
    "desc": "审计进场，全员戒备。",
    "category": "finance",
    "minLevel": 22,
    "maxLevel": 35
  },
  {
    "id": "baddebt-graveyard",
    "name": "坏账墓地",
    "desc": "计提减值的每一笔，都埋着一个故事。",
    "category": "finance",
    "minLevel": 48,
    "maxLevel": 64
  },
  {
    "id": "fx-storm",
    "name": "汇率风暴",
    "desc": "小数点后第四位，决定你今年的奖金。",
    "category": "finance",
    "minLevel": 78,
    "maxLevel": 96
  },
  {
    "id": "contract-maze",
    "name": "合同迷宫",
    "desc": "签之前是护身符，签之后是紧箍咒。",
    "category": "legal",
    "minLevel": 3,
    "maxLevel": 13
  },
  {
    "id": "compliance-court",
    "name": "合规法庭",
    "desc": "红线画在哪里，没人提前告诉你。",
    "category": "legal",
    "minLevel": 21,
    "maxLevel": 34
  },
  {
    "id": "litigation-volcano",
    "name": "诉讼火山",
    "desc": "一旦喷发，烧的是时间和钱。",
    "category": "legal",
    "minLevel": 47,
    "maxLevel": 63
  },
  {
    "id": "ip-battlefield",
    "name": "知识产权战场",
    "desc": "你申请的专利，可能正在被别人用。",
    "category": "legal",
    "minLevel": 77,
    "maxLevel": 95
  },
  {
    "id": "hiring-wasteland",
    "name": "招聘荒原",
    "desc": "简历很多，合适的一个没有。",
    "category": "hr",
    "minLevel": 1,
    "maxLevel": 11
  },
  {
    "id": "perf-arena",
    "name": "绩效竞技场",
    "desc": "强制分布，总有人要背 C。",
    "category": "hr",
    "minLevel": 20,
    "maxLevel": 33
  },
  {
    "id": "attrition-wave",
    "name": "离职潮",
    "desc": "一个人走是个人选择，一群人走是管理问题。",
    "category": "hr",
    "minLevel": 46,
    "maxLevel": 62
  },
  {
    "id": "arbitration-court",
    "name": "仲裁法庭",
    "desc": "离职见人品，也见法律。",
    "category": "hr",
    "minLevel": 76,
    "maxLevel": 94
  },
  {
    "id": "world-bosses",
    "name": "世界 Boss",
    "category": "world",
    "desc": "职场终极难题，建议职场等级 85 以上再来。",
    "minLevel": 100,
    "maxLevel": 120
  }
];

export const ENEMIES = [
  {
    "id": "vague-req",
    "name": "模糊需求",
    "level": 3,
    "kind": "normal",
    "desc": "它说的话你每个字都认识，连起来完全不懂。",
    "category": "rd",
    "area": "req-swamp",
    "style": "execution",
    "hp": 62,
    "maxHit": 5,
    "accuracy": 733,
    "evasion": 305,
    "dr": 0,
    "interval": 3000,
    "gold": 155,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "scope-creep",
    "name": "频繁改需",
    "level": 7,
    "kind": "elite",
    "desc": "昨天说要 A，今天说要 B，明天说要 A+B。",
    "category": "rd",
    "area": "req-swamp",
    "style": "communication",
    "hp": 115,
    "maxHit": 7,
    "accuracy": 819,
    "evasion": 305,
    "dr": 5,
    "interval": 2800,
    "gold": 288,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "schedule-crunch",
    "name": "排期压缩",
    "level": 12,
    "kind": "boss",
    "desc": "「这个很简单吧？三天够了吧？」",
    "category": "rd",
    "area": "req-swamp",
    "style": "presentation",
    "hp": 243,
    "maxHit": 16,
    "accuracy": 1233,
    "evasion": 397,
    "dr": 11,
    "interval": 3200,
    "gold": 608,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "bug-slime",
    "name": "Bug 史莱姆",
    "level": 22,
    "kind": "normal",
    "desc": "你修好一个，它分裂成两个。",
    "category": "rd",
    "area": "code-forge",
    "style": "execution",
    "hp": 198,
    "maxHit": 14,
    "accuracy": 1685,
    "evasion": 702,
    "dr": 1,
    "interval": 3000,
    "gold": 495,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "tech-debt-drake",
    "name": "技术债幼龙",
    "level": 28,
    "kind": "elite",
    "desc": "它现在很小，但它在利滚利。",
    "category": "rd",
    "area": "code-forge",
    "style": "communication",
    "hp": 462,
    "maxHit": 37,
    "accuracy": 3598,
    "evasion": 1099,
    "dr": 7,
    "interval": 2800,
    "gold": 1155,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "integration-hell",
    "name": "联调地狱",
    "level": 35,
    "kind": "boss",
    "desc": "你的接口没问题，他的也没问题，合起来就是不通。",
    "category": "rd",
    "area": "code-forge",
    "style": "presentation",
    "hp": 945,
    "maxHit": 76,
    "accuracy": 5172,
    "evasion": 1364,
    "dr": 14,
    "interval": 3200,
    "gold": 2363,
    "tier": 3,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 3
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 3
      }
    ]
  },
  {
    "id": "prod-incident",
    "name": "线上事故",
    "level": 48,
    "kind": "normal",
    "desc": "它总在你刚躺下的时候出现。",
    "category": "rd",
    "area": "prod-fireline",
    "style": "execution",
    "hp": 914,
    "maxHit": 66,
    "accuracy": 10371,
    "evasion": 2741,
    "dr": 4,
    "interval": 3000,
    "gold": 2285,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "perf-bottleneck",
    "name": "性能瓶颈",
    "level": 56,
    "kind": "elite",
    "desc": "压测环境一切正常，生产环境原地升天。",
    "category": "rd",
    "area": "prod-fireline",
    "style": "communication",
    "hp": 3425,
    "maxHit": 190,
    "accuracy": 31515,
    "evasion": 5806,
    "dr": 9,
    "interval": 2800,
    "gold": 8563,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "security-hole",
    "name": "安全漏洞",
    "level": 64,
    "kind": "boss",
    "desc": "它藏在你最自信的那段代码里。",
    "category": "rd",
    "area": "prod-fireline",
    "style": "presentation",
    "hp": 6253,
    "maxHit": 339,
    "accuracy": 41613,
    "evasion": 6621,
    "dr": 18,
    "interval": 3200,
    "gold": 15633,
    "tier": 5,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 5
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 5
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "refactor-dragon",
    "name": "架构重构巨龙",
    "level": 78,
    "kind": "normal",
    "desc": "「顺手重构一下」是它的开场白。",
    "category": "rd",
    "area": "arch-abyss",
    "style": "execution",
    "hp": 8278,
    "maxHit": 355,
    "accuracy": 101195,
    "evasion": 17051,
    "dr": 6,
    "interval": 3000,
    "gold": 20695,
    "tier": 6,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "deadline-reaper",
    "name": "Deadline死神",
    "level": 87,
    "kind": "elite",
    "desc": "它不杀人，它只是让你自己加班到死。",
    "category": "rd",
    "area": "arch-abyss",
    "style": "communication",
    "hp": 36354,
    "maxHit": 1350,
    "accuracy": 342509,
    "evasion": 44106,
    "dr": 12,
    "interval": 2800,
    "gold": 90885,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "blackswan-outage",
    "name": "黑天鹅故障",
    "level": 96,
    "kind": "boss",
    "desc": "从未发生过的故障，今天第一次发生。",
    "category": "rd",
    "area": "arch-abyss",
    "style": "presentation",
    "hp": 159005,
    "maxHit": 6927,
    "accuracy": 1210938,
    "evasion": 117816,
    "dr": 22,
    "interval": 3200,
    "gold": 397513,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "dry-leads",
    "name": "线索干涸",
    "level": 2,
    "kind": "normal",
    "desc": "CRM 里躺着三千条，拨过去全是空号。",
    "category": "sales",
    "area": "lead-wasteland",
    "style": "execution",
    "hp": 58,
    "maxHit": 5,
    "accuracy": 733,
    "evasion": 305,
    "dr": 0,
    "interval": 3000,
    "gold": 145,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "rejection-beast",
    "name": "客户拒绝兽",
    "level": 6,
    "kind": "elite",
    "desc": "「我们暂时没有需求」——它说了两年。",
    "category": "sales",
    "area": "lead-wasteland",
    "style": "communication",
    "hp": 110,
    "maxHit": 7,
    "accuracy": 819,
    "evasion": 305,
    "dr": 5,
    "interval": 2800,
    "gold": 275,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "rival-assassin",
    "name": "竞品刺客",
    "level": 11,
    "kind": "boss",
    "desc": "它比你先到五分钟，价格比你低一成。",
    "category": "sales",
    "area": "lead-wasteland",
    "style": "presentation",
    "hp": 225,
    "maxHit": 14,
    "accuracy": 1138,
    "evasion": 366,
    "dr": 11,
    "interval": 3200,
    "gold": 563,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "price-tug",
    "name": "价格拉锯",
    "level": 21,
    "kind": "normal",
    "desc": "「再便宜点，我们就签。」",
    "category": "sales",
    "area": "negotiation-table",
    "style": "execution",
    "hp": 188,
    "maxHit": 13,
    "accuracy": 1612,
    "evasion": 671,
    "dr": 1,
    "interval": 3000,
    "gold": 470,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "budget-freeze-array",
    "name": "预算冻结法阵",
    "level": 27,
    "kind": "elite",
    "desc": "年底了，钱在财务那里冻成冰。",
    "category": "sales",
    "area": "negotiation-table",
    "style": "communication",
    "hp": 440,
    "maxHit": 36,
    "accuracy": 3474,
    "evasion": 1061,
    "dr": 7,
    "interval": 2800,
    "gold": 1100,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "decision-maze",
    "name": "决策链迷宫",
    "level": 34,
    "kind": "boss",
    "desc": "七个人点头，第八个人说再议。",
    "category": "sales",
    "area": "negotiation-table",
    "style": "presentation",
    "hp": 906,
    "maxHit": 74,
    "accuracy": 5028,
    "evasion": 1327,
    "dr": 14,
    "interval": 3200,
    "gold": 2265,
    "tier": 3,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 3
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 3
      }
    ]
  },
  {
    "id": "lowball-snipe",
    "name": "低价截胡",
    "level": 47,
    "kind": "normal",
    "desc": "你谈了三个月，他报了个骨折价。",
    "category": "sales",
    "area": "rival-battlefield",
    "style": "execution",
    "hp": 894,
    "maxHit": 65,
    "accuracy": 10159,
    "evasion": 2685,
    "dr": 3,
    "interval": 3000,
    "gold": 2235,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "churn-beast",
    "name": "客户流失",
    "level": 55,
    "kind": "elite",
    "desc": "续约前一周，它悄悄换了供应商。",
    "category": "sales",
    "area": "rival-battlefield",
    "style": "communication",
    "hp": 3326,
    "maxHit": 188,
    "accuracy": 30962,
    "evasion": 5704,
    "dr": 9,
    "interval": 2800,
    "gold": 8315,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "channel-betrayal",
    "name": "渠道反水",
    "level": 63,
    "kind": "boss",
    "desc": "你的代理商，成了对手的代理商。",
    "category": "sales",
    "area": "rival-battlefield",
    "style": "presentation",
    "hp": 6165,
    "maxHit": 336,
    "accuracy": 40973,
    "evasion": 6519,
    "dr": 17,
    "interval": 3200,
    "gold": 15413,
    "tier": 5,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 5
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 5
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "payment-ghost",
    "name": "回款幽灵",
    "level": 77,
    "kind": "normal",
    "desc": "流程走到第八个节点，卡住了。",
    "category": "sales",
    "area": "collection-abyss",
    "style": "execution",
    "hp": 8272,
    "maxHit": 353,
    "accuracy": 99914,
    "evasion": 16836,
    "dr": 6,
    "interval": 3000,
    "gold": 20680,
    "tier": 6,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "baddebt-behemoth",
    "name": "坏账巨兽",
    "level": 86,
    "kind": "elite",
    "desc": "它欠你三百万，还理直气壮。",
    "category": "sales",
    "area": "collection-abyss",
    "style": "communication",
    "hp": 36410,
    "maxHit": 1344,
    "accuracy": 338617,
    "evasion": 43604,
    "dr": 12,
    "interval": 2800,
    "gold": 91025,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "dispute-king",
    "name": "合同纠纷王",
    "level": 95,
    "kind": "boss",
    "desc": "「这条我们没约定过。」——白纸黑字写着。",
    "category": "sales",
    "area": "collection-abyss",
    "style": "presentation",
    "hp": 161666,
    "maxHit": 6900,
    "accuracy": 1198454,
    "evasion": 116602,
    "dr": 21,
    "interval": 3200,
    "gold": 404165,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "dup-ticket",
    "name": "重复工单",
    "level": 1,
    "kind": "normal",
    "desc": "同一件事，他提了六遍，还抄送了老板。",
    "category": "service",
    "area": "ticket-ocean",
    "style": "execution",
    "hp": 55,
    "maxHit": 5,
    "accuracy": 733,
    "evasion": 305,
    "dr": 0,
    "interval": 3000,
    "gold": 138,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "ticket-backlog",
    "name": "工单积压",
    "level": 5,
    "kind": "elite",
    "desc": "队列里排着 400 张，最早那张是三年前的。",
    "category": "service",
    "area": "ticket-ocean",
    "style": "communication",
    "hp": 104,
    "maxHit": 7,
    "accuracy": 819,
    "evasion": 305,
    "dr": 5,
    "interval": 2800,
    "gold": 260,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "customer-nag",
    "name": "客户催促",
    "level": 10,
    "kind": "boss",
    "desc": "「在吗？」「在吗？」「在吗？」",
    "category": "service",
    "area": "ticket-ocean",
    "style": "presentation",
    "hp": 208,
    "maxHit": 13,
    "accuracy": 1043,
    "evasion": 336,
    "dr": 11,
    "interval": 3200,
    "gold": 520,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "sla-countdown",
    "name": "SLA 倒计时",
    "level": 20,
    "kind": "normal",
    "desc": "还剩 47 分钟，你还有三个会要开。",
    "category": "service",
    "area": "sla-clocktower",
    "style": "execution",
    "hp": 177,
    "maxHit": 13,
    "accuracy": 1539,
    "evasion": 641,
    "dr": 1,
    "interval": 3000,
    "gold": 443,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "escalated-ticket",
    "name": "升级工单",
    "level": 26,
    "kind": "elite",
    "desc": "它升到了 VP 那里，现在全公司都看着你。",
    "category": "service",
    "area": "sla-clocktower",
    "style": "communication",
    "hp": 419,
    "maxHit": 35,
    "accuracy": 3350,
    "evasion": 1023,
    "dr": 7,
    "interval": 2800,
    "gold": 1048,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "remote-diag-fail",
    "name": "远程诊断失败",
    "level": 33,
    "kind": "boss",
    "desc": "「您先重启一下试试？」「试过了。」",
    "category": "service",
    "area": "sla-clocktower",
    "style": "presentation",
    "hp": 869,
    "maxHit": 72,
    "accuracy": 4884,
    "evasion": 1289,
    "dr": 14,
    "interval": 3200,
    "gold": 2173,
    "tier": 3,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 3
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 3
      }
    ]
  },
  {
    "id": "cascade-failure",
    "name": "连环故障",
    "level": 46,
    "kind": "normal",
    "desc": "你修好了 A，B 挂了；修好 B，C 挂了。",
    "category": "service",
    "area": "outage-storm",
    "style": "execution",
    "hp": 865,
    "maxHit": 64,
    "accuracy": 9948,
    "evasion": 2629,
    "dr": 3,
    "interval": 3000,
    "gold": 2163,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "spare-part-ghost",
    "name": "备件短缺幽灵",
    "level": 54,
    "kind": "elite",
    "desc": "仓库说有一块，现场翻了三小时没找到。",
    "category": "service",
    "area": "outage-storm",
    "style": "communication",
    "hp": 3228,
    "maxHit": 187,
    "accuracy": 30410,
    "evasion": 5602,
    "dr": 9,
    "interval": 2800,
    "gold": 8070,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "info-barrage",
    "name": "信息轰炸",
    "level": 62,
    "kind": "boss",
    "desc": "八个群里同时在 @ 你。",
    "category": "service",
    "area": "outage-storm",
    "style": "presentation",
    "hp": 6003,
    "maxHit": 334,
    "accuracy": 40333,
    "evasion": 6417,
    "dr": 17,
    "interval": 3200,
    "gold": 15008,
    "tier": 5,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 5
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 5
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "complaint-troll",
    "name": "客户投诉巨魔",
    "level": 76,
    "kind": "normal",
    "desc": "他投诉的不是问题，是你的态度。",
    "category": "service",
    "area": "customer-wrath",
    "style": "execution",
    "hp": 8264,
    "maxHit": 351,
    "accuracy": 98633,
    "evasion": 16620,
    "dr": 6,
    "interval": 3000,
    "gold": 20660,
    "tier": 6,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "pr-storm",
    "name": "舆情风暴",
    "level": 85,
    "kind": "elite",
    "desc": "一条微博，三万转发，热搜第八。",
    "category": "service",
    "area": "customer-wrath",
    "style": "communication",
    "hp": 36456,
    "maxHit": 1339,
    "accuracy": 334725,
    "evasion": 43103,
    "dr": 12,
    "interval": 2800,
    "gold": 91140,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "service-collapse",
    "name": "服务崩溃",
    "level": 94,
    "kind": "boss",
    "desc": "全线宕机，电话被打爆，官网挂了。",
    "category": "service",
    "area": "customer-wrath",
    "style": "presentation",
    "hp": 162247,
    "maxHit": 6873,
    "accuracy": 1185971,
    "evasion": 115387,
    "dr": 21,
    "interval": 3200,
    "gold": 405618,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "material-delay",
    "name": "物料延迟",
    "level": 4,
    "kind": "normal",
    "desc": "承诺周三到，周三说下周三。",
    "category": "supply",
    "area": "material-desert",
    "style": "execution",
    "hp": 65,
    "maxHit": 5,
    "accuracy": 733,
    "evasion": 305,
    "dr": 0,
    "interval": 3000,
    "gold": 163,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "inventory-drift",
    "name": "库存偏差",
    "level": 8,
    "kind": "elite",
    "desc": "系统显示 500，实物 47。",
    "category": "supply",
    "area": "material-desert",
    "style": "communication",
    "hp": 120,
    "maxHit": 7,
    "accuracy": 819,
    "evasion": 305,
    "dr": 5,
    "interval": 2800,
    "gold": 300,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "delivery-break",
    "name": "交期跳票",
    "level": 13,
    "kind": "boss",
    "desc": "客户在等，产线在停，供应商在度假。",
    "category": "supply",
    "area": "material-desert",
    "style": "presentation",
    "hp": 262,
    "maxHit": 18,
    "accuracy": 1327,
    "evasion": 427,
    "dr": 11,
    "interval": 3200,
    "gold": 655,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "port-congestion",
    "name": "港口拥堵",
    "level": 23,
    "kind": "normal",
    "desc": "前面排着 60 条船，你的排第 61。",
    "category": "supply",
    "area": "logistics-strait",
    "style": "execution",
    "hp": 238,
    "maxHit": 23,
    "accuracy": 2664,
    "evasion": 910,
    "dr": 1,
    "interval": 3000,
    "gold": 595,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "capacity-crunch",
    "name": "舱位紧张",
    "level": 29,
    "kind": "elite",
    "desc": "运费翻了三倍，还没有舱位。",
    "category": "supply",
    "area": "logistics-strait",
    "style": "communication",
    "hp": 484,
    "maxHit": 38,
    "accuracy": 3722,
    "evasion": 1137,
    "dr": 7,
    "interval": 2800,
    "gold": 1210,
    "tier": 3,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 3
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 3
      }
    ]
  },
  {
    "id": "tariff-wall",
    "name": "关税壁垒",
    "level": 36,
    "kind": "boss",
    "desc": "一夜之间，税率涨了 25%。",
    "category": "supply",
    "area": "logistics-strait",
    "style": "presentation",
    "hp": 984,
    "maxHit": 78,
    "accuracy": 5315,
    "evasion": 1402,
    "dr": 14,
    "interval": 3200,
    "gold": 2460,
    "tier": 3,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 3
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 3
      }
    ]
  },
  {
    "id": "supplier-no-show",
    "name": "供应商跳票",
    "level": 49,
    "kind": "normal",
    "desc": "签了合同，收了定金，然后人间蒸发。",
    "category": "supply",
    "area": "supplier-maze",
    "style": "execution",
    "hp": 944,
    "maxHit": 67,
    "accuracy": 10583,
    "evasion": 2797,
    "dr": 4,
    "interval": 3000,
    "gold": 2360,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "capacity-shortfall",
    "name": "产能不足",
    "level": 57,
    "kind": "elite",
    "desc": "「我们产能满了，下个季度吧。」",
    "category": "supply",
    "area": "supplier-maze",
    "style": "communication",
    "hp": 3526,
    "maxHit": 192,
    "accuracy": 32068,
    "evasion": 5908,
    "dr": 9,
    "interval": 2800,
    "gold": 8815,
    "tier": 5,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 5
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 5
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "price-hike-ultimatum",
    "name": "涨价通牒",
    "level": 65,
    "kind": "boss",
    "desc": "一封邮件：成本上涨，即日起涨价 30%。",
    "category": "supply",
    "area": "supplier-maze",
    "style": "presentation",
    "hp": 16354,
    "maxHit": 773,
    "accuracy": 109408,
    "evasion": 14245,
    "dr": 18,
    "interval": 3200,
    "gold": 40885,
    "tier": 5,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 5
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 5
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "chain-break-behemoth",
    "name": "断链巨兽",
    "level": 79,
    "kind": "normal",
    "desc": "一个二级供应商停产，全球产线停摆。",
    "category": "supply",
    "area": "blackswan-port",
    "style": "execution",
    "hp": 24397,
    "maxHit": 934,
    "accuracy": 278596,
    "evasion": 40096,
    "dr": 6,
    "interval": 3000,
    "gold": 60993,
    "tier": 6,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "geo-blockade",
    "name": "地缘封锁",
    "level": 88,
    "kind": "elite",
    "desc": "航线关闭，货物滞留，合同无法履行。",
    "category": "supply",
    "area": "blackswan-port",
    "style": "communication",
    "hp": 36289,
    "maxHit": 1355,
    "accuracy": 346401,
    "evasion": 44607,
    "dr": 12,
    "interval": 2800,
    "gold": 90723,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "demand-shock",
    "name": "需求突变",
    "level": 97,
    "kind": "boss",
    "desc": "昨天缺货，今天爆仓。",
    "category": "supply",
    "area": "blackswan-port",
    "style": "presentation",
    "hp": 158349,
    "maxHit": 6955,
    "accuracy": 1223422,
    "evasion": 119031,
    "dr": 22,
    "interval": 3200,
    "gold": 395873,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "expense-reject",
    "name": "报销驳回",
    "level": 2,
    "kind": "normal",
    "desc": "「发票抬头错了，重开。」",
    "category": "finance",
    "area": "budget-canyon",
    "style": "execution",
    "hp": 58,
    "maxHit": 5,
    "accuracy": 733,
    "evasion": 305,
    "dr": 0,
    "interval": 3000,
    "gold": 145,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "budget-overrun",
    "name": "预算超支",
    "level": 7,
    "kind": "elite",
    "desc": "还剩三个月，钱花完了。",
    "category": "finance",
    "area": "budget-canyon",
    "style": "communication",
    "hp": 115,
    "maxHit": 7,
    "accuracy": 819,
    "evasion": 305,
    "dr": 5,
    "interval": 2800,
    "gold": 288,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "invoice-violation",
    "name": "发票不合规",
    "level": 12,
    "kind": "boss",
    "desc": "审计说这张票不能入账，金额 80 万。",
    "category": "finance",
    "area": "budget-canyon",
    "style": "presentation",
    "hp": 243,
    "maxHit": 16,
    "accuracy": 1233,
    "evasion": 397,
    "dr": 11,
    "interval": 3200,
    "gold": 608,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "audit-eye",
    "name": "审计之眼",
    "level": 22,
    "kind": "normal",
    "desc": "它盯着你的每一笔凭证。",
    "category": "finance",
    "area": "audit-temple",
    "style": "execution",
    "hp": 198,
    "maxHit": 14,
    "accuracy": 1685,
    "evasion": 702,
    "dr": 1,
    "interval": 3000,
    "gold": 495,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "compliance-query",
    "name": "合规质询",
    "level": 28,
    "kind": "elite",
    "desc": "「这笔支出的业务实质是什么？」",
    "category": "finance",
    "area": "audit-temple",
    "style": "communication",
    "hp": 462,
    "maxHit": 37,
    "accuracy": 3598,
    "evasion": 1099,
    "dr": 7,
    "interval": 2800,
    "gold": 1155,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "workpaper-check",
    "name": "底稿检查",
    "level": 35,
    "kind": "boss",
    "desc": "你的底稿少了一个签字，全部重做。",
    "category": "finance",
    "area": "audit-temple",
    "style": "presentation",
    "hp": 945,
    "maxHit": 76,
    "accuracy": 5172,
    "evasion": 1364,
    "dr": 14,
    "interval": 3200,
    "gold": 2363,
    "tier": 3,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 3
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 3
      }
    ]
  },
  {
    "id": "baddebt-ghost",
    "name": "坏账幽灵",
    "level": 48,
    "kind": "normal",
    "desc": "它挂在账上三年，没人敢动。",
    "category": "finance",
    "area": "baddebt-graveyard",
    "style": "execution",
    "hp": 914,
    "maxHit": 66,
    "accuracy": 10371,
    "evasion": 2741,
    "dr": 4,
    "interval": 3000,
    "gold": 2285,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "deadbeat-client",
    "name": "客户赖账",
    "level": 56,
    "kind": "elite",
    "desc": "「我们资金紧张，再宽限两个月。」",
    "category": "finance",
    "area": "baddebt-graveyard",
    "style": "communication",
    "hp": 3425,
    "maxHit": 190,
    "accuracy": 31515,
    "evasion": 5806,
    "dr": 9,
    "interval": 2800,
    "gold": 8563,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "cashflow-rupture",
    "name": "现金流断裂",
    "level": 64,
    "kind": "boss",
    "desc": "账上有利润，卡里没有钱。",
    "category": "finance",
    "area": "baddebt-graveyard",
    "style": "presentation",
    "hp": 6253,
    "maxHit": 339,
    "accuracy": 41613,
    "evasion": 6621,
    "dr": 18,
    "interval": 3200,
    "gold": 15633,
    "tier": 5,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 5
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 5
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "fx-volatility",
    "name": "汇率波动怪",
    "level": 78,
    "kind": "normal",
    "desc": "一夜之间，波动 3%。",
    "category": "finance",
    "area": "fx-storm",
    "style": "execution",
    "hp": 8278,
    "maxHit": 355,
    "accuracy": 101195,
    "evasion": 17051,
    "dr": 6,
    "interval": 3000,
    "gold": 20695,
    "tier": 6,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "fx-loss",
    "name": "汇兑损失",
    "level": 87,
    "kind": "elite",
    "desc": "报表上多了一行，金额是负七位数。",
    "category": "finance",
    "area": "fx-storm",
    "style": "communication",
    "hp": 36354,
    "maxHit": 1350,
    "accuracy": 342509,
    "evasion": 44106,
    "dr": 12,
    "interval": 2800,
    "gold": 90885,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "budget-freezer",
    "name": "预算冻结者",
    "level": 96,
    "kind": "boss",
    "desc": "「所有非必要支出，即刻停止。」",
    "category": "finance",
    "area": "fx-storm",
    "style": "presentation",
    "hp": 159005,
    "maxHit": 6927,
    "accuracy": 1210938,
    "evasion": 117816,
    "dr": 22,
    "interval": 3200,
    "gold": 397513,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "contract-trap",
    "name": "合同陷阱",
    "level": 3,
    "kind": "normal",
    "desc": "藏在附件三第 2.4 条里的那句话。",
    "category": "legal",
    "area": "contract-maze",
    "style": "execution",
    "hp": 62,
    "maxHit": 5,
    "accuracy": 733,
    "evasion": 305,
    "dr": 0,
    "interval": 3000,
    "gold": 155,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "vague-clause",
    "name": "条款模糊",
    "level": 8,
    "kind": "elite",
    "desc": "「合理期限内」——多合理？谁说了算？",
    "category": "legal",
    "area": "contract-maze",
    "style": "communication",
    "hp": 120,
    "maxHit": 7,
    "accuracy": 819,
    "evasion": 305,
    "dr": 5,
    "interval": 2800,
    "gold": 300,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "unlimited-liability",
    "name": "责任无限",
    "level": 13,
    "kind": "boss",
    "desc": "你签了一份没有责任上限的合同。",
    "category": "legal",
    "area": "contract-maze",
    "style": "presentation",
    "hp": 262,
    "maxHit": 18,
    "accuracy": 1327,
    "evasion": 427,
    "dr": 11,
    "interval": 3200,
    "gold": 655,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "compliance-auditor",
    "name": "合规审查者",
    "level": 21,
    "kind": "normal",
    "desc": "它带着一本 400 页的手册来查你。",
    "category": "legal",
    "area": "compliance-court",
    "style": "execution",
    "hp": 188,
    "maxHit": 13,
    "accuracy": 1612,
    "evasion": 671,
    "dr": 1,
    "interval": 3000,
    "gold": 470,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "risk-warning",
    "name": "风险提示",
    "level": 27,
    "kind": "elite",
    "desc": "「此项目存在重大合规风险，建议终止。」",
    "category": "legal",
    "area": "compliance-court",
    "style": "communication",
    "hp": 440,
    "maxHit": 36,
    "accuracy": 3474,
    "evasion": 1061,
    "dr": 7,
    "interval": 2800,
    "gold": 1100,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "nda-binder",
    "name": "保密协议",
    "level": 34,
    "kind": "boss",
    "desc": "你签了 NDA，现在你什么都不能说。",
    "category": "legal",
    "area": "compliance-court",
    "style": "presentation",
    "hp": 906,
    "maxHit": 74,
    "accuracy": 5028,
    "evasion": 1327,
    "dr": 14,
    "interval": 3200,
    "gold": 2265,
    "tier": 3,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 3
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 3
      }
    ]
  },
  {
    "id": "lawsuit-behemoth",
    "name": "诉讼巨兽",
    "level": 47,
    "kind": "normal",
    "desc": "一张传票，标的额八千万。",
    "category": "legal",
    "area": "litigation-volcano",
    "style": "execution",
    "hp": 894,
    "maxHit": 65,
    "accuracy": 10159,
    "evasion": 2685,
    "dr": 3,
    "interval": 3000,
    "gold": 2235,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "discovery-beast",
    "name": "证据开示",
    "level": 55,
    "kind": "elite",
    "desc": "对方要你交出过去五年的所有邮件。",
    "category": "legal",
    "area": "litigation-volcano",
    "style": "communication",
    "hp": 3326,
    "maxHit": 188,
    "accuracy": 30962,
    "evasion": 5704,
    "dr": 9,
    "interval": 2800,
    "gold": 8315,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "jurisdiction-dispute",
    "name": "管辖权争议",
    "level": 63,
    "kind": "boss",
    "desc": "官司该在哪打，先打一年。",
    "category": "legal",
    "area": "litigation-volcano",
    "style": "presentation",
    "hp": 6165,
    "maxHit": 336,
    "accuracy": 40973,
    "evasion": 6519,
    "dr": 17,
    "interval": 3200,
    "gold": 15413,
    "tier": 5,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 5
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 5
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "ip-thief",
    "name": "知识产权窃贼",
    "level": 77,
    "kind": "normal",
    "desc": "你的方案，出现在对手的发布会上。",
    "category": "legal",
    "area": "ip-battlefield",
    "style": "execution",
    "hp": 8272,
    "maxHit": 353,
    "accuracy": 99914,
    "evasion": 16836,
    "dr": 6,
    "interval": 3000,
    "gold": 20680,
    "tier": 6,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "patent-lawsuit",
    "name": "专利诉讼",
    "level": 86,
    "kind": "elite",
    "desc": "一个 1998 年的专利，卡住了你的整条产品线。",
    "category": "legal",
    "area": "ip-battlefield",
    "style": "communication",
    "hp": 36410,
    "maxHit": 1344,
    "accuracy": 338617,
    "evasion": 43604,
    "dr": 12,
    "interval": 2800,
    "gold": 91025,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "trademark-squatter",
    "name": "商标抢注",
    "level": 95,
    "kind": "boss",
    "desc": "有人在你之前，把名字注册了。",
    "category": "legal",
    "area": "ip-battlefield",
    "style": "presentation",
    "hp": 161666,
    "maxHit": 6900,
    "accuracy": 1198454,
    "evasion": 116602,
    "dr": 21,
    "interval": 3200,
    "gold": 404165,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "hc-freeze",
    "name": "HC 冻结",
    "level": 1,
    "kind": "normal",
    "desc": "岗位挂了半年，编制批不下来。",
    "category": "hr",
    "area": "hiring-wasteland",
    "style": "execution",
    "hp": 55,
    "maxHit": 5,
    "accuracy": 733,
    "evasion": 305,
    "dr": 0,
    "interval": 3000,
    "gold": 138,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "candidate-ghost",
    "name": "候选人放鸽子",
    "level": 6,
    "kind": "elite",
    "desc": "offer 发了，入职当天人没来。",
    "category": "hr",
    "area": "hiring-wasteland",
    "style": "communication",
    "hp": 110,
    "maxHit": 7,
    "accuracy": 819,
    "evasion": 305,
    "dr": 5,
    "interval": 2800,
    "gold": 275,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "channel-drought",
    "name": "招聘渠道枯竭",
    "level": 11,
    "kind": "boss",
    "desc": "所有渠道都试过了，还是没有简历。",
    "category": "hr",
    "area": "hiring-wasteland",
    "style": "presentation",
    "hp": 225,
    "maxHit": 14,
    "accuracy": 1138,
    "evasion": 366,
    "dr": 11,
    "interval": 3200,
    "gold": 563,
    "tier": 1,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 1
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 1
      }
    ]
  },
  {
    "id": "perf-dispute",
    "name": "绩效争议",
    "level": 20,
    "kind": "normal",
    "desc": "「我不认可这个结果，我要申诉。」",
    "category": "hr",
    "area": "perf-arena",
    "style": "execution",
    "hp": 177,
    "maxHit": 13,
    "accuracy": 1539,
    "evasion": 641,
    "dr": 1,
    "interval": 3000,
    "gold": 443,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "okr-envy",
    "name": "目标攀比",
    "level": 26,
    "kind": "elite",
    "desc": "隔壁组的目标定得比你高，奖金也比你多。",
    "category": "hr",
    "area": "perf-arena",
    "style": "communication",
    "hp": 419,
    "maxHit": 35,
    "accuracy": 3350,
    "evasion": 1023,
    "dr": 7,
    "interval": 2800,
    "gold": 1048,
    "tier": 2,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 2
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 2
      }
    ]
  },
  {
    "id": "feedback-void",
    "name": "反馈缺失",
    "level": 33,
    "kind": "boss",
    "desc": "你从没跟下属谈过，现在要打分。",
    "category": "hr",
    "area": "perf-arena",
    "style": "presentation",
    "hp": 869,
    "maxHit": 72,
    "accuracy": 4884,
    "evasion": 1289,
    "dr": 14,
    "interval": 3200,
    "gold": 2173,
    "tier": 3,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 3
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 3
      }
    ]
  },
  {
    "id": "attrition-wave",
    "name": "离职潮",
    "level": 46,
    "kind": "normal",
    "desc": "这个月第九个提离职的。",
    "category": "hr",
    "area": "attrition-wave",
    "style": "execution",
    "hp": 865,
    "maxHit": 64,
    "accuracy": 9948,
    "evasion": 2629,
    "dr": 3,
    "interval": 3000,
    "gold": 2163,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "morale-collapse",
    "name": "士气崩溃",
    "level": 54,
    "kind": "elite",
    "desc": "团队群里没人说话，持续了两周。",
    "category": "hr",
    "area": "attrition-wave",
    "style": "communication",
    "hp": 3228,
    "maxHit": 187,
    "accuracy": 30410,
    "evasion": 5602,
    "dr": 9,
    "interval": 2800,
    "gold": 8070,
    "tier": 4,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 4
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      }
    ]
  },
  {
    "id": "poaching-rival",
    "name": "竞争对手挖角",
    "level": 62,
    "kind": "boss",
    "desc": "对手开双倍薪资，挖走了你的核心。",
    "category": "hr",
    "area": "attrition-wave",
    "style": "presentation",
    "hp": 6003,
    "maxHit": 334,
    "accuracy": 40333,
    "evasion": 6417,
    "dr": 17,
    "interval": 3200,
    "gold": 15008,
    "tier": 5,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 5
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 5
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "labor-arbitration",
    "name": "劳动仲裁",
    "level": 76,
    "kind": "normal",
    "desc": "前员工提了仲裁，诉求 12 项。",
    "category": "hr",
    "area": "arbitration-court",
    "style": "execution",
    "hp": 8264,
    "maxHit": 351,
    "accuracy": 98633,
    "evasion": 16620,
    "dr": 6,
    "interval": 3000,
    "gold": 20660,
    "tier": 6,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 1,
        "max": 4
      },
      {
        "item": "FOOD",
        "chance": 18,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "EQUIP",
        "chance": 5,
        "min": 1,
        "max": 1,
        "tier": 6
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "severance-behemoth",
    "name": "赔偿金巨兽",
    "level": 85,
    "kind": "elite",
    "desc": "2N 还是 N+1，差着几十万。",
    "category": "hr",
    "area": "arbitration-court",
    "style": "communication",
    "hp": 36456,
    "maxHit": 1339,
    "accuracy": 334725,
    "evasion": 43103,
    "dr": 12,
    "interval": 2800,
    "gold": 91140,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 3,
        "max": 8
      },
      {
        "item": "FOOD",
        "chance": 32,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 12,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "pr-risk",
    "name": "舆论风险",
    "level": 94,
    "kind": "boss",
    "desc": "一条爆料帖，把公司送上热搜。",
    "category": "hr",
    "area": "arbitration-court",
    "style": "presentation",
    "hp": 162247,
    "maxHit": 6873,
    "accuracy": 1185971,
    "evasion": 115387,
    "dr": 21,
    "interval": 3200,
    "gold": 405618,
    "tier": 7,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 7
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 7
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "uncertainty",
    "name": "不确定性",
    "level": 100,
    "kind": "world",
    "desc": "你不知道它是什么，也不知道它什么时候来。",
    "category": "world",
    "area": "world-bosses",
    "style": "execution",
    "hp": 923884,
    "maxHit": 12067,
    "accuracy": 1490124,
    "evasion": 122675,
    "dr": 40,
    "interval": 3600,
    "gold": 2309710,
    "tier": 8,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 8
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 8
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "blackswan",
    "name": "黑天鹅",
    "level": 105,
    "kind": "world",
    "desc": "概率为零的事件，今天发生了。",
    "category": "world",
    "area": "world-bosses",
    "style": "communication",
    "hp": 882270,
    "maxHit": 12314,
    "accuracy": 1563892,
    "evasion": 128748,
    "dr": 41,
    "interval": 3600,
    "gold": 2205675,
    "tier": 8,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 8
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 8
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "deadline",
    "name": "Deadline",
    "level": 110,
    "kind": "world",
    "desc": "它不是一个时间点，它是一种存在。",
    "category": "world",
    "area": "world-bosses",
    "style": "presentation",
    "hp": 2809753,
    "maxHit": 42922,
    "accuracy": 4568827,
    "evasion": 332789,
    "dr": 41,
    "interval": 3600,
    "gold": 7024383,
    "tier": 8,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 8
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 8
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "economic-cycle",
    "name": "经济周期",
    "level": 115,
    "kind": "world",
    "desc": "繁荣之后是衰退，衰退之后是繁荣，但你等不到。",
    "category": "world",
    "area": "world-bosses",
    "style": "execution",
    "hp": 2878168,
    "maxHit": 44045,
    "accuracy": 4774630,
    "evasion": 347780,
    "dr": 42,
    "interval": 3600,
    "gold": 7195420,
    "tier": 8,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 8
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 8
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  },
  {
    "id": "geopolitics",
    "name": "地缘政治",
    "level": 120,
    "kind": "world",
    "desc": "一张地图上的线条，决定了你今年的产能。",
    "category": "world",
    "area": "world-bosses",
    "style": "communication",
    "hp": 2942581,
    "maxHit": 45225,
    "accuracy": 4980433,
    "evasion": 362770,
    "dr": 43,
    "interval": 3600,
    "gold": 7356453,
    "tier": 8,
    "drops": [
      {
        "item": "slack-point",
        "chance": 100,
        "min": 6,
        "max": 18
      },
      {
        "item": "FOOD",
        "chance": 55,
        "min": 1,
        "max": 4,
        "tier": 8
      },
      {
        "item": "EQUIP",
        "chance": 25,
        "min": 1,
        "max": 1,
        "tier": 8
      },
      {
        "item": "inspiration",
        "chance": 12,
        "min": 1,
        "max": 3
      },
      {
        "item": "network",
        "chance": 10,
        "min": 1,
        "max": 2
      }
    ]
  }
];

export const ENEMY_MAP = Object.fromEntries(ENEMIES.map((e) => [e.id, e]));

/** 战斗食物掉落池（按敌人档位分层） */
export const FOOD_BY_TIER = {
  "1": [
    "milktea-common",
    "coffee-americano"
  ],
  "2": [
    "milktea-common",
    "coffee-americano"
  ],
  "3": [
    "milktea-cheese",
    "coffee-latte"
  ],
  "4": [
    "milktea-cheese",
    "coffee-latte"
  ],
  "5": [
    "milktea-fruit",
    "coffee-espresso"
  ],
  "6": [
    "milktea-fruit",
    "coffee-espresso"
  ],
  "7": [
    "energy-drink",
    "vitamin-pack"
  ],
  "8": [
    "energy-drink",
    "vitamin-pack"
  ]
};
