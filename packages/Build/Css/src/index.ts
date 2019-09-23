import { BaseContext, Configure } from "@leancode/build-base/configure";
import { EnvironmentContext } from "@leancode/build-base/environment";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

type WebpackLoader = import("webpack").Loader;

export interface CssContext extends BaseContext {
    styleLoader: (additionalLoaders: number, useCssModules?: boolean) => WebpackLoader[];
}

export default function css<TInCtx extends EnvironmentContext>(): Configure<TInCtx, TInCtx & CssContext> {
    function styleLoader(additionalLoaders: number, isProd: boolean, useCssModules: boolean = true) {
        let loaders: WebpackLoader[];
        let postCssPlugins: any[] = [];
        let cssLoaderOptions: any = {};

        if (isProd) {
            loaders = [
                MiniCssExtractPlugin.loader,
                {
                    loader: "css-modules-typescript-loader",
                    options: {
                        mode: "verify",
                    },
                },
            ];
            cssLoaderOptions = {
                modules: {
                    localIdentName: "[hash:base64:20]",
                    mode: useCssModules ? "local" : "global",
                },
            };
            postCssPlugins = [
                require("cssnano")({
                    preset: "default",
                }),
            ];
        } else {
            loaders = [
                "style-loader",
                {
                    loader: "css-modules-typescript-loader",
                    options: {
                        mode: "emit",
                    },
                },
            ];
            cssLoaderOptions = {
                modules: {
                    localIdentName: "[folder]__[name]__[local]",
                    mode: useCssModules ? "local" : "global",
                },
                sourceMap: true,
            };
        }

        loaders = [
            ...loaders,
            {
                loader: "css-loader",
                options: {
                    importLoaders: 1 + additionalLoaders,
                    ...cssLoaderOptions,
                },
            },
            {
                loader: "postcss-loader",
                options: {
                    ident: "postcss",
                    plugins: () => [require("autoprefixer"), ...postCssPlugins],
                },
            },
        ];

        return loaders;
    }

    return ctx => {
        ctx.config.plugins = ctx.config.plugins || [];
        ctx.config.module = ctx.config.module || { rules: [] };

        if (ctx.isProduction) {
            ctx.config.plugins.push(
                new MiniCssExtractPlugin({
                    filename: "[name].css",
                    chunkFilename: "[id].css",
                }),
            );
        }

        ctx.config.module.rules.push({
            test: /\.css$/,
            oneOf: [
                {
                    resourceQuery: /global/,
                    use: styleLoader(0, ctx.isProduction, false),
                },
                {
                    use: styleLoader(0, ctx.isProduction, false),
                },
            ],
        });

        return {
            ...ctx,
            styleLoader: (additionalLoaders, useCssModules) =>
                styleLoader(additionalLoaders, ctx.isProduction, useCssModules),
        };
    };
}
