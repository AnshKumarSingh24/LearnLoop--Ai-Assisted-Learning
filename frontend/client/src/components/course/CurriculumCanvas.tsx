import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  BookOpen, Target, ChevronRight, ChevronDown, 
  Plus, Minus, Search, Download, LayoutTemplate, CheckCircle2
} from 'lucide-react';
import { Button } from '../ui/button';

interface CurriculumNode {
  id: string;
  type: 'course' | 'module' | 'lesson' | 'lo';
  label: string;
  fullLabel: string;
  parentId?: string;
  children: string[];
  x: number;
  y: number;
  data?: any;
}

interface CurriculumEdge {
  id: string;
  from: string;
  to: string;
}

interface CurriculumCanvasProps {
  ast: any;
  onNodeClick?: (node: CurriculumNode) => void;
  onImportToCanvas?: (loIds: number[]) => void;
}

export function CurriculumCanvas({ ast, onNodeClick, onImportToCanvas }: CurriculumCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<CurriculumNode[]>([]);
  const [edges, setEdges] = useState<CurriculumEdge[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<CurriculumNode | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedLOs, setSelectedLOs] = useState<string[]>([]);

  // Build graph from AST
  useEffect(() => {
    if (!ast) return;

    const newNodes: CurriculumNode[] = [];
    const newEdges: CurriculumEdge[] = [];

    // Course node
    const courseId = `course_${ast.id || 'root'}`;
    newNodes.push({
      id: courseId,
      type: 'course',
      label: ast.title || 'Course',
      fullLabel: ast.title || 'Course',
      children: [],
      x: 0,
      y: 0,
      data: ast
    });

    let nodeIndex = 0;
    const RADIUS = 300;
    const MODULE_RADIUS = 200;
    const LESSON_RADIUS = 150;

    // Layout modules in circle around course
    ast.modules?.forEach((module: any, modIdx: number) => {
      const modId = `mod_${module.id || modIdx}`;
      const angle = (modIdx / (ast.modules?.length || 1)) * Math.PI * 2 - Math.PI / 2;
      
      newNodes.push({
        id: modId,
        type: 'module',
        label: module.title || `Module ${modIdx + 1}`,
        fullLabel: module.title || `Module ${modIdx + 1}`,
        parentId: courseId,
        children: [],
        x: Math.cos(angle) * RADIUS,
        y: Math.sin(angle) * RADIUS,
        data: module
      });
      newEdges.push({ id: `e_${courseId}_${modId}`, from: courseId, to: modId });

      // Layout lessons in circle around module
      module.lessons?.forEach((lesson: any, lesIdx: number) => {
        const lesId = `les_${lesson.id || lesIdx}`;
        const lessonAngle = (lesIdx / (module.lessons?.length || 1)) * Math.PI * 2 - Math.PI / 2;
        
        newNodes.push({
          id: lesId,
          type: 'lesson',
          label: lesson.title || `Lesson ${lesIdx + 1}`,
          fullLabel: lesson.title || `Lesson ${lesIdx + 1}`,
          parentId: modId,
          children: [],
          x: newNodes.find(n => n.id === modId)!.x + Math.cos(lessonAngle) * MODULE_RADIUS,
          y: newNodes.find(n => n.id === modId)!.y + Math.sin(lessonAngle) * MODULE_RADIUS,
          data: lesson
        });
        newEdges.push({ id: `e_${modId}_${lesId}`, from: modId, to: lesId });

        // Layout LOs in circle around lesson
        lesson.learning_objectives?.forEach((lo: any, loIdx: number) => {
          const loId = `lo_${lo.id || loIdx}`;
          const loAngle = (loIdx / (lesson.learning_objectives?.length || 1)) * Math.PI * 2 - Math.PI / 2;
          
          newNodes.push({
            id: loId,
            type: 'lo',
            label: lo.text?.substring(0, 30) + '...' || `LO ${loIdx + 1}`,
            fullLabel: lo.text || `LO ${loIdx + 1}`,
            parentId: lesId,
            children: [],
            x: newNodes.find(n => n.id === lesId)!.x + Math.cos(loAngle) * LESSON_RADIUS,
            y: newNodes.find(n => n.id === lesId)!.y + Math.sin(loAngle) * LESSON_RADIUS,
            data: lo
          });
          newEdges.push({ id: `e_${lesId}_${loId}`, from: lesId, to: loId });
        });
      });
    });

    // Add prerequisite edges
    ast.modules?.forEach((module: any) => {
      module.lessons?.forEach((lesson: any) => {
        lesson.learning_objectives?.forEach((lo: any) => {
          if (lo.prerequisites && lo.prerequisites.length > 0) {
            lo.prerequisites.forEach((prereq: string) => {
              newEdges.push({ 
                id: `prereq_${lo.id}_${prereq}`, 
                from: `lo_${prereq}`, 
                to: `lo_${lo.id || ''}`
              });
            });
          }
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [ast]);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.save();
      ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
      ctx.scale(zoom, zoom);

      // Draw edges
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return;

        const isPrereq = edge.id.startsWith('prereq_');
        
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        
        // Curved line for prerequisites
        if (isPrereq) {
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offsetX = -dy / dist * 50;
          const offsetY = dx / dist * 50;
          ctx.quadraticCurveTo(midX + offsetX, midY + offsetY, toNode.x, toNode.y);
        } else {
          // Straight line for hierarchy
          ctx.lineTo(toNode.x, toNode.y);
        }
        
        ctx.strokeStyle = isPrereq ? '#f59e0b' : '#9ca3af';
        ctx.lineWidth = isPrereq ? 2 : 1.5;
        ctx.setLineDash(isPrereq ? [5, 5] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrowhead
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        const headLen = 10;
        ctx.beginPath();
        ctx.moveTo(toNode.x, toNode.y);
        ctx.lineTo(toNode.x - headLen * Math.cos(angle - Math.PI / 6), toNode.y - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(toNode.x, toNode.y);
        ctx.lineTo(toNode.x - headLen * Math.cos(angle + Math.PI / 6), toNode.y - headLen * Math.sin(angle + Math.PI / 6));
        ctx.strokeStyle = isPrereq ? '#f59e0b' : '#9ca3af';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id;
        const colors = {
          course: { bg: '#123d2d', border: '#0d2a1f', text: '#fff' },
          module: { bg: '#3b82f6', border: '#2563eb', text: '#fff' },
          lesson: { bg: '#8b5cf6', border: '#7c3aed', text: '#fff' },
          lo: { bg: '#f59e0b', border: '#d97706', text: '#fff' }
        };
        const color = colors[node.type] || colors.lo;

        // Node circle
        const radius = node.type === 'course' ? 50 : node.type === 'module' ? 40 : node.type === 'lesson' ? 35 : 25;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#fff' : color.bg;
        ctx.fill();
        ctx.strokeStyle = isSelected ? color.bg : color.border;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        // Icon
        const icons = {
          course: '📚',
          module: '📖',
          lesson: '📝',
          lo: '🎯'
        };
        ctx.font = `${radius * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isSelected ? color.bg : color.text;
        ctx.fillText(icons[node.type] || '●', node.x, node.y);

        // Label below node
        if (zoom > 0.5) {
          ctx.font = '11px system-ui';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#374151';
          const label = node.label.length > 20 ? node.label.substring(0, 20) + '...' : node.label;
          ctx.fillText(label, node.x, node.y + radius + 14);
        }
      });

      ctx.restore();
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => window.removeEventListener('resize', resize);
  }, [nodes, edges, zoom, pan, selectedNode]);

  // Pan and zoom handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning) return;
    setPan({
      x: panStart.current.px + e.clientX - panStart.current.x,
      y: panStart.current.py + e.clientY - panStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.3, Math.min(2, prev + delta)));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const clickX = (e.clientX - rect.left - canvas.width / 2 - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - canvas.height / 2 - pan.y) / zoom;

    const clickedNode = nodes.find(node => {
      const radius = node.type === 'course' ? 50 : node.type === 'module' ? 40 : node.type === 'lesson' ? 35 : 25;
      const dx = clickX - node.x;
      const dy = clickY - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= radius;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode);
      onNodeClick?.(clickedNode);
    } else {
      setSelectedNode(null);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(2, prev + 0.2));
  const handleZoomOut = () => setZoom(prev => Math.max(0.3, prev - 0.2));
  const handleResetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const toggleLO = (loId: string) => {
    setSelectedLOs(prev => prev.includes(loId) ? prev.filter(id => id !== loId) : [...prev, loId]);
  };

  const nodeTypeColors = {
    course: 'bg-[#123d2d]',
    module: 'bg-blue-600',
    lesson: 'bg-purple-600',
    lo: 'bg-amber-500'
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-gray-900">Curriculum Graph</h3>
          <span className="text-xs text-gray-500 px-2 py-0.5 bg-white rounded border">
            {nodes.filter(n => n.type === 'module').length} modules · 
            {nodes.filter(n => n.type === 'lesson').length} lessons · 
            {nodes.filter(n => n.type === 'lo').length} LOs
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleZoomOut} title="Zoom Out"><Minus size={16} /></Button>
          <span className="text-sm text-gray-600 w-16 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn} title="Zoom In"><Plus size={16} /></Button>
          <Button variant="ghost" size="sm" onClick={handleResetView} title="Reset View"><LayoutTemplate size={16} /></Button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 relative" style={{ minHeight: 500 }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onClick={handleCanvasClick}
        />
        
        {/* Mini-legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 border border-gray-200 shadow-lg text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#123d2d"></span> Course
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span> Modules
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-purple-600"></span> Lessons
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span> Learning Objectives
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2 flex items-center gap-2 text-amber-600">
            <span className="w-3 h-3 border-2 border-amber-500 rounded-full" style={{ borderStyle: 'dashed' }}></span> Prerequisites
          </div>
        </div>
      </div>

      {/* Node Inspector */}
      {selectedNode && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${nodeTypeColors[selectedNode.type as keyof typeof nodeTypeColors] || nodeTypeColors.lo}`}>
                {selectedNode.type === 'course' && <BookOpen size={18} className="text-white" />}
                {selectedNode.type === 'module' && <BookOpen size={18} className="text-white" />}
                {selectedNode.type === 'lesson' && <Target size={18} className="text-white" />}
                {selectedNode.type === 'lo' && <Target size={18} className="text-white" />}
              </span>
              <div>
                <h4 className="font-bold text-gray-900 capitalize">{selectedNode.type}</h4>
                <p className="text-sm text-gray-600">{selectedNode.label}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
              <ChevronRight size={16} />
            </Button>
          </div>

          {selectedNode.type === 'lo' && selectedNode.data && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Bloom Verb:</span>
                <span className="font-medium text-gray-900 ml-2">{selectedNode.data.bloom_verb}</span>
              </div>
              <div>
                <span className="text-gray-500">Bloom Level:</span>
                <span className="font-medium text-gray-900 ml-2">{selectedNode.data.bloom_level}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Prerequisites:</span>
                <span className="font-medium text-gray-900 ml-2">
                  {selectedNode.data.prerequisites?.length > 0 
                    ? selectedNode.data.prerequisites.join(', ') 
                    : 'None'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Source:</span>
                <span className="font-medium text-gray-900 ml-2">
                  {selectedNode.data.source_spans?.[0]?.substring(0, 100) + '...' || 'No source'}
                </span>
              </div>
            </div>
          )}

          {selectedNode.type === 'lo' && (
            <div className="mt-3 flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => toggleLO(selectedNode.id)}
                className={selectedLOs.includes(selectedNode.id) ? 'bg-amber-500 text-white border-amber-500' : ''}
              >
                {selectedLOs.includes(selectedNode.id) ? <CheckCircle2 size={14} className="mr-1" /> : <Plus size={14} className="mr-1" />}
                {selectedLOs.includes(selectedNode.id) ? 'Selected' : 'Select for Import'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="font-bold text-lg mb-4">Import to Canvas</h3>
            <p className="text-gray-600 mb-4">
              Import {selectedLOs.length} Learning Objective(s) as cards to your Canvas workspace.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowImportModal(false)}>Cancel</Button>
              <Button onClick={() => { onImportToCanvas?.(selectedLOs.map(id => Number(id.replace(/^lo_/, ""))).filter(Number.isFinite)); setShowImportModal(false); setSelectedLOs([]); }}>
                Import {selectedLOs.length} LOs
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
