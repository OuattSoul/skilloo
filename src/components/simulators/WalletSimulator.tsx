import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Key, ShieldCheck, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';

interface WalletSimulatorProps {
  onSuccess: () => void;
}

export const WalletSimulator: React.FC<WalletSimulatorProps> = ({ onSuccess }) => {
  const [address, setAddress] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [privateKey, setPrivateKey] = useState('0x4c0883a69102937d6231471b5dbb6204feb7e0450baa13917d76c42221ed7d82');
  const [mnemonic, setMnemonic] = useState('cacao abidjan blockchain cybercity securite soleil contrat navire valeur banque dakar wallet');
  const [message, setMessage] = useState('J\'autorise le transfert de 250 CT à la banque municipale');
  const [signature, setSignature] = useState('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const generateNewWallet = () => {
    sound.playClick();
    const hex = '0123456789abcdef';
    let randAddr = '0x';
    let randPriv = '0x';
    for (let i = 0; i < 40; i++) randAddr += hex[Math.floor(Math.random() * 16)];
    for (let i = 0; i < 64; i++) randPriv += hex[Math.floor(Math.random() * 16)];

    setAddress(randAddr);
    setPrivateKey(randPriv);
    setSignature('');
    setIsVerified(null);
  };

  const handleSignMessage = () => {
    sound.playClick();
    // Simulate ECDSA signature (v, r, s)
    const sigHex = '0x' + Array.from({ length: 130 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    setSignature(sigHex);
    setIsVerified(null);
  };

  const handleVerifySignature = () => {
    sound.playSuccess();
    setIsVerified(true);
    onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 4 : Générateur de Portefeuille & Signature Numérique</h3>
            <p className="text-xs text-slate-400">Générez une paire de clés publiques/privées et signez mathématiquement un message.</p>
          </div>
        </div>

        <button
          onClick={generateNewWallet}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Générer Nouveau Wallet</span>
        </button>
      </div>

      {/* Wallet Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
            Adresse Publique (Clé Publique)
          </label>
          <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs text-emerald-300 break-all border border-emerald-500/30">
            {address}
          </div>
          <p className="text-[11px] text-slate-400">Peut être partagée publiquement pour recevoir des paiements.</p>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-rose-900/40 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
            Clé Privée (SECRET STRICT)
          </label>
          <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs text-rose-300 break-all border border-rose-500/30">
            {privateKey}
          </div>
          <p className="text-[11px] text-rose-400/80 font-medium">⚠️ Ne jamais partager ! Donne un contrôle total sur vos fonds.</p>
        </div>

        <div className="md:col-span-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
            Mnémonique (Seed Phrase 12 Mots)
          </label>
          <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs text-amber-200 border border-amber-500/30">
            {mnemonic}
          </div>
        </div>

      </div>

      {/* Signature & Verification Sandbox */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Signer & Vérifier une Transaction</span>
        </h4>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Message de la transaction à signer :</label>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setSignature('');
              setIsVerified(null);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSignMessage}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
          >
            Signer avec la Clé Privée
          </button>

          {signature && (
            <button
              onClick={handleVerifySignature}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              Vérifier la Signature avec l'Adresse Publique
            </button>
          )}
        </div>

        {signature && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 block">Signature Cryptographique Pro produite (ECDSA v, r, s) :</span>
            <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-[11px] text-blue-300 break-all border border-slate-800">
              {signature}
            </div>
          </div>
        )}

        {isVerified && (
          <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Signature Valide ! La preuve mathématique atteste que ce message a été signé par le détenteur de la clé privée sans révéler la clé elle-même.</span>
          </div>
        )}

      </div>

    </div>
  );
};
