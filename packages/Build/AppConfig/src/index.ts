import { Configure, EnvironmentContext } from "@leancode/build-base";
import HtmlWebpackTagsPlugin from "html-webpack-tags-plugin";

export default function appConfig<TInCtx extends EnvironmentContext>(
    configFile: (env: "production" | "development") => string,
): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.plugins = ctx.config.plugins || [];
        ctx.config.resolve = ctx.config.resolve || {};
        ctx.config.resolve.alias = ctx.config.resolve.alias || {};

        if (ctx.isProduction) {
            ctx.config.plugins.push(
                new HtmlWebpackTagsPlugin({
                    tags: ["config.js"],
                    append: false,
                }),
            );
        }

        ctx.config.resolve.alias = {
            ...ctx.config.resolve.alias,
            config: configFile(ctx.isProduction ? "production" : "development"),
        };

        return ctx;
    };
}
