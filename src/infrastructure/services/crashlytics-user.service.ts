/**
 * Crashlytics User Service
 * Single Responsibility: Handle user-related Crashlytics operations
 */

import { nativeCrashlyticsAdapter } from '../adapters/native-crashlytics.adapter';

export class CrashlyticsUserService {
  /**
   * Set user ID
   */
  async setUserId(crashlytics: any | null, userId: string): Promise<void> {
    try {
      if (!crashlytics || !nativeCrashlyticsAdapter) {
        return;
      }

      await nativeCrashlyticsAdapter.setUserId(crashlytics, userId);
    } catch (_error) {
      // Silent fail
    }
  }

  /**
   * Set attribute
   */
  async setAttribute(
    crashlytics: any | null,
    key: string,
    value: string,
  ): Promise<void> {
    try {
      if (!crashlytics || !nativeCrashlyticsAdapter) {
        return;
      }

      await nativeCrashlyticsAdapter.setAttributes(crashlytics, { [key]: value });
    } catch (_error) {
      // Silent fail
    }
  }

  /**
   * Set multiple attributes
   */
  async setAttributes(
    crashlytics: any | null,
    attributes: Record<string, string>,
  ): Promise<void> {
    try {
      if (!crashlytics || !nativeCrashlyticsAdapter) {
        return;
      }

      await nativeCrashlyticsAdapter.setAttributes(crashlytics, attributes);
    } catch (_error) {
      // Silent fail
    }
  }

  /**
   * Clear user data
   */
  async clearUserData(crashlytics: any | null): Promise<void> {
    try {
      if (!crashlytics || !nativeCrashlyticsAdapter) {
        return;
      }

      await nativeCrashlyticsAdapter.setUserId(crashlytics, '');
      await nativeCrashlyticsAdapter.setAttributes(crashlytics, {});
    } catch (_error) {
      // Silent fail
    }
  }
}

export const crashlyticsUserService = new CrashlyticsUserService();

