/**
 * Crashlytics Error Service
 * Single Responsibility: Handle error logging operations
 */

import { firebaseAnalyticsService } from '@umituz/react-native-firebase-analytics';
import { nativeCrashlyticsAdapter } from '../adapters/native-crashlytics.adapter';

export class CrashlyticsErrorService {
  /**
   * Log error to Crashlytics
   * Falls back to Analytics if Crashlytics is not available
   */
  async logError(
    crashlytics: any | null,
    error: Error,
    context?: string,
  ): Promise<void> {
    try {
      if (!crashlytics || !nativeCrashlyticsAdapter) {
        // Fallback to Analytics
        await this.logErrorToAnalytics(error, context);
        return;
      }

      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.error(`[Crashlytics] Error${context ? ` in ${context}` : ''}:`, error);
      }

      if (context) {
        await nativeCrashlyticsAdapter.log(crashlytics, `Context: ${context}`);
      }
      await nativeCrashlyticsAdapter.log(
        crashlytics,
        `Error: ${error.name} - ${error.message}`,
      );
      await nativeCrashlyticsAdapter.recordError(crashlytics, error);

      // Also log to Analytics
      await this.logErrorToAnalytics(error, context);
    } catch (_error) {
      // Silent fail
    }
  }

  /**
   * Log message to Crashlytics
   */
  async log(crashlytics: any | null, message: string): Promise<void> {
    try {
      if (!crashlytics || !nativeCrashlyticsAdapter) {
        /* eslint-disable-next-line no-console */
        if (__DEV__) {
          console.log(`[Crashlytics] ${message}`);
        }
        return;
      }

      await nativeCrashlyticsAdapter.log(crashlytics, message);
    } catch (_error) {
      // Silent fail
    }
  }

  private async logErrorToAnalytics(error: Error, context?: string): Promise<void> {
    try {
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
}

export const crashlyticsErrorService = new CrashlyticsErrorService();

