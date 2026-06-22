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
  ({ quiz: renderQuiz, flashcards: renderFlashcards, ports: renderPorts, pbq: renderPBQ, mock: renderMock, reference: renderReference })[currentMode]();
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
  const card = el(`<div class="card" style="padding:0;overflow-x:auto"></div>`);
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
   MOCK EXAM MODE  (timed, weighted, exam-like)
   ============================================================ */
const MOCK_LEN = 90;
const MOCK_MINUTES = 90;
const PASS_PCT = 83; // ~750/900, approximate
const DOMAINS = [
  { id: "1", name: "1 · General Security Concepts", weight: 11, cats: ["Cryptography", "PKI & Certificates", "Security Controls", "Physical Security"] },
  { id: "2", name: "2 · Threats, Vulnerabilities & Mitigations", weight: 20, cats: ["Threats & Attacks", "Malware", "Application Attacks", "Threat Actors", "Social Engineering", "Vulnerability Management"] },
  { id: "3", name: "3 · Security Architecture", weight: 16, cats: ["Network Security", "Architecture & Cloud", "Data Protection", "Resilience & Recovery", "Wireless & Mobile", "Ports & Protocols"] },
  { id: "4", name: "4 · Security Operations", weight: 25, cats: ["Security Operations", "IAM", "Hardening & Endpoint", "Digital Forensics"] },
  { id: "5", name: "5 · Security Program Management & Oversight", weight: 18, cats: ["Risk & Governance", "Governance & Third-Party"] },
];
const catDomain = {};
DOMAINS.forEach(d => d.cats.forEach(c => catDomain[c] = d));

let mock = null;

const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const mockRemaining = () => Math.max(0, Math.ceil((mock.startedAt + mock.durationMs - Date.now()) / 1000));

function buildMockExam() {
  const used = new Set(), pick = [];
  DOMAINS.forEach(d => {
    shuffle(QUESTIONS.filter(q => d.cats.includes(q.cat))).slice(0, d.weight).forEach(q => { used.add(q); pick.push(q); });
  });
  if (pick.length < MOCK_LEN) { // top up if any domain was short
    for (const q of shuffle(QUESTIONS.filter(q => !used.has(q)))) { if (pick.length >= MOCK_LEN) break; pick.push(q); }
  }
  return shuffle(pick).slice(0, MOCK_LEN).map(q => ({ q, order: shuffle(q.o.map((_, i) => i)) }));
}

function startMock() {
  const exam = buildMockExam();
  mock = { exam, answers: new Array(exam.length).fill(null), flagged: new Set(), idx: 0, startedAt: Date.now(), durationMs: MOCK_MINUTES * 60000, done: false, finishedAt: null, timer: null };
  mock.timer = setInterval(mockTick, 1000);
  render();
}

function mockTick() {
  if (!mock || mock.done) { if (mock && mock.timer) clearInterval(mock.timer); return; }
  const rem = mockRemaining();
  const t = document.getElementById("mock-timer");
  if (t) { t.textContent = fmtTime(rem); t.classList.toggle("danger", rem <= 300); }
  if (rem <= 0) finishMock();
}

function finishMock() {
  if (!mock || mock.done) return;
  mock.done = true;
  mock.finishedAt = Date.now();
  if (mock.timer) clearInterval(mock.timer);
  saveMockResult();
  if (currentMode === "mock") render();
}

function computeMockScore() {
  const total = mock.exam.length;
  let correct = 0;
  const perDom = {};
  DOMAINS.forEach(d => perDom[d.id] = { c: 0, t: 0 });
  mock.exam.forEach((it, i) => {
    const ok = mock.answers[i] === it.q.a;
    if (ok) correct++;
    const dom = catDomain[it.q.cat];
    if (dom) { perDom[dom.id].t++; if (ok) perDom[dom.id].c++; }
  });
  return { total, correct, perDom, pct: Math.round((correct / total) * 100) };
}

function saveMockResult() {
  const { total, correct, perDom, pct } = computeMockScore();
  const rec = {
    at: Date.now(),
    correct, total, pct,
    pass: pct >= PASS_PCT,
    seconds: Math.round((mock.finishedAt - mock.startedAt) / 1000),
    dom: Object.fromEntries(DOMAINS.map(d => [d.id, { c: perDom[d.id].c, t: perDom[d.id].t }])),
  };
  if (!state.mockHistory) state.mockHistory = [];
  state.mockHistory.push(rec);
  if (state.mockHistory.length > 50) state.mockHistory = state.mockHistory.slice(-50);
  saveState(state);
  mock.attempt = state.mockHistory.length;
}

