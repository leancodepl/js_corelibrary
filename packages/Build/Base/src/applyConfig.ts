import { BaseContext, ConfigFunc, Configure } from "./configure";

export function applyConfig<TCtx1>(config1: Configure<BaseContext, TCtx1>): ConfigFunc;
export function applyConfig<TCtx1, TCtx2>(
    config1: Configure<BaseContext, TCtx1>,
    config2: Configure<TCtx1, TCtx2>,
): ConfigFunc;
export function applyConfig<TCtx1, TCtx2, TCtx3>(
    config1: Configure<BaseContext, TCtx1>,
    config2: Configure<TCtx1, TCtx2>,
    config3: Configure<TCtx2, TCtx3>,
): ConfigFunc;
export function applyConfig<TCtx1, TCtx2, TCtx3, TCtx4>(
    config1: Configure<BaseContext, TCtx1>,
    config2: Configure<TCtx1, TCtx2>,
    config3: Configure<TCtx2, TCtx3>,
    config4: Configure<TCtx3, TCtx4>,
): ConfigFunc;
export function applyConfig<TCtx1, TCtx2, TCtx3, TCtx4, TCtx5>(
    config1: Configure<BaseContext, TCtx1>,
    config2: Configure<TCtx1, TCtx2>,
    config3: Configure<TCtx2, TCtx3>,
    config4: Configure<TCtx3, TCtx4>,
    config5: Configure<TCtx4, TCtx5>,
): ConfigFunc;
export function applyConfig<TCtx1, TCtx2, TCtx3, TCtx4, TCtx5, TCtx6>(
    config1: Configure<BaseContext, TCtx1>,
    config2: Configure<TCtx1, TCtx2>,
    config3: Configure<TCtx2, TCtx3>,
    config4: Configure<TCtx3, TCtx4>,
    config5: Configure<TCtx4, TCtx5>,
    config6: Configure<TCtx5, TCtx6>,
): ConfigFunc;
export function applyConfig<TCtx1, TCtx2, TCtx3, TCtx4, TCtx5, TCtx6, TCtx7>(
    config1: Configure<BaseContext, TCtx1>,
    config2: Configure<TCtx1, TCtx2>,
    config3: Configure<TCtx2, TCtx3>,
    config4: Configure<TCtx3, TCtx4>,
    config5: Configure<TCtx4, TCtx5>,
    config6: Configure<TCtx5, TCtx6>,
    config7: Configure<TCtx6, TCtx7>,
): ConfigFunc;
export function applyConfig<TCtx1, TCtx2, TCtx3, TCtx4, TCtx5, TCtx6, TCtx7, TCtx8>(
    config1: Configure<BaseContext, TCtx1>,
    config2: Configure<TCtx1, TCtx2>,
    config3: Configure<TCtx2, TCtx3>,
    config4: Configure<TCtx3, TCtx4>,
    config5: Configure<TCtx4, TCtx5>,
    config6: Configure<TCtx5, TCtx6>,
    config7: Configure<TCtx6, TCtx7>,
    config8: Configure<TCtx7, TCtx8>,
): ConfigFunc;
export function applyConfig<TCtx1, TCtx2, TCtx3, TCtx4, TCtx5, TCtx6, TCtx7, TCtx8, TCtx9>(
    config1: Configure<BaseContext, TCtx1>,
    config2: Configure<TCtx1, TCtx2>,
    config3: Configure<TCtx2, TCtx3>,
    config4: Configure<TCtx3, TCtx4>,
    config5: Configure<TCtx4, TCtx5>,
    config6: Configure<TCtx5, TCtx6>,
    config7: Configure<TCtx6, TCtx7>,
    config8: Configure<TCtx7, TCtx8>,
    config9: Configure<TCtx8, TCtx9>,
): ConfigFunc;
export function applyConfig<TCtx1, TCtx2, TCtx3, TCtx4, TCtx5, TCtx6, TCtx7, TCtx8, TCtx9, TCtx10>(
    config1: Configure<BaseContext, TCtx1>,
    config2: Configure<TCtx1, TCtx2>,
    config3: Configure<TCtx2, TCtx3>,
    config4: Configure<TCtx3, TCtx4>,
    config5: Configure<TCtx4, TCtx5>,
    config6: Configure<TCtx5, TCtx6>,
    config7: Configure<TCtx6, TCtx7>,
    config8: Configure<TCtx7, TCtx8>,
    config9: Configure<TCtx8, TCtx9>,
    config10: Configure<TCtx9, TCtx10>,
): ConfigFunc;
export function applyConfig<TCtx1, TCtx2, TCtx3, TCtx4, TCtx5, TCtx6, TCtx7, TCtx8, TCtx9, TCtx10, TCtx11>(
    config1: Configure<BaseContext, TCtx1>,
    config2: Configure<TCtx1, TCtx2>,
    config3: Configure<TCtx2, TCtx3>,
    config4: Configure<TCtx3, TCtx4>,
    config5: Configure<TCtx4, TCtx5>,
    config6: Configure<TCtx5, TCtx6>,
    config7: Configure<TCtx6, TCtx7>,
    config8: Configure<TCtx7, TCtx8>,
    config9: Configure<TCtx8, TCtx9>,
    config10: Configure<TCtx9, TCtx10>,
    config11: Configure<TCtx10, TCtx11>,
): ConfigFunc;
export function applyConfig<TCtx1, TCtx2, TCtx3, TCtx4, TCtx5, TCtx6, TCtx7, TCtx8, TCtx9, TCtx10, TCtx11, TCtx12>(
    config1: Configure<BaseContext, TCtx1>,
    config2: Configure<TCtx1, TCtx2>,
    config3: Configure<TCtx2, TCtx3>,
    config4: Configure<TCtx3, TCtx4>,
    config5: Configure<TCtx4, TCtx5>,
    config6: Configure<TCtx5, TCtx6>,
    config7: Configure<TCtx6, TCtx7>,
    config8: Configure<TCtx7, TCtx8>,
    config9: Configure<TCtx8, TCtx9>,
    config10: Configure<TCtx9, TCtx10>,
    config11: Configure<TCtx10, TCtx11>,
    config12: Configure<TCtx11, TCtx12>,
): ConfigFunc;
export function applyConfig<
    TCtx1,
    TCtx2,
    TCtx3,
    TCtx4,
    TCtx5,
    TCtx6,
    TCtx7,
    TCtx8,
    TCtx9,
    TCtx10,
    TCtx11,
    TCtx12,
    TCtx13
>(
    config1: Configure<BaseContext, TCtx1>,
    config2: Configure<TCtx1, TCtx2>,
    config3: Configure<TCtx2, TCtx3>,
    config4: Configure<TCtx3, TCtx4>,
    config5: Configure<TCtx4, TCtx5>,
    config6: Configure<TCtx5, TCtx6>,
    config7: Configure<TCtx6, TCtx7>,
    config8: Configure<TCtx7, TCtx8>,
    config9: Configure<TCtx8, TCtx9>,
    config10: Configure<TCtx9, TCtx10>,
    config11: Configure<TCtx10, TCtx11>,
    config12: Configure<TCtx11, TCtx12>,
    config13: Configure<TCtx12, TCtx13>,
): ConfigFunc;
export function applyConfig(...alters: Configure<any, any>[]): ConfigFunc {
    return (env: any, argv: any) =>
        alters.reduce((ctx, config) => config(ctx), {
            env,
            argv,
            config: {},
        }).config;
}
