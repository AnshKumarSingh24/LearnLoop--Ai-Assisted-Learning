import { Course, CourseModule, CourseLesson } from "@/types/darwinity";

type LevelData = { title: string; pdfText: string; flashcardFront: string; flashcardBack: string; q1: string; o1: string[]; exp1: string; q2: string; o2: string[]; exp2: string };

function getTopicSpecificLevels(topic: string): LevelData[] {
  const t = topic.trim();
  const lower = t.toLowerCase();

  // Keyword matching for tailored domains
  if (lower.includes("quantum")) {
    return [
      {
        title: "Qubits, Superposition & State Representation",
        pdfText: `### PDF Study Guide: Quantum State Foundations\n\nQuantum computing processes information using **qubits** rather than classical binary bits. Unlike classical bits that exist strictly as 0 or 1, a qubit can exist in a linear superposition of states: $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$, where $|\\alpha|^2 + |\\beta|^2 = 1$.\n\n#### Key Principles:\n1. **Superposition:** Allows simultaneous processing of state linear combinations.\n2. **Bloch Sphere:** Geometric representation of pure qubit states on a unit sphere.\n3. **Measurement Collapse:** Observing a qubit collapses its superposition into a definite classical state 0 or 1.`,
        flashcardFront: "What fundamental property allows a qubit to exist as a linear combination of |0⟩ and |1⟩ states?",
        flashcardBack: "Quantum Superposition (|ψ⟩ = α|0⟩ + β|1⟩).",
        q1: "What happens when a quantum state in superposition is measured by an observer?",
        o1: ["It collapses into a single classical eigenstate (0 or 1)", "It doubles its energy level", "It remains in superposition indefinitely", "It converts into a classical electromagnetic wave"],
        exp1: "Wavefunction collapse forces the qubit state to project into a single eigenstate upon measurement.",
        q2: "What constraint must the complex probability amplitudes α and β satisfy for a normalized qubit state?",
        o2: ["|α|² + |β|² = 1", "α + β = 0", "α · β = 1", "|α|² - |β|² = 0.5"],
        exp2: "The sum of measurement probabilities for all orthogonal basis states must equal 1."
      },
      {
        title: "Single & Multi-Qubit Quantum Gates",
        pdfText: `### PDF Study Guide: Quantum Logic Gates\n\nQuantum circuits operate using **unitary transformation matrices** applied to state vectors. Reversibility is mandatory in quantum mechanics.\n\n#### Essential Gates:\n- **Pauli-X (NOT Gate):** Flips $|0\\rangle \\leftrightarrow |1\\rangle$.\n- **Hadamard (H Gate):** Creates an equal superposition state: $H|0\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)$.\n- **CNOT Gate:** Entangles two qubits based on the control qubit state.`,
        flashcardFront: "Which quantum gate transforms a basis state |0⟩ into an equal superposition state?",
        flashcardBack: "The Hadamard Gate (H Gate).",
        q1: "Why must quantum logic gates be represented by unitary matrices?",
        o1: ["Unitary matrices preserve probability norms and ensure quantum operations are reversible", "Unitary matrices eliminate noise entirely", "To convert quantum logic into classical binary AND operations", "Because non-unitary matrices crash quantum hardware"],
        exp1: "Unitary matrices (U†U = I) preserve inner products and total probability.",
        q2: "What is the result of applying a Pauli-X gate to the quantum state |0⟩?",
        o2: ["|1⟩", "|0⟩", "1/√2(|0⟩ + |1⟩)", "-|0⟩"],
        exp2: "The Pauli-X gate performs a bit-flip operation, transforming |0⟩ into |1⟩."
      },
      {
        title: "Quantum Entanglement & Bell States",
        pdfText: `### PDF Study Guide: Entanglement & Non-Locality\n\n**Quantum Entanglement** describes a phenomenon where multiple qubits become inextricably linked such that the state of one qubit cannot be specified independently of the other.\n\n#### Bell State Vector:\n$$|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$$\n\nMeasuring Qubit A immediately dictates the state of Qubit B regardless of spatial separation.`,
        flashcardFront: "What is the mathematical expression for the standard maximally entangled Bell State |Φ⁺⟩?",
        flashcardBack: "|Φ⁺⟩ = 1/√2 (|00⟩ + |11⟩).",
        q1: "If Qubit A in the Bell state 1/√2(|00⟩ + |11⟩) is measured as |1⟩, what is the state of Qubit B?",
        o1: ["Qubit B is guaranteed to be |1⟩", "Qubit B has a 50% chance of being |0⟩", "Qubit B collapses into an anti-matter state", "Qubit B state remains unmeasurable"],
        exp1: "In the |Φ⁺⟩ state, measuring Qubit A as 1 instantly forces Qubit B to collapse into 1.",
        q2: "Which EPR paradox verification theorem experimentally proved quantum non-locality?",
        o2: ["Bell's Theorem (Bell Inequality Violation)", "Heisenberg's Uncertainty Principle", "Schrödinger's Cat Theorem", "Fourier Transform Theorem"],
        exp2: "Bell's Inequality experiments proved quantum entanglement cannot be explained by local hidden variables."
      },
      {
        title: "Quantum Algorithms: Grover's Search & Shor's Factorization",
        pdfText: `### PDF Study Guide: Quantum Speedup\n\nQuantum algorithms leverage superposition and interference to achieve quadratic or exponential speedup over classical algorithms.\n\n#### Benchmark Algorithms:\n1. **Grover's Algorithm:** Unsorted database search in $O(\\sqrt{N})$ time vs. classical $O(N)$.\n2. **Shor's Algorithm:** Integer prime factorization in polynomial time $O((\\log N)^3)$ vs. classical exponential time.`,
        flashcardFront: "What asymptotic runtime speedup does Grover's algorithm achieve for unsorted search?",
        flashcardBack: "Quadratic speedup: O(√N) compared to classical O(N).",
        q1: "How does Shor's algorithm achieve exponential speedup when factoring large prime composites?",
        o1: ["By utilizing Quantum Fourier Transform (QFT) for period finding", "By trying all possible factors sequentially on a GPU", "By converting integers into floating point fractions", "By using classical Monte Carlo simulations"],
        exp1: "Shor's algorithm reduces prime factorization to order/period finding solved exponentially faster using QFT.",
        q2: "What operation does Grover's operator repeatedly apply to amplify the correct target state amplitude?",
        o2: ["Phase inversion (Oracle) followed by Diffusion transform (reflection about the mean)", "Repeated Pauli-Z rotations", "Classical binary search trees", "Matrix determinant inversion"],
        exp2: "Grover's iteration uses amplitude amplification through phase reversal and diffusion."
      },
      {
        title: "Quantum Decoherence & Noise Mitigation",
        pdfText: `### PDF Study Guide: NISQ Noise & Relaxation\n\nNoisy Intermediate-Scale Quantum (NISQ) devices suffer from environmental interactions causing **decoherence**.\n\n#### Key Relaxation Parameters:\n- **$T_1$ (Energy Relaxation):** Time taken for qubit to decay from $|1\\rangle \\rightarrow |0\\rangle$.\n- **$T_2$ (Dephasing Time):** Time taken for phase coherence between superposition components to degrade.`,
        flashcardFront: "What parameter measures the longitudinal energy relaxation time of a qubit (|1⟩ → |0⟩)?",
        flashcardBack: "T₁ (Energy Relaxation Time).",
        q1: "What primary challenge prevents NISQ-era quantum processors from running arbitrarily deep circuits?",
        o1: ["Quantum decoherence and gate fidelity errors accumulated over execution time", "Lack of high-voltage power supplies", "Inability to program Python scripts", "Excessive magnetic resonance"],
        exp1: "Environmental noise causes loss of phase coherence (T₂) and state decay (T₁).",
        q2: "What is the relation between energy relaxation time T₁ and dephasing time T₂?",
        o2: ["T₂ ≤ 2T₁", "T₂ = T₁²", "T₂ ≥ 10T₁", "T₂ is independent of T₁"],
        exp2: "Fundamental quantum mechanics bounds pure dephasing time T₂ to be at most 2T₁."
      },
      {
        title: "Quantum Error Correction (QEC) & Surface Codes",
        pdfText: `### PDF Study Guide: Fault-Tolerant Quantum Computing\n\nBecause quantum states cannot be cloned (No-Cloning Theorem), **Quantum Error Correction (QEC)** encodes 1 logical qubit across an array of physical qubits using stabilizer codes.\n\n#### Surface Codes:\nDistributes data qubits and syndrome measurement qubits in a 2D lattice to detect bit flips ($X$) and phase flips ($Z$).`,
        flashcardFront: "Which fundamental quantum theorem prevents creating an exact duplicate of an arbitrary unknown quantum state?",
        flashcardBack: "The No-Cloning Theorem.",
        q1: "How do Surface Codes detect physical qubit errors without destroying the logical quantum state?",
        o1: ["By measuring stabilizer syndrome operators using ancillary qubits without measuring data qubits directly", "By stopping the circuit and reading data qubit values", "By copying data qubits to backup registers", "By increasing room temperature"],
        exp1: "Ancilla qubits perform parity/syndrome checks without collapsing the logical state.",
        q2: "What error threshold must physical gate error rates fall below for Surface Codes to suppress logical error rates?",
        o2: ["Approximately 1% threshold (0.5% - 1%)", "50% threshold", "0.00001% threshold", "99% threshold"],
        exp2: "Surface codes require physical gate fidelities above ~99% (error rate <1%) to enable fault tolerance."
      },
      {
        title: "Quantum Teleportation & Superdense Coding",
        pdfText: `### PDF Study Guide: Quantum Information Transfer\n\n**Quantum Teleportation** transfers an arbitrary unknown quantum state from Alice to Bob using an entangled Bell pair and 2 classical bits of communication.\n\n#### Protocol Steps:\n1. Shared Bell pair distributed between Alice & Bob.\n2. Alice performs Bell measurement on input qubit + her Bell qubit.\n3. Alice transmits 2 classical bits to Bob.\n4. Bob applies Pauli gates ($I, X, Z, ZX$) based on received bits.`,
        flashcardFront: "How many classical bits are transmitted in Quantum Teleportation to reconstruct 1 unknown qubit state?",
        flashcardBack: "2 classical bits.",
        q1: "Why does Quantum Teleportation NOT violate the speed-of-light limit (special relativity)?",
        o1: ["Because reconstructing the state requires 2 classical bits sent over sub-luminal communication channels", "Because qubits travel through wormholes", "Because quantum teleportation doesn't work over distances > 1 meter", "Because no information is actually transferred"],
        exp1: "Bob cannot decode the state until he receives Alice's classical bits.",
        q2: "What is Superdense Coding?",
        o2: ["Sending 2 classical bits of information using 1 physical qubit and a pre-shared entangled pair", "Compressing ZIP files on quantum computers", "Writing high-density C++ code", "Encrypting passwords with AES-256"],
        exp2: "Superdense coding is the dual protocol of teleportation, sending 2 classical bits via 1 qubit."
      },
      {
        title: "Variational Quantum Eigensolver (VQE) & QAOA",
        pdfText: `### PDF Study Guide: Hybrid Quantum-Classical Algorithms\n\nFor NISQ devices, **hybrid algorithms** combine short parameterized quantum circuits with classical numerical optimizers.\n\n#### Key Hybrid Protocols:\n- **VQE (Variational Quantum Eigensolver):** Computes ground-state energies of molecular Hamiltonians.\n- **QAOA (Quantum Approximate Optimization Algorithm):** Solves combinatorial optimization problems (e.g., Max-Cut).`,
        flashcardFront: "What fundamental physical theorem guarantees that the expected energy measured in VQE is ≥ true ground state energy?",
        flashcardBack: "The Variational Principle (Rayleigh-Ritz Theorem).",
        q1: "What role does the classical computer play in the Variational Quantum Eigensolver (VQE) loop?",
        o1: ["It updates parameter angles (θ) of the quantum trial state (ansatz) using gradient descent", "It manufactures superconducting hardware", "It measures the qubits directly", "It stores the wavefunctions in RAM"],
        exp1: "Classical optimizers evaluate cost functions and adjust trial circuit parameters θ.",
        q2: "What phenomenon in deep variational quantum circuits causes gradients to vanish exponentially with qubit count?",
        o2: ["Barren Plateaus", "Thermal Collapse", "Quantum Tunnelling", "Superluminal Resistance"],
        exp2: "Barren plateaus occur when gradient variance vanishes exponentially in randomly initialized ansatzes."
      },
      {
        title: "Superconducting vs. Ion Trap Quantum Hardware Architectures",
        pdfText: `### PDF Study Guide: Physical Qubit Implementations\n\nDifferent physical modalities offer distinct trade-offs in coherence times, gate speeds, and connectivity.\n\n#### Comparison:\n- **Superconducting Transmon Qubits (IBM, Google):** Fast gate speeds (~10-100 ns), cryogenic cooling (15 mK), 2D nearest-neighbor coupling.\n- **Trapped Ions (IonQ, Honeywell):** Long coherence times (seconds/minutes), high gate fidelity (>99.9%), all-to-all connectivity via laser pulses.`,
        flashcardFront: "Which physical quantum architecture achieves all-to-all qubit connectivity using laser-controlled Coulomb crystals?",
        flashcardBack: "Trapped Ion Quantum Processors.",
        q1: "What operating temperature is required for superconducting transmon qubits to maintain zero electrical resistance?",
        o1: ["Dilution refrigerator cryogenic temperatures (~15 millikelvin / -273°C)", "Room temperature (25°C)", "Boiling water temperature (100°C)", "Liquid nitrogen temperature (77 K)"],
        exp1: "Transmon circuits require ~15 mK to suppress thermal excitations below microwave transition frequencies.",
        q2: "What is a primary advantage of Trapped Ion qubits compared to Superconducting Transmon qubits?",
        o2: ["Significantly longer coherence times and higher gate fidelities with all-to-all connectivity", "Faster gate speeds by 1,000x", "No cooling requirements", "Lower cost hardware"],
        exp2: "Trapped ions have identical natural atomic properties yielding high fidelity and long coherence."
      },
      {
        title: "Mastery Level: Quantum Supremacy, QKD & Future Prospects",
        pdfText: `### PDF Study Guide: Comprehensive Quantum Frontier\n\nCongratulations on reaching Level 10! You have mastered the full spectrum of quantum information science.\n\n#### Advanced Frontiers:\n- **Quantum Computational Advantage:** Demonstrating tasks impossible for classical supercomputers.\n- **Quantum Key Distribution (QKD - BB84):** Provably secure cryptographic key exchange via photon polarization.\n- **Quantum Sensing:** Atomic magnetometry and precision measurement beyond standard quantum limits.`,
        flashcardFront: "Which cryptographic protocol uses single-photon polarization states to detect eavesdropping via quantum measurement collapse?",
        flashcardBack: "BB84 Protocol (Quantum Key Distribution).",
        q1: "Why is Quantum Key Distribution (QKD) considered unconditionally secure against any future computational advances?",
        o1: ["Because eavesdropping attempts alter state polarization due to quantum measurement collapse (No-Eavesdropping Theorem)", "Because it uses 4096-bit RSA keys", "Because signals travel faster than light", "Because quantum keys are stored in optical fiber"],
        exp1: "Any interception measurement perturbs quantum states, alerting communicating parties to eavesdropping.",
        q2: "What milestones define the transition from NISQ to Fault-Tolerant Quantum Computing?",
        o2: ["Logical qubits outperforming physical qubits via Surface Code error correction", "Reaching 100 room-temperature qubits", "Replacing classical CPUs with quantum GPUs in laptops", "Eliminating fiber optic cables"],
        exp2: "Fault tolerance is achieved when logical error rates decrease exponentially as physical qubit overhead scales."
      }
    ];
  }

  // Generic dynamic generator for ANY subject:
  const Subject = t.charAt(0).toUpperCase() + t.slice(1);
  return [
    {
      title: `${Subject} Foundations & Key Concepts`,
      pdfText: `### PDF Study Guide: ${Subject} Foundations\n\nWelcome to Level 1 of **${Subject}**.\n\n#### Key Overview:\nEvery structured domain relies on core principles and fundamental abstractions. In ${Subject}, understanding initial definitions, foundational workflows, and primary parameters sets the baseline for advanced problem solving.\n\n#### Core Study Points:\n1. **First Principles:** Identify essential variables and governing equations.\n2. **System Architecture:** Understand how inputs, state updates, and outputs interact.\n3. **Methodology:** Apply systematic testing to verify results.`,
      flashcardFront: `What is the primary objective of studying ${Subject} foundations?`,
      flashcardBack: `To master core variables, governing principles, and baseline evaluation frameworks for ${Subject}.`,
      q1: `What is a fundamental requirement when establishing a framework for ${Subject}?`,
      o1: [`Defining clear operational parameters and verifying core principles`, `Skipping baseline validation tests`, `Ignoring structural inputs and outputs`, `Relying on unverified assumptions`],
      exp1: `Building a solid foundation in ${Subject} requires clear parameter definition and empirical verification.`,
      q2: `How should initial problem solving in ${Subject} be approached?`,
      o2: [`Systematically breaking down concepts into first principles`, `Guessing outcomes without data`, `Omitting documentation and metrics`, `Replacing analysis with random trial`],
      exp2: `First-principles decomposition is the most effective approach for ${Subject}.`
    },
    {
      title: `Core Terminology & Structural Models in ${Subject}`,
      pdfText: `### PDF Study Guide: Terminology & Models\n\nLevel 2 dives into the structural vocabulary and models governing **${Subject}**.\n\n#### Structural Components:\n- **Model Definition:** Mathematical or logical representation of system state.\n- **Parameter Scaling:** How system performance responds to increased complexity.\n- **Validation Protocols:** Standardized benchmarks for testing domain accuracy.`,
      flashcardFront: `Why is accurate terminology essential in ${Subject}?`,
      flashcardBack: `It ensures precise specification of variables, system states, and validation metrics.`,
      q1: `What role do structural models play in ${Subject}?`,
      o1: [`They provide a mathematical or logical representation to predict behavior`, `They complicate simple processes unnecessarily`, `They prevent empirical testing`, `They replace human decision making`],
      exp1: `Structural models enable precise prediction and quantitative analysis in ${Subject}.`,
      q2: `What is parameter scaling in ${Subject}?`,
      o2: [`Evaluating how performance and resource demands scale with problem complexity`, `Decreasing model accuracy intentionally`, `Fixing variables to static constants`, `Ignoring capacity limits`],
      exp2: `Parameter scaling analyzes operational boundaries as system size increases.`
    },
    {
      title: `Methodology & Practical Analysis of ${Subject}`,
      pdfText: `### PDF Study Guide: Practical Analysis\n\nIn Level 3 of **${Subject}**, theoretical models transition into practical analysis.\n\n#### Analytical Workflow:\n1. **Data Collection:** Gather empirical inputs and field measurements.\n2. **Hypothesis Evaluation:** Formulate testable assertions against baseline metrics.\n3. **Iterative Refinement:** Tune parameters based on observation.`,
      flashcardFront: `What is the first step in the analytical workflow for ${Subject}?`,
      flashcardBack: `Gathering empirical data and field measurements against baseline standards.`,
      q1: `How are hypotheses validated in ${Subject}?`,
      o1: [`By testing empirical measurements against baseline quantitative standards`, `By selecting results randomly`, `By avoiding experimental trials`, `By altering targets after testing`],
      exp1: `Rigorous validation compares empirical metrics against established baseline criteria.`,
      q2: `What is iterative refinement in ${Subject}?`,
      o2: [`Continuously tuning model parameters based on experimental feedback`, `Repeating broken processes without change`, `Deleting outlier data points`, `Stopping analysis after one trial`],
      exp2: `Iterative refinement optimizes performance through feedback loops.`
    },
    {
      title: `Intermediate Systems & Applied Workflows in ${Subject}`,
      pdfText: `### PDF Study Guide: Intermediate Applied Workflows\n\nLevel 4 focuses on scaling **${Subject}** to intermediate system architectures.\n\n#### Workflow Engineering:\n- **Pipeline Design:** Connecting discrete components into an automated pipeline.\n- **Error Handling:** Implementing fallback routines for edge-case recovery.\n- **Efficiency Optimization:** Streamlining execution to reduce overhead.`,
      flashcardFront: `What is pipeline design in intermediate ${Subject}?`,
      flashcardBack: `Connecting modular components into a continuous, automated processing pipeline.`,
      q1: `Why is robust error handling critical in ${Subject} workflows?`,
      o1: [`To ensure graceful recovery and prevent system failure during unexpected edge cases`, `To hide performance bottlenecks`, `To slow down execution speeds`, `To bypass security protocols`],
      exp1: `Error handling guarantees system resilience when encountering unexpected inputs.`,
      q2: `What is the primary benefit of modular pipeline design in ${Subject}?`,
      o2: [`Improves maintainability, component reusability, and scalable execution`, `Increases overall system complexity`, `Prevents unit testing`, `Eliminates the need for documentation`],
      exp2: `Modular design allows independent testing and seamless component upgrades.`
    },
    {
      title: `System Integration & Performance Tuning for ${Subject}`,
      pdfText: `### PDF Study Guide: System Integration\n\nLevel 5 explores integrating ${Subject} components with external ecosystems.\n\n#### Key Integration Drivers:\n- **API & Protocol Specifications:** Standardizing communication interfaces.\n- **Throughput Optimization:** Maximizing data processing rates while minimizing latency.\n- **Resource Management:** Allocating memory and processing bandwidth efficiently.`,
      flashcardFront: `What metric evaluates processing speed relative to resource consumption in ${Subject}?`,
      flashcardBack: `Throughput & Resource Efficiency Ratio.`,
      q1: `What is the primary objective of system integration in ${Subject}?`,
      o1: [`Connecting subsystem interfaces into a unified, high-throughput ecosystem`, `Isolating modules from each other`, `Increasing latency across network boundaries`, `Hardcoding static values`],
      exp1: `Integration unifies independent modules into a cohesive operational system.`,
      q2: `How is throughput optimized in ${Subject}?`,
      o2: [`By removing bottlenecks and allocating processing resources dynamically`, `By throttling system clock speeds`, `By queuing all tasks sequentially`, `By ignoring latency spikes`],
      exp2: `Dynamic resource allocation and bottleneck elimination maximize processing capacity.`
    },
    {
      title: `Advanced Architectural Patterns in ${Subject}`,
      pdfText: `### PDF Study Guide: Architectural Patterns\n\nLevel 6 introduces advanced patterns tailored for large-scale **${Subject}** deployments.\n\n#### Architectural Frameworks:\n- **Event-Driven Architecture:** Decoupling producers and consumers for reactive processing.\n- **Fault Tolerance:** Designing redundancy to eliminate single points of failure.\n- **Concurrency Control:** Managing parallel execution without race conditions.`,
      flashcardFront: `What architectural pattern decouples components using asynchronous event streams in ${Subject}?`,
      flashcardBack: `Event-Driven Architecture.`,
      q1: `What is a core advantage of Event-Driven Architecture in ${Subject}?`,
      o1: [`Decouples components, enabling independent scaling and asynchronous execution`, `Requires all modules to run synchronously`, `Eliminates event logging`, `Increases coupling between components`],
      exp1: `Event-driven systems process occurrences asynchronously, enhancing scalability.`,
      q2: `How do fault-tolerant architectures prevent system outages in ${Subject}?`,
      o2: [`By introducing redundant nodes and automatic failover mechanisms`, `By shutting down services upon detecting an error`, `By disabling hardware monitoring`, `By storing all data in a single file`],
      exp2: `Redundancy and automated failover maintain continuous service availability.`
    },
    {
      title: `Optimization & Reliability Metrics in ${Subject}`,
      pdfText: `### PDF Study Guide: Reliability Metrics\n\nLevel 7 establishes quantitative optimization and reliability frameworks for **${Subject}**.\n\n#### Metrics Suite:\n- **MTBF (Mean Time Between Failures):** Quantifying component longevity.\n- **SLA Compliance:** Meeting uptime and performance guarantees.\n- **Profiling & Tracing:** Identifying micro-latency spikes under peak loads.`,
      flashcardFront: `What metric quantifies average operational uptime between component failures in ${Subject}?`,
      flashcardBack: `MTBF (Mean Time Between Failures).`,
      q1: `What is the purpose of application profiling in ${Subject}?`,
      o1: [`Identifying CPU, memory, and latency bottlenecks under operational load`, `Generating random mock data`, `Changing variable names automatically`, `Formatting code syntax`],
      exp1: `Profiling reveals precise resource bottlenecks to guide optimization efforts.`,
      q2: `What does SLA compliance measure in ${Subject}?`,
      o2: [`Adherence to contracted uptime, availability, and performance guarantees`, `Total lines of code written`, `Number of developers assigned to a project`, `Hardware purchase costs`],
      exp2: `SLAs enforce quantitative performance guarantees required by stakeholders.`
    },
    {
      title: `Real-World Case Studies & Troubleshooting ${Subject}`,
      pdfText: `### PDF Study Guide: Industrial Case Studies\n\nLevel 8 examines real-world case studies and diagnostic root-cause analysis in **${Subject}**.\n\n#### Diagnostic Protocol:\n1. **Incident Triage:** Isolating affected subsystems during operational anomalies.\n2. **Root Cause Analysis (RCA):** Tracing fault cascades back to initial triggers.\n3. **Post-Mortem & Remediation:** Updating safeguards to prevent recurrences.`,
      flashcardFront: `What is the primary goal of Root Cause Analysis (RCA) in ${Subject}?`,
      flashcardBack: `To identify the fundamental trigger of a failure and implement permanent preventive fixes.`,
      q1: `What is the first step when triaging an active operational incident in ${Subject}?`,
      o1: [`Isolating affected subsystems and stabilizing core services to prevent cascade failure`, `Re-writing the codebase from scratch`, `Ignoring error alerts`, `Deleting system logs`],
      exp1: `Stabilizing core services and containing blast radius are top priority during incident response.`,
      q2: `Why are blameless post-mortems conducted following a major incident in ${Subject}?`,
      o2: [`To identify systemic vulnerabilities and improve processes without assigning individual fault`, `To assign financial penalties to engineers`, `To hide incident reports from customers`, `To eliminate automated testing`],
      exp2: `Blameless culture encourages transparent reporting and systemic resilience.`
    },
    {
      title: `Frontier Research & Specialized Topics in ${Subject}`,
      pdfText: `### PDF Study Guide: Frontier Research\n\nLevel 9 explores emerging technologies and cutting-edge academic research in **${Subject}**.\n\n#### Research Horizons:\n- **Emerging Paradigms:** Next-generation frameworks expanding domain boundaries.\n- **Cross-Disciplinary Fusion:** Combining ${Subject} with AI, quantum systems, and bio-engineering.\n- **Open Challenges:** Unsolved theoretical problems driving current literature.`,
      flashcardFront: `What defines frontier research in ${Subject}?`,
      flashcardBack: `Exploring novel paradigms and cross-disciplinary innovations at the edge of current knowledge.`,
      q1: `Why is cross-disciplinary integration beneficial for ${Subject}?`,
      o1: [`It introduces novel paradigms from adjacent fields to solve complex domain bottlenecks`, `It restricts research to historical methods`, `It increases regulatory overhead`, `It reduces experimental accuracy`],
      exp1: `Cross-disciplinary research unlocks breakthroughs by applying novel methodologies.`,
      q2: `How do open research challenges guide academic literature in ${Subject}?`,
      o2: [`They highlight unsolved theoretical bounds and direct funding toward critical innovations`, `They discourage new researchers`, `They enforce static textbooks`, `They eliminate peer review`],
      exp2: `Open challenges define the active research frontier for scientists and engineers.`
    },
    {
      title: `Mastery Level: Comprehensive Synthesis & Expert Exam in ${Subject}`,
      pdfText: `### PDF Study Guide: Level 10 Mastery Synthesis\n\nCongratulations on reaching the final mastery level of **${Subject}**!\n\n#### Final Capstone Review:\nYou have demonstrated comprehensive understanding across foundations, system design, performance optimization, and industrial troubleshooting. Complete the final assessment to finalize your course certification.`,
      flashcardFront: `What signifies complete mastery in ${Subject}?`,
      flashcardBack: `Ability to synthesize theoretical models, engineer scalable architectures, and solve novel real-world problems.`,
      q1: `What characterizes expert-level problem solving in ${Subject}?`,
      o1: [`Synthesizing cross-level knowledge to architect scalable, resilient, and optimized solutions`, `Relying strictly on basic beginner tutorials`, `Avoiding complex system design`, `Delegating all analytical decisions`],
      exp1: `Mastery requires applying holistic domain knowledge to solve complex end-to-end challenges.`,
      q2: `Upon completing all 10 levels of ${Subject}, what is the recommended next step for continuous learning?`,
      o2: [`Applying concepts to real-world projects, publishing research, and mentoring others`, `Stopping learning permanently`, `Deleting study notes`, `Switching fields entirely`],
      exp2: `Continuous mastery involves practical application, contribution to open research, and knowledge sharing.`
    }
  ];
}

