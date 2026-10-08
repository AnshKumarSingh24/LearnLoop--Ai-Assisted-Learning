import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/capture.dart';

class CaptureCard extends StatelessWidget {
  final Capture capture;
  final bool isSelected;
  final VoidCallback onTap;

  const CaptureCard({
    super.key,
    required this.capture,
    this.isSelected = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: isSelected ? AppColors.surfaceHover : AppColors.surface,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? AppColors.orange : AppColors.border,
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  _TypeIcon(type: capture.type),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      capture.title ?? _generateTitle(capture),
                      style: AppTheme.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  _SourcePill(label: capture.sourceLabel),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                capture.contentPreview,
                style: AppTheme.inter(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Text(
                    _formatDate(capture.createdAt),
                    style: AppTheme.jetbrains(
                      fontSize: 10,
                      color: AppColors.textTertiary,
                    ),
                  ),
                  const Spacer(),
                  if (capture.spaceIds.isNotEmpty)
                    ...capture.spaceIds.take(2).map((_) => Container(
                          margin: const EdgeInsets.only(left: 4),
                          width: 6,
                          height: 6,
                          decoration: const BoxDecoration(
                            color: AppColors.violet,
                            shape: BoxShape.circle,
                          ),
                        )),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _generateTitle(Capture capture) {
    final content = capture.content;
    if (content.length > 40) return '${content.substring(0, 40)}...';
    return content;
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inMinutes < 1) return 'just now';
    if (diff.inHours < 1) return '${diff.inMinutes}m ago';
    if (diff.inDays < 1) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${date.day}/${date.month}/${date.year}';
  }
}

class _TypeIcon extends StatelessWidget {
  final CaptureType type;
  const _TypeIcon({required this.type});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(
        color: _colorForType.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Center(
        child: Icon(_iconForType, size: 14, color: _colorForType),
      ),
    );
  }

  Color get _colorForType {
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

  IconData get _iconForType {
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

class _SourcePill extends StatelessWidget {
  final String label;
  const _SourcePill({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Text(
        label,
        style: AppTheme.jetbrains(
          fontSize: 9,
          color: AppColors.textSecondary,
        ),
      ),
    );
  }
}
