import React, { useState } from 'react';
import { Module } from '../types';
import { sound } from '../utils/audio';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Zap, 
  Coins, 
  Award,
  BookOpen,
  FlaskConical,
  Building2,
  Lightbulb
} from 'lucide-react';

// Import simulators
import { HashSimulator } from './simulators/HashSimulator';
import { BlockSimulator } from './simulators/BlockSimulator';
import { BlockchainSimulator } from './simulators/BlockchainSimulator';
import { WalletSimulator } from './simulators/WalletSimulator';
import { TransactionGasSimulator } from './simulators/TransactionGasSimulator';
import { ConsensusSimulator } from './simulators/ConsensusSimulator';
import { SmartContractConceptSimulator } from './simulators/SmartContractConceptSimulator';
import { SolidityBasicsIDE } from './simulators/SolidityBasicsIDE';
import { HardhatTerminalSimulator } from './simulators/HardhatTerminalSimulator';
import { UnitTestingSimulator } from './simulators/UnitTestingSimulator';
import { DeploymentSimulator } from './simulators/DeploymentSimulator';
import { DAppWeb3Simulator } from './simulators/DAppWeb3Simulator';
import { NFTSimulator } from './simulators/NFTSimulator';
import { DeFiPoolSimulator } from './simulators/DeFiPoolSimulator';
import { DAOGovernanceSimulator } from './simulators/DAOGovernanceSimulator';
import { SecurityAuditSimulator } from './simulators/SecurityAuditSimulator';
import { GasOptimizationSimulator } from './simulators/GasOptimizationSimulator';
import { CapstoneProjectSimulator } from './simulators/CapstoneProjectSimulator';

interface ModuleDetailProps {
  module: Module;
  onCompleteModule: (moduleId: string) => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  onOpenCertificate: () => void;
  isCompleted: boolean;
  demoMode: boolean;
}

