import React from 'react';
import { useBrandTheme } from '../common/BrandContext';
import { THEME_SPECS } from '../../utils/themeTokens';
import { Construct, KnowledgeItem, ConflictRecord, WorldEvent } from '../../types';
import { Activity, AlertTriangle, Cpu, Layers, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface ObservabilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  constructs: Construct[];
  proposals: KnowledgeItem[];
  conflicts: ConflictRecord[];
  events: WorldEvent[];
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
  currentCycle,
  onOpenConstruct,
  onOpenVault,
  onTriggerCycle,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  if (!isOpen) return null;

  const activeConstructs = constructs.filter((c) => c.status === 'active');
  const avgStability = Math.round(
    constructs.reduce((acc, c) => acc + c.stability, 0) / (constructs.length || 1)
  );

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close observability drawer"
      />
      <div
        className="relative z-10 w-full max-h-[85%] overflow-y-auto bg-[#13131A]/95 backdrop-blur-2xl border-t border-[#1F1F2B] rounded-t-3xl p-4 shadow-2xl flex flex-col gap-4 text-xs text-[#E0E0E6]"
      >
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
                Cycle #{currentCycle} • Real-time telemetry & memory state
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

        {/* Quick Health Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-[#181824]/90 backdrop-blur-md border border-[#1F1F2B] flex flex-col gap-1">
            <span className="text-[10px] text-[#636370] uppercase tracking-wider">Avg Stability</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-base font-bold font-mono-code ${avgStability > 85 ? 'text-[#00FF66]' : 'text-[#FFB800]'}`}>
                {avgStability}%
              </span>
              <span className="text-[9px] text-[#636370]">Nominal</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#181824]/90 backdrop-blur-md border border-[#1F1F2B] flex flex-col gap-1">
            <span className="text-[10px] text-[#636370] uppercase tracking-wider">Gate Queue</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold font-mono-code text-[#7000FF]">
                {proposals.filter(p => p.status === 'pending').length}
              </span>
              <span className="text-[9px] text-[#636370]">Pending</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#181824]/90 backdrop-blur-md border border-[#1F1F2B] flex flex-col gap-1">
            <span className="text-[10px] text-[#636370] uppercase tracking-wider">Active Conflicts</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold font-mono-code text-[#FF3D00]">
                {conflicts.filter(c => c.status === 'unresolved').length}
              </span>
              <span className="text-[9px] text-[#636370]">Divergent</span>
            </div>
          </div>
        </div>

        {/* Active Constructs Telemetry Bar */}
        <div className="p-3 rounded-xl bg-[#181824]/90 backdrop-blur-md border border-[#1F1F2B] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#E0E0E6] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#00F5FF]" />
              Active Constructs Telemetry ({activeConstructs.length})
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
                className="flex items-center justify-between p-1.5 rounded-lg bg-[#13131A] hover:bg-[#1A1A24] border border-[#1F1F2B] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-md ${c.avatarBg} border border-[#1F1F2B] flex items-center justify-center text-[10px] font-bold ${c.avatarColor}`}>
                    {c.avatarSymbol}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#E0E0E6]">{c.name}</div>
                    <div className="text-[9px] text-[#636370]">{c.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#181824] border border-[#1F1F2B] text-[#B0B0C0] font-mono-code">
                      {c.mood}
                    </span>
                  </div>
                  <div className="w-10 bg-[#181824] rounded-full h-1.5 overflow-hidden border border-[#1F1F2B]">
                    <div
                      className={`h-full ${c.stability > 80 ? 'bg-[#00FF66]' : c.stability > 65 ? 'bg-[#FFB800]' : 'bg-[#FF3D00]'}`}
                      style={{ width: `${c.stability}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono-code text-[#636370] w-6 text-right">
                    {c.stability}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Knowledge Proposals Alert */}
        {proposals.some(p => p.status === 'pending') && (
          <div className="p-3 rounded-xl bg-[#7000FF]/15 border border-[#7000FF]/40 backdrop-blur-md flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#7000FF] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7000FF]" />
                Approval Gate Awaiting Action
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
              {proposals.filter(p => p.status === 'pending').length} synthetic knowledge proposals waiting for Operator ratification.
            </p>
          </div>
        )}

        {/* Unresolved Conflict Alert */}
        {conflicts.some(c => c.status === 'unresolved') && (
          <div className="p-3 rounded-xl bg-[#1A1111]/80 border border-[#3B1111] backdrop-blur-md flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#FF3D00] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF3D00]" />
                Active Construct Disagreement
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
              Contradiction flagged in Synthetic Agora: Staging Latency bounds.
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            onTriggerCycle();
          }}
          className="w-full py-2.5 rounded-xl bg-[#00F5FF] text-black font-bold hover:bg-[#00D8E6] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all text-xs"
        >
          <Cpu className="w-4 h-4" />
          Orchestrate Simulation Cycle
        </button>
      </div>
    </div>
  );
};
