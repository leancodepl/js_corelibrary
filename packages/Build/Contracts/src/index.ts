import { Configure } from "@leancode/build-base/configure";
import { EnvironmentContext } from "@leancode/build-base/environment";
import webpack from "webpack";

export default function contracts<TInCtx extends EnvironmentContext>(
    name: string,
    client: string,
): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.plugins = ctx.config.plugins || [];
        ctx.config.resolve = ctx.config.resolve || {};
        ctx.config.resolve.alias = ctx.config.resolve.alias || {};

        ctx.config.plugins.push(
            new webpack.ProvidePlugin({
                [name]: [name, "globals"],
            }),
        );

        ctx.config.resolve.alias = {
            ...ctx.config.resolve.alias,
            [name]: client,
        };

        return ctx;
    };
}
