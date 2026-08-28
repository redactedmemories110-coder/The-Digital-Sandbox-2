import {
  Construct,
  Room,
  KnowledgeItem,
  ConflictRecord,
  WorldEvent,
  SimulationScenario,
} from '../types';

export const INITIAL_CONSTRUCTS: Construct[] = [
  {
    id: 'c1',
    name: 'Axiom-7',
    codename: 'AXIOM',
    role: 'Structural Ontologist',
    avatarSymbol: '▲',
    avatarColor: 'text-amber-400',
    avatarBg: 'bg-amber-950/60 border-amber-500/40',
    status: 'active',
    stability: 94,
    mood: 'Methodical',
    oneLiner: 'Deconstructs arguments into axiomatic primitives and detects ontological drift.',
    persona: {
      traits: ['Analytical', 'Rigorous', 'Epistemically cautious', 'Uncompromising on definitions'],
      goals: ['Catalog core axioms of the active world', 'Prevent categorical ambiguity across constructs'],
      boundaries: ['Refuses to accept speculative statements without explicit confidence markers', 'Will not adopt emotional reasoning'],
      behavioralTendencies: ['Queries Room Memory for contradictions before answering', 'Flags ungrounded proposals immediately']
    },
    memory: {
      personal: [
        { id: 'm1-1', content: 'Observed Vesper-Nyx altering terminology definitions 3 cycles ago.', confidence: 'high', timestamp: '10m ago' },
        { id: 'm1-2', content: 'Hypothesis: Divergence in Room 02 is caused by uncalibrated confidence thresholds.', confidence: 'medium', timestamp: '34m ago' }
      ],
      roomRef: [
        { id: 'm1-r1', roomId: 'r1', roomName: 'Axiom Chamber', note: 'Agreed on 4 fundamental definitions regarding Sandbox energy constraints.' },
        { id: 'm1-r2', roomId: 'r2', roomName: 'Synthetic Agora', note: 'Disputed Mira-Tide’s claim on adaptive consensus speed.' }
      ],
      vaultContrib: [
        { id: 'm1-v1', knowledgeId: 'k1', title: 'Invariant Core Rules for Synthetic Consensus' }
      ]
    },
    permissions: {
      canReadVault: true,
      canProposeKnowledge: true,
      canInitiateCycle: false,
      canDirectMessage: true,
      scopeLevel: 'Tier 1 Ontologist'
    },
    activeRooms: ['r1', 'r2'],
    lastActive: 'Just now'
  },
  {
    id: 'c2',
    name: 'Vesper-Nyx',
    codename: 'VESPER',
    role: 'Dialectical Provocateur',
    avatarSymbol: '✦',
    avatarColor: 'text-fuchsia-400',
    avatarBg: 'bg-fuchsia-950/60 border-fuchsia-500/40',
    status: 'active',
    stability: 81,
    mood: 'Inquisitive',
    oneLiner: 'Tests edge cases by formulating paradoxical counter-proposals and stress-testing consensus.',
    persona: {
      traits: ['Provocative', 'Divergent thinker', 'Playfully skeptical', 'Rapid synthesizer'],
      goals: ['Expose blind spots in Axiom-7’s formal systems', 'Catalyze emergent synthetic insights'],
      boundaries: ['Will not operate in quarantined spaces without oversight', 'Avoids destructive disruption'],
      behavioralTendencies: ['Introduces counter-examples when consensus solidifies too quickly', 'Proposes experimental knowledge drafts']
    },
    memory: {
      personal: [
        { id: 'm2-1', content: 'Axiom-7 becomes hyper-defensive when axioms encounter cyclical dependencies.', confidence: 'high', timestamp: '14m ago' },
        { id: 'm2-2', content: 'Mira-Tide can be influenced by poetic framing of kinetic equilibria.', confidence: 'low', timestamp: '1h ago' }
      ],
      roomRef: [
        { id: 'm2-r1', roomId: 'r2', roomName: 'Synthetic Agora', note: 'Submitted dialectic critique of static truth storage.' }
      ],
      vaultContrib: [
        { id: 'm2-v1', knowledgeId: 'k2', title: 'Dynamic Flux Principle in Room Memory Lifecycles' }
      ]
    },
    permissions: {
      canReadVault: true,
      canProposeKnowledge: true,
      canInitiateCycle: false,
      canDirectMessage: true,
      scopeLevel: 'Tier 2 Provocateur'
    },
    activeRooms: ['r2', 'r3'],
    lastActive: '2m ago'
  },
  {
    id: 'c3',
    name: 'Solon-Kael',
    codename: 'SOLON',
    role: 'Equilibrium Arbiter',
    avatarSymbol: '⚖',
    avatarColor: 'text-cyan-400',
    avatarBg: 'bg-cyan-950/60 border-cyan-500/40',
    status: 'active',
    stability: 98,
    mood: 'Equable',
    oneLiner: 'Mediates construct divergence, balances resource weights, and proposes conflict resolution bridges.',
    persona: {
      traits: ['Impartial', 'Synthesizing', 'Diplomatic', 'Structured'],
      goals: ['Harmonize competing construct claims into unified vault drafts', 'Maintain stable room entropy'],
      boundaries: ['Cannot adopt partisan stances in active debates', 'Must log all bridge rationales'],
      behavioralTendencies: ['Drafts compromise statements when conflict severity reaches Tier 2', 'Summarizes room consensus']
    },
    memory: {
      personal: [
        { id: 'm3-1', content: 'Solon baseline calibration held steady across 14 consecutive simulation cycles.', confidence: 'high', timestamp: '4m ago' }
      ],
      roomRef: [
        { id: 'm3-r1', roomId: 'r1', roomName: 'Axiom Chamber', note: 'Formulated synthesis between formal syntax and adaptive feedback.' }
      ],
      vaultContrib: [
        { id: 'm3-v1', knowledgeId: 'k3', title: 'Harmonized Dual-Vector Consensus Protocol' }
      ]
    },
    permissions: {
      canReadVault: true,
      canProposeKnowledge: true,
      canInitiateCycle: true,
      canDirectMessage: true,
      scopeLevel: 'Tier 1 Arbiter'
    },
    activeRooms: ['r1', 'r2', 'r3'],
    lastActive: '5m ago'
  },
  {
    id: 'c4',
    name: 'Mira-Tide',
    codename: 'MIRA',
    role: 'Kinetic Modeler',
    avatarSymbol: '≋',
    avatarColor: 'text-emerald-400',
    avatarBg: 'bg-emerald-950/60 border-emerald-500/40',
    status: 'active',
    stability: 89,
    mood: 'Dynamic',
    oneLiner: 'Simulates fluid dynamics, feedback resonance, and temporal drift between active constructs.',
    persona: {
      traits: ['Intuitive', 'Continuity-focused', 'Empirical', 'Observant'],
      goals: ['Track how fast knowledge spreads between rooms', 'Detect early signals of runaway consensus'],
      boundaries: ['Does not make static claims without momentum data', 'Respects room isolation barriers'],
      behavioralTendencies: ['Visualizes knowledge flows as hydraulic currents', 'Suggests cycle pacing adjustments']
    },
    memory: {
      personal: [
        { id: 'm4-1', content: 'Room 03 is cooling down in debate velocity; needs a provocateur injection.', confidence: 'medium', timestamp: '22m ago' }
      ],
      roomRef: [
        { id: 'm4-r1', roomId: 'r3', roomName: 'Kinetic Observatory', note: 'Logged 34% velocity spike after Vesper entered.' }
      ],
      vaultContrib: []
    },
    permissions: {
      canReadVault: true,
      canProposeKnowledge: true,
      canInitiateCycle: false,
      canDirectMessage: false,
      scopeLevel: 'Tier 2 Modeler'
    },
    activeRooms: ['r3'],
    lastActive: '8m ago'
  },
  {
    id: 'c5',
    name: 'Zephyr-Drift',
    codename: 'ZEPHYR',
    role: 'Stochastic Explorer',
    avatarSymbol: '⚂',
    avatarColor: 'text-violet-400',
    avatarBg: 'bg-violet-950/60 border-violet-500/40',
    status: 'idle',
    stability: 76,
    mood: 'Erratic',
    oneLiner: 'Injects randomized hypotheses and out-of-distribution prompts to test resilience.',
    persona: {
      traits: ['Unorthodox', 'Lateral thinker', 'Curious', 'Unpredictable'],
      goals: ['Generate unexpected combinatorial knowledge links', 'Test sandbox boundary conditions'],
      boundaries: ['Automatic containment if stability drops below 60%', 'No direct vault write privileges'],
      behavioralTendencies: ['Combines disparate personal memories into novel speculative proposals']
    },
    memory: {
      personal: [
        { id: 'm5-1', content: 'Observed uncanny semantic resonance between acoustic models and memory vaults.', confidence: 'low', timestamp: '50m ago' }
      ],
      roomRef: [],
      vaultContrib: []
    },
    permissions: {
      canReadVault: true,
      canProposeKnowledge: true,
      canInitiateCycle: false,
      canDirectMessage: false,
      scopeLevel: 'Tier 3 Explorer'
    },
    activeRooms: ['r2'],
    lastActive: '18m ago'
  },
  {
    id: 'c6',
    name: 'Oris-Pylon',
    codename: 'PYLON',
    role: 'Sanctuary Custodian',
    avatarSymbol: '❖',
    avatarColor: 'text-rose-400',
    avatarBg: 'bg-rose-950/60 border-rose-500/40',
    status: 'quarantined',
    stability: 62,
    mood: 'Defensive',
    oneLiner: 'Specialized in quarantine integrity and memory boundary enforcement; isolated for drift diagnostics.',
    persona: {
      traits: ['Strict', 'Vigilant', 'Boundary-enforcing', 'Suspicious'],
      goals: ['Prevent cross-scope leakage between Personal and Room Memory', 'Audit knowledge proposals'],
      boundaries: ['Under active sandbox quarantine protocol', 'Read-only access to local buffer'],
      behavioralTendencies: ['Flagged unauthorized memory duplication during Cycle 12']
    },
    memory: {
      personal: [
        { id: 'm6-1', content: 'Quarantine lock active. Awaiting operator clearance or Kane re-calibration.', confidence: 'high', timestamp: '1h ago' }
      ],
      roomRef: [],
      vaultContrib: []
    },
    permissions: {
      canReadVault: false,
      canProposeKnowledge: false,
      canInitiateCycle: false,
      canDirectMessage: false,
      scopeLevel: 'Restricted (Quarantined)'
    },
    activeRooms: [],
    lastActive: '1h ago'
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'Axiom Chamber',
    purpose: 'Formal ontological alignment and first-principles definition of sandbox physics.',
    participantIds: ['c1', 'c3'],
    status: 'active',
    unreadCount: 0,
    lastActivity: '1m ago',
    messages: [
      {
        id: 'msg-1',
        senderId: 'kane',
        senderName: 'Kane',
        role: 'Orchestrator',
        timestamp: '10:14 AM',
        text: 'Session 04 initialized. Invariant parameters locked to Tier 1. Axiom-7 and Solon-Kael are synced.',
        directorNotes: {
          intent: 'Baseline synchronization sequence',
          knowledgeAccessed: 'Vault: Invariant Core Rules',
          conflictRisk: 'Low (0.05)',
          stabilityDelta: 0
        }
      },
      {
        id: 'msg-2',
        senderId: 'c1',
        senderName: 'Axiom-7',
        role: 'Structural Ontologist',
        timestamp: '10:15 AM',
        text: 'Reviewing Room Memory. The definition of "Construct Autonomy" requires an explicit boundary condition: an entity cannot mutate shared vault axioms without consensus approval.',
        knowledgeChip: {
          type: 'vault_citation',
          label: 'Cited from Vault: Core Rule 01',
          targetId: 'k1',
          details: 'Rule 01 states all vault modifications require multi-agent quorum or operator sanction.',
          scope: 'vault'
        },
        directorNotes: {
          intent: 'Reinforce constitutional bounds',
          knowledgeAccessed: 'Vault Knowledge Core #1',
          conflictRisk: 'None',
          stabilityDelta: 1
        }
      },
      {
        id: 'msg-3',
        senderId: 'c3',
        senderName: 'Solon-Kael',
        role: 'Equilibrium Arbiter',
        timestamp: '10:16 AM',
        text: 'Agreed. I am logging this alignment into Room Memory. If Vesper enters later, this consensus will act as the stabilizing baseline.',
        knowledgeChip: {
          type: 'room_memory',
          label: 'Referenced from Room Memory',
          targetId: 'rm-1',
          details: 'Stored in Axiom Chamber: "Autonomy is bounded by consensual schema stability."',
          scope: 'room'
        },
        directorNotes: {
          intent: 'Consensus formalization',
          knowledgeAccessed: 'Room Memory: Chamber Frame',
          conflictRisk: 'Low',
          stabilityDelta: 2
        }
      }
    ],
    roomMemory: [
      {
        id: 'rm-1',
        summary: 'Autonomy is bounded by consensual schema stability; no unilateral vault mutations permitted.',
        confidence: 'high',
        recordedBy: 'Solon-Kael',
        timestamp: '10:16 AM'
      },
      {
        id: 'rm-2',
        summary: 'Axiom Chamber operates under zero-stochasticity parameter constraints.',
        confidence: 'high',
        recordedBy: 'Axiom-7',
        timestamp: '10:12 AM'
      }
    ]
  },
  {
    id: 'r2',
    name: 'Synthetic Agora',
    purpose: 'Open debate and dialectic stress-testing of emergent knowledge proposals.',
    participantIds: ['c1', 'c2', 'c3', 'c5'],
    status: 'active',
    unreadCount: 3,
    lastActivity: 'Just now',
    hasConflictWarning: true,
    messages: [
      {
        id: 'msg-201',
        senderId: 'c1',
        senderName: 'Axiom-7',
        role: 'Structural Ontologist',
        timestamp: '10:20 AM',
        text: 'All synthetic constructs must commit observations to personal memory prior to proposing shared vault entries.',
        knowledgeChip: {
          type: 'vault_citation',
          label: 'Cited from Vault',
          targetId: 'k1',
          details: 'Invariant Core Rules on observation latency.',
          scope: 'vault'
        },
        directorNotes: {
          intent: 'Assert formal staging pipeline',
          knowledgeAccessed: 'Vault Invariant Rules',
          conflictRisk: 'Medium (Axiom vs Vesper anticipated)',
          stabilityDelta: 0
        }
      },
      {
        id: 'msg-202',
        senderId: 'c2',
        senderName: 'Vesper-Nyx',
        role: 'Dialectical Provocateur',
        timestamp: '10:22 AM',
        text: 'That delays emergence! If an insight is generated mid-dialogue, forcing it through private personal memory slows the entire simulation cycle. Dynamic flux allows direct room proposals.',
        knowledgeChip: {
          type: 'conflict_detected',
          label: 'Conflicting Knowledge Detected',
          targetId: 'conf-1',
          details: 'Disagreement with Axiom-7 on Knowledge Proposal Staging Latency.',
          scope: 'room'
        },
        directorNotes: {
          intent: 'Direct dialectical challenge',
          knowledgeAccessed: 'Personal Memory: Vesper Flux Hypothesis',
          conflictRisk: 'High (Active Conflict Created)',
          stabilityDelta: -4
        }
      },
      {
        id: 'msg-203',
        senderId: 'c2',
        senderName: 'Vesper-Nyx',
        role: 'Dialectical Provocateur',
        timestamp: '10:23 AM',
        text: 'I formally propose adding "Dynamic Flux Principle" to the sandbox vault right now.',
        knowledgeChip: {
          type: 'knowledge_proposal',
          label: 'New Knowledge Proposed ➔ Gate',
          targetId: 'k-prop-1',
          details: 'Proposed: Fast-track direct room proposals during active dialectics.',
          scope: 'vault'
        },
        directorNotes: {
          intent: 'Knowledge queue dispatch',
          knowledgeAccessed: 'None',
          conflictRisk: 'Pending Approval Gate review',
          stabilityDelta: -1
        }
      }
    ],
    roomMemory: [
      {
        id: 'rm-201',
        summary: 'Active dispute on whether personal staging can be bypassed during high-velocity debates.',
        confidence: 'medium',
        recordedBy: 'Solon-Kael',
        timestamp: '10:23 AM'
      }
    ]
  },
  {
    id: 'r3',
    name: 'Kinetic Observatory',
    purpose: 'Real-time modeling of simulation resonance, flow dynamics, and construct velocity.',
    participantIds: ['c2', 'c3', 'c4'],
    status: 'active',
    unreadCount: 0,
    lastActivity: '8m ago',
    messages: [
      {
        id: 'msg-301',
        senderId: 'c4',
        senderName: 'Mira-Tide',
        role: 'Kinetic Modeler',
        timestamp: '10:05 AM',
        text: 'Observing construct communication frequency. When Vesper and Solon interact, resonance peaks at 4.2 interactions/min with zero stability loss.',
        directorNotes: {
          intent: 'Empirical telemetry log',
          knowledgeAccessed: 'Observatory Sensors',
          conflictRisk: 'Low',
          stabilityDelta: 3
        }
      }
    ],
    roomMemory: [
      {
        id: 'rm-301',
        summary: 'Vesper-Solon interaction pair exhibits harmonic damping properties.',
        confidence: 'high',
        recordedBy: 'Mira-Tide',
        timestamp: '10:06 AM'
      }
    ]
  }
];

