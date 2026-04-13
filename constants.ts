
import { ItemType, TreeType, Organization, TileData } from './types';

export const GRID_SIZE = 5;
export const INITIAL_BALANCE = 0.00; // Start at 0 per user requirement

export const TREE_SPECIES: TreeType[] = [
  { id: ItemType.HORNBEAM, name: 'Narra', price: 250.00, co2Factor: 2.3, unlockLevel: 1, icon: '🌳' },
  { id: ItemType.CEDAR, name: 'Molave', price: 350.00, co2Factor: 3.1, unlockLevel: 1, icon: '🌳' },
  { id: ItemType.MAPLE, name: 'Yakal', price: 500.00, co2Factor: 4.5, unlockLevel: 2, icon: '🌲' },
  { id: ItemType.SPRUCE, name: 'Banuyo', price: 800.00, co2Factor: 5.2, unlockLevel: 2, icon: '🌳' },
  { id: ItemType.WILLOW, name: 'Malugai', price: 1200.00, co2Factor: 6.8, unlockLevel: 3, icon: '🌿' }
];

const generateTiles = (): TileData[] => {
  const tiles: TileData[] = [];
  let id = 0;
  for (let x = -Math.floor(GRID_SIZE / 2); x <= Math.floor(GRID_SIZE / 2); x++) {
    for (let z = -Math.floor(GRID_SIZE / 2); z <= Math.floor(GRID_SIZE / 2); z++) {
      tiles.push({
        id: id++,
        x,
        z,
        isPlanted: false,
        rotation: Math.random() * Math.PI * 2,
        scale: 0.9 + Math.random() * 0.3,
        offsetX: 0,
        offsetZ: 0,
      });
    }
  }
  return tiles;
};

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'bakuran',
    name: 'BCC Advocates for Kalikasan (BAKURAN)',
    mission: 'Empowering communities through sustainable restoration.',
    location: 'Negros Occidental, PH',
    islandColor: '#43A047', // Deep Green
    waterColor: '#81D4FA', // Soft Blue
    accentColor: '#1DE9B6',
    tiles: generateTiles(),
    totalTrees: 1420,
    totalCo2: 3200,
    donations: 0 // Setting to 0 based on user requirement
  },
  {
    id: 'earthguards',
    name: 'EarthGuards USLS',
    mission: 'Student-led initiatives for a greener future.',
    location: 'Bacolod City, PH',
    islandColor: '#9CCC65', // Light Green
    waterColor: '#4FC3F7', // Sky Blue
    accentColor: '#FFD740',
    tiles: generateTiles(),
    totalTrees: 850,
    totalCo2: 1800,
    donations: 0 // Setting to 0 based on user requirement
  }
];

export const COLORS = {
  island: '#9CCC65',
  water: '#81D4FA',
  treeLeaves: '#2E7D32',
  treeTrunk: '#5D4037',
  sky: '#D1FFBD' // Mint background from inspiration
};
