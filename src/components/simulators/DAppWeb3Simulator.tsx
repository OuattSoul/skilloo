import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Wallet, CheckCircle2, RefreshCw } from 'lucide-react';

interface DAppWeb3SimulatorProps {
  onSuccess: () => void;
}

export const DAppWeb3Simulator: React.FC<DAppWeb3SimulatorProps> = ({ onSuccess }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('12.45 ETH');

  const handleConnectWallet = () => {
    sound.playSuccess();
    setIsConnected(true);
    onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 12 : Connexion DApp & Ethers.js</h3>
            <p className="text-xs text-slate-400">Simulez le bouton "Connect Wallet" de l'application citoyenne.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-4">
        
        <div className="max-w-md mx-auto space-y-3">
          <h4 className="text-sm font-bold text-slate-200">Portail Citoyen Web3 de Skilloo City</h4>
          <p className="text-xs text-slate-400">Connectez votre portefeuille MetaMask / WalletConnect pour accéder à votre espace personnel.</p>

          <button
            onClick={handleConnectWallet}
            disabled={isConnected}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 mx-auto transition-all ${
              isConnected ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:brightness-110'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{isConnected ? 'Connecté : 0x71C7...8976F' : 'Connecter Portefeuille Web3'}</span>
          </button>
        </div>

        {isConnected && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs space-y-2 text-left max-w-md mx-auto animate-in fade-in">
            <div className="flex justify-between items-center text-slate-300">
              <span>Provider Web3 :</span>
              <span className="font-mono text-emerald-400">BrowserProvider(window.ethereum)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Solde du Wallet :</span>
              <span className="font-mono text-amber-400 font-bold">{balance}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Réseau :</span>
              <span className="font-mono text-blue-400">Ethereum Mainnet (Chain ID 1)</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
