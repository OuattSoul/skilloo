import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { CheckCircle2, Play, TestTube, XCircle } from 'lucide-react';

interface UnitTestingSimulatorProps {
  onSuccess: () => void;
}

export const UnitTestingSimulator: React.FC<UnitTestingSimulatorProps> = ({ onSuccess }) => {
  const [testsRun, setTestsRun] = useState(false);

  const handleRunTests = () => {
    sound.playSuccess();
    setTestsRun(true);
    onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
            <TestTube className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 10 : Suite de Tests Unitaires (Mocha & Chai)</h3>
            <p className="text-xs text-slate-400">Validez les scénarios de réussite et d'échec avant déploiement.</p>
          </div>
        </div>

        <button
          onClick={handleRunTests}
          className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Lancer les Tests</span>
        </button>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <div className="text-slate-400 font-bold">Suite : BankRegistry.test.js</div>

        <div className="space-y-2">
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            testsRun ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center space-x-2">
              {testsRun ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600"></div>}
              <span>it("Devrait attribuer le msg.sender comme owner du contrat")</span>
            </div>
            {testsRun && <span className="text-[11px] text-emerald-400">PASSED (24ms)</span>}
          </div>

          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            testsRun ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center space-x-2">
              {testsRun ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600"></div>}
              <span>it("Devrait incrémenter le solde de l'utilisateur lors d'un dépôt")</span>
            </div>
            {testsRun && <span className="text-[11px] text-emerald-400">PASSED (51ms)</span>}
          </div>

          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            testsRun ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center space-x-2">
              {testsRun ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600"></div>}
              <span>it("Devrait annuler la transaction (revert) si le dépôt est égal à 0")</span>
            </div>
            {testsRun && <span className="text-[11px] text-emerald-400">PASSED (38ms)</span>}
          </div>
        </div>

        {testsRun && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-sans">
            🎉 3 tests exécutés avec succès ! La couverture de code atteint 100%. Le contrat est prêt pour le testnet.
          </div>
        )}
      </div>

    </div>
  );
};
