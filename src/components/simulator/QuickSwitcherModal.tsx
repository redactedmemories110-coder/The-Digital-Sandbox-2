import React, { useState } from 'react';
import { useBrandTheme } from '../common/BrandContext';
import { THEME_SPECS } from '../../utils/themeTokens';
import { Construct, Room, KnowledgeItem, WorldEvent, NavTab, MoreSubTab } from '../../types';
import { Search, Hash, Users, BookOpen, Activity, Command, X, ArrowUpRight } from 'lucide-react';

interface QuickSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  constructs: Construct[];
  rooms: Room[];
  knowledge: KnowledgeItem[];
  events: WorldEvent[];
  onNavigateTab: (tab: NavTab, subTab?: MoreSubTab) => void;
  onSelectConstruct: (id: string) => void;
  onSelectRoom: (id: string) => void;
  onSelectKnowledge: (id: string) => void;
}

export const QuickSwitcherModal: React.FC<QuickSwitcherProps> = ({
  isOpen,
  onClose,
  constructs,
  rooms,
  knowledge,
  events,
  onNavigateTab,
  onSelectConstruct,
  onSelectRoom,
  onSelectKnowledge,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredConstructs = constructs.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.role.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.purpose.toLowerCase().includes(query.toLowerCase())
  );

  const filteredKnowledge = knowledge.filter((k) =>
    k.title.toLowerCase().includes(query.toLowerCase()) ||
    k.summary.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-start pt-12 p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} aria-label="Close switcher backdrop" />

      <div
        className="relative z-10 w-full max-h-[80%] flex flex-col bg-[#13131A]/95 backdrop-blur-2xl border border-[#00F5FF]/40 rounded-2xl shadow-2xl overflow-hidden text-[#E0E0E6]"
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-2 p-3 border-b border-[#1F1F2B] bg-[#0D0D14]/90">
          <Command className="w-4 h-4 text-[#00F5FF]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to construct, room, knowledge, feed..."
            className="flex-1 bg-transparent text-xs text-[#E0E0E6] placeholder:text-[#636370] focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="text-[#636370] hover:text-[#E0E0E6]">
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 text-[9px] rounded bg-[#181824] text-[#636370] border border-[#1F1F2B] font-mono-code">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-3 text-xs">
          {/* Direct Screen Navigation */}
          <div>
            <div className="text-[10px] uppercase font-semibold text-[#636370] px-2 py-1 tracking-wider">
              Core Surfaces
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => {
                  onNavigateTab('console');
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#181824]/60 hover:bg-[#181824] border border-[#1F1F2B] text-left text-[#B0B0C0] transition-colors"
              >
                <div className="w-5 h-5 rounded-lg bg-[#00F5FF]/10 border border-[#00F5FF]/30 flex items-center justify-center text-[#00F5FF] text-[10px]">
                  ⚡
                </div>
                <div>
                  <div className="font-medium text-[11px] text-[#E0E0E6]">Kane Console</div>
                  <div className="text-[9px] text-[#636370]">Orchestrator surface</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('lab');
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#181824]/60 hover:bg-[#181824] border border-[#1F1F2B] text-left text-[#B0B0C0] transition-colors"
              >
                <div className="w-5 h-5 rounded-lg bg-[#7000FF]/15 border border-[#7000FF]/30 flex items-center justify-center text-[#7000FF] text-[10px]">
                  🧪
                </div>
                <div>
                  <div className="font-medium text-[11px] text-[#E0E0E6]">Scenario Lab</div>
                  <div className="text-[9px] text-[#636370]">Cycle experiments</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('more', 'vault');
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#181824]/60 hover:bg-[#181824] border border-[#1F1F2B] text-left text-[#B0B0C0] transition-colors"
              >
                <div className="w-5 h-5 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800] text-[10px]">
                  📖
                </div>
                <div>
                  <div className="font-medium text-[11px] text-[#E0E0E6]">Knowledge Vault</div>
                  <div className="text-[9px] text-[#636370]">Shared schemas & gates</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('world');
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#181824]/60 hover:bg-[#181824] border border-[#1F1F2B] text-left text-[#B0B0C0] transition-colors"
              >
                <div className="w-5 h-5 rounded-lg bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center text-[#00FF66] text-[10px]">
                  🌐
                </div>
                <div>
                  <div className="font-medium text-[11px] text-[#E0E0E6]">World Feed</div>
                  <div className="text-[9px] text-[#636370]">Live events record</div>
                </div>
              </button>
            </div>
          </div>

          {/* Constructs */}
          {filteredConstructs.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-semibold text-[#636370] px-2 py-1 tracking-wider flex items-center justify-between">
                <span>Constructs</span>
                <span className="text-[9px] font-mono-code">{filteredConstructs.length}</span>
              </div>
              <div className="space-y-1">
                {filteredConstructs.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectConstruct(c.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#181824] border border-transparent hover:border-[#1F1F2B] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-md ${c.avatarBg} border border-[#1F1F2B] flex items-center justify-center font-bold text-xs ${c.avatarColor}`}>
                        {c.avatarSymbol}
                      </div>
                      <div>
                        <div className="font-semibold text-[#E0E0E6] text-xs flex items-center gap-1.5">
                          {c.name}
                          <span className="text-[9px] font-normal text-[#636370]">({c.codename})</span>
                        </div>
                        <div className="text-[10px] text-[#636370]">{c.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#636370] group-hover:text-[#00F5FF]">
                      <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-[#181824] border border-[#1F1F2B] text-[#B0B0C0]">
                        {c.mood}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rooms */}
          {filteredRooms.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-semibold text-[#636370] px-2 py-1 tracking-wider flex items-center justify-between">
                <span>Rooms</span>
                <span className="text-[9px] font-mono-code">{filteredRooms.length}</span>
              </div>
              <div className="space-y-1">
                {filteredRooms.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onSelectRoom(r.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#181824] border border-transparent hover:border-[#1F1F2B] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-[#181824] border border-[#1F1F2B] flex items-center justify-center text-[#B0B0C0]">
                        <Hash className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#E0E0E6] text-xs">{r.name}</div>
                        <div className="text-[10px] text-[#636370] line-clamp-1">{r.purpose}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#636370] group-hover:text-[#00F5FF]">
                      <span className="text-[9px] font-mono-code text-[#636370]">{r.participantIds.length} entities</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Items */}
          {filteredKnowledge.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-semibold text-[#636370] px-2 py-1 tracking-wider flex items-center justify-between">
                <span>Knowledge Vault</span>
                <span className="text-[9px] font-mono-code">{filteredKnowledge.length}</span>
              </div>
              <div className="space-y-1">
                {filteredKnowledge.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => {
                      onSelectKnowledge(k.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#181824] border border-transparent hover:border-[#1F1F2B] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800]">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#E0E0E6] text-xs truncate">{k.title}</div>
                        <div className="text-[10px] text-[#636370] truncate">{k.summary}</div>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#181824] border border-[#1F1F2B] text-[#B0B0C0] font-mono-code">
                      {k.scope}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
