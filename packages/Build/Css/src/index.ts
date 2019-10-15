import { BaseContext, Configure } from "@leancode/build-base/configure";
import { EnvironmentContext } from "@leancode/build-base/environment";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

type WebpackLoader = import("webpack").Loader;

export type StyleLoaderParams = {
    additionalLoaders: number;
    dontUseCssModules?: boolean;
    dontUseTypescript?: boolean;
};
export interface CssContext extends BaseContext {
    styleLoader: (params: StyleLoaderParams) => WebpackLoader[];
}

export default function css<TInCtx extends EnvironmentContext>(): Configure<TInCtx, TInCtx & CssContext> {
    function styleLoader({
        additionalLoaders,
        isProd,
        dontUseCssModules,
        dontUseTypescript,
    }: StyleLoaderParams & { isProd: boolean }) {
        let loaders: WebpackLoader[];
        let postCssPlugins: any[] = [];
        let cssLoaderOptions: any = {};

        if (isProd) {
            loaders = [MiniCssExtractPlugin.loader];

            if (!dontUseTypescript) {
                loaders.push({
                    loader: "css-modules-typescript-loader",
                    options: {
                        mode: "verify",
                    },
                });
            }

            cssLoaderOptions = {
                modules: {
                    localIdentName: "[hash:base64:20]",
                    mode: dontUseCssModules ? "global" : "local",
                },
            };
            postCssPlugins = [
                require("cssnano")({
                    preset: "default",
                }),
            ];
        } else {
            loaders = ["style-loader"];

            if (!dontUseTypescript) {
                loaders.push({
                    loader: "css-modules-typescript-loader",
                    options: {
                        mode: "emit",
                    },
                });
            }

            cssLoaderOptions = {
                modules: {
                    localIdentName: "[folder]__[name]__[local]",
                    mode: dontUseCssModules ? "global" : "local",
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
                    use: styleLoader({
                        additionalLoaders: 0,
                        isProd: ctx.isProduction,
                        dontUseCssModules: true,
                        dontUseTypescript: true,
                    }),
                },
                {
                    use: styleLoader({ additionalLoaders: 0, isProd: ctx.isProduction }),
                },
            ],
        });

        return {
            ...ctx,
            styleLoader: ({ additionalLoaders, dontUseCssModules, dontUseTypescript }: StyleLoaderParams) =>
                styleLoader({ additionalLoaders, isProd: ctx.isProduction, dontUseCssModules, dontUseTypescript }),
        };
    };
}
