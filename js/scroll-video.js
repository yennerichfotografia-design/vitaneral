(() => {
  const TOTAL_FRAMES = 192;
  const NATIVE_W = 540;
  const NATIVE_H = 540;
  const FRAMES_DIR = './frames/';
  const pad = n => String(n).padStart(4, '0');

  const canvas = document.getElementById('frame-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  const loader = document.getElementById('frame-loader');
  const fill = document.getElementById('frame-loader-fill');
  const pct = document.getElementById('frame-loader-pct');
  const hint = document.getElementById('scroll-hint');
  const section = document.getElementById('scroll-section');
  const videoContainer = document.querySelector('.solution-scroll__video');

  let dpr, cW, cH;
  function sizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    cW = videoContainer.offsetWidth;
    cH = videoContainer.offsetHeight || cW; // fallback to square
    canvas.style.width = cW + 'px';
    canvas.style.height = cH + 'px';
    canvas.width = Math.round(cW * dpr);
    canvas.height = Math.round(cH * dpr);
    ctx.scale(dpr, dpr);
  }

  function drawCover(img) {
    if (!img || !img.naturalWidth) return;
    ctx.drawImage(img, 0, 0, NATIVE_W, NATIVE_H, 0, 0, cW, cH);
  }

  let sectionTop = 0, scrollRange = 0;
  function updateMetrics() {
    sectionTop = section.offsetTop;
    scrollRange = section.offsetHeight - window.innerHeight;
  }

  const frames = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  function preload() {
    return new Promise(resolve => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          const p = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          fill.style.width = p + '%';
          pct.textContent = p + '%';
          if (loadedCount === TOTAL_FRAMES) resolve();
        };
        img.src = FRAMES_DIR + 'frame_' + pad(i + 1) + '.jpg';
        frames[i] = img;
      }
    });
  }

  let currentIdx = -1;
  function draw(idx) {
    if (idx === currentIdx) return;
    currentIdx = idx;
    drawCover(frames[idx]);
  }

  let rafPending = false, nextIdx = 0;
  function onScroll() {
    const scrolled = window.scrollY - sectionTop;
    const progress = Math.max(0, Math.min(1, scrolled / scrollRange));
    nextIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
    if (scrolled > 20) hint.classList.add('gone');
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => { draw(nextIdx); rafPending = false; });
    }
  }

  window.addEventListener('resize', () => {
    sizeCanvas(); updateMetrics();
    const saved = currentIdx < 0 ? 0 : currentIdx;
    currentIdx = -1; draw(saved);
  });

  // Wait for DOM to be fully laid out
  function init() {
    sizeCanvas();
    preload().then(() => {
      updateMetrics(); currentIdx = -1; draw(0);
      if (loader) loader.classList.add('hidden');
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    });
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
