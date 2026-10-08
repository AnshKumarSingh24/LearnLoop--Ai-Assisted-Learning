import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_theme.dart';
import '../models/capture.dart';
import '../models/entity.dart';
import '../models/contradiction.dart';
import '../providers/spaces_provider.dart';
import 'canvas/capture_node.dart';
import 'canvas/entity_node.dart';
import 'canvas/relation_edge.dart';
import 'canvas/contradiction_marker.dart';

class InfiniteCanvas extends ConsumerStatefulWidget {
  final String spaceId;
  final List<Capture> captures;
  final List<Entity> entities;
  final List<Contradiction> contradictions;

  const InfiniteCanvas({
    super.key,
    required this.spaceId,
    required this.captures,
    required this.entities,
    required this.contradictions,
  });

  @override
  ConsumerState<InfiniteCanvas> createState() => _InfiniteCanvasState();
}

class _InfiniteCanvasState extends ConsumerState<InfiniteCanvas> {
  final TransformationController _transformController = TransformationController();
  double _currentScale = 1.0;
  Offset _currentOffset = Offset.zero;
  bool _showEntityOverlay = true;
  bool _showContradictionOverlay = true;
  String? _selectedNodeId;
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _autoLayout();
    });
  }

  void _autoLayout() {
    if (_initialized) return;
    _initialized = true;

    final positions = ref.read(canvasPositionsProvider.notifier);
    final existing = ref.read(canvasPositionsProvider);

    if (existing.isNotEmpty) return;

    final captures = widget.captures;
    final entities = widget.entities;

    if (captures.isEmpty) return;

    // Cluster captures by similarity (simple: group by type, then arrange)
    final grouped = <String, List<Capture>>{};
    for (final cap in captures) {
      grouped.putIfAbsent(cap.type.name, () => []).add(cap);
    }

    double offsetX = 100;
    double offsetY = 100;

    for (final entry in grouped.entries) {
      final groupCaptures = entry.value;
      for (var i = 0; i < groupCaptures.length; i++) {
        final cap = groupCaptures[i];
        positions.addNode(
          cap.id,
          offsetX + (i % 3) * 320,
          offsetY + (i ~/ 3) * 200,
          type: 'capture',
        );
      }
      offsetY += (groupCaptures.length ~/ 3 + 1) * 200 + 60;
    }

    // Place entity nodes below captures
    if (entities.isNotEmpty) {
      final entityY = offsetY + 40;
      for (var i = 0; i < entities.length; i++) {
        final ent = entities[i];
        positions.addNode(
          ent.id,
          100 + i * 180,
          entityY,
          type: 'entity',
        );
      }
    }

    // Fit view
    _fitToContent();
  }

  void _fitToContent() {
    final positions = ref.read(canvasPositionsProvider);
    if (positions.isEmpty) return;

    double minX = double.infinity, minY = double.infinity;
    double maxX = double.negativeInfinity, maxY = double.negativeInfinity;

    for (final node in positions.values) {
      minX = min(minX, node.x);
      minY = min(minY, node.y);
      maxX = max(maxX, node.x + node.width);
      maxY = max(maxY, node.y + node.height);
    }

    // This is a simplified fit — real implementation would use the viewport size
    setState(() {
      _currentOffset = Offset(-minX + 50, -minY + 50);
    });
  }

  @override
  Widget build(BuildContext context) {
    final positions = ref.watch(canvasPositionsProvider);

    return Stack(
      children: [
        // Canvas background
        GestureDetector(
          onSecondaryTapUp: (details) => _showContextMenu(details),
          child: InteractiveViewer(
            transformationController: _transformController,
            minScale: 0.1,
            maxScale: 3.0,
            boundaryMargin: const EdgeInsets.all(double.infinity),
            onInteractionUpdate: (details) {
              setState(() {
                _currentScale = _transformController.value.getMaxScaleOnAxis();
                _currentOffset = Offset(
                  _transformController.value.getTranslation().x,
                  _transformController.value.getTranslation().y,
                );
              });
            },
            child: SizedBox(
              width: 8000,
              height: 6000,
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  // Grid dots
                  CustomPaint(
                    size: const Size(8000, 6000),
                    painter: _GridPainter(scale: _currentScale),
                  ),

                  // Relation edges
                  if (_showEntityOverlay)
                    ..._buildEdges(positions),

                  // Contradiction markers
                  if (_showContradictionOverlay)
                    ..._buildContradictionMarkers(positions),

                  // Capture nodes
                  ...widget.captures.map((cap) {
                    final pos = positions[cap.id];
                    if (pos == null) return const SizedBox.shrink();
                    return Positioned(
                      left: pos.x,
                      top: pos.y,
                      width: pos.width,
                      child: CaptureNodeWidget(
                        capture: cap,
                        isSelected: _selectedNodeId == cap.id,
                        onTap: () => setState(() => _selectedNodeId = cap.id),
                        onDrag: (dx, dy) {
                          ref.read(canvasPositionsProvider.notifier)
                              .updatePosition(cap.id, pos.x + dx, pos.y + dy);
                        },
                      ),
                    );
                  }),

                  // Entity nodes
                  if (_showEntityOverlay)
                    ...widget.entities.map((ent) {
                      final pos = positions[ent.id];
                      if (pos == null) return const SizedBox.shrink();
                      return Positioned(
                        left: pos.x,
                        top: pos.y,
                        child: EntityNodeWidget(
                          entity: ent,
                          isSelected: _selectedNodeId == ent.id,
                          onTap: () =>
                              setState(() => _selectedNodeId = ent.id),
                        ),
                      );
                    }),
                ],
              ),
            ),
          ),
        ),

        // Toolbar
        _buildToolbar(),

        // Zoom indicator
        Positioned(
          bottom: 20,
          left: 20,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.surfaceElevated,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.border),
            ),
            child: Text(
              '${(_currentScale * 100).toInt()}%',
              style: AppTheme.jetbrains(fontSize: 10, color: AppColors.textSecondary),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildToolbar() {
    return Positioned(
      bottom: 20,
      right: 20,
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _ToolbarButton(
              icon: Icons.add,
              tooltip: 'Add Note',
              onTap: _addNote,
            ),
            _ToolbarButton(
              icon: _showEntityOverlay ? Icons.hub : Icons.hub_outlined,
              tooltip: 'Entity Overlay',
              isActive: _showEntityOverlay,
              onTap: () => setState(() => _showEntityOverlay = !_showEntityOverlay),
            ),
            _ToolbarButton(
              icon: _showContradictionOverlay
                  ? Icons.warning
                  : Icons.warning_outlined,
              tooltip: 'Contradiction Overlay',
              isActive: _showContradictionOverlay,
              onTap: () => setState(
                  () => _showContradictionOverlay = !_showContradictionOverlay),
            ),
            _ToolbarButton(
              icon: Icons.fit_screen,
              tooltip: 'Fit View',
              onTap: _fitToContent,
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildEdges(Map<String, CanvasNode> positions) {
    final widgets = <Widget>[];
    for (final cap in widget.captures) {
      for (final ent in widget.entities) {
        // Simple: connect entity to capture if entity text appears in capture content
        if (cap.content.toLowerCase().contains(ent.canonicalName.toLowerCase())) {
          final capPos = positions[cap.id];
          final entPos = positions[ent.id];
          if (capPos != null && entPos != null) {
            widgets.add(
              Positioned(
                left: 0,
                top: 0,
                child: CustomPaint(
                  size: const Size(8000, 6000),
                  painter: RelationEdgePainter(
                    from: Offset(
                      capPos.x + capPos.width / 2,
                      capPos.y + capPos.height,
                    ),
                    to: Offset(
                      entPos.x + 24,
                      entPos.y + 24,
                    ),
                    color: AppColors.violet,
                    strokeWidth: 2,
                  ),
                ),
              ),
            );
          }
        }
      }
    }
    return widgets;
  }

  List<Widget> _buildContradictionMarkers(Map<String, CanvasNode> positions) {
    final widgets = <Widget>[];
    for (final contra in widget.contradictions.where((c) => c.isUnresolved)) {
      if (contra.sourceCaptureIds.length >= 2) {
        final posA = positions[contra.sourceCaptureIds[0]];
        final posB = positions[contra.sourceCaptureIds[1]];
        if (posA != null && posB != null) {
          final midpoint = Offset(
            (posA.x + posA.width / 2 + posB.x + posB.width / 2) / 2,
            (posA.y + posA.height / 2 + posB.y + posB.height / 2) / 2,
          );
          widgets.add(
            Positioned(
              left: midpoint.x - 16,
              top: midpoint.y - 16,
              child: ContradictionMarkerWidget(
                contradiction: contra,
                onTap: () => _showContradictionDetail(contra),
              ),
            ),
          );
        }
      }
    }
    return widgets;
  }

  void _addNote() {
    final positions = ref.read(canvasPositionsProvider.notifier);
    final noteId = 'note_${DateTime.now().millisecondsSinceEpoch}';
    positions.addNode(noteId, 400, 300, type: 'annotation');
  }

  void _showContextMenu(TapUpDetails details) {
    // TODO: context menu for adding notes, connections
  }

  void _showContradictionDetail(Contradiction contra) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surfaceElevated,
        title: Row(
          children: [
            Text(contra.severityIcon, style: const TextStyle(fontSize: 20)),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                'Contradiction Detected',
                style: AppTheme.playfair(fontSize: 16),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              contra.description,
              style: AppTheme.inter(fontSize: 13),
            ),
            const SizedBox(height: 12),
            Text(
              'Severity: ${contra.severity.name}',
              style: AppTheme.jetbrains(
                fontSize: 10,
                color: AppColors.warning,
              ),
            ),
            Text(
              'Sources: ${contra.sourceCaptureIds.length} captures',
              style: AppTheme.jetbrains(
                fontSize: 10,
                color: AppColors.textTertiary,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Dismiss',
                style: AppTheme.inter(color: AppColors.textSecondary)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Resolve',
                style: AppTheme.inter(color: AppColors.orange)),
          ),
        ],
      ),
    );
  }
}

class _GridPainter extends CustomPainter {
  final double scale;
  _GridPainter({required this.scale});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.border.withValues(alpha: 0.3)
      ..strokeWidth = 0.5;

    final spacing = 40.0;
    for (double x = 0; x < size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant _GridPainter oldDelegate) =>
      oldDelegate.scale != scale;
}

class _ToolbarButton extends StatelessWidget {
  final IconData icon;
  final String tooltip;
  final bool isActive;
  final VoidCallback onTap;

  const _ToolbarButton({
    required this.icon,
    required this.tooltip,
    this.isActive = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: isActive ? AppColors.orangeDim : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            size: 18,
            color: isActive ? AppColors.orange : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
