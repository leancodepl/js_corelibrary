import { Configure } from "@leancode/build-base/configure";
import { EnvironmentContext } from "@leancode/build-base/environment";
import ForkTsCheckerPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";

export default function typescript<TInCtx extends EnvironmentContext>(
    tsConfig: string,
    src: string,
): Configure<TInCtx, TInCtx> {
    function extractTsAliases() {
        const mappings: { [key: string]: string } = {};
        const tsconfig = require(tsConfig);

        for (let key in tsconfig.compilerOptions.paths) {
            let to = tsconfig.compilerOptions.paths[key][0];
            let from = key;

            if (from.endsWith("/*")) {
                from = from.substr(0, from.length - 2);
            }

            if (to.endsWith("/*")) {
                to = to.substr(0, to.length - 2);
            }

            mappings[from] = path.join(src, to);
        }

        return mappings;
    }

    return ctx => {
        ctx.config.plugins = ctx.config.plugins || [];
        ctx.config.module = ctx.config.module || { rules: [] };
        ctx.config.resolve = ctx.config.resolve || {};
        ctx.config.resolve.alias = ctx.config.resolve.alias || {};
        ctx.config.resolve.extensions = ctx.config.resolve.extensions || [];

        ctx.config.plugins.push(
            new ForkTsCheckerPlugin({
                checkSyntacticErrors: true,
                tsconfig: tsConfig,
                useTypescriptIncrementalApi: !ctx.isProduction,
                workers: ctx.isProduction ? ForkTsCheckerPlugin.TWO_CPUS_FREE : ForkTsCheckerPlugin.ONE_CPU,
                async: !ctx.isProduction,
            }),
        );

        ctx.config.module.rules.push(
            {
                test: /\.[jt]sx?$/,
                enforce: "pre",
                exclude: /node_modules/,
                loader: "eslint-loader",
            },
            {
                test: /\.tsx?$/,
                include: [src],
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            babelrc: false,
                            sourceMaps: true,
                            presets: [
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
                            ],
                            plugins: [
                                "@babel/plugin-proposal-class-properties",
                                // isProd && "babel-plugin-jsx-remove-data-test-id",
                                "@babel/plugin-syntax-dynamic-import",
                            ].filter(p => p),
                        },
                    },
                    // isStorybook && "react-docgen-typescript-loader",
                ].filter(Boolean),
            },
        );

        ctx.config.resolve.extensions.push(".ts", ".tsx");
        ctx.config.resolve.alias = {
            ...ctx.config.resolve.alias,
            ...extractTsAliases(),
        };

        return ctx;
    };
}