export const ModuleDetail: React.FC<ModuleDetailProps> = ({
  module,
  onCompleteModule,
  onNavigateNext,
  onNavigatePrev,
  onOpenCertificate,
  isCompleted,
  demoMode,
}) => {
  const [quizError, setQuizError] = useState(false);
  const [labDone, setLabDone] = useState(isCompleted);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(isCompleted);

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    sound.playClick();
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setQuizError(false);
  };

  const handleValidateQuiz = () => {
    let allCorrect = true;
    module.quiz.forEach(q => {
      if (selectedAnswers[q.id] !== q.correctAnswer) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      sound.playSuccess();
      setQuizError(false);
      setQuizSubmitted(true);
      onCompleteModule(module.id);
    } else {
      sound.playError();
      setQuizError(true);
    }
  };

  const renderSimulator = () => {
    const handleLabSuccess = () => setLabDone(true);

    switch (module.simulatorType) {
      case 'hash':
        return <HashSimulator onSuccess={handleLabSuccess} />;
      case 'block':
        return <BlockSimulator onSuccess={handleLabSuccess} />;
      case 'blockchain':
        return <BlockchainSimulator onSuccess={handleLabSuccess} />;
      case 'wallet':
        return <WalletSimulator onSuccess={handleLabSuccess} />;
      case 'transaction':
        return <TransactionGasSimulator onSuccess={handleLabSuccess} />;
      case 'consensus':
        return <ConsensusSimulator onSuccess={handleLabSuccess} />;
      case 'smart_contract_concept':
        return <SmartContractConceptSimulator onSuccess={handleLabSuccess} />;
      case 'solidity_basics':
        return <SolidityBasicsIDE onSuccess={handleLabSuccess} />;
      case 'hardhat':
        return <HardhatTerminalSimulator onSuccess={handleLabSuccess} />;
      case 'unit_testing':
        return <UnitTestingSimulator onSuccess={handleLabSuccess} />;
      case 'deployment':
        return <DeploymentSimulator onSuccess={handleLabSuccess} />;
      case 'dapp_web3':
        return <DAppWeb3Simulator onSuccess={handleLabSuccess} />;
      case 'nft':
        return <NFTSimulator onSuccess={handleLabSuccess} />;
      case 'defi':
        return <DeFiPoolSimulator onSuccess={handleLabSuccess} />;
      case 'dao':
        return <DAOGovernanceSimulator onSuccess={handleLabSuccess} />;
      case 'security':
        return <SecurityAuditSimulator onSuccess={handleLabSuccess} />;
      case 'gas_optimization':
        return <GasOptimizationSimulator onSuccess={handleLabSuccess} />;
      case 'capstone':
        return <CapstoneProjectSimulator onSuccess={handleLabSuccess} onOpenCertificate={onOpenCertificate} />;
      default:
        return <div className="p-4 text-ink-muted text-xs">Simulateur en préparation...</div>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      
      {/* Module Header Bar */}
      <div className="panel p-5 sm:p-6 text-ink space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <button
              onClick={() => {
                sound.playClick();
                onNavigatePrev();
              }}
              className="p-1.5 bg-surface border border-line hover:border-brand text-ink transition-colors"
              title="Module précédent"
              aria-label="Module précédent"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-brand-ink font-bold uppercase">MODULE {module.order} / 18</span>
            <span className="text-ink-muted">•</span>
            <span className="text-ink-muted">{module.duration}</span>
            <span className="text-ink-muted">•</span>
            <span className="px-2.5 py-0.5 bg-surface text-ink border border-line font-medium uppercase text-[11px]">
              {module.difficulty}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-1 text-brand-ink font-bold bg-surface px-2.5 py-1 border border-line">
              <Zap className="w-3.5 h-3.5" />
              <span>+{module.xpReward} XP</span>
            </div>
            <div className="flex items-center space-x-1 text-ok font-bold bg-surface px-2.5 py-1 border border-line">
              <Coins className="w-3.5 h-3.5" />
              <span>+{module.coinReward} CT</span>
            </div>
            {isCompleted && (
              <span className="px-3 py-1 bg-ok text-white font-bold uppercase text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>VALIDÉ</span>
              </span>
            )}
          </div>
        </div>

        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{module.title}</h1>
          <p className="text-sm text-ink-muted mt-1">{module.subtitle}</p>
        </div>

        {/* Real-world Context Box */}
        <div className="bg-surface border border-brand/40 rounded-xl p-4 text-sm text-ink leading-relaxed flex items-start space-x-3">
          <Building2 className="w-5 h-5 text-brand-ink flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-brand-ink font-bold block mb-0.5 uppercase tracking-wider">APPLICATION RÉELLE DANS SKILLOO CITY :</strong>
            {module.context}
          </div>
        </div>

      </div>

      {/* 1. Theoretical Section */}
      <div className="panel p-5 sm:p-6 text-ink space-y-4">
        <h3 className="text-sm font-bold text-brand-ink uppercase tracking-wider flex items-center gap-2 border-b border-line pb-3 font-mono">
          <BookOpen className="w-4 h-4 text-brand-ink" />
          <span>1. NOTIONS THÉORIQUES & CONCEPTS CLÉS</span>
        </h3>

        <div className="space-y-3 text-sm text-ink leading-relaxed">
          {module.theoryContent.map((paragraph, idx) => (
            <p key={idx} className="bg-surface p-3.5 border border-line rounded-xl">
              {paragraph}
            </p>
          ))}
        </div>

        {module.codeExample && (
          <div className="space-y-2 pt-2 font-mono">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block">Exemple de Code :</span>
            <pre className="bg-brand-navy p-4 rounded-xl border border-line text-xs text-[#FFB37A] overflow-x-auto">
              {module.codeExample}
            </pre>
          </div>
        )}
      </div>

      {/* 2. Interactive Simulator Laboratory */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1 font-mono">
          <h3 className="text-sm font-bold text-brand-ink uppercase tracking-wider flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-brand-ink" />
            <span>2. LABORATOIRE PRATIQUE INTERACTIF</span>
          </h3>
          {labDone && (
            <span className="text-xs text-ok font-bold flex items-center gap-1 uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>LAB RÉUSSI !</span>
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-3xl border border-line bg-[#0A1F44] text-[#F2F5FA] shadow-[0_12px_28px_-16px_rgb(8_37_83/0.4)]">
          {renderSimulator()}
        </div>
      </div>

      {/* 3. Quiz Section */}
      <div className="panel p-5 sm:p-6 text-ink space-y-6">
        <h3 className="text-sm font-bold text-brand-ink uppercase tracking-wider flex items-center gap-2 border-b border-line pb-3 font-mono">
          <HelpCircle className="w-4 h-4 text-brand-ink" />
          <span>3. QUIZ DE VALIDATION DES CONNAISSANCES</span>
        </h3>

        <div className="space-y-6">
          {module.quiz.map((q, idx) => (
            <fieldset key={q.id} className="bg-surface p-5 border border-line rounded-xl space-y-3">
              <legend className="sr-only">Question {idx + 1}</legend>
              <p className="text-sm font-semibold text-ink">
                Question {idx + 1} : {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  const isCorrect = q.correctAnswer === optIdx;
                  
                  return (
                    <button
                      type="button"
                      key={optIdx}
                      aria-pressed={isSelected}
                      disabled={quizSubmitted}
                      onClick={() => handleSelectAnswer(q.id, optIdx)}
                      className={`w-full text-left rounded-lg p-3 border text-sm transition-all flex items-center justify-between ${
                        quizSubmitted
                          ? isCorrect
                            ? 'bg-surface border-ok text-ok font-bold'
                            : isSelected
                              ? 'bg-danger/10 border-red-500 text-danger'
                              : 'bg-night border-line text-ink-muted'
                          : isSelected
                            ? 'bg-raised border-brand text-brand-ink font-bold'
                            : 'bg-night border-line text-ink hover:border-brand'
                      }`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-ok flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="p-3 bg-night border border-line text-xs text-ink italic">
                  <Lightbulb className="inline w-4 h-4 mr-1 -mt-0.5 text-brand-ink" aria-hidden /> <strong>Explication :</strong> {q.explanation}
                </div>
              )}
            </fieldset>
          ))}
        </div>

        {quizError && (
          <p role="alert" className="rounded-xl border border-danger/50 bg-danger/10 p-3 text-sm text-danger">
            Certaines réponses sont incorrectes ou manquantes. Relis la théorie, utilise le laboratoire ou demande à Loo, puis réessaie.
          </p>
        )}

        {/* Validation Trigger */}
        <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4 font-mono">
          <div className="text-xs text-ink-muted">
            {isCompleted ? (
              <span className="text-ok font-bold">✓ Module terminé : un étage de plus s’est allumé dans ta ville !</span>
            ) : (
              <span>Complétez le laboratoire et le quiz pour valider le module.</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {demoMode && !isCompleted && (
              <button
                onClick={() => {
                  sound.playSuccess();
                  onCompleteModule(module.id);
                }}
                className="px-5 py-2.5 rounded-xl border border-demo/60 bg-demo/10 text-demo font-semibold text-sm"
              >
                Démo : simuler la validation
              </button>
            )}
            {!isCompleted ? (
              <button
                onClick={handleValidateQuiz}
                className="px-6 py-2.5 rounded-xl bg-brand hover:bg-[#FF9A3D] text-brand-navy font-bold text-sm transition-all flex items-center space-x-2 shadow-[0_0_12px_rgba(250,124,12,0.3)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Valider le module</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateNext();
                }}
                className="px-6 py-2.5 rounded-xl bg-ok hover:brightness-110 text-white font-bold text-sm transition-all flex items-center space-x-2 shadow-[0_0_12px_rgba(94,230,168,0.3)]"
              >
                <span>Module suivant</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
