import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Terminal, Play, CheckCircle2 } from 'lucide-react';

interface HardhatTerminalSimulatorProps {
  onSuccess: () => void;
}

export const HardhatTerminalSimulator: React.FC<HardhatTerminalSimulatorProps> = ({ onSuccess }) => {
  const [command, setCommand] = useState('npx hardhat compile');
  const [output, setOutput] = useState<string[]>([
    '$ npx hardhat compile',
    'Compiling 3 files with 0.8.20',
    'Solidity compilation finished successfully',
    'Generated 3 artifacts in /artifacts/contracts'
  ]);
  const [hasRun, setHasRun] = useState(false);

  const handleRunCommand = () => {
    sound.playSuccess();
    if (command.includes('test')) {
      setOutput([
        `$ ${command}`,
        '  BankRegistry',
        '    ✔ Should deploy contract with owner address (42ms)',
        '    ✔ Should accept deposit and update balance mapping (89ms)',
        '    ✔ Should revert when deposit amount is zero (35ms)',
        '',
        '  3 passing (166ms)'
      ]);
    } else if (command.includes('compile')) {
      setOutput([
        `$ ${command}`,
        'Compiling 4 files with Solc 0.8.20',
        'Successfully compiled 4 contracts in 1.2s'
      ]);
    } else {
      setOutput([
        `$ ${command}`,
        'Hardhat local node started at http://127.0.0.1:8545/',
        'Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)'
      ]);
    }
    setHasRun(true);
    onSuccess();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-800 rounded-xl text-emerald-400 border border-slate-700">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Laboratoire 9 : Terminal CLI Hardhat</h3>
            <p className="text-xs text-slate-400">Exécutez des commandes de compilation et de test dans l'environnement Hardhat.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-4">
        
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <span className="text-emerald-400 font-bold">$</span>
          <select
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white rounded p-1.5 focus:outline-none w-full max-w-md"
          >
            <option value="npx hardhat compile">npx hardhat compile</option>
            <option value="npx hardhat test">npx hardhat test</option>
            <option value="npx hardhat node">npx hardhat node</option>
          </select>
          <button
            onClick={handleRunCommand}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition-colors flex items-center space-x-1"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Exécuter</span>
          </button>
        </div>

        <div className="space-y-1 text-slate-300">
          {output.map((line, idx) => (
            <div key={idx} className={line.includes('✔') ? 'text-emerald-400 font-bold' : ''}>
              {line}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
