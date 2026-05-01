export enum ItemType {
  NARRA = 'NARRA',
  MALUGAI = 'MALUGAI',
  KALUMPIT = 'KALUMPIT',
  UDLING = 'UDLING',
  BUGNAI = 'BUGNAI',
  KUPANG = 'KUPANG',
  MOLAVE = 'MOLAVE',
  AGARWOOD = 'AGARWOOD'
}

export type UserRole = 'individual' | 'organization';

export interface User {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  orgId?: string;
  rank?: string;
  badges?: string[];
  wateringStreak?: number;
  lastWateredDate?: string;
  wateringHistory?: Record<string, boolean>;
}

export type GrowthStage = 1 | 2 | 3 | 4; // 1: Seedling, 2: Sprout, 3: Sapling, 4: Tree

export interface DonationEvent {
  id: string;
  userName: string;
  treeType: ItemType;
  treeName: string;
  amount: number;
  timestamp: string;
}

export interface TreeType {
  id: ItemType;
  name: string;
  price: number;
  co2Factor: number; // kg per year
  unlockLevel: number;
  icon: string;
}

export interface TileData {
  id: number;
  x: number;
  z: number;
  plantType?: ItemType;
  isPlanted: boolean;
  rotation?: number;
  scale?: number;
  offsetX?: number;
  offsetZ?: number;
  growthStage?: GrowthStage;
  lastWatered?: string;
  plantedBy?: string; // email of the user who planted it
}

export type UpdateCategory = 'field-work' | 'community' | 'milestone';

export interface ImpactUpdate {
  id: string;
  title: string;
  category: UpdateCategory;
  content: string;
  timestamp: string;
  mediaUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  mission: string;
  location: string;
  islandColor: string;
  waterColor: string;
  accentColor: string;
  tiles: TileData[];
  totalTrees: number;
  totalCo2: number;
  donations: number;
  recentDonations?: DonationEvent[];
  lastUpdate?: string;
  updates?: ImpactUpdate[];
}

export interface GameState {
  balance: number;
  level: number;
  showCommunity: boolean;
}