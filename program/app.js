/* ============================================================================
   Twenty-Six Weeks — application
   State lives in one document so the log follows you between phone and laptop;
   localStorage is the fallback when the artifact database is not available.
   ========================================================================= */

const DEFAULT_STATE = () => ({
  start: todayISO(),
  dp: null,          // 'extension' | 'flexion' | 'mixed' — directional preference
  levels: {},        // exercise id -> level 1-5 override
  logs: {},          // day -> { done, rpe, pain, rad, note, flare, at }
  measures: {},      // week -> { measureId: number }
  prefs: { short: false, sound: true },
});

let S = DEFAULT_STATE();
let dbDoc = null, saveTimer = 0, openDay = 0, viewDay = 0;

function todayISO() { const d = new Date(); return d.toISOString().slice(0, 10); }
function isoToDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function dayNumber(iso) {
  const a = isoToDate(S.start), b = iso ? isoToDate(iso) : new Date();
  const diff = Math.floor((new Date(b.getFullYear(), b.getMonth(), b.getDate()) - a) / 86400000);
  return Math.min(182, Math.max(1, diff + 1));
}
function dateForDay(day) {
  const d = isoToDate(S.start); d.setDate(d.getDate() + day - 1); return d;
}
const CODES = { spine: 'SP', hips: 'HP', pilates: 'PL', upper: 'UP', yoga: 'YG', lowerleg: 'LL', tspine: 'TS', restore: 'RS' };
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ===== persistence ====================================================== */

function mergeState(raw) {
  if (!raw || typeof raw !== 'object') return;
  S = Object.assign(DEFAULT_STATE(), raw,
    { prefs: Object.assign({ short: false, sound: true }, raw.prefs || {}) });
  S.logs = raw.logs || {}; S.measures = raw.measures || {}; S.levels = raw.levels || {};
}
function loadLocal() {
  try { const r = localStorage.getItem('twentysix'); if (r) mergeState(JSON.parse(r)); } catch (e) {}
}
function save() {
  try { localStorage.setItem('twentysix', JSON.stringify(S)); } catch (e) {}
  if (!dbDoc) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    dbDoc.set(JSON.parse(JSON.stringify(S))).catch(err => {
      if (err && err.code === 'quota_exceeded') toast('Storage is full — the log could not be saved.');
    });
  }, 600);
}
async function initStore() {
  const use = window.claude && window.claude.use;
  if (!use) return;
  let db = null;
  try { db = await window.claude.use('db'); } catch (e) { db = null; }
  if (!db) return;
  dbDoc = db.doc('state/program');
  try {
    const snap = await dbDoc.get();
    if (snap.exists) { mergeState(snap.data()); renderAll(); }
    else { dbDoc.set(JSON.parse(JSON.stringify(S))).catch(() => {}); }
  } catch (e) {}
  dbDoc.onSnapshot(snap => {
    if (snap.exists && !snap.metadata.hasPendingWrites) { mergeState(snap.data()); renderAll(); }
  }, () => {});
}

/* ===== small helpers ==================================================== */

const $ = (s) => document.querySelector(s);
function h(tag, attrs, kids) {
  const e = document.createElement(tag);
  for (const k in (attrs || {})) {
    if (k === 'class') e.className = attrs[k];
    else if (k === 'text') e.textContent = attrs[k];
    else if (k === 'html') e.innerHTML = attrs[k];
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k]);
  }
  (kids || []).forEach(c => c && e.appendChild(c));
  return e;
}
function toast(msg) {
  const t = h('div', { class: 'toast', text: msg, role: 'status' });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}
function levelOf(id, dflt) { return S.levels[id] || dflt; }

/* ===== header and phase rail ============================================ */

function renderHead() {
  const day = dayNumber();
  const done = Object.values(S.logs).filter(l => l.done).length;
  let streak = 0;
  for (let d = day; d >= 1; d--) { if (S.logs[d] && S.logs[d].done) streak++; else if (d !== day) break; }
  $('#s-day').textContent = day + ' / 182';
  $('#s-streak').textContent = streak + (streak === 1 ? ' day' : ' days');
  $('#s-done').textContent = done + ' sessions';

  const rail = $('#rail'); rail.replaceChildren();
  const curWeek = Math.ceil(day / 7);
  for (let w = 1; w <= 26; w++) {
    const { phase, isDeload } = phaseForWeek(w);
    const wDone = Array.from({ length: 7 }, (_, i) => (w - 1) * 7 + i + 1)
      .filter(d => S.logs[d] && S.logs[d].done).length;
    const cls = ['rail-w'];
    if (isDeload) cls.push('dl');
    if (w === curWeek) cls.push('now');
    if (w > curWeek) cls.push('future');
    const b = h('button', {
      class: cls.join(' '), type: 'button',
      title: 'Week ' + w + ' · ' + phase.name + (isDeload ? ' · deload' : '') + ' · ' + wDone + '/7 done',
      'aria-label': 'Week ' + w + ', ' + phase.name + ', ' + wDone + ' of 7 sessions done',
      onclick: () => { viewDay = (w - 1) * 7 + 1; openDay = viewDay; renderCal(); $('#sec-cal').scrollIntoView({ block: 'start' }); },
    });
    if (wDone) { b.setAttribute('data-fill', '1'); b.style.opacity = (0.35 + 0.65 * (wDone / 7)).toFixed(2); }
    rail.appendChild(b);
  }
  const labs = $('#rail-labels'); labs.replaceChildren();
  PHASES.forEach(p => {
    const sp = h('span', { style: 'grid-column: span ' + p.weeks, title: p.name + ' — ' + p.job });
    sp.appendChild(document.createTextNode(p.n));
    sp.appendChild(h('span', { class: 'long', text: '. ' + p.name }));
    labs.appendChild(sp);
  });
}

/* ===== today ============================================================ */

