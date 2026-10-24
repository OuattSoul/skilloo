import { Module } from '../types';

export const BLOCKCHAIN_MODULES: Module[] = [
  {
    id: 'mod_1',
    order: 1,
    title: 'Hash & Cryptographie',
    subtitle: 'L\'empreinte digitale mathématique irréversible',
    duration: '20 min',
    difficulty: 'Débutant',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 1 : Fondation Cryptographique de la Ville',
    xpReward: 100,
    coinReward: 50,
    objective: 'Comprendre le fonctionnement d\'un hachage SHA-256 et son rôle dans la sécurité des données.',
    context: 'Pour certifier les contrats de transport de marchandises (cacao, anacarde, fruits) entre Abidjan, San Pédro et Dakar sans risque d\'altération, les entreprises génèrent une empreinte digitale numérique (Hash).',
    theoryContent: [
      'Un Hash (hachage) est une fonction mathématique irréversible qui prend une donnée d\'entrée de n\'importe quelle taille et produit une chaîne de caractères de longueur fixe (par exemple 64 caractères hexadécimaux pour SHA-256).',
      'Propriétés clés des fonctions de hachage :',
      '1. Effet Avalanche : La moindre modification d\'un seul caractère change totalement le Hash final.',
      '2. Déterministe : La même entrée produit toujours rigoureusement le même Hash.',
      '3. Résistance aux collisions : Il est quasiment impossible de trouver deux entrées différentes ayant le même Hash.',
      '4. Unidirectionnel : On ne peut pas retrouver le texte d\'origine à partir du Hash.'
    ],
    codeExample: `// Exemple conceptuel de Hash SHA-256
const data = "Lot #8492 - 100t Cacao San Pédro";
const hash = sha256(data);
// Output: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a`,
    simulatorType: 'hash',
    quiz: [
      {
        id: 'q1_1',
        question: 'Que se passe-t-il si vous modifiez une seule majuscule dans un document sécurisé par SHA-256 ?',
        options: [
          'Le hash ne change pas.',
          'Seul le dernier caractère du hash change.',
          'Le hash change complètement de manière imprévisible (Effet Avalanche).',
          'Une erreur de compilation survient.'
        ],
        correctAnswer: 2,
        explanation: 'L\'effet avalanche garantit qu\'une infime modification modifie radicalement le Hash produit.'
      },
      {
        id: 'q1_2',
        question: 'Est-il possible de recalculer le texte initial uniquement à partir du Hash SHA-256 ?',
        options: [
          'Oui, en inversant la matrice.',
          'Non, car une fonction de hachage est unidirectionnelle (one-way).',
          'Oui, si on utilise un supercalculateur.',
          'Oui, avec un mot de passe administrateur.'
        ],
        correctAnswer: 1,
        explanation: 'Le hachage est par définition non-inversible.'
      }
    ]
  },
  {
    id: 'mod_2',
    order: 2,
    title: 'Structure d\'un Bloc (Block)',
    subtitle: 'L\'unité élémentaire de stockage décentralisé',
    duration: '25 min',
    difficulty: 'Débutant',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 2 : Premier Coffre-fort Numérique',
    xpReward: 150,
    coinReward: 75,
    objective: 'Apprendre la structure interne d\'un bloc : Index, Horodatage, Données, Nonce et Preuve de Travail.',
    context: 'Chaque bloc dans Skilloo City agit comme une page d\'un grand livre comptable infalsifiable. Les banques et administrations y enregistrent leurs transactions officielles.',
    theoryContent: [
      'Un bloc est une structure de données contenant plusieurs éléments fondamentaux :',
      '• Index / Numero de Bloc : Position dans le registre.',
      '• Timestamp : Date et heure exacte de création du bloc.',
      '• Data : Liste des transactions ou informations à sécuriser.',
      '• Nonce (Number used ONCE) : Un nombre arbitraire ajusté par les mineurs pour obtenir un Hash valide.',
      '• Previous Hash : L\'empreinte du bloc précédent.',
      'Minage d\'un bloc : Le processus consiste à tester des millions de valeurs de Nonce jusqu\'à ce que le Hash du bloc commence par un nombre défini de zéros (la Difficulté).'
    ],
    codeExample: `struct Block {
    uint256 index;
    uint256 timestamp;
    string data;
    string previousHash;
    uint256 nonce;
    string hash;
}`,
    simulatorType: 'block',
    quiz: [
      {
        id: 'q2_1',
        question: 'Quel est le rôle du "Nonce" lors du minage d\'un bloc ?',
        options: [
          'Stocker l\'adresse du receveur.',
          'Sert de valeur variable qu\'on modifie pour trouver un Hash respectant la difficulté.',
          'Mesurer la vitesse de la connexion internet.',
          'Compter le nombre de transactions.'
        ],
        correctAnswer: 1,
        explanation: 'Le Nonce est la seule variable que l\'algorithme de minage peut modifier pour faire varier le Hash jusqu\'à remplir le critère de difficulté.'
      }
    ]
  },
  {
    id: 'mod_3',
    order: 3,
    title: 'La Chaîne de Blocs (Blockchain)',
    subtitle: 'Le maillage cryptographique et la détection d\'altération',
    duration: '30 min',
    difficulty: 'Débutant',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 3 : Réseau de Nœuds et Registre Distribué',
    xpReward: 200,
    coinReward: 100,
    objective: 'Comprendre comment les blocs sont reliés entre eux par le Previous Hash et pourquoi modifier le passé brise la chaîne.',
    context: 'Si un pirate tente de modifier frauduleusement une transaction enregistrée hier dans la banque de Skilloo City, le lien entre les blocs est immédiatement corrompu et rejeté par le réseau.',
    theoryContent: [
      'Chaque bloc contient l\'empreinte (Previous Hash) du bloc qui le précède.',
      'Cela crée une chaîne séquentielle ininterrompue remontant jusqu\'au Bloc Genèse (Bloc 0).',
      'Si quelqu\'un tente de modifier les données du Bloc 1, son Hash change.',
      'Le Bloc 2 contenant le Previous Hash de Bloc 1 devient invalide, provoquant l\'invalidation de tous les blocs suivants !',
      'Pour valider une altération, un attaquant devrait recalculer la preuve de travail de TOUS les blocs suivants plus vite que le reste du réseau mondial réunis (Attaque des 51%).'
    ],
    simulatorType: 'blockchain',
    quiz: [
      {
        id: 'q3_1',
        question: 'Pourquoi est-il presque impossible d\'altérer un bloc passé dans une blockchain établie ?',
        options: [
          'Parce que le fichier est protégé par mot de passe.',
          'Car il faudrait re-miner ce bloc et TOUS les blocs ultérieurs plus vite que le réseau.',
          'Parce que les mineurs suppriment les anciens blocs.',
          'Car les blocs sont cryptés par le gouvernement.'
        ],
        correctAnswer: 1,
        explanation: 'Chaque bloc étant lié au précédent par son Hash, modifier le passé brise la validité de toute la chaîne consécutive.'
      }
    ]
  },
  {
    id: 'mod_4',
    order: 4,
    title: 'Portefeuille & Cryptographie Asymétrique',
    subtitle: 'Clé Publique, Clé Privée et Adresse Crypto',
    duration: '25 min',
    difficulty: 'Débutant',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 4 : Guichet de Portefeuilles Numériques',
    xpReward: 200,
    coinReward: 100,
    objective: 'Maîtriser le fonctionnement des paires de clés publiques/privées et des phrases mnémoniques (Seed Phrase).',
    context: 'Chaque citoyen de Skilloo City dispose d\'un Portefeuille Web3 lui permettant de stocker la monnaie de la ville (CT-Coins) et d\'interagir avec les services municipaux.',
    theoryContent: [
      'La cryptographie asymétrique repose sur une paire de clés mathématiquement liées :',
      '1. Clé Privée (Secret) : À garder strictement confidentielle. Permet de signer des transactions.',
      '2. Clé Publique (Adresse) : Obtenue depuis la clé privée. Peut être partagée publiquement pour recevoir des fonds.',
      '3. Seed Phrase (12 ou 24 mots) : Permet de régénérer l\'intégralité des clés d\'un portefeuille.',
      'Règle d\'or Web3 : "Not your keys, not your coins". Si vous perdez votre clé privée, vos fonds sont définitivement inaccessibles.'
    ],
    codeExample: `// Génération d'un Wallet Web3 en JavaScript (ethers.js)
import { Wallet } from "ethers";
const wallet = Wallet.createRandom();
console.log("Adresse Publique :", wallet.address);
console.log("Clé Privée :", wallet.privateKey);
console.log("Mnémonique :", wallet.mnemonic.phrase);`,
    simulatorType: 'wallet',
    quiz: [
      {
        id: 'q4_1',
        question: 'Laquelle de ces informations devez-vous garder ABSOLUMENT secrète ?',
        options: [
          'Votre adresse publique (0x71C...)',
          'Le nombre de jetons dans votre solde',
          'Votre Clé Privée ou Seed Phrase (12 mots)',
          'Votre pseudo d\'utilisateur'
        ],
        correctAnswer: 2,
        explanation: 'La clé privée et la seed phrase permettent à quiconque de prendre le contrôle total de vos fonds.'
      }
    ]
  },
  {
    id: 'mod_5',
    order: 5,
    title: 'Transactions & Frais de Gas',
    subtitle: 'Anatomie d\'un transfert et rémunération des nœuds',
    duration: '30 min',
    difficulty: 'Débutant',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 5 : Centre de Routage des Transactions',
    xpReward: 250,
    coinReward: 125,
    objective: 'Comprendre comment est construite une transaction, le rôle de la signature et le calcul du Gas Fee.',
    context: 'Lorsque les commerçants de Skilloo City effectuent des transferts, ils payent une micro-taxe réseau appelée "Gas" pour rémunérer les validateurs qui exécutent le calcul.',
    theoryContent: [
      'Champs d\'une transaction Web3 :',
      '• From : Adresse de l\'émetteur.',
      '• To : Adresse du destinataire ou d\'un smart contract.',
      '• Value : Montant transféré en crypto.',
      '• Nonce d\'émetteur : Nombre de transactions déjà envoyées par cette adresse (évite le double dépouillement).',
      '• Signature V, R, S : Preuve cryptographique signée avec la clé privée.',
      '• Gas Limit & Gas Price : Quantité maximale d\'énergie de calcul allouée et prix par unité de gas.'
    ],
    simulatorType: 'transaction',
    quiz: [
      {
        id: 'q5_1',
        question: 'À quoi servent les frais de Gas sur une blockchain comme Ethereum ?',
        options: [
          'À payer l\'électricité de la mairie.',
          'À rémunérer les validateurs et éviter les attaques par saturation de réseau (spam).',
          'À acheter des domaines sur internet.',
          'À échanger des devises étrangères.'
        ],
        correctAnswer: 1,
        explanation: 'Le Gas garantit que chaque opération de calcul a un coût, empêchant les boucles infinies et le spam du réseau.'
      }
    ]
  },
  {
    id: 'mod_6',
    order: 6,
    title: 'Mécanismes de Consensus (PoW, PoS, PoA)',
    subtitle: 'Comment des milliers de nœuds s\'accordent sans autorité centrale',
    duration: '30 min',
    difficulty: 'Intermédiaire',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 6 : Centrale de Consensus et Nœuds Validateurs',
    xpReward: 250,
    coinReward: 150,
    objective: 'Comparer la Preuve de Travail (PoW), la Preuve d\'Enjeu (PoS) et la Preuve d\'Autorité (PoA).',
    context: 'Skilloo City veut réduire son empreinte carbone tout en maintenant une sécurité maximale pour son réseau bancaire et administratif.',
    theoryContent: [
      '1. Proof of Work (PoW - Bitcoin) : Les mineurs utilisent de la puissance de calcul brute pour trouver le Nonce. Sécurité maximale mais consommation d\'énergie très élevée.',
      '2. Proof of Stake (PoS - Ethereum 2.0) : Les validateurs immobilisent ("stakent") de la crypto en garantie. Un validateur est choisi aléatoirement pour proposer le bloc. Éco-efficient (-99.9% d\'énergie).',
      '3. Proof of Authority (PoA) : Utilisé sur les blockchains privées/municipales. Les validateurs sont des entités identifiées et réputées (ex: universités, banques centrales).'
    ],
    simulatorType: 'consensus',
    quiz: [
      {
        id: 'q6_1',
        question: 'Quel est le principal avantage de la Preuve d\'Enjeu (PoS) par rapport à la Preuve de Travail (PoW) ?',
        options: [
          'Elle ne nécessite plus de mots de passe.',
          'Elle consomme jusqu\'à 99.9% d\'énergie en moins car elle ne nécessite pas de minage par calcul brut.',
          'Elle rend les transactions gratuites.',
          'Elle supprime le besoin de smart contracts.'
        ],
        correctAnswer: 1,
        explanation: 'Le PoS remplace le minage énergivore par le séquestre de jetons (staking) pour sécuriser le réseau.'
      }
    ]
  },
  {
    id: 'mod_7',
    order: 7,
    title: 'Concepts des Smart Contracts',
    subtitle: 'Les contrats autonomes auto-exécutables',
    duration: '35 min',
    difficulty: 'Intermédiaire',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 7 : Laboratoire de Contrats Intelligents',
    xpReward: 300,
    coinReward: 150,
    objective: 'Comprendre l\'exécution déterministe d\'un contrat intelligent sans intermédiaire humain.',
    context: 'Dans le secteur agricole et bancaire de Skilloo City, une assurance sécheresse s\'exécute automatiquement : si le capteur météo indique < 10mm de pluie en un mois, les indemnités sont immédiatement versées aux agriculteurs.',
    theoryContent: [
      'Un Smart Contract est un programme informatique déployé de manière immuable sur une blockchain.',
      'Logique : "Si la condition X est vérifiée, alors l\'action Y est exécutée automatiquement."',
      'Avantages :',
      '• Sans intermédiaire : Pas besoin de notaire ou de banque pour valider l\'accord.',
      '• Immuable : Une fois déployé, son code ne peut pas être modifié.',
      '• Transparent : Tout le monde peut inspecter le code et vérifier son comportement.'
    ],
    simulatorType: 'smart_contract_concept',
    quiz: [
      {
        id: 'q7_1',
        question: 'Quelle est la caractéristique fondamentale d\'un Smart Contract une fois déployé sur la blockchain ?',
        options: [
          'Son code peut être modifié par l\'administrateur à tout moment.',
          'Il est immuable et s\'exécute exactement selon ses conditions codées sans tiers de confiance.',
          'Il s\'arrête dès que le serveur s\'éteint.',
          'Il est gratuit pour l\'utilisateur.'
        ],
        correctAnswer: 1,
        explanation: 'L\'immuabilité garantit qu\'aucune partie ne peut modifier les termes du contrat en cours de route.'
      }
    ]
  },
  {
    id: 'mod_8',
    order: 8,
    title: 'Bases de Solidity (Variables, Fonctions, Mappings)',
    subtitle: 'Écrire son premier smart contract en langage Solidity',
    duration: '45 min',
    difficulty: 'Intermédiaire',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 8 : Atelier de Développement Solidity',
    xpReward: 350,
    coinReward: 200,
    objective: 'Découvrir la syntaxe de Solidity : types uint, address, mappings, struct et fonctions public/external.',
    context: 'Créez le contrat du registre bancaire de Skilloo City pour enregistrer les soldes des habitants et effectuer des dépôts.',
    theoryContent: [
      'Solidity est le langage orienté objet principal pour la Machine Virtuelle Ethereum (EVM).',
      'Concepts fondamentaux :',
      '1. Variables d\'état (State Variables) : Stockées de manière permanente sur la blockchain.',
      '2. Types de données : `uint256`, `address`, `bool`, `string`.',
      '3. Mapping : Tableau associatif (ex: `mapping(address => uint256) public balances;`).',
      '4. Modificateurs d\'accès : `public`, `private`, `external`, `internal`, `view`, `pure`, `payable`.'
    ],
    codeExample: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BankRegistry {
    address public owner;
    mapping(address => uint256) public balances;

    event Deposit(address indexed account, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        require(msg.value > 0, "Montant invalide");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance(address _account) public view returns (uint256) {
        return balances[_account];
    }
}`,
    simulatorType: 'solidity_basics',
    quiz: [
      {
        id: 'q8_1',
        question: 'Quelle structure Solidity est idéale pour associer une adresse Ethereum à son solde bancaire ?',
        options: [
          'Un tableau `uint256[]`',
          'Un `mapping(address => uint256)`',
          'Une variable `string`',
          'Un `enum`'
        ],
        correctAnswer: 1,
        explanation: 'Le `mapping(key => value)` permet une recherche instantanée du solde pour n\'importe quelle adresse.'
      }
    ]
  },
  {
    id: 'mod_9',
    order: 9,
    title: 'Hardhat & Environnement de Développement',
    subtitle: 'Le framework professionnel Web3',
    duration: '35 min',
    difficulty: 'Intermédiaire',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 9 : Tour de Compilation et Environnement Hardhat',
    xpReward: 350,
    coinReward: 200,
    objective: 'Comprendre l\'arborescence d\'un projet Hardhat, la compilation d\'artefacts et la configuration network.',
    context: 'Les développeurs de Skilloo City mettent en place un environnement local automatisé pour compiler, tester et simuler leurs contrats avant déploiement.',
    theoryContent: [
      'Hardhat est l\'environnement de référence pour les développeurs Ethereum.',
      'Structure standard d\'un projet :',
      '• `/contracts` : Vos fichiers `.sol` source.',
      '• `/scripts` : Les scripts d\'installation et déploiement JavaScript/TypeScript.',
      '• `/test` : Vos suites de tests unitaires (Chai / Mocha).',
      '• `hardhat.config.js` : Paramètres des réseaux, versions du compilateur solc et clés d\'API.'
    ],
    codeExample: `// Commandes clés du terminal Hardhat
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network localhost`,
    simulatorType: 'hardhat',
    quiz: [
      {
        id: 'q9_1',
        question: 'Où sont stockés les fichiers de contrats intelligents `.sol` dans un projet Hardhat ?',
        options: [
          'Dans le dossier `/scripts`',
          'Dans le dossier `/contracts`',
          'Dans le dossier `/test`',
          'À la racine dans `/build`'
        ],
        correctAnswer: 1,
        explanation: 'Hardhat cherche automatiquement les fichiers Solidity source dans la communauté du dossier `/contracts`.'
      }
    ]
  },
  {
    id: 'mod_10',
    order: 10,
    title: 'Tests Unitaires de Smart Contracts',
    subtitle: 'Garantir zéro bug avant le passage en production',
    duration: '40 min',
    difficulty: 'Avancé',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 10 : Centre d\'Assurance Qualité & Tests Unitaires',
    xpReward: 400,
    coinReward: 250,
    objective: 'Écrire des tests unitaires automatisés avec Mocha/Chai et `hardhat-ethers` pour vérifier les échecs et succès.',
    context: 'Une fois déployé, un smart contract ne peut plus être modifié ! Tester chaque fonction avec divers scénarios est une exigence vitale pour la banque de la ville.',
    theoryContent: [
      'Les tests unitaires vérifient la réaction du contrat :',
      '1. Cas nominaux : La fonction s\'exécute et met à jour l\'état comme prévu.',
      '2. Cas d\'échec (Revert) : Vérifier que `require()` annule la transaction si le montant est insuffisant (`expect(...).to.be.revertedWith(...)`).',
      '3. Événements (Events) : S\'assurer que les événements `emit` sont bien déclenchés avec les bons arguments.'
    ],
    codeExample: `describe("Banque Skilloo City", function () {
  it("Devrait déposer des fonds et émettre un événement", async function () {
    const [owner] = await ethers.getSigners();
    const bank = await ethers.deployContract("BankRegistry");
    await expect(bank.deposit({ value: 1000 }))
      .to.emit(bank, "Deposit")
      .withArgs(owner.address, 1000);
    expect(await bank.getBalance(owner.address)).to.equal(1000);
  });
});`,
    simulatorType: 'unit_testing',
    quiz: [
      {
        id: 'q10_1',
        question: 'Pourquoi le testing est-il encore plus rigoureux en développement Web3 qu\'en Web2 traditionnel ?',
        options: [
          'Parce que les langages Web3 sont plus lents.',
          'Car les smart contracts sont immuables et gèrent directement de la valeur financière.',
          'Parce qu\'internet s\'arrête pendant les tests.',
          'Car les navigateurs ne prennent pas en charge JavaScript.'
        ],
        correctAnswer: 1,
        explanation: 'Un bug en smart contract peut entraîner la perte irréversible de millions d\'Ethers sans possibilité de "patch" direct.'
      }
    ]
  },
  {
    id: 'mod_11',
    order: 11,
    title: 'Déploiement sur Réseaux (Testnet & Mainnet)',
    subtitle: 'Du réseau local au testnet public (Sepolia / Polygon)',
    duration: '35 min',
    difficulty: 'Avancé',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 11 : Antenne de Déploiement Multi-Chaînes',
    xpReward: 400,
    coinReward: 250,
    objective: 'Déployer son contrat sur un réseau de test public à l\'aide d\'un Faucet et d\'un fichier de déploiement.',
    context: 'Avant le lancement officiel sur le réseau principal de Skilloo City, l\'équipe déploie le contrat sur le testnet Sepolia pour des essais grand grandeur nature.',
    theoryContent: [
      'Différence des réseaux :',
      '• Localhost / Hardhat Network : Instantané et gratuit pour le développement local.',
      '• Testnets (Sepolia, Amoy, Holesky) : Réseaux réels mais utilisant de la crypto fictive gratuite obtenue via Faucet.',
      '• Mainnet (Ethereum, Polygon, BNB Chain) : Réseaux réels de production avec de vraies valeurs financières.'
    ],
    simulatorType: 'deployment',
    quiz: [
      {
        id: 'q11_1',
        question: 'À quoi sert un Faucet sur un réseau Testnet ?',
        options: [
          'À nettoyer le code source.',
          'À obtenir des jetons de test gratuits pour payer le Gas lors des essais de déploiement.',
          'À fermer la banque en cas de panne.',
          'À vérifier le nom de domaine.'
        ],
        correctAnswer: 1,
        explanation: 'Le Faucet distribue gratuitement de la crypto fictive nécessaire aux tests sur les réseaux d\'essai.'
      }
    ]
  },
  {
    id: 'mod_12',
    order: 12,
    title: 'Applications Décentralisées (DApps & Web3.js / Ethers.js)',
    subtitle: 'Connecter l\'interface React au smart contract',
    duration: '45 min',
    difficulty: 'Avancé',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 12 : Portail d\'Interface Citoyenne DApp',
    xpReward: 450,
    coinReward: 300,
    objective: 'Utiliser Ethers.js pour lire des données de contrat et envoyer des transactions depuis l\'interface utilisateur.',
    context: 'Créez l\'application web de la mairie de Skilloo City permettant à chaque habitant de consulter son solde et d\'interagir avec le guichet en un clic via son wallet.',
    theoryContent: [
      'Une DApp (Decentralized Application) combine :',
      '1. Frontend (React / HTML) : Interface utilisateur.',
      '2. Provider (MetaMask / Ethers.js) : Pont de connexion au réseau blockchain.',
      '3. ABI (Application Binary Interface) : Description JSON des fonctions et événements du contrat.',
      '4. Smart Contract : Le backend décentralisé.'
    ],
    codeExample: `// Connexion et interaction avec Ethers.js v6
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Appel d'une fonction d'écriture
const tx = await contract.deposit({ value: ethers.parseEther("0.1") });
await tx.wait(); // Attente de la confirmation du bloc`,
    simulatorType: 'dapp_web3',
    quiz: [
      {
        id: 'q12_1',
        question: 'À quoi sert l\'ABI (Application Binary Interface) dans une DApp ?',
        options: [
          'À styliser les boutons de l\'interface React.',
          'Elle sert de dictionnaire JSON permettant à la librairie Web3 d\'encoder et décoder les appels vers le Smart Contract.',
          'À traduire le code en plusieurs langues.',
          'À bloquer les connexions suspectes.'
        ],
        correctAnswer: 1,
        explanation: 'L\'ABI informe le frontend des méthodes disponibles et des formats de paramètres attendus par le contrat.'
      }
    ]
  },
  {
    id: 'mod_13',
    order: 13,
    title: 'Jetons Non-Fongibles (NFT - ERC-721)',
    subtitle: 'Propriété numérique unique & Titres Fonciers',
    duration: '45 min',
    difficulty: 'Avancé',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 13 : Galerie & Cadastre Numérique NFT',
    xpReward: 450,
    coinReward: 300,
    objective: 'Comprendre la norme ERC-721, le minage d\'un NFT et l\'hébergement des métadonnées sur IPFS.',
    context: 'Chaque bâtiment et parcelle de terrain de Skilloo City est représenté par un NFT unique. Les habitants peuvent acheter, vendre et certifier leurs biens fonciers.',
    theoryContent: [
      'Un jeton ERC-721 représente un actif numérique unique et non-interchangeable.',
      'Composants principaux :',
      '• `tokenId` : Identifiant unique du jeton.',
      '• `ownerOf(tokenId)` : Renvoie le propriétaire actuel.',
      '• `tokenURI(tokenId)` : Lien vers un fichier JSON décentralisé (ex: IPFS) décrivant l\'image, le nom et les attributs du bien.'
    ],
    codeExample: `import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CityLandNFT is ERC721 {
    uint256 public nextTokenId;
    
    constructor() ERC721("Skilloo City Land", "CCLAND") {}

    function mintLand(address _to) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(_to, tokenId);
        return tokenId;
    }
}`,
    simulatorType: 'nft',
    quiz: [
      {
        id: 'q13_1',
        question: 'Quelle est la différence essentielle entre un jeton ERC-20 et un jeton ERC-721 (NFT) ?',
        options: [
          'L\'ERC-20 utilise plus de gas.',
          'L\'ERC-20 est fongible (chaque jeton est identique), tandis que l\'ERC-721 est unique et non-fongible.',
          'L\'ERC-721 ne fonctionne que sur mobile.',
          'Il n\'y a aucune différence.'
        ],
        correctAnswer: 1,
        explanation: 'Comme un billet de banque (fongible) vs un titre de propriété immobilière (unique).'
      }
    ]
  },
  {
    id: 'mod_14',
    order: 14,
    title: 'Finance Décentralisée (DeFi & Pools de Liquidité)',
    subtitle: 'Swaps autonomes et teneurs de marché automatisés (AMM)',
    duration: '50 min',
    difficulty: 'Expert',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 14 : Réserve & Échangeur DeFi de la Ville',
    xpReward: 500,
    coinReward: 350,
    objective: 'Comprendre le fonctionnement d\'un AMM (Automated Market Maker) basé sur la formule $x \\times y = k$.',
    context: 'Skilloo City dispose de sa propre bourse décentralisée où les citoyens échangent leurs CT-Coins contre d\'autres jetons locaux (EcoToken, EduToken) sans intermédiaire financier.',
    theoryContent: [
      'Dans une bourse décentralisée (ex: Uniswap), le livre d\'ordres classique est remplacé par une Pool de Liquidité.',
      'Formule constante : $x \\times y = k$',
      '• $x$ = Quantité de jeton A dans la pool.',
      '• $y$ = Quantité de jeton B dans la pool.',
      '• $k$ = Produit invariant constant.',
      'Quand un utilisateur achète du Jeton A, il dépose du Jeton B dans la pool, faisant monter le prix du Jeton A selon la courbe de réservation.'
    ],
    simulatorType: 'defi',
    quiz: [
      {
        id: 'q14_1',
        question: 'Dans une pool de liquidité AMM (comme Uniswap v2), comment le prix s\'ajuste-t-il automatiquement ?',
        options: [
          'Un administrateur modifie le prix chaque heure.',
          'Grâce à la formule $x \\times y = k$, qui fait augmenter la valeur d\'un jeton à mesure que sa réserve diminue dans la pool.',
          'Par tirage au sort.',
          'En fonction du cours du pétrole.'
        ],
        correctAnswer: 1,
        explanation: 'La formule mathématique maintient l\'équilibre des réserves et détermine le prix d\'exécution instantané.'
      }
    ]
  },
  {
    id: 'mod_15',
    order: 15,
    title: 'Organisations Autonomes Décentralisées (DAO & Gouvernance)',
    subtitle: 'La démocratie municipale directe sur la blockchain',
    duration: '45 min',
    difficulty: 'Expert',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 15 : Palais du Conseil Municipal DAO',
    xpReward: 500,
    coinReward: 350,
    objective: 'Découvrir la création de propositions, le vote pondéré par jetons et l\'exécution automatisée par Timelock.',
    context: 'Les grands projets d\'infrastructure de Skilloo City (ex: construction d\'un nouveau laboratoire d\'IA ou d\'un parc solaire) sont soumis au vote direct de la communauté via le contrat DAO.',
    theoryContent: [
      'Une DAO (Decentralized Autonomous Organization) est une organisation régie par des règles codées dans un smart contract.',
      'Cycle de vie d\'une décision :',
      '1. Proposition : Soumission d\'un projet avec description et montant requis.',
      '2. Période de Vote : Les détenteurs du jeton de gouvernance votent Pour / Contre / Abstention.',
      '3. Quorum & Majorité : Si les critères sont atteints, le contrat exécute automatiquement la dépense du trésor public.'
    ],
    simulatorType: 'dao',
    quiz: [
      {
        id: 'q15_1',
        question: 'Comment est mesuré le pouvoir de vote d\'un citoyen dans une DAO standard ?',
        options: [
          'Chaque adresse a 1 vote quelle que soit sa participation.',
          'Le pouvoir de vote est généralement proportionnel au nombre de jetons de gouvernance détenus ou délégués.',
          'Selon l\'ancienneté de l\'ordinateur.',
          'Par décision du maire.'
        ],
        correctAnswer: 1,
        explanation: 'La gouvernance par jetons attribue des voix en fonction de l\'implication dans le protocole.'
      }
    ]
  },
  {
    id: 'mod_16',
    order: 16,
    title: 'Sécurité & Auditing (Réentrance & Failles)',
    subtitle: 'Protéger la ville contre les attaques de pirates',
    duration: '50 min',
    difficulty: 'Expert',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 16 : Bouclier de Sécurité et Audit Cryptographique',
    xpReward: 550,
    coinReward: 400,
    objective: 'Identifier la vulnérabilité de réentrance (Reentrancy Attack) et appliquer le pattern Checks-Effects-Interactions.',
    context: 'Un hacker a tenté de vider les réserves du fonds de garantie de Skilloo City ! Analysez la faille et corrigez le code pour ériger un bouclier immuable.',
    theoryContent: [
      'L\'attaque de réentrance survient lorsqu\'un contrat effectue un appel externe (ex: envoi d\'Ether) avant de mettre à jour son propre état interne.',
      'Le contrat attaquant intercepte l\'appel et rappelle la fonction de retrait en boucle avant que le solde ne soit déduit !',
      'Protection :',
      '1. Pattern Checks-Effects-Interactions : Modifier l\'état interne AVANT de faire un transfert externe.',
      '2. Guard ReentrancyLock : Utiliser un modificateur `nonReentrant` d\'OpenZeppelin.'
    ],
    codeExample: `// ❌ CODE VULNÉRABLE
function withdraw() public {
    uint amount = balances[msg.sender];
    (bool success, ) = msg.sender.call{value: amount}(""); // Appel externe D'ABORD !
    require(success);
    balances[msg.sender] = 0; // Trop tard !
}

// ✅ CODE SÉCURISÉ
function withdraw() public nonReentrant {
    uint amount = balances[msg.sender];
    balances[msg.sender] = 0; // État mis à jour D'ABORD !
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}`,
    simulatorType: 'security',
    quiz: [
      {
        id: 'q16_1',
        question: 'Dans le pattern "Checks-Effects-Interactions", quelle étape doit absolument se produire AVANT d\'envoyer de la crypto vers une adresse externe ?',
        options: [
          'La mise à jour du solde ou de l\'état interne (Effects).',
          'L\'envoi du message au journal.',
          'La fermeture du navigateur.',
          'L\'impression du reçu.'
        ],
        correctAnswer: 0,
        explanation: 'Mettre à jour l\'état interne d\'abord empêche l\'attaquant de rappeler la fonction pour re-retirer des fonds.'
      }
    ]
  },
  {
    id: 'mod_17',
    order: 17,
    title: 'Optimisation du Gas & Layer 2 (Rollups & Scalabilité)',
    subtitle: 'Réduire les coûts de 95% pour l\'adoption de masse',
    duration: '40 min',
    difficulty: 'Expert',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 17 : Accélérateur Layer 2 et Optimiseur de Storage',
    xpReward: 500,
    coinReward: 350,
    objective: 'Apprendre le packing de variables Solidity et le fonctionnement des Rollups Optimistic / Zero-Knowledge.',
    context: 'Pour permettre aux millions de citoyens de faire des transactions instantanées et quasi-gratuites, Skilloo City migre son infrastructure sur un réseau Layer 2 (Rollup).',
    theoryContent: [
      '1. Optimisation Solidity (Variable Packing) : L\'EVM traite les données par slots de 32 octets (256 bits). Regrouper plusieurs petites variables (`uint8`, `uint64`, `bool`) dans le même slot économise d\'importantes quantités de gas !',
      '2. Layer 2 (L2 Rollups) : Déportent l\'exécution des transactions hors de la chaîne principale (Layer 1) puis compressent et soumettent une preuve unique sur la L1.',
      'Résultat : Des milliers de transactions par seconde avec des frais divisés par 50 !'
    ],
    simulatorType: 'gas_optimization',
    quiz: [
      {
        id: 'q17_1',
        question: 'Comment fonctionnent les Rollups Layer 2 pour accélérer la blockchain ?',
        options: [
          'Ils suppriment la cryptographie.',
          'Ils exécutent les transactions hors de la chaîne principale puis regroupent les preuves sous forme compressée sur la L1.',
          'Ils utilisent des serveurs centralisés non sécurisés.',
          'Ils arrêtent la blockchain la nuit.'
        ],
        correctAnswer: 1,
        explanation: 'Les L2 combinent le meilleur des deux mondes : la vitesse hors-chaîne et la sécurité immuable de la L1.'
      }
    ]
  },
  {
    id: 'mod_18',
    order: 18,
    title: 'Projet Final : Le Hub Web3 Citoyen de Skilloo City',
    subtitle: 'Intégration complète de la Métropole Numérique',
    duration: '60 min',
    difficulty: 'Expert',
    buildingUnlockedId: 'bldg_blockchain',
    buildingUpgradeName: 'Niveau 18 : Citadelle Web3 et Métropole Numérique Complète',
    xpReward: 1000,
    coinReward: 1000,
    objective: 'Déployer et assembler le smart contract final intégrant la banque, le cadastre NFT, la réserve DeFi et la gouvernance DAO.',
    context: 'Félicitations ! Vous êtes sur le point de sceller l\'autonomie numérique de Skilloo City. Rassemblez toutes vos compétences pour achever le grand Hub Web3 de la ville.',
    theoryContent: [
      'Le projet final synthétise l\'ensemble des 18 modules du parcours Blockchain :',
      '• Hachage et sécurité des blocs.',
      '• Portefeuille et identité citoyenne.',
      '• Contrats Solidity certifiés et audités contre les attaques.',
      '• Titres de propriété fonciers sous forme de NFT.',
      '• Système financier décentralisé et trésorerie DAO.',
      'Une fois validée, votre Banque Blockchain atteint son niveau maximal (Niveau 18) et débloque le titre d\'Architecte Web3 de Skilloo City !'
    ],
    simulatorType: 'capstone',
    quiz: [
      {
        id: 'q18_1',
        question: 'Quel est l\'impact majeur de l\'approche "Apprendre par la Ville" pour les jeunes talentueux du numérique ?',
        options: [
          'Elle rend l\'apprentissage passif et ennuyeux.',
          'Elle relie directement chaque compétence théorique à un besoin concret du monde réel et à une création visible.',
          'Elle limite les cours à la théorie sans pratique.',
          'Elle est réservée aux chercheurs.'
        ],
        correctAnswer: 1,
        explanation: 'Développer une ville vivante transforme chaque notion abstraite en un levier d\'impact concret et réutilisable.'
      }
    ]
  }
];
