import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Lock, FlaskConical, X } from 'lucide-react';
import { BLOCKCHAIN_MODULES } from './data/modulesData';
import { INITIAL_CITIZENS, INITIAL_MISSIONS } from './data/citizensData';
import { districtOfModule } from './data/districtsData';
import { sound } from './utils/audio';
import { navigate, useRoute } from './lib/router';
import {
  ModuleStatus,
  Progress,
  ProfileId,
  computeStats,
  emptyProgress,
  moduleStatus,
  newCertificateId,
  progressStore,
} from './lib/progress';

import { TopBar, BottomNav } from './components/Navbar';
import { CityCanvas } from './components/CityCanvas';
import { ModuleList } from './components/ModuleList';
import { ModuleDetail } from './components/ModuleDetail';
import { CitizenMissions } from './components/CitizenMissions';
import { AiMentorDrawer } from './components/AiMentorDrawer';
import { CertificateView } from './components/CertificateView';
import { ProgressView } from './components/ProgressView';

const modules = BLOCKCHAIN_MODULES;

interface Toast {
  id: number;
  title: string;
  detail?: string;
  tone: 'ok' | 'warm' | 'info';
}

export default function App() {
  const route = useRoute();
  const [profile, setProfileState] = useState<ProfileId>(() => progressStore.loadProfile());
  const [progress, setProgress] = useState<Progress>(() => progressStore.load(progressStore.loadProfile()));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    progressStore.save(profile, progress);
  }, [profile, progress]);

  const statuses = useMemo(
    () => Object.fromEntries(modules.map((m, i) => [m.id, moduleStatus(m.id, i, progress, profile)])) as Record<string, ModuleStatus>,
    [progress, profile],
  );
  const statusOf = (id: string) => statuses[id] ?? 'locked';
  const missions = INITIAL_MISSIONS.map(m => ({ ...m, status: progress.resolvedMissions.includes(m.id) ? ('resolved' as const) : ('pending' as const) }));
  const stats = computeStats(progress, modules, missions);
  const nextModuleId = modules.find(m => statuses[m.id] === 'available' || statuses[m.id] === 'viewed')?.id;
  const pendingMissions = missions.filter(m => m.status === 'pending' && progress.completed.includes(m.moduleIdRequired)).length;
  const currentModule = route.moduleId ? modules.find(m => m.id === route.moduleId) : undefined;

  const notify = (title: string, detail?: string, tone: Toast['tone'] = 'ok') => {
    const id = ++toastId.current;
    setToasts(t => [...t.slice(-1), { id, title, detail, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  // Opening a module marks it as "consulté".
  useEffect(() => {
    const id = route.moduleId;
    if (!id || !statuses[id] || statuses[id] === 'locked' || progress.viewed.includes(id)) return;
    setProgress(p => ({ ...p, viewed: [...p.viewed, id] }));
  }, [route.moduleId, statuses, progress.viewed]);

  const finishIfComplete = (p: Progress): Progress =>
    p.completed.length === modules.length && !p.completedAt
      ? { ...p, completedAt: new Date().toISOString(), certificateId: p.certificateId ?? newCertificateId(profile) }
      : p;

  const handleCompleteModule = (moduleId: string) => {
    const mod = modules.find(m => m.id === moduleId);
    if (!mod || progress.completed.includes(moduleId)) return;
    const completed = [...progress.completed, moduleId];
    setProgress(p => finishIfComplete({ ...p, completed: [...p.completed, moduleId], viewed: p.viewed.includes(moduleId) ? p.viewed : [...p.viewed, moduleId] }));

    const district = districtOfModule(moduleId);
    const lit = district.moduleIds.filter(id => completed.includes(id)).length;
    notify(
      `Module ${mod.order} terminé · +${mod.xpReward} XP${profile === 'demo' ? ' (démo)' : ''}`,
      `${district.name} : ${lit}/3 étages allumés`,
    );
    if (completed.length === modules.length) notify('Parcours terminé !', 'Ton certificat est disponible.', 'warm');
  };

  const handleResolveMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.status === 'resolved') return;
    setProgress(p => ({ ...p, resolvedMissions: [...p.resolvedMissions, missionId] }));
    notify(`Mission résolue : ${mission.title}`, `+${mission.rewardXp} XP · +${mission.rewardCoins} CT-Coins`);
  };

  const handleSetProfile = (next: ProfileId) => {
    if (next === profile) return;
    sound.playClick();
    progressStore.saveProfile(next);
    setProfileState(next);
    setProgress(progressStore.load(next));
    notify(
      next === 'demo' ? 'Mode démonstration activé' : 'Retour au mode apprenant',
      next === 'demo' ? 'Tous les modules sont ouverts. Progression simulée, séparée de ta progression réelle.' : 'Ta progression réelle est restaurée.',
      next === 'demo' ? 'warm' : 'info',
    );
  };

  const handleSimulateAll = () => {
    if (profile !== 'demo') return;
    sound.playSuccess();
    setProgress(p =>
      finishIfComplete({
        ...p,
        completed: [...p.completed, ...modules.map(m => m.id).filter(id => !p.completed.includes(id))],
        viewed: modules.map(m => m.id),
      }),
    );
    notify('Démo : 18 modules validés', 'Simulation — aucune évaluation réelle. Le certificat de démonstration est prêt.', 'warm');
  };

  const handleReset = () => {
    if (profile === 'learner' && !window.confirm('Réinitialiser ta progression d’apprenant ? Cette action est définitive.')) return;
    progressStore.clear(profile);
    setProgress(emptyProgress());
    sound.playClick();
    notify(profile === 'demo' ? 'Démo réinitialisée' : 'Progression réinitialisée', undefined, 'info');
  };

  const openModule = (id: string) => {
    sound.playClick();
    navigate(`/parcours/${id}`);
  };

  const renderModulePage = () => {
    if (!currentModule) {
      return <Notice title="Module introuvable" text="Ce lien ne correspond à aucun module du parcours." />;
    }
    if (statusOf(currentModule.id) === 'locked') {
      return (
        <Notice
          title={`Module ${currentModule.order} verrouillé`}
          text="Les modules se débloquent dans l’ordre. Termine le module précédent, ou explore tout en mode démonstration."
          action={nextModuleId ? { label: 'Aller au prochain module disponible', onClick: () => openModule(nextModuleId) } : undefined}
        />
      );
    }
    const idx = modules.indexOf(currentModule);
    const prev = modules[idx - 1];
    const next = modules[idx + 1];
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/parcours')} className="inline-flex min-h-10 items-center gap-2 rounded-xl px-2 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Parcours · {districtOfModule(currentModule.id).name}
        </button>
        <ModuleDetail
          key={currentModule.id}
          module={currentModule}
          onCompleteModule={handleCompleteModule}
          onNavigateNext={() => next && statusOf(next.id) !== 'locked' && navigate(`/parcours/${next.id}`)}
          onNavigatePrev={() => prev && navigate(`/parcours/${prev.id}`)}
          onOpenCertificate={() => navigate('/certificat')}
          isCompleted={progress.completed.includes(currentModule.id)}
          demoMode={profile === 'demo'}
        />
      </div>
    );
  };

  const badges = {
    parcours: `${stats.completedCount}/${stats.totalModules}`,
    missions: pendingMissions ? String(pendingMissions) : undefined,
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only z-50 rounded-lg bg-brand px-4 py-2 text-brand-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Aller au contenu
      </a>
      <TopBar
        active={route.view}
        badges={badges}
        stats={stats}
        profile={profile}
        onSetProfile={handleSetProfile}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(sound.toggleSound())}
        onOpenMentor={() => setIsMentorOpen(true)}
      />

      {profile === 'demo' && (
        <div className="border-b border-demo/40 bg-demo/10">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 text-sm lg:px-6">
            <FlaskConical className="h-4 w-4 shrink-0 text-demo" aria-hidden />
            <p className="flex-1">
              <strong className="text-demo">Mode démonstration</strong>
              <span className="text-ink-muted"> · progression simulée, enregistrée à part. Elle n’est pas une progression évaluée.</span>
            </p>
            {stats.completedCount < stats.totalModules && (
              <button onClick={handleSimulateAll} className="min-h-9 rounded-lg bg-demo px-3 font-semibold text-white">Simuler les 18 modules</button>
            )}
            <button onClick={() => handleSetProfile('learner')} className="min-h-9 rounded-lg px-3 font-semibold text-ink-muted hover:text-ink">Quitter la démo</button>
          </div>
        </div>
      )}

      <main id="main" className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-28 pt-5 lg:px-6 lg:pb-10">
        {route.view === 'ville' && (
          <CityCanvas
            modules={modules}
            statusOf={statusOf}
            nextModuleId={nextModuleId}
            stats={stats}
            pendingMissions={pendingMissions}
            profile={profile}
            onOpenModule={openModule}
          />
        )}
        {route.view === 'parcours' && (route.moduleId ? renderModulePage() : <ModuleList modules={modules} statusOf={statusOf} profile={profile} onOpenModule={openModule} />)}
        {route.view === 'missions' && (
          <CitizenMissions
            citizens={INITIAL_CITIZENS}
            missions={missions}
            modules={modules}
            onGoToModule={openModule}
            onResolveMission={handleResolveMission}
            completedModuleIds={progress.completed}
          />
        )}
        {route.view === 'progression' && (
          <ProgressView
            modules={modules}
            stats={stats}
            statusOf={statusOf}
            profile={profile}
            onSetProfile={handleSetProfile}
            onSimulateAll={handleSimulateAll}
            onReset={handleReset}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(sound.toggleSound())}
          />
        )}
        {route.view === 'certificat' && (
          <CertificateView
            modules={modules}
            progress={progress}
            profile={profile}
            onSetLearnerName={name => setProgress(p => ({ ...p, learnerName: name }))}
            onSimulateAll={handleSimulateAll}
            onSetProfile={handleSetProfile}
          />
        )}
        <p className="mt-8 hidden text-center text-xs text-ink-muted lg:block">
          Skilloo · version MVP · ta progression est enregistrée uniquement sur cet appareil.
        </p>
      </main>

      <BottomNav active={route.view} badges={badges} />

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-end">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`animate-toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-panel p-3 shadow-xl ${
              t.tone === 'ok' ? 'border-ok/50' : t.tone === 'warm' ? 'border-brand/60' : 'border-line'
            }`}
          >
            <div className="flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.detail && <p className="text-xs text-ink-muted">{t.detail}</p>}
            </div>
            <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))} className="grid h-7 w-7 place-items-center rounded-md text-ink-muted hover:text-ink" aria-label="Fermer la notification">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <AiMentorDrawer
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        currentContext={currentModule ? `${currentModule.title} - ${currentModule.subtitle}` : 'Parcours Blockchain & Web3'}
      />
    </div>
  );
}

const Notice: React.FC<{ title: string; text: string; action?: { label: string; onClick: () => void } }> = ({ title, text, action }) => (
  <div className="panel mx-auto max-w-xl p-8 text-center">
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface"><Lock className="h-5 w-5 text-ink-muted" aria-hidden /></span>
    <h1 className="mt-3 font-display text-xl font-bold">{title}</h1>
    <p className="mt-2 text-ink-muted">{text}</p>
    <div className="mt-5 flex flex-wrap justify-center gap-3">
      {action && <button onClick={action.onClick} className="min-h-11 rounded-xl bg-brand px-5 font-semibold text-brand-navy">{action.label}</button>}
      <button onClick={() => navigate('/parcours')} className="min-h-11 rounded-xl border border-line px-5 font-semibold">Voir le parcours</button>
    </div>
  </div>
);
