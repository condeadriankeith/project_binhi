export enum ItemType {
  NARRA = 'NARRA',
  MOLAVE = 'MOLAVE',
  BANABA = 'BANABA',
  DAO = 'DAO',
  KAMAGONG = 'KAMAGONG'
}

export type UserRole = 'individual' | 'organization';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  orgId?: string;
}

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