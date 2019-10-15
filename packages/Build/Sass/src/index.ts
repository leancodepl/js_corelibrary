import { Configure } from "@leancode/build-base/configure";
import { EnvironmentContext } from "@leancode/build-base/environment";
import { CssContext } from "@leancode/build-css";

export default function sass<TInCtx extends CssContext & EnvironmentContext>(
    globalResources: string[],
): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.module = ctx.config.module || { rules: [] };

        ctx.config.module.rules.push({
            test: /\.(sass|scss)$/,
            use: [
                ...ctx.styleLoader({
                    additionalLoaders: 2,
                    dontUseTypescript: ctx.isProduction, // there is a problem with verify in node_modules
                }),
                "sass-loader",
                {
                    loader: "sass-resources-loader",
                    options: {
                        sourceMap: !ctx.isProduction,
                        resources: globalResources,
                    },
                },
            ],
        });

        return ctx;
    };
}
