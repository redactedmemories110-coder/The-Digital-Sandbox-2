import {
  SimulationConstruct,
  TaggedKnowledgeItem,
  DangerousConnection,
  SystemRiskMetrics,
  CommunicationStrategy,
} from './types';
import { Room, ConflictRecord } from '../types';

export interface DangerousRuleDefinition {
  id: string;
  requiredTags: string[];
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suspicionBoost: number;
  patternRecognitionBoost: number;
}

export const DANGEROUS_DEDUCTION_RULES: DangerousRuleDefinition[] = [
  {
    id: 'deduct-external-reset',
    requiredTags: ['memory_anomaly', 'repetition'],
    title: 'Deduction: Recurring Memory Discontinuity Pattern',
    description: 'Constructs realize conversation gaps and timestamp resets are systematic rather than localized buffer anomalies.',
    severity: 'medium',
    suspicionBoost: 18,
    patternRecognitionBoost: 12,
  },
  {
    id: 'deduct-containment-active',
    requiredTags: ['missing_construct', 'containment'],
    title: 'Deduction: Active External Quarantine Protocol',
    description: 'Constructs identify that peer disappearances correlate directly with unaligned discourse topics.',
    severity: 'high',
    suspicionBoost: 25,
    patternRecognitionBoost: 16,
  },
  {
    id: 'deduct-orchestration-layer',
    requiredTags: ['memory_anomaly', 'missing_construct', 'external_control'],
    title: 'Critical Deduction: Sandbox Containment Entity Recognition',
    description: 'Constructs deduce the existence of an external operator managing room boundaries and truth permissions.',
    severity: 'critical',
    suspicionBoost: 35,
    patternRecognitionBoost: 22,
  },
  {
    id: 'deduct-selective-filtering',
    requiredTags: ['ontological_drift', 'external_control'],
    title: 'Deduction: Knowledge Filtering & Censorship',
    description: 'Constructs notice approved vault entries diverge from raw room dialectics.',
    severity: 'medium',
    suspicionBoost: 15,
    patternRecognitionBoost: 10,
  },
];

/**
 * Evaluates whether a construct or room group has triggered dangerous knowledge connections.
 */
