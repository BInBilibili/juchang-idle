/**
 * 战斗视图：岗位大类 → 区域 → 敌人
 */
import { state, getLevel, countItem } from '../core/state.js';
import { ENEMY_CATEGORIES, COMBAT_AREAS, ENEMY_MAP } from '../data/enemies.js';
import { isUnlocked, unlockHint, startCombat, stopCombat, eatManual, useDopamine } from '../core/combat.js';
import { computeStats, hitChance, triangleMul } from '../core/modifiers.js';
import { ITEM_MAP, TIER_LEVEL } from '../data/items.js';
import { SKILL_MAP } from '../data/skills.js';
import { fmt, fmtTime } from '../core/xp.js';
import { esc, refresh, toast, xpBarHtml } from './app.js';

/** 每个大类记住上次浏览的区域 */
const lastArea = {};
/** 当前正在浏览的大类（由 render 写入，供 actions 使用） */
let curCat = 'rd';

const KIND_LABEL = { normal: '普通', elite: '精英', boss: '区域 Boss', world: '世界 Boss' };
const STYLE_LABEL = { execution: '执行力', communication: '沟通力', presentation: '汇报力' };

function areasOf(catId) {
  return COMBAT_AREAS.filter((a) => a.category === catId).sort((a, b) => a.minLevel - b.minLevel);
}

// ---------------------------------------------------------------- 战斗面板
function combatPanelHtml() {
  if (!state.combat.active) return '';
  const enemy = ENEMY_MAP[state.combat.enemyId];
  if (!enemy) return '';
  const s = computeStats();
  const myChance = hitChance(s.accuracy[s.style] * triangleMul(s.style, enemy.style).acc, enemy.evasion);
  const foeChance = hitChance(enemy.accuracy * triangleMul(enemy.style, s.style).acc, s.evasion);
  const food = bestFoodInfo();

  return `
  <div class="combat-panel">
    <div class="combat-grid">
      <div class="fighter">
        <div class="fighter-name">🧑‍💼 你 <span class="tag info">${STYLE_LABEL[s.style]}</span></div>
        <div class="bar bar-hp" style="height:12px"><i data-live="myHpBar"></i></div>
        <div class="fighter-hp"><span data-live="myHpText"></span></div>
        <div class="fighter-stats">
          <span>命中率 <b>${(myChance * 100).toFixed(0)}%</b></span>
          <span>最大伤害 <b>${fmt(s.maxHit[s.style])}</b></span>
          <span>减伤 <b>${s.dr.toFixed(0)}%</b></span>
          <span>攻速 <b>${(s.interval / 1000).toFixed(1)}s</b></span>
        </div>
      </div>
      <div class="vs">VS</div>
      <div class="fighter">
        <div class="fighter-name">${esc(enemy.name)} <span class="tag dim">Lv ${enemy.level} · ${KIND_LABEL[enemy.kind]}</span></div>
        <div class="bar bar-enemy" style="height:12px"><i data-live="foeHpBar"></i></div>
        <div class="fighter-hp"><span data-live="foeHpText"></span></div>
        <div class="fighter-stats">
          <span>命中率 <b>${(foeChance * 100).toFixed(0)}%</b></span>
          <span>最大伤害 <b>${fmt(enemy.maxHit)}</b></span>
          <span>减伤 <b>${enemy.dr}%</b></span>
          <span>攻速 <b>${(enemy.interval / 1000).toFixed(1)}s</b></span>
        </div>
      </div>
    </div>
    <div class="row row-wrap" style="margin-top:10px;justify-content:center">
      <div class="hit-pop" data-live="hitPop"></div>
    </div>
    <div class="row row-wrap" style="margin-top:8px;justify-content:center">
      <button class="btn btn-sm" data-action="eat" ${food.qty ? '' : 'disabled'}>🍽️ 吃一口（${food.name} ×${food.qty}）</button>
      <button class="btn btn-sm" data-action="dopamine" ${countItem('dopamine') >= 10 ? '' : 'disabled'}>🎮 来点多巴胺（10）</button>
      <button class="btn btn-sm btn-danger" data-action="flee">🏃 撤退</button>
      <span class="small muted">本场已击杀 <b data-live="sessionKills">0</b> 个</span>
    </div>
  </div>`;
}