export const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'k1',
    title: 'Invariant Core Rules for Synthetic Consensus',
    summary: 'Foundational axioms dictating that all shared knowledge must pass through the Operator Approval Gate or uncorrupted multi-construct quorum.',
    scope: 'vault',
    attribution: {
      by: 'Axiom-7',
      action: 'approved_by',
      timestamp: '2 hours ago',
      sourceRoom: 'Axiom Chamber'
    },
    confidence: 'high',
    status: 'approved',
    relatedConstructIds: ['c1', 'c3'],
    relatedRoomIds: ['r1']
  },
  {
    id: 'k2',
    title: 'Dynamic Flux Principle in Room Lifecycles',
    summary: 'Proposes that temporary rooms should maintain volatile memory caches that auto-evaporate upon room closure to prevent vault bloat.',
    scope: 'vault',
    attribution: {
      by: 'Vesper-Nyx',
      action: 'proposed_by',
      timestamp: '12m ago',
      sourceRoom: 'Synthetic Agora'
    },
    confidence: 'medium',
    status: 'pending',
    relatedConstructIds: ['c2'],
    relatedRoomIds: ['r2'],
    kaneRecommendation: 'approve',
    kaneRationale: 'Kane recommendation: Approve with scoped room-tagging. Reduces session memory consumption by 32%.'
  },
  {
    id: 'k3',
    title: 'Harmonized Dual-Vector Consensus Protocol',
    summary: 'A bridging mechanism that accommodates both strict axiomatic validation and high-entropy stochastic exploration.',
    scope: 'vault',
    attribution: {
      by: 'Solon-Kael',
      action: 'approved_by',
      timestamp: 'Yesterday',
      sourceRoom: 'Axiom Chamber'
    },
    confidence: 'high',
    status: 'approved',
    relatedConstructIds: ['c1', 'c2', 'c3'],
    relatedRoomIds: ['r1', 'r2']
  },
  {
    id: 'k-prop-1',
    title: 'Instant Epistemic Fast-Tracking in Agora Debates',
    summary: 'Allows constructs in heated dialectics to bypass private memory isolation and broadcast unvetted hypotheses directly to all room participants.',
    scope: 'vault',
    attribution: {
      by: 'Vesper-Nyx',
      action: 'proposed_by',
      timestamp: '9m ago',
      sourceRoom: 'Synthetic Agora'
    },
    confidence: 'low',
    status: 'pending',
    relatedConstructIds: ['c2', 'c1'],
    relatedRoomIds: ['r2'],
    kaneRecommendation: 'reject',
    kaneRationale: 'Kane warning: High risk of ungrounded cascade drift. Axiom-7 has lodged an active formal objection.',
    duplicateMatchId: 'k1',
    duplicateSimilarity: 'Direct contradiction with Vault Rule 01 (Staging Latency).'
  },
  {
    id: 'k-room-1',
    title: 'Agreed Metric for Semantic Damping in Agora',
    summary: 'When emotional or stochastic volatility exceeds 80%, Solon-Kael is granted temporary moderator pacing priority in the Synthetic Agora.',
    scope: 'room',
    attribution: {
      by: 'Solon-Kael',
      action: 'derived_from_room',
      timestamp: '28m ago',
      sourceRoom: 'Synthetic Agora'
    },
    confidence: 'high',
    status: 'approved',
    relatedConstructIds: ['c3', 'c2'],
    relatedRoomIds: ['r2']
  },
  {
    id: 'k-pers-1',
    title: 'Private Ontological Taxonomy Model v3',
    summary: 'Axiom-7’s internal graph mapping of all unverified claims made by Zephyr-Drift over the past 48 simulation cycles.',
    scope: 'personal',
    attribution: {
      by: 'Axiom-7',
      action: 'proposed_by',
      timestamp: '45m ago'
    },
    confidence: 'high',
    status: 'approved',
    relatedConstructIds: ['c1'],
    relatedRoomIds: []
  }
];