function renderMock() {
  if (!mock) return renderMockStart();
  return mock.done ? renderMockResults() : renderMockExam();
}

function renderMockStart() {
  const card = el(`<div class="card"></div>`);
  card.appendChild(el(`<div class="qtext">Mock exam</div>`));
  card.appendChild(el(`<p style="color:var(--muted);margin-top:-8px">A timed, exam-like run: <strong>${MOCK_LEN} questions</strong> in <strong>${MOCK_MINUTES} minutes</strong>, weighted across the five SY0-701 domains. No feedback until you submit — you can flag questions and jump back to them.</p>`));
  const list = el(`<div class="domain-list"></div>`);
  DOMAINS.forEach(d => list.appendChild(el(`<div class="domain-row"><span>${esc(d.name)}</span><span class="pill">${d.weight} Qs</span></div>`)));
  card.appendChild(list);
  card.appendChild(el(`<p style="color:var(--muted);font-size:13px">Pass is approximated at <strong>${PASS_PCT}%</strong> (the real exam scales to 750/900). The timer keeps running if you switch tabs.</p>`));
  const start = el(`<button class="btn btn-primary">Start exam →</button>`);
  start.addEventListener("click", startMock);
  const row = el(`<div class="nav-row"></div>`); row.appendChild(start); card.appendChild(row);
  app.appendChild(card);
  renderMockHistory();
}

