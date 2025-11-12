# @umituz/react-native-firebase-crashlytics

Firebase Crashlytics service for React Native apps - Platform-agnostic error tracking with decorators.

Built with **Domain-Driven Design (DDD)** principles.

## Installation

```bash
npm install @umituz/react-native-firebase-crashlytics
```

## Peer Dependencies

- `@umituz/react-native-firebase` >= 1.0.0 (for Firebase App initialization)
- `@umituz/react-native-firebase-analytics` >= 1.0.0 (for error fallback on web)
- `firebase` >= 11.0.0
- `react` >= 18.2.0
- `react-native` >= 0.74.0

## Features

- ✅ Platform-agnostic (Web fallback to Analytics, Native uses Crashlytics)
- ✅ Automatic error tracking with decorators
- ✅ Custom attributes and context
- ✅ User identification
- ✅ Domain-Driven Design architecture

## Usage

### 1. Initialize Firebase App First

```typescript
import { initializeFirebase } from '@umituz/react-native-firebase';
import { firebaseCrashlyticsService } from '@umituz/react-native-firebase-crashlytics';

// Initialize Firebase App
const config = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
};
initializeFirebase(config);

// Initialize Crashlytics
await firebaseCrashlyticsService.init();
```

### 2. Log Errors

```typescript
import { firebaseCrashlyticsService } from '@umituz/react-native-firebase-crashlytics';

try {
  // Your code
} catch (error) {
  await firebaseCrashlyticsService.logError(
    error instanceof Error ? error : new Error('Unknown error'),
    'MyComponent.handleAction'
  );
}
```

### 3. Use Decorators

```typescript
import { TrackErrors } from '@umituz/react-native-firebase-crashlytics';

class UserService {
  @TrackErrors('UserService', 'database')
  async createUser(data: UserData) {
    // Errors are automatically logged to Crashlytics
    return user;
  }
}
```

### 4. Set Attributes

```typescript
import { firebaseCrashlyticsService } from '@umituz/react-native-firebase-crashlytics';

// Set custom attribute
await firebaseCrashlyticsService.setAttribute('app_version', '1.0.0');

// Set multiple attributes
await firebaseCrashlyticsService.setAttributes({
  app_version: '1.0.0',
  environment: 'production',
});
```

## API

### Services

- `firebaseCrashlyticsService.init(userId?)` - Initialize Crashlytics
- `firebaseCrashlyticsService.logError(error, context?)` - Log error
- `firebaseCrashlyticsService.log(message)` - Log message
- `firebaseCrashlyticsService.setAttribute(key, value)` - Set attribute
- `firebaseCrashlyticsService.setAttributes(attributes)` - Set multiple attributes
- `firebaseCrashlyticsService.clearUserData()` - Clear user data

### Decorators

- `@TrackErrors(serviceName, errorType?)` - Automatic error tracking
- `trackErrors(serviceName, operation, errorType?)` - Functional error tracking

## Platform Support

- **Native (iOS/Android)**: Uses Firebase Crashlytics
- **Web**: Falls back to Firebase Analytics (logs error events)

## Architecture

This package follows Domain-Driven Design principles:

- **Infrastructure Layer**: Firebase Crashlytics implementation
- **Presentation Layer**: Decorators for automatic error tracking
- **Platform-agnostic**: Works on Web (with Analytics fallback) and Native

## License

MIT

