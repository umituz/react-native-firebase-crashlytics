/**
 * React Native Firebase Crashlytics - Public API
 *
 * Domain-Driven Design (DDD) Architecture
 */

// =============================================================================
// INFRASTRUCTURE LAYER - Services
// =============================================================================

export {
  firebaseCrashlyticsService,
} from './infrastructure/services/FirebaseCrashlyticsService';
export type { ICrashlyticsService } from './infrastructure/services/FirebaseCrashlyticsService';

// =============================================================================
// PRESENTATION LAYER - Decorators
// =============================================================================

export {
  TrackErrors,
  trackErrors,
} from './presentation/decorators/ErrorTrackingDecorator';

