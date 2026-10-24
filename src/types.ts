// A city district hosts 3 consecutive modules of the track.
export interface District {
  id: string;
  name: string;
  category: string;
  description: string;
  moduleIds: string[];
  position: { x: number; y: number }; // percent on the city map
  accent: string;
  icon: 'Coins' | 'Server' | 'GraduationCap' | 'Rocket' | 'Landmark' | 'ShieldCheck';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type SimulatorType = 
  | 'hash'
  | 'block'
  | 'blockchain'
  | 'wallet'
  | 'transaction'
  | 'consensus'
  | 'smart_contract_concept'
  | 'solidity_basics'
  | 'hardhat'
  | 'unit_testing'
  | 'deployment'
  | 'dapp_web3'
  | 'nft'
  | 'defi'
  | 'dao'
  | 'security'
  | 'gas_optimization'
  | 'capstone';

export interface Module {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  duration: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  buildingUnlockedId: string;
  buildingUpgradeName: string;
  xpReward: number;
  coinReward: number;
  objective: string;
  context: string;
  theoryContent: string[];
  codeExample?: string;
  simulatorType: SimulatorType;
  quiz: QuizQuestion[];
}

export interface Citizen {
  id: string;
  name: string;
  role: string;
  avatar: string;
  location: string;
  quote: string;
  currentNeed?: string;
}

export interface IncidentMission {
  id: string;
  citizenId: string;
  title: string;
  description: string;
  moduleIdRequired: string;
  buildingId: string;
  rewardXp: number;
  rewardCoins: number;
  status: 'pending' | 'resolved';
  hint: string;
  solutionCode?: string;
}
