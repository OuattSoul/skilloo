import { Citizen, IncidentMission } from '../types';

export const INITIAL_CITIZENS: Citizen[] = [
  {
    id: 'cit_fatou',
    name: 'Fatou K.',
    role: 'Entrepreneuse & Fondatrice Agritech',
    avatar: '👩🏾‍💼',
    location: 'District Financier',
    quote: 'Je veux exporter le cacao de nos coopératives en garantissant l\'origine exacte via la blockchain.',
    currentNeed: 'A besoin d\'une preuve cryptographique d\'intégrité des données.'
  },
  {
    id: 'cit_koffi',
    name: 'Koffi N.',
    role: 'Directeur de la Banque de Skilloo City',
    avatar: '👨🏾‍💼',
    location: 'Banque Blockchain',
    quote: 'Nos coffres-forts traditionnels subissent des tentatives d\'usurpation. Il nous faut des signatures asymétriques !',
    currentNeed: 'Recherche une architecture de portefeuille avec clés publiques/privées.'
  },
  {
    id: 'cit_moussa',
    name: 'Moussa D.',
    role: 'Expert Cybersécurité & Hacker Éthique',
    avatar: '🧑🏾‍💻',
    location: 'Centre de Sécurité',
    quote: 'Un contrat intelligent sans audit est une passoire. Attention aux attaques de réentrance !',
    currentNeed: 'Veut tester la sécurité du protocole de prêt municipal.'
  },
  {
    id: 'cit_aminata',
    name: 'Aminata S.',
    role: 'Maire de Skilloo City',
    avatar: '👩🏾‍⚖️',
    location: 'Hôtel de Ville DAO',
    quote: 'Notre ville appartient à ses habitants. Les décisions de budget doivent être votées de manière transparente sur la DAO !',
    currentNeed: 'Consulter et voter les propositions citoyennes.'
  },
  {
    id: 'cit_ibrahim',
    name: 'Ibrahim B.',
    role: 'Architecte Cadastral',
    avatar: '👷🏾‍♂️',
    location: 'Service des Titres Fonciers',
    quote: 'Fini les doubles ventes de terrains ! Chaque titre de propriété de la ville doit devenir un NFT infalsifiable.',
    currentNeed: 'Émettre les premiers titres de propriété sous forme de jeton ERC-721.'
  }
];

export const INITIAL_MISSIONS: IncidentMission[] = [
  {
    id: 'miss_1',
    citizenId: 'cit_fatou',
    title: 'Vérification d\'Empreinte Cryptographique',
    description: 'Fatou doit vérifier qu\'un lot de cacao n\'a pas été altéré pendant le transport. Générez un hash SHA-256 pour valider l\'intégrité.',
    moduleIdRequired: 'mod_1',
    buildingId: 'bldg_blockchain',
    rewardXp: 100,
    rewardCoins: 50,
    status: 'pending',
    hint: 'Changer un seul caractère dans les données modifie complètement le Hash généré.'
  },
  {
    id: 'miss_2',
    citizenId: 'cit_koffi',
    title: 'Forge du Premier Bloc',
    description: 'La Banque de Skilloo City veut enregistrer le registre initial. Assemblez et minez le Bloc Genèse de la ville !',
    moduleIdRequired: 'mod_2',
    buildingId: 'bldg_blockchain',
    rewardXp: 150,
    rewardCoins: 75,
    status: 'pending',
    hint: 'Le Proof of Work exige de trouver un Nonce qui produit un Hash commençant par plusieurs zéros.'
  },
  {
    id: 'miss_3',
    citizenId: 'cit_ibrahim',
    title: 'Numérisation du Cadastre en NFT',
    description: 'Ibrahim veut certifier la parcelle #104 de Skilloo City. Créez et mintez un NFT ERC-721 avec l\'ID du terrain.',
    moduleIdRequired: 'mod_13',
    buildingId: 'bldg_blockchain',
    rewardXp: 300,
    rewardCoins: 200,
    status: 'pending',
    hint: 'Chaque token NFT possède un TokenID unique et une URI de métadonnées associées.'
  },
  {
    id: 'miss_4',
    citizenId: 'cit_moussa',
    title: 'Audit Anti-Réentrance',
    description: 'Moussa a repéré une faille critique dans le contrat du distributeur automatique de billets. Appliquez le pattern Checks-Effects-Interactions.',
    moduleIdRequired: 'mod_16',
    buildingId: 'bldg_cybersecurity',
    rewardXp: 500,
    rewardCoins: 350,
    status: 'pending',
    hint: 'Mettez toujours à jour le solde interne (State Change) AVANT d\'envoyer de l\'Ether à l\'extérieur.'
  },
  {
    id: 'miss_5',
    citizenId: 'cit_aminata',
    title: 'Vote du Premier Budget DAO',
    description: 'Aminata sollicite le vote des citoyens pour financer une centrale solaire à Skilloo City via la DAO.',
    moduleIdRequired: 'mod_15',
    buildingId: 'bldg_blockchain',
    rewardXp: 400,
    rewardCoins: 250,
    status: 'pending',
    hint: 'Seuls les détenteurs du jeton de gouvernance CT-GOV peuvent soumettre et valider les propositions.'
  }
];
