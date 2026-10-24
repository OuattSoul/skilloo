import React from 'react';
import { Citizen, IncidentMission, Module } from '../types';
import { sound } from '../utils/audio';
import { Users, ShieldAlert, CheckCircle2, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

interface CitizenMissionsProps {
  citizens: Citizen[];
  missions: IncidentMission[];
  modules: Module[];
  onGoToModule: (moduleId: string) => void;
  onResolveMission: (missionId: string) => void;
  completedModuleIds: string[];
}

export const CitizenMissions: React.FC<CitizenMissionsProps> = ({
  citizens,
  missions,
  modules,
  onGoToModule,
  onResolveMission,
  completedModuleIds,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* Header Banner */}
      <div className="panel p-5 sm:p-6 text-ink flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-ink" />
            <span>Missions citoyennes</span>
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Les habitants IA de la ville rencontrent des besoins concrets. Mobilisez vos compétences Web3 pour les résoudre !
          </p>
        </div>
      </div>

      {/* Citizens Grid */}
      <div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted mb-3 px-1">
          ANNUAIRE DES HABITANTS CLÉS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {citizens.map((cit) => (
            <div key={cit.id} className="panel p-4 space-y-2 text-ink">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{cit.avatar}</span>
                <div>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wide">{cit.name}</h4>
                  <span className="text-[11px] text-ink-muted font-mono block">{cit.role}</span>
                </div>
              </div>
              <p className="text-[11px] text-ink-muted italic bg-surface p-2 border border-line">
                "{cit.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Missions Feed */}
      <div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted mb-3 px-1 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-brand-ink" />
          <span>INCIDENTS & DEMANDES CITOYENNES EN DIRECT</span>
        </h3>

        <div className="space-y-3">
          {missions.map((miss) => {
            const citizen = citizens.find(c => c.id === miss.citizenId);
            const reqModule = modules.find(m => m.id === miss.moduleIdRequired);
            const isUnlocked = completedModuleIds.includes(miss.moduleIdRequired);
            const isResolved = miss.status === 'resolved';

            return (
              <div
                key={miss.id}
                className={`p-4 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-4 ${
                  isResolved
                    ? 'bg-surface border-ok/40 opacity-80'
                    : isUnlocked
                      ? 'bg-surface border-brand shadow-[0_0_12px_rgba(250,124,12,0.2)]'
                      : 'bg-panel border-line opacity-60'
                }`}
              >
                <div className="flex items-start space-x-4 max-w-2xl">
                  <span className="text-3xl flex-shrink-0">{citizen?.avatar || '👤'}</span>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-ink uppercase tracking-wide">{miss.title}</h4>
                      <span className="text-[11px] text-ink-muted">• Soumis par {citizen?.name}</span>
                    </div>
                    <p className="text-sm text-ink">{miss.description}</p>
                    <div className="text-xs text-ink-muted pt-1 flex flex-wrap items-center gap-x-2">
                      <span>MODULE REQUIS : <strong className="text-brand-ink">{reqModule?.title}</strong></span>
                      <span>•</span>
                      <span className="text-ok font-bold">+{miss.rewardCoins} CT</span>
                      <span>•</span>
                      <span className="text-brand-ink font-bold">+{miss.rewardXp} XP</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {isResolved ? (
                    <span className="px-3 py-1 bg-surface text-ok font-bold text-xs uppercase border border-ok flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>RÉSOLU</span>
                    </span>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => {
                        sound.playSuccess();
                        onResolveMission(miss.id);
                      }}
                      className="min-h-11 rounded-xl px-4 py-2 bg-brand hover:bg-[#FF9A3D] text-brand-navy font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-[0_0_10px_rgba(250,124,12,0.3)]"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>RÉSOUDRE L'INCIDENT</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onGoToModule(miss.moduleIdRequired);
                      }}
                      className="min-h-11 rounded-xl px-4 py-2 bg-raised border border-line hover:border-brand text-ink font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all"
                    >
                      <span>APPRENDRE LE MODULE</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
