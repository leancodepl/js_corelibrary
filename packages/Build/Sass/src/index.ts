import { Configure } from "@leancode/build-base/configure";
import { EnvironmentContext } from "@leancode/build-base/environment";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

type WebpackLoader = import("webpack").Loader;

export default function sass<TInCtx extends EnvironmentContext>(globalResources: string[]): Configure<TInCtx, TInCtx> {
    function styleLoader(isSass: boolean, isProd: boolean, useCssModules: boolean = true) {
        let loader: WebpackLoader[];
        let postCssPlugins: any[];
        let cssLoaderOptions: any;

        const sassAdditionalLoaders = isSass ? 2 : 0;

        if (isProd) {
            loader = [MiniCssExtractPlugin.loader];
            cssLoaderOptions = {
                importLoaders: 1 + sassAdditionalLoaders,
                modules: {
                    localIdentName: "[hash:base64:20]",
                    mode: useCssModules ? "local" : "global",
                },
            };
            postCssPlugins = [
                require("autoprefixer"),
                require("cssnano")({
                    preset: "default",
                }),
            ];
        } else {
            loader = [
                "style-loader",
                {
                    loader: "css-modules-typescript-loader",
                    options: {
                        mode: "emit",
                    },
                },
            ];
            cssLoaderOptions = {
                importLoaders: 1 + sassAdditionalLoaders,
                modules: {
                    localIdentName: "[folder]__[name]__[local]",
                    mode: useCssModules ? "local" : "global",
                },
                sourceMap: true,
            };
            postCssPlugins = [require("autoprefixer")];
        }

        loader = [
            ...loader,
            {
                loader: "css-loader",
                options: cssLoaderOptions,
            },
            {
                loader: "postcss-loader",
                options: {
                    ident: "postcss",
                    plugins: () => [...postCssPlugins],
                },
            },
        ];

        if (isSass) {
            loader = [
                ...loader,
                "sass-loader",
                {
                    loader: "sass-resources-loader",
                    options: {
                        sourceMap: !isProd,
                        resources: globalResources,
                    },
                },
            ];
        }

        return loader;
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

        ctx.config.module.rules.push(
            {
                test: /\.css$/,
                oneOf: [
                    {
                        resourceQuery: /global/,
                        use: styleLoader(false, ctx.isProduction, false),
                    },
                    {
                        use: styleLoader(false, ctx.isProduction, false),
                    },
                ],
            },
            {
                test: /\.(sass|scss)$/,
                use: styleLoader(true, ctx.isProduction),
            },
        );

        return ctx;
    };
}
