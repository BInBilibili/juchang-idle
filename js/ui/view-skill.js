/**
 * 爱好技能视图：活动列表 + 实时进度
 */
import { state, getLevel, countItem } from '../core/state.js';
import { ACTIVITIES_BY_SKILL, ACTIVITY_MAP } from '../data/activities.js';
import { SKILL_MAP } from '../data/skills.js';
import { ITEM_MAP } from '../data/items.js';
import { startActivity, stopActivity } from '../core/engine.js';
import { fmt, fmtTime } from '../core/xp.js';
import { esc, refresh, toast, xpBarHtml } from './app.js';

let curSkill = 'fishing';

function itemName(id) { return ITEM_MAP[id]?.name ?? id; }
function itemIcon(id) { return ITEM_MAP[id]?.icon ?? '❔'; }

function outputsHtml(act) {
  const parts = [];
  if (act.gold) parts.push(`<span class="tag gold">💴 ${fmt(act.gold[0])}~${fmt(act.gold[1])}</span>`);
  for (const o of act.outputs || []) {
    const pct = o.chance >= 100 ? '' : ` ${o.chance.toFixed(0)}%`;
    const qty = o.max > o.min ? `${o.min}~${o.max}` : `${o.min}`;
    parts.push(`<span class="tag info">${itemIcon(o.item)} ${esc(itemName(o.item))} ×${qty}${pct}</span>`);
  }
  if (act.risk) parts.push(`<span class="tag bad">⚠️ ${(act.risk * 100).toFixed(0)}% 亏损</span>`);
  return parts.join(' ');
}

function inputsHtml(act) {
  if (!act.inputs?.length) return '';
  return act.inputs.map((i) => {
    const have = countItem(i.item);
    const ok = have >= i.qty;
    return `<span class="tag ${ok ? 'good' : 'bad'}">${itemIcon(i.item)} ${esc(itemName(i.item))} ×${i.qty}（有 ${fmt(have)}）</span>`;
  }).join(' ');
}

function canRun(act) {
  if (getLevel(act.skill) < act.level) return false;
  for (const i of act.inputs || []) if (countItem(i.item) < i.qty) return false;
  return true;
}

export const skillView = {
  render(skillId) {
    const skill = SKILL_MAP[skillId] || SKILL_MAP.fishing;
    curSkill = skill.id;
    const list = ACTIVITIES_BY_SKILL[skill.id] || [];
    const lv = getLevel(skill.id);
    const runningId = state.activity.active ? state.activity.id : null;

    const rows = list.map((act) => {
      const locked = lv < act.level;
      const running = runningId === act.id;
      const ok = canRun(act);
      return `
      <div class="act${locked ? ' locked' : ''}${running ? ' running' : ''}">
        <div class="act-icon">${skill.icon}</div>
        <div class="act-main">
          <div class="act-name">${esc(act.name)}
            <span class="tag ${locked ? 'bad' : 'dim'}">Lv ${act.level}</span>
            <span class="tag dim">${(act.interval / 1000).toFixed(1)}s</span>
            <span class="tag info">+${fmt(act.xp)} 经验</span>
          </div>
          <div class="act-meta">${esc(act.desc || '')}</div>
          <div class="act-meta">${outputsHtml(act)} ${inputsHtml(act)}</div>
          ${running ? `<div class="act-bar"><div class="xp-line"><span>进行中…</span><span data-live="actPct"></span></div>
            <div class="bar bar-xp"><i data-live="actBar"></i></div></div>` : ''}
        </div>
        <div class="act-right">
          ${running
            ? `<button class="btn btn-sm btn-danger" data-action="stop">停下</button>`
            : `<button class="btn btn-sm ${ok ? 'btn-primary' : ''}" data-action="start" data-id="${act.id}" ${ok ? '' : 'disabled'}>
                ${locked ? '🔒 未解锁' : ok ? '开始' : '缺材料'}</button>`}
        </div>
      </div>`;
    }).join('');

    const summary = outputsSummary(skill.id, lv);

    return {
      html: `
      <div class="cat-head">
        <div class="ch-icon">${skill.icon}</div>
        <div style="flex:1">
          <div class="ch-name">${esc(skill.name)}</div>
          <div class="ch-desc">${esc(skill.desc || '')}</div>
          ${skill.produces ? `<div class="ch-desc" style="color:var(--accent)">产出：${esc(skill.produces)}</div>` : ''}
        </div>
        <div style="min-width:200px">${xpBarHtml(skill.id)}</div>
      </div>

      <div class="stat-grid" style="margin-bottom:16px">
        ${summary}
      </div>

      <div class="section-title">可做的事（共 ${list.length} 项）</div>
      ${rows}
      `,
      live: {
        actBar(el) {
          const a = ACTIVITY_MAP[state.activity.id];
          if (!a || !state.activity.active) { el.style.width = '0%'; return; }
          el.style.width = Math.min(100, (state.activity.progress / a.interval) * 100) + '%';
        },
        actPct(el) {
          const a = ACTIVITY_MAP[state.activity.id];
          if (!a || !state.activity.active) { el.textContent = '—'; return; }
          el.textContent = `${(state.activity.progress / a.interval * 100).toFixed(0)}%`;
        },
      },
    };
  },

  actions: {
    start(d) {
      const act = ACTIVITY_MAP[d.id];
      if (!act) return;
      const r = startActivity(d.id);
      if (r) { toast(`${SKILL_MAP[act.skill].icon} 开始「${act.name}」`, 'good', 1600); refresh(); }
      else toast('还不能开始（等级不够或材料不足）', 'warn');
    },
    stop() { stopActivity('你停下了手上的事。'); refresh(); },
  },
};

/** 技能页顶部的产出统计 */
function outputsSummary(skillId, lv) {
  const boxes = [];
  boxes.push(`<div class="stat-box"><div class="k">当前等级</div><div class="v">${lv} / 100</div></div>`);
  const bank = state.bank;
  const owned = Object.entries(bank)
    .filter(([id]) => ITEM_MAP[id])
    .filter(([id]) => {
      const it = ITEM_MAP[id];
      if (skillId === 'fishing') return it.id.startsWith('fish-');
      if (skillId === 'cooking') return it.type === 'food';
      if (skillId === 'art') return it.type === 'treasure';
      if (skillId === 'fitness') return it.id === 'fitness-point';
      if (skillId === 'gaming') return it.id === 'dopamine';
      if (skillId === 'reading') return it.id === 'knowledge';
      if (skillId === 'social') return it.id === 'network';
      return false;
    })
    .slice(0, 4);
  for (const [id, qty] of owned) {
    boxes.push(`<div class="stat-box"><div class="k">${esc(ITEM_MAP[id].name)}</div><div class="v">${fmt(qty)}</div></div>`);
  }
  if (state.permanent) {
    const p = state.permanent;
    const map = { fitness: '💪 体质点', knowledge: '📖 知识', network: '🤝 人脉' };
    for (const [k, label] of Object.entries(map)) {
      if (skillId === 'fitness' && k === 'fitness') boxes.push(`<div class="stat-box"><div class="k">已累计 ${label}</div><div class="v">${fmt(p[k] || 0)}</div></div>`);
      if (skillId === 'reading' && k === 'knowledge') boxes.push(`<div class="stat-box"><div class="k">已累计 ${label}</div><div class="v">${fmt(p[k] || 0)}</div></div>`);
      if (skillId === 'social' && k === 'network') boxes.push(`<div class="stat-box"><div class="k">已累计 ${label}</div><div class="v">${fmt(p[k] || 0)}</div></div>`);
    }
  }
  return boxes.join('');
}
