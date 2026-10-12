/**
 * 视图注册表 + 总览页 + 设置页
 */
import { state, getLevel, save, load, wipe, exportSave, importSave } from '../core/state.js';
import { SKILLS, SKILL_MAP, SKILL_GROUPS } from '../data/skills.js';
import { computeStats, collectModifiers, offlineRate, autoEatThreshold } from '../core/modifiers.js';
import { ACTIVITY_MAP } from '../data/activities.js';
import { ENEMY_MAP } from '../data/enemies.js';
import { fmt, fmtTime, xpForLevel, levelFromXp, levelProgress } from '../core/xp.js';
import { esc, refresh, toast, modal, confirmBox, go, xpBarHtml } from './app.js';
import { combatView } from './view-combat.js';
import { skillView } from './view-skill.js';
import { bankView, equipView, shopView } from './view-items.js';
import { prayerView, slayerView, inspirationView } from './view-support.js';

// ================================================================ 总览
const overviewView = {
  render() {
    const s = computeStats();
    const mods = collectModifiers();
    const st = state.stats;
    const skillCards = SKILLS.map((sk) => {
      const lv = getLevel(sk.id);
      const pct = levelProgress(state.skills[sk.id] || 0) * 100;
      return `<div class="card skill-card">
        <div class="skill-head">
          <span class="skill-icon">${sk.icon}</span>
          <span class="skill-name">${esc(sk.name)}</span>
          <span class="skill-lv${lv >= 100 ? ' max' : ''}">${lv}</span>
        </div>
        <div class="skill-desc small">${esc(sk.desc || '')}</div>
        <div class="bar bar-xp"><i style="width:${Math.min(100, pct)}%"></i></div>
      </div>`;
    }).join('');

    const groups = SKILL_GROUPS.map((g) => {
      const total = g.ids.reduce((a, id) => a + getLevel(id), 0);
      const max = g.ids.length * 100;
      return `<div class="stat-box">
        <div class="k">${esc(g.title)}</div>
        <div class="v">${total} <span class="small muted">/ ${max}</span></div>
        <div class="bar bar-xp" style="margin-top:6px"><i style="width:${(total / max) * 100}%"></i></div>
      </div>`;
    }).join('');

    let nowDoing = '<span class="muted">摸鱼中（什么也没干）</span>';
    if (state.combat.active) {
      const e = ENEMY_MAP[state.combat.enemyId];
      nowDoing = `⚔️ 正在和 <b>${esc(e ? e.name : '?')}</b> 交战`;
    } else if (state.activity.active) {
      const a = ACTIVITY_MAP[state.activity.id];
      nowDoing = `🕒 正在 <b>${esc(a ? a.name : '?')}</b>（${SKILL_MAP[a?.skill]?.name || ''}）`;
    }

    return {
      html: `
      <h1 class="page-title">📋 总览</h1>
      <p class="page-desc">菊厂打工人模拟器。你现在：${nowDoing}</p>

      <div class="stat-grid" style="margin-bottom:18px">
        <div class="stat-box"><div class="k">职场等级</div><div class="v">${s.combatLevel}</div></div>
        <div class="stat-box"><div class="k">精力上限</div><div class="v">${fmt(s.maxHp)}</div></div>
        <div class="stat-box"><div class="k">减伤</div><div class="v">${s.dr.toFixed(1)}%</div></div>
        <div class="stat-box"><div class="k">最大伤害</div><div class="v">${fmt(s.maxHit[s.style])}</div></div>
        <div class="stat-box"><div class="k">累计击杀</div><div class="v">${fmt(st.totalKills)}</div></div>
        <div class="stat-box"><div class="k">累计工资</div><div class="v">${fmt(st.goldEarned)}</div></div>
        <div class="stat-box"><div class="k">累计掉落</div><div class="v">${fmt(st.itemsGained)}</div></div>
        <div class="stat-box"><div class="k">加班时长</div><div class="v" style="font-size:14px">${fmtTime(state.playTime)}</div></div>
      </div>

      <div class="section-title">分组进度</div>
      <div class="stat-grid" style="margin-bottom:18px">${groups}</div>

      <div class="section-title">当前加成</div>
      <div class="stat-grid" style="margin-bottom:18px">
        <div class="stat-box"><div class="k">经验获取</div><div class="v">+${mods.xpBonus.toFixed(1)}%</div></div>
        <div class="stat-box"><div class="k">金钱获取</div><div class="v">+${mods.goldBonus.toFixed(1)}%</div></div>
        <div class="stat-box"><div class="k">掉落率</div><div class="v">+${mods.dropBonus.toFixed(1)}%</div></div>
        <div class="stat-box"><div class="k">命中 / 伤害</div><div class="v">+${mods.accuracyBonus.toFixed(0)}% / +${mods.damageBonus.toFixed(0)}%</div></div>
        <div class="stat-box"><div class="k">减伤 / 精力</div><div class="v">+${mods.drBonus.toFixed(1)}% / +${mods.hpBonus.toFixed(0)}%</div></div>
        <div class="stat-box"><div class="k">攻速</div><div class="v">+${mods.attackSpeed.toFixed(0)}%</div></div>
      </div>

      <div class="section-title">全部技能</div>
      <div class="grid grid-4">${skillCards}</div>
      `,
    };
  },
};