function renderToday() {
  const day = dayNumber();
  const s = sessionFor(day, { short: S.prefs.short });
  const log = S.logs[day] || {};
  $('#t-code').textContent = CODES[s.cat];
  $('#t-when').textContent = 'Day ' + day + ' · week ' + s.week + ' · phase ' + s.phase.n + ', ' + s.phase.name +
    (s.isDeload ? ' · deload week' : '') + (s.strength ? ' · strength day' : '');
  $('#t-name').textContent = log.done ? s.name + ' — done' : s.name;
  $('#t-intent').textContent = s.intent;
  $('#t-mins').textContent = s.minutes + ' min';
  $('#t-count').textContent = s.items.length + ' exercises';
  $('#t-sets').textContent = s.mainSets + (s.mainSets === 1 ? ' round' : ' rounds') + ' of the main block';
  $('#btn-short').textContent = S.prefs.short ? 'Full version' : 'Short version';
  $('#btn-short').setAttribute('aria-pressed', S.prefs.short ? 'true' : 'false');
  $('#btn-start').textContent = log.done ? 'Run it again' : 'Start session';
  $('#t-job').textContent = 'Phase ' + s.phase.n + ' — ' + s.phase.name + '. ' + s.phase.job;
  const opens = $('#t-opens'); opens.replaceChildren();
  s.phase.opens.forEach(o => opens.appendChild(h('li', {}, [h('span', { class: 'nm', text: o })])));

  const ul = $('#t-plan'); ul.replaceChildren();
  s.items.forEach(it => ul.appendChild(h('li', {}, [
    h('span', { class: 'bl', text: it.block }),
    h('span', { class: 'nm', text: it.ex.n }),
    h('span', { class: 'ds', text: it.dose.label.replace(' each side', ' ×2') }),
  ])));
}

/* ===== calendar ========================================================= */

function stateOf(day, today) {
  const l = S.logs[day];
  if (l && l.flare) return 'flare';
  if (l && l.done) return 'done';
  if (day === today) return 'today';
  if (day < today) return 'missed';
  return 'future';
}

function renderCal() {
  const grid = h('div', { class: 'cal-grid' });
  buildCalendar(grid, dayNumber());
  $('#cal').replaceChildren(grid);
}

/* Phase headings sit inside the grid, so each band owns the weeks below it. */
function buildCalendar(grid, today) {
  grid.appendChild(h('div', { class: 'cal-dow' },
    [h('span', {})].concat(DOW.map(d => h('span', { text: d })))));
  let week = 1;
  PHASES.forEach(p => {
    grid.appendChild(h('div', { class: 'pb-head' }, [
      h('span', { class: 'n', text: 'PHASE ' + p.n }),
      h('span', { class: 't', text: p.name }),
      h('span', { class: 'j', text: p.short + ' · ' + p.mins[0] + '–' + p.mins[1] + ' min' }),
    ]));
    for (let i = 0; i < p.weeks; i++, week++) {
      const { isDeload } = phaseForWeek(week);
      const row = h('div', { class: 'cal-row' });
      row.appendChild(h('div', { class: 'cal-wk' }, [
        h('span', { text: 'w' + week }),
        isDeload ? h('span', { class: 'dlflag', text: '↓', title: 'Deload week — less volume, longer holds' }) : null,
      ]));
      for (let d = 0; d < 7; d++) {
        const day = (week - 1) * 7 + d + 1;
        const cat = categoryFor(day);
        const st = stateOf(day, today);
        row.appendChild(h('button', {
          class: 'cell', type: 'button', 'data-state': st, 'data-day': day,
          'aria-expanded': openDay === day ? 'true' : 'false',
          'aria-label': 'Day ' + day + ', ' + DOW[d] + ', ' + SESSIONS[cat].name + ', ' + st,
          title: DOW[d] + ' · ' + SESSIONS[cat].name,
          onclick: () => { openDay = openDay === day ? 0 : day; renderCal(); },
        }, [
          h('span', { class: 'c', text: CODES[cat] }),
          h('span', { class: 'd', text: day }),
        ]));
      }
      grid.appendChild(row);
      if (openDay && Math.ceil(openDay / 7) === week) {
        grid.appendChild(h('div', { class: 'cal-row' }, [h('div', { class: 'cal-detail' }, [dayDetail(openDay)])]));
      }
    }
  });
}

