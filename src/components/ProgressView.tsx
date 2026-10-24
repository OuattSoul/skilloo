import React from 'react';
import { FlaskConical, RotateCcw, Award, Check, Volume2, VolumeX } from 'lucide-react';
import { Module } from '../types';
import { DISTRICTS } from '../data/districtsData';
import { ModuleStatus, ProfileId, RANKS, STATUS_LABEL, Stats, rankFor } from '../lib/progress';
import { navigate } from '../lib/router';
import { DistrictHeader, STATUS_ICON, STATUS_STYLE } from './CityCanvas';

interface ProgressViewProps {
  modules: Module[];
  stats: Stats;
  statusOf: (moduleId: string) => ModuleStatus;
  profile: ProfileId;
  onSetProfile: (p: ProfileId) => void;
  onSimulateAll: () => void;
  onReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ modules, stats, statusOf, profile, onSetProfile, onSimulateAll, onReset, soundEnabled, onToggleSound }) => {
  const rank = rankFor(stats.completedCount);
  const isDemo = profile === 'demo';
  const allDone = stats.completedCount === stats.totalModules;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="panel flex flex-col gap-5 p-5 sm:flex-row sm:items-center" aria-labelledby="rank-title">
          <img src={rank.image} alt={`Loo, rang ${rank.label}`} className="mx-auto w-32 shrink-0 sm:mx-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink">Ton rang{isDemo && ' · démonstration'}</p>
            <h1 id="rank-title" className="font-display text-3xl font-bold">{rank.label}</h1>
            <p className="mt-1 text-ink-muted">{rank.tagline}</p>
            {rank.next && (
              <p className="mt-3 text-sm">
                Encore <strong>{rank.next.min - stats.completedCount} module{rank.next.min - stats.completedCount > 1 ? 's' : ''}</strong> pour devenir <strong className="text-brand-ink">{rank.next.label}</strong>.
              </p>
            )}
            <ol className="mt-4 flex gap-1" aria-label="Rangs">
              {RANKS.map(r => (
                <li key={r.label} className="flex-1">
                  <div className={`h-1.5 rounded-full ${stats.completedCount >= r.min ? 'bg-brand' : 'bg-surface'}`} />
                  <span className={`mt-1 block text-[11px] ${r.label === rank.label ? 'font-semibold text-ink' : 'text-ink-muted'}`}>{r.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3" aria-label="Statistiques">
          <Tile label="Modules terminés" value={`${stats.completedCount}/${stats.totalModules}`} />
          <Tile label={`Niveau ${stats.level}`} value={`${stats.xpTotal.toLocaleString('fr-FR')} XP`} hint={`${stats.xpForNext - stats.xpInLevel} XP avant le niveau ${stats.level + 1}`} />
          <Tile label="CT-Coins" value={stats.coins.toLocaleString('fr-FR')} hint="récompenses de jeu" />
          <Tile label="Missions résolues" value={`${stats.missionsResolved}/${stats.missionsTotal}`} />
        </section>
      </div>

      {/* Demo controls: demo progress lives in its own profile and never touches learner progress */}
      <section className={`panel p-5 ${isDemo ? 'border-demo/50' : ''}`} aria-labelledby="demo-title">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <h2 id="demo-title" className="flex items-center gap-2 font-display text-lg font-bold">
              <FlaskConical className="h-5 w-5 text-demo" aria-hidden /> Mode démonstration
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Ouvre les 18 modules, simule la validation complète et prévisualise le certificat. La progression simulée est
              enregistrée à part : ta progression d’apprenant n’est jamais modifiée.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isDemo ? (
              <>
                <button onClick={onSimulateAll} disabled={allDone} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-demo px-4 font-semibold text-white disabled:opacity-50">
                  <Check className="h-4 w-4" aria-hidden /> Simuler la validation des 18 modules
                </button>
                <button onClick={() => navigate('/certificat')} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 font-semibold hover:border-brand">
                  <Award className="h-4 w-4" aria-hidden /> Voir le certificat
                </button>
                <button onClick={onReset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 font-semibold hover:border-danger">
                  <RotateCcw className="h-4 w-4" aria-hidden /> Réinitialiser la démo
                </button>
                <button onClick={() => onSetProfile('learner')} className="inline-flex min-h-11 items-center rounded-xl px-4 font-semibold text-ink-muted hover:text-ink">
                  Quitter la démo
                </button>
              </>
            ) : (
              <button onClick={() => onSetProfile('demo')} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-demo/60 bg-demo/10 px-4 font-semibold text-demo">
                <FlaskConical className="h-4 w-4" aria-hidden /> Passer en mode démonstration
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Avancement par quartier">
        {DISTRICTS.map(d => (
          <div key={d.id} className="panel min-w-0 p-5">
            <DistrictHeader district={d} statuses={d.moduleIds.map(statusOf)} />
            <ul className="mt-3 space-y-1.5">
              {d.moduleIds.map(id => {
                const m = modules.find(x => x.id === id)!;
                const s = statusOf(id);
                const Icon = STATUS_ICON[s];
                return (
                  <li key={id} className="flex items-center gap-2 text-sm">
                    <Icon className={`h-4 w-4 shrink-0 ${STATUS_STYLE[s]}`} aria-label={STATUS_LABEL[s]} />
                    <span className={`min-w-0 truncate ${s === 'completed' ? '' : 'text-ink-muted'}`}>{m.order}. {m.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>

      <section className="panel flex flex-wrap items-center justify-between gap-3 p-5" aria-label="Préférences">
        <button onClick={onToggleSound} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold">
          {soundEnabled ? <Volume2 className="h-4 w-4" aria-hidden /> : <VolumeX className="h-4 w-4" aria-hidden />}
          Son : {soundEnabled ? 'activé' : 'coupé'}
        </button>
        {!isDemo && (
          <button onClick={onReset} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-ink-muted hover:text-danger">
            <RotateCcw className="h-4 w-4" aria-hidden /> Réinitialiser ma progression
          </button>
        )}
      </section>
    </div>
  );
};

const Tile: React.FC<{ label: string; value: string; hint?: string }> = ({ label, value, hint }) => (
  <div className="panel p-4">
    <p className="text-xs text-ink-muted">{label}</p>
    <p className="font-display text-2xl font-bold">{value}</p>
    {hint && <p className="text-xs text-ink-muted">{hint}</p>}
  </div>
);
