export type ThemeMode = 'neon_noir' | 'soft_pastel';

export type NavTab = 'console' | 'rooms' | 'world' | 'lab' | 'more';
export type MoreSubTab = 'roster' | 'vault' | 'settings' | 'export';

export type MemoryScope = 'personal' | 'room' | 'vault';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type ProposalStatus = 'pending' | 'approved' | 'rejected' | 'conflicted';
export type ConstructStatus = 'active' | 'idle' | 'quarantined' | 'paused';
export type EventSeverity = 'info' | 'notice' | 'warning' | 'anomaly' | 'breakthrough';

export interface Construct {
  id: string;
  name: string;
  codename: string;
  role: string;
  avatarSymbol: string;
  avatarColor: string;
  avatarBg: string;
  status: ConstructStatus;
  stability: number; // 0 - 100
  mood: string;
  oneLiner: string;
  persona: {
    traits: string[];
    goals: string[];
    boundaries: string[];
    behavioralTendencies: string[];
  };
  memory: {
    personal: Array<{ id: string; content: string; confidence: ConfidenceLevel; timestamp: string }>;
    roomRef: Array<{ id: string; roomId: string; roomName: string; note: string }>;
    vaultContrib: Array<{ id: string; knowledgeId: string; title: string }>;
  };
  permissions: {
    canReadVault: boolean;
    canProposeKnowledge: boolean;
    canInitiateCycle: boolean;
    canDirectMessage: boolean;
    scopeLevel: string;
  };
  activeRooms: string[];
  lastActive: string;
}

export interface RoomMessage {
  id: string;
  senderId: string; // 'kane' | 'user' | constructId
  senderName: string;
  role?: string;
  timestamp: string;
  text: string;
  knowledgeChip?: {
    type: 'room_memory' | 'vault_citation' | 'knowledge_proposal' | 'conflict_detected';
    label: string;
    targetId: string;
    details: string;
    scope: MemoryScope;
  };
  directorNotes?: {
    intent: string;
    knowledgeAccessed?: string;
    conflictRisk?: string;
    stabilityDelta?: number;
  };
}

export interface Room {
  id: string;
  name: string;
  purpose: string;
  participantIds: string[];
  status: 'active' | 'paused' | 'archived';
  unreadCount: number;
  lastActivity: string;
  messages: RoomMessage[];
  roomMemory: Array<{ id: string; summary: string; confidence: ConfidenceLevel; recordedBy: string; timestamp: string }>;
  hasConflictWarning?: boolean;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  summary: string;
  scope: MemoryScope;
  attribution: {
    by: string;
    action: 'proposed_by' | 'derived_from_room' | 'approved_by' | 'edited_by';
    timestamp: string;
    sourceRoom?: string;
  };
  confidence: ConfidenceLevel;
  status: ProposalStatus;
  relatedConstructIds: string[];
  relatedRoomIds: string[];
  kaneRecommendation?: 'approve' | 'edit' | 'reject';
  kaneRationale?: string;
  duplicateMatchId?: string;
  duplicateSimilarity?: string;
}

export interface ConflictRecord {
  id: string;
  title: string;
  claimA: {
    text: string;
    constructId: string;
    constructName: string;
    source: string;
    confidence: ConfidenceLevel;
  };
  claimB: {
    text: string;
    constructId: string;
    constructName: string;
    source: string;
    confidence: ConfidenceLevel;
  };
  detectedInRoomId: string;
  timestamp: string;
  status: 'unresolved' | 'resolved_a' | 'resolved_b' | 'resolved_merged' | 'rejected_both';
  kaneRecommendation: string;
}

export interface WorldEvent {
  id: string;
  type: 'collaboration' | 'discovery' | 'conflict' | 'proposal' | 'anomaly';
  severity: EventSeverity;
  title: string;
  description: string;
  timestamp: string;
  constructIds: string[];
  roomId?: string;
  artifactGenerated?: string;
  stabilityImpact: number; // e.g. -5 to +5
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  category: string;
  suggestedConstructs: string[];
  cycleStepCount: number;
  targetRoomId: string;
  environmentalModifiers: {
    friction: 'low' | 'medium' | 'high';
    divergenceAllowed: boolean;
    vaultSyncRate: 'strict' | 'relaxed';
  };
}

export interface CycleTraceStep {
  stepIndex: number;
  sourceConstructId: string;
  targetConstructId?: string;
  type: 'message' | 'memory_read' | 'knowledge_emit' | 'conflict_flag' | 'approval_queue';
  narrative: string;
  packetLabel?: string;
  timestamp: string;
}

export interface CycleSummary {
  cycleNumber: number;
  timestamp: string;
  durationMs: number;
  stabilityBefore: number;
  stabilityAfter: number;
  eventsGenerated: number;
  proposalsEmitted: number;
  conflictsDetected: number;
  highlights: string[];
}
