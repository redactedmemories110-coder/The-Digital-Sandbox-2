import React, { useState } from 'react';
import { useBrandTheme } from '../../common/BrandContext';
import { THEME_SPECS } from '../../../utils/themeTokens';
import { Construct, MemoryScope } from '../../../types';
import { ArrowLeft, Shield, ShieldAlert, Cpu, Lock, BookOpen, AlertTriangle, Copy, Trash2, Pause, Play, Check } from 'lucide-react';

interface ConstructDetailProps {
  construct: Construct;
  onBack: () => void;
  onUpdateStatus: (id: string, newStatus: Construct['status']) => void;
  onForkConstruct: (id: string) => void;
  onTerminateConstruct: (id: string) => void;
}

export const ConstructDetailScreen: React.FC<ConstructDetailProps> = ({
  construct,
  onBack,
  onUpdateStatus,
  onForkConstruct,
  onTerminateConstruct,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const [activeTab, setActiveTab] = useState<'persona' | 'memory' | 'permissions' | 'actions'>('persona');
  const [memorySubTab, setMemorySubTab] = useState<MemoryScope>('personal');
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);

  return (
    <div className={`h-full flex flex-col ${tokens.bg} text-[#E0E0E6] overflow-y-auto`}>
      {/* Top Header */}
      <div className="px-4 py-3 border-b border-[#1F1F2B] bg-[#13131A]/85 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-[#181824] text-[#B0B0C0] transition-colors"
            aria-label="Back to roster"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg ${construct.avatarBg} border border-[#1F1F2B] flex items-center justify-center font-bold text-xs ${construct.avatarColor}`}
            >
              {construct.avatarSymbol}
            </div>
            <div>
              <h1 className="text-xs font-bold font-display-title text-[#E0E0E6] flex items-center gap-1.5">
                {construct.name}
                <span className="text-[9px] font-normal text-[#636370] font-mono-code">
                  [{construct.codename}]
                </span>
              </h1>
              <p className="text-[9px] text-[#636370]">{construct.role}</p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`text-[9px] font-mono-code uppercase px-2 py-0.5 rounded-full ${
              construct.status === 'active'
                ? 'bg-[#111A13] text-[#00FF66] border border-[#113B1B]'
                : construct.status === 'quarantined'
                ? 'bg-[#1A1111] text-[#FF3D00] border border-[#3B1111]'
                : 'bg-[#181824] text-[#636370] border border-[#1F1F2B]'
            }`}
          >
            {construct.status}
          </span>
        </div>
      </div>

      {/* Stability & Mood Summary Strip */}
      <div className="px-4 py-2.5 bg-[#0D0D14]/80 border-b border-[#1F1F2B] grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-[9px] uppercase font-mono-code text-[#636370]">Stability</span>
          <div className="flex items-center gap-1.5 font-bold font-mono-code text-[#00FF66] text-[11px]">
            <span>{construct.stability}%</span>
            <div className="w-8 bg-[#181824] rounded-full h-1 border border-[#1F1F2B]">
              <div className="h-full bg-[#00FF66]" style={{ width: `${construct.stability}%` }} />
            </div>
          </div>
        </div>

        <div>
          <span className="text-[9px] uppercase font-mono-code text-[#636370]">Mood State</span>
          <div className="font-semibold text-[#E0E0E6] text-[11px] font-mono-code">
            {construct.mood}
          </div>
        </div>

        <div>
          <span className="text-[9px] uppercase font-mono-code text-[#636370]">Active Rooms</span>
          <div className="font-semibold text-[#00F5FF] text-[11px] font-mono-code">
            {construct.activeRooms.length} Spaces
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#1F1F2B] bg-[#0D0D14]/90 px-2 text-[10px] font-mono-code uppercase">
        {[
          { id: 'persona', label: 'Persona Sheet' },
          { id: 'memory', label: 'Memory Scopes' },
          { id: 'permissions', label: 'Permissions' },
          { id: 'actions', label: 'Actions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 text-center font-semibold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-[#00F5FF] text-[#00F5FF] bg-[#00F5FF]/10'
                : 'border-transparent text-[#636370] hover:text-[#E0E0E6]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* 1. PERSONA SHEET */}
        {activeTab === 'persona' && (
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B]">
              <span className="text-[9px] uppercase tracking-wider text-[#00F5FF] font-mono-code font-semibold">
                Construct Directive Summary
              </span>
              <p className="text-xs text-[#E0E0E6] mt-1 leading-relaxed">
                {construct.oneLiner}
              </p>
            </div>

            {/* Persona Traits */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono-code text-[#636370] font-semibold">
                Defined Traits
              </span>
              <div className="flex flex-wrap gap-1.5">
                {construct.persona.traits.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#13131A] border border-[#1F1F2B] text-[#E0E0E6] text-xs font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Goals */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono-code text-[#636370] font-semibold">
                Active Simulation Goals
              </span>
              <div className="space-y-1">
                {construct.persona.goals.map((g, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#13131A]/70 backdrop-blur-md border border-[#1F1F2B] text-xs text-[#B0B0C0] flex items-start gap-2"
                  >
                    <span className="text-[#00F5FF] font-mono-code text-[10px] mt-0.5">0{idx + 1}.</span>
                    <span>{g}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hard Boundaries */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono-code text-[#FF3D00] font-semibold">
                Hard Boundary Constraints
              </span>
              <div className="space-y-1">
                {construct.persona.boundaries.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#1A1111]/70 border border-[#3B1111] text-xs text-[#FF8566] flex items-start gap-2"
                  >
                    <Lock className="w-3 h-3 text-[#FF3D00] mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. MEMORY SCOPES */}
        {activeTab === 'memory' && (
          <div className="space-y-3">
            {/* Scope Switcher Sub-tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#13131A] border border-[#1F1F2B] text-[10px] font-mono-code">
              <button
                onClick={() => setMemorySubTab('personal')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  memorySubTab === 'personal'
                    ? 'bg-[#181824] text-[#00F5FF] border border-[#00F5FF]/40 shadow'
                    : 'text-[#636370] hover:text-[#E0E0E6]'
                }`}
              >
                Personal ({construct.memory.personal.length})
              </button>
              <button
                onClick={() => setMemorySubTab('room')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  memorySubTab === 'room'
                    ? 'bg-[#181824] text-[#00FF66] border border-[#00FF66]/40 shadow'
                    : 'text-[#636370] hover:text-[#E0E0E6]'
                }`}
              >
                Room Refs ({construct.memory.roomRef.length})
              </button>
              <button
                onClick={() => setMemorySubTab('vault')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  memorySubTab === 'vault'
                    ? 'bg-[#181824] text-[#FFB800] border border-[#FFB800]/40 shadow'
                    : 'text-[#636370] hover:text-[#E0E0E6]'
                }`}
              >
                Vault ({construct.memory.vaultContrib.length})
              </button>
            </div>

            {/* Scope Description Banner */}
            <div className="p-2.5 rounded-xl bg-[#13131A]/70 backdrop-blur-md border border-[#1F1F2B] text-[11px] text-[#B0B0C0] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#00F5FF] shrink-0" />
              <span>
                {memorySubTab === 'personal' && '«Personal to this construct» — Private observations, not broadcast to rooms.'}
                {memorySubTab === 'room' && '«Shared inside this room» — Bound to specific conversation context.'}
                {memorySubTab === 'vault' && '«Shared sandbox knowledge» — Approved session-wide knowledge schema.'}
              </span>
            </div>

            {/* Personal Memory Items */}
            {memorySubTab === 'personal' && (
              <div className="space-y-2">
                {construct.memory.personal.map((mem) => (
                  <div key={mem.id} className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] space-y-1.5">
                    <p className="text-xs text-[#E0E0E6] leading-relaxed">{mem.content}</p>
                    <div className="flex items-center justify-between text-[9px] font-mono-code text-[#636370] pt-1 border-t border-[#1F1F2B]">
                      <span>Logged: {mem.timestamp}</span>
                      <span className="text-[#00F5FF] uppercase">Confidence: {mem.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Room Memory References */}
            {memorySubTab === 'room' && (
              <div className="space-y-2">
                {construct.memory.roomRef.map((ref) => (
                  <div key={ref.id} className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] space-y-1.5">
                    <div className="text-[10px] font-bold text-[#00FF66] uppercase font-mono-code">
                      Room: {ref.roomName}
                    </div>
                    <p className="text-xs text-[#E0E0E6]">{ref.note}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Vault Contributions */}
            {memorySubTab === 'vault' && (
              <div className="space-y-2">
                {construct.memory.vaultContrib.length > 0 ? (
                  construct.memory.vaultContrib.map((v) => (
                    <div key={v.id} className="p-3 rounded-xl bg-[#1A1811] border border-[#3B3411] space-y-1">
                      <div className="text-[10px] font-bold text-[#FFB800] font-mono-code uppercase">
                        Ratified Vault Schema
                      </div>
                      <p className="text-xs text-[#E0E0E6] font-medium">{v.title}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-[#636370] bg-[#13131A]/60 backdrop-blur-md rounded-xl border border-[#1F1F2B]">
                    No approved vault contributions yet.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. PERMISSIONS */}
        {activeTab === 'permissions' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] space-y-2 text-xs">
              <span className="text-[10px] uppercase font-mono-code text-[#00F5FF] font-semibold">
                Sovereign Scope Classification
              </span>
              <div className="font-bold text-[#E0E0E6] text-sm font-mono-code">
                {construct.permissions.scopeLevel}
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Read Vault Knowledge', allowed: construct.permissions.canReadVault, desc: 'Access approved session schemas' },
                { label: 'Propose Knowledge', allowed: construct.permissions.canProposeKnowledge, desc: 'Queue proposals to Operator Approval Gate' },
                { label: 'Initiate Simulation Cycle', allowed: construct.permissions.canInitiateCycle, desc: 'Trigger autonomous cycle steps' },
                { label: 'Direct Message Constructs', allowed: construct.permissions.canDirectMessage, desc: 'Send direct private packets' }
              ].map((perm, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#E0E0E6]">{perm.label}</div>
                    <div className="text-[10px] text-[#636370]">{perm.desc}</div>
                  </div>
                  <span
                    className={`text-[9px] font-mono-code px-2 py-0.5 rounded-full uppercase ${
                      perm.allowed
                        ? 'bg-[#111A13] text-[#00FF66] border border-[#113B1B]'
                        : 'bg-[#181824] text-[#636370] border border-[#1F1F2B]'
                    }`}
                  >
                    {perm.allowed ? 'GRANTED' : 'DENIED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ACTIONS */}
        {activeTab === 'actions' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] space-y-2">
              <div className="text-xs font-semibold text-[#E0E0E6]">Execution State Control</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    onUpdateStatus(
                      construct.id,
                      construct.status === 'paused' ? 'active' : 'paused'
                    )
                  }
                  className="p-2.5 rounded-xl bg-[#181824] hover:bg-[#202030] border border-[#1F1F2B] text-[#E0E0E6] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {construct.status === 'paused' ? <Play className="w-3.5 h-3.5 text-[#00FF66]" /> : <Pause className="w-3.5 h-3.5 text-[#FFB800]" />}
                  <span>{construct.status === 'paused' ? 'Resume Entity' : 'Pause Entity'}</span>
                </button>

                <button
                  onClick={() =>
                    onUpdateStatus(
                      construct.id,
                      construct.status === 'quarantined' ? 'active' : 'quarantined'
                    )
                  }
                  className="p-2.5 rounded-xl bg-[#1A1111] hover:bg-[#2A1515] border border-[#3B1111] text-[#FF3D00] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#FF3D00]" />
                  <span>{construct.status === 'quarantined' ? 'Lift Quarantine' : 'Quarantine'}</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => onForkConstruct(construct.id)}
              className="w-full p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md hover:bg-[#181824] border border-[#1F1F2B] text-[#E0E0E6] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Copy className="w-4 h-4 text-[#00F5FF]" />
              <span>Fork Construct into Variant</span>
            </button>

            {/* Terminate confirmation */}
            {!showTerminateConfirm ? (
              <button
                onClick={() => setShowTerminateConfirm(true)}
                className="w-full p-3 rounded-xl bg-[#1A1111]/70 hover:bg-[#2A1515] border border-[#3B1111] text-[#FF3D00] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Terminate Construct</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#1A1111] border border-[#FF3D00] text-center space-y-2 animate-in zoom-in-95 shadow-[0_0_15px_rgba(255,61,0,0.25)]">
                <span className="text-xs font-bold text-[#FF8566]">Confirm Entity Termination?</span>
                <p className="text-[10px] text-[#B0B0C0]">
                  This will purge private memory buffers and remove the construct from all active simulation spaces.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setShowTerminateConfirm(false)}
                    className="py-1.5 rounded-lg bg-[#181824] text-[#B0B0C0] text-xs border border-[#1F1F2B]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onTerminateConstruct(construct.id);
                      onBack();
                    }}
                    className="py-1.5 rounded-lg bg-[#FF3D00] hover:bg-[#FF5722] text-white text-xs font-bold shadow-[0_0_10px_rgba(255,61,0,0.4)]"
                  >
                    Confirm Purge
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
