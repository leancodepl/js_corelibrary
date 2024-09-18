import { FlagQuery, OpenFeatureProvider, useFlag } from "@openfeature/react-sdk"
import { OpenFeature } from "@openfeature/web-sdk"
import { OptionsForPollingMode, OverrideBehaviour, PollingMode, createFlagOverridesFromMap } from "configcat-js"
import { ConfigCatProvider } from "./ConfigCatProvider"

export enum FeatureFlagType {
    Boolean = 0,
    String = 1,
    Int = 2,
    Double = 3,
}
type FeatureFlagTypeMap = {
    [FeatureFlagType.Boolean]: boolean
    [FeatureFlagType.String]: string
    [FeatureFlagType.Int]: number
    [FeatureFlagType.Double]: number
}

type Flag = {
    type: FeatureFlagType
    override?: FeatureFlagTypeMap[FeatureFlagType]
}

export function mkFeatureFlags<TFlagKeys extends string, TFlags extends Record<TFlagKeys, Flag>>(
    flags: TFlags,
    {
        applyOverrides,
    }: {
        applyOverrides: boolean
    },
) {
    return {
        configureFeatureFlags: (
            sdkKey: string,
            options?: Omit<OptionsForPollingMode<PollingMode.AutoPoll>, "flagOverrides">,
        ) => {
            OpenFeature.setProvider(
                ConfigCatProvider.create(sdkKey, {
                    ...options,
                    flagOverrides: applyOverrides
                        ? createFlagOverridesFromMap(
                              Object.fromEntries(
                                  Object.entries<Flag>(flags)
                                      .map(([key, { override }]) => [key, override])
                                      .filter(([, v]) => v !== undefined),
                              ),
                              OverrideBehaviour.LocalOnly,
                          )
                        : undefined,
                }),
            )
        },
        useFeatureFlag: <TKey extends keyof TFlags>(
            key: TKey,
            defaultValue?: FeatureFlagTypeMap[(typeof flags)[TKey]["type"]],
        ): FlagQuery<FeatureFlagTypeMap[(typeof flags)[TKey]["type"]]> =>
            useFlag(key.toString(), defaultValue ?? flags[key]) as FlagQuery<
                FeatureFlagTypeMap[(typeof flags)[TKey]["type"]]
            >,
        FeatureFlagsProvider: OpenFeatureProvider,
    }
}
