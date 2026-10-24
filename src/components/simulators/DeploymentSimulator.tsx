import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Globe, Send, CheckCircle2, ExternalLink } from 'lucide-react';

interface DeploymentSimulatorProps {
  onSuccess: () => void;
}

export const DeploymentSimulator: React.FC<DeploymentSimulatorProps> = ({ onSuccess }) => {
  const [network, setNetwork] = useState<'Sepolia' | 'Polygon Amoy' | 'Mainnet'>('Sepolia');
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);

  const handleDeploy = () => {
    sound.playSuccess();
    const addr = '0x' + Array.from({ length: 40 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    setDeployedAddress(addr);
    onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 11 : Déploiement Multi-Chaînes (Testnet/Mainnet)</h3>
            <p className="text-xs text-slate-400">Choisissez le réseau cible et déployez votre contrat intelligent en direct.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {(['Sepolia', 'Polygon Amoy', 'Mainnet'] as const).map((net) => (
            <div
              key={net}
              onClick={() => {
                sound.playClick();
                setNetwork(net);
                setDeployedAddress(null);
              }}
              className={`p-3 rounded-xl border cursor-pointer text-center text-xs font-bold transition-all ${
                network === net ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              {net}
            </div>
          ))}
        </div>

        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs text-slate-300">
            Réseau sélectionné : <strong className="text-emerald-400 font-mono">{network}</strong>
          </div>

          <button
            onClick={handleDeploy}
            disabled={!!deployedAddress}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
              deployedAddress ? 'bg-emerald-500 text-slate-950' : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20'
            }`}
          >
            {deployedAddress ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Déploiement Effectué sur {network} !</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Déployer le Contrat sur {network}</span>
              </>
            )}
          </button>

          {deployedAddress && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs space-y-1">
              <div className="flex justify-between items-center text-emerald-300">
                <span>Adresse du Contrat Déployé :</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="font-mono text-white text-[11px] break-all">
                {deployedAddress}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
