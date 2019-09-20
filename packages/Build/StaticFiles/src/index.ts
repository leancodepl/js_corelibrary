import { BaseContext, Configure } from "@leancode/build-base/configure";

export default function staticFiles<TInCtx extends BaseContext>(): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.module = ctx.config.module || { rules: [] };

        ctx.config.module.rules.push(
            {
                test: /\.(ttf|eot|woff|woff2)(\?[\s\S]+)?$/,
                loader: "file-loader",
                options: {
                    name: "fonts/[name].[ext]",
                },
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: "file-loader",
                options: {
                    name: "images/[name]-[hash:5].[ext]",
                },
            },
        );

        return ctx;
    };
}
