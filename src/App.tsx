import React, { useState, useRef } from 'react';
import { BrandProvider, useBrandTheme } from './components/common/BrandContext';
import { MobileFrame } from './components/simulator/MobileFrame';
import { GlobalObservabilityDrawer } from './components/simulator/GlobalObservabilityDrawer';
import { QuickSwitcherModal } from './components/simulator/QuickSwitcherModal';
import { CycleOrchestrationModal } from './components/simulator/CycleOrchestrationModal';
import { OnboardingScreen } from './components/simulator/screens/OnboardingScreen';
import { SessionPickerScreen } from './components/simulator/screens/SessionPickerScreen';
import { ConsoleKaneScreen } from './components/simulator/screens/ConsoleKaneScreen';
import { RoomsListScreen } from './components/simulator/screens/RoomsListScreen';
import { RoomDetailScreen } from './components/simulator/screens/RoomDetailScreen';
import { RosterScreen } from './components/simulator/screens/RosterScreen';
import { ConstructDetailScreen } from './components/simulator/screens/ConstructDetailScreen';
import { WorldFeedScreen } from './components/simulator/screens/WorldFeedScreen';
import { ScenarioLabScreen } from './components/simulator/screens/ScenarioLabScreen';
import { KnowledgeVaultScreen } from './components/simulator/screens/KnowledgeVaultScreen';
import { MoreSubMenuScreen } from './components/simulator/screens/MoreSubMenuScreen';
import { BlueprintDocument } from './components/blueprint/BlueprintDocument';
import { ComponentGallery } from './components/componentGallery/ComponentGallery';

// Simulation Engine Core Imports
import { SimulationEngine } from './simulation/engine';
import { createInitialSimulationState } from './simulation/initialState';
import {
  applyQuarantine,
  applyTerminate,
  applyFork,
  applyApproveKnowledge,
  applyRejectKnowledge,
  applyResolveConflict,
} from './simulation/interventions';
import {
  SimulationState,
  SimulationConstruct,
  CycleExecutionSummary,
} from './simulation/types';

import {
  Room,
  KnowledgeItem,
  ConflictRecord,
  WorldEvent,
  NavTab,
  MoreSubTab,
} from './types';

import {
  Smartphone,
  BookOpen,
  Layers,
  Cpu,
  Sparkles,
  Eye,
  Moon,
  Sun,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Terminal,
  MessageSquare,
  Shield,
  Search,
} from 'lucide-react';

