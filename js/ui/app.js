/**
 * 《菊厂放置》UI 外壳
 * 负责：路由、侧边栏、顶栏、日志、Toast、弹窗、渲染循环
 */
import { state, getLevel, save, load, wipe, exportSave, importSave, pushLog } from '../core/state.js';
import { SKILLS, SKILL_MAP, SKILL_GROUPS } from '../data/skills.js';
import { computeStats } from '../core/modifiers.js';
import { levelProgress, xpForLevel, levelFromXp, fmt, fmtTime } from '../core/xp.js';
import { startLoop, applyOffline } from '../core/engine.js';
import { ACTIVITY_MAP } from '../data/activities.js';
import { VIEWS } from './views.js';

// ---------------------------------------------------------------- DOM
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const mainEl = () => $('#main');
const sidebarEl = () => $('#sidebar');

// ---------------------------------------------------------------- 工具
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function toast(msg, kind = 'info', ms = 2600) {
  const box = $('#toasts');
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = msg;
  box.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .3s, transform .3s';
    el.style.opacity = '0';
    el.style.transform = 'translateX(24px)';
    setTimeout(() => el.remove(), 320);
  }, ms);
}

let modalEl = null;
export function modal(title, bodyHtml, actions = []) {
  closeModal();
  modalEl = document.createElement('div');
  modalEl.className = 'modal-mask';
  modalEl.innerHTML = `
    <div class="modal">
      <h2>${title}</h2>
      <div class="modal-body">${bodyHtml}</div>
      <div class="modal-actions"></div>
    </div>`;
  const actionsBox = $('.modal-actions', modalEl);
  for (const a of actions) {
    const b = document.createElement('button');
    b.className = `btn ${a.cls || ''}`;
    b.textContent = a.label;
    b.onclick = () => { if (a.fn) a.fn(); if (a.keepOpen !== true) closeModal(); };
    actionsBox.appendChild(b);
  }
  if (!actions.length) {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = '关闭';
    b.onclick = closeModal;
    actionsBox.appendChild(b);
  }
  modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });
  document.body.appendChild(modalEl);
  return modalEl;
}
export function closeModal() {
  if (modalEl) { modalEl.remove(); modalEl = null; }
}

/** 确认框 */
export function confirmBox(title, text, onYes) {
  modal(title, `<p style="line-height:1.7;color:var(--text-2)">${text}</p>`, [
    { label: '取消', cls: '' },
    { label: '确定', cls: 'btn-danger', fn: onYes },
  ]);
}

// ---------------------------------------------------------------- 导航
const NAV = [
  { group: '工作台', items: [
    { id: 'overview', icon: '📋', name: '总览' },
  ]},
  { group: '岗位战斗', items: [
    { id: 'combat:rd', icon: '⌨️', name: '研发类', skill: 'rd' },
    { id: 'combat:sales', icon: '📈', name: '销售类', skill: 'sales' },
    { id: 'combat:service', icon: '🎧', name: '服务类', skill: 'service' },
    { id: 'combat:supply', icon: '🚢', name: '供应链类', skill: 'supply' },
    { id: 'combat:finance', icon: '🧾', name: '财经类', skill: 'finance' },
    { id: 'combat:legal', icon: '⚖️', name: '法务类', skill: 'legal' },
    { id: 'combat:hr', icon: '👥', name: '人力资源类', skill: 'hr' },
    { id: 'combat:world', icon: '🌍', name: '世界 Boss' },
  ]},
  { group: '业余爱好', items: [
    { id: 'skill:fishing', icon: '🎣', name: '钓鱼', skill: 'fishing' },
    { id: 'skill:cooking', icon: '🍳', name: '烹饪', skill: 'cooking' },
    { id: 'skill:fitness', icon: '🏃', name: '健身', skill: 'fitness' },
    { id: 'skill:art', icon: '🎨', name: '艺术', skill: 'art' },
    { id: 'skill:gaming', icon: '🎮', name: '游戏', skill: 'gaming' },
    { id: 'skill:investment', icon: '💰', name: '理财', skill: 'investment' },
    { id: 'skill:reading', icon: '📚', name: '阅读', skill: 'reading' },
    { id: 'skill:social', icon: '🍻', name: '社交', skill: 'social' },
  ]},
  { group: '成长', items: [
    { id: 'prayer', icon: '🐟', name: '摸鱼', skill: 'slacking' },
    { id: 'slayer', icon: '🍳', name: '背锅', skill: 'scapegoat' },
    { id: 'inspiration', icon: '✨', name: '灵感工坊' },
  ]},
  { group: '资产', items: [
    { id: 'equip', icon: '🧰', name: '装备' },
    { id: 'bank', icon: '🎒', name: '背包' },
    { id: 'shop', icon: '🏪', name: '商店' },
  ]},
  { group: '系统', items: [
    { id: 'settings', icon: '⚙️', name: '设置' },
  ]},
];

