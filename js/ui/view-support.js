/**
 * 成长视图：摸鱼（Prayer）/ 背锅（Slayer）/ 灵感工坊
 */
import { state, getLevel, getCoins, countItem } from '../core/state.js';
import { PRAYERS, PRAYER_MAP } from '../data/prayers.js';
import { INSPIRATION_UPGRADES, inspCost } from '../data/inspiration.js';
import { SLAYER_TIERS, tierFor, scapegoatDamageBonus, taskReward, CANCEL_PENALTY } from '../data/slayer.js';
import { SLAYER_SHOP, ITEM_MAP, EQUIP_SLOTS } from '../data/items.js';
import { ENEMY_MAP } from '../data/enemies.js';
import { SKILL_MAP } from '../data/skills.js';
import { togglePrayer, newTask, claimTask, cancelTask, buyInspiration, buySlayerItem } from '../core/engine.js';
import { maxPrayers } from '../core/modifiers.js';
import { fmt } from '../core/xp.js';
import { esc, refresh, toast, xpBarHtml, confirmBox } from './app.js';

// ================================================================ 摸鱼
export const prayerView = {
  render() {
    const lv = getLevel('slacking');
    const max = maxPrayers();
    const active = state.prayers || [];
    const drainPerSec = active.reduce((a, id) => a + (PRAYER_MAP[id]?.drain || 0), 0);
    const slack = state.currencies['slack-point'];

    const rows = PRAYERS.map((p) => {
      const on = active.includes(p.id);
      const locked = lv < p.level;
      return `<div class="toggle-item${on ? ' on' : ''}${locked ? ' locked' : ''}" data-action="toggle" data-id="${p.id}">
        <div class="ti-icon">${p.icon}</div>
        <div class="ti-main">
          <div class="ti-name">${esc(p.name)}
            <span class="tag ${locked ? 'bad' : 'dim'}">Lv ${p.level}</span>
            <span class="tag dim">🐟 ${p.drain}/秒</span>
            ${on ? '<span class="tag good">生效中</span>' : ''}</div>
          <div class="ti-desc">${esc(p.desc || '')}</div>
        </div>
      </div>`;
    }).join('');

    return {
      html: `
      <h1 class="page-title">🐟 摸鱼</h1>
      <p class="page-desc">摸鱼是打工人的神圣权利。开启摸鱼状态会持续消耗「摸鱼点」，
        带来命中、伤害、减伤、经验等临时增益。摸鱼点从击杀敌人获得。
        当前最多同时开启 <b>${max}</b> 项（可在商店购买「带薪摸鱼」升级到 3 项）。</p>

      <div class="cat-head">
        <div class="ch-icon">🐟</div>
        <div style="flex:1">
          <div class="ch-name">摸鱼等级 ${lv} / 100</div>
          <div class="ch-desc">同时生效 ${active.length} / ${max}　·　每秒消耗 ${drainPerSec.toFixed(1)} 点</div>
        </div>
        <div style="min-width:200px">${xpBarHtml('slacking')}</div>
      </div>

      <div class="stat-grid" style="margin-bottom:16px">
        <div class="stat-box"><div class="k">摸鱼点余额</div><div class="v">${fmt(Math.floor(slack))}</div></div>
        <div class="stat-box"><div class="k">可支撑时长</div><div class="v">${drainPerSec > 0 ? fmt(Math.floor(slack / drainPerSec)) + 's' : '∞'}</div></div>
        <div class="stat-box"><div class="k">同时生效</div><div class="v">${active.length} / ${max}</div></div>
        <div class="stat-box"><div class="k">每秒消耗</div><div class="v">${drainPerSec.toFixed(1)}</div></div>
      </div>

      <div class="section-title">可开启的摸鱼姿势</div>
      ${rows}
      `,
    };
  },

  actions: {
    toggle(d) {
      const r = togglePrayer(d.id);
      if (!r) toast('开不了：等级不够、摸鱼点不足，或已达同时开启上限', 'warn');
      refresh();
    },
  },
};

