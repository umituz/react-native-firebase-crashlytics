/**
 * Native Crashlytics Adapter
 * Single Responsibility: Handle Firebase Crashlytics native implementation
 */

export interface NativeCrashlyticsAdapter {
  getCrashlytics(): any;
  setUserId(crashlytics: any, userId: string): Promise<void>;
  setAttributes(crashlytics: any, attributes: Record<string, string>): Promise<void>;
  recordError(crashlytics: any, error: Error): Promise<void>;
  log(crashlytics: any, message: string): Promise<void>;
}

let nativeCrashlyticsModule: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-firebase/app');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crashlytics = require('@react-native-firebase/crashlytics');
  nativeCrashlyticsModule = crashlytics;
} catch {
  // @react-native-firebase/crashlytics not available
}

export const nativeCrashlyticsAdapter: NativeCrashlyticsAdapter | null =
  nativeCrashlyticsModule
    ? {
        getCrashlytics(): any {
          return nativeCrashlyticsModule.getCrashlytics();
        },
        async setUserId(crashlytics: any, userId: string): Promise<void> {
          await crashlytics.setUserId(userId);
        },
        async setAttributes(
          crashlytics: any,
          attributes: Record<string, string>,
        ): Promise<void> {
          await crashlytics.setAttributes(attributes);
        },
        async recordError(crashlytics: any, error: Error): Promise<void> {
          await crashlytics.recordError(error);
        },
        async log(crashlytics: any, message: string): Promise<void> {
          await crashlytics.log(message);
        },
      }
    : null;

