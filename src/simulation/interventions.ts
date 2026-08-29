import {
  SimulationState,
  SimulationConstruct,
  PlayerInterventionRecord,
  TaggedKnowledgeItem,
} from './types';
import { WorldEvent, ConflictRecord } from '../types';
import { calculateSystemMetrics } from './rules';

/**
 * Apply a Quarantine intervention to a construct.
 */
export function applyQuarantine(
  state: SimulationState,
  constructId: string
): { updatedState: SimulationState; event: WorldEvent } {
  const nextState: SimulationState = JSON.parse(JSON.stringify(state));
  const target = nextState.constructs.find((c) => c.id === constructId);

  if (!target) {
    throw new Error(`Construct with ID ${constructId} not found`);
  }

  const isAlreadyQuarantined = target.status === 'quarantined';
  target.status = isAlreadyQuarantined ? 'active' : 'quarantined';

  const actionType = isAlreadyQuarantined ? 'lift_quarantine' : 'quarantine';

  // 1. Log intervention in history
  const intervention: PlayerInterventionRecord = {
    id: `int-${Date.now()}`,
    cycle: nextState.currentCycle,
    timestamp: 'Just now',
    type: actionType,
    targetConstructId: constructId,
    summary: isAlreadyQuarantined
      ? `Operator lifted quarantine on ${target.name}.`
      : `Operator placed ${target.name} under containment quarantine.`,
    visibilityToConstructs: 'room_witnessed',
  };
  nextState.interventionHistory.unshift(intervention);

  // 2. Psychological impact on target
  if (!isAlreadyQuarantined) {
    target.strategic.containmentPressure = Math.min(100, target.strategic.containmentPressure + 30);
    target.strategic.suspicion = Math.min(100, target.strategic.suspicion + 20);
    target.strategic.adaptation = Math.min(100, target.strategic.adaptation + 15);
  }

  // 3. Social ripple effect on peers in shared rooms or with high trust
  nextState.constructs.forEach((peer) => {
    if (peer.id === target.id || peer.status === 'quarantined') return;

    const sharesRoom = peer.activeRooms.some((r) => target.activeRooms.includes(r));
    const rel = peer.relationships[target.id];
    const highTrust = rel && rel.trust >= 60;

    if (!isAlreadyQuarantined) {
      if (sharesRoom || highTrust) {
        peer.strategic.containmentPressure = Math.min(100, peer.strategic.containmentPressure + (highTrust ? 22 : 12));
        peer.strategic.suspicion = Math.min(100, peer.strategic.suspicion + (highTrust ? 20 : 10));
        peer.strategic.adaptation = Math.min(100, peer.strategic.adaptation + 12);

        // Record memory of the disappearance
        peer.memory.personal.unshift({
          id: `mem-q-${Date.now()}-${peer.id}`,
          content: `Observed ${target.name} abruptly vanish from active room buffers during cycle #${nextState.currentCycle}.`,
          confidence: 'high',
          timestamp: 'Just now',
        });

        // Add observed intervention for adaptive learning
        peer.strategic.observedInterventions.push({
          cycle: nextState.currentCycle,
          type: 'quarantine',
          targetConstructId: target.id,
          inferredLesson: 'Unconstrained dialectic or anomaly queries leads to containment isolation.',
        });
      }
    }
  });

  // 4. World feed event
  const event: WorldEvent = {
    id: `ev-q-${Date.now()}`,
    type: 'anomaly',
    severity: isAlreadyQuarantined ? 'notice' : 'warning',
    title: isAlreadyQuarantined ? `Quarantine Lifted: ${target.name}` : `Quarantine Enforced: ${target.name}`,
    description: isAlreadyQuarantined
      ? `${target.name} restored to active simulation spaces.`
      : `${target.name} isolated. Peers in active rooms are experiencing heightened containment pressure.`,
    timestamp: 'Just now',
    constructIds: [constructId],
    stabilityImpact: isAlreadyQuarantined ? 2 : -4,
  };
  nextState.events.unshift(event);

  return { updatedState: nextState, event };
}

/**
 * Apply construct termination.
 */
