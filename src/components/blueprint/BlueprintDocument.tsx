import React, { useState } from 'react';
import { useBrandTheme } from '../common/BrandContext';
import { THEME_SPECS } from '../../utils/themeTokens';
import { BookOpen, Copy, Check, Sparkles, Cpu, Layers, Terminal, ShieldCheck, ChevronDown, ChevronRight, Palette, Sliders, Layout } from 'lucide-react';

export const BlueprintDocument: React.FC = () => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('brand');

  const handleCopyMarkdown = () => {
    // Copy signal
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10 space-y-10 text-neutral-200 max-w-5xl mx-auto">
      {/* Top Title Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-[#101424] to-neutral-900 border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono-code uppercase tracking-widest text-cyan-400 font-bold">
              Complete Mobile UI/UX Blueprint // Implementation Ready
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display-title text-white">
              Pocket Sandbox
            </h1>
            <p className="text-sm text-neutral-300 max-w-2xl font-body-clean">
              A synthetic simulation environment where the user creates, directs, observes, and interacts with multiple artificial constructs under the orchestration of Kane.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono-code flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full 7-Section Specification</span>
            </div>
          </div>
        </div>

        {/* Quick Section Anchor Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-neutral-800 text-xs font-mono-code">
          {[
            { id: 'brand', label: '1. Brand Directions' },
            { id: 'nav', label: '2. Navigation & IA' },
            { id: 'screens', label: '3. Screens (Blueprint)' },
            { id: 'knowledge', label: '4. Shared Learning' },
            { id: 'components', label: '5. Components Library' },
            { id: 'content', label: '6. Sample Content' },
            { id: 'checklist', label: '7. UI Polish Checklist' },
          ].map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40 border border-neutral-700 transition-all text-neutral-300"
            >
              {sec.label}
            </a>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: BRAND DIRECTIONS */}
      {/* ========================================================================= */}
      <section id="brand" className="space-y-6 scroll-mt-6">
        <div className="flex items-center gap-3 border-b pb-3 border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold font-mono-code">
            01
          </div>
          <div>
            <h2 className="text-xl font-bold font-display-title text-white">
              1. Brand Directions
            </h2>
            <p className="text-xs text-neutral-400">
              Two comprehensive visual paradigms: Neon Noir Console vs. Soft Glitch Pastel
            </p>
          </div>
        </div>

        {/* Brand Option 1: Neon Noir Console */}
        <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-cyan-300 font-display-title">
              Option 1: Neon Noir Console
            </h3>
            <span className="text-xs font-mono-code px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Selected Primary Theme
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            <strong>Mood & Personality:</strong> Dark, sleek, minimal, slightly surreal, premium, controlled chaos with subtle cyber-carnival energy. Glitch effects are sparse and meaningful (triggered strictly on cycle transitions, active conflicts, system anomalies, and breakthrough events). Never overwhelming or gratuitous.
          </p>

          {/* Color System Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-code border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400">
                  <th className="py-2">Token Name</th>
                  <th className="py-2">Hex Value</th>
                  <th className="py-2">Visual Swatch</th>
                  <th className="py-2">UI Usage & Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                <tr>
                  <td className="py-2 text-cyan-400 font-semibold">Background</td>
                  <td>#090A0F</td>
                  <td><div className="w-6 h-4 rounded bg-[#090A0F] border border-neutral-700" /></td>
                  <td>Deep void foundation; optical depth without pure #000 flatness</td>
                </tr>
                <tr>
                  <td className="py-2 text-cyan-400 font-semibold">Surface</td>
                  <td>#11131C</td>
                  <td><div className="w-6 h-4 rounded bg-[#11131C] border border-neutral-700" /></td>
                  <td>Standard container cards, input fields, and bottom bar</td>
                </tr>
                <tr>
                  <td className="py-2 text-cyan-400 font-semibold">Elevated Surface</td>
                  <td>#181B28</td>
                  <td><div className="w-6 h-4 rounded bg-[#181B28] border border-neutral-700" /></td>
                  <td>Modals, drawers, and active popovers</td>
                </tr>
                <tr>
                  <td className="py-2 text-cyan-400 font-semibold">Primary Accent</td>
                  <td>#00F0FF</td>
                  <td><div className="w-6 h-4 rounded bg-[#00F0FF]" /></td>
                  <td>Kane orchestration signals, active highlights, primary buttons</td>
                </tr>
                <tr>
                  <td className="py-2 text-cyan-400 font-semibold">Secondary Accent</td>
                  <td>#E028A0</td>
                  <td><div className="w-6 h-4 rounded bg-[#E028A0]" /></td>
                  <td>Knowledge proposal gates, synthesis signals</td>
                </tr>
                <tr>
                  <td className="py-2 text-emerald-400 font-semibold">Success</td>
                  <td>#10B981</td>
                  <td><div className="w-6 h-4 rounded bg-[#10B981]" /></td>
                  <td>Equilibrium nominal, vault approvals, stability stable</td>
                </tr>
                <tr>
                  <td className="py-2 text-amber-400 font-semibold">Warning</td>
                  <td>#F59E0B</td>
                  <td><div className="w-6 h-4 rounded bg-[#F59E0B]" /></td>
                  <td>Ontological divergence, duplicate schema detected</td>
                </tr>
                <tr>
                  <td className="py-2 text-rose-400 font-semibold">Critical / Conflict</td>
                  <td>#EF4444</td>
                  <td><div className="w-6 h-4 rounded bg-[#EF4444]" /></td>
                  <td>Construct disagreement, quarantine lockdown, memory corruption</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Brand Option 2: Soft Glitch Pastel */}
        <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-purple-300 font-display-title">
              Option 2: Soft Glitch Pastel
            </h3>
            <span className="text-xs font-mono-code px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800">
              Alternative Mode
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            <strong>Mood & Personality:</strong> Friendly, strange, playful, cute but intelligent, and slightly unsettling in an abstract way. Soft dim surfaces with lavender, peach, and pistachio accents. Tactile rounded components without ever feeling childish or unrigorous.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code">
            <div className="p-3 rounded-xl bg-[#1E1B26] border border-[#3D374E] space-y-1">
              <span className="text-neutral-400 text-[10px]">BG: #1E1B26</span>
              <div className="w-full h-3 rounded bg-[#1E1B26]" />
            </div>
            <div className="p-3 rounded-xl bg-[#282433] border border-[#3D374E] space-y-1">
              <span className="text-neutral-400 text-[10px]">Surface: #282433</span>
              <div className="w-full h-3 rounded bg-[#282433]" />
            </div>
            <div className="p-3 rounded-xl bg-[#C4B5FD] text-purple-950 font-bold space-y-1">
              <span className="text-[10px]">Accent: #C4B5FD</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FECDD3] text-rose-950 font-bold space-y-1">
              <span className="text-[10px]">Conflict: #FECDD3</span>
            </div>
          </div>
        </div>

        {/* Typography Scale */}
        <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
          <h3 className="text-base font-bold text-neutral-100 font-display-title">
            Typography Scale (Mobile 6.1" Baseline)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-code border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400">
                  <th className="py-2">Level</th>
                  <th className="py-2">Font Family</th>
                  <th className="py-2">Size / Line Height</th>
                  <th className="py-2">Tracking & Weight</th>
                  <th className="py-2">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                <tr>
                  <td className="py-2 text-cyan-400 font-bold">Display</td>
                  <td>Syne / Outfit</td>
                  <td>28px / 34px</td>
                  <td>Tight (-0.02em), Bold 700</td>
                  <td>Onboarding hero, major simulation phase transitions</td>
                </tr>
                <tr>
                  <td className="py-2 text-cyan-400 font-bold">Screen Title</td>
                  <td>Syne / Plus Jakarta</td>
                  <td>20px / 26px</td>
                  <td>Tight (-0.01em), SemiBold 600</td>
                  <td>Top screen headers (Console, Rooms, Vault)</td>
                </tr>
                <tr>
                  <td className="py-2 text-cyan-400 font-bold">Section Heading</td>
                  <td>Plus Jakarta Sans</td>
                  <td>14px / 20px</td>
                  <td>Normal, SemiBold 600</td>
                  <td>Card titles, construct persona headers</td>
                </tr>
                <tr>
                  <td className="py-2 text-cyan-400 font-bold">Body</td>
                  <td>Plus Jakarta Sans</td>
                  <td>13px / 19px</td>
                  <td>Normal, Regular 400</td>
                  <td>Message text, narrative traces, knowledge descriptions</td>
                </tr>
                <tr>
                  <td className="py-2 text-cyan-400 font-bold">Metadata / Code</td>
                  <td>JetBrains Mono</td>
                  <td>10px / 14px</td>
                  <td>Wide (+0.03em), Medium 500</td>
                  <td>Timestamps, stability %, scopes, telemetry indicators</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Motion Principles */}
        <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3 text-xs leading-relaxed">
          <h3 className="text-base font-bold text-neutral-100 font-display-title">
            Motion Principles: Meaningful State Visuals
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-300">
            <li><strong>Construct Activation:</strong> Subtle 200ms scale pulse with border luminescence matching construct role symbol.</li>
            <li><strong>Cycle Orchestration:</strong> Data packets traverse curved bezier SVG paths between construct nodes in 600ms ease-out bursts.</li>
            <li><strong>Conflict Tension:</strong> Dashed red connector line between divergent construct nodes with 1.2s sine oscillation.</li>
            <li><strong>Knowledge Promotion:</strong> Smooth vertical slide into the Approval Gate with a 300ms purple glow settlement.</li>
          </ul>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: NAVIGATION & IA */}
      {/* ========================================================================= */}
      <section id="nav" className="space-y-6 scroll-mt-6">
        <div className="flex items-center gap-3 border-b pb-3 border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold font-mono-code">
            02
          </div>
          <div>
            <h2 className="text-xl font-bold font-display-title text-white">
              2. Navigation & Information Architecture
            </h2>
            <p className="text-xs text-neutral-400">
              Streamlined 5-tab mobile structure, Director Observability, and Universal Quick Switcher
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 font-display-title">
              Primary Bottom Navigation (5 Tabs)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-850">
                <span className="font-bold text-cyan-300 font-mono-code">1. CONSOLE:</span> Kane Orchestrator conversation, structured directive builder, active sandbox telemetry.
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-850">
                <span className="font-bold text-cyan-300 font-mono-code">2. ROOMS:</span> Multi-construct debate spaces, room creation, Director View annotations, unread markers.
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-850">
                <span className="font-bold text-cyan-300 font-mono-code">3. WORLD:</span> Chronological activity ledger, artifacts generated, severity filter, stability impact.
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-850">
                <span className="font-bold text-cyan-300 font-mono-code">4. LAB:</span> Scenario templates, cycle execution batches (1/3/10 cycles), stability equilibrium graphs.
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-850">
                <span className="font-bold text-cyan-300 font-mono-code">5. MORE:</span> Construct Roster, Knowledge Vault & Approval Gate, Settings, and World state export.
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 font-display-title">
              Universal Quick Switcher (Cmd+K / Dynamic Island)
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Accessible instantly by tapping the top Dynamic Island pill or pressing Cmd+K. Features fuzzy search across Constructs, Rooms, Knowledge items, and Event traces, letting operators jump anywhere in one tap.
            </p>
            <div className="p-3 rounded-xl bg-neutral-950 border border-cyan-500/30 text-[11px] font-mono-code text-cyan-300 space-y-1">
              <div>• Top Section: Quick Jump to Core Surfaces (Console, Lab, Vault, Feed)</div>
              <div>• Mid Section: Instant Entity Inspector with live mood tags</div>
              <div>• Bottom Section: Knowledge Schema Lookup by title or scope</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: SCREENS (BLUEPRINT) */}
      {/* ========================================================================= */}
      <section id="screens" className="space-y-6 scroll-mt-6">
        <div className="flex items-center gap-3 border-b pb-3 border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold font-mono-code">
            03
          </div>
          <div>
            <h2 className="text-xl font-bold font-display-title text-white">
              3. Screens (Blueprint)
            </h2>
            <p className="text-xs text-neutral-400">
              Detailed specifications for all core surfaces, sub-views, and signature interaction modes
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Screen A */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 font-display-title">
                A. Onboarding + Fiction & Safety Disclaimer
              </h3>
              <span className="text-[10px] font-mono-code text-neutral-400">Entry Surface</span>
            </div>
            <p className="text-neutral-300">
              <strong>Purpose:</strong> Educate the user on the synthetic sandbox paradigm, establishing that constructs are simulated entities with scoped memory, Kane is the orchestrator interface, and the user retains absolute sovereign ratification control.
            </p>
          </div>

          {/* Screen B */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 font-display-title">
                B. Home / Session Picker
              </h3>
              <span className="text-[10px] font-mono-code text-neutral-400">Session Surface</span>
            </div>
            <p className="text-neutral-300">
              <strong>Purpose:</strong> Switch between multiple sandbox worlds, resume recent sessions, view stability telemetry at a glance, and spin up blank sandbox environments.
            </p>
          </div>

          {/* Screen C */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 font-display-title">
                C. Console — Kane Orchestrator
              </h3>
              <span className="text-[10px] font-mono-code text-neutral-400">Primary Control Surface</span>
            </div>
            <p className="text-neutral-300">
              <strong>Purpose:</strong> Primary user command cockpit. Contains Kane conversational messages, active alerts ticker, structured directive chips (Start Cycle, Review Gate, Inspect Conflict), and natural language prompt bar.
            </p>
          </div>

          {/* Screen D & E */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 font-display-title">
                D & E. Rooms List & Multi-Construct Detail with Director View
              </h3>
              <span className="text-[10px] font-mono-code text-neutral-400">Conversation & Simulation Spaces</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              <strong>Purpose:</strong> Support 2–8 concurrent synthetic constructs engaged in dialectical or collaborative discussions. Features the <strong>Director View Toggle</strong> (lifting the lid to reveal intent, memory access traces, and conflict risks) and <strong>Inline Expandable Knowledge Chips</strong> (citing room memory, vault rules, or newly proposed schemas).
            </p>
          </div>

          {/* Screen F & G */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 font-display-title">
                F & G. Construct Roster & Deep Persona Inspector
              </h3>
              <span className="text-[10px] font-mono-code text-neutral-400">Entity Governance</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              <strong>Purpose:</strong> Comprehensive management of construct traits, active goals, hard boundaries (without raw prompt exposure), clearly partitioned <strong>Memory Scopes</strong> (Personal, Room, Vault), and life-cycle controls (Pause, Quarantine, Fork, Terminate).
            </p>
          </div>

          {/* Screen H & I */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 font-display-title">
                H & I. World Feed, Scenario Lab & Stability Dashboard
              </h3>
              <span className="text-[10px] font-mono-code text-neutral-400">Telemetry & Experiments</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              <strong>Purpose:</strong> Chronological event ledger with severity filtering, configurable experiment templates (Dialectic Crucible, Harmonic Consensus, Stochastic Wildfire), and batch cycle stepping.
            </p>
          </div>

          {/* The Signature WOW Moment */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-neutral-900 to-fuchsia-950/40 border border-cyan-400/50 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 font-display-title flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                The Signature WOW Moment: Cycle Orchestration View
              </h3>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                Signature UX Interaction
              </span>
            </div>
            <p className="text-neutral-200 leading-relaxed">
              When a cycle is triggered, the app enters an immersive visual orchestration mode: construct nodes light up, moving data packets show information exchange, tension lines oscillate during conflict detection, and Kane watches from the center. Upon completion, it smoothly settles into the <strong>"What Changed"</strong> summary card.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: SHARED LEARNING (KNOWLEDGE UX) */}
      {/* ========================================================================= */}
      <section id="knowledge" className="space-y-6 scroll-mt-6">
        <div className="flex items-center gap-3 border-b pb-3 border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold font-mono-code">
            04
          </div>
          <div>
            <h2 className="text-xl font-bold font-display-title text-white">
              4. Shared Learning (Knowledge UX)
            </h2>
            <p className="text-xs text-neutral-400">
              Three strict memory scopes, Operator Approval Gate, duplicate detection, and conflict resolution
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <span className="text-[10px] uppercase font-mono-code text-cyan-400 font-bold">Scope 1</span>
            <h4 className="font-bold text-neutral-100 font-display-title">Personal Memory</h4>
            <div className="p-2 rounded bg-neutral-950 text-neutral-300 font-mono-code text-[11px]">
              «Personal to this construct»
            </div>
            <p className="text-neutral-400 text-[11px]">
              Visible only to the individual construct. Private observations, working hypotheses, and internal drift logs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <span className="text-[10px] uppercase font-mono-code text-emerald-400 font-bold">Scope 2</span>
            <h4 className="font-bold text-neutral-100 font-display-title">Room Memory</h4>
            <div className="p-2 rounded bg-neutral-950 text-neutral-300 font-mono-code text-[11px]">
              «Shared inside this room»
            </div>
            <p className="text-neutral-400 text-[11px]">
              Scoped strictly to participants within a specific room. Evaporates or commits upon room conclusion.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <span className="text-[10px] uppercase font-mono-code text-amber-400 font-bold">Scope 3</span>
            <h4 className="font-bold text-neutral-100 font-display-title">Vault Knowledge</h4>
            <div className="p-2 rounded bg-neutral-950 text-neutral-300 font-mono-code text-[11px]">
              «Shared sandbox knowledge»
            </div>
            <p className="text-neutral-400 text-[11px]">
              Session-wide approved schemas, constitutional axioms, and ratified cross-room discoveries.
            </p>
          </div>
        </div>

        {/* Approval Gate & Conflict Resolution */}
        <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-neutral-100 font-display-title">
            Operator Approval Gate & Conflict Resolution Mechanics
          </h3>
          <p className="text-neutral-300 leading-relaxed">
            Constructs cannot unilaterally write to the Shared Vault. When a construct emits a proposal, it enters the <strong>Approval Gate</strong> with Kane's advisory recommendation (Approve, Edit, Reject) and duplicate detection. If two constructs formulate contradictory claims, a <strong>Conflict Card</strong> is generated with Claim A vs Claim B, allowing the operator to adopt a synthesis bridge, pick a winner, or preserve the dispute.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: COMPONENTS LIBRARY */}
      {/* ========================================================================= */}
      <section id="components" className="space-y-6 scroll-mt-6">
        <div className="flex items-center gap-3 border-b pb-3 border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold font-mono-code">
            05
          </div>
          <div>
            <h2 className="text-xl font-bold font-display-title text-white">
              5. Components Library (21 Design System Tokens)
            </h2>
            <p className="text-xs text-neutral-400">
              Reusable atomic and composite mobile components designed for high observability
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-mono-code">
          {[
            '1. Construct Avatar Tile',
            '2. Status Ring',
            '3. Role Badge',
            '4. Stability Indicator',
            '5. Mood Indicator',
            '6. Permission Panel',
            '7. Event Card',
            '8. Knowledge Card',
            '9. Conflict Card',
            '10. Cycle Pulse Indicator',
            '11. Construct State Chip',
            '12. Quarantine Modal',
            '13. Fork Construct Flow',
            '14. Terminate Confirmation',
            '15. Structured Command Builder',
            '16. Free Text Command Input',
            '17. Room Participants Drawer',
            '18. Knowledge Chip',
            '19. Approval Action Bar',
            '20. Quick Switcher',
            '21. System Observability Panel',
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-2">
              <span className="text-cyan-400">❖</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: SAMPLE CONTENT */}
      {/* ========================================================================= */}
      <section id="content" className="space-y-6 scroll-mt-6">
        <div className="flex items-center gap-3 border-b pb-3 border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold font-mono-code">
            06
          </div>
          <div>
            <h2 className="text-xl font-bold font-display-title text-white">
              6. Sample Content
            </h2>
            <p className="text-xs text-neutral-400">
              Original constructs, simulation rooms, world events, knowledge schemas, and Kane microcopy
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-cyan-400 font-display-title">
            Construct Cast (Original Archetypes)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850">
              <span className="font-bold text-amber-400">▲ Axiom-7:</span> Structural Ontologist. Deconstructs arguments into axiomatic primitives.
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850">
              <span className="font-bold text-fuchsia-400">✦ Vesper-Nyx:</span> Dialectical Provocateur. Tests edge cases with counter-proposals.
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850">
              <span className="font-bold text-cyan-400">⚖ Solon-Kael:</span> Equilibrium Arbiter. Synthesizes bridge consensus.
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850">
              <span className="font-bold text-emerald-400">≋ Mira-Tide:</span> Kinetic Modeler. Tracks knowledge velocity and resonance.
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850">
              <span className="font-bold text-violet-400">⚂ Zephyr-Drift:</span> Stochastic Explorer. Injects randomized lateral prompts.
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850">
              <span className="font-bold text-rose-400">❖ Oris-Pylon:</span> Sanctuary Custodian (Quarantined). Memory barrier auditor.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: UI POLISH CHECKLIST */}
      {/* ========================================================================= */}
      <section id="checklist" className="space-y-6 scroll-mt-6">
        <div className="flex items-center gap-3 border-b pb-3 border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold font-mono-code">
            07
          </div>
          <div>
            <h2 className="text-xl font-bold font-display-title text-white">
              7. UI Polish Checklist
            </h2>
            <p className="text-xs text-neutral-400">
              Rigorous production checklist for visual consistency, mobile touch targets, accessibility, and error handling
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <h4 className="font-bold text-emerald-400 font-display-title flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Mobile Touch & Usability
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-neutral-300 text-[11px]">
              <li>All primary buttons & tab items exceed 44px touch targets.</li>
              <li>Bottom navigation thumb reach optimized for 6.1" phones.</li>
              <li>Long construct names handled with elegant text truncation and codename fallbacks.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <h4 className="font-bold text-cyan-400 font-display-title flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Accessibility & WCAG AA
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-neutral-300 text-[11px]">
              <li>High-contrast text & background ratios exceeding 4.5:1.</li>
              <li>Dual state encoding: never rely on color alone (icons + symbols + text).</li>
              <li>Meaningful non-blank empty states with clear calls-to-action on every view.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
