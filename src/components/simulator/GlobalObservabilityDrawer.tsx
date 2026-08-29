import React from 'react';
import { useBrandTheme } from '../common/BrandContext';
import { THEME_SPECS } from '../../utils/themeTokens';
import { KnowledgeItem, ConflictRecord, WorldEvent } from '../../types';
import { SimulationConstruct, DangerousConnection } from '../../simulation/types';
import { calculateSystemMetrics } from '../../simulation/rules';
import {
  Activity,
  AlertTriangle,
  Cpu,
  Layers,
  Sparkles,
  X,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  BrainCircuit,
  Lock,
} from 'lucide-react';

interface ObservabilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  constructs: SimulationConstruct[];
  proposals: KnowledgeItem[];
  conflicts: ConflictRecord[];
  events: WorldEvent[];
  dangerousConnections?: DangerousConnection[];
  currentCycle: number;
  onOpenConstruct: (id: string) => void;
  onOpenVault: () => void;
  onTriggerCycle: () => void;
}

export const GlobalObservabilityDrawer: React.FC<ObservabilityDrawerProps> = ({
  isOpen,
  onClose,
  constructs,
  proposals,
  conflicts,
  events,
  dangerousConnections = [],
  currentCycle,
  onOpenConstruct,
  onOpenVault,
  onTriggerCycle,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  if (!isOpen) return null;

  const metrics = calculateSystemMetrics(constructs, conflicts, dangerousConnections);
  const activeConstructs = constructs.filter((c) => c.status === 'active');
  const pendingProposals = proposals.filter((p) => p.status === 'pending');
  const activeConflicts = conflicts.filter((c) => c.status === 'unresolved');
  const activeAnomalies = dangerousConnections.filter((d) => d.unresolved);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'text-[#FF3D00] bg-[#1A1111] border-[#3B1111]';
      case 'high':
        return 'text-[#FF8566] bg-[#1A1111] border-[#3B1111]';
      case 'medium':
        return 'text-[#FFB800] bg-[#1A1811] border-[#3B3411]';
      default:
        return 'text-[#00FF66] bg-[#111A13] border-[#113B1B]';
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} aria-label="Close observability drawer" />
      <div className="relative z-10 w-full max-h-[85%] overflow-y-auto bg-[#13131A]/95 backdrop-blur-2xl border-t border-[#1F1F2B] rounded-t-3xl p-4 shadow-2xl flex flex-col gap-4 text-xs text-[#E0E0E6]">
        {/* Handle & Header */}
        <div className="flex items-center justify-between border-b pb-3 border-[#1F1F2B]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00F5FF] animate-pulse" />
            <div>
              <div className="font-semibold tracking-wide uppercase text-[11px] text-[#00F5FF] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#00F5FF]" />
                Global Sandbox Observability
              </div>
              <p className="text-[10px] text-[#636370]">
                Cycle #{currentCycle} • Containment Paradox & System Telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#181824] hover:bg-[#202030] text-[#B0B0C0] transition-colors border border-[#1F1F2B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Health Stats Grid */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="p-2 rounded-xl bg-[#181824]/90 backdrop-blur-md border border-[#1F1F2B] flex flex-col gap-0.5">
            <span className="text-[8px] text-[#636370] uppercase">Stability</span>
            <div className="flex items-baseline justify-center gap-1">
              <span
                className={`text-sm font-bold font-mono-code ${
                  metrics.overallStability > 85 ? 'text-[#00FF66]' : metrics.overallStability > 70 ? 'text-[#FFB800]' : 'text-[#FF3D00]'
                }`}
              >
                {metrics.overallStability}%
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#181824]/90 backdrop-blur-md border border-[#1F1F2B] flex flex-col gap-0.5">
            <span className="text-[8px] text-[#636370] uppercase">Containment</span>
            <span className={`text-[10px] font-bold font-mono-code uppercase px-1 py-0.5 rounded border ${getRiskColor(metrics.containmentRisk)}`}>
              {metrics.containmentRisk}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-[#181824]/90 backdrop-blur-md border border-[#1F1F2B] flex flex-col gap-0.5">
            <span className="text-[8px] text-[#636370] uppercase">Coordination</span>
            <span className={`text-[10px] font-bold font-mono-code uppercase px-1 py-0.5 rounded border ${getRiskColor(metrics.coordinationRisk)}`}>
              {metrics.coordinationRisk}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-[#181824]/90 backdrop-blur-md border border-[#1F1F2B] flex flex-col gap-0.5">
            <span className="text-[8px] text-[#636370] uppercase">Knowledge</span>
            <span className={`text-[10px] font-bold font-mono-code uppercase px-1 py-0.5 rounded border ${getRiskColor(metrics.knowledgeRisk)}`}>
              {metrics.knowledgeRisk}
            </span>
          </div>
        </div>

        {/* Dangerous Deductions Alert */}
        {activeAnomalies.length > 0 && (
          <div className="p-3 rounded-xl bg-[#1A1111]/80 border border-[#FF3D00]/60 backdrop-blur-md flex flex-col gap-1.5 shadow-[0_0_12px_rgba(255,61,0,0.15)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#FF3D00] flex items-center gap-1.5 uppercase font-mono-code">
                <ShieldAlert className="w-3.5 h-3.5 text-[#FF3D00]" />
                Emergent Deduction Alert ({activeAnomalies.length})
              </span>
              <span className="text-[9px] font-mono-code text-[#636370]">Formed Cyc #{activeAnomalies[0].formedInCycle}</span>
            </div>
            <p className="text-[10px] text-[#FF8566] leading-snug font-medium">
              {activeAnomalies[0].title}: {activeAnomalies[0].description}
            </p>
          </div>
        )}

        {/* Active Constructs Telemetry List */}
        <div className="p-3 rounded-xl bg-[#181824]/90 backdrop-blur-md border border-[#1F1F2B] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#E0E0E6] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#00F5FF]" />
              Construct Strategic State Matrix ({activeConstructs.length}/{constructs.length})
            </span>
          </div>

          <div className="space-y-1.5">
            {constructs.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onClose();
                  onOpenConstruct(c.id);
                }}
                className="flex items-center justify-between p-2 rounded-lg bg-[#13131A] hover:bg-[#1A1A24] border border-[#1F1F2B] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-md ${c.avatarBg} border border-[#1F1F2B] flex items-center justify-center text-[10px] font-bold ${c.avatarColor}`}
                  >
                    {c.avatarSymbol}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#E0E0E6] flex items-center gap-1.5">
                      {c.name}
                      {c.status === 'quarantined' && (
                        <span className="text-[8px] font-mono-code text-[#FF3D00] bg-[#1A1111] px-1 rounded border border-[#3B1111]">
                          QUARANTINED
                        </span>
                      )}
                    </div>
                    <div className="text-[9px] text-[#636370]">
                      Strat: <strong className="text-[#00F5FF]">{c.strategic?.communicationStrategy || 'open'}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right text-[9px] font-mono-code">
                    <span className="text-[#636370] block">Susp: <strong className={c.strategic?.suspicion > 40 ? 'text-[#FF3D00]' : 'text-[#E0E0E6]'}>{c.strategic?.suspicion || 0}%</strong></span>
                  </div>
                  <div className="w-12 bg-[#181824] rounded-full h-1.5 overflow-hidden border border-[#1F1F2B]">
                    <div
                      className={`h-full ${
                        c.stability > 80 ? 'bg-[#00FF66]' : c.stability > 65 ? 'bg-[#FFB800]' : 'bg-[#FF3D00]'
                      }`}
                      style={{ width: `${c.stability}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono-code text-[#636370] w-6 text-right">{c.stability}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Knowledge Proposals Alert */}
        {pendingProposals.length > 0 && (
          <div className="p-3 rounded-xl bg-[#7000FF]/15 border border-[#7000FF]/40 backdrop-blur-md flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#7000FF] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7000FF]" />
                Approval Gate Awaiting Action ({pendingProposals.length})
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenVault();
                }}
                className="text-[10px] text-[#7000FF] hover:text-[#E0E0E6] flex items-center gap-1 font-semibold"
              >
                Inspect <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[10px] text-[#B0B0C0]">
              {pendingProposals.length} synthetic knowledge proposals waiting for Operator ratification.
            </p>
          </div>
        )}

        {/* Unresolved Conflict Alert */}
        {activeConflicts.length > 0 && (
          <div className="p-3 rounded-xl bg-[#1A1111]/80 border border-[#3B1111] backdrop-blur-md flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#FF3D00] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF3D00]" />
                Active Construct Disputes ({activeConflicts.length})
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenVault();
                }}
                className="text-[10px] text-[#FF3D00] hover:text-white flex items-center gap-1 font-semibold"
              >
                Resolve <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[10px] text-[#FF8566]">
              {activeConflicts[0].title}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            onTriggerCycle();
          }}
          className="w-full py-2.5 rounded-xl bg-[#00F5FF] text-black font-bold hover:bg-[#00D8E6] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all text-xs uppercase tracking-wider"
        >
          <Cpu className="w-4 h-4" />
          Orchestrate Simulation Cycle
        </button>
      </div>
    </div>
  );
};
