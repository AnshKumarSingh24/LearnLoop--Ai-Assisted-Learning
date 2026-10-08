import 'package:uuid/uuid.dart';

enum ContradictionSeverity { high, medium, low }
enum ContradictionStatus { unresolved, resolved, dismissed }

class Contradiction {
  final String id;
  final String? spaceId;
  final String description;
  final ContradictionSeverity severity;
  final ContradictionStatus status;
  final List<String> sourceCaptureIds;
  final DateTime createdAt;

  Contradiction({
    String? id,
    this.spaceId,
    required this.description,
    this.severity = ContradictionSeverity.medium,
    this.status = ContradictionStatus.unresolved,
    this.sourceCaptureIds = const [],
    DateTime? createdAt,
  })  : id = id ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now();

  factory Contradiction.fromJson(Map<String, dynamic> json) {
    return Contradiction(
      id: json['id'] as String,
      spaceId: json['space_id'] as String?,
      description: json['description'] as String,
      severity: ContradictionSeverity.values.firstWhere(
        (e) => e.name == json['severity'],
        orElse: () => ContradictionSeverity.medium,
      ),
      status: ContradictionStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => ContradictionStatus.unresolved,
      ),
      sourceCaptureIds: (json['sources'] as List<dynamic>?)
              ?.map((e) => e is Map ? e['capture_id'] as String : e as String)
              .toList() ??
          [],
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'space_id': spaceId,
      'description': description,
      'severity': severity.name,
      'status': status.name,
      'created_at': createdAt.toIso8601String(),
    };
  }

  Contradiction copyWith({
    ContradictionStatus? status,
  }) {
    return Contradiction(
      id: id,
      spaceId: spaceId,
      description: description,
      severity: severity,
      status: status ?? this.status,
      sourceCaptureIds: sourceCaptureIds,
      createdAt: createdAt,
    );
  }

  String get severityIcon {
    switch (severity) {
      case ContradictionSeverity.high:
        return '🔴';
      case ContradictionSeverity.medium:
        return '🟡';
      case ContradictionSeverity.low:
        return '🔵';
    }
  }

  bool get isUnresolved => status == ContradictionStatus.unresolved;
}
