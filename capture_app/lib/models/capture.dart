import 'package:uuid/uuid.dart';

enum CaptureType { text, link, voice, image, file }

class Capture {
  final String id;
  final String userId;
  final CaptureType type;
  final String content;
  final String? title;
  final String? preview;
  final Map<String, dynamic> metadata;
  final List<String> spaceIds;
  final DateTime createdAt;
  final DateTime updatedAt;

  Capture({
    String? id,
    required this.userId,
    required this.type,
    required this.content,
    this.title,
    this.preview,
    this.metadata = const {},
    this.spaceIds = const [],
    DateTime? createdAt,
    DateTime? updatedAt,
  })  : id = id ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  factory Capture.fromJson(Map<String, dynamic> json) {
    return Capture(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      type: CaptureType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => CaptureType.text,
      ),
      content: json['content'] as String,
      title: json['title'] as String?,
      preview: json['preview'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>? ?? {},
      spaceIds: (json['space_ids'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'type': type.name,
      'content': content,
      'title': title,
      'preview': preview,
      'metadata': metadata,
      'space_ids': spaceIds,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  Capture copyWith({
    String? title,
    String? content,
    String? preview,
    Map<String, dynamic>? metadata,
    List<String>? spaceIds,
  }) {
    return Capture(
      id: id,
      userId: userId,
      type: type,
      content: content ?? this.content,
      title: title ?? this.title,
      preview: preview ?? this.preview,
      metadata: metadata ?? this.metadata,
      spaceIds: spaceIds ?? this.spaceIds,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }

  String get sourceLabel {
    if (metadata.containsKey('source')) return metadata['source'] as String;
    switch (type) {
      case CaptureType.voice:
        return 'voice memo';
      case CaptureType.image:
        return 'screenshot';
      case CaptureType.file:
        return 'file';
      case CaptureType.link:
        return 'link';
      case CaptureType.text:
        return 'text';
    }
  }

  String get contentPreview =>
      preview ?? content.substring(0, (content.length > 200 ? 200 : content.length));
}