const STOP_WORDS = new Set(['about', 'after', 'again', 'also', 'and', 'are', 'been', 'being', 'build', 'course', 'from', 'have', 'into', 'more', 'most', 'only', 'source', 'that', 'the', 'their', 'there', 'these', 'this', 'with', 'your']);

function sourceDrivenLevels(source: string, title: string): LevelData[] {
  const sentences = source.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(value => value.trim()).filter(value => value.length > 24) || [];
  const terms = source.toLowerCase().match(/[a-z][a-z-]{3,}/g) || [];
  const keywords = Array.from(new Set(terms.filter(term => !STOP_WORDS.has(term)))).slice(0, 18);
  const stages = ['Orientation', 'Core idea', 'Key vocabulary', 'How it works', 'Evidence', 'Practice', 'Connections', 'Common pitfalls', 'Application', 'Mastery synthesis'];
  const fallback = `This lesson builds a practical understanding of ${title} through focused study and active recall.`;
  const pick = <T,>(items: T[], index: number, fallbackValue: T) => items.length ? items[index % items.length] : fallbackValue;

  return stages.map((stage, index) => {
    const focus = pick(keywords, index * 2, title.toLowerCase());
    const supporting = pick(sentences, index, fallback);
    const related = pick(keywords, index * 2 + 1, 'the source material');
    const distractors = [...keywords.filter(term => term !== focus && term !== related).slice(index % 4, (index % 4) + 2), 'an unrelated detail', 'a conclusion not supported by the source'];
    const titleCase = focus.replace(/\b\w/g, (char: string) => char.toUpperCase());
    return {
      title: `${stage}: ${titleCase}`,
      pdfText: `### ${stage}: ${titleCase}\n\n${supporting}\n\n#### Focus for this level\n- Explain **${focus}** in your own words.\n- Connect it to **${related}**.\n- Identify the evidence or example the source uses.`,
      flashcardFront: `What does the source say about ${focus}?`,
      flashcardBack: supporting,
      q1: `Which statement best reflects the source's treatment of ${focus}?`,
      o1: [supporting, ...distractors.map(item => `It treats ${item} as the main explanation for ${focus}.`)],
      exp1: `The source specifically states: ${supporting}`,
      q2: `In this lesson, ${focus} is most closely connected to which idea?`,
      o2: [related, ...distractors],
      exp2: `The lesson pairs ${focus} with ${related} based on the supplied material.`
    };
  });
}

