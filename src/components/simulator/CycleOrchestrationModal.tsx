import React, { useState, useEffect } from 'react';
import { useBrandTheme } from '../common/BrandContext';
import { THEME_SPECS } from '../../utils/themeTokens';
import { Construct, KnowledgeItem, ConflictRecord, CycleTraceStep, CycleSummary } from '../../types';
import { Play, CheckCircle, AlertTriangle, Sparkles, Cpu, ShieldAlert, ArrowRight, Eye, RefreshCw, X } from 'lucide-react';

interface CycleOrchestrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  constructs: Construct[];
  onCompleteCycle: (summary: CycleSummary) => void;
  onOpenVault: () => void;
  onOpenConflict: () => void;
}

export const CycleOrchestrationModal: React.FC<CycleOrchestrationModalProps> = ({
  isOpen,
  onClose,
  constructs,
  onCompleteCycle,
  onOpenVault,
  onOpenConflict,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const [phase, setPhase] = useState<'simulating' | 'settled'>('simulating');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [cycleTrace, setCycleTrace] = useState<CycleTraceStep[]>([]);
  const [activePacket, setActivePacket] = useState<{ from: string; to: string; label: string } | null>(null);

  // Simulation timeline steps
  const simulationSteps: CycleTraceStep[] = [
    {
      stepIndex: 0,
      sourceConstructId: 'c1',
      targetConstructId: 'c2',
      type: 'message',
      narrative: 'Axiom-7 queries Vesper-Nyx on ontological grounding parameters.',
      packetLabel: 'Ontology Query',
      timestamp: 'T+0.4s'
    },
    {
      stepIndex: 1,
      sourceConstructId: 'c2',
      targetConstructId: 'c3',
      type: 'memory_read',
      narrative: 'Vesper-Nyx references Room Memory in Agora and formulates counter-premise.',
      packetLabel: 'Room Memory Read',
      timestamp: 'T+1.1s'
    },
    {
      stepIndex: 2,
      sourceConstructId: 'c2',
      targetConstructId: 'c1',
      type: 'knowledge_emit',
      narrative: 'Vesper-Nyx proposes "Dynamic Flux Principle" to bypass private staging.',
      packetLabel: 'New Proposal ➔ Gate',
      timestamp: 'T+1.8s'
    },
    {
      stepIndex: 3,
      sourceConstructId: 'c1',
      targetConstructId: 'c2',
      type: 'conflict_flag',
      narrative: 'Kane detects high epistemic divergence: Axiom-7 formal objection registered.',
      packetLabel: 'Conflict Tension Detected',
      timestamp: 'T+2.5s'
    },
    {
      stepIndex: 4,
      sourceConstructId: 'c3',
      targetConstructId: 'kane',
      type: 'approval_queue',
      narrative: 'Solon-Kael drafts harmonic mediation bridge; proposal routed to Approval Gate.',
      packetLabel: 'Gate Routing Complete',
      timestamp: 'T+3.2s'
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      setPhase('simulating');
      setCurrentStepIndex(0);
      setCycleTrace([]);
      setActivePacket(null);
      return;
    }

    // Step-by-step playback
    let step = 0;
    const interval = setInterval(() => {
      if (step < simulationSteps.length) {
        const nextStep = simulationSteps[step];
        setCurrentStepIndex(step);
        setCycleTrace((prev) => [...prev, nextStep]);
        if (nextStep.sourceConstructId && nextStep.targetConstructId) {
          setActivePacket({
            from: nextStep.sourceConstructId,
            to: nextStep.targetConstructId,
            label: nextStep.packetLabel || 'Data'
          });
        }
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('settled');
          onCompleteCycle({
            cycleNumber: 15,
            timestamp: 'Just now',
            durationMs: 3400,
            stabilityBefore: 94,
            stabilityAfter: 91,
            eventsGenerated: 4,
            proposalsEmitted: 1,
            conflictsDetected: 1,
            highlights: [
              'Vesper-Nyx proposed "Dynamic Flux Principle" to the sandbox vault',
              'Epistemic conflict flagged between Axiom-7 and Vesper-Nyx',
              'Solon-Kael synthesized an arbitration bridge',
              'Overall sandbox stability settled at 91% (Nominal)'
            ]
          });
        }, 800);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Node positions in the visualization canvas (percentages)
  const nodePositions: Record<string, { x: number; y: number }> = {
    c1: { x: 22, y: 30 }, // Axiom-7 (Top Left)
    c2: { x: 78, y: 30 }, // Vesper-Nyx (Top Right)
    c3: { x: 50, y: 75 }, // Solon-Kael (Bottom Center)
    c4: { x: 18, y: 65 }, // Mira-Tide (Mid Left)
    kane: { x: 50, y: 45 } // Kane Orchestrator Center
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#050507]/90 backdrop-blur-2xl text-[#E0E0E6] animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1F1F2B] bg-[#13131A]/85 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00F5FF] animate-ping" />
          <div>
            <div className="text-xs font-bold font-display-title tracking-wider text-[#00F5FF] uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Cycle Orchestration Active
            </div>
            <p className="text-[10px] text-[#636370]">
              {phase === 'simulating' ? 'Running simulation cycle #15...' : 'Cycle #15 Complete • Settled'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full bg-[#181824] hover:bg-[#202030] text-[#B0B0C0] transition-colors border border-[#1F1F2B]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Orchestration Canvas */}
      <div className="relative flex-1 w-full bg-radial from-[#13131A]/70 via-[#09090E] to-[#050507] overflow-hidden flex flex-col">
        {/* Visual Graph Area */}
        <div className="relative h-64 w-full flex items-center justify-center">
          {/* Subtle Grid / Polar rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-48 h-48 rounded-full border border-dashed border-[#00F5FF]" />
            <div className="w-72 h-72 rounded-full border border-[#1F1F2B] absolute" />
          </div>

          {/* SVG Connection Lines & Active Packet */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Base connections */}
            <line x1="22%" y1="30%" x2="78%" y2="30%" stroke="#1F1F2B" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="22%" y1="30%" x2="50%" y2="75%" stroke="#1F1F2B" strokeWidth="1" />
            <line x1="78%" y1="30%" x2="50%" y2="75%" stroke="#1F1F2B" strokeWidth="1" />
            <line x1="22%" y1="30%" x2="50%" y2="45%" stroke="#00F5FF" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="78%" y1="30%" x2="50%" y2="45%" stroke="#7000FF" strokeWidth="1" strokeOpacity="0.3" />

            {/* Conflict tension highlight between Axiom (c1) and Vesper (c2) */}
            {currentStepIndex >= 3 && (
              <line
                x1="22%"
                y1="30%"
                x2="78%"
                y2="30%"
                stroke="#FF3D00"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                className="animate-pulse"
              />
            )}

            {/* Dynamic Moving Packet Indicator */}
            {activePacket && nodePositions[activePacket.from] && nodePositions[activePacket.to] && (
              <g className="transition-all duration-500">
                <circle
                  cx={`${(nodePositions[activePacket.from].x + nodePositions[activePacket.to].x) / 2}%`}
                  cy={`${(nodePositions[activePacket.from].y + nodePositions[activePacket.to].y) / 2}%`}
                  r="5"
                  fill="#00F5FF"
                  className="animate-ping"
                />
              </g>
            )}
          </svg>

          {/* Central Kane Oversight Orb */}
          <div
            className="absolute z-20 flex flex-col items-center justify-center cursor-pointer group"
            style={{ left: '50%', top: '45%', transform: 'translate(-50%, -50%)' }}
            onClick={() => setSelectedNode('kane')}
          >
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#00F5FF]/20 via-[#13131A] to-[#050507] border border-[#00F5FF] flex items-center justify-center shadow-[0_0_25px_rgba(0,245,255,0.4)]">
              <div className="w-5 h-5 rounded-full bg-[#00F5FF] animate-pulse flex items-center justify-center text-[10px] text-black font-bold shadow-[0_0_8px_#00F5FF]">
                K
              </div>
            </div>
            <span className="text-[10px] font-mono-code text-[#00F5FF] font-semibold mt-1">KANE</span>
            <span className="text-[8px] text-[#636370]">Orchestrator</span>
          </div>

          {/* Construct Nodes */}
          {constructs.slice(0, 4).map((c) => {
            const pos = nodePositions[c.id];
            if (!pos) return null;
            const isSelected = selectedNode === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedNode(c.id)}
                className="absolute z-20 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-110"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${c.avatarBg} border ${isSelected ? 'ring-2 ring-[#00F5FF]' : 'border-[#1F1F2B]'} flex items-center justify-center shadow-lg transition-all`}
                >
                  <span className={`text-sm font-bold ${c.avatarColor}`}>{c.avatarSymbol}</span>
                </div>
                <span className="text-[10px] font-semibold text-[#E0E0E6] mt-1">{c.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] text-[#636370]">{c.role.split(' ')[0]}</span>
                  <span className="text-[8px] font-mono-code text-[#00FF66]">{c.stability}%</span>
                </div>
              </div>
            );
          })}

          {/* Tappable Packet Badge in Center */}
          {activePacket && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-[#13131A]/90 border border-[#00F5FF]/50 text-[10px] font-mono-code text-[#00F5FF] shadow-[0_0_12px_rgba(0,245,255,0.25)] flex items-center gap-1.5 animate-bounce backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[#00F5FF]" />
              <span>{activePacket.label}</span>
            </div>
          )}
        </div>

        {/* Bottom State: Real-time Trace vs Settled Summary */}
        <div className="flex-1 bg-[#0D0D14]/90 backdrop-blur-md border-t border-[#1F1F2B] p-4 flex flex-col justify-between overflow-y-auto">
          {phase === 'simulating' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[#636370] font-semibold flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-[#00F5FF] animate-spin" />
                  Live Cycle Trace
                </span>
                <span className="text-[9px] font-mono-code text-[#00F5FF]">Step {currentStepIndex + 1}/5</span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {cycleTrace.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] text-[11px] flex items-start gap-2 animate-in slide-in-from-bottom-2 duration-150"
                  >
                    <span className="text-[9px] font-mono-code text-[#636370] pt-0.5">{step.timestamp}</span>
                    <div className="flex-1">
                      <p className="text-[#E0E0E6] leading-tight">{step.narrative}</p>
                      {step.packetLabel && (
                        <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30 font-mono-code">
                          {step.packetLabel}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Settled Summary "What Changed" */
            <div className="space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#00FF66] text-xs font-bold uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 text-[#00FF66]" />
                  Cycle #15 Settle Summary
                </div>
                <span className="text-[10px] font-mono-code text-[#636370]">3.4s Execution</span>
              </div>

              {/* What Changed Key Metrics */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] text-center">
                  <span className="text-[9px] text-[#636370] uppercase">Stability</span>
                  <div className="text-sm font-bold font-mono-code text-[#00FF66]">91% (-3%)</div>
                </div>
                <div className="p-2 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#7000FF]/40 text-center">
                  <span className="text-[9px] text-[#636370] uppercase">New Proposals</span>
                  <div className="text-sm font-bold font-mono-code text-[#7000FF]">+1 In Gate</div>
                </div>
                <div className="p-2 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#3B1111] text-center">
                  <span className="text-[9px] text-[#636370] uppercase">Conflicts</span>
                  <div className="text-sm font-bold font-mono-code text-[#FF3D00]">1 Flagged</div>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-1 text-[11px] text-[#B0B0C0] bg-[#13131A]/85 backdrop-blur-md p-2.5 rounded-xl border border-[#1F1F2B]">
                <div className="font-semibold text-[#E0E0E6] mb-1 text-[10px] uppercase text-[#00F5FF]">
                  Key Sandbox Mutations:
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[#7000FF]">➔</span>
                  <span>Vesper-Nyx submitted <strong>"Dynamic Flux Principle"</strong> to Vault Approval Gate.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[#FF3D00]">⚠</span>
                  <span>Axiom-7 registered formal objection regarding Staging Latency bounds.</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenVault();
                  }}
                  className="py-2 px-3 rounded-xl bg-[#7000FF]/20 hover:bg-[#7000FF]/30 border border-[#7000FF]/50 text-[#7000FF] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(112,0,255,0.2)]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Review Gate (1)
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenConflict();
                  }}
                  className="py-2 px-3 rounded-xl bg-[#1A1111] hover:bg-[#2A1515] border border-[#3B1111] text-[#FF3D00] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(255,61,0,0.2)]"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Inspect Conflict
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2 rounded-xl bg-[#181824] hover:bg-[#202030] text-[#E0E0E6] text-xs font-medium text-center transition-colors border border-[#1F1F2B]"
              >
                Return to Active Sandbox
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
