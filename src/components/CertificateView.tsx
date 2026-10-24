import React from 'react';
import { Printer, Lock, FlaskConical, ArrowRight, Info } from 'lucide-react';
import { Module } from '../types';
import { Progress, ProfileId } from '../lib/progress';
import { navigate } from '../lib/router';
import { sound } from '../utils/audio';

interface CertificateViewProps {
  modules: Module[];
  progress: Progress;
  profile: ProfileId;
  onSetLearnerName: (name: string) => void;
  onSimulateAll: () => void;
  onSetProfile: (p: ProfileId) => void;
}

export const DEMO_LEARNER_NAME = 'Apprenant·e de démonstration';

export const CertificateView: React.FC<CertificateViewProps> = ({ modules, progress, profile, onSetLearnerName, onSimulateAll, onSetProfile }) => {
  const isDemo = profile === 'demo';
  const done = progress.completed.length;
  const remaining = modules.length - done;

  if (remaining > 0) {
    return (
      <div className="panel mx-auto max-w-2xl p-6 text-center sm:p-10">
        <img src="/brand/loo-1.png" alt="" className="mx-auto w-24" />
        <span className="mx-auto mt-4 grid h-12 w-12 place-items-center rounded-full bg-surface"><Lock className="h-5 w-5 text-ink-muted" aria-hidden /></span>
        <h1 className="mt-3 font-display text-2xl font-bold">Certificat pas encore disponible</h1>
        <p className="mt-2 text-ink-muted">
          Il te reste <strong className="text-ink">{remaining} module{remaining > 1 ? 's' : ''}</strong> sur {modules.length} à terminer
          {isDemo ? ' dans la progression de démonstration.' : '.'}
        </p>
        <div className="mx-auto mt-4 h-2 max-w-sm overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-ok" style={{ width: `${(done / modules.length) * 100}%` }} />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate('/parcours')} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-5 font-semibold text-brand-navy">
            Continuer le parcours <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          {isDemo ? (
            <button onClick={onSimulateAll} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-demo/60 bg-demo/10 px-5 font-semibold text-demo">
              <FlaskConical className="h-4 w-4" aria-hidden /> Simuler la validation des 18 modules
            </button>
          ) : (
            <button onClick={() => onSetProfile('demo')} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-5 font-semibold hover:border-demo">
              <FlaskConical className="h-4 w-4 text-demo" aria-hidden /> Essayer en mode démonstration
            </button>
          )}
        </div>
      </div>
    );
  }

  const name = isDemo ? DEMO_LEARNER_NAME : progress.learnerName.trim() || 'Ton nom ici';
  const date = new Date(progress.completedAt ?? Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="panel flex flex-wrap items-end justify-between gap-4 p-5">
        <div>
          <h1 className="font-display text-2xl font-bold">Ton certificat de parcours</h1>
          <p className="text-sm text-ink-muted">Attestation de complétion générée sur cet appareil.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          {!isDemo && (
            <label className="text-sm">
              <span className="mb-1 block text-ink-muted">Nom affiché</span>
              <input
                value={progress.learnerName}
                onChange={e => onSetLearnerName(e.target.value)}
                placeholder="Prénom Nom"
                maxLength={60}
                className="min-h-11 w-60 rounded-xl border border-line bg-night px-3 text-ink focus:border-brand focus:outline-none"
              />
            </label>
          )}
          <button
            onClick={() => {
              sound.playClick();
              window.print();
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-5 font-semibold text-brand-navy"
          >
            <Printer className="h-4 w-4" aria-hidden /> Imprimer / PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <article
          className="print-area relative mx-auto aspect-[1.414] w-full min-w-[640px] overflow-hidden rounded-2xl bg-[#0A1F44] p-[4%] text-white shadow-2xl"
          aria-label="Certificat"
        >
          <div className="pointer-events-none absolute inset-[2%] rounded-xl border border-white/15" aria-hidden />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#FA7C0C]/15 blur-3xl" aria-hidden />
          {isDemo && (
            <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] select-none font-display text-[clamp(48px,9vw,96px)] font-extrabold tracking-widest text-white/[0.06]" aria-hidden>
              DÉMONSTRATION
            </p>
          )}

          <div className="relative flex h-full flex-col">
            <header className="flex items-start justify-between">
              <img src="/brand/skilloo-logo-light.png" alt="Skilloo" className="h-9 w-auto" />
              {isDemo && <span className="rounded-full bg-[#FA7C0C] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0A1F44]">Document de démonstration</span>}
            </header>

            <div className="mt-[3%] flex flex-1 items-center gap-[4%]">
              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FA7C0C]">Attestation de réussite de parcours</p>
                <p className="mt-3 text-sm text-white/70">Décernée à</p>
                <p className="font-display text-[clamp(26px,4vw,40px)] font-extrabold leading-tight">{name}</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
                  pour avoir terminé les <strong className="text-white">{modules.length} modules</strong> du parcours
                  <strong className="text-white"> Blockchain & Web3</strong> sur Skilloo{isDemo && ' (progression simulée)'}.
                </p>
                <ol className="mt-4 grid grid-cols-3 gap-x-4 gap-y-0.5 text-[11px] leading-snug text-white/75">
                  {modules.map(m => (
                    <li key={m.id} className="truncate"><span className="text-[#FA7C0C]">{m.order}.</span> {m.title}</li>
                  ))}
                </ol>
              </div>
              <div className="flex w-[22%] flex-col items-center justify-center">
                <img src="/brand/loo-30.png" alt="" className="w-full max-w-[150px]" />
                <p className="mt-1 text-center text-xs font-semibold text-white/80">Rang Maître</p>
              </div>
            </div>

            <footer className="mt-[2%] border-t border-white/15 pt-3">
              <dl className="flex flex-wrap gap-x-8 gap-y-1 text-xs">
                <div><dt className="text-white/60">Date</dt><dd className="font-semibold">{date}</dd></div>
                <div><dt className="text-white/60">Identifiant {isDemo ? 'de démonstration' : 'local'}</dt><dd className="font-mono font-semibold">{progress.certificateId ?? '—'}</dd></div>
              </dl>
              <p className="mt-2 text-[11px] leading-snug text-white/70">
                Ce document atteste la complétion d’un parcours d’apprentissage sur Skilloo.{' '}
                <strong className="text-white">Il ne constitue pas une certification officielle de compétences.</strong>{' '}
                L’identifiant est généré sur l’appareil de l’apprenant et n’est pas une preuve cryptographique vérifiable.
              </p>
            </footer>
          </div>
        </article>
      </div>

      <p className="flex items-start gap-2 text-sm text-ink-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        Pour enregistrer en PDF, choisis « Enregistrer au format PDF » comme imprimante. Active l’impression des arrière-plans si les couleurs n’apparaissent pas.
      </p>
    </div>
  );
};
