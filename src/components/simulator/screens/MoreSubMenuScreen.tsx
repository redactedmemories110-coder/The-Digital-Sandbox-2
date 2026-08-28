import React from 'react';
import { useBrandTheme } from '../../common/BrandContext';
import { THEME_SPECS } from '../../../utils/themeTokens';
import { MoreSubTab } from '../../../types';
import { Users, BookOpen, Settings, Download, ChevronRight, Sparkles, Shield, Info } from 'lucide-react';

interface MoreSubMenuProps {
  onNavigateSubTab: (subTab: MoreSubTab) => void;
  pendingProposalsCount: number;
}

export const MoreSubMenuScreen: React.FC<MoreSubMenuProps> = ({
  onNavigateSubTab,
  pendingProposalsCount,
}) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];

  const menuItems = [
    {
      id: 'roster' as MoreSubTab,
      title: 'Construct Roster',
      subtitle: 'Entity personas, memory scopes & permissions',
      icon: <Users className="w-5 h-5 text-cyan-400" />,
      badge: '6 Entities'
    },
    {
      id: 'vault' as MoreSubTab,
      title: 'Knowledge Vault & Gate',
      subtitle: 'Approval queue, conflict arbitration & schemas',
      icon: <BookOpen className="w-5 h-5 text-fuchsia-400" />,
      badge: pendingProposalsCount > 0 ? `${pendingProposalsCount} In Gate` : undefined,
      badgeColor: 'bg-fuchsia-500 text-black'
    },
    {
      id: 'settings' as MoreSubTab,
      title: 'Simulation Settings',
      subtitle: 'Entropy damping, safety bounds & telemetry',
      icon: <Settings className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'export' as MoreSubTab,
      title: 'Export Session State',
      subtitle: 'Download world snapshot & memory schemas',
      icon: <Download className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <div className={`h-full flex flex-col p-4 ${tokens.bg} text-[#E0E0E6] overflow-y-auto`}>
      {/* Header */}
      <div className="pt-2 pb-3">
        <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#00F5FF]">
          Sandbox Management
        </span>
        <h1 className="text-lg font-bold font-display-title text-[#E0E0E6]">
          System Control & Vault
        </h1>
      </div>

      {/* Menu List */}
      <div className="space-y-2.5 flex-1">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigateSubTab(item.id)}
            className="p-3.5 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] hover:border-[#00F5FF]/40 cursor-pointer transition-all shadow-md flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#181824] border border-[#1F1F2B] flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-[#E0E0E6] font-display-title">
                    {item.title}
                  </h2>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono-code px-1.5 py-0.5 rounded-full font-bold ${
                        item.badgeColor || 'bg-[#181824] text-[#B0B0C0] border border-[#1F1F2B]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#636370] mt-0.5">{item.subtitle}</p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#636370] group-hover:text-[#00F5FF] group-hover:translate-x-0.5 transition-all" />
          </div>
        ))}
      </div>

      {/* Footer System Info */}
      <div className="p-3 rounded-xl bg-[#13131A]/70 backdrop-blur-md border border-[#1F1F2B] text-[10px] text-[#636370] flex items-center gap-2">
        <Info className="w-4 h-4 text-[#00F5FF] shrink-0" />
        <span>
          Pocket Sandbox OS v1.0 • All construct activities are local synthetic simulations.
        </span>
      </div>
    </div>
  );
};
