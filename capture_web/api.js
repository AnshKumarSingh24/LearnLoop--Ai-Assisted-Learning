const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : 'https://your-deployed-api.com';

class ApiClient {
    constructor() {
        this.baseUrl = API_BASE;
        this.token = localStorage.getItem('capture_token');
        this.authorityThreshold = 0.45;  // matches backend default
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('capture_token', token);
    }

    setAuthorityThreshold(val) {
        // val is a string "0.30"-"0.80" from HTML slider
        this.authorityThreshold = parseFloat(val) || 0.45;
    }

    async request(method, path, body = null) {
        const headers = { 'Content-Type': 'application/json' };
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

        const opts = { method, headers };
        if (body) opts.body = JSON.stringify(body);

        const res = await fetch(`${this.baseUrl}${path}`, opts);
        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(err.detail || 'Request failed');
        }
        return res.json();
    }

    get(path) { return this.request('GET', path); }
    post(path, body) { return this.request('POST', path, body); }
    patch(path, body) { return this.request('PATCH', path, body); }
    delete(path) { return this.request('DELETE', path); }

    // Captures
    getCaptures(limit = 100) { return this.get(`/captures?limit=${limit}`); }
    createCapture(data) { return this.post('/captures', data); }
    updateCapture(id, data) { return this.patch(`/captures/${id}`, data); }
    deleteCapture(id) { return this.delete(`/captures/${id}`); }
    searchCaptures(query, spaceId = null) {
        return this.post('/captures/search', { query, space_id: spaceId, synthesize: true });
    }

    // Spaces
    getSpaces() { return this.get('/spaces'); }
    createSpace(data) { return this.post('/spaces', data); }
    getSpaceContext(id) { return this.get(`/spaces/${id}/context`); }
    getSpaceEntities(id) { return this.get(`/spaces/${id}/entities`); }
    getSpaceContradictions(id) { return this.get(`/spaces/${id}/contradictions`); }
    addCaptureToSpace(spaceId, captureId) { return this.post(`/spaces/${spaceId}/captures`, { capture_id: captureId }); }

    // Goals / Context Engine
    createGoal(data) { return this.post('/goals', data); }
    listGoals() { return this.get('/goals'); }
    getContextPack(goalText, spaceId = null, maxTokens = 10000, authorityThreshold = null) {
        const at = authorityThreshold !== null ? authorityThreshold : this.authorityThreshold;
        return this.post('/goals/context-pack', { goal_text: goalText, space_id: spaceId, max_tokens: maxTokens, authority_threshold: at });
    }
    orchestrateContext(goalText, spaceId = null, maxTokens = 10000, authorityThreshold = null) {
        const at = authorityThreshold !== null ? authorityThreshold : this.authorityThreshold;
        return this.post('/goals/orchestrate', { goal_text: goalText, space_id: spaceId, max_tokens: maxTokens, authority_threshold: at });
    }
    askContextOS(question, spaceId = null) {
        return this.post('/goals/ask', { question, space_id: spaceId });
    }
    getContextPacks() { return this.get('/goals/context-packs'); }

    // Graph
    getGraph(limit = 100) { return this.get(`/graph?limit=${limit}`); }
    getEntityDetail(id) { return this.get(`/graph/entity/${id}`); }

    // Dashboard
    getMetrics() { return this.get('/dashboard/metrics'); }
    getComparison() { return this.get('/dashboard/comparison'); }

    // Sources
    getSources() { return this.get('/sources'); }
    createSource(data) { return this.post('/sources', data); }
    importGitHub(repoUrl, branch = 'main') {
        return this.post('/sources/github', { repo_url: repoUrl, branch });
    }
    importChat(messages, platform) {
        return this.post('/sources/chat', { messages, platform });
    }
    importMeeting(data) { return this.post('/sources/meeting', data); }

    // MCP
    mcpAction(action, params) { return this.post('/mcp', { action, params }); }
}

const api = new ApiClient();
