# @leancodepl/feature-flags-react-client

## Usage

Create feature flags config:

```
const featureFlags = {
    firstFeatureFlag: {
        defaultValue: true,
    },
} as const satisfies Flags

export const { FeatureFlagsProvider, useFeatureFlag } = mkFeatureFlags(featureFlags, provider)
```

Wrap the app in the FeatureFlagsProvider:

```
root.render(
    <FeatureFlagsProvider>
        <App />
    </FeatureFlagsProvider>
)
```

Read flags using a hook inside your components:

```
const { value } = useFeatureFlag("firstFeatureFlag")
```
