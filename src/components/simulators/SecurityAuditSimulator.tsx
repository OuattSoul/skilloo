import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { ShieldAlert, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';

interface SecurityAuditSimulatorProps {
  onSuccess: () => void;
}

export const SecurityAuditSimulator: React.FC<SecurityAuditSimulatorProps> = ({ onSuccess }) => {
  const [selectedFix, setSelectedFix] = useState<string | null>(null);
  const [isPatched, setIsPatched] = useState(false);

  const vulnerableCode = `// ⚠️ CONTRAT VULNÉRABLE À UNE ATTAQUE DE RÉENTRANCE
function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    
    // ❌ ERREUR CRITIQUE: Appel externe AVANT la mise à jour du solde !
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    
    balances[msg.sender] -= amount; // L'attaquant ré-entre avant cette ligne !
}`;

  const handleApplyFix = (fixId: string) => {
    sound.playClick();
    setSelectedFix(fixId);
    if (fixId === 'checks_effects_interactions') {
      sound.playSuccess();
      setIsPatched(true);
      onSuccess();
    } else {
      sound.playError();
      setIsPatched(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 16 : Audit de Sécurité & Faille de Réentrance</h3>
            <p className="text-xs text-slate-400">Identifiez le bug critique et appliquez le pattern Checks-Effects-Interactions.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Vulnerable Code View */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-rose-400 block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Code Audité : Contrat de Prêt Municipal</span>
          </label>
          <pre className="bg-slate-950 border border-rose-900/50 p-4 rounded-xl text-xs font-mono text-rose-300 leading-relaxed overflow-x-auto">
            {vulnerableCode}
          </pre>
        </div>

        {/* Patch Options */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Sélectionnez le Correctif de Sécurité
          </label>

          <div
            onClick={() => handleApplyFix('checks_effects_interactions')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedFix === 'checks_effects_interactions' ? 'bg-emerald-950/60 border-emerald-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <h5 className="text-xs font-bold text-emerald-400">Pattern Checks-Effects-Interactions</h5>
            <p className="text-[11px] text-slate-300 mt-1">
              Mettre à jour le solde interne (`balances[msg.sender] -= amount`) AVANT d'exécuter l'appel externe `msg.sender.call`.
            </p>
          </div>

          <div
            onClick={() => handleApplyFix('wrong_fix')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedFix === 'wrong_fix' ? 'bg-rose-950/60 border-rose-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <h5 className="text-xs font-bold text-slate-300">Ajouter une condition require(amount &lt; 100)</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              Limiter le montant du retrait par transaction sans changer l'ordre d'exécution.
            </p>
          </div>

          {isPatched && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Bouclier appliqué ! En déduisant le solde avant l'envoi d'Ether, toute tentative de rappel réentrant est immédiatement rejetée.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
