import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/space.dart';
import '../models/entity.dart';
import '../models/contradiction.dart';
import '../models/capture.dart';
import 'captures_provider.dart';

final spacesProvider =
    StateNotifierProvider<SpacesNotifier, AsyncValue<List<Space>>>(
  (ref) => SpacesNotifier(ref),
);

class SpacesNotifier extends StateNotifier<AsyncValue<List<Space>>> {
  final Ref ref;

  SpacesNotifier(this.ref) : super(const AsyncValue.loading()) {
    _load();
  }

  Future<void> _load() async {
    final hive = ref.read(hiveServiceProvider);
    final cached = hive.getCachedSpaces();
    if (cached.isNotEmpty) {
      state = AsyncValue.data(List.unmodifiable(cached));
    }
    try {
      final api = ref.read(apiServiceProvider);
      final fresh = await api.getSpaces();
      hive.cacheSpaces(fresh);
      state = AsyncValue.data(List.unmodifiable(fresh));
    } catch (e, st) {
      if (state.valueOrNull == null || (state.valueOrNull?.isEmpty ?? true)) {
        state = AsyncValue.error(e, st);
      }
    }
  }

  Future<Space> create(String name, {String? description}) async {
    final api = ref.read(apiServiceProvider);
    final userId = '';
    final space = Space(userId: userId, name: name, description: description);
    final created = await api.createSpace(space);
    ref.read(hiveServiceProvider).cacheSpace(created);
    state = AsyncValue.data([created, ...?state.valueOrNull]);
    return created;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    await _load();
  }
}

// Per-Space context: captures, entities, contradictions
final selectedSpaceIdProvider = StateProvider<String?>((ref) => null);

final spaceContextProvider = FutureProvider.autoDispose<SpaceContextData?>(
  (ref) async {
    final spaceId = ref.watch(selectedSpaceIdProvider);
    if (spaceId == null) return null;

    final api = ref.read(apiServiceProvider);
    final results = await Future.wait([
      api.getSpaceContext(spaceId),
      api.getSpaceEntities(spaceId),
      api.getSpaceContradictions(spaceId),
    ]);

    final contextData = results[0] as Map<String, dynamic>;
    final entities = results[1] as List<Entity>;
    final contradictions = results[2] as List<Contradiction>;

    final captures = (contextData['captures'] as List)
        .map((e) => Capture.fromJson(e))
        .toList();

    return SpaceContextData(
      captures: captures,
      entities: entities,
      contradictions: contradictions,
    );
  },
);

class SpaceContextData {
  final List<Capture> captures;
  final List<Entity> entities;
  final List<Contradiction> contradictions;

  SpaceContextData({
    required this.captures,
    required this.entities,
    required this.contradictions,
  });

  List<Capture> get unresolvedContradictionCaptures {
    final ids = <String>{};
    for (final c in contradictions.where((c) => c.isUnresolved)) {
      ids.addAll(c.sourceCaptureIds);
    }
    return captures.where((c) => ids.contains(c.id)).toList();
  }
}

// Canvas positions
final canvasPositionsProvider =
    StateNotifierProvider<CanvasPositionsNotifier, Map<String, CanvasNode>>(
  (ref) => CanvasPositionsNotifier(),
);

class CanvasNode {
  final double x;
  final double y;
  final double width;
  final double height;
  final String type; // 'capture', 'entity', 'annotation'

  CanvasNode({
    required this.x,
    required this.y,
    this.width = 280,
    this.height = 160,
    this.type = 'capture',
  });

  CanvasNode copyWith({double? x, double? y, double? width, double? height}) {
    return CanvasNode(
      x: x ?? this.x,
      y: y ?? this.y,
      width: width ?? this.width,
      height: height ?? this.height,
      type: type,
    );
  }
}

class CanvasPositionsNotifier extends StateNotifier<Map<String, CanvasNode>> {
  CanvasPositionsNotifier() : super({});

  void loadPositions(String spaceId, Map<String, dynamic> raw) {
    final positions = <String, CanvasNode>{};
    raw.forEach((key, value) {
      if (value is Map<String, dynamic>) {
        positions[key] = CanvasNode(
          x: (value['x'] as num?)?.toDouble() ?? 0,
          y: (value['y'] as num?)?.toDouble() ?? 0,
          width: (value['width'] as num?)?.toDouble() ?? 280,
          height: (value['height'] as num?)?.toDouble() ?? 160,
          type: value['type'] as String? ?? 'capture',
        );
      }
    });
    state = positions;
  }

  void updatePosition(String nodeId, double x, double y) {
    final current = state[nodeId];
    if (current != null) {
      state = {...state, nodeId: current.copyWith(x: x, y: y)};
    }
  }

  void updateSize(String nodeId, double width, double height) {
    final current = state[nodeId];
    if (current != null) {
      state = {...state, nodeId: current.copyWith(width: width, height: height)};
    }
  }

  void addNode(String nodeId, double x, double y, {String type = 'capture'}) {
    state = {
      ...state,
      nodeId: CanvasNode(x: x, y: y, type: type),
    };
  }

  void removeNode(String nodeId) {
    state = {...state}..remove(nodeId);
  }

  Map<String, dynamic> toJson() {
    return state.map((k, v) => MapEntry(k, {
          'x': v.x,
          'y': v.y,
          'width': v.width,
          'height': v.height,
          'type': v.type,
        }));
  }
}

// Search
final searchQueryProvider = StateProvider<String>((ref) => '');

final searchResultsProvider =
    FutureProvider.autoDispose<Map<String, dynamic>?>((ref) async {
  final query = ref.watch(searchQueryProvider);
  if (query.trim().isEmpty) return null;
  final api = ref.read(apiServiceProvider);
  return api.searchCaptures(query, synthesize: true);
});

// Metrics
final metricsProvider = FutureProvider.autoDispose<Map<String, dynamic>?>(
  (ref) async {
    final api = ref.read(apiServiceProvider);
    try {
      return await api.getMetricsSummary();
    } catch (_) {
      return null;
    }
  },
);
