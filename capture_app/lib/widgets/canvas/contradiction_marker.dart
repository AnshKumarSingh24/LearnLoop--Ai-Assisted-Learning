import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/contradiction.dart';

class ContradictionMarkerWidget extends StatelessWidget {
  final Contradiction contradiction;
  final VoidCallback onTap;

  const ContradictionMarkerWidget({
    super.key,
    required this.contradiction,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: AppColors.warning,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: AppColors.warning.withValues(alpha: 0.3),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: const Center(
          child: Icon(
            Icons.warning,
            size: 16,
            color: Colors.black,
          ),
        ),
      ),
    );
  }
}
