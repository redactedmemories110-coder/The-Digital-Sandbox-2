import React, { useState } from 'react';
import { useBrandTheme } from '../../common/BrandContext';
import { THEME_SPECS } from '../../../utils/themeTokens';
import { Construct, KnowledgeItem, ConflictRecord } from '../../../types';
import { Send, Sparkles, Cpu, AlertTriangle, Play, Plus, BookOpen, ShieldAlert, Terminal, MessageSquare } from 'lucide-react';

interface ConsoleKaneProps {
  constructs: Construct[];
  proposals: KnowledgeItem[];
  conflicts: ConflictRecord[];
  currentCycle: number;
  onTriggerCycle: () => void;
  onOpenVault: () => void;
  onOpenConflict: () => void;
  onNavigateToRooms: () => void;
}

interface KaneMessage {
  id: string;
  sender: 'kane' | 'user';
  text: string;
  timestamp: string;
  meta?: {
    actionType?: string;
    target?: string;
    stability?: number;
  };
}

export const ConsoleKaneScreen: React.FC<ConsoleKaneProps> = ({
  constructs,
  proposals,
  conflicts,
  currentCycle,
  onTriggerCycle,
  onOpenVault,
  onOpenConflict,
  onNavigateToRooms,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<KaneMessage[]>([
    {
      id: 'km-1',
      sender: 'kane',
      text: 'Kane Orchestrator online. Sandbox Session #04 active. 6 constructs loaded, 3 rooms running, consensus stability nominal at 91%.',
      timestamp: '10:10 AM',
      meta: { actionType: 'SYSTEM_STATUS', stability: 91 }
    },
    {
      id: 'km-2',
      sender: 'kane',
      text: 'Observation: Vesper-Nyx has submitted a new knowledge proposal ("Dynamic Flux Principle") to the Approval Gate. Axiom-7 has lodged an epistemological objection in Synthetic Agora.',
      timestamp: '10:23 AM',
      meta: { actionType: 'CONFLICT_ALERT', target: 'Synthetic Agora' }
    }
  ]);

  // Structured Command chips
  const structuredCommands = [
    { label: '▶ Start Cycle', action: onTriggerCycle, color: 'text-[#00F5FF] border-[#00F5FF]/40 bg-[#00F5FF]/10' },
    { label: '⚖ Review Gate', action: onOpenVault, color: 'text-[#7000FF] border-[#7000FF]/40 bg-[#7000FF]/15' },
    { label: '⚠ Inspect Conflict', action: onOpenConflict, color: 'text-[#FF3D00] border-[#3B1111] bg-[#1A1111]' },
    { label: '💬 Open Agora', action: onNavigateToRooms, color: 'text-[#00FF66] border-[#113B1B] bg-[#111A13]' },
  ];

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const userMsg: KaneMessage = {
      id: `km-${Date.now()}`,
      sender: 'user',
      text: inputVal,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    const prompt = inputVal;
    setInputVal('');

    // Simulated Kane intelligent response
    setTimeout(() => {
      let responseText = `Command acknowledged. Kane analyzing sandbox parameter impact for "${prompt}"...`;
      if (prompt.toLowerCase().includes('cycle')) {
        responseText = 'Directing constructs to step through simulation cycle #15. Telemetry streams active.';
        onTriggerCycle();
      } else if (prompt.toLowerCase().includes('spawn') || prompt.toLowerCase().includes('construct')) {
        responseText = 'Construct spawning template initialized. Specify role, initial ontological boundary, and scope.';
      } else if (prompt.toLowerCase().includes('conflict') || prompt.toLowerCase().includes('dispute')) {
        responseText = 'Conflict analysis: Axiom-7 vs Vesper-Nyx in Agora. Recommendation: Review the arbitration card in Knowledge Vault.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `km-${Date.now() + 1}`,
          sender: 'kane',
          text: responseText,
          timestamp: 'Just now'
        }
      ]);
    }, 600);
  };

  return (
    <div className={`h-full flex flex-col ${tokens.bg} text-[#E0E0E6]`}>
      {/* Top Telemetry Header */}
      <div className="px-4 py-3 border-b border-[#1F1F2B] bg-[#13131A]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#1A1A24] border border-[#00F5FF] flex items-center justify-center shadow-[0_0_12px_rgba(0,245,255,0.35)]">
              <div className="w-6 h-6 rounded-full bg-[#00F5FF] animate-pulse blur-[2px] opacity-60"></div>
              <div className="absolute w-3.5 h-3.5 rounded-full bg-[#00F5FF]"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-display-title text-[#00F5FF]">Kane v2.4</span>
              <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded-full bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30">
                ORCHESTRATOR
              </span>
            </div>
            <p className="text-[10px] text-[#636370]">
              Cycle #{currentCycle} • 6 Constructs • System Stabilized
            </p>
          </div>
        </div>

        {/* Mini Cycle Trigger */}
        <button
          onClick={onTriggerCycle}
          className="px-3 py-1.5 rounded-lg bg-[#00F5FF] hover:bg-[#33F7FF] text-black font-bold flex items-center gap-1.5 text-xs shadow-[0_0_10px_rgba(0,245,255,0.3)] transition-all uppercase tracking-wider"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Cycle</span>
        </button>
      </div>

      {/* Active Alerts Banner */}
      {(proposals.some(p => p.status === 'pending') || conflicts.some(c => c.status === 'unresolved')) && (
        <div className="px-3.5 py-2 bg-gradient-to-r from-[#1A1111] via-[#13131A] to-[#1A1128] border-b border-[#1F1F2B] flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse shadow-[0_0_6px_#FF3D00]" />
            <span className="text-[#B0B0C0]">
              {proposals.filter(p => p.status === 'pending').length} Gate proposals • {conflicts.filter(c => c.status === 'unresolved').length} Conflict
            </span>
          </div>
          <button
            onClick={onOpenVault}
            className="text-[#00F5FF] hover:underline font-semibold"
          >
            Review ➔
          </button>
        </div>
      )}

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[9px] text-[#636370] font-mono-code">
              <span>{msg.sender === 'user' ? 'DIRECTOR (YOU)' : 'KANE'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-[#00F5FF] to-[#00C2FF] text-black font-semibold rounded-tr-sm shadow-[0_0_12px_rgba(0,245,255,0.25)]'
                  : 'bg-[#13131A]/85 backdrop-blur-md text-[#E0E0E6] border border-[#1F1F2B] rounded-tl-sm shadow-lg'
              }`}
            >
              {msg.text}

              {/* Kane metadata chips */}
              {msg.meta && (
                <div className="mt-2 pt-2 border-t border-[#1F1F2B] flex items-center gap-2 text-[9px] font-mono-code">
                  {msg.meta.actionType && (
                    <span className="px-1.5 py-0.5 rounded bg-[#1A1A24] text-[#00F5FF] border border-[#23232F]">
                      SYS: {msg.meta.actionType}
                    </span>
                  )}
                  {msg.meta.stability && (
                    <span className="text-[#00FF66]">
                      STABILITY: {msg.meta.stability}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Structured Commands Bar */}
      <div className="px-3.5 pt-2 pb-1.5 bg-[#13131A]/80 backdrop-blur-md border-t border-[#1F1F2B]">
        <div className="text-[9px] uppercase tracking-[0.2em] text-[#636370] font-semibold mb-1.5 flex items-center gap-1">
          <Terminal className="w-3 h-3 text-[#00F5FF]" />
          <span>Structured Directives</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {structuredCommands.map((cmd, i) => (
            <button
              key={i}
              onClick={cmd.action}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border ${cmd.color} whitespace-nowrap hover:scale-105 transition-transform flex items-center gap-1`}
            >
              {cmd.label}
            </button>
          ))}
        </div>
      </div>

      {/* Free Text Command Input */}
      <div className="p-3 bg-[#0D0D14] border-t border-[#1F1F2B]">
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#13131A] border border-[#1F1F2B] focus-within:border-[#00F5FF]/50 transition-colors shadow-inner">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Command Kane (e.g. 'Spawn construct', 'Run 3 cycles')..."
            className="flex-1 bg-transparent px-2 text-xs text-[#E0E0E6] placeholder:text-[#636370] focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputVal.trim()}
            className="p-2 rounded-lg bg-[#00F5FF] text-black hover:bg-[#33F7FF] disabled:opacity-30 disabled:hover:bg-[#00F5FF] transition-colors shadow-[0_0_8px_rgba(0,245,255,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
