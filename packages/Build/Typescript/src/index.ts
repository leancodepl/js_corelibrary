import { Configure, EnvironmentContext } from "@leancode/build-base";
import ForkTsCheckerPlugin from "fork-ts-checker-webpack-plugin";
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin";

export interface BabelContext {
    babelPresets: any[];
    babelPlugins: any[];
}

export default function typescript<TInCtx extends EnvironmentContext>(
    tsConfig: string,
    ...src: string[]
): Configure<TInCtx, TInCtx & BabelContext> {
    return ctx => {
        ctx.config.plugins = ctx.config.plugins || [];
        ctx.config.module = ctx.config.module || { rules: [] };
        ctx.config.resolve = ctx.config.resolve || {};
        ctx.config.resolve.alias = ctx.config.resolve.alias || {};
        ctx.config.resolve.extensions = ctx.config.resolve.extensions || [];
        ctx.config.resolve.plugins = ctx.config.resolve.plugins || [];

        ctx.config.plugins.push(
            new ForkTsCheckerPlugin({
                checkSyntacticErrors: true,
                tsconfig: tsConfig,
                useTypescriptIncrementalApi: !ctx.isProduction,
                async: !ctx.isProduction,
            }),
        );

        const babelPresets: any[] = [
            "@babel/react",
            "@babel/typescript",
            [
                "@babel/env",
                {
                    modules: false,
                    useBuiltIns: "usage",
                    corejs: 3,
                    targets: "cover 99.5% in PL",
                },
            ],
        ];

        const babelPlugins: any[] = [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            "@babel/plugin-proposal-nullish-coalescing-operator",
            "@babel/plugin-proposal-optional-chaining",
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-syntax-dynamic-import",
            [
                "const-enum",
                {
                    transform: "removeConst",
                },
            ],
        ];

        ctx.config.module.rules.push(
            {
                test: /\.[jt]sx?$/,
                enforce: "pre",
                exclude: /node_modules/,
                loader: "eslint-loader",
            },
            {
                test: /\.tsx?$/,
                include: src,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            babelrc: false,
                            sourceMaps: true,
                            presets: babelPresets,
                            plugins: babelPlugins,
                        },
                    },
                ],
            },
        );

        ctx.config.resolve.extensions.push(".ts", ".tsx");
        ctx.config.resolve.alias = {
            ...ctx.config.resolve.alias,
        };
        if (process && process.env) {
            delete process.env.TS_NODE_PROJECT;
        }
        if (ctx && ctx.env) {
            delete ctx.env.TS_NODE_PROJECT;
        }
        ctx.config.resolve.plugins.push(new TsConfigPathsPlugin({ configFile: tsConfig }));

        return {
            ...ctx,
            babelPresets,
            babelPlugins,
        };
    };
}
