// ═══════════════════════════════════════════════════════════
// EDITOR JS LOGIC (Extracted from Canvas v3 snippet)
// ═══════════════════════════════════════════════════════════

let notes = {}, activeNote = null;
let currentMode = 'write';
let modalCallback = null, toastTimer, saveTimer;
let slashFiltered = [], slashFocus = 0, slashOpen = false;

// ─── STORAGE ───────────────────────────────────────────
function saveNotes() {
  try { localStorage.setItem('cv3_notes', JSON.stringify(notes)); } catch (e) { console.warn('storage full', e); }
}
function loadNotes() {
  try { const n = localStorage.getItem('cv3_notes'); if (n) notes = JSON.parse(n); } catch (e) { }
}

// ─── INIT ──────────────────────────────────────────────
function initEditor() {
  loadNotes();
  if (!Object.keys(notes).length) seedDefaults();
  renderNoteList(); 
  const ids = Object.keys(notes);
  if (ids.length) openNote(ids[0]);

  const ed = document.getElementById('editor');
  if (ed) {
    ed.addEventListener('input', onEditorInput);
    ed.addEventListener('mouseup', showFmtBar);
    ed.addEventListener('keyup', showFmtBar);
    ed.addEventListener('keydown', editorKey);
  }
  
  document.addEventListener('mousedown', e => {
    const fb = document.getElementById('fmt-bar');
    const sm = document.getElementById('slash-menu');
    if (fb && !fb.contains(e.target)) hideFmtBar();
    if (sm && !sm.contains(e.target)) closeSlash();
  });
  
  document.getElementById('slash-search')?.addEventListener('keydown', slashKeys);
  document.addEventListener('keydown', globalKeys);
  
  slashFiltered = [...SLASH_BLOCKS];
  buildSlashList(slashFiltered);
}

// ─── SPATIAL CANVAS INTEGRATION ────────────────────────
window.addEventListener('canvasNodeClicked', (e) => {
    const { node } = e.detail;
    
    // Show the editor panel side-by-side
    const editorPanel = document.getElementById('editor-side-panel');
    if (editorPanel) {
        editorPanel.style.display = 'flex';
    }

    // Check if node exists as a note, if not, create it using node.id
    if (!notes[node.id]) {
        notes[node.id] = { 
            id: node.id, 
            title: node.name || 'Untitled Node', 
            content: '', 
            tags: [], 
            created: new Date().toISOString(), 
            modified: new Date().toISOString(), 
            _wc: 0 
        };
        saveNotes();
    }
    
    openNote(node.id);
});

function seedDefaults() {
  createNote('Getting Started', `<h1>Welcome to Notes</h1>
<p>This is a <strong>block-based</strong> rich text editor.</p>
<p>Type <code class="inline-code">/</code> anywhere to insert a block. Try the <strong>Kanban board</strong> and <strong>Code block</strong>.</p>`, ['guide']);
}

// ─── NOTE CRUD ─────────────────────────────────────────
function createNote(title = 'Untitled', content = '', tags = []) {
  const id = 'n_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5);
  notes[id] = { id, title, content, tags, created: new Date().toISOString(), modified: new Date().toISOString(), _wc: 0 };
  saveNotes(); return id;
}

function newNote() {
  const id = createNote();
  renderNoteList(); openNote(id);
  setTimeout(() => document.getElementById('note-title').select(), 60);
  editorToast('New note ✦', 'accent');
}

function deleteNote(id, e) {
  e?.stopPropagation();
  if (Object.keys(notes).length <= 1) { editorToast('Cannot delete last note'); return; }
  if (!confirm(`Delete "${notes[id]?.title || 'note'}"?`)) return;
  delete notes[id]; saveNotes();
  if (activeNote === id) {
    activeNote = null;
    const rem = Object.keys(notes);
    if (rem.length) openNote(rem[0]);
    else document.getElementById('editor').innerHTML = '';
  }
  renderNoteList();
}