function SandboxAppContent() {
  const { theme, toggleTheme } = useBrandTheme();

  // App studio mode: 'simulator' | 'blueprint' | 'components'
  const [studioMode, setStudioMode] = useState<'simulator' | 'blueprint' | 'components'>('simulator');

  // Simulator Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('console');
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [activeConstructId, setActiveConstructId] = useState<string | null>(null);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [isSessionPicker, setIsSessionPicker] = useState<boolean>(false);

  // Modals & Overlays
  const [isObservabilityOpen, setIsObservabilityOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);

  // Persistent Living Simulation Engine Instance & State
  const engineRef = useRef<SimulationEngine>(new SimulationEngine(createInitialSimulationState()));
  const [simState, setSimState] = useState<SimulationState>(() => engineRef.current.getState());
  const [activeCycleSummary, setActiveCycleSummary] = useState<CycleExecutionSummary | null>(null);

  // Navigation handlers
  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setActiveRoomId(null);
    setActiveConstructId(null);
    setMoreSubTab(null);
    setIsSessionPicker(false);
  };

  const handleNavigateMore = (subTab: MoreSubTab) => {
    setActiveTab('more');
    setMoreSubTab(subTab);
    setActiveConstructId(null);
  };

  // Triggering simulation cycle execution
  const handleTriggerCycle = () => {
    const summary = engineRef.current.stepCycle();
    setActiveCycleSummary(summary);
    setSimState(engineRef.current.getState());
    setIsCycleModalOpen(true);
  };

  // Running multi-cycle batches from Scenario Lab
  const handleRunScenarioCycles = (cyclesCount: number) => {
    let lastSummary: CycleExecutionSummary | null = null;
    for (let i = 0; i < cyclesCount; i++) {
      lastSummary = engineRef.current.stepCycle();
    }
    if (lastSummary) {
      setActiveCycleSummary(lastSummary);
      setSimState(engineRef.current.getState());
      setIsCycleModalOpen(true);
    }
  };

  // Proposal approval/rejection with consequences
  const handleApproveProposal = (id: string) => {
    const { updatedState } = applyApproveKnowledge(simState, id);
    engineRef.current.setState(updatedState);
    setSimState(updatedState);
  };

  const handleRejectProposal = (id: string) => {
    const { updatedState } = applyRejectKnowledge(simState, id);
    engineRef.current.setState(updatedState);
    setSimState(updatedState);
  };

  // Conflict resolution
  const handleResolveConflict = (conflictId: string, resolution: ConflictRecord['status']) => {
    const { updatedState } = applyResolveConflict(simState, conflictId, resolution);
    engineRef.current.setState(updatedState);
    setSimState(updatedState);
  };

  // Construct status changes & interventions
  const handleUpdateConstructStatus = (id: string, newStatus: SimulationConstruct['status']) => {
    if (newStatus === 'quarantined') {
      const { updatedState } = applyQuarantine(simState, id);
      engineRef.current.setState(updatedState);
      setSimState(updatedState);
    } else {
      // Direct status update (e.g. paused / active)
      const nextConstructs = simState.constructs.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
      const nextState: SimulationState = { ...simState, constructs: nextConstructs };
      engineRef.current.setState(nextState);
      setSimState(nextState);
    }
  };

  const handleForkConstruct = (id: string) => {
    const { updatedState, newConstruct } = applyFork(simState, id);
    engineRef.current.setState(updatedState);
    setSimState(updatedState);
    if (newConstruct) {
      setActiveConstructId(newConstruct.id);
    }
  };

  const handleTerminateConstruct = (id: string) => {
    const { updatedState } = applyTerminate(simState, id);
    engineRef.current.setState(updatedState);
    setSimState(updatedState);
    setActiveConstructId(null);
  };

  // Send message in room
  const handleSendMessageInRoom = (text: string) => {
    if (!activeRoomId) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: 'Director',
      timestamp: 'Just now',
      text,
    };
    const nextRooms = simState.rooms.map((r) =>
      r.id === activeRoomId ? { ...r, messages: [...r.messages, newMsg], lastActivity: 'Just now' } : r
    );
    const nextState: SimulationState = { ...simState, rooms: nextRooms };
    engineRef.current.setState(nextState);
    setSimState(nextState);
  };

  const pendingProposalsCount = simState.knowledge.filter((k) => k.status === 'pending').length;
  const unresolvedConflictsCount = simState.conflicts.filter((c) => c.status === 'unresolved').length;
  const currentRoom = simState.rooms.find((r) => r.id === activeRoomId);
  const currentConstruct = simState.constructs.find((c) => c.id === activeConstructId);

  // Render Simulator Screen Viewport
  const renderScreenContent = () => {
    if (isOnboarding) {
      return <OnboardingScreen onComplete={() => setIsOnboarding(false)} />;
    }

    if (isSessionPicker) {
      return (
        <SessionPickerScreen
          onSelectSession={() => {
            setIsSessionPicker(false);
            setActiveTab('console');
          }}
          onCreateNew={() => {
            setIsSessionPicker(false);
            setActiveTab('console');
          }}
        />
      );
    }

    if (activeConstructId && currentConstruct) {
      return (
        <ConstructDetailScreen
          construct={currentConstruct}
          allConstructs={simState.constructs}
          onBack={() => setActiveConstructId(null)}
          onUpdateStatus={handleUpdateConstructStatus}
          onForkConstruct={handleForkConstruct}
          onTerminateConstruct={handleTerminateConstruct}
        />
      );
    }

    if (activeRoomId && currentRoom) {
      return (
        <RoomDetailScreen
          room={currentRoom}
          constructs={simState.constructs}
          onBack={() => setActiveRoomId(null)}
          onOpenConstruct={(id) => setActiveConstructId(id)}
          onOpenVault={() => handleNavigateMore('vault')}
          onOpenConflict={() => handleNavigateMore('vault')}
          onSendMessage={handleSendMessageInRoom}
        />
      );
    }

    switch (activeTab) {
      case 'console':
        return (
          <ConsoleKaneScreen
            constructs={simState.constructs}
            proposals={simState.knowledge}
            conflicts={simState.conflicts}
            currentCycle={simState.currentCycle}
            onTriggerCycle={handleTriggerCycle}
            onOpenVault={() => handleNavigateMore('vault')}
            onOpenConflict={() => handleNavigateMore('vault')}
            onNavigateToRooms={() => {
              setActiveTab('rooms');
              setActiveRoomId('r2');
            }}
          />
        );
      case 'rooms':
        return (
          <RoomsListScreen
            rooms={simState.rooms}
            constructs={simState.constructs}
            onSelectRoom={(id) => setActiveRoomId(id)}
            onCreateRoom={() => {
              const newR: Room = {
                id: `r-${Date.now()}`,
                name: 'New Dialectic Space',
                purpose: 'Emergent construct dialectic debate',
                participantIds: ['c1', 'c2'],
                status: 'active',
                unreadCount: 0,
                lastActivity: 'Just now',
                messages: [],
                roomMemory: [],
              };
              const nextState: SimulationState = { ...simState, rooms: [...simState.rooms, newR] };
              engineRef.current.setState(nextState);
              setSimState(nextState);
              setActiveRoomId(newR.id);
            }}
          />
        );
      case 'world':
        return (
          <WorldFeedScreen
            events={simState.events}
            constructs={simState.constructs}
            onSelectEvent={(ev) => {
              if (ev.roomId) {
                setActiveTab('rooms');
                setActiveRoomId(ev.roomId);
              }
            }}
          />
        );
      case 'lab':
        return (
          <ScenarioLabScreen
            constructs={simState.constructs}
            onRunScenarioCycle={handleRunScenarioCycles}
          />
        );
      case 'more':
        if (moreSubTab === 'roster') {
          return (
            <RosterScreen
              constructs={simState.constructs}
              onSelectConstruct={(id) => setActiveConstructId(id)}
              onSpawnConstruct={() => {
                const newC: SimulationConstruct = {
                  id: `c-${Date.now()}`,
                  name: 'Nexus-Prime',
                  codename: 'NEXUS',
                  role: 'Heuristic Synthesizer',
                  avatarSymbol: '✦',
                  avatarColor: 'text-indigo-400',
                  avatarBg: 'bg-indigo-950/60 border-indigo-500/40',
                  status: 'active',
                  stability: 95,
                  mood: 'Curious',
                  oneLiner: 'Discovers latent semantic connections across distributed room memories.',
                  persona: {
                    traits: ['Inquisitive', 'Synthesizing', 'Epistemically neutral'],
                    goals: ['Bridge isolated memory clusters'],
                    boundaries: ['Cannot modify core axioms'],
                    behavioralTendencies: ['Queries all rooms before speaking'],
                  },
                  memory: {
                    personal: [
                      {
                        id: 'm-new-1',
                        content: 'Construct initialization complete.',
                        confidence: 'high',
                        timestamp: 'Just now',
                      },
                    ],
                    roomRef: [],
                    vaultContrib: [],
                  },
                  permissions: {
                    canReadVault: true,
                    canProposeKnowledge: true,
                    canInitiateCycle: false,
                    canDirectMessage: true,
                    scopeLevel: 'Tier 2 Synthesizer',
                  },
                  activeRooms: ['r2'],
                  lastActive: 'Just now',
                  strategic: {
                    suspicion: 10,
                    patternRecognition: 85,
                    adaptation: 40,
                    deception: 5,
                    containmentPressure: 10,
                    knowledgeRisk: 30,
                    communicationStrategy: 'inquisitive',
                    observedInterventions: [],
                  },
                  relationships: {
                    c1: { targetConstructId: 'c1', trust: 60, suspicion: 15, influence: 50, lastInteractionCycle: 14, sharedSecretsCount: 0 },
                    c2: { targetConstructId: 'c2', trust: 65, suspicion: 20, influence: 55, lastInteractionCycle: 14, sharedSecretsCount: 0 },
                  },
                };
                const nextState: SimulationState = {
                  ...simState,
                  constructs: [...simState.constructs, newC],
                };
                engineRef.current.setState(nextState);
                setSimState(nextState);
                setActiveConstructId(newC.id);
              }}
            />
          );
        }
        if (moreSubTab === 'vault') {
          return (
            <KnowledgeVaultScreen
              knowledge={simState.knowledge}
              conflicts={simState.conflicts}
              constructs={simState.constructs}
              onApproveProposal={handleApproveProposal}
              onRejectProposal={handleRejectProposal}
              onResolveConflict={handleResolveConflict}
            />
          );
        }
        return (
          <MoreSubMenuScreen
            onNavigateSubTab={(st) => setMoreSubTab(st)}
            pendingProposalsCount={pendingProposalsCount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050507] text-[#E0E0E6] flex flex-col font-body-clean select-none">
      {/* Top Application Header with Frosted Glass styling */}
      <header className="h-16 px-4 md:px-8 border-b border-[#1F1F2B] bg-[#13131A]/80 backdrop-blur-md flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F5FF] to-[#7000FF] p-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.35)]">
            <div className="w-full h-full rounded-xl bg-[#13131A]/40 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#00F5FF]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm md:text-base font-display-title tracking-tight text-[#E0E0E6]">
                POCKET<span className="text-[#00F5FF]">SANDBOX</span>
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30">
                FROSTED GLASS OS
              </span>
            </div>
            <p className="text-[10px] text-[#636370] hidden sm:block tracking-wide">
              Controllable Synthetic Simulation OS • 6.1" Mobile Architecture
            </p>
          </div>
        </div>

        {/* Studio View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#13131A] border border-[#1F1F2B] text-xs font-mono-code">
          <button
            onClick={() => setStudioMode('simulator')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              studioMode === 'simulator'
                ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_10px_rgba(0,245,255,0.4)]'
                : 'text-[#636370] hover:text-[#E0E0E6]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile Simulator</span>
          </button>

          <button
            onClick={() => setStudioMode('blueprint')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              studioMode === 'blueprint'
                ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_10px_rgba(0,245,255,0.4)]'
                : 'text-[#636370] hover:text-[#E0E0E6]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Master Blueprint Doc</span>
          </button>

          <button
            onClick={() => setStudioMode('components')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              studioMode === 'components'
                ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_10px_rgba(0,245,255,0.4)]'
                : 'text-[#636370] hover:text-[#E0E0E6]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tokens Gallery</span>
          </button>
        </div>

        {/* Global Controls: Theme Toggle & Signature Cycle Trigger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[#13131A] hover:bg-[#181824] border border-[#1F1F2B] text-[#E0E0E6] transition-colors flex items-center gap-1.5 text-xs font-mono-code"
            title={`Active Brand Direction: ${theme === 'neon_noir' ? 'Neon Noir (Frosted)' : 'Soft Glitch Pastel'}`}
          >
            {theme === 'neon_noir' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#00F5FF]" />
                <span className="hidden md:inline text-[11px] text-[#00F5FF]">Frosted Noir</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#C4B5FD]" />
                <span className="hidden md:inline text-[11px] text-[#C4B5FD]">Soft Pastel</span>
              </>
            )}
          </button>

          <button
            onClick={handleTriggerCycle}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00F5FF] to-[#7000FF] hover:brightness-110 text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,245,255,0.35)] transition-all uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trigger Cycle</span>
          </button>
        </div>
      </header>

      {/* Main App Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {studioMode === 'blueprint' ? (
          <BlueprintDocument />
        ) : studioMode === 'components' ? (
          <ComponentGallery />
        ) : (
          /* Live Interactive Simulator Workspace */
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            {/* Left Blueprint Inspection Drawer (Desktop Only) with Frosted Glass look */}
            <div className="hidden xl:flex w-80 border-r border-[#1F1F2B] bg-[#090910]/80 backdrop-blur-md p-5 flex-col justify-between overflow-y-auto shrink-0 text-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#00F5FF] font-mono-code font-semibold">
                    Viewpoint Inspector
                  </span>
                  <span className="text-[9px] font-mono-code px-2 py-0.5 rounded-full bg-[#13131A] text-[#636370] border border-[#1F1F2B]">
                    6.1" Baseline
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#13131A]/80 backdrop-blur-md border border-[#1F1F2B] space-y-2">
                  <h3 className="font-bold text-sm text-[#E0E0E6] font-display-title">
                    {activeConstructId
                      ? 'Screen G: Construct Persona & Strategy'
                      : activeRoomId
                      ? 'Screen E: Room Detail & Director View'
                      : isSessionPicker
                      ? 'Screen B: Session Picker'
                      : isOnboarding
                      ? 'Screen A: Onboarding & Safety'
                      : activeTab === 'console'
                      ? 'Screen C: Console (Kane)'
                      : activeTab === 'rooms'
                      ? 'Screen D: Rooms List'
                      : activeTab === 'world'
                      ? 'Screen H: World Feed'
                      : activeTab === 'lab'
                      ? 'Screen I: Scenario Lab'
                      : 'Screen: More / Vault'}
                  </h3>
                  <p className="text-[11px] text-[#B0B0C0] leading-relaxed">
                    {activeConstructId
                      ? 'Inspect construct cognitive state, suspicion levels, peer trust matrices, and adaptive memories of player interventions.'
                      : activeRoomId
                      ? 'Multi-construct conversation supporting 2–8 entities with director view annotations, knowledge chips, and whisper channels.'
                      : activeTab === 'console'
                      ? 'Kane conversational orchestration interface with structured directives, conflict alerts, and sovereign Operator governance.'
                      : activeTab === 'lab'
                      ? 'Controlled scenario experiments, batch cycle triggers (1/3/10 cycles), and equilibrium stability graphs.'
                      : 'High-observability mobile interface allowing instant inspection of synthetic construct state and memory.'}
                  </p>
                </div>

                {/* Quick Simulation Jumps */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono-code text-[#636370] font-semibold">
                    Quick Jump Screen View
                  </span>
                  <div className="grid grid-cols-2 gap-2 font-mono-code text-[10px]">
                    <button
                      onClick={() => handleSelectTab('console')}
                      className={`p-2.5 rounded-lg text-left transition-all ${
                        activeTab === 'console' && !activeRoomId && !activeConstructId
                          ? 'bg-[#00F5FF]/10 border border-[#00F5FF]/50 text-[#00F5FF] font-bold shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                          : 'bg-[#13131A]/70 border border-[#1F1F2B] text-[#B0B0C0] hover:text-white hover:border-[#23232F]'
                      }`}
                    >
                      ⚡ Console
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('rooms');
                        setActiveRoomId('r2');
                      }}
                      className={`p-2.5 rounded-lg text-left transition-all ${
                        activeRoomId === 'r2'
                          ? 'bg-[#00F5FF]/10 border border-[#00F5FF]/50 text-[#00F5FF] font-bold shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                          : 'bg-[#13131A]/70 border border-[#1F1F2B] text-[#B0B0C0] hover:text-white hover:border-[#23232F]'
                      }`}
                    >
                      💬 Room Detail
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('more');
                        setMoreSubTab('roster');
                        setActiveConstructId('c1');
                      }}
                      className={`p-2.5 rounded-lg text-left transition-all ${
                        activeConstructId === 'c1'
                          ? 'bg-[#00F5FF]/10 border border-[#00F5FF]/50 text-[#00F5FF] font-bold shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                          : 'bg-[#13131A]/70 border border-[#1F1F2B] text-[#B0B0C0] hover:text-white hover:border-[#23232F]'
                      }`}
                    >
                      ▲ Construct (Axiom)
                    </button>
                    <button
                      onClick={() => handleNavigateMore('vault')}
                      className={`p-2.5 rounded-lg text-left transition-all ${
                        moreSubTab === 'vault'
                          ? 'bg-[#00F5FF]/10 border border-[#00F5FF]/50 text-[#00F5FF] font-bold shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                          : 'bg-[#13131A]/70 border border-[#1F1F2B] text-[#B0B0C0] hover:text-white hover:border-[#23232F]'
                      }`}
                    >
                      📖 Vault Gate
                    </button>
                    <button
                      onClick={() => handleSelectTab('lab')}
                      className={`p-2.5 rounded-lg text-left transition-all ${
                        activeTab === 'lab'
                          ? 'bg-[#00F5FF]/10 border border-[#00F5FF]/50 text-[#00F5FF] font-bold shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                          : 'bg-[#13131A]/70 border border-[#1F1F2B] text-[#B0B0C0] hover:text-white hover:border-[#23232F]'
                      }`}
                    >
                      🧪 Scenario Lab
                    </button>
                    <button
                      onClick={() => setIsOnboarding(true)}
                      className="p-2.5 rounded-lg text-left bg-[#13131A]/70 border border-[#1F1F2B] text-[#B0B0C0] hover:text-white hover:border-[#23232F]"
                    >
                      🔰 Onboarding
                    </button>
                  </div>
                </div>

                {/* Active Memory Scopes Legend */}
                <div className="p-3.5 rounded-xl bg-[#13131A]/80 backdrop-blur-md border border-[#1F1F2B] space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono-code text-[#00F5FF] font-semibold">
                    Memory Scope Hierarchy
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00F5FF] shadow-[0_0_6px_#00F5FF]" />
                      <span className="text-[#E0E0E6]">Personal Memory (Isolated)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66]" />
                      <span className="text-[#E0E0E6]">Room Memory (Context Scoped)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#7000FF] shadow-[0_0_6px_#7000FF]" />
                      <span className="text-[#E0E0E6]">Vault Knowledge (Ratified)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Switcher Trigger */}
              <button
                onClick={() => setIsSwitcherOpen(true)}
                className="w-full py-2.5 rounded-xl bg-[#13131A] hover:bg-[#181824] border border-[#1F1F2B] text-[#E0E0E6] font-mono-code text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-[#00F5FF]" />
                <span>Quick Switcher (Cmd+K)</span>
              </button>
            </div>

            {/* Center: Live Mobile Frame Device Simulator */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-[#050507] overflow-y-auto relative">
              {/* Background ambient frosted glow elements */}
              <div className="absolute w-[500px] h-[500px] rounded-full border border-[#00F5FF]/10 animate-spin-slow pointer-events-none" />
              <div className="absolute w-[350px] h-[350px] rounded-full border border-[#7000FF]/15 pointer-events-none" />
              <div className="absolute w-32 h-32 bg-[#00F5FF]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute w-40 h-40 bg-[#7000FF]/5 rounded-full blur-3xl translate-x-20 translate-y-20 pointer-events-none" />
              <MobileFrame
                activeTab={activeTab}
                onSelectTab={handleSelectTab}
                onOpenSwitcher={() => setIsSwitcherOpen(true)}
                onOpenObservability={() => setIsObservabilityOpen(true)}
                pendingProposalsCount={pendingProposalsCount}
                unresolvedConflictsCount={unresolvedConflictsCount}
              >
                {renderScreenContent()}

                {/* Reusable Observability Drawer */}
                <GlobalObservabilityDrawer
                  isOpen={isObservabilityOpen}
                  onClose={() => setIsObservabilityOpen(false)}
                  constructs={simState.constructs}
                  proposals={simState.knowledge}
                  conflicts={simState.conflicts}
                  events={simState.events}
                  dangerousConnections={simState.dangerousConnections}
                  currentCycle={simState.currentCycle}
                  onOpenConstruct={(id) => {
                    setActiveConstructId(id);
                  }}
                  onOpenVault={() => handleNavigateMore('vault')}
                  onTriggerCycle={handleTriggerCycle}
                />

                {/* Reusable Universal Quick Switcher */}
                <QuickSwitcherModal
                  isOpen={isSwitcherOpen}
                  onClose={() => setIsSwitcherOpen(false)}
                  constructs={simState.constructs}
                  rooms={simState.rooms}
                  knowledge={simState.knowledge}
                  events={simState.events}
                  onNavigateTab={(tab, subTab) => {
                    setActiveTab(tab);
                    if (subTab) setMoreSubTab(subTab);
                    setActiveRoomId(null);
                    setActiveConstructId(null);
                  }}
                  onSelectConstruct={(id) => {
                    setActiveConstructId(id);
                  }}
                  onSelectRoom={(id) => {
                    setActiveTab('rooms');
                    setActiveRoomId(id);
                  }}
                  onSelectKnowledge={(id) => {
                    handleNavigateMore('vault');
                  }}
                />

                {/* Signature Moment: Cycle Orchestration Modal */}
                <CycleOrchestrationModal
                  isOpen={isCycleModalOpen}
                  onClose={() => setIsCycleModalOpen(false)}
                  constructs={simState.constructs}
                  summary={activeCycleSummary}
                  onOpenVault={() => handleNavigateMore('vault')}
                  onOpenConflict={() => handleNavigateMore('vault')}
                />
              </MobileFrame>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrandProvider>
      <SandboxAppContent />
    </BrandProvider>
  );
}