let route = { view: 'overview', param: null };
let liveHandlers = {};

export function go(view, param = null) {
  route = { view, param };
  closeModal();
  renderSidebar();
  renderMain();
  const m = mainEl();
  if (m) m.scrollTop = 0;
  if (window.innerWidth <= 860) sidebarEl()?.classList.remove('open');
}

export function currentRoute() { return route; }

/** 重新渲染当前页面（结构性变化时调用） */
export function refresh() { renderMain(); }

function renderSidebar() {
  const el = sidebarEl();
  if (!el) return;
  const activeKey = route.param ? `${route.view}:${route.param}` : route.view;
  let html = '';
  for (const g of NAV) {
    html += `<div class="nav-group"><div class="nav-title">${esc(g.group)}</div>`;
    for (const it of g.items) {
      const on = it.id === activeKey;
      let lv = '';
      if (it.skill) {
        const l = getLevel(it.skill);
        lv = `<span class="nav-lv${l >= 100 ? ' max' : ''}">${l}</span>`;
      }
      html += `<button class="nav-item${on ? ' active' : ''}" data-nav="${it.id}">
        <span class="nav-icon">${it.icon}</span>
        <span class="nav-name">${esc(it.name)}</span>${lv}
      </button>`;
    }
    html += '</div>';
  }
  el.innerHTML = html;
}

function renderMain() {
  const el = mainEl();
  if (!el) return;
  const view = VIEWS[route.view];
  if (!view) { el.innerHTML = '<div class="empty">页面不存在</div>'; return; }
  const out = view.render(route.param) || {};
  el.innerHTML = out.html || '';
  liveHandlers = out.live || {};
  if (out.mounted) out.mounted(el);
}

// ---------------------------------------------------------------- 顶栏
let lastLogTop = null;
function updateTopbar() {
  const s = computeStats();
  const hp = Math.max(0, Math.round(state.hp));
  $('#hpNow').textContent = fmt(hp);
  $('#hpMax').textContent = fmt(s.maxHp);
  const pct = Math.max(0, Math.min(100, (state.hp / s.maxHp) * 100));
  const bar = $('#hpBar');
  bar.style.width = pct + '%';
  $('#goldNum').textContent = fmt(Math.floor(state.currencies.gold));
  $('#slackNum').textContent = fmt(Math.floor(state.currencies['slack-point']));
  $('#coinNum').textContent = fmt(Math.floor(state.currencies['scapegoat-coin']));
  $('#cbLevel').textContent = s.combatLevel;

  const chip = $('#statusChip');
  if (state.combat.active) {
    chip.textContent = `⚔️ 战斗中 · 本场 ${state.combat.sessionKills || 0} 杀`;
    chip.classList.add('on');
  } else if (state.activity.active) {
    const a = ACTIVITY_MAP[state.activity.id];
    chip.textContent = `🕒 ${a ? a.name : '进行中'}`;
    chip.classList.add('on');
  } else {
    chip.textContent = '摸鱼中';
    chip.classList.remove('on');
  }
}

