import 'dart:math';
import 'package:flutter/material.dart';

class RelationEdgePainter extends CustomPainter {
  final Offset from;
  final Offset to;
  final Color color;
  final double strokeWidth;

  RelationEdgePainter({
    required this.from,
    required this.to,
    this.color = const Color(0xFF7C6EF7),
    this.strokeWidth = 2,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color.withValues(alpha: 0.6)
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    // Draw a curved line
    final path = Path();
    path.moveTo(from.dx, from.dy);

    final controlPoint1 = Offset(
      from.dx + (to.dx - from.dx) * 0.25,
      from.dy + (to.dy - from.dy) * 0.5,
    );
    final controlPoint2 = Offset(
      from.dx + (to.dx - from.dx) * 0.75,
      from.dy + (to.dy - from.dy) * 0.5,
    );

    path.cubicTo(
      controlPoint1.dx,
      controlPoint1.dy,
      controlPoint2.dx,
      controlPoint2.dy,
      to.dx,
      to.dy,
    );

    canvas.drawPath(path, paint);

    // Draw arrow at the end
    final arrowPaint = Paint()
      ..color = color.withValues(alpha: 0.6)
      ..style = PaintingStyle.fill;

    final angle = _calculateAngle(
      Offset(controlPoint2.dx, controlPoint2.dy),
      to,
    );

    final arrowSize = 8.0;
    final arrowPath = Path();
    arrowPath.moveTo(to.dx, to.dy);
    arrowPath.lineTo(
      to.dx - arrowSize * cos(angle - pi / 6),
      to.dy - arrowSize * sin(angle - pi / 6),
    );
    arrowPath.lineTo(
      to.dx - arrowSize * cos(angle + pi / 6),
      to.dy - arrowSize * sin(angle + pi / 6),
    );
    arrowPath.close();

    canvas.drawPath(arrowPath, arrowPaint);
  }

  double _calculateAngle(Offset from, Offset to) {
    return atan2(to.dy - from.dy, to.dx - from.dx);
  }

  @override
  bool shouldRepaint(covariant RelationEdgePainter oldDelegate) =>
      oldDelegate.from != from ||
      oldDelegate.to != to ||
      oldDelegate.color != color;
}
