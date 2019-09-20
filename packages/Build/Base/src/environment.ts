import { BaseContext, Configure } from "./configure";
import webpack = require("webpack");

export interface EnvironmentContext extends BaseContext {
    isProduction: boolean;
}

export default function environment<TInCtx extends BaseContext>(
    env?: (isProduction: boolean) => string[] | { [key: string]: any },
): Configure<TInCtx, TInCtx & EnvironmentContext> {
    return ctx => {
        const isProduction = ctx.argv.mode == "production";

        if (env) {
            ctx.config.plugins = ctx.config.plugins || [];

            ctx.config.plugins.push(new webpack.EnvironmentPlugin(env(isProduction)));
        }

        return {
            ...ctx,
            isProduction,
        };
    };
}