function dayDetail(day) {
  const s = sessionFor(day, { short: S.prefs.short });
  const log = S.logs[day] || {};
  const dt = dateForDay(day);
  const box = h('div', { class: 'dd' });
  box.appendChild(h('div', { class: 'dd-head' }, [
    h('div', {}, [
      h('span', { class: 'eyebrow', text: 'Day ' + day + ' · ' + dt.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' }) + ' · phase ' + s.phase.n + (s.isDeload ? ' · deload' : '') }),
      h('h3', { text: s.name }),
    ]),
    h('div', { class: 'meta-row', style: 'margin-top:0' }, [
      h('span', { class: 'chip num', text: s.minutes + ' min' }),
      h('span', { class: 'chip num', text: s.mainSets + '× main block' }),
      log.done ? h('span', { class: 'chip', text: 'logged' }) : null,
      h('button', { class: 'btn', text: day === dayNumber() ? 'Start' : 'Run this session', onclick: () => startPlayer(day) }),
    ]),
  ]));
  box.appendChild(h('p', { class: 'prose', style: 'margin-top:var(--s3)', text: s.intent }));

  if (s.videos.length) {
    const vl = h('ul', { class: 'vid-list' });
    s.videos.forEach(v => vl.appendChild(h('li', {}, [
      h('a', { href: 'https://www.youtube.com/watch?v=' + v.id, target: '_blank', rel: 'noopener' }, [
        h('span', { class: 'vt' }, [document.createTextNode(v.t), h('span', { class: 'vb', text: v.by })]),
        h('span', { class: 'vm', text: v.min + ' min ↗' }),
      ]),
      h('button', { class: 'tiny', type: 'button', text: 'Play here',
        onclick: (e) => playHere(e.target, v) }),
    ])));
    box.appendChild(h('div', { style: 'margin-top:var(--s4)' }, [
      h('span', { class: 'eyebrow', text: 'Rather be led than read — follow one of these instead' }), vl,
    ]));
  }

  const grid = h('div', { class: 'ex-grid' });
  s.items.forEach(it => grid.appendChild(exCard(it, s)));
  box.appendChild(grid);
  return box;
}

/* Try a real inline player, and fall back to opening the video in a new tab if
   the page's content policy blocks the frame — which it may, silently. */
function playHere(btn, v) {
  const li = btn.parentNode;
  if (li.querySelector('.embed')) { li.querySelector('.embed').remove(); btn.textContent = 'Play here'; return; }
  const box = h('div', { class: 'embed' });
  const frame = h('iframe', {
    src: 'https://www.youtube-nocookie.com/embed/' + v.id + '?rel=0',
    title: v.t, allow: 'accelerometer; encrypted-media; picture-in-picture',
    allowfullscreen: '', loading: 'lazy', referrerpolicy: 'strict-origin-when-cross-origin',
  });
  let loaded = false;
  frame.addEventListener('load', () => { loaded = true; });
  box.appendChild(frame);
  li.appendChild(box);
  btn.textContent = 'Hide';
  setTimeout(() => {
    if (loaded) return;
    box.replaceChildren(h('p', { class: 'note', style: 'padding:var(--s3)', text: 'This page cannot play video inline, so it will open on YouTube in a new tab instead.' }));
    window.open('https://www.youtube.com/watch?v=' + v.id, '_blank', 'noopener');
  }, 2600);
}

/* ===== exercise card ==================================================== */

function exVideo(ex, cls) {
  /* The exercise's own explanation video, embedded. Lazy so a day with twelve
     exercises does not open twelve players at once, and every embed carries an
     open-on-YouTube link underneath in case the page cannot frame video. */
  const wrap = h('div', { class: cls || 'ex-vid' });
  wrap.appendChild(h('iframe', {
    src: 'https://www.youtube-nocookie.com/embed/' + ex.vid + '?rel=0&modestbranding=1',
    title: ex.vidT || ex.n, loading: 'lazy',
    allow: 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    allowfullscreen: '', referrerpolicy: 'strict-origin-when-cross-origin',
  }));
  wrap.appendChild(h('a', {
    class: 'vid-cap', href: 'https://www.youtube.com/watch?v=' + ex.vid,
    target: '_blank', rel: 'noopener',
    text: (ex.vidT || ex.n) + ' — open on YouTube \u2197',
  }));
  return wrap;
}

function exCard(it, s) {
  const ex = it.ex;
  const lvl = levelOf(it.id, it.level);
  const lvlRow = h('div', { class: 'lvl' }, [
    h('button', { type: 'button', text: '\u2212', 'aria-label': 'Easier level for ' + ex.n, onclick: () => setLevel(it.id, Math.max(1, lvl - 1)) }),
    h('span', { class: 'n', text: 'level ' + lvl + '/5' }),
    h('button', { type: 'button', text: '+', 'aria-label': 'Harder level for ' + ex.n, onclick: () => setLevel(it.id, Math.min(5, lvl + 1)) }),
  ]);

  const body = h('div', { class: 'ex-body' }, [
    h('div', {}, [
      h('span', { class: 'eyebrow', text: it.block === 'open' ? 'Warm-up' : it.block === 'close' ? 'Cool-down' : ex.tgt }),
      h('h4', { text: ex.n }),
    ]),
    h('div', { class: 'ex-dose', text: it.dose.label }),
    h('p', { class: 'ex-cue', text: ex.cue }),
    h('p', { class: 'ex-why', text: ex.why }),
    h('p', { class: 'ex-dose', style: 'color:var(--ink2)', text: 'Level ' + lvl + ': ' + ex.lv[lvl - 1] }),
    ex.care ? h('p', { class: 'ex-care', text: ex.care }) : null,
    h('div', { class: 'ex-foot' }, [lvlRow]),
  ]);
  return h('div', { class: 'ex' }, [exVideo(ex), body]);
}
function setLevel(id, n) { S.levels[id] = n; save(); renderCal(); if (playerState) renderPlayerStep(); }

/* ===== player =========================================================== */

let playerState = null, tick = 0, audioCtx = null;

function beep(freq, ms) {
  if (!S.prefs.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.value = freq; o.type = 'sine';
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.13, audioCtx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + ms / 1000);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + ms / 1000);
  } catch (e) {}
}

function buildSteps(s) {
  const steps = [];
  s.items.forEach(it => {
    const sides = it.dose.sides === 2 ? ['Left side', 'Right side'] : [null];
    const per = it.dose.work / (it.dose.sets * it.dose.sides);
    for (let set = 1; set <= it.dose.sets; set++) {
      sides.forEach((side, si) => {
        steps.push({ it, set, sets: it.dose.sets, side, dur: Math.max(10, Math.round(per)) });
        const last = set === it.dose.sets && si === sides.length - 1;
        if (!last) steps.push({ rest: true, dur: 10, it, label: side ? 'Change sides' : 'Reset and go again' });
      });
    }
  });
  return steps;
}

function startPlayer(day) {
  const s = sessionFor(day, { short: S.prefs.short });
  playerState = { day, s, steps: buildSteps(s), i: 0, left: 0, running: true };
  playerState.left = playerState.steps[0].dur;
  $('#player').hidden = false;
  document.body.style.overflow = 'hidden';
  renderPlayerFrame();
  renderPlayerStep();
  clearInterval(tick);
  tick = setInterval(() => {
    if (!playerState || !playerState.running) return;
    playerState.left--;
    if (playerState.left === 3) beep(660, 90);
    if (playerState.left <= 0) { beep(880, 160); nextStep(); } else updateTimer();
  }, 1000);
}
function closePlayer() {
  clearInterval(tick); playerState = null;
  $('#player').hidden = true; $('#player').replaceChildren();
  document.body.style.overflow = '';
  renderAll();
}
function nextStep(manual) {
  const p = playerState; if (!p) return;
  if (p.i >= p.steps.length - 1) { finishPlayer(); return; }
  p.i++; p.left = p.steps[p.i].dur; renderPlayerStep();
  if (manual) { /* keep running state as-is */ }
}
function prevStep() {
  const p = playerState; if (!p || p.i === 0) return;
  p.i--; p.left = p.steps[p.i].dur; renderPlayerStep();
}

