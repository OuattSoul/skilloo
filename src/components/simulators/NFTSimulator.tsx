import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Sparkles, Image as ImageIcon, CheckCircle2, ShieldCheck } from 'lucide-react';

interface NFTSimulatorProps {
  onSuccess: () => void;
}

export const NFTSimulator: React.FC<NFTSimulatorProps> = ({ onSuccess }) => {
  const [plotName, setPlotName] = useState('Parcelle #104 - District Financier');
  const [owner, setOwner] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [mintedNft, setMintedNft] = useState<{ tokenId: number; cid: string } | null>(null);

  const handleMintNft = () => {
    sound.playSuccess();
    setMintedNft({
      tokenId: 104,
      cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco'
    });
    onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 13 : Forge de Titres Fonciers en NFT (ERC-721)</h3>
            <p className="text-xs text-slate-400">Émettez le titre de propriété numérique infalsifiable d'un terrain de Skilloo City.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Nom du Bien Foncier</label>
            <input
              type="text"
              value={plotName}
              onChange={(e) => setPlotName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Adresse du Propriétaire</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-purple-300 font-mono focus:border-purple-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleMintNft}
            disabled={!!mintedNft}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
              mintedNft ? 'bg-emerald-500 text-slate-950' : 'bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-lg shadow-purple-500/20'
            }`}
          >
            {mintedNft ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>NFT ERC-721 Miné avec Succès !</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Minter le NFT de Propriété</span>
              </>
            )}
          </button>
        </div>

        {/* Visual NFT Card Badge */}
        <div className="bg-gradient-to-tr from-purple-950/60 to-slate-950 border border-purple-500/40 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="w-full h-36 rounded-xl bg-slate-900 border border-purple-500/30 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-emerald-500/10 opacity-50"></div>
            <div className="text-center z-10 space-y-1">
              <span className="text-3xl block">🏡</span>
              <span className="text-xs font-bold text-white block">{plotName}</span>
              <span className="text-[11px] text-purple-300 font-mono">Token ID : #{mintedNft ? mintedNft.tokenId : '---'}</span>
            </div>
          </div>

          <div className="text-[11px] font-mono space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Norme :</span>
              <span className="text-purple-300">ERC-721 Standard</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">IPFS Metadata CID :</span>
              <span className="text-emerald-400 truncate max-w-[150px]">{mintedNft ? mintedNft.cid : 'En attente...'}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