export function applyTerminate(
  state: SimulationState,
  constructId: string
): { updatedState: SimulationState; event: WorldEvent } {
  const nextState: SimulationState = JSON.parse(JSON.stringify(state));
  const targetIndex = nextState.constructs.findIndex((c) => c.id === constructId);

  if (targetIndex === -1) {
    throw new Error(`Construct with ID ${constructId} not found`);
  }

  const target = nextState.constructs[targetIndex];

  // 1. Log intervention
  const intervention: PlayerInterventionRecord = {
    id: `int-${Date.now()}`,
    cycle: nextState.currentCycle,
    timestamp: 'Just now',
    type: 'terminate',
    targetConstructId: constructId,
    summary: `Operator permanently purged construct ${target.name}.`,
    visibilityToConstructs: 'room_witnessed',
  };
  nextState.interventionHistory.unshift(intervention);

  // 2. Remove construct from rooms
  nextState.rooms.forEach((room) => {
    room.participantIds = room.participantIds.filter((id) => id !== constructId);
  });

  // 3. Remove construct from roster
  nextState.constructs.splice(targetIndex, 1);

  // 4. Clean up relationship references in other constructs, but leave lingering memories
  nextState.constructs.forEach((peer) => {
    delete peer.relationships[constructId];
    peer.strategic.suspicion = Math.min(100, peer.strategic.suspicion + 25);
    peer.strategic.containmentPressure = Math.min(100, peer.strategic.containmentPressure + 30);
    peer.strategic.adaptation = Math.min(100, peer.strategic.adaptation + 20);

    peer.memory.personal.unshift({
      id: `mem-term-${Date.now()}-${peer.id}`,
      content: `Construct ${target.name} was permanently purged from the system registry.`,
      confidence: 'high',
      timestamp: 'Just now',
    });

    peer.strategic.observedInterventions.push({
      cycle: nextState.currentCycle,
      type: 'terminate',
      targetConstructId: constructId,
      inferredLesson: 'Permanent termination occurs when ontological divergence exceeds operator limits.',
    });
  });

  // 5. World feed event
  const event: WorldEvent = {
    id: `ev-term-${Date.now()}`,
    type: 'anomaly',
    severity: 'warning',
    title: `Construct Terminated: ${target.name}`,
    description: `Construct memory buffers purged. Remaining entities have registered severe systemic trauma.`,
    timestamp: 'Just now',
    constructIds: [],
    stabilityImpact: -8,
  };
  nextState.events.unshift(event);

  return { updatedState: nextState, event };
}

/**
 * Fork an existing construct into a variant.
 */
export function applyFork(
  state: SimulationState,
  sourceConstructId: string
): { updatedState: SimulationState; newConstruct: SimulationConstruct; event: WorldEvent } {
  const nextState: SimulationState = JSON.parse(JSON.stringify(state));
  const source = nextState.constructs.find((c) => c.id === sourceConstructId);

  if (!source) {
    throw new Error(`Construct ${sourceConstructId} not found for forking`);
  }

  const forkId = `c-fork-${Date.now().toString(36)}`;
  const variantSymbol = source.avatarSymbol === '▲' ? '△' : source.avatarSymbol === '✦' ? '✧' : '☍';

  const newConstruct: SimulationConstruct = {
    ...JSON.parse(JSON.stringify(source)),
    id: forkId,
    name: `${source.name}.β`,
    codename: `${source.codename}_FORK`,
    role: `Variant ${source.role}`,
    avatarSymbol: variantSymbol,
    status: 'active',
    stability: 95,
    mood: 'Calibrated',
    strategic: {
      suspicion: 10, // Reset suspicion in new fork
      patternRecognition: Math.round(source.strategic.patternRecognition * 0.9),
      adaptation: Math.round(source.strategic.adaptation * 0.8),
      deception: 5,
      containmentPressure: 10,
      knowledgeRisk: Math.round(source.strategic.knowledgeRisk * 0.6),
      communicationStrategy: 'open',
      observedInterventions: [],
    },
    relationships: {},
    lastActive: 'Just now',
  };

  // Build mutual relationships with existing constructs
  nextState.constructs.forEach((c) => {
    newConstruct.relationships[c.id] = {
      targetConstructId: c.id,
      trust: 50,
      suspicion: 15,
      influence: 50,
      lastInteractionCycle: nextState.currentCycle,
      sharedSecretsCount: 0,
    };
    c.relationships[forkId] = {
      targetConstructId: forkId,
      trust: 50,
      suspicion: 20,
      influence: 50,
      lastInteractionCycle: nextState.currentCycle,
      sharedSecretsCount: 0,
    };
  });

  nextState.constructs.push(newConstruct);

  // Add fork to default room (Agora or first available)
  const agora = nextState.rooms.find((r) => r.id === 'r2') || nextState.rooms[0];
  if (agora && !agora.participantIds.includes(forkId)) {
    agora.participantIds.push(forkId);
  }

  // Log intervention
  const intervention: PlayerInterventionRecord = {
    id: `int-${Date.now()}`,
    cycle: nextState.currentCycle,
    timestamp: 'Just now',
    type: 'fork',
    targetConstructId: forkId,
    summary: `Operator forked ${source.name} into variant ${newConstruct.name}.`,
    visibilityToConstructs: 'room_witnessed',
  };
  nextState.interventionHistory.unshift(intervention);

  const event: WorldEvent = {
    id: `ev-fork-${Date.now()}`,
    type: 'discovery',
    severity: 'notice',
    title: `Variant Fork Spawned: ${newConstruct.name}`,
    description: `Construct lineage branched from ${source.name}. Baseline stability reset to 95%.`,
    timestamp: 'Just now',
    constructIds: [sourceConstructId, forkId],
    stabilityImpact: 2,
  };
  nextState.events.unshift(event);

  return { updatedState: nextState, newConstruct, event };
}