// ================================================================ 设置
const settingsView = {
  render() {
    const s = state.settings;
    return {
      html: `
      <h1 class="page-title">⚙️ 设置</h1>
      <p class="page-desc">游戏进度自动保存在浏览器本地（每 10 秒一次，切后台也会保存）。
        换设备请用「导出存档」。</p>

      <div class="section-title">战斗设置</div>
      <div class="toggle-item${s.autoEat ? ' on' : ''}" data-action="toggle" data-id="autoEat">
        <div class="ti-icon">🍽️</div>
        <div class="ti-main">
          <div class="ti-name">自动加餐 ${s.autoEat ? '<span class="tag good">已开启</span>' : '<span class="tag dim">已关闭</span>'}</div>
          <div class="ti-desc">精力低于 <b>${autoEatThreshold() || 40}%</b> 时自动吃背包里回精力最高的食物。
            ${autoEatThreshold() ? '' : '（需要先在商店购买「自动加餐」升级）'}</div>
        </div>
      </div>
      <div class="toggle-item${s.autoLoot ? ' on' : ''}" data-action="toggle" data-id="autoLoot">
        <div class="ti-icon">🧲</div>
        <div class="ti-main">
          <div class="ti-name">自动拾取 ${s.autoLoot ? '<span class="tag good">已开启</span>' : '<span class="tag dim">已关闭</span>'}</div>
          <div class="ti-desc">击杀掉落的物品直接进背包（背包满时会掉在地上）。</div>
        </div>
      </div>

      <div class="section-title">离线收益</div>
      <div class="card">
        <p class="small muted" style="margin:0 0 10px">
          关闭页面后，重新打开时会按 <b>${offlineRate()}%</b> 效率结算离线时间的收益（最长 24 小时）。
          可在商店购买「离线加班」升级提升效率。
        </p>
        <div class="stat-grid">
          <div class="stat-box"><div class="k">本次在线时长</div><div class="v" style="font-size:14px">${fmtTime(state.playTime)}</div></div>
          <div class="stat-box"><div class="k">创建时间</div><div class="v" style="font-size:13px">${new Date(state.createdAt).toLocaleString('zh-CN')}</div></div>
        </div>
      </div>

      <div class="section-title">存档</div>
      <div class="row row-wrap">
        <button class="btn btn-primary" data-action="save">💾 立即存档</button>
        <button class="btn" data-action="export">📤 导出存档</button>
        <button class="btn" data-action="import">📥 导入存档</button>
        <button class="btn btn-danger" data-action="wipe">🗑️ 重开人生</button>
      </div>

      <div class="section-title">关于</div>
      <div class="card">
        <p class="small muted" style="line-height:1.8;margin:0">
          <b>菊厂放置</b> —— 一款上班族主题的放置类游戏，玩法参考 Melvor Idle。<br>
          15 个技能全部 100 级上限 · 89 个敌人（7 大岗位 × 4 区域 × 3 敌人 + 5 个世界 Boss）·
          8 项业余爱好 · 88 件装备。<br>
          纯前端实现，无后端、无依赖，进度存在你自己的浏览器里。
        </p>
      </div>
      `,
    };
  },

  actions: {
    toggle(d) {
      state.settings[d.id] = !state.settings[d.id];
      if (d.id === 'autoEat' && state.settings.autoEat && !autoEatThreshold()) {
        toast('还没有「自动加餐」升级，去商店买一个吧', 'warn');
      }
      refresh();
    },
    save() { toast(save() ? '💾 已存档' : '存档失败', save() ? 'good' : 'bad', 1400); },
    export() {
      const str = exportSave();
      modal('📤 导出存档', `
        <p class="small muted">复制下面的文本保存好，换设备时用「导入存档」粘贴回来。</p>
        <textarea readonly style="width:100%;height:180px;margin-top:10px;background:var(--bg);color:var(--text-2);
          border:1px solid var(--line);border-radius:8px;padding:10px;font-family:var(--mono);font-size:11px"
          onclick="this.select()">${esc(str)}</textarea>
        <p class="small muted" style="margin-top:8px">长度 ${str.length} 字符（点击文本框会自动全选）</p>
      `);
    },
    import() {
      modal('📥 导入存档', `
        <p class="small muted">把之前导出的存档文本粘贴进来。⚠️ 会覆盖当前进度。</p>
        <textarea id="importBox" style="width:100%;height:180px;margin-top:10px;background:var(--bg);color:var(--text);
          border:1px solid var(--line);border-radius:8px;padding:10px;font-family:var(--mono);font-size:11px"
          placeholder="粘贴存档文本…"></textarea>
      `, [
        { label: '取消' },
        { label: '导入', cls: 'btn-danger', keepOpen: false, fn: () => {
          const el = document.getElementById('importBox');
          const r = importSave(el ? el.value : '');
          toast(r ? '📥 导入成功' : '导入失败：存档格式不对', r ? 'good' : 'bad');
          if (r) go('overview');
        } },
      ]);
    },
    wipe() {
      confirmBox('重开人生？', '这会清空所有进度，无法撤销。确定要从头开始吗？', () => {
        wipe();
        toast('🔄 已重开，欢迎再次入职', 'good');
        go('overview');
      });
    },
  },
};

// ================================================================ 注册表
export const VIEWS = {
  overview: overviewView,
  combat: combatView,
  skill: skillView,
  bank: bankView,
  equip: equipView,
  shop: shopView,
  prayer: prayerView,
  slayer: slayerView,
  inspiration: inspirationView,
  settings: settingsView,
};
