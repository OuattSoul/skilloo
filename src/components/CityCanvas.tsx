import React, { useRef, useState } from 'react';
import { ZoomIn, ZoomOut, LocateFixed, Map as MapIcon, List, X, ArrowRight, Check, Lock, Eye, Circle, Target, Award } from 'lucide-react';
import { District, Module } from '../types';
import { DISTRICTS } from '../data/districtsData';
import { ModuleStatus, ProfileId, STATUS_LABEL, Stats } from '../lib/progress';
import { navigate } from '../lib/router';
import { sound } from '../utils/audio';
import { BuildingGraphic, DISTRICT_ICONS } from './BuildingGraphic';

interface CityCanvasProps {
  modules: Module[];
  statusOf: (moduleId: string) => ModuleStatus;
  nextModuleId?: string;
  stats: Stats;
  pendingMissions: number;
  profile: ProfileId;
  onOpenModule: (moduleId: string) => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.2;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export const STATUS_ICON: Record<ModuleStatus, React.ElementType> = { locked: Lock, available: Circle, viewed: Eye, completed: Check };
export const STATUS_STYLE: Record<ModuleStatus, string> = {
  locked: 'text-ink-muted',
  available: 'text-brand-ink',
  viewed: 'text-accent',
  completed: 'text-ok',
};

export const CityCanvas: React.FC<CityCanvasProps> = ({ modules, statusOf, nextModuleId, stats, pendingMissions, profile, onOpenModule }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'map' | 'list'>('map');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);
  const justDragged = useRef(false);

  const selected = DISTRICTS.find(d => d.id === selectedId) ?? null;
  const nextModule = modules.find(m => m.id === nextModuleId);
  const nextDistrictId = DISTRICTS.find(d => nextModuleId && d.moduleIds.includes(nextModuleId))?.id;
  const statusesOf = (d: District) => d.moduleIds.map(statusOf);

  const clampPan = (p: { x: number; y: number }, z: number) => {
    const el = viewportRef.current;
    if (!el) return p;
    const mx = (el.clientWidth * (z - 1)) / 2;
    const my = (el.clientHeight * (z - 1)) / 2;
    return { x: clamp(p.x, -mx, mx), y: clamp(p.y, -my, my) };
  };
  const zoomTo = (z: number) => {
    const nz = clamp(Math.round(z * 10) / 10, MIN_ZOOM, MAX_ZOOM);
    setZoom(nz);
    setPan(p => clampPan(p, nz));
  };
  const recenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const select = (id: string) => {
    sound.playClick();
    setSelectedId(id);
    // On small screens the panel sits below the map: bring it into view.
    if (window.matchMedia('(max-width: 1023px)').matches) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 60;
    const moves: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (e.key === '+' || e.key === '=') zoomTo(zoom + 0.3);
    else if (e.key === '-') zoomTo(zoom - 0.3);
    else if (e.key === '0') recenter();
    else if (e.key === 'Escape') setSelectedId(null);
    else if (moves[e.key] && zoom > 1 && e.target === e.currentTarget) setPan(p => clampPan({ x: p.x + moves[e.key][0], y: p.y + moves[e.key][1] }, zoom));
    else return;
    e.preventDefault();
  };

