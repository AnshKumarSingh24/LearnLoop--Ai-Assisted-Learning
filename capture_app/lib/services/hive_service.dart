import 'dart:convert';
import 'package:hive_flutter/hive_flutter.dart';
import '../models/capture.dart';
import '../models/space.dart';

class HiveService {
  static const _capturesBox = 'captures';
  static const _spacesBox = 'spaces';
  static const _canvasPositionsBox = 'canvas_positions';

  Future<void> init() async {
    await Hive.initFlutter();
    await Hive.openBox<String>(_capturesBox);
    await Hive.openBox<String>(_spacesBox);
    await Hive.openBox<String>(_canvasPositionsBox);
  }

  // Captures
  List<Capture> getCachedCaptures() {
    final box = Hive.box<String>(_capturesBox);
    return box.values.map((e) => Capture.fromJson(jsonDecode(e))).toList();
  }

  void cacheCaptures(List<Capture> captures) {
    final box = Hive.box<String>(_capturesBox);
    for (final capture in captures) {
      box.put(capture.id, jsonEncode(capture.toJson()));
    }
  }

  void cacheCapture(Capture capture) {
    final box = Hive.box<String>(_capturesBox);
    box.put(capture.id, jsonEncode(capture.toJson()));
  }

  void removeCachedCapture(String id) {
    Hive.box<String>(_capturesBox).delete(id);
  }

  // Spaces
  List<Space> getCachedSpaces() {
    final box = Hive.box<String>(_spacesBox);
    return box.values.map((e) => Space.fromJson(jsonDecode(e))).toList();
  }

  void cacheSpaces(List<Space> spaces) {
    final box = Hive.box<String>(_spacesBox);
    for (final space in spaces) {
      box.put(space.id, jsonEncode(space.toJson()));
    }
  }

  void cacheSpace(Space space) {
    final box = Hive.box<String>(_spacesBox);
    box.put(space.id, jsonEncode(space.toJson()));
  }

  void removeCachedSpace(String id) {
    Hive.box<String>(_spacesBox).delete(id);
  }

  // Canvas positions (per Space)
  Map<String, Map<String, dynamic>> getCanvasPositions(String spaceId) {
    final box = Hive.box<String>(_canvasPositionsBox);
    final raw = box.get(spaceId);
    if (raw == null) return {};
    final decoded = jsonDecode(raw) as Map<String, dynamic>;
    return decoded.map((k, v) => MapEntry(k, v as Map<String, dynamic>));
  }

  void saveCanvasPositions(String spaceId, Map<String, dynamic> positions) {
    final box = Hive.box<String>(_canvasPositionsBox);
    box.put(spaceId, jsonEncode(positions));
  }

  void clearAll() {
    Hive.box<String>(_capturesBox).clear();
    Hive.box<String>(_spacesBox).clear();
    Hive.box<String>(_canvasPositionsBox).clear();
  }
}
