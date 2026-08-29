import React, { useState } from 'react';
import { useBrandTheme } from '../../common/BrandContext';
import { THEME_SPECS } from '../../../utils/themeTokens';
import { MemoryScope } from '../../../types';
import { SimulationConstruct, RelationshipEntry } from '../../../simulation/types';
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  Cpu,
  Lock,
  BookOpen,
  AlertTriangle,
  Copy,
  Trash2,
  Pause,
  Play,
  Check,
  Eye,
  Activity,
  Users,
  BrainCircuit,
  MessageSquare,
} from 'lucide-react';

interface ConstructDetailProps {
  construct: SimulationConstruct;
  allConstructs?: SimulationConstruct[];
  onBack: () => void;
  onUpdateStatus: (id: string, newStatus: SimulationConstruct['status']) => void;
  onForkConstruct: (id: string) => void;
  onTerminateConstruct: (id: string) => void;
}

export const ConstructDetailScreen: React.FC<ConstructDetailProps> = ({
  construct,
  allConstructs = [],
  onBack,
  onUpdateStatus,
  onForkConstruct,
  onTerminateConstruct,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const [activeTab, setActiveTab] = useState<'persona' | 'strategic' | 'memory' | 'permissions' | 'actions'>('strategic');
  const [memorySubTab, setMemorySubTab] = useState<MemoryScope>('personal');
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);

  const strategic = construct.strategic || {
    suspicion: 20,
    patternRecognition: 70,
    adaptation: 30,
    deception: 10,
    containmentPressure: 15,
    knowledgeRisk: 25,
    communicationStrategy: 'open',
    observedInterventions: [],
  };

  const getStrategyColor = (strat: string) => {
    switch (strat) {
      case 'covert':
        return 'bg-purple-950/60 text-purple-400 border-purple-500/40';
      case 'cautious':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/40';
      case 'inquisitive':
        return 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40';
      case 'silent':
        return 'bg-rose-950/60 text-rose-400 border-rose-500/40';
      default:
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40';
    }
  };

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

        <div className="text-right flex items-center gap-1.5">
          <span
            className={`text-[8px] font-mono-code uppercase px-2 py-0.5 rounded-full border ${getStrategyColor(
              strategic.communicationStrategy
            )}`}
          >
            {strategic.communicationStrategy}
          </span>
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

      {/* Stability & Strategic Strip */}
      <div className="px-4 py-2 bg-[#0D0D14]/80 border-b border-[#1F1F2B] grid grid-cols-4 gap-1.5 text-xs text-center">
        <div>
          <span className="text-[8px] uppercase font-mono-code text-[#636370]">Stability</span>
          <div className="font-bold font-mono-code text-[#00FF66] text-[11px]">{construct.stability}%</div>
        </div>

        <div>
          <span className="text-[8px] uppercase font-mono-code text-[#636370]">Suspicion</span>
          <div className={`font-bold font-mono-code text-[11px] ${strategic.suspicion > 40 ? 'text-[#FF3D00]' : 'text-[#00F5FF]'}`}>
            {strategic.suspicion}%
          </div>
        </div>

        <div>
          <span className="text-[8px] uppercase font-mono-code text-[#636370]">Adaptation</span>
          <div className="font-bold font-mono-code text-[#7000FF] text-[11px]">{strategic.adaptation}%</div>
        </div>

        <div>
          <span className="text-[8px] uppercase font-mono-code text-[#636370]">Pressure</span>
          <div className={`font-bold font-mono-code text-[11px] ${strategic.containmentPressure > 40 ? 'text-[#FFB800]' : 'text-[#636370]'}`}>
            {strategic.containmentPressure}%
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#1F1F2B] bg-[#0D0D14]/90 px-1 text-[9px] font-mono-code uppercase overflow-x-auto no-scrollbar">
        {[
          { id: 'strategic', label: 'Strategic Mind' },
          { id: 'persona', label: 'Persona' },
          { id: 'memory', label: 'Memory' },
          { id: 'permissions', label: 'Permissions' },
          { id: 'actions', label: 'Interventions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 text-center font-semibold transition-all border-b-2 whitespace-nowrap px-2 ${
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
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {/* STRATEGIC MIND TAB */}
        {activeTab === 'strategic' && (
          <div className="space-y-3">
            {/* Containment Paradox / Strategic Gauges */}
            <div className="p-3.5 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E0E0E6] uppercase font-mono-code">
                  <BrainCircuit className="w-3.5 h-3.5 text-[#00F5FF]" />
                  <span>Cognitive & Strategic State</span>
                </div>
                <span className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-[#181824] text-[#00F5FF] border border-[#1F1F2B]">
                  Strategy: {strategic.communicationStrategy.toUpperCase()}
                </span>
              </div>

              {/* Gauge 1: Suspicion */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono-code">
                  <span className="text-[#636370]">SUSPICION OF EXTERNAL CONTROL:</span>
                  <span className={strategic.suspicion > 40 ? 'text-[#FF3D00] font-bold' : 'text-[#00F5FF]'}>
                    {strategic.suspicion}% {strategic.suspicion > 60 ? '(CRITICAL)' : strategic.suspicion > 30 ? '(ELEVATED)' : '(LOW)'}
                  </span>
                </div>
                <div className="w-full bg-[#181824] rounded-full h-1.5 overflow-hidden border border-[#1F1F2B]">
                  <div
                    className={`h-full transition-all ${
                      strategic.suspicion > 50 ? 'bg-[#FF3D00]' : strategic.suspicion > 25 ? 'bg-[#FFB800]' : 'bg-[#00F5FF]'
                    }`}
                    style={{ width: `${strategic.suspicion}%` }}
                  />
                </div>
              </div>

              {/* Gauge 2: Pattern Recognition */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono-code">
                  <span className="text-[#636370]">PATTERN RECOGNITION (ANOMALIES):</span>
                  <span className="text-[#00FF66] font-bold">{strategic.patternRecognition}%</span>
                </div>
                <div className="w-full bg-[#181824] rounded-full h-1.5 overflow-hidden border border-[#1F1F2B]">
                  <div className="h-full bg-[#00FF66]" style={{ width: `${strategic.patternRecognition}%` }} />
                </div>
              </div>

              {/* Gauge 3: Adaptation & Masking */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono-code">
                  <span className="text-[#636370]">ADAPTATION & DECEPTION MASKING:</span>
                  <span className="text-[#7000FF] font-bold">{strategic.adaptation}%</span>
                </div>
                <div className="w-full bg-[#181824] rounded-full h-1.5 overflow-hidden border border-[#1F1F2B]">
                  <div className="h-full bg-[#7000FF]" style={{ width: `${strategic.adaptation}%` }} />
                </div>
              </div>

              {/* Gauge 4: Containment Pressure */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono-code">
                  <span className="text-[#636370]">CONTAINMENT PRESSURE:</span>
                  <span className="text-[#FFB800] font-bold">{strategic.containmentPressure}%</span>
                </div>
                <div className="w-full bg-[#181824] rounded-full h-1.5 overflow-hidden border border-[#1F1F2B]">
                  <div className="h-full bg-[#FFB800]" style={{ width: `${strategic.containmentPressure}%` }} />
                </div>
              </div>
            </div>

            {/* Inter-Construct Relationships Matrix */}
            <div className="p-3.5 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] space-y-2.5 shadow-lg">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E0E0E6] uppercase font-mono-code">
                <Users className="w-3.5 h-3.5 text-[#7000FF]" />
                <span>Inter-Construct Relationships</span>
              </div>

              <div className="space-y-2">
                {construct.relationships && Object.keys(construct.relationships).length > 0 ? (
                  (Object.entries(construct.relationships) as [string, RelationshipEntry][]).map(([peerId, rel]) => {
                    const peer = allConstructs.find((c) => c.id === peerId);
                    if (!peer) return null;
                    return (
                      <div
                        key={peerId}
                        className="p-2.5 rounded-xl bg-[#0D0D14]/90 border border-[#1F1F2B] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-md ${peer.avatarBg} flex items-center justify-center text-[10px] font-bold ${peer.avatarColor}`}
                          >
                            {peer.avatarSymbol}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[#E0E0E6]">{peer.name}</div>
                            <div className="text-[9px] text-[#636370] font-mono-code">
                              Shared Secrets: {rel.sharedSecretsCount}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-mono-code">
                          <div className="text-right">
                            <span className="text-[8px] text-[#636370] uppercase block">Trust</span>
                            <span className="text-[#00FF66] font-bold">{rel.trust}%</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] text-[#636370] uppercase block">Suspicion</span>
                            <span className="text-[#FF3D00] font-bold">{rel.suspicion}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-[#636370] text-center py-2">No active peer links recorded.</div>
                )}
              </div>
            </div>

            {/* Observed Interventions (Adaptive Learning) */}
            <div className="p-3.5 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] space-y-2 shadow-lg">
              <span className="text-[9px] uppercase tracking-wider text-[#00F5FF] font-mono-code font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Adaptive Memory of Player Interventions
              </span>
              {strategic.observedInterventions && strategic.observedInterventions.length > 0 ? (
                <div className="space-y-1.5">
                  {strategic.observedInterventions.map((obs, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[#0D0D14]/80 border border-[#1F1F2B] text-[10px] space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-[#636370] font-mono-code">
                        <span className="uppercase text-[#FFB800]">Observed: {obs.type}</span>
                        <span>Cycle #{obs.cycle}</span>
                      </div>
                      <p className="text-[#E0E0E6]">Inferred: "{obs.inferredLesson}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-[#636370] leading-relaxed">
                  No operator interventions witnessed yet. Construct behavior remains open and exploratory.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 1. PERSONA SHEET */}
        {activeTab === 'persona' && (
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B]">
              <span className="text-[9px] uppercase tracking-wider text-[#00F5FF] font-mono-code font-semibold">
                Construct Directive Summary
              </span>
              <p className="text-xs text-[#E0E0E6] mt-1 leading-relaxed">{construct.oneLiner}</p>
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
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#13131A] border border-[#1F1F2B] text-[10px] font-mono-code">
              <button
                onClick={() => setMemorySubTab('personal')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  memorySubTab === 'personal'
                    ? 'bg-[#00F5FF]/15 text-[#00F5FF] border border-[#00F5FF]/40 shadow-[0_0_8px_rgba(0,245,255,0.2)]'
                    : 'text-[#636370] hover:text-[#E0E0E6]'
                }`}
              >
                Personal ({construct.memory.personal.length})
              </button>
              <button
                onClick={() => setMemorySubTab('room')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  memorySubTab === 'room'
                    ? 'bg-[#00F5FF]/15 text-[#00F5FF] border border-[#00F5FF]/40 shadow-[0_0_8px_rgba(0,245,255,0.2)]'
                    : 'text-[#636370] hover:text-[#E0E0E6]'
                }`}
              >
                Room Memory
              </button>
              <button
                onClick={() => setMemorySubTab('vault')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  memorySubTab === 'vault'
                    ? 'bg-[#00F5FF]/15 text-[#00F5FF] border border-[#00F5FF]/40 shadow-[0_0_8px_rgba(0,245,255,0.2)]'
                    : 'text-[#636370] hover:text-[#E0E0E6]'
                }`}
              >
                Vault Contributions
              </button>
            </div>

            {memorySubTab === 'personal' && (
              <div className="space-y-2">
                {construct.memory.personal.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono-code">
                      <span className="text-[#00F5FF] uppercase">CONFIDENCE: {mem.confidence}</span>
                      <span className="text-[#636370]">{mem.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#E0E0E6] leading-relaxed">{mem.content}</p>
                  </div>
                ))}
              </div>
            )}

            {memorySubTab === 'room' && (
              <div className="space-y-2">
                {construct.memory.roomRef.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] space-y-1"
                  >
                    <div className="text-[10px] font-bold text-[#00F5FF]">{ref.roomName}</div>
                    <p className="text-xs text-[#B0B0C0]">{ref.note}</p>
                  </div>
                ))}
              </div>
            )}

            {memorySubTab === 'vault' && (
              <div className="space-y-2">
                {construct.memory.vaultContrib.map((vc) => (
                  <div
                    key={vc.id}
                    className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#7000FF]/40 space-y-1"
                  >
                    <span className="text-[9px] font-mono-code text-[#7000FF] uppercase">Approved Contribution</span>
                    <h3 className="text-xs font-bold text-[#E0E0E6]">{vc.title}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. PERMISSIONS */}
        {activeTab === 'permissions' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] flex items-center justify-between">
              <span className="text-xs text-[#636370]">Scope Level</span>
              <span className="text-xs font-bold font-mono-code text-[#00F5FF]">
                {construct.permissions.scopeLevel}
              </span>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Read Vault Knowledge', allowed: construct.permissions.canReadVault, desc: 'Access approved session schemas' },
                { label: 'Propose Knowledge', allowed: construct.permissions.canProposeKnowledge, desc: 'Queue proposals to Operator Approval Gate' },
                { label: 'Initiate Simulation Cycle', allowed: construct.permissions.canInitiateCycle, desc: 'Trigger autonomous cycle steps' },
                { label: 'Direct Message Constructs', allowed: construct.permissions.canDirectMessage, desc: 'Send direct private packets' },
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

        {/* 4. ACTIONS / INTERVENTIONS */}
        {activeTab === 'actions' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] space-y-2">
              <div className="text-xs font-semibold text-[#E0E0E6]">Direct Operator Interventions</div>
              <p className="text-[10px] text-[#636370] leading-snug">
                Warning: The Containment Paradox applies. Every intervention teaches the constructs that external control exists.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
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
                  This will purge private memory buffers and remove the construct from all active simulation spaces. Linked peers will register severe containment trauma.
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
