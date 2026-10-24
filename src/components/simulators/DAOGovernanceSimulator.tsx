import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Vote, CheckCircle2, ThumbsUp, ThumbsDown, Shield } from 'lucide-react';

interface DAOGovernanceSimulatorProps {
  onSuccess: () => void;
}

export const DAOGovernanceSimulator: React.FC<DAOGovernanceSimulatorProps> = ({ onSuccess }) => {
  const [yesVotes, setYesVotes] = useState(1420);
  const [noVotes, setNoVotes] = useState(210);
  const [hasVoted, setHasVoted] = useState(false);
  const userVotingPower = 100; // 100 CT-GOV tokens

  const handleVote = (choice: 'yes' | 'no') => {
    sound.playSuccess();
    if (choice === 'yes') setYesVotes(prev => prev + userVotingPower);
    else setNoVotes(prev => prev + userVotingPower);
    setHasVoted(true);
    onSuccess();
  };

  const totalVotes = yesVotes + noVotes;
  const yesPercent = Math.round((yesVotes / totalVotes) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
            <Vote className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 15 : Palais du Conseil Municipal DAO</h3>
            <p className="text-xs text-slate-400">Votez pour la proposition #42 d'installation d'une centrale solaire à Skilloo City.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] uppercase font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/20">
              Proposition DAO #42 - En Cours
            </span>
            <h4 className="text-base font-bold text-white mt-1">
              Financement d'un Parc Solaire Municipal de 5MW (50,000 CT)
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Soumis par Aminata S. (Maire). Objectif : rendre le Datacenter Cloud 100% autonome en énergie propre.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Votre Pouvoir de Vote</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{userVotingPower} CT-GOV</span>
          </div>
        </div>

        {/* Live Vote Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono text-slate-300">
            <span className="text-emerald-400 font-bold">POUR : {yesVotes} votes ({yesPercent}%)</span>
            <span className="text-rose-400 font-bold">CONTRE : {noVotes} votes ({100 - yesPercent}%)</span>
          </div>
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden flex border border-slate-800">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${yesPercent}%` }}></div>
            <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${100 - yesPercent}%` }}></div>
          </div>
        </div>

        {/* Voting Buttons */}
        {!hasVoted ? (
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => handleVote('yes')}
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Voter POUR (+{userVotingPower} Voix)</span>
            </button>
            <button
              onClick={() => handleVote('no')}
              className="flex-1 py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>Voter CONTRE</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Votre vote a été enregistré sur le registre de la DAO ! La décision sera exécutée automatiquement par le Timelock dès l'atteinte du Quorum.</span>
          </div>
        )}

      </div>

    </div>
  );
};
