import { OpenFeatureProvider, useFlag } from "@openfeature/react-sdk"
import { OpenFeature, Provider } from "@openfeature/web-sdk"

export type FeatureFlagConfig = { defaultValue: any }
export type Flags<TKeys extends string = string, TFlag extends FeatureFlagConfig = FeatureFlagConfig> = Record<
    TKeys,
    TFlag
>

/**
 * Creates React hooks for type-safe feature flag management using OpenFeature.
 * 
 * Sets up OpenFeature provider and returns typed hooks for feature flag evaluation.
 * Provides React context provider and hook for accessing feature flags in components.
 * 
 * @param flags - Feature flags configuration object with default values
 * @param provider - OpenFeature provider instance
 * @returns Object containing `useFeatureFlag` hook and `FeatureFlagsProvider` component
 * @example
 * ```typescript
 * const flags = { enableFeature: { defaultValue: false } };
 * const provider = new ConfigCatWebProvider('sdk-key');
 * const { useFeatureFlag, FeatureFlagsProvider } = mkFeatureFlags(flags, provider);
 * ```
 */
export function mkFeatureFlags<TFlags extends Flags>(flags: TFlags, provider: Provider) {
    OpenFeature.setProvider(provider)

    return {
        useFeatureFlag: <TKey extends keyof TFlags>(key: TKey, defaultValue?: TFlags[TKey]["defaultValue"]) =>
            useFlag<TFlags[TKey]["defaultValue"]>(key.toString(), defaultValue ?? flags[key].defaultValue),
        FeatureFlagsProvider: OpenFeatureProvider,
    }
}
