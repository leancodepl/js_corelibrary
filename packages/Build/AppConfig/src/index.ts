import { Configure, EnvironmentContext } from "@leancode/build-base";
import HtmlWebpackIncludeAssetsPlugin from "html-webpack-include-assets-plugin";

export default function appConfig<TInCtx extends EnvironmentContext>(
    configFile: (env: "production" | "development") => string,
): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.plugins = ctx.config.plugins || [];
        ctx.config.resolve = ctx.config.resolve || {};
        ctx.config.resolve.alias = ctx.config.resolve.alias || {};

        if (ctx.isProduction) {
            ctx.config.plugins.push(
                new HtmlWebpackIncludeAssetsPlugin({
                    assets: ["config.js"],
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