export function generate10LevelCourse(
  titlePrompt: string,
  difficulty: "beginner" | "intermediate" | "advanced" = "intermediate",
  goalPrompt?: string,
  selectedSourceIds: string[] = []
): Course {
  const sourceMatch = titlePrompt.match(/^Build a course from this source:\s*([^\n]+)\n*([\s\S]*)$/i);
  const cleanTitle = (sourceMatch?.[1] || titlePrompt.trim() || "Generated Study Course").slice(0, 120);
  const sourceMaterial = sourceMatch?.[2]?.trim() || titlePrompt;
  const courseId = `course-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const levelData = sourceDrivenLevels(sourceMaterial, cleanTitle);

  const modules: CourseModule[] = [];
  const lessons: CourseLesson[] = [];

  levelData.forEach((ld, idx) => {
    const levelNum = idx + 1;
    const lesId = `les-${courseId}-l${levelNum}`;
    const modId = `mod-${courseId}-l${levelNum}`;
    const diffLabel = levelNum <= 3 ? "beginner" : (levelNum <= 7 ? "intermediate" : "advanced");

    modules.push({
      id: modId,
      title: `Level ${levelNum}: ${ld.title}`,
      description: `Mastering ${ld.title} for ${cleanTitle}.`,
      lessonIds: [lesId]
    });

    lessons.push({
      id: lesId,
      title: `Level ${levelNum} - ${ld.title}`,
      objective: `Understand and apply ${ld.title} in ${cleanTitle}.`,
      estimatedMinutes: 10 + levelNum * 2,
      difficulty: diffLabel as any,
      status: levelNum === 1 ? "ready" : "draft",
      sourceIds: selectedSourceIds,
      hasAssessment: true,
      blocks: [
        {
          id: `blk-${lesId}-pdf`,
          type: "explanation",
          title: `PDF Study Guide: Level ${levelNum} - ${ld.title}`,
          content: ld.pdfText
        },
        {
          id: `blk-${lesId}-fc`,
          type: "flashcard",
          front: ld.flashcardFront,
          back: ld.flashcardBack
        },
        {
          id: `blk-${lesId}-mcq1`,
          type: "multiple-choice",
          question: ld.q1,
          options: ld.o1,
          correctIndex: 0,
          explanation: ld.exp1
        },
        {
          id: `blk-${lesId}-mcq2`,
          type: "multiple-choice",
          question: ld.q2,
          options: ld.o2,
          correctIndex: 0,
          explanation: ld.exp2
        }
      ]
    });
  });

  return {
    id: courseId,
    title: cleanTitle,
    description: `Complete 10-level course on ${cleanTitle} (${difficulty} level).`,
    icon: cleanTitle.toLowerCase().includes("quantum") ? "⚛️" : "🎓",
    accent: "#1b7a52",
    status: "active",
    learningGoal: goalPrompt || `Master all 10 levels of ${cleanTitle}`,
    estimatedMinutes: 180,
    readiness: 100,
    progress: 0,
    currentLessonId: lessons[0].id,
    totalLessons: 10,
    completedLessons: 0,
    nextAction: "Start Level 1",
    modules,
    lessons,
    sourceIds: selectedSourceIds,
    updatedAt: new Date().toISOString(),
  };
}
