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

export type Flag =
    | {
          type: FeatureFlagType.Boolean
          globalDefault: FeatureFlagTypeMap[FeatureFlagType.Boolean]
      }
    | {
          type: FeatureFlagType.Double
          globalDefault: FeatureFlagTypeMap[FeatureFlagType.Double]
      }
    | {
          type: FeatureFlagType.Int
          globalDefault: FeatureFlagTypeMap[FeatureFlagType.Int]
      }
    | {
          type: FeatureFlagType.String
          globalDefault: FeatureFlagTypeMap[FeatureFlagType.String]
      }

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
            useFlag(key.toString(), defaultValue ?? flags[key].globalDefault) as FlagQuery<TypeByKey<TKey>>,
        FeatureFlagsProvider: OpenFeatureProvider,
    }
}
