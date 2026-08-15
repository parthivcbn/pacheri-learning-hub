// Simple interactive observable-universe map
(() => {
  const svg = document.getElementById('universe');
  const ringsG = document.getElementById('rings');
  const galaxiesG = document.getElementById('galaxies');
  const labelsG = document.getElementById('labels');
  const resetBtn = document.getElementById('resetBtn');
  const scaleMode = document.getElementById('scaleMode');
  const labelsToggle = document.getElementById('labels');

  // Distances in light-years for rings (approx)
  const rings = [1, 1e3, 1e5, 1e6, 1e9, 13.8e9];

  // Map distances to radii (in svg coords). Two modes: log and linear
  function distanceToRadius(d, mode) {
    if (mode === 'linear') {
      // clamp large values to keep visible
      return Math.min(450, (d / 13.8e9) * 450);
    }
    // log scale: map log10(d) to radius
    const minLog = Math.log10(1);
    const maxLog = Math.log10(13.8e9);
    const v = (Math.log10(d) - minLog) / (maxLog - minLog);
    return 20 + v * 430; // keep inner margin
  }

  function render() {
    ringsG.innerHTML = '';
    labelsG.innerHTML = '';
    const mode = scaleMode.value;
    rings.forEach((d) => {
      const r = distanceToRadius(d, mode);
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', 0);
      ring.setAttribute('cy', 0);
      ring.setAttribute('r', r);
      ring.setAttribute('class', 'ring');
      ringsG.appendChild(ring);

      if (labelsToggle.checked) {
        const lab = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        lab.setAttribute('x', r + 8);
        lab.setAttribute('y', -4);
        lab.setAttribute('class', 'label');
        lab.textContent = formatDistance(d);
        labelsG.appendChild(lab);
      }
    });

    // sample galaxies: place a handful at various distances and angles
    galaxiesG.innerHTML = '';
    const sample = [
      {name:'Proxima Centauri', d:4.24},
      {name:'Milky Way Center', d:26000},
      {name:'Andromeda', d:2.537e6},
      {name:'Large Magellanic Cloud', d:1.63e5},
      {name:'Triangulum', d:2.73e6},
      {name:'Messier 87', d:53.5e6},
      {name:'Sombrero Galaxy', d:29.3e6},
      {name:'Distant Quasar', d:1e9}
    ];

    sample.forEach((g, i) => {
      const r = distanceToRadius(g.d, mode);
      const angle = (i / sample.length) * Math.PI * 2 + 0.4;
      const x = Math.cos(angle) * r * (0.5 + Math.random() * 0.7);
      const y = Math.sin(angle) * r * (0.5 + Math.random() * 0.7);
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', x);
      c.setAttribute('cy', y);
      c.setAttribute('r', Math.max(2, Math.min(6, 6 - Math.log10(g.d + 1))));
      c.setAttribute('class', 'galaxy');
      c.style.filter = 'url(#glow)';
      c.title = `${g.name} — ${formatDistance(g.d)}`;
      c.addEventListener('click', (e) => {
        alert(`${g.name}\nDistance: ${formatDistance(g.d)}`);
      });
      galaxiesG.appendChild(c);

      if (labelsToggle.checked) {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', x + 6);
        t.setAttribute('y', y + 4);
        t.setAttribute('class', 'label');
        t.textContent = g.name.replace(/\s(Galaxy|Quasar)$/, '');
        labelsG.appendChild(t);
      }
    });
  }

  function formatDistance(d) {
    if (d >= 1e9) return (d / 1e9).toFixed(1) + ' B ly';
    if (d >= 1e6) return (d / 1e6).toFixed(1) + ' M ly';
    if (d >= 1e3) return (d / 1e3).toFixed(0) + ' k ly';
    return d + ' ly';
  }

  // Pan & zoom using viewBox transform
  let view = { x: -500, y: -500, w: 1000, h: 1000 };
  function applyView() { svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`); }

  let isDragging = false, last = null;
  svg.addEventListener('pointerdown', (e) => { isDragging = true; last = {x:e.clientX, y:e.clientY}; svg.setPointerCapture(e.pointerId); });
  svg.addEventListener('pointermove', (e) => {
    if (!isDragging || !last) return;
    const dx = (e.clientX - last.x) * (view.w / svg.clientWidth);
    const dy = (e.clientY - last.y) * (view.h / svg.clientHeight);
    view.x -= dx; view.y -= dy; last = {x:e.clientX, y:e.clientY}; applyView();
  });
  svg.addEventListener('pointerup', (e) => { isDragging = false; last = null; svg.releasePointerCapture && svg.releasePointerCapture(e.pointerId); });
  svg.addEventListener('pointerleave', () => { isDragging = false; last = null; });

  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = Math.exp(e.deltaY * -0.0015);
    const rect = svg.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width * view.w + view.x;
    const cy = (e.clientY - rect.top) / rect.height * view.h + view.y;
    view.w *= zoomFactor; view.h *= zoomFactor;
    view.x = cx - (e.clientX - rect.left) / rect.width * view.w;
    view.y = cy - (e.clientY - rect.top) / rect.height * view.h;
    applyView();
  }, {passive:false});

  resetBtn.addEventListener('click', () => { view = { x:-500,y:-500,w:1000,h:1000 }; applyView(); });
  scaleMode.addEventListener('change', render);
  labelsToggle.addEventListener('change', render);

  // initial render
  applyView();
  render();
})();