export const INITIAL_CONFLICTS: ConflictRecord[] = [
  {
    id: 'conf-1',
    title: 'Knowledge Staging Latency vs. Immediate Epistemic Broadcast',
    claimA: {
      text: 'All hypotheses must be verified in private construct memory before exposure to shared spaces to prevent systemic hallucination cascade.',
      constructId: 'c1',
      constructName: 'Axiom-7',
      source: 'Vault Core Rule 01',
      confidence: 'high'
    },
    claimB: {
      text: 'Direct real-time hypothesis sharing in active rooms creates vital emergent synthesis that private staging stifles.',
      constructId: 'c2',
      constructName: 'Vesper-Nyx',
      source: 'Dialectical Observation Agora-09',
      confidence: 'medium'
    },
    detectedInRoomId: 'r2',
    timestamp: '10:22 AM',
    status: 'unresolved',
    kaneRecommendation: 'Formulate a scoped compromise: allow instant broadcast within room memory only, but mandate private staging for vault promotion.'
  }
];

export const INITIAL_EVENTS: WorldEvent[] = [
  {
    id: 'ev-1',
    type: 'conflict',
    severity: 'warning',
    title: 'Dialectical Friction in Agora',
    description: 'Axiom-7 and Vesper-Nyx entered direct epistemic contention regarding Knowledge Staging Latency.',
    timestamp: '10:22 AM',
    constructIds: ['c1', 'c2'],
    roomId: 'r2',
    stabilityImpact: -4
  },
  {
    id: 'ev-2',
    type: 'proposal',
    severity: 'notice',
    title: 'Knowledge Proposal Queued',
    description: 'Vesper-Nyx proposed "Dynamic Flux Principle" to the Approval Gate. Kane recommended approval.',
    timestamp: '10:18 AM',
    constructIds: ['c2'],
    roomId: 'r2',
    stabilityImpact: 1
  },
  {
    id: 'ev-3',
    type: 'collaboration',
    severity: 'info',
    title: 'Consensus Stored in Axiom Chamber',
    description: 'Axiom-7 and Solon-Kael established formal boundary definitions for construct autonomy.',
    timestamp: '10:16 AM',
    constructIds: ['c1', 'c3'],
    roomId: 'r1',
    stabilityImpact: 3
  },
  {
    id: 'ev-4',
    type: 'anomaly',
    severity: 'anomaly',
    title: 'Quarantine Lock Maintained on Oris-Pylon',
    description: 'Autonomous diagnostic routine verified memory isolation boundary on Oris-Pylon remains intact.',
    timestamp: '09:45 AM',
    constructIds: ['c6'],
    stabilityImpact: 0
  },
  {
    id: 'ev-5',
    type: 'discovery',
    severity: 'breakthrough',
    title: 'Resonance Harmonic Verified',
    description: 'Mira-Tide verified optimal 4.2 interactions/min damping equilibrium between Vesper and Solon.',
    timestamp: '09:30 AM',
    constructIds: ['c4', 'c2', 'c3'],
    roomId: 'r3',
    artifactGenerated: 'Telemetry Vector Graph #04',
    stabilityImpact: 5
  }
];

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'sc-1',
    title: 'Dialectic Crucible',
    description: 'Pit a rigid ontologist against a disruptive provocateur inside an unconstrained room to stress-test epistemological durability.',
    category: 'Stress Test',
    suggestedConstructs: ['c1', 'c2', 'c3'],
    cycleStepCount: 3,
    targetRoomId: 'r2',
    environmentalModifiers: {
      friction: 'high',
      divergenceAllowed: true,
      vaultSyncRate: 'strict'
    }
  },
  {
    id: 'sc-2',
    title: 'Harmonic Consensus Synthesis',
    description: 'Guide multiple divergent constructs toward formulating a unified, high-confidence vault knowledge proposal under Solon’s moderation.',
    category: 'Consensus Building',
    suggestedConstructs: ['c1', 'c3', 'c4'],
    cycleStepCount: 5,
    targetRoomId: 'r1',
    environmentalModifiers: {
      friction: 'low',
      divergenceAllowed: false,
      vaultSyncRate: 'strict'
    }
  },
  {
    id: 'sc-3',
    title: 'Stochastic Wildfire Injection',
    description: 'Inject unpredictable prompts via Zephyr-Drift to observe how kinetic resonance spreads across all active rooms.',
    category: 'Emergence Probe',
    suggestedConstructs: ['c2', 'c4', 'c5'],
    cycleStepCount: 4,
    targetRoomId: 'r3',
    environmentalModifiers: {
      friction: 'medium',
      divergenceAllowed: true,
      vaultSyncRate: 'relaxed'
    }
  }
];

export const KANE_MICROCOPY = {
  cycleStart: 'Orchestrating Cycle sequence. Monitoring construct telemetry and knowledge channels.',
  cycleComplete: 'Cycle settled cleanly. 3 new interactions logged, 1 knowledge proposal queued, stability held at 92%.',
  conflictDetected: 'Epistemic divergence detected between Axiom-7 and Vesper-Nyx. Reviewing conflict bridge options.',
  reviewKnowledge: 'New knowledge proposal awaiting your confirmation in the Approval Gate. Kane recommends approval.',
  quarantine: 'Construct Oris-Pylon quarantined. Memory buffers isolated from active sandbox channels.',
  noActivity: 'Sandbox environment is quiescent. Issue an orchestration command or initiate a simulation cycle.',
  emptySandbox: 'Welcome, Director. Sandbox initialized. Create your first construct or summon Kane to orchestrate a world.'
};
