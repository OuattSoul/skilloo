import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { Box, Play, CheckCircle2, RefreshCw } from 'lucide-react';

async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface BlockSimulatorProps {
  onSuccess: () => void;
}

export const BlockSimulator: React.FC<BlockSimulatorProps> = ({ onSuccess }) => {
  const [index] = useState(1);
  const [timestamp] = useState(new Date().toISOString());
  const [data, setData] = useState('Transfert 5,000 CT à l\'Hôpital Connecté');
  const [previousHash] = useState('0000000000000000000000000000000000000000000000000000000000000000');
  const [nonce, setNonce] = useState(0);
  const [hash, setHash] = useState('');
  const [isMined, setIsMined] = useState(false);
  const [isMining, setIsMining] = useState(false);

  useEffect(() => {
    const raw = `${index}${timestamp}${data}${previousHash}${nonce}`;
    sha256(raw).then((h) => {
      setHash(h);
      setIsMined(h.startsWith('0000'));
    });
  }, [index, timestamp, data, previousHash, nonce]);

  const mineBlock = async () => {
    setIsMining(true);
    let currentNonce = 0;
    
    for (let i = 0; i < 20000; i++) {
      currentNonce++;
      const raw = `${index}${timestamp}${data}${previousHash}${currentNonce}`;
      const res = await sha256(raw);
      if (res.startsWith('0000')) {
        setNonce(currentNonce);
        setHash(res);
        setIsMined(true);
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
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 2 : Constructeur de Bloc</h3>
            <p className="text-xs text-slate-400">Examinez la structure interne et minez votre bloc jusqu'à obtenir 4 zéros (0000).</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
          isMined ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        }`}>
          {isMined ? 'Bloc Miné (Valide)' : 'Bloc Non Miné'}
        </span>
      </div>

      {/* Block Form Container */}
      <div className={`p-5 rounded-xl border transition-all ${
        isMined ? 'bg-slate-950/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 'bg-slate-950/90 border-slate-800'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Index de Bloc</label>
            <input 
              type="text" 
              readOnly 
              value={`Bloc #${index}`} 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Timestamp</label>
            <input 
              type="text" 
              readOnly 
              value={timestamp} 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Données du Bloc (Transactions)</label>
            <textarea
              value={data}
              onChange={(e) => {
                setData(e.target.value);
                setIsMined(false);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              rows={2}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Previous Hash (Bloc Genèse)</label>
            <input 
              type="text" 
              readOnly 
              value={previousHash} 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-400 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Nonce (Variable de Minage)</label>
            <input 
              type="number" 
              value={nonce}
              onChange={(e) => setNonce(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-amber-400 font-mono font-bold focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Hash Réseau Résultat</label>
            <div className={`p-2.5 rounded-lg border font-mono text-xs break-all ${
              isMined ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 font-bold' : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
            }`}>
              {hash}
            </div>
          </div>

        </div>

        {/* Action button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={mineBlock}
            disabled={isMining || isMined}
            className={`px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all ${
              isMined 
                ? 'bg-emerald-500 text-slate-950 cursor-default' 
                : 'bg-blue-500 hover:bg-blue-400 shadow-lg shadow-blue-500/20'
            }`}
          >
            {isMined ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Bloc Miné & Certifié</span>
              </>
            ) : isMining ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Minage du bloc...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Miner le Bloc (Difficulté 0000)</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
