# @leancodepl/feature-flags-react-client

## Usage

Create feature flags config:

```
const featureFlags = {
    firstFeatureFlag: {
        type: FeatureFlagType.Boolean,
        globalDefault: true,
    },
} as const satisfies Flags

export const { FeatureFlagsProvider, configureFeatureFlagsProvider, useFeatureFlag } = mkFeatureFlags(featureFlags, provider)
```

Configure OpenFeature, this have to be called on the top level of the app:

```
configureFeatureFlagsProvider("<sdk-key>")
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
