import { Configure, EnvironmentContext } from "@leancode/build-base";
import { parse } from "json2csv";
import { StatsWriterPlugin } from "webpack-stats-plugin";

export default function appConfig<TInCtx extends EnvironmentContext>(filename: string): Configure<TInCtx, TInCtx> {
    function transformStats(data: any) {
        const fields: any[] = [];
        const assets: any = {};

        for (const entrypoint in data.entrypoints) {
            for (const asset of data.entrypoints[entrypoint].assets) {
                fields.push(asset);
                assets[asset] = data.assets.find(a => a.name === asset).size;
            }
        }

        return parse([assets], { fields });
    }

    return ctx => {
        ctx.config.plugins = ctx.config.plugins || [];

        if (ctx.isProduction) {
            ctx.config.plugins.push(
                new StatsWriterPlugin({
                    fields: ["assets", "entrypoints"],
                    filename,
                    transform: transformStats,
                }),
            );
        }

        return ctx;
    };
}
