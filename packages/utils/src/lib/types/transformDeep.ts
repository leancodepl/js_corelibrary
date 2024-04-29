import type { ApiDateOnly, ApiDateTimeOffset, ApiTimeOnly, ApiTimeSpan } from "@leancodepl/api-date";

export type Mode = "capitalize" | "uncapitalize";

export type TransformDeep<T, TMode extends Mode> =
    T extends Array<infer TArrayElement>
        ? Array<TransformDeep<TArrayElement, TMode>>
        : T extends object
          ? T extends ApiDateOnly | ApiDateTimeOffset | ApiTimeOnly | ApiTimeSpan
              ? T
              : {
                    [TKey in keyof T as TKey extends string
                        ? TMode extends "uncapitalize"
                            ? Uncapitalize<TKey>
                            : Capitalize<TKey>
                        : TKey]: TransformDeep<T[TKey], TMode>;
                }
          : T extends null
            ? undefined
            : T;

export type UncapitalizeDeep<T> = TransformDeep<T, "uncapitalize">;
export type CapitalizeDeep<T> = TransformDeep<T, "capitalize">;

export type MutableDeep<T> = T extends Date | bigint | boolean | number | string | symbol | null | undefined
    ? T
    : T extends ReadonlyArray<infer ArrayType>
      ? Array<MutableDeep<ArrayType>>
      : {
            -readonly [K in keyof T]: MutableDeep<T[K]>;
        };
