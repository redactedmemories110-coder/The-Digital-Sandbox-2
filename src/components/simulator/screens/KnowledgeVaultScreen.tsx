import React, { useState } from 'react';
import { useBrandTheme } from '../../common/BrandContext';
import { THEME_SPECS } from '../../../utils/themeTokens';
import { KnowledgeItem, ConflictRecord, MemoryScope, Construct } from '../../../types';
import { BookOpen, Sparkles, AlertTriangle, Check, X, Edit3, ArrowRight, ShieldCheck, Search, Filter, Layers, Merge } from 'lucide-react';

interface KnowledgeVaultProps {
  knowledge: KnowledgeItem[];
  conflicts: ConflictRecord[];
  constructs: Construct[];
  onApproveProposal: (id: string) => void;
  onRejectProposal: (id: string) => void;
  onResolveConflict: (conflictId: string, resolution: ConflictRecord['status']) => void;
}

export const KnowledgeVaultScreen: React.FC<KnowledgeVaultProps> = ({
  knowledge,
  conflicts,
  constructs,
  onApproveProposal,
  onRejectProposal,
  onResolveConflict,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const [activeTab, setActiveTab] = useState<'approved' | 'proposals' | 'conflicts'>('proposals');
  const [scopeFilter, setScopeFilter] = useState<'all' | MemoryScope>('all');
  const [search, setSearch] = useState('');

  const pendingProposals = knowledge.filter((k) => k.status === 'pending');
  const approvedKnowledge = knowledge.filter((k) => k.status === 'approved');
  const activeConflicts = conflicts.filter((c) => c.status === 'unresolved');

  const filteredApproved = approvedKnowledge.filter((k) => {
    const matchesScope = scopeFilter === 'all' || k.scope === scopeFilter;
    const matchesSearch =
      k.title.toLowerCase().includes(search.toLowerCase()) ||
      k.summary.toLowerCase().includes(search.toLowerCase());
    return matchesScope && matchesSearch;
  });

  return (
    <div className={`h-full flex flex-col p-4 ${tokens.bg} text-[#E0E0E6] overflow-y-auto`}>
      {/* Header */}
      <div className="pt-2 pb-3">
        <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#00F5FF]">
          Shared Learning & Epistemic Vault
        </span>
        <h1 className="text-lg font-bold font-display-title text-[#E0E0E6]">
          Knowledge Vault
        </h1>
      </div>

      {/* Main Mode Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#13131A] border border-[#1F1F2B] mb-3 text-[10px] font-mono-code">
        <button
          onClick={() => setActiveTab('proposals')}
          className={`py-2 rounded-lg font-semibold transition-all relative flex items-center justify-center gap-1.5 ${
            activeTab === 'proposals'
              ? 'bg-[#7000FF]/20 text-[#7000FF] border border-[#7000FF]/40 shadow-[0_0_10px_rgba(112,0,255,0.2)]'
              : 'text-[#636370] hover:text-[#E0E0E6]'
          }`}
        >
          <Sparkles className="w-3 h-3 text-[#7000FF]" />
          <span>Approval Gate</span>
          {pendingProposals.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#7000FF] text-white text-[9px] font-bold flex items-center justify-center shadow-[0_0_6px_#7000FF]">
              {pendingProposals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('conflicts')}
          className={`py-2 rounded-lg font-semibold transition-all relative flex items-center justify-center gap-1.5 ${
            activeTab === 'conflicts'
              ? 'bg-[#1A1111] text-[#FF3D00] border border-[#3B1111] shadow-[0_0_10px_rgba(255,61,0,0.2)]'
              : 'text-[#636370] hover:text-[#E0E0E6]'
          }`}
        >
          <AlertTriangle className="w-3 h-3 text-[#FF3D00]" />
          <span>Conflicts</span>
          {activeConflicts.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#FF3D00] text-white text-[9px] font-bold flex items-center justify-center shadow-[0_0_6px_#FF3D00]">
              {activeConflicts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'approved'
              ? 'bg-[#00F5FF]/15 text-[#00F5FF] border border-[#00F5FF]/40 shadow-[0_0_10px_rgba(0,245,255,0.2)]'
              : 'text-[#636370] hover:text-[#E0E0E6]'
          }`}
        >
          <BookOpen className="w-3 h-3 text-[#00F5FF]" />
          <span>Approved ({approvedKnowledge.length})</span>
        </button>
      </div>

      {/* 1. APPROVAL GATE TAB */}
      {activeTab === 'proposals' && (
        <div className="space-y-3 flex-1">
          <div className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] text-[11px] text-[#B0B0C0] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7000FF] shrink-0" />
            <span>
              Synthetic proposals require Operator ratification before entering shared session memory.
            </span>
          </div>

          {pendingProposals.length > 0 ? (
            pendingProposals.map((prop) => (
              <div
                key={prop.id}
                className="p-3.5 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border border-[#7000FF]/40 shadow-lg space-y-2.5"
              >
                {/* Title & Attribution Header */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono-code uppercase px-2 py-0.5 rounded bg-[#7000FF]/15 text-[#7000FF] border border-[#7000FF]/40">
                      Scope: {prop.scope}
                    </span>
                    <span className="text-[9px] font-mono-code text-[#636370]">
                      Confidence: <strong className="text-[#E0E0E6] uppercase">{prop.confidence}</strong>
                    </span>
                  </div>
                  <h2 className="text-xs font-bold text-[#E0E0E6] font-display-title">
                    {prop.title}
                  </h2>
                  <p className="text-[10px] text-[#636370] mt-0.5">
                    Proposed by <span className="text-[#E0E0E6] font-semibold">{prop.attribution.by}</span> from {prop.attribution.sourceRoom}
                  </p>
                </div>

                <p className="text-xs text-[#B0B0C0] leading-relaxed bg-[#0D0D14]/90 p-2.5 rounded-xl border border-[#1F1F2B]">
                  {prop.summary}
                </p>

                {/* Duplicates inspection if applicable */}
                {prop.duplicateSimilarity && (
                  <div className="p-2 rounded-lg bg-[#1A1811] border border-[#3B3411] text-[10px] text-[#FFB800] flex items-start gap-1.5">
                    <Merge className="w-3.5 h-3.5 text-[#FFB800] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase font-mono-code text-[9px]">Similar Schema Detected:</span>
                      <p className="text-[#FFB800]/90">{prop.duplicateSimilarity}</p>
                    </div>
                  </div>
                )}

                {/* Kane Recommendation Box */}
                {prop.kaneRecommendation && (
                  <div className="p-2 rounded-lg bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[10px] text-[#00F5FF] space-y-0.5">
                    <span className="font-bold uppercase font-mono-code text-[9px] text-[#00F5FF]">
                      Kane Recommendation: {prop.kaneRecommendation.toUpperCase()}
                    </span>
                    <p className="text-[#E0E0E6]/90">{prop.kaneRationale}</p>
                  </div>
                )}

                {/* Operator Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1F1F2B]">
                  <button
                    onClick={() => onRejectProposal(prop.id)}
                    className="py-2 rounded-xl bg-[#181824] hover:bg-[#202030] text-[#B0B0C0] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#1F1F2B]"
                  >
                    <X className="w-3.5 h-3.5 text-[#FF3D00]" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => onApproveProposal(prop.id)}
                    className="py-2 rounded-xl bg-[#00FF66] hover:bg-[#33FF85] text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(0,255,102,0.3)]"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve to Vault</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-[#13131A]/60 backdrop-blur-md rounded-2xl border border-[#1F1F2B] space-y-2">
              <Check className="w-8 h-8 text-[#00FF66] mx-auto shadow-[0_0_10px_rgba(0,255,102,0.3)]" />
              <div className="text-xs font-semibold text-[#E0E0E6]">Approval Queue Cleared</div>
              <p className="text-[10px] text-[#636370] max-w-[200px] mx-auto">
                No synthetic knowledge proposals currently awaiting operator decision.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. CONFLICT RESOLUTION TAB */}
      {activeTab === 'conflicts' && (
        <div className="space-y-3 flex-1">
          <div className="p-3 rounded-xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] text-[11px] text-[#B0B0C0] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF3D00] shrink-0" />
            <span>
              Disagreements between constructs are preserved as meaningful simulation information.
            </span>
          </div>

          {activeConflicts.length > 0 ? (
            activeConflicts.map((conf) => (
              <div
                key={conf.id}
                className="p-3.5 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border border-[#3B1111] shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono-code uppercase px-2 py-0.5 rounded bg-[#1A1111] text-[#FF3D00] border border-[#3B1111]">
                    Active Epistemic Conflict
                  </span>
                  <span className="text-[9px] font-mono-code text-[#636370]">{conf.timestamp}</span>
                </div>

                <h2 className="text-xs font-bold text-[#E0E0E6] font-display-title">
                  {conf.title}
                </h2>

                {/* Claim A vs Claim B */}
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#0D0D14] border border-[#3B3411] space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-mono-code">
                      <span className="font-bold text-[#FFB800]">CLAIM A: {conf.claimA.constructName}</span>
                      <span className="text-[#636370]">{conf.claimA.source}</span>
                    </div>
                    <p className="text-xs text-[#E0E0E6]">{conf.claimA.text}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0D0D14] border border-[#7000FF]/40 space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-mono-code">
                      <span className="font-bold text-[#7000FF]">CLAIM B: {conf.claimB.constructName}</span>
                      <span className="text-[#636370]">{conf.claimB.source}</span>
                    </div>
                    <p className="text-xs text-[#E0E0E6]">{conf.claimB.text}</p>
                  </div>
                </div>

                {/* Kane Recommendation */}
                <div className="p-2.5 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[10px] text-[#00F5FF] space-y-1">
                  <span className="font-bold uppercase font-mono-code text-[9px] text-[#00F5FF]">
                    Kane Bridge Recommendation:
                  </span>
                  <p className="text-[#E0E0E6]/90">{conf.kaneRecommendation}</p>
                </div>

                {/* Resolution Action Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1F1F2B]">
                  <button
                    onClick={() => onResolveConflict(conf.id, 'resolved_merged')}
                    className="py-2 rounded-xl bg-[#00F5FF] text-black text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#33F7FF] transition-colors shadow-[0_0_10px_rgba(0,245,255,0.3)]"
                  >
                    <span>Adopt Bridge</span>
                  </button>

                  <button
                    onClick={() => onResolveConflict(conf.id, 'unresolved')}
                    className="py-2 rounded-xl bg-[#181824] text-[#B0B0C0] text-xs font-medium hover:bg-[#202030] transition-colors border border-[#1F1F2B]"
                  >
                    <span>Keep Disputed</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-[#13131A]/60 backdrop-blur-md rounded-2xl border border-[#1F1F2B] space-y-2">
              <Check className="w-8 h-8 text-[#00FF66] mx-auto shadow-[0_0_10px_rgba(0,255,102,0.3)]" />
              <div className="text-xs font-semibold text-[#E0E0E6]">No Epistemic Contradictions</div>
              <p className="text-[10px] text-[#636370] max-w-[200px] mx-auto">
                All active constructs currently operating within mutually consistent ontological bounds.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. APPROVED VAULT KNOWLEDGE */}
      {activeTab === 'approved' && (
        <div className="space-y-3 flex-1">
          {/* Scope Filters & Search */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#13131A] border border-[#1F1F2B] focus-within:border-[#00F5FF]/50 transition-colors">
              <Search className="w-3.5 h-3.5 text-[#636370]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search approved vault schemas..."
                className="flex-1 bg-transparent text-xs text-[#E0E0E6] placeholder:text-[#636370] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(['all', 'vault', 'room', 'personal'] as const).map((sc) => (
                <button
                  key={sc}
                  onClick={() => setScopeFilter(sc)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono-code uppercase tracking-wider transition-all whitespace-nowrap ${
                    scopeFilter === sc
                      ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                      : 'bg-[#13131A] text-[#636370] hover:text-[#E0E0E6] border border-[#1F1F2B]'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredApproved.map((k) => (
              <div
                key={k.id}
                className="p-3.5 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono-code uppercase px-2 py-0.5 rounded bg-[#181824] text-[#00F5FF] border border-[#1F1F2B]">
                    Scope: {k.scope}
                  </span>
                  <span className="text-[9px] font-mono-code text-[#636370]">
                    Confidence: <strong className="text-[#E0E0E6] uppercase">{k.confidence}</strong>
                  </span>
                </div>

                <h2 className="text-xs font-bold text-[#E0E0E6] font-display-title">
                  {k.title}
                </h2>
                <p className="text-xs text-[#B0B0C0] leading-relaxed">
                  {k.summary}
                </p>

                <div className="flex items-center justify-between text-[9px] font-mono-code text-[#636370] pt-1.5 border-t border-[#1F1F2B]">
                  <span>Attribution: <span className="text-[#E0E0E6]">{k.attribution.by}</span></span>
                  <span>{k.attribution.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
