import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_theme.dart';
import '../models/capture.dart';
import '../providers/captures_provider.dart';
import '../providers/spaces_provider.dart';
import '../widgets/capture_card.dart';

class InboxView extends ConsumerStatefulWidget {
  final Function(Capture) onCaptureSelected;
  final Capture? selectedCapture;

  const InboxView({
    super.key,
    required this.onCaptureSelected,
    this.selectedCapture,
  });

  @override
  ConsumerState<InboxView> createState() => _InboxViewState();
}

class _InboxViewState extends ConsumerState<InboxView> {
  String _filterType = 'all';

  @override
  Widget build(BuildContext context) {
    final capturesAsync = ref.watch(capturesProvider);

    return Column(
      children: [
        _buildHeader(),
        const Divider(height: 1),
        _buildFilterBar(),
        Expanded(
          child: capturesAsync.when(
            data: (captures) {
              final unsorted = captures
                  .where((c) => c.spaceIds.isEmpty)
                  .toList()
                ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

              final filtered = _filterType == 'all'
                  ? unsorted
                  : unsorted.where((c) => c.type.name == _filterType).toList();

              if (filtered.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.inbox, size: 48, color: AppColors.textTertiary),
                      const SizedBox(height: 12),
                      Text(
                        'Inbox is empty',
                        style: AppTheme.inter(
                          fontSize: 16,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Captures will appear here before being added to a Space',
                        style: AppTheme.inter(
                          fontSize: 12,
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ),
                );
              }

              return ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: filtered.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final cap = filtered[index];
                  return CaptureCard(
                    capture: cap,
                    isSelected: widget.selectedCapture?.id == cap.id,
                    onTap: () => widget.onCaptureSelected(cap),
                  );
                },
              );
            },
            loading: () => const Center(
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
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
          const Icon(Icons.inbox, size: 20, color: AppColors.orange),
          const SizedBox(width: 10),
          Text('Inbox', style: AppTheme.playfair(fontSize: 18)),
          const Spacer(),
          Text(
            'Everything, unsorted',
            style: AppTheme.jetbrains(
              fontSize: 10,
              color: AppColors.textTertiary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          _FilterChip(
            label: 'All',
            isActive: _filterType == 'all',
            onTap: () => setState(() => _filterType = 'all'),
          ),
          const SizedBox(width: 6),
          _FilterChip(
            label: 'Text',
            isActive: _filterType == 'text',
            onTap: () => setState(() => _filterType = 'text'),
          ),
          const SizedBox(width: 6),
          _FilterChip(
            label: 'Voice',
            isActive: _filterType == 'voice',
            onTap: () => setState(() => _filterType = 'voice'),
          ),
          const SizedBox(width: 6),
          _FilterChip(
            label: 'Image',
            isActive: _filterType == 'image',
            onTap: () => setState(() => _filterType = 'image'),
          ),
          const SizedBox(width: 6),
          _FilterChip(
            label: 'Link',
            isActive: _filterType == 'link',
            onTap: () => setState(() => _filterType = 'link'),
          ),
          const SizedBox(width: 6),
          _FilterChip(
            label: 'File',
            isActive: _filterType == 'file',
            onTap: () => setState(() => _filterType = 'file'),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isActive ? AppColors.orangeDim : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isActive ? AppColors.orange : AppColors.border,
          ),
        ),
        child: Text(
          label,
          style: AppTheme.jetbrains(
            fontSize: 10,
            color: isActive ? AppColors.orange : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
