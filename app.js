/* ============================================================
   Security+ study SPA — view logic. Plain JS, no framework.
   ============================================================ */

const app = document.getElementById("app");
const STORE_KEY = "secplus-study-v1";

/* ---------- tiny helpers ---------- */
const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* allow simple `inline code` markdown in question text */
const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");

/* ---------- persistent state ---------- */
function loadState() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch { return {}; }
}
function saveState(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }
let state = loadState();
if (!state.stats) state.stats = { correct: 0, answered: 0 };
if (!state.cats) state.cats = {}; // category -> enabled

const CATEGORIES = [...new Set(QUESTIONS.map(q => q.cat))];
CATEGORIES.forEach(c => { if (state.cats[c] === undefined) state.cats[c] = true; });

/* ---------- mode router ---------- */
let currentMode = "quiz";
document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
    render();
  });
});

document.getElementById("bank-count").textContent =
  `${QUESTIONS.length} questions · ${PORTS.length} ports · ${TERMS.length} terms`;

function render() {
  app.innerHTML = "";
  ({ quiz: renderQuiz, flashcards: renderFlashcards, ports: renderPorts, pbq: renderPBQ, reference: renderReference })[currentMode]();
}

/* ============================================================
   QUIZ MODE
   ============================================================ */
let quizDeck = [];
let quizIdx = 0;
let quizAnswered = false;

function activeQuestions() {
  return QUESTIONS.filter(q => state.cats[q.cat]);
}

function newQuizDeck() {
  quizDeck = shuffle(activeQuestions());
  quizIdx = 0;
  quizAnswered = false;
}

function renderQuiz() {
  if (!quizDeck.length || quizIdx >= quizDeck.length) newQuizDeck();

  const acc = state.stats.answered ? Math.round((state.stats.correct / state.stats.answered) * 100) : 0;

  // score + setup
  const wrap = el(`<div></div>`);
  wrap.appendChild(el(`
    <div class="scorebar">
      <div class="stat"><div class="num good">${state.stats.correct}</div><div class="lbl">Correct</div></div>
      <div class="stat"><div class="num bad">${state.stats.answered - state.stats.correct}</div><div class="lbl">Missed</div></div>
      <div class="stat"><div class="num acc">${acc}%</div><div class="lbl">Accuracy</div></div>
      <div class="stat"><div class="num">${state.stats.answered}</div><div class="lbl">Answered</div></div>
    </div>`));

  // category filter + reset
  const toolbar = el(`<div class="toolbar"></div>`);
  toolbar.appendChild(el(`<label>Categories:</label>`));
  const sel = el(`<select id="catfilter"><option value="__all">All categories (${activeQuestions().length})</option></select>`);
  CATEGORIES.forEach(c => {
    const n = QUESTIONS.filter(q => q.cat === c).length;
    const on = state.cats[c];
    sel.appendChild(el(`<option value="${esc(c)}" ${on ? "" : "data-off=1"}>${on ? "✓" : "✗"} ${esc(c)} (${n})</option>`));
  });
  sel.addEventListener("change", () => {
    const v = sel.value;
    if (v === "__all") { CATEGORIES.forEach(c => state.cats[c] = true); }
    else { state.cats[v] = !state.cats[v]; }
    if (activeQuestions().length === 0) state.cats[v] = true; // never empty
    saveState(state);
    newQuizDeck();
    render();
  });
  toolbar.appendChild(sel);
  toolbar.appendChild(el(`<div class="spacer"></div>`));
  const resetBtn = el(`<button class="btn">Reset score</button>`);
  resetBtn.addEventListener("click", () => { state.stats = { correct: 0, answered: 0 }; saveState(state); render(); });
  toolbar.appendChild(resetBtn);
  wrap.appendChild(toolbar);

  // progress track
  wrap.appendChild(el(`<div class="progress-track"><div class="progress-fill" style="width:${Math.round((quizIdx / quizDeck.length) * 100)}%"></div></div>`));

  // the question card
  const q = quizDeck[quizIdx];
  const card = el(`<div class="card"></div>`);
  card.appendChild(el(`
    <div class="qmeta">
      <span class="pill">${esc(q.cat)}</span>
      <span>Question ${quizIdx + 1} of ${quizDeck.length}</span>
    </div>`));
  card.appendChild(el(`<div class="qtext">${md(q.q)}</div>`));

  const opts = el(`<div class="options"></div>`);
  const order = q._order || (q._order = shuffle(q.o.map((_, i) => i)));
  const keys = ["A", "B", "C", "D", "E", "F"];
  order.forEach((origIdx, displayIdx) => {
    const btn = el(`<button class="opt"><span class="key">${keys[displayIdx]}</span><span>${md(q.o[origIdx])}</span></button>`);
    btn.addEventListener("click", () => answer(btn, origIdx, q, opts, card));
    opts.appendChild(btn);
  });
  card.appendChild(opts);

  wrap.appendChild(card);
  app.appendChild(wrap);
}

