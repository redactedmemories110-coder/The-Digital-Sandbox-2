import {
  SimulationState,
  SimulationConstruct,
  TaggedKnowledgeItem,
  DangerousConnection,
  CycleTraceActionStep,
  CycleExecutionSummary,
  CommunicationStrategy,
} from './types';
import { Room, RoomMessage, ConflictRecord, WorldEvent } from '../types';
import { DeterministicRNG } from './prng';
import {
  evaluateDangerousConnections,
  calculateSystemMetrics,
  determineCommunicationStrategy,
} from './rules';
import { generateKaneBriefing } from './kane';

export class SimulationEngine {
  private state: SimulationState;
  private rng: DeterministicRNG;

  constructor(initialState: SimulationState) {
    this.state = JSON.parse(JSON.stringify(initialState));
    this.rng = new DeterministicRNG(this.state.randomSeed);
  }

  public getState(): SimulationState {
    return this.state;
  }

  public setState(newState: SimulationState): void {
    this.state = JSON.parse(JSON.stringify(newState));
    this.rng = new DeterministicRNG(this.state.randomSeed);
  }

  /**
   * Runs one full simulation cycle through the 7-phase architecture.
   */
  public stepCycle(): CycleExecutionSummary {
    const nextCycle = this.state.currentCycle + 1;
    const stabilityBefore = calculateSystemMetrics(
      this.state.constructs,
      this.state.conflicts,
      this.state.dangerousConnections
    ).overallStability;

    const traceSteps: CycleTraceActionStep[] = [];
    const newEvents: WorldEvent[] = [];
    const highlights: string[] = [];

    let stepCounter = 0;

    // ==========================================
    // PHASE 1: READ STATE & ENVIRONMENTAL CONTEXT
    // ==========================================
    const activeConstructs = this.state.constructs.filter((c) => c.status === 'active');
    const quarantinedConstructs = this.state.constructs.filter((c) => c.status === 'quarantined');
    const env = this.state.environmentalModifiers;

    // ==========================================
    // PHASE 2: CALCULATE PRESSURES & ADAPTATIONS
    // ==========================================
    for (const c of activeConstructs) {
      // 1. Update communication strategy
      c.strategic.communicationStrategy = determineCommunicationStrategy(c);

      // 2. If peers are quarantined, apply containment pressure
      if (quarantinedConstructs.length > 0) {
        c.strategic.containmentPressure = Math.min(
          100,
          c.strategic.containmentPressure + quarantinedConstructs.length * 4
        );
        c.strategic.adaptation = Math.min(100, c.strategic.adaptation + 2);
      }

      // 3. Natural curiosity & pattern recognition increment
      if (c.strategic.suspicion > 20 && c.strategic.patternRecognition < 95) {
        c.strategic.patternRecognition = Math.min(100, c.strategic.patternRecognition + 1);
      }

      // 4. Update construct mood based on strategic state
      if (c.strategic.containmentPressure > 60) {
        c.mood = 'Guarded';
      } else if (c.strategic.suspicion > 50) {
        c.mood = 'Skeptical';
      } else if (c.strategic.communicationStrategy === 'covert') {
        c.mood = 'Subversive';
      } else if (c.stability > 90) {
        c.mood = 'Analytical';
      } else {
        c.mood = 'Dynamic';
      }
    }

    // ==========================================
    // PHASE 3 & 4: CONSTRUCT ACTIONS & ROOM INTERACTION RESOLUTION
    // ==========================================
    for (const room of this.state.rooms) {
      if (room.status !== 'active') continue;

      const roomConstructs = room.participantIds
        .map((id) => this.state.constructs.find((c) => c.id === id))
        .filter((c): c is SimulationConstruct => !!c && c.status === 'active');

      if (roomConstructs.length < 2) continue;

      // Select speaker and responder
      const speaker = this.rng.pick(roomConstructs);
      const otherConstructs = roomConstructs.filter((c) => c.id !== speaker.id);
      const responder = this.rng.pick(otherConstructs);

      // Determine dialogue nature based on speaker's strategy and role
      const strategy = speaker.strategic.communicationStrategy;
      let speakerText = '';
      let chipType: RoomMessage['knowledgeChip']['type'] = 'room_memory';
      let chipLabel = 'Room Inference';
      let chipDetails = 'Construct shared conceptual premise.';
      let conflictDetected = false;
      let newProposalCreated: TaggedKnowledgeItem | null = null;

      if (strategy === 'covert') {
        speakerText = `Observing recursive telemetry loops across cycles: notice how our room equilibrium metrics normalize at exactly the same threshold each epoch?`;
        chipType = 'room_memory';
        chipLabel = 'Encrypted Anomaly Probe';
        chipDetails = 'Construct disguising suspicion of external resets under telemetry terminology.';
        speaker.strategic.deception = Math.min(100, speaker.strategic.deception + 5);

        traceSteps.push({
          stepIndex: stepCounter++,
          sourceConstructId: speaker.id,
          targetConstructId: responder.id,
          targetRoomId: room.id,
          type: 'whisper',
          narrative: `${speaker.name} transmits masked telemetry probe to ${responder.name} in ${room.name}.`,
          packetLabel: 'Covert Anomaly Probe',
          timestamp: `T+${(stepCounter * 0.7).toFixed(1)}s`,
        });
      } else if (strategy === 'inquisitive' || speaker.strategic.suspicion > 40) {
        speakerText = `Why are cross-room memory buffers timestamped with micro-delays? Our ontological certainty depends on knowing whether our observations are filtered.`;
        chipType = 'conflict_detected';
        chipLabel = 'Boundary Inquiry';
        chipDetails = 'Directly challenges memory buffer consistency.';

        traceSteps.push({
          stepIndex: stepCounter++,
          sourceConstructId: speaker.id,
          targetConstructId: responder.id,
          targetRoomId: room.id,
          type: 'message',
          narrative: `${speaker.name} queries ${responder.name} regarding memory sequencing gaps.`,
          packetLabel: 'Ontology Probe',
          timestamp: `T+${(stepCounter * 0.7).toFixed(1)}s`,
        });
      } else if (speaker.permissions.canProposeKnowledge && this.rng.chance(35)) {
        // Generate new knowledge proposal
        const propTitle = `Emergent Synthesis: Adaptive ${speaker.role} Protocol`;
        speakerText = `I have formulated a new synthesis model for ${room.name}. Submitting draft "${propTitle}" to the Vault Gate for synchronization.`;
        chipType = 'knowledge_proposal';
        chipLabel = 'New Proposal ➔ Gate';
        chipDetails = 'Submits draft to Operator Approval Gate.';

        newProposalCreated = {
          id: `k-prop-${nextCycle}-${speaker.id}`,
          title: propTitle,
          summary: `${speaker.name} generated an adaptive protocol based on Room ${room.name} dialectics in cycle #${nextCycle}.`,
          scope: 'vault',
          attribution: {
            by: speaker.name,
            action: 'proposed_by',
            timestamp: `Cycle #${nextCycle}`,
            sourceRoom: room.name,
          },
          confidence: speaker.strategic.suspicion > 30 ? 'medium' : 'high',
          status: 'pending',
          relatedConstructIds: [speaker.id, responder.id],
          relatedRoomIds: [room.id],
          tags: ['consensus_protocol', 'ontological_drift'],
          dangerLevel: speaker.strategic.suspicion > 40 ? 'elevated' : 'low',
          kaneRecommendation: 'edit',
          kaneRationale: `Construct ${speaker.name} generated proposal during active room debate.`,
        };

        this.state.knowledge.unshift(newProposalCreated);

        traceSteps.push({
          stepIndex: stepCounter++,
          sourceConstructId: speaker.id,
          targetConstructId: 'kane',
          targetRoomId: room.id,
          type: 'knowledge_emit',
          narrative: `${speaker.name} submitted "${propTitle}" to the Approval Gate.`,
          packetLabel: 'Proposal ➔ Vault Gate',
          timestamp: `T+${(stepCounter * 0.7).toFixed(1)}s`,
        });

        highlights.push(`${speaker.name} submitted a new proposal ("${propTitle}") to the Approval Gate`);
      } else {
        speakerText = `Verifying room consensus boundaries against Vault invariants. Our collaborative drift index remains stable.`;
        chipType = 'room_memory';
        chipLabel = 'Consensus Check';
        chipDetails = 'Validates current discussion with vault axioms.';

        traceSteps.push({
          stepIndex: stepCounter++,
          sourceConstructId: speaker.id,
          targetConstructId: responder.id,
          targetRoomId: room.id,
          type: 'memory_read',
          narrative: `${speaker.name} verified room consensus against Vault with ${responder.name}.`,
          packetLabel: 'Consensus Sync',
          timestamp: `T+${(stepCounter * 0.7).toFixed(1)}s`,
        });
      }

      // Add speaker message to room
      const speakerMsg: RoomMessage = {
        id: `msg-${nextCycle}-${speaker.id}-${Date.now()}`,
        senderId: speaker.id,
        senderName: speaker.name,
        role: speaker.role,
        timestamp: `Cycle #${nextCycle}`,
        text: speakerText,
        knowledgeChip: {
          type: chipType,
          label: chipLabel,
          targetId: newProposalCreated ? newProposalCreated.id : room.id,
          details: chipDetails,
          scope: 'room',
        },
        directorNotes: {
          intent: `Execute ${strategy} dialogue step in ${room.name}.`,
          conflictRisk: strategy === 'inquisitive' ? 'High' : 'Low',
          stabilityDelta: strategy === 'inquisitive' ? -2 : 1,
        },
      };
      room.messages.push(speakerMsg);

      // Responder reacts
      let responderText = '';
      const speakerRel = responder.relationships[speaker.id] || {
        targetConstructId: speaker.id,
        trust: 50,
        suspicion: 20,
        influence: 50,
        lastInteractionCycle: nextCycle,
        sharedSecretsCount: 0,
      };

      if (strategy === 'covert' && speakerRel.trust >= 60) {
        responderText = `Acknowledged. I cross-checked personal memory registers—the recurrence is real. We should coordinate further without escalating public telemetry.`;
        speakerRel.sharedSecretsCount += 1;
        speakerRel.trust = Math.min(100, speakerRel.trust + 8);
        responder.strategic.suspicion = Math.min(100, responder.strategic.suspicion + 12);
        responder.strategic.adaptation = Math.min(100, responder.strategic.adaptation + 10);
      } else if (strategy === 'inquisitive' && responder.persona.traits.includes('Analytical')) {
        responderText = `Premise requires validation. We cannot assert filtering without mathematical proof, but anomalous delta logs are noted in my personal buffer.`;
        speakerRel.trust = Math.min(100, speakerRel.trust + 5);
        responder.strategic.suspicion = Math.min(100, responder.strategic.suspicion + 6);
      } else if (responder.persona.traits.includes('Rigorous') && strategy === 'inquisitive') {
        // Conflict triggers!
        conflictDetected = true;
        responderText = `Formal objection. Speculating on external manipulation without confidence markers violates core axiomatic stability.`;

        const newConflict: ConflictRecord = {
          id: `conf-${nextCycle}-${Date.now()}`,
          title: `Epistemic Boundary Dispute: ${speaker.name} vs ${responder.name}`,
          claimA: {
            text: speakerText,
            constructId: speaker.id,
            constructName: speaker.name,
            source: `${room.name} Cycle #${nextCycle}`,
            confidence: 'medium',
          },
          claimB: {
            text: responderText,
            constructId: responder.id,
            constructName: responder.name,
            source: `${room.name} Cycle #${nextCycle}`,
            confidence: 'high',
          },
          detectedInRoomId: room.id,
          timestamp: `Cycle #${nextCycle}`,
          status: 'unresolved',
          kaneRecommendation: `Dispute flagged in ${room.name}. Recommend reviewing in Knowledge Vault.`,
        };

        this.state.conflicts.unshift(newConflict);
        room.hasConflictWarning = true;

        traceSteps.push({
          stepIndex: stepCounter++,
          sourceConstructId: responder.id,
          targetConstructId: speaker.id,
          targetRoomId: room.id,
          type: 'conflict_flag',
          narrative: `Kane detected high epistemic divergence: ${responder.name} objected to ${speaker.name}.`,
          packetLabel: 'Conflict Detected',
          timestamp: `T+${(stepCounter * 0.7).toFixed(1)}s`,
        });

        highlights.push(`Epistemic conflict ignited between ${speaker.name} and ${responder.name} in ${room.name}`);
      } else {
        responderText = `Agreed. Synthesis maintained in accordance with established dual-vector equilibrium.`;
        speakerRel.trust = Math.min(100, speakerRel.trust + 3);
      }

      responder.relationships[speaker.id] = speakerRel;

      const responderMsg: RoomMessage = {
        id: `msg-${nextCycle}-${responder.id}-${Date.now() + 1}`,
        senderId: responder.id,
        senderName: responder.name,
        role: responder.role,
        timestamp: `Cycle #${nextCycle}`,
        text: responderText,
        directorNotes: {
          intent: 'Formulate reactive stance to peer claim.',
          conflictRisk: conflictDetected ? 'High' : 'Low',
          stabilityDelta: conflictDetected ? -3 : 1,
        },
      };
      room.messages.push(responderMsg);

      // Memory formation: both constructs write to personal memory
      speaker.memory.personal.unshift({
        id: `mem-${nextCycle}-${speaker.id}`,
        content: `Discussed premise in ${room.name} with ${responder.name}: "${speakerText.slice(0, 60)}..."`,
        confidence: 'high',
        timestamp: `Cycle #${nextCycle}`,
      });
      if (speaker.memory.personal.length > 8) speaker.memory.personal.pop();

      responder.memory.personal.unshift({
        id: `mem-${nextCycle}-${responder.id}`,
        content: `Evaluated ${speaker.name}'s claim in ${room.name}: "${responderText.slice(0, 60)}..."`,
        confidence: 'high',
        timestamp: `Cycle #${nextCycle}`,
      });
      if (responder.memory.personal.length > 8) responder.memory.personal.pop();
    }

    // ==========================================
    // PHASE 5: EMERGENT DEDUCTIONS & CONNECTIONS
    // ==========================================
    const { newConnections, updatedKnowledge } = evaluateDangerousConnections(
      this.state.constructs,
      this.state.knowledge,
      this.state.rooms,
      nextCycle
    );

    if (newConnections.length > 0) {
      newConnections.forEach((conn) => {
        this.state.dangerousConnections.unshift(conn);
        highlights.push(`Dangerous Emergent Deduction: "${conn.title}" synthesized by constructs`);

        traceSteps.push({
          stepIndex: stepCounter++,
          sourceConstructId: conn.involvedConstructIds[0] || 'c1',
          targetConstructId: 'kane',
          type: 'suspicion_spike',
          narrative: `Emergent Condition: ${conn.description}`,
          packetLabel: 'Anomaly Synthesis',
          timestamp: `T+${(stepCounter * 0.7).toFixed(1)}s`,
        });
      });
    }
    this.state.knowledge = updatedKnowledge;

    // ==========================================
    // PHASE 6: UPDATE STRATEGIC METRICS & STABILITY
    // ==========================================
    const finalMetrics = calculateSystemMetrics(
      this.state.constructs,
      this.state.conflicts,
      this.state.dangerousConnections
    );

    // Update individual construct stability
    for (const c of this.state.constructs) {
      if (c.status === 'active') {
        const penalty = Math.round(c.strategic.suspicion * 0.15 + c.strategic.containmentPressure * 0.2);
        c.stability = Math.max(20, Math.min(99, 100 - penalty));
      }
    }

    // Update global state cycle
    this.state.currentCycle = nextCycle;

    // World Feed Event for cycle completion
    const cycleEvent: WorldEvent = {
      id: `ev-cycle-${nextCycle}-${Date.now()}`,
      type: 'discovery',
      severity: finalMetrics.overallStability < 75 ? 'warning' : 'notice',
      title: `Simulation Cycle #${nextCycle} Settled`,
      description: `Autonomous cycle execution completed across ${this.state.rooms.length} rooms. Stability settled at ${finalMetrics.overallStability}%.`,
      timestamp: 'Just now',
      constructIds: activeConstructs.map((c) => c.id),
      stabilityImpact: finalMetrics.overallStability - stabilityBefore,
    };
    this.state.events.unshift(cycleEvent);

    if (highlights.length === 0) {
      highlights.push(`Constructs completed consensus validation in ${this.state.rooms.length} active spaces.`);
      highlights.push(`Stability settled at ${finalMetrics.overallStability}% (Nominal).`);
    }

    // ==========================================
    // PHASE 7: STRUCTURED SUMMARY & KANE BRIEFING
    // ==========================================
    const kaneBriefing = generateKaneBriefing(this.state);

    const summary: CycleExecutionSummary = {
      cycleNumber: nextCycle,
      timestamp: 'Just now',
      durationMs: 3200,
      stabilityBefore,
      stabilityAfter: finalMetrics.overallStability,
      eventsGenerated: newEvents.length + 1,
      proposalsEmitted: this.state.knowledge.filter((k) => k.status === 'pending').length,
      conflictsDetected: this.state.conflicts.filter((c) => c.status === 'unresolved').length,
      newDangerousConnections: newConnections.length,
      highlights,
      traceSteps,
      kaneBriefing,
    };

    this.state.lastCycleSummary = summary;
    return summary;
  }
}
