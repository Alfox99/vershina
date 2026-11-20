/* Вершина — логика приложения */
const $ = s => document.querySelector(s);
const KEY = 'vershina_v1';
const todayKey = (d = new Date()) => d.toLocaleDateString('sv');
const yesterdayKey = () => { const d = new Date(); d.setDate(d.getDate() - 1); return todayKey(d); };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const lvById = id => LEVELS.find(l => l.id === id);

/* ---------- состояние ---------- */
const defaults = () => ({ ver: 3, xp: 0, streak: 0, bestStreak: 0, last: null, days: {}, done: {}, badges: {}, goal: 2, free: true, movies: { seen: {}, notes: {} }, books: [], vocab: [], notes: {}, reader: { size: 20, font: 'serif', theme: 'sepia' }, pagesTotal: 0 });
let S = (() => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY)) || {}, st = Object.assign(defaults(), raw);
    if (!raw.ver) st.free = true; // раньше уроки открывались по порядку, теперь всё открыто
    if ((raw.ver || 0) < 3) { // уборка тестовых данных и старых форматов
      const stamps = Object.keys(raw.world || {}).length; st.xp = Math.max(0, st.xp - 25 * stamps); delete st.world;
      ['world3', 'world10'].forEach(k => delete st.badges[k]);
      const old = st.books.filter(b => b.lib && b.pos === undefined);
      if (old.length) { st.books = st.books.filter(b => !(b.lib && b.pos === undefined)); st.xp = Math.max(0, st.xp - (st.pagesTotal || 0)); st.pagesTotal = 0; }
    }
    st.ver = 3; return st;
  } catch (e) { return defaults(); }
})();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* приватный режим */ } };
const streakNow = () => (S.last === todayKey() || S.last === yesterdayKey() ? S.streak : 0);
const doneCount = id => Object.keys(S.done[id] || {}).length;
const isDone = (id, n) => !!(S.done[id] || {})[n];
const nextLesson = id => { const lv = lvById(id); for (let i = 1; i <= lv.videos.length; i++) if (!isDone(id, i)) return i; return lv.videos.length; };
const unlocked = (id, n) => S.free || n === 1 || isDone(id, n - 1);
const rankOf = xp => { let i = 0; RANKS.forEach((r, k) => { if (xp >= r[0]) i = k; }); const cur = RANKS[i], nx = RANKS[i + 1]; return { name: cur[1], from: cur[0], to: nx ? nx[0] : null, i }; };
const goalToday = () => S.days[todayKey()] || 0;
function markActive() {
  const t = todayKey();
  if (S.last !== t) { S.streak = S.last === yesterdayKey() ? S.streak + 1 : 1; S.last = t; }
  S.bestStreak = Math.max(S.bestStreak, S.streak);
}
function awardBadges(announce) {
  const nb = [];
  BADGES.forEach(b => { if (!S.badges[b.id] && b.test(S)) { S.badges[b.id] = todayKey(); nb.push(b); } });
  if (nb.length) save();
  if (announce) nb.forEach((b, k) => setTimeout(() => toast('Награда: ' + b.t, ICON.trophy), 900 + k * 900));
  return nb;
}