function answer(btn, chosen, q, opts, card) {
  if (quizAnswered) return;
  quizAnswered = true;
  const correct = chosen === q.a;

  state.stats.answered++;
  if (correct) state.stats.correct++;
  saveState(state);

  [...opts.children].forEach(b => {
    b.disabled = true;
    const span = b.querySelector("span:last-child").textContent;
    if (span === q.o[q.a]) b.classList.add("correct");
  });
  if (!correct) btn.classList.add("wrong");

  const expl = el(`<div class="explain ${correct ? "is-correct" : "is-wrong"}">
      <strong>${correct ? "✓ Correct" : "✗ Not quite"}</strong> — ${md(q.e)}
    </div>`);
  card.appendChild(expl);

  const nav = el(`<div class="nav-row"></div>`);
  const next = el(`<button class="btn btn-primary">Next question →</button>`);
  next.addEventListener("click", () => {
    quizIdx++;
    quizAnswered = false;
    if (quizIdx >= quizDeck.length) newQuizDeck();
    render();
  });
  nav.appendChild(next);
  card.appendChild(nav);
  next.focus();
}

/* ============================================================
   FLASHCARDS MODE  (terms + ports combined)
   ============================================================ */
let flashDeck = [];
let flashIdx = 0;

function buildFlashDeck() {
  const termCards = TERMS.map(t => ({ front: t.term, hint: t.group, back: t.def }));
  const portCards = PORTS.map(p => ({ front: p.service, hint: "Which port(s)?", back: `<code>${p.port}</code> · ${p.proto}<br><span class="flash-hint">${esc(p.note)}</span>` }));
  flashDeck = shuffle([...termCards, ...portCards]);
  flashIdx = 0;
}

function renderFlashcards() {
  if (!flashDeck.length) buildFlashDeck();
  const c = flashDeck[flashIdx];

  const wrap = el(`<div></div>`);
  const toolbar = el(`<div class="toolbar"></div>`);
  toolbar.appendChild(el(`<span class="pill">${flashIdx + 1} / ${flashDeck.length}</span>`));
  toolbar.appendChild(el(`<label>Tap card to flip</label>`));
  toolbar.appendChild(el(`<div class="spacer"></div>`));
  const shuf = el(`<button class="btn">Shuffle</button>`);
  shuf.addEventListener("click", () => { buildFlashDeck(); render(); });
  toolbar.appendChild(shuf);
  wrap.appendChild(toolbar);

  const flash = el(`
    <div class="flash">
      <div class="flash-inner">
        <div class="flash-face flash-front">
          <div class="flash-term">${esc(c.front)}</div>
          <div class="flash-hint">${esc(c.hint)}</div>
        </div>
        <div class="flash-face flash-back">
          <div class="flash-def">${c.back}</div>
        </div>
      </div>
    </div>`);
  flash.addEventListener("click", () => flash.classList.toggle("flipped"));
  wrap.appendChild(flash);

  const nav = el(`<div class="nav-row"></div>`);
  const prev = el(`<button class="btn">← Prev</button>`);
  prev.addEventListener("click", () => { flashIdx = (flashIdx - 1 + flashDeck.length) % flashDeck.length; render(); });
  const next = el(`<button class="btn btn-primary">Next →</button>`);
  next.addEventListener("click", () => { flashIdx = (flashIdx + 1) % flashDeck.length; render(); });
  nav.appendChild(prev);
  nav.appendChild(next);
  wrap.appendChild(nav);

  app.appendChild(wrap);
}

