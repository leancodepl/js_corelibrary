import { Configure } from "@leancode/build-base/configure";
import { EnvironmentContext } from "@leancode/build-base/environment";
import { CssContext } from "@leancode/build-css";

export default function less<TInCtx extends CssContext & EnvironmentContext>(options?: {}): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.module = ctx.config.module || { rules: [] };

        ctx.config.module.rules.push({
            test: /\.less$/,
            oneOf: [
                {
                    resourceQuery: /global/,
                    use: [
                        ...ctx.styleLoader(1, false),
                        {
                            loader: "less-loader",
                            options,
                        },
                    ],
                },
                {
                    use: [
                        ...ctx.styleLoader(1, true),
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