/* ---------- утилиты UI ---------- */
function toast(msg, icon) {
  const t = document.createElement('div'); t.className = 'toast';
  t.innerHTML = (icon ? `<i>${icon}</i>` : '') + `<span>${esc(msg)}</span>`;
  $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3200);
}
function ring(val, max, color) {
  max = max || 1; const r = 22, c = 2 * Math.PI * r, p = Math.min(1, val / max);
  return `<div class="ring"><svg viewBox="0 0 54 54"><circle cx="27" cy="27" r="${r}" fill="none" stroke="#E7E1D3" stroke-width="6"/><circle cx="27" cy="27" r="${r}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${f1(c * p)} ${f1(c)}"/></svg><span>${Math.min(val, max)}/${max}</span></div>`;
}
function setAccent(lv) {
  const r = document.documentElement.style;
  r.setProperty('--accent', lv ? lv.pal.accent : '#4F9468');
  r.setProperty('--soft', lv ? lv.pal.soft : '#E4F0E3');
}
function confetti(power = 1) {
  const cv = $('#fx'), ctx = cv.getContext('2d');
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = ['#F2B33D', '#4F9468', '#E07A5F', '#4A6BD0', '#fff', '#2682B6'];
  const ps = Array.from({ length: 140 * power }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .55, vx: (Math.random() - .5) * 14, vy: -Math.random() * 15 - 5, s: 5 + Math.random() * 6, c: cols[(Math.random() * cols.length) | 0], r: Math.random() * 6, vr: (Math.random() - .5) * .4 }));
  let t = 0;
  (function f() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
    if (++t < 160) requestAnimationFrame(f); else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}

/* ---------- шапка ---------- */
const NAV = [['home', '#/', 'Горы', 'mountain'], ['movies', '#/movies', 'Кино', 'film'], ['books', '#/books', 'Книги', 'book']];
function renderTop(route) {
  const fireOff = streakNow() === 0, tab = route === 'mountain' ? 'home' : route;
  $('#top').innerHTML = `<div class="top-in">
    ${route === 'mountain' ? `<button class="back" id="bk" aria-label="Назад">${ICON.back}</button>` : ''}
    <a class="logo" href="#/"><i>${ICON.mountain}</i><span>Вершина</span></a>
    <nav class="nav">${NAV.map(n => `<a href="${n[1]}" class="${tab === n[0] ? 'on' : ''}">${ICON[n[3]]}<span>${n[2]}</span></a>`).join('')}</nav>
    <div class="sp"></div>
    <div class="chip fire ${fireOff ? 'off' : ''}" title="Дней подряд">${ICON.flame}${streakNow()}</div>
    <div class="chip xp" title="Опыт">${ICON.bolt}${fmt(S.xp)}</div>
    <button class="pack-btn" id="pk">${ICON.pack}<span>Рюкзак</span></button></div>`;
  const b = $('#bk'); if (b) b.onclick = () => (location.hash = '#/');
  $('#pk').onclick = openPack;
}