/* ============================================================
   PORTS DRILL  (searchable reference table)
   ============================================================ */
function renderPorts() {
  const wrap = el(`<div></div>`);
  wrap.appendChild(el(`<input class="search" id="portsearch" placeholder="Search service or port… (e.g. ssh, 443, ldap)" />`));
  const card = el(`<div class="card" style="padding:0;overflow:hidden"></div>`);
  const table = el(`
    <table>
      <thead><tr><th>Port</th><th>Proto</th><th>Service</th><th>Notes</th></tr></thead>
      <tbody id="portbody"></tbody>
    </table>`);
  card.appendChild(table);
  wrap.appendChild(card);
  app.appendChild(wrap);

  const body = table.querySelector("#portbody");
  const draw = (filter) => {
    body.innerHTML = "";
    const f = filter.trim().toLowerCase();
    const rows = PORTS.filter(p => !f || p.service.toLowerCase().includes(f) || p.port.toLowerCase().includes(f) || p.note.toLowerCase().includes(f) || p.proto.toLowerCase().includes(f));
    if (!rows.length) { body.appendChild(el(`<tr><td colspan="4" class="empty">No matches.</td></tr>`)); return; }
    rows.forEach(p => {
      const proto = p.proto.replace("TCP", '<span class="tcp">TCP</span>').replace("UDP", '<span class="udp">UDP</span>');
      body.appendChild(el(`<tr><td class="port">${esc(p.port)}</td><td>${proto}</td><td><strong>${esc(p.service)}</strong></td><td>${esc(p.note)}</td></tr>`));
    });
  };
  draw("");
  const search = wrap.querySelector("#portsearch");
  search.addEventListener("input", () => draw(search.value));
  search.focus();
}

/* ============================================================
   PBQ MODE  (performance-based: match & ordering tasks)
   ============================================================ */
let pbqIdx = 0;

function renderPBQ() {
  const pbq = PBQS[pbqIdx];

  const wrap = el(`<div></div>`);
  const toolbar = el(`<div class="toolbar"></div>`);
  toolbar.appendChild(el(`<label>Task:</label>`));
  const sel = el(`<select></select>`);
  PBQS.forEach((p, i) => sel.appendChild(el(`<option value="${i}" ${i === pbqIdx ? "selected" : ""}>${i + 1}. ${esc(p.title)}</option>`)));
  sel.addEventListener("change", () => { pbqIdx = +sel.value; render(); });
  toolbar.appendChild(sel);
  toolbar.appendChild(el(`<div class="spacer"></div>`));
  toolbar.appendChild(el(`<span class="pill">${pbq.type === "order" ? "Ordering" : "Matching"}</span>`));
  wrap.appendChild(toolbar);

  const card = el(`<div class="card"></div>`);
  card.appendChild(el(`<div class="qtext">${esc(pbq.title)}</div>`));
  card.appendChild(el(`<p style="color:var(--muted);margin:-10px 0 4px">${esc(pbq.prompt)}</p>`));

  const rows = el(`<div class="pbq-rows"></div>`);
  if (pbq.type === "match") {
    const opts = shuffle([...new Set([...pbq.pairs.map(p => p.right), ...(pbq.distractors || [])])]);
    pbq.pairs.forEach((p, i) => {
      const row = el(`<div class="pbq-row"><span class="pbq-left">${esc(p.left)}</span></div>`);
      const s = el(`<select class="pbq-select" data-i="${i}"><option value="">— choose —</option></select>`);
      opts.forEach(o => s.appendChild(el(`<option value="${esc(o)}">${esc(o)}</option>`)));
      row.appendChild(s);
      rows.appendChild(row);
    });
  } else { // order
    shuffle(pbq.items.slice()).forEach(term => {
      const row = el(`<div class="pbq-row"><span class="pbq-left">${esc(term)}</span></div>`);
      const s = el(`<select class="pbq-select pbq-num" data-term="${esc(term)}"><option value="">#</option></select>`);
      pbq.items.forEach((_, n) => s.appendChild(el(`<option value="${n + 1}">${n + 1}</option>`)));
      row.appendChild(s);
      rows.appendChild(row);
    });
  }
  card.appendChild(rows);

  const result = el(`<div class="explain" style="display:none"></div>`);
  const nav = el(`<div class="nav-row"></div>`);
  const check = el(`<button class="btn btn-primary">Check answers</button>`);
  check.addEventListener("click", () => gradePBQ(pbq, rows, result));
  const reset = el(`<button class="btn">Reset</button>`);
  reset.addEventListener("click", () => render());
  nav.appendChild(check);
  nav.appendChild(reset);
  card.appendChild(nav);
  card.appendChild(result);

  wrap.appendChild(card);
  app.appendChild(wrap);
}

