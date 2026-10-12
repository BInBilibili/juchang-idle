/**
 * 《菊厂放置》入口
 */
import { bootApp } from './ui/app.js';
import { applyOffline } from './core/engine.js';

function start() {
  bootApp();
  // 结算离线收益（必须在 load() 之后、主循环之前）
  try {
    const gain = applyOffline();
    if (gain) console.info('[菊厂放置] 离线收益', gain);
  } catch (e) {
    console.error('离线结算失败', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
