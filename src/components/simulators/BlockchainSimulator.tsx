import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Layers, AlertTriangle, CheckCircle2, RefreshCw, Link2 } from 'lucide-react';

interface ChainBlock {
  id: number;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
  isValid: boolean;
}

interface BlockchainSimulatorProps {
  onSuccess: () => void;
}

export const BlockchainSimulator: React.FC<BlockchainSimulatorProps> = ({ onSuccess }) => {
  const [chain, setChain] = useState<ChainBlock[]>([
    { id: 1, data: 'Bloc Genèse - Fondation de Skilloo City', previousHash: '0000000', nonce: 1429, hash: '0000a4b', isValid: true },
    { id: 2, data: 'Transfert 100 CT à Fatou K.', previousHash: '0000a4b', nonce: 8842, hash: '0000f12', isValid: true },
    { id: 3, data: 'Enregistrement Titre Foncier #104', previousHash: '0000f12', nonce: 3319, hash: '0000c89', isValid: true },
    { id: 4, data: 'Achat Médicaments Hôpital Connecté', previousHash: '0000c89', nonce: 9021, hash: '0000e55', isValid: true },
  ]);

  const [hasTampered, setHasTampered] = useState(false);

  const handleTamperBlock1 = () => {
    sound.playError();
    setHasTampered(true);
    setChain([
      { id: 1, data: 'FRAUDE: Transfert 999,999 CT à un Hacker', previousHash: '0000000', nonce: 1429, hash: 'bad884x', isValid: false },
      { id: 2, data: 'Transfert 100 CT à Fatou K.', previousHash: 'bad884x', nonce: 8842, hash: 'err193z', isValid: false },
      { id: 3, data: 'Enregistrement Titre Foncier #104', previousHash: 'err193z', nonce: 3319, hash: 'err774w', isValid: false },
      { id: 4, data: 'Achat Médicaments Hôpital Connecté', previousHash: 'err774w', nonce: 9021, hash: 'err902k', isValid: false },
    ]);
  };

  const handleRepairChain = () => {
    sound.playBlockMined();
    setHasTampered(false);
    setChain([
      { id: 1, data: 'Bloc Genèse - Fondation de Skilloo City', previousHash: '0000000', nonce: 1429, hash: '0000a4b', isValid: true },
      { id: 2, data: 'Transfert 100 CT à Fatou K.', previousHash: '0000a4b', nonce: 8842, hash: '0000f12', isValid: true },
      { id: 3, data: 'Enregistrement Titre Foncier #104', previousHash: '0000f12', nonce: 3319, hash: '0000c89', isValid: true },
      { id: 4, data: 'Achat Médicaments Hôpital Connecté', previousHash: '0000c89', nonce: 9021, hash: '0000e55', isValid: true },
    ]);
    onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 3 : Détection d'Altération sur la Chaîne</h3>
            <p className="text-xs text-slate-400">Observez comment modifier un bloc passé invalide instantanément tous les blocs suivants.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleTamperBlock1}
            disabled={hasTampered}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-40"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Simuler une Fraude (Bloc 1)</span>
          </button>

          {hasTampered && (
            <button
              onClick={handleRepairChain}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Re-miner & Réparer la Chaîne</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Chain Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {chain.map((block, idx) => (
          <div
            key={block.id}
            className={`p-4 rounded-xl border relative transition-all duration-300 ${
              block.isValid
                ? 'bg-slate-950/90 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                : 'bg-rose-950/40 border-rose-500/80 shadow-md shadow-rose-500/20'
            }`}
          >
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">Bloc #{block.id}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                block.isValid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {block.isValid ? 'VALIDE' : 'INVALIDE'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-[11px] text-slate-400 block">Données :</span>
                <span className="text-slate-200 block truncate">{block.data}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Prev Hash :</span>
                <span className="text-slate-400 block truncate">{block.previousHash}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Hash Actuel :</span>
                <span className={`block truncate font-bold ${block.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {block.hash}
                </span>
              </div>
            </div>

            {/* Link indicator to next block */}
            {idx < chain.length - 1 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 bg-slate-800 p-1 rounded-full border border-slate-700 text-slate-300">
                <Link2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