// ─── OPEN NOTE ─────────────────────────────────────────
function openNote(id) {
  if (!notes[id]) return;
  activeNote = id;
  const n = notes[id];
  
  const titleEl = document.getElementById('note-title');
  if (titleEl) titleEl.value = n.title;
  
  const ed = document.getElementById('editor');
  if (ed) ed.innerHTML = n.content || '';
  
  const metaDate = document.getElementById('meta-date');
  if (metaDate) metaDate.textContent = new Date(n.modified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  updateWordCount();
  document.querySelectorAll('.sb-note').forEach(el => el.classList.toggle('active', el.dataset.id === id));
  
  setTimeout(() => {
    initAllCodeBlocks();
    reattachAllKanbanEvents();
  }, 50);
}

// ─── INPUT HANDLING ────────────────────────────────────
function onTitleChange() {
  if (!activeNote) return;
  const newTitle = document.getElementById('note-title').value;
  notes[activeNote].title = newTitle;
  notes[activeNote].modified = new Date().toISOString();
  
  // Sync back to spatial canvas
  const event = new CustomEvent('editorNodeUpdated', { detail: { nodeId: activeNote, newName: newTitle } });
  window.dispatchEvent(event);

  debounceSave(); renderNoteList();
}
function onEditorInput() {
  if (!activeNote) return;
  notes[activeNote].content = document.getElementById('editor').innerHTML;
  notes[activeNote].modified = new Date().toISOString();
  updateWordCount(); debounceSave();
}
function debounceSave() { clearTimeout(saveTimer); saveTimer = setTimeout(() => { saveNotes(); }, 700); }

// ─── WORD COUNT ────────────────────────────────────────
function updateWordCount() {
  const el = document.getElementById('editor');
  if (!el) return;
  const txt = el.innerText || '';
  const w = txt.trim() ? txt.trim().split(/\\s+/).length : 0;
  
  const wcEl = document.getElementById('meta-wc');
  if (wcEl) wcEl.textContent = `${w} word${w !== 1 ? 's' : ''}`;
  if (activeNote) notes[activeNote]._wc = w;
}

// ─── RENDER LIST ───────────────────────────────────────
function renderNoteList(filter = '') {
  const sorted = Object.values(notes)
    .filter(n => !filter || n.title.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => new Date(b.modified) - new Date(a.modified));

  const list = document.getElementById('note-list');
  if (!list) return;
  list.innerHTML = sorted.map(n => {
    const d = new Date(n.modified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `<div class="sb-note${activeNote === n.id ? ' active' : ''}" data-id="${n.id}" onclick="openNote('${n.id}')">
  <span class="sb-note-icon">✦</span>
  <div class="sb-note-body">
    <div class="sb-note-title">${esc(n.title || 'Untitled')}</div>
    <div class="sb-note-meta">${d} · ${n._wc || 0} words</div>
  </div>
  <button class="sb-note-del" onclick="deleteNote('${n.id}',event)">✕</button>
</div>`;
  }).join('');
}

// ─── SLASH COMMANDS ────────────────────────────────────
const SLASH_BLOCKS = [
  { id: 'h1', icon: 'H₁', label: 'Heading 1', desc: 'Large heading', fn: () => fmtBlock('h1') },
  { id: 'h2', icon: 'H₂', label: 'Heading 2', desc: 'Medium heading', fn: () => fmtBlock('h2') },
  { id: 'h3', icon: 'H₃', label: 'Heading 3', desc: 'Small heading', fn: () => fmtBlock('h3') },
  { id: 'bullet', icon: '•', label: 'Bullet List', desc: 'Unordered list', fn: () => fmt('insertUnorderedList') },
  { id: 'numbered', icon: '1.', label: 'Numbered List', desc: 'Ordered list', fn: () => fmt('insertOrderedList') },
  { id: 'quote', icon: '❝', label: 'Blockquote', desc: 'Indented quote', fn: () => fmtBlock('blockquote') },
  { id: 'code', icon: '<>', label: 'Code Block', desc: 'Highlighted + runnable', fn: insertCodeBlock },
  { id: 'kanban', icon: '▦', label: 'Kanban Board', desc: 'Drag-drop task board', fn: insertKanban },
  { id: 'hr', icon: '─', label: 'Divider', desc: 'Horizontal rule', fn: () => { document.execCommand('insertHTML', false, '<hr>'); edFocus(); } },
];

function edFocus() { document.getElementById('editor').focus(); }
function fmt(cmd) { document.execCommand(cmd, false, null); edFocus(); }
function fmtBlock(tag) { document.execCommand('formatBlock', false, tag); edFocus(); }

function buildSlashList(list) {
  const container = document.getElementById('slash-list');
  if (!container) return;
  container.innerHTML = list.map((b, i) => `
<div class="slash-item${i === slashFocus ? ' focus' : ''}" onclick="execSlash('${b.id}')">
  <span class="slash-icon">${b.icon}</span>
  <div><div class="slash-label">${b.label}</div><div class="slash-desc">${b.desc}</div></div>
</div>`).join('');
}

function filterSlash(q) {
  slashFiltered = SLASH_BLOCKS.filter(b => b.label.toLowerCase().includes(q.toLowerCase()));
  slashFocus = 0; buildSlashList(slashFiltered);
}

function openSlash() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  const m = document.getElementById('slash-menu');
  m.style.left = Math.max(8, rect.left) + 'px';
  m.style.top = (rect.bottom + 5) + 'px';
  m.classList.add('open'); slashOpen = true;
  document.getElementById('slash-search').value = '';
  slashFiltered = [...SLASH_BLOCKS]; slashFocus = 0; buildSlashList(slashFiltered);
  setTimeout(() => document.getElementById('slash-search').focus(), 10);
  document.execCommand('delete', false, null);
}

function closeSlash() { 
  const m = document.getElementById('slash-menu');
  if(m) { m.classList.remove('open'); slashOpen = false; }
}

function slashKeys(e) {
  if (e.key === 'ArrowDown') { slashFocus = (slashFocus + 1) % Math.max(1, slashFiltered.length); buildSlashList(slashFiltered); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { slashFocus = (slashFocus - 1 + Math.max(1, slashFiltered.length)) % Math.max(1, slashFiltered.length); buildSlashList(slashFiltered); e.preventDefault(); }
  else if (e.key === 'Enter') { if (slashFiltered[slashFocus]) execSlash(slashFiltered[slashFocus].id); e.preventDefault(); }
  else if (e.key === 'Escape') closeSlash();
}

function execSlash(id) {
  closeSlash(); edFocus();
  const b = SLASH_BLOCKS.find(x => x.id === id);
  if (b) b.fn();
}

function editorKey(e) {
  if (e.key === '/' && !slashOpen) { setTimeout(openSlash, 30); return; }
  if (e.key === 'Escape') closeSlash();
}

function showFmtBar() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.toString().trim()) { hideFmtBar(); return; }
  const tb = document.getElementById('fmt-bar');
  if(!tb) return;
  const rect = sel.getRangeAt(0).getBoundingClientRect();
  const tw = 400;
  let left = rect.left + rect.width / 2 - tw / 2;
  let top = rect.top - 46 + window.scrollY;
  left = Math.max(8, Math.min(innerWidth - tw - 8, left));
  if (top < 8) top = rect.bottom + 8;
  tb.style.left = left + 'px'; tb.style.top = top + 'px'; tb.style.width = tw + 'px';
  tb.classList.add('visible');
}
function hideFmtBar() { 
  const tb = document.getElementById('fmt-bar');
  if(tb) tb.classList.remove('visible'); 
}

