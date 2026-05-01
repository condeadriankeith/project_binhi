import { User } from '../types';

export class GamificationService {
  static evaluateRank(streak: number): string {
    if (streak > 30) return 'Forest Guardian';
    if (streak > 14) return 'Tree Planter';
    if (streak > 7) return 'Sapling';
    if (streak > 3) return 'Sprout';
    return 'Seedling';
  }

  static evaluateBadges(badges: string[], streak: number, isIslandPioneer: boolean): string[] {
    const newBadges = new Set(badges);
    
    if (streak >= 7) newBadges.add('7-Day Streak');
    if (streak >= 30) newBadges.add('Monthly Guardian');
    if (isIslandPioneer) newBadges.add('Island Pioneer');
    
    return Array.from(newBadges);
  }

  static async updateUserGamification(user: User, treesWatered: number, islandFilled: boolean): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const streak = (user.wateringStreak || 0) + (treesWatered > 0 ? 1 : 0);
        const rank = this.evaluateRank(streak);
        const badges = this.evaluateBadges(user.badges || [], streak, islandFilled);
        
        const updatedUser = { ...user, wateringStreak: streak, rank, badges };
        resolve(updatedUser);
      }, 300);
    });
  }
}
