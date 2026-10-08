import { DarwinityState, Space, Page, Course, BlockNode } from "@/types/darwinity";

const STORAGE_KEY = "darwinity-prototype-state";
// Bump this when a migration is needed.  The previous migration only ran for
// states with 5+ courses, which left repeated, interrupted generated courses
// in smaller libraries (the "Resume / 0%" rows users were seeing).
const TEST_COURSE_CLEANUP_KEY = "darwinity-generated-courses-cleaned-v2";

export const initialSpaces: Space[] = [
  {
    "id": "ml-ai",
    "name": "Machine Learning & AI",
    "icon": "\ud83e\udd16",
    "color": "#eef0fa",
    "description": "Neural network architectures, deep learning models, and automated pattern recognition.",
    "pageIds": [
      "page-ml-ai-1",
      "page-ml-ai-2",
      "page-ml-ai-3",
      "page-ml-ai-4",
      "page-ml-ai-5",
      "page-ml-ai-6",
      "page-ml-ai-7",
      "page-ml-ai-8",
      "page-ml-ai-9",
      "page-ml-ai-10",
      "page-ml-ai-11",
      "page-ml-ai-12",
      "page-ml-ai-13",
      "page-ml-ai-14",
      "page-ml-ai-15"
    ],
    "sourceIds": [
      "paper-ml-ai-1",
      "paper-ml-ai-2",
      "paper-ml-ai-3",
      "paper-ml-ai-4",
      "paper-ml-ai-5",
      "paper-ml-ai-6",
      "paper-ml-ai-7",
      "paper-ml-ai-8",
      "paper-ml-ai-9",
      "paper-ml-ai-10",
      "paper-ml-ai-11",
      "paper-ml-ai-12",
      "paper-ml-ai-13",
      "paper-ml-ai-14",
      "paper-ml-ai-15"
    ],
    "courseIds": [
      "course-ml-ai-101"
    ],
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "wireless-iot",
    "name": "Wireless & 6G IoT",
    "icon": "\ud83d\udce1",
    "color": "#e8f4f8",
    "description": "Next-gen wireless communication, backscatter networks, and IoT protocol design.",
    "pageIds": [
      "page-wireless-iot-1",
      "page-wireless-iot-2",
      "page-wireless-iot-3",
      "page-wireless-iot-4",
      "page-wireless-iot-5",
      "page-wireless-iot-6",
      "page-wireless-iot-7",
      "page-wireless-iot-8",
      "page-wireless-iot-9",
      "page-wireless-iot-10",
      "page-wireless-iot-11",
      "page-wireless-iot-12",
      "page-wireless-iot-13",
      "page-wireless-iot-14",
      "page-wireless-iot-15"
    ],
    "sourceIds": [
      "paper-wireless-iot-1",
      "paper-wireless-iot-2",
      "paper-wireless-iot-3",
      "paper-wireless-iot-4",
      "paper-wireless-iot-5",
      "paper-wireless-iot-6",
      "paper-wireless-iot-7",
      "paper-wireless-iot-8",
      "paper-wireless-iot-9",
      "paper-wireless-iot-10",
      "paper-wireless-iot-11",
      "paper-wireless-iot-12",
      "paper-wireless-iot-13",
      "paper-wireless-iot-14",
      "paper-wireless-iot-15"
    ],
    "courseIds": [
      "course-wireless-101"
    ],
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "hci-ui",
    "name": "Tangible & Spatial HCI",
    "icon": "\ud83d\udda5\ufe0f",
    "color": "#fef3c7",
    "description": "Tangible user interfaces, interactive computing, and physical-digital interaction paradigms.",
    "pageIds": [
      "page-hci-ui-1",
      "page-hci-ui-2",
      "page-hci-ui-3",
      "page-hci-ui-4",
      "page-hci-ui-5",
      "page-hci-ui-6",
      "page-hci-ui-7",
      "page-hci-ui-8",
      "page-hci-ui-9",
      "page-hci-ui-10",
      "page-hci-ui-11",
      "page-hci-ui-12",
      "page-hci-ui-13",
      "page-hci-ui-14",
      "page-hci-ui-15"
    ],
    "sourceIds": [
      "paper-hci-ui-1",
      "paper-hci-ui-2",
      "paper-hci-ui-3",
      "paper-hci-ui-4",
      "paper-hci-ui-5",
      "paper-hci-ui-6",
      "paper-hci-ui-7",
      "paper-hci-ui-8",
      "paper-hci-ui-9",
      "paper-hci-ui-10",
      "paper-hci-ui-11",
      "paper-hci-ui-12",
      "paper-hci-ui-13",
      "paper-hci-ui-14",
      "paper-hci-ui-15"
    ],
    "courseIds": [
      "course-hci-101"
    ],
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "power-energy",
    "name": "Smart Power & Grids",
    "icon": "\u26a1",
    "color": "#ecfdf5",
    "description": "High-voltage insulation, gas-insulated switchgear, and renewable microgrid control.",
    "pageIds": [
      "page-power-energy-1",
      "page-power-energy-2",
      "page-power-energy-3",
      "page-power-energy-4",
      "page-power-energy-5",
      "page-power-energy-6",
      "page-power-energy-7",
      "page-power-energy-8",
      "page-power-energy-9",
      "page-power-energy-10",
      "page-power-energy-11",
      "page-power-energy-12",
      "page-power-energy-13",
      "page-power-energy-14",
      "page-power-energy-15"
    ],
    "sourceIds": [
      "paper-power-energy-1",
      "paper-power-energy-2",
      "paper-power-energy-3",
      "paper-power-energy-4",
      "paper-power-energy-5",
      "paper-power-energy-6",
      "paper-power-energy-7",
      "paper-power-energy-8",
      "paper-power-energy-9",
      "paper-power-energy-10",
      "paper-power-energy-11",
      "paper-power-energy-12",
      "paper-power-energy-13",
      "paper-power-energy-14",
      "paper-power-energy-15"
    ],
    "courseIds": [
      "course-power-101"
    ],
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "biomedical-signal",
    "name": "Biomedical & Neural Systems",
    "icon": "\ud83e\ude7a",
    "color": "#fce7f3",
    "description": "Biosignal processing, electroencephalography, and non-invasive medical diagnostics.",
    "pageIds": [
      "page-biomedical-signal-1",
      "page-biomedical-signal-2",
      "page-biomedical-signal-3",
      "page-biomedical-signal-4",
      "page-biomedical-signal-5",
      "page-biomedical-signal-6",
      "page-biomedical-signal-7",
      "page-biomedical-signal-8",
      "page-biomedical-signal-9",
      "page-biomedical-signal-10",
      "page-biomedical-signal-11",
      "page-biomedical-signal-12",
      "page-biomedical-signal-13",
      "page-biomedical-signal-14",
      "page-biomedical-signal-15"
    ],
    "sourceIds": [
      "paper-biomedical-signal-1",
      "paper-biomedical-signal-2",
      "paper-biomedical-signal-3",
      "paper-biomedical-signal-4",
      "paper-biomedical-signal-5",
      "paper-biomedical-signal-6",
      "paper-biomedical-signal-7",
      "paper-biomedical-signal-8",
      "paper-biomedical-signal-9",
      "paper-biomedical-signal-10",
      "paper-biomedical-signal-11",
      "paper-biomedical-signal-12",
      "paper-biomedical-signal-13",
      "paper-biomedical-signal-14",
      "paper-biomedical-signal-15"
    ],
    "courseIds": [
      "course-biomed-101"
    ],
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  }
];

export const initialPages: Page[] = [
  {
    "id": "page-ml-ai-1",
    "spaceId": "ml-ai",
    "title": "Bargaining Game Based Time Scheduling Scheme for Ambient Backscatter Communications",
    "icon": "\ud83e\udd16",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-2",
    "spaceId": "ml-ai",
    "title": "The Use of Tangible User Interfaces in K12 Education Settings: A Systematic Mapping Study",
    "icon": "\ud83e\udd16",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-3",
    "spaceId": "ml-ai",
    "title": "Transient Surface Charge Characteristics of DC-GIL Insulator Under Thermal-Electric Coupled Fields",
    "icon": "\ud83e\udd16",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-4",
    "spaceId": "ml-ai",
    "title": "Electromagnetic Vibration Characteristics Analysis of a Squirrel-Cage Induction Motor Under Different Loading Conditions",
    "icon": "\ud83e\udd16",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-5",
    "spaceId": "ml-ai",
    "title": "kNN-STUFF: kNN STreaming Unit for Fpgas",
    "icon": "\ud83e\udd16",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-6",
    "spaceId": "ml-ai",
    "title": "Dynamic Order-Based Scheduling Algorithms for Automated Retrieval System in Smart Warehouses",
    "icon": "\ud83e\udd16",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-7",
    "spaceId": "ml-ai",
    "title": "A Matheuristic Algorithm for the Multiple-Depot Vehicle and Crew Scheduling Problem",
    "icon": "\ud83e\udd16",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-8",
    "spaceId": "ml-ai",
    "title": "Smart Optical Sensors for Internet of Things: Integration of Temperature Monitoring and Customized Security Physical Unclonable Functions",
    "icon": "\ud83e\udd16",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-9",
    "spaceId": "ml-ai",
    "title": "Sub-6 GHz Highly Isolated Wideband MIMO Antenna Arrays",
    "icon": "\ud83e\udd16",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-10",
    "spaceId": "ml-ai",
    "title": "Robust Charging Schedule for Autonomous Electric Vehicles With Uncertain Covariates",
    "icon": "\ud83e\udd16",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-11",
    "spaceId": "ml-ai",
    "title": "An Improved SVM-Based Spatial Spectrum Sensing Scheme via Beamspace at Low SNRs",
    "icon": "\ud83e\udd16",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-12",
    "spaceId": "ml-ai",
    "title": "Opportunistic Relay in Multicast Channels With Generalized Shadowed Fading Effects: A Physical Layer Security Perspective",
    "icon": "\ud83e\udd16",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-13",
    "spaceId": "ml-ai",
    "title": "Advances in Adversarial Attacks and Defenses in Computer Vision: A Survey",
    "icon": "\ud83e\udd16",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-14",
    "spaceId": "ml-ai",
    "title": "Multicriteria Classifier Ensemble Learning for Imbalanced Data",
    "icon": "\ud83e\udd16",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-ml-ai-15",
    "spaceId": "ml-ai",
    "title": "Autonomous Control of Combat Unmanned Aerial Vehicles to Evade Surface-to-Air Missiles Using Deep Reinforcement Learning",
    "icon": "\ud83e\udd16",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-1",
    "spaceId": "wireless-iot",
    "title": "Transverse Flux Machine\u2014A Review",
    "icon": "\ud83d\udce1",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-2",
    "spaceId": "wireless-iot",
    "title": "An Efficient Building Evacuation Algorithm in Congested Networks",
    "icon": "\ud83d\udce1",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-3",
    "spaceId": "wireless-iot",
    "title": "MSPL: Multimodal Self-Paced Learning for Multi-Omics Feature Selection and Data Integration",
    "icon": "\ud83d\udce1",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-4",
    "spaceId": "wireless-iot",
    "title": "Simultaneous Allocation of Multi-Type Distributed Generations and Capacitors Using Generic Analytical Expressions",
    "icon": "\ud83d\udce1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-5",
    "spaceId": "wireless-iot",
    "title": "Predicting Canine Posture With Smart Camera Networks Powered by the Artificial Intelligence of Things",
    "icon": "\ud83d\udce1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-6",
    "spaceId": "wireless-iot",
    "title": "Joint Optimization of Transmit Waveform and Receive Filter for Target Detection in MIMO Radar",
    "icon": "\ud83d\udce1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-7",
    "spaceId": "wireless-iot",
    "title": "Design Issues of Digital and Analog Chaotic RoF Link Using Chaos Message Masking",
    "icon": "\ud83d\udce1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-8",
    "spaceId": "wireless-iot",
    "title": "Aircraft Trajectory Prediction With Enriched Intent Using Encoder-Decoder Architecture",
    "icon": "\ud83d\udce1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-9",
    "spaceId": "wireless-iot",
    "title": "G2P-SLAM: Generalized RGB-D SLAM Framework for Mobile Robots in Low-Dynamic Environments",
    "icon": "\ud83d\udce1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-10",
    "spaceId": "wireless-iot",
    "title": "A TaOx-Based Electronic Synapse With High Precision for Neuromorphic Computing",
    "icon": "\ud83d\udce1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-11",
    "spaceId": "wireless-iot",
    "title": "Electrical Phenotyping of Human Brain Tissues: An Automated System for Tumor Delineation",
    "icon": "\ud83d\udce1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-12",
    "spaceId": "wireless-iot",
    "title": "Next-Generation Indoor Wireless Systems: Compatibility and Migration Case Study",
    "icon": "\ud83d\udce1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-13",
    "spaceId": "wireless-iot",
    "title": "Provable Secure Group Key Establishment Scheme for Fog Computing",
    "icon": "\ud83d\udce1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-14",
    "spaceId": "wireless-iot",
    "title": "A New Control Strategy for SR Generation System Based on Modified PT Control",
    "icon": "\ud83d\udce1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-wireless-iot-15",
    "spaceId": "wireless-iot",
    "title": "Rapid Quality Evaluation of Camellia Oleifera Seed Kernel Using a Developed Portable NIR With Optimal Wavelength Selection",
    "icon": "\ud83d\udce1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-1",
    "spaceId": "hci-ui",
    "title": "A Novel Combined Conductance Sensor for Water Cut Measurement of Low-Velocity Oil-Water Flow in Horizontal and Slightly Inclined Pipes",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-2",
    "spaceId": "hci-ui",
    "title": "Improving IoT Federation Resiliency With Distributed Ledger Technology",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-3",
    "spaceId": "hci-ui",
    "title": "Multivariate Nonlinear Sparse Mode Decomposition and Its Application in Gear Fault Diagnosis",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-4",
    "spaceId": "hci-ui",
    "title": "An Efficient Deep Learning Framework for Distracted Driver Detection",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-5",
    "spaceId": "hci-ui",
    "title": "Two-Dimensional RSSI-Based Indoor Localization Using Multiple Leaky Coaxial Cables With a Probabilistic Neural Network",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-6",
    "spaceId": "hci-ui",
    "title": "Partial Reachability Graph Analysis of Petri Nets for Flexible Manufacturing Systems",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-7",
    "spaceId": "hci-ui",
    "title": "Outage Probability Analysis for NOMA Downlink and Uplink Communication Systems With Generalized Fading Channels",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-8",
    "spaceId": "hci-ui",
    "title": "Machine Learning and Deep Learning Approaches for CyberSecurity: A Review",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-9",
    "spaceId": "hci-ui",
    "title": "Critical Challenges to Adopt DevOps Culture in Software Organizations: A Systematic Review",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-10",
    "spaceId": "hci-ui",
    "title": "SARD: Towards Scale-Aware Rotated Object Detection in Aerial Imagery",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-11",
    "spaceId": "hci-ui",
    "title": "Wind Speed Prediction Using Hybrid 1D CNN and BLSTM Network",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-12",
    "spaceId": "hci-ui",
    "title": "A Linear Fractional Transformation Based Approach to Robust Model Predictive Control Design in Uncertain Systems",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-13",
    "spaceId": "hci-ui",
    "title": "Enhanced Remote Areas Communications: The Missing Scenario for 5G and Beyond 5G Networks",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-14",
    "spaceId": "hci-ui",
    "title": "Delay-Dependent H\u221e Control for Singular Markovian Jump Systems With Generally Uncertain Transition Rates",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-hci-ui-15",
    "spaceId": "hci-ui",
    "title": "Investigating Frontal Neurovascular Coupling in Response to Workplace Design-Related Stress",
    "icon": "\ud83d\udda5\ufe0f",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-1",
    "spaceId": "power-energy",
    "title": "Transverse Damage Localization and Quantitative Size Estimation for Composite Laminates Based on Lamb Waves",
    "icon": "\u26a1",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-2",
    "spaceId": "power-energy",
    "title": "MSDF-Net: Multi-Scale Deep Fusion Network for Stroke Lesion Segmentation",
    "icon": "\u26a1",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-3",
    "spaceId": "power-energy",
    "title": "Deep Learning for Improving the Robustness of Image Encryption",
    "icon": "\u26a1",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-4",
    "spaceId": "power-energy",
    "title": "Study on Energized Mixed-phase Icing of CFCCW and its Effect on AC Corona Onset Voltage",
    "icon": "\u26a1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-5",
    "spaceId": "power-energy",
    "title": "A Distributed Survivable Routing Algorithm for Mega-Constellations With Inclined Orbits",
    "icon": "\u26a1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-6",
    "spaceId": "power-energy",
    "title": "A Hybrid Deep Learning Approach for Replay and DDoS Attack Detection in a Smart City",
    "icon": "\u26a1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-7",
    "spaceId": "power-energy",
    "title": "Occlusion Handling and Multi-Scale Pedestrian Detection Based on Deep Learning: A Review",
    "icon": "\u26a1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-8",
    "spaceId": "power-energy",
    "title": "Pattern Matching Based on Object Graphs",
    "icon": "\u26a1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-9",
    "spaceId": "power-energy",
    "title": "Nondestructive Acoustic Testing of Ceramic Capacitors Using One-Class Support Vector Machine With Automated Hyperparameter Selection",
    "icon": "\u26a1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-10",
    "spaceId": "power-energy",
    "title": "A Cross-Disciplinary View of Testing and Bioinformatic Analysis of SARS-CoV-2 and Other Human Respiratory Viruses in Pandemic Settings",
    "icon": "\u26a1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-11",
    "spaceId": "power-energy",
    "title": "An Industry 4.0 Asset Administration Shell-Enabled Digital Solution for Robot-Based Manufacturing Systems",
    "icon": "\u26a1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-12",
    "spaceId": "power-energy",
    "title": "High-Performance Time Series Prediction With Predictive Error Compensated Wavelet Neural Networks",
    "icon": "\u26a1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-13",
    "spaceId": "power-energy",
    "title": "IoTsecM: A UML/SysML Extension for Internet of Things Security Modeling",
    "icon": "\u26a1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-14",
    "spaceId": "power-energy",
    "title": "Electrodynamics of Axial-Flow Rotary Blood Pumps",
    "icon": "\u26a1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-power-energy-15",
    "spaceId": "power-energy",
    "title": "An LSTM-Based Approach for Understanding Human Interactions Using Hybrid Feature Descriptors Over Depth Sensors",
    "icon": "\u26a1",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-1",
    "spaceId": "biomedical-signal",
    "title": "Fractional-Fuzzy PID Control Approach of Photovoltaic-Wire Feeder System (PV-WFS): Simulation and HIL-Based Experimental Investigation",
    "icon": "\ud83e\ude7a",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-2",
    "spaceId": "biomedical-signal",
    "title": "Twin Delayed Deep Deterministic Policy Gradient-Based Target Tracking for Unmanned Aerial Vehicle With Achievement Rewarding and Multistage Training",
    "icon": "\ud83e\ude7a",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-3",
    "spaceId": "biomedical-signal",
    "title": "Refining the Fusion of Pepper Robot and Estimated Depth Maps Method for Improved 3D Perception",
    "icon": "\ud83e\ude7a",
    "favorite": true,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-4",
    "spaceId": "biomedical-signal",
    "title": "Parallel Computing for Obtaining Regional Scale Rice Growth Conditions Based on WOFOST and Satellite Images",
    "icon": "\ud83e\ude7a",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-5",
    "spaceId": "biomedical-signal",
    "title": "Reducing the System Overhead of Millimeter-Wave Beamforming With Neural Networks for 5G and Beyond",
    "icon": "\ud83e\ude7a",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-6",
    "spaceId": "biomedical-signal",
    "title": "Multidimensional Hierarchical Interpolation Method on Sparse Grids for the Absorption Problem",
    "icon": "\ud83e\ude7a",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-7",
    "spaceId": "biomedical-signal",
    "title": "An Efficient and Secure Public Key Authenticated Encryption With Keyword Search in the Logarithmic Time",
    "icon": "\ud83e\ude7a",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-8",
    "spaceId": "biomedical-signal",
    "title": "Identifying Incorrect Patches in Program Repair Based on Meaning of Source Code",
    "icon": "\ud83e\ude7a",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-9",
    "spaceId": "biomedical-signal",
    "title": "An LDPC Encoder Architecture With Up to 47.5 Gbps Throughput for DVB-S2/S2X Standards",
    "icon": "\ud83e\ude7a",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-10",
    "spaceId": "biomedical-signal",
    "title": "Magnetic Field and Temperature Dual-Parameter Sensor Based on Nonadiabatic Tapered Microfiber Cascaded With FBG",
    "icon": "\ud83e\ude7a",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-11",
    "spaceId": "biomedical-signal",
    "title": "Characterizing Scalar Metasurfaces Using Time-Domain Reflectometry",
    "icon": "\ud83e\ude7a",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-12",
    "spaceId": "biomedical-signal",
    "title": "Blockchain-Enabled Integrated Market Platform for Contract Production",
    "icon": "\ud83e\ude7a",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-13",
    "spaceId": "biomedical-signal",
    "title": "Exploiting Integrated Demand Response for Operating Reserve Provision Considering Rebound Effects",
    "icon": "\ud83e\ude7a",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-14",
    "spaceId": "biomedical-signal",
    "title": "Robust Multi-View Clustering With a Unified Weight Learning Paradigm",
    "icon": "\ud83e\ude7a",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  },
  {
    "id": "page-biomedical-signal-15",
    "spaceId": "biomedical-signal",
    "title": "Performance Analysis of Long Short-Term Memory-Based Markovian Spectrum Prediction",
    "icon": "\ud83e\ude7a",
    "favorite": false,
    "archived": false,
    "createdAt": "2026-09-01T08:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z"
  }
];

