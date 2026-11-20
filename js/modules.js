/* Дополнительные модули: Кино, Книги, Страны */
Object.assign(ICON, {
  film: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" stroke="var(--ic,#fff)" stroke-width="1.600" opacity=".75"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M12 6.500C10 5 7 4.500 3.500 5v13c3.500-.500 6.500 0 8.500 1.500C14 18 17 17.500 20.500 18V5C17 4.500 14 5 12 6.500Z" fill="currentColor"/><path d="M12 6.500v13" stroke="var(--ic,#fff)" stroke-width="1.600" opacity=".7"/></svg>',
  globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="currentColor"/><path d="M3.500 12h17M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke="var(--ic,#fff)" stroke-width="1.500" fill="none" opacity=".75"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.800" stroke-linecap="round"/></svg>',
});

/* =========================== КИНО =========================== */
// [id видео, фильм, канал, длительность, уровень (ориентир), тип]
const MOVIES = [
  ['RzanQJKnA7k', 'Золушка', 'Basstervic', '34:31', 'A1', 'мультфильм'],
  ['VwfElTk7Vqk', 'Маленький принц', 'Basstervic', '44:27', 'A1', 'мультфильм'],
  ['27DM1AO6y2c', 'Рапунцель', 'EnglishD', '17:47', 'A1', 'мультфильм'],
  ['QHn813owqDM', 'Один дома (адаптированная версия)', 'Basstervic', '46:13', 'A1', 'фильм'],
  ['RqXNPEeUJvw', 'Короткометражный фильм для начинающих', 'Basstervic', '24:21', 'A1', 'фильм'],
  ['RPtMjWcd5H0', 'Мулан', 'Инглекс', '36:56', 'A2', 'мультфильм'],
  ['Nh0YBrjz24k', 'Рататуй', 'ВОТ ЭТО английский', '34:07', 'A2', 'мультфильм'],
  ['MKFJaB6jPRY', 'Кунг-фу панда', 'ВОТ ЭТО английский', '36:21', 'B1', 'мультфильм'],
  ['UhsNWq6Ul_0', 'Мадагаскар', 'ВОТ ЭТО английский', '29:01', 'B1', 'мультфильм'],
  ['0ROkwegcbQo', 'Гравити Фолз', 'ВОТ ЭТО английский', '32:32', 'B1', 'сериал'],
  ['6OmQAmdbemY', 'Один дома', 'ВОТ ЭТО английский', '22:36', 'B1', 'фильм'],
  ['sthVCGJy7Ck', 'Гарри Поттер', 'ВОТ ЭТО английский', '21:37', 'B1', 'фильм'],
  ['ye3-22Y-bOw', 'Сумерки', 'ВОТ ЭТО английский', '37:53', 'B1', 'фильм'],
  ['Jn_aJlRxAkY', 'Дрянные девчонки', 'Инглекс', '21:50', 'B1', 'фильм'],
  ['A-kmgqFVCB8', 'Дьявол носит Prada', 'Инглекс', '32:36', 'B2', 'фильм'],
  ['afIvuwETRWE', 'Офис (The Office)', 'englishbad', '31:02', 'B2', 'сериал'],
  ['gpr1vB4m6YI', 'Игра престолов', 'ВОТ ЭТО английский', '28:09', 'B2', 'сериал'],
  ['77eIEv0kDsQ', 'Во все тяжкие', 'ВОТ ЭТО английский', '21:46', 'B2', 'сериал'],
  ['5cpBeo-tyH4', 'Волк с Уолл-стрит', 'englishbad', '46:08', 'B2', 'фильм'],
  ['phAtN64DChU', 'Джокер', 'englishbad', '41:47', 'B2', 'фильм'],
  ['bb4DZK8IlOQ', 'Криминальное чтиво', 'englishbad', '41:46', 'C1', 'фильм'],
  ['VdaVEDDJvM0', 'Бесславные ублюдки', 'ВОТ ЭТО английский', '58:42', 'C1', 'фильм'],
  ['tKYbljVmXao', 'Американский психопат', 'englishbad', '26:25', 'C1', 'фильм'],
  ['cWsmE58GFN8', 'Старикам тут не место', 'englishbad', '31:26', 'C1', 'фильм'],
];
let movieFilter = 'all';
const MOVIE_LVL = { A1: '#4F9468', A2: '#2C8B80', B1: '#4A6BD0', B2: '#2682B6', C1: '#DB6F4F' };

function renderMovies() {
  setAccent({ pal: { accent: '#C8553D', soft: '#F6E1DA' } }); renderTop('movies'); window.scrollTo(0, 0);
  const seenN = MOVIES.filter(m => S.movies.seen[m[0]]).length;
  const list = MOVIES.filter(m => movieFilter === 'all' || m[4] === movieFilter);
  $('#app').innerHTML = `<div class="fade">
    <section class="hero"><h1>Английский по фильмам</h1>
      <p>Разборы фильмов и мультиков от русскоязычных блогеров: смотришь сцену, слышишь живую речь, разбираешь фразы. Уровень указан как ориентир.</p></section>
    <div class="mmeta"><span class="chip">${ICON.film}<b>${seenN}</b> из ${MOVIES.length} просмотрено</span></div>
    <div class="filters">${['all', 'A1', 'A2', 'B1', 'B2', 'C1'].map(f => `<button class="fl ${movieFilter === f ? 'on' : ''}" data-f="${f}">${f === 'all' ? 'Все' : f}</button>`).join('')}</div>
    <section class="grid">${list.map(m => `
      <article class="mv" data-id="${m[0]}">
        <div class="th"><img loading="lazy" src="https://i.ytimg.com/vi/${m[0]}/mqdefault.jpg" alt="">
          <span class="lv" style="background:${MOVIE_LVL[m[4]]}">${m[4]}</span><span class="du">${m[3]}</span>
          <span class="pl">${ICON.play}</span>${S.movies.seen[m[0]] ? `<span class="ok">${ICON.check}</span>` : ''}</div>
        <div class="bd"><h3>${esc(m[1])}</h3><div class="mood">${esc(m[2])} · ${m[5]}</div></div></article>`).join('')}</section>
    <p class="foot">Все видео размещены на YouTube у их авторов. Сначала посмотри разбор, потом сам фильм или серию в оригинале.</p></div>`;
  document.querySelectorAll('.fl').forEach(b => b.onclick = () => { movieFilter = b.dataset.f; renderMovies(); });
  document.querySelectorAll('.mv').forEach(c => c.onclick = () => openMovie(c.dataset.id));
}
function openMovie(id) {
  const m = MOVIES.find(x => x[0] === id);
  const draw = () => {
    const seen = !!S.movies.seen[id];
    const sh = $('#modal') ? $('#modal .sheet') : openModal('');
    sh.className = 'sheet';
    sh.innerHTML = `<div class="sh-head"><div><small>${esc(m[2])} · ${m[3]} · ${m[4]}</small><h2>${esc(m[1])}</h2></div><button class="x" id="cl">${ICON.close}</button></div>
      <div class="sh-body">
        <div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1" title="${esc(m[1])}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
        <div class="vrow"><a class="btn ghost" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">${ICON.link} Открыть на YouTube</a>
          <span class="hint">Пока смотришь, выписывай новые слова и фразы — они пригодятся ниже.</span>
          <button class="btn ${seen ? 'ghost' : ''}" id="seen">${seen ? 'Просмотрено ✓' : 'Отметить просмотренным'}</button></div>
        <h4 class="nt">Мои слова и фразы</h4>
        <textarea id="notes" class="notes" rows="4" placeholder="Например: take it easy — не переживай">${esc(S.movies.notes[id] || '')}</textarea>
      </div>`;
    $('#cl').onclick = () => { closeModal(); renderMovies(); };
    $('#notes').oninput = e => { S.movies.notes[id] = e.target.value; save(); };
    $('#seen').onclick = () => {
      if (S.movies.seen[id]) { delete S.movies.seen[id]; save(); draw(); return; }
      S.movies.seen[id] = todayKey(); S.xp += 30; markActive(); save(); renderTop('movies');
      toast('+30 XP за просмотр', ICON.bolt); awardBadges(true); draw();
    };
  };
  draw();
}

/* =========================== КНИГИ + ЧИТАЛКА =========================== */
// Тексты лежат в папке books/ (Project Gutenberg, общественное достояние). pages — число «страниц» в читалке.
const LIBRARY = [
  { k: 'peterrabbit', title: 'The Tale of Peter Rabbit', author: 'Beatrix Potter', lvl: 'A2', pages: 4, d: 'Совсем короткая сказка про кролика в огороде. Прочитаешь за вечер.' },
  { k: 'velveteen', title: 'The Velveteen Rabbit', author: 'Margery Williams', lvl: 'A2', pages: 12, d: 'Трогательная история про игрушечного кролика. Простые предложения.' },
  { k: 'pooh', title: 'Winnie-the-Pooh', author: 'A. A. Milne', lvl: 'A2', pages: 74, d: 'Винни-Пух, Пятачок и Кристофер Робин. Много диалогов и юмора.' },
  { k: 'aesop', title: 'Æsop’s Fables', author: 'Aesop', lvl: 'B1', pages: 130, d: 'Короткие басни: можно читать по одной в день.' },
  { k: 'oz', title: 'The Wonderful Wizard of Oz', author: 'L. Frank Baum', lvl: 'B1', pages: 123, d: 'Дороти, Страшила и Железный Дровосек. Ясный язык и динамичный сюжет.' },
  { k: 'alice', title: 'Alice’s Adventures in Wonderland', author: 'Lewis Carroll', lvl: 'B1', pages: 85, d: 'Падение в кроличью нору. Много игры слов, зато история не теряется.' },
  { k: 'peter', title: 'Peter Pan', author: 'J. M. Barrie', lvl: 'B1', pages: 150, d: 'Остров Нетинебудет, пираты и мальчик, который не хочет взрослеть.' },
  { k: 'beauty', title: 'Black Beauty', author: 'Anna Sewell', lvl: 'B1', pages: 166, d: 'История лошади, рассказанная от первого лица.' },
  { k: 'prince', title: 'The Happy Prince and Other Tales', author: 'Oscar Wilde', lvl: 'B1', pages: 51, d: 'Пять сказок Уайльда: красиво и немного грустно.' },
  { k: 'carol', title: 'A Christmas Carol', author: 'Charles Dickens', lvl: 'B2', pages: 90, d: 'Скрудж и три духа Рождества. Старомодный язык, но история держит.' },
  { k: 'call', title: 'The Call of the Wild', author: 'Jack London', lvl: 'B2', pages: 93, d: 'Пёс Бэк на Аляске. Динамично, без лишней воды.' },
  { k: 'time', title: 'The Time Machine', author: 'H. G. Wells', lvl: 'B2', pages: 94, d: 'Классика научной фантастики о путешествии в далёкое будущее.' },
  { k: 'jungle', title: 'The Jungle Book', author: 'Rudyard Kipling', lvl: 'B2', pages: 150, d: 'Маугли и его друзья из джунглей.' },
  { k: 'treasure', title: 'Treasure Island', author: 'R. L. Stevenson', lvl: 'B2', pages: 209, d: 'Пираты, карта и сокровища. Приключения на каждой странице.' },
  { k: 'sherlock', title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', lvl: 'B2', pages: 311, d: '12 отдельных рассказов: можно читать по одному.' },
  { k: 'anne', title: 'Anne of Green Gables', author: 'L. M. Montgomery', lvl: 'B2', pages: 309, d: 'Рыжая выдумщица Энн. Тёплая книга с живыми диалогами.' },
  { k: 'gatsby', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', lvl: 'C1', pages: 160, d: 'Роман о 1920-х. Красивый, плотный язык.' },
  { k: 'frank', title: 'Frankenstein', author: 'Mary Shelley', lvl: 'C1', pages: 218, d: 'Готический роман. Сложная лексика, мощный сюжет.' },
  { k: 'dorian', title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', lvl: 'C1', pages: 234, d: 'Афоризмы на каждой странице.' },
  { k: 'pride', title: 'Pride and Prejudice', author: 'Jane Austen', lvl: 'C1', pages: 390, d: 'Классика с длинными предложениями и тонкой иронией.' },
];
const bookCache = {}, trCache = {};
async function loadBook(key) {
  if (!bookCache[key]) { const r = await fetch('books/' + key + '.json'); if (!r.ok) throw new Error('load'); bookCache[key] = (await r.json()).pages; }
  return bookCache[key];
}
function coverColor(s) { const h = hashStr(s) % 360; return `linear-gradient(135deg,hsl(${h} 38% 46%),hsl(${(h + 40) % 360} 42% 34%))`; }

function renderBooks() {
  setAccent({ pal: { accent: '#B8743A', soft: '#F4E6D6' } }); renderTop('books'); window.scrollTo(0, 0);
  const t = todayKey();
  const active = S.books.filter(b => !b.done), finished = S.books.filter(b => b.done);
  const dots = b => Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (13 - i)); const k = todayKey(d); return `<i class="${(b.log || {})[k] ? 'on' : ''}" title="${k}"></i>`; }).join('');
  const have = k => S.books.some(b => b.lib === k);
  $('#app').innerHTML = `<div class="fade">
    <section class="hero"><h1>Книги на английском</h1>
      <p>Читай прямо здесь: тексты лежат внутри приложения. Нажми на любое слово, чтобы увидеть перевод и сохранить его в словарь. Страницы считаются сами.</p></section>
    <div class="sec-t"><h2>Читаю сейчас</h2><span>${active.length ? active.length + ' ' + plural(active.length, 'книга', 'книги', 'книг') : ''}</span></div>
    ${active.length ? `<section class="shelf">${active.map(b => {
    const pct = Math.min(100, Math.round(b.read / b.total * 100)), today = (b.log || {})[t] || 0, left = Math.max(0, b.total - b.read);
    const days = b.goal ? Math.ceil(left / b.goal) : 0;
    return `<article class="bk" data-id="${b.id}">
        <div class="bt"><div class="cov" style="background:${coverColor(b.title)}"><span>${esc(b.title.replace(/^(The|A) /, '').slice(0, 1))}</span></div>
          <div class="tx"><h3>${esc(b.title)}</h3><div class="mood">${esc(b.author || '')}</div></div>
          <button class="x sm" data-a="del" aria-label="Убрать книгу" title="Убрать с полки">${ICON.close}</button></div>
        ${b.lib ? `<button class="btn wide rdbtn" data-a="read">${b.read ? 'Продолжить чтение' : 'Начать читать'} · стр. ${(b.pos || 0) + 1}</button>` : ''}
        <div class="bar big"><i style="width:${pct}%"></i></div>
        <div class="row2"><b>${b.read}</b> из ${b.total} стр. <span>${pct}%</span>${days ? `<em>≈ ${days} ${plural(days, 'день', 'дня', 'дней')} до конца</em>` : ''}</div>
        <div class="today"><span>Сегодня: <b>${today}</b>${b.goal ? ' / ' + b.goal : ''} стр.</span><div class="dots">${dots(b)}</div></div>
        <details class="man"><summary>${b.lib ? 'Читала на бумаге? Отметить вручную' : 'Отметить страницы'}</summary>
          <div class="add">${[1, 5, 10, 20].map(n => `<button class="pg" data-a="add" data-n="${n}">+${n}</button>`).join('')}
          <input type="number" min="1" placeholder="стр." class="num" aria-label="Сколько страниц"><button class="btn sm" data-a="addn">Отметить</button></div></details>
        <div class="acts"><button data-a="undo">Отменить сегодняшнее</button><button data-a="edit">Изменить цель${b.lib ? '' : ' и страницы'}</button></div>
      </article>`; }).join('')}</section>`
      : `<p class="empty">Пока ничего не читаешь. Выбери книгу из списка ниже.</p>`}
    ${finished.length ? `<div class="sec-t"><h2>Прочитано</h2><span>${finished.length}</span></div><div class="done-list">${finished.map(b => `<span class="chip">${ICON.check}${esc(b.title)}</span>`).join('')}</div>` : ''}
    <div class="sec-t"><h2>Библиотека</h2><span>${LIBRARY.length} книг · свободный доступ</span></div>
    <section class="lib">${LIBRARY.map(l => `<article class="lb">
        <div class="cov" style="background:${coverColor(l.title)}"><span>${l.title.replace(/^(The|A|Æ) /, '').slice(0, 1)}</span></div>
        <div class="tx"><div class="lvp" style="background:${MOVIE_LVL[l.lvl]}">${l.lvl}</div><h3>${l.title}</h3><div class="mood">${l.author} · ${l.pages} стр.</div><p>${l.d}</p>
          <div class="vrow"><button class="btn sm" data-lib="${l.k}">${have(l.k) ? 'Продолжить' : 'Читать'}</button></div></div></article>`).join('')}</section>
    <div class="sec-t"><h2>Мои слова</h2><span>${S.vocab.length}</span></div>
    ${S.vocab.length ? `<div class="vocab">${S.vocab.slice().reverse().map((v, i) => `<span class="vw"><b>${esc(v.w)}</b> ${esc(v.tr)}<button data-vd="${S.vocab.length - 1 - i}" aria-label="Удалить слово">×</button></span>`).join('')}</div>` : `<p class="empty">Нажимай на слова в книге и сохраняй их сюда.</p>`}
    <div class="custom"><h3>Своя книга (бумажная или электронная)</h3><div class="fr"><input id="cn" placeholder="Название"><input id="ca" placeholder="Автор (необязательно)"><input id="cp" type="number" min="1" placeholder="Страниц"><button class="btn sm" id="cadd">${ICON.plus} Добавить</button></div></div>
    <p class="foot">Тексты книг взяты из Project Gutenberg (общественное достояние). Разбиение на страницы своё: одна страница в читалке — это примерно полстраницы бумажной книги. Для A1–A2 лучше брать адаптированные книги, например Oxford Bookworms.</p></div>`;

  document.querySelectorAll('[data-lib]').forEach(b => b.onclick = () => {
    const l = LIBRARY.find(x => x.k === b.dataset.lib);
    let bk = S.books.find(x => x.lib === l.k);
    if (!bk) { bk = { id: 'b' + Date.now(), lib: l.k, title: l.title, author: l.author, total: l.pages, read: 0, pos: 0, goal: 5, log: {}, done: false }; S.books.push(bk); save(); }
    openReader(bk.id);
  });
  document.querySelectorAll('[data-vd]').forEach(b => b.onclick = () => { S.vocab.splice(+b.dataset.vd, 1); save(); renderBooks(); });
  $('#cadd').onclick = () => {
    const title = $('#cn').value.trim(), total = +$('#cp').value;
    if (!title || !(total > 0)) { toast('Нужны название и число страниц'); return; }
    S.books.push({ id: 'b' + Date.now(), lib: null, title, author: $('#ca').value.trim(), total: Math.round(total), read: 0, goal: 5, log: {}, done: false });
    save(); renderBooks();
  };
  document.querySelectorAll('.bk').forEach(card => {
    const b = S.books.find(x => x.id === card.dataset.id);
    card.addEventListener('click', e => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      const act = a.dataset.a;
      if (act === 'read') openReader(b.id);
      else if (act === 'add') logPages(b, +a.dataset.n);
      else if (act === 'addn') { const v = Math.round(+card.querySelector('.num').value); if (v > 0) logPages(b, v); else toast('Введи, сколько страниц'); }
      else if (act === 'undo') { const t0 = todayKey(), n = b.log[t0] || 0; if (n) { b.read = Math.max(0, b.read - n); S.pagesTotal = Math.max(0, (S.pagesTotal || 0) - n); delete b.log[t0]; b.done = false; save(); renderBooks(); } }
      else if (act === 'del') { if (confirm('Убрать «' + b.title + '» с полки? Прогресс по ней пропадёт.')) { S.books = S.books.filter(x => x !== b); save(); renderBooks(); } }
      else if (act === 'edit') {
        const g = prompt('Сколько страниц в день хочешь читать? (0 — без цели)', b.goal); if (g !== null && g.trim() !== '' && +g >= 0) b.goal = Math.round(+g);
        if (!b.lib) { const tt = prompt('Сколько всего страниц в твоём издании?', b.total); if (tt !== null && +tt > 0) b.total = Math.round(+tt); }
        save(); renderBooks();
      }
    });
  });
}
function logPages(b, n, quiet) {
  const t = todayKey();
  n = Math.min(n, b.total - b.read); if (n <= 0) return;
  b.read += n; b.log[t] = (b.log[t] || 0) + n;
  S.xp += n; S.pagesTotal = (S.pagesTotal || 0) + n; markActive();
  if (b.read >= b.total && !b.done) { b.done = true; S.xp += 100; toast('Книга дочитана. +100 XP', ICON.trophy); confetti(2); }
  save(); awardBadges(true);
  if (!quiet) renderBooks(); else renderTop('books');
}

/* ---------- читалка ---------- */
async function openReader(id) {
  const b = S.books.find(x => x.id === id); if (!b || !b.lib) return;
  closeModal();
  const old = $('#reader'); if (old) old.remove();
  const el = document.createElement('div'); el.id = 'reader';
  const R = S.reader;
  const applyR = () => { el.className = 'rd th-' + R.theme + ' ff-' + R.font; el.style.setProperty('--fs', R.size + 'px'); };
  applyR();
  el.innerHTML = `<div class="rd-top"><button class="x" id="rdx" aria-label="Закрыть">${ICON.close}</button><div class="rd-t">${esc(b.title)}</div><button class="aa" id="rdaa" aria-label="Настройки чтения">Aa</button></div>
    <div class="rd-set" id="rdset" hidden>
      <div class="rs"><span>Размер</span><div class="seg"><button data-s="-1">A−</button><button data-s="1">A+</button></div></div>
      <div class="rs"><span>Шрифт</span><div class="seg"><button data-f="serif" class="${R.font === 'serif' ? 'on' : ''}">С засечками</button><button data-f="sans" class="${R.font === 'sans' ? 'on' : ''}">Без</button></div></div>
      <div class="rs"><span>Фон</span><div class="seg"><button data-t="light" class="${R.theme === 'light' ? 'on' : ''}">Светлый</button><button data-t="sepia" class="${R.theme === 'sepia' ? 'on' : ''}">Сепия</button><button data-t="dark" class="${R.theme === 'dark' ? 'on' : ''}">Тёмный</button></div></div>
    </div>
    <div class="rd-body" id="rdb"><div class="rd-page"><p class="rd-load">Загружаю текст…</p></div></div>
    <div class="rd-bot"><button class="nv" id="rdp" aria-label="Назад">${ICON.back}</button>
      <div class="sl"><input type="range" id="rdr" min="1" max="1" value="1" aria-label="Страница"><span id="rdn"></span></div>
      <button class="nv nx" id="rdnx" aria-label="Дальше">${ICON.back}</button></div>
    <div class="wpop" id="wp" hidden></div>`;
  document.body.appendChild(el); document.body.style.overflow = 'hidden';
  const close = () => { el.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', kd); if (/#\/books/.test(location.hash)) renderBooks(); else renderTop('books'); };
  $('#rdx').onclick = close;
  let pages;
  try { pages = await loadBook(b.lib); } catch (e) {
    $('#rdb').innerHTML = '<div class="rd-page"><p class="rd-load">Не удалось загрузить текст книги. Открой сайт через адрес http://localhost, а не как файл.</p></div>'; return;
  }
  b.total = pages.length;
  let p = Math.max(0, Math.min(b.pos || 0, pages.length - 1));
  const body = $('#rdb'), wp = $('#wp'), rng = $('#rdr');
  rng.max = pages.length;
  const hidePop = () => { wp.hidden = true; };
  function show(scrollTop = true) {
    hidePop();
    const html = pages[p].split('\n').map(par => par.startsWith('#')
      ? `<h3 class="rh">${esc(par.slice(1))}</h3>`
      : `<p>${par.split(/([A-Za-z][A-Za-z’'-]*)/).map((s, i) => i % 2 ? `<span class="rw">${s}</span>` : esc(s)).join('')}</p>`).join('');
    body.innerHTML = `<div class="rd-page">${html}${p === pages.length - 1 ? '<p class="rd-end">Конец</p>' : ''}</div>`;
    if (scrollTop) body.scrollTop = 0;
    rng.value = p + 1; $('#rdn').textContent = `${p + 1} / ${pages.length}`;
    $('#rdp').disabled = p === 0; $('#rdnx').disabled = false;
    b.pos = p; save();
  }
  function go(d) {
    if (d > 0) {
      if (p === b.read && p + 1 <= b.total) logPages(b, 1, true); // страница пройдена подряд
      if (p === pages.length - 1) { if (b.read < b.total && p + 1 === b.read + 1) logPages(b, 1, true); toast(b.done ? 'Книга дочитана' : 'Это последняя страница'); return; }
      p++;
    } else if (p > 0) p--;
    show();
  }
  $('#rdp').onclick = () => go(-1); $('#rdnx').onclick = () => go(1);
  rng.oninput = () => { p = +rng.value - 1; show(); };
  const kd = e => { if (e.key === 'ArrowRight' || e.key === ' ' && e.target === document.body) { e.preventDefault(); go(1); } else if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'Escape') { if (!wp.hidden) hidePop(); else close(); } };
  document.addEventListener('keydown', kd);
  let sx = null; body.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  body.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 70) go(dx < 0 ? 1 : -1); });
  // настройки
  $('#rdaa').onclick = () => { const s = $('#rdset'); s.hidden = !s.hidden; };
  $('#rdset').onclick = e => {
    const bt = e.target.closest('button'); if (!bt) return;
    if (bt.dataset.s) R.size = Math.max(15, Math.min(32, R.size + 2 * +bt.dataset.s));
    if (bt.dataset.f) R.font = bt.dataset.f;
    if (bt.dataset.t) R.theme = bt.dataset.t;
    save(); applyR();
    $('#rdset').querySelectorAll('[data-f],[data-t]').forEach(x => x.classList.toggle('on', x.dataset.f === R.font || x.dataset.t === R.theme));
  };
  // перевод слова по нажатию
  body.addEventListener('click', async e => {
    const w = e.target.closest('.rw');
    if (!w) { hidePop(); return; }
    const word = w.textContent.replace(/^[’'-]+|[’'-]+$/g, ''), key = word.toLowerCase();
    const r = w.getBoundingClientRect();
    wp.hidden = false;
    const have = () => S.vocab.findIndex(v => v.w === key);
    const known = have() >= 0 ? S.vocab[have()].tr : trCache[key];
    const draw = tr => {
      wp.innerHTML = `<b>${esc(word)}</b><span class="tr">${tr === null ? 'перевожу…' : esc(tr || 'нет перевода')}</span>
        <div class="pa"><button id="wsv" ${tr === null ? 'disabled' : ''}>${have() >= 0 ? '★ В словаре' : '☆ В словарь'}</button>
        <a href="https://translate.google.com/?sl=en&tl=ru&text=${encodeURIComponent(key)}&op=translate" target="_blank" rel="noopener">Google</a></div>`;
      const wsv = $('#wsv'); if (wsv) wsv.onclick = () => {
        const i = have();
        if (i >= 0) S.vocab.splice(i, 1); else { S.vocab.push({ w: key, tr: tr || '', b: b.title }); toast('Слово сохранено'); awardBadges(true); }
        save(); draw(tr);
      };
    };
    draw(known === undefined ? null : known);
    const wr = wp.getBoundingClientRect(), W = innerWidth, H = innerHeight;
    wp.style.left = Math.max(10, Math.min(r.left, W - wr.width - 10)) + 'px';
    wp.style.top = (r.bottom + wr.height + 16 > H ? Math.max(10, r.top - wr.height - 8) : r.bottom + 8) + 'px';
    if (known === undefined) {
      try {
        const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 7000);
        const res = await fetch('https://api.mymemory.translated.net/get?langpair=en|ru&q=' + encodeURIComponent(key), { signal: ctl.signal });
        clearTimeout(tm);
        const j = await res.json(); let tr = (j.responseData && j.responseData.translatedText || '').trim();
        if (!tr || tr.toLowerCase() === key || /MYMEMORY|INVALID/i.test(tr)) tr = '';
        trCache[key] = tr; if (!wp.hidden) draw(tr);
      } catch (err) { if (!wp.hidden) draw(''); }
    }
  });
  show(false);
  body.scrollTop = 0;
}

/* награды за новые разделы */
BADGES.push(
  { id: 'movies3', t: 'Киноман', d: 'Посмотреть 3 разбора фильмов', test: s => Object.keys(s.movies.seen).length >= 3 },
  { id: 'pages50', t: 'Книжный червь', d: 'Прочитать 50 страниц', test: s => (s.pagesTotal || 0) >= 50 },
  { id: 'book1', t: 'Книга закончена', d: 'Дочитать книгу до конца', test: s => s.books.some(b => b.done) },
  { id: 'vocab20', t: 'Копилка слов', d: 'Сохранить 20 слов из книг', test: s => (s.vocab || []).length >= 20 },
);