function renderPlayerFrame() {
  const p = playerState;
  const el = $('#player'); el.replaceChildren();
  el.appendChild(h('div', { class: 'pl-top' }, [
    h('button', { class: 'btn', text: 'Close', onclick: closePlayer }),
    h('span', { class: 'pl-title', id: 'pl-title', text: p.s.name }),
    h('button', { class: 'btn', id: 'pl-sound', text: S.prefs.sound ? 'Sound on' : 'Sound off',
      onclick: () => { S.prefs.sound = !S.prefs.sound; save(); $('#pl-sound').textContent = S.prefs.sound ? 'Sound on' : 'Sound off'; } }),
  ]));
  el.appendChild(h('div', { class: 'pl-prog' }, [h('i', { id: 'pl-bar' })]));
  el.appendChild(h('div', { class: 'pl-body' }, [h('div', { class: 'pl-in', id: 'pl-in' })]));
  el.appendChild(h('div', { class: 'pl-controls', id: 'pl-controls' }));
}

function renderPlayerStep() {
  const p = playerState; if (!p) return;
  const st = p.steps[p.i];
  const inn = $('#pl-in'); inn.replaceChildren();

  $('#pl-bar').style.width = ((p.i / p.steps.length) * 100).toFixed(1) + '%';
  $('#pl-title').textContent = p.s.name + ' · ' + (p.i + 1) + '/' + p.steps.length;

  if (st.rest) {
    inn.appendChild(h('span', { class: 'eyebrow', text: 'Next: ' + st.it.ex.n }));
    inn.appendChild(h('h2', { text: st.label }));
    inn.appendChild(h('div', { class: 'timer rest', id: 'pl-timer', text: st.dur }));
  } else {
    const ex = st.it.ex;
    const lvl = levelOf(st.it.id, st.it.level);
    inn.appendChild(exVideo(ex, 'pl-vid'));

    inn.appendChild(h('span', { class: 'eyebrow', text: (st.it.block === 'open' ? 'Warm-up' : st.it.block === 'close' ? 'Cool-down' : ex.tgt) + (st.sets > 1 ? ' · round ' + st.set + ' of ' + st.sets : '') }));
    inn.appendChild(h('h2', { text: ex.n }));
    if (st.side) inn.appendChild(h('div', { class: 'pl-side', text: st.side }));
    inn.appendChild(h('div', { class: 'timer', id: 'pl-timer', text: st.dur }));
    inn.appendChild(h('div', { class: 'ex-dose', text: st.it.dose.label }));
    inn.appendChild(h('p', { class: 'pl-cue', text: ex.cue }));
    inn.appendChild(h('p', { class: 'pl-cue', style: 'font-style:italic;color:var(--ink3)', text: 'Level ' + lvl + ': ' + ex.lv[lvl - 1] }));
    if (ex.care) inn.appendChild(h('p', { class: 'ex-care', style: 'text-align:left', text: ex.care }));
    inn.appendChild(h('div', { class: 'btn-row', style: 'margin-top:0;justify-content:center' }, [
      h('button', { class: 'tiny', type: 'button', text: 'Easier', onclick: () => setLevel(st.it.id, Math.max(1, lvl - 1)) }),
      h('button', { class: 'tiny', type: 'button', text: 'Harder', onclick: () => setLevel(st.it.id, Math.min(5, lvl + 1)) }),
    ]));
    inn.appendChild(h('div', { style: 'height:var(--s5)' }));
  }
  const c = $('#pl-controls'); c.replaceChildren();
  c.appendChild(h('button', { class: 'btn', text: 'Back', onclick: prevStep, disabled: p.i === 0 ? '' : null }));
  c.appendChild(h('button', { class: 'btn', id: 'pl-pause', text: p.running ? 'Pause' : 'Resume',
    onclick: () => { p.running = !p.running; $('#pl-pause').textContent = p.running ? 'Pause' : 'Resume'; } }));
  c.appendChild(h('button', { class: 'btn', text: '+20s', onclick: () => { p.left += 20; updateTimer(); } }));
  c.appendChild(h('button', { class: 'btn btn-primary', text: p.i >= p.steps.length - 1 ? 'Finish' : 'Next', onclick: () => nextStep(true) }));
  updateTimer();
}
function updateTimer() {
  const p = playerState; if (!p) return;
  const t = $('#pl-timer'); if (!t) return;
  const s = Math.max(0, p.left);
  t.textContent = s >= 60 ? Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') : s;
}

function finishPlayer() {
  const p = playerState; clearInterval(tick);
  const inn = $('#pl-in'); inn.replaceChildren();
  $('#pl-bar').style.width = '100%';
  const day = p.day;
  const log = Object.assign({ pain: null, rad: null, rpe: null, note: '' }, S.logs[day] || {});
  const box = h('div', { class: 'pl-done' });
  box.appendChild(h('span', { class: 'eyebrow', text: 'Session ' + day + ' complete' }));
  box.appendChild(h('h2', { text: 'How did that go?' }));
  box.appendChild(h('p', { class: 'prose', style: 'margin:var(--s3) auto 0;text-align:left', text: 'The radiation answer is the most useful of the three — how far down the leg the pain reached today, at its worst.' }));

  const mk = (label, hint, node) => h('label', { class: 'f', style: 'text-align:left;margin-top:var(--s4)' }, [
    h('span', { class: 'lab', text: label }), hint ? h('span', { class: 'hint', text: hint }) : null, node,
  ]);
  const painRow = h('div', { class: 'scale' });
  for (let i = 0; i <= 10; i++) painRow.appendChild(h('button', {
    type: 'button', text: i, 'aria-pressed': log.pain === i ? 'true' : 'false',
    onclick: (e) => { log.pain = i; [...painRow.children].forEach((b, j) => b.setAttribute('aria-pressed', j === i ? 'true' : 'false')); },
  }));
  const radRow = h('div', { class: 'radgroup' });
  RADIATION.forEach(r => radRow.appendChild(h('button', {
    type: 'button', text: r.n, 'aria-pressed': log.rad === r.v ? 'true' : 'false',
    onclick: () => { log.rad = r.v; [...radRow.children].forEach((b, j) => b.setAttribute('aria-pressed', RADIATION[j].v === r.v ? 'true' : 'false')); },
  })));
  const rpeRow = h('div', { class: 'scale' });
  for (let i = 1; i <= 10; i++) rpeRow.appendChild(h('button', {
    type: 'button', text: i, 'aria-pressed': log.rpe === i ? 'true' : 'false',
    onclick: () => { log.rpe = i; [...rpeRow.children].forEach((b, j) => b.setAttribute('aria-pressed', j + 1 === i ? 'true' : 'false')); },
  }));
  const note = h('textarea', { id: 'log-note', placeholder: 'Anything worth remembering — what felt different, what you skipped.' });
  note.value = log.note || '';

  box.appendChild(mk('Pain today, 0–10', 'At its worst during or after the session.', painRow));
  box.appendChild(mk('How far did it travel?', '', radRow));
  box.appendChild(mk('How hard was the session, 1–10', '', rpeRow));
  box.appendChild(mk('Notes', '', note));
  box.appendChild(h('div', { class: 'btn-row', style: 'justify-content:center' }, [
    h('button', {
      class: 'btn btn-primary', text: 'Save and close', onclick: () => {
        S.logs[day] = Object.assign({}, log, { done: true, note: note.value, at: new Date().toISOString(), flare: false });
        save(); closePlayer(); toast('Day ' + day + ' logged.');
      },
    }),
    h('button', { class: 'btn', text: 'Close without logging', onclick: closePlayer }),
  ]));
  inn.appendChild(box);
  $('#pl-controls').replaceChildren();
}

