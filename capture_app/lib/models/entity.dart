import 'package:uuid/uuid.dart';

enum EntityType { person, project, decision, date, other }

class Entity {
  final String id;
  final String? spaceId;
  final String canonicalName;
  final List<String> aliases;
  final EntityType entityType;
  final DateTime createdAt;

  Entity({
    String? id,
    this.spaceId,
    required this.canonicalName,
    this.aliases = const [],
    this.entityType = EntityType.other,
    DateTime? createdAt,
  })  : id = id ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now();

  factory Entity.fromJson(Map<String, dynamic> json) {
    return Entity(
      id: json['id'] as String,
      spaceId: json['space_id'] as String?,
      canonicalName: json['canonical_name'] as String,
      aliases: (json['aliases'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      entityType: EntityType.values.firstWhere(
        (e) => e.name == json['entity_type'],
        orElse: () => EntityType.other,
      ),
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'space_id': spaceId,
      'canonical_name': canonicalName,
      'aliases': aliases,
      'entity_type': entityType.name,
      'created_at': createdAt.toIso8601String(),
    };
  }

  int get sourceCount => 0;

  String get typeIcon {
    switch (entityType) {
      case EntityType.person:
        return '👤';
      case EntityType.project:
        return '📁';
      case EntityType.decision:
        return '⚖️';
      case EntityType.date:
        return '📅';
      case EntityType.other:
        return '📌';
    }
  }
}

class EntityRelation {
  final String id;
  final String entityAId;
  final String entityBId;
  final String relationType;
  final String spaceId;
  final double confidence;
  final int coOccurrenceCount;

  EntityRelation({
    String? id,
    required this.entityAId,
    required this.entityBId,
    required this.relationType,
    required this.spaceId,
    this.confidence = 1.0,
    this.coOccurrenceCount = 1,
  }) : id = id ?? const Uuid().v4();

  factory EntityRelation.fromJson(Map<String, dynamic> json) {
    return EntityRelation(
      id: json['id'] as String,
      entityAId: json['entity_id_a'] as String,
      entityBId: json['entity_id_b'] as String,
      relationType: json['relation_type'] as String,
      spaceId: json['space_id'] as String,
      confidence: (json['confidence'] as num?)?.toDouble() ?? 1.0,
      coOccurrenceCount: json['co_occurrence_count'] as int? ?? 1,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'entity_id_a': entityAId,
      'entity_id_b': entityBId,
      'relation_type': relationType,
      'space_id': spaceId,
      'confidence': confidence,
      'co_occurrence_count': coOccurrenceCount,
    };
  }
}
