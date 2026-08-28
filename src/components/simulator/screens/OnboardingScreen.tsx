import React, { useState } from 'react';
import { useBrandTheme } from '../../common/BrandContext';
import { THEME_SPECS } from '../../../utils/themeTokens';
import { ShieldCheck, Cpu, Users, BookOpen, ArrowRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { theme } = useBrandTheme();
  const tokens = THEME_SPECS[theme];
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: 'Pocket Sandbox',
      subtitle: 'Controllable Synthetic Simulation Environment',
      icon: <Cpu className="w-8 h-8 text-cyan-400" />,
      description:
        'You are entering an autonomous world of synthetic constructs. You do not simply chat with bots—you define their environment, grant permissions, and run controlled simulation cycles.',
      tag: 'Core Paradigm'
    },
    {
      title: 'Kane Orchestrator',
      subtitle: 'Your Intelligence & Governance Interface',
      icon: <Users className="w-8 h-8 text-fuchsia-400" />,
      description:
        'Kane oversees the simulation, detects epistemic conflicts, coordinates cycles, and routes knowledge proposals to your Approval Gate. You retain ultimate sovereign control.',
      tag: 'Oversight & Control'
    },
    {
      title: 'Synthetic Entities & Safety',
      subtitle: 'Strict Simulation Disclaimer',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      description:
        'All constructs in Pocket Sandbox are synthetic simulations with scoped memory and bounded behavior. Knowledge proposals require your ratification before entering shared session vaults.',
      tag: 'Safety & Scopes'
    }
  ];

  const currentSlide = slides[step];

  return (
    <div className={`h-full flex flex-col justify-between p-6 ${tokens.bg} text-[#E0E0E6]`}>
      {/* Top Brand Tag */}
      <div className="flex items-center justify-between pt-4">
        <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#00F5FF]">
          POCKET SANDBOX OS // v1.0
        </span>
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-[#00F5FF]' : 'w-1.5 bg-[#1F1F2B]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Center Card */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2">
        <div className="w-16 h-16 rounded-2xl bg-[#13131A]/85 backdrop-blur-md border border-[#1F1F2B] flex items-center justify-center mb-6 shadow-2xl shadow-cyan-500/10">
          {currentSlide.icon}
        </div>

        <span className="text-[10px] uppercase font-mono-code px-2.5 py-1 rounded-full bg-[#181824] text-[#B0B0C0] border border-[#1F1F2B] mb-3">
          {currentSlide.tag}
        </span>

        <h1 className="text-xl font-bold font-display-title text-[#E0E0E6] tracking-tight mb-2">
          {currentSlide.title}
        </h1>

        <h2 className="text-xs font-medium text-[#636370] mb-4 font-body-clean">
          {currentSlide.subtitle}
        </h2>

        <p className="text-xs text-[#B0B0C0] leading-relaxed max-w-[280px]">
          {currentSlide.description}
        </p>
      </div>

      {/* Bottom Button Action */}
      <div className="pb-4 space-y-3">
        {step < slides.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="w-full py-3 rounded-xl bg-[#00F5FF] text-black font-bold hover:bg-[#00D8E6] flex items-center justify-center gap-2 text-xs shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all"
          >
            <span>Proceed</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="w-full py-3 rounded-xl bg-[#00FF66] text-black font-bold hover:bg-[#00E65C] flex items-center justify-center gap-2 text-xs shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Initialize Sandbox Console</span>
          </button>
        )}

        <div className="text-center">
          <button
            onClick={onComplete}
            className="text-[10px] text-[#636370] hover:text-[#E0E0E6] font-mono-code uppercase tracking-wider transition-colors"
          >
            Skip Intro
          </button>
        </div>
      </div>
    </div>
  );
};
