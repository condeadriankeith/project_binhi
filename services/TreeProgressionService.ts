import { Organization, GrowthStage, TileData } from '../types';

export class TreeProgressionService {
  static async processWatering(organization: Organization): Promise<{ updatedOrg: Organization, treesWatered: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let treesWatered = 0;
        
        const updatedTiles = organization.tiles.map(tile => {
          if (tile.isPlanted && tile.growthStage && tile.growthStage < 4) {
             treesWatered++;
             return { ...tile, growthStage: (tile.growthStage + 1) as GrowthStage, lastWatered: new Date().toISOString() };
          }
          return tile;
        });

        resolve({
          updatedOrg: { ...organization, tiles: updatedTiles },
          treesWatered
        });
      }, 400); // Simulate network latency
    });
  }
}
