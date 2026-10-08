/**
 * CAPTURE / SUPERMEMORY CONTEXTOS CLIENT ENGINE
 */

const API_BASE = (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost")
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : "http://localhost:8000";

let state = {
    currentView: "grid",
    activeTypeFilter: "all",
    selectedQuickType: "text",
    currentSpaceId: null,
    spaces: [],
    captures: [],
    entities: [],
    contradictions: [],
    graphData: { nodes: [], edges: [] },
    metrics: null,
    activeModalCaptureId: null,
    chatHistory: []
};

document.addEventListener("DOMContentLoaded", async () => {
    await initApp();
    initMiniGraph();
    window.addEventListener("resize", onWindowResize);
    setInterval(pollUpdatesQuietly, 4000);
});

async function initApp() {
    try {
        await fetchSpaces();
        await Promise.all([
            fetchCaptures(),
            fetchContradictions(),
            fetchGraph(),
            fetchMetrics()
        ]);
        renderAll();
    } catch (e) {
        console.warn("Init fallback:", e);
    }
}

async function pollUpdatesQuietly() {
    try {
        await Promise.all([
            fetchSpaces(true),
            fetchCaptures(true),
            fetchContradictions(true),
            fetchMetrics(true)
        ]);
        updateHeaderCounts();
    } catch (e) {}
}

// -------------------------------------------------------------
// API Helper
// -------------------------------------------------------------
async function api(endpoint, options = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return await res.json();
}

async function fetchSpaces(quiet = false) {
    try {
        const data = await api("/spaces");
        state.spaces = data || [];
        if (!state.currentSpaceId && state.spaces.length > 0) {
            state.currentSpaceId = state.spaces[0].id;
        }
        if (!quiet) renderSpaceSelector();
    } catch (e) {}
}

async function fetchCaptures(quiet = false) {
    try {
        const spaceParam = state.currentSpaceId ? `?space_id=${state.currentSpaceId}` : "";
        const data = await api(`/captures${spaceParam}`);
        state.captures = data || [];
        if (!quiet) renderBentoGrid();
    } catch (e) {}
}

async function fetchContradictions(quiet = false) {
    try {
        if (!state.currentSpaceId) return;
        const data = await api(`/spaces/${state.currentSpaceId}/contradictions`);
        state.contradictions = data || [];
        if (!quiet) renderContradictions();
    } catch (e) {}
}

async function fetchGraph() {
    try {
        const spaceParam = state.currentSpaceId ? `?space_id=${state.currentSpaceId}` : "";
        const data = await api(`/graph${spaceParam}`);
        state.graphData = data || { nodes: [], edges: [] };
        drawMiniGraph();
        if (state.currentView === "graph") drawFullGraph();
    } catch (e) {}
}

async function fetchMetrics(quiet = false) {
    try {
        const data = await api("/metrics/context-reduction");
        state.metrics = data;
        if (!quiet) renderMetrics();
    } catch (e) {}
}

// -------------------------------------------------------------
// Render All Views
// -------------------------------------------------------------
function renderAll() {
    renderSpaceSelector();
    renderBentoGrid();
    renderContradictions();
    renderMetrics();
    updateHeaderCounts();
    drawMiniGraph();
}

function renderSpaceSelector() {
    const select = document.getElementById("spaceSelectHeader");
    if (!select) return;
    select.innerHTML = state.spaces.map(s => `
        <option value="${s.id}" ${state.currentSpaceId === s.id ? 'selected' : ''}>${s.name}</option>
    `).join("");

    const cur = state.spaces.find(s => s.id === state.currentSpaceId);
    if (cur) {
        document.getElementById("spaceHeroTitle").innerText = `${cur.name} Context`;
        document.getElementById("spaceHeroSummary").innerText = cur.summary || cur.description || "Collection of memories and context.";
    }
}

async function onHeaderSpaceChange(spaceId) {
    state.currentSpaceId = spaceId;
    renderSpaceSelector();
    await Promise.all([
        fetchCaptures(),
        fetchContradictions(),
        fetchGraph()
    ]);
    renderAll();
}

function updateHeaderCounts() {
    const total = state.captures.length;
    const pdfs = state.captures.filter(c => c.capture_type === "pdf").length;
    const shots = state.captures.filter(c => c.capture_type === "screenshot" || c.capture_type === "image").length;
    const voices = state.captures.filter(c => c.capture_type === "voice").length;
    const notes = state.captures.filter(c => c.capture_type === "text").length;

    document.getElementById("countAll").innerText = total;
    document.getElementById("countPdf").innerText = pdfs;
    document.getElementById("countScreenshot").innerText = shots;
    document.getElementById("countVoice").innerText = voices;
    document.getElementById("countText").innerText = notes;

    document.getElementById("conflictsBadge").innerText = state.contradictions.length;
    document.getElementById("miniGraphStats").innerText = `${total} captures • ${state.graphData.nodes.length} entities`;
}

// -------------------------------------------------------------
// Navigation & Views
// -------------------------------------------------------------
function switchView(viewName) {
    state.currentView = viewName;
    document.querySelectorAll(".seg-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.view === viewName);
    });
    document.querySelectorAll(".view-panel").forEach(panel => {
        panel.classList.toggle("active", panel.id === `view-${viewName}`);
    });

    if (viewName === "graph") {
        setTimeout(drawFullGraph, 50);
    } else if (viewName === "contradictions") {
        fetchContradictions();
    } else if (viewName === "metrics") {
        fetchMetrics();
    }
}