export const initialBlocks: BlockNode[] = [
  {
    "id": "blk-page-ml-ai-1-1",
    "pageId": "page-ml-ai-1",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Bargaining Game Based Time Scheduling Scheme for Ambient Backscatter Communications"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-1-2",
    "pageId": "page-ml-ai-1",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Sungwook Kim'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-1-3",
    "pageId": "page-ml-ai-1",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Backscatter communications have been acknowledged as an essential key technology in the Internet of Things (IoT) applications. Considering the fact that it needs the coordination from network agents, cooperative bargaining theory is an effective method to strike an appropriate system performance. In this paper, we investigate time scheduling algorithms for a backscatter-aided radio-frequency (RF) powered cognitive radio (CR) network, where multiple secondary transmitters can switch among the backscatter, the energy harvest, and active data transmission modes. Our objective is to maximize the RF-CR system performance while exploring the mutual benefits to leverage a reciprocal consensus between different control issues. According to the ideas of two different bargaining solutions - \nmodified Nash bargaining solution\n and \nequitable Nash bargaining solution\n, we design a new dual bargaining game model to effectively share the limited time resources. The main novelty of our proposed approach is its adaptability, flexibility and responsiveness to current RF-CR system conditions. At last, numerical simulations are carried out to evaluate the performance of the proposed scheme, and we demonstrate the benefits of our dual bargaining game approach."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-2-1",
    "pageId": "page-ml-ai-2",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "The Use of Tangible User Interfaces in K12 Education Settings: A Systematic Mapping Study"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-2-2",
    "pageId": "page-ml-ai-2",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Jos\u00e9 A. Gallud', 'Ricardo Tesoriero', 'Maria D. Lozano', 'Victor M. R. Penichet', 'Habib M. Fardoun'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-2-3",
    "pageId": "page-ml-ai-2",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Tangible User Interfaces have enriched and expanded the user experience when interacting with computers and smart devices. The monopoly of graphical user interfaces has been broken thanks to the emergence of new complementary technologies that allow for new ways of interacting with computer systems, such as tangible interaction, among others. Due to the scope and number of research articles addressing the Tangible User Interface that have been published, it can now be considered an interaction mechanism that is relatively mature and integrated within society. However, while the application of tangible interfaces in different areas is described as a success, there are only a limited number of research articles about their impact on education and learning systems. As a result, it is difficult to show the actual impact of Tangible User Interface technology in K12 education settings. This study tries to fill this gap by performing a systematic mapping study that shows the current state of research on the impact of this technology in these settings, analyzing the findings and identifying the main advances and limitations of this novel technology."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-3-1",
    "pageId": "page-ml-ai-3",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Transient Surface Charge Characteristics of DC-GIL Insulator Under Thermal-Electric Coupled Fields"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-3-2",
    "pageId": "page-ml-ai-3",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Xiaolong Li', 'Songling Han', 'Mingde Wan', 'Wen Wang', 'Zhenxin Geng', 'Xin Lin'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-3-3",
    "pageId": "page-ml-ai-3",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "The insulator in direct current gas-insulated transmission lines (DC-GIL) would suffer discharge risk due to surface charge accumulation under thermal-electric coupled fields. In this paper, the transient surface charge accumulation characteristics of a basin-type DC-GIL insulator is investigated via finite element method based on a three-dimension horizontally installed GIL model. The stationary temperature distribution of the model is obtained and then applied to the transient simulation of charge. Weak form partial differential equation is employed to deal with the ion transportation equation. Equations and parameters in the simulation are optimized to reduce the computing memory and time. Results indicate that the charge accumulation is accelerated due to the promotion of conduction through the insulator under thermal gradient. Higher charge density is obtained under thermal gradient. And the surface charge density of the convex surface is higher due to the promoted conduction. The highest field strength increases and the corresponding location moves along the convex surface during the transient process. This could attribute to the influence of transient charge behavior under thermal gradient on the electric field distribution. This study indicates that the thermal gradient and transient charge accumulation should be considered when dealing with the insulation characteristics of DC-GIL with insulators."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-4-1",
    "pageId": "page-ml-ai-4",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Electromagnetic Vibration Characteristics Analysis of a Squirrel-Cage Induction Motor Under Different Loading Conditions"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-4-2",
    "pageId": "page-ml-ai-4",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Defeng Kong', 'Zhijun Shuai', 'Wanyou Li', 'Donghua Wang'] | Year: 2019 | Citations: 3"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-4-3",
    "pageId": "page-ml-ai-4",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Electromagnetic vibration is an important excitation source for squirrel-cage induction motors. However, the electromagnetic vibration under various loadings has not been sufficiently analyzed. It is proposed in this paper that the electromagnetic vibration of motors under different loads can be obtained by analyzing the amplitude of the electromagnetic force wave. The Maxwell tensor method is employed to derive the spatial and temporal distributions of the radial force. This paper also calculates the radial force using the finite element method and decodes the calculated results using two dimensional fast Fourier transform (2D-FFT) to determine the amplitude of the electromagnetic force at the spatial order under different loads. In addition, through the modal analysis of the stator core, it can be concluded that in the case of nonresonance, the vibration response increases when the electromagnetic force of the first-order and second-order rotor slot harmonic increases. Finally, the conclusion is verified by separating the electromagnetic vibration of the motor using a vibration test rig."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-5-1",
    "pageId": "page-ml-ai-5",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "kNN-STUFF: kNN STreaming Unit for Fpgas"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-5-2",
    "pageId": "page-ml-ai-5",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Jo\u00e3o Vieira', 'Rui P. Duarte', 'Hor\u00e1cio C. Neto'] | Year: 2019 | Citations: 11"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-5-3",
    "pageId": "page-ml-ai-5",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "This paper presents kNN STreaming Unit For Fpgas (kNN-STUFF), a modular, scalable and efficient Hardware/Software implementation of k-Nearest Neighbors (kNN) classifier targeting System on Chip (SoC) devices. It takes advantage of custom accelerators, implemented on the reconfigurable fabric of the SoC device, to perform most of the classifier\u2019s workload, whereas the processor coordinates the accelerators and runs the remaining workload of the kNN algorithm. kNN-STUFF offers a highly flexible framework, where the designer has the possibility to define the number of parallel instances of the classifier and the parallelism within each instance. This capability allows creating the most suitable implementation for a target device of any size. Results show that kNN-STUFF, with 24 accelerators, attains performance improvements up to \n 67.4\\times 67.4\u00d767.4\\times  \n, when compared to an optimized (\u2212O3) software-only implementation of the kNN running on a single core of the ARM Cortex-A9 CPU. Furthermore, its energy efficiency improvements are as high as \n 50.6\\times 50.6\u00d750.6\\times  \n."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-6-1",
    "pageId": "page-ml-ai-6",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Dynamic Order-Based Scheduling Algorithms for Automated Retrieval System in Smart Warehouses"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-6-2",
    "pageId": "page-ml-ai-6",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Jialei Liu', 'Soung-Yue Liew', 'Boon Yaik Ooi', 'Donghong Qin'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-6-3",
    "pageId": "page-ml-ai-6",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "In typical e-commerce warehouse operations, upon receiving the orders from customers, the purchased items need to be retrieved from shelves and then packaged accordingly for delivery. To automate and speed up the item retrieval process, a Smart Warehouse usually employs a management system, called the Automated Retrieval System (ARS), to control and schedule the retrieval jobs. The working principle of ARS is crucial to the Smart Warehouse because it will have a great impact on the subsequent downstream processes. In short, all the items in a particular order should be considered as an integral part; if one of these items encounters a much larger retrieval delay than others do, then the entire order may experience an unnecessary latency. In the past, the integrality of order has not received much attention for the parallel retrieval process of multiple stackers. To take this into account, this paper proposes using an Order Tag to label all the items that belong to the same order for retrieval job scheduling. The way of calculating the Order Tags will then determine the scheduling discipline of the ARS. With the objectives of minimizing the average delay and ensuring the fairness, two algorithms are proposed. They are named as Dynamic Order-Based (DOB) and Dynamic Order-Based with Threshold (DOBT) Scheduling Algorithms, respectively. Compared with the First-Come-First-Serve and other approaches, the simulation results show that DOB and DOBT are able to reduce the average order retrieval delay by at least 30%, and generate less backlog pressure to the downstream operations."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-7-1",
    "pageId": "page-ml-ai-7",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "A Matheuristic Algorithm for the Multiple-Depot Vehicle and Crew Scheduling Problem"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-7-2",
    "pageId": "page-ml-ai-7",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Emiliana Mara Lopes Sim\u00f5es', 'Lucas De Souza Batista', 'Marcone Jamilson Freitas Souza'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-7-3",
    "pageId": "page-ml-ai-7",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "This work addresses the multiple-depot vehicle and crew scheduling problem (MDVCSP). In MDVCSP, we deal with two NP-hard problems in an integrated way: the multiple-depot vehicle scheduling problem (MDVSP) and the crew scheduling problem (CSP). For solving the MDVCSP, we define the vehicles\u2019 operational routine and the workdays of the crews of a public bus transport system with multiple depots. Given the difficulty of solving real-world instances of the MDVCSP using exact mathematical methods, we propose a matheuristic algorithm for solving it. This matheuristic algorithm combines two strategies into an iterated local search (ILS) based framework: a branch-and-bound algorithm for solving the MDVSP and a variable neighborhood descent (VND) based algorithm for treating the associated CSPs. We compared the proposed ILS-MDVCSP with five approaches in the literature that use the same benchmark test instances. We also solved a real-world problem of one of Brazil\u2019s largest cities. For this problem, we proposed a formulation based on a time-space network to address the MDVSP subproblem. The results obtained showed the effectiveness of ILS-MDVCSP, mainly to deal with real-world and large-scale problems. The algorithm was able to solve the largest instances from the literature, for which there was no reported solution. Regarding the run time, as the instances\u2019 size increases, our approach becomes substantially less costly than the others from the literature. For the Brazilian instances, the ILS-MDVCSP saved, on average, the use of 12 vehicles per day and reduced by up to 15% the daily operational time of the vehicles."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-8-1",
    "pageId": "page-ml-ai-8",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Smart Optical Sensors for Internet of Things: Integration of Temperature Monitoring and Customized Security Physical Unclonable Functions"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-8-2",
    "pageId": "page-ml-ai-8",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['L\u00edlia M. S. Dias', 'Jo\u00e3o F. C. B. Ramalho', 'Tiago Silv\u00e9rio', 'Lianshe Fu', 'Rute A. S. Ferreira', 'Paulo S. Andr\u00e9'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-8-3",
    "pageId": "page-ml-ai-8",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Nowadays, the Internet of Things (IoT) has an astonishingly societal impact in which healthcare services stand out. Amplified by the COVID-19 pandemic scenario, challenges include the development of authenticatable smart IoT devices with the ability to simultaneously track people and sense in real-time human body temperature aiming to infer a health condition in a contactless and remote way through user-friendly equipment such as a smartphone. Univocal smart labels based on quick response (QR) codes were designed and printed on medical substrates (protective masks and adhesive) using flexible organic-inorganic luminescent inks. Luminescence thermometry and physical unclonable functions (PUFs) are simultaneously combined allowing non-contact temperature detection, identification, and connection with the IoT environment through a smartphone. This is an intriguing example where luminescent inks based on organic-inorganic hybrids modified by lanthanide ions are used to fabricate a smart label that can sense temperature with remarkable figures of merit, including maximum thermal sensitivity of \n Sr=1.46S_{\\mathrm {r}}=1.46 \n %K\n\u22121\n and temperature uncertainty of \n \u03b4T=0.2\\delta T=0.2 \n K, and an authentication methodology accuracy, precision, and recall of 96.2%, 98.9%, and 85.7%, respectively. The methodology proposed is feasibly applied for the univocal identification and mobile optical temperature monitoring of individuals, allowing the control of the access to restricted areas and the information transfer to medical entities for post medical evaluation towards a new generation of mobile-assisted \neHealth\n (\nmHealth\n)."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-9-1",
    "pageId": "page-ml-ai-9",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Sub-6 GHz Highly Isolated Wideband MIMO Antenna Arrays"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-9-2",
    "pageId": "page-ml-ai-9",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Amany A. Megahed', 'Mohamed Abdelazim', 'Ehab H. Abdelhay', 'Heba Y. M. Soliman'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-9-3",
    "pageId": "page-ml-ai-9",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "This study proposes a compact four-port multiple-input multiple-output (MIMO) antenna system to operate within a frequency range of 3.2\u20135.75 GHz to serve in 5G new radio (NR) sub-6 GHz n77/n78/n79 and 5 GHz WLAN with good impedance matching. To increase the isolation between the MIMO antenna elements with low complexity and cost, the antenna elements are orthogonally oriented to each other with distance spacing of \n 0.3\\lambda _{\\text {o}}0.3\u03bbo0.3\\lambda _{\\text {o}} \n between elements, including electromagnetic bandgap (EBG) structure, defected ground structure (DGS), capacitive elements (CE), and neutralization line (NL). The simulation results show that the measured mutual coupling between the array elements is improved from \u221220 to \u221245 dB. The envelope correlation coefficient is enhanced. In addition, the diversity gain, mean effective gain, and total active reflection coefficient are improved simultaneously. The suggested structure has been designed on CST Microwave Studio 2019. The antennas\u2019 overall dimensions for all methods are the same as they approach 46 mm \n \\times46\u00d746\\times46 \n mm \n \\times1.6\u00d71.6\\times1.6 \n mm. The measured gain of the proposed designs ranges from 6 to 9 dBi, and the radiation efficiency approaches 90%. The antennas are fabricated and tested, where better experimental results are noticed compared to the simulation results. Our antennas are designed over FR-4 substrate with a noticeable cost reduction. Each antenna element has a dimension of 15 mm \n \\times23\u00d723\\times23 \n mm \n \\times1.6\u00d71.6\\times1.6 \n mm. An \u201cEL\u201d slot into the radiating element and two identical stubs coupled to the partial ground are used to improve the impedance matching and radiation characteristics across the bands of interest. The isolation decreases by 22 dB using the EBG method, reaching the value of \u221265 dB. Meanwhile, the isolation decreases by 19 dB using the DGS method, reaching \u221260 dB. Due to gaps between adjacent unit cells and the capacitance generated from the dielectric gap between the top metallic patch and ground plane, ..."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-10-1",
    "pageId": "page-ml-ai-10",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Robust Charging Schedule for Autonomous Electric Vehicles With Uncertain Covariates"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-10-2",
    "pageId": "page-ml-ai-10",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Yongsheng Cao', 'Yongquan Wang'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-10-3",
    "pageId": "page-ml-ai-10",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Autonomous electric vehicles (AEVs) will become an inevitable trend in the future transportation network and have an important impact on the power grid. It is difficult to find the optimal distributed charging solution for AEVs to minimize the system cost with some uncertainties. In this paper, we investigate an AEVs charging and discharging problem with vehicle-to-grid (V2G) services. We aim to minimize the total electricity cost and battery degradation cost of AEVs and charging station batteries with V2G services, which takes the random arrival and departure of AEVs into account. We first propose a distributed charging framework of AEVs and charging stations by clustering method with the constraint of limited AEVs for each charging station in a region and formulate a distributed offline optimization problem. Then we formulate a distributed online charging optimization problem and propose a distributed online AEV charging scheduling (DOAS) algorithm to get an optimal charging solution. To study a more practical case, we reformulate the distributed online optimization problem with the uncertainties from base loads, renewable energy and charging demands. Furthermore, to improve the time efficiency of DOAS algorithm, we reduce the dimension of the distributed problem and design a dimension-reduction DOAS (DDOAS) algorithm. To seek a robust solution with some uncertainties, we propose a DDOAS algorithm with DRO based on Wasserstein distance (DDODW). Simulation results show that DOAS and DDOAS algorithms can have a close-to-optimal charging cost and a significantly less battery degradation cost of charging stations, compared with centralized online charging scheduling algorithm and DDOAS algorithm is more time-efficient than DOAS algorithm. The proposed DDODW algorithm can provide a robust solution for the energy schedule"
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-11-1",
    "pageId": "page-ml-ai-11",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "An Improved SVM-Based Spatial Spectrum Sensing Scheme via Beamspace at Low SNRs"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-11-2",
    "pageId": "page-ml-ai-11",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Yihao Qi', 'Yong Wang', 'Chengzhe Lai'] | Year: 2019 | Citations: 1"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-11-3",
    "pageId": "page-ml-ai-11",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Abstract unavailable."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-12-1",
    "pageId": "page-ml-ai-12",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Opportunistic Relay in Multicast Channels With Generalized Shadowed Fading Effects: A Physical Layer Security Perspective"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-12-2",
    "pageId": "page-ml-ai-12",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['S. M. Saumik Shahriyer', 'A. S. M. Badrudduza', 'Sarjana Shabab', 'Milton Kumar Kundu', 'Heejung Yu'] | Year: 2021 | Citations: 1"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-12-3",
    "pageId": "page-ml-ai-12",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Through ordinary transmissions over wireless multicast networks are greatly hampered due to the simultaneous presence of fading and shadowing of wireless channels, secure transmissions can be enhanced by properly exploiting random attributes of the propagation medium. This study focuses on the utilization of those attributes to enhance the physical layer security (PLS) performance of a dual-hop wireless multicast network over \n \u03ba\u2212\u03bc\\kappa -\\mu  \n shadow-fading channel under the wiretapping attempts of multiple eavesdroppers. In order to improve the secrecy level, the best relay selection strategy among multiple relays is employed. Performance analysis is carried out based on the mathematical modeling in terms of analytical expressions of non-zero secrecy capacity probability, secure outage probability, and ergodic secrecy capacity over multicast relay networks. Capitalizing on those expressions, the effects of system parameters, i.e., fading, shadowing, the number of antennas, destination receivers, eavesdroppers, and relays, on the secrecy performance are investigated. Numerical results show that the detrimental impacts caused by fading and shadowing can be remarkably mitigated using the well-known opportunistic relaying technique. Moreover, the proposed model unifies secrecy analysis of several classical models, thereby exhibiting enormous versatility than the existing works. Finally, all the numerical results are authenticated utilizing Monte-Carlo simulations."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-13-1",
    "pageId": "page-ml-ai-13",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Advances in Adversarial Attacks and Defenses in Computer Vision: A Survey"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-13-2",
    "pageId": "page-ml-ai-13",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Naveed Akhtar', 'Ajmal Mian', 'Navid Kardan', 'Mubarak Shah'] | Year: 2021 | Citations: 1"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-13-3",
    "pageId": "page-ml-ai-13",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Deep Learning is the most widely used tool in the contemporary field of computer vision. Its ability to accurately solve complex problems is employed in vision research to learn deep neural models for a variety of tasks, including security critical applications. However, it is now known that deep learning is vulnerable to adversarial attacks that can manipulate its predictions by introducing visually imperceptible perturbations in images and videos. Since the discovery of this phenomenon in 2013, it has attracted significant attention of researchers from multiple sub-fields of machine intelligence. In 2018, we published the first-ever review of the contributions made by the computer vision community in adversarial attacks on deep learning (and their defenses). Many of those contributions have inspired new directions in this area, which has matured significantly since witnessing the first generation methods. Hence, as a legacy sequel of our first literature survey, this review article focuses on the advances in this area since 2018. We thoroughly discuss the first generation attacks and comprehensively cover the modern attacks and their defenses appearing in the prestigious sources of computer vision and machine learning research. Besides offering the most comprehensive literature review of adversarial attacks and defenses to date, the article also provides concise definitions of technical terminologies for the non-experts. Finally, it discusses challenges and future outlook of this direction based on the literature since the advent of this research direction."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-14-1",
    "pageId": "page-ml-ai-14",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Multicriteria Classifier Ensemble Learning for Imbalanced Data"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-14-2",
    "pageId": "page-ml-ai-14",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Weronika W\u0119gier', 'Micha\u0142 Koziarski', 'Micha\u0142 Wo\u017aniak'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-14-3",
    "pageId": "page-ml-ai-14",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "One of the vital problems with the imbalanced data classifier training is the definition of an optimization criterion. Typically, since the exact cost of misclassification of the individual classes is unknown, combined metrics and loss functions that roughly balance the cost for each class are used. However, this approach can lead to a loss of information, since different trade-offs between class misclassification rates can produce similar combined metric values. To address this issue, this paper discusses a multi-criteria ensemble training method for the imbalanced data. The proposed method jointly optimizes \nprecision\n and \nrecall\n, and provides the end-user with a set of Pareto optimal solutions, from which the final one can be chosen according to the user\u2019s preference. The proposed approach was evaluated on a number of benchmark datasets and compared with the single-criterion approach (where the selected criterion was one of the chosen metrics). The results of the experiments confirmed the usefulness of the obtained method, which on the one hand guarantees good quality, i.e., not worse than the one obtained with the use of single-criterion optimization, and on the other hand, offers the user the opportunity to choose the solution that best meets their expectations regarding the trade-off between errors on the minority and the majority class."
    },
    "order": 3
  },
  {
    "id": "blk-page-ml-ai-15-1",
    "pageId": "page-ml-ai-15",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Autonomous Control of Combat Unmanned Aerial Vehicles to Evade Surface-to-Air Missiles Using Deep Reinforcement Learning"
    },
    "order": 1
  },
  {
    "id": "blk-page-ml-ai-15-2",
    "pageId": "page-ml-ai-15",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Gyeong Taek Lee', 'Chang Ouk Kim'] | Year: 2020 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-ml-ai-15-3",
    "pageId": "page-ml-ai-15",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "This paper proposes a new reinforcement learning approach for executing combat unmanned aerial vehicle (CUAV) missions. We consider missions with the following goals: guided missile avoidance, shortest-path flight and formation flight. For reinforcement learning, the representation of the current agent state is important. We propose a novel method of using the coordinates and angle of a CUAV to effectively represent its state. Furthermore, we develop a reinforcement learning algorithm with enhanced exploration through amplification of the imitation effect (AIE). This algorithm consists of self-imitation learning and random network distillation algorithms. We assert that these two algorithms complement each other and that combining them amplifies the imitation effect for exploration. Empirical results show that the proposed AIE approach is highly effective at finding a CUAV's shortest-flight path while avoiding enemy missiles. Test results confirm that with our method, a single CUAV reaches its target from its starting point 95% of the time and a squadron of four simultaneously operating CUAVs reaches the target 70% of the time."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-1-1",
    "pageId": "page-wireless-iot-1",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Transverse Flux Machine\u2014A Review"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-1-2",
    "pageId": "page-wireless-iot-1",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Benedikt Kaiser', 'Nejila Parspour'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-1-3",
    "pageId": "page-wireless-iot-1",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "For applications with high torque demand, gearboxes are commonly used to convert torque and speed in order to receive higher specific values for torque and power. This causes additional losses, cost, inaccuracies, effort, and noise. Eliminating the need of a mechanical gear and the associated disadvantages, Transverse Flux Machines with their high torque density are a very promising alternative. Despite a high torque density and a high efficiency, these types of machines are not commonly used. Due to the complex structure, challenges with mechanical design, and modeling of the machine behavior arise. Additionally, there are high requirements for the inverter due to the low power factor. This paper provides an overview of the state of the art including the potentials and advantages but also the problems and hindrances of these types of machines. Relating to linear and rotary machines from research and industry, the machine is introduced with its history, application and classification. Further, the general technical aspects, the influence of materials for flux guidance, the methods of modeling, methods for a minimization of torque ripples, as well as methods for power factor improvement are presented."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-2-1",
    "pageId": "page-wireless-iot-2",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "An Efficient Building Evacuation Algorithm in Congested Networks"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-2-2",
    "pageId": "page-wireless-iot-2",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Chang Hyup Oh', 'Min Hee Kim', 'Byung-In Kim', 'Young Myoung Ko'] | Year: 2019 | Citations: 2"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-2-3",
    "pageId": "page-wireless-iot-2",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "This paper proposes a new network model for the building evacuation problem considering congestion levels and provides a mixed integer linear programming (MILP) model and an efficient heuristic algorithm solving the problem. Constructing an optimization model with several congestion levels, we introduce a new network called the multi-class time-expanded (MCTE) network having several exclusive arcs connecting the same tail and head nodes. The MCTE networks make both the MILP model and the heuristic algorithm reflect a realistic situation in congested networks. Considering MCTE networks makes the problem difficult to solve, which motivates us to develop an efficient heuristic algorithm. We test our heuristic algorithm using several real-world networks such as a multiplex cinema, a subway station, and a large-size complex shopping mall in addition to an artificial network for clear comparison between the proposed algorithm and the MILP approaches. The results indicate that the proposed algorithm runs fast and produces a near-optimal solution compared with those from MILP models with a commercial solver."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-3-1",
    "pageId": "page-wireless-iot-3",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "MSPL: Multimodal Self-Paced Learning for Multi-Omics Feature Selection and Data Integration"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-3-2",
    "pageId": "page-wireless-iot-3",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Zi-Yi Yang', 'Liang-Yong Xia', 'Hui Zhang', 'Yong Liang'] | Year: 2019 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-3-3",
    "pageId": "page-wireless-iot-3",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Rapid advances in high-throughput sequencing technology have led to the generation of a large number of multi-omics biological datasets. Integrating data from different omics provides an unprecedented opportunity to gain insight into disease mechanisms from different perspectives. However, integrative analysis and predictive modeling from multi-omics data are facing three major challenges: i) heavy noises; ii) the high dimensions compared to the small samples; iii) data heterogeneity. Current multi-omics data integration approaches have some limitations and are susceptible to heavy noise. In this paper, we present MSPL, a robust supervised multi-omics data integration method that simultaneously identifies significant multi-omics signatures during the integration process and predicts the cancer subtypes. The proposed method not only inherits the generalization performance of self-paced learning but also leverages the properties of multi-omics data containing correlated information to interactively recommend high-confidence samples for model training. We demonstrate the capabilities of MSPL using simulated data and five multi-omics biological datasets, integrating up three omics to identify potential biological signatures, and evaluating the performance compared to state-of-the-art methods in binary and multi-class classification problems. Our proposed model makes multi-omics data integration more systematic and expands its range of applications."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-4-1",
    "pageId": "page-wireless-iot-4",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Simultaneous Allocation of Multi-Type Distributed Generations and Capacitors Using Generic Analytical Expressions"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-4-2",
    "pageId": "page-wireless-iot-4",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Karar Mahmoud', 'Matti Lehtonen'] | Year: 2019 | Citations: 19"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-4-3",
    "pageId": "page-wireless-iot-4",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "This paper proposes a method for determining the optimal sites and sizes of multi-type distributed generations (DG) and capacitors for minimizing reactive power losses (RPL) in distribution systems. The proposed method is developed based on generic closed-form analytical expressions for calculating optimal sizes of DG units and capacitors at their candidate sites. The reduction in RPL with DG and capacitors is evaluated using another analytical expression that relates power injections of DG and capacitors with RPL. An optimal power flow algorithm (OPF) is incorporated in the proposed method to consider the constraints of the distribution systems, DG, and capacitors. Various types of DG are considered, and their optimal power factors can be accurately computed while optimizing the sizes of capacitors in a simultaneous manner to reduce RPL. The 69-bus distribution system is used to test the proposed method. An exact search method is employed to verify the accuracy of the proposed method. The effectiveness of the proposed method is demonstrated for solving the optimal allocation problem with different combinations of multi-type DG units and capacitors."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-5-1",
    "pageId": "page-wireless-iot-5",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Predicting Canine Posture With Smart Camera Networks Powered by the Artificial Intelligence of Things"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-5-2",
    "pageId": "page-wireless-iot-5",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Ming-Fong Tsai', 'Jhao-Yang Huang'] | Year: 2020 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-5-3",
    "pageId": "page-wireless-iot-5",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "In today's society, the number of people rearing pets has increased and their awareness of the need to protect pets' health has increased. Pet posture behaviour analysis and prediction are providing assistance in the medical treatment of pets. Hence, the demand for pet skeleton drawing applications has risen dramatically. Our proposed system predicts pet posture using smart camera networks powered by the artificial intelligence of things. This system is built on a platform using a Raspberry Pi embedded system. The system can determine from an image whether there is a detection target and generate a contour mask based on Mask R-CNN Technology. According to object detection, poses and key parts can be identified to predict and draw pet skeletons. Simultaneously, the behavioural action of a pet can be determined according to continuous skeleton data and then the system will actively inform the owner to perform subsequent processing."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-6-1",
    "pageId": "page-wireless-iot-6",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Joint Optimization of Transmit Waveform and Receive Filter for Target Detection in MIMO Radar"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-6-2",
    "pageId": "page-wireless-iot-6",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Hao Zheng', 'Bo Jiu', 'Hongwei Liu'] | Year: 2019 | Citations: 4"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-6-3",
    "pageId": "page-wireless-iot-6",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "In this paper, we consider the joint optimization of transmit waveform and receive filter in colocated multiple-input multiple-output (MIMO) radar to enhance target detection performance in the presence of signal-dependent interference. It is noticed that in the detection stage, the output energy is mainly concentrated in the mainlobe region. Therefore, we decompose the receive filter as the cascade of a receive beamformer and a temporal filter. Then, under the peak-to-average ratio (PAR) constraint, a problem is formulated to realize a trade-off between the signal-to-interference-plus-noise ratio (SINR) and the integrated sidelobe level (ISL) at the pulse compression output of mainlobe synthesized signal. A non-decreasing algorithm, which is the combination of sequential optimization algorithm and minorization-maximization (MM) method, is developed to solve this problem. Besides, in order to reduce computation burden, a special case is proposed, where we fix the temporal filter as the mainlobe synthesized signal. Then, another non-decreasing algorithm based on the MM method is proposed to solve the special case. Numerical experiments show that the proposed algorithms can obtain high output SINR and low output ISL efficiently."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-7-1",
    "pageId": "page-wireless-iot-7",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Design Issues of Digital and Analog Chaotic RoF Link Using Chaos Message Masking"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-7-2",
    "pageId": "page-wireless-iot-7",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Danish Ali Mazhar', 'Syed Zafar Ali Shah', 'Muhammad Khawar Islam', 'Farhan Qamar'] | Year: 2019 | Citations: 3"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-7-3",
    "pageId": "page-wireless-iot-7",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "This work presents the joint use of Radio Over Fiber and optical chaos to investigate the secure ROF link. Merging the two technologies, optical chaos for physical layer communication security and Radio over Fiber creates new design issues which have been identified and studied in detail in this paper for both analog Radio Frequency/Intermediate Frequency and digitized data. A semiconductor laser diode is driven into chaotic region using direct modulation scheme and RoF signal is added by chaos message masking scheme. The chaotically masked signal is transmitted over an optical communication link to investigate the propagation issues and synchronization of chaos at the receiver. The transmitted chaos is synchronized at the receiver to unmask the signal by using subtraction rule. To investigate the performance of chaotic communication system for Radio over Fiber transmission, the figure of merits like Bit error rate, Quality factor, Eye Opening Penalty and Root-mean-squared phase jitter are studied for digital data and Signal to Noise ratio and Total Harmonic Distortion are studied for analog waveform to address the effects of link length and data rate/message bandwidth."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-8-1",
    "pageId": "page-wireless-iot-8",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Aircraft Trajectory Prediction With Enriched Intent Using Encoder-Decoder Architecture"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-8-2",
    "pageId": "page-wireless-iot-8",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Phu N. Tran', 'Hoang Q. V. Nguyen', 'Duc-Thinh Pham', 'Sameer Alam'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-8-3",
    "pageId": "page-wireless-iot-8",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Aircraft trajectory prediction is a challenging problem in air traffic control, especially for conflict detection. Traditional trajectory predictors require a variety of inputs such as flight-plans, aircraft performance models, meteorological forecasts, etc. Many of these data are subjected to environmental uncertainties. Further, limited information about such inputs, especially the lack of aircraft tactical intent, makes trajectory prediction a challenging task. In this work, we propose a deep learning model that performs trajectory prediction by modeling and incorporating aircraft tactical intent. The proposed model adopts the encoder-decoder architecture and makes use of the convolutional layer as well as Gated Recurrent Units (GRUs). The proposed model does not require explicit information about aircraft performance and wind data. Results demonstrate that the provision of enriched aircraft intent, together with appropriate model design, could improve the prediction error up to 30% at a prediction horizon of 10 minutes (from 4.9 nautical miles to 3.4 nautical miles). The model also guarantees the mean error growth rate with increasing look-ahead time to be lower than 0.2 nautical miles per minute. In addition, the model offers a very low variance in the prediction, which satisfies the variance-standard specified by EUROCONTROL (EU Organization for Safety and Navigation of Air Traffic) for trajectory predictors. The proposed model also outperforms the state-of-the-art trajectory prediction model, where the Root Mean Square Error (RMSE) is reduced from 0.0203 to 0.0018 for latitude prediction, and from 0.0482 to 0.0021 for longitude prediction in a single prediction step of 15 seconds look-ahead. We showed that the pre-trained model on ADS-B data maintains its high performance, in terms of cross-track and along-track errors, when being validated in the Bluesky Air Traffic Simulator. The proposed model would significantly improve the performance of conflict detecti..."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-9-1",
    "pageId": "page-wireless-iot-9",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "G2P-SLAM: Generalized RGB-D SLAM Framework for Mobile Robots in Low-Dynamic Environments"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-9-2",
    "pageId": "page-wireless-iot-9",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Seungwon Song', 'Hyungtae Lim', 'Sungwook Jung', 'Hyun Myung'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-9-3",
    "pageId": "page-wireless-iot-9",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "In this paper, we propose a generalized grouping and pruning method for RGB-D SLAM in low-dynamic environments. The conventional grouping and pruning methods successfully reject the effect of dynamic objects in pose graph optimization (PGO). However, these methods sometimes fail when high-dynamic objects are dominant in the images captured by RGB-D sensors. Furthermore, once it is determined whether the features from dynamic objects are included in some nodes, the corresponding nodes are entirely removed even though these nodes partially include true constraints, which leads to an inaccurate PGO. To tackle these problems, we propose a novel method with intra-grouping, inter-grouping, and selective pruning, called G2P-SLAM. Accordingly, our method successfully rejects false constraints from dynamic objects selectively, thus preserving true constraints from static objects as many as possible. As experimentally verified on both our own datasets and public datasets, our proposed method shows promising performance compared with the state-of-the-art methods. Furthermore, experimental results corroborate that our G2P-SLAM enables robust PGO in both dynamic and low-dynamic environments."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-10-1",
    "pageId": "page-wireless-iot-10",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "A TaOx-Based Electronic Synapse With High Precision for Neuromorphic Computing"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-10-2",
    "pageId": "page-wireless-iot-10",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Sen Liu', 'Kun Li', 'Yi Sun', 'Xi Zhu', 'Zhiwei Li', 'Bing Song', 'Haijun Liu', 'Qingjiang Li'] | Year: 2019 | Citations: 3"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-10-3",
    "pageId": "page-wireless-iot-10",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Neuromorphic computing is a promising candidate for breaking the von Neumann bottleneck and developing high-efficient computing systems. Here we present a W/TaO\nx\n/Pt high-precision electronic synapse with excellent analog properties for neuromorphic computing. The device exhibits the potential of 10-bit weight precision, which is state of the art in conductance levels. Furthermore, the device shows linear weight update behavior in a specific conductance range, linear I-V curves in low voltage regime, long time retention, and precise modulation of weight. These characteristics are very helpful for improving the accuracy of neuromorphic networks. Finally, a 400 \u00d7 60 \u00d7 10 three-layer perceptron was constructed with W/TaO\nx\n/Pt synapses for MNIST classification and ~92% accuracy was achieved."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-11-1",
    "pageId": "page-wireless-iot-11",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Electrical Phenotyping of Human Brain Tissues: An Automated System for Tumor Delineation"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-11-2",
    "pageId": "page-wireless-iot-11",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Arjun Bs', 'Anil Vishnu Gk', 'Shilpa Rao', 'Manish Beniwal', 'Hardik J. Pandya'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-11-3",
    "pageId": "page-wireless-iot-11",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Precise surgical excision of brain tumors depends on the surgeon\u2019s ability to accurately differentiate tumors from healthy brain tissues. We have developed an automated system integrated with biochips, an actuation unit, and electronics to measure the electrical resistivity of ex vivo human brain tissues for differentiating normal and tumor. The electrical resistivity of fresh (n = 48), formalin-fixed for one week (n = 48), and long-term (six months) formalin-fixed (n = 27) healthy human brain samples from different anatomical regions and tumor samples (glioma n = 6; fresh, formalin-fixed for one week, and formalin-fixed for six months) were measured using the automated system. The resistivity of glioma (22.4 \u00b1 \n 1.6\u00a0\u03a91.6~\\Omega \n.cm) was significantly lesser than the normal region (98.6 \u00b1 \n 1.4\u00a0\u03a91.4~\\Omega \n.cm) for fresh tissue samples (p = 5e-8). The trend of lower resistivity of glioma compared to normal was preserved after one week and six months of formalin fixation. We also report the effects of heterogeneity of normal brain tissue and formalin-fixation on the electrical properties of tissues. White matter regions were found to have higher resistivity compared to grey matter regions. The heterogeneity associated with grey matter regions was lower than the white matter regions. Formalin-fixation was observed to increase the magnitude of resistivity measured while retaining the observed trend across the different regions of the brain and tumors. The study shows that the electrical resistivity could potentially be used as an additional biomarker for delineating normal from the tumor."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-12-1",
    "pageId": "page-wireless-iot-12",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Next-Generation Indoor Wireless Systems: Compatibility and Migration Case Study"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-12-2",
    "pageId": "page-wireless-iot-12",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Piyush Dhawankar', 'Arvind Kumar', 'Noel Crespi', 'Krishna Busawon', 'Kashif Naseer Qureshi', 'Ibrahim Tariq Javed', 'Shiv Prakash', 'Omprakash Kaiwartya'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-12-3",
    "pageId": "page-wireless-iot-12",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "The indoor connected environment has witnessed significant research and development attention from industries and academia due to the growing number of smaller smart indoor devices around us. Developing an effective and efficient wireless access standard is one of the challenging tasks to enable the next generation indoor connected environment. The technical characteristics of existing wireless access standards, including IEEE 802.11a, 802.11n, and 802.11ac, are considerably limited for realizing indoor connected environments, particularly with a growing number of smaller intelligent devices. Moreover, their backward compatibility and migration strategies are significant for developing the next-generation wireless access standard for the indoor Internet of Things environment. In this context, this paper presents an indoor environmental experimental study focusing on the backward compatibility and migration-centric performance analysis of existing wireless access standards. Three wireless access standards that operate in the 5 GHz frequency spectrum are evaluated considering the metrics, including throughput, range, efficiency, and backward compatibility in an indoor environment. The experimental results are also compared with the analytical path loss model to observe the attributes for next-generation wireless access between the observed and analytical models. The evaluation can attest to the suitable migration strategy for stable next-generation wireless access development and deployment for an indoor smart Internet of Things environment."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-13-1",
    "pageId": "page-wireless-iot-13",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Provable Secure Group Key Establishment Scheme for Fog Computing"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-13-2",
    "pageId": "page-wireless-iot-13",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Wen-Chin Chen', 'Yin-Tzu Huang', 'Sheng-De Wang'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-13-3",
    "pageId": "page-wireless-iot-13",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "In the fog computing paradigms, fog nodes are closer to terminal devices and can extend services to the edge of the network, thereby reducing the impact of high latency and restricted networks in the Internet of Things (IoTs). Fog computing applications usually organize the terminal devices in groups and require some form of security protection. Previous studies on the establishment of group keys for fog computing architectures have high communication costs and cannot verify the authenticity of each entity. Therefore, in this paper, we propose a mutual authentication group key establishment scheme for the fog computing architecture by using elliptic curve cryptography. After mutual authentication, the cloud server can transfer the computing overhead to the fog node, which will be responsible for authenticating the device group and distributing the established group session key. The group session key consists of the private key of each entity and some random and temporarily stored values. We prove that the established group session key is protected by the Canetti-Krawczyk (CK) adversary model. Finally, we evaluate performance based on calculation and communication costs. Compared with previous studies, the proposed scheme is lightweight and effective because it only involves elliptic curve operations and symmetric cryptographic operations."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-14-1",
    "pageId": "page-wireless-iot-14",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "A New Control Strategy for SR Generation System Based on Modified PT Control"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-14-2",
    "pageId": "page-wireless-iot-14",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Xiaoshu Zan', 'Kai Ni', 'Wenyuan Zhang', 'Zhikai Jiang', 'Mingliang Cui', 'Dongsheng Yu', 'Rong Zeng'] | Year: 2019 | Citations: 3"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-14-3",
    "pageId": "page-wireless-iot-14",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "The Switched Reluctance generator (SRG) has been widely used as a constant voltage source due to its advantages of simple structure, low cost and high control flexibility. However, the output voltage ripples cannot be ignored due to its unique operating principle with phase commutation. In this paper, the influence of the control parameters on the output voltage ripples are analyzed, and a fly-wheeling pulse train (FW-PT) control strategy is proposed to suppress the voltage ripple. The output voltage can be regulated by the FW-PT control strategy by using two or more sets of preset control pulse combinations, therefore it has the advantages of simple circuit implementation, no Network compensation and fast response speed. The characteristics of steady-state and dynamic behaviors of the switched reluctance power generation system by using different control strategies are simulated and compared, and a platform of 200W 8/6 SRG is built for experimental verification. Simulation and experimental results confirm that compared with the traditional PID control strategy, the FW-PT control strategy can be used to not only suppress the output voltage ripple, but also achieve faster response and dynamic characteristics."
    },
    "order": 3
  },
  {
    "id": "blk-page-wireless-iot-15-1",
    "pageId": "page-wireless-iot-15",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Rapid Quality Evaluation of Camellia Oleifera Seed Kernel Using a Developed Portable NIR With Optimal Wavelength Selection"
    },
    "order": 1
  },
  {
    "id": "blk-page-wireless-iot-15-2",
    "pageId": "page-wireless-iot-15",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Amorndej Puttipipatkajorn', 'Amornrit Puttipipatkajorn'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-wireless-iot-15-3",
    "pageId": "page-wireless-iot-15",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Moisture content is one of the factors measured to evaluate the quality of Camellia oleifera seeds. High quality \nC. oleifera\n seeds used for trading must have a low moisture content, specifically not more than 15% on a dry basis (db). Moisture content analysis requires a prolonged laboratory investigation so that the development of fast and effective determination methods is helpful. The objective of this paper was to develop a low-cost portable NIR reflectance spectrometer collaborating with an android application for the rapid prediction of the moisture content in \nC. oleifera\n seeds. To calibrate the prediction model, an effective chemometric algorithm, based on partial least squares regression was established, and models based on wavelength selection algorithms such as backward interval partial least squares (\nbi\nPLS) and partial least squares coupled with variable importance projection (VIP-PLS) were implemented as an improved version of PLS. Both algorithms (\nbi\nPLS and VIP-PLS) improved the predictive performance and accuracy of the model. The experimental results showed that the \nbi\nPLS model with the 1\nst\n derivative transformation provided the best prediction for measuring the moisture content of \nC. oleifera\n seeds with a coefficient of determination (R\n2\n) value of 0.927, standard error of prediction (SEP) of 0.848%db, bias of \u22120.067%db, function slope of 1.005, and ratio of performance deviation (RPD) of 3.696. Finally, the device was tested according to the ISO 12099:2017(E) standard and confirmed the reliability of the device for in-field use."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-1-1",
    "pageId": "page-hci-ui-1",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "A Novel Combined Conductance Sensor for Water Cut Measurement of Low-Velocity Oil-Water Flow in Horizontal and Slightly Inclined Pipes"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-1-2",
    "pageId": "page-hci-ui-1",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Weihang Kong', 'He Li', 'Guanglong Xing', 'Lingfu Kong', 'Lei Li', 'Min Wang'] | Year: 2019 | Citations: 1"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-1-3",
    "pageId": "page-hci-ui-1",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "This paper studied conductance-based method for water cut measurement to dynamically monitor the horizontal oil-producing wells. Existing conductance tools cannot obtain the response values corresponding to the water phase in horizontal wells due to the characteristics of the ring-shaped electrode structure and the horizontal well structure. In order to tackle this issue, this paper designed a novel Combined Conductance Sensor (CCS), which mainly consists of the Ring-Shaped Conductance Probe (RSCP) and the novel Clock-like Conductance Probe Array (CCPA). Specifically, we first established the structure model of CCS, optimized the geometry of CCPA by analyzing the uniformity of electric field distribution generated by the exciting electrodes of CCPA and then analyzed the local sensitivity field region of the optimized CCPA. Then we studied the flow pattern distribution of the horizontal oil-water two-phase flow and analyzed the response characteristics and the linear relation between RSCP and CCPA. In addition, this research developed the CCS-based tool and conducted the experiments about different inclined angles in horizontal and slightly inclined pipes. Extensive experiments demonstrated that the developed CCS can cover the three-quarter scale of water cut measurement(25%-100%) in horizontal and slightly inclined pipes, and the experimental results verified the validity of CCS for the water cut measurement. Comparing to the existing methods, the proposed CCS is more suitable for water cut measurement with the advantages of simple structure and low cost for the horizontal oil wells with the characteristics of the low production, which could be used widely in the actual logging."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-2-1",
    "pageId": "page-hci-ui-2",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Improving IoT Federation Resiliency With Distributed Ledger Technology"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-2-2",
    "pageId": "page-hci-ui-2",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Tommi M. Elo', 'Sampsa Ruutu', 'Ektor Arzoglou', 'Yki Kortesniemi', 'Dmitrij Lagutin', 'Veria Hoseini', 'George C. Polyzos'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-2-3",
    "pageId": "page-hci-ui-2",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Despite the rapid spread of Internet of Things (IoT) systems, the lack of interoperability between the systems significantly hinders their business and societal potential. Moreover, a major challenge for wider interoperability is that the IoT systems can be owned by multiple independent entities, whose collaboration will need to be organised to ensure their interoperability. One approach for achieving this is to establish federations supported by Distributed Ledger Technologies (DLTs), as this enables interoperability between entities and collaboration between business platforms, thereby overcoming many technical and administrative difficulties. DLTs can provide the required transparency and immutability for management of the federations, thus increasing trust and reducing the risk of misbehaviour that could destabilise the federation. This paper presents two system dynamics simulation models, which demonstrate that the success of a federation (with or without DLT support) is inversely related to the short-term selfishness of its members, and we then proceed to show that DLTs can improve the feedback received by the federation members on their actions by promoting a common consensus, which in turn can make the federation more resilient."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-3-1",
    "pageId": "page-hci-ui-3",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Multivariate Nonlinear Sparse Mode Decomposition and Its Application in Gear Fault Diagnosis"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-3-2",
    "pageId": "page-hci-ui-3",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Haiyang Pan', 'Wanwan Jiang', 'Qingyun Liu', 'Jinde Zheng'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-3-3",
    "pageId": "page-hci-ui-3",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Multi-channel signal has more abundant and accurate state characteristic information than single channel signal. How to separate fault characteristic information from the multi-channel signal is the key of fault diagnosis. As two typical multi-channel signal decomposition methods, multivariate empirical mode decomposition (MEMD) and multivariate variational mode decomposition (MVMD) are widely used in multi-channel signal analysis. However, MEMD and MVMD use cyclic iteration to complete the analysis of multi-channel signals, and it is difficult to overcome their inherent defects. In view of this, based on nonlinear sparse mode decomposition (NSMD), this paper proposes a multivariate nonlinear sparse mode decomposition (MNSMD) by constraining singular local linear operators to separate the natural oscillation modes in multi-channel signal. By constraining singular local linear operators into signal decomposition, MNSMD has obvious advantages in restraining mode aliasing and robustness. In addition, the local narrow-band component is used as the basis function for iteration, and the component signal is obtained by approaching the original signal. Through the simulation signal and gear fault signal analysis, the results show that, compared with MEMD and MVMD methods, MNSMD method can effectively complete gear fault diagnosis."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-4-1",
    "pageId": "page-hci-ui-4",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "An Efficient Deep Learning Framework for Distracted Driver Detection"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-4-2",
    "pageId": "page-hci-ui-4",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Faiqa Sajid', 'Abdul Rehman Javed', 'Asma Basharat', 'Natalia Kryvinska', 'Adil Afzal', 'Muhammad Rizwan'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-4-3",
    "pageId": "page-hci-ui-4",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "The number of road accidents has constantly been increasing recently around the world. As per the national highway traffic safety administration\u2019s investigation, 45% of vehicle crashes are done by a distracted driver right around each. We endeavor to build a precise and robust framework for distinguishing diverted drivers. The existing work of distracted driver detection is concerned with a limited set of distractions (mainly cell phone usage). This paper uses the first publicly accessible dataset that is the state farm distracted driver detection dataset, which contains eight classes: calling, texting, everyday driving, operating on radio, inactiveness, talking to a passenger, looking behind, and drinking performed by 26 subjects to prepare our proposed model. The transfer values of the pertained model EfficientNet are used, as it is the backbone of EfficientDet. In contrast, the EfficientDet model detects the objects involved in these distracting activities and the region of interest of the body parts from the images to make predictions strong and accomplish state-of-art results. Also, in the Efficientdet model, we implement five variants: Efficientdet (D0-D4) for detection purposes and compared the best Efficientdet version with Faster R-CNN and Yolo-V3. Experimental results show that the proposed approach outperforms earlier methods in the literature and conclude that EfficientDet-D3 is the best model for detecting distracted drivers as it achieves Mean Average Precision (MAP) of 99.16% with parameter setting: learning rate of \n le\u22123le-3 \n, 50 epoch, batch size of 4, and step size of 250, demonstrating that it can potentially help drivers maintain safe driving habits."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-5-1",
    "pageId": "page-hci-ui-5",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Two-Dimensional RSSI-Based Indoor Localization Using Multiple Leaky Coaxial Cables With a Probabilistic Neural Network"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-5-2",
    "pageId": "page-hci-ui-5",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Junjie Zhu', 'Pengcheng Hou', 'Kenta Nagayama', 'Yafei Hou', 'Satoshi Denno', 'Rian Ferdian'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-5-3",
    "pageId": "page-hci-ui-5",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Received signal strength indicator (RSSI) based indoor localization technology has its irreplaceable advantages for many location-aware applications. It is becoming obvious that in the development of fifth-generation (5G) and future communication technology, indoor localization technology will play a key role in location-based application scenarios including smart home systems, manufacturing automation, health care, and robotics. Compared with wireless coverage using conventional monopole antenna, leaky coaxial cables (LCX) can generate a uniform and stable wireless coverage over a long-narrow linear-cell or irregular environment such as railway station and underground shopping-mall, especially for some manufacturing factories with wireless zone areas from a large number of mental machines. This paper presents a localization method using multiple leaky coaxial cables (LCX) for an indoor multipath-rich environment. Different from conventional localization methods based on time of arrival (TOA) or time difference of arrival (TDOA), we consider improving the localization accuracy by machine learning RSSI from LCX. We will present a probabilistic neural network (PNN) approach by utilizing RSSI from LCX. The proposal is aimed at the two-dimensional (2-D) localization in a trajectory. In addition, we also compared the performance of the RSSI-based PNN (RSSI-PNN) method and conventional TDOA method over the same environment. The results show the RSSI-PNN method is promising and more than 90% of the localization errors in the RSSI-PNN method are within 1 m. Compared with the conventional TDOA method, the RSSI-PNN method has better localization performance especially in the middle area of the wireless coverage of LCXs in the indoor environment."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-6-1",
    "pageId": "page-hci-ui-6",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Partial Reachability Graph Analysis of Petri Nets for Flexible Manufacturing Systems"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-6-2",
    "pageId": "page-hci-ui-6",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Menghuan Hu', 'Shaohua Yang', 'Yufeng Chen'] | Year: 2020 | Citations: 1"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-6-3",
    "pageId": "page-hci-ui-6",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Petri nets are an important and popular tool to model and analyze deadlocks in flexible manufacturing systems. The state space of a Petri net model can be divided into two disjoint parts: a live-zone and a dead-zone. Reachability graph analysis plays an important role in the modeling and control of Petri nets. Most existing studies have to fully enumerate the reachable markings of a Petri net to obtain the first-met bad markings (FBMs), which exacerbates the computational overheads. In this paper, a computationally efficient method to find dead markings in Petri nets is presented. We first introduce an algorithm to find dead markings by solving an integer linear programming problem. Then, the set of markings in the dead-zone is calculated, including the set of dead markings and the set of bad markings. Then we can find all the FBMs. By using a vector covering approach, the minimal covered set of FBMs is computed. The proposed approach can obtain the dead markings and FBMs by searching only a part of a reachability graph. Finally, examples are provided to demonstrate the proposed method."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-7-1",
    "pageId": "page-hci-ui-7",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Outage Probability Analysis for NOMA Downlink and Uplink Communication Systems With Generalized Fading Channels"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-7-2",
    "pageId": "page-hci-ui-7",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Akash Agarwal', 'Rishabh Chaurasiya', 'Sudhakar Rai', 'Aditya K. Jagannatham'] | Year: 2020 | Citations: 10"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-7-3",
    "pageId": "page-hci-ui-7",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "This work considers multiple user power-domain non-orthogonal multiple access (NOMA)based downlink (DL) and uplink (UL) communication systems with potentially dissimilar fading links for all the users that can follow one of several possible distributions such as Rayleigh, Rician, Nakagami-m, Nakagami-q, \u03ba - \u03bc, \u03b7 - \u03bc, Nakagami-lognormal. The presented analysis, which is based on approximating the probability density function (PDF) of the channel gain as a sum of Gamma distributions, is sufficiently general and applicable in a multitude of NOMA scenarios. For both the UL and DL, closed-form expressions are determined for the outage probability at the users considering both statistical channel state information (CSI)-based as well as instantaneous CSI-based ordering techniques. Analytical expressions for the outage probability and the ensuing diversity orders have also been obtained for the NOMA DL system at high SNRs. Furthermore, similar expressions for the outage probability and outage floor for the NOMA UL system have been derived at high SNRs. Finally, simulation results have been presented to authenticate the analytical results derived and provide insights into the NOMA system performance."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-8-1",
    "pageId": "page-hci-ui-8",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Machine Learning and Deep Learning Approaches for CyberSecurity: A Review"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-8-2",
    "pageId": "page-hci-ui-8",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Asmaa Halbouni', 'Teddy Surya Gunawan', 'Mohamed Hadi Habaebi', 'Murad Halbouni', 'Mira Kartiwi', 'Robiah Ahmad'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-8-3",
    "pageId": "page-hci-ui-8",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "The rapid evolution and growth of the internet through the last decades led to more concern about cyber-attacks that are continuously increasing and changing. As a result, an effective intrusion detection system was required to protect data, and the discovery of artificial intelligence\u2019s sub-fields, machine learning, and deep learning, was one of the most successful ways to address this problem. This paper reviewed intrusion detection systems and discussed what types of learning algorithms machine learning and deep learning are using to protect data from malicious behavior. It discusses recent machine learning and deep learning work with various network implementations, applications, algorithms, learning approaches, and datasets to develop an operational intrusion detection system."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-9-1",
    "pageId": "page-hci-ui-9",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Critical Challenges to Adopt DevOps Culture in Software Organizations: A Systematic Review"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-9-2",
    "pageId": "page-hci-ui-9",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Muhammad Shoaib Khan', 'Abudul Wahid Khan', 'Faheem Khan', 'Muhammad Adnan Khan', 'Taeg Keun Whangbo'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-9-3",
    "pageId": "page-hci-ui-9",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "DevOps is a set of practices and a cultural movement that aims to break down barriers between development and operation teams to improve collaboration and communication. Different organizations have embraced DevOps principles due to the massive potential, such as a much shorter time to production, increased reliability and stability. However, despite the widespread adoption of DevOps and its infrastructure, there is a lack of understanding and literature on the key concepts, practices, tools, and challenges associated with implementing DevOps strategies. The main goal of this research paper is to explore and discuss challenges related to DevOps culture and practices. Moreover, it describes how DevOps works in an organization, provides a detailed explanation of DevOps, and investigates the cultural challenges that organizations face when implementing DevOps. The proposed paper reveals ten critical challenges that need to be addressed in adopting the DevOps culture. The challenges are further analyzed on the basis of the various continents. According to the findings, the following critical challenges are considered during the implementation of a DevOps culture: lack of collaboration and communication, Lack of skill and knowledge, complicated infrastructure, Lack of management, Lack of DevOps approach, and trust confidence problems."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-10-1",
    "pageId": "page-hci-ui-10",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "SARD: Towards Scale-Aware Rotated Object Detection in Aerial Imagery"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-10-2",
    "pageId": "page-hci-ui-10",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Yashan Wang', 'Yue Zhang', 'Yi Zhang', 'Liangjin Zhao', 'Xian Sun', 'Zhi Guo'] | Year: 2019 | Citations: 18"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-10-3",
    "pageId": "page-hci-ui-10",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Multi-class object detection in remote sensing imagery is an important and challenging topic in computer vision. Compared with the object detection of natural scenes, remote sensing object detection has some challenges such as scale diversity, arbitrary directions and densely packed objects. To resolve these problems, this paper presents a scale-aware rotated object detection. Firstly, we propose a novel feature fusion module, which takes full advantage of high-level semantic information and low-level high resolution feature. The new feature maps are more suitable for detecting objects with a large difference in scale. Meanwhile, we design a specific weighted loss, which contains an intersection-over-union (IoU) loss and a smooth L1 loss to further address the scale diversity. Besides, in order to detect oriented and densely packed objects more accurately, we propose a normalization strategy for the representation of rotating bounding box. Our method is evaluated on two public aerial datasets DOTA and HRSC2016, and achieves competitive performances. On DOTA, we boost the mean Average Precision (mAP) to 72.95% on oriented object detection."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-11-1",
    "pageId": "page-hci-ui-11",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Wind Speed Prediction Using Hybrid 1D CNN and BLSTM Network"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-11-2",
    "pageId": "page-hci-ui-11",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Abdulmajid Lawal', 'Shafiqur Rehman', 'Luai M. Alhems', 'Md. Mahbub Alam'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-11-3",
    "pageId": "page-hci-ui-11",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "As the world witnesses population increase, the global power demand is increasing and the need for exploring other alternative clean and self-renewable sources of energy such as wind has become necessary. For optimal operation of the wind farms and stability of the grid, wind prediction ahead of time is of key importance. An accurate forecast of wind speed is often difficult due to the unpredictable nature of the wind. In this work, we utilized different machine learning models and proposed a hybrid machine learning approach. This approach combines 1D convolutional neural network (CNN) and bidirectional long short term memory (BLSTM) network for accurate prediction of short term wind prediction at different heights above ground level (AGL). The 1D CNN model extracts high-level features of the input wind speed data. The extracted features are then fed as input to the BLSTM network for wind speed prediction. The wind speed time series data used in this study are measured at 18, and 98 meters AGL. The study further presents a relationship between the utilized models and prediction accuracy at different heights. The forecasting performance of the models tends to increase as the height AGL increases. A real-world case study is implemented to demonstrate the effectiveness of the proposed CNN-BLSTM method in Saudi Arabia. The mean absolute error (MAE), mean squared error (MSE), root mean squared error (RMSE), and mean absolute percentage error (MAPE) are used as performance indices to evaluate the performance of the proposed CNN-BLTSM model. The corresponding results show that the proposed method outperforms other benchmark models."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-12-1",
    "pageId": "page-hci-ui-12",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "A Linear Fractional Transformation Based Approach to Robust Model Predictive Control Design in Uncertain Systems"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-12-2",
    "pageId": "page-hci-ui-12",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Valiollah Ghaffari', 'Saleh Mobayen', 'Wing-Kwong Wong'] | Year: 2020 | Citations: 1"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-12-3",
    "pageId": "page-hci-ui-12",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "A novel robust model predictive control (RMPC) scheme is developed for uncertain nonlinear systems. To the RMPC design, firstly, the uncertain system would be described using a linear fractional transformation (LFT). Then, regarding the system's uncertainties and control limitations, a linear matrix inequality (LMI) based control strategy is addressed to translate the RMPC synthesis into a minimization problem. Thus the controller's gains are automatically updated at some time-instants by the solution of such optimization problem. Finally, the outcomes are numerically applied in some control examples. The simulation results show the effectiveness of the suggested robust predictive controller in comparison to similar RMPC techniques."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-13-1",
    "pageId": "page-hci-ui-13",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Enhanced Remote Areas Communications: The Missing Scenario for 5G and Beyond 5G Networks"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-13-2",
    "pageId": "page-hci-ui-13",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Luciano Leonel Mendes', 'Carlos Sall\u00e9 Moreno', 'Maria Val\u00e9ria Marquezini', 'Andr\u00e9 Mendes Cavalcante', 'Peter Neuhaus', 'Jorge Seki', 'Nath\u00e1lia Figueiredo Tinoco Aniceto', 'Heikki Karvonen', 'Ivan Vidal', 'Francisco Valera', 'Priscila America Sol\u00eds Mendez Barreto', 'Marcos Fagundes Caetano', 'Wheberth Damascena Dias', 'Gerhard Fettweis'] | Year: 2020 | Citations: 3"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-13-3",
    "pageId": "page-hci-ui-13",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "The next generation of mobile communication system will allow a plethora of new services and use cases. By offering support for high throughput connections, low latency response and massive number of connections, the fifth generation of the mobile network will trigger applications unseen in any other network. However, one important application scenario is not being properly addressed by the players responsible for the mobile networks' standardization, that is the remote and rural areas network. This scenario requires large cells with high throughput, flexibility to opportunistically exploit free bands below 1 GHz and spectrum agility to change the operational frequency when an incumbent is detected. Incipient actions are being considered for the Release 17 but based on the new radio specification as starting point. The limitations imposed by orthogonal waveforms in the physical layers hinder the exploitation of vacant TV channels in rural and remote areas. 5G-RANGE, a Brazil-Europe bilateral cooperation project, aims at conceiving, implementing and deploying an innovative mobile network, designed to provide reliable and cost-effective connection in these regions. This network can be seamlessly integrated with the other 5G scenarios, closing the connectivity gap between the urban, rural and remote areas. Hence, 5G-RANGE network is an interesting complementary solution for beyond 5G standards. This paper presents the major achievements of the 5G-RANGE project, from the design of the physical, medium access control and network layers, to the field demonstrations. The paper also covers the business models that can be used to make the deployment of this technology a reality."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-14-1",
    "pageId": "page-hci-ui-14",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Delay-Dependent H\u221e Control for Singular Markovian Jump Systems With Generally Uncertain Transition Rates"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-14-2",
    "pageId": "page-hci-ui-14",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Chunyu Li', 'Lin Li', 'Anyou Shen'] | Year: 2020 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-14-3",
    "pageId": "page-hci-ui-14",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "This article is devoted to the problem of H control for a class of singular Markovian jump systems with time-varying delay and generally uncertain transition rates, which means each transition rate is completely unknown or only its estimated value is known. By using Lyapunov stability theory, a new delay-dependent H admissible criterion in terms of strict linear matrix inequalities is obtained, which guarantees that the singular Markovian jump system with known transitions rates is regular, impulse-free and stochastically stable with a prescribed H disturbance attenuation level \u03b3. Based on this obtained criterion, some suitable state feedback controllers are designed such that the closed-loop delayed singular Markovian jump system with generally uncertain transition rates is H stochastically admissible. Finally, numerical examples are included to illustrate the effectiveness and the less conservativeness of the proposed method."
    },
    "order": 3
  },
  {
    "id": "blk-page-hci-ui-15-1",
    "pageId": "page-hci-ui-15",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Investigating Frontal Neurovascular Coupling in Response to Workplace Design-Related Stress"
    },
    "order": 1
  },
  {
    "id": "blk-page-hci-ui-15-2",
    "pageId": "page-hci-ui-15",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Emad Alyan', 'Naufal M. Saad', 'Nidal Kamel', 'Mohammad Abdul Rahman'] | Year: 2020 | Citations: 5"
    },
    "order": 2
  },
  {
    "id": "blk-page-hci-ui-15-3",
    "pageId": "page-hci-ui-15",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "This research seeks to examine the impact of workstation types on the coupling of neural and vascular activities of the prefrontal cortex (PFC). The design of the workstations was found to impair the performance, physical and mental health of employees. However, the mechanism underlying cognitive activity involved during workstation design-related stress effects in the PFC has not been fully understood. We used electroencephalography (EEG) and functional near-infrared spectroscopy (fNIRS) to simultaneously measure electrical activity and hemoglobin concentration changes in the PFC. The multimodal signal was collected from 23 healthy adult volunteers who completed the Montreal imaging stress task in ergonomic and non-ergonomic workstations. A supervised machine learning method based on temporally embedded canonical correlation analysis (tCCA) was utilized to obtain the association between neural activity and local changes in hemoglobin concentrations to enhance localization and accuracy. The results showed deactivation in alpha power rhythms and oxygenated hemoglobin, as well as declined activation pattern of the fused data in the right PFC at the non-ergonomic workstation. Additionally, all participants at the non-ergonomic workstation experienced a substantial rise in salivary alpha-amylase activity in comparison with the ergonomic workstation, indicating the existence of high-stress levels. The proposed tCCA approach obtains excellent results in discriminating workstation types achieving accuracies of 98.8% and a significant improvement of 8.0% (p <; 0.0001) and 9.4% (p <; 0.0001) over EEG-only and fNIRS-only, respectively. Our study suggests the use of functional neuroimaging in designing the workplace as it provides critical information on the causes of workplace-related stress."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-1-1",
    "pageId": "page-power-energy-1",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Transverse Damage Localization and Quantitative Size Estimation for Composite Laminates Based on Lamb Waves"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-1-2",
    "pageId": "page-power-energy-1",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['M. Saqib Hameed', 'Zheng Li'] | Year: 2019 | Citations: 3"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-1-3",
    "pageId": "page-power-energy-1",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "The damage detection method for composite laminates introduced in this research uses piezoelectric (lead zirconate titanate, PZT) transducers to excite/sense the Lamb wave signals. The complicated wave signals scattered by damage are accurately processed using a continuous wavelet transformation (CWT) based on the Gabor wavelet. The transducers are arranged on a composite laminate in the form of a network of square detection cells and triangular subcells. The damage location is estimated using the concept of centroid in two-stage detection method. The first stage detection is carried out by exciting a transducer at the center of each detection cell to locate the damaged cell and subcell. The damage localization is improved by exciting an additional transducer at the corner of the damaged subcell during the second stage detection. The damage size is then quantitatively estimated using cubic spline curve (CSC) and elliptical parametric (EP) methods based on the damage edge points. The damage location is estimated in two detection stages for high-accuracy because the damage edge points are calculated with reference to the estimated location of the damage. The arrangement of transducers and signal processing technique remain the same at all the stages of damage detection. Results from previous detection stages contribute to the improvement of damage detection in the subsequent stages. The size of detection cell plays a crucial role in designing the detection stages, and the proposed method can accurately quantify both location and size of the damage in composite laminate."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-2-1",
    "pageId": "page-power-energy-2",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "MSDF-Net: Multi-Scale Deep Fusion Network for Stroke Lesion Segmentation"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-2-2",
    "pageId": "page-power-energy-2",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Xinfeng Liu', 'Hao Yang', 'Kehan Qi', 'Pei Dong', 'Qiegen Liu', 'Xin Liu', 'Rongpin Wang', 'Shanshan Wang'] | Year: 2019 | Citations: 8"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-2-3",
    "pageId": "page-power-energy-2",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Lesion segmentation is of great research interest due to its capability in facilitating accurate stroke diagnosis and surgical planning. Existing deep neural networks, such as U-net, have demonstrated encouraging progress in biomedical image segmentation. Nevertheless, there are still many challenges related to the segmentation of stroke lesions, including dealing with diverse lesion locations, variations in lesion scales, and fuzzy lesion boundaries. In order to address these challenges, this paper proposes a deep neural network architecture denoted as the Multi-Scale Deep Fusion Network (MSDF-Net) with Atrous Spatial Pyramid Pooling (ASPP) for the feature extraction at different scales, and the inclusion of capsules to deal with complicated relative entities. The proposed method is essentially an end-to-end deep encoder-decoder neural network. The cross connection between the encoder and the decoder guarantees the high resolution of the feature mapping. Experimental results on the open-source Anatomical Tracings of Lesions After Stroke (ATLAS) dataset shows that the proposed model achieved a higher evaluating score compared to 5 existing models."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-3-1",
    "pageId": "page-power-energy-3",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Deep Learning for Improving the Robustness of Image Encryption"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-3-2",
    "pageId": "page-power-energy-3",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Jing Chen', 'Xiao-Wei Li', 'Qiong-Hua Wang'] | Year: 2019 | Citations: 9"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-3-3",
    "pageId": "page-power-energy-3",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "In this paper, we propose a method to increase the robustness of 2D/3D optical image encryption using the dilated deep convolutional neural network (CNN). In order to solve the problem that encrypted images suffer from some attacks in practical application, we utilize a fast and effective CNN denoiser based on the principle of deep learning. The CNN improves the robustness of the algorithm by improving the resolution of the reconstructed images. Besides, CNN has a high performance against blur and occlusion attacks. We introduce the pixel scrambling method to enhance the security level of the encryption by the private key of pixel scrambling operation. The proposed method can not only realize the encryption of a two-dimensional image but also implement three-dimensional image encryption by combining the integral imaging technology. Double random phase encoding in the fractional Fourier domain is selected for experimental verification, and the results show the capability for robustness, noise immunity, and security of the proposed method."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-4-1",
    "pageId": "page-power-energy-4",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Study on Energized Mixed-phase Icing of CFCCW and its Effect on AC Corona Onset Voltage"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-4-2",
    "pageId": "page-power-energy-4",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Bingbing Dong', 'Jiale Song', 'Changsheng Gao', 'Zelin Zhang', 'Yu Gu', 'Nianwen Xiang'] | Year: 2020 | Citations: 1"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-4-3",
    "pageId": "page-power-energy-4",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "In winters, China witnesses frequent mixed-phase ice disasters, which have a detrimental impact on the secure operation of transmission lines. Most of the studies are focused on the conventional overhead lines, and little attention is paid to the novel carbon fiber composite core wire (CFCCW), which were widely used in recent years. Besides, the influence rule of frequent mixed-phase icing on the corona onset characteristics for CFCCW has not been extensively studied across extant literature. Thus, this article addresses the aforementioned issues by conducting Alternating Current (AC) corona tests for four kinds of CFCCW that would be coated by mixed-phase ice in a low-temperature laboratory. The results showed that the impact of mixed-phase ice on the wire corona onset voltage can be reduced by nearly 50%. With more icing the corona onset voltage would further decrease but at a slower pace. For the wires with a larger diameter, higher corona onset voltage with low distortion in the electric field strength was observed for the same icing time. For the freezing-water conductivity, no significant impact on both the icing morphology and the corona onset voltage was observed. Moreover, the validation for the simulation model was established by comparing the simulation results with the experimental results. These inferences drawn could act as a theoretical reference for transmission lines designing and calculating the wire corona onset voltage in the mixed-phase icing areas."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-5-1",
    "pageId": "page-power-energy-5",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "A Distributed Survivable Routing Algorithm for Mega-Constellations With Inclined Orbits"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-5-2",
    "pageId": "page-power-energy-5",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Xiaoxin Qi', 'Bing Zhang', 'Zhiliang Qiu'] | Year: 2020 | Citations: 1"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-5-3",
    "pageId": "page-power-energy-5",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Mega-constellations consisting of hundreds to thousands of low-earth-orbit (LEO) satellites are an attractive solution for providing global ubiquitous network access. Due to good coverage properties for populated areas, inclined orbits are gaining popularity among commercial constellations. A scalable routing algorithm with survivability plays a key role in such systems. In this paper, we propose a distributed survivable routing algorithm for mega-constellations with inclined orbits. First, the special topology characteristic of inclined constellations is identified and formalized. Based on the topology characterization, a basic X-Y routing algorithm is presented to determine multiple primary and secondary paths towards each destination utilizing the regularity of the network topology with minimal computation overhead. Then, a failure recovery mechanism which consists of a restricted flooding mechanism and a pre-detour mechanism is proposed to reduce end-to-end delay and signaling overhead in case of link failures. Besides, a partial-record loop avoidance mechanism is proposed to deal with routing loops with minimal overhead. Finally, a vector-based next hop selection mechanism is proposed to facilitate the selection of next hop while incorporating various criteria. The performance of the proposed routing algorithm is evaluated through simulation on the Starlink constellation. Simulation results show that our proposal achieves scalability by reducing signaling overhead and provides better quality of service in terms of end-to-end delay under link failures."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-6-1",
    "pageId": "page-power-energy-6",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "A Hybrid Deep Learning Approach for Replay and DDoS Attack Detection in a Smart City"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-6-2",
    "pageId": "page-power-energy-6",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Asmaa A. Elsaeidy', 'Abbas Jamalipour', 'Kumudu S. Munasinghe'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-6-3",
    "pageId": "page-power-energy-6",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Today\u2019s smart city infrastructure is predominantly dependant on Internet of Things (IoT) technologies. IoT technology essentially facilitates a platform for service automation through connections of heterogeneous objects via the Internet backbone. However, the security issues associated with IoT networks make smart city infrastructure vulnerable to cyber-attacks. For example, Distributed Denial of Service (DDoS) attack violates the authorization conditions in smart city infrastructure; whereas replay attack violates the authentication conditions in smart city infrastructure. Both attacks lead to physical disruption to smart city infrastructure, which may even lead to financial loss and/or loss of human lives. In this paper, a hybrid deep learning model is developed for detecting replay and DDoS attacks in a real life smart city platform. The performance of the proposed hybrid model is evaluated using real life smart city datasets (environmental, smart river and smart soil), where DDoS and replay attacks were simulated. The proposed model reported high accuracy rates: 98.37% for the environmental dataset, 98.13% for the smart river dataset, and 99.51% for the smart soil dataset. The results demonstrated an improved performance of the proposed model over other machine learning and deep learning models from the literature."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-7-1",
    "pageId": "page-power-energy-7",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Occlusion Handling and Multi-Scale Pedestrian Detection Based on Deep Learning: A Review"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-7-2",
    "pageId": "page-power-energy-7",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Fang Li', 'Xueyuan Li', 'Qi Liu', 'Zirui Li'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-7-3",
    "pageId": "page-power-energy-7",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Pedestrian detection is an important branch of computer vision, and has important applications in the fields of autonomous driving, artificial intelligence and video surveillance. With the rapid development of deep learning and the proposal of large-scale datasets, pedestrian detection has reached a new stage and has achieved better performance. However, the performance of state-of-the-art methods is far behind expectations, especially when occlusion and scale variance exist. Therefore, many works focused on occlusion and scale variance have been proposed in the past few years. The purpose of this article is to make a detailed review of recent progress in pedestrian detection. First, a brief progress of pedestrian detection in the past two decades is summarized. Second, recent deep learning methods focusing on occlusion and scale variance are analyzed. Moreover, the popular datasets and evaluation methods for pedestrian detection are introduced. Finally, the development trends in pedestrian detection are discussed."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-8-1",
    "pageId": "page-power-energy-8",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Pattern Matching Based on Object Graphs"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-8-2",
    "pageId": "page-power-energy-8",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Wei Ke', 'Ka-Hou Chan'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-8-3",
    "pageId": "page-power-energy-8",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Pattern matching has been widely adopted in functional programming languages, and is gradually getting popular in OO languages, from Scala to Python. The structural pattern matching currently in use has its foundation on algebraic data types from functional languages. To better reflect the pointer structures of OO programs, we propose a pattern matching extension to general statically typed OO languages based on object graphs. By this extension, we support patterns having aliasing and circular referencing, that are typically found in pointer structures. With the requirement of only an abstract subtyping preorder on types, our extension is not restricted to a particular hierarchical class model. We give the formal base of the graph model, that is able to handle aliases and cycles in patterns, together with the abstract syntax to construct the object graphs. More complex cases of conjunction and disjunction of multiple patterns are explored with resolution. We present the type checking rules and operational semantics to reason about the soundness by proving the type safety. We also discuss the design decisions, applicability and limitation of our pattern matching extension."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-9-1",
    "pageId": "page-power-energy-9",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Nondestructive Acoustic Testing of Ceramic Capacitors Using One-Class Support Vector Machine With Automated Hyperparameter Selection"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-9-2",
    "pageId": "page-power-energy-9",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Saku Levikari', 'Tommi J. K\u00e4rkk\u00e4inen', 'Caroline Andersson', 'Juha Tamminen', 'Mikko Nykyri', 'Pertti Silventoinen'] | Year: 2020 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-9-3",
    "pageId": "page-power-energy-9",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "The energy transition and electrification across many industries place increasingly more weight on the reliability of power electronics. A significant fraction of breakdowns in electronic devices result from capacitor failures. Multilayer ceramic capacitors, the most common capacitor type, are especially prone to mechanical damage, for instance, during the assembly of a printed circuit board. Such damage may dramatically shorten the life span of the component, eventually resulting in failure of the entire electronic device. Unfortunately, current electrical production line testing methods are often unable to reveal these types of damage. While recent studies have shown that acoustic measurements can provide information about the structural condition of a capacitor, reliable detection of damage from acoustic signals remains difficult. Although supervised machine learning classifiers have been proposed as a solution, they require a large training data set containing manually inspected damaged and intact capacitor samples. In this work, acoustic identification of damaged capacitors is demonstrated without a manually labeled data set. Accurate and robust classification is achieved by using a one-class support vector machine, a machine learning model trained solely on intact capacitors. Furthermore, a new algorithm for optimizing the classification performance of the model is presented. By the proposed approach, acoustic testing can be generalized to various capacitor sizes, making it a potential tool for production line testing."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-10-1",
    "pageId": "page-power-energy-10",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "A Cross-Disciplinary View of Testing and Bioinformatic Analysis of SARS-CoV-2 and Other Human Respiratory Viruses in Pandemic Settings"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-10-2",
    "pageId": "page-power-energy-10",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Md Arafat Hossain', 'Barbara Brito-Rodriguez', 'Lisa M. Sedger', 'John Canning'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-10-3",
    "pageId": "page-power-energy-10",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "The SARS-Coronavirus-2 (SARS-CoV-2) infectious disease, COVID-19, has spread rapidly, resulting in a global pandemic with significant mortality. The combination of early diagnosis via rapid screening, contact tracing, social distancing and quarantine has helped to control the pandemic. The absence of real time response and diagnosis is a crucial technology shortfall and is a key reason why current contact tracing methods are inadequate to control spread. In contrast, current information technology combined with a new generation of near-real time tests offers consumer-engaged smartphone-based \u201clab-in-a-phone\u201d internet-of-things (IoT) connected devices that provide increased pandemic monitoring. This review brings together key aspects required to create an entire global diagnostic ecosystem. Cross-disciplinary understanding and integration of both mechanisms and technologies for effective detection, incidence mapping and disease containment in near real-time is summarized. Available measures to monitor and/or sterilize surfaces, next-generation laboratory and smartphone-based diagnostic approaches can be brought together and networked for instant global monitoring that informs Public Health policy. Cloud-based analysis enabling real-time mapping will enable future pandemic control, drive the suppression and elimination of disease spread, saving millions of lives globally. A new paradigm is introduced \u2013 scaled and multiple diagnostics for mapping and spreading of a pandemic rather than traditional accumulation of individual measurements. This can do away with the need for ultra-precise and ultra-accurate analysis by taking mass measurements that can relax tolerances and build resilience through networked analytics and informatics, the basis for novel swarm diagnostics. These include addressing ethical standards, local, national and international collaborative engagement, multidisciplinary and analytical measurements and standards, and data handling and storage protocol..."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-11-1",
    "pageId": "page-power-energy-11",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "An Industry 4.0 Asset Administration Shell-Enabled Digital Solution for Robot-Based Manufacturing Systems"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-11-2",
    "pageId": "page-power-energy-11",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Xun Ye', 'Seung Ho Hong', 'Won Seok Song', 'Yu Chul Kim', 'Xiongfeng Zhang'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-11-3",
    "pageId": "page-power-energy-11",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "The increasing penetration of cyber-physical system (CPS) technologies in industry is transforming this environment into a multifaceted system featuring a tight combination of its physical and computational elements, including their digital (virtual) representations, contributing to the concept of an industrial CPS. The German \u201cIndustry 4.0\u201d is a key innovation program aimed at realizing industrial CPS. Industry 4.0 is characterized by digital industrial components interacting with each other to become systems meeting flexible industrial demands, e.g., order-controlled production. An asset administration shell (AAS), as defined in the context of the Reference Architectural Model for Industry 4.0 (RAMI 4.0), is a practical embodiment of the latest buzzword, digital twin, and can be realized with the integration of operation technologies and information and communication technologies. AASs offer an interoperable way to capture key information pertaining to assets, such as intrinsic properties, operational parameters, and technical functionalities, and to enable straightforward interaction over standardized, secure communication with other Industry 4.0 components. The goal of this article is to present the status quo of AAS development, to design an intuitive method for implementing AASs, and to develop an AAS-enabled digital solution for cyber-physical applications in the manufacturing sector. Last but not least, we demonstrate a case study featuring an Industry 4.0 application scenario, i.e., plug-and-produce."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-12-1",
    "pageId": "page-power-energy-12",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "High-Performance Time Series Prediction With Predictive Error Compensated Wavelet Neural Networks"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-12-2",
    "pageId": "page-power-energy-12",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Burak Berk Ustundag', 'Ajla Kulaglic'] | Year: 2020 | Citations: 3"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-12-3",
    "pageId": "page-power-energy-12",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Machine learning (ML) algorithms have gained prominence in time series prediction problems. Depending on the nature of the time series data, it can be difficult to build an accurate ML model with the proper structure and hyperparameters. In this study, we propose a predictive error compensation wavelet neural network model (PEC-WNN) for improving the prediction accuracy of chaotic and stochastic time series data. In the proposed model, an additional network is used for the prediction of the main network error to compensate the overall prediction error. The main network takes as inputs the time series data through moving frames in multiple-scales. The same structure and hyperparameter sets are applied for quite distinct four types of problems for verification of the robustness and accuracy of the proposed model. Specifically, the Mackey-Glass, Box-Jenkins, and Lorenz Attractor benchmark problems, as well as drought forecasting are used to characterize the performance of the model for chaotic and stochastic data cases. The results show that the PEC-WNN provides significantly more accurate predictions for all compared benchmark problems with respect to conventional machine learning and time series prediction methods without changing any hyperparameter or the structure. In addition, the time and space complexity of the PEC-WNN model is less than all other compared ML methods, including long short-term memory (LSTM) and convolutional neural networks (CNNs)."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-13-1",
    "pageId": "page-power-energy-13",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "IoTsecM: A UML/SysML Extension for Internet of Things Security Modeling"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-13-2",
    "pageId": "page-power-energy-13",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Ponciano Jorge Escamilla-Ambrosio', 'David Alejandro Robles-Ram\u00edrez', 'Theo Tryfonas', 'Abraham Rodr\u00edguez-Mota', 'Gina Gallegos-Garc\u00eda', 'Mois\u00e9s Salinas-Rosales'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-13-3",
    "pageId": "page-power-energy-13",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "In this paper, an approach referred to as IoTsecM is proposed. This proposal is a UML/SysML extension for security requirements modeling within the analysis stage in a waterfall development life cycle in a Model-Based Systems Engineering Approach. IoTsecM allows the security requirements representation in two very well-known modeling languages, UML and SysML. With the utilization of this extension, IoT developers can consider the security requirements from the analysis stage in the design process of IoT systems. IoTsecM allows IoT systems to be designed considering possible threats and the corresponding security requirements analysis. The applicability of IoTsecM is demonstrated through applying it to analyze and represent the security requirements in an IoT real-life system in the context of collaborative autonomous vehicles in smart cities. In this use case, IoTsecM was able to represent the security requirements identified within the system architecture elements, in which all countermeasures identified were depicted using the proposed IoTsecM profile."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-14-1",
    "pageId": "page-power-energy-14",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Electrodynamics of Axial-Flow Rotary Blood Pumps"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-14-2",
    "pageId": "page-power-energy-14",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Igor V. Nesterenko', 'Alexander A. Pugovkin', 'Steffen Leonhardt', 'Marian Walter', 'Patrick Borchers', 'Aleksandr Markov', 'Jamshid H. Karimov', 'Sergey V. Selishchev', 'Dmitry V. Telyshev'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-14-3",
    "pageId": "page-power-energy-14",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "In this work, electric machine of implantable rotary blood pumps (RBPs) of axial-flow type was theoretically investigated. Electromagnetic coupling of rotor and stator in axial-flow RBPs was described with the Maxwell\u2019s equations of the classical electrodynamics given quasi-magnetostatic approximation of electromagnetic field in the simplified model consisting of permanent magnet and conductive loop rotating in free space with one spatial degree of freedom. Additionally, relative field error, created by the neglect of geometric deviations introduced through manufacturing tolerances, was estimated for a typical axial-flow RBP. Upper limit of error introduced by the simplifications was estimated less than 0.2 %, leading to the finite accuracy of the description and clearly determining the influence on the control signal. Based on the presented description and additional engineering considerations, the electric machine of axial-flow RBPs was defined as a three-phase non-salient pole synchronous machine with a permanent magnet rotor. Two key features were shown: a) unlike the conventional electric motors, signal of back electromotive force tends to be a sinusoidal waveform in any construction of axial-flow RBP with significant non-magnetic gap; b) the optimal waveform of control signal in this case is sinusoidal. Initial design and control parameters of the electric machine in axial-flow RBPs can be accurately determined with presented theoretical description. Based on the description, control system of an axial-flow RBP with the optimal waveform of control signal can be developed."
    },
    "order": 3
  },
  {
    "id": "blk-page-power-energy-15-1",
    "pageId": "page-power-energy-15",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "An LSTM-Based Approach for Understanding Human Interactions Using Hybrid Feature Descriptors Over Depth Sensors"
    },
    "order": 1
  },
  {
    "id": "blk-page-power-energy-15-2",
    "pageId": "page-power-energy-15",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Manahil Waheed', 'Ahmad Jalal', 'Mohammed Alarfaj', 'Yazeed Yasin Ghadi', 'Tamara Al Shloul', 'Shaharyar Kamal', 'Dong-Seong Kim'] | Year: 2021 | Citations: 1"
    },
    "order": 2
  },
  {
    "id": "blk-page-power-energy-15-3",
    "pageId": "page-power-energy-15",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Over the past few years, automatic recognition of human interactions has drawn significant attention from researchers working in the field of Artificial Intelligence (AI). And feature extraction is one of the most critical tasks in developing efficient Human Interaction Recognition (HIR) systems. Moreover, recent researches in computer vision suggest that robust features lead to higher recognition accuracies. Hence, an improved HIR system has been proposed in this paper that combines 2D and 3D features extracted using machine learning and deep learning techniques. These discriminative features result in accurate classification and help avoid misclassification of similar interactions. Ten keyframes have been extracted from each video to reduce computational complexity. Next, these frames have been preprocessed using image normalization and noise removal techniques. The Region Of Interest (ROI), which contains the two humans involved in the interaction, has been extracted using motion detection. Then, the human silhouettes have been segmented using the GrabCut algorithm. Next, the extracted silhouettes have been converted into 3D meshes and their heat kernel signatures (HKS) have been obtained to extract key body points. A Convolutional Neural Network (CNN) has been used to extract full-body features from 2D full-body silhouettes. Then, topological and geometric features have been extracted from the key body points. Finally, the combined feature vector has been fed into Long Short-Term Memory (LSTM) and each interaction has been recognized using a Softmax classifier. The proposed system has been validated via extensive experimentation on three challenging RGB+D datasets. The recognition accuracies of 91.63%, 90.54%, and 90.13% have been achieved with the SBU Kinect Interaction, NTU RGB+D, and ISR-UoL 3D social activity datasets respectively. The results of extensive experiments performed on the proposed system suggest that it can be used effectively for various applic..."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-1-1",
    "pageId": "page-biomedical-signal-1",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Fractional-Fuzzy PID Control Approach of Photovoltaic-Wire Feeder System (PV-WFS): Simulation and HIL-Based Experimental Investigation"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-1-2",
    "pageId": "page-biomedical-signal-1",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Badreddine Babes', 'Fahad Albalawi', 'Noureddine Hamouda', 'Sami Kahla', 'Sherif S. M. Ghoneim'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-1-3",
    "pageId": "page-biomedical-signal-1",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "The utilization of solar photovoltaic (PV) generator as a power source for wire feeder systems (WFSs) of arc welding machines is one of the promising domains in solar PV applications. This article proposes a new type of welding WFS and investigates the PV penetrated energy systems. The proposed system comprises of a solar PV generator, a DC/DC buck converter, and a permanent magnet DC (PMDC) motor. The power of the proposed standalone solar photovoltaic-wire feeder system (PV-WFS) can be widely improved using an intelligent fractional-order fuzzy proportional integral derivative (FO-Fuzzy-PID) regulator based on perturbing and observe (P&O) MPPT method. In this article, a FO-Fuzzy-PID regulator is also designed for a PMDC motor driven welding WFS system. Which will then control the wire feed rate of the welding WFS system. Furthermore, the dynamic reaction of the proposed solar PV-WFS depends on the coefficients of these FO-Fuzzy-PID regulators, which are adjusted by a meta-heuristic tuning algorithm based on particle swarm optimization (PSO) technique. The proposed strategy is tested using MATLAB simulations and experimentally verified in real-time on a Hardware-in-the-loop (HIL) testing platform using a dSPACE 1104 board-based laboratory setup. Simulation and experimental results are acceptable and demonstrate the effectiveness, precision, stability, and dynamic reaction of the suggested optimized wire feeder regulating system and the considered intelligent P&O MPPT technique."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-2-1",
    "pageId": "page-biomedical-signal-2",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Twin Delayed Deep Deterministic Policy Gradient-Based Target Tracking for Unmanned Aerial Vehicle With Achievement Rewarding and Multistage Training"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-2-2",
    "pageId": "page-biomedical-signal-2",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Najmaddin Abo Mosali', 'Syariful Syafiq Shamsudin', 'Omar Alfandi', 'Rosli Omar', 'Najib Al-Fadhali'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-2-3",
    "pageId": "page-biomedical-signal-2",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Target tracking using an unmanned aerial vehicle (UAV) is a challenging robotic problem. It requires handling a high level of nonlinearity and dynamics. Model-free control effectively handles the uncertain nature of the problem, and reinforcement learning (RL)-based approaches are a good candidate for solving this problem. In this article, the Twin Delayed Deep Deterministic Policy Gradient Algorithm (TD3), as recent and composite architecture of RL, was explored as a tracking agent for the UAV-based target tracking problem. Several improvements on the original TD3 were also performed. First, the proportional-differential controller was used to boost the exploration of the TD3 in training. Second, a novel reward formulation for the UAV-based target tracking enabled a careful combination of the various dynamic variables in the reward functions. This was accomplished by incorporating two exponential functions to limit the effect of velocity and acceleration to prevent the deformation in the policy function approximation. In addition, the concept of multistage training based on the dynamic variables was proposed as an opposing concept to one-stage combinatory training. Third, an enhancement of the rewarding function by including piecewise decomposition was used to enable more stable learning behaviour of the policy and move out from the linear reward to the achievement formula. The training was conducted based on fixed target tracking followed by moving target tracking. The flight testing was conducted based on three types of target trajectories: fixed, square, and blinking. The multistage training achieved the best performance with both exponential and achievement rewarding for the fixed trained agent with the fixed and square moving target and for the combined agent with both exponential and achievement rewarding for a fixed trained agent in the case of a blinking target. With respect to the traditional proportional differential controller, the maximum error reductio..."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-3-1",
    "pageId": "page-biomedical-signal-3",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Refining the Fusion of Pepper Robot and Estimated Depth Maps Method for Improved 3D Perception"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-3-2",
    "pageId": "page-biomedical-signal-3",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Zuria Bauer', 'Felix Escalona', 'Edmanuel Cruz', 'Miguel Cazorla', 'Francisco Gomez-Donoso'] | Year: 2019 | Citations: 2"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-3-3",
    "pageId": "page-biomedical-signal-3",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "As it is well known, some versions of the Pepper robot provide poor depth perception due to the lenses it has in front of the tridimensional sensor. In this paper, we present a method to improving that faulty 3D perception. Our proposal is based on a combination of the actual depth readings of Pepper and a deep learning-based monocular depth estimation. As shown, the combination of both of them provides a better 3D representation of the scene. In previous works we made an initial approximation of this fusion technique, but it had some drawbacks. In this paper we analyze the pros and cons of the Pepper readings, the monocular depth estimation method and our previous fusion method. Finally, we demonstrate that the proposed fusion method outperforms them all."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-4-1",
    "pageId": "page-biomedical-signal-4",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Parallel Computing for Obtaining Regional Scale Rice Growth Conditions Based on WOFOST and Satellite Images"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-4-2",
    "pageId": "page-biomedical-signal-4",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Bingyu Zhao', 'Meiling Liu', 'Jianjun Wu', 'Xiangnan Liu', 'Mengxue Liu', 'Ling Wu'] | Year: 2020 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-4-3",
    "pageId": "page-biomedical-signal-4",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "It is very important to obtain continuous regional crop parameters efficiently in the agricultural field. However, remote sensing data can provide spatial-continuous / temporal-disperse crop information while crop growth model can provide temporal-continuous / spatial-disperse crop information. Therefore, the assimilation between crop growth model and remote sensing data is an efficient way for obtaining continuous vegetation growth information. This study aims to present a parallel method based on graphic processing unit (GPU) to improve the efficiency of the assimilation between RS data and crop growth model to estimate rice growth parameters. Remote sensing data, Landsat and HJ-1 images, were collected and the World Food Studies (WOFOST) crop growth model which has a strong flexibility was employed. To acquire continuous regional crop parameters, particle swarm optimization (PSO) data assimilation method was used to combine remote sensing images and WOFOST and this process is accompanied by a parallel method based on the Compute Unified Device Architecture (CUDA) platform of NVIDIA GPU. With these methods, we obtained daily rice growth parameters of Zhuzhou City, Hunan, China and compared the efficiency and precision of parallel method and non-parallel method. Results showed that the parallel program has a remarkable speedup (reaching 240 times) compared with the non-parallel program with a similar accuracy. This study indicated that the parallel implementation based on GPU was successful in improving the efficiency of the assimilation between RS data and the WOFOST model."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-5-1",
    "pageId": "page-biomedical-signal-5",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Reducing the System Overhead of Millimeter-Wave Beamforming With Neural Networks for 5G and Beyond"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-5-2",
    "pageId": "page-biomedical-signal-5",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Pengfei Xue', 'Yuhong Huang', 'Dongzhi Zhu', 'Youping Zhao', 'Chen Sun'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-5-3",
    "pageId": "page-biomedical-signal-5",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "To accommodate the rapid change of radio propagation environment for mobile communication scenarios, millimeter-wave beamforming requires instantaneous channel state information (CSI) to update its operational parameters in real time, resulting in heavy system overhead. As the number of antennas increases, the system overhead associated with beam management will increase dramatically. To address this overarching problem, a neural network-aided millimeter-wave beamforming algorithm is proposed in this paper. A new parameter, referred to as \u201cbeam adjustment interval\u201d, is proposed to evaluate the beamforming performance. It is defined as the maximum time duration in which the signal-to-interference-plus-noise ratio (SINR) of the user equipment can be maintained above the predefined threshold. Besides, a predictive method of beam adjustment to maximize the beam adjustment interval is developed, which considers the SINR not only at the current location but also future possible locations. Simulation results show that the proposed algorithm can significantly increase beam adjustment interval and reduce the total number of beam adjustments for the moving user equipment, thus reducing the system overhead 41.4% on average over 10 randomly generated test traces."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-6-1",
    "pageId": "page-biomedical-signal-6",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Multidimensional Hierarchical Interpolation Method on Sparse Grids for the Absorption Problem"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-6-2",
    "pageId": "page-biomedical-signal-6",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Xuesong Chen', 'Heng Mai', 'Lili Zhang'] | Year: 2019 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-6-3",
    "pageId": "page-biomedical-signal-6",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "The numerical integration of multidimensional functions using some variables of the sparse grid method for the absorption problem is presented in this paper. The multivariate quadrature expressions are constructed by combining tensor of suited one dimensional formula. We develop a multidimensional adaptive quadrature algorithm for the implementation of sparse grid based on a hierarchical basis. Furthermore, we obtain a new error bound at each sparse grid point. The numerical examples are shown to demonstrate the efficiency of our algorithm for the absorption problem and confirm the theoretical estimates."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-7-1",
    "pageId": "page-biomedical-signal-7",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "An Efficient and Secure Public Key Authenticated Encryption With Keyword Search in the Logarithmic Time"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-7-2",
    "pageId": "page-biomedical-signal-7",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Lidong Han', 'Junling Guo', 'Guang Yang', 'Qi Xie', 'Chengliang Tian'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-7-3",
    "pageId": "page-biomedical-signal-7",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Searchable encryption is an important cryptographic technique that achieves data security and keyword retrieval over encrypted data in cloud. In 2004, Boneh et.al proposed the first searchable encryption scheme based on asymmetric cryptography. Since then, many variants of public key searchable encryption schemes were proposed. However, most previous works are vulnerable to multi-ciphertext attack, and they cannot provide trapdoor indistinguishability. Another problem is how to improve the searching efficiency. To deal with two issues, we construct a fast and secure public key authenticated searchable encryption scheme with designed server. Our scheme can resist keyword guessing attacks, chosen multi-keyword attacks and multi-trapdoor attacks. The search function in our scheme achieves the logarithmic search time in number of keywords while most existing schemes required the linear time. By comparison with previous schemes in computational complexity, our scheme is very fast in keyword search."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-8-1",
    "pageId": "page-biomedical-signal-8",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Identifying Incorrect Patches in Program Repair Based on Meaning of Source Code"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-8-2",
    "pageId": "page-biomedical-signal-8",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Quang-Ngoc Phung', 'Misoo Kim', 'Eunseok Lee'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-8-3",
    "pageId": "page-biomedical-signal-8",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Automatic Program Repair (APR) techniques have shown the potential of reducing debugging costs while improving software quality by generating patches for fixing bugs automatically. However, they often generate many overfitting patches which pass only a specific test-suite but do not fix the bugs correctly. This paper proposes MIPI, a novel approach to reducing the number of overfitting patches generated in the APR. We leverage recent advances in deep learning to exploit the similarity between the patched method\u2019s name (which often encloses the developer\u2019s intention about the code) and the semantic meaning of the method\u2019s body (which represents the actual implemented behavior) for identifying and removing overfitting patches generated by APR tools. Experiments with a large dataset of patches for QuixBugs and Defects4J programs show the promise of our approach. Specifically, in a total of 1,191 patches generated by 23 existing APR tools, MIPI successfully filters out 254 (32%) of the total 797 overfitting patches with a precision of 90% while preserving 93% of the correct patches. MIPI is more precise and less damaging to the APR than existing heuristic patch assessment techniques, achieving a higher recall than automated testing-based techniques that do not have access to the test oracle. In addition, MIPI is highly complementary to existing automated patch assessment techniques."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-9-1",
    "pageId": "page-biomedical-signal-9",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "An LDPC Encoder Architecture With Up to 47.5 Gbps Throughput for DVB-S2/S2X Standards"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-9-2",
    "pageId": "page-biomedical-signal-9",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Decai Liu', 'Yanfei Luo', 'Yunfeng Li', 'Zhijie Wang', 'Zhengxuan Li', 'Qianwu Zhang', 'Junjie Zhang', 'Yingchun Li'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-9-3",
    "pageId": "page-biomedical-signal-9",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Low-Density Parity-Check (LDPC) code is a type of forward error-correction code with excellent performance, and has been widely used in many modern communication standards. The second-generation satellite broadcasting standard (DVB-S2) and its extension (DVB-S2X) adopt a special Irregular Repeated Accumulate (IRA) LDPC code as inner coding scheme. However, due to the large block size, most of the architectures proposed so far use Random Access Memory (RAM) to store and update the encoding results, and the delay caused by address-controlled read and write operations and barrel shift during computation inevitably limits the upper bound of encoder throughput. In this paper, by extracting the periodicity of the parity-check matrix, we introduce a fast encoding algorithm that can efficiently process the multiplication of the information sequence and a large-dimensional sparse matrix, and propose an encoder architecture with low encoding delay and high throughput. The proposed architecture has been implemented and tested on a Xilinx Kintex-7 FPGA, and the result show that the encoder architecture can achieve the highest throughput of 47.5 Gbps at a clock frequency of 280 MHz."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-10-1",
    "pageId": "page-biomedical-signal-10",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Magnetic Field and Temperature Dual-Parameter Sensor Based on Nonadiabatic Tapered Microfiber Cascaded With FBG"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-10-2",
    "pageId": "page-biomedical-signal-10",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Yuxiu Zhang', 'Shengli Pu', 'Yongxi Li', 'Zijian Hao', 'Dihui Li', 'Shaokang Yan', 'Min Yuan', 'Chencheng Zhang'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-10-3",
    "pageId": "page-biomedical-signal-10",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "A kind of dual-parameter sensor based on magnetic-fluid-coated nonadiabatic tapered microfiber (NTF) cascaded with fiber Bragg grating (FBG) is proposed and experimentally demonstrated. Simultaneous measurement of magnetic field and temperature is realized by monitoring the variation of NTF interference spectrum and FBG characteristic dip. In the magnetic field range of 0\u201318 mT, the highest magnetic field sensitivity can reach 1.159 nm/mT. The maximum temperature sensitivity is up to \u22121.737 nm/\u00b0C in the temperature range of 25-50 \u00b0C. The proposed magnetic-fluid-coated NTF interferometer cascaded with FBG will find extensive application prospect due to its high sensitivity, easy fabrication, compactness, strong robustness, and low cost."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-11-1",
    "pageId": "page-biomedical-signal-11",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Characterizing Scalar Metasurfaces Using Time-Domain Reflectometry"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-11-2",
    "pageId": "page-biomedical-signal-11",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Tom\u00e1\u0161 Dole\u017eal', 'Petr Kadlec', 'Martin \u0160tumpf'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-11-3",
    "pageId": "page-biomedical-signal-11",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Two efficient methodologies for the determination of electromagnetic (EM) constitutive properties of scalar metasurfaces are introduced and discussed. In contrast to the available methods, and in line with the recent increasing interest in time-domain (TD) analyses of metasurfaces, we show that the material parameters of a scalar metasurface can be readily achieved directly in the TD merely from the EM reflected pulse shape. The two methodologies are based on an analytical TD reflectometry (TDR) approach and a modern stochastic optimization technique. A number of illustrative numerical examples demonstrating the validity and properties of the proposed techniques are presented."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-12-1",
    "pageId": "page-biomedical-signal-12",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Blockchain-Enabled Integrated Market Platform for Contract Production"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-12-2",
    "pageId": "page-biomedical-signal-12",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Chia-Hung Liao', 'Hui-En Lin', 'Shyan-Ming Yuan'] | Year: 2020 | Citations: 4"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-12-3",
    "pageId": "page-biomedical-signal-12",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Abstract unavailable."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-13-1",
    "pageId": "page-biomedical-signal-13",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Exploiting Integrated Demand Response for Operating Reserve Provision Considering Rebound Effects"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-13-2",
    "pageId": "page-biomedical-signal-13",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Xiaoming Zhou', 'Maosheng Sang', 'Minglei Bao', 'Sheng Wang', 'Wenqi Cui', 'Chengjin Ye', 'Yi Ding'] | Year: 2022 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-13-3",
    "pageId": "page-biomedical-signal-13",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Electricity-driven thermostatically controlled loads (TCLs), e.g., air conditioners (ACs), have been widely utilized in demand response (DR) to provide operating reserve for power systems. However, the rebound effects may occur during the recovery process of DR, which can limit the operating reserve quality of ACs or even affect the reliable operation of power systems. With the community-level smart energy hubs (EH), the traditional electricity-driven TCLs can be expanded into multi-energy driven thermostatically controlled loads (MTCLs), e.g., household radiators. Under this circumstance, integrated demand response (IDR) can be exploited to coordinate the operation of MTCLs and provide more operating reserve resources while mitigating rebound effects. To this end, this paper proposes a two-stage IDR strategy to fully excavate the operating reserve provided by MTCLs. The first stage is to coordinate the energy consumption of ACs and household radiators to maximize the end-users\u2019 thermal comfort and mitigate the rebound effects. To quantify the end-users\u2019 thermal comfort, a modified predicted percentage of dissatisfied (PPD) index related to thermal environment parameters is introduced and simplified. Based on the energy consumption determined in the first stage, the energy conversion in EH is optimized in the second stage. Through the optimization in these two stages, a series of indices is established to evaluate the operating reserve in terms of aggregate capacity, duration, ramp rate, and smoothness. The case studies demonstrate that the proposed two-stage IDR strategy can provide high-aggregate-capacity and long-duration reserve resources in power systems while mitigating the rebound effects to maintain supply-demand balance and reliable operation of power systems. The analysis results of the test system show that the reserve capacity and duration obtained by the proposed model are 1.85 and 2.61 times those of the model without considering the multi-energy conve..."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-14-1",
    "pageId": "page-biomedical-signal-14",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Robust Multi-View Clustering With a Unified Weight Learning Paradigm"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-14-2",
    "pageId": "page-biomedical-signal-14",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Miaomiao Li', 'Zhenglai Li', 'Chang Tang', 'Xinwang Liu', 'Lulu Wang'] | Year: 2019 | Citations: 1"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-14-3",
    "pageId": "page-biomedical-signal-14",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Multi-view clustering, which exploits multi-view information to improve the clustering performance has attracted much attention in recent years. However, existing methods seldom consider the diverse quality of data points in different views, and assign each data point with the same importance for clustering. This way degrades the clustering performance due to the interference of low quality data points on the learned clustering indicators. In this paper, a novel robust multi-view clustering method with a unified weight learning paradigm is proposed to address this issue. The unified weight learning paradigm adaptively learns the quality of data points and the clustering capability of each view. Specifically, the reconstruction error of each data point in each view is treated as a factor to depict the quality of data point in this view. Afterwards, the clustering capability of each view is captured from the diverse quality of data points in each view. The clustering capability of each view in turn improves the learning process of data quality. An alternating iterative optimization algorithm with theoretical convergence guarantee and complexity analysis is designed to optimize the objective function. Experimental results on real-world benchmark datasets demonstrate the superiority of the proposed method."
    },
    "order": 3
  },
  {
    "id": "blk-page-biomedical-signal-15-1",
    "pageId": "page-biomedical-signal-15",
    "parentId": null,
    "type": "heading",
    "content": {
      "text": "Performance Analysis of Long Short-Term Memory-Based Markovian Spectrum Prediction"
    },
    "order": 1
  },
  {
    "id": "blk-page-biomedical-signal-15-2",
    "pageId": "page-biomedical-signal-15",
    "parentId": null,
    "type": "callout",
    "content": {
      "text": "Authors: ['Niranjana Radhakrishnan', 'Sithamparanathan Kandeepan', 'Xinghuo Yu', 'Gianmarco Baldini'] | Year: 2021 | Citations: 0"
    },
    "order": 2
  },
  {
    "id": "blk-page-biomedical-signal-15-3",
    "pageId": "page-biomedical-signal-15",
    "parentId": null,
    "type": "paragraph",
    "content": {
      "text": "Dynamic Spectrum Access (DSA) solutions equipped with spectrum prediction can enable proactive spectrum management and tackle the increasing demand for radio frequency (RF) bandwidth. Among various prediction techniques, Long Short-Term Memory (LSTM) is a deep learning model that has demonstrated high performance in forecasting spectrum characteristics. Although well-performing, the theoretical characterization of LSTM prediction performance has not been well developed in the literature. Therefore, in this article, we examine an LSTM based temporal spectrum prediction model and characterize its prediction performance through theoretical analysis. To this end, we analyze the LSTM prediction outputs over simulated Markov-model-based spectrum data and spectrum measurements data. Our results suggest that the predicted scores of the LSTM based system model can be described using mixtures of truncated Gaussian distributions. We also estimate the performance metrics using the mixture model and compare the results with the observed prediction performance over simulated and measured datasets."
    },
    "order": 3
  }
];

