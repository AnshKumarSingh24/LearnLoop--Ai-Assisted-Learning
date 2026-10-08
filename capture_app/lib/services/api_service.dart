import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/capture.dart';
import '../models/space.dart';
import '../models/entity.dart';
import '../models/contradiction.dart';
import '../utils/constants.dart';

class ApiService {
  final String baseUrl;
  final String? authToken;

  ApiService({this.baseUrl = apiBaseUrl, this.authToken});

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (authToken != null) 'Authorization': 'Bearer $authToken',
      };

  Future<List<Capture>> getCaptures({int limit = 20, int offset = 0}) async {
    final res = await http.get(
      Uri.parse('$baseUrl/captures?limit=$limit&offset=$offset'),
      headers: _headers,
    );
    if (res.statusCode != 200) throw Exception('Failed to load captures');
    final data = jsonDecode(res.body);
    return (data['items'] as List).map((e) => Capture.fromJson(e)).toList();
  }

  Future<Capture> createCapture(Capture capture) async {
    final res = await http.post(
      Uri.parse('$baseUrl/captures'),
      headers: _headers,
      body: jsonEncode(capture.toJson()),
    );
    if (res.statusCode != 200) throw Exception('Failed to create capture');
    return Capture.fromJson(jsonDecode(res.body));
  }

  Future<Capture> updateCapture(String id, Map<String, dynamic> updates) async {
    final res = await http.patch(
      Uri.parse('$baseUrl/captures/$id'),
      headers: _headers,
      body: jsonEncode(updates),
    );
    if (res.statusCode != 200) throw Exception('Failed to update capture');
    return Capture.fromJson(jsonDecode(res.body));
  }

  Future<void> deleteCapture(String id) async {
    await http.delete(
      Uri.parse('$baseUrl/captures/$id'),
      headers: _headers,
    );
  }

  Future<Map<String, dynamic>> searchCaptures(
    String query, {
    String? spaceId,
    bool synthesize = false,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/captures/search'),
      headers: _headers,
      body: jsonEncode({
        'query': query,
        'space_id': spaceId,
        'synthesize': synthesize,
      }),
    );
    if (res.statusCode != 200) throw Exception('Search failed');
    return jsonDecode(res.body);
  }

  // Spaces
  Future<List<Space>> getSpaces() async {
    final res = await http.get(
      Uri.parse('$baseUrl/spaces'),
      headers: _headers,
    );
    if (res.statusCode != 200) throw Exception('Failed to load spaces');
    final data = jsonDecode(res.body);
    return (data['spaces'] as List).map((e) => Space.fromJson(e)).toList();
  }

  Future<Space> createSpace(Space space) async {
    final res = await http.post(
      Uri.parse('$baseUrl/spaces'),
      headers: _headers,
      body: jsonEncode(space.toJson()),
    );
    if (res.statusCode != 200) throw Exception('Failed to create space');
    return Space.fromJson(jsonDecode(res.body));
  }

  Future<Map<String, dynamic>> getSpaceContext(String spaceId) async {
    final res = await http.get(
      Uri.parse('$baseUrl/spaces/$spaceId/context'),
      headers: _headers,
    );
    if (res.statusCode != 200) throw Exception('Failed to load space context');
    return jsonDecode(res.body);
  }

  Future<void> addCaptureToSpace(String spaceId, String captureId) async {
    await http.post(
      Uri.parse('$baseUrl/spaces/$spaceId/captures'),
      headers: _headers,
      body: jsonEncode({'capture_id': captureId}),
    );
  }

  Future<void> removeCaptureFromSpace(String spaceId, String captureId) async {
    await http.delete(
      Uri.parse('$baseUrl/spaces/$spaceId/captures/$captureId'),
      headers: _headers,
    );
  }

  Future<Space> updateSpace(String id, Map<String, dynamic> updates) async {
    final res = await http.put(
      Uri.parse('$baseUrl/spaces/$id'),
      headers: _headers,
      body: jsonEncode(updates),
    );
    if (res.statusCode != 200) throw Exception('Failed to update space');
    return Space.fromJson(jsonDecode(res.body));
  }

  // Entities
  Future<List<Entity>> getSpaceEntities(String spaceId) async {
    final res = await http.get(
      Uri.parse('$baseUrl/spaces/$spaceId/entities'),
      headers: _headers,
    );
    if (res.statusCode != 200) throw Exception('Failed to load entities');
    final data = jsonDecode(res.body);
    return (data['entities'] as List).map((e) => Entity.fromJson(e)).toList();
  }

  // Contradictions
  Future<List<Contradiction>> getSpaceContradictions(String spaceId) async {
    final res = await http.get(
      Uri.parse('$baseUrl/spaces/$spaceId/contradictions'),
      headers: _headers,
    );
    if (res.statusCode != 200) throw Exception('Failed to load contradictions');
    final data = jsonDecode(res.body);
    return (data['contradictions'] as List)
        .map((e) => Contradiction.fromJson(e))
        .toList();
  }

  // MCP
  Future<Map<String, dynamic>> mcpAction(String action, Map<String, dynamic> params) async {
    final res = await http.post(
      Uri.parse('$baseUrl/mcp'),
      headers: _headers,
      body: jsonEncode({'action': action, 'params': params}),
    );
    if (res.statusCode != 200) throw Exception('MCP action failed');
    return jsonDecode(res.body);
  }

  // Metrics
  Future<Map<String, dynamic>> getMetricsSummary() async {
    final res = await http.get(
      Uri.parse('$baseUrl/metrics/summary'),
      headers: _headers,
    );
    if (res.statusCode != 200) throw Exception('Failed to load metrics');
    return jsonDecode(res.body);
  }
}
