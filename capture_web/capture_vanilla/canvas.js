/**
 * Spatial Canvas Engine for ContextOS
 * Implements an infinite canvas with draggable nodes and semantic edges.
 */

class SpatialCanvas {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.canvas = document.getElementById('edge-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodeLayer = document.getElementById('node-layer');

        this.zoom = 1;
        this.offset = { x: 0, y: 0 };
        this.isPanning = false;
        this.startPan = { x: 0, y: 0 };
        this.nodes = [];
        this.edges = [];

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Pan and Zoom events
        this.container.addEventListener('mousedown', (e) => {
            if (e.target === this.container || e.target === this.canvas) {
                this.isPanning = true;
                this.startPan = { x: e.clientX - this.offset.x, y: e.clientY - this.offset.y };
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (this.isPanning) {
                this.offset.x = e.clientX - this.startPan.x;
                this.offset.y = e.clientY - this.startPan.y;
                this.updateTransform();
                this.drawEdges();
            }
        });

        window.addEventListener('mouseup', () => {
            this.isPanning = false;
        });

        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.001;
            this.zoom -= e.deltaY * zoomSpeed;
            this.zoom = Math.max(0.1, Math.min(this.zoom, 3));
            this.updateTransform();
            this.drawEdges();
        }, { passive: false });

        this.loadGraph();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawEdges();
    }

    updateTransform() {
        const transform = `translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.zoom})`;
        this.nodeLayer.style.transform = transform;
        this.nodeLayer.style.transformOrigin = '0 0';
    }

    async loadGraph() {
        try {
            const res = await fetch('/api/v1/graph');
            const data = await res.json();

            // Clear existing
            this.nodes = [];
            this.edges = [];
            this.nodeLayer.innerHTML = '';

            // Process Graph Data
            // Expected format: [ { node_id, node_name, node_type, edge_id, edge_from, ... } ]
            const nodesMap = new Map();
            const edgesList = [];

            data.forEach(item => {
                if (!nodesMap.has(item.node_id)) {
                    nodesMap.set(item.node_id, {
                        id: item.node_id,
                        name: item.node_name,
                        type: item.node_type,
                        x: Math.random() * 2000 - 1000,
                        y: Math.random() * 2000 - 1000
                    });
                }
                if (item.edge_id) {
                    edgesList.push({
                        from: item.edge_from,
                        to: item.edge_to,
                        type: item.edge_type
                    });
                }
            });

            this.nodes = Array.from(nodesMap.values());
            this.edges = edgesList;

            this.renderNodes();
            this.drawEdges();
        } catch (e) {
            console.error("Failed to load graph", e);
        }
    }

    renderNodes() {
        this.nodes.forEach(node => {
            const el = document.createElement('div');
            el.className = `canvas-node ${node.type}`;
            el.id = `node-${node.id}`;
            el.style.left = `${node.x}px`;
            el.style.top = `${node.y}px`;
            el.innerHTML = `
                <div class="node-header">${node.type}</div>
                <div class="node-name">${node.name}</div>
            `;

            // Make draggable
            let hasDragged = false;
            
            el.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isDragging = true;
                hasDragged = false;
                startX = e.clientX - node.x;
                startY = e.clientY - node.y;
            });

            window.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    hasDragged = true;
                    node.x = e.clientX - startX;
                    node.y = e.clientY - startY;
                    el.style.left = `${node.x}px`;
                    el.style.top = `${node.y}px`;
                    this.drawEdges();
                }
            });

            window.addEventListener('mouseup', (e) => {
                if (isDragging) {
                    isDragging = false;
                    // If it was a click without dragging, open the editor
                    if (!hasDragged) {
                        const event = new CustomEvent('canvasNodeClicked', { detail: { node } });
                        window.dispatchEvent(event);
                    }
                }
            });

            this.nodeLayer.appendChild(el);
        });
    }

    drawEdges() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.offset.x, this.offset.y);
        this.ctx.scale(this.zoom, this.zoom);

        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.lineWidth = 2;

        this.edges.forEach(edge => {
            const fromNode = this.nodes.find(n => n.id === edge.from);
            const toNode = this.nodes.find(n => n.id === edge.to);

            if (fromNode && toNode) {
                this.ctx.beginPath();
                this.ctx.moveTo(fromNode.x + 50, fromNode.y + 25);
                this.ctx.lineTo(toNode.x + 50, toNode.y + 25);
                this.ctx.stroke();
            }
        });

        this.ctx.restore();
    }
}

// Global instance
let spatialCanvas = null;
function initCanvas() {
    if (!spatialCanvas) {
        spatialCanvas = new SpatialCanvas();
    }
}

// Sync updates from the rich editor back to the canvas node
window.addEventListener('editorNodeUpdated', (e) => {
    if (!spatialCanvas) return;
    const { nodeId, newName } = e.detail;
    const node = spatialCanvas.nodes.find(n => n.id === nodeId);
    if (node) {
        node.name = newName;
        const nodeEl = document.getElementById(`node-${nodeId}`);
        if (nodeEl) {
            const nameEl = nodeEl.querySelector('.node-name');
            if (nameEl) nameEl.textContent = newName;
        }
    }
});
