import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Code, Play, CheckCircle2, Terminal, RefreshCw } from 'lucide-react';

interface SolidityBasicsIDEProps {
  onSuccess: () => void;
}

export const SolidityBasicsIDE: React.FC<SolidityBasicsIDEProps> = ({ onSuccess }) => {
  const [code, setCode] = useState(`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BankRegistry {
    address public owner;
    mapping(address => uint256) public balances;
    
    event Deposit(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        require(msg.value > 0, "Montant invalide");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance(address _user) public view returns (uint256) {
        return balances[_user];
    }
}`);

  const [logs, setLogs] = useState<string[]>([
    'Compiler Solc v0.8.20 prêt.',
    'Prêt à compiler le contrat BankRegistry...'
  ]);
  const [contractDeployed, setContractDeployed] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [depositInput, setDepositInput] = useState(100);

  const handleCompileAndDeploy = () => {
    sound.playSuccess();
    setLogs((prev) => [
      ...prev,
      '--> solc --optimize --bin contracts/BankRegistry.sol',
      '✔ Compilation réussie sans warning !',
      '✔ Contrat déployé à l\'adresse: 0x3f5CE5FBFe3E9af3971dD833D26BA9b5C936f0bE',
      '-> State Variable owner = 0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    ]);
    setContractDeployed(true);
    onSuccess();
  };

  const handleDepositTx = () => {
    sound.playCoin();
    setUserBalance(prev => prev + depositInput);
    setLogs((prev) => [
      ...prev,
      `-> CALL deposit() avec msg.value = ${depositInput} CT`,
      `-> Event Deposit(user: 0x71C76..., amount: ${depositInput}) émis !`,
      `-> Solde mis à jour: ${userBalance + depositInput} CT`
    ]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 8 : IDE d'Écriture & Compilation Solidity</h3>
            <p className="text-xs text-slate-400">Rédigez le contrat Solidity de la banque et exécutez ses fonctions.</p>
          </div>
        </div>

        <button
          onClick={handleCompileAndDeploy}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Compiler & Déployer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Code Editor */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Éditeur Solidity (BankRegistry.sol)
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-300 focus:border-emerald-500 focus:outline-none leading-relaxed"
            rows={14}
          />
        </div>

        {/* Live Contract Interaction & Logs */}
        <div className="space-y-4 flex flex-col justify-between">
          
          {/* Deployed Contract Inspector */}
          {contractDeployed ? (
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-400">Contrat Actif : BankRegistry</span>
                <span className="text-[11px] text-slate-400 font-mono">0x3f5C...f0bE</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Votre Solde (`balances[msg.sender]`) :</span>
                  <span className="font-bold text-amber-400 font-mono">{userBalance} CT</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="number"
                  value={depositInput}
                  onChange={(e) => setDepositInput(Number(e.target.value))}
                  className="w-24 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white"
                />
                <button
                  onClick={handleDepositTx}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Exécuter `deposit()`
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800 text-center text-slate-400 text-xs">
              Cliquez sur "Compiler & Déployer" pour instancier le contrat dans la Machine Virtuelle.
            </div>
          )}

          {/* Console Output */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 h-48 overflow-y-auto">
            <div className="text-slate-500 flex items-center space-x-1 pb-1 border-b border-slate-900">
              <Terminal className="w-3.5 h-3.5" />
              <span>Console d'Exécution EVM</span>
            </div>
            {logs.map((log, i) => (
              <div key={i} className={log.startsWith('✔') ? 'text-emerald-400' : log.startsWith('->') ? 'text-amber-300' : 'text-slate-400'}>
                {log}
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
