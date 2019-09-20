import { BaseContext, Configure } from "./configure";

export interface DeployContext extends BaseContext {
    deployDir: string;
}

export function deploy<TInCtx extends BaseContext>(deployDir: string): Configure<TInCtx, TInCtx & DeployContext> {
    return ctx => {
        ctx.config.output = ctx.config.output || {};

        ctx.config.output = {
            ...ctx.config.output,
            path: deployDir,
            filename: "[name].js",
            publicPath: "/",
        };

        return {
            ...ctx,
            deployDir,
        };
    };
}
