import { OpenFeatureProvider, useFlag } from "@openfeature/react-sdk"
import { OpenFeature, Provider } from "@openfeature/web-sdk"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FeatureFlagConfig = { defaultValue: any }
export type Flags<TKeys extends string = string, TFlag extends FeatureFlagConfig = FeatureFlagConfig> = Record<
    TKeys,
    TFlag
>

export function mkFeatureFlags<TFlags extends Flags>(flags: TFlags, provider: Provider) {
    OpenFeature.setProvider(provider)

    return {
        useFeatureFlag: <TKey extends keyof TFlags>(key: TKey, defaultValue?: TFlags[TKey]["defaultValue"]) =>
            useFlag<TFlags[TKey]["defaultValue"]>(key.toString(), defaultValue ?? flags[key].defaultValue),
        FeatureFlagsProvider: OpenFeatureProvider,
    }
}
