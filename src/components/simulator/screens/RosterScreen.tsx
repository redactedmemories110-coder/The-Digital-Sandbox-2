import React, { useState } from 'react';
import { useBrandTheme } from '../../common/BrandContext';
import { THEME_SPECS } from '../../../utils/themeTokens';
import { Construct, ConstructStatus } from '../../../types';
import { Plus, Users, Search, Shield, ChevronRight, ShieldAlert, Cpu, Activity } from 'lucide-react';

interface RosterProps {
  constructs: Construct[];
  onSelectConstruct: (id: string) => void;
  onSpawnConstruct: () => void;
}

export const RosterScreen: React.FC<RosterProps> = ({
  constructs,
  onSelectConstruct,
  onSpawnConstruct,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const [filter, setFilter] = useState<'all' | 'active' | 'idle' | 'quarantined'>('all');
  const [search, setSearch] = useState('');

  const filtered = constructs.filter((c) => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={`h-full flex flex-col p-4 ${tokens.bg} text-[#E0E0E6] overflow-y-auto`}>
      {/* Header */}
      <div className="pt-2 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#00F5FF]">
            Construct Roster
          </span>
          <h1 className="text-lg font-bold font-display-title text-[#E0E0E6]">
            Entities ({constructs.length})
          </h1>
        </div>
        <button
          onClick={onSpawnConstruct}
          className="px-3 py-1.5 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] hover:bg-[#00F5FF]/20 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-[0_0_10px_rgba(0,245,255,0.15)]"
        >
          <Plus className="w-4 h-4" />
          <span>Spawn Entity</span>
        </button>
      </div>

      {/* Search & Filter Chips */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-[#13131A] border border-[#1F1F2B] focus-within:border-[#00F5FF]/50 transition-colors">
          <Search className="w-3.5 h-3.5 text-[#636370]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search constructs by name or role..."
            className="flex-1 bg-transparent text-xs text-[#E0E0E6] placeholder:text-[#636370] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'active', 'idle', 'quarantined'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono-code uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                  : 'bg-[#13131A] text-[#636370] hover:text-[#E0E0E6] border border-[#1F1F2B]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Construct Cards List */}
      <div className="space-y-2.5 flex-1">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectConstruct(c.id)}
            className={`p-3.5 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border ${
              c.status === 'quarantined' ? 'border-[#3B1111] bg-[#1A1111]/70' : 'border-[#1F1F2B]'
            } hover:border-[#00F5FF]/50 cursor-pointer transition-all shadow-md group`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl ${c.avatarBg} border border-[#1F1F2B] flex items-center justify-center font-bold text-sm ${c.avatarColor} shadow-inner`}
                >
                  {c.avatarSymbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold text-[#E0E0E6] font-display-title">
                      {c.name}
                    </h2>
                    <span
                      className={`text-[8px] font-mono-code uppercase px-1.5 py-0.5 rounded-full ${
                        c.status === 'active'
                          ? 'bg-[#111A13] text-[#00FF66] border border-[#113B1B]'
                          : c.status === 'quarantined'
                          ? 'bg-[#1A1111] text-[#FF3D00] border border-[#3B1111]'
                          : 'bg-[#181824] text-[#636370] border border-[#1F1F2B]'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#636370]">{c.role}</p>
                </div>
              </div>

              {/* Stability meter */}
              <div className="text-right">
                <div className="text-[10px] font-mono-code font-bold text-[#E0E0E6]">
                  {c.stability}%
                </div>
                <div className="w-12 bg-[#181824] rounded-full h-1 mt-1 overflow-hidden border border-[#1F1F2B]">
                  <div
                    className={`h-full ${
                      c.stability > 80
                        ? 'bg-[#00FF66]'
                        : c.stability > 65
                        ? 'bg-[#FFB800]'
                        : 'bg-[#FF3D00]'
                    }`}
                    style={{ width: `${c.stability}%` }}
                  />
                </div>
              </div>
            </div>

            {/* One-liner */}
            <p className="text-[11px] text-[#B0B0C0] leading-snug line-clamp-2 mb-2">
              {c.oneLiner}
            </p>

            {/* Card Footer */}
            <div className="flex items-center justify-between text-[9px] text-[#636370] font-mono-code pt-2 border-t border-[#1F1F2B]">
              <span>Mood: <span className="text-[#E0E0E6]">{c.mood}</span></span>
              <span>{c.activeRooms.length} Active Rooms</span>
              <div className="flex items-center gap-1 text-[#00F5FF] font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Inspect</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
