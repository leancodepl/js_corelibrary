import { UncapitalizeDeep } from "@leancodepl/utils"

export type NullableUncapitalizeDeep<T> = T extends null ? null : UncapitalizeDeep<T>
