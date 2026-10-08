import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_theme.dart';
import '../models/capture.dart';
import '../providers/spaces_provider.dart';
import '../providers/captures_provider.dart';
import '../widgets/sidebar.dart';
import '../widgets/inbox_view.dart';
import '../widgets/capture_detail_panel.dart';
import '../widgets/storage_view.dart';
import 'space_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  Capture? _selectedCapture;
  String? _selectedSpaceId;
  bool _showStorage = false;
  bool _showInbox = true;
  bool _showDetail = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Row(
        children: [
          Sidebar(
            onNewCapture: _createNewCapture,
            onImport: _importCapture,
            selectedSpaceId: _selectedSpaceId,
            onSpaceSelected: _onSpaceSelected,
            onShowStorage: _onShowStorage,
            onShowInbox: _onShowInbox,
            showStorage: _showStorage,
            showInbox: _showInbox,
          ),
          const VerticalDivider(width: 1, color: AppColors.border),
          Expanded(
            child: _buildMainContent(),
          ),
          if (_showDetail)
            const VerticalDivider(width: 1, color: AppColors.border),
          if (_showDetail)
            CaptureDetailPanel(
              capture: _selectedCapture,
              onClose: () => setState(() {
                _showDetail = false;
                _selectedCapture = null;
              }),
            ),
        ],
      ),
    );
  }

  Widget _buildMainContent() {
    if (_selectedSpaceId != null && !_showStorage && !_showInbox) {
      return SpaceScreen(
        spaceId: _selectedSpaceId!,
        onBack: () => setState(() {
          _selectedSpaceId = null;
          _showInbox = true;
        }),
      );
    }

    if (_showStorage) {
      return StorageView(
        onShowOnCanvas: _showCaptureOnCanvas,
      );
    }

    return InboxView(
      onCaptureSelected: (capture) {
        setState(() {
          _selectedCapture = capture;
          _showDetail = true;
        });
      },
      selectedCapture: _selectedCapture,
    );
  }

  void _onSpaceSelected(String? spaceId) {
    setState(() {
      _selectedSpaceId = spaceId;
      _showStorage = false;
      _showInbox = spaceId == null;
      _selectedCapture = null;
      _showDetail = false;
    });
  }

  void _onShowStorage() {
    setState(() {
      _showStorage = true;
      _showInbox = false;
      _selectedSpaceId = null;
      _selectedCapture = null;
      _showDetail = false;
    });
  }

  void _onShowInbox() {
    setState(() {
      _showInbox = true;
      _showStorage = false;
      _selectedSpaceId = null;
      _selectedCapture = null;
      _showDetail = false;
    });
  }

  Future<void> _createNewCapture() async {
    final controller = TextEditingController();
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surfaceElevated,
        title: Text('New Capture', style: AppTheme.playfair(fontSize: 18)),
        content: TextField(
          controller: controller,
          autofocus: true,
          maxLines: 5,
          style: AppTheme.inter(),
          decoration: InputDecoration(
            hintText: 'Type or paste content...',
            hintStyle: AppTheme.inter(color: AppColors.textTertiary),
            border: const OutlineInputBorder(
              borderSide: BorderSide(color: AppColors.border),
            ),
            focusedBorder: const OutlineInputBorder(
              borderSide: BorderSide(color: AppColors.orange),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel', style: AppTheme.inter(color: AppColors.textSecondary)),
          ),
          TextButton(
            onPressed: () async {
              if (controller.text.trim().isNotEmpty) {
                final capture = Capture(
                  userId: '',
                  type: CaptureType.text,
                  content: controller.text.trim(),
                );
                await ref.read(capturesProvider.notifier).create(capture);
                if (context.mounted) Navigator.pop(context);
              }
            },
            child: Text('Save', style: AppTheme.inter(color: AppColors.orange)),
          ),
        ],
      ),
    );
  }

  void _importCapture() {
    // TODO: File picker + import flow
  }

  void _showCaptureOnCanvas(String captureId) {
    // Find which space this capture belongs to and switch to it
    final captures = ref.read(capturesProvider).valueOrNull ?? [];
    final cap = captures.firstWhere(
      (c) => c.id == captureId,
      orElse: () => captures.first,
    );
    if (cap.spaceIds.isNotEmpty) {
      _onSpaceSelected(cap.spaceIds.first);
    }
  }
}
