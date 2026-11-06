import { UserRole } from './auth';

export interface RoleTheme {
  name: string;
  role: UserRole;
  // Login card & page gradient colors
  loginGradient: string;
  ambientGlow: string;
  // Dashboard accents
  primary: string;
  primaryHover: string;
  primaryText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  activeNavBg: string;
  activeNavText: string;
  activeNavIcon: string;
  headerAccent: string;
  borderAccent: string;
  cardHighlight: string;
}

export const ROLE_THEMES: Record<UserRole, RoleTheme> = {
  // STUDENT: Fresh Academic Emerald / Forest
  STUDENT: {
    name: 'Student Portal',
    role: 'STUDENT',
    loginGradient: 'from-emerald-950 via-slate-950 to-teal-950',
    ambientGlow: 'bg-emerald-500/20',
    primary: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-500',
    primaryText: 'text-emerald-600',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    activeNavBg: 'bg-emerald-50 text-emerald-700',
    activeNavText: 'text-emerald-700 font-semibold',
    activeNavIcon: 'text-emerald-600',
    headerAccent: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    borderAccent: 'border-emerald-500',
    cardHighlight: 'border-t-4 border-t-emerald-500',
  },

  // REGISTRAR: Royal Institutional Blue
  REGISTRAR: {
    name: 'Registrar Operations',
    role: 'REGISTRAR',
    loginGradient: 'from-blue-950 via-slate-950 to-indigo-950',
    ambientGlow: 'bg-blue-500/20',
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-500',
    primaryText: 'text-blue-600',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    activeNavBg: 'bg-blue-50 text-blue-700',
    activeNavText: 'text-blue-700 font-semibold',
    activeNavIcon: 'text-blue-600',
    headerAccent: 'text-blue-600 bg-blue-50 border-blue-200',
    borderAccent: 'border-blue-500',
    cardHighlight: 'border-t-4 border-t-blue-500',
  },

  // SAO: Warm Amber / Gold (Student Affairs)
  SAO: {
    name: 'Student Affairs (SAO)',
    role: 'SAO',
    loginGradient: 'from-amber-950 via-slate-950 to-orange-950',
    ambientGlow: 'bg-amber-500/20',
    primary: 'bg-amber-600',
    primaryHover: 'hover:bg-amber-500',
    primaryText: 'text-amber-600',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    activeNavBg: 'bg-amber-50 text-amber-700',
    activeNavText: 'text-amber-700 font-semibold',
    activeNavIcon: 'text-amber-600',
    headerAccent: 'text-amber-600 bg-amber-50 border-amber-200',
    borderAccent: 'border-amber-500',
    cardHighlight: 'border-t-4 border-t-amber-500',
  },

  // LIBRARIAN: Royal Knowledge Amethyst / Purple
  LIBRARIAN: {
    name: 'Library System',
    role: 'LIBRARIAN',
    loginGradient: 'from-purple-950 via-slate-950 to-fuchsia-950',
    ambientGlow: 'bg-purple-500/20',
    primary: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-500',
    primaryText: 'text-purple-600',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    activeNavBg: 'bg-purple-50 text-purple-700',
    activeNavText: 'text-purple-700 font-semibold',
    activeNavIcon: 'text-purple-600',
    headerAccent: 'text-purple-600 bg-purple-50 border-purple-200',
    borderAccent: 'border-purple-500',
    cardHighlight: 'border-t-4 border-t-purple-500',
  },

  // ADMIN: Architectural Crimson / Maroon (direct reference from the image's red architectural pillars)
  ADMIN: {
    name: 'Admin Console',
    role: 'ADMIN',
    loginGradient: 'from-rose-950 via-stone-950 to-red-950',
    ambientGlow: 'bg-rose-500/20',
    primary: 'bg-rose-700',
    primaryHover: 'hover:bg-rose-600',
    primaryText: 'text-rose-700',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    activeNavBg: 'bg-rose-50 text-rose-700',
    activeNavText: 'text-rose-700 font-semibold',
    activeNavIcon: 'text-rose-700',
    headerAccent: 'text-rose-700 bg-rose-50 border-rose-200',
    borderAccent: 'border-rose-700',
    cardHighlight: 'border-t-4 border-t-rose-700',
  },
};

