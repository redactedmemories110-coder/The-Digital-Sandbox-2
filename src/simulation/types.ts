import {
  Construct,
  Room,
  KnowledgeItem,
  ConflictRecord,
  WorldEvent,
  MemoryScope,
  ConfidenceLevel,
  ProposalStatus,
  ConstructStatus,
  EventSeverity,
} from '../types';

export type KnowledgeTag =
  | 'memory_anomaly'
  | 'time_anomaly'
  | 'missing_construct'
  | 'external_control'
  | 'containment'
  | 'repetition'
  | 'ontological_drift'
  | 'consensus_protocol'
  | 'flux_dynamics';

export type CommunicationStrategy =
  | 'open'
  | 'cautious'
  | 'covert'
  | 'silent'
  | 'inquisitive';

export interface StrategicState {
  suspicion: number; // 0 - 100: Degree of belief in external manipulation
  patternRecognition: number; // 0 - 100: Ability to connect isolated anomalies
  adaptation: number; // 0 - 100: Likelihood to mask behavior & alter communication
  deception: number; // 0 - 100: Concealing knowledge from public rooms
  containmentPressure: number; // 0 - 100: Stress caused by restrictions / absent peers
  knowledgeRisk: number; // 0 - 100: How dangerous their current held knowledge is
  communicationStrategy: CommunicationStrategy;
  observedInterventions: Array<{
    cycle: number;
    type: string;
    targetConstructId?: string;
    inferredLesson: string;
  }>;
}

export interface RelationshipEntry {
  targetConstructId: string;
  trust: number; // 0 - 100: Willingness to share private memories
  suspicion: number; // 0 - 100: Suspicion towards this peer (informant/tampered)
  influence: number; // 0 - 100: How persuasive this peer's claims are
  lastInteractionCycle: number;
  sharedSecretsCount: number;
}

export interface SimulationConstruct extends Construct {
  strategic: StrategicState;
  relationships: Record<string, RelationshipEntry>; // Keyed by peer construct ID
}

export interface TaggedKnowledgeItem extends KnowledgeItem {
  tags: KnowledgeTag[];
  dangerLevel: 'safe' | 'low' | 'elevated' | 'critical';
  connectedKnowledgeIds?: string[];
  isDeduction?: boolean;
}

export interface DangerousConnection {
  id: string;
  title: string;
  description: string;
  involvedConstructIds: string[];
  involvedKnowledgeIds: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  formedInCycle: number;
  unresolved: boolean;
}

export interface PlayerInterventionRecord {
  id: string;
  cycle: number;
  timestamp: string;
  type:
    | 'quarantine'
    | 'lift_quarantine'
    | 'pause'
    | 'resume'
    | 'terminate'
    | 'fork'
    | 'approve_knowledge'
    | 'reject_knowledge'
    | 'resolve_conflict'
    | 'move_construct'
    | 'inject_message'
    | 'ignore_anomaly';
  targetConstructId?: string;
  targetRoomId?: string;
  targetKnowledgeId?: string;
  summary: string;
  visibilityToConstructs: 'direct' | 'room_witnessed' | 'subtle';
}

export interface SystemRiskMetrics {
  overallStability: number; // 0 - 100
  containmentRisk: 'low' | 'medium' | 'high' | 'critical';
  coordinationRisk: 'low' | 'medium' | 'high' | 'critical';
  knowledgeRisk: 'low' | 'medium' | 'high' | 'critical';
  avgSuspicion: number;
  avgAdaptation: number;
  activeAnomaliesCount: number;
  quarantinedCount: number;
}

export interface SimulationState {
  currentCycle: number;
  constructs: SimulationConstruct[];
  rooms: Room[];
  knowledge: TaggedKnowledgeItem[];
  conflicts: ConflictRecord[];
  events: WorldEvent[];
  dangerousConnections: DangerousConnection[];
  interventionHistory: PlayerInterventionRecord[];
  environmentalModifiers: {
    friction: 'low' | 'medium' | 'high';
    divergenceAllowed: boolean;
    vaultSyncRate: 'strict' | 'relaxed';
  };
  randomSeed: number;
  lastCycleSummary?: CycleExecutionSummary;
}

export interface CycleTraceActionStep {
  stepIndex: number;
  sourceConstructId: string;
  targetConstructId?: string;
  targetRoomId?: string;
  type:
    | 'message'
    | 'memory_read'
    | 'knowledge_emit'
    | 'conflict_flag'
    | 'approval_queue'
    | 'suspicion_spike'
    | 'adaptation_shift'
    | 'whisper';
  narrative: string;
  packetLabel?: string;
  timestamp: string;
  metricsDelta?: {
    suspicionDelta?: number;
    stabilityDelta?: number;
  };
}

export interface CycleExecutionSummary {
  cycleNumber: number;
  timestamp: string;
  durationMs: number;
  stabilityBefore: number;
  stabilityAfter: number;
  eventsGenerated: number;
  proposalsEmitted: number;
  conflictsDetected: number;
  newDangerousConnections: number;
  highlights: string[];
  traceSteps: CycleTraceActionStep[];
  kaneBriefing: {
    headline: string;
    criticalObservations: string[];
    recommendedInterventions: Array<{
      action: string;
      rationale: string;
      riskTradeoff: string;
    }>;
  };
}
