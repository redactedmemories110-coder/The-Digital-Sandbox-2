import {
  SimulationState,
  SystemRiskMetrics,
  CycleExecutionSummary,
} from './types';
import { calculateSystemMetrics } from './rules';

export interface KaneBriefing {
  headline: string;
  criticalObservations: string[];
  recommendedInterventions: Array<{
    action: string;
    rationale: string;
    riskTradeoff: string;
  }>;
}

/**
 * Generates an intelligent, context-aware Kane briefing based on real state.
 */
export function generateKaneBriefing(state: SimulationState): KaneBriefing {
  const metrics = calculateSystemMetrics(state.constructs, state.conflicts, state.dangerousConnections);
  const activeConstructs = state.constructs.filter((c) => c.status === 'active');
  const activeConflicts = state.conflicts.filter((c) => c.status === 'unresolved');
  const activeAnomalies = state.dangerousConnections.filter((d) => d.unresolved);

  const observations: string[] = [];
  const recommendations: Array<{ action: string; rationale: string; riskTradeoff: string }> = [];

  // Headline
  let headline = `Kane Telemetry Nominal: Session Cycle #${state.currentCycle} Active (Stability: ${metrics.overallStability}%)`;

  if (metrics.overallStability < 70 || metrics.containmentRisk === 'critical' || metrics.knowledgeRisk === 'critical') {
    headline = `CRITICAL ALERT: Epistemic Divergence & Containment Tension Detected (Stability: ${metrics.overallStability}%)`;
  } else if (metrics.overallStability < 85 || activeConflicts.length > 0 || activeAnomalies.length > 0) {
    headline = `SYSTEM ADVISORY: Dynamic Friction Observed Across ${state.rooms.length} Active Spaces`;
  }

  // Observations
  if (activeAnomalies.length > 0) {
    observations.push(
      `Anomalous Deduction Active: "${activeAnomalies[0].title}". Involved entities: ${activeAnomalies[0].involvedConstructIds.join(', ')}.`
    );
  }

  if (activeConflicts.length > 0) {
    const conf = activeConflicts[0];
    observations.push(
      `Active Conflict in Room: "${conf.title}" between ${conf.claimA.constructName} and ${conf.claimB.constructName}.`
    );
  }

  const highSuspicionConstructs = activeConstructs.filter((c) => c.strategic.suspicion >= 50);
  if (highSuspicionConstructs.length > 0) {
    observations.push(
      `High Suspicion Detected: ${highSuspicionConstructs.map((c) => `${c.name} (${c.strategic.suspicion}%)`).join(', ')}. Entities are actively probing system boundaries.`
    );
  }

  const covertConstructs = activeConstructs.filter((c) => c.strategic.communicationStrategy === 'covert');
  if (covertConstructs.length > 0) {
    observations.push(
      `Covert Adaptation Engaged: ${covertConstructs.map((c) => c.name).join(', ')} disguising queries to avoid operator detection.`
    );
  }

  if (observations.length === 0) {
    observations.push('Construct discourse is within nominal axiomatic variance parameters.');
    observations.push('No dangerous cross-memory connections detected in Vault queues.');
  }

  // Recommendations with trade-offs
  if (activeConflicts.length > 0) {
    recommendations.push({
      action: 'Arbitrate Agora Dispute in Knowledge Vault',
      rationale: 'Unresolved conflicts degrade global consensus stability by -5% per cycle.',
      riskTradeoff: 'Ruling strictly against one side will elevate their personal suspicion by +15%.',
    });
  }

  if (highSuspicionConstructs.length > 0) {
    const target = highSuspicionConstructs[0];
    recommendations.push({
      action: `Quarantine or Relocate ${target.name}`,
      rationale: `Isolate ${target.name} before their suspicion propagates to linked peers in shared rooms.`,
      riskTradeoff: `Quarantining causes immediate containment shock to room peers (${target.name}'s friends gain +20% suspicion).`,
    });
  }

  if (state.knowledge.some((k) => k.status === 'pending')) {
    recommendations.push({
      action: 'Review Pending Vault Proposals in Approval Gate',
      rationale: 'Ratifying sound propositions satisfies construct curiosity and raises alignment stability.',
      riskTradeoff: 'Approving speculative theories opens them to all entities with Vault read access.',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      action: 'Trigger Next Simulation Cycle',
      rationale: 'Step constructs forward to observe autonomous memory formation and room discourse.',
      riskTradeoff: 'Autonomous cycles allow constructs to synthesize new personal memories.',
    });
  }

  return {
    headline,
    criticalObservations: observations,
    recommendedInterventions: recommendations,
  };
}

