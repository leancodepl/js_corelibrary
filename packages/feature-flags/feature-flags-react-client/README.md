# @leancodepl/feature-flags-react-client

A React client for feature flags built on OpenFeature standard with TypeScript support.

## Installation

```bash
npm install @leancodepl/feature-flags-react-client
# or
yarn add @leancodepl/feature-flags-react-client
```

## Overview

This package provides a type-safe React client for feature flags using the OpenFeature standard. It supports any OpenFeature-compatible provider and includes React hooks for easy integration.

## API

### `mkFeatureFlags<TFlags extends Flags>(flags: TFlags, provider: Provider): FeatureFlagsClient<TFlags>`

Creates a feature flags client with type-safe hooks and provider.

**Parameters:**
- `flags`: Feature flags configuration object
- `provider`: OpenFeature provider instance

**Returns:** Object with `{ useFeatureFlag, FeatureFlagsProvider }`

### `useFeatureFlag<TKey extends keyof TFlags>(key: TKey, defaultValue?: TFlags[TKey]['defaultValue']): FlagEvaluationDetails<TFlags[TKey]['defaultValue']>`

React hook for accessing feature flag values.

**Parameters:**
- `key`: Feature flag key
- `defaultValue`: Optional default value override

**Returns:** Flag evaluation details with `{ value, reason, variant, flagMetadata }`

### `FeatureFlagsProvider: React.ComponentType<PropsWithChildren>`

React context provider for feature flags.

**Parameters:**
- `children`: React children

**Returns:** Provider component

## TypeScript Types

- `Flags<TKeys, TFlag>` - Generic flags configuration type
- `FeatureFlagConfig` - Configuration for individual flag

## Usage Examples

### Basic Setup with ConfigCat

```typescript
import { mkFeatureFlags, Flags } from '@leancodepl/feature-flags-react-client';
import { ConfigCatWebProvider } from '@openfeature/config-cat-web-provider';

// Define feature flags with types
const featureFlags = {
  enableNewDashboard: {
    defaultValue: false,
  },
  maxRetries: {
    defaultValue: 3,
  },
  theme: {
    defaultValue: 'light' as 'light' | 'dark',
  },
} as const satisfies Flags;

// Create provider
const provider = ConfigCatWebProvider.create('<your-sdk-key>');

// Generate typed hooks and provider
export const { FeatureFlagsProvider, useFeatureFlag } = mkFeatureFlags(
  featureFlags,
  provider
);
```

### App Setup

```typescript
root.render(
  <FeatureFlagsProvider>
    <App />
  </FeatureFlagsProvider>
);
```

### Using Feature Flags in Components

```typescript
import React from 'react';
import { useFeatureFlag } from './featureFlags';

function Dashboard() {
  // Boolean flag
  const { value: isNewDashboardEnabled } = useFeatureFlag('enableNewDashboard');
  
  // Number flag with override
  const { value: retryCount } = useFeatureFlag('maxRetries', 5);
  
  // String flag with full details
  const {
    value: theme,
    reason,
    variant,
    flagMetadata,
  } = useFeatureFlag('theme');

  return (
    <div className={`dashboard theme-${theme}`}>
      {isNewDashboardEnabled ? (
        <NewDashboard />
      ) : (
        <LegacyDashboard />
      )}
      <div>Max retries: {retryCount}</div>
      <div>Theme reason: {reason}</div>
    </div>
  );
}
```

### Error Handling

```typescript
function SafeFeatureFlag() {
  const { value: isEnabled, reason } = useFeatureFlag('enableNewDashboard');

  // Handle evaluation errors
  if (reason === 'ERROR') {
    console.warn('Feature flag evaluation failed, using default');
    return <LegacyDashboard />;
  }

  return isEnabled ? <NewDashboard /> : <LegacyDashboard />;
}
```

## Dependencies

- `@openfeature/core`: OpenFeature core library
- `@openfeature/react-sdk`: OpenFeature React SDK
- `@openfeature/web-sdk`: OpenFeature Web SDK
