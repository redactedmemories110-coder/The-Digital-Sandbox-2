import React from 'react';
import { useBrandTheme } from '../../common/BrandContext';
import { THEME_SPECS } from '../../../utils/themeTokens';
import { Room, Construct } from '../../../types';
import { Plus, Hash, Users, AlertTriangle, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';

interface RoomsListProps {
  rooms: Room[];
  constructs: Construct[];
  onSelectRoom: (roomId: string) => void;
  onCreateRoom: () => void;
}

export const RoomsListScreen: React.FC<RoomsListProps> = ({
  rooms,
  constructs,
  onSelectRoom,
  onCreateRoom,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const getConstruct = (id: string) => constructs.find((c) => c.id === id);

  return (
    <div className={`h-full flex flex-col p-4 ${tokens.bg} text-[#E0E0E6] overflow-y-auto`}>
      {/* Header */}
      <div className="pt-2 pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#00F5FF]">
            Multi-Construct Spaces
          </span>
          <h1 className="text-lg font-bold font-display-title text-[#E0E0E6]">
            Active Rooms ({rooms.length})
          </h1>
        </div>
        <button
          onClick={onCreateRoom}
          className="px-3 py-1.5 rounded-lg bg-[#00F5FF]/10 border border-[#00F5FF]/40 text-[#00F5FF] hover:bg-[#00F5FF]/20 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-[0_0_10px_rgba(0,245,255,0.15)]"
        >
          <Plus className="w-4 h-4" />
          <span>New Room</span>
        </button>
      </div>

      {/* Room Cards */}
      <div className="space-y-3 flex-1">
        {rooms.map((room) => {
          const lastMsg = room.messages[room.messages.length - 1];
          return (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`p-3.5 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border ${
                room.hasConflictWarning ? 'border-[#3B1111] bg-[#1A1111]/70' : 'border-[#1F1F2B]'
              } hover:border-[#00F5FF]/60 cursor-pointer transition-all shadow-md group`}
            >
              {/* Title & Warning Tag */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#181824] border border-[#1F1F2B] flex items-center justify-center text-[#00F5FF]">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-bold text-[#E0E0E6] font-display-title">
                        {room.name}
                      </h2>
                      {room.hasConflictWarning && (
                        <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-[#1A1111] text-[#FF3D00] border border-[#3B1111] flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          CONFLICT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#636370] line-clamp-1">
                      {room.purpose}
                    </span>
                  </div>
                </div>

                <div className="text-[9px] font-mono-code text-[#636370]">
                  {room.lastActivity}
                </div>
              </div>

              {/* Participants Avatars Row */}
              <div className="flex items-center gap-1.5 my-2.5 py-1.5 px-2 rounded-lg bg-[#181824]/60 border border-[#1F1F2B]">
                <span className="text-[9px] text-[#636370] uppercase font-mono-code mr-1">
                  Entities:
                </span>
                <div className="flex items-center -space-x-1.5 overflow-hidden">
                  {room.participantIds.map((pid) => {
                    const c = getConstruct(pid);
                    if (!c) return null;
                    return (
                      <div
                        key={pid}
                        title={`${c.name} (${c.role})`}
                        className={`w-5 h-5 rounded-full ${c.avatarBg} border border-[#13131A] flex items-center justify-center text-[9px] font-bold ${c.avatarColor}`}
                      >
                        {c.avatarSymbol}
                      </div>
                    );
                  })}
                </div>
                <span className="text-[9px] font-mono-code text-[#636370] ml-auto">
                  {room.participantIds.length} synced
                </span>
              </div>

              {/* Snippet / Last Message */}
              {lastMsg && (
                <div className="text-[11px] text-[#B0B0C0] flex items-start gap-1.5 line-clamp-2">
                  <span className="font-semibold text-[#636370] font-mono-code text-[10px]">
                    {lastMsg.senderName}:
                  </span>
                  <span className="text-[#B0B0C0]">{lastMsg.text}</span>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-[10px] text-[#636370] pt-2 mt-2 border-t border-[#1F1F2B]">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#00F5FF]" />
                  {room.roomMemory.length} Room Memory Entries
                </span>
                <div className="flex items-center gap-1 text-[#00F5FF] font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Enter Room</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
