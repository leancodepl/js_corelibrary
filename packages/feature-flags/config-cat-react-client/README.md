# @leancodepl/config-cat-react-client

## Usage

Create feature flags config:

```
export const { FeatureFlagsProvider, configureFeatureFlags, useFeatureFlag } = mkFeatureFlags({
    firstFeatureFlag: {
        type: FeatureFlagType.Boolean,
        override: true,
    },
}, {
    applyOverrides: false,
})
```

Configure OpenFeature, this have to be called on the top level of the app:

```
configureFeatureFlags("<sdk-key>")
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