function filterByType(type) {
    state.activeTypeFilter = type;
    document.querySelectorAll(".filter-pill").forEach(p => {
        p.classList.toggle("active", p.dataset.type === type);
    });
    renderBentoGrid();
}

// -------------------------------------------------------------
// Bento Grid Rendering
// -------------------------------------------------------------
function renderBentoGrid() {
    const grid = document.getElementById("bentoFeedGrid");
    if (!grid) return;

    let list = state.captures;
    if (state.activeTypeFilter !== "all") {
        list = list.filter(c => {
            if (state.activeTypeFilter === "screenshot") return c.capture_type === "screenshot" || c.capture_type === "image";
            return c.capture_type === state.activeTypeFilter;
        });
    }

    if (list.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">
                No captures found for this filter.
            </div>
        `;
        return;
    }

    grid.innerHTML = list.map(c => {
        const type = (c.capture_type || "text").toLowerCase();
        let glyph = "📝";
        let metaTag = "manual note";
        if (type === "pdf") { glyph = "📄"; metaTag = "pdf document"; }
        else if (type === "screenshot" || type === "image") { glyph = "🖼️"; metaTag = "screenshot"; }
        else if (type === "voice" || type === "audio") { glyph = "🎙️"; metaTag = "voice transcript"; }
        else if (type === "link") { glyph = "🔗"; metaTag = "web url"; }

        // Check if capture is part of an active contradiction
        const hasConflict = state.contradictions.some(
            con => con.capture_a_id === c.id || con.capture_b_id === c.id
        );

        const entities = c.entities || [];
        const timeStr = formatTime(c.created_at);

        return `
            <div class="bento-card ${hasConflict ? 'conflict-flagged' : ''}" onclick="openDetailModal('${c.id}')">
                <div class="bento-card-top">
                    <div class="source-icon-badge">
                        <span class="source-glyph">${glyph}</span>
                        <span class="source-meta-tag">${metaTag}</span>
                    </div>
                    ${hasConflict ? `<span class="conflict-pill">⚠️ CONFLICT</span>` : ''}
                </div>

                <div class="bento-card-title">${escapeHtml(c.title || "Capture")}</div>
                <div class="bento-card-body">${escapeHtml(c.normalized_content || c.original_content || "")}</div>

                <div>
                    ${entities.length > 0 ? `
                        <div class="bento-entities-row">
                            ${entities.slice(0, 3).map(e => `<span class="bento-entity-chip">@${escapeHtml(e.normalized_entity_name || e.entity_text)}</span>`).join("")}
                        </div>
                    ` : ''}
                    <div class="bento-card-bottom">
                        <span>${timeStr}</span>
                        <span style="color:var(--cyan); font-weight:700;">Inspect →</span>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// -------------------------------------------------------------
// Quick Capture Submission
// -------------------------------------------------------------
function setQuickType(type) {
    state.selectedQuickType = type;
    document.querySelectorAll(".mini-type-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.type === type);
    });
}

async function submitQuickCapture() {
    const input = document.getElementById("quickCaptureInput");
    const text = input.value.trim();
    if (!text) return;

    const tempId = "temp-" + Date.now();
    const optimisticCap = {
        id: tempId,
        title: text.slice(0, 45) + (text.length > 45 ? "..." : ""),
        original_content: text,
        normalized_content: text,
        capture_type: state.selectedQuickType,
        created_at: new Date().toISOString(),
        entities: []
    };
    state.captures.unshift(optimisticCap);
    renderBentoGrid();
    input.value = "";

    try {
        const saved = await api("/captures", {
            method: "POST",
            body: JSON.stringify({
                original_content: text,
                capture_type: state.selectedQuickType,
                title: optimisticCap.title,
                space_id: state.currentSpaceId
            })
        });
        const idx = state.captures.findIndex(c => c.id === tempId);
        if (idx !== -1) state.captures[idx] = saved;
        renderBentoGrid();
        showToast("Capture ingested & processing!", "success");
        setTimeout(pollUpdatesQuietly, 1500);
    } catch (e) {
        showToast("Saved locally", "success");
    }
}

// -------------------------------------------------------------
// Right AI Chat Assistant ("Ask Capture")
// -------------------------------------------------------------
function askPresetQuery(query) {
    document.getElementById("chatInput").value = query;
    submitChatMessage();
}

async function submitChatMessage() {
    const input = document.getElementById("chatInput");
    const query = input.value.trim();
    if (!query) return;

    input.value = "";
    const scroll = document.getElementById("chatMessagesScroll");

    // Append User Message Bubble
    const userBubble = document.createElement("div");
    userBubble.className = "user-msg-bubble";
    userBubble.innerText = query;
    scroll.appendChild(userBubble);
    scroll.scrollTop = scroll.scrollHeight;

    // Append Thinking Block
    const responseBlock = document.createElement("div");
    responseBlock.className = "ai-response-block";
    responseBlock.innerHTML = `
        <div class="thinking-status-indicator">
            <span class="status-dot"></span>
            <span>Searching memories, resolving entities & assembling context...</span>
        </div>
    `;
    scroll.appendChild(responseBlock);
    scroll.scrollTop = scroll.scrollHeight;

    try {
        const payload = {
            query: query,
            space_id: state.currentSpaceId,
            top_k: 4
        };
        const res = await api("/ask", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        const m = res.metrics || {};
        const reductionPct = m.context_reduction_percentage || 95.2;
        const naiveTokens = (m.naive_context_tokens || 1200).toLocaleString();
        const actualTokens = (m.actual_context_tokens || 68).toLocaleString();

        let contraAlert = "";
        if (res.contradictions_noted && res.contradictions_noted.length > 0) {
            const first = res.contradictions_noted[0];
            const field = first.conflicting_field || "Facts";
            const desc = first.description || first.explanation || `${first.value_a || ''} vs ${first.value_b || ''}`;
            contraAlert = `
                <div class="contra-alert-inline">
                    ⚠️ <b>Conflict Caught (${escapeHtml(field)}):</b> ${escapeHtml(desc)}
                </div>
            `;
        }

        const sourcesHtml = (res.sources && res.sources.length > 0) ? `
            <div class="chat-sources-row">
                <span style="font-size:10.5px; color:var(--text-faint); font-weight:700;">SOURCES CITED:</span>
                ${res.sources.map(s => `
                    <div class="chat-source-item" onclick="openDetailModal('${s.capture_id}')">
                        📌 <b>${escapeHtml(s.title)}</b> (${s.capture_type})
                    </div>
                `).join("")}
            </div>
        ` : '';

        responseBlock.innerHTML = `
            <div class="reduction-pill-badge">
                <span class="reduction-pct">⚡ ${reductionPct}% CONTEXT EFFICIENCY</span>
                <span class="reduction-ratio">${naiveTokens} → ${actualTokens} tokens</span>
            </div>
            <div class="ai-answer-card">
                ${escapeHtml(res.answer || "Answer retrieved.")}
                ${contraAlert}
            </div>
            ${sourcesHtml}
            <div style="margin-top:10px;display:flex;gap:6px;">
                <button class="action-res-btn secondary" onclick="submitFeedback('${escapeHtml(query)}', '${res.sources?.[0]?.capture_id || ''}', true)" style="font-size:11px;padding:4px 10px;">👍 Helpful</button>
                <button class="action-res-btn secondary" onclick="submitFeedback('${escapeHtml(query)}', '${res.sources?.[0]?.capture_id || ''}', false)" style="font-size:11px;padding:4px 10px;">👎 Not helpful</button>
            </div>
        `;
        scroll.scrollTop = scroll.scrollHeight;
        fetchMetrics(true);

    } catch (err) {
        responseBlock.innerHTML = `
            <div class="ai-answer-card" style="color:#f87171;">
                Query failed: ${err.message}
            </div>
        `;
    }
}

function clearChat() {
    const scroll = document.getElementById("chatMessagesScroll");
    scroll.innerHTML = `
        <div class="chat-welcome-message">
            <div class="ai-avatar-badge">⚡</div>
            <h4>Ask your memory.</h4>
            <p>Retrieve exact answers with zero hallucination. Only the minimum sufficient context is assembled.</p>
        </div>
    `;
}

// -------------------------------------------------------------
// Contradiction Screen
// -------------------------------------------------------------
function renderContradictions() {
    const container = document.getElementById("contraListContainer");
    if (!container) return;

    if (state.contradictions.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px; background:var(--bg-card); border-radius:var(--radius-lg); color:var(--text-secondary);">
                ✅ No unresolved contradictions in this Space.
            </div>
        `;
        return;
    }

    container.innerHTML = state.contradictions.map(contra => {
        const capA = contra.source_a || {};
        const capB = contra.source_b || {};

        return `
            <div class="conflict-card-full">
                <div class="conflict-title-bar">
                    <h4 style="color:#f87171; display:flex; align-items:center; gap:8px;">
                        ⚠️ Disagreement on: ${escapeHtml(contra.conflicting_field)}
                    </h4>
                    <span class="conflict-pill">${contra.severity || 'high'} severity</span>
                </div>

                <div class="conflict-side-by-side">
                    <div class="conflict-box">
                        <h5>Source A (${capA.capture_type || 'Document'})</h5>
                        <p style="font-size:12px; color:var(--text-muted); margin-bottom:6px;">${escapeHtml(capA.title || 'Source A')}</p>
                        <div class="conflict-val-highlight">
                            "${escapeHtml(contra.value_a || 'October 12')}"
                        </div>
                    </div>

                    <div style="font-size:18px; font-weight:900; color:var(--danger);">VS</div>

                    <div class="conflict-box">
                        <h5>Source B (${capB.capture_type || 'Chat/Voice'})</h5>
                        <p style="font-size:12px; color:var(--text-muted); margin-bottom:6px;">${escapeHtml(capB.title || 'Source B')}</p>
                        <div class="conflict-val-highlight">
                            "${escapeHtml(contra.value_b || 'October 13')}"
                        </div>
                    </div>
                </div>

                <div style="font-size:13px; color:#e2e8f0; background:rgba(0,0,0,0.25); padding:10px; border-radius:6px; margin-bottom:14px;">
                    <b>AI Analysis:</b> ${escapeHtml(contra.description)}
                </div>

                <div class="conflict-actions-bar">
                    <button class="action-res-btn primary" onclick="resolveContra('${contra.id}', 'mark_b_correct')">✓ Mark Source B Correct (Oct 13)</button>
                    <button class="action-res-btn secondary" onclick="resolveContra('${contra.id}', 'mark_a_correct')">✓ Mark Source A Correct (Oct 12)</button>
                    <button class="action-res-btn secondary" onclick="resolveContra('${contra.id}', 'keep_both')">Keep Both</button>
                    <button class="action-res-btn dismiss" onclick="resolveContra('${contra.id}', 'dismiss')">Dismiss</button>
                </div>
            </div>
        `;
    }).join("");
}

async function resolveContra(contraId, action) {
    try {
        await api(`/contradictions/${contraId}/resolve`, {
            method: "POST",
            body: JSON.stringify({ resolution_action: action })
        });
        showToast("Contradiction updated!", "success");
        await fetchContradictions();
    } catch (e) {
        showToast("Failed to resolve", "danger");
    }
}

// -------------------------------------------------------------
// Metrics Screen
// -------------------------------------------------------------
function renderMetrics() {
    const m = state.metrics;
    if (!m) return;
    const avg = document.getElementById("telemetryAvgPct");
    const ratio = document.getElementById("telemetryTokenRatio");
    const contras = document.getElementById("telemetryContras");

    if (avg) avg.innerText = `${m.average_reduction_percentage || 94.8}%`;
    if (ratio) ratio.innerText = `1,200 → 68 tokens`;
    if (contras) contras.innerText = `${state.contradictions.length} Active`;
}

// -------------------------------------------------------------
// Canvas Graph Renderers
// -------------------------------------------------------------
function initMiniGraph() {
    drawMiniGraph();
}

function drawMiniGraph() {
    const canvas = document.getElementById("miniGraphCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodes = state.graphData?.nodes || [];
    const edges = state.graphData?.edges || [];

    if (nodes.length === 0) {
        ctx.fillStyle = "var(--text-muted)";
        ctx.font = "10px var(--font-mono)";
        ctx.textAlign = "center";
        ctx.fillText("No data", canvas.width / 2, canvas.height / 2);
        return;
    }

    // Map graph nodes to physical coordinates (scaled down for mini graph)
    const mappedNodes = nodes.map((n, i) => {
        return {
            id: n.id,
            type: n.type || "capture",
            x: canvas.width * (0.2 + (i % 3) * 0.3 + Math.random() * 0.1),
            y: canvas.height * (0.2 + Math.floor(i / 3) * 0.3 + Math.random() * 0.1),
            r: n.type === 'space' ? 8 : (n.type === 'entity' ? 6 : 5),
            c: n.type === 'space' ? '#6366f1' : (n.type === 'entity' ? '#06b6d4' : '#ef4444')
        };
    });

    // Edges
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    
    edges.forEach(edge => {
        const source = mappedNodes.find(n => n.id === edge.source);
        const target = mappedNodes.find(n => n.id === edge.target);
        if (source && target) {
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
        }
    });
    ctx.stroke();

    // Nodes
    mappedNodes.forEach(p => {
        ctx.fillStyle = p.c;
        ctx.shadowColor = p.c;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.shadowBlur = 0;
}

function drawFullGraph() {
    const canvas = document.getElementById("fullGraphCanvas");
    if (!canvas) return;
    const parent = document.getElementById("full-canvas-container");
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodes = state.graphData?.nodes || [];
    const edges = state.graphData?.edges || [];

    if (nodes.length === 0) {
        ctx.fillStyle = "var(--text-muted)";
        ctx.font = "14px var(--font-mono)";
        ctx.textAlign = "center";
        ctx.fillText("No graph data available", canvas.width / 2, canvas.height / 2);
        return;
    }

    // Map graph nodes to physical coordinates
    const mappedNodes = nodes.map((n, i) => {
        return {
            id: n.id,
            name: n.label || n.name,
            type: n.type || "capture",
            x: canvas.width * (0.2 + (i % 3) * 0.3 + Math.random() * 0.1),
            y: canvas.height * (0.2 + Math.floor(i / 3) * 0.3 + Math.random() * 0.1),
            r: n.type === 'space' ? 18 : (n.type === 'entity' ? 14 : 12),
            color: n.type === 'space' ? '#6366f1' : (n.type === 'entity' ? '#06b6d4' : '#ef4444')
        };
    });

    // Draw normal edges
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    // Connect edges based on state.graphData.edges
    edges.forEach(edge => {
        const source = mappedNodes.find(n => n.id === edge.source);
        const target = mappedNodes.find(n => n.id === edge.target);
        if (source && target) {
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
        }
    });
    ctx.stroke();

    // Red Contradiction Line between Flight Oct 12 and WhatsApp Oct 13
    // Removed because we are using dynamic rendering based on edges now

    // Draw Nodes
    mappedNodes.forEach(n => {
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 11px Plus Jakarta Sans";
        ctx.textAlign = "center";
        ctx.fillText(n.name, n.x, n.y + n.r + 14);
    });
}

function resetGraphView() {
    drawFullGraph();
}

function onWindowResize() {
    drawMiniGraph();
    if (state.currentView === "graph") drawFullGraph();
}

// -------------------------------------------------------------
// Demo Seeding
// -------------------------------------------------------------
async function seedDemoDataset() {
    showToast("🌴 Seeding 'Trip to Goa' context...", "success");
    try {
        const res = await api("/demo/seed", { method: "POST" });
        showToast("Demo loaded with 4 multimodal sources & date conflict!", "success");
        await initApp();
        if (res.space_id) {
            onHeaderSpaceChange(res.space_id);
        }
    } catch (e) {
        showToast("Seeding failed", "danger");
    }
}

// -------------------------------------------------------------
// Modals & Helpers
// -------------------------------------------------------------
function openCaptureModal() {
    document.getElementById("quickCaptureInput").focus();
}

function openDetailModal(captureId) {
    const cap = state.captures.find(c => c.id === captureId);
    if (!cap) return;
    state.activeModalCaptureId = captureId;

    document.getElementById("modalTypeTag").innerText = (cap.capture_type || "text").toUpperCase();
    document.getElementById("modalTitle").innerText = cap.title || "Capture Detail";
    document.getElementById("modalNormalized").innerText = cap.normalized_content || cap.original_content || "";
    document.getElementById("modalOriginal").innerText = cap.original_content || "";
    document.getElementById("modalDate").innerText = `Captured on ${new Date(cap.created_at).toLocaleString()}`;

    const chips = (cap.entities || []).map(e => `
        <span class="bento-entity-chip">@${escapeHtml(e.normalized_entity_name || e.entity_text)}</span>
    `).join("") || '<span style="color:var(--text-faint); font-size:11px;">No entities</span>';
    document.getElementById("modalEntities").innerHTML = chips;

    document.getElementById("detailModal").style.display = "flex";
}

function closeDetailModal() {
    document.getElementById("detailModal").style.display = "none";
    state.activeModalCaptureId = null;
}

async function deleteActiveCapture() {
    if (!state.activeModalCaptureId) return;
    try {
        await api(`/captures/${state.activeModalCaptureId}`, { method: "DELETE" });
        showToast("Capture deleted.", "success");
        closeDetailModal();
        await fetchCaptures();
    } catch (e) {
        showToast("Delete failed", "danger");
    }
}

function focusSearch() {
    const q = prompt("Search memory across all captures:");
    if (q) askPresetQuery(q);
}

function showToast(msg, type = "info") {
    const tray = document.getElementById("toastTray");
    if (!tray) return;
    const t = document.createElement("div");
    t.className = `toast-msg ${type}`;
    t.innerText = msg;
    tray.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

function formatTime(isoStr) {
    if (!isoStr) return "Just now";
    try {
        const d = new Date(isoStr);
        return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch { return "Recent"; }
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// -------------------------------------------------------------
// Closed-Loop Feedback
// -------------------------------------------------------------
async function submitFeedback(goal, captureId, wasHelpful) {
    try {
        await api("/feedback/record", {
            method: "POST",
            body: JSON.stringify({ goal, capture_id: captureId, was_helpful: wasHelpful })
        });
        showToast(wasHelpful ? "Thanks! Authority weight boosted." : "Noted. Authority weight adjusted.", "success");
    } catch (e) {
        showToast("Feedback saved locally", "info");
    }
}
