import React from 'react';
import { useBrandTheme } from '../../common/BrandContext';
import { THEME_SPECS } from '../../../utils/themeTokens';
import { Plus, Play, Cpu, Archive, Clock, MoreVertical, Sparkles } from 'lucide-react';

interface SessionPickerProps {
  onSelectSession: (sessionId: string) => void;
  onCreateNew: () => void;
}

export const SessionPickerScreen: React.FC<SessionPickerProps> = ({
  onSelectSession,
  onCreateNew,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const sessions = [
    {
      id: 'sess-1',
      name: 'Primary Ontological Sandbox',
      constructCount: 6,
      roomCount: 3,
      currentCycle: 14,
      lastEvent: 'Dialectical Friction in Agora (Axiom vs Vesper)',
      lastActive: '2m ago',
      state: 'Nominal',
      stability: 91,
    },
    {
      id: 'sess-2',
      name: 'Stochastic Wildfire Protocol',
      constructCount: 4,
      roomCount: 2,
      currentCycle: 8,
      lastEvent: 'Zephyr-Drift injected out-of-distribution premise',
      lastActive: '1d ago',
      state: 'Divergent',
      stability: 74,
    }
  ];

  return (
    <div className={`h-full flex flex-col p-4 ${tokens.bg} text-[#E0E0E6] overflow-y-auto`}>
      {/* Header */}
      <div className="pt-2 pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#00F5FF]">
            Pocket Sandbox Hub
          </span>
          <h1 className="text-lg font-bold font-display-title text-[#E0E0E6]">
            Simulation Sessions
          </h1>
        </div>
        <button
          onClick={onCreateNew}
          className="p-2 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] hover:bg-[#00F5FF]/20 transition-all flex items-center gap-1.5 text-xs font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>New Sandbox</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="space-y-3 flex-1">
        {sessions.map((sess) => (
          <div
            key={sess.id}
            onClick={() => onSelectSession(sess.id)}
            className="p-3.5 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] hover:border-[#00F5FF]/40 cursor-pointer transition-all shadow-lg group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-[#E0E0E6] font-display-title">
                    {sess.name}
                  </h2>
                  <span
                    className={`text-[9px] font-mono-code px-1.5 py-0.5 rounded-full ${
                      sess.stability > 80
                        ? 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30'
                        : 'bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/30'
                    }`}
                  >
                    {sess.stability}%
                  </span>
                </div>
                <div className="text-[10px] text-[#636370] flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-[#00F5FF]" />
                    Cycle #{sess.currentCycle}
                  </span>
                  <span>•</span>
                  <span>{sess.constructCount} Constructs</span>
                  <span>•</span>
                  <span>{sess.roomCount} Rooms</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="text-[#636370] hover:text-[#E0E0E6] p-1"
                aria-label="Session options"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Last event highlight */}
            <div className="p-2 rounded-lg bg-[#181824] border border-[#1F1F2B] text-[10px] text-[#B0B0C0] flex items-center gap-1.5 mb-2.5">
              <span className="text-[#00F5FF] font-mono-code text-[9px]">LAST:</span>
              <span className="truncate flex-1">{sess.lastEvent}</span>
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between text-[10px] text-[#636370] pt-1 border-t border-[#1F1F2B]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#636370]" />
                Active {sess.lastActive}
              </span>
              <div className="flex items-center gap-1 text-[#00F5FF] font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Resume Simulation</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </div>
          </div>
        ))}

        {/* Empty state card demo */}
        <div
          onClick={onCreateNew}
          className="p-4 rounded-2xl border-2 border-dashed border-[#1F1F2B] hover:border-[#00F5FF]/40 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#13131A]/40 backdrop-blur-md"
        >
          <div className="w-8 h-8 rounded-full bg-[#181824] border border-[#1F1F2B] flex items-center justify-center text-[#636370] mb-2">
            <Sparkles className="w-4 h-4 text-[#00F5FF]" />
          </div>
          <span className="text-xs font-semibold text-[#E0E0E6]">Start Blank Sandbox World</span>
          <span className="text-[10px] text-[#636370] max-w-[220px] mt-0.5">
            Spin up an empty synthetic environment and assign roles with Kane.
          </span>
        </div>
      </div>
    </div>
  );
};