function gradePBQ(pbq, rows, result) {
  let correct = 0;
  const total = pbq.type === "match" ? pbq.pairs.length : pbq.items.length;
  rows.querySelectorAll(".pbq-select").forEach(s => {
    const row = s.closest(".pbq-row");
    row.classList.remove("ok", "bad");
    row.querySelector(".pbq-ans")?.remove();
    let want, ok;
    if (pbq.type === "match") { want = pbq.pairs[+s.dataset.i].right; ok = s.value === want; }
    else { want = "#" + (pbq.items.indexOf(s.dataset.term) + 1); ok = +s.value === pbq.items.indexOf(s.dataset.term) + 1; }
    if (ok) { row.classList.add("ok"); correct++; }
    else { row.classList.add("bad"); row.appendChild(el(`<span class="pbq-ans">✓ ${esc(want)}</span>`)); }
  });
  const perfect = correct === total;
  result.style.display = "block";
  result.className = "explain " + (perfect ? "is-correct" : "is-wrong");
  result.innerHTML = `<strong>${correct} / ${total} correct</strong> — ${perfect ? "perfect!" : "green rows are right; red shows the correct answer."}`;
}

/* ============================================================
   REFERENCE  (acronyms grouped)
   ============================================================ */
function renderReference() {
  const wrap = el(`<div></div>`);
  const groups = [...new Set(TERMS.map(t => t.group))];
  groups.forEach(g => {
    const grp = el(`<div class="ref-group"><h3>${esc(g)}</h3><div class="ref-grid"></div></div>`);
    const grid = grp.querySelector(".ref-grid");
    TERMS.filter(t => t.group === g).forEach(t => {
      grid.appendChild(el(`<div class="ref-item"><div class="k">${esc(t.term)}</div><div class="v">${esc(t.def)}</div></div>`));
    });
    wrap.appendChild(grp);
  });
  app.appendChild(wrap);
}

/* ---------- keyboard shortcuts ---------- */
document.addEventListener("keydown", (e) => {
  if (currentMode === "flashcards") {
    if (e.key === "ArrowRight") document.querySelector(".btn-primary")?.click();
    if (e.key === "ArrowLeft") document.querySelector(".nav-row .btn")?.click();
    if (e.key === " ") { e.preventDefault(); document.querySelector(".flash")?.classList.toggle("flipped"); }
  }
  if (currentMode === "quiz" && quizAnswered && e.key === "Enter") {
    document.querySelector(".btn-primary")?.click();
  }
});

/* ---------- go ---------- */
render();
