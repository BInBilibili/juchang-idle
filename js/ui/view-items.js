/**
 * 资产视图：背包 / 装备 / 商店
 */
import { state, getLevel, countItem, addItem, equip, unequip, bankSlots, bankUsed, getGold } from '../core/state.js';
import { ITEM_MAP, ITEMS, EQUIP_SLOTS, EQUIPMENT, EQUIP_BY_TIER, TIER_LEVEL, TIER_PRICE,
         SHOP_ITEMS, SHOP_UPGRADES, isStackable } from '../data/items.js';
import { buyShopItem, sellItem, buyUpgrade, useConsumable } from '../core/engine.js';
import { computeStats, weaponStyle } from '../core/modifiers.js';
import { fmt, fmtTime } from '../core/xp.js';
import { esc, refresh, toast, modal, closeModal, confirmBox } from './app.js';

const TYPE_LABEL = { food: '食物', special: '消耗品', equip: '装备', treasure: '收藏品', material: '材料', currency: '货币' };
let bankFilter = 'all';
let shopTab = 'consume';

// ================================================================ 背包
export const bankView = {
  render() {
    const entries = Object.entries(state.bank)
      .filter(([, q]) => q > 0)
      .map(([id, q]) => ({ id, qty: q, item: ITEM_MAP[id] }))
      .filter((e) => e.item)
      .filter((e) => bankFilter === 'all' || e.item.type === bankFilter);

    const order = { equip: 0, food: 1, special: 2, treasure: 3, material: 4, currency: 5 };
    entries.sort((a, b) => (order[a.item.type] ?? 9) - (order[b.item.type] ?? 9) || b.qty - a.qty);

    const filters = ['all', 'equip', 'food', 'special', 'treasure', 'material'].map((f) =>
      `<button class="area-tab${bankFilter === f ? ' active' : ''}" data-action="filter" data-id="${f}">
        ${f === 'all' ? '全部' : TYPE_LABEL[f]}</button>`).join('');

    const chips = entries.map((e) => `
      <div class="item-chip" data-action="item" data-id="${e.id}">
        <span class="iqty">${fmt(e.qty)}</span>
        <span class="ic">${e.item.icon}</span>
        <span class="inm">${esc(e.item.name)}</span>
      </div>`).join('');

    return {
      html: `
      <h1 class="page-title">🎒 背包</h1>
      <p class="page-desc">格子 ${bankUsed()} / ${bankSlots()}。点击物品可以装备、使用或出售。
        满了之后掉落物会丢在地上，可以去商店买「扩容」升级。</p>
      <div class="area-tabs">${filters}</div>
      ${entries.length ? `<div class="bank-grid">${chips}</div>`
        : `<div class="empty"><div class="e-icon">📦</div>背包空空的，去钓个鱼或者打个怪吧</div>`}
      `,
    };
  },

  actions: {
    filter(d) { bankFilter = d.id; refresh(); },
    item(d) {
      const item = ITEM_MAP[d.id];
      if (!item) return;
      const qty = countItem(d.id);
      const actions = [];
      const price = item.price || 0;

      if (item.type === 'equip') {
        const cur = state.equipment[item.slot];
        const statLine = equipStatsLine(item);
        actions.push({
          label: cur === item.id ? '已装备' : '装备',
          cls: 'btn-primary',
          fn: () => { if (equip(d.id)) { toast(`🧰 装备了 ${item.name}`, 'good', 1500); refresh(); } },
        });
      }
      if (item.heal || item.buff || item.give) {
        actions.push({
          label: '使用 1 个', cls: 'btn-good',
          fn: () => {
            const r = useConsumable(d.id);
            toast(r ? `✅ 使用了 ${item.name}` : '现在用不了', r ? 'good' : 'warn');
            refresh();
          },
        });
      }
      if (price > 0) {
        actions.push({ label: `卖 1 个（+${fmt(Math.floor(price * 0.6))}）`, fn: () => { sellItem(d.id, 1); refresh(); } });
        actions.push({ label: `卖 10 个`, fn: () => { sellItem(d.id, 10); refresh(); } });
        actions.push({ label: `全卖（+${fmt(Math.floor(price * 0.6 * qty))}）`, cls: 'btn-danger', fn: () => { sellItem(d.id, qty); refresh(); } });
      }

      modal(`${item.icon} ${esc(item.name)} <span class="tag dim">×${fmt(qty)}</span>`, `
        <p style="color:var(--text-2);line-height:1.7">${esc(item.desc || '')}</p>
        ${item.type === 'equip' ? `<div class="stat-grid" style="margin-top:12px">${statLine}</div>
          <p class="small muted" style="margin-top:10px">部位：${esc(EQUIP_SLOTS.find((s) => s.id === item.slot)?.name || item.slot)}　
          需求等级：${item.level}　售价：${fmt(price)}</p>` : ''}
        ${item.heal ? `<p class="small muted" style="margin-top:10px">回复精力：${fmt(item.heal)}</p>` : ''}
      `, actions);
    },
  },
};