export const initialCourses: Course[] = [
  {
    "id": "course-ml-ai-101",
    "spaceId": "ml-ai",
    "title": "Deep Learning & Neural System Architecture",
    "description": "Comprehensive 10-level mastery of deep learning models, optimization, and real-world deployment.",
    "icon": "\ud83e\udde0",
    "accent": "#1b7a52",
    "status": "active",
    "learningGoal": "Complete all 10 levels of Deep Learning & Neural System Architecture.",
    "estimatedMinutes": 180,
    "readiness": 95,
    "progress": 30,
    "currentLessonId": "les-ml-ai-l4",
    "totalLessons": 10,
    "completedLessons": 3,
    "nextAction": "Continue Level 4",
    "updatedAt": "2026-09-08T14:00:00.000Z",
    "sourceIds": [
      "paper-ml-ai-1",
      "paper-ml-ai-2",
      "paper-ml-ai-3",
      "paper-ml-ai-4",
      "paper-ml-ai-5"
    ],
    "modules": [
      {
        "id": "mod-ml-ai-l1",
        "title": "Level 1: Neural Networks",
        "description": "Mastering Neural Networks concepts, analysis, and research findings.",
        "lessonIds": [
          "les-ml-ai-l1"
        ]
      },
      {
        "id": "mod-ml-ai-l2",
        "title": "Level 2: Deep Learning",
        "description": "Mastering Deep Learning concepts, analysis, and research findings.",
        "lessonIds": [
          "les-ml-ai-l2"
        ]
      },
      {
        "id": "mod-ml-ai-l3",
        "title": "Level 3: Convolutional Networks",
        "description": "Mastering Convolutional Networks concepts, analysis, and research findings.",
        "lessonIds": [
          "les-ml-ai-l3"
        ]
      },
      {
        "id": "mod-ml-ai-l4",
        "title": "Level 4: Transformers",
        "description": "Mastering Transformers concepts, analysis, and research findings.",
        "lessonIds": [
          "les-ml-ai-l4"
        ]
      },
      {
        "id": "mod-ml-ai-l5",
        "title": "Level 5: Reinforcement Learning",
        "description": "Mastering Reinforcement Learning concepts, analysis, and research findings.",
        "lessonIds": [
          "les-ml-ai-l5"
        ]
      },
      {
        "id": "mod-ml-ai-l6",
        "title": "Level 6: Model Optimization",
        "description": "Mastering Model Optimization concepts, analysis, and research findings.",
        "lessonIds": [
          "les-ml-ai-l6"
        ]
      },
      {
        "id": "mod-ml-ai-l7",
        "title": "Level 7: Computer Vision",
        "description": "Mastering Computer Vision concepts, analysis, and research findings.",
        "lessonIds": [
          "les-ml-ai-l7"
        ]
      },
      {
        "id": "mod-ml-ai-l8",
        "title": "Level 8: Natural Language Processing",
        "description": "Mastering Natural Language Processing concepts, analysis, and research findings.",
        "lessonIds": [
          "les-ml-ai-l8"
        ]
      },
      {
        "id": "mod-ml-ai-l9",
        "title": "Level 9: Generative AI",
        "description": "Mastering Generative AI concepts, analysis, and research findings.",
        "lessonIds": [
          "les-ml-ai-l9"
        ]
      },
      {
        "id": "mod-ml-ai-l10",
        "title": "Level 10: Edge Deployment",
        "description": "Mastering Edge Deployment concepts, analysis, and research findings.",
        "lessonIds": [
          "les-ml-ai-l10"
        ]
      }
    ],
    "lessons": [
      {
        "id": "les-ml-ai-l1",
        "title": "Level 1 - Neural Networks",
        "objective": "Master key principles, flashcard active recall, and MCQs for Neural Networks.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-ml-ai-2"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-ml-ai-l1-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 1 - Neural Networks",
            "content": "### Level 1: Neural Networks\n\n**Theoretical Foundation & Research Insight:**\n\nBackscatter communications have been acknowledged as an essential key technology in the Internet of Things (IoT) applications. Considering the fact that it needs the coordination from network agents, cooperative bargaining theory is an effective method to strike an appropriate system performance. In this paper, we investigate time scheduling algorithms for a backscatter-aided radio-frequency (RF) powered cognitive radio (CR) network, where multiple secondary transmitters can switch among the backscatter, the energy harvest, and active data transmission modes. Our objective is to maximize the RF-CR system performance while exploring the mutual benefits to leverage a reciprocal consensus between different control issues. According to the ideas of two different bargaining solutions - \nmodified Nash bargaining solution\n and \nequitable Nash bargaining solution\n, we design a new dual bargaining game model to effectively share the limited time resources. The main novelty of our proposed approach is its adaptability, flexibility and responsiveness to current RF-CR system conditions. At last, numerical simulations are carried out to evaluate the performance of the proposed scheme, and we demonstrate the benefits of our dual bargaining game approach.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Sungwook Kim']** (2021) demonstrates that systematically modeling parameters in Neural Networks minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-ml-ai-l1-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 1 (Neural Networks)?",
            "back": "Neural Networks integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-ml-ai-l1-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Neural Networks?",
            "back": "['Sungwook Kim'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-ml-ai-l1-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Neural Networks?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Neural Networks, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-ml-ai-l1-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 1 (Neural Networks)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-ml-ai-l2",
        "title": "Level 2 - Deep Learning",
        "objective": "Master key principles, flashcard active recall, and MCQs for Deep Learning.",
        "estimatedMinutes": 14,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-ml-ai-3"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-ml-ai-l2-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 2 - Deep Learning",
            "content": "### Level 2: Deep Learning\n\n**Theoretical Foundation & Research Insight:**\n\nTangible User Interfaces have enriched and expanded the user experience when interacting with computers and smart devices. The monopoly of graphical user interfaces has been broken thanks to the emergence of new complementary technologies that allow for new ways of interacting with computer systems, such as tangible interaction, among others. Due to the scope and number of research articles addressing the Tangible User Interface that have been published, it can now be considered an interaction mechanism that is relatively mature and integrated within society. However, while the application of tangible interfaces in different areas is described as a success, there are only a limited number of research articles about their impact on education and learning systems. As a result, it is difficult to show the actual impact of Tangible User Interface technology in K12 education settings. This study tries to fill this gap by performing a systematic mapping study that shows the current state of research on the impact of this technology in these settings, analyzing the findings and identifying the main advances and limitations of this novel technology.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Jos\u00e9 A. Gallud', 'Ricardo Tesoriero', 'Maria D. Lozano', 'Victor M. R. Penichet', 'Habib M. Fardoun']** (2022) demonstrates that systematically modeling parameters in Deep Learning minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-ml-ai-l2-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 2 (Deep Learning)?",
            "back": "Deep Learning integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-ml-ai-l2-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Deep Learning?",
            "back": "['Jos\u00e9 A. Gallud', 'Ricardo Tesoriero', 'Maria D. Lozano', 'Victor M. R. Penichet', 'Habib M. Fardoun'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-ml-ai-l2-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Deep Learning?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Deep Learning, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-ml-ai-l2-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 2 (Deep Learning)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-ml-ai-l3",
        "title": "Level 3 - Convolutional Networks",
        "objective": "Master key principles, flashcard active recall, and MCQs for Convolutional Networks.",
        "estimatedMinutes": 16,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-ml-ai-4"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-ml-ai-l3-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 3 - Convolutional Networks",
            "content": "### Level 3: Convolutional Networks\n\n**Theoretical Foundation & Research Insight:**\n\nThe insulator in direct current gas-insulated transmission lines (DC-GIL) would suffer discharge risk due to surface charge accumulation under thermal-electric coupled fields. In this paper, the transient surface charge accumulation characteristics of a basin-type DC-GIL insulator is investigated via finite element method based on a three-dimension horizontally installed GIL model. The stationary temperature distribution of the model is obtained and then applied to the transient simulation of charge. Weak form partial differential equation is employed to deal with the ion transportation equation. Equations and parameters in the simulation are optimized to reduce the computing memory and time. Results indicate that the charge accumulation is accelerated due to the promotion of conduction through the insulator under thermal gradient. Higher charge density is obtained under thermal gradient. And the surface charge density of the convex surface is higher due to the promoted conduction. The highest field strength increases and the corresponding location moves along the convex surface during the transient process. This could attribute to the influence of transient charge behavior under thermal gradient on the electric field distribution. This study indicates that the thermal gradient and transient charge accumulation should be considered when dealing with the insulation characteristics of DC-GIL with insulators.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Xiaolong Li', 'Songling Han', 'Mingde Wan', 'Wen Wang', 'Zhenxin Geng', 'Xin Lin']** (2022) demonstrates that systematically modeling parameters in Convolutional Networks minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-ml-ai-l3-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 3 (Convolutional Networks)?",
            "back": "Convolutional Networks integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-ml-ai-l3-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Convolutional Networks?",
            "back": "['Xiaolong Li', 'Songling Han', 'Mingde Wan', 'Wen Wang', 'Zhenxin Geng', 'Xin Lin'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-ml-ai-l3-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Convolutional Networks?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Convolutional Networks, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-ml-ai-l3-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 3 (Convolutional Networks)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-ml-ai-l4",
        "title": "Level 4 - Transformers",
        "objective": "Master key principles, flashcard active recall, and MCQs for Transformers.",
        "estimatedMinutes": 18,
        "difficulty": "intermediate",
        "status": "ready",
        "sourceIds": [
          "paper-ml-ai-5"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-ml-ai-l4-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 4 - Transformers",
            "content": "### Level 4: Transformers\n\n**Theoretical Foundation & Research Insight:**\n\nElectromagnetic vibration is an important excitation source for squirrel-cage induction motors. However, the electromagnetic vibration under various loadings has not been sufficiently analyzed. It is proposed in this paper that the electromagnetic vibration of motors under different loads can be obtained by analyzing the amplitude of the electromagnetic force wave. The Maxwell tensor method is employed to derive the spatial and temporal distributions of the radial force. This paper also calculates the radial force using the finite element method and decodes the calculated results using two dimensional fast Fourier transform (2D-FFT) to determine the amplitude of the electromagnetic force at the spatial order under different loads. In addition, through the modal analysis of the stator core, it can be concluded that in the case of nonresonance, the vibration response increases when the electromagnetic force of the first-order and second-order rotor slot harmonic increases. Finally, the conclusion is verified by separating the electromagnetic vibration of the motor using a vibration test rig.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Defeng Kong', 'Zhijun Shuai', 'Wanyou Li', 'Donghua Wang']** (2019) demonstrates that systematically modeling parameters in Transformers minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-ml-ai-l4-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 4 (Transformers)?",
            "back": "Transformers integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-ml-ai-l4-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Transformers?",
            "back": "['Defeng Kong', 'Zhijun Shuai', 'Wanyou Li', 'Donghua Wang'] (2019) with 3 citations."
          },
          {
            "id": "blk-les-ml-ai-l4-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Transformers?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Transformers, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-ml-ai-l4-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 4 (Transformers)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-ml-ai-l5",
        "title": "Level 5 - Reinforcement Learning",
        "objective": "Master key principles, flashcard active recall, and MCQs for Reinforcement Learning.",
        "estimatedMinutes": 20,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-ml-ai-6"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-ml-ai-l5-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 5 - Reinforcement Learning",
            "content": "### Level 5: Reinforcement Learning\n\n**Theoretical Foundation & Research Insight:**\n\nThis paper presents kNN STreaming Unit For Fpgas (kNN-STUFF), a modular, scalable and efficient Hardware/Software implementation of k-Nearest Neighbors (kNN) classifier targeting System on Chip (SoC) devices. It takes advantage of custom accelerators, implemented on the reconfigurable fabric of the SoC device, to perform most of the classifier\u2019s workload, whereas the processor coordinates the accelerators and runs the remaining workload of the kNN algorithm. kNN-STUFF offers a highly flexible framework, where the designer has the possibility to define the number of parallel instances of the classifier and the parallelism within each instance. This capability allows creating the most suitable implementation for a target device of any size. Results show that kNN-STUFF, with 24 accelerators, attains performance improvements up to \n 67.4\\times 67.4\u00d767.4\\times  \n, when compared to an optimized (\u2212O3) software-only implementation of the kNN running on a single core of the ARM Cortex-A9 CPU. Furthermore, its energy efficiency improvements are as high as \n 50.6\\times 50.6\u00d750.6\\times  \n.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Jo\u00e3o Vieira', 'Rui P. Duarte', 'Hor\u00e1cio C. Neto']** (2019) demonstrates that systematically modeling parameters in Reinforcement Learning minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-ml-ai-l5-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 5 (Reinforcement Learning)?",
            "back": "Reinforcement Learning integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-ml-ai-l5-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Reinforcement Learning?",
            "back": "['Jo\u00e3o Vieira', 'Rui P. Duarte', 'Hor\u00e1cio C. Neto'] (2019) with 11 citations."
          },
          {
            "id": "blk-les-ml-ai-l5-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Reinforcement Learning?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Reinforcement Learning, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-ml-ai-l5-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 5 (Reinforcement Learning)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-ml-ai-l6",
        "title": "Level 6 - Model Optimization",
        "objective": "Master key principles, flashcard active recall, and MCQs for Model Optimization.",
        "estimatedMinutes": 22,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-ml-ai-7"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-ml-ai-l6-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 6 - Model Optimization",
            "content": "### Level 6: Model Optimization\n\n**Theoretical Foundation & Research Insight:**\n\nIn typical e-commerce warehouse operations, upon receiving the orders from customers, the purchased items need to be retrieved from shelves and then packaged accordingly for delivery. To automate and speed up the item retrieval process, a Smart Warehouse usually employs a management system, called the Automated Retrieval System (ARS), to control and schedule the retrieval jobs. The working principle of ARS is crucial to the Smart Warehouse because it will have a great impact on the subsequent downstream processes. In short, all the items in a particular order should be considered as an integral part; if one of these items encounters a much larger retrieval delay than others do, then the entire order may experience an unnecessary latency. In the past, the integrality of order has not received much attention for the parallel retrieval process of multiple stackers. To take this into account, this paper proposes using an Order Tag to label all the items that belong to the same order for retrieval job scheduling. The way of calculating the Order Tags will then determine the scheduling discipline of the ARS. With the objectives of minimizing the average delay and ensuring the fairness, two algorithms are proposed. They are named as Dynamic Order-Based (DOB) and Dynamic Order-Based with Threshold (DOBT) Scheduling Algorithms, respectively. Compared with the First-Come-First-Serve and other approaches, the simulation results show that DOB and DOBT are able to reduce the average order retrieval delay by at least 30%, and generate less backlog pressure to the downstream operations.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Jialei Liu', 'Soung-Yue Liew', 'Boon Yaik Ooi', 'Donghong Qin']** (2021) demonstrates that systematically modeling parameters in Model Optimization minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-ml-ai-l6-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 6 (Model Optimization)?",
            "back": "Model Optimization integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-ml-ai-l6-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Model Optimization?",
            "back": "['Jialei Liu', 'Soung-Yue Liew', 'Boon Yaik Ooi', 'Donghong Qin'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-ml-ai-l6-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Model Optimization?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Model Optimization, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-ml-ai-l6-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 6 (Model Optimization)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-ml-ai-l7",
        "title": "Level 7 - Computer Vision",
        "objective": "Master key principles, flashcard active recall, and MCQs for Computer Vision.",
        "estimatedMinutes": 24,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-ml-ai-8"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-ml-ai-l7-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 7 - Computer Vision",
            "content": "### Level 7: Computer Vision\n\n**Theoretical Foundation & Research Insight:**\n\nThis work addresses the multiple-depot vehicle and crew scheduling problem (MDVCSP). In MDVCSP, we deal with two NP-hard problems in an integrated way: the multiple-depot vehicle scheduling problem (MDVSP) and the crew scheduling problem (CSP). For solving the MDVCSP, we define the vehicles\u2019 operational routine and the workdays of the crews of a public bus transport system with multiple depots. Given the difficulty of solving real-world instances of the MDVCSP using exact mathematical methods, we propose a matheuristic algorithm for solving it. This matheuristic algorithm combines two strategies into an iterated local search (ILS) based framework: a branch-and-bound algorithm for solving the MDVSP and a variable neighborhood descent (VND) based algorithm for treating the associated CSPs. We compared the proposed ILS-MDVCSP with five approaches in the literature that use the same benchmark test instances. We also solved a real-world problem of one of Brazil\u2019s largest cities. For this problem, we proposed a formulation based on a time-space network to address the MDVSP subproblem. The results obtained showed the effectiveness of ILS-MDVCSP, mainly to deal with real-world and large-scale problems. The algorithm was able to solve the largest instances from the literature, for which there was no reported solution. Regarding the run time, as the instances\u2019 size increases, our approach becomes substantially less costly than the others from the literature. For the Brazilian instances, the ILS-MDVCSP saved, on average, the use of 12 vehicles per day and reduced by up to 15% the daily operational time of the vehicles.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Emiliana Mara Lopes Sim\u00f5es', 'Lucas De Souza Batista', 'Marcone Jamilson Freitas Souza']** (2021) demonstrates that systematically modeling parameters in Computer Vision minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-ml-ai-l7-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 7 (Computer Vision)?",
            "back": "Computer Vision integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-ml-ai-l7-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Computer Vision?",
            "back": "['Emiliana Mara Lopes Sim\u00f5es', 'Lucas De Souza Batista', 'Marcone Jamilson Freitas Souza'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-ml-ai-l7-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Computer Vision?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Computer Vision, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-ml-ai-l7-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 7 (Computer Vision)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-ml-ai-l8",
        "title": "Level 8 - Natural Language Processing",
        "objective": "Master key principles, flashcard active recall, and MCQs for Natural Language Processing.",
        "estimatedMinutes": 26,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-ml-ai-9"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-ml-ai-l8-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 8 - Natural Language Processing",
            "content": "### Level 8: Natural Language Processing\n\n**Theoretical Foundation & Research Insight:**\n\nNowadays, the Internet of Things (IoT) has an astonishingly societal impact in which healthcare services stand out. Amplified by the COVID-19 pandemic scenario, challenges include the development of authenticatable smart IoT devices with the ability to simultaneously track people and sense in real-time human body temperature aiming to infer a health condition in a contactless and remote way through user-friendly equipment such as a smartphone. Univocal smart labels based on quick response (QR) codes were designed and printed on medical substrates (protective masks and adhesive) using flexible organic-inorganic luminescent inks. Luminescence thermometry and physical unclonable functions (PUFs) are simultaneously combined allowing non-contact temperature detection, identification, and connection with the IoT environment through a smartphone. This is an intriguing example where luminescent inks based on organic-inorganic hybrids modified by lanthanide ions are used to fabricate a smart label that can sense temperature with remarkable figures of merit, including maximum thermal sensitivity of \n Sr=1.46S_{\\mathrm {r}}=1.46 \n %K\n\u22121\n and temperature uncertainty of \n \u03b4T=0.2\\delta T=0.2 \n K, and an authentication methodology accuracy, precision, and recall of 96.2%, 98.9%, and 85.7%, respectively. The methodology proposed is feasibly applied for the univocal identification and mobile optical temperature monitoring of individuals, allowing the control of the access to restricted areas and the information transfer to medical entities for post medical evaluation towards a new generation of mobile-assisted \neHealth\n (\nmHealth\n).\n\n**Key Takeaways from IEEE Research:**\nAuthor **['L\u00edlia M. S. Dias', 'Jo\u00e3o F. C. B. Ramalho', 'Tiago Silv\u00e9rio', 'Lianshe Fu', 'Rute A. S. Ferreira', 'Paulo S. Andr\u00e9']** (2022) demonstrates that systematically modeling parameters in Natural Language Processing minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-ml-ai-l8-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 8 (Natural Language Processing)?",
            "back": "Natural Language Processing integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-ml-ai-l8-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Natural Language Processing?",
            "back": "['L\u00edlia M. S. Dias', 'Jo\u00e3o F. C. B. Ramalho', 'Tiago Silv\u00e9rio', 'Lianshe Fu', 'Rute A. S. Ferreira', 'Paulo S. Andr\u00e9'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-ml-ai-l8-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Natural Language Processing?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Natural Language Processing, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-ml-ai-l8-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 8 (Natural Language Processing)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-ml-ai-l9",
        "title": "Level 9 - Generative AI",
        "objective": "Master key principles, flashcard active recall, and MCQs for Generative AI.",
        "estimatedMinutes": 28,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-ml-ai-10"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-ml-ai-l9-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 9 - Generative AI",
            "content": "### Level 9: Generative AI\n\n**Theoretical Foundation & Research Insight:**\n\nThis study proposes a compact four-port multiple-input multiple-output (MIMO) antenna system to operate within a frequency range of 3.2\u20135.75 GHz to serve in 5G new radio (NR) sub-6 GHz n77/n78/n79 and 5 GHz WLAN with good impedance matching. To increase the isolation between the MIMO antenna elements with low complexity and cost, the antenna elements are orthogonally oriented to each other with distance spacing of \n 0.3\\lambda _{\\text {o}}0.3\u03bbo0.3\\lambda _{\\text {o}} \n between elements, including electromagnetic bandgap (EBG) structure, defected ground structure (DGS), capacitive elements (CE), and neutralization line (NL). The simulation results show that the measured mutual coupling between the array elements is improved from \u221220 to \u221245 dB. The envelope correlation coefficient is enhanced. In addition, the diversity gain, mean effective gain, and total active reflection coefficient are improved simultaneously. The suggested structure has been designed on CST Microwave Studio 2019. The antennas\u2019 overall dimensions for all methods are the same as they approach 46 mm \n \\times46\u00d746\\times46 \n mm \n \\times1.6\u00d71.6\\times1.6 \n mm. The measured gain of the proposed designs ranges from 6 to 9 dBi, and the radiation efficiency approaches 90%. The antennas are fabricated and tested, where better experimental results are noticed compared to the simulation results. Our antennas are designed over FR-4 substrate with a noticeable cost reduction. Each antenna element has a dimension of 15 mm \n \\times23\u00d723\\times23 \n mm \n \\times1.6\u00d71.6\\times1.6 \n mm. An \u201cEL\u201d slot into the radiating element and two identical stubs coupled to the partial ground are used to improve the impedance matching and radiation characteristics across the bands of interest. The isolation decreases by 22 dB using the EBG method, reaching the value of \u221265 dB. Meanwhile, the isolation decreases by 19 dB using the DGS method, reaching \u221260 dB. Due to gaps between adjacent unit cells and the capacitance generated from the dielectric gap between the top metallic patch and ground plane, ...\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Amany A. Megahed', 'Mohamed Abdelazim', 'Ehab H. Abdelhay', 'Heba Y. M. Soliman']** (2022) demonstrates that systematically modeling parameters in Generative AI minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-ml-ai-l9-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 9 (Generative AI)?",
            "back": "Generative AI integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-ml-ai-l9-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Generative AI?",
            "back": "['Amany A. Megahed', 'Mohamed Abdelazim', 'Ehab H. Abdelhay', 'Heba Y. M. Soliman'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-ml-ai-l9-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Generative AI?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Generative AI, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-ml-ai-l9-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 9 (Generative AI)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-ml-ai-l10",
        "title": "Level 10 - Edge Deployment",
        "objective": "Master key principles, flashcard active recall, and MCQs for Edge Deployment.",
        "estimatedMinutes": 30,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-ml-ai-11"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-ml-ai-l10-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 10 - Edge Deployment",
            "content": "### Level 10: Edge Deployment\n\n**Theoretical Foundation & Research Insight:**\n\nAutonomous electric vehicles (AEVs) will become an inevitable trend in the future transportation network and have an important impact on the power grid. It is difficult to find the optimal distributed charging solution for AEVs to minimize the system cost with some uncertainties. In this paper, we investigate an AEVs charging and discharging problem with vehicle-to-grid (V2G) services. We aim to minimize the total electricity cost and battery degradation cost of AEVs and charging station batteries with V2G services, which takes the random arrival and departure of AEVs into account. We first propose a distributed charging framework of AEVs and charging stations by clustering method with the constraint of limited AEVs for each charging station in a region and formulate a distributed offline optimization problem. Then we formulate a distributed online charging optimization problem and propose a distributed online AEV charging scheduling (DOAS) algorithm to get an optimal charging solution. To study a more practical case, we reformulate the distributed online optimization problem with the uncertainties from base loads, renewable energy and charging demands. Furthermore, to improve the time efficiency of DOAS algorithm, we reduce the dimension of the distributed problem and design a dimension-reduction DOAS (DDOAS) algorithm. To seek a robust solution with some uncertainties, we propose a DDOAS algorithm with DRO based on Wasserstein distance (DDODW). Simulation results show that DOAS and DDOAS algorithms can have a close-to-optimal charging cost and a significantly less battery degradation cost of charging stations, compared with centralized online charging scheduling algorithm and DDOAS algorithm is more time-efficient than DOAS algorithm. The proposed DDODW algorithm can provide a robust solution for the energy schedule\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Yongsheng Cao', 'Yongquan Wang']** (2021) demonstrates that systematically modeling parameters in Edge Deployment minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-ml-ai-l10-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 10 (Edge Deployment)?",
            "back": "Edge Deployment integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-ml-ai-l10-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Edge Deployment?",
            "back": "['Yongsheng Cao', 'Yongquan Wang'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-ml-ai-l10-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Edge Deployment?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Edge Deployment, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-ml-ai-l10-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 10 (Edge Deployment)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      }
    ]
  },
  {
    "id": "course-wireless-101",
    "spaceId": "wireless-iot",
    "title": "Next-Gen Wireless Communications & 6G IoT",
    "description": "Master radio frequency engineering, backscatter communications, and massive IoT scaling across 10 progressive levels.",
    "icon": "\ud83d\udcf6",
    "accent": "#2563eb",
    "status": "active",
    "learningGoal": "Complete all 10 levels of Next-Gen Wireless Communications & 6G IoT.",
    "estimatedMinutes": 180,
    "readiness": 95,
    "progress": 30,
    "currentLessonId": "les-wireless-iot-l4",
    "totalLessons": 10,
    "completedLessons": 3,
    "nextAction": "Continue Level 4",
    "updatedAt": "2026-09-08T14:00:00.000Z",
    "sourceIds": [
      "paper-wireless-iot-1",
      "paper-wireless-iot-2",
      "paper-wireless-iot-3",
      "paper-wireless-iot-4",
      "paper-wireless-iot-5"
    ],
    "modules": [
      {
        "id": "mod-wireless-iot-l1",
        "title": "Level 1: RF Fundamentals",
        "description": "Mastering RF Fundamentals concepts, analysis, and research findings.",
        "lessonIds": [
          "les-wireless-iot-l1"
        ]
      },
      {
        "id": "mod-wireless-iot-l2",
        "title": "Level 2: Backscatter Communication",
        "description": "Mastering Backscatter Communication concepts, analysis, and research findings.",
        "lessonIds": [
          "les-wireless-iot-l2"
        ]
      },
      {
        "id": "mod-wireless-iot-l3",
        "title": "Level 3: Channel Estimation",
        "description": "Mastering Channel Estimation concepts, analysis, and research findings.",
        "lessonIds": [
          "les-wireless-iot-l3"
        ]
      },
      {
        "id": "mod-wireless-iot-l4",
        "title": "Level 4: MIMO Systems",
        "description": "Mastering MIMO Systems concepts, analysis, and research findings.",
        "lessonIds": [
          "les-wireless-iot-l4"
        ]
      },
      {
        "id": "mod-wireless-iot-l5",
        "title": "Level 5: 5G/6G Architectures",
        "description": "Mastering 5G/6G Architectures concepts, analysis, and research findings.",
        "lessonIds": [
          "les-wireless-iot-l5"
        ]
      },
      {
        "id": "mod-wireless-iot-l6",
        "title": "Level 6: IoT Protocols",
        "description": "Mastering IoT Protocols concepts, analysis, and research findings.",
        "lessonIds": [
          "les-wireless-iot-l6"
        ]
      },
      {
        "id": "mod-wireless-iot-l7",
        "title": "Level 7: Energy Harvesting",
        "description": "Mastering Energy Harvesting concepts, analysis, and research findings.",
        "lessonIds": [
          "les-wireless-iot-l7"
        ]
      },
      {
        "id": "mod-wireless-iot-l8",
        "title": "Level 8: Signal Modulation",
        "description": "Mastering Signal Modulation concepts, analysis, and research findings.",
        "lessonIds": [
          "les-wireless-iot-l8"
        ]
      },
      {
        "id": "mod-wireless-iot-l9",
        "title": "Level 9: Wireless Security",
        "description": "Mastering Wireless Security concepts, analysis, and research findings.",
        "lessonIds": [
          "les-wireless-iot-l9"
        ]
      },
      {
        "id": "mod-wireless-iot-l10",
        "title": "Level 10: Satellite Networks",
        "description": "Mastering Satellite Networks concepts, analysis, and research findings.",
        "lessonIds": [
          "les-wireless-iot-l10"
        ]
      }
    ],
    "lessons": [
      {
        "id": "les-wireless-iot-l1",
        "title": "Level 1 - RF Fundamentals",
        "objective": "Master key principles, flashcard active recall, and MCQs for RF Fundamentals.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-wireless-iot-2"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-wireless-iot-l1-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 1 - RF Fundamentals",
            "content": "### Level 1: RF Fundamentals\n\n**Theoretical Foundation & Research Insight:**\n\nFor applications with high torque demand, gearboxes are commonly used to convert torque and speed in order to receive higher specific values for torque and power. This causes additional losses, cost, inaccuracies, effort, and noise. Eliminating the need of a mechanical gear and the associated disadvantages, Transverse Flux Machines with their high torque density are a very promising alternative. Despite a high torque density and a high efficiency, these types of machines are not commonly used. Due to the complex structure, challenges with mechanical design, and modeling of the machine behavior arise. Additionally, there are high requirements for the inverter due to the low power factor. This paper provides an overview of the state of the art including the potentials and advantages but also the problems and hindrances of these types of machines. Relating to linear and rotary machines from research and industry, the machine is introduced with its history, application and classification. Further, the general technical aspects, the influence of materials for flux guidance, the methods of modeling, methods for a minimization of torque ripples, as well as methods for power factor improvement are presented.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Benedikt Kaiser', 'Nejila Parspour']** (2022) demonstrates that systematically modeling parameters in RF Fundamentals minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-wireless-iot-l1-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 1 (RF Fundamentals)?",
            "back": "RF Fundamentals integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-wireless-iot-l1-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on RF Fundamentals?",
            "back": "['Benedikt Kaiser', 'Nejila Parspour'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-wireless-iot-l1-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for RF Fundamentals?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In RF Fundamentals, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-wireless-iot-l1-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 1 (RF Fundamentals)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-wireless-iot-l2",
        "title": "Level 2 - Backscatter Communication",
        "objective": "Master key principles, flashcard active recall, and MCQs for Backscatter Communication.",
        "estimatedMinutes": 14,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-wireless-iot-3"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-wireless-iot-l2-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 2 - Backscatter Communication",
            "content": "### Level 2: Backscatter Communication\n\n**Theoretical Foundation & Research Insight:**\n\nThis paper proposes a new network model for the building evacuation problem considering congestion levels and provides a mixed integer linear programming (MILP) model and an efficient heuristic algorithm solving the problem. Constructing an optimization model with several congestion levels, we introduce a new network called the multi-class time-expanded (MCTE) network having several exclusive arcs connecting the same tail and head nodes. The MCTE networks make both the MILP model and the heuristic algorithm reflect a realistic situation in congested networks. Considering MCTE networks makes the problem difficult to solve, which motivates us to develop an efficient heuristic algorithm. We test our heuristic algorithm using several real-world networks such as a multiplex cinema, a subway station, and a large-size complex shopping mall in addition to an artificial network for clear comparison between the proposed algorithm and the MILP approaches. The results indicate that the proposed algorithm runs fast and produces a near-optimal solution compared with those from MILP models with a commercial solver.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Chang Hyup Oh', 'Min Hee Kim', 'Byung-In Kim', 'Young Myoung Ko']** (2019) demonstrates that systematically modeling parameters in Backscatter Communication minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-wireless-iot-l2-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 2 (Backscatter Communication)?",
            "back": "Backscatter Communication integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-wireless-iot-l2-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Backscatter Communication?",
            "back": "['Chang Hyup Oh', 'Min Hee Kim', 'Byung-In Kim', 'Young Myoung Ko'] (2019) with 2 citations."
          },
          {
            "id": "blk-les-wireless-iot-l2-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Backscatter Communication?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Backscatter Communication, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-wireless-iot-l2-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 2 (Backscatter Communication)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-wireless-iot-l3",
        "title": "Level 3 - Channel Estimation",
        "objective": "Master key principles, flashcard active recall, and MCQs for Channel Estimation.",
        "estimatedMinutes": 16,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-wireless-iot-4"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-wireless-iot-l3-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 3 - Channel Estimation",
            "content": "### Level 3: Channel Estimation\n\n**Theoretical Foundation & Research Insight:**\n\nRapid advances in high-throughput sequencing technology have led to the generation of a large number of multi-omics biological datasets. Integrating data from different omics provides an unprecedented opportunity to gain insight into disease mechanisms from different perspectives. However, integrative analysis and predictive modeling from multi-omics data are facing three major challenges: i) heavy noises; ii) the high dimensions compared to the small samples; iii) data heterogeneity. Current multi-omics data integration approaches have some limitations and are susceptible to heavy noise. In this paper, we present MSPL, a robust supervised multi-omics data integration method that simultaneously identifies significant multi-omics signatures during the integration process and predicts the cancer subtypes. The proposed method not only inherits the generalization performance of self-paced learning but also leverages the properties of multi-omics data containing correlated information to interactively recommend high-confidence samples for model training. We demonstrate the capabilities of MSPL using simulated data and five multi-omics biological datasets, integrating up three omics to identify potential biological signatures, and evaluating the performance compared to state-of-the-art methods in binary and multi-class classification problems. Our proposed model makes multi-omics data integration more systematic and expands its range of applications.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Zi-Yi Yang', 'Liang-Yong Xia', 'Hui Zhang', 'Yong Liang']** (2019) demonstrates that systematically modeling parameters in Channel Estimation minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-wireless-iot-l3-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 3 (Channel Estimation)?",
            "back": "Channel Estimation integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-wireless-iot-l3-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Channel Estimation?",
            "back": "['Zi-Yi Yang', 'Liang-Yong Xia', 'Hui Zhang', 'Yong Liang'] (2019) with 0 citations."
          },
          {
            "id": "blk-les-wireless-iot-l3-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Channel Estimation?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Channel Estimation, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-wireless-iot-l3-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 3 (Channel Estimation)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-wireless-iot-l4",
        "title": "Level 4 - MIMO Systems",
        "objective": "Master key principles, flashcard active recall, and MCQs for MIMO Systems.",
        "estimatedMinutes": 18,
        "difficulty": "intermediate",
        "status": "ready",
        "sourceIds": [
          "paper-wireless-iot-5"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-wireless-iot-l4-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 4 - MIMO Systems",
            "content": "### Level 4: MIMO Systems\n\n**Theoretical Foundation & Research Insight:**\n\nThis paper proposes a method for determining the optimal sites and sizes of multi-type distributed generations (DG) and capacitors for minimizing reactive power losses (RPL) in distribution systems. The proposed method is developed based on generic closed-form analytical expressions for calculating optimal sizes of DG units and capacitors at their candidate sites. The reduction in RPL with DG and capacitors is evaluated using another analytical expression that relates power injections of DG and capacitors with RPL. An optimal power flow algorithm (OPF) is incorporated in the proposed method to consider the constraints of the distribution systems, DG, and capacitors. Various types of DG are considered, and their optimal power factors can be accurately computed while optimizing the sizes of capacitors in a simultaneous manner to reduce RPL. The 69-bus distribution system is used to test the proposed method. An exact search method is employed to verify the accuracy of the proposed method. The effectiveness of the proposed method is demonstrated for solving the optimal allocation problem with different combinations of multi-type DG units and capacitors.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Karar Mahmoud', 'Matti Lehtonen']** (2019) demonstrates that systematically modeling parameters in MIMO Systems minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-wireless-iot-l4-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 4 (MIMO Systems)?",
            "back": "MIMO Systems integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-wireless-iot-l4-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on MIMO Systems?",
            "back": "['Karar Mahmoud', 'Matti Lehtonen'] (2019) with 19 citations."
          },
          {
            "id": "blk-les-wireless-iot-l4-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for MIMO Systems?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In MIMO Systems, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-wireless-iot-l4-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 4 (MIMO Systems)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-wireless-iot-l5",
        "title": "Level 5 - 5G/6G Architectures",
        "objective": "Master key principles, flashcard active recall, and MCQs for 5G/6G Architectures.",
        "estimatedMinutes": 20,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-wireless-iot-6"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-wireless-iot-l5-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 5 - 5G/6G Architectures",
            "content": "### Level 5: 5G/6G Architectures\n\n**Theoretical Foundation & Research Insight:**\n\nIn today's society, the number of people rearing pets has increased and their awareness of the need to protect pets' health has increased. Pet posture behaviour analysis and prediction are providing assistance in the medical treatment of pets. Hence, the demand for pet skeleton drawing applications has risen dramatically. Our proposed system predicts pet posture using smart camera networks powered by the artificial intelligence of things. This system is built on a platform using a Raspberry Pi embedded system. The system can determine from an image whether there is a detection target and generate a contour mask based on Mask R-CNN Technology. According to object detection, poses and key parts can be identified to predict and draw pet skeletons. Simultaneously, the behavioural action of a pet can be determined according to continuous skeleton data and then the system will actively inform the owner to perform subsequent processing.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Ming-Fong Tsai', 'Jhao-Yang Huang']** (2020) demonstrates that systematically modeling parameters in 5G/6G Architectures minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-wireless-iot-l5-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 5 (5G/6G Architectures)?",
            "back": "5G/6G Architectures integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-wireless-iot-l5-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on 5G/6G Architectures?",
            "back": "['Ming-Fong Tsai', 'Jhao-Yang Huang'] (2020) with 0 citations."
          },
          {
            "id": "blk-les-wireless-iot-l5-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for 5G/6G Architectures?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In 5G/6G Architectures, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-wireless-iot-l5-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 5 (5G/6G Architectures)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-wireless-iot-l6",
        "title": "Level 6 - IoT Protocols",
        "objective": "Master key principles, flashcard active recall, and MCQs for IoT Protocols.",
        "estimatedMinutes": 22,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-wireless-iot-7"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-wireless-iot-l6-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 6 - IoT Protocols",
            "content": "### Level 6: IoT Protocols\n\n**Theoretical Foundation & Research Insight:**\n\nIn this paper, we consider the joint optimization of transmit waveform and receive filter in colocated multiple-input multiple-output (MIMO) radar to enhance target detection performance in the presence of signal-dependent interference. It is noticed that in the detection stage, the output energy is mainly concentrated in the mainlobe region. Therefore, we decompose the receive filter as the cascade of a receive beamformer and a temporal filter. Then, under the peak-to-average ratio (PAR) constraint, a problem is formulated to realize a trade-off between the signal-to-interference-plus-noise ratio (SINR) and the integrated sidelobe level (ISL) at the pulse compression output of mainlobe synthesized signal. A non-decreasing algorithm, which is the combination of sequential optimization algorithm and minorization-maximization (MM) method, is developed to solve this problem. Besides, in order to reduce computation burden, a special case is proposed, where we fix the temporal filter as the mainlobe synthesized signal. Then, another non-decreasing algorithm based on the MM method is proposed to solve the special case. Numerical experiments show that the proposed algorithms can obtain high output SINR and low output ISL efficiently.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Hao Zheng', 'Bo Jiu', 'Hongwei Liu']** (2019) demonstrates that systematically modeling parameters in IoT Protocols minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-wireless-iot-l6-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 6 (IoT Protocols)?",
            "back": "IoT Protocols integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-wireless-iot-l6-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on IoT Protocols?",
            "back": "['Hao Zheng', 'Bo Jiu', 'Hongwei Liu'] (2019) with 4 citations."
          },
          {
            "id": "blk-les-wireless-iot-l6-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for IoT Protocols?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In IoT Protocols, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-wireless-iot-l6-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 6 (IoT Protocols)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-wireless-iot-l7",
        "title": "Level 7 - Energy Harvesting",
        "objective": "Master key principles, flashcard active recall, and MCQs for Energy Harvesting.",
        "estimatedMinutes": 24,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-wireless-iot-8"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-wireless-iot-l7-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 7 - Energy Harvesting",
            "content": "### Level 7: Energy Harvesting\n\n**Theoretical Foundation & Research Insight:**\n\nThis work presents the joint use of Radio Over Fiber and optical chaos to investigate the secure ROF link. Merging the two technologies, optical chaos for physical layer communication security and Radio over Fiber creates new design issues which have been identified and studied in detail in this paper for both analog Radio Frequency/Intermediate Frequency and digitized data. A semiconductor laser diode is driven into chaotic region using direct modulation scheme and RoF signal is added by chaos message masking scheme. The chaotically masked signal is transmitted over an optical communication link to investigate the propagation issues and synchronization of chaos at the receiver. The transmitted chaos is synchronized at the receiver to unmask the signal by using subtraction rule. To investigate the performance of chaotic communication system for Radio over Fiber transmission, the figure of merits like Bit error rate, Quality factor, Eye Opening Penalty and Root-mean-squared phase jitter are studied for digital data and Signal to Noise ratio and Total Harmonic Distortion are studied for analog waveform to address the effects of link length and data rate/message bandwidth.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Danish Ali Mazhar', 'Syed Zafar Ali Shah', 'Muhammad Khawar Islam', 'Farhan Qamar']** (2019) demonstrates that systematically modeling parameters in Energy Harvesting minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-wireless-iot-l7-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 7 (Energy Harvesting)?",
            "back": "Energy Harvesting integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-wireless-iot-l7-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Energy Harvesting?",
            "back": "['Danish Ali Mazhar', 'Syed Zafar Ali Shah', 'Muhammad Khawar Islam', 'Farhan Qamar'] (2019) with 3 citations."
          },
          {
            "id": "blk-les-wireless-iot-l7-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Energy Harvesting?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Energy Harvesting, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-wireless-iot-l7-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 7 (Energy Harvesting)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-wireless-iot-l8",
        "title": "Level 8 - Signal Modulation",
        "objective": "Master key principles, flashcard active recall, and MCQs for Signal Modulation.",
        "estimatedMinutes": 26,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-wireless-iot-9"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-wireless-iot-l8-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 8 - Signal Modulation",
            "content": "### Level 8: Signal Modulation\n\n**Theoretical Foundation & Research Insight:**\n\nAircraft trajectory prediction is a challenging problem in air traffic control, especially for conflict detection. Traditional trajectory predictors require a variety of inputs such as flight-plans, aircraft performance models, meteorological forecasts, etc. Many of these data are subjected to environmental uncertainties. Further, limited information about such inputs, especially the lack of aircraft tactical intent, makes trajectory prediction a challenging task. In this work, we propose a deep learning model that performs trajectory prediction by modeling and incorporating aircraft tactical intent. The proposed model adopts the encoder-decoder architecture and makes use of the convolutional layer as well as Gated Recurrent Units (GRUs). The proposed model does not require explicit information about aircraft performance and wind data. Results demonstrate that the provision of enriched aircraft intent, together with appropriate model design, could improve the prediction error up to 30% at a prediction horizon of 10 minutes (from 4.9 nautical miles to 3.4 nautical miles). The model also guarantees the mean error growth rate with increasing look-ahead time to be lower than 0.2 nautical miles per minute. In addition, the model offers a very low variance in the prediction, which satisfies the variance-standard specified by EUROCONTROL (EU Organization for Safety and Navigation of Air Traffic) for trajectory predictors. The proposed model also outperforms the state-of-the-art trajectory prediction model, where the Root Mean Square Error (RMSE) is reduced from 0.0203 to 0.0018 for latitude prediction, and from 0.0482 to 0.0021 for longitude prediction in a single prediction step of 15 seconds look-ahead. We showed that the pre-trained model on ADS-B data maintains its high performance, in terms of cross-track and along-track errors, when being validated in the Bluesky Air Traffic Simulator. The proposed model would significantly improve the performance of conflict detecti...\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Phu N. Tran', 'Hoang Q. V. Nguyen', 'Duc-Thinh Pham', 'Sameer Alam']** (2022) demonstrates that systematically modeling parameters in Signal Modulation minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-wireless-iot-l8-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 8 (Signal Modulation)?",
            "back": "Signal Modulation integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-wireless-iot-l8-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Signal Modulation?",
            "back": "['Phu N. Tran', 'Hoang Q. V. Nguyen', 'Duc-Thinh Pham', 'Sameer Alam'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-wireless-iot-l8-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Signal Modulation?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Signal Modulation, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-wireless-iot-l8-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 8 (Signal Modulation)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-wireless-iot-l9",
        "title": "Level 9 - Wireless Security",
        "objective": "Master key principles, flashcard active recall, and MCQs for Wireless Security.",
        "estimatedMinutes": 28,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-wireless-iot-10"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-wireless-iot-l9-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 9 - Wireless Security",
            "content": "### Level 9: Wireless Security\n\n**Theoretical Foundation & Research Insight:**\n\nIn this paper, we propose a generalized grouping and pruning method for RGB-D SLAM in low-dynamic environments. The conventional grouping and pruning methods successfully reject the effect of dynamic objects in pose graph optimization (PGO). However, these methods sometimes fail when high-dynamic objects are dominant in the images captured by RGB-D sensors. Furthermore, once it is determined whether the features from dynamic objects are included in some nodes, the corresponding nodes are entirely removed even though these nodes partially include true constraints, which leads to an inaccurate PGO. To tackle these problems, we propose a novel method with intra-grouping, inter-grouping, and selective pruning, called G2P-SLAM. Accordingly, our method successfully rejects false constraints from dynamic objects selectively, thus preserving true constraints from static objects as many as possible. As experimentally verified on both our own datasets and public datasets, our proposed method shows promising performance compared with the state-of-the-art methods. Furthermore, experimental results corroborate that our G2P-SLAM enables robust PGO in both dynamic and low-dynamic environments.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Seungwon Song', 'Hyungtae Lim', 'Sungwook Jung', 'Hyun Myung']** (2022) demonstrates that systematically modeling parameters in Wireless Security minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-wireless-iot-l9-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 9 (Wireless Security)?",
            "back": "Wireless Security integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-wireless-iot-l9-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Wireless Security?",
            "back": "['Seungwon Song', 'Hyungtae Lim', 'Sungwook Jung', 'Hyun Myung'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-wireless-iot-l9-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Wireless Security?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Wireless Security, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-wireless-iot-l9-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 9 (Wireless Security)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-wireless-iot-l10",
        "title": "Level 10 - Satellite Networks",
        "objective": "Master key principles, flashcard active recall, and MCQs for Satellite Networks.",
        "estimatedMinutes": 30,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-wireless-iot-11"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-wireless-iot-l10-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 10 - Satellite Networks",
            "content": "### Level 10: Satellite Networks\n\n**Theoretical Foundation & Research Insight:**\n\nNeuromorphic computing is a promising candidate for breaking the von Neumann bottleneck and developing high-efficient computing systems. Here we present a W/TaO\nx\n/Pt high-precision electronic synapse with excellent analog properties for neuromorphic computing. The device exhibits the potential of 10-bit weight precision, which is state of the art in conductance levels. Furthermore, the device shows linear weight update behavior in a specific conductance range, linear I-V curves in low voltage regime, long time retention, and precise modulation of weight. These characteristics are very helpful for improving the accuracy of neuromorphic networks. Finally, a 400 \u00d7 60 \u00d7 10 three-layer perceptron was constructed with W/TaO\nx\n/Pt synapses for MNIST classification and ~92% accuracy was achieved.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Sen Liu', 'Kun Li', 'Yi Sun', 'Xi Zhu', 'Zhiwei Li', 'Bing Song', 'Haijun Liu', 'Qingjiang Li']** (2019) demonstrates that systematically modeling parameters in Satellite Networks minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-wireless-iot-l10-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 10 (Satellite Networks)?",
            "back": "Satellite Networks integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-wireless-iot-l10-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Satellite Networks?",
            "back": "['Sen Liu', 'Kun Li', 'Yi Sun', 'Xi Zhu', 'Zhiwei Li', 'Bing Song', 'Haijun Liu', 'Qingjiang Li'] (2019) with 3 citations."
          },
          {
            "id": "blk-les-wireless-iot-l10-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Satellite Networks?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Satellite Networks, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-wireless-iot-l10-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 10 (Satellite Networks)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      }
    ]
  },
  {
    "id": "course-hci-101",
    "spaceId": "hci-ui",
    "title": "Tangible User Interfaces & Spatial Computing",
    "description": "Explore 10 levels of interactive system design, tangible hardware feedback, and immersive user experiences.",
    "icon": "\ud83c\udfa8",
    "accent": "#d97706",
    "status": "active",
    "learningGoal": "Complete all 10 levels of Tangible User Interfaces & Spatial Computing.",
    "estimatedMinutes": 180,
    "readiness": 95,
    "progress": 30,
    "currentLessonId": "les-hci-ui-l4",
    "totalLessons": 10,
    "completedLessons": 3,
    "nextAction": "Continue Level 4",
    "updatedAt": "2026-09-08T14:00:00.000Z",
    "sourceIds": [
      "paper-hci-ui-1",
      "paper-hci-ui-2",
      "paper-hci-ui-3",
      "paper-hci-ui-4",
      "paper-hci-ui-5"
    ],
    "modules": [
      {
        "id": "mod-hci-ui-l1",
        "title": "Level 1: TUI Foundations",
        "description": "Mastering TUI Foundations concepts, analysis, and research findings.",
        "lessonIds": [
          "les-hci-ui-l1"
        ]
      },
      {
        "id": "mod-hci-ui-l2",
        "title": "Level 2: Haptic Feedback",
        "description": "Mastering Haptic Feedback concepts, analysis, and research findings.",
        "lessonIds": [
          "les-hci-ui-l2"
        ]
      },
      {
        "id": "mod-hci-ui-l3",
        "title": "Level 3: Spatial Tracking",
        "description": "Mastering Spatial Tracking concepts, analysis, and research findings.",
        "lessonIds": [
          "les-hci-ui-l3"
        ]
      },
      {
        "id": "mod-hci-ui-l4",
        "title": "Level 4: Physical Affordances",
        "description": "Mastering Physical Affordances concepts, analysis, and research findings.",
        "lessonIds": [
          "les-hci-ui-l4"
        ]
      },
      {
        "id": "mod-hci-ui-l5",
        "title": "Level 5: Multimodal Interaction",
        "description": "Mastering Multimodal Interaction concepts, analysis, and research findings.",
        "lessonIds": [
          "les-hci-ui-l5"
        ]
      },
      {
        "id": "mod-hci-ui-l6",
        "title": "Level 6: Ubiquitous Computing",
        "description": "Mastering Ubiquitous Computing concepts, analysis, and research findings.",
        "lessonIds": [
          "les-hci-ui-l6"
        ]
      },
      {
        "id": "mod-hci-ui-l7",
        "title": "Level 7: AR/VR Integration",
        "description": "Mastering AR/VR Integration concepts, analysis, and research findings.",
        "lessonIds": [
          "les-hci-ui-l7"
        ]
      },
      {
        "id": "mod-hci-ui-l8",
        "title": "Level 8: User Ergonomics",
        "description": "Mastering User Ergonomics concepts, analysis, and research findings.",
        "lessonIds": [
          "les-hci-ui-l8"
        ]
      },
      {
        "id": "mod-hci-ui-l9",
        "title": "Level 9: Interactive Prototypes",
        "description": "Mastering Interactive Prototypes concepts, analysis, and research findings.",
        "lessonIds": [
          "les-hci-ui-l9"
        ]
      },
      {
        "id": "mod-hci-ui-l10",
        "title": "Level 10: Usability Evaluation",
        "description": "Mastering Usability Evaluation concepts, analysis, and research findings.",
        "lessonIds": [
          "les-hci-ui-l10"
        ]
      }
    ],
    "lessons": [
      {
        "id": "les-hci-ui-l1",
        "title": "Level 1 - TUI Foundations",
        "objective": "Master key principles, flashcard active recall, and MCQs for TUI Foundations.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-hci-ui-2"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-hci-ui-l1-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 1 - TUI Foundations",
            "content": "### Level 1: TUI Foundations\n\n**Theoretical Foundation & Research Insight:**\n\nThis paper studied conductance-based method for water cut measurement to dynamically monitor the horizontal oil-producing wells. Existing conductance tools cannot obtain the response values corresponding to the water phase in horizontal wells due to the characteristics of the ring-shaped electrode structure and the horizontal well structure. In order to tackle this issue, this paper designed a novel Combined Conductance Sensor (CCS), which mainly consists of the Ring-Shaped Conductance Probe (RSCP) and the novel Clock-like Conductance Probe Array (CCPA). Specifically, we first established the structure model of CCS, optimized the geometry of CCPA by analyzing the uniformity of electric field distribution generated by the exciting electrodes of CCPA and then analyzed the local sensitivity field region of the optimized CCPA. Then we studied the flow pattern distribution of the horizontal oil-water two-phase flow and analyzed the response characteristics and the linear relation between RSCP and CCPA. In addition, this research developed the CCS-based tool and conducted the experiments about different inclined angles in horizontal and slightly inclined pipes. Extensive experiments demonstrated that the developed CCS can cover the three-quarter scale of water cut measurement(25%-100%) in horizontal and slightly inclined pipes, and the experimental results verified the validity of CCS for the water cut measurement. Comparing to the existing methods, the proposed CCS is more suitable for water cut measurement with the advantages of simple structure and low cost for the horizontal oil wells with the characteristics of the low production, which could be used widely in the actual logging.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Weihang Kong', 'He Li', 'Guanglong Xing', 'Lingfu Kong', 'Lei Li', 'Min Wang']** (2019) demonstrates that systematically modeling parameters in TUI Foundations minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-hci-ui-l1-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 1 (TUI Foundations)?",
            "back": "TUI Foundations integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-hci-ui-l1-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on TUI Foundations?",
            "back": "['Weihang Kong', 'He Li', 'Guanglong Xing', 'Lingfu Kong', 'Lei Li', 'Min Wang'] (2019) with 1 citations."
          },
          {
            "id": "blk-les-hci-ui-l1-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for TUI Foundations?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In TUI Foundations, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-hci-ui-l1-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 1 (TUI Foundations)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-hci-ui-l2",
        "title": "Level 2 - Haptic Feedback",
        "objective": "Master key principles, flashcard active recall, and MCQs for Haptic Feedback.",
        "estimatedMinutes": 14,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-hci-ui-3"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-hci-ui-l2-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 2 - Haptic Feedback",
            "content": "### Level 2: Haptic Feedback\n\n**Theoretical Foundation & Research Insight:**\n\nDespite the rapid spread of Internet of Things (IoT) systems, the lack of interoperability between the systems significantly hinders their business and societal potential. Moreover, a major challenge for wider interoperability is that the IoT systems can be owned by multiple independent entities, whose collaboration will need to be organised to ensure their interoperability. One approach for achieving this is to establish federations supported by Distributed Ledger Technologies (DLTs), as this enables interoperability between entities and collaboration between business platforms, thereby overcoming many technical and administrative difficulties. DLTs can provide the required transparency and immutability for management of the federations, thus increasing trust and reducing the risk of misbehaviour that could destabilise the federation. This paper presents two system dynamics simulation models, which demonstrate that the success of a federation (with or without DLT support) is inversely related to the short-term selfishness of its members, and we then proceed to show that DLTs can improve the feedback received by the federation members on their actions by promoting a common consensus, which in turn can make the federation more resilient.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Tommi M. Elo', 'Sampsa Ruutu', 'Ektor Arzoglou', 'Yki Kortesniemi', 'Dmitrij Lagutin', 'Veria Hoseini', 'George C. Polyzos']** (2021) demonstrates that systematically modeling parameters in Haptic Feedback minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-hci-ui-l2-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 2 (Haptic Feedback)?",
            "back": "Haptic Feedback integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-hci-ui-l2-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Haptic Feedback?",
            "back": "['Tommi M. Elo', 'Sampsa Ruutu', 'Ektor Arzoglou', 'Yki Kortesniemi', 'Dmitrij Lagutin', 'Veria Hoseini', 'George C. Polyzos'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-hci-ui-l2-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Haptic Feedback?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Haptic Feedback, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-hci-ui-l2-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 2 (Haptic Feedback)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-hci-ui-l3",
        "title": "Level 3 - Spatial Tracking",
        "objective": "Master key principles, flashcard active recall, and MCQs for Spatial Tracking.",
        "estimatedMinutes": 16,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-hci-ui-4"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-hci-ui-l3-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 3 - Spatial Tracking",
            "content": "### Level 3: Spatial Tracking\n\n**Theoretical Foundation & Research Insight:**\n\nMulti-channel signal has more abundant and accurate state characteristic information than single channel signal. How to separate fault characteristic information from the multi-channel signal is the key of fault diagnosis. As two typical multi-channel signal decomposition methods, multivariate empirical mode decomposition (MEMD) and multivariate variational mode decomposition (MVMD) are widely used in multi-channel signal analysis. However, MEMD and MVMD use cyclic iteration to complete the analysis of multi-channel signals, and it is difficult to overcome their inherent defects. In view of this, based on nonlinear sparse mode decomposition (NSMD), this paper proposes a multivariate nonlinear sparse mode decomposition (MNSMD) by constraining singular local linear operators to separate the natural oscillation modes in multi-channel signal. By constraining singular local linear operators into signal decomposition, MNSMD has obvious advantages in restraining mode aliasing and robustness. In addition, the local narrow-band component is used as the basis function for iteration, and the component signal is obtained by approaching the original signal. Through the simulation signal and gear fault signal analysis, the results show that, compared with MEMD and MVMD methods, MNSMD method can effectively complete gear fault diagnosis.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Haiyang Pan', 'Wanwan Jiang', 'Qingyun Liu', 'Jinde Zheng']** (2021) demonstrates that systematically modeling parameters in Spatial Tracking minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-hci-ui-l3-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 3 (Spatial Tracking)?",
            "back": "Spatial Tracking integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-hci-ui-l3-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Spatial Tracking?",
            "back": "['Haiyang Pan', 'Wanwan Jiang', 'Qingyun Liu', 'Jinde Zheng'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-hci-ui-l3-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Spatial Tracking?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Spatial Tracking, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-hci-ui-l3-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 3 (Spatial Tracking)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-hci-ui-l4",
        "title": "Level 4 - Physical Affordances",
        "objective": "Master key principles, flashcard active recall, and MCQs for Physical Affordances.",
        "estimatedMinutes": 18,
        "difficulty": "intermediate",
        "status": "ready",
        "sourceIds": [
          "paper-hci-ui-5"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-hci-ui-l4-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 4 - Physical Affordances",
            "content": "### Level 4: Physical Affordances\n\n**Theoretical Foundation & Research Insight:**\n\nThe number of road accidents has constantly been increasing recently around the world. As per the national highway traffic safety administration\u2019s investigation, 45% of vehicle crashes are done by a distracted driver right around each. We endeavor to build a precise and robust framework for distinguishing diverted drivers. The existing work of distracted driver detection is concerned with a limited set of distractions (mainly cell phone usage). This paper uses the first publicly accessible dataset that is the state farm distracted driver detection dataset, which contains eight classes: calling, texting, everyday driving, operating on radio, inactiveness, talking to a passenger, looking behind, and drinking performed by 26 subjects to prepare our proposed model. The transfer values of the pertained model EfficientNet are used, as it is the backbone of EfficientDet. In contrast, the EfficientDet model detects the objects involved in these distracting activities and the region of interest of the body parts from the images to make predictions strong and accomplish state-of-art results. Also, in the Efficientdet model, we implement five variants: Efficientdet (D0-D4) for detection purposes and compared the best Efficientdet version with Faster R-CNN and Yolo-V3. Experimental results show that the proposed approach outperforms earlier methods in the literature and conclude that EfficientDet-D3 is the best model for detecting distracted drivers as it achieves Mean Average Precision (MAP) of 99.16% with parameter setting: learning rate of \n le\u22123le-3 \n, 50 epoch, batch size of 4, and step size of 250, demonstrating that it can potentially help drivers maintain safe driving habits.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Faiqa Sajid', 'Abdul Rehman Javed', 'Asma Basharat', 'Natalia Kryvinska', 'Adil Afzal', 'Muhammad Rizwan']** (2021) demonstrates that systematically modeling parameters in Physical Affordances minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-hci-ui-l4-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 4 (Physical Affordances)?",
            "back": "Physical Affordances integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-hci-ui-l4-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Physical Affordances?",
            "back": "['Faiqa Sajid', 'Abdul Rehman Javed', 'Asma Basharat', 'Natalia Kryvinska', 'Adil Afzal', 'Muhammad Rizwan'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-hci-ui-l4-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Physical Affordances?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Physical Affordances, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-hci-ui-l4-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 4 (Physical Affordances)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-hci-ui-l5",
        "title": "Level 5 - Multimodal Interaction",
        "objective": "Master key principles, flashcard active recall, and MCQs for Multimodal Interaction.",
        "estimatedMinutes": 20,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-hci-ui-6"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-hci-ui-l5-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 5 - Multimodal Interaction",
            "content": "### Level 5: Multimodal Interaction\n\n**Theoretical Foundation & Research Insight:**\n\nReceived signal strength indicator (RSSI) based indoor localization technology has its irreplaceable advantages for many location-aware applications. It is becoming obvious that in the development of fifth-generation (5G) and future communication technology, indoor localization technology will play a key role in location-based application scenarios including smart home systems, manufacturing automation, health care, and robotics. Compared with wireless coverage using conventional monopole antenna, leaky coaxial cables (LCX) can generate a uniform and stable wireless coverage over a long-narrow linear-cell or irregular environment such as railway station and underground shopping-mall, especially for some manufacturing factories with wireless zone areas from a large number of mental machines. This paper presents a localization method using multiple leaky coaxial cables (LCX) for an indoor multipath-rich environment. Different from conventional localization methods based on time of arrival (TOA) or time difference of arrival (TDOA), we consider improving the localization accuracy by machine learning RSSI from LCX. We will present a probabilistic neural network (PNN) approach by utilizing RSSI from LCX. The proposal is aimed at the two-dimensional (2-D) localization in a trajectory. In addition, we also compared the performance of the RSSI-based PNN (RSSI-PNN) method and conventional TDOA method over the same environment. The results show the RSSI-PNN method is promising and more than 90% of the localization errors in the RSSI-PNN method are within 1 m. Compared with the conventional TDOA method, the RSSI-PNN method has better localization performance especially in the middle area of the wireless coverage of LCXs in the indoor environment.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Junjie Zhu', 'Pengcheng Hou', 'Kenta Nagayama', 'Yafei Hou', 'Satoshi Denno', 'Rian Ferdian']** (2022) demonstrates that systematically modeling parameters in Multimodal Interaction minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-hci-ui-l5-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 5 (Multimodal Interaction)?",
            "back": "Multimodal Interaction integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-hci-ui-l5-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Multimodal Interaction?",
            "back": "['Junjie Zhu', 'Pengcheng Hou', 'Kenta Nagayama', 'Yafei Hou', 'Satoshi Denno', 'Rian Ferdian'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-hci-ui-l5-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Multimodal Interaction?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Multimodal Interaction, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-hci-ui-l5-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 5 (Multimodal Interaction)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-hci-ui-l6",
        "title": "Level 6 - Ubiquitous Computing",
        "objective": "Master key principles, flashcard active recall, and MCQs for Ubiquitous Computing.",
        "estimatedMinutes": 22,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-hci-ui-7"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-hci-ui-l6-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 6 - Ubiquitous Computing",
            "content": "### Level 6: Ubiquitous Computing\n\n**Theoretical Foundation & Research Insight:**\n\nPetri nets are an important and popular tool to model and analyze deadlocks in flexible manufacturing systems. The state space of a Petri net model can be divided into two disjoint parts: a live-zone and a dead-zone. Reachability graph analysis plays an important role in the modeling and control of Petri nets. Most existing studies have to fully enumerate the reachable markings of a Petri net to obtain the first-met bad markings (FBMs), which exacerbates the computational overheads. In this paper, a computationally efficient method to find dead markings in Petri nets is presented. We first introduce an algorithm to find dead markings by solving an integer linear programming problem. Then, the set of markings in the dead-zone is calculated, including the set of dead markings and the set of bad markings. Then we can find all the FBMs. By using a vector covering approach, the minimal covered set of FBMs is computed. The proposed approach can obtain the dead markings and FBMs by searching only a part of a reachability graph. Finally, examples are provided to demonstrate the proposed method.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Menghuan Hu', 'Shaohua Yang', 'Yufeng Chen']** (2020) demonstrates that systematically modeling parameters in Ubiquitous Computing minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-hci-ui-l6-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 6 (Ubiquitous Computing)?",
            "back": "Ubiquitous Computing integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-hci-ui-l6-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Ubiquitous Computing?",
            "back": "['Menghuan Hu', 'Shaohua Yang', 'Yufeng Chen'] (2020) with 1 citations."
          },
          {
            "id": "blk-les-hci-ui-l6-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Ubiquitous Computing?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Ubiquitous Computing, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-hci-ui-l6-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 6 (Ubiquitous Computing)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-hci-ui-l7",
        "title": "Level 7 - AR/VR Integration",
        "objective": "Master key principles, flashcard active recall, and MCQs for AR/VR Integration.",
        "estimatedMinutes": 24,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-hci-ui-8"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-hci-ui-l7-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 7 - AR/VR Integration",
            "content": "### Level 7: AR/VR Integration\n\n**Theoretical Foundation & Research Insight:**\n\nThis work considers multiple user power-domain non-orthogonal multiple access (NOMA)based downlink (DL) and uplink (UL) communication systems with potentially dissimilar fading links for all the users that can follow one of several possible distributions such as Rayleigh, Rician, Nakagami-m, Nakagami-q, \u03ba - \u03bc, \u03b7 - \u03bc, Nakagami-lognormal. The presented analysis, which is based on approximating the probability density function (PDF) of the channel gain as a sum of Gamma distributions, is sufficiently general and applicable in a multitude of NOMA scenarios. For both the UL and DL, closed-form expressions are determined for the outage probability at the users considering both statistical channel state information (CSI)-based as well as instantaneous CSI-based ordering techniques. Analytical expressions for the outage probability and the ensuing diversity orders have also been obtained for the NOMA DL system at high SNRs. Furthermore, similar expressions for the outage probability and outage floor for the NOMA UL system have been derived at high SNRs. Finally, simulation results have been presented to authenticate the analytical results derived and provide insights into the NOMA system performance.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Akash Agarwal', 'Rishabh Chaurasiya', 'Sudhakar Rai', 'Aditya K. Jagannatham']** (2020) demonstrates that systematically modeling parameters in AR/VR Integration minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-hci-ui-l7-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 7 (AR/VR Integration)?",
            "back": "AR/VR Integration integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-hci-ui-l7-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on AR/VR Integration?",
            "back": "['Akash Agarwal', 'Rishabh Chaurasiya', 'Sudhakar Rai', 'Aditya K. Jagannatham'] (2020) with 10 citations."
          },
          {
            "id": "blk-les-hci-ui-l7-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for AR/VR Integration?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In AR/VR Integration, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-hci-ui-l7-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 7 (AR/VR Integration)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-hci-ui-l8",
        "title": "Level 8 - User Ergonomics",
        "objective": "Master key principles, flashcard active recall, and MCQs for User Ergonomics.",
        "estimatedMinutes": 26,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-hci-ui-9"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-hci-ui-l8-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 8 - User Ergonomics",
            "content": "### Level 8: User Ergonomics\n\n**Theoretical Foundation & Research Insight:**\n\nThe rapid evolution and growth of the internet through the last decades led to more concern about cyber-attacks that are continuously increasing and changing. As a result, an effective intrusion detection system was required to protect data, and the discovery of artificial intelligence\u2019s sub-fields, machine learning, and deep learning, was one of the most successful ways to address this problem. This paper reviewed intrusion detection systems and discussed what types of learning algorithms machine learning and deep learning are using to protect data from malicious behavior. It discusses recent machine learning and deep learning work with various network implementations, applications, algorithms, learning approaches, and datasets to develop an operational intrusion detection system.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Asmaa Halbouni', 'Teddy Surya Gunawan', 'Mohamed Hadi Habaebi', 'Murad Halbouni', 'Mira Kartiwi', 'Robiah Ahmad']** (2022) demonstrates that systematically modeling parameters in User Ergonomics minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-hci-ui-l8-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 8 (User Ergonomics)?",
            "back": "User Ergonomics integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-hci-ui-l8-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on User Ergonomics?",
            "back": "['Asmaa Halbouni', 'Teddy Surya Gunawan', 'Mohamed Hadi Habaebi', 'Murad Halbouni', 'Mira Kartiwi', 'Robiah Ahmad'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-hci-ui-l8-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for User Ergonomics?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In User Ergonomics, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-hci-ui-l8-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 8 (User Ergonomics)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-hci-ui-l9",
        "title": "Level 9 - Interactive Prototypes",
        "objective": "Master key principles, flashcard active recall, and MCQs for Interactive Prototypes.",
        "estimatedMinutes": 28,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-hci-ui-10"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-hci-ui-l9-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 9 - Interactive Prototypes",
            "content": "### Level 9: Interactive Prototypes\n\n**Theoretical Foundation & Research Insight:**\n\nDevOps is a set of practices and a cultural movement that aims to break down barriers between development and operation teams to improve collaboration and communication. Different organizations have embraced DevOps principles due to the massive potential, such as a much shorter time to production, increased reliability and stability. However, despite the widespread adoption of DevOps and its infrastructure, there is a lack of understanding and literature on the key concepts, practices, tools, and challenges associated with implementing DevOps strategies. The main goal of this research paper is to explore and discuss challenges related to DevOps culture and practices. Moreover, it describes how DevOps works in an organization, provides a detailed explanation of DevOps, and investigates the cultural challenges that organizations face when implementing DevOps. The proposed paper reveals ten critical challenges that need to be addressed in adopting the DevOps culture. The challenges are further analyzed on the basis of the various continents. According to the findings, the following critical challenges are considered during the implementation of a DevOps culture: lack of collaboration and communication, Lack of skill and knowledge, complicated infrastructure, Lack of management, Lack of DevOps approach, and trust confidence problems.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Muhammad Shoaib Khan', 'Abudul Wahid Khan', 'Faheem Khan', 'Muhammad Adnan Khan', 'Taeg Keun Whangbo']** (2022) demonstrates that systematically modeling parameters in Interactive Prototypes minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-hci-ui-l9-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 9 (Interactive Prototypes)?",
            "back": "Interactive Prototypes integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-hci-ui-l9-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Interactive Prototypes?",
            "back": "['Muhammad Shoaib Khan', 'Abudul Wahid Khan', 'Faheem Khan', 'Muhammad Adnan Khan', 'Taeg Keun Whangbo'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-hci-ui-l9-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Interactive Prototypes?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Interactive Prototypes, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-hci-ui-l9-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 9 (Interactive Prototypes)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-hci-ui-l10",
        "title": "Level 10 - Usability Evaluation",
        "objective": "Master key principles, flashcard active recall, and MCQs for Usability Evaluation.",
        "estimatedMinutes": 30,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-hci-ui-11"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-hci-ui-l10-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 10 - Usability Evaluation",
            "content": "### Level 10: Usability Evaluation\n\n**Theoretical Foundation & Research Insight:**\n\nMulti-class object detection in remote sensing imagery is an important and challenging topic in computer vision. Compared with the object detection of natural scenes, remote sensing object detection has some challenges such as scale diversity, arbitrary directions and densely packed objects. To resolve these problems, this paper presents a scale-aware rotated object detection. Firstly, we propose a novel feature fusion module, which takes full advantage of high-level semantic information and low-level high resolution feature. The new feature maps are more suitable for detecting objects with a large difference in scale. Meanwhile, we design a specific weighted loss, which contains an intersection-over-union (IoU) loss and a smooth L1 loss to further address the scale diversity. Besides, in order to detect oriented and densely packed objects more accurately, we propose a normalization strategy for the representation of rotating bounding box. Our method is evaluated on two public aerial datasets DOTA and HRSC2016, and achieves competitive performances. On DOTA, we boost the mean Average Precision (mAP) to 72.95% on oriented object detection.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Yashan Wang', 'Yue Zhang', 'Yi Zhang', 'Liangjin Zhao', 'Xian Sun', 'Zhi Guo']** (2019) demonstrates that systematically modeling parameters in Usability Evaluation minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-hci-ui-l10-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 10 (Usability Evaluation)?",
            "back": "Usability Evaluation integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-hci-ui-l10-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Usability Evaluation?",
            "back": "['Yashan Wang', 'Yue Zhang', 'Yi Zhang', 'Liangjin Zhao', 'Xian Sun', 'Zhi Guo'] (2019) with 18 citations."
          },
          {
            "id": "blk-les-hci-ui-l10-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Usability Evaluation?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Usability Evaluation, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-hci-ui-l10-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 10 (Usability Evaluation)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      }
    ]
  },
  {
    "id": "course-power-101",
    "spaceId": "power-energy",
    "title": "Smart Grid Engineering & Power Electronics",
    "description": "From high-voltage DC insulation to smart grid dispatch across 10 levels of industrial power engineering.",
    "icon": "\u26a1",
    "accent": "#059669",
    "status": "active",
    "learningGoal": "Complete all 10 levels of Smart Grid Engineering & Power Electronics.",
    "estimatedMinutes": 180,
    "readiness": 95,
    "progress": 30,
    "currentLessonId": "les-power-energy-l4",
    "totalLessons": 10,
    "completedLessons": 3,
    "nextAction": "Continue Level 4",
    "updatedAt": "2026-09-08T14:00:00.000Z",
    "sourceIds": [
      "paper-power-energy-1",
      "paper-power-energy-2",
      "paper-power-energy-3",
      "paper-power-energy-4",
      "paper-power-energy-5"
    ],
    "modules": [
      {
        "id": "mod-power-energy-l1",
        "title": "Level 1: DC Insulation",
        "description": "Mastering DC Insulation concepts, analysis, and research findings.",
        "lessonIds": [
          "les-power-energy-l1"
        ]
      },
      {
        "id": "mod-power-energy-l2",
        "title": "Level 2: Gas Switchgear",
        "description": "Mastering Gas Switchgear concepts, analysis, and research findings.",
        "lessonIds": [
          "les-power-energy-l2"
        ]
      },
      {
        "id": "mod-power-energy-l3",
        "title": "Level 3: Grid Dynamics",
        "description": "Mastering Grid Dynamics concepts, analysis, and research findings.",
        "lessonIds": [
          "les-power-energy-l3"
        ]
      },
      {
        "id": "mod-power-energy-l4",
        "title": "Level 4: Renewable Integration",
        "description": "Mastering Renewable Integration concepts, analysis, and research findings.",
        "lessonIds": [
          "les-power-energy-l4"
        ]
      },
      {
        "id": "mod-power-energy-l5",
        "title": "Level 5: Power Factor Correction",
        "description": "Mastering Power Factor Correction concepts, analysis, and research findings.",
        "lessonIds": [
          "les-power-energy-l5"
        ]
      },
      {
        "id": "mod-power-energy-l6",
        "title": "Level 6: High Voltage Testing",
        "description": "Mastering High Voltage Testing concepts, analysis, and research findings.",
        "lessonIds": [
          "les-power-energy-l6"
        ]
      },
      {
        "id": "mod-power-energy-l7",
        "title": "Level 7: Microgrid Control",
        "description": "Mastering Microgrid Control concepts, analysis, and research findings.",
        "lessonIds": [
          "les-power-energy-l7"
        ]
      },
      {
        "id": "mod-power-energy-l8",
        "title": "Level 8: Fault Detection",
        "description": "Mastering Fault Detection concepts, analysis, and research findings.",
        "lessonIds": [
          "les-power-energy-l8"
        ]
      },
      {
        "id": "mod-power-energy-l9",
        "title": "Level 9: Battery Storage",
        "description": "Mastering Battery Storage concepts, analysis, and research findings.",
        "lessonIds": [
          "les-power-energy-l9"
        ]
      },
      {
        "id": "mod-power-energy-l10",
        "title": "Level 10: Smart Metering",
        "description": "Mastering Smart Metering concepts, analysis, and research findings.",
        "lessonIds": [
          "les-power-energy-l10"
        ]
      }
    ],
    "lessons": [
      {
        "id": "les-power-energy-l1",
        "title": "Level 1 - DC Insulation",
        "objective": "Master key principles, flashcard active recall, and MCQs for DC Insulation.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-power-energy-2"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-power-energy-l1-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 1 - DC Insulation",
            "content": "### Level 1: DC Insulation\n\n**Theoretical Foundation & Research Insight:**\n\nThe damage detection method for composite laminates introduced in this research uses piezoelectric (lead zirconate titanate, PZT) transducers to excite/sense the Lamb wave signals. The complicated wave signals scattered by damage are accurately processed using a continuous wavelet transformation (CWT) based on the Gabor wavelet. The transducers are arranged on a composite laminate in the form of a network of square detection cells and triangular subcells. The damage location is estimated using the concept of centroid in two-stage detection method. The first stage detection is carried out by exciting a transducer at the center of each detection cell to locate the damaged cell and subcell. The damage localization is improved by exciting an additional transducer at the corner of the damaged subcell during the second stage detection. The damage size is then quantitatively estimated using cubic spline curve (CSC) and elliptical parametric (EP) methods based on the damage edge points. The damage location is estimated in two detection stages for high-accuracy because the damage edge points are calculated with reference to the estimated location of the damage. The arrangement of transducers and signal processing technique remain the same at all the stages of damage detection. Results from previous detection stages contribute to the improvement of damage detection in the subsequent stages. The size of detection cell plays a crucial role in designing the detection stages, and the proposed method can accurately quantify both location and size of the damage in composite laminate.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['M. Saqib Hameed', 'Zheng Li']** (2019) demonstrates that systematically modeling parameters in DC Insulation minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-power-energy-l1-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 1 (DC Insulation)?",
            "back": "DC Insulation integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-power-energy-l1-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on DC Insulation?",
            "back": "['M. Saqib Hameed', 'Zheng Li'] (2019) with 3 citations."
          },
          {
            "id": "blk-les-power-energy-l1-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for DC Insulation?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In DC Insulation, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-power-energy-l1-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 1 (DC Insulation)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-power-energy-l2",
        "title": "Level 2 - Gas Switchgear",
        "objective": "Master key principles, flashcard active recall, and MCQs for Gas Switchgear.",
        "estimatedMinutes": 14,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-power-energy-3"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-power-energy-l2-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 2 - Gas Switchgear",
            "content": "### Level 2: Gas Switchgear\n\n**Theoretical Foundation & Research Insight:**\n\nLesion segmentation is of great research interest due to its capability in facilitating accurate stroke diagnosis and surgical planning. Existing deep neural networks, such as U-net, have demonstrated encouraging progress in biomedical image segmentation. Nevertheless, there are still many challenges related to the segmentation of stroke lesions, including dealing with diverse lesion locations, variations in lesion scales, and fuzzy lesion boundaries. In order to address these challenges, this paper proposes a deep neural network architecture denoted as the Multi-Scale Deep Fusion Network (MSDF-Net) with Atrous Spatial Pyramid Pooling (ASPP) for the feature extraction at different scales, and the inclusion of capsules to deal with complicated relative entities. The proposed method is essentially an end-to-end deep encoder-decoder neural network. The cross connection between the encoder and the decoder guarantees the high resolution of the feature mapping. Experimental results on the open-source Anatomical Tracings of Lesions After Stroke (ATLAS) dataset shows that the proposed model achieved a higher evaluating score compared to 5 existing models.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Xinfeng Liu', 'Hao Yang', 'Kehan Qi', 'Pei Dong', 'Qiegen Liu', 'Xin Liu', 'Rongpin Wang', 'Shanshan Wang']** (2019) demonstrates that systematically modeling parameters in Gas Switchgear minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-power-energy-l2-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 2 (Gas Switchgear)?",
            "back": "Gas Switchgear integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-power-energy-l2-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Gas Switchgear?",
            "back": "['Xinfeng Liu', 'Hao Yang', 'Kehan Qi', 'Pei Dong', 'Qiegen Liu', 'Xin Liu', 'Rongpin Wang', 'Shanshan Wang'] (2019) with 8 citations."
          },
          {
            "id": "blk-les-power-energy-l2-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Gas Switchgear?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Gas Switchgear, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-power-energy-l2-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 2 (Gas Switchgear)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-power-energy-l3",
        "title": "Level 3 - Grid Dynamics",
        "objective": "Master key principles, flashcard active recall, and MCQs for Grid Dynamics.",
        "estimatedMinutes": 16,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-power-energy-4"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-power-energy-l3-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 3 - Grid Dynamics",
            "content": "### Level 3: Grid Dynamics\n\n**Theoretical Foundation & Research Insight:**\n\nIn this paper, we propose a method to increase the robustness of 2D/3D optical image encryption using the dilated deep convolutional neural network (CNN). In order to solve the problem that encrypted images suffer from some attacks in practical application, we utilize a fast and effective CNN denoiser based on the principle of deep learning. The CNN improves the robustness of the algorithm by improving the resolution of the reconstructed images. Besides, CNN has a high performance against blur and occlusion attacks. We introduce the pixel scrambling method to enhance the security level of the encryption by the private key of pixel scrambling operation. The proposed method can not only realize the encryption of a two-dimensional image but also implement three-dimensional image encryption by combining the integral imaging technology. Double random phase encoding in the fractional Fourier domain is selected for experimental verification, and the results show the capability for robustness, noise immunity, and security of the proposed method.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Jing Chen', 'Xiao-Wei Li', 'Qiong-Hua Wang']** (2019) demonstrates that systematically modeling parameters in Grid Dynamics minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-power-energy-l3-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 3 (Grid Dynamics)?",
            "back": "Grid Dynamics integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-power-energy-l3-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Grid Dynamics?",
            "back": "['Jing Chen', 'Xiao-Wei Li', 'Qiong-Hua Wang'] (2019) with 9 citations."
          },
          {
            "id": "blk-les-power-energy-l3-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Grid Dynamics?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Grid Dynamics, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-power-energy-l3-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 3 (Grid Dynamics)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-power-energy-l4",
        "title": "Level 4 - Renewable Integration",
        "objective": "Master key principles, flashcard active recall, and MCQs for Renewable Integration.",
        "estimatedMinutes": 18,
        "difficulty": "intermediate",
        "status": "ready",
        "sourceIds": [
          "paper-power-energy-5"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-power-energy-l4-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 4 - Renewable Integration",
            "content": "### Level 4: Renewable Integration\n\n**Theoretical Foundation & Research Insight:**\n\nIn winters, China witnesses frequent mixed-phase ice disasters, which have a detrimental impact on the secure operation of transmission lines. Most of the studies are focused on the conventional overhead lines, and little attention is paid to the novel carbon fiber composite core wire (CFCCW), which were widely used in recent years. Besides, the influence rule of frequent mixed-phase icing on the corona onset characteristics for CFCCW has not been extensively studied across extant literature. Thus, this article addresses the aforementioned issues by conducting Alternating Current (AC) corona tests for four kinds of CFCCW that would be coated by mixed-phase ice in a low-temperature laboratory. The results showed that the impact of mixed-phase ice on the wire corona onset voltage can be reduced by nearly 50%. With more icing the corona onset voltage would further decrease but at a slower pace. For the wires with a larger diameter, higher corona onset voltage with low distortion in the electric field strength was observed for the same icing time. For the freezing-water conductivity, no significant impact on both the icing morphology and the corona onset voltage was observed. Moreover, the validation for the simulation model was established by comparing the simulation results with the experimental results. These inferences drawn could act as a theoretical reference for transmission lines designing and calculating the wire corona onset voltage in the mixed-phase icing areas.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Bingbing Dong', 'Jiale Song', 'Changsheng Gao', 'Zelin Zhang', 'Yu Gu', 'Nianwen Xiang']** (2020) demonstrates that systematically modeling parameters in Renewable Integration minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-power-energy-l4-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 4 (Renewable Integration)?",
            "back": "Renewable Integration integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-power-energy-l4-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Renewable Integration?",
            "back": "['Bingbing Dong', 'Jiale Song', 'Changsheng Gao', 'Zelin Zhang', 'Yu Gu', 'Nianwen Xiang'] (2020) with 1 citations."
          },
          {
            "id": "blk-les-power-energy-l4-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Renewable Integration?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Renewable Integration, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-power-energy-l4-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 4 (Renewable Integration)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-power-energy-l5",
        "title": "Level 5 - Power Factor Correction",
        "objective": "Master key principles, flashcard active recall, and MCQs for Power Factor Correction.",
        "estimatedMinutes": 20,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-power-energy-6"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-power-energy-l5-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 5 - Power Factor Correction",
            "content": "### Level 5: Power Factor Correction\n\n**Theoretical Foundation & Research Insight:**\n\nMega-constellations consisting of hundreds to thousands of low-earth-orbit (LEO) satellites are an attractive solution for providing global ubiquitous network access. Due to good coverage properties for populated areas, inclined orbits are gaining popularity among commercial constellations. A scalable routing algorithm with survivability plays a key role in such systems. In this paper, we propose a distributed survivable routing algorithm for mega-constellations with inclined orbits. First, the special topology characteristic of inclined constellations is identified and formalized. Based on the topology characterization, a basic X-Y routing algorithm is presented to determine multiple primary and secondary paths towards each destination utilizing the regularity of the network topology with minimal computation overhead. Then, a failure recovery mechanism which consists of a restricted flooding mechanism and a pre-detour mechanism is proposed to reduce end-to-end delay and signaling overhead in case of link failures. Besides, a partial-record loop avoidance mechanism is proposed to deal with routing loops with minimal overhead. Finally, a vector-based next hop selection mechanism is proposed to facilitate the selection of next hop while incorporating various criteria. The performance of the proposed routing algorithm is evaluated through simulation on the Starlink constellation. Simulation results show that our proposal achieves scalability by reducing signaling overhead and provides better quality of service in terms of end-to-end delay under link failures.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Xiaoxin Qi', 'Bing Zhang', 'Zhiliang Qiu']** (2020) demonstrates that systematically modeling parameters in Power Factor Correction minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-power-energy-l5-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 5 (Power Factor Correction)?",
            "back": "Power Factor Correction integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-power-energy-l5-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Power Factor Correction?",
            "back": "['Xiaoxin Qi', 'Bing Zhang', 'Zhiliang Qiu'] (2020) with 1 citations."
          },
          {
            "id": "blk-les-power-energy-l5-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Power Factor Correction?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Power Factor Correction, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-power-energy-l5-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 5 (Power Factor Correction)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-power-energy-l6",
        "title": "Level 6 - High Voltage Testing",
        "objective": "Master key principles, flashcard active recall, and MCQs for High Voltage Testing.",
        "estimatedMinutes": 22,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-power-energy-7"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-power-energy-l6-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 6 - High Voltage Testing",
            "content": "### Level 6: High Voltage Testing\n\n**Theoretical Foundation & Research Insight:**\n\nToday\u2019s smart city infrastructure is predominantly dependant on Internet of Things (IoT) technologies. IoT technology essentially facilitates a platform for service automation through connections of heterogeneous objects via the Internet backbone. However, the security issues associated with IoT networks make smart city infrastructure vulnerable to cyber-attacks. For example, Distributed Denial of Service (DDoS) attack violates the authorization conditions in smart city infrastructure; whereas replay attack violates the authentication conditions in smart city infrastructure. Both attacks lead to physical disruption to smart city infrastructure, which may even lead to financial loss and/or loss of human lives. In this paper, a hybrid deep learning model is developed for detecting replay and DDoS attacks in a real life smart city platform. The performance of the proposed hybrid model is evaluated using real life smart city datasets (environmental, smart river and smart soil), where DDoS and replay attacks were simulated. The proposed model reported high accuracy rates: 98.37% for the environmental dataset, 98.13% for the smart river dataset, and 99.51% for the smart soil dataset. The results demonstrated an improved performance of the proposed model over other machine learning and deep learning models from the literature.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Asmaa A. Elsaeidy', 'Abbas Jamalipour', 'Kumudu S. Munasinghe']** (2021) demonstrates that systematically modeling parameters in High Voltage Testing minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-power-energy-l6-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 6 (High Voltage Testing)?",
            "back": "High Voltage Testing integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-power-energy-l6-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on High Voltage Testing?",
            "back": "['Asmaa A. Elsaeidy', 'Abbas Jamalipour', 'Kumudu S. Munasinghe'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-power-energy-l6-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for High Voltage Testing?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In High Voltage Testing, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-power-energy-l6-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 6 (High Voltage Testing)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-power-energy-l7",
        "title": "Level 7 - Microgrid Control",
        "objective": "Master key principles, flashcard active recall, and MCQs for Microgrid Control.",
        "estimatedMinutes": 24,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-power-energy-8"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-power-energy-l7-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 7 - Microgrid Control",
            "content": "### Level 7: Microgrid Control\n\n**Theoretical Foundation & Research Insight:**\n\nPedestrian detection is an important branch of computer vision, and has important applications in the fields of autonomous driving, artificial intelligence and video surveillance. With the rapid development of deep learning and the proposal of large-scale datasets, pedestrian detection has reached a new stage and has achieved better performance. However, the performance of state-of-the-art methods is far behind expectations, especially when occlusion and scale variance exist. Therefore, many works focused on occlusion and scale variance have been proposed in the past few years. The purpose of this article is to make a detailed review of recent progress in pedestrian detection. First, a brief progress of pedestrian detection in the past two decades is summarized. Second, recent deep learning methods focusing on occlusion and scale variance are analyzed. Moreover, the popular datasets and evaluation methods for pedestrian detection are introduced. Finally, the development trends in pedestrian detection are discussed.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Fang Li', 'Xueyuan Li', 'Qi Liu', 'Zirui Li']** (2022) demonstrates that systematically modeling parameters in Microgrid Control minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-power-energy-l7-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 7 (Microgrid Control)?",
            "back": "Microgrid Control integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-power-energy-l7-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Microgrid Control?",
            "back": "['Fang Li', 'Xueyuan Li', 'Qi Liu', 'Zirui Li'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-power-energy-l7-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Microgrid Control?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Microgrid Control, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-power-energy-l7-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 7 (Microgrid Control)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-power-energy-l8",
        "title": "Level 8 - Fault Detection",
        "objective": "Master key principles, flashcard active recall, and MCQs for Fault Detection.",
        "estimatedMinutes": 26,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-power-energy-9"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-power-energy-l8-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 8 - Fault Detection",
            "content": "### Level 8: Fault Detection\n\n**Theoretical Foundation & Research Insight:**\n\nPattern matching has been widely adopted in functional programming languages, and is gradually getting popular in OO languages, from Scala to Python. The structural pattern matching currently in use has its foundation on algebraic data types from functional languages. To better reflect the pointer structures of OO programs, we propose a pattern matching extension to general statically typed OO languages based on object graphs. By this extension, we support patterns having aliasing and circular referencing, that are typically found in pointer structures. With the requirement of only an abstract subtyping preorder on types, our extension is not restricted to a particular hierarchical class model. We give the formal base of the graph model, that is able to handle aliases and cycles in patterns, together with the abstract syntax to construct the object graphs. More complex cases of conjunction and disjunction of multiple patterns are explored with resolution. We present the type checking rules and operational semantics to reason about the soundness by proving the type safety. We also discuss the design decisions, applicability and limitation of our pattern matching extension.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Wei Ke', 'Ka-Hou Chan']** (2021) demonstrates that systematically modeling parameters in Fault Detection minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-power-energy-l8-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 8 (Fault Detection)?",
            "back": "Fault Detection integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-power-energy-l8-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Fault Detection?",
            "back": "['Wei Ke', 'Ka-Hou Chan'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-power-energy-l8-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Fault Detection?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Fault Detection, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-power-energy-l8-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 8 (Fault Detection)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-power-energy-l9",
        "title": "Level 9 - Battery Storage",
        "objective": "Master key principles, flashcard active recall, and MCQs for Battery Storage.",
        "estimatedMinutes": 28,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-power-energy-10"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-power-energy-l9-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 9 - Battery Storage",
            "content": "### Level 9: Battery Storage\n\n**Theoretical Foundation & Research Insight:**\n\nThe energy transition and electrification across many industries place increasingly more weight on the reliability of power electronics. A significant fraction of breakdowns in electronic devices result from capacitor failures. Multilayer ceramic capacitors, the most common capacitor type, are especially prone to mechanical damage, for instance, during the assembly of a printed circuit board. Such damage may dramatically shorten the life span of the component, eventually resulting in failure of the entire electronic device. Unfortunately, current electrical production line testing methods are often unable to reveal these types of damage. While recent studies have shown that acoustic measurements can provide information about the structural condition of a capacitor, reliable detection of damage from acoustic signals remains difficult. Although supervised machine learning classifiers have been proposed as a solution, they require a large training data set containing manually inspected damaged and intact capacitor samples. In this work, acoustic identification of damaged capacitors is demonstrated without a manually labeled data set. Accurate and robust classification is achieved by using a one-class support vector machine, a machine learning model trained solely on intact capacitors. Furthermore, a new algorithm for optimizing the classification performance of the model is presented. By the proposed approach, acoustic testing can be generalized to various capacitor sizes, making it a potential tool for production line testing.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Saku Levikari', 'Tommi J. K\u00e4rkk\u00e4inen', 'Caroline Andersson', 'Juha Tamminen', 'Mikko Nykyri', 'Pertti Silventoinen']** (2020) demonstrates that systematically modeling parameters in Battery Storage minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-power-energy-l9-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 9 (Battery Storage)?",
            "back": "Battery Storage integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-power-energy-l9-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Battery Storage?",
            "back": "['Saku Levikari', 'Tommi J. K\u00e4rkk\u00e4inen', 'Caroline Andersson', 'Juha Tamminen', 'Mikko Nykyri', 'Pertti Silventoinen'] (2020) with 0 citations."
          },
          {
            "id": "blk-les-power-energy-l9-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Battery Storage?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Battery Storage, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-power-energy-l9-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 9 (Battery Storage)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-power-energy-l10",
        "title": "Level 10 - Smart Metering",
        "objective": "Master key principles, flashcard active recall, and MCQs for Smart Metering.",
        "estimatedMinutes": 30,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-power-energy-11"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-power-energy-l10-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 10 - Smart Metering",
            "content": "### Level 10: Smart Metering\n\n**Theoretical Foundation & Research Insight:**\n\nThe SARS-Coronavirus-2 (SARS-CoV-2) infectious disease, COVID-19, has spread rapidly, resulting in a global pandemic with significant mortality. The combination of early diagnosis via rapid screening, contact tracing, social distancing and quarantine has helped to control the pandemic. The absence of real time response and diagnosis is a crucial technology shortfall and is a key reason why current contact tracing methods are inadequate to control spread. In contrast, current information technology combined with a new generation of near-real time tests offers consumer-engaged smartphone-based \u201clab-in-a-phone\u201d internet-of-things (IoT) connected devices that provide increased pandemic monitoring. This review brings together key aspects required to create an entire global diagnostic ecosystem. Cross-disciplinary understanding and integration of both mechanisms and technologies for effective detection, incidence mapping and disease containment in near real-time is summarized. Available measures to monitor and/or sterilize surfaces, next-generation laboratory and smartphone-based diagnostic approaches can be brought together and networked for instant global monitoring that informs Public Health policy. Cloud-based analysis enabling real-time mapping will enable future pandemic control, drive the suppression and elimination of disease spread, saving millions of lives globally. A new paradigm is introduced \u2013 scaled and multiple diagnostics for mapping and spreading of a pandemic rather than traditional accumulation of individual measurements. This can do away with the need for ultra-precise and ultra-accurate analysis by taking mass measurements that can relax tolerances and build resilience through networked analytics and informatics, the basis for novel swarm diagnostics. These include addressing ethical standards, local, national and international collaborative engagement, multidisciplinary and analytical measurements and standards, and data handling and storage protocol...\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Md Arafat Hossain', 'Barbara Brito-Rodriguez', 'Lisa M. Sedger', 'John Canning']** (2021) demonstrates that systematically modeling parameters in Smart Metering minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-power-energy-l10-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 10 (Smart Metering)?",
            "back": "Smart Metering integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-power-energy-l10-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Smart Metering?",
            "back": "['Md Arafat Hossain', 'Barbara Brito-Rodriguez', 'Lisa M. Sedger', 'John Canning'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-power-energy-l10-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Smart Metering?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Smart Metering, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-power-energy-l10-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 10 (Smart Metering)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      }
    ]
  },
  {
    "id": "course-biomed-101",
    "spaceId": "biomedical-signal",
    "title": "Biomedical Signal Processing & Medical AI",
    "description": "10-level deep dive into ECG/EEG filtering, bio-sensor telemetry, and AI-driven clinical diagnostics.",
    "icon": "\ud83e\udec0",
    "accent": "#db2777",
    "status": "active",
    "learningGoal": "Complete all 10 levels of Biomedical Signal Processing & Medical AI.",
    "estimatedMinutes": 180,
    "readiness": 95,
    "progress": 30,
    "currentLessonId": "les-biomedical-signal-l4",
    "totalLessons": 10,
    "completedLessons": 3,
    "nextAction": "Continue Level 4",
    "updatedAt": "2026-09-08T14:00:00.000Z",
    "sourceIds": [
      "paper-biomedical-signal-1",
      "paper-biomedical-signal-2",
      "paper-biomedical-signal-3",
      "paper-biomedical-signal-4",
      "paper-biomedical-signal-5"
    ],
    "modules": [
      {
        "id": "mod-biomedical-signal-l1",
        "title": "Level 1: Biosignal Acquisition",
        "description": "Mastering Biosignal Acquisition concepts, analysis, and research findings.",
        "lessonIds": [
          "les-biomedical-signal-l1"
        ]
      },
      {
        "id": "mod-biomedical-signal-l2",
        "title": "Level 2: ECG/EEG Analysis",
        "description": "Mastering ECG/EEG Analysis concepts, analysis, and research findings.",
        "lessonIds": [
          "les-biomedical-signal-l2"
        ]
      },
      {
        "id": "mod-biomedical-signal-l3",
        "title": "Level 3: Noise Cancellation",
        "description": "Mastering Noise Cancellation concepts, analysis, and research findings.",
        "lessonIds": [
          "les-biomedical-signal-l3"
        ]
      },
      {
        "id": "mod-biomedical-signal-l4",
        "title": "Level 4: Feature Extraction",
        "description": "Mastering Feature Extraction concepts, analysis, and research findings.",
        "lessonIds": [
          "les-biomedical-signal-l4"
        ]
      },
      {
        "id": "mod-biomedical-signal-l5",
        "title": "Level 5: Medical Imaging",
        "description": "Mastering Medical Imaging concepts, analysis, and research findings.",
        "lessonIds": [
          "les-biomedical-signal-l5"
        ]
      },
      {
        "id": "mod-biomedical-signal-l6",
        "title": "Level 6: Brain-Computer Interfaces",
        "description": "Mastering Brain-Computer Interfaces concepts, analysis, and research findings.",
        "lessonIds": [
          "les-biomedical-signal-l6"
        ]
      },
      {
        "id": "mod-biomedical-signal-l7",
        "title": "Level 7: Wearable Sensors",
        "description": "Mastering Wearable Sensors concepts, analysis, and research findings.",
        "lessonIds": [
          "les-biomedical-signal-l7"
        ]
      },
      {
        "id": "mod-biomedical-signal-l8",
        "title": "Level 8: Prosthetic Control",
        "description": "Mastering Prosthetic Control concepts, analysis, and research findings.",
        "lessonIds": [
          "les-biomedical-signal-l8"
        ]
      },
      {
        "id": "mod-biomedical-signal-l9",
        "title": "Level 9: Diagnostic ML Models",
        "description": "Mastering Diagnostic ML Models concepts, analysis, and research findings.",
        "lessonIds": [
          "les-biomedical-signal-l9"
        ]
      },
      {
        "id": "mod-biomedical-signal-l10",
        "title": "Level 10: Clinical Validation",
        "description": "Mastering Clinical Validation concepts, analysis, and research findings.",
        "lessonIds": [
          "les-biomedical-signal-l10"
        ]
      }
    ],
    "lessons": [
      {
        "id": "les-biomedical-signal-l1",
        "title": "Level 1 - Biosignal Acquisition",
        "objective": "Master key principles, flashcard active recall, and MCQs for Biosignal Acquisition.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-biomedical-signal-2"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-biomedical-signal-l1-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 1 - Biosignal Acquisition",
            "content": "### Level 1: Biosignal Acquisition\n\n**Theoretical Foundation & Research Insight:**\n\nThe utilization of solar photovoltaic (PV) generator as a power source for wire feeder systems (WFSs) of arc welding machines is one of the promising domains in solar PV applications. This article proposes a new type of welding WFS and investigates the PV penetrated energy systems. The proposed system comprises of a solar PV generator, a DC/DC buck converter, and a permanent magnet DC (PMDC) motor. The power of the proposed standalone solar photovoltaic-wire feeder system (PV-WFS) can be widely improved using an intelligent fractional-order fuzzy proportional integral derivative (FO-Fuzzy-PID) regulator based on perturbing and observe (P&O) MPPT method. In this article, a FO-Fuzzy-PID regulator is also designed for a PMDC motor driven welding WFS system. Which will then control the wire feed rate of the welding WFS system. Furthermore, the dynamic reaction of the proposed solar PV-WFS depends on the coefficients of these FO-Fuzzy-PID regulators, which are adjusted by a meta-heuristic tuning algorithm based on particle swarm optimization (PSO) technique. The proposed strategy is tested using MATLAB simulations and experimentally verified in real-time on a Hardware-in-the-loop (HIL) testing platform using a dSPACE 1104 board-based laboratory setup. Simulation and experimental results are acceptable and demonstrate the effectiveness, precision, stability, and dynamic reaction of the suggested optimized wire feeder regulating system and the considered intelligent P&O MPPT technique.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Badreddine Babes', 'Fahad Albalawi', 'Noureddine Hamouda', 'Sami Kahla', 'Sherif S. M. Ghoneim']** (2021) demonstrates that systematically modeling parameters in Biosignal Acquisition minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-biomedical-signal-l1-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 1 (Biosignal Acquisition)?",
            "back": "Biosignal Acquisition integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-biomedical-signal-l1-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Biosignal Acquisition?",
            "back": "['Badreddine Babes', 'Fahad Albalawi', 'Noureddine Hamouda', 'Sami Kahla', 'Sherif S. M. Ghoneim'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-biomedical-signal-l1-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Biosignal Acquisition?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Biosignal Acquisition, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-biomedical-signal-l1-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 1 (Biosignal Acquisition)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-biomedical-signal-l2",
        "title": "Level 2 - ECG/EEG Analysis",
        "objective": "Master key principles, flashcard active recall, and MCQs for ECG/EEG Analysis.",
        "estimatedMinutes": 14,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-biomedical-signal-3"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-biomedical-signal-l2-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 2 - ECG/EEG Analysis",
            "content": "### Level 2: ECG/EEG Analysis\n\n**Theoretical Foundation & Research Insight:**\n\nTarget tracking using an unmanned aerial vehicle (UAV) is a challenging robotic problem. It requires handling a high level of nonlinearity and dynamics. Model-free control effectively handles the uncertain nature of the problem, and reinforcement learning (RL)-based approaches are a good candidate for solving this problem. In this article, the Twin Delayed Deep Deterministic Policy Gradient Algorithm (TD3), as recent and composite architecture of RL, was explored as a tracking agent for the UAV-based target tracking problem. Several improvements on the original TD3 were also performed. First, the proportional-differential controller was used to boost the exploration of the TD3 in training. Second, a novel reward formulation for the UAV-based target tracking enabled a careful combination of the various dynamic variables in the reward functions. This was accomplished by incorporating two exponential functions to limit the effect of velocity and acceleration to prevent the deformation in the policy function approximation. In addition, the concept of multistage training based on the dynamic variables was proposed as an opposing concept to one-stage combinatory training. Third, an enhancement of the rewarding function by including piecewise decomposition was used to enable more stable learning behaviour of the policy and move out from the linear reward to the achievement formula. The training was conducted based on fixed target tracking followed by moving target tracking. The flight testing was conducted based on three types of target trajectories: fixed, square, and blinking. The multistage training achieved the best performance with both exponential and achievement rewarding for the fixed trained agent with the fixed and square moving target and for the combined agent with both exponential and achievement rewarding for a fixed trained agent in the case of a blinking target. With respect to the traditional proportional differential controller, the maximum error reductio...\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Najmaddin Abo Mosali', 'Syariful Syafiq Shamsudin', 'Omar Alfandi', 'Rosli Omar', 'Najib Al-Fadhali']** (2022) demonstrates that systematically modeling parameters in ECG/EEG Analysis minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-biomedical-signal-l2-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 2 (ECG/EEG Analysis)?",
            "back": "ECG/EEG Analysis integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-biomedical-signal-l2-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on ECG/EEG Analysis?",
            "back": "['Najmaddin Abo Mosali', 'Syariful Syafiq Shamsudin', 'Omar Alfandi', 'Rosli Omar', 'Najib Al-Fadhali'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-biomedical-signal-l2-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for ECG/EEG Analysis?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In ECG/EEG Analysis, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-biomedical-signal-l2-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 2 (ECG/EEG Analysis)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-biomedical-signal-l3",
        "title": "Level 3 - Noise Cancellation",
        "objective": "Master key principles, flashcard active recall, and MCQs for Noise Cancellation.",
        "estimatedMinutes": 16,
        "difficulty": "beginner",
        "status": "complete",
        "sourceIds": [
          "paper-biomedical-signal-4"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-biomedical-signal-l3-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 3 - Noise Cancellation",
            "content": "### Level 3: Noise Cancellation\n\n**Theoretical Foundation & Research Insight:**\n\nAs it is well known, some versions of the Pepper robot provide poor depth perception due to the lenses it has in front of the tridimensional sensor. In this paper, we present a method to improving that faulty 3D perception. Our proposal is based on a combination of the actual depth readings of Pepper and a deep learning-based monocular depth estimation. As shown, the combination of both of them provides a better 3D representation of the scene. In previous works we made an initial approximation of this fusion technique, but it had some drawbacks. In this paper we analyze the pros and cons of the Pepper readings, the monocular depth estimation method and our previous fusion method. Finally, we demonstrate that the proposed fusion method outperforms them all.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Zuria Bauer', 'Felix Escalona', 'Edmanuel Cruz', 'Miguel Cazorla', 'Francisco Gomez-Donoso']** (2019) demonstrates that systematically modeling parameters in Noise Cancellation minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-biomedical-signal-l3-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 3 (Noise Cancellation)?",
            "back": "Noise Cancellation integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-biomedical-signal-l3-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Noise Cancellation?",
            "back": "['Zuria Bauer', 'Felix Escalona', 'Edmanuel Cruz', 'Miguel Cazorla', 'Francisco Gomez-Donoso'] (2019) with 2 citations."
          },
          {
            "id": "blk-les-biomedical-signal-l3-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Noise Cancellation?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Noise Cancellation, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-biomedical-signal-l3-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 3 (Noise Cancellation)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-biomedical-signal-l4",
        "title": "Level 4 - Feature Extraction",
        "objective": "Master key principles, flashcard active recall, and MCQs for Feature Extraction.",
        "estimatedMinutes": 18,
        "difficulty": "intermediate",
        "status": "ready",
        "sourceIds": [
          "paper-biomedical-signal-5"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-biomedical-signal-l4-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 4 - Feature Extraction",
            "content": "### Level 4: Feature Extraction\n\n**Theoretical Foundation & Research Insight:**\n\nIt is very important to obtain continuous regional crop parameters efficiently in the agricultural field. However, remote sensing data can provide spatial-continuous / temporal-disperse crop information while crop growth model can provide temporal-continuous / spatial-disperse crop information. Therefore, the assimilation between crop growth model and remote sensing data is an efficient way for obtaining continuous vegetation growth information. This study aims to present a parallel method based on graphic processing unit (GPU) to improve the efficiency of the assimilation between RS data and crop growth model to estimate rice growth parameters. Remote sensing data, Landsat and HJ-1 images, were collected and the World Food Studies (WOFOST) crop growth model which has a strong flexibility was employed. To acquire continuous regional crop parameters, particle swarm optimization (PSO) data assimilation method was used to combine remote sensing images and WOFOST and this process is accompanied by a parallel method based on the Compute Unified Device Architecture (CUDA) platform of NVIDIA GPU. With these methods, we obtained daily rice growth parameters of Zhuzhou City, Hunan, China and compared the efficiency and precision of parallel method and non-parallel method. Results showed that the parallel program has a remarkable speedup (reaching 240 times) compared with the non-parallel program with a similar accuracy. This study indicated that the parallel implementation based on GPU was successful in improving the efficiency of the assimilation between RS data and the WOFOST model.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Bingyu Zhao', 'Meiling Liu', 'Jianjun Wu', 'Xiangnan Liu', 'Mengxue Liu', 'Ling Wu']** (2020) demonstrates that systematically modeling parameters in Feature Extraction minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-biomedical-signal-l4-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 4 (Feature Extraction)?",
            "back": "Feature Extraction integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-biomedical-signal-l4-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Feature Extraction?",
            "back": "['Bingyu Zhao', 'Meiling Liu', 'Jianjun Wu', 'Xiangnan Liu', 'Mengxue Liu', 'Ling Wu'] (2020) with 0 citations."
          },
          {
            "id": "blk-les-biomedical-signal-l4-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Feature Extraction?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Feature Extraction, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-biomedical-signal-l4-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 4 (Feature Extraction)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-biomedical-signal-l5",
        "title": "Level 5 - Medical Imaging",
        "objective": "Master key principles, flashcard active recall, and MCQs for Medical Imaging.",
        "estimatedMinutes": 20,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-biomedical-signal-6"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-biomedical-signal-l5-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 5 - Medical Imaging",
            "content": "### Level 5: Medical Imaging\n\n**Theoretical Foundation & Research Insight:**\n\nTo accommodate the rapid change of radio propagation environment for mobile communication scenarios, millimeter-wave beamforming requires instantaneous channel state information (CSI) to update its operational parameters in real time, resulting in heavy system overhead. As the number of antennas increases, the system overhead associated with beam management will increase dramatically. To address this overarching problem, a neural network-aided millimeter-wave beamforming algorithm is proposed in this paper. A new parameter, referred to as \u201cbeam adjustment interval\u201d, is proposed to evaluate the beamforming performance. It is defined as the maximum time duration in which the signal-to-interference-plus-noise ratio (SINR) of the user equipment can be maintained above the predefined threshold. Besides, a predictive method of beam adjustment to maximize the beam adjustment interval is developed, which considers the SINR not only at the current location but also future possible locations. Simulation results show that the proposed algorithm can significantly increase beam adjustment interval and reduce the total number of beam adjustments for the moving user equipment, thus reducing the system overhead 41.4% on average over 10 randomly generated test traces.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Pengfei Xue', 'Yuhong Huang', 'Dongzhi Zhu', 'Youping Zhao', 'Chen Sun']** (2021) demonstrates that systematically modeling parameters in Medical Imaging minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-biomedical-signal-l5-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 5 (Medical Imaging)?",
            "back": "Medical Imaging integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-biomedical-signal-l5-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Medical Imaging?",
            "back": "['Pengfei Xue', 'Yuhong Huang', 'Dongzhi Zhu', 'Youping Zhao', 'Chen Sun'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-biomedical-signal-l5-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Medical Imaging?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Medical Imaging, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-biomedical-signal-l5-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 5 (Medical Imaging)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-biomedical-signal-l6",
        "title": "Level 6 - Brain-Computer Interfaces",
        "objective": "Master key principles, flashcard active recall, and MCQs for Brain-Computer Interfaces.",
        "estimatedMinutes": 22,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-biomedical-signal-7"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-biomedical-signal-l6-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 6 - Brain-Computer Interfaces",
            "content": "### Level 6: Brain-Computer Interfaces\n\n**Theoretical Foundation & Research Insight:**\n\nThe numerical integration of multidimensional functions using some variables of the sparse grid method for the absorption problem is presented in this paper. The multivariate quadrature expressions are constructed by combining tensor of suited one dimensional formula. We develop a multidimensional adaptive quadrature algorithm for the implementation of sparse grid based on a hierarchical basis. Furthermore, we obtain a new error bound at each sparse grid point. The numerical examples are shown to demonstrate the efficiency of our algorithm for the absorption problem and confirm the theoretical estimates.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Xuesong Chen', 'Heng Mai', 'Lili Zhang']** (2019) demonstrates that systematically modeling parameters in Brain-Computer Interfaces minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-biomedical-signal-l6-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 6 (Brain-Computer Interfaces)?",
            "back": "Brain-Computer Interfaces integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-biomedical-signal-l6-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Brain-Computer Interfaces?",
            "back": "['Xuesong Chen', 'Heng Mai', 'Lili Zhang'] (2019) with 0 citations."
          },
          {
            "id": "blk-les-biomedical-signal-l6-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Brain-Computer Interfaces?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Brain-Computer Interfaces, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-biomedical-signal-l6-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 6 (Brain-Computer Interfaces)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-biomedical-signal-l7",
        "title": "Level 7 - Wearable Sensors",
        "objective": "Master key principles, flashcard active recall, and MCQs for Wearable Sensors.",
        "estimatedMinutes": 24,
        "difficulty": "intermediate",
        "status": "draft",
        "sourceIds": [
          "paper-biomedical-signal-8"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-biomedical-signal-l7-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 7 - Wearable Sensors",
            "content": "### Level 7: Wearable Sensors\n\n**Theoretical Foundation & Research Insight:**\n\nSearchable encryption is an important cryptographic technique that achieves data security and keyword retrieval over encrypted data in cloud. In 2004, Boneh et.al proposed the first searchable encryption scheme based on asymmetric cryptography. Since then, many variants of public key searchable encryption schemes were proposed. However, most previous works are vulnerable to multi-ciphertext attack, and they cannot provide trapdoor indistinguishability. Another problem is how to improve the searching efficiency. To deal with two issues, we construct a fast and secure public key authenticated searchable encryption scheme with designed server. Our scheme can resist keyword guessing attacks, chosen multi-keyword attacks and multi-trapdoor attacks. The search function in our scheme achieves the logarithmic search time in number of keywords while most existing schemes required the linear time. By comparison with previous schemes in computational complexity, our scheme is very fast in keyword search.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Lidong Han', 'Junling Guo', 'Guang Yang', 'Qi Xie', 'Chengliang Tian']** (2021) demonstrates that systematically modeling parameters in Wearable Sensors minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-biomedical-signal-l7-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 7 (Wearable Sensors)?",
            "back": "Wearable Sensors integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-biomedical-signal-l7-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Wearable Sensors?",
            "back": "['Lidong Han', 'Junling Guo', 'Guang Yang', 'Qi Xie', 'Chengliang Tian'] (2021) with 0 citations."
          },
          {
            "id": "blk-les-biomedical-signal-l7-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Wearable Sensors?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Wearable Sensors, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-biomedical-signal-l7-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 7 (Wearable Sensors)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-biomedical-signal-l8",
        "title": "Level 8 - Prosthetic Control",
        "objective": "Master key principles, flashcard active recall, and MCQs for Prosthetic Control.",
        "estimatedMinutes": 26,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-biomedical-signal-9"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-biomedical-signal-l8-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 8 - Prosthetic Control",
            "content": "### Level 8: Prosthetic Control\n\n**Theoretical Foundation & Research Insight:**\n\nAutomatic Program Repair (APR) techniques have shown the potential of reducing debugging costs while improving software quality by generating patches for fixing bugs automatically. However, they often generate many overfitting patches which pass only a specific test-suite but do not fix the bugs correctly. This paper proposes MIPI, a novel approach to reducing the number of overfitting patches generated in the APR. We leverage recent advances in deep learning to exploit the similarity between the patched method\u2019s name (which often encloses the developer\u2019s intention about the code) and the semantic meaning of the method\u2019s body (which represents the actual implemented behavior) for identifying and removing overfitting patches generated by APR tools. Experiments with a large dataset of patches for QuixBugs and Defects4J programs show the promise of our approach. Specifically, in a total of 1,191 patches generated by 23 existing APR tools, MIPI successfully filters out 254 (32%) of the total 797 overfitting patches with a precision of 90% while preserving 93% of the correct patches. MIPI is more precise and less damaging to the APR than existing heuristic patch assessment techniques, achieving a higher recall than automated testing-based techniques that do not have access to the test oracle. In addition, MIPI is highly complementary to existing automated patch assessment techniques.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Quang-Ngoc Phung', 'Misoo Kim', 'Eunseok Lee']** (2022) demonstrates that systematically modeling parameters in Prosthetic Control minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-biomedical-signal-l8-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 8 (Prosthetic Control)?",
            "back": "Prosthetic Control integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-biomedical-signal-l8-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Prosthetic Control?",
            "back": "['Quang-Ngoc Phung', 'Misoo Kim', 'Eunseok Lee'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-biomedical-signal-l8-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Prosthetic Control?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Prosthetic Control, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-biomedical-signal-l8-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 8 (Prosthetic Control)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-biomedical-signal-l9",
        "title": "Level 9 - Diagnostic ML Models",
        "objective": "Master key principles, flashcard active recall, and MCQs for Diagnostic ML Models.",
        "estimatedMinutes": 28,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-biomedical-signal-10"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-biomedical-signal-l9-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 9 - Diagnostic ML Models",
            "content": "### Level 9: Diagnostic ML Models\n\n**Theoretical Foundation & Research Insight:**\n\nLow-Density Parity-Check (LDPC) code is a type of forward error-correction code with excellent performance, and has been widely used in many modern communication standards. The second-generation satellite broadcasting standard (DVB-S2) and its extension (DVB-S2X) adopt a special Irregular Repeated Accumulate (IRA) LDPC code as inner coding scheme. However, due to the large block size, most of the architectures proposed so far use Random Access Memory (RAM) to store and update the encoding results, and the delay caused by address-controlled read and write operations and barrel shift during computation inevitably limits the upper bound of encoder throughput. In this paper, by extracting the periodicity of the parity-check matrix, we introduce a fast encoding algorithm that can efficiently process the multiplication of the information sequence and a large-dimensional sparse matrix, and propose an encoder architecture with low encoding delay and high throughput. The proposed architecture has been implemented and tested on a Xilinx Kintex-7 FPGA, and the result show that the encoder architecture can achieve the highest throughput of 47.5 Gbps at a clock frequency of 280 MHz.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Decai Liu', 'Yanfei Luo', 'Yunfeng Li', 'Zhijie Wang', 'Zhengxuan Li', 'Qianwu Zhang', 'Junjie Zhang', 'Yingchun Li']** (2022) demonstrates that systematically modeling parameters in Diagnostic ML Models minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-biomedical-signal-l9-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 9 (Diagnostic ML Models)?",
            "back": "Diagnostic ML Models integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-biomedical-signal-l9-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Diagnostic ML Models?",
            "back": "['Decai Liu', 'Yanfei Luo', 'Yunfeng Li', 'Zhijie Wang', 'Zhengxuan Li', 'Qianwu Zhang', 'Junjie Zhang', 'Yingchun Li'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-biomedical-signal-l9-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Diagnostic ML Models?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Diagnostic ML Models, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-biomedical-signal-l9-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 9 (Diagnostic ML Models)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      },
      {
        "id": "les-biomedical-signal-l10",
        "title": "Level 10 - Clinical Validation",
        "objective": "Master key principles, flashcard active recall, and MCQs for Clinical Validation.",
        "estimatedMinutes": 30,
        "difficulty": "advanced",
        "status": "draft",
        "sourceIds": [
          "paper-biomedical-signal-11"
        ],
        "hasAssessment": true,
        "blocks": [
          {
            "id": "blk-les-biomedical-signal-l10-exp",
            "type": "explanation",
            "title": "PDF Study Guide: Level 10 - Clinical Validation",
            "content": "### Level 10: Clinical Validation\n\n**Theoretical Foundation & Research Insight:**\n\nA kind of dual-parameter sensor based on magnetic-fluid-coated nonadiabatic tapered microfiber (NTF) cascaded with fiber Bragg grating (FBG) is proposed and experimentally demonstrated. Simultaneous measurement of magnetic field and temperature is realized by monitoring the variation of NTF interference spectrum and FBG characteristic dip. In the magnetic field range of 0\u201318 mT, the highest magnetic field sensitivity can reach 1.159 nm/mT. The maximum temperature sensitivity is up to \u22121.737 nm/\u00b0C in the temperature range of 25-50 \u00b0C. The proposed magnetic-fluid-coated NTF interferometer cascaded with FBG will find extensive application prospect due to its high sensitivity, easy fabrication, compactness, strong robustness, and low cost.\n\n**Key Takeaways from IEEE Research:**\nAuthor **['Yuxiu Zhang', 'Shengli Pu', 'Yongxi Li', 'Zijian Hao', 'Dihui Li', 'Shaokang Yan', 'Min Yuan', 'Chencheng Zhang']** (2022) demonstrates that systematically modeling parameters in Clinical Validation minimizes signal distortion and maximizes system reliability across operational edge cases."
          },
          {
            "id": "blk-les-biomedical-signal-l10-fc1",
            "type": "flashcard",
            "front": "What is the core paradigm introduced in Level 10 (Clinical Validation)?",
            "back": "Clinical Validation integrates structured modeling with empirically tested parameters from IEEE research."
          },
          {
            "id": "blk-les-biomedical-signal-l10-fc2",
            "type": "flashcard",
            "front": "Who authored key IEEE research on Clinical Validation?",
            "back": "['Yuxiu Zhang', 'Shengli Pu', 'Yongxi Li', 'Zijian Hao', 'Dihui Li', 'Shaokang Yan', 'Min Yuan', 'Chencheng Zhang'] (2022) with 0 citations."
          },
          {
            "id": "blk-les-biomedical-signal-l10-mcq1",
            "type": "multiple-choice",
            "question": "What is a primary objective when designing systems for Clinical Validation?",
            "options": [
              "Minimizing signal distortion and optimizing efficiency",
              "Increasing random noise and operational latency",
              "Discarding feedback mechanisms entirely",
              "Suppressing data flow and disabling verification"
            ],
            "correctIndex": 0,
            "explanation": "In Clinical Validation, minimizing distortion and maximizing efficiency are critical parameters."
          },
          {
            "id": "blk-les-biomedical-signal-l10-mcq2",
            "type": "multiple-choice",
            "question": "According to IEEE research, how is system reliability evaluated in Level 10 (Clinical Validation)?",
            "options": [
              "Through quantitative parameter metrics and field validation",
              "By guessing without empirical data",
              "By skipping testing protocols",
              "Through arbitrary non-repeatable trials"
            ],
            "correctIndex": 0,
            "explanation": "IEEE research relies on quantitative parameter metrics and rigorous field validation."
          }
        ]
      }
    ]
  }
];

export function loadPersistedState(): DarwinityState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.courses)) {
        // One-time cleanup requested for generated test courses. Starter courses have
        // stable IDs from the bundled dataset; newly created courses do not. Run this
        // regardless of course count so a single failed generation cannot survive.
        if (!localStorage.getItem(TEST_COURSE_CLEANUP_KEY)) {
          const starterCourseIds = new Set(initialCourses.map(course => course.id));
          parsed.courses = parsed.courses.filter((course: Course) => starterCourseIds.has(course.id));
          parsed.activeCourseId = starterCourseIds.has(parsed.activeCourseId) ? parsed.activeCourseId : (initialCourses[0]?.id || null);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          localStorage.setItem(TEST_COURSE_CLEANUP_KEY, "true");
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load state from localStorage, initializing fresh IEEE dataset:", e);
  }

  const defaultState: DarwinityState = {
    spaces: initialSpaces,
    pages: initialPages,
    courses: initialCourses,
    blocks: initialBlocks,
    attributes: [],
    values: [],
    activeSpaceId: initialSpaces[0]?.id || null,
    activePageId: initialPages[0]?.id || null,
    activeCourseId: initialCourses[0]?.id || null,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
  } catch (e) {
    console.error("Failed to seed initial state:", e);
  }

  return defaultState;
}

export const loadDarwinityState = loadPersistedState;

export function savePersistedState(state: DarwinityState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state to localStorage:", e);
  }
}

export const saveDarwinityState = savePersistedState;
