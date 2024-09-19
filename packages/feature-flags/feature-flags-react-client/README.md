# @leancodepl/feature-flags-react-client

## Usage

Create feature flags config, ConfigCat's provider is used as an example:

```
import { mkFeatureFlags, Flags } from "@leancodepl/feature-flags-react-client"
import { ConfigCatWebProvider } from "@openfeature/config-cat-web-provider";

const featureFlags = {
    firstFeatureFlag: {
        defaultValue: true,
    },
} as const satisfies Flags

const provider = ConfigCatWebProvider.create("<sdk-key>")

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

// with default value override
const { value } = useFeatureFlag("firstFeatureFlag", false)
```
