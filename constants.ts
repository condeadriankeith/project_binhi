
import { ItemType, TreeType, Organization, TileData } from './types';

export const GRID_SIZE = 5;
export const INITIAL_BALANCE = 50.00; // Increased starting balance for better trial

export const TREE_SPECIES: TreeType[] = [
  { id: ItemType.HORNBEAM, name: 'Hornbeam', price: 4.50, co2Factor: 2.3, unlockLevel: 1, icon: '🌲' },
  { id: ItemType.CEDAR, name: 'Cedar', price: 6.00, co2Factor: 3.1, unlockLevel: 1, icon: '🌲' },
  { id: ItemType.MAPLE, name: 'Maple', price: 8.50, co2Factor: 4.5, unlockLevel: 2, icon: '🌳' },
  { id: ItemType.SPRUCE, name: 'Spruce', price: 10.00, co2Factor: 5.2, unlockLevel: 2, icon: '🌲' },
  { id: ItemType.WILLOW, name: 'Willow', price: 15.00, co2Factor: 6.8, unlockLevel: 3, icon: '🌿' }
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
    id: 'eden',
    name: 'Eden Projects',
    mission: 'Reforesting Madagascar coastlines.',
    location: 'Madagascar',
    islandColor: '#9CCC65', // Bright Grass Green
    waterColor: '#81D4FA', // Soft Blue
    accentColor: '#1DE9B6',
    tiles: generateTiles(),
    totalTrees: 1420,
    totalCo2: 3200
  },
  {
    id: 'tree-nation',
    name: 'Tree-Nation',
    mission: 'Restoring the Amazonian heartland.',
    location: 'Brazil',
    islandColor: '#C0CA33', // Limey Green
    waterColor: '#4FC3F7', // Deep Sky Blue
    accentColor: '#FFD740',
    tiles: generateTiles(),
    totalTrees: 2150,
    totalCo2: 4800
  },
  {
    id: 'greenbelt',
    name: 'Green Belt',
    mission: 'Empowering communities in Kenya.',
    location: 'Kenya',
    islandColor: '#8BC34A', // Classic Green
    waterColor: '#B3E5FC', // Very Light Blue
    accentColor: '#FFAB91',
    tiles: generateTiles(),
    totalTrees: 980,
    totalCo2: 1200
  }
];

export const COLORS = {
  island: '#9CCC65',
  water: '#81D4FA',
  treeLeaves: '#2E7D32',
  treeTrunk: '#5D4037',
  sky: '#D1FFBD' // Mint background from inspiration
};
