/**
 * 经验与等级计算 —— 完全沿用 Melvor Idle 的经验曲线
 *
 * 升到 L 级所需的累计经验：
 *   XP(L) = floor( 1/4 * Σ_{l=1}^{L-1} floor( l + 300 * 2^(l/7) ) )
 *
 * 特点：每 7 级经验翻倍；1→92 级的经验量约等于 92→99 级。
 * 本作上限 100 级，100 级累计经验 14,391,160。
 */

export const MAX_LEVEL = 100;

/** 累计经验表（索引 = 等级） */
export const XP_TABLE = (() => {
  const table = [0, 0]; // Lv0 / Lv1 都是 0
  let sum = 0;
  for (let l = 1; l < MAX_LEVEL; l++) {
    sum += Math.floor(l + 300 * Math.pow(2, l / 7));
    table[l + 1] = Math.floor(sum / 4);
  }
  return table;
})();

/** 升到 level 级所需累计经验 */
export function xpForLevel(level) {
  if (level <= 1) return 0;
  if (level >= MAX_LEVEL) return XP_TABLE[MAX_LEVEL];
  return XP_TABLE[level];
}

/** 由累计经验反推等级 */
export function levelFromXp(xp) {
  let lo = 1, hi = MAX_LEVEL;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (xpForLevel(mid) <= xp) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** 当前等级内的进度 0~1 */
export function levelProgress(xp) {
  const lv = levelFromXp(xp);
  if (lv >= MAX_LEVEL) return 1;
  const cur = xpForLevel(lv);
  const next = xpForLevel(lv + 1);
  return (xp - cur) / (next - cur);
}

/** 距离下一级还差多少经验 */
export function xpToNext(xp) {
  const lv = levelFromXp(xp);
  if (lv >= MAX_LEVEL) return 0;
  return xpForLevel(lv + 1) - xp;
}

/** 格式化大数字 */
export function fmt(n) {
  if (n === undefined || n === null || Number.isNaN(n)) return '0';
  const abs = Math.abs(n);
  if (abs < 1000) return String(Math.floor(n));
  if (abs < 1e6) return (n / 1e3).toFixed(abs < 1e4 ? 2 : 1) + 'K';
  if (abs < 1e9) return (n / 1e6).toFixed(2) + 'M';
  if (abs < 1e12) return (n / 1e9).toFixed(2) + 'B';
  if (abs < 1e15) return (n / 1e12).toFixed(2) + 'T';
  return n.toExponential(2);
}

/** 格式化时长 */
export function fmtTime(ms) {
  if (ms <= 0) return '0s';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}
