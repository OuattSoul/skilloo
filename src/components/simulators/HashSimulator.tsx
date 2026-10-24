import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { Hash, Sparkles, AlertCircle, Play } from 'lucide-react';

// Lightweight SHA-256 implementation using Web Crypto API or JS algorithm
async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface HashSimulatorProps {
  onSuccess: () => void;
}

export const HashSimulator: React.FC<HashSimulatorProps> = ({ onSuccess }) => {
  const [inputText, setInputText] = useState('Lot #8492 - 100t Cacao San Pédro');
  const [hash, setHash] = useState('');
  const [nonce, setNonce] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [minedNonce, setMinedNonce] = useState<number | null>(null);

  useEffect(() => {
    sha256(inputText + nonce).then(setHash);
  }, [inputText, nonce]);

  const handleMine = async () => {
    setIsMining(true);
    setMinedNonce(null);
    let currentNonce = 0;
    
    // Target difficulty: Hash starting with "000"
    for (let i = 0; i < 5000; i++) {
      currentNonce++;
      const res = await sha256(inputText + currentNonce);
      if (res.startsWith('000')) {
        setNonce(currentNonce);
        setHash(res);
        setMinedNonce(currentNonce);
        setIsMining(false);
        sound.playBlockMined();
        onSuccess();
        return;
      }
    }
    setIsMining(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Hash className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 1 : Calculateur de Hash SHA-256</h3>
            <p className="text-xs text-slate-400">Modifiez le texte d'entrée pour observer l'effet avalanche du Hash.</p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          SHA-256 Engine
        </span>
      </div>

      {/* Input Text Area */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Données d'entrée (Contrat de transport ou fichier)
        </label>
        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setMinedNonce(null);
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 font-mono focus:border-emerald-500 focus:outline-none transition-colors"
          rows={3}
          placeholder="Entrez vos données ici..."
        />
      </div>

      {/* Live Hash Output */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Hash SHA-256 Généré (64 caractères hexadécimaux)
          </label>
          <span className="text-[11px] text-slate-400 font-mono">256-bit Output</span>
        </div>
        <div className="bg-slate-950 border border-emerald-500/40 p-4 rounded-xl font-mono text-sm text-emerald-400 break-all shadow-inner relative group">
          {hash}
        </div>
      </div>

      {/* Nonce & Mining Challenge */}
      <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-200">Défi de Minage : Trouver un Hash avec 3 Zéros au début</h4>
            <p className="text-xs text-slate-400">Objectif : Trouver un Nonce produisant un Hash commençant par <code className="text-emerald-400 font-bold">000...</code></p>
          </div>
          <button
            onClick={handleMine}
            disabled={isMining}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {isMining ? (
              <span>Recherche en cours...</span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Miner le Nonce</span>
              </>
            )}
          </button>
        </div>

        {minedNonce !== null && (
          <div className="bg-emerald-500/15 border border-emerald-500/40 p-3 rounded-lg text-xs text-emerald-300 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Succès ! Nonce valide trouvé : <strong className="font-mono text-white">{minedNonce}</strong>. Hash valide : <code className="font-mono text-emerald-400">{hash}</code></span>
          </div>
        )}
      </div>

    </div>
  );
};
