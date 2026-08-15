(function() {
  const scrollSpeedFactor = 0.04;
  const scrollKeysDown = new Set(['ArrowDown', 'PageDown', ' ', 'Spacebar']);
  const scrollKeysUp = new Set(['ArrowUp', 'PageUp']);
  const stopKeys = new Set(['ArrowDown', 'PageDown', ' ', 'Spacebar', 'ArrowUp', 'PageUp']);
  let scrollInterval = null;
  let scrollDirection = 0;

  function isTextInput(target) {
    if (!target || target === document.body || target === document.documentElement) return false;
    const tag = target.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
  }

  function canScrollVertically() {
    return document.documentElement.scrollHeight > document.documentElement.clientHeight;
  }

  function stopScrolling() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
    scrollDirection = 0;
  }

  function startScrolling(direction) {
    if (!canScrollVertically()) return;
    if (scrollDirection === direction && scrollInterval) return;
    stopScrolling();
    scrollDirection = direction;
    scrollInterval = setInterval(() => {
      window.scrollBy({ top: window.innerHeight * scrollSpeedFactor * direction, left: 0, behavior: 'auto' });
    }, 16);
  }

  function insertNavHint() {
    if (document.body.classList.contains('no-global-scroll') || document.documentElement.classList.contains('no-global-scroll')) return;
    const existingHint = document.querySelector('.nav-controls, .nav-hint, .kb-nav-hint, .kb-math-hint, .hub-scroll-hint');
    if (existingHint || !canScrollVertically()) return;

    const hint = document.createElement('div');
    hint.className = 'hub-scroll-hint';
    hint.innerHTML = '<div>⬆️ ⬇️ Scroll • Space/PageUp/PageDown</div><div>Home/End Top / Bottom</div>';

    const style = document.createElement('style');
    style.textContent = `
      .hub-scroll-hint {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9999;
        background: rgba(15, 23, 42, 0.92);
        color: #cbd5e1;
        border: 1px solid rgba(59, 130, 246, 0.35);
        border-radius: 12px;
        padding: 12px 14px;
        font-size: 12px;
        line-height: 1.5;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(12px);
        max-width: calc(100vw - 40px);
      }
      @media (max-width: 640px) {
        .hub-scroll-hint { bottom: 10px; left: 10px; right: 10px; font-size: 11px; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(hint);
  }

  document.addEventListener('keydown', (e) => {
    if (document.body.classList.contains('no-global-scroll') || document.documentElement.classList.contains('no-global-scroll')) return;
    if (e.defaultPrevented || isTextInput(e.target)) return;

    if (scrollKeysDown.has(e.key)) {
      e.preventDefault();
      startScrolling(1);
      return;
    }

    if (scrollKeysUp.has(e.key)) {
      e.preventDefault();
      startScrolling(-1);
      return;
    }

    if (e.key === 'Home') {
      if (!canScrollVertically()) return;
      e.preventDefault();
      stopScrolling();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (e.key === 'End') {
      if (!canScrollVertically()) return;
      e.preventDefault();
      stopScrolling();
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  });

  document.addEventListener('keyup', (e) => {
    if (document.body.classList.contains('no-global-scroll') || document.documentElement.classList.contains('no-global-scroll')) return;
    if (stopKeys.has(e.key)) {
      stopScrolling();
    }
  });

  window.addEventListener('blur', stopScrolling);
  window.addEventListener('resize', () => {
    if (!canScrollVertically()) stopScrolling();
  });

  document.addEventListener('DOMContentLoaded', insertNavHint);
  insertNavHint();
})();
