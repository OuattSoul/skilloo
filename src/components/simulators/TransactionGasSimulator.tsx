import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Send, Fuel, CheckCircle2, Clock } from 'lucide-react';

interface TransactionGasSimulatorProps {
  onSuccess: () => void;
}

export const TransactionGasSimulator: React.FC<TransactionGasSimulatorProps> = ({ onSuccess }) => {
  const [recipient, setRecipient] = useState('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7');
  const [amount, setAmount] = useState(150);
  const [gasLimit, setGasLimit] = useState(21000);
  const [gasPriceGwei, setGasPriceGwei] = useState(25); // Gwei
  const [isSent, setIsSent] = useState(false);

  // Gas Fee in ETH/CT = (Gas Limit * Gas Price in Gwei) / 1,000,000,000
  const totalGasFee = (gasLimit * gasPriceGwei) / 1e9;

  const handleSendTx = () => {
    sound.playCoin();
    setIsSent(true);
    onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
            <Fuel className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 5 : Transactions & Frais de Gas</h3>
            <p className="text-xs text-slate-400">Configurez le Gas Limit et la priorité de frais pour exécuter votre transfert.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Adresse Destinataire</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Montant à envoyer (CT-Coins)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-amber-400 font-bold font-mono focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Gas Limit (Unités de calcul)
          </label>
          <input
            type="number"
            value={gasLimit}
            onChange={(e) => setGasLimit(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-cyan-300 font-mono"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Gas Price ({gasPriceGwei} Gwei)</label>
            <span className="text-[11px] text-cyan-400">{gasPriceGwei < 20 ? 'Lent' : gasPriceGwei < 40 ? 'Normal' : 'Rapide ⚡'}</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            value={gasPriceGwei}
            onChange={(e) => setGasPriceGwei(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

      </div>

      {/* Gas Fee Summary */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 block">Frais de Gas estimé :</span>
          <span className="text-sm font-bold text-cyan-400 font-mono">
            {totalGasFee.toFixed(6)} ETH / CT
          </span>
        </div>

        <button
          onClick={handleSendTx}
          disabled={isSent}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
            isSent ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
          }`}
        >
          {isSent ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Transaction Incluse dans la Mempool !</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Envoyer la Transaction</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
