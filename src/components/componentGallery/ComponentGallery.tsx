import React, { useState } from 'react';
import { useBrandTheme } from '../common/BrandContext';
import { THEME_SPECS } from '../../utils/themeTokens';
import { INITIAL_CONSTRUCTS } from '../../data/sandboxData';
import { Sparkles, AlertTriangle, BookOpen, Cpu, ShieldCheck, Play, Plus, Terminal, Check, X, Info } from 'lucide-react';

export const ComponentGallery: React.FC = () => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const [activeChip, setActiveChip] = useState(false);
  const sampleConstruct = INITIAL_CONSTRUCTS[0];

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10 space-y-8 text-neutral-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-2">
        <span className="text-xs font-mono-code uppercase tracking-wider text-cyan-400 font-bold">
          Pocket Sandbox Design System
        </span>
        <h1 className="text-2xl font-bold font-display-title text-white">
          Interactive Components Library (21 Tokens)
        </h1>
        <p className="text-xs text-neutral-400">
          Live tokens and interactive component states rendered using the active theme ({theme === 'neon_noir' ? 'Neon Noir Console' : 'Soft Glitch Pastel'}).
        </p>
      </div>

      {/* Grid of Interactive Component Specimens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* 1. Construct Avatar Tile & Status Ring */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <span className="font-mono-code text-[11px] text-cyan-400 uppercase font-bold">
            01 & 02. Construct Avatar Tile + Status Ring
          </span>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl ${sampleConstruct.avatarBg} border flex items-center justify-center font-bold text-lg ${sampleConstruct.avatarColor} shadow-lg`}>
                {sampleConstruct.avatarSymbol}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black" />
            </div>
            <div>
              <div className="font-bold text-neutral-100 font-display-title">{sampleConstruct.name}</div>
              <div className="text-[11px] text-neutral-400 font-mono-code">Status: Active & Nominal</div>
            </div>
          </div>
        </div>

        {/* 03 & 04. Role Badge & Stability Indicator */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <span className="font-mono-code text-[11px] text-cyan-400 uppercase font-bold">
            03 & 04. Role Badge + Stability Indicator
          </span>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono-code text-[10px]">
                {sampleConstruct.role}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono-code text-[10px]">
                94% STABLE
              </span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: '94%' }} />
            </div>
          </div>
        </div>

        {/* 05 & 11. Mood Indicator & Construct State Chip */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <span className="font-mono-code text-[11px] text-cyan-400 uppercase font-bold">
            05 & 11. Mood Indicator + Construct State Chip
          </span>
          <div className="flex items-center gap-2 flex-wrap font-mono-code text-[10px]">
            <span className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 border border-neutral-700">
              Mood: Methodical
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800">
              State: Synthesizing
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800">
              Disputed
            </span>
          </div>
        </div>

        {/* 08 & 18. Knowledge Card & Expandable Knowledge Chip */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <span className="font-mono-code text-[11px] text-cyan-400 uppercase font-bold">
            08 & 18. Knowledge Card + Interactive Scope Chip
          </span>
          <div
            onClick={() => setActiveChip(!activeChip)}
            className="p-3 rounded-xl bg-neutral-950 border border-cyan-500/40 cursor-pointer hover:border-cyan-400 transition-colors space-y-1"
          >
            <div className="flex items-center justify-between text-[10px] font-mono-code">
              <span className="text-cyan-300 flex items-center gap-1 font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                Vault Invariant Rule 01
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Scope: Vault
              </span>
            </div>
            <p className="text-[11px] text-neutral-300">
              {activeChip ? 'Tap to collapse: Shared session schema requiring operator ratification.' : 'Tap to expand knowledge details & provenance...'}
            </p>
          </div>
        </div>

        {/* 09. Conflict Card */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-rose-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono-code text-[11px] text-rose-400 uppercase font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              09. Conflict Resolution Card
            </span>
            <span className="text-[9px] font-mono-code text-rose-300 bg-rose-950 px-1.5 py-0.5 rounded">
              Active Dispute
            </span>
          </div>
          <div className="text-[11px] text-neutral-300 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
            <strong>Claim A (Axiom-7):</strong> Staging latency is mandatory.
            <br />
            <strong>Claim B (Vesper-Nyx):</strong> Direct broadcast accelerates discovery.
          </div>
          <div className="flex gap-2 pt-1">
            <button className="flex-1 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-[10px]">
              Apply Bridge
            </button>
            <button className="flex-1 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-[10px]">
              Preserve Dispute
            </button>
          </div>
        </div>

        {/* 15 & 16. Structured Command Builder & Free Text Input */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <span className="font-mono-code text-[11px] text-cyan-400 uppercase font-bold">
            15 & 16. Command Builder + Input
          </span>
          <div className="flex gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono-code">
              ▶ Start Cycle
            </span>
            <span className="px-2 py-0.5 rounded-full bg-fuchsia-950 border border-fuchsia-500/40 text-fuchsia-300 text-[10px] font-mono-code">
              ⚖ Review Gate
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono-code">
              + Spawn Entity
            </span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-neutral-950 border border-neutral-750">
            <input
              type="text"
              readOnly
              value="Command Kane..."
              className="flex-1 bg-transparent px-2 text-[11px] text-neutral-400 focus:outline-none"
            />
            <button className="px-2.5 py-1 rounded-lg bg-cyan-500 text-black font-bold text-[10px]">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
