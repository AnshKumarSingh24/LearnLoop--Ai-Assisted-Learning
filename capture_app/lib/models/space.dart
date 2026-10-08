import 'package:uuid/uuid.dart';

class Space {
  final String id;
  final String userId;
  final String name;
  final String? description;
  final Map<String, dynamic> canvasState;
  final List<String> captureIds;
  final int captureCount;
  final DateTime createdAt;

  Space({
    String? id,
    required this.userId,
    required this.name,
    this.description,
    this.canvasState = const {},
    this.captureIds = const [],
    this.captureCount = 0,
    DateTime? createdAt,
  })  : id = id ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now();

  factory Space.fromJson(Map<String, dynamic> json) {
    return Space(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      canvasState: json['canvas_state'] as Map<String, dynamic>? ?? {},
      captureIds: (json['capture_ids'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      captureCount: json['capture_count'] as int? ?? 0,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'name': name,
      'description': description,
      'canvas_state': canvasState,
      'capture_ids': captureIds,
      'capture_count': captureCount,
      'created_at': createdAt.toIso8601String(),
    };
  }

  Space copyWith({
    String? name,
    String? description,
    Map<String, dynamic>? canvasState,
    List<String>? captureIds,
  }) {
    final newIds = captureIds ?? this.captureIds;
    return Space(
      id: id,
      userId: userId,
      name: name ?? this.name,
      description: description ?? this.description,
      canvasState: canvasState ?? this.canvasState,
      captureIds: newIds,
      captureCount: newIds.length,
      createdAt: createdAt,
    );
  }
}
