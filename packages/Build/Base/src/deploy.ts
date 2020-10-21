import { BaseContext, Configure } from "./configure";

export interface DeployContext extends BaseContext {
    deployDir: string;
}

export default function deploy<TInCtx extends BaseContext>(
    deployDir: string,
): Configure<TInCtx, TInCtx & DeployContext> {
    return ctx => {
        ctx.config.output = ctx.config.output || {};

        ctx.config.output = {
            ...ctx.config.output,
            path: deployDir,
            publicPath: "/",
        };

        return {
            ...ctx,
            deployDir,
        };
    };
}
