import { BaseContext, Configure } from "@leancode/build-base";

export default function staticFiles<TInCtx extends BaseContext>(): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.module ??= {};
        ctx.config.module.rules ??= [];

        ctx.config.module.rules.push(
            {
                test: /\.(ttf|eot|woff|woff2|otf)(\?[\s\S]+)?$/,
                loader: "file-loader",
                options: {
                    name: "static/fonts/[name].[contenthash].[ext]",
                },
            },
            {
                test: /\.(jpg|png|gif|pdf|csv)$/,
                loader: "file-loader",
                options: {
                    name: "static/media/[name].[contenthash].[ext]",
                },
            },
        );

        return ctx;
    };
}
