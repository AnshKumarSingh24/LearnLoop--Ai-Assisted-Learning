import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_theme.dart';
import '../providers/spaces_provider.dart';
import '../providers/captures_provider.dart';

class Sidebar extends ConsumerWidget {
  final VoidCallback onNewCapture;
  final VoidCallback onImport;
  final String? selectedSpaceId;
  final Function(String?) onSpaceSelected;
  final VoidCallback onShowStorage;
  final VoidCallback onShowInbox;
  final bool showStorage;
  final bool showInbox;

  const Sidebar({
    super.key,
    required this.onNewCapture,
    required this.onImport,
    this.selectedSpaceId,
    required this.onSpaceSelected,
    required this.onShowStorage,
    required this.onShowInbox,
    this.showStorage = false,
    this.showInbox = false,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final spacesAsync = ref.watch(spacesProvider);

    return Container(
      width: 260,
      color: AppColors.surface,
      child: Column(
        children: [
          _buildHeader(),
          const Divider(height: 1),
          _buildSearchBar(),
          const SizedBox(height: 8),
          _buildNavSection(ref),
          const SizedBox(height: 16),
          _buildSpacesSection(ref, spacesAsync),
          const Spacer(),
          _buildAccountSection(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: AppColors.orange,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Center(
              child: Text(
                'C',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 18,
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Text(
            'Capture',
            style: AppTheme.playfair(fontSize: 20),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Container(
        height: 36,
        decoration: BoxDecoration(
          color: AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppColors.border),
        ),
        child: TextField(
          style: AppTheme.inter(fontSize: 13),
          decoration: InputDecoration(
            hintText: 'Search...',
            hintStyle: AppTheme.inter(
              fontSize: 13,
              color: AppColors.textTertiary,
            ),
            prefixIcon: const Icon(Icons.search, size: 16, color: AppColors.textTertiary),
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          ),
        ),
      ),
    );
  }

  Widget _buildNavSection(WidgetRef ref) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Column(
        children: [
          _NavItem(
            icon: Icons.home_outlined,
            label: 'Home',
            isActive: !showStorage && !showInbox && selectedSpaceId == null,
            onTap: () {
              onSpaceSelected(null);
              onShowInbox();
            },
          ),
          const SizedBox(height: 2),
          _NavItem(
            icon: Icons.inbox_outlined,
            label: 'Inbox',
            badge: ref.watch(capturesProvider).whenOrNull(
                  data: (c) => c.where((c) => c.spaceIds.isEmpty).length,
                ),
            isActive: showInbox,
            onTap: onShowInbox,
          ),
          const SizedBox(height: 2),
          _NavItem(
            icon: Icons.star_outline,
            label: 'Favorites',
            onTap: () {},
          ),
          const SizedBox(height: 2),
          _NavItem(
            icon: Icons.check_circle_outline,
            label: 'Tasks',
            onTap: () {},
          ),
          const SizedBox(height: 2),
          _NavItem(
            icon: Icons.storage_outlined,
            label: 'All Files',
            isActive: showStorage,
            onTap: onShowStorage,
          ),
          const SizedBox(height: 2),
          _NavItem(
            icon: Icons.tag,
            label: 'Tags',
            onTap: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildSpacesSection(WidgetRef ref, AsyncValue<List<Space>> spacesAsync) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                Text(
                  'SPACES',
                  style: AppTheme.jetbrains(
                    fontSize: 10,
                    color: AppColors.textTertiary,
                  ),
                ),
                const Spacer(),
                GestureDetector(
                  onTap: () => _showNewSpaceDialog(ref),
                  child: const Icon(Icons.add, size: 16, color: AppColors.textTertiary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: spacesAsync.when(
              data: (spaces) => ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                itemCount: spaces.length,
                itemBuilder: (context, index) {
                  final space = spaces[index];
                  final isSelected = space.id == selectedSpaceId;
                  return _SpaceItem(
                    space: space,
                    isSelected: isSelected,
                    onTap: () => onSpaceSelected(space.id),
                  );
                },
              ),
              loading: () => const Center(
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
              error: (_, __) => const SizedBox.shrink(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAccountSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        border: Border(top: BorderSide(color: AppColors.border)),
      ),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 14,
            backgroundColor: AppColors.violet,
            child: Text(
              'U',
              style: TextStyle(color: Colors.white, fontSize: 12),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'User',
                  style: AppTheme.inter(fontSize: 13),
                ),
                Text(
                  'Free Plan',
                  style: AppTheme.jetbrains(
                    fontSize: 10,
                    color: AppColors.textTertiary,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.logout, size: 16, color: AppColors.textTertiary),
        ],
      ),
    );
  }

  void _showNewSpaceDialog(WidgetRef ref) {
    final controller = TextEditingController();
    showDialog(
      context: ref.context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surfaceElevated,
        title: Text('New Space', style: AppTheme.playfair(fontSize: 18)),
        content: TextField(
          controller: controller,
          autofocus: true,
          style: AppTheme.inter(),
          decoration: InputDecoration(
            hintText: 'Space name',
            hintStyle: AppTheme.inter(color: AppColors.textTertiary),
            border: const OutlineInputBorder(
              borderSide: BorderSide(color: AppColors.border),
            ),
            focusedBorder: const OutlineInputBorder(
              borderSide: BorderSide(color: AppColors.orange),
            ),
          ),
          onSubmitted: (value) {
            if (value.trim().isNotEmpty) {
              ref.read(spacesProvider.notifier).create(value.trim());
              Navigator.pop(context);
            }
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel', style: AppTheme.inter(color: AppColors.textSecondary)),
          ),
          TextButton(
            onPressed: () {
              if (controller.text.trim().isNotEmpty) {
                ref.read(spacesProvider.notifier).create(controller.text.trim());
                Navigator.pop(context);
              }
            },
            child: Text('Create', style: AppTheme.inter(color: AppColors.orange)),
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final int? badge;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    this.isActive = false,
    this.badge,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: isActive ? AppColors.orangeDim : Colors.transparent,
      borderRadius: BorderRadius.circular(8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Row(
            children: [
              Icon(
                icon,
                size: 18,
                color: isActive ? AppColors.orange : AppColors.textSecondary,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  label,
                  style: AppTheme.inter(
                    fontSize: 13,
                    color: isActive ? AppColors.orange : AppColors.textSecondary,
                    fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
                  ),
                ),
              ),
              if (badge != null && badge! > 0)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.orange,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '$badge',
                    style: AppTheme.jetbrains(
                      fontSize: 9,
                      color: Colors.white,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SpaceItem extends StatelessWidget {
  final Space space;
  final bool isSelected;
  final VoidCallback onTap;

  const _SpaceItem({
    required this.space,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: isSelected ? AppColors.violetDim : Colors.transparent,
      borderRadius: BorderRadius.circular(8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Row(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.violet : AppColors.textTertiary,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      space.name,
                      style: AppTheme.inter(
                        fontSize: 13,
                        color: isSelected ? AppColors.violet : AppColors.textPrimary,
                        fontWeight:
                            isSelected ? FontWeight.w600 : FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      '${space.captureCount} captures',
                      style: AppTheme.jetbrains(
                        fontSize: 9,
                        color: AppColors.textTertiary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
