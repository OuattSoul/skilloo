import React, { useState } from 'react';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import { Module } from '../types';
import { DISTRICTS } from '../data/districtsData';
import { ModuleStatus, ProfileId, STATUS_LABEL } from '../lib/progress';
import { STATUS_ICON, STATUS_STYLE, DistrictHeader } from './CityCanvas';

interface ModuleListProps {
  modules: Module[];
  statusOf: (moduleId: string) => ModuleStatus;
  profile: ProfileId;
  onOpenModule: (moduleId: string) => void;
}

const FILTERS: { id: 'all' | 'todo' | ModuleStatus; label: string; match: (s: ModuleStatus) => boolean }[] = [
  { id: 'all', label: 'Tous', match: () => true },
  { id: 'todo', label: 'À faire', match: s => s === 'available' || s === 'locked' },
  { id: 'viewed', label: 'Consultés', match: s => s === 'viewed' },
  { id: 'completed', label: 'Terminés', match: s => s === 'completed' },
];

/** Parcours page: the 18 modules grouped by city district, built from module data. */
export const ModuleList: React.FC<ModuleListProps> = ({ modules, statusOf, profile, onOpenModule }) => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const match = FILTERS.find(f => f.id === filter)!.match;
  const done = modules.filter(m => statusOf(m.id) === 'completed').length;

  return (
    <div className="space-y-5">
      <header className="panel flex flex-wrap items-end justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink">Parcours 1 · Spécialité</p>
          <h1 className="font-display text-2xl font-bold">Blockchain & Web3</h1>
          <p className="mt-1 max-w-xl text-sm text-ink-muted">
            18 modules, chacun avec théorie, laboratoire interactif et quiz.
            {profile === 'learner' ? ' Les modules se débloquent dans l’ordre.' : ' Mode démonstration : tous les modules sont ouverts.'}
          </p>
        </div>
        <div className="w-full sm:w-64">
          <div className="flex justify-between text-sm"><span className="text-ink-muted">Progression</span><strong>{done}/{modules.length}</strong></div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-ok transition-[width] duration-500" style={{ width: `${(done / modules.length) * 100}%` }} />
          </div>
        </div>
      </header>

      <div role="group" aria-label="Filtrer les modules" className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.id}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`min-h-9 rounded-full border px-4 text-sm font-medium ${filter === f.id ? 'border-brand bg-brand/15 text-ink' : 'border-line text-ink-muted hover:text-ink'}`}
          >
            {f.label} <span className="text-ink-muted">({modules.filter(m => f.match(statusOf(m.id))).length})</span>
          </button>
        ))}
      </div>

      {DISTRICTS.map(d => {
        const items = d.moduleIds.map(id => modules.find(m => m.id === id)!).filter(m => match(statusOf(m.id)));
        if (!items.length) return null;
        return (
          <section key={d.id} aria-labelledby={`dist-${d.id}`} className="panel p-5">
            <div id={`dist-${d.id}`} className="max-w-md">
              <DistrictHeader district={d} statuses={d.moduleIds.map(statusOf)} />
            </div>
            <ul className="mt-4 grid gap-3 md:grid-cols-3">
              {items.map(m => {
                const s = statusOf(m.id);
                const Icon = STATUS_ICON[s];
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => onOpenModule(m.id)}
                      disabled={s === 'locked'}
                      className="group flex h-full w-full flex-col rounded-xl border border-line bg-night/60 p-4 text-left transition-colors hover:border-brand disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-line"
                    >
                      <span className="flex w-full items-center justify-between text-xs">
                        <span className="rounded-md bg-surface px-2 py-0.5 font-semibold">Module {m.order}</span>
                        <span className={`flex items-center gap-1 font-semibold ${STATUS_STYLE[s]}`}>
                          <Icon className="h-3.5 w-3.5" aria-hidden /> {STATUS_LABEL[s]}
                        </span>
                      </span>
                      <span className="mt-3 block font-display text-[15px] font-bold leading-snug">{m.title}</span>
                      <span className="mt-1 line-clamp-2 text-sm text-ink-muted">{m.subtitle}</span>
                      <span className="mt-auto flex w-full items-center gap-3 pt-4 text-xs text-ink-muted">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{m.duration}</span>
                        <span>{m.difficulty}</span>
                        <span className="flex items-center gap-1 text-brand-ink"><Zap className="h-3.5 w-3.5" aria-hidden />{m.xpReward} XP</span>
                        {s !== 'locked' && <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
};
