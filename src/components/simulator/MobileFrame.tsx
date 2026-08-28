import React, { useState, useEffect } from 'react';
import { useBrandTheme } from '../common/BrandContext';
import { THEME_SPECS } from '../../utils/themeTokens';
import { NavTab, MoreSubTab } from '../../types';
import { Terminal, MessageSquare, Globe, Cpu, MoreHorizontal, Command, Sparkles, Activity } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSwitcher: () => void;
  onOpenObservability: () => void;
  unreadRoomsCount?: number;
  pendingProposalsCount?: number;
  unresolvedConflictsCount?: number;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  onSelectTab,
  onOpenSwitcher,
  onOpenObservability,
  unreadRoomsCount = 0,
  pendingProposalsCount = 0,
  unresolvedConflictsCount = 0,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const [time, setTime] = useState('10:42');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-[385px] h-[812px] max-h-[92vh] bg-[#020306] rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_10px_#0e1017,0_0_0_12px_#1f1f2b] flex flex-col select-none overflow-hidden ring-1 ring-white/10">
      {/* Inner Screen Area */}
      <div className={`relative flex-1 w-full rounded-[38px] ${tokens.bg} flex flex-col overflow-hidden border border-[#1F1F2B]/60 shadow-2xl`}>
        {/* Status Bar */}
        <div className="relative z-30 h-11 px-6 pt-2 flex items-center justify-between text-[#E0E0E6] text-[11px] font-mono-code">
          <span className="font-semibold">{time}</span>

          {/* Dynamic Island Pill (Tappable for Quick Switcher) */}
          <div
            onClick={onOpenSwitcher}
            className="h-5 px-3 rounded-full bg-[#13131A]/90 backdrop-blur-md border border-[#1F1F2B] flex items-center gap-1.5 cursor-pointer hover:border-[#00F5FF]/60 transition-all group shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            title="Open Universal Switcher (Cmd+K)"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse shadow-[0_0_6px_#00F5FF]" />
            <span className="text-[9px] text-[#636370] group-hover:text-[#00F5FF] font-sans transition-colors">Kane OS</span>
            <Command className="w-2.5 h-2.5 text-[#636370] group-hover:text-[#00F5FF]" />
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-[#B0B0C0]">
            <span>5G</span>
            <div className="w-4 h-2 rounded-sm border border-[#636370] p-0.5 flex items-center">
              <div className="h-full w-full bg-[#00F5FF] rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Global Compact Director Pill (Persistent Observability Access) */}
        <div className="relative z-20 px-4 py-1.5 flex items-center justify-between bg-[#13131A]/60 backdrop-blur-md border-b border-[#1F1F2B] text-[9px] font-mono-code text-[#636370]">
          <button
            onClick={onOpenObservability}
            className="flex items-center gap-1.5 hover:text-[#00F5FF] transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66]" />
            <span className="font-semibold tracking-[0.15em] text-[#E0E0E6] uppercase">OBSERVABILITY</span>
            <span className="text-[#636370]">•</span>
            <span className="text-[#B0B0C0]">CYC #14</span>
          </button>

          <div className="flex items-center gap-2">
            {pendingProposalsCount > 0 && (
              <span className="text-[#7000FF] flex items-center gap-0.5 font-medium">
                <Sparkles className="w-2.5 h-2.5 text-[#7000FF]" />
                {pendingProposalsCount} Gate
              </span>
            )}
            {unresolvedConflictsCount > 0 && (
              <span className="text-[#FF3D00] font-medium">
                {unresolvedConflictsCount} Disputed
              </span>
            )}
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="relative flex-1 w-full overflow-hidden flex flex-col">
          {children}
        </div>

        {/* Bottom Navigation Bar with Frosted Glass */}
        <div className="relative z-30 h-16 px-2 border-t border-[#1F1F2B] bg-[#13131A]/85 backdrop-blur-md flex items-center justify-around">
          {[
            { id: 'console', label: 'Console', icon: <Terminal className="w-4 h-4" /> },
            {
              id: 'rooms',
              label: 'Rooms',
              icon: <MessageSquare className="w-4 h-4" />,
              badge: unreadRoomsCount > 0 ? unreadRoomsCount : undefined
            },
            { id: 'world', label: 'World', icon: <Globe className="w-4 h-4" /> },
            { id: 'lab', label: 'Lab', icon: <Cpu className="w-4 h-4" /> },
            {
              id: 'more',
              label: 'More',
              icon: <MoreHorizontal className="w-4 h-4" />,
              badge: pendingProposalsCount > 0 ? '!' : undefined
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as NavTab)}
                className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#00F5FF] font-bold scale-105'
                    : 'text-[#636370] hover:text-[#E0E0E6]'
                }`}
              >
                <div className="relative">
                  {tab.icon}
                  {tab.badge && (
                    <span className="absolute -top-1 -right-2 px-1 rounded-full bg-[#7000FF] text-white text-[8px] font-bold font-mono-code leading-tight shadow-[0_0_8px_rgba(112,0,255,0.6)]">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] uppercase tracking-wider">{tab.label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] mt-0.5 shadow-[0_0_8px_#00F5FF]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Home Indicator Bar */}
        <div className="h-3.5 w-full flex items-center justify-center bg-[#13131A]/85 backdrop-blur-md">
          <div className="w-28 h-1 rounded-full bg-[#636370]/50" />
        </div>
      </div>
    </div>
  );
};