/* ---------- маршруты ---------- */
function route() {
  closeModal();
  const m = location.hash.match(/^#\/m\/(\w+)/);
  if (m && lvById(m[1])) return renderMountain(lvById(m[1]));
  if (location.hash === '#/movies') return renderMovies();
  if (location.hash === '#/books') return renderBooks();
  renderHome();
}
window.addEventListener('hashchange', route);
let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (/^#\/m\//.test(location.hash) && !$('.modal')) route(); }, 250); });

/* ---------- главная ---------- */
function renderHome() {
  setAccent(null); renderTop('home'); window.scrollTo(0, 0);
  const rk = rankOf(S.xp);
  const pct = rk.to ? Math.round((S.xp - rk.from) / (rk.to - rk.from) * 100) : 100;
  // продолжить: последняя начатая гора, не покорённая; иначе A0
  let cont = LEVELS.find(l => doneCount(l.id) > 0 && doneCount(l.id) < l.videos.length) || LEVELS.find(l => doneCount(l.id) === 0) || LEVELS[5];
  const cn = nextLesson(cont.id);
  const total = LEVELS.reduce((n, l) => n + l.videos.length, 0);
  $('#app').innerHTML = `<div class="fade">
    <section class="hero">
      <h1>Английский — это восхождение</h1>
      <p>Шесть гор от A0 до C1. Смотри урок, проверь себя заданием, делай шаг вверх. Один урок в день — и через год вершина твоя.</p>
    </section>
    <section class="stats">
      <div class="stat"><div class="ico" style="background:#FDE7DC;color:#F2693D">${ICON.flame}</div><div><b>${streakNow()} ${plural(streakNow(), 'день', 'дня', 'дней')}</b><small>Серия без пропусков</small></div></div>
      <div class="stat" style="display:block"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:18px">${rk.name}</b><small>${fmt(S.xp)} XP${rk.to ? ' / ' + fmt(rk.to) : ''}</small></div><div class="bar"><i style="width:${pct}%;background:#F2B33D"></i></div></div>
      ${S.goal ? `<div class="stat">${ring(goalToday(), S.goal, '#4F9468')}<div><b>Цель дня</b><small>${goalToday() >= S.goal ? 'Выполнена. Огонь!' : 'Пройди ' + S.goal + ' ' + plural(S.goal, 'урок', 'урока', 'уроков')}</small></div></div>`
        : `<div class="stat"><div class="ico" style="background:#E4F0E3;color:#4F9468">${ICON.mountain}</div><div><b>В своём темпе</b><small>Цели на день нет. Учись, когда хочется</small></div></div>`}
    </section>
    <div class="cont" id="cont" style="background:${cont.pal.accent}">
      <div class="t"><small>${doneCount(cont.id) ? 'Продолжить подъём' : 'Начать путь'} · ${cont.id} · ${cont.name}</small><b>Урок ${cn}</b></div>
      <div class="go" style="color:${cont.pal.accent}">${ICON.play}</div>
    </div>
    <div class="sec-t"><h2>Кроме курса</h2><span>отдельные модули</span></div>
    <section class="mods">
      <a href="#/movies" class="mod" style="--c:#C8553D"><i>${ICON.film}</i><div><b>Кино</b><small>${MOVIES.length} разборов от русскоязычных блогеров</small></div></a>
      <a href="#/books" class="mod" style="--c:#B8743A"><i>${ICON.book}</i><div><b>Книги</b><small>Читалка внутри приложения, 20 книг в свободном доступе</small></div></a>
    </section>
    <div class="sec-t"><h2>Карта гор</h2><span>${Object.values(S.done).reduce((n, o) => n + Object.keys(o).length, 0)} из ${total} уроков</span></div>
    <section class="grid">${LEVELS.map(lv => {
      const d = doneCount(lv.id), p = d / lv.videos.length;
      return `<article class="mcard" data-l="${lv.id}" style="--accent:${lv.pal.accent}">
        <div class="art">${mountainScene(lv, { w: 600, h: 320, progress: p, tag: 'c' })}<span class="lvl">${lv.id}</span>${p >= 1 ? `<span class="done-flag">${ICON.flag}</span>` : ''}</div>
        <div class="bd"><h3>${lv.name}</h3><div class="mood">${lv.mood}</div>
          <div class="bar"><i style="width:${Math.round(p * 100)}%"></i></div>
          <div class="row"><span>${d} / ${lv.videos.length} уроков</span><span>${fmt(Math.round(lv.height * p))} / ${fmt(lv.height)} м</span></div></div>
      </article>`;
    }).join('')}</section>
    <p class="foot">Видеоуроки — курс «Весь английский язык в одном курсе» (English Galaxy) с канала <a href="https://www.youtube.com/@englishplaylists" target="_blank" rel="noopener">«Английский язык по плейлистам»</a> (Александр Бебрис). Прогресс хранится в этом браузере.</p>
  </div>`;
  document.querySelectorAll('.mcard').forEach(c => c.onclick = () => (location.hash = '#/m/' + c.dataset.l));
  $('#cont').onclick = () => { location.hash = '#/m/' + cont.id; setTimeout(() => openLesson(cont.id, cn), 60); };
}
function plural(n, a, b, c) { n = Math.abs(n) % 100; const m = n % 10; return n > 10 && n < 20 ? c : m > 1 && m < 5 ? b : m === 1 ? a : c; }

/* ---------- страница горы ---------- */
function renderMountain(lv) {
  setAccent(lv); renderTop('mountain'); window.scrollTo(0, 0);
  const N = lv.videos.length, d = doneCount(lv.id), p = d / N;
  $('#app').innerHTML = `<div class="fade">
    <section class="mhero"><div class="art">${mountainScene(lv, { w: 900, h: 380, progress: p, tag: 'h' })}</div>
      <div class="ov"><h1>${lv.name}</h1><p>${lv.blurb}</p></div></section>
    <div class="mmeta">
      <span class="chip"><b>${lv.id}</b> уровень</span>
      <span class="chip">${ICON.flag} <b>${d}</b>/${N} уроков</span>
      <span class="chip">${ICON.mountain} <b>${fmt(Math.round(lv.height * p))}</b> / ${fmt(lv.height)} м</span>
      <a class="chip" href="https://www.youtube.com/playlist?list=${lv.playlist}" target="_blank" rel="noopener">${ICON.link} Плейлист на YouTube</a>
    </div>
    <div class="trail-wrap" id="tw"></div>
  </div>`;
  buildTrail(lv);
  const cur = $('.node.cur'); if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center', behavior: 'smooth' }), 350);
}
function buildTrail(lv) {
  const wrap = $('#tw'), W = Math.min(560, wrap.parentElement.clientWidth), N = lv.videos.length;
  const step = 96, padT = 110, padB = 90, H = padT + padB + (N - 1) * step;
  wrap.style.width = W + 'px'; wrap.style.height = H + 'px';
  const p = lv.pal;
  wrap.style.background = `linear-gradient(to bottom, ${p.skyTop} 0%, ${p.skyBot} 16%, ${p.far} 40%, ${p.mid} 70%, ${p.ground} 100%)`;
  const pos = i => [W / 2 + Math.sin(i * 0.78) * W * 0.27, H - padB - (i - 1) * step]; // i = номер урока
  const pts = Array.from({ length: N }, (_, k) => pos(k + 1));
  const d = doneCount(lv.id), nl = nextLesson(lv.id);
  const prog = pts.slice(0, Math.min(N, Math.max(1, S.free ? d : (d >= N ? N : d + 1))));
  const svg = `<svg class="trail-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <path d="${smoothPath(pts)}" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 16"/>
    <path d="${smoothPath(prog)}" fill="none" stroke="${p.accent}" stroke-width="7" stroke-linecap="round" opacity=".9"/></svg>`;
  let nodes = '';
  for (let n = 1; n <= N; n++) {
    const [x, y] = pos(n), done = isDone(lv.id, n), ok = unlocked(lv.id, n);
    const camp = n % LESSONS_PER_CAMP === 0 && n !== N, summit = n === N;
    const cur = !done && ok && n === nl;
    const cls = ['node', summit ? 'summit' : camp ? 'camp' : '', done ? 'done' : cur ? 'cur' : ok ? 'todo' : 'lock'].join(' ');
    const inner = done && !summit ? ICON.check : !ok ? ICON.lock : summit ? ICON.flag : camp ? ICON.tent : `<span class="n">${n}</span>`;
    const stars = done ? `<div class="stars">${[1, 2, 3].map(k => `<svg viewBox="0 0 24 24" class="${S.done[lv.id][n] >= k ? 'on' : ''}"><path d="m12 2.500 2.900 6 6.600.9-4.800 4.600 1.200 6.500L12 17.400 6.100 20.500l1.200-6.500L2.500 9.400l6.600-.9L12 2.500Z" fill="currentColor"/></svg>`).join('')}</div>` : '';
    nodes += `<button class="${cls}" data-n="${n}" style="left:${f1(x)}px;top:${f1(y)}px" aria-label="Урок ${n}">${inner}${stars}</button>`;
    if (cur) nodes += `<div class="here" style="left:${f1(x)}px;top:${f1(y)}px">${ICON.climber}</div>`;
    if (camp || summit) {
      const right = x < W / 2;
      nodes += `<span class="tag" style="top:${f1(y)}px;${right ? `left:${f1(x + 44)}px` : `right:${f1(W - x + 44)}px`}">${summit ? 'Вершина · ' + fmt(lv.height) + ' м' : 'Лагерь ' + (n / LESSONS_PER_CAMP) + ' · ' + fmt(Math.round(lv.height * n / N)) + ' м'}</span>`;
    }
  }
  wrap.innerHTML = trailBackdrop(lv, W, H) + svg + nodes;
  wrap.querySelectorAll('.node').forEach(b => b.onclick = () => {
    const n = +b.dataset.n;
    if (!unlocked(lv.id, n)) { toast('Сначала пройди урок ' + (n - 1)); return; }
    openLesson(lv.id, n);
  });
}

/* ---------- модалки ---------- */
function openModal(html, narrow) {
  closeModal();
  const m = document.createElement('div'); m.className = 'modal'; m.id = 'modal';
  m.innerHTML = `<div class="sheet ${narrow ? 'narrow' : ''}" role="dialog" aria-modal="true">${html}</div>`;
  m.addEventListener('mousedown', e => { if (e.target === m) closeModal(); });
  document.body.appendChild(m); document.body.style.overflow = 'hidden';
  return m.firstElementChild;
}
function closeModal() { const m = $('#modal'); if (m) m.remove(); document.body.style.overflow = ''; document.onkeydown = null; }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- урок ---------- */
function openLesson(id, n) {
  const lv = lvById(id), vid = lv.videos[n - 1], was = (S.done[id] || {})[n], g = LEVELS.indexOf(lv) * 50 + n;
  setAccent(lv);
  const sh = openModal(`
    <div class="sh-head"><div><small>${lv.id} · ${lv.name}</small><h2>Урок ${n} из ${lv.videos.length}</h2><small style="margin-top:2px">№ ${g} в плейлисте курса</small></div><button class="x" id="cl" aria-label="Закрыть">${ICON.close}</button></div>
    <div class="steps"><span class="on"></span><span></span></div>
    <div class="sh-body">
      <div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${vid}?rel=0&modestbranding=1&playsinline=1" title="Урок ${n}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
      <div class="vrow">
        <a class="btn ghost" href="https://www.youtube.com/watch?v=${vid}&list=${COURSE_PLAYLIST}&index=${g}" target="_blank" rel="noopener">${ICON.link} Открыть на YouTube</a>
        <span class="hint">${was ? 'Урок уже пройден — можно пересмотреть и улучшить результат.' : 'Посмотри урок до конца, затем проверим, что закрепилось.'}</span>
        <button class="btn" id="go">К заданию ${ICON.play}</button>
      </div>
      <h4 class="nt">Мой конспект</h4>
      <textarea id="lnotes" class="notes" rows="6" placeholder="Правило: …&#10;Примеры: …&#10;Новые слова: …&#10;Что повторить: …">${esc((S.notes || {})[id + n] || '')}</textarea>
    </div>`);
  $('#lnotes').oninput = e => { S.notes = S.notes || {}; if (e.target.value.trim()) S.notes[id + n] = e.target.value; else delete S.notes[id + n]; save(); };
  $('#cl').onclick = closeModal;
  $('#go').onclick = () => startQuiz(lv, n, 0);
}

/* ---------- задание ---------- */
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; };
function pickQuestions(lv, n, attempt) {
  const mcs = lv.bank.filter(q => q.t === 'mc'), ords = lv.bank.filter(q => q.t === 'ord');
  const start = ((n - 1) * 4 + attempt * 3) % mcs.length, out = [];
  for (let k = 0; k < QUIZ_LEN - 1; k++) out.push(mcs[(start + k) % mcs.length]);
  out.push(ords[((n - 1) + attempt) % ords.length]);
  return out;
}
function startQuiz(lv, n, attempt) {
  const qs = pickQuestions(lv, n, attempt);
  const st = { i: 0, ok: 0, qs, lv, n, attempt };
  renderQ(st);
}
function renderQ(st) {
  const { lv, n, qs, i } = st, q = qs[i];
  const head = `
    <div class="sh-head"><div><small>${lv.id} · Урок ${n}</small><h2>Проверим себя</h2></div><button class="x" id="cl" aria-label="Закрыть">${ICON.close}</button></div>
    <div class="steps"><span class="on"></span><span class="on"></span></div>
    <div class="qprog"><div class="bar"><i style="width:${i / qs.length * 100}%"></i></div><span class="cnt">${i + 1} / ${qs.length}</span></div>`;
  let body;
  if (q.t === 'mc') {
    const opts = shuffle([q.a, ...q.w]);
    body = `<div class="qcard"><div class="lab">Выбери ответ</div><h3>${esc(q.q)}</h3>
      <div class="opts">${opts.map((o, k) => `<button class="opt" data-v="${esc(o)}"><kbd>${k + 1}</kbd>${esc(o)}</button>`).join('')}</div></div><div id="fb"></div>`;
  } else {
    const words = shuffle([...q.a.split(' '), ...q.extra]);
    body = `<div class="qcard"><div class="lab">Собери предложение</div><h3>${esc(q.ru)}</h3>
      <div class="tray" id="tray"></div><div class="pool" id="pool">${words.map((w, k) => `<button class="w" data-k="${k}">${esc(w)}</button>`).join('')}</div>
      <div class="check-row"><button class="btn" id="chk" disabled>Проверить</button></div></div><div id="fb"></div>`;
  }
  const sh = $('#modal') ? $('#modal .sheet') : openModal('', false);
  sh.className = 'sheet narrow'; sh.innerHTML = head + `<div class="sh-body">${body}</div>`;
  $('#cl').onclick = () => { if (confirm('Выйти из задания? Прогресс этого задания не сохранится.')) closeModal(); };

  const finish = (right, correctText) => {
    if (right) st.ok++;
    const fb = $('#fb');
    fb.innerHTML = `<div class="fb ${right ? 'ok' : 'no'}"><div class="m"><b>${right ? pick(['Верно!', 'Отлично!', 'В точку!', 'Так держать!']) : 'Почти'}</b>${right ? esc(q.e || '') : 'Правильно: <b style="display:inline">' + esc(correctText) + '</b>' + (q.e ? '<br>' + esc(q.e) : '')}</div><button class="btn" id="nx">${i + 1 < qs.length ? 'Дальше' : 'Результат'}</button></div>`;
    $('#nx').onclick = () => { if (i + 1 < qs.length) { st.i++; renderQ(st); } else showResult(st); };
    $('#nx').focus();
  };

  if (q.t === 'mc') {
    const handle = btn => {
      if (!btn || btn.disabled) return;
      const right = btn.dataset.v === q.a;
      document.querySelectorAll('.opt').forEach(b => { b.disabled = true; if (b.dataset.v === q.a) b.classList.add('ok'); });
      if (!right) btn.classList.add('no');
      finish(right, q.a);
    };
    document.querySelectorAll('.opt').forEach(b => b.onclick = () => handle(b));
    st.key = e => { const k = +e.key; if (k >= 1 && k <= 4) handle(document.querySelectorAll('.opt')[k - 1]); else if (e.key === 'Enter' && $('#nx')) $('#nx').click(); };
  } else {
    const tray = $('#tray'), pool = $('#pool'), chk = $('#chk');
    const upd = () => { chk.disabled = !tray.children.length; };
    pool.onclick = e => { const b = e.target.closest('.w'); if (!b) return; const c = b.cloneNode(true); c.dataset.k = b.dataset.k; b.classList.add('ghost'); tray.appendChild(c); upd(); };
    tray.onclick = e => { const b = e.target.closest('.w'); if (!b) return; pool.querySelector(`[data-k="${b.dataset.k}"]`).classList.remove('ghost'); b.remove(); upd(); };
    chk.onclick = () => {
      const norm = s => s.toLowerCase().replace(/[.,!?]/g, '').trim();
      const got = norm([...tray.children].map(c => c.textContent).join(' '));
      const right = got === norm(q.a);
      chk.disabled = true; tray.onclick = null; pool.onclick = null;
      tray.style.borderColor = right ? 'var(--good)' : 'var(--bad)';
      finish(right, q.a);
    };
    st.key = e => { if (e.key === 'Enter') { if ($('#nx')) $('#nx').click(); else if (!chk.disabled) chk.click(); } };
  }
  document.onkeydown = e => { if (e.key === 'Escape') { closeModal(); return; } if (st.key && $('#modal')) st.key(e); };
}
const pick = a => a[(Math.random() * a.length) | 0];

/* ---------- результат ---------- */
function showResult(st) {
  document.onkeydown = null;
  const { lv, n, ok, qs } = st, id = lv.id, N = lv.videos.length;
  const passed = ok >= PASS_SCORE, stars = ok >= 5 ? 3 : ok === 4 ? 2 : ok >= PASS_SCORE ? 1 : 0;
  let gainXp = 0, newBadges = [], campDone = false, summit = false, first = false;
  if (passed) {
    S.done[id] = S.done[id] || {};
    first = !S.done[id][n];
    gainXp = first ? ok * 10 + 20 : ok * 3;
    S.done[id][n] = Math.max(S.done[id][n] || 0, stars);
    S.xp += gainXp;
    // серия
    const t = todayKey();
    markActive();
    S.days[t] = (S.days[t] || 0) + 1;
    campDone = first && n % LESSONS_PER_CAMP === 0 && n !== N;
    summit = first && n === N;
    newBadges = awardBadges(false);
    save(); renderTop('mountain');
  }
  const goalHit = passed && goalToday() === S.goal;
  const sh = $('#modal .sheet'); sh.className = 'sheet narrow';
  const nextN = n < N ? n + 1 : null;
  sh.innerHTML = `<div class="sh-head"><div><small>${lv.id} · Урок ${n}</small><h2>&nbsp;</h2></div><button class="x" id="cl">${ICON.close}</button></div>
    <div class="res">
      <div class="big">${[1, 2, 3].map(k => `<svg viewBox="0 0 24 24" class="${stars >= k ? 'on' : ''}" style="animation-delay:${k * .18}s"><path d="m12 2.500 2.900 6 6.600.9-4.800 4.600 1.200 6.500L12 17.400 6.100 20.500l1.200-6.500L2.500 9.400l6.600-.9L12 2.500Z" fill="currentColor"/></svg>`).join('')}</div>
      <h2>${summit ? 'Вершина покорена!' : campDone ? 'Лагерь разбит!' : passed ? (stars === 3 ? 'Безупречно!' : 'Шаг сделан!') : 'Ещё немного'}</h2>
      <p>${passed ? `Верных ответов: ${ok} из ${qs.length}.` : `Верно ${ok} из ${qs.length}. Нужно хотя бы ${PASS_SCORE}. Пересмотри урок и попробуй ещё раз.`}</p>
      ${passed ? `<div class="gain"><span class="chip xp">${ICON.bolt}+${gainXp} XP</span>${first ? `<span class="chip">${ICON.mountain} +${fmt(Math.round(lv.height / N))} м</span>` : ''}${goalHit ? `<span class="chip fire">${ICON.flame} Цель дня!</span>` : ''}</div>` : ''}
      ${summit ? `<div class="summit-card">${mountainScene(lv, { w: 600, h: 300, progress: 1, tag: 'r' })}</div><p style="margin-top:12px">Ты на высоте ${fmt(lv.height)} м. ${lv.id === 'C1' ? 'Все шесть гор позади: это продвинутый уровень.' : 'Впереди следующая гора — ' + LEVELS[LEVELS.indexOf(lv) + 1].name + '.'}</p>` : ''}
      <div class="btns">
        ${passed ? (summit ? (lv.id !== 'C1' ? `<button class="btn wide" id="nxl">Следующая гора ${ICON.play}</button>` : '') : `<button class="btn wide" id="nxl">Урок ${nextN} ${ICON.play}</button>`) : `<button class="btn wide" id="again">Попробовать ещё раз</button><button class="btn ghost wide" id="rw">Пересмотреть урок</button>`}
        <button class="btn ghost wide" id="map">На карту горы</button>
      </div></div>`;
  $('#cl').onclick = () => { closeModal(); route(); };
  $('#map').onclick = () => { closeModal(); route(); };
  const again = $('#again'); if (again) again.onclick = () => startQuiz(lv, n, st.attempt + 1);
  const rw = $('#rw'); if (rw) rw.onclick = () => openLesson(id, n);
  const nxl = $('#nxl'); if (nxl) nxl.onclick = () => { if (summit) { location.hash = '#/m/' + LEVELS[LEVELS.indexOf(lv) + 1].id; } else { closeModal(); route(); setTimeout(() => openLesson(id, nextN), 60); } };
  if (passed && (stars === 3 || campDone || summit)) confetti(summit ? 2 : 1);
  newBadges.forEach((b, k) => setTimeout(() => toast('Награда: ' + b.t, ICON.trophy), 700 + k * 900));
}

/* ---------- рюкзак ---------- */
function openPack() {
  const rk = rankOf(S.xp), pct = rk.to ? Math.round((S.xp - rk.from) / (rk.to - rk.from) * 100) : 100;
  const lessons = totalDone(S), stars = LEVELS.reduce((n, l) => n + Object.values(S.done[l.id] || {}).reduce((a, b) => a + b, 0), 0);
  const sh = openModal(`
    <div class="sh-head"><div><small>Твой рюкзак</small><h2>Путь вверх</h2></div><button class="x" id="cl">${ICON.close}</button></div>
    <div class="pk">
      <div class="rank"><div class="ico">${ICON.mountain}</div><div style="flex:1"><small>Звание</small><b>${rk.name}</b><div class="bar"><i style="width:${pct}%;background:#F2B33D"></i></div><small>${fmt(S.xp)} XP${rk.to ? ' · до следующего ' + fmt(rk.to - S.xp) : ' · максимум'}</small></div></div>
      <div class="mini"><div><b>${lessons}</b><small>уроков</small></div><div><b>${stars}</b><small>звёзд</small></div><div><b>${streakNow()}</b><small>серия</small></div><div><b>${S.bestStreak}</b><small>рекорд серии</small></div></div>
      <h4>Награды · ${Object.keys(S.badges).length} из ${BADGES.length}</h4>
      <div class="badges">${BADGES.map(b => `<div class="bdg ${S.badges[b.id] ? 'on' : ''}"><i>${S.badges[b.id] ? ICON.trophy : ICON.lock}</i><b>${b.t}</b><small>${b.d}</small></div>`).join('')}</div>
      <h4>Настройки</h4>
      <div class="set"><div><b>Цель дня</b><small>Уроков в день. «нет» — без цели</small></div><div class="seg" id="goal">${[0, 1, 2, 3, 5].map(g => `<button data-g="${g}" class="${S.goal === g ? 'on' : ''}">${g || 'нет'}</button>`).join('')}</div></div>
      <div class="set"><div><b>Все уроки открыты</b><small>Можно начать с любого урока. Выключи, чтобы проходить строго по порядку</small></div><button class="sw ${S.free ? 'on' : ''}" id="free" aria-label="Свободный режим"></button></div>
      <button class="danger" id="reset">Сбросить весь прогресс</button>
    </div>`);
  $('#cl').onclick = closeModal;
  const refresh = () => { const m = location.hash.match(/^#\/m\/(\w+)/); if (m && lvById(m[1])) renderMountain(lvById(m[1])); else renderHome(); };
  $('#goal').onclick = e => { const b = e.target.closest('button'); if (!b) return; S.goal = +b.dataset.g; save(); refresh(); openPack(); };
  $('#free').onclick = () => { S.free = !S.free; save(); refresh(); openPack(); };
  $('#reset').onclick = () => { if (confirm('Удалить весь прогресс, XP и награды? Это нельзя отменить.')) { S = defaults(); save(); closeModal(); location.hash = '#/'; renderHome(); } };
}

/* ---------- старт ---------- */
route();