function equipStatsLine(item) {
  const st = item.stats || {};
  const rows = [];
  const map = {
    accuracy: '命中等级', damage: '伤害加成', defence: '闪避等级', hp: '精力', dr: '减伤',
  };
  for (const [k, label] of Object.entries(map)) {
    if (st[k]) rows.push(`<div class="stat-box"><div class="k">${label}</div><div class="v">+${fmt(st[k])}${k === 'dr' ? '%' : ''}</div></div>`);
  }
  if (item.style) rows.push(`<div class="stat-box"><div class="k">攻击风格</div><div class="v" style="font-size:13px">${styleName(item.style)}</div></div>`);
  if (item.special) rows.push(`<div class="stat-box"><div class="k">特殊效果</div><div class="v" style="font-size:13px">${esc(item.special)}</div></div>`);
  return rows.join('') || '<div class="muted small">无属性加成</div>';
}
function styleName(s) { return { execution: '执行力', communication: '沟通力', presentation: '汇报力' }[s] || s; }

// ================================================================ 装备
export const equipView = {
  render() {
    const s = computeStats();
    const slots = EQUIP_SLOTS.map((slot) => {
      const id = state.equipment[slot.id];
      const it = id ? ITEM_MAP[id] : null;
      if (!it) {
        return `<div class="equip-slot" data-action="slot" data-id="${slot.id}">
          <div class="slot-label">${slot.icon} ${esc(slot.name)}</div>
          <div class="muted small" style="margin-top:8px">空 · 点击选择</div>
        </div>`;
      }
      const st = it.stats || {};
      const bits = [];
      if (st.accuracy) bits.push(`命中+${fmt(st.accuracy)}`);
      if (st.damage) bits.push(`伤害+${fmt(st.damage)}`);
      if (st.defence) bits.push(`闪避+${fmt(st.defence)}`);
      if (st.hp) bits.push(`精力+${fmt(st.hp)}`);
      if (st.dr) bits.push(`减伤+${st.dr}%`);
      return `<div class="equip-slot filled" data-action="slot" data-id="${slot.id}">
        <div class="slot-label">${slot.icon} ${esc(slot.name)}</div>
        <div class="slot-item"><span class="ic">${it.icon}</span><span>${esc(it.name)}</span></div>
        <div class="slot-stats">${bits.join(' · ') || '无加成'}</div>
        <div class="small muted">点击更换 / 卸下</div>
      </div>`;
    }).join('');

    return {
      html: `
      <h1 class="page-title">🧰 装备</h1>
      <p class="page-desc">武器决定你的攻击风格（执行力 / 沟通力 / 汇报力），护具提供闪避、精力与减伤。
        装备需要达到对应等级才能穿上，来源是打怪掉落或商店购买。</p>

      <div class="section-title">当前属性</div>
      <div class="stat-grid" style="margin-bottom:18px">
        <div class="stat-box"><div class="k">攻击风格</div><div class="v" style="font-size:14px">${styleName(weaponStyle())}</div></div>
        <div class="stat-box"><div class="k">精力上限</div><div class="v">${fmt(s.maxHp)}</div></div>
        <div class="stat-box"><div class="k">减伤</div><div class="v">${s.dr.toFixed(1)}%</div></div>
        <div class="stat-box"><div class="k">命中等级</div><div class="v">${fmt(s.accuracy[s.style])}</div></div>
        <div class="stat-box"><div class="k">闪避等级</div><div class="v">${fmt(s.evasion)}</div></div>
        <div class="stat-box"><div class="k">最大伤害</div><div class="v">${fmt(s.maxHit[s.style])}</div></div>
        <div class="stat-box"><div class="k">攻击间隔</div><div class="v">${(s.interval / 1000).toFixed(1)}s</div></div>
        <div class="stat-box"><div class="k">职场等级</div><div class="v">${s.combatLevel}</div></div>
      </div>

      <div class="section-title">装备槽位</div>
      <div class="equip-grid">${slots}</div>
      `,
    };
  },

  actions: {
    slot(d) {
      const slot = EQUIP_SLOTS.find((s) => s.id === d.id);
      const curId = state.equipment[d.id];
      const owned = Object.entries(state.bank)
        .filter(([, q]) => q > 0)
        .map(([id]) => ITEM_MAP[id])
        .filter((it) => it && it.type === 'equip' && it.slot === d.id);

      const actions = [];
      if (curId) {
        actions.push({
          label: '卸下', cls: 'btn-danger',
          fn: () => { unequip(d.id); toast('已卸下', 'info', 1200); refresh(); },
        });
      }
      if (!owned.length) {
        modal(`${slot.icon} ${esc(slot.name)}`, `<p class="muted">背包里没有这个部位的装备。去商店看看，或者打怪掉落。</p>`, actions);
        return;
      }

      const rows = owned.sort((a, b) => b.level - a.level).map((it) => {
        const can = getLevel('execution') >= 0 && (it.level <= 100);
        const usable = true;
        const st = it.stats || {};
        const bits = [];
        if (st.accuracy) bits.push(`命中+${fmt(st.accuracy)}`);
        if (st.damage) bits.push(`伤害+${fmt(st.damage)}`);
        if (st.defence) bits.push(`闪避+${fmt(st.defence)}`);
        if (st.hp) bits.push(`精力+${fmt(st.hp)}`);
        if (st.dr) bits.push(`减伤+${st.dr}%`);
        return `<div class="shop-item">
          <div class="si-icon">${it.icon}</div>
          <div class="si-main">
            <div class="si-name">${esc(it.name)} <span class="tag dim">Lv${it.level}</span>
              ${it.id === curId ? '<span class="tag good">已装备</span>' : ''}</div>
            <div class="si-desc">${bits.join(' · ')}</div>
          </div>
          <button class="btn btn-sm btn-primary" data-action="equipItem" data-id="${it.id}" ${it.id === curId ? 'disabled' : ''}>穿上</button>
        </div>`;
      }).join('');

      modal(`${slot.icon} ${esc(slot.name)} · 选择装备`, rows, actions);
    },
    equipItem(d) {
      const it = ITEM_MAP[d.id];
      if (!it) return;
      if (equip(d.id)) { toast(`🧰 装备了 ${it.name}`, 'good', 1500); closeModal(); refresh(); }
      else toast('等级不够，穿不上', 'warn');
    },
  },
};

