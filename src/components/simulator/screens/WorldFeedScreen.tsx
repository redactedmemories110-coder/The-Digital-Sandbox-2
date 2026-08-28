import React, { useState } from 'react';
import { useBrandTheme } from '../../common/BrandContext';
import { THEME_SPECS } from '../../../utils/themeTokens';
import { WorldEvent, EventSeverity, Construct } from '../../../types';
import { Activity, AlertTriangle, Sparkles, ShieldAlert, Cpu, Filter, ChevronRight, BookOpen } from 'lucide-react';

interface WorldFeedProps {
  events: WorldEvent[];
  constructs: Construct[];
  onSelectEvent: (event: WorldEvent) => void;
}

export const WorldFeedScreen: React.FC<WorldFeedProps> = ({
  events,
  constructs,
  onSelectEvent,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const filteredEvents = events.filter((ev) => {
    if (selectedSeverity === 'all') return true;
    return ev.severity === selectedSeverity;
  });

  const getConstruct = (id: string) => constructs.find((c) => c.id === id);

  return (
    <div className={`h-full flex flex-col p-4 ${tokens.bg} text-[#E0E0E6] overflow-y-auto`}>
      {/* Header */}
      <div className="pt-2 pb-3">
        <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#00F5FF]">
          Chronological Event Ledger
        </span>
        <h1 className="text-lg font-bold font-display-title text-[#E0E0E6]">
          World Feed ({events.length})
        </h1>
      </div>

      {/* Severity Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {['all', 'warning', 'notice', 'breakthrough', 'anomaly', 'info'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSelectedSeverity(sev)}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono-code uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedSeverity === sev
                ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                : 'bg-[#13131A] text-[#636370] hover:text-[#E0E0E6] border border-[#1F1F2B]'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Events Stream */}
      <div className="space-y-2.5 flex-1">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            onClick={() => onSelectEvent(ev)}
            className={`p-3.5 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border ${
              ev.severity === 'warning'
                ? 'border-[#3B1111] bg-[#1A1111]/70'
                : ev.severity === 'breakthrough'
                ? 'border-[#113B1B] bg-[#111A13]/70'
                : 'border-[#1F1F2B]'
            } hover:border-[#00F5FF]/50 cursor-pointer transition-all shadow-md group`}
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-mono-code uppercase px-2 py-0.5 rounded-full ${
                    ev.severity === 'warning'
                      ? 'bg-[#1A1111] text-[#FF3D00] border border-[#3B1111]'
                      : ev.severity === 'breakthrough'
                      ? 'bg-[#111A13] text-[#00FF66] border border-[#113B1B]'
                      : ev.severity === 'notice'
                      ? 'bg-[#1A1128] text-[#7000FF] border border-[#7000FF]/40'
                      : 'bg-[#181824] text-[#B0B0C0] border border-[#1F1F2B]'
                  }`}
                >
                  {ev.type}
                </span>
                <span className="text-[10px] font-mono-code text-[#636370]">{ev.timestamp}</span>
              </div>

              {ev.stabilityImpact !== 0 && (
                <span
                  className={`text-[9px] font-mono-code font-bold ${
                    ev.stabilityImpact > 0 ? 'text-[#00FF66]' : 'text-[#FF3D00]'
                  }`}
                >
                  {ev.stabilityImpact > 0 ? `+${ev.stabilityImpact}% STAB` : `${ev.stabilityImpact}% STAB`}
                </span>
              )}
            </div>

            <h2 className="text-xs font-bold text-[#E0E0E6] mb-1 font-display-title">
              {ev.title}
            </h2>
            <p className="text-[11px] text-[#B0B0C0] leading-snug mb-2.5">
              {ev.description}
            </p>

            {/* Involving Entities Row */}
            <div className="flex items-center justify-between text-[10px] text-[#636370] pt-2 border-t border-[#1F1F2B]">
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono-code text-[#636370]">Entities:</span>
                <div className="flex items-center -space-x-1">
                  {ev.constructIds.map((cid) => {
                    const c = getConstruct(cid);
                    if (!c) return null;
                    return (
                      <div
                        key={cid}
                        className={`w-4 h-4 rounded-full ${c.avatarBg} border border-[#13131A] flex items-center justify-center text-[8px] font-bold ${c.avatarColor}`}
                      >
                        {c.avatarSymbol}
                      </div>
                    );
                  })}
                </div>
              </div>

              {ev.artifactGenerated && (
                <span className="text-[9px] font-mono-code text-[#00F5FF] bg-[#00F5FF]/10 px-1.5 py-0.5 rounded border border-[#00F5FF]/30">
                  {ev.artifactGenerated}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