/* ===== measurements ===================================================== */

function currentMeasureWeek() { return Math.ceil(dayNumber() / 7); }

function renderMeasureForm() {
  const wk = currentMeasureWeek();
  const cur = S.measures[wk] || {};
  const prev = lastMeasureBefore(wk);
  const form = $('#measure-form'); form.replaceChildren();
  MEASURES.forEach(m => {
    const inp = h('input', {
      type: 'number', step: '0.5', id: 'm-' + m.id, inputmode: 'decimal',
      placeholder: prev && prev.vals[m.id] !== undefined ? String(prev.vals[m.id]) : String(m.baseline),
    });
    if (cur[m.id] !== undefined) inp.value = cur[m.id];
    form.appendChild(h('label', { class: 'f', for: 'm-' + m.id }, [
      h('span', { class: 'lab', text: m.n + ' (' + m.unit + ')' }),
      inp,
      h('span', { class: 'hint', text: m.hint }),
    ]));
  });
  $('#measure-week').textContent = 'Saving to week ' + wk +
    (prev ? ' · last measured week ' + prev.week : ' · this will be your baseline');
}
function lastMeasureBefore(wk) {
  const weeks = Object.keys(S.measures).map(Number).filter(w => w < wk).sort((a, b) => b - a);
  return weeks.length ? { week: weeks[0], vals: S.measures[weeks[0]] } : null;
}
function saveMeasures() {
  const wk = currentMeasureWeek();
  const vals = {};
  MEASURES.forEach(m => {
    const v = $('#m-' + m.id).value;
    if (v !== '' && !isNaN(parseFloat(v))) vals[m.id] = round1(parseFloat(v));
  });
  if (!Object.keys(vals).length) { toast('Nothing to save — fill in at least one number.'); return; }
  S.measures[wk] = vals; save();
  renderProgress(); renderMeasureForm();
  toast('Week ' + wk + ' measurements saved.');
}

/* ===== charts ===========================================================
   Every chart here is one or two series of the same unit on one scale, with
   the last point directly labelled, a native tooltip per point and a numbers
   table behind a toggle — so identity is never carried by colour alone. */

const SVGNS = 'http://www.w3.org/2000/svg';
function sv(n, at) { const e = document.createElementNS(SVGNS, n); for (const k in at) e.setAttribute(k, at[k]); return e; }

function round1(v) { return Math.round(v * 10) / 10; }
function fmt(v, unit) {
  const n = round1(v);
  if (!unit) return String(n);
  return unit.charAt(0) === '/' ? n + unit : n + ' ' + unit;
}

function lineChart(opts) {
  const W = 300, H = 132, L = 30, R = 34, T = 12, B = 20;
  const svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': opts.title });
  const all = opts.series.flatMap(s => s.points.map(p => p.y));
  if (!all.length) return null;
  const dLo = Math.min.apply(null, all), dHi = Math.max.apply(null, all);
  let lo = dLo, hi = dHi;
  if (lo === hi) { lo -= 1; hi += 1; }
  const pad = (hi - lo) * 0.16; lo -= pad; hi += pad;
  const xMax = Math.max(4, opts.xMax || 26);
  const X = (w) => L + ((w - 1) / (xMax - 1)) * (W - L - R);
  const Y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);

  /* Ticks sit on values the data actually reaches — low, midpoint, high. */
  const dec = (dHi - dLo) < 6 ? 1 : 0;
  const ticks = dHi === dLo ? [dLo] : [dLo, (dLo + dHi) / 2, dHi];
  svg.appendChild(sv('line', { x1: L, y1: T + (H - T - B), x2: W - R, y2: T + (H - T - B), class: 'ax' }));
  ticks.forEach(v => {
    const y = Y(v);
    svg.appendChild(sv('line', { x1: L, y1: y, x2: W - R, y2: y, class: 'grid-l' }));
    svg.appendChild(sv('text', { x: L - 4, y: y + 3, class: 'ax-t', 'text-anchor': 'end' }))
      .textContent = round1(v).toFixed(dec);
  });
  [1, Math.round(xMax / 2), xMax].forEach(w => {
    svg.appendChild(sv('text', { x: X(w), y: H - 6, class: 'ax-t', 'text-anchor': 'middle' })).textContent = 'w' + w;
  });

  opts.series.forEach((s, si) => {
    const pts = s.points.slice().sort((a, b) => a.x - b.x);
    if (pts.length > 1) {
      svg.appendChild(sv('path', {
        class: si === 0 ? 'ln' : 'ln2',
        d: pts.map((p, i) => (i ? 'L' : 'M') + X(p.x).toFixed(1) + ' ' + Y(p.y).toFixed(1)).join(''),
      }));
    }
    pts.forEach(p => {
      const c = sv('circle', { cx: X(p.x).toFixed(1), cy: Y(p.y).toFixed(1), r: 4, class: si === 0 ? 'pt' : 'pt2' });
      c.appendChild(sv('title', {})).textContent = (s.name ? s.name + ' · ' : '') + 'week ' + p.x + ': ' + fmt(p.y, opts.unit);
      svg.appendChild(c);
    });
    const last = pts[pts.length - 1];
    if (last && opts.series.length > 1) {
      svg.appendChild(sv('text', { x: X(last.x) + 7, y: Y(last.y) + 3, class: 'lbl' })).textContent = s.name;
    }
  });
  return svg;
}

