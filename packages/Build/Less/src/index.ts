import { Configure } from "@leancode/build-base/configure";
import { EnvironmentContext } from "@leancode/build-base/environment";
import { CssContext } from "@leancode/build-css";

export default function less<TInCtx extends CssContext & EnvironmentContext>(options?: {}): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.module = ctx.config.module || { rules: [] };

        ctx.config.module.rules.push({
            test: /\.less$/,
            use: [
                ...ctx.styleLoader(2),
                {
                    loader: "less-loader",
                    options,
                },
            ],
        });

        return ctx;
    };
}
