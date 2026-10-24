import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { FileCode, Play, CheckCircle2, ArrowRight } from 'lucide-react';

interface SmartContractConceptSimulatorProps {
  onSuccess: () => void;
}

export const SmartContractConceptSimulator: React.FC<SmartContractConceptSimulatorProps> = ({ onSuccess }) => {
  const [rainfallMm, setRainfallMm] = useState(8); // mm of rain
  const [payoutTriggered, setPayoutTriggered] = useState(false);

  const handleTestInsuranceTrigger = () => {
    sound.playClick();
    if (rainfallMm < 15) {
      sound.playSuccess();
      setPayoutTriggered(true);
      onSuccess();
    } else {
      sound.playError();
      setPayoutTriggered(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 7 : Simulateur d'Assurance Agricole Automatisée</h3>
            <p className="text-xs text-slate-400">Si les précipitations mesurées sont inférieures à 15mm, l'indemnisation s'exécute automatiquement.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Donnée Capteur Oracle Météo : Précipitations ({rainfallMm} mm)
            </label>
            <span className={`text-[11px] font-bold ${rainfallMm < 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {rainfallMm < 15 ? '⚠️ Sécheresse Détectée (<15mm)' : '🌧️ Pluie Suffisante (>=15mm)'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={rainfallMm}
            onChange={(e) => {
              setRainfallMm(Number(e.target.value));
              setPayoutTriggered(false);
            }}
            className="w-full accent-indigo-400 cursor-pointer"
          />
        </div>

        {/* Contract Logic Flowchart */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="p-2 rounded bg-slate-950 border border-slate-700 text-slate-300">
            If (rainfall &lt; 15mm)
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-400" />
          <div className={`p-2 rounded border ${payoutTriggered ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-950 border-slate-700 text-slate-400'}`}>
            Transfer(1,000 CT) =&gt; Agriculteur
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleTestInsuranceTrigger}
            className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Tester l'Exécution du Contrat</span>
          </button>
        </div>

        {payoutTriggered && (
          <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Contrat exécuté avec succès ! Les 1,000 CT-Coins ont été versés automatiquement à la coopérative sans nécessiter de dossier papier ni d'intermédiaire.</span>
          </div>
        )}

      </div>

    </div>
  );
};