function chartCard(opts) {
  const svg = lineChart(opts);
  const card = h('div', { class: 'chart' });
  const first = opts.series[0].points[0], last = opts.series[0].points[opts.series[0].points.length - 1];
  card.appendChild(h('h4', { text: opts.title }));
  if (first && last && opts.series[0].points.length > 1) {
    const d = round1(last.y - first.y);
    const good = opts.better === 'down' ? d < 0 : d > 0;
    card.appendChild(h('div', { class: 'cd' }, [
      h('span', { class: 'big', text: fmt(last.y, opts.unit) }),
      h('span', { class: 'delta ' + (good ? 'up' : 'dn'), text: (d > 0 ? '+' : '') + d.toFixed(1) + ' since week ' + first.x }),
    ]));
  } else {
    card.appendChild(h('div', { class: 'cd' }, [
      h('span', { class: 'big', text: last ? fmt(last.y, opts.unit) : '—' }),
      h('span', { class: 'delta', style: 'color:var(--ink3)', text: 'baseline' }),
    ]));
  }
  if (svg) card.appendChild(svg);
  const rows = opts.series.flatMap(s => s.points.map(p => (opts.series.length > 1 ? s.name + ' ' : '') + 'w' + p.x + ': ' + round1(p.y)));
  card.appendChild(h('details', {}, [
    h('summary', { class: 'eyebrow', style: 'cursor:pointer', text: 'numbers' }),
    h('p', { class: 'ex-dose', style: 'color:var(--ink2);margin-top:4px', text: rows.join('  ·  ') }),
  ]));
  return card;
}

function seriesFor(id) {
  return Object.keys(S.measures).map(Number).sort((a, b) => a - b)
    .filter(w => S.measures[w][id] !== undefined)
    .map(w => ({ x: w, y: S.measures[w][id] }));
}

function renderProgress() {
  const wrap = $('#charts'); wrap.replaceChildren();
  const nWeeks = Object.keys(S.measures).length;
  $('#prog-note').textContent = nWeeks
    ? nWeeks + (nWeeks === 1 ? ' week measured' : ' weeks measured')
    : 'no measurements yet';

  const pairs = [
    { ids: ['toeTouch'], title: 'Toe-touch gap', unit: 'cm', better: 'down' },
    { ids: ['slrLeft', 'slrRight'], names: ['left', 'right'], title: 'Straight-leg raise', unit: '°', better: 'up' },
    { ids: ['ankleL', 'ankleR'], names: ['left', 'right'], title: 'Knee-to-wall', unit: 'cm', better: 'up' },
    { ids: ['shoulder'], title: 'Wall shoulder flexion', unit: 'cm', better: 'down' },
    { ids: ['strap'], title: 'Strap pass-through width', unit: 'cm', better: 'down' },
    { ids: ['squat'], title: 'Deep squat depth', unit: '/5', better: 'up' },
  ];
  let any = false;
  pairs.forEach(p => {
    const series = p.ids.map((id, i) => ({ name: p.names ? p.names[i] : '', points: seriesFor(id) }))
      .filter(s => s.points.length);
    if (!series.length) return;
    any = true;
    wrap.appendChild(chartCard({ title: p.title, unit: p.unit, better: p.better, series }));
  });

  // pain and radiation: same idea, weekly means from the session log
  const byWeek = {};
  Object.keys(S.logs).forEach(d => {
    const l = S.logs[d], w = Math.ceil(Number(d) / 7);
    if (!byWeek[w]) byWeek[w] = { pain: [], rad: [], done: 0 };
    if (typeof l.pain === 'number') byWeek[w].pain.push(l.pain);
    if (typeof l.rad === 'number') byWeek[w].rad.push(l.rad);
    if (l.done) byWeek[w].done++;
  });
  const mean = (a) => a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 10) / 10 : null;
  const painPts = Object.keys(byWeek).map(Number).sort((a, b) => a - b)
    .filter(w => mean(byWeek[w].pain) !== null).map(w => ({ x: w, y: mean(byWeek[w].pain) }));
  const radPts = Object.keys(byWeek).map(Number).sort((a, b) => a - b)
    .filter(w => mean(byWeek[w].rad) !== null).map(w => ({ x: w, y: mean(byWeek[w].rad) }));
  if (painPts.length) { any = true; wrap.appendChild(chartCard({ title: 'Pain, weekly average', unit: '/10', better: 'down', series: [{ name: '', points: painPts }] })); }
  if (radPts.length) { any = true; wrap.appendChild(chartCard({ title: 'How far it travels', unit: '/4', better: 'down', series: [{ name: '', points: radPts }] })); }

  const doneWeeks = Object.keys(byWeek).map(Number).sort((a, b) => a - b);
  if (doneWeeks.length) {
    any = true;
    const card = h('div', { class: 'chart' });
    card.appendChild(h('h4', { text: 'Sessions per week' }));
    const total = Object.values(S.logs).filter(l => l.done).length;
    card.appendChild(h('div', { class: 'cd' }, [
      h('span', { class: 'big', text: total }),
      h('span', { class: 'delta', style: 'color:var(--ink3)', text: 'of ' + dayNumber() + ' days so far' }),
    ]));
    const W = 300, H = 132, L = 30, T = 12, B = 20, R = 10;
    const svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Sessions completed each week' });
    const maxW = Math.max(26, doneWeeks[doneWeeks.length - 1]);
    const bw = Math.max(3, (W - L - R) / maxW - 2);
    [0, 0.5, 1].forEach(f => {
      const y = T + f * (H - T - B);
      svg.appendChild(sv('line', { x1: L, y1: y, x2: W - R, y2: y, class: f === 1 ? 'ax' : 'grid-l' }));
      svg.appendChild(sv('text', { x: L - 4, y: y + 3, class: 'ax-t', 'text-anchor': 'end' })).textContent = Math.round(7 - f * 7);
    });
    doneWeeks.forEach(w => {
      const n = byWeek[w].done; if (!n) return;
      const x = L + ((w - 1) / maxW) * (W - L - R);
      const hgt = (n / 7) * (H - T - B);
      const r = sv('rect', { x: x.toFixed(1), y: (T + (H - T - B) - hgt).toFixed(1), width: bw.toFixed(1), height: hgt.toFixed(1), rx: 2, class: 'bar' });
      r.appendChild(sv('title', {})).textContent = 'week ' + w + ': ' + n + ' of 7';
      svg.appendChild(r);
    });
    [1, 13, 26].forEach(w => svg.appendChild(sv('text', { x: L + ((w - 1) / maxW) * (W - L - R), y: H - 6, class: 'ax-t', 'text-anchor': 'middle' })).textContent = 'w' + w);
    card.appendChild(svg);
    wrap.appendChild(card);
  }

  if (!any) wrap.appendChild(h('p', { class: 'empty', text: 'Nothing charted yet. Measure yourself below — that first set of numbers becomes the baseline everything else is compared against.' }));
  renderVerdict();
}