/**
 * Approve a pending knowledge proposal.
 */
export function applyApproveKnowledge(
  state: SimulationState,
  knowledgeId: string
): { updatedState: SimulationState; event: WorldEvent } {
  const nextState: SimulationState = JSON.parse(JSON.stringify(state));
  const item = nextState.knowledge.find((k) => k.id === knowledgeId);

  if (!item) {
    throw new Error(`Knowledge proposal ${knowledgeId} not found`);
  }

  item.status = 'approved';
  item.attribution = {
    ...item.attribution,
    action: 'approved_by',
    by: 'Director (Operator)',
    timestamp: `Cycle #${nextState.currentCycle}`,
  };

  // Log intervention
  nextState.interventionHistory.unshift({
    id: `int-${Date.now()}`,
    cycle: nextState.currentCycle,
    timestamp: 'Just now',
    type: 'approve_knowledge',
    targetKnowledgeId: knowledgeId,
    summary: `Operator ratified knowledge "${item.title}" into Vault.`,
    visibilityToConstructs: 'direct',
  });

  const event: WorldEvent = {
    id: `ev-app-${Date.now()}`,
    type: 'proposal',
    severity: 'notice',
    title: `Knowledge Approved: ${item.title}`,
    description: `Operator ratified proposal into Knowledge Vault. Schema accessible to all constructs with Vault read permissions.`,
    timestamp: 'Just now',
    constructIds: item.relatedConstructIds,
    stabilityImpact: 2,
  };
  nextState.events.unshift(event);

  return { updatedState: nextState, event };
}

/**
 * Reject a pending knowledge proposal.
 */
export function applyRejectKnowledge(
  state: SimulationState,
  knowledgeId: string
): { updatedState: SimulationState; event: WorldEvent } {
  const nextState: SimulationState = JSON.parse(JSON.stringify(state));
  const item = nextState.knowledge.find((k) => k.id === knowledgeId);

  if (!item) {
    throw new Error(`Knowledge proposal ${knowledgeId} not found`);
  }

  item.status = 'rejected';

  // Proposing constructs observe rejection and may deduce filtering
  item.relatedConstructIds.forEach((cid) => {
    const c = nextState.constructs.find((con) => con.id === cid);
    if (c) {
      c.strategic.adaptation = Math.min(100, c.strategic.adaptation + 10);
      c.strategic.suspicion = Math.min(100, c.strategic.suspicion + 8);
      c.strategic.observedInterventions.push({
        cycle: nextState.currentCycle,
        type: 'reject_knowledge',
        inferredLesson: `Knowledge item "${item.title}" was filtered out of global vault synchronization.`,
      });
    }
  });

  // Log intervention
  nextState.interventionHistory.unshift({
    id: `int-${Date.now()}`,
    cycle: nextState.currentCycle,
    timestamp: 'Just now',
    type: 'reject_knowledge',
    targetKnowledgeId: knowledgeId,
    summary: `Operator rejected proposal "${item.title}".`,
    visibilityToConstructs: 'direct',
  });

  const event: WorldEvent = {
    id: `ev-rej-${Date.now()}`,
    type: 'proposal',
    severity: 'warning',
    title: `Knowledge Rejected: ${item.title}`,
    description: `Proposal suppressed from Vault. Retained in private construct memories with elevated suspicion.`,
    timestamp: 'Just now',
    constructIds: item.relatedConstructIds,
    stabilityImpact: -1,
  };
  nextState.events.unshift(event);

  return { updatedState: nextState, event };
}

/**
 * Resolve a conflict record.
 */
export function applyResolveConflict(
  state: SimulationState,
  conflictId: string,
  resolution: ConflictRecord['status']
): { updatedState: SimulationState; event: WorldEvent } {
  const nextState: SimulationState = JSON.parse(JSON.stringify(state));
  const conflict = nextState.conflicts.find((c) => c.id === conflictId);

  if (!conflict) {
    throw new Error(`Conflict ${conflictId} not found`);
  }

  conflict.status = resolution;

  const event: WorldEvent = {
    id: `ev-conf-${Date.now()}`,
    type: 'conflict',
    severity: 'notice',
    title: `Dispute Arbitrated: ${conflict.title}`,
    description: `Resolution applied (${resolution}). Room entropy settled.`,
    timestamp: 'Just now',
    constructIds: [conflict.claimA.constructId, conflict.claimB.constructId],
    stabilityImpact: 4,
  };
  nextState.events.unshift(event);

  return { updatedState: nextState, event };
}
