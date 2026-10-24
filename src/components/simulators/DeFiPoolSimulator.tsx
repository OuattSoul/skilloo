import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { ArrowLeftRight, CheckCircle2, TrendingUp } from 'lucide-react';

interface DeFiPoolSimulatorProps {
  onSuccess: () => void;
}

export const DeFiPoolSimulator: React.FC<DeFiPoolSimulatorProps> = ({ onSuccess }) => {
  const [reserveA, setReserveA] = useState(10000); // 10,000 CT-Coins
  const [reserveB, setReserveB] = useState(50000); // 50,000 EcoTokens
  const [swapAmount, setSwapAmount] = useState(100);
  const [isSwapped, setIsSwapped] = useState(false);

  // x * y = k
  const k = reserveA * reserveB;
  
  // Received B = reserveB - (k / (reserveA + swapAmount))
  const newReserveA = reserveA + swapAmount;
  const newReserveB = k / newReserveA;
  const outputTokensB = reserveB - newReserveB;

  const handleSwap = () => {
    sound.playCoin();
    setReserveA(newReserveA);
    setReserveB(newReserveB);
    setIsSwapped(true);
    onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 14 : Bourse DeFi & Pool de Liquidité AMM</h3>
            <p className="text-xs text-slate-400">Échangez des jetons CT-Coins via la formule constante x · y = k.</p>
          </div>
        </div>
      </div>

      {/* Pool Reserves Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block">Réserve Jeton A (CT-Coins)</span>
          <span className="text-lg font-bold text-amber-400 font-mono">{reserveA.toLocaleString()} CT</span>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 block">Réserve Jeton B (EcoToken)</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">{Math.round(reserveB).toLocaleString()} ECO</span>
        </div>
      </div>

      {/* Swap Interface */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 max-w-md mx-auto">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Montant à échanger (CT-Coins)</label>
          <input
            type="number"
            value={swapAmount}
            onChange={(e) => setSwapAmount(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm font-mono text-amber-400 font-bold focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="p-3 bg-slate-900 rounded-lg text-xs space-y-1 text-slate-300">
          <div className="flex justify-between">
            <span>Vous recevez estimé :</span>
            <span className="font-bold text-emerald-400 font-mono">{outputTokensB.toFixed(2)} ECO</span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Taux d'exécution (Prix) :</span>
            <span>1 CT ≈ {(outputTokensB / swapAmount).toFixed(2)} ECO</span>
          </div>
        </div>

        <button
          onClick={handleSwap}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Exécuter le Swap DeFi</span>
        </button>

        {isSwapped && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Swap exécuté sans aucun courtier centralisé ! La pool de liquidité a rééquilibré son produit invariant k.</span>
          </div>
        )}
      </div>

    </div>
  );
};