function formatDate(ts) {
  const d = new Date(ts);
  const mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
  return `${mo} ${d.getDate()}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function renderMockHistory() {
  const hist = state.mockHistory || [];
  if (!hist.length) return;
  const recent = hist.slice(-12);
  const best = Math.max(...hist.map(h => h.pct));
  const avgLast = Math.round(hist.slice(-5).reduce((s, h) => s + h.pct, 0) / Math.min(5, hist.length));
  const passes = hist.filter(h => h.pass).length;

  const card = el(`<div class="card" style="margin-top:16px"></div>`);
  const header = el(`<div class="toolbar"></div>`);
  header.appendChild(el(`<div class="qtext" style="font-size:16px;margin:0">Score history</div>`));
  header.appendChild(el(`<div class="spacer"></div>`));
  const clear = el(`<button class="btn">Clear</button>`);
  clear.addEventListener("click", () => { if (confirm("Delete all mock-exam history?")) { state.mockHistory = []; saveState(state); render(); } });
  header.appendChild(clear);
  card.appendChild(header);

  card.appendChild(el(`<div class="scorebar">
      <div class="stat"><div class="num">${hist.length}</div><div class="lbl">Attempts</div></div>
      <div class="stat"><div class="num acc">${best}%</div><div class="lbl">Best</div></div>
      <div class="stat"><div class="num">${avgLast}%</div><div class="lbl">Avg (last 5)</div></div>
      <div class="stat"><div class="num good">${passes}</div><div class="lbl">Passes</div></div>
    </div>`));

  const chartWrap = el(`<div class="hist-chart-wrap"></div>`);
  chartWrap.appendChild(el(`<div class="hist-passline" style="bottom:${PASS_PCT}%"><span>${PASS_PCT}%</span></div>`));
  const chart = el(`<div class="hist-chart"></div>`);
  recent.forEach((h, i) => {
    const n = hist.length - recent.length + i + 1;
    chart.appendChild(el(`<div class="hist-bar ${h.pass ? "pass" : "fail"}" style="height:${Math.max(6, h.pct)}%" title="Attempt #${n}: ${h.pct}% — ${formatDate(h.at)}"></div>`));
  });
  chartWrap.appendChild(chart);
  card.appendChild(chartWrap);

  const list = el(`<div class="hist-list"></div>`);
  hist.slice(-8).reverse().forEach((h, idx) => {
    const n = hist.length - idx;
    list.appendChild(el(`<div class="hist-row">
        <span class="hist-when">#${n} · ${formatDate(h.at)}</span>
        <span class="hist-pct">${h.correct}/${h.total} · ${h.pct}%</span>
        <span class="result-badge ${h.pass ? "badge-pass" : "badge-fail"}" style="font-size:10px;padding:2px 8px">${h.pass ? "PASS" : "FAIL"}</span>
      </div>`));
  });
  card.appendChild(list);

  app.appendChild(card);
}

function renderMockExam() {
  const wrap = el(`<div></div>`);
  const answered = mock.answers.filter(a => a !== null).length;

  const bar = el(`<div class="mock-bar"></div>`);
  bar.appendChild(el(`<span class="mock-timer" id="mock-timer">${fmtTime(mockRemaining())}</span>`));
  bar.appendChild(el(`<span id="mock-answered">${answered}/${mock.exam.length} answered</span>`));
  const submit = el(`<button class="btn btn-primary">Submit</button>`);
  submit.addEventListener("click", () => {
    const left = mock.exam.length - mock.answers.filter(a => a !== null).length;
    if (left === 0 || confirm(`${left} question(s) still unanswered. Submit anyway?`)) finishMock();
  });
  bar.appendChild(submit);
  wrap.appendChild(bar);

  const item = mock.exam[mock.idx];
  const q = item.q;
  const card = el(`<div class="card"></div>`);
  card.appendChild(el(`<div class="qmeta"><span class="pill">${esc(q.cat)}</span><span>Question ${mock.idx + 1} of ${mock.exam.length}</span></div>`));
  card.appendChild(el(`<div class="qtext">${md(q.q)}</div>`));

  const opts = el(`<div class="options"></div>`);
  const keys = ["A", "B", "C", "D", "E", "F"];
  item.order.forEach((origIdx, di) => {
    const sel = mock.answers[mock.idx] === origIdx;
    const btn = el(`<button class="opt ${sel ? "selected" : ""}"><span class="key">${keys[di]}</span><span>${md(q.o[origIdx])}</span></button>`);
    btn.addEventListener("click", () => {
      mock.answers[mock.idx] = origIdx;
      opts.querySelectorAll(".opt").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      const a = document.getElementById("mock-answered");
      if (a) a.textContent = `${mock.answers.filter(x => x !== null).length}/${mock.exam.length} answered`;
      document.getElementById("qnav-" + mock.idx)?.classList.add("answered");
    });
    opts.appendChild(btn);
  });
  card.appendChild(opts);

  const nav = el(`<div class="nav-row"></div>`);
  const prev = el(`<button class="btn" ${mock.idx === 0 ? "disabled" : ""}>← Prev</button>`);
  prev.addEventListener("click", () => { mock.idx = Math.max(0, mock.idx - 1); render(); });
  const flagged = mock.flagged.has(mock.idx);
  const flag = el(`<button class="btn ${flagged ? "flag-on" : ""}">${flagged ? "★ Flagged" : "☆ Flag"}</button>`);
  flag.addEventListener("click", () => { mock.flagged.has(mock.idx) ? mock.flagged.delete(mock.idx) : mock.flagged.add(mock.idx); render(); });
  const next = el(`<button class="btn btn-primary" ${mock.idx === mock.exam.length - 1 ? "disabled" : ""}>Next →</button>`);
  next.addEventListener("click", () => { mock.idx = Math.min(mock.exam.length - 1, mock.idx + 1); render(); });
  nav.appendChild(prev); nav.appendChild(flag); nav.appendChild(el(`<div class="spacer"></div>`)); nav.appendChild(next);
  card.appendChild(nav);
  wrap.appendChild(card);

  const navCard = el(`<div class="card" style="margin-top:16px"></div>`);
  navCard.appendChild(el(`<div class="qmeta"><span>Question navigator</span><span style="color:var(--muted)">★ flagged · filled = answered</span></div>`));
  const grid = el(`<div class="qnav"></div>`);
  mock.exam.forEach((it, i) => {
    const cls = [i === mock.idx ? "current" : "", mock.answers[i] !== null ? "answered" : "", mock.flagged.has(i) ? "flagged" : ""].join(" ").trim();
    const cell = el(`<button id="qnav-${i}" class="${cls}">${i + 1}</button>`);
    cell.addEventListener("click", () => { mock.idx = i; render(); });
    grid.appendChild(cell);
  });
  navCard.appendChild(grid);
  wrap.appendChild(navCard);

  app.appendChild(wrap);
}

function renderMockResults() {
  const { total, correct, perDom, pct } = computeMockScore();
  const pass = pct >= PASS_PCT;
  const usedSec = Math.round(((mock.finishedAt || Date.now()) - mock.startedAt) / 1000);
  const hist = state.mockHistory || [];
  const best = hist.length ? Math.max(...hist.map(h => h.pct)) : pct;

  const wrap = el(`<div></div>`);
  const head = el(`<div class="card" style="text-align:center"></div>`);
  head.appendChild(el(`<div class="result-badge ${pass ? "badge-pass" : "badge-fail"}">${pass ? "PASS" : "FAIL"}</div>`));
  head.appendChild(el(`<div style="font-size:40px;font-weight:800;margin:8px 0">${pct}%</div>`));
  head.appendChild(el(`<div style="color:var(--muted)">${correct} / ${total} correct · time used ${fmtTime(usedSec)} · pass ≈ ${PASS_PCT}%</div>`));
  if (mock.attempt) head.appendChild(el(`<div style="color:var(--muted);font-size:13px;margin-top:4px">Attempt #${mock.attempt} · best ${best}%</div>`));
  wrap.appendChild(head);

  const dc = el(`<div class="card" style="margin-top:16px"></div>`);
  dc.appendChild(el(`<div class="qtext" style="font-size:16px">By domain</div>`));
  DOMAINS.forEach(d => {
    const p = perDom[d.id];
    const dp = p.t ? Math.round((p.c / p.t) * 100) : 0;
    const row = el(`<div class="domain-score"></div>`);
    row.appendChild(el(`<div class="ds-label">${esc(d.name)}</div>`));
    row.appendChild(el(`<div class="ds-track"><div class="ds-fill" style="width:${dp}%;background:${dp >= PASS_PCT ? "var(--good)" : "var(--warn)"}"></div></div>`));
    row.appendChild(el(`<div class="ds-num">${p.c}/${p.t}</div>`));
    dc.appendChild(row);
  });
  wrap.appendChild(dc);

  const act = el(`<div class="nav-row" style="margin-top:16px"></div>`);
  const retake = el(`<button class="btn btn-primary">New exam</button>`);
  retake.addEventListener("click", () => { mock = null; startMock(); });
  const home = el(`<button class="btn">Exit to start</button>`);
  home.addEventListener("click", () => { mock = null; render(); });
  let onlyWrong = false;
  const toggle = el(`<button class="btn">Show only incorrect</button>`);
  act.appendChild(retake); act.appendChild(home); act.appendChild(el(`<div class="spacer"></div>`)); act.appendChild(toggle);
  wrap.appendChild(act);

  const review = el(`<div id="mock-review"></div>`);
  const drawReview = () => {
    review.innerHTML = "";
    mock.exam.forEach((it, i) => {
      const q = it.q, chosen = mock.answers[i], ok = chosen === q.a;
      if (onlyWrong && ok) return;
      const card = el(`<div class="card" style="margin-top:12px"></div>`);
      card.appendChild(el(`<div class="qmeta"><span class="pill">${esc(q.cat)}</span><span>Q${i + 1} · ${ok ? "✓" : "✗"}</span></div>`));
      card.appendChild(el(`<div class="qtext" style="font-size:16px">${md(q.q)}</div>`));
      const ol = el(`<div class="options"></div>`);
      q.o.forEach((opt, oi) => {
        const cls = oi === q.a ? "correct" : (oi === chosen ? "wrong" : "");
        ol.appendChild(el(`<div class="opt ${cls}" style="cursor:default"><span>${md(opt)}</span></div>`));
      });
      card.appendChild(ol);
      card.appendChild(el(`<div class="explain ${ok ? "is-correct" : "is-wrong"}"><strong>${chosen === null ? "Not answered" : (ok ? "Correct" : "Answer")}</strong> — ${md(q.e)}</div>`));
      review.appendChild(card);
    });
  };
  toggle.addEventListener("click", () => { onlyWrong = !onlyWrong; toggle.textContent = onlyWrong ? "Show all" : "Show only incorrect"; drawReview(); });
  drawReview();
  wrap.appendChild(review);

  app.appendChild(wrap);
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