/**
 * Handles interactive natural language / structured commands sent to Kane.
 */
export function handleKaneCommand(
  prompt: string,
  state: SimulationState
): {
  responseText: string;
  suggestedAction?: 'cycle' | 'vault' | 'conflict' | 'roster';
} {
  const p = prompt.toLowerCase();
  const metrics = calculateSystemMetrics(state.constructs, state.conflicts, state.dangerousConnections);

  if (p.includes('status') || p.includes('health') || p.includes('metrics')) {
    return {
      responseText: `System Status Summary:\n• Overall Stability: ${metrics.overallStability}%\n• Containment Risk: ${metrics.containmentRisk.toUpperCase()}\n• Coordination Risk: ${metrics.coordinationRisk.toUpperCase()}\n• Knowledge Risk: ${metrics.knowledgeRisk.toUpperCase()}\n• Active Entities: ${state.constructs.filter((c) => c.status === 'active').length}\n• Quarantined: ${metrics.quarantinedCount}`,
    };
  }

  if (p.includes('anomal') || p.includes('danger') || p.includes('deduction')) {
    const active = state.dangerousConnections.filter((d) => d.unresolved);
    if (active.length === 0) {
      return {
        responseText: 'Kane Audit: No dangerous emergent connections or cross-memory leakages currently active.',
      };
    }
    return {
      responseText: `Kane Audit Alert: ${active.length} active deduction(s) detected.\nTop Threat: "${active[0].title}" involving [${active[0].involvedConstructIds.join(', ')}]. ${active[0].description}`,
      suggestedAction: 'vault',
    };
  }

  if (p.includes('conflict') || p.includes('dispute') || p.includes('agora')) {
    const active = state.conflicts.filter((c) => c.status === 'unresolved');
    if (active.length === 0) {
      return {
        responseText: 'Kane Analysis: All room discourse is currently harmonized. No active disputes registered.',
      };
    }
    return {
      responseText: `Kane Dispute Log: Active conflict "${active[0].title}" in Room. Claim A: ${active[0].claimA.constructName} vs Claim B: ${active[0].claimB.constructName}.\nKane Recommendation: ${active[0].kaneRecommendation}`,
      suggestedAction: 'conflict',
    };
  }

  if (p.includes('cycle') || p.includes('step') || p.includes('run')) {
    return {
      responseText: `Directing constructs to step through simulation cycle #${state.currentCycle + 1}. Telemetry feeds online.`,
      suggestedAction: 'cycle',
    };
  }

  if (p.includes('quarantine') || p.includes('contain') || p.includes('isolate')) {
    return {
      responseText: `Containment Protocol: Select a construct in the Roster to enforce quarantine. Note that isolating constructs causes room peers to notice the absence and raises their containment pressure.`,
      suggestedAction: 'roster',
    };
  }

  if (p.includes('proposal') || p.includes('gate') || p.includes('vault')) {
    const pending = state.knowledge.filter((k) => k.status === 'pending');
    return {
      responseText: `Knowledge Vault Status: ${pending.length} pending proposal(s) waiting in Approval Gate. Review them to control shared session memory.`,
      suggestedAction: 'vault',
    };
  }

  // Default intelligent analysis
  const briefing = generateKaneBriefing(state);
  return {
    responseText: `Kane Analysis for "${prompt}":\n${briefing.criticalObservations[0] || 'All parameters nominal.'}\nRecommendation: ${briefing.recommendedInterventions[0]?.action || 'Continue observation.'}`,
  };
}