  const pointer = {
    onPointerDown: (e: React.PointerEvent) => {
      if (zoom <= 1) return;
      drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, moved: false };
    },
    onPointerMove: (e: React.PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      if (!d.moved && Math.hypot(dx, dy) > 5) {
        d.moved = true;
        setDragging(true);
        viewportRef.current?.setPointerCapture(e.pointerId);
      }
      if (d.moved) setPan(clampPan({ x: d.px + dx, y: d.py + dy }, zoom));
    },
    onPointerUp: () => {
      justDragged.current = !!drag.current?.moved;
      drag.current = null;
      setDragging(false);
    },
  };

  const pct = Math.round((stats.completedCount / stats.totalModules) * 100);

  return (
    <div className="space-y-4">
      {/* Compact stats + primary action */}
      <section aria-label="Résumé de progression" className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
        <StatTile label="Modules terminés" value={`${stats.completedCount}/${stats.totalModules}`} bar={pct} />
        <StatTile label="Niveau" value={`${stats.level}`} hint={`${stats.xpTotal.toLocaleString('fr-FR')} XP`} />
        <StatTile label="CT-Coins" value={stats.coins.toLocaleString('fr-FR')} hint="gagnés en jouant" />
        <StatTile label="Missions résolues" value={`${stats.missionsResolved}/${stats.missionsTotal}`} hint={pendingMissions ? `${pendingMissions} à résoudre` : undefined} />
        <div className="col-span-2 flex md:col-span-4 xl:col-span-1">
          {nextModule ? (
            <button
              onClick={() => onOpenModule(nextModule.id)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl bg-brand px-5 py-3 text-left text-brand-navy shadow-[0_8px_24px_-8px_rgb(49_216_245/0.6)] transition hover:brightness-110 xl:w-auto"
            >
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide opacity-75">Continuer · module {nextModule.order}</span>
                <span className="block font-display text-sm font-bold">{nextModule.title}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
            </button>
          ) : (
            <button onClick={() => navigate('/certificat')} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 font-display text-sm font-bold text-brand-navy xl:w-auto">
              <Award className="h-5 w-5" aria-hidden /> Voir mon certificat
            </button>
          )}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-label="Ville" className="panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
            <div>
              <h1 className="font-display text-base font-bold">Skilloo City</h1>
              <p className="text-xs text-ink-muted">6 quartiers · chaque étage allumé = un module terminé</p>
            </div>
            <div role="group" aria-label="Affichage" className="flex rounded-xl border border-line bg-night p-0.5 text-sm">
              {([['map', 'Plan', MapIcon], ['list', 'Liste', List]] as const).map(([m, label, Icon]) => (
                <button
                  key={m}
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                  className={`flex min-h-9 items-center gap-1.5 rounded-lg px-3 ${mode === m ? 'bg-surface text-ink' : 'text-ink-muted hover:text-ink'}`}
                >
                  <Icon className="h-4 w-4" aria-hidden /> {label}
                </button>
              ))}
            </div>
          </div>

          {mode === 'map' ? (
            <div
              ref={viewportRef}
              tabIndex={0}
              role="group"
              aria-label="Plan de la ville. Touches + et − pour zoomer, flèches pour se déplacer, 0 pour recentrer, Tab pour parcourir les quartiers."
              onKeyDown={onKeyDown}
              {...pointer}
              onPointerCancel={pointer.onPointerUp}
              onClickCapture={e => {
                if (justDragged.current) {
                  e.stopPropagation();
                  justDragged.current = false;
                }
              }}
              className={`city-ground relative h-[440px] overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand sm:h-[520px] lg:h-[calc(100dvh-280px)] lg:min-h-[500px] ${
                zoom > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
              }`}
              style={{ touchAction: zoom > 1 ? 'none' : 'pan-y' }}
            >
              <div
                className={`absolute inset-0 origin-center ${dragging ? '' : 'transition-transform duration-300 ease-out'}`}
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
              >
                <CityRoads statusesOf={statusesOf} />
                <img src="/brand/loo-1.png" alt="" aria-hidden className="pointer-events-none absolute left-1/2 top-[57%] w-12 -translate-x-1/2 -translate-y-1/2 opacity-90 sm:w-16" />
                {DISTRICTS.map(d => (
                  <button
                    key={d.id}
                    onClick={() => select(d.id)}
                    aria-pressed={selectedId === d.id}
                    aria-label={`${d.name}, ${d.category} : ${statusesOf(d).filter(s => s === 'completed').length} sur 3 modules terminés`}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-xl p-1"
                    style={{ left: `${d.position.x}%`, top: `${d.position.y}%` }}
                  >
                    <BuildingGraphic district={d} statuses={statusesOf(d)} selected={selectedId === d.id} isNext={d.id === nextDistrictId} />
                  </button>
                ))}
              </div>

              <Legend profile={profile} />
              <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-xl border border-line bg-panel/95 shadow-lg">
                <MapButton label="Zoomer" onClick={() => zoomTo(zoom + 0.3)} disabled={zoom >= MAX_ZOOM}><ZoomIn className="h-5 w-5" /></MapButton>
                <MapButton label="Dézoomer" onClick={() => zoomTo(zoom - 0.3)} disabled={zoom <= MIN_ZOOM}><ZoomOut className="h-5 w-5" /></MapButton>
                <MapButton label="Recentrer la vue" onClick={recenter} disabled={zoom === 1 && pan.x === 0 && pan.y === 0}><LocateFixed className="h-5 w-5" /></MapButton>
              </div>
            </div>
          ) : (
            <ul className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {DISTRICTS.map(d => (
                <li key={d.id}>
                  <button
                    onClick={() => select(d.id)}
                    aria-pressed={selectedId === d.id}
                    className={`h-full w-full rounded-xl border p-4 text-left transition-colors ${selectedId === d.id ? 'border-brand bg-surface' : 'border-line bg-night/60 hover:border-ink-muted'}`}
                  >
                    <DistrictHeader district={d} statuses={statusesOf(d)} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside ref={panelRef} aria-label="Détails du quartier" aria-live="polite" className="panel h-fit p-5 lg:sticky lg:top-20">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <DistrictHeader district={selected} statuses={statusesOf(selected)} />
                <button onClick={() => setSelectedId(null)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-surface hover:text-ink" aria-label="Fermer le quartier">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{selected.description}</p>
              <h2 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-ink-muted">Modules du quartier</h2>
              <ModuleLinks moduleIds={selected.moduleIds} modules={modules} statusOf={statusOf} onOpenModule={onOpenModule} />
            </>
          ) : (
            <div className="text-center">
              <img src="/brand/loo-main.png" alt="Loo, la mascotte Skilloo, fait coucou" className="mx-auto w-32" width={128} height={170} />
              <p className="mt-3 font-display text-lg font-bold">Salut ! Je suis Loo.</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                Sélectionne un bâtiment pour voir ses modules. Chaque module terminé allume un étage de ta ville.
              </p>
              <button onClick={() => navigate('/parcours')} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold hover:border-brand">
                Voir les 18 modules <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
          {pendingMissions > 0 && (
            <button onClick={() => navigate('/missions')} className="mt-5 flex w-full items-center gap-3 rounded-xl border border-brand/40 bg-brand/10 p-3 text-left text-sm hover:bg-brand/15">
              <Target className="h-5 w-5 shrink-0 text-brand-ink" aria-hidden />
              <span>
                <strong className="block text-ink">{pendingMissions} mission{pendingMissions > 1 ? 's' : ''} citoyenne{pendingMissions > 1 ? 's' : ''} à résoudre</strong>
                <span className="text-ink-muted">Utilise tes compétences pour aider les habitants.</span>
              </span>
            </button>
          )}
        </aside>
      </div>
    </div>
  );
};

const StatTile: React.FC<{ label: string; value: string; hint?: string; bar?: number }> = ({ label, value, hint, bar }) => (
  <div className="panel px-4 py-3">
    <p className="text-xs text-ink-muted">{label}</p>
    <p className="font-display text-xl font-bold">{value}</p>
    {bar !== undefined ? (
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full bg-ok transition-[width] duration-500" style={{ width: `${bar}%` }} />
      </div>
    ) : (
      hint && <p className="text-xs text-ink-muted">{hint}</p>
    )}
  </div>
);

const MapButton: React.FC<{ label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }> = ({ label, onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled} aria-label={label} title={label} className="grid h-11 w-11 place-items-center text-ink hover:bg-surface disabled:text-line">
    {children}
  </button>
);

const Legend: React.FC<{ profile: ProfileId }> = ({ profile }) => (
  <ul className="absolute left-3 top-3 hidden gap-3 rounded-xl border border-line bg-panel/95 px-3 py-2 text-xs text-ink-muted sm:flex" aria-label="Légende">
    {(['completed', 'viewed', 'available', ...(profile === 'learner' ? ['locked'] : [])] as ModuleStatus[]).map(s => {
      const Icon = STATUS_ICON[s];
      return (
        <li key={s} className="flex items-center gap-2">
          <Icon className={`h-3.5 w-3.5 ${STATUS_STYLE[s]}`} aria-hidden /> {STATUS_LABEL[s]}
        </li>
      );
    })}
  </ul>
);

// Roads run at the towers' feet, not through their floors.
const ROAD_OFFSET = 7;

const CityRoads: React.FC<{ statusesOf: (d: District) => ModuleStatus[] }> = ({ statusesOf }) => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
    {DISTRICTS.slice(0, -1).map((d, i) => {
      const n = DISTRICTS[i + 1];
      const y1 = d.position.y + ROAD_OFFSET;
      const y2 = n.position.y + ROAD_OFFSET;
      const lit = statusesOf(d).every(s => s === 'completed');
      return (
        <g key={d.id}>
          <line x1={d.position.x} y1={y1} x2={n.position.x} y2={y2} stroke="#0B2149" strokeWidth={22} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <line
            x1={d.position.x} y1={y1} x2={n.position.x} y2={y2}
            stroke={lit ? d.accent : '#22407A'} strokeWidth={lit ? 3 : 2} strokeDasharray={lit ? undefined : '6 8'}
            vectorEffect="non-scaling-stroke" opacity={lit ? 0.9 : 1}
          />
        </g>
      );
    })}
  </svg>
);

export const DistrictHeader: React.FC<{ district: District; statuses: ModuleStatus[] }> = ({ district, statuses }) => {
  const Icon = DISTRICT_ICONS[district.icon];
  const done = statuses.filter(s => s === 'completed').length;
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${district.accent}22`, color: district.accent }}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-display text-base font-bold leading-tight">{district.name}</p>
          <p className="text-xs text-ink-muted">{district.category}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${(done / statuses.length) * 100}%`, background: district.accent }} />
        </div>
        {done}/{statuses.length}
      </div>
    </div>
  );
};

export const ModuleLinks: React.FC<{
  moduleIds: string[];
  modules: Module[];
  statusOf: (id: string) => ModuleStatus;
  onOpenModule: (id: string) => void;
}> = ({ moduleIds, modules, statusOf, onOpenModule }) => (
  <ul className="space-y-2">
    {moduleIds.map(id => {
      const m = modules.find(x => x.id === id)!;
      const s = statusOf(id);
      const Icon = STATUS_ICON[s];
      return (
        <li key={id}>
          <button
            onClick={() => onOpenModule(id)}
            disabled={s === 'locked'}
            title={s === 'locked' ? 'Termine le module précédent pour le débloquer' : undefined}
            className="flex w-full items-center gap-3 rounded-xl border border-line bg-night/60 p-3 text-left transition-colors hover:border-brand disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-line"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface font-display text-sm font-bold">{m.order}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{m.title}</span>
              <span className={`flex items-center gap-1 text-xs ${STATUS_STYLE[s]}`}>
                <Icon className="h-3 w-3" aria-hidden /> {STATUS_LABEL[s]}
              </span>
            </span>
            {s !== 'locked' && <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />}
          </button>
        </li>
      );
    })}
  </ul>
);
