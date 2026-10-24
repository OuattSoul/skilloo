import React from 'react';
import { Coins, Server, GraduationCap, Rocket, Landmark, ShieldCheck, Lock, Check } from 'lucide-react';
import { District } from '../types';
import { ModuleStatus } from '../lib/progress';

export const DISTRICT_ICONS = { Coins, Server, GraduationCap, Rocket, Landmark, ShieldCheck };

interface BuildingGraphicProps {
  district: District;
  statuses: ModuleStatus[]; // one per module, bottom floor = first module
  selected: boolean;
  isNext: boolean;
}

/** A tower whose floors light up as the district's modules are viewed / completed. */
export const BuildingGraphic: React.FC<BuildingGraphicProps> = ({ district, statuses, selected, isNext }) => {
  const Icon = DISTRICT_ICONS[district.icon];
  const done = statuses.filter(s => s === 'completed').length;
  const allLocked = statuses.every(s => s === 'locked');
  const complete = done === statuses.length;
  const accent = district.accent;

  return (
    <div className="relative flex flex-col items-center">
      {/* ground halo */}
      <div
        aria-hidden
        className="absolute bottom-9 h-8 w-[118px] rounded-[50%] sm:w-[140px]"
        style={{ background: `radial-gradient(closest-side, ${allLocked ? '#22407A' : accent}${complete ? '66' : '33'}, transparent)` }}
      />

      <div className="mb-1 h-6">
        {isNext && <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-brand-navy shadow">À suivre</span>}
        {complete && (
          <span className="flex items-center gap-1 rounded-full bg-[#5EE6A8]/15 px-2 py-0.5 text-[11px] font-semibold text-[#5EE6A8] ring-1 ring-[#5EE6A8]/40">
            <Check className="h-3 w-3" aria-hidden /> Terminé
          </span>
        )}
      </div>

      {/* tower */}
      <div
        className={`relative flex w-[76px] flex-col items-center transition-transform duration-200 sm:w-[92px] ${selected ? '-translate-y-1' : 'group-hover:-translate-y-0.5'}`}
        style={{ opacity: allLocked ? 0.55 : 1 }}
      >
        <div className="h-3 w-0.5" style={{ background: done ? accent : '#22407A' }} />
        <div className="mb-0.5 h-1.5 w-1.5 rounded-full" style={{ background: done ? accent : '#22407A', boxShadow: done ? `0 0 8px ${accent}` : 'none' }} />
        {[...statuses].reverse().map((s, i) => (
          <div
            key={i}
            className={`mb-0.5 flex h-5 w-[86%] items-center justify-around rounded-[3px] border sm:h-6 ${s === 'locked' ? 'border-dashed' : ''}`}
            style={{
              borderColor: s === 'completed' ? accent : s === 'viewed' ? `${accent}99` : '#22407A',
              background: s === 'completed' ? `${accent}30` : s === 'viewed' ? `${accent}12` : '#0A1F44',
            }}
          >
            {[0, 1, 2].map(w => (
              <span
                key={w}
                className="h-1.5 w-2.5 rounded-[1px] sm:h-2 sm:w-3"
                style={{ background: s === 'completed' ? accent : s === 'viewed' ? `${accent}55` : '#143366' }}
              />
            ))}
          </div>
        ))}
        <div
          className={`grid h-9 w-full place-items-center rounded-md border-2 bg-[#0F2A55] sm:h-10 ${selected ? 'ring-2 ring-offset-2 ring-offset-[#071B3D]' : ''}`}
          style={{ borderColor: allLocked ? '#22407A' : accent, ['--tw-ring-color' as string]: accent }}
        >
          {allLocked ? <Lock className="h-4 w-4 text-[#A6B6D3]" aria-hidden /> : <Icon className="h-5 w-5" style={{ color: accent }} aria-hidden />}
        </div>
      </div>

      <div className={`mt-2 max-w-[120px] rounded-lg px-2 py-1 text-center sm:max-w-[150px] ${selected ? 'bg-white ring-2 ring-brand' : 'bg-white/90'}`}>
        <p className="text-xs font-semibold leading-tight text-ink sm:text-[13px]">{district.name}</p>
        <p className="text-[11px] text-ink-muted">{done}/{statuses.length} modules</p>
      </div>
    </div>
  );
};