// ================================================================ 商店
export const shopView = {
  render() {
    const tabs = [
      ['consume', '🍽️ 补给品'],
      ['upgrade', '⬆️ 升级'],
      ['equip', '🧰 装备'],
    ].map(([id, label]) => `<button class="area-tab${shopTab === id ? ' active' : ''}" data-action="tab" data-id="${id}">${label}</button>`).join('');

    return {
      html: `
      <h1 class="page-title">🏪 商店</h1>
      <p class="page-desc">用工资购买补给品、永久升级和装备。你现在有 <span class="price">💴 ${fmt(Math.floor(getGold()))}</span>。</p>
      <div class="area-tabs">${tabs}</div>
      ${shopTab === 'consume' ? consumeHtml() : shopTab === 'upgrade' ? upgradeHtml() : equipShopHtml()}
      `,
    };
  },

  actions: {
    tab(d) { shopTab = d.id; refresh(); },
    buy(d) {
      const qty = Number(d.qty || 1);
      const r = buyShopItem(d.id, qty);
      toast(r ? `🛒 购买了 ${ITEM_MAP[d.id].name} ×${qty}` : '工资不够，或者背包满了', r ? 'good' : 'warn');
      refresh();
    },
    buyEquip(d) {
      const it = ITEM_MAP[d.id];
      if (!it) return;
      const price = it.price || 0;
      if (getGold() < price) { toast(`工资不够，还差 ${fmt(price - getGold())}`, 'warn'); return; }
      if (addItem(d.id, 1) <= 0) { toast('背包满了，先卖点东西', 'warn'); return; }
      state.currencies.gold -= price;
      toast(`🛒 买下了 ${it.name}`, 'good');
      refresh();
    },
    upgrade(d) {
      const r = buyUpgrade(d.id);
      const up = SHOP_UPGRADES.find((u) => u.id === d.id);
      toast(r ? `⬆️ 已购买「${up.name}」` : '工资不够，或已经买过了', r ? 'good' : 'warn');
      refresh();
    },
  },
};

