/* One skill pulls back into many; the files settle into a drifting relation graph. */
(() => {
  const canvas = document.getElementById('network');
  const g = canvas.getContext('2d');
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  if (pixelRatio > 1) {
    canvas.width = Math.round(1600 * pixelRatio);
    canvas.height = Math.round(900 * pixelRatio);
    g.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }
  const TAU = Math.PI * 2;
  const N = 96;
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => { v = clamp(v); return v * v * (3 - 2 * v); };
  const phase = (t, a, b) => ease((t - a) / (b - a));
  const mix = (a, b, p) => a + (b - a) * p;

  const nodes = Array.from({ length: N }, (_, i) => {
    const angle = i * 2.399963229728653;
    const r = Math.sqrt((i + .5) / N) * (1 + .065 * Math.sin(i * 3.17));
    return {
      x: i === 0 ? 0 : Math.cos(angle) * r * 435,
      y: i === 0 ? 0 : Math.sin(angle) * r * 310,
      z: .62 * Math.sin(i * 1.91) + .28 * Math.cos(angle),
      seed: i * 1.713,
      accent: i % 9 === 0 || i % 17 === 0,
    };
  });

  const edges = [];
  const edgeSet = new Set();
  function connect(a, b) {
    if (a === b) return;
    const key = [Math.min(a, b), Math.max(a, b)].join('-');
    if (!edgeSet.has(key)) { edgeSet.add(key); edges.push([a, b]); }
  }
  nodes.forEach((n, i) => {
    nodes.map((m, j) => ({ j, d: (n.x - m.x) ** 2 + (n.y - m.y) ** 2 }))
      .filter(v => v.j !== i).sort((a, b) => a.d - b.d)
      .slice(0, i % 4 === 0 ? 4 : 3).forEach(v => connect(i, v.j));
    if (i % 9 === 0) connect(i, 25);
    if (i % 11 === 0) connect(i, 69);
  });

  const gymPath = [80, 67, 54, 75, 41, 20, 28, 15, 23, 10, 18, 39, 26, 34];
  const gymEdges = new Set(gymPath.slice(1).map((id, i) =>
    [Math.min(id, gymPath[i]), Math.max(id, gymPath[i])].join('-')));
  const fabricSet = new Set(nodes.map((n, i) =>
    n.x > -55 && n.x < 290 && n.y > -180 && n.y < 175 ? i : -1).filter(i => i >= 0));

  function positions(t, { gather = 1, cx = 1090, cy = 490, scale = .82, drift = 1, focus = 1 } = {}) {
    const rotation = .026 * Math.sin(t / 1720);
    const cr = Math.cos(rotation), sr = Math.sin(rotation);
    const raw = nodes.map((n, i) => {
      const scatterX = i === 0 ? 0 : n.x + 142 * Math.sin(n.seed * 1.5);
      const scatterY = i === 0 ? 0 : n.y + 112 * Math.cos(n.seed * 1.2);
      const dx = mix(scatterX, n.x, gather);
      const dy = mix(scatterY, n.y, gather);
      const amp = drift * (7 + Math.max(0, n.z) * 11);
      const waveX = Math.sin(t / 930 + n.seed) * amp + Math.sin(t / 2240 + n.seed * .3) * 5 * drift;
      const waveY = Math.cos(t / 1110 + n.seed * .71) * amp * .72;
      const px = dx * cr - dy * sr + waveX;
      const py = dx * sr + dy * cr + waveY;
      return [
        px + n.z * Math.sin(t / 1260) * 17 * drift / scale,
        py + n.z * Math.cos(t / 1580) * 13 * drift / scale,
      ];
    });
    const anchorX = raw[0][0] * (1 - focus);
    const anchorY = raw[0][1] * (1 - focus);
    return raw.map(([x, y]) => [cx + scale * (x - anchorX), cy + scale * (y - anchorY)]);
  }

  function line(a, b, alpha, color, width = 1, blur = 0) {
    if (alpha <= 0) return;
    g.save();
    g.globalAlpha = alpha; g.strokeStyle = color; g.lineWidth = width;
    if (blur) g.filter = `blur(${blur}px)`;
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    g.restore();
  }
  function dot(p, radius, alpha, color) {
    if (alpha <= 0) return;
    g.save();
    g.globalAlpha = alpha; g.fillStyle = color;
    g.beginPath(); g.arc(p[0], p[1], radius, 0, TAU); g.fill();
    g.restore();
  }
  function fileGlyph(p, alpha, size = 1) {
    if (alpha <= 0) return;
    g.save();
    g.globalAlpha = alpha;
    g.translate(p[0], p[1]); g.scale(size, size);
    g.fillStyle = '#fff'; g.strokeStyle = '#9fcbb4'; g.lineWidth = 1.4;
    g.shadowColor = '#286d4727'; g.shadowBlur = 11; g.shadowOffsetY = 5;
    g.beginPath(); g.roundRect(-18, -23, 36, 46, 4); g.fill(); g.stroke();
    g.shadowBlur = 0; g.shadowOffsetY = 0;
    g.strokeStyle = '#0aa473'; g.lineWidth = 1.5;
    for (const y of [-9, -2, 5]) { g.beginPath(); g.moveTo(-10, y); g.lineTo(10, y); g.stroke(); }
    g.restore();
  }
  function heroFile(t, p) {
    const appear = phase(t, 2020, 2260);
    const vanish = 1 - phase(t, 3450, 3750);
    const a = appear * vanish;
    if (a <= 0) return;
    const zoom = mix(1, .082, phase(t, 2200, 3600));
    g.save();
    g.globalAlpha = a; g.translate(p[0], p[1]); g.scale(zoom, zoom);
    g.shadowColor = '#19683e35'; g.shadowBlur = 50; g.shadowOffsetY = 22;
    g.fillStyle = '#fff'; g.strokeStyle = '#b8d8c5'; g.lineWidth = 2;
    g.beginPath(); g.roundRect(-160, -194, 320, 388, 22); g.fill(); g.stroke();
    g.shadowBlur = 0; g.shadowOffsetY = 0;
    g.fillStyle = '#e7f5ec'; g.fillRect(-160, -194, 320, 76);
    g.fillStyle = '#087f5c'; g.font = 'bold 39px Consolas, monospace';
    g.fillText('SKILL.md', -123, -140);
    g.strokeStyle = '#b9d8c6'; g.lineWidth = 5;
    [ -65, -24, 17, 58, 99 ].forEach((y, i) => {
      g.beginPath(); g.moveTo(-115, y); g.lineTo(i % 2 ? 75 : 117, y); g.stroke();
    });
    g.fillStyle = '#0aa473'; g.beginPath(); g.arc(-111, 145, 12, 0, TAU); g.fill();
    g.restore();
  }

  function drawMesh(t, coords, { alpha = 1, reveal = 1, nodeReveals = null, gym = 0, fabric = 0 } = {}) {
    edges.forEach(([a, b], i) => {
      const shown = nodeReveals
        ? Math.min(nodeReveals[a], nodeReveals[b]) * phase(t, 3850 + i * 2, 4100 + i * 2)
        : reveal >= 1 ? 1 : phase(reveal, i / edges.length - .08, i / edges.length + .18);
      if (!shown) return;
      const z = (nodes[a].z + nodes[b].z) / 2;
      const far = z < -.12;
      const key = [Math.min(a, b), Math.max(a, b)].join('-');
      const selected = (gym > 0 && gymEdges.has(key)) || (fabric > 0 && fabricSet.has(a) && fabricSet.has(b));
      const color = selected ? '#0ca870' : '#819a9a';
      const strength = selected ? .68 : far ? .15 : .29;
      line(coords[a], coords[b], alpha * shown * strength, color, selected ? 1.9 : far ? .85 : 1.1, far ? 1.15 : 0);
    });
    coords.forEach((p, i) => {
      const n = nodes[i];
      const shown = nodeReveals ? nodeReveals[i] : reveal >= 1 ? 1 : phase(reveal, i / N - .06, i / N + .14);
      const selected = (gym > 0 && gymPath.includes(i)) || (fabric > 0 && fabricSet.has(i));
      const active = selected || n.accent;
      dot(p, selected ? 5.2 : active ? 4.2 : 2.5 + n.z * 1.1,
        alpha * shown * (selected ? .82 : n.z < -.12 ? .42 : .78),
        active ? '#12b981' : '#92a5a7');
    });
  }

  function introArcs(t) {
    const a = phase(t, 300, 1300);
    g.save(); g.strokeStyle = '#0b9d6d'; g.lineWidth = 1.5; g.globalAlpha = .058 * a;
    for (let i = 0; i < 3; i++) {
      g.beginPath(); g.arc(800, 450, 285 + i * 46, Math.PI * .82, Math.PI * (1.2 + a * .65)); g.stroke();
    }
    g.restore();
  }

  window.drawDenseNetwork = t => {
    g.clearRect(0, 0, 1600, 900);
    if (t < 1950) { introArcs(t); return; }

    if (t < 6300) {
      const pull = phase(t, 2460, 3650);
      const retreat = phase(t, 4700, 6000);
      const camera = {
        cx: mix(800, 1090, retreat),
        cy: mix(450, 490, retreat),
        scale: mix(mix(7.2, 1.45, pull), .82, retreat),
        gather: phase(t, 3470, 4650),
        drift: mix(.35, 1, phase(t, 3500, 4650)),
      };
      const coords = positions(t, camera);
      const nodeReveals = nodes.map((_, i) => phase(t, 3450 + i * 9, 3700 + i * 9));
      for (let i = 1; i < N; i++) {
        const appear = phase(t, 2500 + i * 7, 2690 + i * 7);
        const reveal = nodeReveals[i];
        fileGlyph(coords[i], appear * (1 - reveal),
          (.72 + .14 * nodes[i].z) * mix(1, .22, reveal));
      }
      heroFile(t, coords[0]);
      drawMesh(t, coords, { nodeReveals });
      return;
    }

    if (t < 22800) {
      // Start the background drift at the retreat's exact final camera pose.
      const driftIn = phase(t, 6300, 7350);
      const camera = {
        cx: 1090 + Math.sin((t - 6300) / 1510) * 27 * driftIn,
        cy: 490 + Math.sin((t - 6300) / 1840) * 18 * driftIn,
        scale: .82,
        drift: mix(1, 1.25, driftIn),
      };
      const coords = positions(t, camera);
      const gym = phase(t, 10200, 10800) * (1 - phase(t, 13700, 14300));
      const fabric = phase(t, 14200, 14900) * (1 - phase(t, 17800, 18400));
      const access = phase(t, 18100, 18600);
      drawMesh(t, coords, { alpha: mix(1, .9, phase(t, 6300, 6900)) * (1 - access * .38), gym, fabric });
      if (gym > 0) {
        gymPath.slice(1).forEach((id, i) => {
          const q = phase(t, 10400 + i * 150, 10700 + i * 150) * gym;
          line(coords[gymPath[i]], coords[id], q * .72, '#08a773', 2.1);
        });
      }
      return;
    }
    const closing = phase(t, 22800, 23700);
    if (closing > 0) {
      const coords = positions(t, { cx: 1230, cy: 330, scale: mix(.42, .63, closing), drift: 1.5 });
      drawMesh(t, coords, { alpha: closing * .19 });
    }
  };
  window.renderAt(window.promoInitialFrame || 0);
})();
