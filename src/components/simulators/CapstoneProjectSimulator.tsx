import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { Award, CheckCircle2, Crown, Sparkles, Building2, ShieldCheck, Zap } from 'lucide-react';

interface CapstoneProjectSimulatorProps {
  onSuccess: () => void;
  onOpenCertificate: () => void;
}

export const CapstoneProjectSimulator: React.FC<CapstoneProjectSimulatorProps> = ({
  onSuccess,
  onOpenCertificate,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAssembleMetropolis = () => {
    sound.playSuccess();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
    setIsCompleted(true);
    onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-emerald-400 rounded-xl text-slate-950 font-bold border border-amber-400 shadow-lg shadow-amber-500/20">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Projet Final : Le Hub Web3 & Citoyen de Skilloo City</h3>
            <p className="text-xs text-slate-400">Assemblez les 18 briques technologiques pour sceller l'autonomie numérique de la ville.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-emerald-500/40 space-y-6 text-center">
        
        <div className="max-w-xl mx-auto space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
            <Building2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-white">Métropole Web3 Autonome de Skilloo City</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Vous avez assimilé les 18 compétences clés de la Blockchain : du hachage SHA-256 aux Smart Contracts Solidity, en passant par les NFT cadastraux, la finance DeFi et la sécurité des DAO.
          </p>
        </div>

        {/* Feature Check Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-medium text-slate-300">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/30 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Banque Blockchain v18</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/30 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Cadastre NFT ERC-721</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/30 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Gouvernance DAO</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/30 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Layer 2 Accéléré</span>
          </div>
        </div>

        {/* Action Button */}
        {!isCompleted ? (
          <button
            onClick={handleAssembleMetropolis}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/30 hover:brightness-110 transition-all transform hover:-translate-y-0.5"
          >
            <span>🏆 Déployer la Citadelle Web3 Complète (+1,000 XP & +1,000 CT)</span>
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in zoom-in-95">
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-sm font-bold flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Félicitations ! Vous avez complété avec succès le Parcours Blockchain de Skilloo City !</span>
            </div>

            <button
              onClick={() => {
                sound.playSuccess();
                onOpenCertificate();
              }}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 mx-auto shadow-lg shadow-amber-500/20 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Consulter & Générer Mon Diplôme officiel d'Ingénieur Web3</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