// ─── CODE BLOCK ────────────────────────────────────────
const SUPPORTED_LANGS = ['javascript', 'python', 'html', 'css', 'json', 'bash'];

function insertCodeBlock() {
  const cbId = 'cb_' + Date.now();
  const html = `<div class="code-block-wrap" data-cbid="${cbId}" contenteditable="false">
<div class="code-block-header">
<select class="code-lang-select" onchange="onLangChange(this,'${cbId}')">
  ${SUPPORTED_LANGS.map(l => `<option value="${l}"${l === 'javascript' ? ' selected' : ''}>${l}</option>`).join('')}
</select>
<span class="code-spacer"></span>
<button class="code-run-btn" onclick="runCode('${cbId}')">▶ Run</button>
</div>
<textarea class="code-editor-area" id="codearea_${cbId}" placeholder="// Write code here..." oninput="onEditorInput()"></textarea>
<div class="code-output" id="codeout_${cbId}">
<pre id="codepre_${cbId}"></pre>
</div>
</div><p><br></p>`;

  edFocus();
  document.execCommand('insertHTML', false, html);
}

function onLangChange(sel, cbId) {
  const lang = sel.value;
  const runBtn = sel.closest('.code-block-wrap')?.querySelector('.code-run-btn');
  if (runBtn) runBtn.style.display = lang === 'javascript' ? 'flex' : 'none';
}

