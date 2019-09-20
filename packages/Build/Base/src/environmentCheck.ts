import { BaseContext, Configure } from "./configure";

export interface EnvironmentContext extends BaseContext {
    isProduction: boolean;
}

export function environmentCheck<TInCtx extends BaseContext>(): Configure<TInCtx, TInCtx & EnvironmentContext> {
    return ctx => {
        return {
            ...ctx,
            isProduction: ctx.argv.mode == "production",
        };
    };
}
