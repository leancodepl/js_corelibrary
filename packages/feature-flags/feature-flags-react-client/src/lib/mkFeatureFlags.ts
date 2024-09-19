import { FlagQuery, OpenFeatureProvider, useFlag } from "@openfeature/react-sdk"
import { OpenFeature, Provider } from "@openfeature/web-sdk"

export enum FeatureFlagType {
    Boolean = 0,
    String = 1,
    Int = 2,
    Double = 3,
}
export type FeatureFlagTypeMap = {
    [FeatureFlagType.Boolean]: boolean
    [FeatureFlagType.String]: string
    [FeatureFlagType.Int]: number
    [FeatureFlagType.Double]: number
}

type FlagPart<TType extends FeatureFlagType> = {
    type: TType
    defaultValue: FeatureFlagTypeMap[TType]
}
export type Flag =
    | FlagPart<FeatureFlagType.Boolean>
    | FlagPart<FeatureFlagType.Double>
    | FlagPart<FeatureFlagType.Int>
    | FlagPart<FeatureFlagType.String>

export type Flags<TKeys extends string = string, TFlag extends object = Flag> = Record<TKeys, TFlag>

export function mkFeatureFlags<TFlagKeys extends string, TFlags extends Flags<TFlagKeys>>(
    flags: TFlags,
    provider: Provider,
) {
    type TypeByKey<TKey extends keyof TFlags> = FeatureFlagTypeMap[TFlags[TKey]["type"]]

    return {
        configureFeatureFlagsProvider: () => {
            OpenFeature.setProvider(provider)
        },
        useFeatureFlag: <TKey extends keyof TFlags>(
            key: TKey,
            defaultValue?: TypeByKey<TKey>,
        ): FlagQuery<TypeByKey<TKey>> =>
            useFlag(key.toString(), defaultValue ?? flags[key].defaultValue) as FlagQuery<TypeByKey<TKey>>,
        FeatureFlagsProvider: OpenFeatureProvider,
    }
}