const LOG_CLS = { level: 'big', warn: 'warn', bad: 'bad', good: 'good', info: '' };
function updateLog() {
  const box = $('#logList');
  if (!box || !state.log.length) return;
  const top = state.log[0].t;
  if (top === lastLogTop) return;
  lastLogTop = top;
  box.innerHTML = state.log.slice(0, 60).map((l) => {
    const d = new Date(l.t);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `<div class="log-line ${LOG_CLS[l.kind] ?? ''}"><span class="lt">${hh}:${mm}:${ss}</span>${esc(l.text)}</div>`;
  }).join('');
}

// ---------------------------------------------------------------- 实时刷新
function tickUI() {
  updateTopbar();
  updateLog();
  for (const [key, fn] of Object.entries(liveHandlers)) {
    const els = $$(`[data-live="${key}"]`);
    for (const e of els) { try { fn(e); } catch { /* 忽略单帧异常 */ } }
  }
  // 侧边栏等级
  const navEls = $$('.nav-item[data-nav]');
  for (const n of navEls) {
    const lvEl = $('.nav-lv', n);
    if (!lvEl) continue;
    const skill = n.dataset.nav.split(':')[1];
    if (!skill || !SKILL_MAP[skill]) continue;
    const l = getLevel(skill);
    const txt = String(l);
    if (lvEl.textContent !== txt) lvEl.textContent = txt;
    lvEl.classList.toggle('max', l >= 100);
  }
}

// ---------------------------------------------------------------- 事件委托
function bindGlobal() {
  document.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav]');
    if (nav) {
      const [v, p] = nav.dataset.nav.split(':');
      go(v, p ?? null);
      return;
    }
    const act = e.target.closest('[data-action]');
    if (!act) return;
    const name = act.dataset.action;
    const handler = VIEWS[route.view]?.actions?.[name];
    if (handler) { handler(act.dataset, act); }
  });

  $('#menuBtn')?.addEventListener('click', () => sidebarEl()?.classList.toggle('open'));
  $('#saveBtn')?.addEventListener('click', () => {
    if (save()) toast('💾 已存档', 'good', 1400);
    else toast('存档失败：浏览器存储不可用', 'bad');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  window.addEventListener('beforeunload', () => save());
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
}

// ---------------------------------------------------------------- 启动
export function bootApp() {
  const ok = load();
  // 结算离线收益（必须在主循环启动之前）
  try { applyOffline(); } catch (e) { console.error('离线结算失败', e); }
  // 精力值夹紧到当前上限（换装备 / 导入存档后可能越界）
  const s0 = computeStats();
  if (!Number.isFinite(state.hp) || state.hp <= 0 || state.hp > s0.maxHp) state.hp = s0.maxHp;
  bindGlobal();
  renderSidebar();
  renderMain();
  updateTopbar();
  updateLog();
  startLoop(tickUI);
  $('#boot')?.classList.add('hidden');
  $('#app')?.classList.remove('hidden');

  if (!ok) {
    pushLog('👋 欢迎入职菊厂！你已经领到一套「入职大礼包」装备。', 'level');
    pushLog('💡 去「研发类」找「模糊需求」练练手，或者到「钓鱼」挂机攒食材。', 'info');
    pushLog('🍽️ 背包里的食物能在战斗中回精力；商店可购买「自动加餐」实现全自动战斗。', 'info');
  }
}

/** 供各视图复用的公共片段：技能经验条 */
export function xpBarHtml(skillId) {
  const xp = state.skills[skillId] || 0;
  const lv = levelFromXp(xp);
  const pct = levelProgress(xp) * 100;
  const into = xp - xpForLevel(lv);
  const need = lv >= 100 ? 0 : xpForLevel(lv + 1) - xpForLevel(lv);
  return `<div class="xp-line"><span>Lv ${lv}${lv >= 100 ? ' · 满级' : ''}</span>
    <span>${lv >= 100 ? '—' : `${fmt(into)} / ${fmt(need)} (${pct.toFixed(1)}%)`}</span></div>
    <div class="bar bar-xp"><i style="width:${Math.min(100, pct)}%"></i></div>`;
}
