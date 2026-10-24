import React from 'react';
import { Map, Route as RouteIcon, Target, TrendingUp, Award, Volume2, VolumeX, Bot, Coins, FlaskConical } from 'lucide-react';
import { View, navigate } from '../lib/router';
import { ProfileId, Stats } from '../lib/progress';
import { sound } from '../utils/audio';

export const NAV_ITEMS: { view: View; label: string; icon: React.ElementType }[] = [
  { view: 'ville', label: 'Ville', icon: Map },
  { view: 'parcours', label: 'Parcours', icon: RouteIcon },
  { view: 'missions', label: 'Missions', icon: Target },
  { view: 'progression', label: 'Progression', icon: TrendingUp },
  { view: 'certificat', label: 'Certificat', icon: Award },
];

interface NavProps {
  active: View;
  badges: Partial<Record<View, string>>;
}

const go = (view: View) => {
  sound.playClick();
  navigate(`/${view}`);
};

interface TopBarProps extends NavProps {
  stats: Stats;
  profile: ProfileId;
  onSetProfile: (p: ProfileId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenMentor: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ active, badges, stats, profile, onSetProfile, soundEnabled, onToggleSound, onOpenMentor }) => {
  const xpPct = Math.min(100, Math.round((stats.xpInLevel / stats.xpForNext) * 100));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-night/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 lg:px-6">
        <a href="#/ville" className="flex shrink-0 items-center gap-3" aria-label="Skilloo — accueil, la ville">
          <img src="/brand/skilloo-logo-dark.png" alt="Skilloo" className="h-8 w-auto sm:h-9" width={160} height={57} />
        </a>
        <div className="hidden min-w-0 shrink-0 border-l border-line pl-3 2xl:block">
          <p className="whitespace-nowrap font-display text-sm font-semibold text-ink">Skilloo City</p>
          <p className="whitespace-nowrap text-xs text-ink-muted">Parcours Blockchain & Web3</p>
        </div>

        {/* Mode switch: demo progress is stored separately from the learner's real progress */}
        <div role="group" aria-label="Mode actif" className="ml-1 flex rounded-full border border-line bg-panel p-0.5 text-xs font-semibold">
          {(['learner', 'demo'] as ProfileId[]).map(p => (
            <button
              key={p}
              aria-pressed={profile === p}
              onClick={() => onSetProfile(p)}
              className={`flex min-h-8 items-center gap-1 rounded-full px-3 transition-colors ${
                profile === p
                  ? p === 'demo' ? 'bg-demo text-white' : 'bg-brand text-brand-navy'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {p === 'demo' && <FlaskConical className="h-3.5 w-3.5" aria-hidden />}
              {p === 'learner' ? 'Apprenant' : 'Démo'}
            </button>
          ))}
        </div>

        <nav aria-label="Navigation principale" className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              onClick={() => go(view)}
              aria-current={active === view ? 'page' : undefined}
              className={`flex min-h-10 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-sm font-medium transition-colors ${
                active === view ? 'bg-surface text-brand-ink shadow-[inset_0_-2px_0_var(--color-brand)]' : 'text-ink-muted hover:bg-surface/60 hover:text-ink'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
              {badges[view] && <span className="rounded-full bg-raised px-1.5 text-xs text-ink">{badges[view]}</span>}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <div className="hidden min-w-[132px] flex-col 2xl:flex" title={`${stats.xpTotal} XP au total`}>
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-brand-ink">Niv. {stats.level}</span>
              <span className="text-ink-muted">{stats.xpInLevel}/{stats.xpForNext} XP</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface" role="progressbar" aria-label="XP du niveau" aria-valuenow={xpPct} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${xpPct}%` }} />
            </div>
          </div>
          <div className="hidden items-center gap-1.5 rounded-xl border border-line bg-panel px-2.5 py-1.5 text-sm md:flex" title="CT-Coins gagnés (modules et missions)">
            <Coins className="h-4 w-4 text-brand-ink" aria-hidden />
            <span className="font-semibold">{stats.coins.toLocaleString('fr-FR')}</span>
          </div>
          <button
            onClick={onToggleSound}
            className="hidden h-10 w-10 place-items-center rounded-xl border border-line bg-panel text-ink-muted hover:text-ink sm:grid"
            aria-label={soundEnabled ? 'Couper le son' : 'Activer le son'}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenMentor();
            }}
            className="flex h-10 items-center gap-2 rounded-xl border border-accent/50 bg-accent/15 px-3 text-sm font-semibold text-ink hover:bg-accent/25"
          >
            <Bot className="h-4 w-4 text-accent" aria-hidden />
            <span className="hidden whitespace-nowrap 2xl:inline">Demander à Loo</span>
            <span className="sr-only 2xl:hidden">Ouvrir le mentor Loo</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export const BottomNav: React.FC<NavProps> = ({ active, badges }) => (
  <nav aria-label="Navigation principale" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-night/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
    <ul className="mx-auto grid max-w-lg grid-cols-5">
      {NAV_ITEMS.map(({ view, label, icon: Icon }) => (
        <li key={view}>
          <button
            onClick={() => go(view)}
            aria-current={active === view ? 'page' : undefined}
            className={`relative flex min-h-14 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
              active === view ? 'text-brand-ink' : 'text-ink-muted'
            }`}
          >
            {active === view && <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-brand" aria-hidden />}
            <Icon className="h-5 w-5" aria-hidden />
            {label}
            {badges[view] && <span className="absolute right-2 top-1.5 rounded-full bg-raised px-1 text-[11px] leading-4 text-ink">{badges[view]}</span>}
          </button>
        </li>
      ))}
    </ul>
  </nav>
);