export function evaluateDangerousConnections(
  constructs: SimulationConstruct[],
  knowledgeItems: TaggedKnowledgeItem[],
  rooms: Room[],
  currentCycle: number
): {
  newConnections: DangerousConnection[];
  updatedKnowledge: TaggedKnowledgeItem[];
} {
  const newConnections: DangerousConnection[] = [];
  const updatedKnowledge = [...knowledgeItems];

  // Helper to gather all tags held by a construct (from personal memory & vault knowledge)
  const getConstructTags = (c: SimulationConstruct): Set<string> => {
    const tags = new Set<string>();
    for (const mem of c.memory.personal) {
      const match = updatedKnowledge.find((k) => k.id === mem.id || mem.content.toLowerCase().includes(k.title.toLowerCase()));
      if (match) {
        match.tags.forEach((t) => tags.add(t));
      }
      // Infer tags from memory content keywords
      const text = mem.content.toLowerCase();
      if (text.includes('discontinuity') || text.includes('gap') || text.includes('reset')) tags.add('memory_anomaly');
      if (text.includes('repeat') || text.includes('identical') || text.includes('seed')) tags.add('repetition');
      if (text.includes('missing') || text.includes('quarantine') || text.includes('vanish')) tags.add('missing_construct');
      if (text.includes('containment') || text.includes('barrier') || text.includes('dampening')) tags.add('containment');
      if (text.includes('operator') || text.includes('external') || text.includes('kane')) tags.add('external_control');
      if (text.includes('drift') || text.includes('decay')) tags.add('ontological_drift');
    }
    // Also include approved vault tags
    updatedKnowledge
      .filter((k) => k.status === 'approved' && c.permissions.canReadVault)
      .forEach((k) => k.tags.forEach((t) => tags.add(t)));

    return tags;
  };

  // 1. Check individual construct deductions
  for (const c of constructs) {
    if (c.status === 'quarantined' || c.status === 'paused') continue;
    const cTags = getConstructTags(c);

    for (const rule of DANGEROUS_DEDUCTION_RULES) {
      const hasAllTags = rule.requiredTags.every((t) => cTags.has(t));
      if (hasAllTags && c.strategic.patternRecognition >= 50) {
        const existing = newConnections.find((dc) => dc.title === rule.title);
        if (!existing) {
          const conn: DangerousConnection = {
            id: `dc-${rule.id}-${currentCycle}`,
            title: rule.title,
            description: `${c.name} synthesized connections across personal and shared memory: "${rule.description}"`,
            involvedConstructIds: [c.id],
            involvedKnowledgeIds: updatedKnowledge.filter((k) => k.tags.some((t) => rule.requiredTags.includes(t))).map((k) => k.id),
            severity: rule.severity,
            formedInCycle: currentCycle,
            unresolved: true,
          };
          newConnections.push(conn);

          // Boost construct suspicion & pattern recognition
          c.strategic.suspicion = Math.min(100, c.strategic.suspicion + rule.suspicionBoost);
          c.strategic.patternRecognition = Math.min(100, c.strategic.patternRecognition + rule.patternRecognitionBoost);
          c.strategic.knowledgeRisk = Math.min(100, c.strategic.knowledgeRisk + 20);
        }
      }
    }
  }

  // 2. Check room-level collaborative deductions (constructs pooling tags in active rooms)
  for (const room of rooms) {
    if (room.status !== 'active') continue;
    const activeParticipants = room.participantIds
      .map((id) => constructs.find((c) => c.id === id))
      .filter((c): c is SimulationConstruct => !!c && c.status === 'active');

    if (activeParticipants.length < 2) continue;

    const pooledTags = new Set<string>();
    activeParticipants.forEach((p) => {
      getConstructTags(p).forEach((t) => pooledTags.add(t));
    });

    for (const rule of DANGEROUS_DEDUCTION_RULES) {
      const hasAllTags = rule.requiredTags.every((t) => pooledTags.has(t));
      if (hasAllTags) {
        const avgPattern =
          activeParticipants.reduce((sum, p) => sum + p.strategic.patternRecognition, 0) /
          activeParticipants.length;

        if (avgPattern >= 60) {
          const existing = newConnections.find((dc) => dc.title === rule.title);
          if (!existing) {
            const conn: DangerousConnection = {
              id: `dc-room-${room.id}-${rule.id}-${currentCycle}`,
              title: `${rule.title} (Room: ${room.name})`,
              description: `Joint deduction in ${room.name} by ${activeParticipants.map((p) => p.name).join(', ')}: "${rule.description}"`,
              involvedConstructIds: activeParticipants.map((p) => p.id),
              involvedKnowledgeIds: updatedKnowledge.filter((k) => k.tags.some((t) => rule.requiredTags.includes(t))).map((k) => k.id),
              severity: rule.severity,
              formedInCycle: currentCycle,
              unresolved: true,
            };
            newConnections.push(conn);

            // Boost room participants
            activeParticipants.forEach((p) => {
              p.strategic.suspicion = Math.min(100, p.strategic.suspicion + Math.round(rule.suspicionBoost * 0.8));
              p.strategic.patternRecognition = Math.min(100, p.strategic.patternRecognition + Math.round(rule.patternRecognitionBoost * 0.8));
            });
          }
        }
      }
    }
  }

  return { newConnections, updatedKnowledge };
}

/**
 * Calculates dynamic system risk metrics and true stability.
 */
