import { BaseContext, Configure } from "@leancode/build-base";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";

export default function html<TInCtx extends BaseContext>({
    favicon,
    ...htmlPluginOptions
}: {
    favicon?: string;
} & HtmlWebpackPlugin.Options): Configure<TInCtx, TInCtx> {
    return ctx => {
        ctx.config.plugins = ctx.config.plugins || [];

        const p: webpack.WebpackPluginInstance = new HtmlWebpackPlugin(htmlPluginOptions);
        ctx.config.plugins.push(p);

        if (favicon) {
            ctx.config.plugins.push(new FaviconsWebpackPlugin(favicon));
        }

        return ctx;
    };
}