/* ===== the monthly verdict ==============================================
   Reads your own log rather than the calendar: the programme advances only
   when the numbers say it should. */

function renderVerdict() {
  const box = $('#verdict'); box.replaceChildren();
  const day = dayNumber(), week = Math.ceil(day / 7);
  const { phase, weekInPhase } = phaseForWeek(week);
  const recentWeeks = [week, week - 1, week - 2].filter(w => w >= 1);
  const olderWeeks = [week - 3, week - 4, week - 5].filter(w => w >= 1);
  const grab = (weeks, key) => {
    const vals = [];
    Object.keys(S.logs).forEach(d => {
      const w = Math.ceil(Number(d) / 7);
      if (weeks.indexOf(w) >= 0 && typeof S.logs[d][key] === 'number') vals.push(S.logs[d][key]);
    });
    return vals;
  };
  const avg = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
  const rNow = avg(grab(recentWeeks, 'rad')), rBefore = avg(grab(olderWeeks, 'rad'));
  const pNow = avg(grab(recentWeeks, 'pain')), pBefore = avg(grab(olderWeeks, 'pain'));
  const flares = Object.keys(S.logs).filter(d => recentWeeks.indexOf(Math.ceil(Number(d) / 7)) >= 0 && S.logs[d].flare).length;
  const adherence = Object.keys(S.logs).filter(d => recentWeeks.indexOf(Math.ceil(Number(d) / 7)) >= 0 && S.logs[d].done).length;
  const possible = recentWeeks.length * 7;

  if (pNow === null) {
    box.appendChild(h('div', { class: 'card', style: 'padding:var(--s4);border-left:3px solid var(--line)' }, [
      h('span', { class: 'eyebrow', text: 'Progress check' }),
      h('p', { class: 'prose', style: 'margin-top:4px', text: 'Log a few sessions and this becomes a read on whether to advance, hold, or ease off — based on your pain and radiation trend rather than the calendar.' }),
    ]));
    return;
  }

  let verdict, why, tone = 'var(--accent)';
  const radWorse = rNow !== null && rBefore !== null && rNow > rBefore + 0.4;
  const painWorse = pBefore !== null && pNow > pBefore + 0.8;
  if (radWorse) {
    verdict = 'Ease off, and mention this to a physio';
    why = 'The pain is reaching further down your leg than it was three weeks ago (' + rNow.toFixed(1) + ' versus ' + rBefore.toFixed(1) + ' on the radiation scale). That direction of travel is the one signal worth acting on straight away: drop every exercise a level, swap the hardest day of the week for the restorative session, and get the leg looked at.';
    tone = 'var(--alert)';
  } else if (painWorse || flares >= 2) {
    verdict = 'Hold this phase another week';
    why = 'Pain is up' + (pBefore !== null ? ' (' + pNow.toFixed(1) + ' versus ' + pBefore.toFixed(1) + ')' : '') + (flares ? ' and you logged ' + flares + ' flare ' + (flares === 1 ? 'day' : 'days') : '') + '. Repeat this phase rather than moving on — the levels stay where they are and you keep the volume the same. Nothing is lost by spending an extra week here.';
    tone = 'var(--accent-2)';
  } else if (adherence < possible * 0.5) {
    verdict = 'Consistency first';
    why = 'You have done ' + adherence + ' of the last ' + possible + ' days. The programme works on frequency more than intensity, so use the short version on the days you would otherwise skip — twenty minutes logged beats forty-five missed.';
    tone = 'var(--accent-2)';
  } else {
    verdict = 'On track — keep advancing';
    why = 'Pain is steady or falling' + (rNow !== null ? ' and the radiation is holding at ' + rNow.toFixed(1) + ' on the five-point scale' : '') + ', with ' + adherence + ' of the last ' + possible + ' days done. Phase ' + phase.n + ' continues as written, and week ' + (weekInPhase) + ' of it is where you are.';
  }
  box.appendChild(h('div', { class: 'card', style: 'padding:var(--s4);border-left:3px solid ' + tone + ';margin-bottom:var(--s3)' }, [
    h('span', { class: 'eyebrow', text: 'Progress check · week ' + week }),
    h('h3', { style: 'font-size:17px;margin-top:2px;color:' + tone, text: verdict }),
    h('p', { class: 'prose', style: 'margin-top:var(--s2)', text: why }),
  ]));
}

/* ===== reference content ================================================ */

