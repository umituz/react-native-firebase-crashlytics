/**
 * Firebase Crashlytics Service
 * Single Responsibility: Orchestrate Crashlytics operations
 * Delegates to specialized services for initialization, error logging, and user management
 */

import { crashlyticsInitializerService } from './crashlytics-initializer.service';
import { crashlyticsErrorService } from './crashlytics-error.service';
import { crashlyticsUserService } from './crashlytics-user.service';

export interface ICrashlyticsService {
  init(userId?: string): Promise<void>;
  logError(error: Error, context?: string): Promise<void>;
  log(message: string): Promise<void>;
  setAttribute(key: string, value: string): Promise<void>;
  setAttributes(attributes: Record<string, string>): Promise<void>;
  clearUserData(): Promise<void>;
}

class FirebaseCrashlyticsService implements ICrashlyticsService {
  private isInitialized = false;
  private userId: string | null = null;
  private attributes: Record<string, string> = {};
  private crashlytics: any | null = null;

  async init(userId?: string): Promise<void> {
    try {
      this.crashlytics = crashlyticsInitializerService.initialize();

      if (this.crashlytics) {
        if (userId) {
          this.userId = userId;
          await crashlyticsUserService.setUserId(this.crashlytics, userId);
          await this.setAttribute('user_type', 'authenticated');
        } else {
          await this.setAttribute('user_type', 'guest');
        }
      }
    } catch (_error) {
      // Crashlytics is non-critical, fail silently
    } finally {
      this.isInitialized = true;
    }
  }

  async logError(error: Error, context?: string): Promise<void> {
    await crashlyticsErrorService.logError(this.crashlytics, error, context);
  }

  async log(message: string): Promise<void> {
    await crashlyticsErrorService.log(this.crashlytics, message);
  }

  async setAttribute(key: string, value: string): Promise<void> {
    this.attributes[key] = value;
    await crashlyticsUserService.setAttribute(this.crashlytics, key, value);
  }

  async setAttributes(attributes: Record<string, string>): Promise<void> {
    await crashlyticsUserService.setAttributes(this.crashlytics, attributes);
    Object.assign(this.attributes, attributes);
  }

  async clearUserData(): Promise<void> {
    await crashlyticsUserService.clearUserData(this.crashlytics);
    this.userId = null;
    this.attributes = {};
    this.isInitialized = false;
  }
}

export const firebaseCrashlyticsService = new FirebaseCrashlyticsService();
