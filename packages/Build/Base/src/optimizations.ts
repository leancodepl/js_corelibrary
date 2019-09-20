import { BaseContext, Configure } from "./configure";

export default function optimizations<TInCtx extends BaseContext>(): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.optimization = ctx.config.optimization || {};

        ctx.config.optimization = {
            ...ctx.config.optimization,
            splitChunks: {
                ...ctx.config.optimization.splitChunks,
                chunks: "all",
            },
        };

        return ctx;
    };
}
