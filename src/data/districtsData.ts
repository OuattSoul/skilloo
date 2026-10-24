import { District } from '../types';

// Ordered along the learning path: top row left→right, then bottom row right→left.
export const DISTRICTS: District[] = [
  {
    id: 'bldg_blockchain',
    name: 'Banque Blockchain',
    category: 'Fondations cryptographiques',
    description: 'Le cœur de confiance de la ville : empreintes, blocs et registre partagé.',
    moduleIds: ['mod_1', 'mod_2', 'mod_3'],
    position: { x: 17, y: 30 },
    accent: '#FA7C0C',
    icon: 'Coins',
  },
  {
    id: 'bldg_nodes',
    name: 'Datacenter des Nœuds',
    category: 'Réseau & transactions',
    description: 'Portefeuilles, frais de gas et validateurs qui font tourner le réseau.',
    moduleIds: ['mod_4', 'mod_5', 'mod_6'],
    position: { x: 50, y: 30 },
    accent: '#5B9BFF',
    icon: 'Server',
  },
  {
    id: 'bldg_academy',
    name: 'Académie Smart Contracts',
    category: 'Smart contracts',
    description: 'On y apprend à écrire, compiler et outiller des contrats en Solidity.',
    moduleIds: ['mod_7', 'mod_8', 'mod_9'],
    position: { x: 83, y: 30 },
    accent: '#4FD1C5',
    icon: 'GraduationCap',
  },
  {
    id: 'bldg_studio',
    name: 'Studio DApp',
    category: 'Tests, déploiement & DApps',
    description: 'Les contrats sont testés, déployés puis connectés à des interfaces web.',
    moduleIds: ['mod_10', 'mod_11', 'mod_12'],
    position: { x: 83, y: 74 },
    accent: '#FFC94D',
    icon: 'Rocket',
  },
  {
    id: 'bldg_cityhall',
    name: 'Hôtel de Ville DAO',
    category: 'Économie & gouvernance',
    description: 'NFT de titres fonciers, finance décentralisée et votes citoyens.',
    moduleIds: ['mod_13', 'mod_14', 'mod_15'],
    position: { x: 50, y: 74 },
    accent: '#5EE6A8',
    icon: 'Landmark',
  },
  {
    id: 'bldg_security',
    name: 'Tour de Cybersécurité',
    category: 'Sécurité, performance & projet final',
    description: 'Audits, optimisation du gas et projet final du parcours.',
    moduleIds: ['mod_16', 'mod_17', 'mod_18'],
    position: { x: 17, y: 74 },
    accent: '#FF8FA3',
    icon: 'ShieldCheck',
  },
];

export const districtOfModule = (moduleId: string): District =>
  DISTRICTS.find(d => d.moduleIds.includes(moduleId)) ?? DISTRICTS[0];
