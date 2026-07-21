// Constants

export const CATEGORIES = [
  { id: 'router', label: 'Routeurs', emoji: '📡' },
  { id: 'smartphone', label: 'Smartphones', emoji: '📱' },
  { id: 'switch', label: 'Switchs', emoji: '🔌' },
  { id: 'accessory', label: 'Accessoires', emoji: '🎧' },
];

export const SERVICES = [
  {
    id: 'repair',
    name: 'Réparation',
    description: 'Réparation de vos appareils électroniques',
    icon: '🔧',
  },
  {
    id: 'diagnostic',
    name: 'Diagnostic',
    description: 'Diagnostic gratuit de votre appareil',
    icon: '🔍',
  },
  {
    id: 'installation',
    name: 'Installation',
    description: 'Installation de réseau et configuration',
    icon: '⚙️',
  },
  {
    id: 'consultation',
    name: 'Consultation',
    description: 'Conseil en matériel informatique',
    icon: '💡',
  },
  {
    id: 'data-recovery',
    name: 'Récupération Données',
    description: 'Récupération sécurisée de vos données',
    icon: '💾',
  },
];

export const ORDER_STATUSES = [
  { id: 'pending', label: 'En attente', color: 'text-yellow-400' },
  { id: 'confirmed', label: 'Confirmée', color: 'text-blue-400' },
  { id: 'shipped', label: 'Expédiée', color: 'text-purple-400' },
  { id: 'delivered', label: 'Livrée', color: 'text-green-400' },
  { id: 'cancelled', label: 'Annulée', color: 'text-red-400' },
];

export const APPOINTMENT_STATUSES = [
  { id: 'pending', label: 'En attente', color: 'text-yellow-400' },
  { id: 'confirmed', label: 'Confirmée', color: 'text-blue-400' },
  { id: 'completed', label: 'Complétée', color: 'text-green-400' },
  { id: 'cancelled', label: 'Annulée', color: 'text-red-400' },
];

export const DIAGNOSTIC_STATUSES = [
  { id: 'pending', label: 'En attente', color: 'text-yellow-400' },
  { id: 'in_progress', label: 'En cours', color: 'text-blue-400' },
  { id: 'completed', label: 'Complétée', color: 'text-green-400' },
  { id: 'sent_to_workshop', label: 'Envoyée en atelier', color: 'text-purple-400' },
];

export const MOCK_PRODUCTS = [
  {
    name: 'Routeur WiFi 6 TP-Link Archer AX55',
    category: 'router',
    price: 45000,
    stock: 12,
    description: 'Routeur WiFi 6 haute performance pour une connexion ultra-rapide',
    specs: {
      standard: 'WiFi 6 (802.11ax)',
      vitesse: '3000 Mbps',
      ports: '4 x Gigabit Ethernet',
    },
  },
  {
    name: 'Samsung Galaxy A35 5G 128GB',
    category: 'smartphone',
    price: 180000,
    stock: 8,
    description: 'Smartphone 5G avec appareil photo haute qualité',
    specs: {
      ecran: '6.5 pouces AMOLED',
      processeur: 'Exynos 1280',
      batterie: '5000 mAh',
    },
  },
  {
    name: 'Switch Cisco SG250-24 24-Port Gigabit',
    category: 'switch',
    price: 95000,
    stock: 5,
    description: 'Switch réseau professionnel 24 ports',
    specs: {
      ports: '24 x Gigabit Ethernet',
      vitesse: '48 Gbps',
      management: 'Web-based',
    },
  },
  {
    name: 'Routeur 4G/LTE Mikrotik HAP AC2',
    category: 'router',
    price: 52000,
    stock: 10,
    description: 'Routeur 4G/LTE compact avec WiFi AC',
    specs: {
      connexion: '4G/LTE + WiFi AC',
      ports: '3 x Gigabit Ethernet',
      batterie: 'PoE compatible',
    },
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro 256GB',
    category: 'smartphone',
    price: 165000,
    stock: 15,
    description: 'Smartphone performance avec grande batterie',
    specs: {
      ecran: '6.67 pouces AMOLED',
      processeur: 'Snapdragon 7 Gen 1',
      batterie: '5000 mAh',
    },
  },
  {
    name: 'Switch TP-Link TL-SG1024 24-Port',
    category: 'switch',
    price: 68000,
    stock: 7,
    description: 'Switch réseau 24 ports pour PME',
    specs: {
      ports: '24 x Gigabit Ethernet',
      vitesse: '48 Gbps',
      capacité: ' 64 Mbps',
    },
  },
  {
    name: 'Câble RJ45 Cat6 5M',
    category: 'accessory',
    price: 3500,
    stock: 50,
    description: 'Câble réseau Cat6 blindé 5 mètres',
    specs: {
      longueur: '5 mètres',
      categorie: 'Cat6',
      blindage: 'FTP',
    },
  },
  {
    name: 'Adaptateur USB-C vers HDMI',
    category: 'accessory',
    price: 8500,
    stock: 30,
    description: 'Adaptateur USB-C vers HDMI 4K',
    specs: {
      resolution: '4K @ 30Hz',
      connecteurs: 'USB-C / HDMI',
      cable: '15cm intégré',
    },
  },
];
