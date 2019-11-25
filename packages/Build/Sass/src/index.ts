import { Configure } from "@leancode/build-base/configure";
import { EnvironmentContext } from "@leancode/build-base/environment";
import { CssContext } from "@leancode/build-css";
import webpack from "webpack";

export default function sass<TInCtx extends CssContext & EnvironmentContext>(
    globalResources: string[],
): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.module = ctx.config.module || { rules: [] };

        const additionalLoaders: webpack.Loader[] = ["sass-loader"];

        if (globalResources.length) {
            additionalLoaders.push({
                loader: "sass-resources-loader",
                options: {
                    sourceMap: !ctx.isProduction,
                    resources: globalResources,
                },
            });
        }

        ctx.config.module.rules.push({
            test: /\.(sass|scss)$/,
            oneOf: [
                {
                    resourceQuery: /global/,
                    use: [
                        ...ctx.styleLoader({
                            additionalLoaders: additionalLoaders.length,
                            dontUseCssModules: true,
                            dontUseTypescript: ctx.isProduction,
                        }),
                        ...additionalLoaders,
                    ]
                },
                {
                    use: [
                        ...ctx.styleLoader({
                            additionalLoaders: additionalLoaders.length,
                            dontUseCssModules: false,
                            dontUseTypescript: ctx.isProduction,
                        }),
                        ...additionalLoaders,
                    ]
                }
            ],
        });

        return ctx;
    };
}
