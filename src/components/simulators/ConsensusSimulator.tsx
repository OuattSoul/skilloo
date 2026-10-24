import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Cpu, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';

interface ConsensusSimulatorProps {
  onSuccess: () => void;
}

export const ConsensusSimulator: React.FC<ConsensusSimulatorProps> = ({ onSuccess }) => {
  const [selectedMechanism, setSelectedMechanism] = useState<'PoW' | 'PoS' | 'PoA'>('PoS');
  const [stakedAmount, setStakedAmount] = useState(32);
  const [isValidated, setIsValidated] = useState(false);

  const handleValidateBlock = () => {
    sound.playSuccess();
    setIsValidated(true);
    onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 6 : Comparateur de Consensus (PoW, PoS, PoA)</h3>
            <p className="text-xs text-slate-400">Sélectionnez le protocole de validation et simulez l'accord du réseau.</p>
          </div>
        </div>
      </div>

      {/* Mechanism Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div
          onClick={() => {
            sound.playClick();
            setSelectedMechanism('PoW');
            setIsValidated(false);
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedMechanism === 'PoW' ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/30' : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-bold text-white">Proof of Work (PoW)</h4>
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">⚡ Énergie +++</span>
          </div>
          <p className="text-xs text-slate-400">Minage par calcul matériel (GPU/ASIC). Exemple: Bitcoin.</p>
        </div>

        <div
          onClick={() => {
            sound.playClick();
            setSelectedMechanism('PoS');
            setIsValidated(false);
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedMechanism === 'PoS' ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30' : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-bold text-white">Proof of Stake (PoS)</h4>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">🌱 Éco -99.9%</span>
          </div>
          <p className="text-xs text-slate-400">Validation par séquestre de jetons (Staking). Exemple: Ethereum 2.0.</p>
        </div>

        <div
          onClick={() => {
            sound.playClick();
            setSelectedMechanism('PoA');
            setIsValidated(false);
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedMechanism === 'PoA' ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/30' : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-bold text-white">Proof of Authority (PoA)</h4>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">🏢 Institutionnel</span>
          </div>
          <p className="text-xs text-slate-400">Validation par des nœuds réputés identifiés (Banque centrale, Université).</p>
        </div>

      </div>

      {/* Interactive Validator Panel */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        {selectedMechanism === 'PoS' && (
          <div className="space-y-2">
            <label className="text-xs text-slate-400 block">Jeton Stakés en Garantie ({stakedAmount} CT) :</label>
            <input
              type="range"
              min="32"
              max="320"
              value={stakedAmount}
              onChange={(e) => setStakedAmount(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-300">
            Mécanisme sélectionné : <strong className="text-purple-400 font-mono">{selectedMechanism}</strong>
          </div>

          <button
            onClick={handleValidateBlock}
            disabled={isValidated}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
              isValidated ? 'bg-emerald-500 text-slate-950' : 'bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-lg shadow-purple-500/20'
            }`}
          >
            {isValidated ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Consensus Validé à 100% !</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Simuler le Consensus du Réseau</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
