import { Configure, EnvironmentContext } from "@leancode/build-base";
import ForkTsCheckerPlugin from "fork-ts-checker-webpack-plugin";
import { CLIEngineOptions } from "fork-ts-checker-webpack-plugin/lib/eslint-reporter/types/eslint";
import path from "path";
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin";

export interface BabelContext {
    babelPresets: any[];
    babelPlugins: any[];
}

export type TypeScriptConfig = {
    tsConfig: string;
    src: string[];
    profile?: boolean;
    eslintOptions?: CLIEngineOptions;
};
export default function typescript<TInCtx extends EnvironmentContext>({
    tsConfig,
    src,
    profile,
    eslintOptions,
}: TypeScriptConfig): Configure<TInCtx, TInCtx & BabelContext> {
    return ctx => {
        ctx.config.plugins ??= [];
        ctx.config.module ??= {};
        ctx.config.module.rules ??= [];
        ctx.config.resolve ??= {};
        ctx.config.resolve.alias ??= {};
        ctx.config.resolve.extensions ??= [];
        ctx.config.resolve.plugins ??= [];

        ctx.config.plugins.push(
            new ForkTsCheckerPlugin({
                eslint: {
                    files: src.map(src => path.join(src, "**/*.{ts,tsx,js,jsx}")),
                    options: eslintOptions,
                },
                typescript: {
                    configFile: tsConfig,
                    mode: "write-references",
                    profile,
                },
                async: !ctx.isProduction,
            }),
        );

        const babelPresets: any[] = [
            [
                require.resolve("@babel/preset-react"),
                {
                    runtime: "automatic",
                },
            ],
            [
                require.resolve("@babel/preset-typescript"),
                {
                    onlyRemoveTypeImports: true,
                },
            ],
            [
                require.resolve("@babel/preset-env"),
                {
                    modules: false,
                    useBuiltIns: "usage",
                    corejs: 3,
                    targets: "cover 99.5% in PL",
                },
            ],
        ];

        const babelPlugins: any[] = [
            [require.resolve("@babel/plugin-proposal-decorators"), { legacy: true }],
            require.resolve("@babel/plugin-proposal-nullish-coalescing-operator"),
            require.resolve("@babel/plugin-proposal-optional-chaining"),
            require.resolve("@babel/plugin-proposal-class-properties"),
            require.resolve("@babel/plugin-syntax-dynamic-import"),
            [
                require.resolve("babel-plugin-const-enum"),
                {
                    transform: "removeConst",
                },
            ],
        ];

        ctx.config.module.rules.push(
            {
                test: /\.tsx?$/,
                include: src,
                use: [
                    {
                        loader: require.resolve("babel-loader"),
                        options: {
                            babelrc: false,
                            sourceMaps: true,
                            presets: babelPresets,
                            plugins: babelPlugins,
                        },
                    },
                ],
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
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

        if (!ctx.isProduction) {
            ctx.config.devtool = "eval-source-map";
        }

        return {
            ...ctx,
            babelPresets,
            babelPlugins,
        };
    };
}