function initAllCodeBlocks() {
  document.querySelectorAll('.code-block-wrap').forEach(wrap => {
    const cbId = wrap.dataset.cbid;
    if (cbId) {
      const sel = wrap.querySelector('.code-lang-select');
      if (sel) onLangChange(sel, cbId);
    }
  });
}

function runCode(cbId) {
  const ta = document.getElementById('codearea_' + cbId);
  const outEl = document.getElementById('codeout_' + cbId);
  const preEl = document.getElementById('codepre_' + cbId);
  if (!ta || !outEl || !preEl) return;

  const code = ta.value.trim();
  if (!code) return;

  outEl.className = 'code-output show';
  preEl.textContent = '';

  const logs = [];
  const origConsole = { log: console.log, error: console.error };
  const capture = (...args) => {
    logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
  };
  console.log = capture; console.error = capture;

  try {
    const result = new Function(code)();
    console.log = origConsole.log; console.error = origConsole.error;
    let output = logs.join('\n');
    if (result !== undefined) output += (output ? '\n' : '') + '→ ' + String(result);
    preEl.textContent = output || '(no output)';
  } catch (err) {
    console.log = origConsole.log; console.error = origConsole.error;
    preEl.textContent = '⚠ ' + err.message;
    outEl.className = 'code-output show error';
  }
}

// ─── KANBAN BOARD ──────────────────────────────────────
const COL_COLORS = ['#2563eb', '#ca8a04', '#16a34a', '#7c3aed', '#dc2626'];

function insertKanban() {
  const kbId = 'kb_' + Date.now();
  const html = `<div class="kanban-wrap" data-kbid="${kbId}" contenteditable="false">
<div class="kanban-header">
<input class="kanban-board-title" value="My Board">
<button class="kanban-add-col-btn" onclick="addKanbanCol('${kbId}')">＋ Column</button>
</div>
<div class="kanban-cols" id="kboard_${kbId}"></div>
</div><p><br></p>`;
  edFocus();
  document.execCommand('insertHTML', false, html);
  setTimeout(() => { addKanbanCol(kbId); addKanbanCol(kbId); reattachAllKanbanEvents(); }, 100);
}

function addKanbanCol(kbId) {
  const colId = 'col_' + Date.now();
  const color = COL_COLORS[document.querySelectorAll(`[data-kbid="${kbId}"] .kanban-col`).length % COL_COLORS.length];
  const html = `<div class="kanban-col" id="kcol_${colId}" data-colid="${colId}">
<div class="kanban-col-header">
<div class="kanban-col-dot" style="background:${color}"></div>
<input class="kanban-col-name" value="New Column">
<button class="kanban-col-del" onclick="this.closest('.kanban-col').remove();onEditorInput()">✕</button>
</div>
<div class="kanban-cards" id="kcards_${colId}"></div>
<button class="kanban-add-card" onclick="addKanbanCard('${kbId}', '${colId}')">＋ Add card</button>
</div>`;
  document.getElementById('kboard_' + kbId)?.insertAdjacentHTML('beforeend', html);
  onEditorInput();
}

function addKanbanCard(kbId, colId) {
  const cardId = 'card_' + Date.now();
  const html = `<div class="kanban-card" id="kcard_${cardId}" draggable="true">
<div class="kanban-card-title" contenteditable="true" onblur="onEditorInput()">New Card</div>
<button class="kca-btn del" style="font-size:10px; margin-top:5px; border:none; background:transparent; color:red; cursor:pointer;" onclick="this.closest('.kanban-card').remove();onEditorInput()">Delete</button>
</div>`;
  document.getElementById('kcards_' + colId)?.insertAdjacentHTML('beforeend', html);
  reattachAllKanbanEvents();
  onEditorInput();
}

