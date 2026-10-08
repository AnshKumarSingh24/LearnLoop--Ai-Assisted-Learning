const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:8000',
);

const int defaultPageSize = 20;
const double canvasMinScale = 0.1;
const double canvasMaxScale = 3.0;
const double defaultCanvasScale = 1.0;
const double nodeWidth = 280.0;
const double nodeMinHeight = 120.0;
const double nodeMaxHeight = 400.0;
const double entityNodeSize = 48.0;
const double edgeHitArea = 12.0;