function renderReference() {
  const ul = $('#flags'); ul.replaceChildren();
  REDFLAGS.forEach(f => ul.appendChild(h('li', { text: f })));

  $('#dp-body').replaceChildren(
    h('p', { class: 'prose', style: 'margin-top:var(--s2)', text: 'Most sciatica has a direction that helps and a direction that makes it worse. Finding yours in week one is the highest-value five minutes in this whole programme, because it decides which exercises you lean on for six months.' }),
    h('p', { class: 'prose', style: 'margin-top:var(--s3)', html: '<strong>Test extension first.</strong> Lie face down for two minutes, then do ten slow prone press-ups. Now check your leg: did the pain move UP toward your spine, stay the same, or travel further DOWN?' }),
    h('p', { class: 'prose', style: 'margin-top:var(--s3)', html: '<strong>Then test flexion.</strong> On another day, lie on your back and hug both knees to your chest, ten slow repetitions. Same question about the leg.' }),
    h('p', { class: 'prose', style: 'margin-top:var(--s3)', text: 'Pain retreating up toward your spine is called centralisation and it is the response you are looking for — even if your back itself aches a little more. Pain travelling further down the leg is the opposite and means that direction is not yours.' }),
    h('div', { class: 'form-grid', style: 'margin-top:var(--s4)' }, [
      h('label', { class: 'f' }, [
        h('span', { class: 'lab', text: 'Which direction helped?' }),
        (() => {
          const g = h('div', { class: 'radgroup' });
          [['extension', 'Extension — press-ups pulled the pain up'], ['flexion', 'Flexion — knees to chest pulled the pain up'], ['mixed', 'Neither was clear']].forEach(([v, label]) => {
            g.appendChild(h('button', {
              type: 'button', text: label, 'aria-pressed': S.dp === v ? 'true' : 'false',
              onclick: () => { S.dp = v; save(); renderReference(); renderToday(); toast(v === 'flexion' ? 'Noted — favour the flexion work and go easy on the press-ups.' : 'Noted.'); },
            }));
          });
          return g;
        })(),
        h('span', { class: 'hint', text: S.dp === 'flexion' ? 'Because flexion is your direction, treat the prone press-ups as optional and lean on child’s pose, the wall roll-down and knees-to-chest instead.' : S.dp === 'extension' ? 'Extension is your direction — the prone press-ups and sphinx are your most valuable exercises, and the wall roll-down is the one to skip if it bites.' : 'Until this is clear, keep both directions gentle and stop at the first sign of pain travelling further down.' }),
      ]),
    ]),
  );

  $('#kit').innerHTML = [
    '<strong>Mat</strong> — everything on the floor.',
    '<strong>Wall</strong> — the honest judge. Wall slides, knee-to-wall, tibialis raises and legs-up-the-wall all use it to stop you cheating.',
    '<strong>Chair</strong> — balance support early on, and the seat for the sciatic nerve sliders.',
    '<strong>Blocks or thick books</strong> — the most important item you own. They raise the floor so you can reach a real stretch without rounding your back, which is the one thing you cannot afford to do.',
    '<strong>Foam roller and ball</strong> — thoracic extension, glute and piriformis release, feet.',
    '<strong>Strap, belt or towel</strong> — supine hamstring work and shoulder pass-throughs. A dressing-gown belt is fine.',
    '<strong>Dumbbells to 25 kg</strong> — from phase 3. Loaded hinges, carries, presses and rows.',
    '<strong>Adjustable bench</strong> — from phase 3. Supported rows, incline press, hip thrusts, step-ups and the hamstring eccentrics.',
  ].map(s => '<p style="margin-bottom:8px">' + s + '</p>').join('');

  $('#basis').innerHTML = [
    '<strong>Directional preference, the McKenzie method.</strong> A 2025 systematic review found low-to-moderate certainty evidence that it beats other conservative care for pain and intermediate-term disability in people who show a directional preference, and trials put it level with motor-control exercise. Week one finds yours rather than assuming it.',
    '<strong>McGill’s Big 3</strong> — the modified curl-up, side plank and bird dog. Spine stiffness and control without loading the spine into flexion, which is why there are no sit-ups anywhere in twenty-six weeks.',
    '<strong>Nerve sliders, not nerve stretches.</strong> An irritated nerve responds badly to being pulled on and well to being moved. That is why the sliders oscillate and are never held.',
    '<strong>ACSM flexibility dosing</strong> — around sixty seconds accumulated per muscle group, in two to four repetitions of fifteen to thirty seconds, with gains flattening past sixty. Daily beats two or three times a week for range, which is why this is a daily programme.',
    '<strong>Progression structure</strong> drawn from how published beginner-to-advanced flexibility programmes actually stage things: positions first, then active range, then strength in that range, then load. Deload weeks exist because six months of daily training without back-off weeks is how people quit in month three.',
  ].map(s => '<p style="margin-bottom:10px">' + s + '</p>').join('');
}

/* ===== flare ============================================================ */

function markFlare() {
  const day = dayNumber();
  const cur = S.logs[day] || {};
  S.logs[day] = Object.assign({}, cur, { flare: true, done: cur.done || false, at: new Date().toISOString() });
  save();
  startPlayer(Math.ceil(day / 7) * 7); // this week's restorative session
  toast('Logged as a flare day. Swapped in the restorative session.');
  renderAll();
}

/* ===== boot ============================================================= */

function renderAll() {
  renderHead(); renderToday(); renderCal(); renderProgress(); renderMeasureForm(); renderReference();
}

function boot() {
  loadLocal();
  if (!S.start) S.start = todayISO();
  openDay = dayNumber();
  renderAll();
  $('#btn-start').addEventListener('click', () => startPlayer(dayNumber()));
  $('#btn-short').addEventListener('click', () => { S.prefs.short = !S.prefs.short; save(); renderAll(); });
  $('#btn-flare').addEventListener('click', markFlare);
  $('#btn-save-measures').addEventListener('click', saveMeasures);
  document.addEventListener('keydown', (e) => {
    if (!playerState) return;
    if (e.key === 'Escape') closePlayer();
    if (e.key === 'ArrowRight') nextStep(true);
    if (e.key === 'ArrowLeft') prevStep();
    if (e.key === ' ') { e.preventDefault(); playerState.running = !playerState.running; const b = $('#pl-pause'); if (b) b.textContent = playerState.running ? 'Pause' : 'Resume'; }
  });
  initStore();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