function consumeHtml() {
  return SHOP_ITEMS.map((entry) => {
    const it = ITEM_MAP[entry.item];
    if (!it) return '';
    const price = entry.price;
    const can = getGold() >= price;
    return `<div class="shop-item">
      <div class="si-icon">${it.icon}</div>
      <div class="si-main">
        <div class="si-name">${esc(it.name)} <span class="tag gold">💴 ${fmt(price)}</span>
          <span class="tag dim">持有 ${fmt(countItem(it.id))}</span></div>
        <div class="si-desc">${esc(it.desc || '')}</div>
      </div>
      <div class="row">
        <button class="btn btn-sm ${can ? 'btn-primary' : ''}" data-action="buy" data-id="${it.id}" data-qty="1" ${can ? '' : 'disabled'}>买 1</button>
        <button class="btn btn-sm" data-action="buy" data-id="${it.id}" data-qty="10" ${can ? '' : 'disabled'}>买 10</button>
      </div>
    </div>`;
  }).join('');
}

function upgradeHtml() {
  return SHOP_UPGRADES.map((up) => {
    const owned = !!state.upgrades[up.id];
    const can = !owned && getGold() >= up.price;
    return `<div class="shop-item">
      <div class="si-icon">${up.icon}</div>
      <div class="si-main">
        <div class="si-name">${esc(up.name)} <span class="tag gold">💴 ${fmt(up.price)}</span>
          ${owned ? '<span class="tag good">已拥有</span>' : ''}</div>
        <div class="si-desc">${esc(up.desc || '')}</div>
      </div>
      <button class="btn btn-sm ${can ? 'btn-primary' : ''}" data-action="upgrade" data-id="${up.id}" ${can ? '' : 'disabled'}>
        ${owned ? '已购买' : '购买'}</button>
    </div>`;
  }).join('');
}

function equipShopHtml() {
  let html = '';
  for (let t = 1; t <= 8; t++) {
    const pool = EQUIP_BY_TIER[t] || [];
    const lvReq = TIER_LEVEL[t - 1];
    const price = TIER_PRICE[t - 1];
    html += `<div class="section-title">档位 T${t} · 需求等级 Lv${lvReq} · 单价 💴 ${fmt(price)}</div>`;
    html += pool.map((it) => {
      const can = getGold() >= price;
      const st = it.stats || {};
      const bits = [];
      if (st.accuracy) bits.push(`命中+${fmt(st.accuracy)}`);
      if (st.damage) bits.push(`伤害+${fmt(st.damage)}`);
      if (st.defence) bits.push(`闪避+${fmt(st.defence)}`);
      if (st.hp) bits.push(`精力+${fmt(st.hp)}`);
      if (st.dr) bits.push(`减伤+${st.dr}%`);
      return `<div class="shop-item">
        <div class="si-icon">${it.icon}</div>
        <div class="si-main">
          <div class="si-name">${esc(it.name)} <span class="tag dim">${esc(EQUIP_SLOTS.find((s) => s.id === it.slot)?.name || it.slot)}</span>
            ${it.style ? `<span class="tag info">${styleName(it.style)}</span>` : ''}
            <span class="tag dim">持有 ${fmt(countItem(it.id))}</span></div>
          <div class="si-desc">${bits.join(' · ') || '无加成'}</div>
        </div>
        <button class="btn btn-sm ${can ? 'btn-primary' : ''}" data-action="buyEquip" data-id="${it.id}" ${can ? '' : 'disabled'}>💴 ${fmt(price)}</button>
      </div>`;
    }).join('');
  }
  return html;
}
