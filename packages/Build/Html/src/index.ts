import { BaseContext, Configure } from "@leancode/build-base/configure";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default function html<TInCtx extends BaseContext>(
    template: string,
    favicon?: string,
): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.plugins = ctx.config.plugins || [];

        ctx.config.plugins.push(
            new HtmlWebpackPlugin({
                template,
            }),
        );

        if (favicon) {
            ctx.config.plugins.push(new FaviconsWebpackPlugin(favicon));
        }

        return ctx;
    };
}
