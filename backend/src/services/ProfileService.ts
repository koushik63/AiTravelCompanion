import { DatabaseService } from './DatabaseService';

export class ProfileService {
  static async getProfile(userId: string) {
    return await DatabaseService.getProfileByUserId(userId);
  }

  static async updateProfile(userId: string, data: { name?: string; avatar?: string }) {
    return await DatabaseService.updateProfile(userId, data);
  }

  static async getPreferences(userId: string) {
    return await DatabaseService.getPreferencesByUserId(userId);
  }

  static async updatePreferences(userId: string, data: { preferredCurrency?: string; travelStyle?: string; theme?: string; emailNotifications?: boolean }) {
    return await DatabaseService.updatePreferences(userId, data);
  }
}
