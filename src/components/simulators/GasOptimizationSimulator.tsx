import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Zap, CheckCircle2, TrendingDown } from 'lucide-react';

interface GasOptimizationSimulatorProps {
  onSuccess: () => void;
}

export const GasOptimizationSimulator: React.FC<GasOptimizationSimulatorProps> = ({ onSuccess }) => {
  const [isPacked, setIsPacked] = useState(false);
  const [useLayer2, setUseLayer2] = useState(false);

  const l1GasCost = isPacked ? 12.5 : 28.0; // $ USD equivalent
  const finalGasCost = useLayer2 ? l1GasCost * 0.04 : l1GasCost;

  const handleApplyOptimization = () => {
    sound.playSuccess();
    setIsPacked(true);
    setUseLayer2(true);
    onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 17 : Optimiseur de Gas & Réseau Layer 2 (Rollup)</h3>
            <p className="text-xs text-slate-400">Packez les variables Solidity et migrez sur un Layer 2 pour réduire les frais de 96%.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Packing Comparison */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Packing de Variables Storage</h4>
          <div className="text-xs font-mono space-y-2">
            <div className={`p-2.5 rounded border ${!isPacked ? 'bg-rose-950/40 border-rose-500/50 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              <div>// ❌ 3 Slots de 32 octets (90,000 gas)</div>
              <div>uint256 id; // Slot 1</div>
              <div>uint256 timestamp; // Slot 2</div>
              <div>bool isActive; // Slot 3</div>
            </div>

            <div className={`p-2.5 rounded border ${isPacked ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              <div>// ✅ 1 Seul Slot de 32 octets (20,000 gas)</div>
              <div>uint64 id; uint64 timestamp; bool isActive;</div>
            </div>
          </div>
        </div>

        {/* L1 vs L2 Cost Estimator */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">2. Coût de Transaction Estimé</h4>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-cyan-400">${finalGasCost.toFixed(2)}</span>
              <span className="text-xs text-slate-400">par transaction</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleApplyOptimization}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <TrendingDown className="w-4 h-4" />
              <span>Activer Variable Packing & Migrer vers L2 Arbitrum</span>
            </button>
          </div>

          {isPacked && useLayer2 && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Optimisation réussie ! Vos frais sont passés de $28.00 à $0.50 par transaction.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