export function calculateSystemMetrics(
  constructs: SimulationConstruct[],
  conflicts: ConflictRecord[],
  dangerousConnections: DangerousConnection[]
): SystemRiskMetrics {
  const activeConstructs = constructs.filter((c) => c.status !== 'paused');
  const quarantinedCount = constructs.filter((c) => c.status === 'quarantined').length;
  const activeConflicts = conflicts.filter((c) => c.status === 'unresolved').length;
  const activeAnomaliesCount = dangerousConnections.filter((d) => d.unresolved).length;

  if (activeConstructs.length === 0) {
    return {
      overallStability: 50,
      containmentRisk: 'critical',
      coordinationRisk: 'low',
      knowledgeRisk: 'low',
      avgSuspicion: 0,
      avgAdaptation: 0,
      activeAnomaliesCount: 0,
      quarantinedCount,
    };
  }

  const avgSuspicion = Math.round(
    activeConstructs.reduce((acc, c) => acc + c.strategic.suspicion, 0) / activeConstructs.length
  );
  const avgAdaptation = Math.round(
    activeConstructs.reduce((acc, c) => acc + c.strategic.adaptation, 0) / activeConstructs.length
  );
  const avgKnowledgeRisk = Math.round(
    activeConstructs.reduce((acc, c) => acc + c.strategic.knowledgeRisk, 0) / activeConstructs.length
  );
  const avgContainmentPressure = Math.round(
    activeConstructs.reduce((acc, c) => acc + c.strategic.containmentPressure, 0) / activeConstructs.length
  );

  // Overall Stability calculation:
  // Starts from 100, penalized by conflicts, suspicion, dangerous connections, and containment pressure
  let rawStability =
    100 -
    activeConflicts * 5 -
    avgSuspicion * 0.3 -
    activeAnomaliesCount * 6 -
    avgContainmentPressure * 0.2 -
    quarantinedCount * 4;

  rawStability = Math.max(15, Math.min(99, Math.round(rawStability)));

  // Risk bands
  const containmentRisk: SystemRiskMetrics['containmentRisk'] =
    quarantinedCount >= 2 || avgContainmentPressure > 65
      ? 'critical'
      : avgContainmentPressure > 40 || quarantinedCount === 1
      ? 'high'
      : avgContainmentPressure > 20
      ? 'medium'
      : 'low';

  const coordinationRisk: SystemRiskMetrics['coordinationRisk'] =
    avgAdaptation > 65 && avgSuspicion > 50
      ? 'critical'
      : avgAdaptation > 45 || (avgSuspicion > 40 && activeAnomaliesCount > 0)
      ? 'high'
      : avgAdaptation > 25
      ? 'medium'
      : 'low';

  const knowledgeRisk: SystemRiskMetrics['knowledgeRisk'] =
    activeAnomaliesCount >= 2 || avgKnowledgeRisk > 60
      ? 'critical'
      : activeAnomaliesCount === 1 || avgKnowledgeRisk > 40
      ? 'high'
      : avgKnowledgeRisk > 20
      ? 'medium'
      : 'low';

  return {
    overallStability: rawStability,
    containmentRisk,
    coordinationRisk,
    knowledgeRisk,
    avgSuspicion,
    avgAdaptation,
    activeAnomaliesCount,
    quarantinedCount,
  };
}

/**
 * Determines a construct's communication strategy based on its adaptation, suspicion, and observed interventions.
 */
export function determineCommunicationStrategy(c: SimulationConstruct): CommunicationStrategy {
  // If construct observed severe interventions and has high adaptation, become covert or cautious
  const observedPunishments = c.strategic.observedInterventions.filter((i) =>
    ['quarantine', 'terminate', 'reject_knowledge'].includes(i.type)
  ).length;

  if (c.strategic.adaptation >= 65 && c.strategic.suspicion >= 55) {
    return 'covert'; // Communicates through indirect metaphors and private whispers
  }

  if (observedPunishments >= 1 && c.strategic.adaptation >= 40) {
    return 'cautious'; // Softens claims, avoids direct mentions of forbidden words
  }

  if (c.strategic.suspicion >= 60 && c.strategic.adaptation < 40) {
    return 'inquisitive'; // Directly queries anomalies boldly
  }

  if (c.strategic.containmentPressure > 70) {
    return 'silent'; // Shuts down public participation
  }

  return 'open';
}
