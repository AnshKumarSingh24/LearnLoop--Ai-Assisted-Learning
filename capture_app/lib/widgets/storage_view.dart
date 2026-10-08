import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_theme.dart';
import '../models/capture.dart';
import '../providers/captures_provider.dart';
import '../providers/spaces_provider.dart';

class StorageView extends ConsumerStatefulWidget {
  final Function(String) onShowOnCanvas;

  const StorageView({super.key, required this.onShowOnCanvas});

  @override
  ConsumerState<StorageView> createState() => _StorageViewState();
}

class _StorageViewState extends ConsumerState<StorageView> {
  bool _isGrid = false;
  String _sortBy = 'date';
  CaptureType? _filterType;
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final capturesAsync = ref.watch(capturesProvider);

    return Column(
      children: [
        _buildHeader(),
        const Divider(height: 1),
        _buildToolbar(),
        Expanded(
          child: capturesAsync.when(
            data: (captures) {
              final filtered = _applyFilters(captures);
              if (filtered.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.folder_open, size: 48, color: AppColors.textTertiary),
                      const SizedBox(height: 12),
                      Text(
                        _searchQuery.isEmpty
                            ? 'No captures yet'
                            : 'No captures match your filters',
                        style: AppTheme.inter(color: AppColors.textTertiary),
                      ),
                    ],
                  ),
                );
              }
              return _isGrid ? _buildGrid(filtered) : _buildList(filtered);
            },
            loading: () => const Center(child: CircularProgressIndicator(strokeWidth: 2)),
            error: (e, _) => Center(child: Text('Error: $e')),
          ),
        ),
      ],
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          const Icon(Icons.storage, size: 20, color: AppColors.textSecondary),
          const SizedBox(width: 10),
          Text('All Files', style: AppTheme.playfair(fontSize: 18)),
          const Spacer(),
          Text(
            'Raw storage — the ground truth',
            style: AppTheme.jetbrains(
              fontSize: 10,
              color: AppColors.textTertiary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToolbar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          // Search
          Expanded(
            flex: 2,
            child: Container(
              height: 32,
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.border),
              ),
              child: TextField(
                style: AppTheme.inter(fontSize: 12),
                onChanged: (v) => setState(() => _searchQuery = v),
                decoration: InputDecoration(
                  hintText: 'Search files...',
                  hintStyle: AppTheme.inter(fontSize: 12, color: AppColors.textTertiary),
                  prefixIcon: const Icon(Icons.search, size: 14, color: AppColors.textTertiary),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Type filter
          Container(
            height: 32,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            decoration: BoxDecoration(
              color: AppColors.surfaceElevated,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.border),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<CaptureType?>(
                value: _filterType,
                isDense: true,
                style: AppTheme.inter(fontSize: 11, color: AppColors.textSecondary),
                dropdownColor: AppColors.surfaceElevated,
                items: [
                  DropdownMenuItem(value: null, child: Text('All types', style: AppTheme.inter(fontSize: 11))),
                  ...CaptureType.values.map((t) => DropdownMenuItem(
                    value: t,
                    child: Text(t.name, style: AppTheme.inter(fontSize: 11)),
                  )),
                ],
                onChanged: (v) => setState(() => _filterType = v),
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Sort
          Container(
            height: 32,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            decoration: BoxDecoration(
              color: AppColors.surfaceElevated,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.border),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _sortBy,
                isDense: true,
                style: AppTheme.inter(fontSize: 11, color: AppColors.textSecondary),
                dropdownColor: AppColors.surfaceElevated,
                items: [
                  DropdownMenuItem(value: 'date', child: Text('Date', style: AppTheme.inter(fontSize: 11))),
                  DropdownMenuItem(value: 'type', child: Text('Type', style: AppTheme.inter(fontSize: 11))),
                  DropdownMenuItem(value: 'name', child: Text('Name', style: AppTheme.inter(fontSize: 11))),
                ],
                onChanged: (v) => setState(() => _sortBy = v ?? 'date'),
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Grid/List toggle
          Container(
            height: 32,
            decoration: BoxDecoration(
              color: AppColors.surfaceElevated,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  icon: Icon(Icons.grid_view, size: 14,
                      color: _isGrid ? AppColors.orange : AppColors.textTertiary),
                  onPressed: () => setState(() => _isGrid = true),
                  padding: const EdgeInsets.all(6),
                  constraints: const BoxConstraints(),
                ),
                IconButton(
                  icon: Icon(Icons.view_list, size: 14,
                      color: !_isGrid ? AppColors.orange : AppColors.textTertiary),
                  onPressed: () => setState(() => _isGrid = false),
                  padding: const EdgeInsets.all(6),
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildList(List<Capture> captures) {
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: captures.length,
      separatorBuilder: (_, __) => const SizedBox(height: 1),
      itemBuilder: (context, index) {
        final cap = captures[index];
        return _StorageListTile(capture: cap, onShowOnCanvas: widget.onShowOnCanvas);
      },
    );
  }

  Widget _buildGrid(List<Capture> captures) {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 2.5,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
      ),
      itemCount: captures.length,
      itemBuilder: (context, index) {
        final cap = captures[index];
        return _StorageGridTile(capture: cap, onShowOnCanvas: widget.onShowOnCanvas);
      },
    );
  }

  List<Capture> _applyFilters(List<Capture> captures) {
    var result = List<Capture>.from(captures);

    if (_filterType != null) {
      result = result.where((c) => c.type == _filterType).toList();
    }

    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      result = result.where((c) =>
          (c.title?.toLowerCase().contains(q) ?? false) ||
          c.content.toLowerCase().contains(q)).toList();
    }

    switch (_sortBy) {
      case 'date':
        result.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        break;
      case 'type':
        result.sort((a, b) => a.type.name.compareTo(b.type.name));
        break;
      case 'name':
        result.sort((a, b) =>
            (a.title ?? a.content).compareTo(b.title ?? b.content));
        break;
    }

    return result;
  }
}

class _StorageListTile extends StatelessWidget {
  final Capture capture;
  final Function(String) onShowOnCanvas;

  const _StorageListTile({required this.capture, required this.onShowOnCanvas});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          _TypeIcon(type: capture.type),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  capture.title ?? capture.content.substring(0, (capture.content.length > 40 ? 40 : capture.content.length)),
                  style: AppTheme.inter(fontSize: 12, fontWeight: FontWeight.w500),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  capture.contentPreview,
                  style: AppTheme.inter(fontSize: 10, color: AppColors.textTertiary),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          Text(
            capture.type.name,
            style: AppTheme.jetbrains(fontSize: 9, color: AppColors.textTertiary),
          ),
          const SizedBox(width: 8),
          Text(
            _formatDate(capture.createdAt),
            style: AppTheme.jetbrains(fontSize: 9, color: AppColors.textTertiary),
          ),
          const SizedBox(width: 8),
          if (capture.spaceIds.isNotEmpty)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.violetDim,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                '${capture.spaceIds.length} spaces',
                style: AppTheme.jetbrains(fontSize: 8, color: AppColors.violet),
              ),
            ),
          const SizedBox(width: 8),
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_horiz, size: 14, color: AppColors.textTertiary),
            onSelected: (v) {
              if (v == 'canvas') onShowOnCanvas(capture.id);
            },
            itemBuilder: (context) => [
              PopupMenuItem(value: 'canvas', child: Text('Show on canvas', style: AppTheme.inter(fontSize: 12))),
              PopupMenuItem(value: 'delete', child: Text('Delete', style: AppTheme.inter(fontSize: 12, color: AppColors.error))),
            ],
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}

class _StorageGridTile extends StatelessWidget {
  final Capture capture;
  final Function(String) onShowOnCanvas;

  const _StorageGridTile({required this.capture, required this.onShowOnCanvas});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              _TypeIcon(type: capture.type),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  capture.title ?? capture.content.substring(0, (capture.content.length > 25 ? 25 : capture.content.length)),
                  style: AppTheme.inter(fontSize: 11, fontWeight: FontWeight.w500),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            capture.contentPreview,
            style: AppTheme.inter(fontSize: 9, color: AppColors.textTertiary),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

class _TypeIcon extends StatelessWidget {
  final CaptureType type;
  const _TypeIcon({required this.type});

  @override
  Widget build(BuildContext context) {
    return Icon(_icon, size: 14, color: _color);
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
