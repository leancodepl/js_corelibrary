import { BaseContext, Configure } from "@leancode/build-base";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default function html<TInCtx extends BaseContext>({
    favicon,
    ...htmlPluginOptions
}: {
    favicon?: string;
} & HtmlWebpackPlugin.Options): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.plugins = ctx.config.plugins || [];

        ctx.config.plugins.push(new HtmlWebpackPlugin(htmlPluginOptions));

        if (favicon) {
            ctx.config.plugins.push(new FaviconsWebpackPlugin(favicon));
        }

        return ctx;
    };
}
