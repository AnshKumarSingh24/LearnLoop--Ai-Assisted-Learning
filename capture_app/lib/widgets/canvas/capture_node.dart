import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/capture.dart';

class CaptureNodeWidget extends StatefulWidget {
  final Capture capture;
  final bool isSelected;
  final VoidCallback onTap;
  final Function(double dx, double dy) onDrag;

  const CaptureNodeWidget({
    super.key,
    required this.capture,
    required this.isSelected,
    required this.onTap,
    required this.onDrag,
  });

  @override
  State<CaptureNodeWidget> createState() => _CaptureNodeWidgetState();
}

class _CaptureNodeWidgetState extends State<CaptureNodeWidget> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      onPanUpdate: (details) {
        widget.onDrag(details.delta.dx, details.delta.dy);
      },
      onDoubleTap: () => setState(() => _expanded = !_expanded),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: 280,
        constraints: BoxConstraints(
          minHeight: _expanded ? 200 : 120,
        ),
        decoration: BoxDecoration(
          color: widget.isSelected ? AppColors.surfaceHover : AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: widget.isSelected ? AppColors.orange : AppColors.border,
            width: widget.isSelected ? 1.5 : 1,
          ),
          boxShadow: widget.isSelected
              ? [
                  BoxShadow(
                    color: AppColors.orange.withValues(alpha: 0.1),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                _TypeIcon(type: widget.capture.type),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    widget.capture.title ??
                        widget.capture.content.substring(
                            0,
                            widget.capture.content.length > 30
                                ? 30
                                : widget.capture.content.length),
                    style: AppTheme.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceElevated,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    widget.capture.sourceLabel,
                    style: AppTheme.jetbrains(
                      fontSize: 8,
                      color: AppColors.textTertiary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              widget.capture.contentPreview,
              style: AppTheme.inter(
                fontSize: 11,
                color: AppColors.textSecondary,
              ),
              maxLines: _expanded ? 8 : 2,
              overflow: TextOverflow.ellipsis,
            ),
            if (_expanded) ...[
              const SizedBox(height: 8),
              Text(
                widget.capture.content,
                style: AppTheme.inter(
                  fontSize: 11,
                  color: AppColors.textSecondary,
                  height: 1.5,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _TypeIcon extends StatelessWidget {
  final CaptureType type;
  const _TypeIcon({required this.type});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 22,
      height: 22,
      decoration: BoxDecoration(
        color: _color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(5),
      ),
      child: Center(
        child: Icon(_icon, size: 11, color: _color),
      ),
    );
  }

  Color get _color {
    switch (type) {
      case CaptureType.text:
        return AppColors.textSecondary;
      case CaptureType.link:
        return AppColors.blue;
      case CaptureType.voice:
        return AppColors.orange;
      case CaptureType.image:
        return AppColors.violet;
      case CaptureType.file:
        return AppColors.teal;
    }
  }

  IconData get _icon {
    switch (type) {
      case CaptureType.text:
        return Icons.text_snippet;
      case CaptureType.link:
        return Icons.link;
      case CaptureType.voice:
        return Icons.mic;
      case CaptureType.image:
        return Icons.image;
      case CaptureType.file:
        return Icons.attach_file;
    }
  }
}
