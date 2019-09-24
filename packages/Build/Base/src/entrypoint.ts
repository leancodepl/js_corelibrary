import { BaseContext, Configure } from "./configure";

export interface AppUrlContext extends BaseContext {
    appUrl: string;
}

export default function entrypoint<TInCtx extends BaseContext>(
    entrypoint: string,
    appUrl: string,
): Configure<TInCtx, TInCtx & AppUrlContext> {
    return ctx => {
        return {
            ...ctx,
            config: {
                ...ctx.config,
                entry: [
                    ctx.argv.inline && `webpack-dev-server/client?${appUrl}`,
                    ctx.argv.inline && "webpack/hot/only-dev-server",
                    entrypoint,
                ].filter(e => e),
                resolve: {
                    ...ctx.config.resolve,
                    extensions: [...((ctx.config.resolve || {}).extensions || []), ".js"],
                },
            },

            appUrl,
        };
    };
}