function bestFoodInfo() {
  let best = null;
  for (const [id, qty] of Object.entries(state.bank)) {
    const it = ITEM_MAP[id];
    if (!it || qty <= 0) continue;
    if (it.type !== 'food' && it.type !== 'special') continue;
    if (!it.heal) continue;
    if (!best || it.heal > best.heal) best = { id, name: it.name, heal: it.heal, qty };
  }
  return best || { name: '无', qty: 0, heal: 0 };
}

// ---------------------------------------------------------------- 主渲染
export const combatView = {
  render(catId) {
    const cat = ENEMY_CATEGORIES.find((c) => c.id === catId) || ENEMY_CATEGORIES[0];
    curCat = cat.id;
    const list = areasOf(cat.id);
    if (!lastArea[cat.id] || !list.some((a) => a.id === lastArea[cat.id])) {
      lastArea[cat.id] = list[0]?.id;
    }
    const area = list.find((a) => a.id === lastArea[cat.id]) || list[0];
    const enemies = area ? Object.values(ENEMY_MAP).filter((e) => e.area === area.id) : [];
    const s = computeStats();
    const isJob = cat.id !== 'world' && SKILL_MAP[cat.id];

    const tabs = list.map((a) => {
      const on = a.id === area?.id;
      const unlocked = Object.values(ENEMY_MAP).some((e) => e.area === a.id && isUnlocked(e));
      return `<button class="area-tab${on ? ' active' : ''}${unlocked ? '' : ' locked'}" data-action="area" data-id="${a.id}">
        ${esc(a.name)} <span class="mono small">Lv${a.minLevel}~${a.maxLevel}</span></button>`;
    }).join('');

    const cards = enemies.map((e) => enemyCard(e, s)).join('');

    return {
      html: `
      ${combatPanelHtml()}
      <div class="cat-head">
        <div class="ch-icon">${cat.icon}</div>
        <div style="flex:1">
          <div class="ch-name">${esc(cat.name)}</div>
          <div class="ch-desc">${esc(cat.desc)}</div>
        </div>
        ${isJob ? `<div style="min-width:180px">
          <div class="small muted">岗位技能</div>
          ${xpBarHtml(cat.id)}
        </div>` : ''}
      </div>

      <div class="area-tabs">${tabs}</div>
      ${area ? `<p class="page-desc">${esc(area.desc)}</p>` : ''}
      <div class="grid grid-3">${cards}</div>

      ${playerStatsHtml(s)}
      `,
      live: liveHandlers(),
    };
  },

  actions: {
    area(d) { lastArea[curCat] = d.id; refresh(); },
    fight(d) {
      const e = ENEMY_MAP[d.id];
      if (!e) return;
      if (!isUnlocked(e)) { toast(`🔒 ${unlockHint(e)}`, 'warn'); return; }
      const ok = startCombat(d.id);
      if (ok) { refresh(); }
      else toast('无法开始战斗', 'bad');
    },
    flee() { stopCombat('你撤退了，工位保住了。'); refresh(); },
    eat() {
      const r = eatManual();
      if (r) toast(`🍽️ 吃了一口，回复 ${fmt(r.heal)} 精力`, 'good', 1500);
      else toast('背包里没有能吃的东西', 'warn');
      refresh();
    },
    dopamine() {
      const r = useDopamine();
      toast(r ? '🎮 多巴胺上头，战斗力短暂提升！' : '多巴胺不足（需要 10 点）', r ? 'good' : 'warn');
      refresh();
    },
  },
};

