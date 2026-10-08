import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_theme.dart';
import '../providers/spaces_provider.dart';
import '../widgets/canvas/infinite_canvas.dart';

class SpaceScreen extends ConsumerWidget {
  final String spaceId;
  final VoidCallback onBack;

  const SpaceScreen({
    super.key,
    required this.spaceId,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final spaceContextAsync = ref.watch(spaceContextProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          _buildHeader(ref, spaceContextAsync),
          const Divider(height: 1, color: AppColors.border),
          Expanded(
            child: spaceContextAsync.when(
              data: (data) {
                if (data == null) {
                  return const Center(child: Text('Space not found'));
                }
                return InfiniteCanvas(
                  spaceId: spaceId,
                  captures: data.captures,
                  entities: data.entities,
                  contradictions: data.contradictions,
                );
              },
              loading: () => const Center(
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
              error: (e, _) => Center(child: Text('Error: $e')),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(WidgetRef ref, AsyncValue<SpaceContextData?> data) {
    final spaces = ref.watch(spacesProvider).valueOrNull ?? [];
    final space = spaces.where((s) => s.id == spaceId).firstOrNull;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, size: 18),
            onPressed: onBack,
            color: AppColors.textSecondary,
          ),
          const SizedBox(width: 8),
          Container(
            width: 10,
            height: 10,
            decoration: const BoxDecoration(
              color: AppColors.violet,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 10),
          Text(
            space?.name ?? 'Space',
            style: AppTheme.playfair(fontSize: 16),
          ),
          const SizedBox(width: 8),
          data.whenOrNull(
            data: (ctx) => ctx != null
                ? Text(
                    '${ctx.captures.length} captures · ${ctx.entities.length} entities',
                    style: AppTheme.jetbrains(
                      fontSize: 10,
                      color: AppColors.textTertiary,
                    ),
                  )
                : null,
            orElse: () => null,
          ) ?? const SizedBox.shrink(),
          const Spacer(),
          // Contradiction count badge
          data.whenOrNull(
            data: (ctx) => ctx != null && ctx.contradictions.any((c) => c.isUnresolved)
                ? Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.warning.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.warning),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.warning, size: 12, color: AppColors.warning),
                        const SizedBox(width: 4),
                        Text(
                          '${ctx.contradictions.where((c) => c.isUnresolved).length} contradictions',
                          style: AppTheme.jetbrains(
                            fontSize: 9,
                            color: AppColors.warning,
                          ),
                        ),
                      ],
                    ),
                  )
                : null,
            orElse: () => null,
          ) ?? const SizedBox.shrink(),
          const SizedBox(width: 8),
          Text(
            'Canvas',
            style: AppTheme.jetbrains(
              fontSize: 10,
              color: AppColors.textTertiary,
            ),
          ),
        ],
      ),
    );
  }
}