// ================================================================ 背锅
export const slayerView = {
  render() {
    const lv = getLevel('scapegoat');
    const tier = tierFor(lv);
    const task = state.slayer?.task;
    const coins = state.currencies['scapegoat-coin'];

    let taskHtml = '';
    if (task && !task.done) {
      const e = ENEMY_MAP[task.enemyId];
      const pct = Math.min(100, (task.progress / task.count) * 100);
      taskHtml = `
        <div class="cat-head">
          <div class="ch-icon">🍳</div>
          <div style="flex:1">
            <div class="ch-name">${esc(e ? e.name : '未知')} <span class="tag dim">Lv ${e ? e.level : '?'}</span></div>
            <div class="ch-desc">击杀 ${task.progress} / ${task.count}</div>
            <div class="bar bar-xp" style="margin-top:8px"><i style="width:${pct}%"></i></div>
          </div>
          <button class="btn btn-sm btn-danger" data-action="cancel">甩锅（扣 ${(CANCEL_PENALTY * 100).toFixed(0)}% 进度）</button>
        </div>`;
    } else if (task && task.done) {
      const e = ENEMY_MAP[task.enemyId];
      const r = taskReward(e || { level: 10 }, task.count, tier);
      taskHtml = `
        <div class="cat-head" style="border-color:var(--good)">
          <div class="ch-icon">✅</div>
          <div style="flex:1">
            <div class="ch-name">锅背完了！</div>
            <div class="ch-desc">${esc(e ? e.name : '')} × ${task.count} 已达成，
              奖励 🍳 ${fmt(r.coins)} 背锅币 + ${fmt(r.xp)} 背锅经验</div>
          </div>
          <button class="btn btn-primary" data-action="claim">领取奖励</button>
        </div>`;
    } else {
      taskHtml = `
        <div class="cat-head">
          <div class="ch-icon">📋</div>
          <div style="flex:1">
            <div class="ch-name">还没有接锅</div>
            <div class="ch-desc">接一个锅，击杀指定敌人 N 次即可领取背锅币。当前档位：<b>${esc(tier.name)}</b>
              （目标等级 ≤ ${tier.maxEnemyLevel}，需击杀 ${tier.count[0]}~${tier.count[1]} 个）</div>
          </div>
          <button class="btn btn-primary" data-action="new">接一口锅</button>
        </div>`;
    }

    const shopRows = SLAYER_SHOP.map((entry) => {
      const it = ITEM_MAP[entry.item];
      if (!it) return '';
      const price = entry.slayerPrice || it.price || 0;
      const can = coins >= price;
      const st = it.stats || {};
      const bits = [];
      if (st.accuracy) bits.push(`命中+${fmt(st.accuracy)}`);
      if (st.damage) bits.push(`伤害+${fmt(st.damage)}`);
      if (st.defence) bits.push(`闪避+${fmt(st.defence)}`);
      if (st.hp) bits.push(`精力+${fmt(st.hp)}`);
      if (st.dr) bits.push(`减伤+${st.dr}%`);
      const slotName = EQUIP_SLOTS.find((s) => s.id === it.slot)?.name;
      return `<div class="shop-item">
        <div class="si-icon">${it.icon}</div>
        <div class="si-main">
          <div class="si-name">${esc(it.name)} <span class="tag gold">🍳 ${fmt(price)}</span>
            ${slotName ? `<span class="tag dim">${esc(slotName)}</span>` : ''}
            <span class="tag dim">持有 ${fmt(countItem(it.id))}</span></div>
          <div class="si-desc">${esc(it.desc || bits.join(' · ') || '')}</div>
        </div>
        <button class="btn btn-sm ${can ? 'btn-primary' : ''}" data-action="buys" data-id="${it.id}" data-price="${price}" ${can ? '' : 'disabled'}>兑换</button>
      </div>`;
    }).join('');

    const tierRows = SLAYER_TIERS.map((t) => {
      const on = t.name === tier.name;
      return `<div class="toggle-item${on ? ' on' : ''}${lv < t.minLevel ? ' locked' : ''}">
        <div class="ti-icon">🍳</div>
        <div class="ti-main">
          <div class="ti-name">${esc(t.name)} <span class="tag dim">需背锅等级 ${t.minLevel}</span>
            ${on ? '<span class="tag good">当前档位</span>' : ''}</div>
          <div class="ti-desc">目标敌人等级 ≤ ${t.maxEnemyLevel}　·　需击杀 ${t.count[0]}~${t.count[1]} 个　·　奖励倍率 ×${t.coinMul}</div>
        </div>
      </div>`;
    }).join('');

    return {
      html: `
      <h1 class="page-title">🍳 背锅</h1>
      <p class="page-desc">职场第一定律：活是干不完的，锅是甩不掉的。
        接一口锅，击杀指定敌人若干次即可获得背锅币，用来兑换背锅商店的专属装备。
        背锅等级还会被动提升你对精英与 Boss 的伤害。</p>

      ${taskHtml}

      <div class="cat-head">
        <div class="ch-icon">🍳</div>
        <div style="flex:1">
          <div class="ch-name">背锅等级 ${lv} / 100</div>
          <div class="ch-desc">对精英 +${scapegoatDamageBonus(lv, 'elite').toFixed(1)}% 伤害　·　
            对 Boss / 世界 Boss +${scapegoatDamageBonus(lv, 'boss').toFixed(1)}% 伤害</div>
        </div>
        <div style="min-width:200px">${xpBarHtml('scapegoat')}</div>
      </div>

      <div class="section-title">任务档位</div>
      ${tierRows}

      <div class="section-title">背锅商店（背锅币 ${fmt(Math.floor(coins))}）</div>
      ${shopRows}
      `,
    };
  },

  actions: {
    new() { newTask(); toast('🍳 接了一口新锅', 'good'); refresh(); },
    cancel() { confirmBox('确定甩锅？', '甩锅会损失一部分进度，确定要甩吗？', () => { cancelTask(); refresh(); }); },
    claim() {
      const r = claimTask();
      toast(r ? `✅ 领取成功：🍳 ${fmt(r.coins)} 背锅币` : '还没完成', r ? 'good' : 'warn');
      refresh();
    },
    buys(d) { buySlayerItem(d.id, Number(d.price)); refresh(); },
  },
};