let dragCardEl = null;
function reattachAllKanbanEvents() {
  document.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('dragstart', (e) => { dragCardEl = card; setTimeout(() => card.style.opacity = '0.5', 0); });
    card.addEventListener('dragend', (e) => { card.style.opacity = '1'; dragCardEl = null; onEditorInput(); });
  });
  document.querySelectorAll('.kanban-cards').forEach(col => {
    col.addEventListener('dragover', e => e.preventDefault());
    col.addEventListener('drop', e => {
      e.preventDefault();
      if(dragCardEl) col.appendChild(dragCardEl);
    });
  });
}

// ─── GRAPH OVERLAY ─────────────────────────────────────
let gNodes = [], gEdges = [], gAnim = null;
function showGraph() {
  document.getElementById('graph-overlay').classList.add('open');
  buildGraph(); animateGraph();
}
function closeGraph() {
  document.getElementById('graph-overlay').classList.remove('open');
  if (gAnim) { cancelAnimationFrame(gAnim); gAnim = null; }
}
function buildGraph() {
  gNodes = []; gEdges = [];
  const cvs = document.getElementById('graph-canvas');
  cvs.width = cvs.offsetWidth || innerWidth; cvs.height = cvs.offsetHeight || (innerHeight - 60);
  const W = cvs.width, H = cvs.height;
  Object.values(notes).forEach((n, i, arr) => {
    const a = (i / arr.length) * Math.PI * 2, r = Math.min(W, H) * 0.32;
    gNodes.push({ id: n.id, label: (n.title || '').slice(0, 20), x: W / 2 + r * Math.cos(a), y: H / 2 + r * Math.sin(a), vx: 0, vy: 0, active: n.id === activeNote });
  });
  // Simple random links for demo if no real links exist
  if(gNodes.length > 1) {
    for(let i=0; i<gNodes.length; i++) {
        if(Math.random() > 0.5) gEdges.push({from: gNodes[i].id, to: gNodes[(i+1)%gNodes.length].id});
    }
  }
}
function animateGraph() {
  const cvs = document.getElementById('graph-canvas');
  if (!cvs || !document.getElementById('graph-overlay').classList.contains('open')) return;
  const ctx = cvs.getContext('2d'), W = cvs.width, H = cvs.height;
  gNodes.forEach(n => {
    gNodes.forEach(m => { if (m.id === n.id) return; const dx = n.x - m.x, dy = n.y - m.y, d = Math.sqrt(dx * dx + dy * dy) || 1, f = 2000 / (d * d); n.vx += dx / d * f; n.vy += dy / d * f; });
    n.vx += (W / 2 - n.x) * .002; n.vy += (H / 2 - n.y) * .002; n.vx *= .85; n.vy *= .85;
    n.x = Math.max(60, Math.min(W - 60, n.x + n.vx)); n.y = Math.max(30, Math.min(H - 30, n.y + n.vy));
  });
  gEdges.forEach(e => {
    const a = gNodes.find(n => n.id === e.from), b = gNodes.find(n => n.id === e.to); if (!a || !b) return;
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, f = (d - 120) * .007;
    a.vx += dx / d * f; a.vy += dy / d * f; b.vx -= dx / d * f; b.vy -= dy / d * f;
  });
  ctx.clearRect(0, 0, W, H);
  gEdges.forEach(e => {
    const a = gNodes.find(n => n.id === e.from), b = gNodes.find(n => n.id === e.to); if (!a || !b) return;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = 'rgba(232,89,60,.4)'; ctx.lineWidth = 1.5; ctx.stroke();
  });
  gNodes.forEach(n => {
    const r = n.active ? 10 : 7;
    ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fillStyle = n.active ? 'rgba(232,89,60,1)' : 'rgba(255,255,255,.2)'; ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(n.label, n.x, n.y - r - 6);
  });
  gAnim = requestAnimationFrame(animateGraph);
}

// ─── HELPERS ───────────────────────────────────────────
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function editorToast(msg) {
  console.log("TOAST:", msg);
}
function globalKeys(e) {
  if (e.key === 'Escape') { closeSlash(); closeGraph(); }
}
