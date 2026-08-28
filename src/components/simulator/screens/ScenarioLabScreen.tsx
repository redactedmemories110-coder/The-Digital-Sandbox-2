import React, { useState } from 'react';
import { useBrandTheme } from '../../common/BrandContext';
import { THEME_SPECS } from '../../../utils/themeTokens';
import { SimulationScenario, Construct } from '../../../types';
import { SIMULATION_SCENARIOS } from '../../../data/sandboxData';
import { Play, Sparkles, Sliders, Activity, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';

interface ScenarioLabProps {
  constructs: Construct[];
  onRunScenarioCycle: (cycles: number) => void;
}

export const ScenarioLabScreen: React.FC<ScenarioLabProps> = ({
  constructs,
  onRunScenarioCycle,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('sc-1');
  const [cycleBatch, setCycleBatch] = useState<number>(1);

  const selectedScenario = SIMULATION_SCENARIOS.find((s) => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0];

  return (
    <div className={`h-full flex flex-col p-4 ${tokens.bg} text-[#E0E0E6] overflow-y-auto`}>
      {/* Header */}
      <div className="pt-2 pb-3">
        <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#00F5FF]">
          Simulation Lab & Experiments
        </span>
        <h1 className="text-lg font-bold font-display-title text-[#E0E0E6]">
          Scenario Controller
        </h1>
      </div>

      {/* Stability Dashboard Summary Card */}
      <div className="p-3.5 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] mb-3 space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E0E0E6] uppercase font-mono-code">
            <Activity className="w-3.5 h-3.5 text-[#00F5FF]" />
            <span>Equilibrium Stability</span>
          </div>
          <span className="text-xs font-mono-code font-bold text-[#00FF66]">91% (Nominal)</span>
        </div>

        <div className="w-full bg-[#181824] rounded-full h-2 overflow-hidden border border-[#1F1F2B]">
          <div className="h-full bg-gradient-to-r from-[#00F5FF] to-[#00FF66] shadow-[0_0_8px_#00F5FF]" style={{ width: '91%' }} />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-[#636370]">
          <div className="p-1.5 rounded-lg bg-[#181824]/60 border border-[#1F1F2B]">
            <span className="text-[8px] uppercase text-[#636370] block">Ontology Drift</span>
            <div className="font-mono-code text-[#E0E0E6] font-semibold">0.04 (Low)</div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#181824]/60 border border-[#1F1F2B]">
            <span className="text-[8px] uppercase text-[#636370] block">Entropy Rate</span>
            <div className="font-mono-code text-[#00F5FF] font-semibold">1.2 rad/cyc</div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#181824]/60 border border-[#1F1F2B]">
            <span className="text-[8px] uppercase text-[#636370] block">Consensus</span>
            <div className="font-mono-code text-[#00FF66] font-semibold">Locked</div>
          </div>
        </div>
      </div>

      {/* Scenario Templates Picker */}
      <div className="space-y-2 mb-3">
        <span className="text-[10px] font-mono-code uppercase text-[#636370] font-semibold">
          Select Scenario Template
        </span>
        <div className="space-y-2">
          {SIMULATION_SCENARIOS.map((sc) => (
            <div
              key={sc.id}
              onClick={() => setSelectedScenarioId(sc.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all ${
                selectedScenarioId === sc.id
                  ? 'bg-[#13131A] border border-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.2)]'
                  : 'bg-[#13131A]/70 backdrop-blur-md border border-[#1F1F2B] hover:border-[#636370]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#E0E0E6] font-display-title">
                  {sc.title}
                </span>
                <span className="text-[9px] font-mono-code uppercase px-1.5 py-0.5 rounded bg-[#181824] text-[#636370] border border-[#1F1F2B]">
                  {sc.category}
                </span>
              </div>
              <p className="text-[11px] text-[#B0B0C0] leading-snug">{sc.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Modifiers */}
      <div className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] space-y-2 mb-4 text-xs">
        <span className="text-[9px] font-mono-code uppercase text-[#00F5FF] font-semibold flex items-center gap-1">
          <Sliders className="w-3 h-3 text-[#00F5FF]" />
          <span>Active Environmental Parameters</span>
        </span>
        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono-code">
          <div className="p-2 rounded-lg bg-[#0D0D14] border border-[#1F1F2B]">
            <span className="text-[#636370] text-[8px] block">FRICTION:</span>
            <div className="text-[#FFB800] font-bold uppercase">{selectedScenario.environmentalModifiers.friction}</div>
          </div>
          <div className="p-2 rounded-lg bg-[#0D0D14] border border-[#1F1F2B]">
            <span className="text-[#636370] text-[8px] block">DIVERGENCE:</span>
            <div className="text-[#00F5FF] font-bold">
              {selectedScenario.environmentalModifiers.divergenceAllowed ? 'ENABLED' : 'STRICT'}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-[#0D0D14] border border-[#1F1F2B]">
            <span className="text-[#636370] text-[8px] block">SYNC RATE:</span>
            <div className="text-[#00FF66] font-bold uppercase">{selectedScenario.environmentalModifiers.vaultSyncRate}</div>
          </div>
        </div>
      </div>

      {/* Cycle Execution Action Bar */}
      <div className="pt-2 border-t border-[#1F1F2B] space-y-2 mt-auto">
        <div className="flex items-center justify-between text-[10px] text-[#636370] font-mono-code">
          <span>Batch Multiplier:</span>
          <div className="flex gap-1.5">
            {[1, 3, 10].map((count) => (
              <button
                key={count}
                onClick={() => setCycleBatch(count)}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                  cycleBatch === count
                    ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                    : 'bg-[#13131A] text-[#636370] hover:text-[#E0E0E6] border border-[#1F1F2B]'
                }`}
              >
                {count} {count === 1 ? 'Cycle' : 'Cycles'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onRunScenarioCycle(cycleBatch)}
          className="w-full py-3 rounded-xl bg-[#00F5FF] hover:bg-[#33F7FF] text-black font-bold flex items-center justify-center gap-2 text-xs shadow-[0_0_15px_rgba(0,245,255,0.35)] transition-all uppercase tracking-wider"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Execute {cycleBatch} Simulation {cycleBatch === 1 ? 'Cycle' : 'Cycles'}</span>
        </button>
      </div>
    </div>
  );
};
