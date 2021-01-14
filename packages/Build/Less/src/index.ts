import { Configure, EnvironmentContext } from "@leancode/build-base";
import { CssContext } from "@leancode/build-css";

type RuleSetLoaderOptions = string | { [index: string]: any };

export default function less<TInCtx extends CssContext & EnvironmentContext>(
    options?: RuleSetLoaderOptions,
): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.module ??= {};
        ctx.config.module.rules ??= [];

        ctx.config.module.rules.push({
            test: /\.less$/,
            oneOf: [
                {
                    resourceQuery: /global/,
                    use: [
                        ...ctx.styleLoader({
                            additionalLoaders: 1,
                            dontUseCssModules: true,
                            dontUseTypescript: ctx.isProduction, // there is a problem with verify mode in node_modules
                        }),
                        {
                            loader: "less-loader",
                            options,
                        },
                    ],
                },
                {
                    use: [
                        ...ctx.styleLoader({
                            additionalLoaders: 1,
                            dontUseTypescript: ctx.isProduction, // there is a problem with verify mode in node_modules
                        }),
                        {
                            loader: "less-loader",
                            options,
                        },
                    ],
                },
            ],
        });

        return ctx;
    };
}
