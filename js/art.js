/* Иллюстрации: SVG-горы, декор тропы, иконки */
function rng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
const hashStr = str => [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const lerp = (a, b, t) => a + (b - a) * t;
const f1 = n => Math.round(n * 10) / 10;

const ICON = {
  flame: '<svg viewBox="0 0 24 24"><path d="M12 2c.6 3.2-1.6 4.6-3 6.6C7.6 10.500 7 12 7 13.500a5 5 0 0 0 10 0c0-1.700-.8-3-1.700-4.200-.3 1.200-1 1.900-1.800 2C14.400 8 13.700 4.400 12 2Z" fill="currentColor"/></svg>',
  bolt: '<svg viewBox="0 0 24 24"><path d="M13 2 4.500 13.500H11L10 22l9-12h-6.500L13 2Z" fill="currentColor"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="m12 2.500 2.900 6 6.600.9-4.800 4.600 1.200 6.500L12 17.400 6.100 20.500l1.200-6.500L2.500 9.400l6.600-.9L12 2.500Z" fill="currentColor"/></svg>',
  flag: '<svg viewBox="0 0 24 24"><path d="M6 21V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 4h12l-3 4.500 3 4.500H6V4Z" fill="currentColor"/></svg>',
  tent: '<svg viewBox="0 0 24 24"><path d="M12 4 2.500 20h19L12 4Z" fill="currentColor"/><path d="M12 11v9" stroke="#fff" stroke-width="1.600" stroke-linecap="round" opacity=".7"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10.500" width="14" height="10" rx="2.500" fill="currentColor"/><path d="M8 10.500V8a4 4 0 0 1 8 0v2.500" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12.500 4.500 4.500L19 7.500" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M8 5.500v13l11-6.500-11-6.500Z" fill="currentColor"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2.500" stroke-linecap="round"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="m14.500 5-7 7 7 7" stroke="currentColor" stroke-width="2.500" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pack: '<svg viewBox="0 0 24 24"><path d="M8 7V5.500A2.500 2.500 0 0 1 10.500 3h3A2.500 2.500 0 0 1 16 5.500V7" stroke="currentColor" stroke-width="2" fill="none"/><rect x="5" y="7" width="14" height="14" rx="4" fill="currentColor"/><path d="M8.500 14h7" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/></svg>',
  mountain: '<svg viewBox="0 0 24 24"><path d="M1.500 20 9 6.500 13 13.500l2.500-4L22.500 20h-21Z" fill="currentColor"/></svg>',
  link: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trophy: '<svg viewBox="0 0 24 24"><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" fill="currentColor"/><path d="M7 6H4v1.500A3.500 3.500 0 0 0 7.500 11M17 6h3v1.500A3.500 3.500 0 0 1 16.500 11" stroke="currentColor" stroke-width="1.800" fill="none"/><path d="M12 14v4m-4 3h8" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"/></svg>',
  climber: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5.500" r="3" fill="currentColor"/><path d="M8 21l1.500-8L12 11l2.500 2L16 21" stroke="currentColor" stroke-width="2.600" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 11l3-1.500m9 1.500-3-1.500" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"/></svg>',
};

/* ---------- Сцена горы ---------- */
function mountainScene(lv, o = {}) {
  const w = o.w || 600, h = o.h || 320, p = lv.pal;
  const uid = 's' + lv.id + (o.tag || '');
  const R = rng(hashStr(lv.id) + 11);
  const cx = w * 0.56, baseY = h * 0.86, baseHalf = w * 0.5;
  const topY = h * (1 - lv.peak) + 26;
  const n = 9;
  const L = [], Rt = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, ease = Math.pow(t, 0.92);
    const jl = i > 0 && i < n ? (R() - 0.5) * h * 0.07 : 0;
    const jr = i > 0 && i < n ? (R() - 0.5) * h * 0.07 : 0;
    L.push([lerp(cx - baseHalf, cx, ease), lerp(baseY, topY, ease) + jl]);
    Rt.push([lerp(cx + baseHalf * 1.05, cx, ease), lerp(baseY, topY, ease) + jr]);
  }
  Rt[n] = L[n];
  const pts = a => a.map(q => f1(q[0]) + ' ' + f1(q[1])).join(' L');
  const mainD = 'M' + pts(L) + ' L' + pts([...Rt].reverse().slice(1)) + ` L${w + 30} ${h} L-30 ${h}Z`;

  // тень на правом склоне
  const shade = [Rt[n]];
  for (let i = n - 1; i >= 0; i--) shade.push(Rt[i]);
  shade.push([cx + baseHalf * 0.12, baseY]);
  for (let i = 1; i < n; i++) shade.push([lerp(cx + baseHalf * 0.12, cx, i / n) + (i % 2 ? 7 : -5), lerp(baseY, topY, i / n)]);
  const shadeD = 'M' + pts(shade) + 'Z';

  // снег
  let snow = '';
  if (p.snow) {
    const cov = 1 - lv.snowLine;
    const k = Math.max(1, Math.min(n - 1, Math.round(n * (1 - cov))));
    const arr = [];
    for (let i = k; i <= n; i++) arr.push(L[i]);
    for (let i = n - 1; i >= k; i--) arr.push(Rt[i]);
    const a = Rt[k], b = L[k], teeth = 6;
    for (let i = 1; i < teeth; i++) {
      const t = i / teeth;
      arr.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t) + (i % 2 ? h * 0.05 : -h * 0.012)]);
    }
    snow = `<path d="M${pts(arr)}Z" fill="${p.snow}"/>`;
  }

  // дальние хребты
  const ridgeFar = (y, amp, seed) => {
    const r = rng(seed); let d = `M-10 ${h}`; const st = 8;
    for (let i = 0; i <= st; i++) d += ` L${f1(-10 + (w + 20) * i / st)} ${f1(y - (i % 2 ? amp : 0) - r() * amp)}`;
    return d + ` L${w + 10} ${h}Z`;
  };

  // деревья
  const trees = [];
  const TR = rng(hashStr(lv.id) + 99);
  const treeCount = lv.id === 'C1' ? 8 : 16;
  for (let i = 0; i < treeCount; i++) {
    const x = lerp(-5, w + 5, i / (treeCount - 1)) + (TR() - 0.5) * 24;
    const y = baseY + 6 + TR() * (h - baseY) * 0.9;
    const s = 12 + TR() * 15;
    if (lv.id === 'A0') trees.push(`<circle cx="${f1(x)}" cy="${f1(y - s * 0.55)}" r="${f1(s * 0.55)}" fill="${p.tree}"/><rect x="${f1(x - 1.5)}" y="${f1(y - s * 0.2)}" width="3" height="${f1(s * 0.25)}" fill="${p.dark}"/>`);
    else trees.push(`<path d="M${f1(x)} ${f1(y - s * 1.5)} L${f1(x - s * 0.42)} ${f1(y)} L${f1(x + s * 0.42)} ${f1(y)}Z" fill="${p.tree}"/>`);
  }

  // тропа и альпинист
  const K = 8, trail = [];
  for (let i = 0; i <= K; i++) {
    const t = i / K, y = lerp(baseY + 8, topY + 12, t);
    const half = baseHalf * (1 - t) * 0.78;
    trail.push([cx + (i === 0 ? 0 : (i % 2 ? -1 : 1) * half * 0.55 * (1 - t * 0.4)), y]);
  }
  trail[K] = [cx, topY + 10];
  let len = 0; const seg = [];
  for (let i = 1; i <= K; i++) { const d = Math.hypot(trail[i][0] - trail[i - 1][0], trail[i][1] - trail[i - 1][1]); seg.push(d); len += d; }
  const trailD = 'M' + pts(trail);
  let climber = '';
  if (o.progress != null) {
    let target = Math.max(0, Math.min(1, o.progress)) * len, pos = trail[0];
    for (let i = 0; i < seg.length; i++) {
      if (target <= seg[i]) { const t = target / seg[i]; pos = [lerp(trail[i][0], trail[i + 1][0], t), lerp(trail[i][1], trail[i + 1][1], t)]; break; }
      target -= seg[i]; pos = trail[i + 1];
    }
    climber = `<g transform="translate(${f1(pos[0])} ${f1(pos[1])})"><circle r="11" fill="${p.accent}" opacity=".25" class="pulse"/><circle r="6.500" fill="${p.accent}" stroke="#fff" stroke-width="2.500"/></g>`;
  }

  // облака
  const cloud = (x, y, s, dur, delay) => `<g class="cloud" style="animation-duration:${dur}s;animation-delay:${delay}s"><g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="${p.night ? 0.16 : 0.85}"><ellipse cx="0" cy="0" rx="30" ry="9"/><ellipse cx="-14" cy="-6" rx="16" ry="9"/><ellipse cx="9" cy="-9" rx="18" ry="10"/></g></g>`;

  const stars = p.night ? Array.from({ length: 34 }, () => `<circle cx="${f1(R() * w)}" cy="${f1(R() * h * 0.5)}" r="${f1(0.5 + R() * 1.2)}" fill="#fff" opacity="${f1(0.35 + R() * 0.6)}"/>`).join('') : '';
  const sunY = p.night ? h * 0.52 : h * 0.24, sunR = p.night ? 34 : 24;

  const reached = o.progress != null && o.progress >= 1;
  const flag = `<g transform="translate(${f1(cx)} ${f1(topY)})"><path d="M0 0V-30" stroke="${p.night ? '#FDEBDD' : '#2A343B'}" stroke-width="2" stroke-linecap="round"/><path class="wave" d="M0 -30 L18 -25 L0 -18Z" fill="${reached ? '#FFC24B' : p.accent}"/></g>`;

  return `<svg class="scene" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Гора ${lv.name}">
<defs>
<linearGradient id="sky${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.skyTop}"/><stop offset="1" stop-color="${p.skyBot}"/></linearGradient>
<radialGradient id="glow${uid}"><stop offset="0" stop-color="${p.sun}" stop-opacity=".9"/><stop offset="1" stop-color="${p.sun}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${w}" height="${h}" fill="url(#sky${uid})"/>
${stars}
<circle cx="${w * 0.2}" cy="${sunY}" r="${sunR * 2.600}" fill="url(#glow${uid})"/>
<circle cx="${w * 0.2}" cy="${sunY}" r="${sunR}" fill="${p.sun}"/>
${cloud(w * 0.12, h * 0.18, 1, 46, -8)}${cloud(w * 0.78, h * 0.3, 0.8, 62, -30)}${cloud(w * 0.45, h * 0.1, 0.6, 54, -18)}
<path d="${ridgeFar(h * 0.62, 18, 5)}" fill="${p.far}"/>
<path d="${ridgeFar(h * 0.72, 22, 9)}" fill="${p.mid}"/>
<path d="${mainD}" fill="${p.rock}"/>
<path d="${shadeD}" fill="${p.dark}" opacity=".9"/>
${snow}
<path d="M-10 ${h * 0.9} Q${w * 0.3} ${h * 0.8} ${w * 0.55} ${h * 0.88} T${w + 10} ${h * 0.86} V${h} H-10Z" fill="${p.ground}"/>
${trees.join('')}
<path d="${trailD}" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="2.200" stroke-dasharray="2 6" stroke-linecap="round"/>
${flag}${climber}
</svg>`;
}

