import { IncidentMission, Module } from '../types';

export type ProfileId = 'learner' | 'demo';
export type ModuleStatus = 'locked' | 'available' | 'viewed' | 'completed';

export interface Progress {
  completed: string[]; // module ids, in completion order
  viewed: string[];
  resolvedMissions: string[];
  learnerName: string;
  completedAt?: string; // ISO date the last module was completed
  certificateId?: string; // local identifier, NOT a verifiable proof
}

export const emptyProgress = (): Progress => ({ completed: [], viewed: [], resolvedMissions: [], learnerName: '' });

const KEY = (profile: ProfileId) => `skilloo_progress_${profile}`;
const PROFILE_KEY = 'skilloo_profile';
const LEGACY_KEY = 'cybercity_app_state_v1';

const read = (key: string): unknown => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked (private mode): progress stays in memory for this session
  }
};

// Pre-Skilloo saves stored whole module/mission objects; keep only the ids.
const migrateLegacy = (): Progress | null => {
  const mods = read(`${LEGACY_KEY}_modules`);
  const missions = read(`${LEGACY_KEY}_missions`);
  if (!Array.isArray(mods)) return null;
  return {
    ...emptyProgress(),
    completed: mods.filter((m: { completed?: boolean }) => m?.completed).map((m: { id: string }) => m.id),
    resolvedMissions: Array.isArray(missions)
      ? missions.filter((m: { status?: string }) => m?.status === 'resolved').map((m: { id: string }) => m.id)
      : [],
  };
};

/**
 * Single storage gateway for learner progress.
 * Backend phase: replace these functions with API calls; components only see Progress objects.
 */
export const progressStore = {
  load(profile: ProfileId): Progress {
    const saved = read(KEY(profile)) as Partial<Progress> | null;
    if (saved && Array.isArray(saved.completed)) return { ...emptyProgress(), ...saved };
    return (profile === 'learner' && migrateLegacy()) || emptyProgress();
  },
  save(profile: ProfileId, progress: Progress) {
    write(KEY(profile), progress);
  },
  clear(profile: ProfileId) {
    try {
      localStorage.removeItem(KEY(profile));
      if (profile === 'learner') ['_stats', '_buildings', '_modules', '_missions'].forEach(s => localStorage.removeItem(LEGACY_KEY + s));
    } catch {
      /* ignore */
    }
  },
  loadProfile(): ProfileId {
    return read(PROFILE_KEY) === 'demo' ? 'demo' : 'learner';
  },
  saveProfile(profile: ProfileId) {
    write(PROFILE_KEY, profile);
  },
};

export const newCertificateId = (profile: ProfileId) => {
  const hex = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replace(/-/g, '')
    : Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
  const body = hex.slice(0, 12).toUpperCase().match(/.{4}/g)!.join('-');
  return `${profile === 'demo' ? 'DEMO' : 'LOCAL'}-${body}`;
};

export const LEVEL_BASE_XP = 500;

export function computeStats(progress: Progress, modules: Module[], missions: IncidentMission[]) {
  const done = modules.filter(m => progress.completed.includes(m.id));
  const solved = missions.filter(m => progress.resolvedMissions.includes(m.id));
  const xpTotal = done.reduce((s, m) => s + m.xpReward, 0) + solved.reduce((s, m) => s + m.rewardXp, 0);
  const coins = done.reduce((s, m) => s + m.coinReward, 0) + solved.reduce((s, m) => s + m.rewardCoins, 0);

  // Same curve as the original game: each level needs 1.5× the XP of the previous one.
  let level = 1;
  let xpInLevel = xpTotal;
  let xpForNext = LEVEL_BASE_XP;
  while (xpInLevel >= xpForNext) {
    xpInLevel -= xpForNext;
    level += 1;
    xpForNext = Math.round(xpForNext * 1.5);
  }

  return {
    xpTotal,
    coins,
    level,
    xpInLevel,
    xpForNext,
    completedCount: done.length,
    totalModules: modules.length,
    missionsResolved: solved.length,
    missionsTotal: missions.length,
  };
}

export type Stats = ReturnType<typeof computeStats>;

// Loo's ranks from the Skilloo mascot sheet, unlocked by modules completed.
export const RANKS = [
  { min: 0, label: 'Débutant', image: '/brand/loo-1.png', tagline: 'Découvre, explore, apprends les bases.' },
  { min: 3, label: 'Apprenti', image: '/brand/loo-5.png', tagline: 'Tu prends confiance, tu développes tes premières compétences.' },
  { min: 7, label: 'Explorateur', image: '/brand/loo-10.png', tagline: 'Tu passes au niveau supérieur, tu relèves de nouveaux défis.' },
  { min: 12, label: 'Expert', image: '/brand/loo-20.png', tagline: 'Tu maîtrises, tu crées, tu construis ton avenir.' },
  { min: 18, label: 'Maître', image: '/brand/loo-30.png', tagline: 'Tu inspires, tu partages, tu fais la différence.' },
];

export const rankFor = (completedCount: number) => {
  const idx = RANKS.filter(r => completedCount >= r.min).length - 1;
  return { ...RANKS[idx], next: RANKS[idx + 1] };
};

export function moduleStatus(moduleId: string, index: number, progress: Progress, profile: ProfileId): ModuleStatus {
  if (progress.completed.includes(moduleId)) return 'completed';
  // Learner rule kept from the original app: modules unlock one after another. Demo mode opens everything.
  if (profile === 'learner' && index > progress.completed.length) return 'locked';
  return progress.viewed.includes(moduleId) ? 'viewed' : 'available';
}

export const STATUS_LABEL: Record<ModuleStatus, string> = {
  locked: 'Verrouillé',
  available: 'Disponible',
  viewed: 'Consulté',
  completed: 'Terminé',
};
