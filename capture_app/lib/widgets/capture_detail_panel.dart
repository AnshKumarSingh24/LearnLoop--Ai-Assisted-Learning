import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/capture.dart';

class CaptureDetailPanel extends StatelessWidget {
  final Capture? capture;
  final VoidCallback? onClose;

  const CaptureDetailPanel({
    super.key,
    this.capture,
    this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    if (capture == null) {
      return Container(
        width: 380,
        color: AppColors.surface,
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.touch_app, size: 48, color: AppColors.textTertiary),
              const SizedBox(height: 12),
              Text(
                'Select a capture to view',
                style: AppTheme.inter(
                  fontSize: 14,
                  color: AppColors.textTertiary,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Container(
      width: 380,
      color: AppColors.surface,
      child: Column(
        children: [
          _buildHeader(),
          const Divider(height: 1),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTitle(),
                  const SizedBox(height: 12),
                  _buildTags(),
                  const SizedBox(height: 20),
                  _buildContent(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          _buildTypeChip(),
          const Spacer(),
          IconButton(
            icon: const Icon(Icons.star_outline, size: 20),
            onPressed: () {},
            color: AppColors.textSecondary,
          ),
          IconButton(
            icon: const Icon(Icons.share_outlined, size: 20),
            onPressed: () {},
            color: AppColors.textSecondary,
          ),
          IconButton(
            icon: const Icon(Icons.more_horiz, size: 20),
            onPressed: () {},
            color: AppColors.textSecondary,
          ),
          if (onClose != null)
            IconButton(
              icon: const Icon(Icons.close, size: 20),
              onPressed: onClose,
              color: AppColors.textSecondary,
            ),
        ],
      ),
    );
  }

  Widget _buildTypeChip() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: _colorForType(capture!.type).withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(_iconForType(capture!.type), size: 12, color: _colorForType(capture!.type)),
          const SizedBox(width: 4),
          Text(
            capture!.type.name.toUpperCase(),
            style: AppTheme.jetbrains(
              fontSize: 9,
              color: _colorForType(capture!.type),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTitle() {
    return Text(
      capture!.title ?? capture!.content.substring(0, (capture!.content.length > 60 ? 60 : capture!.content.length)),
      style: AppTheme.playfair(fontSize: 22),
    );
  }

  Widget _buildTags() {
    final tags = <String>[];
    if (capture!.spaceIds.isNotEmpty) tags.addAll(capture!.spaceIds.take(2).map((_) => 'Space'));
    tags.add(capture!.sourceLabel);
    if (capture!.metadata.containsKey('module')) tags.add(capture!.metadata['module'] as String);

    return Wrap(
      spacing: 6,
      runSpacing: 6,
      children: tags.map((tag) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Text(
          tag,
          style: AppTheme.jetbrains(
            fontSize: 10,
            color: AppColors.textSecondary,
          ),
        ),
      )).toList(),
    );
  }

  Widget _buildContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Content',
          style: AppTheme.jetbrains(
            fontSize: 10,
            color: AppColors.textTertiary,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surfaceElevated,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: AppColors.border),
          ),
          child: Text(
            capture!.content,
            style: AppTheme.inter(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.6,
            ),
          ),
        ),
        const SizedBox(height: 20),
        _buildMetadata(),
      ],
    );
  }

  Widget _buildMetadata() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Metadata',
          style: AppTheme.jetbrains(
            fontSize: 10,
            color: AppColors.textTertiary,
          ),
        ),
        const SizedBox(height: 8),
        _MetadataRow(label: 'ID', value: capture!.id.substring(0, 8)),
        _MetadataRow(label: 'Created', value: _formatDateTime(capture!.createdAt)),
        _MetadataRow(label: 'Updated', value: _formatDateTime(capture!.updatedAt)),
        _MetadataRow(label: 'Type', value: capture!.type.name),
        if (capture!.metadata.isNotEmpty)
          ...capture!.metadata.entries.map((e) =>
              _MetadataRow(label: e.key, value: e.value.toString())),
      ],
    );
  }

  String _formatDateTime(DateTime dt) {
    return '${dt.day}/${dt.month}/${dt.year} ${dt.hour}:${dt.minute.toString().padLeft(2, '0')}';
  }

  Color _colorForType(CaptureType type) {
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

  IconData _iconForType(CaptureType type) {
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

class _MetadataRow extends StatelessWidget {
  final String label;
  final String value;
  const _MetadataRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          SizedBox(
            width: 80,
            child: Text(
              label,
              style: AppTheme.jetbrains(
                fontSize: 10,
                color: AppColors.textTertiary,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: AppTheme.jetbrains(
                fontSize: 10,
                color: AppColors.textSecondary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
