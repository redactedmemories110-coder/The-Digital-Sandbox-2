import React, { useState } from 'react';
import { useBrandTheme } from '../../common/BrandContext';
import { THEME_SPECS } from '../../../utils/themeTokens';
import { Room, Construct, RoomMessage } from '../../../types';
import { ArrowLeft, Eye, EyeOff, Send, Sparkles, AlertTriangle, BookOpen, ShieldCheck, Hash, Users, Layers, Info } from 'lucide-react';

interface RoomDetailProps {
  room: Room;
  constructs: Construct[];
  onBack: () => void;
  onOpenConstruct: (id: string) => void;
  onOpenVault: () => void;
  onOpenConflict: () => void;
  onSendMessage: (text: string) => void;
}

export const RoomDetailScreen: React.FC<RoomDetailProps> = ({
  room,
  constructs,
  onBack,
  onOpenConstruct,
  onOpenVault,
  onOpenConflict,
  onSendMessage,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const [directorView, setDirectorView] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const [expandedChipId, setExpandedChipId] = useState<string | null>(null);

  const getConstruct = (id: string) => constructs.find((c) => c.id === id);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    onSendMessage(inputVal);
    setInputVal('');
  };

  return (
    <div className={`h-full flex flex-col ${tokens.bg} text-[#E0E0E6]`}>
      {/* Top Navigation & Director View Bar */}
      <div className="px-3 py-2.5 border-b border-[#1F1F2B] bg-[#13131A]/85 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-[#181824] text-[#B0B0C0] transition-colors"
            aria-label="Back to rooms list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-bold font-display-title text-[#E0E0E6]">{room.name}</h1>
              {room.hasConflictWarning && (
                <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse shadow-[0_0_6px_#FF3D00]" />
              )}
            </div>
            <p className="text-[9px] text-[#636370] font-mono-code">
              {room.participantIds.length} Constructs • Kane Oversight
            </p>
          </div>
        </div>

        {/* Director View Switch */}
        <button
          onClick={() => setDirectorView((prev) => !prev)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1.5 transition-all ${
            directorView
              ? 'bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/40 shadow-[0_0_10px_rgba(0,245,255,0.25)]'
              : 'bg-[#13131A] text-[#636370] border border-[#1F1F2B]'
          }`}
        >
          {directorView ? <Eye className="w-3 h-3 text-[#00F5FF]" /> : <EyeOff className="w-3 h-3" />}
          <span>Director {directorView ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Participants Quick Bar */}
      <div className="px-3 py-1.5 bg-[#13131A]/60 backdrop-blur-sm border-b border-[#1F1F2B] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[9px] font-mono-code uppercase tracking-wider text-[#636370] whitespace-nowrap">
          Entities:
        </span>
        {room.participantIds.map((pid) => {
          const c = getConstruct(pid);
          if (!c) return null;
          return (
            <button
              key={pid}
              onClick={() => onOpenConstruct(c.id)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#13131A]/80 hover:bg-[#181824] border border-[#1F1F2B] text-[10px] transition-colors whitespace-nowrap"
            >
              <span className={`text-[9px] font-bold ${c.avatarColor}`}>{c.avatarSymbol}</span>
              <span className="text-[#E0E0E6] font-medium">{c.name}</span>
              <span className="text-[8px] font-mono-code text-[#636370]">({c.stability}%)</span>
            </button>
          );
        })}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {room.messages.map((msg) => {
          const isUser = msg.senderId === 'user';
          const isKane = msg.senderId === 'kane';
          const construct = !isUser && !isKane ? getConstruct(msg.senderId) : null;

          return (
            <div key={msg.id} className="space-y-1">
              {/* Message Header */}
              <div className="flex items-center gap-1.5 px-1">
                {construct ? (
                  <div
                    onClick={() => onOpenConstruct(construct.id)}
                    className="cursor-pointer flex items-center gap-1.5 group"
                  >
                    <div
                      className={`w-5 h-5 rounded-md ${construct.avatarBg} flex items-center justify-center text-[10px] font-bold ${construct.avatarColor}`}
                    >
                      {construct.avatarSymbol}
                    </div>
                    <span className="text-[11px] font-bold text-[#E0E0E6] group-hover:text-[#00F5FF] transition-colors">
                      {construct.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#13131A] text-[#636370] font-mono-code border border-[#1F1F2B]">
                      {construct.role}
                    </span>
                  </div>
                ) : isKane ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-[#13131A] border border-[#00F5FF]/50 flex items-center justify-center text-[10px] text-[#00F5FF] font-bold font-mono-code">
                      K
                    </div>
                    <span className="text-[11px] font-bold text-[#00F5FF]">KANE</span>
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30">
                      ORCHESTRATOR
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#00FF66]">DIRECTOR (YOU)</span>
                  </div>
                )}

                <span className="text-[9px] text-[#636370] font-mono-code ml-auto">
                  {msg.timestamp}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-br from-[#00F5FF] to-[#00C2FF] text-black font-semibold shadow-[0_0_12px_rgba(0,245,255,0.25)]'
                    : isKane
                    ? 'bg-[#13131A]/90 backdrop-blur-md border border-[#00F5FF]/30 text-[#E0E0E6]'
                    : 'bg-[#13131A]/80 backdrop-blur-md border border-[#1F1F2B] text-[#B0B0C0]'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>

                {/* Inline Expandable Knowledge Chip */}
                {msg.knowledgeChip && (
                  <div className="mt-2 pt-2 border-t border-[#1F1F2B]">
                    <button
                      onClick={() =>
                        setExpandedChipId(expandedChipId === msg.id ? null : msg.id)
                      }
                      className={`w-full p-2 rounded-lg text-left text-[10px] font-mono-code flex items-center justify-between transition-colors ${
                        msg.knowledgeChip.type === 'conflict_detected'
                          ? 'bg-[#1A1111] border border-[#3B1111] text-[#FF3D00]'
                          : msg.knowledgeChip.type === 'knowledge_proposal'
                          ? 'bg-[#7000FF]/15 border border-[#7000FF]/40 text-[#7000FF]'
                          : 'bg-[#13131A] border border-[#00F5FF]/30 text-[#00F5FF]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {msg.knowledgeChip.type === 'conflict_detected' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#FF3D00]" />
                        ) : msg.knowledgeChip.type === 'knowledge_proposal' ? (
                          <Sparkles className="w-3.5 h-3.5 text-[#7000FF]" />
                        ) : (
                          <BookOpen className="w-3.5 h-3.5 text-[#00F5FF]" />
                        )}
                        <span className="font-semibold">{msg.knowledgeChip.label}</span>
                      </div>
                      <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 bg-[#050507]/60 rounded border border-white/5">
                        {msg.knowledgeChip.scope}
                      </span>
                    </button>

                    {/* Expanded details */}
                    {expandedChipId === msg.id && (
                      <div className="mt-1.5 p-2.5 rounded-lg bg-[#0D0D14]/90 backdrop-blur-md border border-[#1F1F2B] text-[10px] space-y-1.5 animate-in fade-in duration-150">
                        <p className="text-[#B0B0C0]">{msg.knowledgeChip.details}</p>
                        <div className="flex items-center justify-between pt-1 text-[9px]">
                          <span className="text-[#636370] font-mono-code">Scope: {msg.knowledgeChip.scope}</span>
                          {msg.knowledgeChip.type === 'conflict_detected' ? (
                            <button
                              onClick={onOpenConflict}
                              className="text-[#FF3D00] hover:underline font-bold"
                            >
                              Resolve Dispute ➔
                            </button>
                          ) : (
                            <button
                              onClick={onOpenVault}
                              className="text-[#00F5FF] hover:underline font-bold"
                            >
                              Inspect in Vault ➔
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Director View Insight Overlay */}
              {directorView && msg.directorNotes && (
                <div className="ml-2 pl-2.5 border-l-2 border-[#00F5FF]/60 text-[9px] font-mono-code text-[#B0B0C0] space-y-0.5 bg-[#13131A]/60 backdrop-blur-sm p-2 rounded-r-lg border border-[#1F1F2B]/40">
                  <div className="text-[#00F5FF] font-semibold flex items-center gap-1">
                    <Info className="w-2.5 h-2.5" />
                    <span>DIRECTOR TRACE</span>
                  </div>
                  <div>Intent: {msg.directorNotes.intent}</div>
                  {msg.directorNotes.knowledgeAccessed && (
                    <div className="text-[#E0E0E6]">Memory Read: {msg.directorNotes.knowledgeAccessed}</div>
                  )}
                  {msg.directorNotes.conflictRisk && (
                    <div className={msg.directorNotes.conflictRisk.includes('High') ? 'text-[#FF3D00] font-bold' : 'text-[#636370]'}>
                      Conflict Risk: {msg.directorNotes.conflictRisk}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-[#0D0D14] border-t border-[#1F1F2B]">
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#13131A] border border-[#1F1F2B] focus-within:border-[#00F5FF]/50 transition-colors shadow-inner">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Speak into room as Director..."
            className="flex-1 bg-transparent px-2 text-xs text-[#E0E0E6] placeholder:text-[#636370] focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputVal.trim()}
            className="p-2 rounded-lg bg-[#00F5FF] text-black hover:bg-[#33F7FF] disabled:opacity-30 transition-colors shadow-[0_0_8px_rgba(0,245,255,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