// ================================================================ 灵感工坊
export const inspirationView = {
  render() {
    const insp = countItem('inspiration');
    const rows = INSPIRATION_UPGRADES.map((u) => {
      const lv = state.inspiration[u.id] || 0;
      const maxed = lv >= u.max;
      const cost = inspCost(u, lv);
      const can = !maxed && insp >= cost;
      const total = (lv * u.unit).toFixed(u.unit < 1 ? 1 : 0);
      return `<div class="shop-item">
        <div class="si-icon">${u.icon}</div>
        <div class="si-main">
          <div class="si-name">${esc(u.name)}
            <span class="tag dim">Lv ${lv} / ${u.max}</span>
            <span class="tag info">当前 +${total}${u.suffix} ${esc(u.effect)}</span></div>
          <div class="si-desc">每级 +${u.unit}${u.suffix} ${esc(u.effect)}　·　
            ${maxed ? '已满级' : `下一级需要 ✨ ${fmt(cost)} 灵感`}</div>
        </div>
        <button class="btn btn-sm ${can ? 'btn-primary' : ''}" data-action="buy" data-id="${u.id}" ${can ? '' : 'disabled'}>
          ${maxed ? '已满级' : '升级'}</button>
      </div>`;
    }).join('');

    return {
      html: `
      <h1 class="page-title">✨ 灵感工坊</h1>
      <p class="page-desc">画画、写歌、跳舞、看展……艺术产出「灵感」。灵感可以在工坊兑换永久加成，
        升级成本每级 ×1.6。当前灵感：<b>✨ ${fmt(insp)}</b></p>
      ${rows}
      `,
    };
  },

  actions: {
    buy(d) {
      const r = buyInspiration(d.id);
      toast(r ? '✨ 升级成功' : '灵感不够，或者已满级', r ? 'good' : 'warn');
      refresh();
    },
  },
};