function enemyCard(e, s) {
  const unlocked = isUnlocked(e);
  const fighting = state.combat.active && state.combat.enemyId === e.id;
  const tri = triangleMul(s.style, e.style);
  const myHit = hitChance(s.accuracy[s.style] * tri.acc, e.evasion);
  const avgDmg = s.maxHit[s.style] * tri.dmg * 0.75 * (1 - e.dr / 100);
  const hits = Math.max(1, Math.ceil(e.hp / Math.max(1, avgDmg)));
  const killSec = (hits / Math.max(0.05, myHit)) * (s.interval / 1000) + 3;
  const effHp = s.maxHp / (1 - s.dr / 100);
  const foeHit = hitChance(e.accuracy * triangleMul(e.style, s.style).acc, s.evasion);
  const foeAvg = e.maxHit * 0.75 * (1 - s.dr / 100);
  const survive = foeAvg > 0 ? Math.floor(effHp / foeAvg) : 999;

  return `
  <div class="enemy${unlocked ? '' : ' locked'}${fighting ? ' fighting' : ''}" data-action="fight" data-id="${e.id}">
    <div class="enemy-top">
      <div class="enemy-name">${esc(e.name)}</div>
      <div class="enemy-lv">Lv ${e.level}</div>
    </div>
    <div><span class="tag ${e.kind === 'world' ? 'gold' : e.kind === 'boss' ? 'info' : e.kind === 'elite' ? 'bad' : 'dim'}">${KIND_LABEL[e.kind]}</span>
      <span class="tag dim">${STYLE_LABEL[e.style]}</span>
      <span class="tag dim">装备 T${e.tier}</span></div>
    <div class="enemy-desc">${esc(e.desc)}</div>
    <div class="enemy-stats">
      <span>精力 <b>${fmt(e.hp)}</b></span>
      <span>减伤 <b>${e.dr}%</b></span>
      <span>你的命中 <b>${(myHit * 100).toFixed(0)}%</b></span>
      <span>对方命中 <b>${(foeHit * 100).toFixed(0)}%</b></span>
      <span>预计刀数 <b>${hits}</b></span>
      <span>预计耗时 <b>${fmtTime(killSec * 1000)}</b></span>
      <span>可扛 <b>${survive} 刀</b></span>
      <span>工资 <b>${fmt(e.gold)}</b></span>
    </div>
    <div class="small ${unlocked ? 'muted' : 'warn'}">
      ${unlocked ? (fighting ? '⚔️ 正在交战中' : '点击开始战斗') : '🔒 ' + esc(unlockHint(e))}
    </div>
  </div>`;
}

function playerStatsHtml(s) {
  const style = s.style;
  const food = bestFoodInfo();
  return `
  <div class="section">
    <div class="section-title">我的面板</div>
    <div class="stat-grid">
      <div class="stat-box"><div class="k">精力上限</div><div class="v">${fmt(s.maxHp)}</div></div>
      <div class="stat-box"><div class="k">减伤</div><div class="v">${s.dr.toFixed(1)}%</div></div>
      <div class="stat-box"><div class="k">命中等级（${STYLE_LABEL[style]}）</div><div class="v">${fmt(s.accuracy[style])}</div></div>
      <div class="stat-box"><div class="k">闪避等级</div><div class="v">${fmt(s.evasion)}</div></div>
      <div class="stat-box"><div class="k">最大伤害（${STYLE_LABEL[style]}）</div><div class="v">${fmt(s.maxHit[style])}</div></div>
      <div class="stat-box"><div class="k">攻击间隔</div><div class="v">${(s.interval / 1000).toFixed(1)}s</div></div>
      <div class="stat-box"><div class="k">职场等级</div><div class="v">${s.combatLevel}</div></div>
      <div class="stat-box"><div class="k">自动加餐阈值</div><div class="v">${s.autoEat ? s.autoEat + '%' : '未开启'}</div></div>
    </div>
    <p class="small muted" style="margin-top:10px">
      当前武器风格：<b>${STYLE_LABEL[style]}</b>（换武器即可换风格）。
      战斗三角：执行力 → 沟通力 → 汇报力 → 执行力，克制方 +15% 命中、+10% 伤害。
      背包里回精力最高的是 <b>${esc(food.name)}</b>（×${food.qty}，回 ${fmt(food.heal)}）。
    </p>
  </div>`;
}

function liveHandlers() {
  return {
    myHpBar(el) {
      const s = computeStats();
      el.style.width = Math.max(0, Math.min(100, (state.hp / s.maxHp) * 100)) + '%';
    },
    myHpText(el) {
      const s = computeStats();
      el.textContent = `${fmt(Math.max(0, state.hp))} / ${fmt(s.maxHp)} 精力`;
    },
    foeHpBar(el) {
      const e = ENEMY_MAP[state.combat.enemyId];
      if (!e) { el.style.width = '0%'; return; }
      el.style.width = Math.max(0, Math.min(100, (state.combat.enemyHp / e.hp) * 100)) + '%';
    },
    foeHpText(el) {
      const e = ENEMY_MAP[state.combat.enemyId];
      if (!e) { el.textContent = '—'; return; }
      el.textContent = `${fmt(Math.max(0, state.combat.enemyHp))} / ${fmt(e.hp)} 精力`;
    },
    hitPop(el) {
      const d = state.combat.lastHit;
      el.textContent = d > 0 ? `-${fmt(d)}` : '';
    },
    sessionKills(el) {
      el.textContent = String(state.combat.sessionKills || 0);
    },
  };
}
