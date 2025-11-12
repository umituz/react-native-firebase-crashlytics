/**
 * Firebase Crashlytics Service
 *
 * Single Responsibility: Handle Firebase Crashlytics error tracking
 * Platform-agnostic: Works on all platforms (Web, iOS, Android)
 */

import { firebaseAnalyticsService } from '@umituz/react-native-firebase-analytics';

// Try to load native implementation - if not available, will use analytics fallback
let nativeCrashlytics: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-firebase/app');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crashlytics = require('@react-native-firebase/crashlytics');
  nativeCrashlytics = {
    getCrashlytics: crashlytics.getCrashlytics,
    setUserId: crashlytics.setUserId,
    setAttributes: crashlytics.setAttributes,
    recordError: crashlytics.recordError,
    crashlytics: crashlytics.default || crashlytics,
  };
} catch {
  // @react-native-firebase/crashlytics not available (e.g., on web)
}

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
  private crashlytics: any = null;

  async init(userId?: string): Promise<void> {
    try {
      if (!nativeCrashlytics) {
        // Crashlytics not available (e.g., on web) - use analytics fallback
        this.isInitialized = true;
        return;
      }

      this.crashlytics = nativeCrashlytics.getCrashlytics();

      if (userId) {
        this.userId = userId;
        await nativeCrashlytics.setUserId(this.crashlytics, userId);
        await this.setAttribute('user_type', 'authenticated');
      } else {
        await this.setAttribute('user_type', 'guest');
      }

      this.isInitialized = true;
    } catch (_error) {
      // Crashlytics is non-critical, fail silently
      this.isInitialized = true;
    }
  }

  async logError(error: Error, context?: string): Promise<void> {
    try {
      if (!this.crashlytics || !nativeCrashlytics) {
        // Crashlytics not available - use analytics fallback
        /* eslint-disable-next-line no-console */
        if (__DEV__) console.error(`[Crashlytics] Error${context ? ` in ${context}` : ''}:`, error);
        
        await firebaseAnalyticsService.logEvent('error_occurred', {
          error_name: error.name,
          error_message: error.message.substring(0, 100),
          error_context: context || 'unknown',
          error_type: 'generic',
        });
        return;
      }

      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.error(`[Crashlytics] Error${context ? ` in ${context}` : ''}:`, error);
      }

      if (context) {
        await nativeCrashlytics.crashlytics().log(`Context: ${context}`);
      }
      await nativeCrashlytics.crashlytics().log(`Error: ${error.name} - ${error.message}`);
      await nativeCrashlytics.recordError(this.crashlytics, error);

      // Also log to Analytics
      await firebaseAnalyticsService.logEvent('error_occurred', {
        error_name: error.name,
        error_message: error.message.substring(0, 100),
        error_context: context || 'unknown',
        error_type: 'generic',
      });
    } catch (_error) {
      // Silent fail
    }
  }

  async log(message: string): Promise<void> {
    try {
      if (!this.crashlytics || !nativeCrashlytics) {
        /* eslint-disable-next-line no-console */
        if (__DEV__) console.log(`[Crashlytics] ${message}`);
        return;
      }

      await nativeCrashlytics.crashlytics().log(message);
    } catch (_error) {
      // Silent fail
    }
  }

  async setAttribute(key: string, value: string): Promise<void> {
    try {
      this.attributes[key] = value;

      if (!this.crashlytics || !nativeCrashlytics) {
        return;
      }

      await nativeCrashlytics.setAttributes(this.crashlytics, { [key]: value });
    } catch (_error) {
      // Silent fail
    }
  }

  async setAttributes(attributes: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(attributes)) {
      await this.setAttribute(key, value);
    }
  }

  async clearUserData(): Promise<void> {
    try {
      if (!this.crashlytics || !nativeCrashlytics) {
        this.userId = null;
        this.attributes = {};
        this.isInitialized = false;
        return;
      }

      await nativeCrashlytics.crashlytics().setUserId('');
      await nativeCrashlytics.crashlytics().setAttributes({});

      this.userId = null;
      this.attributes = {};
      this.isInitialized = false;
    } catch (_error) {
      // Silent fail
    }
  }
}

export const firebaseCrashlyticsService = new FirebaseCrashlyticsService();

