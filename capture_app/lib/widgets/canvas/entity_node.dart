import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/entity.dart';

class EntityNodeWidget extends StatelessWidget {
  final Entity entity;
  final bool isSelected;
  final VoidCallback onTap;

  const EntityNodeWidget({
    super.key,
    required this.entity,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.violet.withValues(alpha: 0.2)
              : AppColors.surfaceElevated,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.violet : AppColors.border,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              entity.typeIcon,
              style: const TextStyle(fontSize: 12),
            ),
            const SizedBox(width: 6),
            Text(
              entity.canonicalName,
              style: AppTheme.inter(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: isSelected ? AppColors.violet : AppColors.textPrimary,
              ),
            ),
            if (entity.aliases.isNotEmpty) ...[
              const SizedBox(width: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  '+${entity.aliases.length}',
                  style: AppTheme.jetbrains(
                    fontSize: 8,
                    color: AppColors.textTertiary,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