/* ---------- Фон длинной тропы ---------- */
function trailBackdrop(lv, W, H) {
  const p = lv.pal, R = rng(hashStr(lv.id) + 5);
  let out = '';
  const side = () => (R() < 0.5 ? R() * W * 0.16 : W - R() * W * 0.16);
  // облака в верхней трети
  for (let i = 0; i < 5; i++) out += `<ellipse cx="${f1(R() * W)}" cy="${f1(60 + R() * H * 0.22)}" rx="${f1(30 + R() * 30)}" ry="${f1(8 + R() * 6)}" fill="#fff" opacity="${p.night ? 0.1 : 0.55}"/>`;
  // звёзды для ночной горы
  if (p.night) for (let i = 0; i < 40; i++) out += `<circle cx="${f1(R() * W)}" cy="${f1(R() * H * 0.28)}" r="${f1(0.6 + R())}" fill="#fff" opacity="${f1(0.3 + R() * 0.6)}"/>`;
  const count = Math.round(H / 55);
  for (let i = 0; i < count; i++) {
    const y = R() * (H - 40) + 20, f = y / H; // 0 — вершина, 1 — подножие
    const x = side(), s = 14 + R() * 18;
    if (f > 0.55) {
      if (lv.id === 'A0') out += `<circle cx="${f1(x)}" cy="${f1(y - s * 0.5)}" r="${f1(s * 0.55)}" fill="${p.tree}" opacity=".9"/>`;
      else out += `<path d="M${f1(x)} ${f1(y - s * 1.6)} L${f1(x - s * 0.45)} ${f1(y)} L${f1(x + s * 0.45)} ${f1(y)}Z" fill="${p.tree}" opacity=".9"/>`;
    } else if (f > 0.22) {
      out += `<path d="M${f1(x - s)} ${f1(y)} L${f1(x - s * 0.2)} ${f1(y - s * 1.200)} L${f1(x + s * 0.3)} ${f1(y - s * 0.6)} L${f1(x + s)} ${f1(y)}Z" fill="${p.dark}" opacity=".75"/>`;
    } else {
      if (!p.snow) { out += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(s * 1.8)}" ry="${f1(s * 0.9)}" fill="${p.rock}" opacity=".7"/>`; continue; }
      const sn = p.snow;
      out += `<path d="M${f1(x - s * 1.100)} ${f1(y)} L${f1(x)} ${f1(y - s * 1.700)} L${f1(x + s * 1.100)} ${f1(y)}Z" fill="${p.rock}" opacity=".85"/><path d="M${f1(x - s * 0.34)} ${f1(y - s * 1.050)} L${f1(x)} ${f1(y - s * 1.700)} L${f1(x + s * 0.34)} ${f1(y - s * 1.050)} L${f1(x)} ${f1(y - s * 0.9)}Z" fill="${sn}"/>`;
    }
  }
  return `<svg class="trail-bg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${out}</svg>`;
}

/* плавная кривая через точки */
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}
