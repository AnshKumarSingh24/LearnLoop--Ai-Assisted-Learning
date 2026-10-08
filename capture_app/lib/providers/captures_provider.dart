import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/capture.dart';
import '../services/api_service.dart';
import '../services/hive_service.dart';

final apiServiceProvider = Provider<ApiService>((ref) => ApiService());

final hiveServiceProvider = Provider<HiveService>((ref) => HiveService());

final capturesProvider =
    StateNotifierProvider<CapturesNotifier, AsyncValue<List<Capture>>>(
  (ref) => CapturesNotifier(ref),
);

class CapturesNotifier extends StateNotifier<AsyncValue<List<Capture>>> {
  final Ref ref;
  final List<Capture> _localCaptures = [];

  CapturesNotifier(this.ref) : super(const AsyncValue.loading()) {
    _load();
  }

  Future<void> _load() async {
    final hive = ref.read(hiveServiceProvider);
    final cached = hive.getCachedCaptures();
    if (cached.isNotEmpty) {
      _localCaptures.addAll(cached);
      state = AsyncValue.data(List.unmodifiable(_localCaptures));
    }
    try {
      final api = ref.read(apiServiceProvider);
      final fresh = await api.getCaptures(limit: 100);
      _localCaptures
        ..clear()
        ..addAll(fresh);
      hive.cacheCaptures(fresh);
      state = AsyncValue.data(List.unmodifiable(_localCaptures));
    } catch (e, st) {
      if (_localCaptures.isEmpty) {
        state = AsyncValue.error(e, st);
      }
    }
  }

  Future<Capture> create(Capture capture) async {
    final api = ref.read(apiServiceProvider);
    final created = await api.createCapture(capture);
    _localCaptures.insert(0, created);
    ref.read(hiveServiceProvider).cacheCapture(created);
    state = AsyncValue.data(List.unmodifiable(_localCaptures));
    return created;
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    _localCaptures.clear();
    await _load();
  }

  List<Capture> getBySpaceId(String spaceId) {
    return _localCaptures.where((c) => c.spaceIds.contains(spaceId)).toList();
  }

  List<Capture> getUnsorted() {
    return _localCaptures.where((c) => c.spaceIds.isEmpty).toList();
  }
}
