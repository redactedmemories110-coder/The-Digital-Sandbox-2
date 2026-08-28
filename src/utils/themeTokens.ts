import { ThemeMode } from '../types';

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceGlass: string;
  elevated: string;
  elevatedGlass: string;
  primaryAccent: string;
  primaryAccentText: string;
  primaryAccentBorder: string;
  secondaryAccent: string;
  secondaryAccentText: string;
  secondaryAccentBorder: string;
  success: string;
  successBg: string;
  successBorder: string;
  warning: string;
  critical: string;
  criticalBg: string;
  criticalBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSubtle: string;
  borderActive: string;
  cardRadius: string;
  pillRadius: string;
  fontDisplay: string;
  fontBody: string;
  glowEffect: string;
  badgeStyle: string;
}

export const THEME_SPECS: Record<ThemeMode, ThemeColors> = {
  neon_noir: {
    bg: 'bg-[#050507]',
    surface: 'bg-[#13131A]',
    surfaceGlass: 'backdrop-blur-md bg-[#13131A]/80',
    elevated: 'bg-[#181824]',
    elevatedGlass: 'backdrop-blur-xl bg-[#181824]/90',
    primaryAccent: 'bg-[#00F5FF]',
    primaryAccentText: 'text-[#00F5FF]',
    primaryAccentBorder: 'border-[#00F5FF]/40',
    secondaryAccent: 'bg-[#7000FF]',
    secondaryAccentText: 'text-[#7000FF]',
    secondaryAccentBorder: 'border-[#7000FF]/40',
    success: 'text-[#00FF66]',
    successBg: 'bg-[#111A13]',
    successBorder: 'border-[#113B1B]',
    warning: 'text-[#F59E0B]',
    critical: 'text-[#FF3D00]',
    criticalBg: 'bg-[#1A1111]',
    criticalBorder: 'border-[#3B1111]',
    textPrimary: 'text-[#E0E0E6]',
    textSecondary: 'text-[#B0B0C0]',
    textMuted: 'text-[#636370]',
    border: 'border-[#1F1F2B]',
    borderSubtle: 'border-[#23232F]',
    borderActive: 'border-[#00F5FF]/50',
    cardRadius: 'rounded-xl',
    pillRadius: 'rounded-full',
    fontDisplay: 'font-display-title',
    fontBody: 'font-body-clean',
    glowEffect: 'shadow-[0_0_15px_rgba(0,245,255,0.25)]',
    badgeStyle: 'border border-[#00F5FF]/30 bg-[#00F5FF]/10 text-[#00F5FF]'
  },
  soft_pastel: {
    bg: 'bg-[#16141D]',
    surface: 'bg-[#221E2C]',
    surfaceGlass: 'backdrop-blur-md bg-[#221E2C]/80',
    elevated: 'bg-[#2D283B]',
    elevatedGlass: 'backdrop-blur-xl bg-[#2D283B]/90',
    primaryAccent: 'bg-[#C4B5FD]',
    primaryAccentText: 'text-[#C4B5FD]',
    primaryAccentBorder: 'border-[#C4B5FD]/40',
    secondaryAccent: 'bg-[#F472B6]',
    secondaryAccentText: 'text-[#F472B6]',
    secondaryAccentBorder: 'border-[#F472B6]/40',
    success: 'text-[#A7F3D0]',
    successBg: 'bg-[#1A2E26]',
    successBorder: 'border-[#2D5A47]',
    warning: 'text-[#FDE68A]',
    critical: 'text-[#FECDD3]',
    criticalBg: 'bg-[#2E1A22]',
    criticalBorder: 'border-[#5A2D3C]',
    textPrimary: 'text-[#F5F3FF]',
    textSecondary: 'text-[#C4B5FD]/80',
    textMuted: 'text-[#8B83A0]',
    border: 'border-[#352F44]',
    borderSubtle: 'border-[#3D374E]',
    borderActive: 'border-[#C4B5FD]/50',
    cardRadius: 'rounded-2xl',
    pillRadius: 'rounded-full',
    fontDisplay: 'font-soft-clean',
    fontBody: 'font-soft-clean',
    glowEffect: 'shadow-[0_0_20px_rgba(196,181,253,0.18)]',
    badgeStyle: 'border border-purple-400/30 bg-purple-950/40 text-purple-200'
  }
};
